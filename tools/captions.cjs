// Ukur lebar kata (Lato Bold 44px) lalu pecah narasi menjadi cue subtitle -> src/cues.json + src/caption-metrics.json
// Alat umum. Pakai: node tools/captions.cjs <folder-proyek>   (setelah timeline -> src/timeline.json)
// Subtitle Less.: Lato Bold 44px, maks 2 baris dengan lebar baris 700 px, maks 7 kata per kemunculan.
//
// Aturan pemecahan (7 Nov 2026; pengguna: "jangan terlalu banyak sekali muncul", "jangan kepanjangan"):
// - Maks 7 kata dan 2 baris. Tidak ada pengecualian; dulu sisa 1–2 kata digabung sampai 9 kata.
// - Sisa 1–2 kata tidak dibiarkan sendirian: potongan diseimbangkan (9 kata -> 5+4, bukan 7+2).
// - Utamakan potong di tanda baca; jeda ucapan > 0,7 dtk selalu jadi batas potongan.
// Pemecahan dicari dengan pemrograman dinamis atas biaya di bawah, jadi hasilnya bisa diuji tanpa browser
// (node tools/captions.cjs --test <folder-proyek>).
const fs = require('node:fs');
const path = require('node:path');

const MAXW = 700, PAD = 20, GAP = 8, MAXROWS = 2, MAXWORDS = 7, PAUSE = 0.7;
const punct = (w) => /[,.?!:;…"”]$/.test(w.w);

// Susun kata ke baris. Kalau butuh 2 baris, kedua baris diseimbangkan (tidak menyisakan satu kata di baris
// kedua, mis. "yang dulu selalu bikin aku / kesal." menjadi "yang dulu selalu / bikin aku kesal.").
function rowsOf(ws, wpx) {
  const rows = [[]];
  let rw = 0;
  for (const w of ws) {
    if (rw + wpx(w.w) > MAXW && rows[rows.length - 1].length) { rows.push([]); rw = 0; }
    rows[rows.length - 1].push(w.w);
    rw += wpx(w.w);
  }
  if (rows.length !== 2) return rows;
  const width = (a) => a.reduce((s, w) => s + wpx(w.w), 0);
  let best = null;
  for (let k = 1; k < ws.length; k++) {
    const a = width(ws.slice(0, k)), b = width(ws.slice(k));
    if (a > MAXW || b > MAXW) continue;
    // seimbang, utamakan pindah baris setelah tanda baca, hindari baris berisi satu kata
    const score = Math.max(a, b) - (punct(ws[k - 1]) ? 80 : 0) + (k === 1 || k === ws.length - 1 ? 200 : 0) + (a < b ? 1 : 0);
    if (!best || score < best.score) best = { score, k };
  }
  return best ? [ws.slice(0, best.k).map((w) => w.w), ws.slice(best.k).map((w) => w.w)] : rows;
}

// Biaya satu potongan W[i..j): makin kecil makin baik. null = tidak boleh.
function chunkCost(W, i, j, wpx) {
  const n = j - i;
  if (n > MAXWORDS) return null;
  for (let k = i + 1; k < j; k++) if (W[k].s - W[k - 1].e > PAUSE) return null; // jeda panjang di tengah
  if (rowsOf(W.slice(i, j), wpx).length > MAXROWS) return null;
  let c = 2; // setiap kemunculan punya biaya: lebih sedikit potongan lebih tenang dibaca
  if (j < W.length && !punct(W[j - 1])) c += 1; // potong di luar tanda baca
  for (let k = i; k < j - 1; k++) if (/[.?!…]["”]?$/.test(W[k].w)) c += 2; // membawa awal kalimat berikutnya
  if (n <= 2 && W.length > 2) c += 3; // kata menggantung sendirian
  else if (n === 3 && W.length > 3) c += 0.5;
  return c;
}

/** Pecah satu baris narasi menjadi daftar potongan kata (tiap potongan = satu kemunculan subtitle). */
function splitLine(W, wpx) {
  const best = [0], from = [0];
  for (let j = 1; j <= W.length; j++) {
    best[j] = Infinity;
    for (let i = Math.max(0, j - MAXWORDS); i < j; i++) {
      const c = best[i] === Infinity ? null : chunkCost(W, i, j, wpx);
      if (c !== null && best[i] + c < best[j]) { best[j] = best[i] + c; from[j] = i; }
    }
    if (best[j] === Infinity) { best[j] = best[j - 1] + 10; from[j] = j - 1; } // satu kata terlalu lebar: tetap tampil
  }
  const out = [];
  for (let j = W.length; j > 0; j = from[j]) out.unshift(W.slice(from[j], j));
  return out;
}

function buildCues(lines, wpx) {
  const cues = [];
  for (const line of lines)
    for (const ws of splitLine(line.words, wpx)) cues.push({ start: ws[0].s, end: ws[ws.length - 1].e, rows: rowsOf(ws, wpx) });
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i], nx = cues[i + 1];
    const endS = Math.min(c.end + 0.6, nx ? nx.start : c.end + 1.2);
    c.start = Math.round(c.start * 30) - 1;
    c.end = Math.round(endS * 30);
    c.rows = c.rows.map((r) => r.join(' '));
  }
  return cues;
}

// Tulisan subtitle yang berbeda dari ucapan (17 Nov 2026, video perkenalan web: narasi "less dot benaya dot I. D.",
// subtitle "less.benaya.id"; cara baca alamat web sejak 18 Nov 2026). Opsional: <proyek>/01-Brief/subtitle-ganti.json =
// [{ "dari": "less dot benaya dot I D", "ke": "less.benaya.id" }]. Kata berurutan yang cocok (tanpa beda huruf besar/kecil, tanda baca di ujung ikut) digabung
// jadi satu kata tampilan dengan waktu kata pertama s/d kata terakhir. Audio dan timeline.json tidak berubah.
function gantiTampilan(tl, root) {
  const f = path.join(root, '01-Brief/subtitle-ganti.json');
  if (!fs.existsSync(f)) return;
  const aturan = JSON.parse(fs.readFileSync(f, 'utf8'));
  const bersih = (w) => w.toLowerCase().replace(/[,.?!:;…"“”]+$/, '');
  for (const line of tl.lines)
    for (const { dari, ke } of aturan) {
      const pola = dari.toLowerCase().split(/\s+/);
      for (let i = 0; i + pola.length <= line.words.length; i++) {
        if (!pola.every((k, j) => bersih(line.words[i + j].w) === k)) continue;
        const akhir = line.words[i + pola.length - 1];
        const ekor = (akhir.w.match(/[,.?!:;…"“”]+$/) || [''])[0];
        line.words.splice(i, pola.length, { ...line.words[i], w: ke + ekor, e: akhir.e });
        console.log(`subtitle: "${dari}" -> "${ke + ekor}"`);
      }
    }
}
module.exports = { MAXW, MAXWORDS, MAXROWS, splitLine, buildCues, rowsOf, gantiTampilan };

if (require.main === module) {
  const test = process.argv.includes('--test');
  const root = path.resolve(process.argv.filter((a) => !a.startsWith('--'))[2] || '.');
  const tl = JSON.parse(fs.readFileSync(path.join(root, 'src/timeline.json'), 'utf8'));
  gantiTampilan(tl, root);
  if (test) {
    // Lebar perkiraan (tanpa browser) hanya untuk menguji aturan pemecahan; produksi memakai ukuran font asli.
    const metricsFile = path.join(root, 'src/caption-metrics.json');
    const m = fs.existsSync(metricsFile) ? JSON.parse(fs.readFileSync(metricsFile, 'utf8')) : {};
    const wpx = (w) => Math.ceil(m[w] ?? w.length * 24) + PAD + GAP;
    const cues = buildCues(tl.lines, wpx);
    const counts = cues.map((c) => c.rows.join(' ').split(' ').length);
    console.log(`${cues.length} cue, kata maks ${Math.max(...counts)}, cue 1–2 kata: ${counts.filter((n) => n <= 2).length}, baris maks ${Math.max(...cues.map((c) => c.rows.length))}`);
    for (const c of cues) console.log(String(c.rows.join(' ').split(' ').length).padStart(2), c.rows.join(' / '));
    process.exit(0);
  }
  const ws = path.resolve(__dirname, '..');
  const rt = require(path.join(ws, 'tools/runtime.cjs'));
  const { chromium } = require(rt.playwrightPath());
  (async () => {
    const words = [...new Set(tl.lines.flatMap((l) => l.words.map((w) => w.w)))];
    const font = fs.readFileSync(path.join(ws, 'shared/assets/fonts/Lato-Bold.ttf')).toString('base64');
    const b = await chromium.launch({ executablePath: rt.chrome(), headless: true });
    let m;
    try {
      const p = await b.newPage();
      m = await p.evaluate(async ({ font, words }) => {
        const ff = new FontFace('Lato', `url(data:font/ttf;base64,${font})`, { weight: '700' });
        await ff.load(); document.fonts.add(ff);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = '700 44px Lato';
        return Object.fromEntries(words.map((w) => [w, ctx.measureText(w).width]));
      }, { font, words });
    } finally { await b.close(); }
    const wpx = (w) => Math.ceil(m[w]) + PAD + GAP;
    const cues = buildCues(tl.lines, wpx);
    fs.writeFileSync(path.join(root, 'src/caption-metrics.json'), JSON.stringify(m));
    fs.writeFileSync(path.join(root, 'src/cues.json'), JSON.stringify(cues, null, 1));
    console.log(cues.length + ' cue');
    for (const c of cues) console.log(c.start, c.end, c.rows.join(' / '));
  })().catch((e) => { console.error(e); process.exitCode = 1; });
}
