// Uji pustaka bersama: portabilitas, kunci versi, dan katalog.
//
// 1. Portabilitas: tiap file .ts/.tsx di shared/ dicoba dibundel sendiri; dependensi yang
//    menggantung dicatat apa adanya. Status portabel jadi hasil ukur, bukan klaim.
// 2. Kunci (--locks): setiap <proyek>/04-Hasil/*.lock.json mencatat sha256 file yang dipakai
//    video itu. File shared/ yang berubah sesudahnya = PELANGGARAN: versi yang sudah dipakai
//    video terkirim beku; perubahan dibuat sebagai versi baru (vN+1).
// 3. Katalog (--write): hasil uji ditulis ke shared/catalog.json dan shared/catalog.html dibuat ulang.
//
// Pakai: node tools/check-shared.cjs [--write] [--locks]
//        node tools/check-shared.cjs --lock-entry <proyek>/src/Entry.tsx <NamaVideo>   (kunci untuk proyek format lama)

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const rt = require('./runtime.cjs');
const esbuild = require(path.join(rt.nodeModules(), 'esbuild'));
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');

function entriesToCheck() {
  const out = [];
  // Semua kode di shared/ (lokasi, tokoh, properti, ui, film, core, aset data).
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const abs = path.join(dir, f);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (/\.tsx?$/.test(f) && !/font-data\/v1\.ts$|brand-data\/v1\.ts$/.test(abs)) out.push(abs);
    }
  };
  walk(path.join(ROOT, 'shared'));
  return out.sort();
}

function check(absFile) {
  const missing = new Set();
  try {
    esbuild.buildSync({
      entryPoints: [absFile],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      write: false,
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      logLevel: 'silent',
    });
  } catch (err) {
    for (const e of err.errors || []) {
      const m = /Could not resolve "([^"]+)"/.exec(e.text);
      if (m) missing.add(m[1]);
      else missing.add(e.text);
    }
  }
  return [...missing].sort();
}

// ------------------------------------------------------------------ kunci versi
function writeLockFor(entry, name) {
  const abs = path.resolve(entry);
  const projRoot = path.dirname(path.dirname(abs));
  const r = esbuild.buildSync({ entryPoints: [abs], bundle: true, platform: 'node', format: 'cjs', write: false, metafile: true, absWorkingDir: ROOT, external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'], logLevel: 'silent' });
  const files = {};
  for (const p of Object.keys(r.metafile.inputs).filter((x) => !x.includes('node_modules/')).sort()) files[p] = sha(path.join(ROOT, p));
  const out = path.join(projRoot, '04-Hasil', name + '.lock.json');
  fs.writeFileSync(out, JSON.stringify({ project: path.relative(ROOT, projRoot), video: name + '.mp4', created: new Date().toISOString(), files }, null, 1));
  console.log(`kunci -> ${path.relative(ROOT, out)} (${Object.keys(files).filter((p) => p.startsWith('shared/')).length} file shared)`);
}
const le = process.argv.indexOf('--lock-entry');
if (le > 0) { writeLockFor(process.argv[le + 1], process.argv[le + 2]); process.exit(0); }

function findLocks() {
  const out = [];
  const walk = (dir, depth) => {
    for (const f of fs.readdirSync(dir)) {
      const abs = path.join(dir, f);
      if (f === 'node_modules' || f.startsWith('.')) continue;
      if (fs.statSync(abs).isDirectory()) { if (depth < 4) walk(abs, depth + 1); }
      else if (f.endsWith('.lock.json')) out.push(abs);
    }
  };
  walk(path.join(ROOT, 'projects'), 0);
  return out.sort();
}
// Perbaikan 20 Nov 2026: setiap render penuh menulis kunci, termasuk render revisi yang tidak pernah dikirim. Agen Studio
// boleh memperbaiki aset buatan sesinya sendiri (studio/konten.cjs asetSesiTerbuka), sehingga kunci revisi lama (kasus
// Hari-Pertama-Kerja-v1-rev1 + film/v2/Callout.tsx) membuat --locks gagal terus. Perubahan dimaafkan hanya kalau
// (a) kunci yang LEBIH BARU di proyek yang sama sudah mencatat isi file sekarang, dan (b) video kunci lama itu tidak
// berstatus disetujui (ACTIVE-WORKSPACE.json approved / active "disetujui…"). Video yang disetujui tetap beku.
const tanpaSfx = (p) => String(p || '').replace(/-SFX(\.mp4)$/i, '$1');
const disetujui = new Set();
try {
  const aw = JSON.parse(fs.readFileSync(path.join(ROOT, 'ACTIVE-WORKSPACE.json'), 'utf8'));
  for (const a of [...(aw.approved || []), ...(aw.active && /^disetujui/i.test(String(aw.active.status || '')) ? [aw.active] : [])])
    if (a && a.output) disetujui.add(tanpaSfx(a.output));
} catch {}
const locks = findLocks().map((f) => ({ f, ...JSON.parse(fs.readFileSync(f, 'utf8')) }));
const lebihBaruCocok = (lock, p, now) =>
  locks.some((k) => k !== lock && k.project === lock.project && String(k.created) > String(lock.created) && k.files && k.files[p] === now);
const lockedBy = new Map(); // path shared -> [video]
let lockViolations = 0, dimaafkan = 0;
for (const lock of locks) {
  const videoRel = tanpaSfx(`${lock.project}/04-Hasil/${lock.video}`);
  for (const [p, h] of Object.entries(lock.files)) {
    if (!p.startsWith('shared/')) continue;
    lockedBy.set(p, [...(lockedBy.get(p) || []), `${lock.project}/${lock.video}`]);
    const abs = path.join(ROOT, p);
    const now = fs.existsSync(abs) ? sha(abs) : null;
    if (now !== h && now && !disetujui.has(videoRel) && lebihBaruCocok(lock, p, now)) {
      dimaafkan++;
      if (process.argv.includes('--locks')) console.log(`  catatan: ${p} berubah sejak render revisi ${lock.project}/${lock.video} (tidak disetujui); render berikutnya di proyek itu sudah memakai isi sekarang`);
      continue;
    }
    if (now !== h) {
      lockViolations++;
      if (process.argv.includes('--locks')) console.log(`  BEKU DILANGGAR: ${p} ${now ? 'berubah' : 'hilang'} sejak dipakai ${lock.project}/${lock.video}`);
    }
  }
}
if (process.argv.includes('--locks')) {
  console.log(lockViolations ? `\n  ${lockViolations} pelanggaran kunci. Kembalikan file itu, lalu buat perubahan sebagai versi baru (vN+1).\n` : `  kunci: ${lockedBy.size} file shared terkunci, tidak ada yang berubah.\n`);
  process.exitCode = lockViolations ? 1 : 0;
}

const results = entriesToCheck().map((abs) => {
  const rel = path.relative(ROOT, abs);
  const missing = check(abs);
  return { path: rel, portable: missing.length === 0, missing };
});

const width = Math.max(...results.map((r) => r.path.length));
console.log('=== UJI PORTABILITAS PUSTAKA BERSAMA ===');
for (const r of results) {
  const status = r.portable ? 'PORTABEL' : 'TERIKAT ';
  console.log(`  ${r.path.padEnd(width)}  ${status}  ${r.missing.join(', ') || '-'}`);
}

const portable = results.filter((r) => r.portable).length;
console.log(`\n  ${portable} portabel, ${results.length - portable} masih terikat proyek asal.`);

if (process.argv.includes('--write')) {
  const catalogPath = path.join(ROOT, 'shared/catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const byPath = new Map(results.map((r) => [r.path, r]));
  let updated = 0;

  for (const asset of catalog.assets || []) {
    const r = byPath.get(asset.path);
    if (!r) continue;
    asset.portable = r.portable;
    asset.missingDependencies = r.missing;
    asset.portabilityCheckedAt = new Date().toISOString().slice(0, 10);
    updated++;
  }

  // Video yang mengunci aset (dari *.lock.json); path aset boleh file atau folder.
  for (const asset of catalog.assets || []) {
    if (!asset.path || !asset.path.startsWith('shared/')) continue;
    const users = new Set();
    for (const [p, vids] of lockedBy) if (p === asset.path || p.startsWith(asset.path.replace(/\/$/, '') + '/')) vids.forEach((v) => users.add(v));
    if (users.size) asset.lockedBy = [...users].sort(); else delete asset.lockedBy;
  }

  catalog.portabilityTool = 'tools/check-shared.cjs';
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
  console.log(`\n  catalog.json diperbarui untuk ${updated} entri.`);

  // catalog.html dibuat ulang dari catalog.json (dulu ditulis tangan dan tertinggal).
  const esc = (x) => String(x ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  const href = (p) => '../' + p.split('/').map(encodeURIComponent).join('/');
  const groups = {};
  for (const a of catalog.assets || []) (groups[a.type || 'lain'] ||= []).push(a);
  const cards = Object.entries(groups).map(([type, list]) => `<h2>${esc(type)}</h2><main>` + list.map((a) => {
    const img = a.preview ? `<a href="${href(a.preview)}"><img src="${href(a.preview)}" alt="${esc(a.id)}" loading="lazy"></a>` : '';
    const lock = a.lockedBy ? `<p class="lock">Terkunci oleh: ${a.lockedBy.map(esc).join(', ')}</p>` : '';
    return `<article><h3>${esc(a.id)}</h3>${img}<p class="st">${esc(a.status || '')}</p><p>${esc(a.notes || '')}</p>${lock}<p><a href="${href(a.path)}">${esc(a.path)}</a>${a.source ? `<br><small>Asal: ${esc(a.source)}</small>` : ''}</p></article>`;
  }).join('') + '</main>').join('');
  const html = `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Pustaka Motion Studio</title><style>body{font:16px system-ui;background:#f7f0e4;color:#283d36;max-width:1200px;margin:40px auto;padding:0 16px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}article{background:#fff9ef;padding:18px;border-radius:14px;overflow-wrap:anywhere}img{width:100%;height:300px;object-fit:contain;background:#e8e3d5;border-radius:8px}a{color:#526b58}p{line-height:1.5}.st{color:#8b4354;font-weight:600}.lock{background:#dee2d4;padding:6px 8px;border-radius:6px;font-size:14px}h2{margin-top:36px;text-transform:capitalize}</style><h1>Pustaka Motion Studio</h1><p>Dibuat otomatis dari catalog.json oleh tools/check-shared.cjs --write (${new Date().toISOString().slice(0, 10)}). Desain tempat boleh kembali; aksi dan cerita baru tetap perlu staging baru. Aset yang terkunci dipakai video terkirim: perubahan dibuat sebagai versi baru.</p>${cards}<p><a href="../MULAI-DI-SINI.md">Aturan aktif</a> · <a href="catalog.json">Katalog data</a></p></html>`;
  fs.writeFileSync(path.join(ROOT, 'shared/catalog.html'), html);
  console.log('  catalog.html dibuat ulang.');
}
