// Properti minuman v1 (7 Nov 2026, seri Lirik "the cure"). Konvensi sama dengan shared/props/harian/v1:
// titik (0,0) = titik genggam di tengah badan gelas, jadi bisa langsung jadi holdRight/holdLeft rig.
// Untuk diletakkan di meja: alas mug ada di y = +17 (geser y sebesar itu).
import React from 'react';
import { P } from '../../../core/v1/core';

/** Mug teh. hangat 0..1: uap naik dan warna teh (1 = baru diseduh, 0 = sudah dingin, uap hilang, permukaan kusam).
 *  Tinggi ±34 satuan rig (≈ 10 cm untuk tokoh 330 satuan = 1,65 m). tempel = isi tambahan di badan mug (mis. label). */
export const Mug = ({ f = 0, hangat = 1, s = 1, color = P.cream, stripe = P.wine, dir = 1, tempel }: { f?: number; hangat?: number; s?: number; color?: string; stripe?: string; dir?: number; tempel?: React.ReactNode }) => (
  <g transform={`scale(${s * dir} ${s})`} data-prop="mug-teh">
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${-7 + i * 7} -22q${5 * Math.sin(f * 0.15 + i)} -9 0 -18t0 -18`} stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity={hangat * (0.35 + 0.25 * Math.sin(f * 0.1 + i * 2))} />
    ))}
    <path d="M14 -10c11 0 11 16 0 16" stroke={color} strokeWidth="5" fill="none" />
    <path d="M14 -10c11 0 11 16 0 16" stroke="#000" strokeWidth="5" fill="none" opacity=".06" />
    <path d="M-16 -17h32v28a6 6 0 0 1 -6 6h-20a6 6 0 0 1 -6 -6Z" fill={color} />
    <path d="M6 -17h10v28a6 6 0 0 1 -6 6h-4Z" fill="#000" opacity=".06" />
    <rect x="-16" y="-3" width="32" height="5" fill={stripe} opacity=".85" />
    <ellipse cx="0" cy="-17" rx="16" ry="3.6" fill={hangat > 0.3 ? '#B5743F' : '#8E6A4E'} />
    <ellipse cx="-5" cy="-17.6" rx="5" ry="1.2" fill="#fff" opacity={0.18 + 0.2 * hangat} />
    {tempel}
  </g>
);
