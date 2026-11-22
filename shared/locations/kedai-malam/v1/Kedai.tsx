// Lokasi bersama: kedai kopi malam (7 Nov 2026, Maaf v3; dibuat baru, kaya detail dan kedalaman).
// Bingkai 1080×1920. Tokoh duduk skala 2 dengan kaki di y 1620 (KEDAI.floor); meja depan KedaiTable.
// Lapisan: dinding hangat + jendela besar berembun (hujan, lampu jalan buram) + lampu gantung + rak + papan menu
// → lantai kayu perspektif → (tokoh) → meja depan dengan cangkir beruap.
import React from 'react';
import { P } from '../../../core/v1/core';
import { GlassPane, Steam, Sheen } from '../../_detail/v2/Detail';
import { Plant, WallGrain, Shadow, PerspFloor } from '../../_detail/v1/Detail';

export const KEDAI = { floor: 1620, table: 1450 };

const Pendant = ({ x, y, f, len = 220 }: { x: number; y: number; f: number; len?: number }) => {
  const sw = 3 * Math.sin(f * 0.04 + x);
  return (
    <g transform={`rotate(${sw * 0.4} ${x} ${y - len})`} data-detail="lampu-gantung">
      <path d={`M${x} ${y - len}v${len}`} stroke="#3B3430" strokeWidth="3" />
      <radialGradient id={`pd-${x}`} cx="50%" cy="20%" r="60%">
        <stop offset="0" stopColor="#FFE7B0" stopOpacity=".75" />
        <stop offset="1" stopColor="#FFE7B0" stopOpacity="0" />
      </radialGradient>
      <ellipse cx={x} cy={y + 120} rx="230" ry="200" fill={`url(#pd-${x})`} />
      <path d={`M${x - 50} ${y + 40}q50 -70 100 0Z`} fill="#2F5148" />
      <ellipse cx={x} cy={y + 40} rx="50" ry="9" fill="#FFE2A0" />
    </g>
  );
};

const Rain = ({ x, y, w, h, f }: { x: number; y: number; w: number; h: number; f: number }) => (
  <g opacity=".45" data-detail="hujan">
    {Array.from({ length: 26 }, (_, i) => {
      const xx = x + ((i * 97) % w), yy = y + (((i * 151) + f * 22) % h);
      return <path key={i} d={`M${xx} ${yy}l-6 34`} stroke="#DDEBF2" strokeWidth="2" strokeLinecap="round" />;
    })}
  </g>
);

export function KedaiBack({ f }: { f: number }) {
  return (
    <g data-set="kedai-malam">
      {/* dinding */}
      <rect x="-400" y="-200" width="1880" height="2400" fill="#E9D3B5" />
      <WallGrain x={-400} y={-200} w={1880} h={1500} o={0.02} seed={4} />
      {/* jendela besar: malam hujan, lampu jalan buram */}
      <g>
        <GlassPane x={60} y={300} w={960} h={620} f={f} sky="#33424F" deep="#1E2A33" frame="#6B4A33" frameW={22} id="kedai-kaca" />
        {[[180, 640, '#FFD27A'], [330, 700, '#F6A35E'], [560, 610, '#FFE9A8'], [770, 690, '#9BD3E6'], [900, 640, '#FFD27A'], [430, 760, '#E8836F']].map(([cx, cy, c], i) => (
          <circle key={i} cx={cx as number} cy={cy as number} r={34 + (i % 3) * 10} fill={c as string} opacity=".38" />
        ))}
        <path d="M60 820h960" stroke="#4A5A66" strokeWidth="40" opacity=".55" />
        <Rain x={70} y={310} w={940} h={600} f={f} />
        {/* embun di sudut bawah kaca */}
        <rect x="82" y="840" width="916" height="60" fill="#FFFFFF" opacity=".12" />
        <text x="540" y="400" textAnchor="middle" fontFamily="Playfair" fontSize="54" fill="#F3E3C6" opacity=".55" transform="scale(-1 1) translate(-1080 0)">kedai senja</text>
      </g>
      {/* papan menu dan rak */}
      <rect x="770" y="960" width="230" height="260" rx="10" fill="#2F4A42" />
      <g stroke="#E9E2CF" strokeWidth="5" strokeLinecap="round" opacity=".8">
        <path d="M800 1010h120M800 1050h90M800 1090h140M800 1130h70M800 1170h110" />
      </g>
      <text x="885" y="995" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="24" fill="#F1C977">MENU</text>
      <rect x="70" y="990" width="260" height="14" rx="4" fill="#8E6447" />
      {[90, 130, 170, 215, 260, 300].map((x, i) => (
        <rect key={x} x={x} y={942 - (i % 2) * 14} width="30" height={48 + (i % 2) * 14} rx="6" fill={['#C98E55', '#E8D7B8', '#95B8A2', '#C98E55', '#F1C977', '#E8D7B8'][i]} />
      ))}
      <rect x="70" y="1120" width="260" height="14" rx="4" fill="#8E6447" />
      <Plant x={130} y={1120} s={0.9} kind={1} />
      <Plant x={270} y={1120} s={0.7} kind={0} />
      {/* panel kayu bawah dinding */}
      <rect x="-400" y="1240" width="1880" height="300" fill="#B98A63" />
      <path d="M-400 1240h1880" stroke="#8E6447" strokeWidth="10" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-380 + i * 120} 1250v290`} stroke="#A57A55" strokeWidth="4" />)}
      {/* lantai */}
      <PerspFloor vx={540} vy={1100} yTop={1540} a="#9C7052" b="#A97B5B" line="#835B40" cols={12} rows={6} checker={false} />
      <Pendant x={300} y={180} f={f} />
      <Pendant x={800} y={150} f={f + 30} />
    </g>
  );
}

/** Meja kayu depan dengan dua cangkir kopi beruap (digambar di depan tokoh duduk). */
export function KedaiTable({ f }: { f: number }) {
  return (
    <g data-set="kedai-meja">
      <Shadow x={540} y={1700} w={900} o={0.16} />
      <path d="M90 1440h900l40 70H50Z" fill="#A87451" />
      <rect x="50" y="1510" width="980" height="34" rx="8" fill="#8A5C3F" />
      <Sheen x={90} y={1440} w={900} h={70} opacity={0.18} id="kedai-meja-kilau" />
      {/* taplak menjuntai sampai lantai: kaki tokoh duduk tertutup (checklist D2) */}
      <path d="M50 1544h980v380H50Z" fill="#E9D8BC" />
      <g stroke="#D6C2A2" strokeWidth="6" opacity=".8">{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${110 + i * 110} 1550q-14 180 6 370`} fill="none" />)}</g>
      <path d="M50 1544h980" stroke="#8A5C3F" strokeWidth="10" />
      {[[350, '#FFF9EF'], [740, '#F1C977']].map(([x, c], i) => (
        <g key={i} transform={`translate(${x} 1462)`}>
          <ellipse cx="0" cy="24" rx="62" ry="12" fill="#000" opacity=".12" />
          <ellipse cx="0" cy="20" rx="58" ry="14" fill="#F4EFE4" />
          <path d="M-36 -36h72l-8 52h-56Z" fill={c as string} />
          <ellipse cx="0" cy="-36" rx="36" ry="9" fill="#6B4A33" />
          <path d="M36 -26q24 4 18 24q-6 12 -20 10" stroke={c as string} strokeWidth="8" fill="none" />
        </g>
      ))}
      <Steam x={350} y={1418} f={f} count={2} height={110} id="kedai-uap-1" />
      <Steam x={740} y={1418} f={f + 20} count={2} height={110} id="kedai-uap-2" />
    </g>
  );
}

/** Sandaran kursi kayu di belakang tokoh duduk (gambar sebelum Person). x = posisi tokoh. */
export const KedaiKursi = ({ x }: { x: number }) => (
  <g data-prop="kursi">
    <rect x={x - 120} y={1150} width="240" height="380" rx="30" fill="#8E6447" />
    <rect x={x - 96} y={1176} width="192" height="60" rx="16" fill="#A87451" />
  </g>
);
