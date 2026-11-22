// Lokasi bersama: Bundaran HI, Jakarta (v4, 11 Nov 2026; dibuat untuk "Kritik Bukan Utang Jasa" v4).
// v4 = v3 (beku, dipakai Kritik v3) tanpa perubahan isi, digambar dengan mesin Dunia3D _proyeksi/v3 yang urutan
// gambarnya benar. Lihat _proyeksi/v3/Dunia.tsx.
// v3 = komposisi v2 (beku, gambar datar) DISUSUN ULANG sebagai dunia Dunia3D (shared/locations/_proyeksi/v2), sesuai
// ATURAN WAJIB 11 Nov 2026: cahaya berarah, bayangan jatuh, kolam yang memantulkan tugu dan gedung, kaca gedung yang
// memantulkan langit, kabut jarak, lensa.
//
// Peristiwa nyata (sama dengan v2): aksi Greenpeace Indonesia, Selasa 20 Okt 2026 pagi. Aktivis memanjat Patung Selamat
// Datang dan membentangkan spanduk "TANGANI KRISIS IKLIM, TURUNKAN BIAYA HIDUP" dengan nama GREENPEACE (bawaan `teks`,
// `kredit`). Sumber: Mongabay, Katadata, investortrust.id (RISET proyek Kritik v2/v3).
// ARAHAN PENGGUNA 10 Nov 2026: teks spanduk aksi nyata TIDAK diganti ("itu bentuk perjuangan nyata dari relawan aktivis").
// Yang tidak disalin: iklan dan wajah orang di layar LED (iklan generik "ES TEH SEGAR"), nama hotel/gedung.
//
// Dunia (meter). Kamera bawaan dari utara menghadap selatan (+Z). Kolam bundar r 25 berpusat di (0, 32): tepi dekat Z 7.
// Tugu batu 2,4 × 2,4 m setinggi 14,9 m di tengah kolam (muka depan Z 30,8, menghadap kamera); patung perunggu
// (pria melambai, wanita membawa karangan bunga) ±4,6 m di atasnya (alas Y 15,2). Spanduk kuning menjuntai di muka depan
// dari Y 14,3 sepanjang 10 m. Trotoar + pagar besi di Z 5,6–6,6 untuk penonton (`isi`). Gedung: pencakar langit kaca,
// gedung batu dengan layar LED, gedung kaca hijau rendah, deret pohon di keliling bundaran.
// Prop: spanduk 0..1 (bentang), pemanjat 0..3, depan (pagar), isi (tokoh: [{X, Z, gambar, tinggi?, lebar?}]),
//   lensa, id, pantulan, waktu ('siang' berkabut | 'sore').
import React from 'react';
import { Cloud, Flock, Plane } from '../../_detail/v1/Detail';
import { kamera, type Kam, type Titik } from '../../_proyeksi/v1/Proyeksi';
import { Dunia3D, tegak, lantai, lingkaranDatar, gelapkan, type Benda, type Suasana, type Matahari, type Lensa, type V3 } from '../../_proyeksi/v3/Dunia';

export { kamera };
export type { Kam, Titik };
export type IsiHI = { X: number; Z: number; gambar: (p: Titik) => React.ReactNode; tinggi?: number; lebar?: number; Y?: number };

export const HI3 = { kolam: { X: 0, Z: 32, r: 25 }, tugu: { x0: -1.2, x1: 1.2, z0: 30.8, z1: 33.2, top: 14.9 }, patungY: 15.2, spanduk: { x0: -0.95, x1: 0.95, atas: 14.3, panjang: 10 }, pagarZ: 6.4 };
export const SPANDUK_ASLI = { teks: ['TANGANI', 'KRISIS', 'IKLIM,', 'TURUNKAN', 'BIAYA', 'HIDUP'], kredit: 'GREENPEACE' };

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// ------------------------------------------------------------------ gambar 2D yang ditaruh di dunia (ikut cahaya)
/** Patung Selamat Datang (bergaya, perunggu). Alas di (0,0), tinggi ±244 satuan, lebar ±120. */
const PatungGambar = () => {
  const br = '#4D4A40',
    hi = '#6E6A5A';
  return (
    <g data-landmark="Monumen Selamat Datang">
      <rect x="-52" y="-18" width="104" height="18" rx="3" fill="#5E5A4E" />
      <g transform="translate(-600 -622)">
        <ellipse cx="580" cy="452" rx="15" ry="18" fill={br} />
        <path d="M566 470q14 -8 30 0l6 70l-6 64h-12l-4 -52l-6 52h-12l-4 -66Z" fill={br} />
        <path d="M570 476l-14 -40l-8 -70" stroke={br} strokeWidth="12" strokeLinecap="round" fill="none" />
        <ellipse cx="547" cy="360" rx="8" ry="11" fill={br} />
        <path d="M596 478l12 34l-4 30" stroke={br} strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M570 482l-6 60M574 474l-12 -36" stroke={hi} strokeWidth="3" opacity=".6" fill="none" />
        <ellipse cx="622" cy="468" rx="14" ry="17" fill={br} />
        <path d="M632 452q8 6 6 22l-10 -4Z" fill={br} />
        <path d="M608 486q14 -8 28 0l10 118h-48Z" fill={br} />
        <path d="M612 492l-18 -18l-6 -22" stroke={br} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="586" cy="446" r="12" fill={br} />
        <circle cx="579" cy="438" r="7" fill={br} />
        <circle cx="593" cy="437" r="7" fill={br} />
        <path d="M636 494l8 40l-6 26" stroke={br} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M612 500l-4 90" stroke={hi} strokeWidth="3" opacity=".6" />
      </g>
    </g>
  );
};
/** Pemanjat bertali (helm oranye, harnes). Alas kaki di (0,0), tinggi ±80 satuan. */
const PemanjatGambar = ({ d = 1, f = 0, i = 0 }: { d?: number; f?: number; i?: number }) => (
  <g transform={`translate(0 -56) scale(${d} 1) rotate(${2 * Math.sin(f * 0.05 + i)})`} data-detail="pemanjat">
    <path d="M0 -60V-14" stroke="#2F3532" strokeWidth="2.5" />
    <circle cx="0" cy="-12" r="9" fill="#E8743B" />
    <path d="M-8 -4h16l4 34h-24Z" fill="#2E3331" />
    <path d="M-6 30l-10 26M6 30l14 20" stroke="#2E3331" strokeWidth="7" strokeLinecap="round" />
    <path d="M-8 2l-12 -16M8 2l8 -18" stroke="#2E3331" strokeWidth="6" strokeLinecap="round" />
    <path d="M-8 18h16" stroke="#F2C230" strokeWidth="4" />
  </g>
);

/** Isi spanduk (190 × 1000 satuan) = teks asli aksi + nama pembuat + dua siluet wajah, seperti spanduk aslinya. */
function SpandukIsi({ teks, kredit, k }: { teks: string[]; kredit: string; k: number }) {
  const W = 190,
    H = 1000;
  return (
    <g>
      <rect width={W} height={H * k} fill="#F2C230" />
      <svg width={W} height={H * k} viewBox={`0 0 ${W} ${H * k}`} overflow="hidden">
        {teks.map((t, i) => (
          <text key={i} x={W / 2} y={110 + i * 78} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={t.length > 7 ? 30 : 36} fill="#1F1F1C">
            {t}
          </text>
        ))}
        {kredit && (
          <text x={W / 2} y={110 + teks.length * 78 + 6} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="17" fill="#1F1F1C" letterSpacing="1">
            {kredit}
          </text>
        )}
        <path d={`M0 ${H}V${H - 280}q36 -10 42 -66q4 -42 -12 -66q26 -16 30 30l12 16l-10 10l6 16l-10 6q4 30 -12 42q-16 14 -4 42q22 30 56 34V${H}Z`} fill="#1F1F1C" />
        <path d={`M${W} ${H}V${H - 280}q-36 -10 -42 -66q-4 -42 12 -66q-26 -16 -30 30l-12 16l10 10l-6 16l10 6q-4 30 12 42q16 14 4 42q-22 30 -56 34V${H}Z`} fill="#1F1F1C" />
        {[0.3, 0.62].map((x) => (
          <path key={x} d={`M${W * x} 0V${H}`} stroke="#000" strokeWidth="6" opacity=".06" />
        ))}
      </svg>
    </g>
  );
}

// ------------------------------------------------------------------ benda tetap
/** Dinding tepi kolam melingkar: n ruas (muka luar + atas), r = jari-jari, t tinggi. */
function tepiKolam(r: number, t: number, n = 40): Benda[] {
  const { X, Z } = HI3.kolam;
  const out: Benda[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2,
      a1 = ((i + 1) / n) * Math.PI * 2;
    const P = (a: number, rr: number, y: number): V3 => [X + Math.cos(a) * rr, y, Z + Math.sin(a) * rr];
    const am = (a0 + a1) / 2;
    out.push({ jenis: 'muka', pts: [P(a0, r + 0.35, t), P(a1, r + 0.35, t), P(a1, r + 0.35, 0), P(a0, r + 0.35, 0)], n: [Math.cos(am), 0, Math.sin(am)], warna: '#B8AE9C', lempar: false, tekstur: { jenis: 'plester', kuat: 0.6 } });
    out.push({ jenis: 'muka', pts: [P(a0, r, t), P(a1, r, t), P(a1, r + 0.35, t), P(a0, r + 0.35, t)], n: [0, 1, 0], warna: '#D3CBBB', lempar: false, lapis: 1 });
  }
  return out;
}
function gedung(x0: number, x1: number, z0: number, z1: number, h: number, dinding: string, kaca: string | null, o: { lantai?: number; sisi?: boolean } = {}): Benda[] {
  const out: Benda[] = [{ jenis: 'balok', x0, x1, y0: 0, y1: h, z0, z1, warna: dinding, tekstur: { jenis: 'plester', kuat: 0.4 } }];
  if (kaca) {
    const garis: V3[][] = [];
    const tinggiL = o.lantai ?? 3.8;
    for (let y = tinggiL; y < h - 1; y += tinggiL) garis.push([[x0 + 0.6, y, z0 - 0.06], [x1 - 0.6, y, z0 - 0.06]]);
    for (let x = x0 + 3; x < x1 - 1; x += 3) garis.push([[x, 1.5, z0 - 0.06], [x, h - 1, z0 - 0.06]]);
    out.push(tegak('-z', z0 - 0.05, x0 + 0.6, x1 - 0.6, 1.5, h - 1, kaca, { bahan: 'kaca', lempar: false, geser: -0.1, goresan: { garis, warna: gelapkan(kaca, 0.75), lebar: 0.18 } }));
    if (o.sisi) {
      const gs: V3[][] = [];
      for (let y = tinggiL; y < h - 1; y += tinggiL) gs.push([[x1 + 0.06, y, z0 + 0.6], [x1 + 0.06, y, z1 - 0.6]]);
      out.push(tegak('+x', x1 + 0.05, z0 + 0.6, z1 - 0.6, 1.5, h - 1, gelapkan(kaca, 0.88), { bahan: 'kaca', lempar: false, geser: -0.1, goresan: { garis: gs, warna: gelapkan(kaca, 0.7), lebar: 0.18 } }));
    }
  }
  return out;
}
function pohonHI(X: number, Z: number, t: number, warna: string): Benda[] {
  const r = t * 0.26;
  return [
    { jenis: 'tiang', X, Z, tinggi: t * 0.55, r: 0.2, warna: '#6B4A3A' },
    { jenis: 'tajuk', X, Y: t * 0.72, Z, r, warna },
    { jenis: 'tajuk', X: X - r * 0.6, Y: t * 0.6, Z: Z + 0.3, r: r * 0.75, warna: gelapkan(warna, 0.92) },
    { jenis: 'tajuk', X: X + r * 0.6, Y: t * 0.64, Z: Z - 0.3, r: r * 0.72, warna },
  ];
}

const LED = {
  w: 260,
  h: 300,
  isi: (
    <g>
      <rect width="260" height="300" fill="#E8434A" />
      <path d="M98 70h64l-10 150h-44Z" fill="#F7F3EA" opacity=".9" />
      <path d="M98 70h64l-3 40h-58Z" fill="#C98445" />
      <path d="M144 50l26 -40" stroke="#FFF9EF" strokeWidth="6" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={108 + i * 14} y={120 + (i % 2) * 20} width="14" height="14" rx="3" fill="#CFE6F0" opacity=".9" />
      ))}
      <text x="130" y="268" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#FFF9EF">
        ES TEH SEGAR
      </text>
      {Array.from({ length: 19 }, (_, i) => (
        <path key={i} d={`M0 ${4 + i * 16}h260`} stroke="#000" strokeWidth="1" opacity=".06" />
      ))}
    </g>
  ),
};

let STATIS: Benda[] | null = null;
function bendaTetap(): Benda[] {
  if (STATIS) return STATIS;
  const { X, Z, r } = HI3.kolam;
  const T = HI3.tugu;
  const out: Benda[] = [
    // jalan bundaran, plaza, kolam
    lantai(-200, 200, -60, 300, 0, '#6F6B66', { tekstur: { jenis: 'aspal', kuat: 0.5 } }),
    lingkaranDatar(X, Z, r + 4.5, r + 4.5, 0.002, '#C9C0AF', { tekstur: { jenis: 'ubin', ukuran: 0.6, kuat: 0.5 } }, 56),
    lingkaranDatar(X, Z, r + 0.36, r + 0.36, 0.003, '#8C9A98', {}, 56),
    lingkaranDatar(X, Z, r, r, 0.004, '#7FA6B4', { bahan: 'air' }, 56),
    // trotoar utara (tempat penonton berdiri) + garis zebra di jalan
    lantai(-30, 30, -6, 6.9, 0.003, '#BDB4A3', { tekstur: { jenis: 'ubin', ukuran: 0.5, kuat: 0.6 } }),
    ...Array.from({ length: 8 }, (_, i) => lantai(-9 + i * 1.2, -8.4 + i * 1.2, -9, -6.4, 0.004, '#E8E2D2')),
    ...tepiKolam(r, 0.45),
    // tugu: alas di air, badan, kepala
    { jenis: 'balok', x0: -2.2, x1: 2.2, y0: 0, y1: 1.1, z0: T.z0 - 1, z1: T.z1 + 1, warna: '#9E8C76', tekstur: { jenis: 'plester', kuat: 0.8 } },
    { jenis: 'balok', x0: T.x0, x1: T.x1, y0: 1.1, y1: T.top - 0.4, z0: T.z0, z1: T.z1, warna: '#8C7A66', tekstur: { jenis: 'plester', kuat: 1.1 } },
    { jenis: 'balok', x0: T.x0 - 0.18, x1: T.x1 + 0.18, y0: T.top - 0.4, y1: T.top, z0: T.z0 - 0.18, z1: T.z1 + 0.18, warna: '#9E8C76' },
    // lampu sorot di kepala tugu
    { jenis: 'balok', x0: T.x0 - 0.35, x1: T.x0 - 0.05, y0: T.top - 0.6, y1: T.top - 0.4, z0: T.z0 - 0.4, z1: T.z0 - 0.15, warna: '#3B3F3D' },
    { jenis: 'balok', x0: T.x1 + 0.05, x1: T.x1 + 0.35, y0: T.top - 0.6, y1: T.top - 0.4, z0: T.z0 - 0.4, z1: T.z0 - 0.15, warna: '#3B3F3D' },
    // gedung latar
    ...gedung(-46, -30, 78, 96, 96, '#4A6470', '#5F7A86', { lantai: 4, sisi: true }),
    ...gedung(12, 28, 96, 112, 112, '#61808D', '#7F9AA6', { lantai: 4 }),
    { jenis: 'balok', x0: 17, x1: 23, y0: 112, y1: 118, z0: 100, z1: 108, warna: '#61808D' },
    ...gedung(30, 42, 150, 162, 84, '#8B9C9F', '#A6B4B6', { lantai: 3.5 }),
    ...gedung(36, 54, 120, 134, 70, '#98A8AE', '#B4C2C6'),
    ...gedung(-70, -50, 130, 146, 64, '#98A8AE', '#B4C2C6'),
    // gedung kaca hijau rendah (kanan) dan gedung batu ber-LED (kiri)
    ...gedung(12, 48, 64, 80, 17, '#E7E2D4', '#4F8F80', { lantai: 2.4 }),
    { jenis: 'balok', x0: -34, x1: -10, y0: 0, y1: 22, z0: 60, z1: 74, warna: '#C9B79A', tekstur: { jenis: 'plester', kuat: 0.8 } },
    { jenis: 'balok', x0: -34, x1: -10, y0: 22, y1: 22.6, z0: 59.6, z1: 74, warna: '#B09E82' },
    tegak('-z', 59.94, -30, -19, 7, 19.5, '#E8434A', { memancar: true, lempar: false, geser: -0.1, papan: LED }),
    { jenis: 'balok', x0: -30.4, x1: -18.6, y0: 6.6, y1: 7.0, z0: 59.6, z1: 60, warna: '#2F3532' },
    // tiang lampu jalan
    ...[-14, 14].flatMap((x) => [
      { jenis: 'tiang', X: x, Z: 5.2, tinggi: 9, r: 0.09, warna: '#5E6663' } as Benda,
      { jenis: 'balok', x0: x - (x < 0 ? -0.0 : 1.4), x1: x + (x < 0 ? 1.4 : 0), y0: 8.9, y1: 9.05, z0: 5.12, z1: 5.28, warna: '#5E6663' } as Benda,
    ]),
  ];
  // deret pohon di keliling bundaran (sisi jauh dan samping)
  for (let i = 0; i < 16; i++) {
    const a = Math.PI * (0.06 + (0.88 * i) / 15);
    const rr = r + 9 + acak(i) * 3;
    out.push(...pohonHI(X + Math.cos(a) * rr * 1.25, Z + Math.sin(a) * rr, 8 + acak(i + 7) * 3, i % 2 ? '#5E8B6C' : '#6F9A7A'));
  }
  // lampu kolam bertiang (di air)
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (1.1 + (0.8 * i) / 9);
    const px = X + Math.cos(a) * (r - 3),
      pz = Z + Math.sin(a) * (r - 3);
    out.push({ jenis: 'tiang', X: px, Z: pz, tinggi: 1.3, r: 0.05, warna: '#3B3F3D' });
    out.push({ jenis: 'balok', x0: px - 0.18, x1: px + 0.18, y0: 1.3, y1: 1.55, z0: pz - 0.18, z1: pz + 0.18, warna: '#2F3532' });
  }
  STATIS = out;
  return out;
}

/** Semburan air: tegak melingkar di sekitar tugu + lengkung dari tepi ke tengah (garis putih, bergerak halus). */
function airMancur(f: number): Benda[] {
  const { X, Z } = HI3.kolam;
  const out: Benda[] = [];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    const px = X + Math.cos(a) * 6.5,
      pz = Z + Math.sin(a) * 6.5;
    const h = 1.8 + 1.2 * acak(i) + 0.2 * Math.sin(f * 0.2 + i);
    out.push({ jenis: 'garis', pts: [[px, 0.01, pz], [px, h * 0.6, pz], [px + Math.cos(a) * 0.05, h, pz + Math.sin(a) * 0.05]], warna: '#EEF6F8', lebar: 0.09 });
  }
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (1.08 + (0.84 * i) / 9);
    const r0 = 16.5,
      r1 = 10.5;
    const tinggi = 3.4 + 0.3 * Math.sin(f * 0.1 + i);
    const pts: V3[] = Array.from({ length: 13 }, (_, k) => {
      const t = k / 12;
      const rr = r0 + (r1 - r0) * t;
      return [X + Math.cos(a) * rr, 4 * tinggi * t * (1 - t) + 0.05, Z + Math.sin(a) * rr];
    });
    out.push({ jenis: 'garis', pts, warna: '#EEF6F8', lebar: 0.07 });
  }
  out.push(lingkaranDatar(X, Z, 7.2, 7.2, 0.012, '#E9F3F6', { lempar: false }, 32));
  out.push(lingkaranDatar(X, Z, 5.8, 5.8, 0.013, '#7FA6B4', { bahan: 'air', lempar: false }, 32));
  return out;
}

function pagarBesi(): Benda[] {
  const z = HI3.pagarZ;
  const out: Benda[] = [
    { jenis: 'balok', x0: -30, x1: 30, y0: 0.95, y1: 1.02, z0: z - 0.03, z1: z + 0.03, warna: '#4A5250' },
    { jenis: 'balok', x0: -30, x1: 30, y0: 0.5, y1: 0.55, z0: z - 0.03, z1: z + 0.03, warna: '#4A5250' },
  ];
  for (let x = -30; x <= 30; x += 1.6) out.push({ jenis: 'tiang', X: x, Z: z, tinggi: 1.05, r: 0.035, warna: '#4A5250' });
  return out;
}

function bendaBergerak(f: number, spanduk: number, teks: string[], kredit: string, pemanjat: number): Benda[] {
  const T = HI3.tugu,
    S = HI3.spanduk;
  const out: Benda[] = [
    { jenis: 'tokoh', X: 0, Z: T.z0 + 0.6, Y: HI3.patungY, tinggi: 4.6, lebar: 1.4, gambar: (p) => <g transform={`translate(${p.x} ${p.y}) scale(${(3.77 * p.s).toFixed(4)})`}><PatungGambar /></g> },
  ];
  if (spanduk > 0.02) {
    const k = Math.min(1, spanduk);
    const yb = S.atas - S.panjang * k;
    out.push(tegak('-z', T.z0 - 0.03, S.x0, S.x1, yb, S.atas, '#F2C230', { lempar: false, geser: -0.2, papan: { w: 190, h: 1000 * k, isi: <SpandukIsi teks={teks} kredit={kredit} k={k} /> } }));
    out.push({ jenis: 'balok', x0: S.x0 - 0.05, x1: S.x1 + 0.05, y0: S.atas, y1: S.atas + 0.08, z0: T.z0 - 0.08, z1: T.z0, warna: '#3B3F3D' });
    if (k < 0.98) out.push({ jenis: 'balok', x0: S.x0 - 0.06, x1: S.x1 + 0.06, y0: yb - 0.12, y1: yb + 0.04, z0: T.z0 - 0.2, z1: T.z0 - 0.04, warna: '#D9A92A' });
  }
  const tempat: [number, number, number][] = [[T.x0 - 0.1, 9.0, -1], [T.x1 + 0.1, 10.6, 1], [T.x1 + 0.1, 6.2, 1]];
  for (let i = 0; i < Math.min(3, pemanjat); i++) {
    const [x, y, d] = tempat[i];
    const naik = y + 0.25 * Math.sin(f * 0.03 + i * 2);
    out.push({ jenis: 'garis', pts: [[x, T.top - 0.1, T.z0 - 0.1], [x, naik + 0.9, T.z0 - 0.1]], warna: '#2F3532', lebar: 0.025 });
    out.push({ jenis: 'tokoh', X: x, Z: T.z0 - 0.15, Y: naik, tinggi: 1.4, lebar: 0.45, gambar: (p) => <g transform={`translate(${p.x} ${p.y}) scale(${(4.2 * p.s).toFixed(4)})`}><PemanjatGambar d={d} f={f} i={i} /></g> });
  }
  return out;
}

// ------------------------------------------------------------------ langit
const AWAN: [number, number, number][] = [[-35, 12, 1.4], [-5, 22, 1.1], [25, 15, 1.5], [60, 26, 1.0], [-60, 28, 1.2], [90, 13, 1.3]];
export function LangitHI({ K, f, sore }: { K: ReturnType<typeof kamera>; f: number; sore: boolean }) {
  const arah = (az: number, el: number, jarak = 1200) => {
    const a = (az * Math.PI) / 180,
      e = (el * Math.PI) / 180;
    const q = K.cam(K.k.x + Math.sin(a) * Math.cos(e) * jarak, K.h + Math.sin(e) * jarak, K.k.z + Math.cos(a) * Math.cos(e) * jarak);
    if (q[2] < 5) return null;
    const [x, y] = K.scr(q);
    return x > -500 && x < 1580 && y > -500 && y < 2100 ? { x, y } : null;
  };
  const k = K.F / 1000;
  const pl = arah(-50 + ((f * 0.06) % 110), 30, 1600);
  const fl = arah(20 - ((f * 0.05) % 70), 20);
  return (
    <g data-detail="langit-hi">
      {AWAN.map(([az, el, s], i) => {
        const p = arah(az + f * 0.01, el);
        return p ? <Cloud key={i} x={p.x} y={p.y} s={s * k} tone={sore ? '#FFEBD6' : '#FFFFFF'} o={0.5} /> : null;
      })}
      {fl && <Flock x={fl.x} y={fl.y} f={f} n={5} s={0.5 * k} tone="#4A423C" />}
      {pl && <Plane x={pl.x} y={pl.y} s={0.4 * k} f={f} />}
    </g>
  );
}

export const CAHAYA_HI: Record<'siang' | 'sore', { matahari: Matahari; suasana: Suasana }> = {
  siang: {
    matahari: { az: -150, el: 50, warna: '#FFF0D4' },
    suasana: {
      langit: ['#A8C4D2', '#E4EAE7'],
      bayangan: '#3C4258',
      ambient: 0.68,
      diffuse: 0.7,
      pantul: 0.06,
      kabut: { warna: '#DDE4E4', mulai: 34, penuh: 190, maks: 0.6 },
    },
  },
  sore: {
    matahari: { az: -120, el: 24, warna: '#FFC98A' },
    suasana: {
      langit: ['#E9C3A0', '#F6E2C6'],
      bayangan: '#47395A',
      ambient: 0.64,
      diffuse: 0.8,
      kabut: { warna: '#F2D9BE', mulai: 30, penuh: 170, maks: 0.6 },
      nada: { warna: '#F2A65A', kuat: 0.07 },
    },
  },
};

export function BundaranHI({
  f,
  kam,
  spanduk = 1,
  teks = SPANDUK_ASLI.teks,
  kredit = SPANDUK_ASLI.kredit,
  pemanjat = 2,
  depan = true,
  isi = [],
  lensa,
  id = 'hi',
  pantulan = true,
  waktu = 'siang',
}: {
  f: number;
  kam: Kam;
  spanduk?: number;
  teks?: string[];
  kredit?: string;
  pemanjat?: number;
  depan?: boolean;
  isi?: IsiHI[];
  lensa?: Lensa;
  id?: string;
  pantulan?: boolean;
  waktu?: 'siang' | 'sore';
}) {
  const c = CAHAYA_HI[waktu];
  const benda: Benda[] = [
    ...bendaTetap(),
    ...airMancur(f),
    ...(depan ? pagarBesi() : []),
    ...bendaBergerak(f, spanduk, teks, kredit, pemanjat),
    ...isi.map((it) => ({ jenis: 'tokoh', X: it.X, Z: it.Z, Y: it.Y, tinggi: it.tinggi, lebar: it.lebar, gambar: it.gambar }) as Benda),
  ];
  return (
    <g data-set="bundaran-hi-v3">
      <Dunia3D kam={kam} benda={benda} matahari={c.matahari} suasana={c.suasana} lensa={lensa} pantulan={pantulan} f={f} id={id} langitIsi={(K) => <LangitHI K={K} f={f} sore={waktu === 'sore'} />} />
    </g>
  );
}
