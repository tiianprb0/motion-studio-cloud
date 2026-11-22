// Tanda sedih (8 Nov 2026, the cure v4; pengguna: "gradasi di wajah tapi warna biru menandakan kesedihan").
// WajahBiru: gradasi biru dari dahi memudar ke pipi, di atas wajah rig. Pusat wajah rig = (x, y - 279*s) untuk tokoh
// berdiri maupun duduk (y = garis kaki Person, s = skala Person). kuat 0..1.
import React from 'react';

export const pusatWajah = (x: number, y: number, s: number) => [x, y - 279 * s] as const;

export function WajahBiru({ x, y, s, kuat = 0.7, warna = '#3D5FA6', id = 'wajah-biru' }: { x: number; y: number; s: number; kuat?: number; warna?: string; id?: string }) {
  if (kuat <= 0.01) return null;
  const [cx, cy] = pusatWajah(x, y, s);
  const rx = 52 * s, ry = 50 * s; // di dalam garis wajah (tidak membentuk lingkaran gelap di latar)
  return (
    <g data-fx="wajah-biru" pointerEvents="none">
      <defs>
        <linearGradient id={id} x1="0" y1={cy - ry} x2="0" y2={cy + ry * 0.55} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={warna} stopOpacity={0.9 * kuat} />
          <stop offset="0.55" stopColor={warna} stopOpacity={0.45 * kuat} />
          <stop offset="1" stopColor={warna} stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy={cy + 6 * s} rx={rx} ry={ry} fill={`url(#${id})`} style={{ mixBlendMode: 'multiply' }} />
      {[-0.42, -0.14, 0.14, 0.42].map((u, i) => (
        <path key={i} d={`M${cx + u * rx} ${cy - ry * 0.55}v${ry * (0.32 + (i % 2) * 0.1)}`} stroke={warna} strokeWidth={2.6 * s} strokeLinecap="round" opacity={0.55 * kuat} />
      ))}
    </g>
  );
}
