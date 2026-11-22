// Benda kecil bersama (7 Nov 2026): petunjuk cerita di thumbnail (arahan pengguna butir 4) dan properti film.
// Semua alas/pusat di (0,0), skala s. Gaya flat pastel Less., tanpa garis tepi tebal.
import React from 'react';
import { P } from '../../../core/v1/core';

/** Jam dinding bulat; jam/menit dalam derajat (0 = jam 12). Pusat di (0,0), jari-jari 60·s. */
export const Jam = ({ s = 1, jam = 300, menit = 0 }: { s?: number; jam?: number; menit?: number }) => (
  <g transform={`scale(${s})`} data-prop="jam">
    <circle r="62" fill="#E9DCC5" />
    <circle r="54" fill={P.cream} />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d="M0 -46v8" stroke={P.ink} strokeWidth={i % 3 ? 2 : 4} strokeLinecap="round" transform={`rotate(${i * 30})`} opacity=".7" />
    ))}
    <path d="M0 0v-26" stroke={P.ink} strokeWidth="6" strokeLinecap="round" transform={`rotate(${jam})`} />
    <path d="M0 0v-40" stroke={P.ink} strokeWidth="4" strokeLinecap="round" transform={`rotate(${menit})`} />
    <path d="M0 6v-44" stroke={P.wine} strokeWidth="2" strokeLinecap="round" transform={`rotate(${menit + 140})`} />
    <circle r="5" fill={P.wine} />
  </g>
);

/** Struk belanja (kertas termal, tepi bawah bergerigi). Pusat atas di (0,0). */
export const Struk = ({ s = 1, judul = 'STRUK', rot = 0 }: { s?: number; judul?: string; rot?: number }) => {
  const w = 120, h = 190;
  const d = `M${-w / 2} 0h${w}v${h}${Array.from({ length: 8 }, () => `l${-w / 16} 8l${-w / 16} -8`).join('')}Z`;
  return (
    <g transform={`rotate(${rot}) scale(${s})`} data-prop="struk">
      <path d={d} fill="#000" opacity=".14" transform="translate(6 7)" />
      <path d={d} fill="#FFFDF7" />
      <text x="0" y="30" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="18" fill={P.ink}>{judul}</text>
      <path d={`M${-w / 2 + 14} 44h${w - 28}`} stroke={P.ink} strokeWidth="1.5" strokeDasharray="4 4" opacity=".5" />
      {[62, 80, 98, 116, 134].map((y, i) => (
        <g key={y} opacity=".55">
          <path d={`M${-w / 2 + 14} ${y}h${30 + (i % 3) * 10}`} stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
          <path d={`M${w / 2 - 34} ${y}h20`} stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
      <path d={`M${-w / 2 + 14} 156h${w - 28}`} stroke={P.ink} strokeWidth="1.5" strokeDasharray="4 4" opacity=".5" />
      <path d={`M${-w / 2 + 14} 174h34M${w / 2 - 44} 174h30`} stroke={P.wine} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
};

/** Mic di tiang (panggung open mic). Kepala mic di (0,0), tiang turun sepanjang `tiang`·s. */
export const MicBerdiri = ({ s = 1, tiang = 700, miring = -12 }: { s?: number; tiang?: number; miring?: number }) => (
  <g transform={`scale(${s})`} data-prop="mic-berdiri">
    <path d={`M0 40L${-Math.sin((miring * Math.PI) / 180) * tiang} ${tiang}`} stroke="#3A3A3A" strokeWidth="9" strokeLinecap="round" />
    <g transform={`rotate(${miring})`}>
      <rect x="-9" y="10" width="18" height="46" rx="6" fill="#2C2C2C" />
      <rect x="-15" y="-34" width="30" height="48" rx="15" fill="#5B5B5B" />
      <path d="M-15 -22h30M-15 -10h30M-15 2h30" stroke="#7C7C7C" strokeWidth="2" />
      <path d="M-9 -26q4 -6 10 -6" stroke="#9A9A9A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="-15" y="8" width="30" height="6" rx="3" fill="#C9A25A" />
    </g>
  </g>
);
