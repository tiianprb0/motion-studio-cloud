// Kartu gag / popup dan kotak centang (dari seri Open Mic, syarat-protes-struk-kopi v5 yang disetujui).
// Kartu menulis data-box (kotak luar setelah rotasi) supaya audit memeriksa safe zone sosmed:
// kiri ≥60, atas ≥220, kanan ≤920, bawah ≤1480. Ukuran kartu mengikuti isi; jangan kotak besar kosong.
import React from 'react';
import { P, popIn } from '../../core/v1/core';

export const Card = ({ f, a, b, y, h, w = 340, cx = 735, children, rot = 3 }: { f: number; a: number; b: number; y: number; h: number; w?: number; cx?: number; children: React.ReactNode; rot?: number }) => {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const r = (Math.abs(rot) * Math.PI) / 180,
    bw = (w * Math.cos(r) + h * Math.sin(r)) / 2,
    bh = (h * Math.cos(r) + w * Math.sin(r)) / 2;
  return (
    <g opacity={o} transform={`translate(${cx} ${y}) rotate(${rot}) scale(${s})`} data-fx="kartu" data-box={`${Math.round(cx - bw)},${Math.round(y - bh)},${Math.round(cx + bw)},${Math.round(y + bh + 8)}`}>
      <rect x={-w / 2} y={-h / 2 + 8} width={w} height={h} rx="22" fill="#000" opacity=".25" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="22" fill={P.cream} />
      {children}
    </g>
  );
};
export const CardText = (p: React.SVGProps<SVGTextElement>) => <text fontFamily="Lato" fill={P.ink} {...p} />;
export const Tick = ({ x, y, on, q = 1, bad = false }: { x: number; y: number; on: boolean; q?: number; bad?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-17" y="-17" width="34" height="34" rx="7" fill="none" stroke={P.ink} strokeWidth="4" />
    {on && !bad && <path d="M-9 0l6 7l12-14" stroke={P.wine} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset={40 * (1 - q)} />}
    {on && bad && <path d="M-9 -9l18 18M9 -9l-18 18" stroke={P.wine} strokeWidth="6" strokeLinecap="round" opacity={q} />}
  </g>
);
