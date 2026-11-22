// Ukur ekspresi suara narasi (7 Nov 2026): seberapa "hidup" sebuah take, tanpa harus menebak dari telinga saja.
// Pakai: node tools/voice_stats.cjs <audio> [audio lain ...]
// Keluaran per berkas:
//   F0 median (Hz), variasi nada (simpangan baku, semiton), rentang nada p10–p90 (semiton),
//   porsi puncak nada (>4 semiton di atas median, tanda bagian "naik/excited"),
//   dinamika keras-pelan bagian bersuara (simpangan baku & rentang p10–p90, dB), porsi senyap, lantai derau.
// Metode: 16 kHz mono, jendela 40 ms, langkah 10 ms; ambang relatif p95 level (senyap < -40 dB, nada hanya > -25 dB);
// nada dari autokorelasi ternormalisasi (70–400 Hz, ambang 0,6) + median 5 frame. lantaiDerauDb: p10 level relatif p95.
// Ini pembanding RELATIF antar-take dengan suara yang sama, bukan ukuran mutu absolut.
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const rt = require('./runtime.cjs');

function decode(file) {
  const buf = execFileSync(rt.ffmpeg(), ['-v', 'error', '-i', file, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : NaN; };
const sd = (a) => { const m = a.reduce((s, x) => s + x, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); };

function stats(file) {
  const x = decode(file), sr = 16000, W = 640, H = 160, minLag = Math.floor(sr / 400), maxLag = Math.floor(sr / 70);
  // Level per frame dulu; semua ambang RELATIF terhadap p95 level take itu sendiri, supaya take keras/pelan
  // dan take yang berderau dibandingkan adil (7 Nov 2026: beberapa suara pustaka keluar dengan desis -30 dB).
  const starts = [], lv = [];
  for (let i = 0; i + W + maxLag < x.length; i += H) {
    let e = 0; for (let k = 0; k < W; k++) e += x[i + k] * x[i + k];
    starts.push(i); lv.push(10 * Math.log10(e / W + 1e-12));
  }
  const ref = q(lv, 0.95);
  const db = [], raw = [];
  let silent = 0;
  starts.forEach((i, n) => {
    if (lv[n] < ref - 40) { silent++; raw.push(NaN); return; }
    db.push(lv[n]);
    if (lv[n] < ref - 25) { raw.push(NaN); return; } // terlalu pelan untuk nada yang bisa dipercaya
    let e = 0; for (let k = 0; k < W; k++) e += x[i + k] * x[i + k];
    let best = 0, lag = 0;
    for (let L = minLag; L <= maxLag; L++) {
      let c = 0, e2 = 0;
      for (let k = 0; k < W; k++) { c += x[i + k] * x[i + k + L]; e2 += x[i + k + L] * x[i + k + L]; }
      const r = c / Math.sqrt(e * e2 + 1e-12);
      if (r > best) { best = r; lag = L; }
    }
    raw.push(best > 0.6 ? sr / lag : NaN);
  });
  // median 5 frame untuk membuang lompatan oktaf sesaat
  const f0 = [];
  raw.forEach((f, n) => {
    if (!Number.isFinite(f)) return;
    const win = raw.slice(Math.max(0, n - 2), n + 3).filter(Number.isFinite);
    f0.push(q(win, 0.5));
  });
  const med = q(f0, 0.5);
  const st = f0.map((f) => 12 * Math.log2(f / med));
  return {
    berkas: path.basename(file),
    f0MedianHz: Math.round(med),
    variasiNadaSemiton: +sd(st).toFixed(2),
    rentangNadaP10P90: +(q(st, 0.9) - q(st, 0.1)).toFixed(1),
    puncakNadaPersen: Math.round((100 * st.filter((s) => s > 4).length) / st.length),
    dinamikaDbSd: +sd(db).toFixed(2),
    rentangKerasP10P90: +(q(db, 0.9) - q(db, 0.1)).toFixed(1),
    senyapPersen: Math.round((100 * silent) / lv.length),
    // p10 level frame relatif p95: makin negatif makin bersih. Sekitar -30 berarti ada desis/derau di sela kata.
    lantaiDerauDb: +(q(lv, 0.1) - ref).toFixed(1),
  };
}

const files = process.argv.slice(2);
if (!files.length) { console.error('Pakai: node tools/voice_stats.cjs <audio> [audio lain ...]'); process.exit(1); }
console.table(files.map(stats));
