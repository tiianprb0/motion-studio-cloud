// Properti bersama: LAMPION kertas 2D (v1, 17 Nov 2026). Dibuat untuk video perkenalan web Less. ("Kampung Less."), tempat
// setiap keresahan yang dititipkan penonton digantung sebagai lampion (tools/web-less, references/web-less-untuk-konten.md).
// Bentuk mengikuti lampion di web: badan kertas lonjong berwarna palet Less. (wine, emas, krem), tutup kayu atas-bawah,
// rusuk tipis, rumbai, dan cahaya hangat di dalam. Pengguna 17 Nov 2026 memilih fokus "Titip keresahan + lampion".
// Pakai: <Lampion x y s f nyala warna tali emas id />
//   x, y   = titik gantung (ujung atas tali); badan menggantung di bawahnya, panjang tali `tali` px (× s)
//   s      = skala (s 1 ≈ badan 64×84 px; satu lampion di dunia ±35 cm, jadi untuk tokoh skala q.s pakai s ≈ q.s·0,9)
//   nyala  = 0..1 cahaya di dalam (0 = padam/redup)
//   warna  = warna kertas; emas = bingkai emas (lampion pendukung di web)
//   ayun   = besar ayunan (derajat); f menggerakkan ayunan pelan
// `cahayaLampion` = lingkaran cahaya lembut untuk dinding/lantai di sekitarnya (gambar di bawah badan, mode screen).
import React from 'react';
import { P } from '../../../core/v1/core';

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const WARNA_LAMPION = { wine: P.wine, emas: '#D9A65A', krem: '#F3E3C4', sage: '#7FA48D' } as const;

export function Lampion({
  x,
  y,
  s = 1,
  f = 0,
  nyala = 1,
  warna = WARNA_LAMPION.wine,
  tali = 40,
  emas = false,
  ayun = 3,
  seed = 0,
  id = 'lampion',
}: {
  x: number;
  y: number;
  s?: number;
  f?: number;
  nyala?: number;
  warna?: string;
  tali?: number;
  emas?: boolean;
  ayun?: number;
  seed?: number;
  id?: string;
}) {
  const n = klamp(nyala);
  const rot = ayun * Math.sin(f * 0.06 + seed * 1.7);
  const T = tali;
  return (
    <g data-prop="lampion" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)}) rotate(${rot.toFixed(2)})`}>
      <defs>
        <radialGradient id={`${id}-dalam`} cx="0.5" cy="0.55" r="0.55">
          <stop offset="0" stopColor="#FFF1C9" stopOpacity={0.95 * n} />
          <stop offset="0.55" stopColor="#FFD58A" stopOpacity={0.55 * n} />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-pendar`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD78F" stopOpacity={0.42 * n} />
          <stop offset="1" stopColor="#FFD78F" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-badan`}>
          <ellipse cx="0" cy={T + 46} rx="32" ry="40" />
        </clipPath>
      </defs>
      {/* pendar di udara sekitar */}
      {n > 0.02 && <circle cx="0" cy={T + 46} r="96" fill={`url(#${id}-pendar)`} />}
      {/* tali */}
      <path d={`M0 0L0 ${T + 4}`} stroke={P.ink} strokeWidth="2.4" opacity=".75" />
      {/* tutup atas */}
      <rect x="-15" y={T + 2} width="30" height="9" rx="2.5" fill={emas ? '#C8933F' : '#5E4434'} />
      {/* badan kertas */}
      <ellipse cx="0" cy={T + 46} rx="32" ry="40" fill={warna} />
      <g clipPath={`url(#${id}-badan)`}>
        <ellipse cx="0" cy={T + 46} rx="32" ry="40" fill={`url(#${id}-dalam)`} />
        {[-22, -11, 0, 11, 22].map((dx) => (
          <path key={dx} d={`M${dx} ${T + 6}Q${dx * 1.45} ${T + 46} ${dx} ${T + 86}`} stroke="#000" strokeOpacity={0.12 - 0.05 * n} strokeWidth="1.6" fill="none" />
        ))}
        {/* sisi gelap kanan-bawah supaya bulat */}
        <ellipse cx="14" cy={T + 58} rx="28" ry="38" fill="#000" opacity={0.16 - 0.1 * n} />
        {/* kilau */}
        <ellipse cx="-13" cy={T + 30} rx="7" ry="13" fill="#fff" opacity={0.18 + 0.12 * n} />
      </g>
      {emas && <ellipse cx="0" cy={T + 46} rx="33.5" ry="41.5" fill="none" stroke="#E2B964" strokeWidth="3.4" />}
      {/* tutup bawah + rumbai */}
      <rect x="-12" y={T + 82} width="24" height="8" rx="2.5" fill={emas ? '#C8933F' : '#5E4434'} />
      <path d={`M0 ${T + 90}L0 ${T + 98}`} stroke={P.gold} strokeWidth="2.4" />
      <path d={`M-5 ${T + 98}L-6 ${T + 118}M0 ${T + 98}L0 ${T + 121}M5 ${T + 98}L6 ${T + 118}`} stroke={P.gold} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

/** cahaya lembut lampion di permukaan (dinding/lantai); gambar SEBELUM badan lampion */
export const cahayaLampion = ({ x, y, r = 160, nyala = 1, id = 'cl' }: { x: number; y: number; r?: number; nyala?: number; id?: string }) => (
  <g data-fx="cahaya-lampion" style={{ mixBlendMode: 'screen' }}>
    <defs>
      <radialGradient id={`${id}-g`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFC97A" stopOpacity={0.38 * klamp(nyala)} />
        <stop offset="1" stopColor="#FFC97A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id}-g)`} />
  </g>
);
