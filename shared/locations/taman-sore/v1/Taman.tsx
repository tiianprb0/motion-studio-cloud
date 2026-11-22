// Lokasi bersama: taman & jalan sore/senja (7 Nov 2026, asal: projects/maaf-tanpa-kata/v2). Bingkai 1080x1920, lantai y 1620, tokoh skala 2,0.
// Bangku: tokoh duduk di bangku, kaki ditutupi semak depan (y 1440 ke bawah). Dudukan bangku y 1450.
import React from 'react';
import { P } from '../../../characters/rig/v1/Character';
import { TrashBin, Plant, Tiles, Bird, PowerPole, Shadow, Cat, WallGrain, PerspFloor, PerspRoad, SkyLife, Kite } from '../../_detail/v1/Detail';
import { Motorbike } from '../../../props/harian/v1/Props';

const Tree = ({ x, y, s = 1, tone = '#7FA889' }: { x: number; y: number; s?: number; tone?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-16" y="-260" width="32" height="260" fill="#8B6648" />
    <circle cx="0" cy="-330" r="120" fill={tone} />
    <circle cx="-80" cy="-270" r="80" fill={tone} />
    <circle cx="80" cy="-280" r="86" fill={tone} />
  </g>
);
export const TAMAN = { floor: 1620, seat: 1450 };
export function TamanBack({ f, sun = 0.4 }: { f: number; sun?: number }) {
  return (
    <g data-set="taman-sore">
      <linearGradient id="langit-sore" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#BFD9E0" />
        <stop offset="1" stopColor={sun > 0.5 ? '#F3C48F' : '#F6E3C2'} />
      </linearGradient>
      <rect x="-600" y="-400" width="2300" height="2700" fill="url(#langit-sore)" />
      <SkyLife f={f} time="sore" />
      <Kite x={640} y={640} f={f} s={0.9} />
      <rect x="-600" y="1200" width="2300" height="1200" fill="#A9C79A" />
      <Tree x={120} y={1260} s={1.2} tone="#86AE8F" />
      <Tree x={960} y={1230} s={1.4} tone="#7FA889" />
      <Tree x={560} y={1180} s={0.8} tone="#9BBF9E" />
      {/* orang di kejauhan (siluet kecil), lampu taman, burung */}
      {[[380, 1210, '#7E8FB0'], [430, 1214, '#E7899A'], [760, 1206, '#95B8A2']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity=".6"><circle cy="-46" r="9" fill="#5E5148" /><rect x="-9" y="-38" width="18" height="26" rx="6" fill={c as string} /><path d="M-5 -12v14M5 -12v14" stroke="#5E5148" strokeWidth="5" /></g>
      ))}
      <Bird x={300} y={420} f={f} /><Bird x={360} y={460} f={f + 6} />
      {[40, 1040].map((x, i) => <g key={i}><path d={`M${x} 1520V980`} stroke="#3E4A46" strokeWidth="12" /><ellipse cx={x} cy="970" rx="26" ry="16" fill="#F4EFE4" /></g>)}
      <path d="M-600 1500q900 -60 2300 40v900H-600Z" fill="#C9B79A" />
      <PerspFloor vx={540} vy={1060} yTop={1560} a="#C9B79A" b="#C1AE90" line="#B09D80" cols={12} rows={6} />
      {/* bunga di bedeng */}
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-20 + i * 95} cy={1250 + (i % 3) * 8} r="9" fill={['#E7899A', '#F1C977', '#FFF9EF'][i % 3]} />)}
      {/* bangku */}
      <rect x="250" y="1300" width="580" height="22" rx="8" fill="#8B6648" />
      <rect x="250" y="1340" width="580" height="22" rx="8" fill="#8B6648" />
      <rect x="240" y="1440" width="600" height="24" rx="8" fill="#A47C58" />
      <path d="M290 1300v320M790 1300v320" stroke="#3E4A46" strokeWidth="12" />
      <TrashBin x={950} y={1600} color="#3E7F6A" />
    </g>
  );
}
export const Semak = () => (
  <g data-set="semak">
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={180 + i * 90} cy={1520 + (i % 2) * 20} r="80" fill={i % 2 ? '#6E9C78' : '#7FA889'} />)}
    <rect x="100" y="1540" width="880" height="100" fill="#6E9C78" />
  </g>
);
export function JalanSenja({ f }: { f: number }) {
  return (
    <g data-set="jalan-senja">
      <linearGradient id="senja-jalan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7D86A6" />
        <stop offset=".5" stopColor="#EBA77E" />
        <stop offset=".8" stopColor="#F7D59A" />
      </linearGradient>
      <rect x="-600" y="-400" width="2300" height="2700" fill="url(#senja-jalan)" />
      <SkyLife f={f} time="senja" />
      <circle cx="540" cy="1230" r="110" fill="#FFE2A8" />
      <path d="M-600 1300h2300v320H-600Z" fill="#8E7A6E" opacity=".55" />
      {[[-40, 380], [140, 300], [300, 420], [700, 360], [880, 300]].map(([x, h], i) => <rect key={i} x={x} y={1300 - h} width="160" height={h} fill="#6E5A58" opacity=".7" />)}
      <rect x="-600" y="1560" width="2300" height="900" fill="#B49E88" />
      <PerspRoad vx={540} vy={1060} yTop={1560} yBot={2000} half={900} asphalt="#7A6E66" />
      {/* rumah-rumah pinggir jalan dengan jendela menyala */}
      {[[-60, 'l'], [800, 'r']].map(([x, k], i) => (
        <g key={i} transform={`translate(${x} 1080)`}>
          <path d="M0 120l170 -120l170 120Z" fill="#7C5A55" />
          <rect x="20" y="120" width="300" height="360" fill={i ? '#D9B48E' : '#CDA98A'} />
          <WallGrain x={20} y={120} w={300} h={360} seed={20 + i} o={0.1} />
          <rect x="60" y="190" width="90" height="90" fill="#F1C977" opacity=".75" />
          <rect x="190" y="230" width="80" height="250" fill="#8B6648" />
        </g>
      ))}
      <PowerPole x={250} ground={1560} top={600} wiresTo={[-400, 1500]} />
      <g transform="translate(1000 1520)"><Motorbike s={2.4} color="#3E7FA0" /></g>
      <Cat x={160} y={1556} s={0.8} color="#3B3430" />
      <Plant x={720} y={1560} s={1.1} kind={2} />
      {[100, 980].map((x, i) => <path key={i} d={`M${x} 1560V900q0 -30 40 -30`} stroke="#4A4542" strokeWidth="12" fill="none" />)}
    </g>
  );
}
