// ⚠️ ATURAN WAJIB (11 Nov 2026): dunia video Less. (semua seri) dibangun dengan sistem ini sebagai BAWAAN; flat 2D dari
// depan dengan perspektif digambar hanya kalau pengguna memintanya. Cahaya berarah, bayangan jatuh, kedalaman, bokeh,
// pantulan kaca dan ambient wajib ikut: itulah isi file ini. Lihat references/arahan-pengguna.md "ATURAN WAJIB".
//
// Dunia3D (_proyeksi v2, 10–11 Nov 2026; atas permintaan pengguna): sistem cahaya UMUM untuk mesin proyeksi v1.
// Lokasi apa pun dibangun dari benda sederhana dalam METER (balok, muka/bidang, tiang, tajuk pohon, tokoh rig, bukaan,
// garis/kabel), lalu sistem ini menghitung sendiri:
//  - pencahayaan: matahari (arah) + lampu titik, per muka (Lambert), sebagai lapisan terang/gelap di atas warna dasar;
//  - bayangan jatuh: setiap benda pelempar diproyeksikan ke setiap muka penerima yang menghadap matahari. Tepinya tajam
//    di dekat benda dan makin lembut menjauh (penumbra bertingkat, suasana.penumbra). Cahaya jendela muncul sendiri dari
//    dinding berlubang, lengkap dengan berkas cahaya dan debu (bukaan);
//  - ambient: bayangan kontak di kaki dinding/benda/tokoh, gradasi gelap di kaki dinding, di bawah plafon dan di sudut
//    ruang (cekung), bayangan berwarna dingin, kabut jarak, kolam cahaya lampu;
//  - tekstur permukaan di ruang dunia (ikut perspektif dan cahaya, tidak "berenang" saat kamera bergerak): plester,
//    aspal, tanah, kayu, ubin, genteng (MukaDef.tekstur, balok.tekstur);
//  - pantulan sungguhan: dunia dicerminkan terhadap bidang kaca/air/lantai mengilap lalu digambar ulang di dalamnya
//    (Fresnel: makin miring makin memantul). Kaca, genangan, dan muka dengan `kilap` (pantulan buram). pantulan={false}
//    = hanya gradasi langit (lebih cepat);
//  - lensa: fokus pada jarak tertentu, blur menurut jarak (latar dan latar depan), bokeh dari lampu dan kilau;
//  - tokoh 2D dari rig ikut cahaya: sisi yang membelakangi cahaya lebih gelap (pita bayangan inti), cahaya tepi di sisi
//    sumber, lebih gelap bila cahaya dari belakang, dan bisa setengah badan kena bayangan (diuji 3 × 14 titik di badan).
//    Bayangan jatuhnya berbentuk siluet.
// cahaya={false} = tampilan mesin 3D lama (warna datar, tanpa sistem cahaya) untuk perbandingan.
// Tambahan 11 Nov 2026 (Kritik v3, kompatibel ke belakang): tokoh boleh punya `Y` (alas di ketinggian: patung di atas tugu,
// pemanjat bertali, sangkar tergantung) — posisi, uji bayangan di badan, siluet bayangan, dan pantulannya ikut Y;
// prop `langitIsi` (node atau (K) => node) digambar di atas gradien langit di belakang semua benda (awan, burung,
// pesawat yang ikut arah kamera; aturan "langit tidak boleh kosong").
// Kamera sama dengan v1 (Kam: x, z, yaw, h, F, vx, vy). Sumbu: X kanan, Y atas, Z menjauh. Tokoh 330 satuan rig = 1,65 m.
// Contoh: contoh/ContohCahaya.tsx (luar ruang sore + dalam ruang dengan lensa).
import React from 'react';
import { kamera, NEAR, type Kam, type V3, type Titik } from '../v1/Proyeksi';
import { Vignette, Grain } from '../../../film/v1/Depth';
import { Debu } from '../../../film/v1/Cahaya';

export type { Kam, V3, Titik };
type K = ReturnType<typeof kamera>;
type Kotak = { x0: number; y0: number; x1: number; y1: number };
type Proj = Kotak & { d: string };

// ------------------------------------------------------------------ vektor, warna, poligon
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => mul(a, 1 / (len(a) || 1));
const refleksi = (v: V3, n: V3): V3 => sub(v, mul(n, 2 * dot(v, n)));
const pusat = (ps: V3[]): V3 => mul(ps.reduce((s, p) => add(s, p), [0, 0, 0] as V3), 1 / ps.length);
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const newell = (ps: V3[]): V3 => {
  let n: V3 = [0, 0, 0];
  for (let i = 0; i < ps.length; i++) {
    const a = ps[i],
      b = ps[(i + 1) % ps.length];
    n = [n[0] + (a[1] - b[1]) * (a[2] + b[2]), n[1] + (a[2] - b[2]) * (a[0] + b[0]), n[2] + (a[0] - b[0]) * (a[1] + b[1])];
  }
  return norm(n);
};
const rgb = (h: string): V3 => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const heks = (c: V3) => '#' + c.map((v) => klamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
export const gelapkan = (h: string, k: number) => heks(mul(rgb(h), k));
export const campur = (a: string, b: string, t: number) => heks(add(mul(rgb(a), 1 - t), mul(rgb(b), t)));
/** Acak deterministik (mulberry32): tekstur sama di setiap frame selama geometrinya sama. */
function acak(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hashPts = (ps: V3[]) => {
  let h = 2166136261;
  for (const p of ps)
    for (const v of p) {
      h ^= Math.round(v * 100);
      h = Math.imul(h, 16777619);
    }
  return h >>> 0;
};

/** Sutherland–Hodgman: simpan bagian poligon dengan f(p) >= 0. Poligon boleh cekung. */
function potong(poly: V3[], f: (p: V3) => number): V3[] {
  const out: V3[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i],
      b = poly[(i + 1) % poly.length];
    const fa = f(a),
      fb = f(b);
    if (fa >= 0) out.push(a);
    if (fa >= 0 !== fb >= 0) out.push(add(a, mul(sub(b, a), fa / (fa - fb))));
  }
  return out;
}
const sisiDalam = (klip: V3[], n: V3) => {
  const c = pusat(klip);
  return klip.map((a, i) => {
    const b = klip[(i + 1) % klip.length];
    let m = cross(n, sub(b, a));
    if (dot(m, sub(c, a)) < 0) m = mul(m, -1);
    return { a, m };
  });
};
/** Potong poligon ke poligon CEMBUNG `klip` yang sebidang (normal n). */
function potongCembung(poly: V3[], klip: V3[], n: V3): V3[] {
  let out = poly;
  for (const { a, m } of sisiDalam(klip, n)) {
    if (out.length < 3) break;
    out = potong(out, (p) => dot(m, sub(p, a)));
  }
  return out;
}
const dalamCembung = (p: V3, poly: V3[], n: V3) => sisiDalam(poly, n).every(({ a, m }) => dot(m, sub(p, a)) >= -1e-6);
/** Selubung cembung 2D (monotone chain). */
function selubung(ps: [number, number][]): [number, number][] {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [],
    up: [number, number][] = [];
  for (const q of p) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
/** Basis bidang muka: e1 mendatar sepanjang muka, e2 naik di bidang (lantai/plafon: X dan Z). */
const basisMuka = (n0: V3): [V3, V3] => {
  const n: V3 = n0[1] < 0 ? mul(n0, -1) : n0;
  if (Math.abs(n[1]) > 0.9) return [[1, 0, 0], [0, 0, 1]];
  const e1 = norm(cross([0, 1, 0], n));
  return [e1, norm(cross(n, e1))];
};

// ------------------------------------------------------------------ jenis benda
export type Bahan = 'biasa' | 'kaca' | 'air';
/** Isi datar di permukaan (tulisan papan, poster): digambar di kotak lokal w×h yang dipetakan ke pts[0]=kiri atas,
 *  pts[1]=kanan atas, pts[3]=kiri bawah. Ikut gelap/terang dan bayangan. */
export type Papan = { w: number; h: number; isi: React.ReactNode };
/** Tekstur permukaan di ruang dunia. Acak tetap (seed dari geometri), jadi tidak berkedip antar-frame. */
export type Tekstur = {
  jenis: 'plester' | 'aspal' | 'tanah' | 'kayu' | 'ubin' | 'genteng';
  /** Pengali kekuatan (bawaan 1). */
  kuat?: number;
  /** Lebar papan kayu / sisi ubin / jarak baris genteng (m). */
  ukuran?: number;
  /** Kayu: 'u' = papan memanjang mendatar sepanjang muka (lantai: sumbu X), 'v' = tegak lurusnya (lantai: sumbu Z). */
  arah?: 'u' | 'v';
  seed?: number;
};
export type MukaDef = {
  pts: V3[];
  warna: string;
  n?: V3;
  bahan?: Bahan;
  dua?: boolean;
  lempar?: boolean;
  terima?: boolean;
  /** 0 = struktur (lantai, dinding, tanah): digambar lebih dulu sesuai urutan daftar. 1 = benda (bawaan). */
  lapis?: 0 | 1;
  memancar?: boolean;
  papan?: Papan;
  /** Geser urutan gambar (meter, negatif = digambar lebih belakangan/di depan). */
  geser?: number;
  /** Kaca tembus pandang 0..1 (jendela yang memperlihatkan luar). */
  tembus?: number;
  /** Garis di permukaan dalam koordinat dunia (papan lantai kayu, nat ubin): ikut perspektif, cahaya dan bayangan. */
  goresan?: { garis: V3[][]; warna: string; lebar?: number };
  tekstur?: Tekstur;
  /** Permukaan mengilap (lantai dipoles, meja pernis): kekuatan pantulan buram 0..0,4. */
  kilap?: number;
  /** internal (pantulan): hanya melempar bayangan, tidak digambar. */
  _bayangSaja?: boolean;
};
type Rahasia = { _bayangSaja?: boolean };
export type Benda =
  | ({ jenis: 'muka' } & MukaDef)
  | ({ jenis: 'balok'; x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; warna: string; atas?: string; bawah?: string; lempar?: boolean; tekstur?: Tekstur; teksturAtas?: Tekstur } & Rahasia)
  | ({ jenis: 'tiang'; X: number; Z: number; tinggi: number; r: number; warna: string; y0?: number } & Rahasia)
  | ({ jenis: 'tajuk'; X: number; Y: number; Z: number; r: number; warna: string } & Rahasia)
  /** Y = tinggi alas tokoh (m, bawaan 0 = tanah): patung di atas tugu, orang di balkon, pemanjat bertali. */
  | ({ jenis: 'tokoh'; X: number; Z: number; Y?: number; tinggi?: number; lebar?: number; gambar: (p: Titik) => React.ReactNode; _balik?: 'x' | 'y' } & Rahasia)
  | { jenis: 'bukaan'; pts: V3[] }
  /** Kabel/tali/garis tipis di ruang dunia (lebar dalam meter). */
  | { jenis: 'garis'; pts: V3[]; warna: string; lebar?: number };
/** az: derajat dari +Z searah +X (90 = matahari di arah +X). el: tinggi matahari (derajat). */
export type Matahari = { az: number; el: number; warna?: string };
export type Lampu = { pos: V3; warna?: string; kuat?: number; jangkau?: number; bola?: boolean };
export type Suasana = {
  langit: [string, string];
  bayangan?: string;
  ambient?: number;
  diffuse?: number;
  kabut?: { warna: string; mulai: number; penuh: number; maks?: number };
  /** Cahaya pantul (bounce) dari lantai/tanah yang terang: menerangi plafon dan dinding. 0..0,3. */
  pantul?: number;
  /** Lapisan warna akhir seluruh bingkai (sore hangat, malam dingin), dipakai di kedua mode. */
  nada?: { warna: string; kuat: number };
  /** Kelembutan tepi bayangan per meter jarak dari benda pelempar (bawaan 0,018; 0 = tajam semua). */
  penumbra?: number;
};
export type Lensa = { fokus: number; bukaan?: number };

// ------------------------------------------------------------------ pembuat benda
type Hadap = '+x' | '-x' | '+z' | '-z';
/** Bidang tegak menghadap `hadap`, di X atau Z = tetap; a = koordinat mendatar (Z untuk ±x, X untuk ±z). */
export function tegak(hadap: Hadap, tetap: number, a0: number, a1: number, y0: number, y1: number, warna: string, o: Partial<MukaDef> = {}): Benda {
  const P = (a: number, y: number): V3 => (hadap[1] === 'x' ? [tetap, y, a] : [a, y, tetap]);
  const n: V3 = hadap === '+x' ? [1, 0, 0] : hadap === '-x' ? [-1, 0, 0] : hadap === '+z' ? [0, 0, 1] : [0, 0, -1];
  const [aL, aR] = hadap === '+x' || hadap === '-z' ? [a0, a1] : [a1, a0];
  return { jenis: 'muka', pts: [P(aL, y1), P(aR, y1), P(aR, y0), P(aL, y0)], n, warna, ...o };
}
/** Lantai/tanah datar menghadap atas (lapis struktur). */
export const lantai = (x0: number, x1: number, z0: number, z1: number, y: number, warna: string, o: Partial<MukaDef> = {}): Benda => ({
  jenis: 'muka',
  pts: [[x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0]],
  n: [0, 1, 0],
  warna,
  lapis: 0,
  ...o,
});
export const plafon = (x0: number, x1: number, z0: number, z1: number, y: number, warna: string, o: Partial<MukaDef> = {}): Benda => ({
  jenis: 'muka',
  pts: [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]],
  n: [0, -1, 0],
  warna,
  lapis: 0,
  ...o,
});
/** Dinding dengan lubang (jendela/pintu): empat bidang di sekeliling lubang [a0, a1, y0, y1]. Cahaya lewat lubangnya. */
export function dindingBerlubang(hadap: Hadap, tetap: number, a0: number, a1: number, y0: number, y1: number, lubang: [number, number, number, number], warna: string, o: Partial<MukaDef> = {}): Benda[] {
  const [la0, la1, ly0, ly1] = lubang;
  return [
    tegak(hadap, tetap, a0, a1, y0, ly0, warna, o),
    tegak(hadap, tetap, a0, a1, ly1, y1, warna, o),
    tegak(hadap, tetap, a0, la0, ly0, ly1, warna, o),
    tegak(hadap, tetap, la1, a1, ly0, ly1, warna, o),
  ];
}
/** Bidang miring/bebas (atap, terpal): pts urut keliling; dua sisi terlihat. */
export const bidang = (pts: V3[], warna: string, o: Partial<MukaDef> = {}): Benda => ({ jenis: 'muka', pts, warna, dua: true, ...o });
/** Poligon datar (genangan, karpet bulat): n segi di bidang Y = y. */
export const lingkaranDatar = (X: number, Z: number, rx: number, rz: number, y: number, warna: string, o: Partial<MukaDef> = {}, n = 16): Benda => ({
  jenis: 'muka',
  pts: Array.from({ length: n }, (_, i) => {
    const a = (-i / n) * Math.PI * 2;
    return [X + Math.cos(a) * rx, y, Z + Math.sin(a) * rz] as V3;
  }),
  n: [0, 1, 0],
  warna,
  lapis: 0,
  ...o,
});
/** Jendela di fasad padat: kaca + kusen yang menonjol (melempar bayangan ke kaca dan dinding) + ambang + palang. */
export function jendela(
  hadap: Hadap,
  tetap: number,
  a0: number,
  a1: number,
  y0: number,
  y1: number,
  o: { kusen?: string; kaca?: string; tebal?: number; tonjol?: number; ambang?: string | false; palang?: 'tegak' | 'silang' | 'tidak'; tembus?: number } = {},
): Benda[] {
  const kusen = o.kusen ?? '#F3EEE2',
    t = o.tebal ?? 0.07,
    tj = o.tonjol ?? 0.05;
  const s = hadap[0] === '+' ? 1 : -1;
  const kotak = (b0: number, b1: number, yy0: number, yy1: number, n0: number, n1: number, warna: string): Benda => {
    const na = Math.min(tetap + s * n0, tetap + s * n1),
      nb = Math.max(tetap + s * n0, tetap + s * n1);
    return hadap[1] === 'x'
      ? { jenis: 'balok', x0: na, x1: nb, y0: yy0, y1: yy1, z0: b0, z1: b1, warna }
      : { jenis: 'balok', x0: b0, x1: b1, y0: yy0, y1: yy1, z0: na, z1: nb, warna };
  };
  const out: Benda[] = [
    tegak(hadap, tetap + s * 0.004, a0, a1, y0, y1, o.kaca ?? '#9DBBC8', { bahan: 'kaca', tembus: o.tembus, geser: 0.4, lempar: false }),
    kotak(a0 - t, a0, y0 - t, y1 + t, 0, tj, kusen),
    kotak(a1, a1 + t, y0 - t, y1 + t, 0, tj, kusen),
    kotak(a0, a1, y1, y1 + t, 0, tj, kusen),
    kotak(a0, a1, y0 - t, y0, 0, tj, kusen),
  ];
  const palang = o.palang ?? 'tegak';
  if (palang !== 'tidak') out.push(kotak((a0 + a1) / 2 - t * 0.3, (a0 + a1) / 2 + t * 0.3, y0, y1, 0, tj * 0.6, kusen));
  if (palang === 'silang') out.push(kotak(a0, a1, (y0 + y1) / 2 - t * 0.3, (y0 + y1) / 2 + t * 0.3, 0, tj * 0.6, kusen));
  if (o.ambang !== false) out.push(kotak(a0 - t - 0.05, a1 + t + 0.05, y0 - t - 0.05, y0 - t, 0, tj + 0.07, o.ambang ?? kusen));
  return out;
}
/** Kabel melengkung (parabola) dari a ke b; kendur = turun di tengah (m). */
export const kabel = (a: V3, b: V3, kendur = 0.35, warna = '#3A3F3D', lebar = 0.018, n = 18): Benda => ({
  jenis: 'garis',
  pts: Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - 4 * kendur * t * (1 - t), a[2] + (b[2] - a[2]) * t] as V3;
  }),
  warna,
  lebar,
});

// ------------------------------------------------------------------ bagian dalam
type MukaX = MukaDef & { nn: V3; c: V3; grup: number; idx: number };
type Pelempar = { pts: V3[]; cembung: boolean; n: V3 };
const SILUET: [number, number][] = [
  [-0.5, 0], [0.5, 0], [0.42, 0.45], [0.55, 0.62], [0.45, 0.8], [0.22, 0.84], [0.25, 0.97], [0, 1], [-0.25, 0.97], [-0.22, 0.84], [-0.45, 0.8], [-0.55, 0.62], [-0.42, 0.45],
];
const balokKeMuka = (b: Extract<Benda, { jenis: 'balok' }>): MukaDef[] => {
  const { x0, x1, y0, y1, z0, z1, warna } = b;
  const atas = b.atas ?? warna,
    bawah = b.bawah ?? warna;
  const o = { lempar: b.lempar, tekstur: b.tekstur };
  return [
    { pts: [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]], n: [0, 0, -1], warna, ...o },
    { pts: [[x1, y1, z1], [x0, y1, z1], [x0, y0, z1], [x1, y0, z1]], n: [0, 0, 1], warna, ...o },
    { pts: [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]], n: [-1, 0, 0], warna, ...o },
    { pts: [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]], n: [1, 0, 0], warna, ...o },
    { pts: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], n: [0, 1, 0], warna: atas, lempar: b.lempar, tekstur: b.teksturAtas },
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], n: [0, -1, 0], warna: bawah, lempar: b.lempar },
  ];
};
const GELAP_TX = '#2E2A24';

/** Cahaya di badan tokoh 2D: pita bayangan inti di sisi yang membelakangi sumber, gelap menyeluruh bila cahaya dari
 *  belakang, dan cahaya tepi di sisi sumber. a = arah rambat cahaya di layar (satuan). */
function filterSinar(fid: string, a: [number, number], o: { w1: number; w2: number; k1: number; k2: number; kb: number; rim: number; rimW: string; kuatRim: number; lembut: number }, mode: 'inti' | 'tepi') {
  const f = (v: number) => v.toFixed(2);
  if (mode === 'tepi')
    return (
      <filter id={fid} colorInterpolationFilters="sRGB" x="-15%" y="-10%" width="130%" height="120%">
        <feOffset in="SourceAlpha" dx={f(a[0] * o.rim)} dy={f(a[1] * o.rim)} result="o3" />
        <feComposite in="SourceAlpha" in2="o3" operator="out" result="tp" />
        <feGaussianBlur in="tp" stdDeviation="1.2" result="tpb" />
        <feFlood floodColor={o.rimW} floodOpacity={f(o.kuatRim)} />
        <feComposite in2="tpb" operator="in" result="rim" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="rim" />
        </feMerge>
      </filter>
    );
  return (
    <filter id={fid} colorInterpolationFilters="sRGB" x="-15%" y="-10%" width="130%" height="120%">
      {/* bayangan inti: lebih gelap, lebih jenuh dan hangat (kulit tidak jadi abu-abu) */}
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.982 -0.147 -0.015 0 0  -0.038 0.771 -0.013 0 0  -0.036 -0.122 0.838 0 0  0 0 0 1 0" result="gl" />
      <feOffset in="SourceAlpha" dx={f(-a[0] * o.w1)} dy={f(-a[1] * o.w1)} result="o1" />
      <feComposite in="SourceAlpha" in2="o1" operator="out" result="p1" />
      <feOffset in="SourceAlpha" dx={f(-a[0] * o.w2)} dy={f(-a[1] * o.w2)} result="o2" />
      <feComposite in="SourceAlpha" in2="o2" operator="out" result="p2" />
      <feComponentTransfer in="p1" result="q1">
        <feFuncA type="linear" slope={f(o.k1)} />
      </feComponentTransfer>
      <feGaussianBlur in="q1" stdDeviation={f(o.lembut)} result="q1b" />
      {/* pita lebar: tepi sangat lembut (peralihan terang-gelap bertahap di badan) */}
      <feComponentTransfer in="p2" result="q2">
        <feFuncA type="linear" slope={f(o.k2)} />
      </feComponentTransfer>
      <feGaussianBlur in="q2" stdDeviation={f(o.w2 * 0.3)} result="q2b" />
      <feFlood floodColor="#000" floodOpacity={f(o.kb)} result="fb" />
      <feComposite in="fb" in2="SourceAlpha" operator="in" result="qb" />
      <feMerge result="pm">
        <feMergeNode in="qb" />
        <feMergeNode in="q2b" />
        <feMergeNode in="q1b" />
      </feMerge>
      <feComposite in="pm" in2="SourceAlpha" operator="in" result="pk" />
      <feComposite in="gl" in2="pk" operator="in" result="sisi" />
    </filter>
  );
}

export type DuniaProps = {
  kam: Kam;
  benda: Benda[];
  matahari?: Matahari;
  lampu?: Lampu[];
  suasana: Suasana;
  lensa?: Lensa;
  /** false = mesin 3D lama tanpa sistem cahaya (untuk perbandingan). */
  cahaya?: boolean;
  /** Pantulan dunia di kaca, air dan muka `kilap` (bawaan true). false = hanya gradasi langit di kaca (lebih cepat). */
  pantulan?: boolean;
  f?: number;
  /** Awalan id unik per pemakaian (filter, gradien, mask). */
  id?: string;
  /** Isi langit (awan, burung, pesawat) di atas gradien langit, di belakang semua benda; aturan "langit tidak boleh
   *  kosong". Fungsi menerima kamera supaya isi langit ikut arah pandang (lihat jalan-kampung v2 `LangitHidup`).
   *  Tidak ikut dipantulkan (pantulan hanya gradien langit). */
  langitIsi?: React.ReactNode | ((K: K) => React.ReactNode);
  /** internal: sedang menggambar dunia cermin. */
  _pantulan?: { balikLangit: boolean; ringan?: boolean };
  /** internal: hanya gambar yang masuk kotak layar ini. */
  _klip?: [number, number, number, number];
};

export function Dunia3D({ kam, benda, matahari, lampu = [], suasana, lensa: lensaP, cahaya = true, pantulan = true, f = 0, id = 'd3', langitIsi, _pantulan, _klip }: DuniaProps) {
  const lensa = _pantulan ? undefined : lensaP;
  const K: K = kamera(kam);
  const C: V3 = [kam.x, K.h, kam.z];
  const yaw = ((kam.yaw ?? 0) * Math.PI) / 180;
  const kananKam: V3 = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const zKam = (p: V3) => K.cam(p[0], p[1], p[2])[2];
  const L: V3 | null = matahari && cahaya ? norm([Math.cos((matahari.el * Math.PI) / 180) * Math.sin((matahari.az * Math.PI) / 180), Math.sin((matahari.el * Math.PI) / 180), Math.cos((matahari.el * Math.PI) / 180) * Math.cos((matahari.az * Math.PI) / 180)]) : null;
  const D: V3 | null = L ? mul(L, -1) : null;
  const amb = suasana.ambient ?? 0.66,
    dif = suasana.diffuse ?? 0.5;
  const BAYANG = suasana.bayangan ?? '#2B2946';
  const TERANG = matahari?.warna ?? '#FFE3B3';
  const lampuAktif = cahaya ? lampu : [];
  const kPen = suasana.penumbra ?? 0.018;
  const pantulanAktif = cahaya && pantulan && !_pantulan;
  // arah datar tegak lurus sinar (untuk siluet tiang/tokoh/tajuk sebagai pelempar)
  const datarD: V3 = D && Math.hypot(D[0], D[2]) > 0.05 ? norm([D[0], 0, D[2]]) : [Math.sin(yaw), 0, Math.cos(yaw)];
  const lintang: V3 = norm(cross([0, 1, 0], datarD));

  /** Poligon dunia → path layar (dipotong di bidang dekat) + kotak layarnya. Arah putaran diseragamkan, jadi beberapa
   *  poligon boleh digabung dalam satu path tanpa saling melubangi. */
  const proyek = (pts: V3[]): Proj | null => {
    const cs = pts.map((p) => K.cam(p[0], p[1], p[2]));
    const out: [number, number][] = [];
    for (let i = 0; i < cs.length; i++) {
      const a = cs[i],
        b = cs[(i + 1) % cs.length];
      const ain = a[2] >= NEAR,
        bin = b[2] >= NEAR;
      if (ain) out.push(K.scr(a));
      if (ain !== bin) {
        const t = (NEAR - a[2]) / (b[2] - a[2]);
        out.push(K.scr([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]));
      }
    }
    if (out.length < 3) return null;
    let luas = 0,
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    for (let i = 0; i < out.length; i++) {
      const [x, y] = out[i],
        [xb, yb] = out[(i + 1) % out.length];
      luas += x * yb - xb * y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    if (luas < 0) out.reverse();
    return { d: 'M' + out.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z', x0, y0, x1, y1 };
  };
  const diLayar = (b: Kotak) => b.x1 >= -60 && b.x0 <= 1140 && b.y1 >= -60 && b.y0 <= 1980 && (!_klip || (b.x1 >= _klip[0] && b.x0 <= _klip[2] && b.y1 >= _klip[1] && b.y0 <= _klip[3]));

  // ---------- kumpulkan benda
  const muka: MukaX[] = [];
  const grupBalok: { z: number; muka: MukaX[] }[] = [];
  const tiang: Extract<Benda, { jenis: 'tiang' }>[] = [];
  const tajuk: Extract<Benda, { jenis: 'tajuk' }>[] = [];
  const tokoh: Extract<Benda, { jenis: 'tokoh' }>[] = [];
  const bukaan: Extract<Benda, { jenis: 'bukaan' }>[] = [];
  const garis: Extract<Benda, { jenis: 'garis' }>[] = [];
  const bsMuka: V3[][] = [];
  const bsTiang: typeof tiang = [],
    bsTajuk: typeof tajuk = [],
    bsTokoh: typeof tokoh = [];
  let g = 0;
  const tambahMuka = (m: MukaDef, grup: number) => {
    const mx: MukaX = { ...m, nn: m.n ? norm(m.n) : newell(m.pts), c: pusat(m.pts), grup, idx: muka.length };
    muka.push(mx);
    return mx;
  };
  for (const b of benda) {
    if (b.jenis === 'muka') {
      const { jenis: _j, ...m } = b;
      void _j;
      const nm = m.n ?? newell(m.pts);
      if (m._bayangSaja) {
        if (m.lempar !== false && Math.abs(nm[1]) < 0.9) bsMuka.push(m.pts);
        continue;
      }
      const lapis = m.lapis ?? (Math.abs(nm[1]) > 0.9 && Math.max(...m.pts.map((p) => p[1])) < 0.03 ? 0 : 1);
      tambahMuka({ ...m, lapis }, -1);
    } else if (b.jenis === 'balok') {
      if (b._bayangSaja) {
        if (b.lempar !== false) for (const m of balokKeMuka(b)) bsMuka.push(m.pts);
        continue;
      }
      g++;
      const ms = balokKeMuka(b).map((m) => tambahMuka({ ...m, lapis: 1 }, g));
      grupBalok.push({ z: zKam([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2]), muka: ms });
    } else if (b.jenis === 'tiang') (b._bayangSaja ? bsTiang : tiang).push(b);
    else if (b.jenis === 'tajuk') (b._bayangSaja ? bsTajuk : tajuk).push(b);
    else if (b.jenis === 'tokoh') (b._bayangSaja ? bsTokoh : tokoh).push(b);
    else if (b.jenis === 'garis') garis.push(b);
    else bukaan.push(b);
  }

  // ---------- pelempar bayangan (matahari)
  const pl = (pts: V3[], cembung = true): Pelempar => ({ pts, cembung, n: newell(pts) });
  const pelempar: Pelempar[] = [];
  const tiangQuad = (t: (typeof tiang)[number]): V3[] => {
    const y0 = t.y0 ?? 0,
      b: V3 = [t.X, y0, t.Z],
      a = mul(lintang, t.r);
    return [sub(b, a), add(b, a), add(add(b, a), [0, t.tinggi, 0]), add(sub(b, a), [0, t.tinggi, 0])];
  };
  const tajukDisk = (t: (typeof tajuk)[number]): V3[] => {
    const e2 = norm(cross(D ?? [0, 0, 1], lintang));
    return Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      return add([t.X, t.Y, t.Z], add(mul(lintang, Math.cos(a) * t.r), mul(e2, Math.sin(a) * t.r)));
    });
  };
  const siluetTokoh = (t: (typeof tokoh)[number]): V3[] => {
    const H = t.tinggi ?? 1.65,
      W = t.lebar ?? 0.5,
      ys = t._balik === 'y' ? -1 : 1;
    return SILUET.map(([u, v]) => add([t.X, (t.Y ?? 0) + ys * v * H, t.Z], mul(lintang, u * W)));
  };
  if (D) {
    for (const m of muka) if (m.lempar !== false && !m.memancar && m.bahan !== 'kaca' && m.bahan !== 'air' && m.lapis !== 0) pelempar.push(pl(m.pts));
    // struktur (dinding/plafon) juga melempar bayangan, kecuali lantai/tanah
    for (const m of muka) if (m.lapis === 0 && m.lempar !== false && !m.memancar && Math.abs(m.nn[1]) < 0.9) pelempar.push(pl(m.pts));
    for (const m of muka) if (m.lapis === 0 && m.lempar !== false && m.nn[1] < -0.9) pelempar.push(pl(m.pts));
    for (const pts of bsMuka) pelempar.push(pl(pts));
    for (const t of [...tiang, ...bsTiang]) pelempar.push(pl(tiangQuad(t)));
    for (const t of [...tajuk, ...bsTajuk]) pelempar.push(pl(tajukDisk(t)));
  }
  const pelemparTokoh: Pelempar[] = D ? [...tokoh, ...bsTokoh].map((t) => pl(siluetTokoh(t), false)) : [];

  /** Apakah sinar dari p ke arah matahari tertutup benda? */
  const diBayang = (p: V3, kecuali?: V3[]) => {
    if (!L) return false;
    for (const o of pelempar) {
      if (!o.cembung || o.pts === kecuali) continue;
      const dn = dot(o.n, L);
      if (Math.abs(dn) < 1e-6) continue;
      const t = dot(o.n, sub(o.pts[0], p)) / dn;
      if (t < 0.05) continue;
      if (dalamCembung(add(p, mul(L, t)), o.pts, o.n)) return true;
    }
    return false;
  };

  /** Normal yang menghadap kamera (muka dua sisi dibalik bila perlu); null = tidak terlihat. */
  const normalTerlihat = (m: MukaX): V3 | null => {
    const v = dot(m.nn, sub(C, m.c));
    if (v > 1e-4) return m.nn;
    if (m.dua) return mul(m.nn, -1);
    return null;
  };
  /** Terang muka (1 = warna dasar): ambient + matahari (+ lampu). */
  const terangMuka = (m: MukaX, n: V3) => {
    const ndl = L ? Math.max(0, dot(n, L)) : 0;
    const pantul = suasana.pantul ?? 0;
    let b = amb + dif * ndl + pantul * (Math.max(0, -n[1]) + 0.5 * (1 - Math.abs(n[1])));
    let hangat = 0;
    for (const l of lampuAktif) {
      const v = sub(l.pos, m.c),
        d = len(v);
      const k = Math.max(0, dot(n, norm(v))) * (l.kuat ?? 1) * Math.max(0, 1 - d / (l.jangkau ?? 3)) ** 2;
      b += k * 0.35;
      hangat += k;
    }
    return { b, ndl, hangat };
  };
  const nadaWarna = (b: number) => (b < 1 ? { warna: BAYANG, a: klamp((1 - b) * 0.95, 0, 0.78) } : { warna: TERANG, a: klamp((b - 1) * 1.0, 0, 0.4) });
  const arahLayar = (p: V3, v: V3): [number, number] => {
    const a = K.titik(...p),
      b = K.titik(...add(p, mul(norm(v), 0.4)));
    const dx = b.x - a.x,
      dy = b.y - a.y,
      l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  const arahLayarD = (p: V3): [number, number] => (D ? arahLayar(p, D) : [0, 1]);

  // ---------- lensa
  const bukaanL = lensa?.bukaan ?? 0.05;
  const stdBlur = (z: number) => (lensa ? Math.min(14, (bukaanL * K.F * Math.abs(1 / Math.max(0.3, z) - 1 / lensa.fokus)) / 2) : 0);
  const levelBlur = new Set<number>();
  const blurLv = (z: number) => {
    const lv = Math.round(stdBlur(z) / 1.2);
    if (lv > 0) levelBlur.add(lv);
    return lv;
  };
  const bokeh: { x: number; y: number; r: number; k: number; warna: string; z: number }[] = [];

  // ---------- kabut jarak
  const kabutA = (z: number) => (suasana.kabut ? klamp((z - suasana.kabut.mulai) / (suasana.kabut.penuh - suasana.kabut.mulai)) * (suasana.kabut.maks ?? 0.45) : 0);
  const kabutLama = (z: number) => (!cahaya ? klamp((z - 14) / 70, 0, 0.42) : 0);

  // ---------- tekstur permukaan (ruang dunia)
  const buatTekstur = (m: MukaX): React.ReactNode => {
    const tx = m.tekstur!;
    const kuat = tx.kuat ?? 1;
    const [e1, e2] = basisMuka(m.nn);
    const o = m.pts[0];
    const us = m.pts.map((q) => dot(sub(q, o), e1)),
      vs = m.pts.map((q) => dot(sub(q, o), e2));
    const u0 = Math.min(...us),
      u1 = Math.max(...us),
      v0 = Math.min(...vs),
      v1 = Math.max(...vs);
    const W = u1 - u0,
      Hh = v1 - v0,
      luas = W * Hh;
    const P = (u: number, v: number): V3 => add(o, add(mul(e1, u), mul(e2, v)));
    const rnd = acak(hashPts(m.pts) ^ (tx.seed ?? 0) ^ 0x9e3779b9);
    const r = (a: number, b: number) => a + (b - a) * rnd();
    const padat = new Map<string, string[]>();
    const tambah = (warna: string, a: number, pts: V3[], min = 1.2) => {
      const pr = proyek(pts);
      if (!pr || pr.x1 - pr.x0 + pr.y1 - pr.y0 < min || !diLayar(pr)) return;
      const key = warna + '|' + a.toFixed(3);
      const arr = padat.get(key);
      if (arr) arr.push(pr.d);
      else padat.set(key, [pr.d]);
    };
    const lembut: React.ReactNode[] = [];
    const noda = (u: number, v: number, rx: number, ry: number, gelap: boolean, a: number) => {
      const pr = proyek(Array.from({ length: 10 }, (_, i) => P(u + Math.cos((i / 10) * Math.PI * 2) * rx, v + Math.sin((i / 10) * Math.PI * 2) * ry)));
      if (!pr || pr.x1 - pr.x0 < 3 || !diLayar(pr)) return;
      lembut.push(<path key={lembut.length} d={pr.d} fill={`url(#${id}-${gelap ? 'ntg' : 'ntt'})`} opacity={(a * kuat).toFixed(3)} />);
    };
    const segi = (u: number, v: number, s: number, n = 5) => {
      const a0 = rnd() * Math.PI;
      return Array.from({ length: n }, (_, i) => {
        const a = a0 + (i / n) * Math.PI * 2;
        const rr = s * (0.7 + 0.6 * rnd());
        return P(u + Math.cos(a) * rr, v + Math.sin(a) * rr);
      });
    };
    /** Garis tipis sebagai segi empat di bidang (lebarnya ikut perspektif). */
    const garisQ = (ua: number, va: number, ub: number, vb: number, w: number) => {
      const du = ub - ua,
        dv = vb - va,
        l = Math.hypot(du, dv) || 1;
      const pu = (-dv / l) * (w / 2),
        pv = (du / l) * (w / 2);
      return [P(ua + pu, va + pv), P(ub + pu, vb + pv), P(ub - pu, vb - pv), P(ua - pu, va - pv)];
    };
    const tegakMuka = Math.abs(m.nn[1]) < 0.1;
    switch (tx.jenis) {
      case 'plester': {
        const nN = Math.min(70, Math.round(luas * 0.5));
        for (let i = 0; i < nN; i++) noda(r(u0, u1), r(v0, v1), r(0.25, 0.9), r(0.2, 0.6), rnd() < 0.7, r(0.06, 0.12));
        if (tegakMuka) {
          const nR = Math.min(40, Math.round(W * 0.9));
          for (let i = 0; i < nR; i++) {
            const u = r(u0 + 0.1, u1 - 0.1),
              Ln = Math.min(Hh * 0.8, r(0.25, 1.3)),
              w = r(0.06, 0.24);
            const pr = proyek([P(u - w / 2, v1), P(u + w / 2, v1), P(u + w * 0.12, v1 - Ln), P(u - w * 0.12, v1 - Ln)]);
            if (pr && diLayar(pr) && pr.x1 - pr.x0 > 1) lembut.push(<path key={'r' + i} d={pr.d} fill={`url(#${id}-rb)`} opacity={(r(0.08, 0.15) * kuat).toFixed(3)} />);
          }
        }
        const nB = Math.min(320, Math.round(luas * 2.5));
        for (let i = 0; i < nB; i++) tambah(rnd() < 0.6 ? GELAP_TX : '#FFFFFF', rnd() < 0.5 ? 0.1 : 0.17, segi(r(u0, u1), r(v0, v1), r(0.008, 0.024)));
        break;
      }
      case 'aspal':
      case 'tanah': {
        const asp = tx.jenis === 'aspal';
        const nN = Math.min(40, Math.round(luas * (asp ? 0.06 : 0.1)));
        for (let i = 0; i < nN; i++) noda(r(u0, u1), r(v0, v1), r(0.6, 2.2), r(0.4, 1.4), rnd() < 0.65, r(0.05, 0.09));
        if (asp) {
          const nT = Math.min(14, Math.round(luas * 0.025));
          for (let i = 0; i < nT; i++) {
            const u = r(u0, u1),
              v = r(v0, v1),
              rr = r(0.3, 0.9);
            tambah(GELAP_TX, rnd() < 0.5 ? 0.1 : 0.15, Array.from({ length: 7 }, (_, j) => P(u + Math.cos((j / 7) * Math.PI * 2) * rr * r(0.6, 1.2), v + Math.sin((j / 7) * Math.PI * 2) * rr * r(0.5, 1))));
          }
          const nK = Math.min(18, Math.round(luas * 0.03));
          for (let i = 0; i < nK; i++) {
            let u = r(u0, u1),
              v = r(v0, v1),
              a = r(0, Math.PI * 2);
            for (let j = 0; j < 6; j++) {
              const l = r(0.12, 0.35);
              a += r(-0.7, 0.7);
              const ub = u + Math.cos(a) * l,
                vb = v + Math.sin(a) * l;
              tambah(GELAP_TX, 0.3, garisQ(u, v, ub, vb, 0.012), 0.5);
              u = ub;
              v = vb;
            }
          }
        }
        const nB = Math.min(1500, Math.round(luas * (asp ? 5 : 3)));
        for (let i = 0; i < nB; i++) tambah(rnd() < 0.55 ? '#FFFFFF' : GELAP_TX, rnd() < 0.5 ? 0.12 : 0.2, segi(r(u0, u1), r(v0, v1), r(0.012, 0.035)));
        break;
      }
      case 'kayu': {
        const lebar = tx.ukuran ?? 0.16,
          sepanjangU = (tx.arah ?? 'u') === 'u';
        const [a0, a1, b0, b1] = sepanjangU ? [u0, u1, v0, v1] : [v0, v1, u0, u1];
        const Q = (a: number, b: number) => (sepanjangU ? [a, b] : [b, a]) as [number, number];
        const quad = (aa: number, ab: number, ba: number, bb: number) => [P(...Q(aa, ba)), P(...Q(ab, ba)), P(...Q(ab, bb)), P(...Q(aa, bb))];
        const garisAB = (aa: number, ba: number, ab: number, bb: number, w: number) => {
          const [ua, va] = Q(aa, ba),
            [ub, vb] = Q(ab, bb);
          return garisQ(ua, va, ub, vb, w);
        };
        for (let b = b0; b < b1 - 1e-6; b += lebar) {
          const bb = Math.min(b1, b + lebar);
          let a = a0 - r(0, 1.6);
          while (a < a1) {
            const pj = r(0.9, 2.2),
              s = Math.max(a0, a),
              aa = Math.min(a1, a + pj);
            const t = rnd();
            if (t < 0.4) tambah(GELAP_TX, t < 0.2 ? 0.05 : 0.09, quad(s, aa, b, bb));
            else if (t < 0.65) tambah('#FFFFFF', 0.07, quad(s, aa, b, bb));
            for (let k = 0; k < 2; k++) {
              const bk = r(b + 0.02, bb - 0.02);
              tambah(GELAP_TX, 0.07, garisAB(s, bk, aa, bk + r(-0.01, 0.01), 0.004), 0.5);
            }
            if (aa < a1) tambah(GELAP_TX, 0.35, garisAB(aa, b, aa, bb, 0.006), 0.5);
            a += pj;
          }
          if (bb < b1) tambah(GELAP_TX, 0.4, garisAB(a0, bb, a1, bb, 0.006), 0.5);
        }
        break;
      }
      case 'ubin': {
        const s = tx.ukuran ?? 0.4;
        for (let u = u0; u < u1 - 1e-6; u += s)
          for (let v = v0; v < v1 - 1e-6; v += s) {
            const t = rnd();
            const q = [P(u, v), P(Math.min(u1, u + s), v), P(Math.min(u1, u + s), Math.min(v1, v + s)), P(u, Math.min(v1, v + s))];
            if (t < 0.35) tambah(GELAP_TX, 0.04, q);
            else if (t < 0.55) tambah('#FFFFFF', 0.06, q);
          }
        for (let u = u0 + s; u < u1 - 1e-6; u += s) tambah(GELAP_TX, 0.32, garisQ(u, v0, u, v1, 0.008), 0.5);
        for (let v = v0 + s; v < v1 - 1e-6; v += s) tambah(GELAP_TX, 0.32, garisQ(u0, v, u1, v, 0.008), 0.5);
        break;
      }
      case 'genteng': {
        const s = tx.ukuran ?? 0.3;
        let baris = 0;
        for (let v = v0; v < v1 - 1e-6; v += s, baris++) {
          const vb = Math.min(v1, v + s);
          tambah(GELAP_TX, 0.2, [P(u0, v), P(u1, v), P(u1, Math.min(vb, v + 0.06)), P(u0, Math.min(vb, v + 0.06))]);
          tambah('#FFFFFF', 0.06, [P(u0, vb - 0.05), P(u1, vb - 0.05), P(u1, vb), P(u0, vb)]);
          for (let u = u0 + (baris % 2 ? 0.11 : 0); u < u1; u += 0.22) tambah(GELAP_TX, 0.16, garisQ(u, v, u, vb, 0.008), 0.5);
        }
        break;
      }
    }
    if (!lembut.length && !padat.size) return null;
    return (
      <>
        {lembut}
        {[...padat].map(([key, ds], i) => {
          const [w, a] = key.split('|');
          return <path key={'p' + i} d={ds.join('')} fill={w} opacity={(Number(a) * kuat).toFixed(3)} />;
        })}
      </>
    );
  };

  // ---------- gradasi ambient di dinding: kaki dinding, bawah plafon, sudut cekung
  const plafonY = muka.filter((m) => m.nn[1] < -0.9).map((m) => m.pts[0][1]);
  const dindingS = muka.filter((m) => m.lapis === 0 && Math.abs(m.nn[1]) < 0.1 && !m.memancar && (!m.bahan || m.bahan === 'biasa'));
  const pitaAO = (m: MukaX, n: V3): React.ReactNode => {
    if (Math.abs(n[1]) > 0.15) return null;
    const ys = m.pts.map((q) => q[1]);
    const y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    const pita: { d: string; a: number }[] = [];
    const tambah = (ps: V3[], a: number) => {
      if (ps.length < 3) return;
      const pr = proyek(ps);
      if (pr) pita.push({ d: pr.d, a });
    };
    if (y0 < 0.03)
      for (const [h, a] of [[1.6, 0.03], [0.95, 0.035], [0.55, 0.04], [0.28, 0.045], [0.12, 0.05]]) tambah(potong(m.pts, (q) => y0 + h - q[1]), a);
    if (plafonY.some((y) => Math.abs(y - y1) < 0.05))
      for (const [h, a] of [[0.6, 0.03], [0.3, 0.035], [0.12, 0.04]]) tambah(potong(m.pts, (q) => q[1] - (y1 - h)), a);
    if (m.lapis === 0) {
      const e1 = norm(cross([0, 1, 0], m.nn));
      for (let i = 0; i < m.pts.length; i++) {
        const a = m.pts[i],
          b = m.pts[(i + 1) % m.pts.length];
        if (Math.hypot(a[0] - b[0], a[2] - b[2]) > 0.01 || Math.abs(a[1] - b[1]) < 0.1) continue;
        const w = mul(e1, Math.sign(dot(sub(m.c, a), e1)) || 1);
        const cekung = dindingS.some((o) => {
          if (o === m || dot(o.nn, w) < 0.9 || Math.abs(dot(o.nn, sub(a, o.pts[0]))) > 0.03) return false;
          const e1o = norm(cross([0, 1, 0], o.nn));
          const ua = dot(a, e1o),
            uo = o.pts.map((q) => dot(q, e1o));
          return ua >= Math.min(...uo) - 0.05 && ua <= Math.max(...uo) + 0.05;
        });
        if (!cekung) continue;
        for (const [h, al] of [[0.7, 0.03], [0.35, 0.035], [0.14, 0.04]]) tambah(potong(m.pts, (q) => h - dot(sub(q, a), w)), al);
      }
    }
    if (!pita.length) return null;
    return (
      <g filter={`url(#${id}-aob)`}>
        {pita.map((p, i) => <path key={i} d={p.d} fill={BAYANG} opacity={p.a} />)}
      </g>
    );
  };

  // ---------- pantulan: dunia dicerminkan terhadap bidang muka, digambar ulang di dalam muka itu
  const pantulanMuka = (m: MukaX, pr: Proj, k: string): React.ReactNode => {
    const nP = m.nn,
      d0 = dot(nP, m.pts[0]);
    const sisi = dot(nP, C) - d0 >= 0 ? 1 : -1;
    const jarak = (q: V3) => sisi * (dot(nP, q) - d0);
    const cer = (q: V3): V3 => sub(q, mul(nP, 2 * (dot(nP, q) - d0)));
    const sumbu = [0, 1, 2].find((i) => Math.abs(nP[i]) > 0.999) ?? -1;
    const hasil: Benda[] = [];
    const cerMuka = (bm: MukaDef): Benda[] => {
      if (bm.pts === m.pts || bm._bayangSaja) return [];
      const nb = bm.n ? norm(bm.n) : newell(bm.pts);
      if (Math.abs(dot(nb, nP)) > 0.98 && bm.pts.every((q) => Math.abs(dot(nP, q) - d0) < 0.08)) return [];
      const js = bm.pts.map(jarak);
      const nr = refleksi(nb, nP);
      if (Math.max(...js) <= 0.002)
        return bm.lempar === false || bm.memancar || bm.bahan === 'kaca' || bm.bahan === 'air' ? [] : [{ jenis: 'muka', pts: bm.pts.map(cer), n: nr, warna: bm.warna, _bayangSaja: true }];
      const utuh = Math.min(...js) >= -0.002;
      const ps = utuh ? bm.pts : potong(bm.pts, (q) => jarak(q) - 0.002);
      if (ps.length < 3) return [];
      return [
        {
          ...bm,
          jenis: 'muka',
          pts: ps.map(cer),
          n: nr,
          papan: utuh ? bm.papan : undefined,
          kilap: undefined,
          goresan: bm.goresan ? { ...bm.goresan, garis: bm.goresan.garis.filter((gr) => gr.every((q) => jarak(q) > -0.002)).map((gr) => gr.map(cer)) } : undefined,
        },
      ];
    };
    for (const b of benda) {
      if (b.jenis === 'muka') {
        const { jenis: _j, ...bm } = b;
        void _j;
        hasil.push(...cerMuka(bm));
      } else if (b.jenis === 'balok') {
        if (b._bayangSaja) continue;
        if (sumbu < 0) {
          for (const fm of balokKeMuka(b)) hasil.push(...cerMuka({ ...fm, lapis: 1 }));
          continue;
        }
        const c = d0 * nP[sumbu];
        const [ka, kb] = ([['x0', 'x1'], ['y0', 'y1'], ['z0', 'z1']] as const)[sumbu];
        const lo = b[ka],
          hi = b[kb];
        const sg = sisi * nP[sumbu];
        const dekat: [number, number] = sg > 0 ? [Math.max(lo, c), hi] : [lo, Math.min(hi, c)];
        const jauh: [number, number] = sg > 0 ? [lo, Math.min(hi, c)] : [Math.max(lo, c), hi];
        for (const [rg, bayang] of [[dekat, false], [jauh, true]] as const) {
          if (rg[1] - rg[0] < 0.003) continue;
          const nb = { ...b, [ka]: 2 * c - rg[1], [kb]: 2 * c - rg[0], _bayangSaja: bayang || undefined };
          if (sumbu === 1) Object.assign(nb, { atas: b.bawah ?? b.warna, bawah: b.atas ?? b.warna, teksturAtas: undefined });
          hasil.push(nb);
        }
      } else if (b.jenis === 'tiang') {
        const y0 = b.y0 ?? 0;
        const jauhT = jarak([b.X, y0 + b.tinggi / 2, b.Z]) < 0 || undefined;
        if (sumbu === 1) hasil.push({ ...b, y0: 2 * d0 * nP[1] - (y0 + b.tinggi), _bayangSaja: jauhT });
        else {
          const q = cer([b.X, y0, b.Z]);
          hasil.push({ ...b, X: q[0], Z: q[2], _bayangSaja: jauhT });
        }
      } else if (b.jenis === 'tajuk') {
        const q = cer([b.X, b.Y, b.Z]);
        hasil.push({ ...b, X: q[0], Y: q[1], Z: q[2], _bayangSaja: jarak([b.X, b.Y, b.Z]) < 0 || undefined });
      } else if (b.jenis === 'tokoh') {
        const q = cer([b.X, b.Y ?? 0, b.Z]);
        hasil.push({ ...b, X: q[0], Y: q[1] || undefined, Z: q[2], _balik: sumbu === 1 ? 'y' : 'x', _bayangSaja: jarak([b.X, (b.Y ?? 0) + (b.tinggi ?? 1.65) / 2, b.Z]) < 0 || undefined });
      } else if (b.jenis === 'garis') {
        if (b.pts.every((q) => jarak(q) > 0)) hasil.push({ ...b, pts: b.pts.map(cer) });
      }
    }
    let mt: Matahari | undefined;
    if (matahari && L) {
      const Lr = refleksi(L, nP);
      mt = { ...matahari, el: (Math.asin(klamp(Lr[1], -1, 1)) * 180) / Math.PI, az: (Math.atan2(Lr[0], Lr[2]) * 180) / Math.PI };
    }
    const lr = lampuAktif.filter((l) => jarak(l.pos) > 0).map((l) => ({ ...l, pos: cer(l.pos) }));
    const cosT = Math.abs(dot(nP, norm(sub(C, m.c))));
    let R: number,
      kabur = 0;
    if (m.bahan === 'air') R = klamp(0.35 + 0.55 * (1 - cosT) ** 2, 0, 0.85);
    else if (m.bahan === 'kaca') R = klamp(0.14 + 0.62 * (1 - cosT) ** 3, 0, 0.7) * (1 - (m.tembus ?? 0) * 0.75);
    else {
      R = (m.kilap ?? 0) * (0.35 + 0.65 * (1 - cosT) ** 2);
      kabur = 2.5;
    }
    if (R < 0.02) return null;
    const dunia = <Dunia3D kam={kam} benda={hasil} matahari={mt} lampu={lr} suasana={{ ...suasana, nada: undefined }} cahaya pantulan={false} f={f} id={`${k}-r`} _pantulan={{ balikLangit: sumbu === 1, ringan: kabur > 0 }} _klip={[pr.x0, pr.y0, pr.x1, pr.y1]} />;
    if (!kabur) return <g opacity={R.toFixed(3)}>{dunia}</g>;
    const x0 = Math.max(-100, pr.x0 - 10),
      y0 = Math.max(-100, pr.y0 - 10),
      x1 = Math.min(1180, pr.x1 + 10),
      y1 = Math.min(2020, pr.y1 + 10);
    return (
      <g opacity={R.toFixed(3)}>
        <defs>
          <filter id={`${k}-rb`} filterUnits="userSpaceOnUse" x={x0.toFixed(0)} y={y0.toFixed(0)} width={(x1 - x0).toFixed(0)} height={(y1 - y0).toFixed(0)} colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={kabur} />
          </filter>
        </defs>
        <g filter={`url(#${k}-rb)`}>{dunia}</g>
      </g>
    );
  };

  // ---------- satu muka lengkap (dasar, papan, tekstur, ambient, nada, bayangan, kolam lampu, pantulan, kilap)
  let uid = 0;
  const gambarMuka = (m: MukaX, ringan = !!_pantulan?.ringan): React.ReactNode => {
    const n = normalTerlihat(m);
    if (!n) return null;
    const pr = proyek(m.pts);
    if (!pr || !diLayar(pr)) return null;
    const d = pr.d;
    const k = `${id}-m${m.idx}-${uid++}`;
    const klip = `url(#${k}-pc)`;
    let perluKlip = false;
    const kaca = m.bahan === 'kaca' || m.bahan === 'air';
    const zc = zKam(m.c);
    const kecil = pr.x1 - pr.x0 < 5 || pr.y1 - pr.y0 < 5;
    const papan = m.papan && m.pts.length === 4 ? K.bidang(m.pts[0], m.pts[1], m.pts[3], m.papan.w, m.papan.h) : null;
    const isi: React.ReactNode[] = [];
    // dasar
    if (kaca && cahaya) {
      isi.push(
        <defs key="kd">
          <linearGradient id={`${k}-g`} gradientUnits="userSpaceOnUse" x1="0" y1={pr.y0.toFixed(1)} x2="0" y2={pr.y1.toFixed(1)}>
            <stop offset="0" stopColor={campur(suasana.langit[1], '#FFFFFF', 0.35)} />
            <stop offset="0.55" stopColor={campur(m.warna, suasana.langit[0], 0.35)} />
            <stop offset="1" stopColor={gelapkan(m.warna, 0.82)} />
          </linearGradient>
        </defs>,
      );
      isi.push(<path key="kb" d={d} fill={`url(#${k}-g)`} opacity={1 - (m.tembus ?? 0)} />);
    } else isi.push(<path key="b" d={d} fill={!cahaya ? warnaLama(m.warna, n) : m.warna} opacity={kaca ? 1 - (m.tembus ?? 0) : 1} />);
    if (papan && m.papan) {
      perluKlip = true;
      isi.push(
        <g key="p" clipPath={klip}>
          <g transform={papan}>{m.papan.isi}</g>
        </g>,
      );
    }
    if (m.goresan) {
      const lebar = m.goresan.lebar ?? 1.5;
      const ds = m.goresan.garis.map((gr) => garisKlip(gr)).filter(Boolean) as string[];
      isi.push(
        <g key="gr" stroke={!cahaya ? warnaLama(m.goresan.warna, n) : m.goresan.warna} strokeWidth={lebar} fill="none">
          {ds.map((s, i) => <path key={i} d={s} />)}
        </g>,
      );
    }
    const klipDef = () => (perluKlip ? <defs key="pcd"><clipPath id={`${k}-pc`}><path d={d} /></clipPath></defs> : null);
    if (!cahaya) {
      if (kaca && m.pts.length === 4) isi.push(<path key="kl" d={K.poly(pita(m, n, 0.05, 0.35)) ?? ''} fill="#fff" opacity=".22" />);
      const kb = kabutLama(zc);
      if (kb > 0) isi.push(<path key="fl" d={d} fill="#DCE8EC" opacity={kb} />);
      return <g key={k}>{klipDef()}{isi}</g>;
    }
    if (m.tekstur && !kecil && !ringan) {
      const tx = buatTekstur(m);
      if (tx) {
        perluKlip = true;
        isi.push(<g key="tx" clipPath={klip}>{tx}</g>);
      }
    }
    if (!kaca && !m.memancar && !kecil && !ringan) {
      const ao = pitaAO(m, n);
      if (ao) {
        perluKlip = true;
        isi.push(<g key="ao" clipPath={klip}>{ao}</g>);
      }
    }
    if (!m.memancar) {
      // nada terang/gelap muka
      const { b, ndl } = terangMuka(m, n);
      const nd = nadaWarna(b);
      if (nd.a > 0.01) isi.push(<path key="t" d={d} fill={nd.warna} opacity={nd.a.toFixed(3)} />);
      // bayangan jatuh (hanya di sisi yang menghadap matahari), tepi makin lembut menjauhi pelempar
      if (D && L && ndl > 0.02 && m.terima !== false) {
        const d0 = dot(n, m.pts[0]),
          nD = dot(n, D);
        const tq = (q: V3) => (d0 - dot(n, q)) / nD;
        const lebarkan = (r: number) =>
          m.pts.map((q) => {
            const v = sub(q, m.c);
            return add(q, mul(v, r / (len(v) || 1)));
          });
        const grup = new Map<number, Proj & { ds: string[] }>();
        for (const o of [...pelempar, ...pelemparTokoh]) {
          if (o.pts === m.pts) continue;
          const p = potong(o.pts, (q) => dot(n, q) - d0 - 0.01);
          if (p.length < 3) continue;
          const ts = p.map(tq);
          const tMin = Math.max(0, Math.min(...ts)),
            tMax = Math.max(...ts);
          const N = kPen <= 0 || tMax - tMin < 0.35 ? 1 : Math.min(5, Math.ceil((tMax - tMin) / 0.7));
          const step = (tMax - tMin) / N;
          const penerima = lebarkan(3 * kPen * tMax + 0.04);
          for (let j = 0; j < N; j++) {
            let s = p;
            if (N > 1) {
              const lo = j === 0 ? -1e9 : tMin + step * (j - 0.35),
                hi = j === N - 1 ? 1e9 : tMin + step * (j + 1.35);
              s = potong(potong(p, (q) => tq(q) - lo), (q) => hi - tq(q));
              if (s.length < 3) continue;
            }
            const tMid = N > 1 ? tMin + step * (j + 0.5) : (tMin + tMax) / 2;
            const sp = potongCembung(s.map((q) => add(q, mul(D, tq(q)))), penerima, n);
            if (sp.length < 3) continue;
            const ps = proyek(sp);
            if (!ps || !diLayar(ps)) continue;
            const z = Math.max(0.3, zKam(pusat(sp)));
            const sg = klamp((kPen * tMid * K.F) / z, 0.7, 22);
            const lv = Math.round(Math.log2(sg / 0.7) * 2);
            const gr = grup.get(lv);
            if (!gr) grup.set(lv, { ...ps, ds: [ps.d] });
            else {
              gr.ds.push(ps.d);
              gr.x0 = Math.min(gr.x0, ps.x0);
              gr.y0 = Math.min(gr.y0, ps.y0);
              gr.x1 = Math.max(gr.x1, ps.x1);
              gr.y1 = Math.max(gr.y1, ps.y1);
            }
          }
        }
        if (grup.size) {
          perluKlip = true;
          const bs = b - dif * ndl;
          const a = klamp(((b - bs) / b) * 0.95, 0, 0.6);
          isi.push(
            <g key="s" clipPath={klip}>
              <g opacity={a.toFixed(3)}>
                {[...grup].map(([lv, gr]) => {
                  const sg = 0.7 * 2 ** (lv / 2),
                    pad = sg * 3 + 2;
                  const x0 = Math.max(-200, gr.x0 - pad),
                    y0 = Math.max(-200, gr.y0 - pad),
                    x1 = Math.min(1280, gr.x1 + pad),
                    y1 = Math.min(2120, gr.y1 + pad);
                  if (x1 <= x0 || y1 <= y0) return null;
                  const fid = `${k}-pn${lv}`;
                  return (
                    <g key={lv}>
                      <defs>
                        <filter id={fid} filterUnits="userSpaceOnUse" x={x0.toFixed(0)} y={y0.toFixed(0)} width={(x1 - x0).toFixed(0)} height={(y1 - y0).toFixed(0)} colorInterpolationFilters="sRGB">
                          <feGaussianBlur stdDeviation={sg.toFixed(2)} />
                        </filter>
                      </defs>
                      <path d={gr.ds.join('')} fill={BAYANG} filter={`url(#${fid})`} />
                    </g>
                  );
                })}
              </g>
            </g>,
          );
        }
      }
      // kolam cahaya lampu (cincin di bidang muka, mengikuti perspektif)
      for (const [li, l] of lampuAktif.entries()) {
        const jarak = dot(n, sub(l.pos, m.pts[0]));
        const R = l.jangkau ?? 3;
        if (jarak <= 0.02 || jarak > R) continue;
        const kaki = sub(l.pos, mul(n, jarak));
        const e1 = Math.abs(n[1]) > 0.9 ? kananKam : norm(cross([0, 1, 0], n));
        const e2 = norm(cross(n, e1));
        const rMaks = Math.sqrt(Math.max(0, R * R - jarak * jarak));
        const cincin: React.ReactNode[] = [];
        for (let r = 6; r >= 1; r--) {
          const rr = (rMaks * r) / 6;
          const ring = Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            return add(kaki, add(mul(e1, Math.cos(a) * rr), mul(e2, Math.sin(a) * rr)));
          });
          const cp = m.pts.length >= 3 ? potongCembung(ring, m.pts, n) : [];
          const s = cp.length >= 3 ? K.poly(cp) : null;
          if (s) cincin.push(<path key={r} d={s} fill={l.warna ?? '#FFC66E'} opacity={klamp((l.kuat ?? 1) * 0.08 * (1 - jarak / R))} />);
        }
        if (cincin.length) isi.push(<g key={'l' + li} filter={`url(#${id}-kol)`}>{cincin}</g>);
      }
      // pantulan dunia (kaca, air, muka mengilap)
      let adaPantulan = false;
      if (pantulanAktif && !kecil && !ringan && (kaca || (m.kilap ?? 0) > 0)) {
        const rf = pantulanMuka(m, pr, k);
        if (rf) {
          adaPantulan = true;
          perluKlip = true;
          isi.push(<g key="rf" clipPath={klip}>{rf}</g>);
        }
      }
      // kaca/air: garis kilap + kilau matahari
      if (kaca) {
        const redup = klamp(terangMuka(m, n).b, 0.4, 1) * (adaPantulan ? 0.55 : 1);
        const s1 = K.poly(pita(m, n, 0.12, 0.3)),
          s2 = K.poly(pita(m, n, 0.4, 0.47));
        if (s1) isi.push(<path key="k1" d={s1} fill="#FFFFFF" opacity={(0.34 * redup).toFixed(3)} />);
        if (s2) isi.push(<path key="k2" d={s2} fill="#FFFFFF" opacity={(0.22 * redup).toFixed(3)} />);
        if (L && !diBayang(m.c, m.pts)) {
          const R = sub(mul(n, 2 * dot(n, L)), L);
          const sp = dot(norm(R), norm(sub(C, m.c)));
          if (sp > 0.55) {
            const t = K.titik(...m.c);
            const r = Math.max(10, t.s * 200 * 0.5);
            const kuat = klamp((sp - 0.55) / 0.45);
            isi.push(
              <g key="sp">
                <defs>
                  <radialGradient id={`${k}-sp`} cx={t.x} cy={t.y - r * 0.3} r={r} gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFFDF5" stopOpacity={0.85 * kuat} />
                    <stop offset="1" stopColor={TERANG} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx={t.x} cy={t.y - r * 0.3} r={r} fill={`url(#${k}-sp)`} />
              </g>,
            );
            if (lensa) bokeh.push({ x: t.x, y: t.y - r * 0.3, r: 0, k: kuat, warna: '#FFF6DE', z: zc });
          }
        }
      }
    }
    const kb = kabutA(zc);
    if (kb > 0.01) isi.push(<path key="f" d={d} fill={suasana.kabut!.warna} opacity={kb.toFixed(3)} />);
    return (
      <g key={k}>
        {klipDef()}
        {isi}
      </g>
    );
  };
  /** Garis dunia → path layar, dipotong di bidang dekat kamera. */
  function garisKlip(gr: V3[]): string | null {
    const cs = gr.map((p) => K.cam(p[0], p[1], p[2]));
    const out: string[] = [];
    for (let i = 0; i + 1 < cs.length; i++) {
      let a = cs[i],
        b = cs[i + 1];
      if (a[2] < 0.3 && b[2] < 0.3) continue;
      if (a[2] < 0.3) a = add(a, mul(sub(b, a), (0.3 - a[2]) / (b[2] - a[2])));
      if (b[2] < 0.3) b = add(b, mul(sub(a, b), (0.3 - b[2]) / (a[2] - b[2])));
      const [ax, ay] = K.scr(a),
        [bx, by] = K.scr(b);
      out.push(`M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`);
    }
    return out.length ? out.join('') : null;
  }
  /** Pita kilap di muka (u + 0,7v di antara c0..c1, satuan relatif ukuran muka). */
  function pita(m: MukaX, n: V3, c0: number, c1: number): V3[] {
    const e1 = Math.abs(n[1]) > 0.9 ? kananKam : norm(cross([0, 1, 0], n));
    const e2 = norm(cross(n, e1));
    const w = norm(add(e1, mul(e2, 0.7)));
    const vs = m.pts.map((p) => dot(sub(p, m.c), w));
    const lo = Math.min(...vs),
      span = Math.max(...vs) - lo || 1;
    const f0 = (p: V3) => (dot(sub(p, m.c), w) - lo) / span;
    return potong(potong(m.pts, (p) => f0(p) - c0), (p) => c1 - f0(p));
  }
  /** Mode lama: warna gambar tangan (atas sedikit terang, sisi samping sedikit gelap). */
  function warnaLama(w: string, n: V3) {
    if (n[1] > 0.5) return gelapkan(w, 1.04);
    if (Math.abs(n[0]) > 0.6) return gelapkan(w, 0.9);
    return w;
  }

  // ---------- bayangan kontak (ambient occlusion) di lantai, di kaki bidang tegak
  const ao: React.ReactNode[] = [];
  const aoLebar: React.ReactNode[] = [];
  if (cahaya)
    for (const m of muka) {
      if (Math.abs(m.nn[1]) > 0.1 || m.bahan === 'kaca' || m.memancar) continue;
      const bawah = m.pts.filter((p) => p[1] < 0.03);
      if (bawah.length < 2) continue;
      if (!normalTerlihat(m)) continue;
      const nh = norm([m.nn[0], 0, m.nn[2]]);
      const [a, b] = bawah;
      const A0: V3 = [a[0], 0.004, a[2]],
        B0: V3 = [b[0], 0.004, b[2]];
      const s = proyek([A0, B0, add(B0, mul(nh, 0.4)), add(A0, mul(nh, 0.4))]);
      if (s && diLayar(s)) ao.push(<path key={'ao' + m.idx} d={s.d} fill={BAYANG} />);
      const s2 = proyek([A0, B0, add(B0, mul(nh, 1.3)), add(A0, mul(nh, 1.3))]);
      if (s2 && diLayar(s2) && Math.hypot(a[0] - b[0], a[2] - b[2]) > 0.6) aoLebar.push(<path key={'aw' + m.idx} d={s2.d} fill={BAYANG} />);
    }

  // ---------- struktur (lapis 0)
  const struktur = muka.filter((m) => m.lapis === 0);
  const strukturNode = (ringan: boolean) => (
    <g>
      {struktur.map((m) => gambarMuka(m, ringan || !!_pantulan?.ringan))}
      {aoLebar.length > 0 && (
        <g opacity=".1" filter={`url(#${id}-aow)`}>
          {aoLebar}
        </g>
      )}
      {ao.length > 0 && (
        <g opacity=".3" filter={`url(#${id}-ao)`}>
          {ao}
        </g>
      )}
      {suasana.kabut && cahaya && <rect x="-2000" y={K.vy - 320} width="5000" height="520" fill={`url(#${id}-hz)`} />}
    </g>
  );

  // ---------- benda (lapis 1), urut jauh → dekat
  type Gb = { z: number; node: React.ReactNode };
  const gb: Gb[] = [];
  for (const m of muka) if (m.lapis !== 0 && m.grup < 0) gb.push({ z: zKam(m.c) + (m.geser ?? 0), node: gambarMuka(m) });
  for (const gB of grupBalok) gb.push({ z: gB.z, node: <g key={'gb' + gB.z}>{gB.muka.map((m) => gambarMuka(m))}</g> });
  tiang.forEach((t, i) => {
    const y0 = t.y0 ?? 0;
    const b = K.titik(t.X, y0, t.Z),
      a = K.titik(t.X, y0 + t.tinggi, t.Z);
    if (b.z < 0.3) return;
    const wb = t.r * 2 * b.s * 200,
      wa = t.r * 2 * a.s * 200 * 0.85;
    if (!diLayar({ x0: Math.min(a.x, b.x) - wb, x1: Math.max(a.x, b.x) + wb, y0: Math.min(a.y, b.y), y1: Math.max(a.y, b.y) })) return;
    const d = `M${b.x - wb / 2} ${b.y}L${a.x - wa / 2} ${a.y}H${a.x + wa / 2}L${b.x + wb / 2} ${b.y}Z`;
    const gid = `${id}-tg${i}`;
    let isi: React.ReactNode;
    if (!cahaya) isi = <><path d={d} fill={t.warna} /><path d={`M${b.x + wb * 0.1} ${b.y}L${a.x + wa * 0.1} ${a.y}`} stroke="#fff" strokeWidth={wb * 0.2} opacity=".2" /></>;
    else {
      const gelap = diBayang([t.X, y0 + t.tinggi * 0.5, t.Z]);
      const kiriTerang = L ? dot(L, kananKam) < 0 : true;
      const cT = gelap ? campur(t.warna, BAYANG, 0.3) : campur(t.warna, TERANG, 0.25),
        cG = campur(t.warna, BAYANG, 0.38);
      isi = (
        <>
          <defs>
            <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={b.x - wb / 2} y1="0" x2={b.x + wb / 2} y2="0">
              <stop offset="0" stopColor={kiriTerang ? cT : cG} />
              <stop offset="1" stopColor={kiriTerang ? cG : cT} />
            </linearGradient>
          </defs>
          <path d={d} fill={`url(#${gid})`} />
        </>
      );
    }
    gb.push({ z: b.z, node: <g key={'t' + i}>{isi}{kabutA(b.z) > 0.01 && <path d={d} fill={suasana.kabut!.warna} opacity={kabutA(b.z)} />}</g> });
  });
  tajuk.forEach((t, i) => {
    const p = K.titik(t.X, t.Y, t.Z);
    if (p.z < 0.3) return;
    const r = t.r * p.s * 200;
    if (!diLayar({ x0: p.x - r, x1: p.x + r, y0: p.y - r, y1: p.y + r })) return;
    const gid = `${id}-tj${i}`;
    let isi: React.ReactNode;
    if (!cahaya) isi = <><circle cx={p.x} cy={p.y} r={r} fill={t.warna} /><circle cx={p.x - r * 0.3} cy={p.y - r * 0.35} r={r * 0.35} fill="#fff" opacity=".1" /></>;
    else {
      const [dx, dy] = arahLayarD([t.X, t.Y, t.Z]);
      const gelap = diBayang([t.X - (L?.[0] ?? 0) * t.r * 1.05, t.Y + t.r * 0.2, t.Z - (L?.[2] ?? 0) * t.r * 1.05], tajukDisk(t));
      isi = (
        <>
          <defs>
            <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={p.x - dx * r * 0.45} cy={p.y - dy * r * 0.45} r={r * 1.45}>
              <stop offset="0" stopColor={gelap ? campur(t.warna, BAYANG, 0.15) : campur(t.warna, TERANG, 0.3)} />
              <stop offset="0.55" stopColor={t.warna} />
              <stop offset="1" stopColor={campur(t.warna, BAYANG, 0.42)} />
            </radialGradient>
          </defs>
          <circle cx={p.x} cy={p.y} r={r} fill={`url(#${gid})`} />
        </>
      );
      if (lensa && L && p.z > lensa.fokus * 1.3)
        for (const a of [-0.6, 0.15, 0.8]) bokeh.push({ x: p.x - dx * r * 0.9 + Math.cos(a) * r * 0.25, y: p.y - dy * r * 0.9 + Math.sin(a) * r * 0.3, r: 0, k: 0.55, warna: '#FFF8E6', z: p.z });
    }
    gb.push({ z: p.z, node: <g key={'tj' + i}>{isi}{kabutA(p.z) > 0.01 && <circle cx={p.x} cy={p.y} r={r} fill={suasana.kabut!.warna} opacity={kabutA(p.z)} />}</g> });
  });
  // kabel/garis: per ruas, supaya urutan kedalamannya benar di sepanjang kabel
  garis.forEach((gs, i) => {
    for (let j = 0; j + 1 < gs.pts.length; j++) {
      const a = K.cam(...gs.pts[j]),
        b = K.cam(...gs.pts[j + 1]);
      if (a[2] < 0.3 || b[2] < 0.3) continue;
      const [ax, ay] = K.scr(a),
        [bx, by] = K.scr(b);
      if (!diLayar({ x0: Math.min(ax, bx), x1: Math.max(ax, bx), y0: Math.min(ay, by), y1: Math.max(ay, by) })) continue;
      const zm = (a[2] + b[2]) / 2;
      const w = ((gs.lebar ?? 0.02) * K.F) / zm;
      const warna = cahaya && suasana.kabut ? campur(gs.warna, suasana.kabut.warna, kabutA(zm)) : gs.warna;
      gb.push({ z: zm, node: <path key={`gs${i}-${j}`} d={`M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`} stroke={warna} strokeWidth={Math.max(0.7, w).toFixed(2)} strokeLinecap="round" opacity={w < 0.7 ? (w / 0.7).toFixed(2) : undefined} fill="none" /> });
    }
  });
  tokoh.forEach((t, i) => {
    const Y0 = t.Y ?? 0;
    const p = K.titik(t.X, Y0, t.Z);
    if (p.z < 0.3) return;
    const H = t.tinggi ?? 1.65,
      W = t.lebar ?? 0.5;
    const ysg = t._balik === 'y' ? -1 : 1;
    const pxM = p.s * 200;
    const bb: Kotak = { x0: p.x - W * 1.2 * pxM, x1: p.x + W * 1.2 * pxM, y0: ysg > 0 ? p.y - H * 1.15 * pxM : p.y - 0.1 * pxM, y1: ysg > 0 ? p.y + 0.1 * pxM : p.y + H * 1.15 * pxM };
    if (!diLayar(bb)) return;
    const ex = K.titik(t.X + 0.32, Y0, t.Z),
      ez = K.titik(t.X, Y0, t.Z + 0.32);
    const rx = Math.max(4, Math.hypot(ex.x - p.x, ex.y - p.y)),
      ry = Math.max(2, Math.abs(ez.y - p.y));
    let fig0: React.ReactNode = t.gambar(p);
    if (t._balik) fig0 = <g transform={t._balik === 'x' ? `translate(${(2 * p.x).toFixed(1)} 0) scale(-1 1)` : `translate(0 ${(2 * p.y).toFixed(1)}) scale(1 -1)`}>{fig0}</g>;
    let fig = fig0;
    let gelapAttr: string | undefined;
    if (cahaya) {
      const pt: V3 = [t.X, Y0 + ysg * H * 0.62, t.Z];
      const keKam = norm(sub(C, pt));
      // titik uji bayangan matahari di badan: 3 kolom × 14 baris
      const KOL: [number, number][] = [[-0.95, -0.2], [-0.2, 0.2], [0.2, 0.95]];
      const UJI = [-0.38, 0, 0.38];
      const BAR = 14;
      const sel: { c: number; r: number }[] = [];
      if (L)
        for (let r = 0; r < BAR; r++)
          for (let c = 0; c < 3; c++) if (diBayang(add([t.X, Y0 + (ysg * H * (r + 0.5)) / BAR, t.Z], mul(kananKam, UJI[c] * W)))) sel.push({ c, r });
      const semua = !!L && sel.length === BAR * 3;
      const sebagian = sel.length > 0 && !semua;
      gelapAttr = String(semua);
      type Sb = { arah: V3; warna: string; kuat: number };
      const dekat = lampuAktif
        .map((l) => ({ l, d: len(sub(l.pos, pt)) }))
        .filter((o) => o.d < (o.l.jangkau ?? 3))
        .sort((a, b) => a.d - b.d)[0];
      const sLampu: Sb | null = dekat ? { arah: norm(sub(dekat.l.pos, pt)), warna: dekat.l.warna ?? '#FFC66E', kuat: klamp((dekat.l.kuat ?? 1) * (1 - dekat.d / (dekat.l.jangkau ?? 3)) * 1.6) } : null;
      const sMatahari: Sb | null = L ? { arah: L, warna: TERANG, kuat: 1 } : null;
      const lapisan = (s: Sb | null, fid: string, gelap: boolean): React.ReactNode => {
        let isiF = fig0;
        if (gelap) isiF = <g filter={`url(#${id}-tgelap)`}>{isiF}</g>;
        if (!s || s.kuat < 0.05) return isiF;
        // arah rambat cahaya di layar; komponen tegak diredam supaya bayangan inti jatuh di SISI badan (volume), bukan
        // menjadi garis gelap di tepi bawah gambar 2D
        const a0 = arahLayar(pt, mul(s.arah, -1));
        const la = Math.hypot(a0[0], a0[1] * 0.45) || 1;
        const a2: [number, number] = [a0[0] / la, (a0[1] * 0.45) / la];
        const c = dot(s.arah, keKam);
        const samping = 1 - 0.8 * Math.max(0, c),
          belakang = klamp(-c);
        const o = {
          w1: 0.035 * pxM,
          w2: 0.15 * pxM * (0.55 + 0.45 * samping),
          k1: 0.85 * samping * s.kuat,
          k2: 0.38 * samping * s.kuat,
          kb: 0.45 * belakang * s.kuat,
          rim: Math.max(2, 3 * Math.min(2.2, p.s)),
          rimW: s.warna,
          kuatRim: (0.6 + 0.35 * belakang) * s.kuat,
          lembut: Math.max(0.7, 0.007 * pxM),
        };
        // bayangan inti di kepala/wajah dibuat lebih tipis (wajah kartun tetap bersih), penuh di badan
        const yKep = K.titik(t.X, Y0 + ysg * H * 1.02, t.Z).y,
          yLeh = K.titik(t.X, Y0 + ysg * H * 0.72, t.Z).y;
        return (
          <>
            <defs>
              {filterSinar(fid + 't', a2, o, 'tepi')}
              {filterSinar(fid + 'i', a2, o, 'inti')}
              <linearGradient id={fid + 'g'} gradientUnits="userSpaceOnUse" x1="0" y1={yKep.toFixed(1)} x2="0" y2={yLeh.toFixed(1)}>
                <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="1" stopColor="#fff" stopOpacity="1" />
              </linearGradient>
              <mask id={fid + 'm'} maskUnits="userSpaceOnUse" x={(bb.x0 - 40).toFixed(0)} y={(bb.y0 - 40).toFixed(0)} width={(bb.x1 - bb.x0 + 80).toFixed(0)} height={(bb.y1 - bb.y0 + 80).toFixed(0)}>
                <rect x={(bb.x0 - 40).toFixed(0)} y={(bb.y0 - 40).toFixed(0)} width={(bb.x1 - bb.x0 + 80).toFixed(0)} height={(bb.y1 - bb.y0 + 80).toFixed(0)} fill={`url(#${fid}g)`} />
              </mask>
            </defs>
            <g filter={`url(#${fid}t)`}>{isiF}</g>
            <g mask={`url(#${fid}m)`}>
              <g filter={`url(#${fid}i)`}>{isiF}</g>
            </g>
          </>
        );
      };
      if (!L) fig = lapisan(sLampu, `${id}-sn${i}l`, false);
      else if (semua) fig = lapisan(sLampu, `${id}-sn${i}l`, true);
      else if (!sebagian) fig = lapisan(sMatahari, `${id}-sn${i}m`, false);
      else {
        const mk = `${id}-mk${i}`;
        const sgM = Math.max(1.5, (kPen * 2.5 + 0.012) * pxM);
        const rects = sel.map(({ c, r }) => {
          const ya = K.titik(t.X, Y0 + (ysg * H * r) / BAR, t.Z).y,
            yb = K.titik(t.X, Y0 + (ysg * H * (r + 1)) / BAR, t.Z).y;
          let y0 = Math.min(ya, yb),
            y1 = Math.max(ya, yb);
          const kaki = 0.08 * H * pxM,
            kepala = 0.14 * H * pxM;
          if (r === 0) {
            if (ysg > 0) y1 += kaki;
            else y0 -= kaki;
          }
          if (r === BAR - 1) {
            if (ysg > 0) y0 -= kepala;
            else y1 += kepala;
          }
          const x0 = p.x + KOL[c][0] * W * pxM,
            x1 = p.x + KOL[c][1] * W * pxM;
          return <rect key={c + '-' + r} x={x0.toFixed(1)} y={y0.toFixed(1)} width={(x1 - x0 + 0.6).toFixed(1)} height={(y1 - y0 + 0.6).toFixed(1)} fill="#fff" />;
        });
        const mx0 = bb.x0 - 40,
          my0 = bb.y0 - 40,
          mw = bb.x1 - bb.x0 + 80,
          mh = bb.y1 - bb.y0 + 80;
        fig = (
          <>
            {lapisan(sMatahari, `${id}-sn${i}m`, false)}
            <defs>
              <filter id={`${mk}b`} filterUnits="userSpaceOnUse" x={mx0.toFixed(0)} y={my0.toFixed(0)} width={mw.toFixed(0)} height={mh.toFixed(0)} colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation={sgM.toFixed(2)} />
              </filter>
              <mask id={mk} maskUnits="userSpaceOnUse" x={mx0.toFixed(0)} y={my0.toFixed(0)} width={mw.toFixed(0)} height={mh.toFixed(0)}>
                <g filter={`url(#${mk}b)`}>{rects}</g>
              </mask>
            </defs>
            <g mask={`url(#${mk})`}>{lapisan(sLampu, `${id}-sn${i}l`, true)}</g>
          </>
        );
      }
    }
    gb.push({
      z: p.z,
      node: (
        <g key={'tk' + i}>
          <ellipse data-tokoh-gelap={gelapAttr} cx={p.x} cy={p.y} rx={rx} ry={ry} fill={cahaya ? BAYANG : '#000'} opacity={cahaya ? 0.42 : 0.12} filter={cahaya ? `url(#${id}-ao)` : undefined} />
          {fig}
        </g>
      ),
    });
  });
  // berkas cahaya dari bukaan + debu
  if (D && cahaya && !_pantulan)
    bukaan.forEach((bk, i) => {
      const atas = bk.pts.map((p) => K.cam(...p)).filter((q) => q[2] > 0.25).map((q) => K.scr(q));
      const kaki = bk.pts
        .map((p) => add(p, mul(D, p[1] / -D[1])))
        .map((p) => K.cam(...p))
        .filter((q) => q[2] > 0.25)
        .map((q) => K.scr(q));
      if (atas.length < 3 || kaki.length < 3) return;
      const hull = selubung([...atas, ...kaki]);
      const ca = pusat(atas.map((q) => [q[0], q[1], 0] as V3)),
        ck = pusat(kaki.map((q) => [q[0], q[1], 0] as V3));
      const gid = `${id}-bk${i}`;
      const dPath = 'M' + hull.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
      const xs = hull.map((q) => q[0]),
        ys = hull.map((q) => q[1]);
      const zc = zKam(pusat(bk.pts.map((p) => add(p, mul(D, p[1] / -D[1] / 2)))));
      gb.push({
        z: zc,
        node: (
          <g key={gid} pointerEvents="none">
            <defs>
              <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={ca[0]} y1={ca[1]} x2={ck[0]} y2={ck[1]}>
                <stop offset="0" stopColor={TERANG} stopOpacity="0.5" />
                <stop offset="1" stopColor={TERANG} stopOpacity="0.1" />
              </linearGradient>
              <clipPath id={`${gid}-c`}>
                <path d={dPath} />
              </clipPath>
            </defs>
            <path d={dPath} fill={`url(#${gid})`} filter={`url(#${id}-bks)`} />
            <g clipPath={`url(#${gid}-c)`}>
              <Debu x={Math.min(...xs)} y={Math.min(...ys)} w={Math.max(...xs) - Math.min(...xs)} h={Math.max(...ys) - Math.min(...ys)} f={f} n={46} warna="#FFF8EA" kuat={0.95} seed={i + 2} />
            </g>
          </g>
        ),
      });
    });
  // lampu: cahaya bola + bokeh
  lampuAktif.forEach((l, i) => {
    if (!l.bola) return;
    const p = K.titik(...l.pos);
    if (p.z < 0.3) return;
    const r = Math.max(14, 0.45 * p.s * 200);
    if (!diLayar({ x0: p.x - r, x1: p.x + r, y0: p.y - r, y1: p.y + r })) return;
    const gid = `${id}-lp${i}`;
    gb.push({
      z: p.z - 0.05,
      node: (
        <g key={gid} pointerEvents="none">
          <defs>
            <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={p.x} cy={p.y} r={r}>
              <stop offset="0" stopColor="#FFFDF2" stopOpacity={0.95 * Math.min(1, l.kuat ?? 1)} />
              <stop offset="0.3" stopColor={l.warna ?? '#FFC66E'} stopOpacity={0.6 * Math.min(1, l.kuat ?? 1)} />
              <stop offset="1" stopColor={l.warna ?? '#FFC66E'} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={p.x} cy={p.y} r={r} fill={`url(#${gid})`} />
        </g>
      ),
    });
    if (lensa) bokeh.push({ x: p.x, y: p.y, r: 0, k: Math.min(1, l.kuat ?? 1), warna: l.warna ?? '#FFC66E', z: p.z });
  });

  gb.sort((a, b) => b.z - a.z);
  // bokeh: lingkaran sebesar lingkar-kabur lensa di posisinya
  const bokehNode =
    lensa && bokeh.length ? (
      <g key="bokeh" filter={`url(#${id}-bkh)`} pointerEvents="none">
        {bokeh.map((o, i) => {
          const r = Math.max(5, stdBlur(o.z) * 2.1);
          return (
            <g key={i} opacity={0.5 * o.k}>
              <circle cx={o.x} cy={o.y} r={r} fill={o.warna} opacity=".5" />
              <circle cx={o.x} cy={o.y} r={r * 0.93} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(1, r * 0.08)} opacity=".55" />
            </g>
          );
        })}
      </g>
    ) : null;
  const lapisBenda: React.ReactNode[] = [];
  let bokehMasuk = false;
  for (const o of gb) {
    if (o.node == null) continue;
    if (lensa && !bokehMasuk && o.z < lensa.fokus) {
      lapisBenda.push(bokehNode);
      bokehMasuk = true;
    }
    const lv = blurLv(o.z);
    lapisBenda.push(
      lv > 0 ? (
        <g key={'kb' + lapisBenda.length} filter={`url(#${id}-b${lv})`}>
          {o.node}
        </g>
      ) : (
        <g key={'kb' + lapisBenda.length}>{o.node}</g>
      ),
    );
  }
  if (lensa && !bokehMasuk) lapisBenda.push(bokehNode);

  const sunScr: [number, number] | null =
    L && !_pantulan
      ? (() => {
          const q = K.cam(...add(C, mul(L, 500)));
          const [x, y] = q[2] > 0.05 ? K.scr(q) : [Number.NaN, Number.NaN];
          if (q[2] > 0.05 && x > -500 && x < 1580) return [x, y];
          // di luar bingkai/di belakang: taruh di tepi sisi matahari, sedikit di atas cakrawala
          return [q[0] < 0 ? -260 : 1340, K.vy - 380];
        })()
      : null;
  // ---------- langit
  const langitNode = (
    <g>
      <rect x="-2000" y="-2000" width="5000" height="6000" fill={`url(#${id}-lg)`} />
      {sunScr && <circle cx={sunScr[0]} cy={sunScr[1]} r={950} fill={`url(#${id}-mt)`} />}
      {!_pantulan && langitIsi != null && (typeof langitIsi === 'function' ? langitIsi(K) : langitIsi)}
    </g>
  );

  // ---------- topeng lensa untuk struktur: abu-abu = seberapa buram (0 = tajam)
  let topeng: React.ReactNode = null;
  let blurStruktur = 0;
  if (lensa && cahaya) {
    const potongan: { d: string; s: number }[] = [];
    for (const m of struktur) {
      if (!normalTerlihat(m)) continue;
      // potong muka menjadi pita berkedalaman-kamera sama (bidang tegak lurus arah pandang), rapat di dekat kamera
      const zs = m.pts.map(zKam);
      const zMin = Math.max(0.3, Math.min(...zs)),
        zMax = Math.max(zMin + 0.01, Math.max(...zs));
      const N = Math.min(48, Math.max(1, Math.ceil((1 / zMin - 1 / zMax) * 60)));
      const batas = Array.from({ length: N + 1 }, (_, i) => 1 / (1 / zMin - ((1 / zMin - 1 / zMax) * i) / N));
      const pieces: V3[][] = [];
      for (let i = 0; i < N; i++) {
        const lo = i === 0 ? -1e9 : batas[i],
          hi = i === N - 1 ? 1e9 : batas[i + 1];
        const pc = potong(potong(m.pts, (p) => zKam(p) - lo), (p) => hi - zKam(p));
        if (pc.length >= 3) pieces.push(pc);
      }
      for (const pc of pieces) {
        const d = K.poly(pc);
        if (d) potongan.push({ d, s: stdBlur(Math.max(0.3, zKam(pusat(pc)))) });
      }
    }
    const sLangit = stdBlur(1e6);
    blurStruktur = Math.max(sLangit, ...potongan.map((p) => p.s), 0.01);
    const abu = (s: number) => {
      const v = Math.round(255 * klamp(s / blurStruktur));
      return `rgb(${v},${v},${v})`;
    };
    topeng = (
      <mask id={`${id}-tp`} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="6000">
        <rect x="-2000" y="-2000" width="5000" height="6000" fill={abu(sLangit)} />
        {potongan.map((p, i) => <path key={i} d={p.d} fill={abu(p.s)} stroke={abu(p.s)} strokeWidth="1.5" />)}
      </mask>
    );
  }

  const balikLangit = !!_pantulan?.balikLangit;
  const defs = (
    <defs>
      <linearGradient id={`${id}-lg`} gradientUnits="userSpaceOnUse" x1="0" y1={balikLangit ? K.vy + 1100 : K.vy - 1100} x2="0" y2={K.vy}>
        <stop offset="0" stopColor={suasana.langit[0]} />
        <stop offset="1" stopColor={suasana.langit[1]} />
      </linearGradient>
      {sunScr && (
        <radialGradient id={`${id}-mt`} gradientUnits="userSpaceOnUse" cx={sunScr[0]} cy={sunScr[1]} r="950">
          <stop offset="0" stopColor="#FFF8E8" stopOpacity="0.9" />
          <stop offset="0.25" stopColor={TERANG} stopOpacity="0.45" />
          <stop offset="1" stopColor={TERANG} stopOpacity="0" />
        </radialGradient>
      )}
      {suasana.kabut && (
        <linearGradient id={`${id}-hz`} gradientUnits="userSpaceOnUse" x1="0" y1={K.vy - 320} x2="0" y2={K.vy + 200}>
          <stop offset="0" stopColor={suasana.kabut.warna} stopOpacity="0" />
          <stop offset="0.62" stopColor={suasana.kabut.warna} stopOpacity={suasana.kabut.maks ?? 0.45} />
          <stop offset="1" stopColor={suasana.kabut.warna} stopOpacity="0" />
        </linearGradient>
      )}
      <radialGradient id={`${id}-ntg`}>
        <stop offset="0" stopColor={GELAP_TX} stopOpacity="1" />
        <stop offset="0.55" stopColor={GELAP_TX} stopOpacity="0.55" />
        <stop offset="1" stopColor={GELAP_TX} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-ntt`}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-rb`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GELAP_TX} stopOpacity="1" />
        <stop offset="1" stopColor={GELAP_TX} stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-ao`} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id={`${id}-aow`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id={`${id}-aob`} colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={`${id}-kol`} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id={`${id}-bks`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
      <filter id={`${id}-bkh`} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      <filter id={`${id}-tgelap`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.984 -0.094 -0.01 0 0  -0.026 0.834 -0.009 0 0  -0.025 -0.082 0.877 0 0  0 0 0 1 0" />
      </filter>
      {blurStruktur > 0.3 && (
        <filter id={`${id}-bs`} colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={blurStruktur} />
        </filter>
      )}
      {topeng}
    </defs>
  );
  // filter blur benda dibuat setelah semua level diketahui
  const lapisBendaNode = <g>{lapisBenda}</g>;
  const filterBlur = (
    <defs>
      {[...levelBlur].map((lv) => (
        <filter key={lv} id={`${id}-b${lv}`} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={lv * 1.2} />
        </filter>
      ))}
    </defs>
  );
  const dasar = (
    <>
      {langitNode}
      {strukturNode(false)}
    </>
  );
  return (
    <g data-set={_pantulan ? 'dunia-3d-pantulan' : 'dunia-3d'} data-cahaya={cahaya ? 'ya' : 'tidak'}>
      {defs}
      {dasar}
      {lensa && cahaya && blurStruktur > 0.3 && (
        <g mask={`url(#${id}-tp)`}>
          <g filter={`url(#${id}-bs)`}>
            {langitNode}
            {strukturNode(true)}
          </g>
        </g>
      )}
      {lapisBendaNode}
      {filterBlur}
      {!_pantulan && suasana.nada && <rect x="-2000" y="-2000" width="5000" height="6000" fill={suasana.nada.warna} opacity={suasana.nada.kuat} pointerEvents="none" />}
      {cahaya && !_pantulan && (
        <>
          <Vignette id={`${id}-vg`} opacity={0.1} color="#5A4636" />
          <Grain id={`${id}-gr`} opacity={0.035} />
        </>
      )}
    </g>
  );
}
