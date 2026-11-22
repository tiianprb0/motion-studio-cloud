// Uji alat audit: setiap contoh yang sengaja salah HARUS tertangkap, contoh yang benar HARUS bersih.
// Jalankan setelah mengubah tools/audit-overlay.cjs: node tools/test-audit.cjs
// Tujuannya mencegah audit "lolos diam-diam" (pernah terjadi: audit lama rusak sejak v2 tanpa ketahuan).
const A = require('./audit-overlay.cjs');

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${body}</svg>`;
const word = (x, y, w = 100) => `<g data-word="true"><rect x="${x}" y="${y}" width="${w}" height="62" rx="8"></rect><text>kata</text></g>`;
const cases = [
  ['bersih', svg(`<g data-actor="her" transform="translate(500 1600) scale(2)"><g data-anatomy="x"></g></g>${word(110, 300)}`), null],
  ['skala lokal > 4,6', svg(`<g data-actor="her" transform="translate(500 1600) scale(5)"></g>`), /skala efektif 5\.00/],
  ['skala lewat zoom kamera', svg(`<g transform="translate(540 1150) scale(2.5) translate(-540 -1150)"><g data-actor="him" transform="translate(500 1600) scale(2)"></g></g>`), /him: skala efektif 5\.00/],
  ['tanda anatomi', svg(`<g data-actor="him" transform="scale(2)"><g data-anatomy-warn="elbow-above-shoulder"></g></g>`), /him: elbow-above-shoulder/],
  ['popup keluar kanan', svg(`<g data-fx="kartu" data-box="700,400,980,600"></g>`), /popup keluar safe zone/],
  ['popup keluar karena zoom', svg(`<g transform="scale(2)"><g data-fx="kartu" data-box="300,300,500,400"></g></g>`), /popup keluar safe zone \(600,600,1000,800\)/],
  ['popup lebih ke tepi kiri dari subtitle', svg(`<g data-fx="label" data-box="70,500,290,560"></g>`), /popup keluar safe zone \(70,/],
  ['popup sejajar subtitle boleh', svg(`<g data-fx="label" data-box="110,500,330,560"></g>`), null],
  ['subtitle keluar atas', svg(word(110, 150)), /subtitle keluar: atas/],
  ['subtitle keluar kanan', svg(word(860, 300, 120)), /subtitle keluar: kanan/],
  ['gelembung dekat subtitle', svg(`${word(110, 300, 300)}<g data-fx="gelembung" data-box="150,400,500,600"></g>`), /gelembung terlalu dekat subtitle: 38 px/],
  ['gelembung cukup jauh', svg(`${word(110, 300, 300)}<g data-fx="gelembung" data-box="150,480,500,700"></g>`), null],
  ['bubble terlalu panjang', svg(`<g data-fx="gelembung" data-box="150,480,500,700" data-words="6"></g>`), /bubble 6 kata > 4/],
  ['gelembung menutupi wajah', svg(`<g data-face="him" transform="translate(500 1300) scale(2)"></g><g data-fx="gelembung" data-box="380,640,700,760"></g>`), /gelembung menutupi wajah him/],
  ['gelembung di atas kepala boleh', svg(`<g data-face="him" transform="translate(500 1300) scale(2)"></g><g data-fx="gelembung" data-box="380,520,700,600"></g>`), null],
  ['bubble 4 kata boleh', svg(`<g data-fx="gelembung" data-box="150,480,500,700" data-words="4"></g>`), null],
  ['ekor bubble v2 terlalu jauh', svg(`<g data-fx="gelembung" data-box="150,560,600,670" data-ekor="400,670,520,820"></g>`), /ekor gelembung 192 px > 90/],
  ['ekor bubble v2 menempel boleh', svg(`<g data-fx="gelembung" data-box="150,560,600,670" data-ekor="400,670,420,720"></g>`), null],
  ['ekor terlalu jauh karena zoom', svg(`<g transform="scale(2)"><g data-fx="gelembung" data-box="100,300,400,360" data-ekor="200,360,200,410"></g></g>`), /ekor gelembung 100 px/],
];

let fail = 0;
for (const [name, s, expect] of cases) {
  const got = [];
  A.checkFrameSvg(s, (m) => got.push(m));
  const ok = expect ? got.some((m) => expect.test(m)) : got.length === 0;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'GAGAL'} ${name}${ok ? '' : `  -> ${JSON.stringify(got)}`}`);
}

const shotMsgs = [];
A.checkShots([[0, 'a'], [20, 'b'], [100, 'c']], 200, 10, (m) => shotMsgs.push(m));
const shotOk = shotMsgs.some((m) => /MIN_SHOT proyek 10/.test(m)) && shotMsgs.some((m) => /shot a terlalu pendek/.test(m));
if (!shotOk) fail++;
console.log(`${shotOk ? 'OK  ' : 'GAGAL'} MIN_SHOT proyek tidak bisa melonggarkan batas`);

const cueMsgs = [];
A.checkCues([{ start: 0, rows: ['satu dua tiga empat', 'lima enam tujuh delapan'] }, { start: 5, rows: ['a', 'b', 'c'] }], (m) => cueMsgs.push(m));
const cueOk = cueMsgs.some((m) => /8 kata/.test(m)) && cueMsgs.some((m) => /3 baris/.test(m));
if (!cueOk) fail++;
console.log(`${cueOk ? 'OK  ' : 'GAGAL'} subtitle > 7 kata dan > 2 baris`);

const err = [], wrn = [];
A.checkInputs(['projects/a/v1/src/Film.tsx', 'projects/b/v2/src/X.tsx', 'arsip/x.tsx', 'shared/characters/rig/v1/Character.tsx', 'shared/characters/rig/v2/Character.tsx'], 'projects/a/v1', (m) => err.push(m), (m) => wrn.push(m));
const inOk = err.length === 2 && wrn.length === 1;
if (!inOk) fail++;
console.log(`${inOk ? 'OK  ' : 'GAGAL'} impor proyek lain/arsip ditolak, dua versi rig diperingatkan`);

// walkBoxes (render-thumb, 8 Nov 2026): kotak dibaca setelah zoom induk, bukan koordinat mentah.
const boxes = [];
A.walkBoxes(svg(`<g transform="translate(540 960) scale(2) translate(-540 -960)"><g data-thumb="petunjuk" data-box="400,1500,500,1600"></g></g>`), (b) => boxes.push(b));
const boxOk = boxes.length === 1 && boxes[0].join(',') === '260,2040,460,2240';
if (!boxOk) fail++;
console.log(`${boxOk ? 'OK  ' : 'GAGAL'} kotak thumbnail dihitung setelah zoom${boxOk ? '' : `  -> ${JSON.stringify(boxes)}`}`);

console.log(fail ? `\n${fail} uji GAGAL` : '\nsemua uji lolos');
process.exitCode = fail ? 1 : 0;
