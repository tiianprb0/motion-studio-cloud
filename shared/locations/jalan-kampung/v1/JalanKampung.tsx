// Lokasi bersama: jalan kampung (v1, 10 Nov 2026; dibuat untuk "Kritik Bukan Utang Jasa" v2).
// SATU dunia, BANYAK sudut. Dunia dibangun dalam meter lalu diproyeksikan ke bingkai 1080×1920 dari kamera mana pun,
// jadi geometri, papan nama, dan letak benda tetap sama di semua shot (aturan "lokasi sama = geometri sama").
//
// Sumbu dunia: Z = sepanjang jalan (menjauh), X = melintang (kanan +), Y = tinggi. Jalan aspal X -2,4..2,4,
// selokan 2,4..2,95, teras 2,95..4,3, fasad rumah di X ±4,3. Gapura "GANG MELATI" di ujung Z 36, deret ruko di Z -20.
// Isi: kiri (X-) rumah krem berpagar, WARUNG (terpal biru, renceng sachet, bangku), rumah 2 lantai berjemuran,
//   pos ronda + kentongan, rumah bata, rumah hijau. Kanan (X+) rumah tosca, RUMAH IBU (kuning, teras, pot, kursi),
//   lahan dengan pohon mangga ±10 m, toko "SERVIS HP • PULSA" 2 lantai, mushola berkubah, rumah.
//   Jalan: tambalan, retak, polisi tidur, LUBANG berisi genangan (X 0,55, Z 9,5) di depan warung.
//   Tiang listrik + kabel, pohon di belakang atap, langit dengan SkyLife.
//
// Kamera `Kam`: x, z (posisi), yaw (derajat; 0 = menghadap +Z, 90 = menghadap +X/kanan, 180 = balik), h (tinggi mata m,
// bawaan 1,4), F (lensa px; 1000 = lebar, 2400 = tele), vx/vy (titik pusat; vy = garis horizon. Menaikkan vy ke atas
// bingkai + h besar = sudut tinggi). Tokoh: `berdiri(kam, X, Z)` → {x, y, s} untuk <Person x y s>; s = F / (200·Z').
// Dengan h 1,4 dan vy 1060, tokoh skala 2 berdiri di y 1620 (sama dengan lokasi lain).
// Isi dinamis (tokoh, sepeda, kerucut, kucing): prop `isi` = [{ X, Z, gambar: (p) => <…/> }], diurutkan kedalamannya
// bersama pagar, tiang, pohon, dan bangku, jadi tokoh bisa berdiri di depan/belakang benda dengan benar.
// `tambal` = lubang sudah ditambal (dipakai untuk foto arsip). `waktu` = 'siang' | 'sore'.
import React from 'react';
import { P } from '../../../core/v1/core';
import { SkyLife, Plant, TrashBin } from '../../_detail/v1/Detail';
import { Motorbike } from '../../../props/harian/v1/Props';

// kursi plastik teras (billboard, tampak depan), alas di (0,0), satuan rig
const KursiPlastik = ({ x, y, s, warna = '#3E7FA0' }: { x: number; y: number; s: number; warna?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-detail="kursi-plastik">
    <ellipse cx="0" cy="2" rx="52" ry="7" fill="#000" opacity=".12" />
    <path d="M-40 0l6 -84h68l6 84h-10l-6 -70h-48l-6 70Z" fill={warna} />
    <rect x="-42" y="-96" width="84" height="16" rx="5" fill={warna} />
    <path d="M-34 -96l4 -70q30 -10 60 0l4 70Z" fill={warna} />
    <path d="M-24 -150h48M-26 -132h52M-28 -114h56" stroke="#fff" strokeWidth="5" opacity=".25" />
  </g>
);
// sangkar burung tergantung (billboard)
const Sangkar = ({ x, y, s, f }: { x: number; y: number; s: number; f: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${2 * Math.sin(f * 0.06)})`} data-detail="sangkar">
    <path d="M0 -60v14" stroke="#59615E" strokeWidth="3" />
    <path d="M-26 0v-30q26 -26 52 0v30Z" fill="none" stroke="#C9A66B" strokeWidth="3" />
    {[-16, -6, 4, 14].map((x) => <path key={x} d={`M${x} 0v-36`} stroke="#C9A66B" strokeWidth="2" />)}
    <rect x="-30" y="-2" width="60" height="6" rx="2" fill="#8B6648" />
    <ellipse cx="2" cy="-14" rx="7" ry="5" fill="#E1A93B" />
  </g>
);

export type Kam = { x: number; z: number; yaw?: number; h?: number; F?: number; vx?: number; vy?: number };
type V3 = [number, number, number];
export type Titik = { x: number; y: number; s: number; z: number };
export type Isi = { X: number; Z: number; gambar: (p: Titik) => React.ReactNode; dalam?: number };

export const JALAN = { tepi: 2.4, selokan: 2.95, fasad: 4.3 };
export const LUBANG = { X: 0.55, Z: 9.5 };
export const WARUNG = { X: -4.3, z0: 5, z1: 11.5, bangku: { X: -3.25, Z: 8.2 } };
export const RUMAH_IBU = { X: 4.3, z0: 2, z1: 9, pintu: { X: 4.3, Z: 4.2 }, pagar: 3.05 };

const NEAR = 0.25;
export function kamera(k: Kam) {
  const yaw = ((k.yaw ?? 0) * Math.PI) / 180,
    c = Math.cos(yaw),
    sn = Math.sin(yaw);
  const h = k.h ?? 1.4,
    F = k.F ?? 1000,
    vx = k.vx ?? 540,
    vy = k.vy ?? 1060;
  const cam = (X: number, Y: number, Z: number): V3 => {
    const dx = X - k.x,
      dz = Z - k.z;
    return [dx * c - dz * sn, Y, dx * sn + dz * c];
  };
  const scr = (q: V3): [number, number] => [vx + (q[0] * F) / q[2], vy + ((h - q[1]) * F) / q[2]];
  const titik = (X: number, Y: number, Z: number): Titik => {
    const q = cam(X, Y, Z);
    const [x, y] = scr(q);
    return { x, y, s: F / (200 * q[2]), z: q[2] };
  };
  const poly = (pts: V3[]): string | null => {
    const cs = pts.map((p) => cam(p[0], p[1], p[2]));
    const out: V3[] = [];
    for (let i = 0; i < cs.length; i++) {
      const a = cs[i],
        b = cs[(i + 1) % cs.length];
      const ain = a[2] >= NEAR,
        bin = b[2] >= NEAR;
      if (ain) out.push(a);
      if (ain !== bin) {
        const t = (NEAR - a[2]) / (b[2] - a[2]);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]);
      }
    }
    if (out.length < 3) return null;
    return 'M' + out.map((q) => scr(q).map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  };
  const garis = (pts: V3[]): string | null => {
    const cs = pts.map((p) => cam(p[0], p[1], p[2]));
    if (cs.some((q) => q[2] < NEAR)) return null;
    return 'M' + cs.map((q) => scr(q).map((v) => v.toFixed(1)).join(' ')).join('L');
  };
  // affine kira-kira untuk teks/benda datar di bidang: (0,0)→a, (w,0)→b, (0,h)→d dalam piksel lokal
  const bidang = (a: V3, b: V3, d: V3, w: number, hh: number): string | null => {
    const A = cam(...a),
      B = cam(...b),
      D = cam(...d);
    if (A[2] < NEAR || B[2] < NEAR || D[2] < NEAR) return null;
    const [ax, ay] = scr(A),
      [bx, by] = scr(B),
      [dx, dy] = scr(D);
    return `matrix(${(bx - ax) / w} ${(by - ay) / w} ${(dx - ax) / hh} ${(dy - ay) / hh} ${ax} ${ay})`;
  };
  return { cam, scr, titik, poly, garis, bidang, F, h, vx, vy, k };
}
export const berdiri = (k: Kam, X: number, Z: number) => kamera(k).titik(X, 0, Z);
type K = ReturnType<typeof kamera>;

// ------------------------------------------------------------------ data dunia
type Unit = {
  side: -1 | 1;
  z0: number;
  z1: number;
  h: number;
  wall: string;
  trim: string;
  roof: string;
  kind: 'rumah' | 'rumah2' | 'warung' | 'toko' | 'mushola' | 'lahan' | 'ruko';
  pagar?: string;
  pintu?: number; // posisi pintu 0..1 di sepanjang fasad
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
// celah rumah kanan Z -2..2 = gang kecil (dinding samping), kiri Z 17..19,6 = pos ronda
const POLE: [number, number][] = [[-2.75, -10], [-2.75, 4.2], [2.75, 12.4], [-2.75, 19.2], [2.75, 27], [-2.75, 33.5]];
const POHON_BELAKANG: [number, number, number, string][] = [
  [-9, 2, 5.5, '#6F9A7A'], [-10, 14, 6.5, '#5E8B6C'], [-9.5, 29, 6, '#76A283'], [9.5, -6, 6, '#6F9A7A'], [10, 18, 7, '#5E8B6C'], [9, 31, 5.5, '#76A283'], [-8, -16, 6, '#5E8B6C'],
];

// ------------------------------------------------------------------ helper gambar
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};
const kabut = (z: number) => Math.min(0.42, Math.max(0, (z - 14) / 70));
const Path = ({ d, ...p }: { d: string | null } & React.SVGProps<SVGPathElement>) => (d ? <path d={d} {...p} /> : null);

// bidang fasad: titik di fasad unit (u meter dari z0 sepanjang jalan, v meter ke atas), sedikit maju ke jalan (dx)
const fp = (u: Unit, uu: number, v: number, dx = 0): V3 => [u.side * (JALAN.fasad - dx), v, u.z0 + uu];
const rect = (u: Unit, a: number, b: number, v0: number, v1: number, dx = 0.01): V3[] => [fp(u, a, v0, dx), fp(u, b, v0, dx), fp(u, b, v1, dx), fp(u, a, v1, dx)];

// papan/teks di fasad: dibaca benar dari jalan di kedua sisi (sisi kanan dibalik arah u-nya)
function Papan({ K, u, a, b, v0, v1, dx = 0.05, w, h, children }: { K: K; u: Unit; a: number; b: number; v0: number; v1: number; dx?: number; w: number; h: number; children: React.ReactNode }) {
  const [p, q] = u.side > 0 ? [b, a] : [a, b];
  const t = K.bidang(fp(u, p, v1, dx), fp(u, q, v1, dx), fp(u, p, v0, dx), w, h);
  return t ? <g transform={t}>{children}</g> : null;
}
// teks di bidang bebas; tidak digambar kalau bidangnya di belakang kamera
const Bidang = ({ t, children }: { t: string | null; children: React.ReactNode }) => (t ? <g transform={t}>{children}</g> : null);

function Jendela({ K, u, a, w, v0, hgt, teralis = true }: { K: K; u: Unit; a: number; w: number; v0: number; hgt: number; teralis?: boolean }) {
  const kaca = '#AFC9D3';
  return (
    <g>
      <Path d={K.poly(rect(u, a - 0.08, a + w + 0.08, v0 - 0.1, v0 + hgt + 0.08))} fill={u.trim} />
      <Path d={K.poly(rect(u, a, a + w, v0, v0 + hgt, 0.02))} fill={kaca} />
      <Path d={K.poly(rect(u, a, a + w * 0.45, v0 + hgt * 0.55, v0 + hgt, 0.025))} fill="#fff" opacity=".22" />
      <Path d={K.poly(rect(u, a + w / 2 - 0.03, a + w / 2 + 0.03, v0, v0 + hgt, 0.03))} fill={u.trim} />
      {teralis &&
        Array.from({ length: 5 }, (_, i) => <Path key={i} d={K.garis([fp(u, a + (w * (i + 0.5)) / 5, v0, 0.04), fp(u, a + (w * (i + 0.5)) / 5, v0 + hgt, 0.04)])} stroke="#3E4743" strokeWidth={Math.max(0.6, K.F / 900)} opacity=".55" />)}
      <Path d={K.poly(rect(u, a - 0.12, a + w + 0.12, v0 - 0.18, v0 - 0.1, 0.05))} fill={shade(u.wall, 0.8)} />
    </g>
  );
}

function Atap({ K, u, ext = 0.2 }: { K: K; u: Unit; ext?: number }) {
  const s = u.side,
    h = u.h;
  const x0 = s * (JALAN.fasad - 0.65),
    x1 = s * (JALAN.fasad + 3.2);
  const za = u.z0 - ext,
    zb = u.z1 + ext;
  return (
    <g>
      {/* plafon teritis (terlihat dari bawah) */}
      <Path d={K.poly([[s * JALAN.fasad, h, za], [s * JALAN.fasad, h, zb], [x0, h, zb], [x0, h, za]])} fill={shade(u.wall, 0.62)} />
      {/* genteng */}
      <Path d={K.poly([[x0, h, za], [x0, h, zb], [x1, h + 1.7, zb], [x1, h + 1.7, za]])} fill={u.roof} />
      {[0.25, 0.5, 0.75].map((t) => (
        <Path key={t} d={K.garis([[x0 + (x1 - x0) * t, h + 1.7 * t, za], [x0 + (x1 - x0) * t, h + 1.7 * t, zb]])} stroke={shade(u.roof, 0.78)} strokeWidth={1.5} />
      ))}
      {/* lisplang */}
      <Path d={K.poly([[x0, h - 0.22, za], [x0, h - 0.22, zb], [x0, h, zb], [x0, h, za]])} fill={shade(u.trim, 1.15)} />
    </g>
  );
}

function Fasad({ K, u, f }: { K: K; u: Unit; f: number }) {
  const W = u.z1 - u.z0;
  const mid = K.cam(u.side * JALAN.fasad, u.h / 2, (u.z0 + u.z1) / 2);
  // fasad hanya terlihat dari sisi jalan; dari belakang (kamera di luar fasad) tidak digambar
  const kamDiJalan = u.side * K.k.x < JALAN.fasad;
  if (!kamDiJalan) return null;
  const fog = kabut(mid[2]);
  const outline = K.poly(rect(u, 0, W, 0, u.h, 0));
  const pintuU = (u.pintu ?? 0.5) * W;
  return (
    <g data-detail={`fasad-${u.kind}`}>
      {u.kind === 'lahan' ? (
        <>
          {/* tembok rendah + gerbang lahan */}
          <Path d={K.poly(rect(u, 0, W, 0, 1.2, 1.25))} fill={u.wall} />
          <Path d={K.poly(rect(u, 0, W, 1.1, 1.2, 1.26))} fill={shade(u.wall, 0.85)} />
          {Array.from({ length: Math.floor(W / 1.2) }, (_, i) => (
            <Path key={i} d={K.garis([fp(u, i * 1.2 + 0.6, 0, 1.27), fp(u, i * 1.2 + 0.6, 1.1, 1.27)])} stroke={shade(u.wall, 0.82)} strokeWidth={1.4} />
          ))}
        </>
      ) : (
        <>
          <Path d={outline} fill={u.wall} />
          {/* plint bawah + bayangan teritis */}
          <Path d={K.poly(rect(u, 0, W, 0, 0.35))} fill={shade(u.wall, 0.82)} />
          <Path d={K.poly(rect(u, 0, W, u.h - 0.35, u.h))} fill="#000" opacity=".1" />
          {/* pilar pemisah unit */}
          <Path d={K.poly(rect(u, 0, 0.18, 0, u.h, 0.03))} fill={shade(u.wall, 0.75)} />
          <Path d={K.poly(rect(u, W - 0.18, W, 0, u.h, 0.03))} fill={shade(u.wall, 0.75)} />
        </>
      )}
      {(u.kind === 'rumah' || u.kind === 'rumah2') && (
        <>
          <Path d={K.poly(rect(u, pintuU - 0.5, pintuU + 0.5, 0, 2.25))} fill={u.trim} />
          <Path d={K.poly(rect(u, pintuU - 0.42, pintuU + 0.42, 0.05, 2.15, 0.02))} fill={shade(u.trim, 1.25)} />
          <Path d={K.poly(rect(u, pintuU - 0.36, pintuU - 0.05, 1.3, 2.0, 0.03))} fill="#AFC9D3" opacity=".8" />
          <Path d={K.poly(rect(u, pintuU + 0.05, pintuU + 0.36, 1.3, 2.0, 0.03))} fill="#AFC9D3" opacity=".8" />
          {[0.18, 0.72].map((t) => {
            const a = t * W;
            return Math.abs(a + 0.6 - pintuU) > 1.1 && a + 1.2 < W - 0.2 ? <Jendela key={t} K={K} u={u} a={a} w={1.2} v0={0.95} hgt={1.15} /> : null;
          })}
          {u.nomor && (
            <Papan K={K} u={u} a={pintuU + 0.62 * (u.side > 0 ? -1.6 : 1)} b={pintuU + (u.side > 0 ? -0.62 : 0.98)} v0={1.86} v1={2.1} dx={0.03} w={36} h={24}>
              <rect width="36" height="24" rx="3" fill="#3E7FA0" />
              <text x="18" y="18" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="16" fill="#fff">{u.nomor}</text>
            </Papan>
          )}
          {u.kind === 'rumah2' && (
            <>
              <Path d={K.poly(rect(u, 0.1, W - 0.1, 3.0, 3.15, 0.6))} fill={shade(u.wall, 0.7)} />
              {[0.15, 0.55].map((t) => <Jendela key={t} K={K} u={u} a={t * W} w={1.3} v0={3.7} hgt={1.25} teralis={false} />)}
              {/* pagar balkon + jemuran */}
              <Path d={K.poly(rect(u, 0.1, W - 0.1, 3.15, 4.0, 0.62))} fill="none" stroke={u.trim} strokeWidth={2} />
              {Array.from({ length: Math.floor(W / 0.5) }, (_, i) => (
                <Path key={i} d={K.garis([fp(u, 0.3 + i * 0.5, 3.15, 0.62), fp(u, 0.3 + i * 0.5, 4.0, 0.62)])} stroke={u.trim} strokeWidth={1.6} />
              ))}
              {['#E7899A', '#95B8A2', '#F1C977', '#7E8FB0'].map((c, i) => (
                <Path key={c} d={K.poly(rect(u, 0.6 + i * 0.75, 1.1 + i * 0.75, 4.05 - (i % 2) * 0.15, 4.6, 0.55))} fill={c} opacity=".9" />
              ))}
              <Path d={K.garis([fp(u, 0.3, 4.62, 0.55), fp(u, W - 0.3, 4.62, 0.55)])} stroke="#59615E" strokeWidth={1.2} />
            </>
          )}
        </>
      )}
      {u.kind === 'warung' && <Warung K={K} u={u} f={f} />}
      {u.kind === 'toko' && (
        <>
          {/* rolling door setengah terbuka + etalase */}
          <Path d={K.poly(rect(u, 0.6, W - 0.6, 0, 2.6))} fill="#3B3F3D" />
          <Path d={K.poly(rect(u, 0.6, W - 0.6, 1.6, 2.6, 0.02))} fill="#A3A9A6" />
          {Array.from({ length: 6 }, (_, i) => <Path key={i} d={K.garis([fp(u, 0.6, 1.7 + i * 0.16, 0.03), fp(u, W - 0.6, 1.7 + i * 0.16, 0.03)])} stroke="#7D8582" strokeWidth={1.2} />)}
          <Path d={K.poly(rect(u, 1.2, W - 1.2, 0, 1.0, 0.5))} fill="#BFD7DD" opacity=".85" />
          <Path d={K.poly(rect(u, 1.2, W - 1.2, 0, 0.12, 0.5))} fill="#8E9692" />
          <Papan K={K} u={u} a={0.6} b={W - 0.6} v0={2.7} v1={3.25} w={400} h={50}>
            <rect width="400" height="50" fill={u.trim} />
            <text x="200" y="36" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#FFF9EF" letterSpacing="2">SERVIS HP • PULSA</text>
          </Papan>
          {[0.2, 0.6].map((t) => <Jendela key={t} K={K} u={u} a={t * W} w={1.4} v0={3.9} hgt={1.2} teralis={false} />)}
        </>
      )}
      {u.kind === 'mushola' && (
        <>
          {[0.12, 0.38, 0.62].map((t) => (
            <g key={t}>
              <Path d={K.poly(rect(u, t * W, t * W + 1.1, 0.9, 2.5))} fill="#3E7F6A" />
              <Path d={K.poly(rect(u, t * W + 0.08, t * W + 1.02, 0.98, 2.2, 0.02))} fill="#CFE3D8" />
            </g>
          ))}
          <Path d={K.poly(rect(u, 0.86 * W - 0.6, 0.86 * W + 0.6, 0, 2.6))} fill="#3E7F6A" />
          <Papan K={K} u={u} a={0.1 * W} b={0.9 * W} v0={2.8} v1={3.3} w={400} h={50}>
            <rect width="400" height="50" rx="6" fill="#3E7F6A" />
            <text x="200" y="36" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#FFF9EF" letterSpacing="3">MUSHOLA</text>
          </Papan>
        </>
      )}
      {u.kind !== 'lahan' && <Atap K={K} u={u} />}
      {u.kind === 'mushola' && <Kubah K={K} u={u} />}
      {/* kabut jarak jauh */}
      {fog > 0 && outline && <path d={outline} fill="#DCE8EC" opacity={fog} />}
    </g>
  );
}

function Kubah({ K, u }: { K: K; u: Unit }) {
  const p = K.titik(u.side * (JALAN.fasad + 1.8), u.h + 1.4, (u.z0 + u.z1) / 2);
  if (p.z < NEAR) return null;
  const r = 1.4 * p.s * 200 * 0.5;
  return (
    <g>
      <rect x={p.x - r * 0.9} y={p.y - r * 0.2} width={r * 1.8} height={r * 0.6} fill="#E7E2D4" />
      <path d={`M${p.x - r} ${p.y}A${r} ${r * 1.1} 0 0 1 ${p.x + r} ${p.y}Z`} fill="#3E7F6A" />
      <path d={`M${p.x - r * 0.4} ${p.y - r * 0.7}A${r} ${r * 1.1} 0 0 1 ${p.x + r * 0.2} ${p.y - r * 1.0}`} stroke="#fff" strokeWidth={r * 0.08} opacity=".25" fill="none" />
      <path d={`M${p.x} ${p.y - r * 1.1}v${-r * 0.5}`} stroke={P.gold} strokeWidth={r * 0.06} />
      <circle cx={p.x} cy={p.y - r * 1.7} r={r * 0.14} fill={P.gold} />
    </g>
  );
}

function Warung({ K, u, f }: { K: K; u: Unit; f: number }) {
  const W = u.z1 - u.z0,
    s = u.side;
  const sachet = ['#E7899A', '#F1C977', '#7E8FB0', '#95B8A2', '#E1A93B', '#C24E4E'];
  return (
    <g data-detail="warung">
      {/* bukaan gelap + rak dagangan */}
      <Path d={K.poly(rect(u, 0.5, W - 0.5, 0, 2.5))} fill="#4A3F36" />
      {[0.5, 1.05, 1.6].map((v, j) => (
        <g key={v}>
          <Path d={K.poly(rect(u, 0.6, W - 0.6, v, v + 0.05, 0.02))} fill="#8B6648" />
          {Array.from({ length: 14 }, (_, i) => (
            <Path key={i} d={K.poly(rect(u, 0.75 + i * 0.37, 0.98 + i * 0.37, v + 0.05, v + 0.33 + ((i + j) % 3) * 0.06, 0.03))} fill={sachet[(i * 5 + j * 2) % 6]} opacity=".9" />
          ))}
        </g>
      ))}
      {/* papan nama */}
      <Papan K={K} u={u} a={0.5} b={W - 0.5} v0={2.6} v1={3.15} w={420} h={55}>
        <rect width="420" height="55" fill="#C24E4E" />
        <text x="210" y="40" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill="#FFF9EF" letterSpacing="3">WARUNG MAKMUR</text>
      </Papan>
      {/* etalase kaca (kotak di depan bukaan) */}
      <Path d={K.poly([[s * 3.75, 0, u.z0 + 1.0], [s * 3.75, 0, u.z0 + 3.4], [s * 3.75, 1.05, u.z0 + 3.4], [s * 3.75, 1.05, u.z0 + 1.0]])} fill="#8B6648" />
      <Path d={K.poly([[s * 3.75, 0.45, u.z0 + 1.1], [s * 3.75, 0.45, u.z0 + 3.3], [s * 3.75, 1.0, u.z0 + 3.3], [s * 3.75, 1.0, u.z0 + 1.1]])} fill="#CFE3EA" opacity=".85" />
      {Array.from({ length: 6 }, (_, i) => (
        <Path key={i} d={K.poly([[s * 3.74, 0.5, u.z0 + 1.2 + i * 0.35], [s * 3.74, 0.5, u.z0 + 1.45 + i * 0.35], [s * 3.74, 0.75, u.z0 + 1.45 + i * 0.35], [s * 3.74, 0.75, u.z0 + 1.2 + i * 0.35]])} fill={sachet[i]} opacity=".8" />
      ))}
      {/* galon + tabung gas di teras */}
      {[[3.95, u.z0 + 4.2, '#9CC7D8'], [3.95, u.z0 + 4.7, '#9CC7D8']].map(([x, z, c], i) => (
        <Path key={i} d={K.poly([[s * (x as number), 0, z as number], [s * (x as number), 0, (z as number) + 0.32], [s * (x as number), 0.48, (z as number) + 0.32], [s * (x as number), 0.48, z as number]])} fill={c as string} opacity=".9" />
      ))}
      <Path d={K.poly([[s * 3.95, 0, u.z0 + 5.3], [s * 3.95, 0, u.z0 + 5.6], [s * 3.95, 0.58, u.z0 + 5.6], [s * 3.95, 0.58, u.z0 + 5.3]])} fill="#5BAA6A" />
      {/* terpal biru miring dari fasad ke tepi selokan */}
      <Path d={K.poly([[s * JALAN.fasad, 2.75, u.z0 - 0.1], [s * JALAN.fasad, 2.75, u.z1 + 0.1], [s * 2.95, 2.3, u.z1 + 0.1], [s * 2.95, 2.3, u.z0 - 0.1]])} fill="#3F7FA8" />
      {Array.from({ length: 7 }, (_, i) => (
        <Path key={i} d={K.poly([[s * JALAN.fasad, 2.75, u.z0 + i * 1.0], [s * JALAN.fasad, 2.75, u.z0 + i * 1.0 + 0.45], [s * 2.95, 2.3, u.z0 + i * 1.0 + 0.45], [s * 2.95, 2.3, u.z0 + i * 1.0]])} fill="#356E94" />
      ))}
      {/* renceng sachet menggantung di tepi terpal */}
      {Array.from({ length: 9 }, (_, i) => {
        const z = u.z0 + 0.5 + i * 0.7,
          sway = 0.03 * Math.sin(f * 0.08 + i);
        return <Path key={'r' + i} d={K.poly([[s * 2.98, 2.28, z], [s * 2.98, 2.28, z + 0.16], [s * (2.98 + sway), 1.55 + (i % 3) * 0.12, z + 0.16], [s * (2.98 + sway), 1.55 + (i % 3) * 0.12, z]])} fill={sachet[(i * 7) % 6]} opacity=".95" />;
      })}
      {/* tiang terpal */}
      {[u.z0 + 0.1, u.z1 - 0.1].map((z) => <Path key={z} d={K.garis([[s * 2.97, 0, z], [s * 2.97, 2.3, z]])} stroke="#59615E" strokeWidth={Math.max(1, K.F / (K.cam(s * 2.97, 0, z)[2] * 60))} />)}
    </g>
  );
}

// ------------------------------------------------------------------ objek berdiri (diurutkan kedalamannya)
type Obj = { z: number; node: React.ReactNode };

function pagarSegmen(K: K, X: number, z0: number, z1: number, warna: string, key: string, celah?: [number, number]): Obj[] {
  const out: Obj[] = [];
  for (let z = z0; z < z1 - 0.01; z += 1) {
    const zb = Math.min(z1, z + 1);
    if (celah && zb > celah[0] && z < celah[1]) {
      // gerbang terbuka: dua tiang pagar di tepi celah
      for (const zc of celah) {
        if (zc < z || zc > zb) continue;
        const c = K.cam(X, 0.6, zc);
        if (c[2] > NEAR) out.push({ z: c[2], node: <Path key={key + 'g' + zc} d={K.poly([[X, 0, zc - 0.09], [X, 0, zc + 0.09], [X, 1.25, zc + 0.09], [X, 1.25, zc - 0.09]])} fill={warna} /> });
      }
      const pieces: [number, number][] = [[z, Math.min(zb, celah[0])], [Math.max(z, celah[1]), zb]];
      for (const [a, b] of pieces) if (b - a > 0.05) out.push(...pagarSegmen(K, X, a, b, warna, key + 'p' + a));
      continue;
    }
    const c = K.cam(X, 0.5, (z + zb) / 2);
    if (c[2] < NEAR) continue;
    out.push({
      z: c[2],
      node: (
        <g key={key + z}>
          <Path d={K.poly([[X, 0, z], [X, 0, zb], [X, 0.25, zb], [X, 0.25, z]])} fill="#D8CDB9" />
          <Path d={K.garis([[X, 1.05, z], [X, 1.05, zb]])} stroke={warna} strokeWidth={Math.max(1, (K.F / c[2]) * 0.05)} />
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((t) => (
            <Path key={t} d={K.garis([[X, 0.25, z + (zb - z) * t], [X, 1.05, z + (zb - z) * t]])} stroke={warna} strokeWidth={Math.max(0.8, (K.F / c[2]) * 0.03)} />
          ))}
        </g>
      ),
    });
  }
  return out;
}

function TiangListrik({ K, X, Z }: { K: K; X: number; Z: number }) {
  const b = K.titik(X, 0, Z),
    t = K.titik(X, 8, Z);
  const w = Math.max(2, 0.2 * b.s * 200);
  const arm = 0.8 * b.s * 200;
  return (
    <g data-detail="tiang-listrik">
      <ellipse cx={b.x} cy={b.y} rx={w * 2} ry={w * 0.4} fill="#000" opacity=".15" />
      <path d={`M${b.x - w / 2} ${b.y}L${t.x - w * 0.35} ${t.y}H${t.x + w * 0.35}L${b.x + w / 2} ${b.y}Z`} fill="#8E9692" />
      <path d={`M${b.x + w * 0.1} ${b.y}L${t.x + w * 0.1} ${t.y}`} stroke="#fff" strokeWidth={w * 0.2} opacity=".2" />
      <path d={`M${t.x - arm} ${t.y + w}H${t.x + arm}`} stroke="#5E6663" strokeWidth={w * 0.5} />
      {[-0.8, -0.3, 0.3, 0.8].map((k) => <circle key={k} cx={t.x + arm * k} cy={t.y + w * 0.4} r={w * 0.35} fill="#DAD6CE" />)}
      {/* papan nomor tiang */}
      <rect x={b.x - w * 1.1} y={b.y - (b.y - t.y) * 0.3} width={w * 2.2} height={w * 1.4} fill="#F1C977" />
    </g>
  );
}

function Pohon({ K, X, Z, tinggi = 9, warna = '#6F9A7A' }: { K: K; X: number; Z: number; tinggi?: number; warna?: string }) {
  const b = K.titik(X, 0, Z);
  if (b.z < NEAR) return null;
  const m = b.s * 200; // px per meter
  const tr = 0.35 * m,
    th = tinggi * 0.4 * m,
    cr = tinggi * 0.32 * m;
  const cy = b.y - tinggi * 0.62 * m;
  return (
    <g data-detail="pohon" opacity={1 - kabut(b.z) * 0.6}>
      <ellipse cx={b.x} cy={b.y} rx={cr * 0.9} ry={cr * 0.12} fill="#000" opacity=".12" />
      <path d={`M${b.x - tr / 2} ${b.y}L${b.x - tr * 0.3} ${b.y - th}M${b.x + tr / 2} ${b.y}L${b.x + tr * 0.3} ${b.y - th}`} stroke="#6B4A3A" strokeWidth={tr * 0.5} />
      <path d={`M${b.x - tr / 2} ${b.y}Q${b.x} ${b.y - th * 0.5} ${b.x - tr * 0.2} ${b.y - th * 1.1}L${b.x + tr * 0.3} ${b.y - th}Q${b.x + tr * 0.2} ${b.y - th * 0.4} ${b.x + tr / 2} ${b.y}Z`} fill="#7A5644" />
      {[[-0.6, 0.1, 0.75], [0.55, 0.15, 0.7], [0, -0.35, 0.85], [-0.3, 0.45, 0.6], [0.35, 0.5, 0.6]].map(([dx, dy, r], i) => (
        <circle key={i} cx={b.x + dx * cr} cy={cy + dy * cr} r={r * cr} fill={i % 2 ? shade(warna, 0.9) : warna} />
      ))}
      {[[-0.4, -0.4], [0.3, -0.1], [-0.1, 0.25]].map(([dx, dy], i) => <circle key={'h' + i} cx={b.x + dx * cr} cy={cy + dy * cr} r={0.28 * cr} fill="#fff" opacity=".1" />)}
    </g>
  );
}

function PosRonda({ K }: { K: K }) {
  const X0 = -4.2,
    X1 = -2.95,
    z0 = 17.3,
    z1 = 19.3;
  const kayu = '#9C6B45';
  const posts: [number, number][] = [[X0, z0], [X0, z1], [X1, z0], [X1, z1]];
  return (
    <g data-detail="pos-ronda">
      <Path d={K.poly([[X0, 0.45, z0], [X1, 0.45, z0], [X1, 0.45, z1], [X0, 0.45, z1]])} fill="#B9875C" />
      <Path d={K.poly([[X1, 0.3, z0], [X1, 0.45, z0], [X1, 0.45, z1], [X1, 0.3, z1]])} fill={kayu} />
      {posts.map(([x, z], i) => <Path key={i} d={K.garis([[x, 0, z], [x, 2.4, z]])} stroke={kayu} strokeWidth={Math.max(1.5, K.F / (K.cam(x, 0, z)[2] * 9))} />)}
      <Path d={K.poly([[X0 - 0.3, 2.4, z0 - 0.3], [X1 + 0.3, 2.4, z0 - 0.3], [X1 + 0.3, 2.4, z1 + 0.3], [X0 - 0.3, 2.4, z1 + 0.3]])} fill="#A85B45" />
      <Path d={K.poly([[X1 + 0.3, 2.25, z0 - 0.3], [X1 + 0.3, 2.4, z0 - 0.3], [X1 + 0.3, 2.4, z1 + 0.3], [X1 + 0.3, 2.25, z1 + 0.3]])} fill="#8B4F3F" />
      {/* kentongan */}
      <Path d={K.poly([[X1 + 0.02, 1.2, z0 + 0.25], [X1 + 0.02, 1.2, z0 + 0.45], [X1 + 0.02, 1.95, z0 + 0.45], [X1 + 0.02, 1.95, z0 + 0.25]])} fill="#7A5644" />
      <Bidang t={K.bidang([X1 + 0.03, 2.2, z0 + 0.5], [X1 + 0.03, 2.2, z1 - 0.2], [X1 + 0.03, 1.95, z0 + 0.5], 200, 40)}>
        <rect width="200" height="40" fill="#FFF9EF" />
        <text x="100" y="29" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="24" fill="#5E4836">POS RONDA</text>
      </Bidang>
    </g>
  );
}

function Gapura({ K }: { K: K }) {
  const Z = 36;
  const pilar = (x: number) => K.poly([[x - 0.25, 0, Z], [x + 0.25, 0, Z], [x + 0.25, 4.1, Z], [x - 0.25, 4.1, Z]]);
  return (
    <g data-detail="gapura">
      <Path d={pilar(-2.7)} fill="#E8E2D4" />
      <Path d={pilar(2.7)} fill="#E8E2D4" />
      <Path d={K.poly([[-3.1, 3.4, Z], [3.1, 3.4, Z], [3.1, 4.1, Z], [-3.1, 4.1, Z]])} fill="#8B4354" />
      <Path d={K.poly([[-2.95, 0, Z], [-2.45, 0, Z], [-2.45, 0.6, Z], [-2.95, 0.6, Z]])} fill="#C24E4E" />
      <Path d={K.poly([[2.45, 0, Z], [2.95, 0, Z], [2.95, 0.6, Z], [2.45, 0.6, Z]])} fill="#C24E4E" />
      <Bidang t={K.bidang([-2.9, 4.0, Z], [2.9, 4.0, Z], [-2.9, 3.5, Z], 580, 50)}>
        <text x="290" y="38" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="38" fill="#FFF9EF" letterSpacing="6">GANG MELATI</text>
      </Bidang>
    </g>
  );
}

// deret rumah menghadap kamera di ujung jalan (Z 42) dan ruko di Z -20 (untuk kamera balik)
function UjungDepan({ K }: { K: K }) {
  const Z = 44;
  const blok: [number, number, number, string, string][] = [[-14, -6, 3.4, '#D9C9A0', '#A85B45'], [-6, -2.6, 6, '#B9C7B8', '#7E5A4A'], [2.6, 7, 3.2, '#E6C3BE', '#B5654A'], [7, 15, 5.6, '#C9D6DA', '#8B4F3F']];
  return (
    <g data-detail="ujung-jalan">
      {blok.map(([x0, x1, h, w, r], i) => (
        <g key={i}>
          <Path d={K.poly([[x0, 0, Z], [x1, 0, Z], [x1, h, Z], [x0, h, Z]])} fill={w} />
          <Path d={K.poly([[x0 - 0.2, h, Z], [x1 + 0.2, h, Z], [x1 - 0.8, h + 1.4, Z + 2], [x0 + 0.8, h + 1.4, Z + 2]])} fill={r} />
          {Array.from({ length: Math.floor((x1 - x0) / 2.2) }, (_, j) => (
            <Path key={j} d={K.poly([[x0 + 0.7 + j * 2.2, 1, Z], [x0 + 1.8 + j * 2.2, 1, Z], [x0 + 1.8 + j * 2.2, 2.1, Z], [x0 + 0.7 + j * 2.2, 2.1, Z]])} fill="#AFC9D3" />
          ))}
        </g>
      ))}
      <Path d={K.poly([[-14, 0, Z], [14, 0, Z], [14, 6, Z], [-14, 6, Z]])} fill="#DCE8EC" opacity=".35" />
    </g>
  );
}
function UjungBelakang({ K }: { K: K }) {
  const Z = -22;
  const blok: [number, number, string, string][] = [[-14, -7, '#C9B79A', 'FOTOKOPI'], [-7, -2.6, '#A9B7B3', 'APOTEK'], [2.6, 8, '#D2B48C', 'BENGKEL'], [8, 15, '#B8B09A', 'LAUNDRY']];
  return (
    <g data-detail="ujung-ruko">
      {blok.map(([x0, x1, w, n], i) => (
        <g key={i}>
          <Path d={K.poly([[x0, 0, Z], [x1, 0, Z], [x1, 6.2, Z], [x0, 6.2, Z]])} fill={w} />
          <Path d={K.poly([[x0 + 0.3, 0, Z], [x1 - 0.3, 0, Z], [x1 - 0.3, 2.8, Z], [x0 + 0.3, 2.8, Z]])} fill="#8E9692" />
          <Bidang t={K.bidang([x1 - 0.3, 3.6, Z], [x0 + 0.3, 3.6, Z], [x1 - 0.3, 3.0, Z], 400, 60)}>
            <rect width="400" height="60" fill="#2F3A36" />
            <text x="200" y="44" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="38" fill="#F1C977">{n}</text>
          </Bidang>
        </g>
      ))}
      <Path d={K.poly([[-14, 0, Z], [14, 0, Z], [14, 7, Z], [-14, 7, Z]])} fill="#DCE8EC" opacity=".3" />
    </g>
  );
}

// ------------------------------------------------------------------ tanah: jalan, selokan, teras, lubang
function Tanah({ K, tambal, f }: { K: K; tambal: boolean; f: number }) {
  const zA = -22,
    zB = 44;
  const lub = LUBANG;
  const ring = (r: number, n = 18, jit = 0.18, seed = 3): V3[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + jit * Math.sin(i * 2.7 + seed) * Math.cos(i * 1.3);
      return [lub.X + Math.cos(a) * r * 1.25 * k, 0.005, lub.Z + Math.sin(a) * r * 0.8 * k];
    });
  return (
    <g data-detail="tanah">
      {/* teras/halaman kedua sisi */}
      <Path d={K.poly([[-14, 0, zA], [-2.4, 0, zA], [-2.4, 0, zB], [-14, 0, zB]])} fill="#CFC4AE" />
      <Path d={K.poly([[2.4, 0, zA], [14, 0, zA], [14, 0, zB], [2.4, 0, zB]])} fill="#CFC4AE" />
      {/* ubin teras (garis melintang) */}
      {Array.from({ length: 40 }, (_, i) => -20 + i * 1.6).map((z) => (
        <g key={z} opacity=".5">
          <Path d={K.garis([[-4.3, 0, z], [-2.95, 0, z]])} stroke="#B9AD96" strokeWidth={1} />
          <Path d={K.garis([[2.95, 0, z], [4.3, 0, z]])} stroke="#B9AD96" strokeWidth={1} />
        </g>
      ))}
      {/* selokan */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <Path d={K.poly([[s * 2.4, 0, zA], [s * 2.95, 0, zA], [s * 2.95, 0, zB], [s * 2.4, 0, zB]])} fill="#59615C" />
          <Path d={K.poly([[s * 2.5, 0.002, zA], [s * 2.85, 0.002, zA], [s * 2.85, 0.002, zB], [s * 2.5, 0.002, zB]])} fill="#3E4743" />
          <Path d={K.garis([[s * 2.4, 0.01, zA], [s * 2.4, 0.01, zB]])} stroke="#B4AC9E" strokeWidth={2.5} />
          <Path d={K.garis([[s * 2.95, 0.01, zA], [s * 2.95, 0.01, zB]])} stroke="#B4AC9E" strokeWidth={2.5} />
          {/* tutup selokan beton di depan pintu */}
          {(s < 0 ? [0.6, 14.5, 23] : [-6, 4.2, 25]).map((z) => <Path key={z} d={K.poly([[s * 2.4, 0.02, z - 0.6], [s * 2.95, 0.02, z - 0.6], [s * 2.95, 0.02, z + 0.6], [s * 2.4, 0.02, z + 0.6]])} fill="#A9A294" />)}
        </g>
      ))}
      {/* aspal */}
      <Path d={K.poly([[-2.4, 0, zA], [2.4, 0, zA], [2.4, 0, zB], [-2.4, 0, zB]])} fill="#77736C" />
      {/* tambalan lama + retak */}
      {[[0.9, 3.4, 1.9, 4.6], [-1.7, 12.6, -0.6, 13.8], [-0.3, 21, 1.4, 22.3], [-1.2, -6, 0.2, -4.6]].map(([x0, z0, x1, z1], i) => (
        <Path key={i} d={K.poly([[x0, 0.003, z0], [x1, 0.003, z0 + 0.1], [x1 - 0.05, 0.003, z1], [x0 + 0.08, 0.003, z1 - 0.05]])} fill="#625F59" />
      ))}
      {[[[-0.8, 6], [-0.4, 6.8], [-0.6, 7.6]], [[1.5, 15], [1.1, 16.2]], [[-1.9, 26], [-1.3, 27]]].map((ln, i) => (
        <Path key={'c' + i} d={K.garis(ln.map(([x, z]) => [x, 0.004, z] as V3))} stroke="#55524D" strokeWidth={1.5} fill="none" />
      ))}
      {/* polisi tidur */}
      <Path d={K.poly([[-2.4, 0.004, 16.2], [2.4, 0.004, 16.2], [2.4, 0.004, 16.6], [-2.4, 0.004, 16.6]])} fill="#3B3F3D" />
      {Array.from({ length: 8 }, (_, i) => (
        <Path key={'pt' + i} d={K.poly([[-2.4 + i * 0.6, 0.005, 16.2], [-2.1 + i * 0.6, 0.005, 16.2], [-2.1 + i * 0.6, 0.005, 16.6], [-2.4 + i * 0.6, 0.005, 16.6]])} fill="#F1C977" />
      ))}
      {/* lubang */}
      {tambal ? (
        <Path d={K.poly(ring(0.7, 14, 0.08))} fill="#4F4C47" />
      ) : (
        <g data-detail="lubang">
          <Path d={K.poly(ring(0.78, 20, 0.22, 5))} fill="#8C877E" />
          <Path d={K.poly(ring(0.66, 20, 0.2, 5))} fill="#4A4540" />
          <Path d={K.poly(ring(0.5, 18, 0.16, 9))} fill="#A9C8D6" />
          <Path d={K.poly(ring(0.32, 14, 0.2, 2))} fill="#CFE3EA" opacity={0.7 + 0.2 * Math.sin(f * 0.1)} />
          {[[0.9, 0.2], [1.1, -0.3], [-0.9, 0.35], [-1.15, -0.1]].map(([dx, dz], i) => (
            <Path key={i} d={K.garis([[lub.X + dx * 0.75, 0.004, lub.Z + dz * 0.6], [lub.X + dx * 1.15, 0.004, lub.Z + dz * 1.1], [lub.X + dx * 1.45, 0.004, lub.Z + dz * 1.0]])} stroke="#4A4540" strokeWidth={1.6} fill="none" />
          ))}
          {/* serpihan aspal */}
          {[[0.95, 0.5], [-0.7, -0.62], [0.2, 0.78], [1.15, -0.4]].map(([dx, dz], i) => {
            const p = K.titik(lub.X + dx, 0, lub.Z + dz);
            return p.z > NEAR ? <ellipse key={'s' + i} cx={p.x} cy={p.y} rx={p.s * 14} ry={p.s * 6} fill="#5A5650" /> : null;
          })}
        </g>
      )}
    </g>
  );
}

// kabel listrik: lengkung dari tiang ke tiang (dan melintang jalan)
function Kabel({ K }: { K: K }) {
  const seg = (a: [number, number], b: [number, number], dy: number, sag = 0.6) => {
    const pts: V3[] = Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      return [a[0] + (b[0] - a[0]) * t, 7.6 + dy - sag * 4 * t * (1 - t), a[1] + (b[1] - a[1]) * t];
    });
    return K.garis(pts);
  };
  const out: React.ReactNode[] = [];
  for (let i = 0; i < POLE.length - 1; i++)
    for (const dy of [0, -0.25, -0.5]) out.push(<Path key={`${i}-${dy}`} d={seg(POLE[i], POLE[i + 1], dy, 0.5 + Math.abs(dy))} stroke="#3B3F3D" strokeWidth={1.4} fill="none" opacity=".75" />);
  return <g data-detail="kabel">{out}</g>;
}

// ------------------------------------------------------------------ adegan
export function JalanKampung({ f, kam, waktu = 'siang', isi = [], tambal = false, langit = true }: { f: number; kam: Kam; waktu?: 'siang' | 'sore'; isi?: Isi[]; tambal?: boolean; langit?: boolean }) {
  const K = kamera(kam);
  const sore = waktu === 'sore';
  // urut fasad + pohon mangga (jauh → dekat)
  const bangunan: Obj[] = UNITS.map((u, i) => ({ z: K.cam(u.side * JALAN.fasad, 0, (u.z0 + u.z1) / 2)[2], node: <Fasad key={'u' + i} K={K} u={u} f={f} /> }));
  bangunan.push({ z: K.cam(5.9, 0, 11.6)[2], node: <Pohon key="mangga" K={K} X={5.9} Z={11.6} tinggi={10} warna="#5E8B6C" /> });
  bangunan.push({ z: K.cam(-3.6, 0, 18.3)[2], node: <PosRonda key="pos" K={K} /> });
  // objek berdiri + isi
  const objek: Obj[] = [];
  for (const u of UNITS)
    if (u.pagar) {
      const pz = u.z0 + (u.pintu ?? 0.5) * (u.z1 - u.z0);
      objek.push(...pagarSegmen(K, u.side * 3.05, u.z0 + 0.3, u.z1 - 0.3, u.pagar, 'pg' + u.z0, [pz - 0.6, pz + 0.6]));
    }
  for (const [X, Z] of POLE) {
    const c = K.cam(X, 0, Z)[2];
    if (c > NEAR) objek.push({ z: c, node: <TiangListrik key={'tl' + Z} K={K} X={X} Z={Z} /> });
  }
  const benda: [number, number, (p: Titik) => React.ReactNode][] = [
    [3.6, 2.8, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.1} kind={1} pot="#C9805A" />],
    [3.6, 8.3, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.2} kind={2} pot="#A86F4E" />],
    [3.55, 7.2, (p) => <TrashBin x={p.x} y={p.y} color="#3E7F6A" />],
    [-3.6, 2.4, (p) => <Plant x={p.x} y={p.y} s={p.s} kind={0} pot="#8B6648" />],
    [-3.5, 15.6, (p) => <Plant x={p.x} y={p.y} s={p.s * 1.1} kind={1} />],
    [3.55, 24.5, (p) => <Plant x={p.x} y={p.y} s={p.s} kind={2} />],
    [3.75, 5.6, (p) => <KursiPlastik x={p.x} y={p.y} s={p.s} />],
    [3.75, 6.4, (p) => <KursiPlastik x={p.x} y={p.y} s={p.s} warna="#C24E4E" />],
    [-3.7, -0.4, (p) => <Sangkar x={p.x} y={p.y - p.s * 200 * 2.3} s={p.s} f={f} />],
    [-3.55, 22.6, (p) => <g transform={`translate(${p.x} ${p.y})`}><Motorbike s={p.s * 2.1} color="#3E6A8A" /></g>],
  ];
  for (const [X, Z, g] of benda) {
    const p = K.titik(X, 0, Z);
    if (p.z > 0.6) objek.push({ z: p.z, node: <g key={'b' + X + Z}>{g(p)}</g> });
  }
  // bangku warung (penutup sampai lantai: tokoh duduk digambar di belakangnya lewat `dalam`)
  {
    const b = WARUNG.bangku;
    const c = K.cam(b.X, 0, b.Z)[2];
    if (c > NEAR)
      objek.push({
        z: c - 0.3,
        node: (
          <g key="bangku" data-detail="bangku-warung">
            <Path d={K.poly([[b.X - 0.2, 0.45, b.Z - 1.1], [b.X + 0.2, 0.45, b.Z - 1.1], [b.X + 0.2, 0.45, b.Z + 1.1], [b.X - 0.2, 0.45, b.Z + 1.1]])} fill="#B9875C" />
            <Path d={K.poly([[b.X + 0.2, 0.0, b.Z - 1.1], [b.X + 0.2, 0.45, b.Z - 1.1], [b.X + 0.2, 0.45, b.Z + 1.1], [b.X + 0.2, 0.0, b.Z + 1.1]])} fill="#8B6648" />
          </g>
        ),
      });
  }
  for (const it of isi) {
    const p = K.titik(it.X, 0, it.Z);
    if (p.z > NEAR) objek.push({ z: p.z + (it.dalam ?? 0), node: <g key={'isi' + it.X + '-' + it.Z}>{it.gambar(p)}</g> });
  }
  bangunan.sort((a, b) => b.z - a.z);
  objek.sort((a, b) => b.z - a.z);
  const langitAtas = sore ? '#F6D7B0' : '#BFDCE8',
    langitBawah = sore ? '#FBE9CC' : '#E8F2F2';
  return (
    <g data-set="jalan-kampung">
      <defs>
        <linearGradient id="jk-langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={langitAtas} />
          <stop offset="1" stopColor={langitBawah} />
        </linearGradient>
      </defs>
      <rect x="-1200" y="-1200" width="3500" height={K.vy + 1300} fill="url(#jk-langit)" />
      {langit && (
        <g transform={`translate(0 ${K.vy - 1060})`}>
          <SkyLife f={f} time={sore ? 'sore' : 'siang'} />
        </g>
      )}
      <rect x="-1200" y={K.vy - 4} width="3500" height="3000" fill="#CFC4AE" />
      <Tanah K={K} tambal={tambal} f={f} />
      {(Math.abs(Math.cos(((kam.yaw ?? 0) * Math.PI) / 180)) > 0.3) && ((kam.yaw ?? 0) > 90 && (kam.yaw ?? 0) < 270 ? <UjungBelakang K={K} /> : <><UjungDepan K={K} /><Gapura K={K} /></>)}
      {POHON_BELAKANG.map(([X, Z, t, c]) => <Pohon key={'pb' + X + Z} K={K} X={X} Z={Z} tinggi={t + 3} warna={c} />)}
      {bangunan.map((o) => o.node)}
      <Kabel K={K} />
      {objek.map((o) => o.node)}
      {sore && <rect x="-1200" y="-1200" width="3500" height="4400" fill="#F2A65A" opacity=".1" />}
    </g>
  );
}
