// Drone pemantau (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1: pemantau lapangan merekam pembakaran
// tumpukan kayu dengan drone (Pusaka Bentala Rakyat via Mongabay 1 Okt 2026).
//   <Drone x y s f miring />      quadcopter (baling-baling kabur berputar, lampu kedip, gimbal kamera di bawah)
//   <RemoteDrone s />             remote dengan HP terpasang, untuk holdRight/holdLeft (pose pegangDepanDada)
//   <BingkaiDrone f teks jam />   bingkai layar kamera drone selayar penuh: sudut siku, REC berkedip, baterai, ketinggian,
//                                 bidik tengah. Dipakai di atas sisipan "apa yang direkam drone" (koordinat layar 1080×1920).
import React from 'react';

export function Drone({ x, y, s = 1, f = 0, miring = 0 }: { x: number; y: number; s?: number; f?: number; miring?: number }) {
  const goyang = Math.sin(f * 0.15) * 4;
  const baling = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={-30} rx={58} ry={9} fill="#D9DEE0" opacity={0.35 + 0.15 * Math.sin(f * 1.7 + cx)} />
      <path d={`M${cx - 52} -30L${cx + 52} -30`} stroke="#9AA3A7" strokeWidth="3" opacity=".5" transform={`rotate(${(f * 47 + cx) % 180} ${cx} -30) scale(1 0.2)`} />
      <rect x={cx - 4} y={-30} width="8" height="18" fill="#3C4246" />
    </g>
  );
  return (
    <g data-detail="drone" transform={`translate(${x} ${y + goyang * s}) rotate(${miring}) scale(${s})`}>
      <ellipse cx="0" cy="-30" rx="150" ry="40" fill="#FFFFFF" opacity=".08" />
      <path d="M-30 -10L-110 -20M30 -10L110 -20" stroke="#4A5156" strokeWidth="9" strokeLinecap="round" />
      {[-110, 110].map(baling)}
      <rect x="-42" y="-24" width="84" height="34" rx="12" fill="#5B6368" />
      <rect x="-30" y="-20" width="60" height="10" rx="5" fill="#7C858A" />
      <circle cx="-34" cy="-6" r="4" fill={Math.floor(f / 6) % 2 ? '#E2412F' : '#5A2A24'} />
      <circle cx="34" cy="-6" r="4" fill={Math.floor(f / 6) % 2 ? '#3E2F28' : '#4CCB7A'} />
      <rect x="-12" y="10" width="24" height="14" rx="4" fill="#3C4246" />
      <circle cx="0" cy="28" r="10" fill="#2C3134" />
      <circle cx="3" cy="26" r="3.5" fill="#7FB8D9" />
    </g>
  );
}

/** remote dipegang (anchor tangan di tengah bawah); HP terpasang menghadap pemegang (kamera depan: punggung HP) */
export function RemoteDrone({ s = 1 }: { s?: number }) {
  return (
    <g data-detail="remote-drone" transform={`scale(${s})`}>
      <rect x="-30" y="-58" width="60" height="44" rx="6" fill="#2E3438" />
      <rect x="-26" y="-54" width="52" height="36" rx="4" fill="#454C51" />
      <rect x="-38" y="-16" width="76" height="30" rx="12" fill="#3C4246" />
      <circle cx="-20" cy="-2" r="6" fill="#23282B" />
      <circle cx="20" cy="-2" r="6" fill="#23282B" />
      <path d="M-36 -10L-46 -20M36 -10L46 -20" stroke="#3C4246" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

export function BingkaiDrone({ f = 0, teks = 'REC', jam = '14:32:07', tinggi = 'H 62 m' }: { f?: number; teks?: string; jam?: string; tinggi?: string }) {
  const k = 60; // panjang kaki siku
  const pojok = (x: number, y: number, sx: number, sy: number) => <path key={`${x}-${y}`} d={`M${x} ${y + sy * k}V${y}H${x + sx * k}`} stroke="#FFFFFF" strokeWidth="6" fill="none" opacity=".9" />;
  return (
    <g data-detail="bingkai-drone" pointerEvents="none">
      <rect x="0" y="0" width="1080" height="1920" fill="#000" opacity=".08" />
      {pojok(130, 470, 1, 1)}
      {pojok(950, 470, -1, 1)}
      {pojok(130, 1440, 1, -1)}
      {pojok(950, 1440, -1, -1)}
      <circle cx="170" cy="520" r="11" fill="#E2412F" opacity={Math.floor(f / 10) % 2 ? 1 : 0.25} />
      <text x="194" y="531" fontFamily="Lato" fontWeight="900" fontSize="32" fill="#FFFFFF">{teks}</text>
      <text x="910" y="531" textAnchor="end" fontFamily="Lato" fontWeight="700" fontSize="28" fill="#FFFFFF">{jam}</text>
      <text x="170" y="1410" fontFamily="Lato" fontWeight="700" fontSize="28" fill="#FFFFFF">{tinggi}</text>
      <g transform="translate(840 1386)">
        <rect x="0" y="0" width="60" height="28" rx="5" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="60" y="8" width="6" height="12" fill="#FFFFFF" />
        <rect x="5" y="5" width="38" height="18" rx="2" fill="#FFFFFF" />
      </g>
      <path d="M540 930V990M510 960H570" stroke="#FFFFFF" strokeWidth="3" opacity=".8" />
      <circle cx="540" cy="960" r="44" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".6" />
    </g>
  );
}
