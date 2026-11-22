// Stempel tinta (v2 film, 21 Nov 2026): kotak bergaris + teks kapital, muncul membesar lalu "menapak".
// Dibuat untuk "Badaknya Diselamatkan, Warganya?" (KAJIAN: BELUM ADA, ESDM: BANTAH). LEBAR KOTAK MENGIKUTI TEKS
// (pengguna 21 Nov 2026: "outline kotak itu tidak sesuai lebar teks kajian belum ada"): lebar = ukuran teks Lato Black
// (tabel lebar huruf yang sama dengan subtitle, diskalakan ke `size`) + bantalan kiri-kanan.
//   <Stempel x y teks muncul rot size warna />  x,y = tengah stempel (koordinat layar); muncul 0..1
import React from 'react';

// lebar huruf Lato Bold pada 44 px (sama dengan shared/film/v1/CaptionsDiam); Lato Black ±4% lebih lebar
const HURUF: Record<string, number> = { '0': 25.5, '1': 25.5, '2': 25.5, '3': 25.5, '4': 25.5, '5': 25.5, '6': 25.5, '7': 25.5, '8': 25.5, '9': 25.5, A: 31.2, B: 28.7, C: 29.5, D: 32.9, E: 25.2, F: 24.7, G: 31.8, H: 33.3, I: 13.8, J: 19.2, K: 30.7, L: 22.7, M: 40.9, N: 33.3, O: 35.2, P: 27.5, Q: 35.2, R: 28.8, S: 23.6, T: 26.2, U: 32, V: 31.2, W: 46, X: 29.9, Y: 28.8, Z: 27.1, ' ': 11, '.': 9.9, ',': 9.9, ':': 11.7, '!': 15.9, '?': 18.5, '-': 15.8, '/': 17, '+': 25.5, '%': 35.3 };
export const lebarStempel = (teks: string, size: number) => ([...teks].reduce((s, c) => s + (HURUF[c] ?? 30), 0) * size) / 44 * 1.04;

const klamp = (v: number) => Math.max(0, Math.min(1, v));
const halus = (u: number) => {
  const x = klamp(u);
  return x * x * (3 - 2 * x);
};

export function Stempel({ x, y, teks, muncul = 1, rot = -8, size = 40, warna = '#B23A2E', pad = 30 }: { x: number; y: number; teks: string; muncul?: number; rot?: number; size?: number; warna?: string; pad?: number }) {
  if (muncul <= 0) return null;
  const w = lebarStempel(teks, size) + pad * 2;
  const h = size * 2;
  return (
    <g data-sfx="pop" data-sfx-id={`stempel-${teks}`} data-box={`${x - w / 2},${y - h / 2},${x + w / 2},${y + h / 2}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${1.6 - 0.6 * halus(muncul)})`} opacity={klamp(muncul * 2)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="none" stroke={warna} strokeWidth={size * 0.2} />
      <text x="0" y={size * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={warna}>{teks}</text>
    </g>
  );
}
