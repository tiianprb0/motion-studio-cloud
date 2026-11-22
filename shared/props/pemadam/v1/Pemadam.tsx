// Perlengkapan pemadam kebakaran hutan untuk adegan duka (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1
// revisi naskah 1 ("Belasan petugas dan relawan pemadam meninggal dunia"; Republika 23 Okt 2026, CNN Indonesia 24 Okt 2026).
// Gaya tenang dan hormat: benda yang ditinggalkan (helm, selang, pita hitam), tanpa tubuh/korban digambar.
//   <HelmPemadam x y s warna />   helm lapangan diletakkan di tanah (alas di y), lampu kepala, garis reflektor
//   <PitaDuka x y s />            pita hitam terlipat
//   <SelangGulung x y s />        gulungan selang air di tanah
import React from 'react';

export function HelmPemadam({ x, y, s = 1, warna = '#E8B23A' }: { x: number; y: number; s?: number; warna?: string }) {
  return (
    <g data-detail="helm-pemadam" transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="150" ry="18" fill="#000" opacity=".25" />
      <path d="M-150 0Q-150 -20 -110 -24L110 -24Q150 -20 150 0Z" fill={warna} />
      <path d="M-104 -24Q-104 -150 0 -158Q104 -150 104 -24Z" fill={warna} />
      <path d="M-104 -24Q-104 -150 0 -158Q-40 -140 -54 -24Z" fill="#FFFFFF" opacity=".18" />
      <path d="M0 -158L0 -24" stroke="#C99528" strokeWidth="10" />
      <path d="M-100 -60Q0 -74 100 -60" stroke="#D9DEE0" strokeWidth="12" fill="none" />
      <rect x="-26" y="-112" width="52" height="30" rx="8" fill="#3C3F44" />
      <circle cx="0" cy="-97" r="10" fill="#F6E7B4" />
      <path d="M-150 0Q0 12 150 0" stroke="#B3862A" strokeWidth="4" fill="none" />
    </g>
  );
}

export function PitaDuka({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g data-detail="pita-duka" transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0C-30 -50 -60 -40 -40 -10C-28 8 -10 6 0 0Z" fill="#1F1D1F" />
      <path d="M0 0C30 -50 60 -40 40 -10C28 8 10 6 0 0Z" fill="#2A272A" />
      <path d="M-4 0L-30 70L-12 62L-2 6Z" fill="#1F1D1F" />
      <path d="M4 0L26 72L10 64L2 6Z" fill="#2A272A" />
      <circle cx="0" cy="-2" r="9" fill="#141214" />
    </g>
  );
}

export function SelangGulung({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g data-detail="selang" transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="120" ry="20" fill="#000" opacity=".2" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx="0" cy={-10 - i * 14} rx={110 - i * 6} ry={28 - i * 2} fill="none" stroke={i % 2 ? '#C9584A' : '#B44A3E'} strokeWidth="16" />
      ))}
      <path d="M100 -20Q160 -10 190 10" stroke="#B44A3E" strokeWidth="16" fill="none" strokeLinecap="round" />
      <rect x="182" y="2" width="30" height="20" rx="4" fill="#9AA3A7" />
    </g>
  );
}
