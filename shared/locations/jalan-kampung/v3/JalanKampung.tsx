// Lokasi bersama: jalan kampung "Gang Melati" (v3, 11 Nov 2026; dibuat untuk "Kritik Bukan Utang Jasa" v4).
// v3 = v2 (beku, dipakai Kritik v3) tanpa perubahan isi, digambar dengan mesin Dunia3D _proyeksi/v3 yang urutan
// gambarnya benar (v2: dinding/tiang/pagar bisa menutupi tokoh yang berdiri di depannya). Lihat _proyeksi/v3/Dunia.tsx.
// v2 = dunia v1 (beku, dipakai video Kritik v2) DISUSUN ULANG dalam format benda Dunia3D (shared/locations/_proyeksi/v2),
// sesuai ATURAN WAJIB 11 Nov 2026 (video memakai Dunia3D; cahaya, bayangan jatuh, tekstur, pantulan, kedalaman wajib).
// Tata letak, koordinat, papan nama, dan API sama dengan v1, jadi kamera dan posisi tokoh lama tetap berlaku.
//
// Sumbu dunia: Z = sepanjang jalan (menjauh), X = melintang (kanan +), Y = tinggi. Jalan aspal X -2,4..2,4,
// selokan 2,4..2,95, teras 2,95..4,3, fasad rumah di X ±4,3 (rumah sedalam 7 m). Gapura "GANG MELATI" di Z 36,
// deret rumah di ujung Z 44, deret ruko (FOTOKOPI, APOTEK, BENGKEL, LAUNDRY) di Z -22.
// Kiri (X-): rumah krem no. 14 berpagar, WARUNG MAKMUR (terpal biru, renceng sachet, etalase, galon, bangku), rumah
//   2 lantai no. 10 berjemuran, pos ronda + kentongan, rumah bata no. 8, rumah hijau. Kanan (X+): rumah 2 lantai, rumah
//   tosca no. 13, RUMAH IBU no. 11 (kuning, pagar putih, kursi plastik), lahan berpohon mangga ±10 m, toko "SERVIS HP •
//   PULSA" 2 lantai, mushola berkubah, rumah. Jalan: tambalan, retak, polisi tidur, LUBANG berisi genangan (X 0,55, Z 9,5;
//   genangan memantulkan dunia). Tiang listrik + kabel, pohon di belakang atap, awan/burung/pesawat (LangitHidup).
//
// Pakai: <JalanKampung f kam waktu isi tambal lensa id /> — sama dengan v1, ditambah:
//   id      awalan id unik bila ada lebih dari satu dunia dalam satu frame (layar terbelah, foto di layar HP)
//   lensa   { fokus (m kedalaman kamera), bukaan } untuk close-up dengan latar buram + bokeh
//   pantulan=false mempercepat render (genangan/kaca hanya memantulkan gradien langit)
// Isi dinamis: [{ X, Z, gambar, dalam?, tinggi?, lebar?, Y? }]. Isi dengan X,Z sama digabung jadi satu tokoh (benda yang
// dipegang/dibawa), urut `dalam` besar → kecil. tinggi/lebar = ukuran siluet untuk bayangan (bawaan orang 1,65 × 0,5 m).
// Waktu: 'siang' (matahari tinggi dari kanan-depan) | 'sore' (matahari rendah hangat dari kanan; cahaya menyusup lewat
// lahan kosong ke sekitar lubang). Biaya: ±0,5–1,5 dtk per frame 1080×1920 (lihat katalog entri jalan-kampung-v3).
import React from 'react';
import { Cloud, Flock, Plane, Plant, TrashBin } from '../../_detail/v1/Detail';
import { Motorbike } from '../../../props/harian/v1/Props';
import { kamera, type Kam, type Titik } from '../../_proyeksi/v1/Proyeksi';
import { Dunia3D, tegak, lantai, bidang, kabel, gelapkan, campur, type Benda, type MukaDef, type Suasana, type Matahari, type Lensa, type Tekstur, type V3 } from '../../_proyeksi/v3/Dunia';

export { kamera };
export type { Kam, Titik };
export type Isi = { X: number; Z: number; gambar: (p: Titik) => React.ReactNode; dalam?: number; tinggi?: number; lebar?: number; Y?: number };

export const JALAN = { tepi: 2.4, selokan: 2.95, fasad: 4.3 };
export const LUBANG = { X: 0.55, Z: 9.5 };
export const WARUNG = { X: -4.3, z0: 5, z1: 11.5, bangku: { X: -3.25, Z: 8.2 } };
export const RUMAH_IBU = { X: 4.3, z0: 2, z1: 9, pintu: { X: 4.3, Z: 4.2 }, pagar: 3.05 };
export const berdiri = (k: Kam, X: number, Z: number) => kamera(k).titik(X, 0, Z);

// ------------------------------------------------------------------ data dunia (sama dengan v1)
type Unit = {
  side: -1 | 1;
  z0: number;
  z1: number;
  h: number;
  wall: string;
  trim: string;
  roof: string;
  kind: 'rumah' | 'rumah2' | 'warung' | 'toko' | 'mushola' | 'lahan';
  pagar?: string;
  pintu?: number;
  nomor?: string;
};
const UNITS: Unit[] = [
  { side: -1, z0: -20, z1: -12, h: 3.2, wall: '#D7C6A8', trim: '#8B6648', roof: '#A85B45', kind: 'rumah', pintu: 0.6 },
  { side: -1, z0: -12, z1: -4, h: 5.9, wall: '#B9C7B8', trim: '#5F7F70', roof: '#7E5A4A', kind: 'rumah2', pintu: 0.3 },
  { side: -1, z0: -4, z1: 5, h: 3.2, wall: '#E3D6BC', trim: '#5F7F70', roof: '#B5654A', kind: 'rumah', pagar: '#5F7F70', pintu: 0.55, nomor: '14' },
  { side: -1, z0: 5, z1: 11.5, h: 3.3, wall: '#CDB894', trim: '#7A5B3E', roof: '#9C5A41', kind: 'warung' },
  { side: -1, z0: 11.5, z1: 17, h: 5.9, wall: '#A9BCC4', trim: '#4E6670', roof: '#8B4F3F', kind: 'rumah2', pagar: '#4E6670', pintu: 0.7, nomor: '10' },
  { side: -1, z0: 19.6, z1: 26, h: 3.1, wall: '#C98F7A', trim: '#6B4A3A', roof: '#9A503C', kind: 'rumah', pagar: '#6B4A3A', pintu: 0.4, nomor: '8' },
  { side: -1, z0: 26, z1: 34, h: 3.3, wall: '#BFD0B6', trim: '#5F7F70', roof: '#B5654A', kind: 'rumah', pintu: 0.5 },
  { side: 1, z0: -20, z1: -10, h: 6.0, wall: '#D6B7A7', trim: '#8B4354', roof: '#7E5A4A', kind: 'rumah2', pintu: 0.5 },
  { side: 1, z0: -10, z1: -2, h: 3.2, wall: '#9FBFB5', trim: '#3E6A5E', roof: '#A85B45', kind: 'rumah', pagar: '#3E6A5E', pintu: 0.45, nomor: '13' },
  { side: 1, z0: 2, z1: 9, h: 3.3, wall: '#EAD9A8', trim: '#8B6648', roof: '#B5654A', kind: 'rumah', pagar: '#F3EEE2', pintu: 0.31, nomor: '11' },
  { side: 1, z0: 9, z1: 14, h: 1.2, wall: '#CFC3AF', trim: '#9A8F7E', roof: '#9A8F7E', kind: 'lahan' },
  { side: 1, z0: 14, z1: 21, h: 6.0, wall: '#E6C3BE', trim: '#8B4354', roof: '#7E5A4A', kind: 'toko' },
  { side: 1, z0: 21, z1: 29, h: 3.6, wall: '#F1EEE4', trim: '#3E7F6A', roof: '#3E7F6A', kind: 'mushola' },
  { side: 1, z0: 29, z1: 34, h: 3.2, wall: '#D9C9A0', trim: '#8B6648', roof: '#A85B45', kind: 'rumah', pintu: 0.5 },
];
const POLE: [number, number][] = [[-2.75, -10], [-2.75, 4.2], [2.75, 12.4], [-2.75, 19.2], [2.75, 27], [-2.75, 33.5]];
const POHON_BELAKANG: [number, number, number, string][] = [
  [-9, 2, 5.5, '#6F9A7A'], [-10, 14, 6.5, '#5E8B6C'], [-9.5, 29, 6, '#76A283'], [9.5, -6, 6, '#6F9A7A'], [10, 18, 7, '#5E8B6C'], [9, 31, 5.5, '#76A283'], [-8, -16, 6, '#5E8B6C'],
];
const DALAM = 7; // kedalaman rumah (m) dari fasad
const PLESTER: Tekstur = { jenis: 'plester', kuat: 0.75 };
const muda = (w: string, k = 0.22) => campur(w, '#FFFFFF', k);

// ------------------------------------------------------------------ pembantu fasad
type Opsi = Partial<MukaDef>;
function fasad(u: Unit) {
  const s = u.side;
  const hadap: '+x' | '-x' = s < 0 ? '+x' : '-x';
  /** X untuk jarak t (m) dari bidang fasad ke arah jalan. */
  const X = (t: number) => s * (JALAN.fasad - t);
  /** Bidang di fasad: a..b meter dari z0 sepanjang jalan, v0..v1 tinggi, t maju ke jalan. */
  const tg = (a: number, b: number, v0: number, v1: number, t: number, warna: string, o: Opsi = {}): Benda => tegak(hadap, X(t), u.z0 + a, u.z0 + b, v0, v1, warna, o);
  const bl = (a: number, b: number, v0: number, v1: number, t0: number, t1: number, warna: string, o: { lempar?: boolean; tekstur?: Tekstur } = {}): Benda => {
    const xa = X(t0),
      xb = X(t1);
    return { jenis: 'balok', x0: Math.min(xa, xb), x1: Math.max(xa, xb), y0: v0, y1: v1, z0: u.z0 + a, z1: u.z0 + b, warna, ...o };
  };
  return { s, hadap, X, tg, bl };
}
const papanTeks = (w: number, h: number, bg: string, teks: string, ukuran: number, warna = '#FFF9EF', spasi = 3, rx = 0) => ({
  w,
  h,
  isi: (
    <>
      <rect width={w} height={h} rx={rx} fill={bg} />
      <text x={w / 2} y={h * 0.5 + ukuran * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={ukuran} fill={warna} letterSpacing={spasi}>
        {teks}
      </text>
    </>
  ),
});

function jendelaU(u: Unit, a: number, w: number, v0: number, hgt: number, teralis = true, kaca = true): Benda[] {
  const { tg, bl, X } = fasad(u);
  const out: Benda[] = [
    tg(a - 0.08, a + w + 0.08, v0 - 0.08, v0 + hgt + 0.08, 0.008, u.trim, { lempar: false, geser: -0.01 }),
    tg(a, a + w, v0, v0 + hgt, 0.016, '#A9C4CF', kaca ? { bahan: 'kaca', lempar: false, geser: -0.02 } : { lempar: false, geser: -0.02 }),
    tg(a + w / 2 - 0.03, a + w / 2 + 0.03, v0, v0 + hgt, 0.026, u.trim, { lempar: false, geser: -0.03 }),
    bl(a - 0.12, a + w + 0.12, v0 - 0.18, v0 - 0.08, 0, 0.12, gelapkan(u.wall, 0.85)),
  ];
  if (teralis)
    for (let i = 0; i < 5; i++) {
      const z = u.z0 + a + (w * (i + 0.5)) / 5;
      out.push({ jenis: 'garis', pts: [[X(0.06), v0, z], [X(0.06), v0 + hgt, z]], warna: '#3E4743', lebar: 0.016 });
    }
  return out;
}

function pintuU(u: Unit, p: number): Benda[] {
  const { tg } = fasad(u);
  const out: Benda[] = [
    tg(p - 0.5, p + 0.5, 0, 2.25, 0.008, u.trim, { lempar: false, geser: -0.01 }),
    tg(p - 0.42, p + 0.42, 0.05, 2.15, 0.016, muda(u.trim), { lempar: false, geser: -0.02 }),
    tg(p - 0.36, p - 0.05, 1.3, 2.0, 0.024, '#B8CFD8', { lempar: false, geser: -0.03 }),
    tg(p + 0.05, p + 0.36, 1.3, 2.0, 0.024, '#B8CFD8', { lempar: false, geser: -0.03 }),
    // undakan di depan pintu
    { jenis: 'balok', x0: Math.min(fasad(u).X(0), fasad(u).X(0.45)), x1: Math.max(fasad(u).X(0), fasad(u).X(0.45)), y0: 0, y1: 0.12, z0: u.z0 + p - 0.65, z1: u.z0 + p + 0.65, warna: '#BDB3A2' },
  ];
  if (u.nomor) out.push(tg(p + 0.62, p + 0.98, 1.86, 2.1, 0.02, '#3E7FA0', { lempar: false, geser: -0.03, papan: papanTeks(36, 24, '#3E7FA0', u.nomor, 16, '#FFFFFF', 0, 3) }));
  return out;
}

/** Atap pelana: teritis (plafon bawah), genteng depan dan belakang, lisplang, segitiga ujung bila tetangga beda tinggi. */
function atapU(u: Unit, ujung: [boolean, boolean]): Benda[] {
  const s = u.side,
    h = u.h,
    ext = 0.2;
  const xE = s * (JALAN.fasad - 0.65),
    xF = s * JALAN.fasad,
    xR = s * (JALAN.fasad + 3.4),
    xB = s * (JALAN.fasad + DALAM);
  const za = u.z0 - ext,
    zb = u.z1 + ext;
  const H = h + 1.7;
  const out: Benda[] = [
    { jenis: 'muka', pts: [[xF, h, za], [xF, h, zb], [xE, h, zb], [xE, h, za]], n: [0, -1, 0], warna: gelapkan(u.wall, 0.72), lempar: false },
    bidang([[xE, h, za], [xE, h, zb], [xR, H, zb], [xR, H, za]], u.roof, { tekstur: { jenis: 'genteng', ukuran: 0.32 } }),
    bidang([[xR, H, za], [xR, H, zb], [xB, h, zb], [xB, h, za]], gelapkan(u.roof, 0.9), { tekstur: { jenis: 'genteng', ukuran: 0.32 } }),
    tegak(s < 0 ? '+x' : '-x', xE, za, zb, h - 0.22, h, muda(u.trim, 0.3), { lempar: false, geser: -0.05 }),
  ];
  const segi = (z: number, hadap: '+z' | '-z'): Benda => ({ jenis: 'muka', pts: [[xF, h, z], [xR, H, z], [xB, h, z]], n: hadap === '+z' ? [0, 0, 1] : [0, 0, -1], warna: gelapkan(u.wall, 0.92), tekstur: PLESTER });
  if (ujung[0]) out.push(segi(u.z0, '-z'));
  if (ujung[1]) out.push(segi(u.z1, '+z'));
  return out;
}

function pagarU(u: Unit): Benda[] {
  if (!u.pagar) return [];
  const s = u.side;
  const X = s * 3.05;
  const pz = u.z0 + (u.pintu ?? 0.5) * (u.z1 - u.z0);
  const celah: [number, number] = [pz - 0.6, pz + 0.6];
  const out: Benda[] = [];
  const ruas = (a: number, b: number) => {
    if (b - a < 0.05) return;
    out.push({ jenis: 'balok', x0: X - 0.07, x1: X + 0.07, y0: 0, y1: 0.28, z0: a, z1: b, warna: '#D8CDB9', tekstur: PLESTER });
    out.push({ jenis: 'balok', x0: X - 0.025, x1: X + 0.025, y0: 1.02, y1: 1.07, z0: a, z1: b, warna: u.pagar! });
    for (let z = a + 0.12; z < b - 0.05; z += 0.2) out.push({ jenis: 'garis', pts: [[X, 0.28, z], [X, 1.02, z]], warna: u.pagar!, lebar: 0.022 });
  };
  ruas(u.z0 + 0.3, celah[0]);
  ruas(celah[1], u.z1 - 0.3);
  for (const zc of [celah[0], celah[1], u.z0 + 0.3, u.z1 - 0.3]) out.push({ jenis: 'balok', x0: X - 0.09, x1: X + 0.09, y0: 0, y1: 1.25, z0: zc - 0.09, z1: zc + 0.09, warna: u.pagar! });
  return out;
}

function unitBenda(u: Unit, i: number): Benda[] {
  const { s, tg, bl } = fasad(u);
  const W = u.z1 - u.z0;
  const out: Benda[] = [];
  if (u.kind === 'lahan') {
    // tembok rendah + pohon mangga ±10 m di lahan
    out.push({ jenis: 'balok', x0: s > 0 ? 3.05 : -3.2, x1: s > 0 ? 3.2 : -3.05, y0: 0, y1: 1.2, z0: u.z0, z1: u.z1, warna: u.wall, tekstur: PLESTER });
    out.push({ jenis: 'balok', x0: s > 0 ? 3.0 : -3.25, x1: s > 0 ? 3.25 : -3.0, y0: 1.2, y1: 1.28, z0: u.z0, z1: u.z1, warna: gelapkan(u.wall, 0.85) });
    out.push(lantai(s > 0 ? 3.2 : -11, s > 0 ? 11 : -3.2, u.z0, u.z1, 0.004, '#B7AE8E', { tekstur: { jenis: 'tanah', kuat: 1.2 } }));
    out.push(...pohon(5.9, 11.6, 10, '#5E8B6C'));
    return out;
  }
  out.push({ jenis: 'balok', x0: s < 0 ? -(JALAN.fasad + DALAM) : JALAN.fasad, x1: s < 0 ? -JALAN.fasad : JALAN.fasad + DALAM, y0: 0, y1: u.h, z0: u.z0, z1: u.z1, warna: u.wall, tekstur: PLESTER });
  // plint + pilar pemisah unit
  out.push(bl(0, W, 0, 0.35, 0, 0.03, gelapkan(u.wall, 0.84), { lempar: false }));
  out.push(bl(0, 0.18, 0, u.h, 0, 0.05, gelapkan(u.wall, 0.8)));
  out.push(bl(W - 0.18, W, 0, u.h, 0, 0.05, gelapkan(u.wall, 0.8)));
  const tetangga = (z: number) => UNITS.find((v) => v !== u && v.side === u.side && (Math.abs(v.z1 - z) < 0.01 || Math.abs(v.z0 - z) < 0.01));
  const nA = tetangga(u.z0),
    nB = tetangga(u.z1);
  out.push(...atapU(u, [!nA || nA.h < u.h - 0.05 || nA.kind === 'lahan', !nB || nB.h < u.h - 0.05 || nB.kind === 'lahan']));
  if (u.kind === 'rumah' || u.kind === 'rumah2') {
    const p = (u.pintu ?? 0.5) * W;
    out.push(...pintuU(u, p));
    for (const t of [0.18, 0.72]) {
      const a = t * W;
      if (Math.abs(a + 0.6 - p) > 1.1 && a + 1.2 < W - 0.2) out.push(...jendelaU(u, a, 1.2, 0.95, 1.15, true, i % 2 === 0));
    }
    if (u.kind === 'rumah2') {
      out.push(bl(0.1, W - 0.1, 3.0, 3.15, 0, 0.62, gelapkan(u.wall, 0.78)));
      out.push(bl(0.1, W - 0.1, 3.95, 4.02, 0.58, 0.64, u.trim));
      const { X } = fasad(u);
      for (let z = u.z0 + 0.3; z < u.z1 - 0.2; z += 0.4) out.push({ jenis: 'garis', pts: [[X(0.61), 3.15, z], [X(0.61), 3.95, z]], warna: u.trim, lebar: 0.025 });
      for (const t of [0.15, 0.55]) out.push(...jendelaU(u, t * W, 1.3, 3.7, 1.25, false, true));
      // jemuran di balkon
      out.push({ jenis: 'garis', pts: [[X(0.5), 4.62, u.z0 + 0.3], [X(0.5), 4.62, u.z1 - 0.3]], warna: '#59615E', lebar: 0.012 });
      ['#E7899A', '#95B8A2', '#F1C977', '#7E8FB0'].forEach((c, k) => out.push(tg(0.6 + k * 0.75, 1.1 + k * 0.75, 4.05 - (k % 2) * 0.15, 4.6, 0.5, c, { dua: true, geser: -0.1 })));
    }
  }
  if (u.kind === 'warung') out.push(...warungBenda(u));
  if (u.kind === 'toko') {
    out.push(tg(0.6, W - 0.6, 0, 2.6, 0.006, '#3B3F3D', { lempar: false, geser: -0.01 }));
    out.push(
      tg(0.6, W - 0.6, 1.6, 2.6, 0.012, '#A3A9A6', {
        lempar: false,
        geser: -0.02,
        goresan: { garis: Array.from({ length: 6 }, (_, k) => [[fasad(u).X(0.013), 1.7 + k * 0.16, u.z0 + 0.6], [fasad(u).X(0.013), 1.7 + k * 0.16, u.z1 - 0.6]] as V3[]), warna: '#7D8582', lebar: 0.02 },
      }),
    );
    out.push(bl(1.2, W - 1.2, 0, 0.14, 0.02, 0.5, '#8E9692'));
    out.push(tg(1.2, W - 1.2, 0.14, 1.0, 0.5, '#BFD7DD', { bahan: 'kaca', lempar: false, geser: -0.05 }));
    out.push(bl(1.2, W - 1.2, 1.0, 1.04, 0.02, 0.5, '#8E9692', { lempar: false }));
    out.push(tg(0.6, W - 0.6, 2.7, 3.25, 0.02, u.trim, { lempar: false, geser: -0.03, papan: papanTeks(400, 50, u.trim, 'SERVIS HP • PULSA', 30, '#FFF9EF', 2) }));
    for (const t of [0.2, 0.6]) out.push(...jendelaU(u, t * W, 1.4, 3.9, 1.2, false, true));
  }
  if (u.kind === 'mushola') {
    for (const t of [0.12, 0.38, 0.62]) {
      out.push(tg(t * W, t * W + 1.1, 0.9, 2.5, 0.008, '#3E7F6A', { lempar: false, geser: -0.01 }));
      out.push(tg(t * W + 0.08, t * W + 1.02, 0.98, 2.2, 0.016, '#CFE3D8', { lempar: false, geser: -0.02 }));
      out.push(bl(t * W - 0.05, t * W + 1.15, 0.8, 0.9, 0, 0.1, '#E2DCCD'));
    }
    out.push(tg(0.86 * W - 0.6, 0.86 * W + 0.6, 0, 2.6, 0.008, '#3E7F6A', { lempar: false, geser: -0.01 }));
    out.push(tg(0.1 * W, 0.9 * W, 2.8, 3.3, 0.02, '#3E7F6A', { lempar: false, geser: -0.03, papan: papanTeks(400, 50, '#3E7F6A', 'MUSHOLA', 30, '#FFF9EF', 3, 6) }));
    // kubah di atas atap: tabuh + kubah + mustaka emas
    const xc = s * (JALAN.fasad + 1.8),
      zc = (u.z0 + u.z1) / 2,
      yAtap = u.h + 1.08;
    out.push({ jenis: 'balok', x0: xc - 0.75, x1: xc + 0.75, y0: yAtap - 0.3, y1: yAtap + 0.45, z0: zc - 0.75, z1: zc + 0.75, warna: '#E7E2D4' });
    out.push({ jenis: 'tajuk', X: xc, Y: yAtap + 0.5, Z: zc, r: 0.72, warna: '#3E7F6A' });
    out.push({ jenis: 'tiang', X: xc, Z: zc, y0: yAtap + 1.15, tinggi: 0.5, r: 0.03, warna: '#C9A44A' });
    out.push({ jenis: 'tajuk', X: xc, Y: yAtap + 1.7, Z: zc, r: 0.09, warna: '#E1B84A' });
  }
  out.push(...pagarU(u));
  return out;
}

function warungBenda(u: Unit): Benda[] {
  const { s, tg, bl } = fasad(u);
  const W = u.z1 - u.z0;
  const sachet = ['#E7899A', '#F1C977', '#7E8FB0', '#95B8A2', '#E1A93B', '#C24E4E'];
  const out: Benda[] = [tg(0.5, W - 0.5, 0, 2.5, 0.006, '#4A3F36', { lempar: false, geser: -0.01 })];
  [0.5, 1.05, 1.6].forEach((v, j) => {
    out.push(tg(0.6, W - 0.6, v, v + 0.05, 0.012, '#8B6648', { lempar: false, geser: -0.02 }));
    for (let k = 0; k < 13; k++) out.push(tg(0.7 + k * 0.4, 0.88 + k * 0.4, v + 0.05, v + 0.21 + ((k + j) % 3) * 0.05, 0.018, sachet[(k * 5 + j * 2) % 6], { lempar: false, terima: false, geser: -0.03 }));
    if (j === 0) for (const z of [0.65, (W - 0.6 + 0.65) / 2, W - 0.65]) out.push(tg(z - 0.03, z + 0.03, 0.05, 2.1, 0.014, '#7A5B3E', { lempar: false, geser: -0.025 }));
  });
  out.push(tg(0.5, W - 0.5, 2.6, 3.15, 0.02, '#C24E4E', { lempar: false, geser: -0.03, papan: papanTeks(420, 55, '#C24E4E', 'WARUNG MAKMUR', 34) }));
  // etalase kaca di teras
  out.push(bl(1.0, 3.4, 0, 0.45, 0.05, 0.55, '#8B6648'));
  out.push(tg(1.1, 3.3, 0.45, 1.0, 0.55, '#CFE3EA', { lempar: false, geser: -0.05, goresan: { garis: Array.from({ length: 6 }, (_, k) => [[fasad(u).X(0.56), 0.55 + (k % 2) * 0.2, u.z0 + 1.25 + k * 0.35], [fasad(u).X(0.56), 0.72 + (k % 2) * 0.2, u.z0 + 1.25 + k * 0.35]] as V3[]), warna: '#E7899A', lebar: 0.12 } }));
  out.push(bl(1.0, 3.4, 1.0, 1.05, 0.05, 0.55, '#7A5B3E'));
  // galon + tabung gas
  out.push(bl(4.2, 4.52, 0, 0.48, 0.2, 0.52, '#9CC7D8'));
  out.push(bl(4.7, 5.02, 0, 0.48, 0.2, 0.52, '#9CC7D8'));
  out.push(bl(5.3, 5.6, 0, 0.58, 0.25, 0.55, '#5BAA6A'));
  // terpal biru miring dari fasad ke tepi selokan + garis-garis terpal
  const xF = s * JALAN.fasad,
    xT = s * 2.95;
  out.push(bidang([[xF, 2.75, u.z0 - 0.1], [xF, 2.75, u.z1 + 0.1], [xT, 2.3, u.z1 + 0.1], [xT, 2.3, u.z0 - 0.1]], '#3F7FA8', { geser: -0.2 }));
  for (let k = 0; k < 7; k++) out.push(bidang([[xF, 2.752, u.z0 + k], [xF, 2.752, u.z0 + k + 0.45], [xT, 2.302, u.z0 + k + 0.45], [xT, 2.302, u.z0 + k]], '#356E94', { lempar: false, geser: -0.21 }));
  // renceng sachet menggantung di tepi terpal (melempar bayangan kecil ke teras)
  for (let k = 0; k < 9; k++) {
    const z = u.z0 + 0.5 + k * 0.7;
    out.push(tegak(s < 0 ? '+x' : '-x', s * 2.98, z, z + 0.16, 1.55 + (k % 3) * 0.12, 2.28, sachet[(k * 7) % 6], { dua: true, geser: 0.6 }));
  }
  for (const z of [u.z0 + 0.1, u.z1 - 0.1]) out.push({ jenis: 'tiang', X: s * 2.97, Z: z, tinggi: 2.3, r: 0.035, warna: '#59615E' });
  // bangku kayu panjang di teras (penutup sampai lantai untuk tokoh duduk)
  const b = WARUNG.bangku;
  out.push({ jenis: 'balok', x0: b.X - 0.2, x1: b.X + 0.2, y0: 0, y1: 0.45, z0: b.Z - 1.1, z1: b.Z + 1.1, warna: '#8B6648', atas: '#B9875C', teksturAtas: { jenis: 'kayu', arah: 'v', ukuran: 0.2, kuat: 0.7 } });
  return out;
}

function pohon(X: number, Z: number, tinggi: number, warna: string): Benda[] {
  const r = tinggi * 0.24;
  return [
    { jenis: 'tiang', X, Z, tinggi: tinggi * 0.5, r: 0.18 + tinggi * 0.012, warna: '#6B4A3A' },
    { jenis: 'tajuk', X, Y: tinggi * 0.68, Z, r: r * 1.1, warna },
    { jenis: 'tajuk', X: X - r * 0.7, Y: tinggi * 0.58, Z: Z + r * 0.2, r: r * 0.8, warna: gelapkan(warna, 0.92) },
    { jenis: 'tajuk', X: X + r * 0.65, Y: tinggi * 0.6, Z: Z - r * 0.25, r: r * 0.78, warna: muda(warna, 0.08) },
    { jenis: 'tajuk', X: X + r * 0.15, Y: tinggi * 0.86, Z, r: r * 0.7, warna: muda(warna, 0.12) },
  ];
}

function tiangListrik(X: number, Z: number): Benda[] {
  return [
    { jenis: 'tiang', X, Z, tinggi: 8, r: 0.11, warna: '#8E9692' },
    { jenis: 'balok', x0: X - 0.8, x1: X + 0.8, y0: 7.45, y1: 7.55, z0: Z - 0.05, z1: Z + 0.05, warna: '#5E6663' },
    tegak(X < 0 ? '+x' : '-x', X + (X < 0 ? 0.115 : -0.115), Z - 0.1, Z + 0.1, 2.2, 2.5, '#F1C977', { lempar: false, geser: -0.02 }),
  ];
}

function posRonda(): Benda[] {
  const X0 = -4.2,
    X1 = -2.95,
    z0 = 17.3,
    z1 = 19.3;
  const kayu = '#9C6B45';
  return [
    { jenis: 'balok', x0: X0, x1: X1, y0: 0.38, y1: 0.45, z0, z1, warna: kayu, atas: '#B9875C', teksturAtas: { jenis: 'kayu', arah: 'v', ukuran: 0.22 } },
    ...[[X0, z0], [X0, z1], [X1, z0], [X1, z1]].map(([x, z]) => ({ jenis: 'tiang', X: x, Z: z, tinggi: 2.4, r: 0.05, warna: kayu }) as Benda),
    { jenis: 'balok', x0: X0 - 0.3, x1: X1 + 0.3, y0: 2.38, y1: 2.46, z0: z0 - 0.3, z1: z1 + 0.3, warna: '#8B4F3F', atas: '#A85B45' },
    { jenis: 'balok', x0: X1 - 0.07, x1: X1, y0: 1.2, y1: 1.95, z0: z0 + 0.25, z1: z0 + 0.45, warna: '#7A5644' },
    tegak('+x', X1 + 0.03, z0 + 0.5, z1 - 0.2, 1.95, 2.2, '#FFF9EF', { lempar: false, geser: -0.03, papan: papanTeks(200, 40, '#FFF9EF', 'POS RONDA', 24, '#5E4836', 1) }),
    // tembok belakang pos ronda
    { jenis: 'balok', x0: -4.75, x1: -4.5, y0: 0, y1: 1.8, z0: 17, z1: 19.6, warna: '#C9BBA2', tekstur: PLESTER },
  ];
}

function gapura(): Benda[] {
  const Z = 36;
  return [
    { jenis: 'balok', x0: -2.95, x1: -2.45, y0: 0, y1: 4.1, z0: Z - 0.25, z1: Z + 0.25, warna: '#E8E2D4', tekstur: PLESTER },
    { jenis: 'balok', x0: 2.45, x1: 2.95, y0: 0, y1: 4.1, z0: Z - 0.25, z1: Z + 0.25, warna: '#E8E2D4', tekstur: PLESTER },
    { jenis: 'balok', x0: -3.0, x1: -2.4, y0: 0, y1: 0.6, z0: Z - 0.3, z1: Z + 0.3, warna: '#C24E4E' },
    { jenis: 'balok', x0: 2.4, x1: 3.0, y0: 0, y1: 0.6, z0: Z - 0.3, z1: Z + 0.3, warna: '#C24E4E' },
    { jenis: 'balok', x0: -3.1, x1: 3.1, y0: 3.4, y1: 4.1, z0: Z - 0.2, z1: Z + 0.2, warna: '#8B4354' },
    tegak('-z', Z - 0.22, -2.9, 2.9, 3.5, 4.0, '#8B4354', { lempar: false, geser: -0.05, papan: papanTeks(580, 50, '#8B4354', 'GANG MELATI', 38, '#FFF9EF', 6) }),
  ];
}

function ujungDepan(): Benda[] {
  const Z = 44;
  const blok: [number, number, number, string, string][] = [[-14, -6, 3.4, '#D9C9A0', '#A85B45'], [-6, -2.6, 6, '#B9C7B8', '#7E5A4A'], [2.6, 7, 3.2, '#E6C3BE', '#B5654A'], [7, 15, 5.6, '#C9D6DA', '#8B4F3F']];
  const out: Benda[] = [];
  for (const [x0, x1, h, w, r] of blok) {
    out.push({ jenis: 'balok', x0, x1, y0: 0, y1: h, z0: Z, z1: Z + 6, warna: w, tekstur: PLESTER });
    out.push(bidang([[x0 - 0.2, h, Z - 0.2], [x1 + 0.2, h, Z - 0.2], [x1 - 0.8, h + 1.4, Z + 2], [x0 + 0.8, h + 1.4, Z + 2]], r, { tekstur: { jenis: 'genteng', ukuran: 0.32 } }));
    for (let j = 0; j < Math.floor((x1 - x0) / 2.2); j++) out.push(tegak('-z', Z - 0.01, x0 + 0.7 + j * 2.2, x0 + 1.8 + j * 2.2, 1, 2.1, '#AFC9D3', { lempar: false, geser: -0.02 }));
  }
  return out;
}
function ujungBelakang(): Benda[] {
  const Z = -22;
  const blok: [number, number, string, string][] = [[-14, -7, '#C9B79A', 'FOTOKOPI'], [-7, -2.6, '#A9B7B3', 'APOTEK'], [2.6, 8, '#D2B48C', 'BENGKEL'], [8, 15, '#B8B09A', 'LAUNDRY']];
  const out: Benda[] = [];
  for (const [x0, x1, w, n] of blok) {
    out.push({ jenis: 'balok', x0, x1, y0: 0, y1: 6.2, z0: Z - 6, z1: Z, warna: w, tekstur: PLESTER });
    out.push(tegak('+z', Z + 0.01, x0 + 0.3, x1 - 0.3, 0, 2.8, '#8E9692', { lempar: false, geser: -0.02, goresan: { garis: Array.from({ length: 12 }, (_, k) => [[x0 + 0.3, 0.2 + k * 0.22, Z + 0.012], [x1 - 0.3, 0.2 + k * 0.22, Z + 0.012]] as V3[]), warna: '#7D8582', lebar: 0.02 } }));
    out.push(tegak('+z', Z + 0.02, x0 + 0.3, x1 - 0.3, 3.0, 3.6, '#2F3532', { lempar: false, geser: -0.03, papan: papanTeks(400, 60, '#2F3532', n, 38, '#F1C977', 2) }));
    out.push({ jenis: 'balok', x0, x1, y0: 2.85, y1: 2.95, z0: Z, z1: Z + 0.9, warna: gelapkan(w, 0.8) });
  }
  return out;
}

// ------------------------------------------------------------------ tanah: teras, selokan, aspal, lubang
const cincin = (r: number, n: number, jit: number, seed: number, y: number): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (-i / n) * Math.PI * 2;
    const k = 1 + jit * Math.sin(i * 2.7 + seed) * Math.cos(i * 1.3);
    return [LUBANG.X + Math.cos(a) * r * 1.25 * k, y, LUBANG.Z + Math.sin(a) * r * 0.8 * k];
  });
const datar = (pts: V3[], warna: string, o: Opsi = {}): Benda => ({ jenis: 'muka', pts, n: [0, 1, 0], warna, lapis: 0, ...o });

function tanah(tambal: boolean): Benda[] {
  const zA = -28,
    zB = 50;
  const L = LUBANG;
  const retak: V3[][] = [
    [[-0.8, 6], [-0.4, 6.8], [-0.6, 7.6]],
    [[1.5, 15], [1.1, 16.2]],
    [[-1.9, 26], [-1.3, 27]],
    ...(tambal ? [] : [[0.9, 0.2], [1.1, -0.3], [-0.9, 0.35], [-1.15, -0.1]].map(([dx, dz]) => [[L.X + dx * 0.75, L.Z + dz * 0.6], [L.X + dx * 1.15, L.Z + dz * 1.1], [L.X + dx * 1.45, L.Z + dz * 1.0]])),
  ].map((ln) => ln.map(([x, z]) => [x, 0.0045, z] as V3));
  const out: Benda[] = [
    lantai(-60, 60, -40, 90, 0, '#C9BEA6', { tekstur: { jenis: 'tanah', kuat: 0.8 } }),
    lantai(-4.3, -2.95, zA, zB, 0.001, '#D6CAB2', { tekstur: { jenis: 'ubin', ukuran: 0.4, kuat: 0.55 } }),
    lantai(2.95, 4.3, zA, zB, 0.001, '#D6CAB2', { tekstur: { jenis: 'ubin', ukuran: 0.4, kuat: 0.55 } }),
  ];
  for (const s of [-1, 1]) {
    out.push(datar([[s * 2.4, 0.002, zB], [s * 2.95, 0.002, zB], [s * 2.95, 0.002, zA], [s * 2.4, 0.002, zA]].map((p) => (s < 0 ? p : p)) as V3[], '#59615C'));
    out.push(datar([[s * 2.5, 0.003, zB], [s * 2.85, 0.003, zB], [s * 2.85, 0.003, zA], [s * 2.5, 0.003, zA]] as V3[], '#3E4743'));
    for (const z of s < 0 ? [0.6, 14.5, 23] : [-6, 4.2, 25]) out.push(datar([[s * 2.4, 0.02, z + 0.6], [s * 2.95, 0.02, z + 0.6], [s * 2.95, 0.02, z - 0.6], [s * 2.4, 0.02, z - 0.6]] as V3[], '#A9A294'));
  }
  out.push(
    lantai(-2.4, 2.4, zA, zB, 0.004, '#77736C', {
      tekstur: { jenis: 'aspal', kuat: 0.55 },
      goresan: { garis: retak, warna: '#4F4B46', lebar: 0.03 },
    }),
  );
  for (const [x0, z0, x1, z1] of [[0.9, 3.4, 1.9, 4.6], [-1.7, 12.6, -0.6, 13.8], [-0.3, 21, 1.4, 22.3], [-1.2, -6, 0.2, -4.6]])
    out.push(datar([[x0, 0.005, z1 - 0.05], [x1 - 0.05, 0.005, z1], [x1, 0.005, z0 + 0.1], [x0 + 0.08, 0.005, z0]] as V3[], '#64615B', { tekstur: { jenis: 'aspal', kuat: 0.6, seed: 7 } }));
  // polisi tidur
  out.push({ jenis: 'balok', x0: -2.4, x1: 2.4, y0: 0, y1: 0.05, z0: 16.2, z1: 16.6, warna: '#3B3F3D' });
  for (let i = 0; i < 8; i++) out.push(datar([[-2.4 + i * 0.6, 0.052, 16.6], [-2.1 + i * 0.6, 0.052, 16.6], [-2.1 + i * 0.6, 0.052, 16.2], [-2.4 + i * 0.6, 0.052, 16.2]] as V3[], '#F1C977', { lapis: 1, lempar: false, geser: -0.02 }));
  // lubang + genangan (air memantulkan dunia)
  if (tambal) out.push(datar(cincin(0.7, 14, 0.08, 3, 0.007), '#4F4C47', { tekstur: { jenis: 'aspal', kuat: 0.5, seed: 11 } }));
  else {
    out.push(datar(cincin(0.78, 20, 0.22, 5, 0.007), '#8C877E', { tekstur: { jenis: 'aspal', kuat: 1.2, seed: 5 } }));
    out.push(datar(cincin(0.66, 20, 0.2, 5, 0.008), '#4A4540'));
    out.push(datar(cincin(0.5, 18, 0.16, 9, 0.009), '#93B4C2', { bahan: 'air' }));
    for (const [dx, dz] of [[0.95, 0.5], [-0.7, -0.62], [0.2, 0.78], [1.15, -0.4]])
      out.push(datar([[L.X + dx - 0.07, 0.006, L.Z + dz + 0.04], [L.X + dx + 0.07, 0.006, L.Z + dz + 0.04], [L.X + dx + 0.06, 0.006, L.Z + dz - 0.04], [L.X + dx - 0.06, 0.006, L.Z + dz - 0.04]] as V3[], '#5A5650'));
  }
  // bibir selokan (beton) yang melempar bayangan tipis, per ruas supaya urutan gambar tetap benar
  for (const s of [-1, 1])
    for (let z = zA; z < zB; z += 4)
      for (const xe of [2.4, 2.95]) out.push({ jenis: 'balok', x0: s * xe - 0.05, x1: s * xe + 0.05, y0: 0, y1: 0.07, z0: z, z1: Math.min(zB, z + 4), warna: '#B4AC9E', lempar: false });
  return out;
}

function kabelListrik(): Benda[] {
  const out: Benda[] = [];
  for (let i = 0; i < POLE.length - 1; i++)
    for (const dy of [0, -0.25, -0.5]) {
      const [xa, za] = POLE[i],
        [xb, zb] = POLE[i + 1];
      out.push(kabel([xa + dy * 1.4, 7.55 + dy, za], [xb + dy * 1.4, 7.55 + dy, zb], 0.5 + Math.abs(dy), '#3B3F3D', 0.02));
    }
  // sambungan ke rumah
  out.push(kabel([-2.75, 7.0, 4.2], [-4.3, 2.9, 1.2], 0.25, '#3B3F3D', 0.014));
  out.push(kabel([2.75, 7.0, 12.4], [4.3, 5.6, 16.0], 0.25, '#3B3F3D', 0.014));
  out.push(kabel([-2.75, 7.0, 4.2], [4.3, 3.0, 5.5], 0.4, '#3B3F3D', 0.014));
  return out;
}

const STATIS: Record<string, Benda[]> = {};
/** Semua benda tetap Gang Melati (dibangun sekali, di-cache per keadaan lubang). */
export function bendaGang(tambal = false): Benda[] {
  const k = tambal ? 't' : 'l';
  if (STATIS[k]) return STATIS[k];
  const out: Benda[] = [...tanah(tambal)];
  UNITS.forEach((u, i) => out.push(...unitBenda(u, i)));
  for (const [X, Z] of POLE) out.push(...tiangListrik(X, Z));
  out.push(...kabelListrik(), ...posRonda(), ...gapura(), ...ujungDepan(), ...ujungBelakang());
  for (const [X, Z, t, c] of POHON_BELAKANG) out.push(...pohon(X, Z, t + 3, c));
  STATIS[k] = out;
  return out;
}

// ------------------------------------------------------------------ benda kecil 2D (ikut cahaya seperti tokoh)
const KursiPlastik = ({ x, y, s, warna = '#3E7FA0' }: { x: number; y: number; s: number; warna?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-detail="kursi-plastik">
    <path d="M-40 0l6 -84h68l6 84h-10l-6 -70h-48l-6 70Z" fill={warna} />
    <rect x="-42" y="-96" width="84" height="16" rx="5" fill={warna} />
    <path d="M-34 -96l4 -70q30 -10 60 0l4 70Z" fill={warna} />
    <path d="M-24 -150h48M-26 -132h52M-28 -114h56" stroke="#fff" strokeWidth="5" opacity=".25" />
  </g>
);
const Sangkar = ({ x, y, s, f }: { x: number; y: number; s: number; f: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${2 * Math.sin(f * 0.06)})`} data-detail="sangkar">
    <path d="M0 -60v14" stroke="#59615E" strokeWidth="3" />
    <path d="M-26 0v-30q26 -26 52 0v30Z" fill="none" stroke="#C9A66B" strokeWidth="3" />
    {[-16, -6, 4, 14].map((x) => <path key={x} d={`M${x} 0v-36`} stroke="#C9A66B" strokeWidth="2" />)}
    <rect x="-30" y="-2" width="60" height="6" rx="2" fill="#8B6648" />
    <ellipse cx="2" cy="-14" rx="7" ry="5" fill="#E1A93B" />
  </g>
);
function bendaKecil(f: number): Benda[] {
  const t = (X: number, Z: number, tinggi: number, lebar: number, g: (p: Titik) => React.ReactNode, Y?: number): Benda => ({ jenis: 'tokoh', X, Z, Y, tinggi, lebar, gambar: g });
  return [
    t(3.6, 2.8, 0.75, 0.4, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.1} kind={1} pot="#C9805A" />),
    t(3.6, 8.3, 0.75, 0.4, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.2} kind={2} pot="#A86F4E" />),
    t(3.55, 7.2, 0.62, 0.45, (p) => <g transform={`translate(${p.x} ${p.y}) scale(${p.s})`}><TrashBin x={0} y={0} color="#3E7F6A" /></g>),
    t(-3.6, 2.4, 0.7, 0.4, (p) => <Plant x={p.x} y={p.y} s={p.s} kind={0} pot="#8B6648" />),
    t(-3.5, 15.6, 0.75, 0.4, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.1} kind={1} />),
    t(3.55, 24.5, 0.75, 0.4, (p) => <Plant x={p.x} y={p.y} s={p.s} kind={2} />),
    t(3.75, 5.6, 0.85, 0.45, (p) => <KursiPlastik x={p.x} y={p.y} s={p.s} />),
    t(3.75, 6.4, 0.85, 0.45, (p) => <KursiPlastik x={p.x} y={p.y} s={p.s} warna="#C24E4E" />),
    t(-3.7, -0.4, 0.3, 0.3, (p) => <Sangkar x={p.x} y={p.y} s={p.s} f={f} />, 2.3),
    t(-3.55, 22.6, 1.0, 0.7, (p) => <g transform={`translate(${p.x} ${p.y})`}><Motorbike s={p.s * 2.1} color="#3E6A8A" /></g>),
  ];
}

// ------------------------------------------------------------------ langit hidup (awan, burung, pesawat) mengikuti arah kamera
const AWAN: [number, number, number][] = [
  [-20, 14, 1.3], [25, 9, 1.0], [70, 16, 1.4], [115, 11, 1.1], [160, 15, 1.3], [205, 10, 1.0], [250, 17, 1.2], [295, 12, 1.1], [-5, 26, 0.9], [140, 27, 0.9],
];
export function LangitHidup({ K, f, waktu = 'siang' }: { K: ReturnType<typeof kamera>; f: number; waktu?: 'siang' | 'sore' }) {
  const C: V3 = [K.k.x, K.h, K.k.z];
  const arah = (az: number, el: number, jarak = 900) => {
    const a = (az * Math.PI) / 180,
      e = (el * Math.PI) / 180;
    const q = K.cam(C[0] + Math.sin(a) * Math.cos(e) * jarak, C[1] + Math.sin(e) * jarak, C[2] + Math.cos(a) * Math.cos(e) * jarak);
    if (q[2] < 5) return null;
    const [x, y] = K.scr(q);
    return x > -500 && x < 1580 && y > -400 && y < 2100 ? { x, y } : null;
  };
  const sore = waktu === 'sore';
  const k = K.F / 1000;
  return (
    <g data-detail="langit-hidup">
      {AWAN.map(([az, el, s], i) => {
        const p = arah(az + f * 0.012, el);
        return p ? <Cloud key={i} x={p.x} y={p.y} s={s * k} tone={sore ? '#FFEBD6' : '#FFFFFF'} o={sore ? 0.62 : 0.72} /> : null;
      })}
      {(() => {
        const p = arah(-30 + ((f * 0.06) % 120), 19);
        return p ? <Flock x={p.x} y={p.y} f={f} n={5} s={0.55 * k} tone="#4A423C" /> : null;
      })()}
      {(() => {
        const p = arah(150 - ((f * 0.05) % 140), 24);
        return p ? <Flock x={p.x} y={p.y} f={f + 40} n={4} s={0.5 * k} tone="#4A423C" /> : null;
      })()}
      {(() => {
        const p = arah(60 - ((f * 0.08) % 200), 33, 1400);
        return p ? <Plane x={p.x} y={p.y} s={0.42 * k} f={f} /> : null;
      })()}
    </g>
  );
}

// ------------------------------------------------------------------ cahaya per waktu
export const CAHAYA: Record<'siang' | 'sore', { matahari: Matahari; suasana: Suasana }> = {
  siang: {
    matahari: { az: 35, el: 56, warna: '#FFF1D2' },
    suasana: {
      langit: ['#9DC8DD', '#E2EFF0'],
      bayangan: '#3A3F5A',
      ambient: 0.66,
      diffuse: 0.72,
      pantul: 0.08,
      kabut: { warna: '#E1ECEC', mulai: 16, penuh: 62, maks: 0.45 },
    },
  },
  sore: {
    matahari: { az: 62, el: 25, warna: '#FFC98A' },
    suasana: {
      langit: ['#F2C397', '#FBE5C6'],
      bayangan: '#47395A',
      ambient: 0.62,
      diffuse: 0.82,
      pantul: 0.1,
      kabut: { warna: '#F6DCBC', mulai: 14, penuh: 56, maks: 0.5 },
      nada: { warna: '#F2A65A', kuat: 0.08 },
      penumbra: 0.02,
    },
  },
};

function isiKeBenda(isi: Isi[], kam: Kam): Benda[] {
  const grup = new Map<string, Isi[]>();
  for (const it of isi) {
    const k = `${it.X.toFixed(3)}|${it.Z.toFixed(3)}|${(it.Y ?? 0).toFixed(2)}`;
    grup.set(k, [...(grup.get(k) ?? []), it]);
  }
  const yaw = ((kam.yaw ?? 0) * Math.PI) / 180;
  const out: Benda[] = [];
  for (const g of grup.values()) {
    if (g.length === 1) {
      const it = g[0];
      const d = it.dalam ?? 0;
      out.push({ jenis: 'tokoh', X: it.X + d * Math.sin(yaw), Z: it.Z + d * Math.cos(yaw), Y: it.Y, tinggi: it.tinggi, lebar: it.lebar, gambar: it.gambar });
    } else {
      const urut = [...g].sort((a, b) => (b.dalam ?? 0) - (a.dalam ?? 0));
      out.push({
        jenis: 'tokoh',
        X: g[0].X,
        Z: g[0].Z,
        Y: g[0].Y,
        tinggi: Math.max(...g.map((i) => i.tinggi ?? 1.65)),
        lebar: Math.max(...g.map((i) => i.lebar ?? 0.5)),
        gambar: (p) => (
          <>
            {urut.map((it, j) => (
              <g key={j}>{it.gambar(p)}</g>
            ))}
          </>
        ),
      });
    }
  }
  return out;
}

// ------------------------------------------------------------------ adegan
export function JalanKampung({
  f,
  kam,
  waktu = 'siang',
  isi = [],
  tambal = false,
  langit = true,
  lensa,
  id = 'jk',
  pantulan = true,
  cahaya = true,
}: {
  f: number;
  kam: Kam;
  waktu?: 'siang' | 'sore';
  isi?: Isi[];
  tambal?: boolean;
  langit?: boolean;
  lensa?: Lensa;
  id?: string;
  pantulan?: boolean;
  cahaya?: boolean;
}) {
  const c = CAHAYA[waktu];
  const benda = [...bendaGang(tambal), ...bendaKecil(f), ...isiKeBenda(isi, kam)];
  return (
    <g data-set="jalan-kampung-v2">
      <Dunia3D
        kam={kam}
        benda={benda}
        matahari={c.matahari}
        suasana={c.suasana}
        lensa={lensa}
        cahaya={cahaya}
        pantulan={pantulan}
        f={f}
        id={id}
        langitIsi={langit ? (K) => <LangitHidup K={K} f={f} waktu={waktu} /> : undefined}
      />
    </g>
  );
}
