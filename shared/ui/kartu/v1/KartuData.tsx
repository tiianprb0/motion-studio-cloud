// Kartu data bersumber (v1, 20 Nov 2026). Dibuat untuk "Cuekin Buzzer" v1: kartu krem berjudul wine, isi bebas, baris
// sumber kecil di bawah. Pustaka sebelumnya hanya punya kartu gag (film/v1/Card.tsx) tanpa baris sumber.
//   <KartuData x y w h judul sumber muncul>{isi}</KartuData>   koordinat layar; muncul 0..1 = naik + memudar
// Jaga di safe zone (kiri ≥ 110, kanan ≤ 970, atas ≥ 220, bawah ≤ 1480).
import React from 'react';
import { P } from '../../../core/v1/core';

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const halus = (u: number) => {
  const x = klamp(u);
  return x * x * (3 - 2 * x);
};

export function KartuData({ x, y, w, h = 300, judul, sumber, muncul = 1, goyang, children }: { x: number; y: number; w: number; h?: number; judul: string; sumber: string; muncul?: number; /** f: kartu melayang halus */ goyang?: number; children?: React.ReactNode }) {
  if (muncul <= 0) return null;
  const dy = (1 - halus(muncul)) * 40 + (goyang === undefined ? 0 : 10 * Math.sin(goyang * 0.06));
  const rot = goyang === undefined ? 0 : 1.2 * Math.sin(goyang * 0.04);
  return (
    <g data-fx="kartu" data-box={`${x},${y},${x + w},${y + h}`} opacity={klamp(muncul * 1.6).toFixed(3)} transform={`translate(0 ${dy.toFixed(1)}) rotate(${rot.toFixed(2)} ${x + w / 2} ${y + h / 2})`} data-sfx="pop" data-sfx-id={`kartu-${judul}`}>
      <rect x={x + 8} y={y + 12} width={w} height={h} rx="22" fill={P.ink} opacity=".18" />
      <rect x={x} y={y} width={w} height={h} rx="22" fill={P.cream} />
      <text x={x + 32} y={y + 58} fontFamily="Lato" fontWeight="900" fontSize="32" fill={P.wine}>{judul}</text>
      {children}
      <text x={x + 32} y={y + h - 26} fontFamily="Lato" fontWeight="700" fontSize="22" fill="#7A7468">{sumber}</text>
    </g>
  );
}
