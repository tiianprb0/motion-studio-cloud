// Lokasi bersama: ruang makan rumah masa kecil (adegan kenangan). v1, 7 Nov 2026, asal: projects/maaf-tanpa-kata/v1.
// Lantai y 1500. Meja makan bertaplak x 230–770 (atas y 1354; taplak menutupi kaki yang duduk),
// meja dapur + bak cuci x 790–1120 (atas y 1290; tokoh mencuci berdiri di belakangnya menghadap kamera), jendela di atas.
// <MemoryTint/> di paling atas memberi palet kenangan (krem pudar + vinyet), dipakai untuk semua kilas balik.
import React from 'react';
import { P } from '../../../characters/rig/v1/Character';
import { Plant, Calendar, WallGrain, Sandals, Rug, Tiles, Shadow, Cat, PerspFloor, SkyLife } from '../../_detail/v1/Detail';

export const RUMAH = { floor: 1500, tableTop: 1354, sinkTop: 1290 };
export function RumahBack({ f }: { f: number }) {
  return (
    <g data-set="rumah-kenangan">
      <rect x="-1500" y="-600" width="4800" height="3200" fill="#E8D6B6" />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={-1500 + i * 120} y="-600" width="40" height="2100" fill="#E1CDA9" />
      ))}
      <PerspFloor vx={540} vy={1080} yTop={1500} yBot={2300} spread={2400} cols={14} rows={7} a="#B99B78" b="#B39472" line="#A98B6A" />
      <rect x="-1500" y="1180" width="4800" height="320" fill="#D9C29C" />
      <path d="M-1500 1180h4800" stroke="#C7AD86" strokeWidth="10" />
      {/* jendela di atas bak cuci */}
      <rect x="830" y="760" width="250" height="250" rx="8" fill="#D7E4D2" />
      <path d="M955 760v250M830 885h250" stroke="#C7AD86" strokeWidth="10" />
      <rect x="830" y="760" width="250" height="250" rx="8" fill="none" stroke="#C7AD86" strokeWidth="14" />
      <WallGrain x={-200} y={500} w={1500} h={700} seed={8} o={0.05} />
      {/* lemari piring di kiri + kulkas di kanan */}
      <g transform="translate(-260 820)">
        <rect width="250" height="680" fill="#9C7552" />
        <rect x="16" y="16" width="218" height="300" fill="#C9D9DD" opacity=".6" />
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((i) => <ellipse key={r + '-' + i} cx={46 + i * 52} cy={90 + r * 90} rx="22" ry="22" fill="#F4F1EA" stroke="#D8D0C2" strokeWidth="2" />))}
        <rect x="16" y="340" width="218" height="320" fill="#8B6648" />
      </g>
      <g transform="translate(1150 900)">
        <rect width="200" height="600" rx="14" fill="#E9EEEC" />
        <path d="M0 200h200" stroke="#C9D0CD" strokeWidth="5" />
        <rect x="170" y="80" width="10" height="80" rx="4" fill="#A9B2AE" /><rect x="170" y="260" width="10" height="120" rx="4" fill="#A9B2AE" />
        <rect x="40" y="40" width="40" height="30" fill="#F1C977" transform="rotate(-8 60 55)" />
      </g>
      <Calendar x={560} y={1010} />
      {/* lampu gantung di atas meja makan */}
      <path d="M500 -600v1270" stroke="#3E3530" strokeWidth="3" />
      <path d="M440 700q60 -60 120 0Z" fill="#C98F84" /><ellipse cx="500" cy="704" rx="60" ry="10" fill="#FFE2A8" opacity=".6" />
      {/* foto keluarga + jam dinding */}
      <g transform="translate(330 840)">
        <rect width="190" height="140" rx="6" fill="#8B6648" />
        <rect x="12" y="12" width="166" height="116" rx="4" fill="#EFE3CC" />
        <circle cx="62" cy="58" r="16" fill="#B99B78" />
        <circle cx="128" cy="58" r="16" fill="#B99B78" />
        <circle cx="95" cy="78" r="11" fill="#B99B78" />
        <path d="M36 128q26 -46 52 0M102 128q26 -46 52 0M80 128q15 -30 30 0" fill="#C7AD86" />
      </g>
      <g transform="translate(640 860)">
        <circle r="48" fill="#FBF6EC" stroke="#8B6648" strokeWidth="8" />
        <path d={`M0 0L${26 * Math.sin(f * 0.002)} ${-26 * Math.cos(f * 0.002)}M0 0L${18 * Math.sin(1.9)} ${-18 * Math.cos(1.9)}`} stroke="#3E3530" strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
}
// Meja dapur + bak cuci (lapisan depan): tokoh yang mencuci berdiri DI BELAKANGNYA menghadap kamera,
// tangan di permukaan (y 1290 = rig -140 pada skala 1,5).
export const SinkCounter = () => (
  <g data-set="bak-cuci">
    <rect x="790" y="1278" width="330" height="20" rx="5" fill="#E8DCC6" />
    <rect x="800" y="1296" width="310" height="204" fill="#C7AD86" />
    <path d="M870 1284q85 26 170 0" stroke="#A9B7B3" strokeWidth="10" fill="none" strokeLinecap="round" />
    <rect x="820" y="1320" width="125" height="150" rx="6" fill="none" stroke="#B4996F" strokeWidth="5" />
    <rect x="965" y="1320" width="125" height="150" rx="6" fill="none" stroke="#B4996F" strokeWidth="5" />
    <circle cx="930" cy="1395" r="5" fill="#8B6648" />
    <circle cx="980" cy="1395" r="5" fill="#8B6648" />
    {/* rice cooker + rak piring */}
    <g transform="translate(1080 1278)"><rect x="-34" y="-50" width="68" height="50" rx="16" fill="#F4F1EA" /><ellipse cx="0" cy="-50" rx="30" ry="9" fill="#E7899A" /><rect x="-10" y="-30" width="20" height="8" rx="3" fill="#3E7FA0" /></g>
    <g transform="translate(820 1278)"><rect x="-10" y="-60" width="60" height="60" fill="none" stroke="#A9B2AE" strokeWidth="4" />{[0, 1, 2].map((i) => <ellipse key={i} cx={20} cy={-48 + i * 16} rx="24" ry="5" fill="#F4F1EA" />)}</g>
  </g>
);
// Meja makan bertaplak (lapisan depan). Menutupi kaki tokoh yang duduk.
export const DiningTable = () => (
  <g data-set="meja-makan">
    <path d="M232 1354q-10 70 -20 150h576q-10 -80 -20 -150Z" fill="#C98F84" />
    <path d="M232 1354q-10 70 -20 150M300 1360v140M400 1360v140M500 1360v140M600 1360v140M700 1360v140" stroke="#B87C72" strokeWidth="4" fill="none" />
    <ellipse cx="500" cy="1354" rx="272" ry="18" fill="#D9A398" />
  </g>
);
// Palet kenangan: krem pudar + vinyet. amt 0..1.
export function MemoryTint({ amt = 1 }: { amt?: number }) {
  return (
    <g data-layer="kenangan" pointerEvents="none" opacity={amt}>
      <rect x="-1500" y="-600" width="4800" height="3300" fill={P.memory} opacity=".32" />
      <radialGradient id="vinyet-kenangan" cx="0.5" cy="0.5" r="0.75">
        <stop offset=".55" stopColor="#7A5E44" stopOpacity="0" />
        <stop offset="1" stopColor="#7A5E44" stopOpacity=".55" />
      </radialGradient>
      <rect x="0" y="0" width="1080" height="1920" fill="url(#vinyet-kenangan)" />
    </g>
  );
}

// ---- tambahan 7 Nov 2026 (v2): teras rumah malam & ruang tamu. Bingkai 1080x1920, lantai y 1620, tokoh dewasa skala 2,0.
export function TerasMalam({ f }: { f: number }) {
  return (
    <g data-set="teras-kenangan">
      <rect x="-600" y="-400" width="2300" height="2700" fill="#26343F" />
      {[[120, 200], [420, 140], [800, 240], [960, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#F6EED8" opacity={0.5 + 0.4 * Math.sin(f * 0.07 + i)} />)}
      <SkyLife f={f} time="malam" />
      <path d="M60 760L540 440L1020 760Z" fill="#8E5A48" />
      <rect x="120" y="760" width="840" height="860" fill="#D9C29C" />
      <rect x="200" y="900" width="220" height="200" rx="6" fill="#F1C977" opacity=".85" />
      <path d="M310 900v200M200 1000h220" stroke="#B4996F" strokeWidth="10" />
      <rect x="620" y="980" width="200" height="640" fill="#8B6648" />
      <circle cx="800" cy="1300" r="9" fill={P.gold} />
      {/* lampu teras + laron */}
      <circle cx="540" cy="860" r="14" fill="#FFE7AE" /><circle cx="540" cy="860" r="140" fill="#FFD98A" opacity=".18" />
      {[0, 1, 2].map((i) => <circle key={i} cx={540 + 40 * Math.sin(f * 0.2 + i * 2)} cy={860 + 30 * Math.cos(f * 0.17 + i)} r="3" fill="#F6EED8" />)}
      <PerspFloor vx={540} vy={1060} yTop={1620} a="#6F6358" b="#685C52" line="#5E534A" cols={10} rows={6} />
      <rect x="80" y="1580" width="920" height="40" fill="#A8977F" />
      <WallGrain x={120} y={760} w={840} h={860} seed={11} o={0.08} />
      {/* nomor rumah, meteran listrik, sangkar burung, bangku teras, pot, sandal */}
      <rect x="440" y="960" width="70" height="44" rx="4" fill="#3B3430" /><text x="475" y="992" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="26" fill="#F1E6D2">12</text>
      <rect x="860" y="1080" width="60" height="90" rx="4" fill="#8E8A82" /><circle cx="890" cy="1110" r="14" fill="#DDE3DF" />
      <path d="M260 760v40" stroke="#3E3530" strokeWidth="3" /><path d="M230 800q30 -40 60 0v70h-60Z" fill="none" stroke="#B88E68" strokeWidth="4" />
      <rect x="160" y="1440" width="330" height="20" rx="6" fill="#8B6648" /><path d="M180 1460v120M470 1460v120" stroke="#6E4F38" strokeWidth="12" />
      <Plant x={560} y={1580} s={1.2} kind={2} />
      <Plant x={960} y={1580} s={1.3} kind={0} />
      <Sandals x={650} y={1578} />
      <Cat x={300} y={1580} s={0.9} color="#E9E1D3" />
      {/* pagar kayu depan (siluet) */}
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={-60 + i * 76} y="1680" width="30" height="240" rx="4" fill="#3E3530" opacity=".85" />)}
      <rect x="-600" y="1720" width="2300" height="18" fill="#3E3530" opacity=".85" />
    </g>
  );
}
export function RuangTamu({ f }: { f: number }) {
  return (
    <g data-set="ruang-tamu-kenangan">
      <rect x="-600" y="-400" width="2300" height="2700" fill="#E3CDA8" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-600 + i * 110} y="-400" width="36" height="2100" fill="#DBC39B" />)}
      <rect x="-600" y="1620" width="2300" height="800" fill="#A98B6A" />
      {/* TV tabung di bufet */}
      <rect x="800" y="1180" width="360" height="440" fill="#8B6648" />
      <rect x="840" y="980" width="260" height="200" rx="20" fill="#5E5A52" />
      <rect x="860" y="1000" width="200" height="160" rx="14" fill="#9DAAA4" />
      <path d="M920 980l-40 -60M1020 980l40 -60" stroke="#3E3A36" strokeWidth="4" />
      {/* sofa */}
      <rect x="60" y="1300" width="460" height="120" rx="30" fill="#9F6B5A" />
      <rect x="40" y="1400" width="500" height="160" rx="24" fill="#B07A66" />
      <rect x="60" y="1560" width="20" height="60" fill="#5E4636" /><rect x="500" y="1560" width="20" height="60" fill="#5E4636" />
      {/* foto + lampu */}
      <rect x="160" y="900" width="200" height="150" rx="6" fill="#8B6648" /><rect x="174" y="914" width="172" height="122" rx="4" fill="#EFE3CC" />
      <path d="M1040 700v140" stroke="#3E3A36" strokeWidth="3" /><path d="M1000 840h80l-14 -40h-52Z" fill="#E1C48A" />
      <WallGrain x={-100} y={500} w={1300} h={1100} seed={14} o={0.05} />
      {/* jendela bertirai, kalender, karpet, meja kecil bertaplak renda, tanaman */}
      <rect x="440" y="760" width="260" height="300" rx="6" fill="#B9C9C2" />
      <path d="M570 760v300M440 910h260" stroke="#C7AD86" strokeWidth="10" />
      <path d="M420 740q40 180 0 340h80q-30 -160 0 -340Z" fill="#C98F84" /><path d="M720 740q-40 180 0 340h-80q30 -160 0 -340Z" fill="#C98F84" />
      <Calendar x={150} y={1080} />
      <PerspFloor vx={540} vy={1060} yTop={1620} a="#A98B6A" b="#A08262" line="#94775A" cols={12} rows={6} />
      <Rug x={540} y={1690} w={700} h={90} a="#8B4354" b="#E1A93B" />
      <rect x="560" y="1500" width="100" height="120" fill="#8B6648" /><path d="M548 1500h124l-10 22h-104Z" fill="#FFF9EF" />
      <Plant x={1010} y={1620} s={1.3} kind={1} />
    </g>
  );
}
