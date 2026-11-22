// Metafora visual tambahan (7 Nov 2026, dibuat untuk seri Lirik "the cure"; boleh dipakai Less. reguler).
// STATUS: kandidat, ditunjukkan ke pengguna lewat storyboard the cure.
// AwanKusut = gumpalan coretan gelap di atas kepala: pikiran yang meracuni, overthinking, beban yang dibawa diam-diam.
// Berbeda dari awan cuaca: garisnya kusut dan terus "mendidih" (bergerak pelan), bukan bentuk bulat.
import React from 'react';
import { P, unit } from '../../core/v1/core';

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Pusat (x, y), jari-jari r. besar 0..1 = tumbuh dari titik. menetes 0..1 = untaian tinta turun dari bawah awan
 *  sepanjang `turun` satuan (racun yang menyebar). Gambar di ruang yang sama dengan tokoh (ikut kamera). */
export function AwanKusut({ x, y, f, r = 110, besar = 1, menetes = 0, turun = 260, color = '#2E2A35', opacity = 0.85, seed = 1, id = 'awan-kusut' }: { x: number; y: number; f: number; r?: number; besar?: number; menetes?: number; turun?: number; color?: string; opacity?: number; seed?: number; id?: string }) {
  const b = unit(besar);
  if (b <= 0.01 && menetes <= 0) return null;
  const pts: string[] = [];
  const N = 90;
  for (let k = 0; k <= N; k++) {
    const th = k * 0.62 + seed + f * 0.045;
    const rho = r * b * (0.5 + 0.5 * Math.sin(k * 1.73 + seed * 2 + f * 0.02) * 0.6 + 0.4 * acak(k + seed * 13));
    pts.push(`${(x + Math.cos(th) * rho * 1.3).toFixed(1)} ${(y + Math.sin(th * 1.07) * rho * 0.72).toFixed(1)}`);
  }
  // Q dengan titik tengah supaya garis melengkung halus.
  const d = pts.reduce((s, p, i) => {
    if (i === 0) return `M${p}`;
    const [x0, y0] = pts[i - 1].split(' ').map(Number), [x1, y1] = p.split(' ').map(Number);
    return s + `Q${x0} ${y0} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
  }, '');
  // untaian jatuh di SAMPING kepala (bukan di depan wajah) dan sedikit melebar keluar
  // Tetesan tinta bergelombang yang meruncing, panjang tidak sama, berhenti setinggi bahu.
  const strands = [[-1.2, 1], [-0.9, 0.7], [1.0, 0.85]].map(([u, panjangRel], i) => {
    const L = turun * panjangRel * unit(menetes * 1.3 - i * 0.15);
    if (L <= 2) return null;
    const x0 = x + u * r * 1.25 * b, y0 = y + r * 0.35 * b;
    const sw = 9 * Math.sin(f * 0.07 + i * 2.3);
    const tit = (k: number) => [x0 + Math.sin(k * 5 + i + f * 0.05) * 10 + sw * k, y0 + k * L];
    const kiri = [0, 0.25, 0.5, 0.75, 1].map((k) => { const [px, py] = tit(k); return `${(px - 7 * (1 - k) - 2).toFixed(1)} ${py.toFixed(1)}`; });
    const kanan = [1, 0.75, 0.5, 0.25, 0].map((k) => { const [px, py] = tit(k); return `${(px + 7 * (1 - k) + 2).toFixed(1)} ${py.toFixed(1)}`; });
    const [ex, ey] = tit(1);
    return (
      <g key={i} opacity=".8">
        <path d={`M${kiri.join('L')}L${kanan.join('L')}Z`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth="2" />
        <path d={`M${ex} ${ey - 4}c-7 8 -7 16 0 18c7 -2 7 -10 0 -18Z`} fill={color} />
      </g>
    );
  });
  return (
    <g data-fx="awan-kusut" id={id} opacity={opacity} pointerEvents="none">
      <ellipse cx={x} cy={y} rx={r * 1.25 * b} ry={r * 0.7 * b} fill={color} opacity=".12" />
      <path d={d} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={P.wine} strokeWidth="2" fill="none" opacity=".35" transform={`translate(4 3)`} />
      {strands}
    </g>
  );
}
