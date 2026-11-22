// Lokasi bersama: taman kota saat senja (7 Nov 2026, Maaf v3; dibuat baru, lebih kaya dari taman-sore v1).
// Langit gradasi + matahari rendah, siluet kota, pepohonan berlapis, lampu taman menyala, jalur paving perspektif,
// bunga, bangku kayu. Bingkai 1080×1920, lantai y 1620 untuk tokoh skala 2. TamanSenjaBack → (tokoh) → BangkuDepan.
// `hangat` 0..1: cahaya senja makin oranye (momen "oh ternyata").
import React from 'react';
import { P } from '../../../core/v1/core';
import { Cloud, Flock, Kite, Shadow, PerspFloor } from '../../_detail/v1/Detail';

export const TAMAN_SENJA = { floor: 1620, seat: 1450 };

const Pohon = ({ x, y, s = 1, c = '#7FA383', d = '#6A8E6F' }: { x: number; y: number; s?: number; c?: string; d?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0v-200" stroke="#6E5038" strokeWidth="24" />
    <circle cx="-60" cy="-240" r="110" fill={d} />
    <circle cx="50" cy="-260" r="120" fill={c} />
    <circle cx="-10" cy="-330" r="110" fill={c} />
  </g>
);

export function TamanSenjaBack({ f, hangat = 0 }: { f: number; hangat?: number }) {
  return (
    <g data-set="taman-senja">
      <defs>
        <linearGradient id="ts-langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FA6C4" />
          <stop offset=".55" stopColor="#F3B48A" />
          <stop offset="1" stopColor="#F7D59E" />
        </linearGradient>
        <radialGradient id="ts-mat" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset=".35" stopColor="#FFD38A" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFD38A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-400" y="-200" width="1880" height="1500" fill="url(#ts-langit)" />
      <circle cx="760" cy="980" r="300" fill="url(#ts-mat)" />
      <circle cx="760" cy="980" r="70" fill="#FFF1C9" />
      <Cloud x={220} y={420} s={1.2} tone="#FBE3D2" />
      <Cloud x={820} y={300} s={0.9} tone="#FBE3D2" />
      <Flock x={420} y={560} f={f} n={5} tone="#6B5A5A" />
      <Kite x={260} y={700} f={f} />
      {/* siluet kota */}
      <g fill="#B98F8C" opacity=".75">
        {[[-200, 900, 160, 260], [-20, 960, 120, 200], [120, 860, 140, 300], [280, 940, 110, 220], [880, 900, 150, 260], [1040, 960, 140, 200]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
      </g>
      <Pohon x={-80} y={1300} s={1.1} c="#8DAE8A" d="#7A9C78" />
      <Pohon x={1080} y={1280} s={1.2} c="#8DAE8A" d="#7A9C78" />
      <Pohon x={180} y={1250} s={0.7} />
      <Pohon x={880} y={1240} s={0.65} />
      <rect x="-400" y="1180" width="1880" height="900" fill="#A6C08F" />
      <path d="M-400 1180q300 -40 700 0t1100 0V1260H-400Z" fill="#94B37E" />
      {/* jalur paving */}
      <PerspFloor vx={540} vy={1080} yTop={1340} spread={700} a="#E3CDB0" b="#D9C2A3" line="#C9B08E" cols={8} rows={7} />
      {/* lampu taman */}
      {[[120, 1500], [960, 1480]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y}v-460`} stroke="#3F4A47" strokeWidth="12" />
          <circle cx={x} cy={y - 470} r="26" fill="#FFE9B8" />
          <circle cx={x} cy={y - 470} r="90" fill="#FFE9B8" opacity=".25" />
        </g>
      ))}
      {/* bunga */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={-40 + i * 85} cy={1300 + (i % 3) * 16} r="10" fill={['#E7899A', '#F1C977', '#FFF9EF'][i % 3]} />
      ))}
      <rect x="-400" y="-200" width="1880" height="2400" fill="#FF9E5C" opacity={0.14 * hangat} />
    </g>
  );
}

/** Bangku kayu: sandaran di belakang tokoh duduk, dudukan + kaki di depan. */
export const BangkuBelakang = () => (
  <g data-prop="bangku-sandaran">
    <rect x="200" y="1240" width="680" height="34" rx="10" fill="#9E7553" />
    <rect x="200" y="1300" width="680" height="34" rx="10" fill="#9E7553" />
  </g>
);
export const BangkuDepan = () => (
  <g data-prop="bangku">
    <Shadow x={540} y={1640} w={760} o={0.18} />
    <rect x="180" y="1450" width="720" height="40" rx="12" fill="#B08560" />
    <path d="M230 1490v150M850 1490v150" stroke="#4A4542" strokeWidth="22" />
    <rect x="180" y="1450" width="720" height="10" rx="5" fill="#C99E77" />
    {/* semak di depan bangku: kaki tokoh duduk tertutup (checklist D2) */}
    <g data-prop="semak">
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={120 + i * 105} cy={1610 - (i % 2) * 18} r={78} fill={i % 2 ? '#7FA383' : '#8DAE8A'} />)}
      <rect x="40" y="1600" width="1000" height="120" fill="#7FA383" />
      {Array.from({ length: 8 }, (_, i) => <circle key={'b' + i} cx={150 + i * 110} cy={1560 + (i % 3) * 20} r="9" fill={['#E7899A', '#FFF9EF', '#F1C977'][i % 3]} />)}
    </g>
  </g>
);
