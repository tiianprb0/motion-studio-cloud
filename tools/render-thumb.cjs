// Alat thumbnail umum: render komponen `Thumb` dari file TSX -> PNG 9:16 (1080x1920) + potongan 4:5 (1080x1350) dan 3:4 (1080x1440).
// Pakai: node tools/render-thumb.cjs <path/ke/Thumb.tsx> <out-tanpa-ekstensi> [--only]  (--only: satu PNG saja, untuk lembar contoh)
// Juga menulis <out>.lock.json bila file ada di projects/ (sha256 file shared yang dipakai; diperiksa tools/check-shared.cjs --locks).
// Pemeriksaan (7 Nov 2026): anatomi rig (data-anatomy-warn), skala efektif ≤4,6, dan benda/petunjuk (data-box) di dalam
// potongan grid 3:4 (y 240–1680). Temuan dicetak dan kode keluar 1; PNG tetap ditulis untuk diperiksa.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const ws = path.resolve(__dirname, '..');
const rt = require(path.join(ws, 'tools/runtime.cjs'));
const esbuild = require(path.join(rt.nodeModules(), 'esbuild'));
const [file, out] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
if (!file || !out) { console.error('Pakai: node tools/render-thumb.cjs <Thumb.tsx> <out>'); process.exit(1); }
(async () => {
  const dir = path.dirname(path.resolve(file));
  const fonts = path.relative(dir, path.join(ws, 'shared/assets/font-data/v1')).split(path.sep).join('/');
  const entry = `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {Thumb} from './${path.basename(file).replace(/\\.tsx$/, '')}';import {SVG_FONTS} from '${fonts}';
export const svg = () => renderToStaticMarkup(React.createElement(Thumb)).replace(/<(rect|g)/,'<style>'+SVG_FONTS+'</style><$1');`;
  const bundle = path.join(os.tmpdir(), `thumb-${process.pid}.cjs`);
  const built = await esbuild.build({ stdin: { contents: entry, resolveDir: dir, loader: 'tsx', sourcefile: 'thumb-entry.tsx' }, absWorkingDir: ws, metafile: true, bundle: true, platform: 'node', format: 'cjs', outfile: bundle, logLevel: 'error', nodePaths: [rt.nodeModules()] });
  const svg = require(bundle).svg();
  fs.rmSync(bundle, { force: true });
  const A = require(path.join(ws, 'tools/audit-overlay.cjs'));
  const temuan = [];
  A.checkFrameSvg(svg, (msg) => { if (!/safe zone|subtitle/.test(msg)) temuan.push(msg); });
  // Perbaikan 8 Nov 2026: kotak dibaca setelah transform induknya (zoom/geser), sama dengan audit film; dulu koordinat mentah.
  let kotak = 0;
  A.walkBoxes(svg, ([l, t, r, bt]) => {
    kotak++;
    if (t < 240 || bt > 1680 || l < 0 || r > 1080) temuan.push(`benda/petunjuk keluar potongan grid 3:4 (${l},${t},${r},${bt})`);
  });
  for (const t of temuan) console.log('temuan: ' + t);
  // Cover versi pose: benda petunjuk dipegang tokoh dan belum punya data-box, jadi cek 3:4 di atas tidak memeriksa apa pun.
  if (!kotak) console.log('peringatan: tidak ada data-box di thumbnail ini; cek potongan 3:4 (y 240–1680) untuk benda petunjuk dan wajah harus dilakukan manual di file -3x4.png');
  if (temuan.length) process.exitCode = 1;
  const { chromium } = require(rt.playwrightPath());
  const b = await chromium.launch({ executablePath: rt.chrome(), headless: true });
  try {
    const p = await b.newPage();
    await p.setContent('<canvas id="c" width="1080" height="1920"></canvas>');
    const b64 = await p.evaluate(async (s) => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); await img.decode();
      const c = document.getElementById('c'); c.getContext('2d').drawImage(img, 0, 0, 1080, 1920); return c.toDataURL('image/png').split(',')[1];
    }, svg);
    fs.writeFileSync(out + '.png', Buffer.from(b64, 'base64'));
  } finally { await b.close(); }
  if (process.argv.includes('--only')) { console.log('gambar -> ' + out + '.png (tanpa potongan dan lock)'); return; }
  const ff = rt.ffmpeg();
  execFileSync(ff, ['-v', 'error', '-y', '-i', out + '.png', '-vf', 'crop=1080:1350:0:285', out + '-4x5.png']);
  execFileSync(ff, ['-v', 'error', '-y', '-i', out + '.png', '-vf', 'crop=1080:1440:0:240', out + '-3x4.png']);
  if (!path.relative(ws, path.resolve(file)).startsWith('projects/')) { console.log('thumbnail -> ' + out + '.png (+ -4x5, -3x4; contoh di luar proyek: tanpa lock)'); return; }
  const files = {};
  for (const p of Object.keys(built.metafile.inputs).filter((x) => !x.includes('node_modules/') && !x.endsWith('thumb-entry.tsx')).sort())
    files[p] = crypto.createHash('sha256').update(fs.readFileSync(path.join(ws, p))).digest('hex');
  fs.writeFileSync(out + '.lock.json', JSON.stringify({ project: path.relative(ws, path.dirname(path.dirname(path.resolve(file)))), video: path.basename(out) + '.png', created: new Date().toISOString(), files }, null, 1));
  console.log('thumbnail -> ' + out + '.png (+ -4x5, -3x4, .lock.json)');
})().catch((e) => { console.error(e); process.exitCode = 1; });
