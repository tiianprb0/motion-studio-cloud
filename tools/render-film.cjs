// Alat render umum: <proj>/src/Film.tsx -> SVG -> canvas PNG -> ffmpeg (serial, CPU). Audio = <proj>/public/mix.wav.
// Film.tsx wajib mengekspor: Frame ({frame}), TOTAL, OUTRO, SHOTS, shotAt(f) -> {shot}. MIN_SHOT opsional (batas tetap 39 frame).
// Pakai: node tools/render-film.cjs <proj> --audit[=STEP]    -> anatomi, skala efektif ≤4,6, safe area, subtitle ≤7 kata, durasi shot, impor
//        node tools/render-film.cjs <proj> --stills=10,250   -> <proj>/04-Hasil/stills/frame-NNNN.png (--out=<folder> untuk tempat lain)
//        node tools/render-film.cjs <proj> --from=400 --to=600 --out=proof.mp4 (tanpa suara; --out boleh path absolut)
//        node tools/render-film.cjs <proj> --name=Judul      -> <proj>/04-Hasil/Judul.mp4 (audio dinormalisasi -14 LUFS / -1 dBTP) + Judul.lock.json, ACTIVE-WORKSPACE.json diperbarui
//        node tools/render-film.cjs <proj> --lock=Judul      -> hanya tulis Judul.lock.json (versi shared yang dipakai), tanpa render
//        node tools/render-film.cjs <proj> --entry=src/Storyboard.tsx --storyboard -> <proj>/02-Storyboard/panel-NN.png + Storyboard.jpg
//          Storyboard "awal → akhir": ekspor PHASES = 2 (frame 2p = awal, 2p+1 = akhir); lembar menampilkan pasangan.
//        node tools/render-film.cjs <proj> --motion[=STEP]   -> % waktu diam per shot (target ≤50%) + diam beruntun > 3 dtk; --strict = gagal bila lewat; --rinci = angka beda tiap sampel
//        node tools/render-film.cjs <proj> --sfx             -> src/sfx.json dari data-sfx komponen (pop/slide), lalu tools/mix_sfx.py
//          (Storyboard.tsx: satu frame = satu panel; ekspor Frame, TOTAL, SHOTS, shotAt. --audit juga bisa dipakai dengan --entry.)
// Seri Lirik (7 Nov 2026): proyek dengan 01-Brief/lagu.json dirender TANPA audio (lagu dipasang pengguna dari pustaka musik
//   platform saat unggah); timing dari src/lirik.json (tools/lirik_timeline.py). Kalau lagu.json punya "panduan" (file lagu
//   milik pengguna), render penuh juga membuat <Judul>-PREVIEW-lagu.mp4 untuk review sinkron saja (tidak diunggah).
// Logo: Film.tsx boleh mengekspor LOGO = 'terang' (logo krem untuk adegan gelap; bawaan logo asli).
// Kunci (lock): daftar sha256 setiap file yang ikut dibundel. tools/check-shared.cjs --locks menolak perubahan
// file shared/ yang sudah dipakai video terkirim; perubahan berikutnya harus jadi versi baru (vN+1).
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const ws = path.resolve(__dirname, '..');
const rt = require(path.join(ws, 'tools/runtime.cjs'));
const esbuild = require(path.join(rt.nodeModules(), 'esbuild'));
const A = require(path.join(ws, 'tools/audit-overlay.cjs'));
if (!process.argv[2] || process.argv[2].startsWith('--')) { console.error('Pakai: node tools/render-film.cjs <folder-proyek> [opsi]'); process.exit(1); }
const root = path.resolve(process.argv[2]);
const rel = (p) => path.relative(ws, p).split(path.sep).join('/');
const arg = (n) => { const a = process.argv.find((x) => x === `--${n}` || x.startsWith(`--${n}=`)); return a ? (a.includes('=') ? a.slice(a.indexOf('=') + 1) : true) : undefined; };
for (const n of ['out', 'name', 'entry', 'stills', 'from', 'to'])
  if (arg(n) === true) { console.error(`--${n} butuh nilai, mis. --${n}=${{ out: 'proof.mp4', name: 'Judul', entry: 'src/Storyboard.tsx', stills: '10,250', from: '400', to: '600' }[n]}`); process.exit(1); }
const ENTRY = String(arg('entry') || 'src/Film.tsx');
const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const LAGU = readJson(path.join(root, '01-Brief/lagu.json')); // seri Lirik
const LIRIK = readJson(path.join(root, 'src/lirik.json'));
const entry = `
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as F from './${ENTRY.replace(/\.tsx$/, '')}';
import {SVG_FONTS} from '${path.relative(root, path.join(ws, 'shared/assets/font-data/v1')).split(path.sep).join('/')}';
export const {TOTAL, OUTRO, SHOTS, shotAt} = F;
export const MIN_SHOT = F.MIN_SHOT;
export const PHASES = F.PHASES;
export const LOGO = F.LOGO;
export const raw = (f) => renderToStaticMarkup(React.createElement(F.Frame,{frame:f}));
export const frame = (f) => raw(f).replace(/<(rect|g)/,'<style>'+SVG_FONTS+'</style><$1');`;

function writeLock(name, inputs) {
  const files = {};
  for (const p of inputs.filter((x) => !x.startsWith('<') && !x.includes('node_modules/') && !x.endsWith('/entry.tsx')).sort())
    files[p] = crypto.createHash('sha256').update(fs.readFileSync(path.join(ws, p))).digest('hex');
  const out = path.join(root, '04-Hasil', `${name}.lock.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ project: rel(root), video: `${name}.mp4`, created: new Date().toISOString(), files }, null, 1));
  console.log(`kunci -> ${rel(out)} (${Object.keys(files).filter((p) => p.startsWith('shared/')).length} file shared)`);
}

// Seri Lirik: gabungkan master bisu dengan lagu panduan milik pengguna, hanya untuk review sinkron.
function previewLagu(out) {
  if (!LAGU.panduan) { console.log('seri Lirik: lagu.json tanpa "panduan", preview dengan lagu dilewati'); return; }
  const g = path.resolve(root, LAGU.panduan);
  if (!fs.existsSync(g)) { console.log(`peringatan: lagu panduan ${LAGU.panduan} tidak ditemukan; preview dengan lagu dilewati`); return; }
  const mulai = LIRIK ? LIRIK.mulai_lagu : LAGU.baris[0].t - (LAGU.lead ?? 0.5) + (LAGU.geser ?? 0);
  const prev = out.replace(/\.mp4$/, '-PREVIEW-lagu.mp4');
  const r = require('node:child_process').spawnSync(rt.ffmpeg(), ['-v', 'error', '-y', '-i', out, '-ss', String(mulai), '-i', g, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', prev]);
  if (r.status !== 0) throw new Error('ffmpeg gagal membuat preview lagu: ' + r.stderr);
  console.log(`preview dengan lagu panduan -> ${rel(prev)} (mulai ${mulai} dtk di lagu). HANYA untuk review, JANGAN diunggah.`);
}

function updateActive(name) {
  const f = path.join(ws, 'ACTIVE-WORKSPACE.json');
  let j = {};
  try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {}
  const parts = rel(root).split('/');
  // Perbaikan 8 Nov 2026: dulu `active` langsung ditimpa, sehingga video yang sudah disetujui (status diawali
  // "disetujui") hilang dari catatan bila belum dipindah manual (kasus Maaf v3). Sekarang dipindah ke `approved` dulu.
  const prev = j.active;
  if (prev && /^disetujui/i.test(String(prev.status || ''))) {
    j.approved = Array.isArray(j.approved) ? j.approved : [];
    if (!j.approved.some((x) => x.project === prev.project && x.version === prev.version && (x.output === prev.output || x.lock === prev.lock))) {
      j.approved.unshift({ ...prev, note: `dipindah otomatis dari "active" saat render ${rel(root)}/${name} (${new Date().toISOString().slice(0, 10)})` });
      console.log(`ACTIVE-WORKSPACE: ${prev.project} ${prev.version ?? ''} (disetujui) dipindah ke "approved"`);
    }
  } else if (prev && prev.output && prev.output !== rel(path.join(root, '04-Hasil', `${name}.mp4`)))
    console.log(`peringatan: ACTIVE-WORKSPACE "active" sebelumnya (${prev.output}) belum berstatus disetujui dan sekarang diganti`);
  j.updated = new Date().toISOString().slice(0, 10);
  j.active = {
    project: parts[1], version: /^v\d+$/.test(parts[2] || '') ? parts[2] : null, root: rel(root),
    film: rel(path.join(root, 'src/Film.tsx')), output: rel(path.join(root, '04-Hasil', `${name}.mp4`)),
    lock: rel(path.join(root, '04-Hasil', `${name}.lock.json`)), rendered: new Date().toISOString(),
    status: 'dirender, menunggu tinjauan pengguna (ubah manual setelah pengguna menyetujui)',
  };
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}

(async () => {
  const bundle = path.join(os.tmpdir(), `render-film-${process.pid}.cjs`);
  const built = await esbuild.build({ stdin: { contents: entry, resolveDir: root, loader: 'tsx', sourcefile: 'entry.tsx' }, absWorkingDir: ws, metafile: true, bundle: true, platform: 'node', format: 'cjs', outfile: bundle, logLevel: 'error', nodePaths: [rt.nodeModules()] });
  const inputs = Object.keys(built.metafile.inputs);
  const m = require(bundle);
  try {
    const lockOnly = arg('lock');
    if (lockOnly) { writeLock(lockOnly === true ? 'Film' : lockOnly, inputs); return; }
    const audit = arg('audit');
    if (audit) {
      const step = audit === true ? 3 : Number(audit);
      const seen = new Map(), warnings = [];
      const add = (k, f) => seen.set(k, [...(seen.get(k) || []), f]);
      const isFilm = ENTRY === 'src/Film.tsx'; // storyboard: satu frame = satu panel, durasi shot & subtitle belum berlaku
      if (isFilm) A.checkShots(m.SHOTS, m.OUTRO, m.MIN_SHOT, add);
      // Frame pertama = hook (7 Nov 2026): narasi mulai <= 0,3 dtk, subtitle tampil <= 0,3 dtk, tanpa salam pembuka,
      // tokoh tidak terlalu kecil di shot pertama.
      if (isFilm && LAGU) {
        // Seri Lirik (7 Nov 2026): hook visual di frame 0 dan vokal pertama <= 1 dtk; aturan narasi/subtitle <= 0,3 dtk tidak berlaku.
        if (!LIRIK) add('seri Lirik: src/lirik.json belum ada (python3 tools/lirik_timeline.py <proj>)', 0);
        else {
          const first = LIRIK.lines[0];
          if (first && first.start > 1.0) add(`pembuka: vokal pertama baru di ${first.start.toFixed(2)} dtk (> 1,0); kecilkan "lead" di lagu.json`, 0);
          if (LIRIK.lines.some((l) => !l.text)) warnings.push('seri Lirik: lirik.txt belum diisi lengkap, teks lirik di layar kosong');
          if (m.TOTAL !== LIRIK.total) warnings.push(`seri Lirik: TOTAL Film.tsx (${m.TOTAL}) beda dengan src/lirik.json (${LIRIK.total})`);
        }
        const o0 = A.openingInfo(m.raw(0));
        console.log(`pembuka (seri Lirik): skala tokoh terbesar di frame 0 = ${o0.maxScale.toFixed(2)}`);
        if (o0.maxScale && o0.maxScale < 2.4) warnings.push(`pembuka: tokoh terbesar di frame 0 berskala ${o0.maxScale.toFixed(2)}; hook visual sebaiknya sedang/close-up (skala >= 2,4)`);
      } else if (isFilm) {
        const tlFile = path.join(root, 'src/timeline.json');
        if (fs.existsSync(tlFile)) {
          const first = (JSON.parse(fs.readFileSync(tlFile, 'utf8')).lines || [])[0];
          if (first && first.start > 0.3) add(`pembuka: narasi baru mulai ${first.start.toFixed(2)} dtk (> 0,3); frame pertama harus langsung hook (narration_timeline --lead 0.15)`, 0);
          if (first && A.GREETING.test(first.text)) warnings.push(`pembuka: kalimat pertama berupa salam ("${first.text.slice(0, 40)}"); hook tanpa salam (references/pola-naskah.md)`);
        }
        const o = A.openingInfo(m.raw(9));
        if (!o.words) add('pembuka: belum ada kata subtitle di 0,3 dtk pertama; teks hook harus terlihat sejak awal', 9);
        const o0 = A.openingInfo(m.raw(0));
        console.log(`pembuka: skala tokoh terbesar di frame 0 = ${o0.maxScale.toFixed(2)}, kata subtitle di 0,3 dtk = ${o.words}`);
        if (o0.maxScale && o0.maxScale < 2.4) warnings.push(`pembuka: tokoh terbesar di frame 0 berskala ${o0.maxScale.toFixed(2)} (tokoh sekitar sepertiga tinggi layar); shot pertama sebaiknya sedang/close-up (skala >= 2,4)`);
      }
      A.checkInputs(inputs, rel(root), (msg) => add(msg, 0), (msg) => warnings.push(msg));
      A.checkProjectFiles(root, (msg) => warnings.push(msg));
      const cuesFile = path.join(root, 'src/cues.json');
      if (isFilm && fs.existsSync(cuesFile)) A.checkCues(JSON.parse(fs.readFileSync(cuesFile, 'utf8')), add);
      // Pengaman pose (7 Nov 2026): koordinat tangan wajib dari shared/characters/rig/v2/poses.ts, bukan dikarang di Film.tsx.
      fs.readFileSync(path.join(root, ENTRY), 'utf8').split('\n').forEach((ln, i) => {
        if (/\b(left|right)=\{\[\s*-?\d/.test(ln)) add(`pose dikarang di ${ENTRY} baris ${i + 1}: pakai {...POSE.<who>.<nama>}`, 0);
      });
      // Storyboard "awal → akhir" (7 Nov 2026): tiap panel wajib menunjukkan perubahan.
      if (!isFilm && m.PHASES === 2)
        for (let p = 0; p < m.TOTAL / 2; p++) if (m.raw(2 * p) === m.raw(2 * p + 1)) add(`panel ${p + 1}: awal dan akhir sama persis (satu kalimat, satu perubahan)`, 2 * p);
      // Kucing oranye callback (7 Nov 2026, butir 12 + koreksi pengguna): muncul minimal sekali di film/storyboard proyek.
      let kucing = false;
      for (let f = 0; f < m.TOTAL; f += step) {
        const svg = m.raw(f);
        if (!kucing && svg.includes('data-callback="kucing"')) kucing = true;
        A.checkFrameSvg(svg, (msg) => add(msg + ' [' + m.shotAt(f).shot + ']', f));
      }
      if (!kucing && (isFilm || /Storyboard/.test(ENTRY)) && rel(root).startsWith('projects/')) warnings.push('kucing oranye callback belum muncul (shared/characters/kucing/v1, kecil di latar; abaikan bila memang tidak cocok untuk video ini)');
      for (const w of warnings) console.log('peringatan: ' + w);
      if (!seen.size) console.log('audit: tidak ada temuan (' + Math.ceil(m.TOTAL / step) + ' frame)');
      for (const [k, v] of seen) console.log(`${k}  frame ${v[0]}–${v[v.length - 1]} (${v.length})`);
      process.exitCode = seen.size ? 1 : 0;
      return;
    }
    // Efek suara otomatis (7 Nov 2026; pengguna: tanpa musik, cukup pop dan slide dari ffmpeg):
    // komponen shared menulis data-sfx (pop/slide) + data-sfx-id; frame kemunculan pertama = waktu efek.
    if (arg('sfx') && LAGU) { console.log('seri Lirik: tanpa efek suara (master tanpa audio; lagu dari pustaka musik platform)'); return; }
    if (arg('sfx')) {
      const GAIN = { pop: -14, slide: -20, swish: -20, tick: -18, click: -11, pin: -15 };
      const seenIds = new Set(), events = [];
      for (let f = 0; f < m.TOTAL; f++) {
        for (const x of m.raw(f).matchAll(/data-sfx="(\w+)"[^>]*?data-sfx-id="([^"]+)"/g)) {
          if (seenIds.has(x[2])) continue;
          seenIds.add(x[2]);
          if (!events.some((e) => e.sfx === x[1] && Math.abs(e.frame - f) < 4)) events.push({ sfx: x[1], frame: f, db: GAIN[x[1]] ?? -16, dari: x[2] });
        }
      }
      const out = path.join(root, 'src/sfx.json');
      const target = fs.existsSync(out) && !arg('force') ? path.join(root, 'src/sfx.auto.json') : out;
      fs.writeFileSync(target, JSON.stringify(events, null, 1));
      console.log(`${events.length} efek -> ${rel(target)}${target !== out ? ' (src/sfx.json sudah ada; bandingkan lalu salin, atau pakai --force)' : ''}`);
      for (const e of events) console.log(`  ${String(e.frame).padStart(5)}  ${e.sfx.padEnd(6)} ${e.db} dB  ${e.dari}`);
      return;
    }
    const { chromium } = require(rt.playwrightPath());
    const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(ws, 'shared/assets/logo/less-certain-logo-v1.png')).toString('base64');
    const browser = await chromium.launch({ executablePath: rt.chrome(), headless: true, args: ['--disable-gpu'] });
    const page = await browser.newPage();
    await page.setContent('<canvas id="c" width="1080" height="1920"></canvas>');
    const draw = async (f) => {
      let svg = m.frame(f);
      // Logo terang (8 Nov 2026): Film.tsx boleh mengekspor LOGO = 'terang' untuk adegan gelap (logo krem, bayangan tipis).
      const terang = m.LOGO === 'terang';
      const logoFx = terang ? '<filter id="logo-terang"><feColorMatrix type="matrix" values="0 0 0 0 0.96 0 0 0 0 0.95 0 0 0 0 0.92 0 0 0 1 0"/><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>' : '';
      if (f < m.OUTRO - 12) svg = svg.replace(/<\/svg>$/, `${logoFx}<image href="${logo}" x="846" y="66" width="156" height="58" preserveAspectRatio="xMidYMid meet"${terang ? ' filter="url(#logo-terang)"' : ''}/></svg>`);
      const b64 = await page.evaluate(async (s) => {
        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
        await img.decode();
        const c = document.getElementById('c'), ctx = c.getContext('2d');
        ctx.clearRect(0, 0, 1080, 1920); ctx.drawImage(img, 0, 0, 1080, 1920);
        return c.toDataURL('image/png').split(',')[1];
      }, svg);
      return Buffer.from(b64, 'base64');
    };
    try {
      // Cek gerak (7 Nov 2026, "satu kalimat, satu perubahan"): sampel 2 fps, gambar kecil 36×64, beda rata-rata
      // RGB < 8 = diam (metode yang sama dengan perbandingan Kok Bisa?: 26–38% diam; video lama kita 66–88%).
      const motion = arg('motion');
      if (motion) {
        const step = motion === true ? 15 : Number(motion);
        await page.setContent('<canvas id="s" width="36" height="64"></canvas>');
        const small = async (f) => page.evaluate(async (s) => {
          const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); await img.decode();
          const c = document.getElementById('s'), ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 36, 64); ctx.drawImage(img, 0, 0, 36, 64);
          return Array.from(ctx.getImageData(0, 0, 36, 64).data);
        }, m.frame(f));
        const end = m.OUTRO ?? m.TOTAL;
        const shots = new Map();
        let prev = null;
        // Diam beruntun (7 Nov 2026, arahan "1-13 jalankan"): tidak ada diam lebih dari 3 dtk berturut-turut.
        const MAX_STILL = 3, streaks = [];
        let run = 0, runFrom = 0;
        for (let f = 0; f < end; f += step) {
          const d = await small(f);
          if (prev) {
            let s = 0; for (let i = 0; i < d.length; i += 4) s += Math.abs(d[i] - prev[i]) + Math.abs(d[i + 1] - prev[i + 1]) + Math.abs(d[i + 2] - prev[i + 2]);
            const v = s / (36 * 64 * 3), sh = m.shotAt(f).shot;
            if (arg('rinci')) console.log(`  ${String(f).padStart(5)}  beda ${v.toFixed(1).padStart(5)}${v < 8 ? '  diam' : ''}  ${sh}`); // --rinci (12 Nov 2026): angka beda per sampel untuk menyetel gerak
            const r = shots.get(sh) || { n: 0, still: 0, from: f };
            r.n++; if (v < 8) r.still++; shots.set(sh, r);
            if (v < 8) { if (!run) runFrom = f - step; run += step; }
            else { if (run / 30 > MAX_STILL) streaks.push([runFrom, runFrom + run]); run = 0; }
          }
          prev = d;
        }
        if (run / 30 > MAX_STILL) streaks.push([runFrom, runFrom + run]);
        for (const [a, b] of streaks) console.log(`peringatan: diam beruntun ${((b - a) / 30).toFixed(1)} dtk (frame ${a}–${b}, ${m.shotAt(a).shot}) > ${MAX_STILL} dtk — tambahkan gerak, benda masuk, atau potong`);
        let n = 0, still = 0, warn = 0;
        for (const [sh, r] of shots) {
          n += r.n; still += r.still;
          const pct = Math.round((100 * r.still) / r.n);
          if (pct > 70 && r.n >= 3) { warn++; console.log(`peringatan: ${sh} (frame ${r.from}) diam ${pct}% — tambahkan aksi, benda masuk, label/metafora, atau gerak kamera bermakna`); }
        }
        const total = Math.round((100 * still) / Math.max(1, n));
        console.log(`gerak: ${total}% waktu diam (target ≤50%; Kok Bisa? 26–38%), ${warn} shot terlalu diam dari ${shots.size}, ${streaks.length} diam beruntun > ${MAX_STILL} dtk`);
        process.exitCode = arg('strict') && (warn || total > 50 || streaks.length) ? 1 : 0;
        return;
      }
      if (arg('storyboard')) {
        const dir = arg('out') ? path.resolve(root, String(arg('out'))) : path.join(root, '02-Storyboard');
        fs.mkdirSync(dir, { recursive: true });
        const cp = require('node:child_process');
        const pairs = m.PHASES === 2; // Storyboard "awal → akhir": frame 2p = awal, 2p+1 = akhir
        const panels = pairs ? m.TOTAL / 2 : m.TOTAL;
        for (let p = 0; p < panels; p++) {
          const nn = String(p + 1).padStart(2, '0');
          if (!pairs) { fs.writeFileSync(path.join(dir, `panel-${nn}.png`), await draw(p)); continue; }
          const A = path.join(dir, `panel-${nn}-awal.png`), B = path.join(dir, `panel-${nn}-akhir.png`);
          fs.writeFileSync(A, await draw(2 * p)); fs.writeFileSync(B, await draw(2 * p + 1));
          const r = cp.spawnSync(rt.ffmpeg(), ['-v', 'error', '-y', '-i', A, '-i', B, '-filter_complex', '[0]scale=324:576[a];[1]scale=324:576[b];color=c=0xE9DFCF:s=40x576[g];[a][g][b]hstack=inputs=3,drawbox=x=328:y=268:w=32:h=40:color=0x8B4354@1:t=fill', '-frames:v', '1', path.join(dir, `panel-${nn}.png`)]);
          if (r.status !== 0) throw new Error('ffmpeg gagal menyusun pasangan awal→akhir: ' + r.stderr);
        }
        const cols = Math.min(pairs ? 4 : 7, panels), rows = Math.ceil(panels / cols);
        const r = cp.spawnSync(rt.ffmpeg(), ['-v', 'error', '-y', '-framerate', '1', '-start_number', '1', '-i', path.join(dir, 'panel-%02d.png'), '-vf', `${pairs ? '' : 'scale=432:768,'}tile=${cols}x${rows}:padding=12:color=0xF7F0E4`, '-frames:v', '1', '-q:v', '3', path.join(dir, 'Storyboard.jpg')]);
        if (r.status !== 0) throw new Error('ffmpeg gagal membuat lembar storyboard');
        console.log(`storyboard: ${panels} panel${pairs ? ' (awal → akhir)' : ''} -> ${rel(dir)}/ (lembar: Storyboard.jpg). Kirim ke pengguna dan tunggu persetujuan sebelum audio/render.`);
        return;
      }
      const stills = arg('stills');
      if (stills) {
        const dir = arg('out') ? path.resolve(root, String(arg('out'))) : path.join(root, '04-Hasil/stills');
        fs.mkdirSync(dir, { recursive: true });
        for (const f of String(stills).split(',').map(Number)) fs.writeFileSync(path.join(dir, `frame-${String(f).padStart(4, '0')}.png`), await draw(f));
        console.log('stills -> ' + dir);
        return;
      }
      const from = Number(arg('from') ?? 0), to = Number(arg('to') ?? m.TOTAL);
      const full = from === 0 && to === m.TOTAL;
      const name = arg('name') ?? 'Film';
      // Perbaikan 8 Nov 2026: render sebagian (--from/--to) tanpa --out dulu ditulis ke 04-Hasil/<name>.mp4 dan bisa
      // menimpa video final dengan klip bisu. Sekarang bawaannya <name>-proof-<from>-<to>.mp4.
      const out = path.resolve(root, '04-Hasil', arg('out') ?? (full ? name + '.mp4' : `${name}-proof-${from}-${to}.mp4`));
      if (!full && !arg('out')) console.log(`render sebagian (frame ${from}–${to}) -> ${rel(out)}`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const a = ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-'];
      // Render penuh memakai public/mix.wav. Tanpa mix.wav: bukti/lembar contoh dengan --out dirender tanpa suara;
      // film final (tanpa --out) tetap ditolak supaya tidak ada video final bisu yang tidak sengaja (7 Nov 2026).
      const mix = path.join(root, 'public/mix.wav');
      const useMix = full && !LAGU && fs.existsSync(mix);
      if (full && LAGU) console.log('seri Lirik: master tanpa audio (lagu dipasang pengguna dari pustaka musik platform saat unggah)' + (fs.existsSync(mix) ? '; public/mix.wav diabaikan' : ''));
      else if (full && !fs.existsSync(mix)) {
        if (!arg('out')) throw new Error(`public/mix.wav belum ada di ${rel(root)}; buat audio dulu atau pakai --out=<file> untuk bukti tanpa suara`);
        console.log('peringatan: tanpa public/mix.wav, dirender tanpa suara (bukti)');
      }
      if (useMix) a.push('-i', mix, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
      a.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out);
      const ff = spawn(rt.ffmpeg(), a, { stdio: ['pipe', 'inherit', 'inherit'] });
      const closed = new Promise((r) => ff.on('close', r));
      for (let f = from; f < to; f++) {
        if (!ff.stdin.write(await draw(f))) await new Promise((r) => ff.stdin.once('drain', r));
        if (f % 300 === 0) console.log('frame ' + f + '/' + to);
      }
      ff.stdin.end();
      const code = await closed;
      if (code !== 0) throw new Error(`ffmpeg gagal (kode ${code}); ${rel(out)} tidak valid`);
      console.log('selesai -> ' + out);
      // Kenyaringan final (7 Nov 2026): -14 LUFS / -1 dBTP, supaya volume antar-video seragam di feed.
      if (useMix) {
        const r = require('node:child_process').spawnSync('python3', [path.join(ws, 'tools/loudness.py'), '--fix', out], { stdio: 'inherit' });
        if (r.status !== 0) throw new Error('normalisasi kenyaringan gagal (tools/loudness.py)');
      }
      if (full && !arg('out')) { writeLock(name, inputs); updateActive(name); }
      if (full && LAGU) previewLagu(out);
    } finally { await browser.close(); }
  } finally { fs.rmSync(bundle, { force: true }); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
