// Lembar contoh sistem cahaya umum _proyeksi v2 (10 Nov 2026, diminta pengguna: "kalau itu diimplementasikan di mesin 3d
// nya apakah bisa? kasih contoh dua sebelum dan sesudah"; "jangan fokus ke satu dunia ... in general").
// Dua dunia berbeda yang dibangun dari benda umum (balok, bidang, tiang, tajuk, tokoh, bukaan):
//   A. luar ruang sore (deret toko, tiang listrik, pohon, genangan)  B. dalam ruang (kamar dengan jendela, lampu meja, lensa)
// Kiri = mesin 3D lama (cahaya={false}), kanan = dunia yang sama dengan sistem cahaya.
// Tingkat 1 (11 Nov 2026, "bisa buat lebih bagus lagi?" → "Ya, Tingkat 1"): cahaya di badan tokoh (sisi gelap, setengah
// badan kena bayangan), tekstur dunia (aspal, tanah, plester, genteng, kayu), gradasi ambient di dinding, tepi bayangan
// makin lembut menjauhi benda, pantulan dunia di kaca/genangan/lantai mengilap, detail (jendela berkusen, lisplang, kabel, AC).
// Banding-kemarin-sekarang.png = panel bercahaya versi 10 Nov (kiri) vs tingkat 1 (kanan). UjiGerak.mp4 = kamera bergerak 3 dtk.
// Render lembar: node tools/render-thumb.cjs shared/locations/_proyeksi/v2/contoh/ContohCahaya.tsx shared/locations/_proyeksi/v2/contoh/ContohCahaya --only
// Satu panel ukuran penuh: PANEL=A1 node tools/render-thumb.cjs ... (A0, A1, B0, B1)
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { Dunia3D, tegak, lantai, plafon, dindingBerlubang, bidang, lingkaranDatar, jendela, kabel, type Benda, type DuniaProps, type Tekstur } from '../Dunia';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;

// ------------------------------------------------------------------ A. luar ruang, sore
const papanTeks = (w: number, h: number, warna: string, teks: string, ukuran: number) => ({
  w,
  h,
  isi: (
    <>
      <rect width={w} height={h} fill={warna} />
      <text x={w / 2} y={h * 0.7} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={ukuran} fill="#FFF9EF" letterSpacing="3">
        {teks}
      </text>
    </>
  ),
});
const PLESTER: Tekstur = { jenis: 'plester' };
const kacaJendela = (hadap: '+x' | '-x', x: number, a0: number, a1: number, y0: number, y1: number, bingkai: string): Benda[] => jendela(hadap, x, a0, a1, y0, y1, { kusen: bingkai });
const atapMiring = (sisi: 1 | -1, z0: number, z1: number, h: number, warna: string): Benda[] => [
  bidang(
    [
      [sisi * 3.0, h, z0 - 0.4],
      [sisi * 3.0, h, z1 + 0.4],
      [sisi * 7.6, h + 1.8, z1 + 0.4],
      [sisi * 7.6, h + 1.8, z0 - 0.4],
    ],
    warna,
    { geser: -0.8, tekstur: { jenis: 'genteng', ukuran: 0.32 } },
  ),
  // lisplang (papan tepi atap)
  tegak(sisi > 0 ? '-x' : '+x', sisi * 3.0, z0 - 0.4, z1 + 0.4, h - 0.17, h + 0.03, '#EFE6D6', { geser: -0.85 }),
];
const tokoA = (sisi: 1 | -1, z0: number, z1: number, h: number, dinding: string, atap: string): Benda[] => [
  { jenis: 'balok', x0: sisi > 0 ? 3.6 : -10, x1: sisi > 0 ? 10 : -3.6, y0: 0, y1: h, z0, z1, warna: dinding, tekstur: PLESTER },
  ...atapMiring(sisi, z0, z1, h, atap),
];
const LUAR: Benda[] = [
  lantai(-60, 60, -20, 140, 0, '#CFC4AE', { tekstur: { jenis: 'tanah' } }),
  lantai(-2.8, 2.8, -20, 40, 0.002, '#77736C', { tekstur: { jenis: 'aspal' } }),
  lantai(-3.3, -2.8, -20, 40, 0.003, '#59615C'),
  lantai(2.8, 3.3, -20, 40, 0.003, '#59615C'),
  lantai(0.9, 1.9, 10.4, 11.3, 0.004, '#625F59'),
  lantai(-1.7, -0.6, 12.6, 13.8, 0.004, '#625F59'),
  lantai(-2.8, 2.8, 16.2, 16.6, 0.005, '#3B3F3D'),
  lingkaranDatar(1.0, 8.6, 0.9, 0.55, 0.006, '#9FC0CF', { bahan: 'air' }),
  // kiri: toko kelontong (menghadap +x, kena matahari)
  ...tokoA(-1, 3, 13, 3.4, '#E3D6BC', '#B5654A'),
  tegak('+x', -3.58, 5.0, 6.1, 0, 2.2, '#7A5B3E'),
  tegak('+x', -3.56, 5.15, 5.95, 1.3, 2.0, '#9DBBC8', { bahan: 'kaca' }),
  ...kacaJendela('+x', -3.6, 7.2, 8.6, 0.95, 2.1, '#8B6648'),
  ...kacaJendela('+x', -3.6, 10.2, 11.6, 0.95, 2.1, '#8B6648'),
  tegak('+x', -3.57, 4.6, 9.6, 2.5, 3.12, '#C24E4E', { papan: papanTeks(500, 62, '#C24E4E', 'TOKO KELONTONG', 40), geser: -0.02 }),
  bidang([[-3.6, 2.42, 4.4], [-3.6, 2.42, 9.8], [-2.45, 2.02, 9.8], [-2.45, 2.02, 4.4]], '#3F7FA8', { geser: -0.3 }),
  { jenis: 'balok', x0: -3.4, x1: -2.95, y0: 0.42, y1: 0.48, z0: 6.3, z1: 8.3, warna: '#B9875C' },
  { jenis: 'balok', x0: -3.35, x1: -3.0, y0: 0, y1: 0.42, z0: 6.45, z1: 6.55, warna: '#8B6648' },
  { jenis: 'balok', x0: -3.35, x1: -3.0, y0: 0, y1: 0.42, z0: 8.05, z1: 8.15, warna: '#8B6648' },
  { jenis: 'balok', x0: -3.5, x1: -3.15, y0: 0, y1: 0.38, z0: 9.7, z1: 10.05, warna: '#C9805A' },
  { jenis: 'tajuk', X: -3.32, Y: 0.66, Z: 9.88, r: 0.34, warna: '#5E8B6C' },
  ...tokoA(-1, 13.6, 22, 3.1, '#BFD0B6', '#A85B45'),
  ...kacaJendela('+x', -3.6, 15.0, 16.4, 0.95, 2.1, '#5F7F70'),
  tegak('+x', -3.58, 18.4, 19.4, 0, 2.2, '#5F7F70'),
  ...tokoA(-1, 22.6, 30, 3.3, '#C98F7A', '#9A503C'),
  // kanan: toko dua lantai (menghadap -x, membelakangi matahari)
  ...tokoA(1, 7, 16, 6.0, '#A9BCC4', '#8B4F3F'),
  ...jendela('-x', 3.6, 8.0, 13.5, 0.15, 2.4, { kusen: '#59615E', kaca: '#8FB3C2', tebal: 0.09, ambang: false }),
  // unit AC luar di lantai dua + kabel listrik dari tiang
  { jenis: 'balok', x0: 3.18, x1: 3.6, y0: 3.95, y1: 4.52, z0: 7.3, z1: 8.15, warna: '#ECE8DF' },
  { jenis: 'balok', x0: 3.16, x1: 3.2, y0: 4.04, y1: 4.42, z0: 7.45, z1: 7.85, warna: '#8E9692' },
  tegak('-x', 3.57, 8.0, 13.5, 2.6, 3.15, '#8B4354', { papan: papanTeks(550, 55, '#8B4354', 'SERVIS HP • PULSA', 34), geser: -0.04 }),
  ...kacaJendela('-x', 3.6, 8.4, 9.9, 3.7, 5.0, '#4E6670'),
  ...kacaJendela('-x', 3.6, 11.6, 13.1, 3.7, 5.0, '#4E6670'),
  ...tokoA(1, 16.6, 25, 3.4, '#D6B7A7', '#7E5A4A'),
  ...kacaJendela('-x', 3.6, 18.0, 19.4, 0.95, 2.1, '#8B4354'),
  ...tokoA(1, 25.6, 32, 3.2, '#EAD9A8', '#B5654A'),
  // ujung jalan: rumah menghadap kamera
  { jenis: 'balok', x0: -6, x1: 6, y0: 0, y1: 4.2, z0: 40, z1: 46, warna: '#F1EEE4' },
  tegak('-z', 39.98, -1.2, 1.2, 0, 2.4, '#3E7F6A'),
  // tiang listrik + palang + kabel
  { jenis: 'tiang', X: -3.05, Z: 11.6, tinggi: 7.5, r: 0.11, warna: '#8E9692' },
  { jenis: 'tiang', X: 3.1, Z: 21, tinggi: 7.5, r: 0.11, warna: '#8E9692' },
  { jenis: 'balok', x0: -3.6, x1: -2.5, y0: 7.0, y1: 7.09, z0: 11.55, z1: 11.65, warna: '#7D8580' },
  { jenis: 'balok', x0: 2.55, x1: 3.65, y0: 7.0, y1: 7.09, z0: 20.95, z1: 21.05, warna: '#7D8580' },
  kabel([-3.5, 7.1, 11.6], [2.6, 7.1, 21], 0.45),
  kabel([-2.6, 7.1, 11.6], [3.6, 7.1, 21], 0.5),
  kabel([-3.5, 7.1, 11.6], [-3.4, 7.3, -6], 0.7),
  kabel([-2.6, 7.1, 11.6], [3.6, 5.4, 10.6], 0.25, '#3A3F3D', 0.012),
  kabel([3.65, 7.1, 21], [3.4, 7.2, 40], 0.6),
  kabel([2.6, 7.1, 21], [-2.9, 6.8, 34], 0.5),
  { jenis: 'tiang', X: -3.9, Z: 23.0, tinggi: 4.2, r: 0.2, warna: '#6B4A3A' },
  { jenis: 'tajuk', X: -3.9, Y: 5.2, Z: 23.0, r: 1.8, warna: '#6F9A7A' },
  { jenis: 'tajuk', X: -3.0, Y: 4.6, Z: 23.6, r: 1.4, warna: '#5E8B6C' },
  { jenis: 'tajuk', X: -4.6, Y: 6.3, Z: 22.6, r: 1.3, warna: '#76A283' },
  { jenis: 'tajuk', X: -3.2, Y: 6.0, Z: 22.4, r: 1.2, warna: '#6F9A7A' },
  // tokoh
  { jenis: 'tokoh', X: 1.0, Z: 5.6, gambar: (p) => <Person who="him" x={p.x} y={p.y} s={p.s} f={f} view="three" dir={-1} mood="thinking" gazeY={0.6} {...POSE.him.santai} /> },
  { jenis: 'tokoh', X: -2.5, Z: 7.6, tinggi: 0.35, lebar: 0.45, gambar: (p) => <Kucing x={p.x} y={p.y} s={p.s} f={f} pose="duduk" /> },
];
export const A: Omit<DuniaProps, 'cahaya' | 'id'> = {
  kam: { x: -0.5, z: 2.3, yaw: 13, h: 1.45, F: 1150, vy: 980 },
  benda: LUAR,
  matahari: { az: -72, el: 40, warna: '#FFD9A0' },
  suasana: {
    langit: ['#F6D7B0', '#FBE9CC'],
    bayangan: '#3C3A52',
    ambient: 0.62,
    diffuse: 0.75,
    kabut: { warna: '#F8E3C4', mulai: 12, penuh: 45, maks: 0.5 },
    nada: { warna: '#F2A65A', kuat: 0.07 },
  },
  f,
};

// ------------------------------------------------------------------ B. dalam ruang (kamar), sore, dengan lensa
const pemandangan = {
  w: 240,
  h: 220,
  isi: (
    <>
      <rect width="240" height="220" fill="#F9E6C6" />
      <rect y="150" width="240" height="70" fill="#E9D3B0" />
      <path d="M0 150L40 118L80 150Z" fill="#E2B49A" />
      <rect x="10" y="150" width="60" height="45" fill="#EBD9C0" />
      <circle cx="170" cy="120" r="40" fill="#BFD3B4" />
      <circle cx="205" cy="135" r="30" fill="#B2C9A8" />
      <circle cx="140" cy="140" r="26" fill="#C7DABD" />
    </>
  ),
};
const BUKU = ['#C24E4E', '#3E7FA0', '#F1C977', '#5F7F70', '#8B4354', '#E7899A', '#7E8FB0'];
const DALAM: Benda[] = [
  lantai(-2.2, 2.2, -1.5, 5, 0, '#C9A27E', { tekstur: { jenis: 'kayu', arah: 'v', ukuran: 0.18 }, kilap: 0.35 }),
  tegak('+x', -2.75, 1.0, 3.8, 0.4, 2.7, '#F9E6C6', { lapis: 0, memancar: true, lempar: false, terima: false, papan: pemandangan }),
  tegak('-z', 5, -2.2, 2.2, 0, 2.8, '#E8DCC4', { lapis: 0, tekstur: { jenis: 'plester', kuat: 0.5 } }),
  ...dindingBerlubang('+x', -2.2, -1.5, 5, 0, 2.8, [1.5, 3.3, 0.9, 2.2], '#DCE5D8', { lapis: 0, tekstur: { jenis: 'plester', kuat: 0.5 } }),
  tegak('-x', 2.2, -1.5, 5, 0, 2.8, '#E3D3BC', { lapis: 0, tekstur: { jenis: 'plester', kuat: 0.5 } }),
  plafon(-2.2, 2.2, -1.5, 5, 2.8, '#F1EADB', { tekstur: { jenis: 'plester', kuat: 0.3 } }),
  lingkaranDatar(-0.4, 2.9, 1.25, 0.85, 0.003, '#9CB8A6', { lapis: 0 }, 24),
  // kusen + kaca jendela (rangka melempar bayangan tipis di lantai)
  { jenis: 'balok', x0: -2.35, x1: -2.12, y0: 0.84, y1: 0.9, z0: 1.45, z1: 3.35, warna: '#F3EEE2' },
  { jenis: 'balok', x0: -2.35, x1: -2.15, y0: 2.2, y1: 2.26, z0: 1.45, z1: 3.35, warna: '#F3EEE2' },
  { jenis: 'balok', x0: -2.35, x1: -2.15, y0: 0.9, y1: 2.2, z0: 1.45, z1: 1.5, warna: '#F3EEE2' },
  { jenis: 'balok', x0: -2.35, x1: -2.15, y0: 0.9, y1: 2.2, z0: 3.3, z1: 3.35, warna: '#F3EEE2' },
  { jenis: 'balok', x0: -2.3, x1: -2.22, y0: 0.9, y1: 2.2, z0: 2.37, z1: 2.43, warna: '#F3EEE2' },
  { jenis: 'balok', x0: -2.3, x1: -2.22, y0: 1.52, y1: 1.58, z0: 1.5, z1: 3.3, warna: '#F3EEE2' },
  tegak('+x', -2.24, 1.5, 3.3, 0.9, 2.2, '#BFD6DE', { bahan: 'kaca', lempar: false, tembus: 0.72 }),
  { jenis: 'bukaan', pts: [[-2.2, 2.2, 1.5], [-2.2, 2.2, 3.3], [-2.2, 0.9, 3.3], [-2.2, 0.9, 1.5]] },
  // meja di sudut kiri belakang + laci + laptop + lampu meja
  { jenis: 'balok', x0: -2.2, x1: -0.7, y0: 0.72, y1: 0.77, z0: 4.3, z1: 5.0, warna: '#B9875C', teksturAtas: { jenis: 'kayu', arah: 'u', ukuran: 0.35, kuat: 0.7 } },
  ...[[-2.15, 4.35], [-0.78, 4.35], [-2.15, 4.92], [-0.78, 4.92]].map(([x, z]) => ({ jenis: 'balok', x0: x, x1: x + 0.05, y0: 0, y1: 0.72, z0: z, z1: z + 0.05, warna: '#8B6648' }) as Benda),
  { jenis: 'balok', x0: -2.15, x1: -1.6, y0: 0.38, y1: 0.72, z0: 4.38, z1: 4.98, warna: '#A87A52' },
  { jenis: 'balok', x0: -1.75, x1: -1.25, y0: 0.77, y1: 0.795, z0: 4.45, z1: 4.75, warna: '#59615E' },
  bidang([[-1.75, 0.795, 4.75], [-1.25, 0.795, 4.75], [-1.25, 1.08, 4.85], [-1.75, 1.08, 4.85]], '#3E4743'),
  { jenis: 'balok', x0: -1.03, x1: -0.87, y0: 0.77, y1: 0.8, z0: 4.62, z1: 4.78, warna: '#3E4743' },
  { jenis: 'tiang', X: -0.95, Z: 4.7, tinggi: 0.4, r: 0.015, warna: '#3E4743', y0: 0.8 },
  { jenis: 'balok', x0: -1.11, x1: -0.79, y0: 1.18, y1: 1.3, z0: 4.54, z1: 4.86, warna: '#2F6B5A' },
  // kursi menghadap meja
  { jenis: 'balok', x0: -1.65, x1: -1.2, y0: 0.44, y1: 0.49, z0: 3.75, z1: 4.15, warna: '#8B6648' },
  { jenis: 'balok', x0: -1.65, x1: -1.2, y0: 0.49, y1: 0.95, z0: 3.72, z1: 3.77, warna: '#8B6648' },
  ...[[-1.64, 3.76], [-1.25, 3.76], [-1.64, 4.1], [-1.25, 4.1]].map(([x, z]) => ({ jenis: 'balok', x0: x, x1: x + 0.04, y0: 0, y1: 0.44, z0: z, z1: z + 0.04, warna: '#6B4A3A' }) as Benda),
  // rak + buku di atas meja
  { jenis: 'balok', x0: -2.05, x1: -0.85, y0: 1.55, y1: 1.6, z0: 4.72, z1: 5, warna: '#B9875C' },
  ...BUKU.map((w, i) => ({ jenis: 'balok', x0: -2.0 + i * 0.13, x1: -2.0 + i * 0.13 + 0.1, y0: 1.6, y1: 1.8 + (i % 3) * 0.04, z0: 4.78, z1: 4.97, warna: w }) as Benda),
  // poster
  tegak('-z', 4.99, -0.45, 0.25, 1.35, 2.25, '#F3EEE2', {
    geser: -0.02,
    papan: { w: 140, h: 180, isi: <><rect width="140" height="180" fill="#F3EEE2" /><circle cx="70" cy="70" r="38" fill="#E7A86A" /><rect x="22" y="128" width="96" height="9" fill="#8B4354" /><rect x="34" y="146" width="72" height="7" fill="#95B8A2" /></> },
  }),
  // tanaman di depan lensa (latar depan buram)
  { jenis: 'balok', x0: 0.68, x1: 0.92, y0: 0, y1: 0.36, z0: 1.28, z1: 1.52, warna: '#C9805A' },
  { jenis: 'tajuk', X: 0.8, Y: 0.66, Z: 1.4, r: 0.24, warna: '#5E8B6C' },
  { jenis: 'tajuk', X: 0.68, Y: 0.84, Z: 1.36, r: 0.18, warna: '#6F9A7A' },
  { jenis: 'tajuk', X: 0.93, Y: 0.8, Z: 1.48, r: 0.16, warna: '#76A283' },
  // tokoh
  { jenis: 'tokoh', X: -0.9, Z: 2.5, gambar: (p) => <Person who="him" x={p.x} y={p.y} s={p.s} f={f} view="three" dir={-1} mood="thinking" gazeY={0.4} {...POSE.him.santai} /> },
  { jenis: 'tokoh', X: 0.1, Z: 3.1, tinggi: 0.3, lebar: 0.55, gambar: (p) => <Kucing x={p.x} y={p.y} s={p.s} f={f} pose="tidur" /> },
];
export const B: Omit<DuniaProps, 'cahaya' | 'id'> = {
  kam: { x: 1.1, z: 0.3, yaw: -38, h: 1.3, F: 1150, vy: 880 },
  benda: DALAM,
  matahari: { az: -100, el: 30, warna: '#FFD39A' },
  lampu: [
    { pos: [-0.95, 1.13, 4.7], warna: '#FFC66E', kuat: 1.1, jangkau: 2.0, bola: true },
    ...Array.from({ length: 6 }, (_, i) => ({ pos: [-2.0 + i * 0.22, 2.08 + 0.05 * Math.sin(i * 1.7), 4.96] as [number, number, number], warna: '#FFD98A', kuat: 0.35, jangkau: 0.55, bola: true })),
  ],
  suasana: { langit: ['#F6D7B0', '#FBE9CC'], bayangan: '#4A3A48', ambient: 0.74, diffuse: 0.8, pantul: 0.14, nada: { warna: '#F2A65A', kuat: 0.05 } },
  lensa: { fokus: 2.97, bukaan: 0.06 },
  f,
};

// ------------------------------------------------------------------ lembar
const PANEL: Record<string, [typeof A, boolean, string]> = {
  A0: [A, false, 'A · luar sore · SEBELUM'],
  A1: [A, true, 'A · luar sore · SESUDAH'],
  B0: [B, false, 'B · dalam ruang · SEBELUM'],
  B1: [B, true, 'B · dalam ruang · SESUDAH'],
};
const Satu = ({ k, label }: { k: string; label: boolean }) => {
  const [s, c, t] = PANEL[k];
  return (
    <>
      <Dunia3D {...s} cahaya={c} id={`cc-${k}`} lensa={c ? s.lensa : undefined} />
      {label && (
        <>
          <rect x="0" y="1790" width="1080" height="130" fill={P.ink} opacity=".86" />
          <text x="40" y="1876" fontFamily="Lato" fontWeight="900" fontSize="58" fill={c ? '#F1C977' : P.cream}>{t}</text>
        </>
      )}
    </>
  );
};
const pilih = typeof process !== 'undefined' ? process.env.PANEL : undefined;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cc-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {pilih && PANEL[pilih] ? (
      <g clipPath="url(#cc-klip)">
        <Satu k={pilih} label />
      </g>
    ) : (
      <>
        {['A0', 'A1', 'B0', 'B1'].map((k, i) => (
          <g key={k} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
            <g clipPath="url(#cc-klip)">
              <Satu k={k} label />
            </g>
          </g>
        ))}
        <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
      </>
    )}
  </svg>
);
