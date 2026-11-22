// ⚠️ ATURAN WAJIB (11 Nov 2026): video memakai dunia 3D sebagai bawaan, lewat sistem cahaya _proyeksi/v2/Dunia.tsx (Dunia3D)
// yang memakai kamera ini; jangan menggambar dunia video langsung dengan mesin ini tanpa cahaya. Flat 2D hanya kalau diminta. Lihat references/arahan-pengguna.md "ATURAN WAJIB".
// Mesin proyeksi 3D sederhana untuk lokasi bersama (v1, 10 Nov 2026). Diangkat dari shared/locations/jalan-kampung/v1
// (yang sudah terkunci) supaya lokasi lain bisa memakai cara yang sama: dunia dibangun dalam METER lalu diproyeksikan
// ke bingkai 1080×1920 dari kamera mana pun, jadi geometri dan benda tetap sama di semua sudut.
//
// Sumbu: X kanan (+), Y atas (+), Z menjauh (+). Kamera `Kam`: x, z (posisi), yaw (derajat; 0 = menghadap +Z, 90 = +X),
// h (tinggi mata m, bawaan 1,4), F (lensa px; 1000 lebar, 2400 tele), vx/vy (titik pusat; vy = garis horizon).
// Tokoh: titik(X, 0, Z) → {x, y, s} untuk <Person x y s>; s = F / (200·Z') (tokoh 330 satuan rig = 1,65 m).
// Dengan h 1,4 dan vy 1060, tokoh skala 2 berdiri di y 1620. Tokoh duduk: mata ±1,2 m.
import React from 'react';

export type Kam = { x: number; z: number; yaw?: number; h?: number; F?: number; vx?: number; vy?: number };
export type V3 = [number, number, number];
export type Titik = { x: number; y: number; s: number; z: number };
/** Isi dinamis yang diurutkan kedalamannya bersama benda lokasi: tokoh, properti, kucing. */
export type Isi = { X: number; Z: number; gambar: (p: Titik) => React.ReactNode; dalam?: number };

export const NEAR = 0.25;
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
  /** Poligon dunia → path layar, dipotong di bidang dekat. */
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
  /** Affine kira-kira untuk teks/gambar datar di bidang: (0,0)→a, (w,0)→b, (0,h)→d dalam piksel lokal. */
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
export type K = ReturnType<typeof kamera>;

/** Kamera memutari poros (X, Z) sejauh `deg` derajat: poros tetap di posisi layar, latar menyapu (arc shot). */
export const orbit = (k: Kam, X: number, Z: number, deg: number): Kam => {
  const a = (deg * Math.PI) / 180,
    c = Math.cos(a),
    sn = Math.sin(a);
  const dx = k.x - X,
    dz = k.z - Z;
  return { ...k, x: X + dx * c + dz * sn, z: Z - dx * sn + dz * c, yaw: (k.yaw ?? 0) + deg };
};
/** Interpolasi kamera (hanya kunci yang diberikan di b). */
export const kamAntara = (a: Kam, b: Partial<Kam>, t: number): Kam => {
  const o: Record<string, number> = { ...(a as Record<string, number>) };
  for (const key of Object.keys(b)) o[key] = (o[key] ?? 0) + (((b as Record<string, number>)[key] ?? 0) - (o[key] ?? 0)) * t;
  return o as unknown as Kam;
};

export const Path = ({ d, ...p }: { d: string | null } & React.SVGProps<SVGPathElement>) => (d ? <path d={d} {...p} /> : null);
/** Teks/gambar di bidang; tidak digambar kalau bidangnya di belakang kamera. */
export const Bidang = ({ t, children }: { t: string | null; children: React.ReactNode }) => (t ? <g transform={t}>{children}</g> : null);

/** Kotak (balok) sejajar sumbu: digambar hanya sisi yang menghadap kamera, urut jauh → dekat. */
export function Balok({ K, x0, x1, y0, y1, z0, z1, warna, sisi, atas, depan }: { K: K; x0: number; x1: number; y0: number; y1: number; z0: number; z1: number; warna: string; sisi?: string; atas?: string; depan?: string }) {
  const cx = K.k.x,
    cz = K.k.z,
    cy = K.h;
  const faces: { d: string | null; fill: string; z: number }[] = [];
  const add = (pts: V3[], fill: string) => {
    const zc = pts.reduce((s, p) => s + K.cam(...p)[2], 0) / pts.length;
    faces.push({ d: K.poly(pts), fill, z: zc });
  };
  // depan (z0) terlihat bila kamera di z < z0; belakang bila z > z1
  if (cz < z0) add([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], depan ?? warna);
  if (cz > z1) add([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], depan ?? warna);
  if (cx < x0) add([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], sisi ?? warna);
  if (cx > x1) add([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], sisi ?? warna);
  if (cy > y1) add([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], atas ?? warna);
  faces.sort((a, b) => b.z - a.z);
  return <g>{faces.map((f, i) => <Path key={i} d={f.d} fill={f.fill} />)}</g>;
}
