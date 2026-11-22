// Lokasi bersama: kamar kos Naya v1 (7 Nov 2026, Maaf v3; dibuat baru, menggantikan kos-naya v1 untuk video baru).
// Bingkai 1080×1920, lantai y 1620 untuk tokoh skala 2. KamarBack (dinding, jendela bertirai, rak, lampu tali,
// poster, meja kecil) → (tokoh) → KasurDepan (kasur, bantal, selimut bermotif). waktu: 'pagi' | 'sore' | 'malam'.
// Juga: DepanKos (malam, gerbang kos + lampu jalan + jalan) untuk adegan dijemput.
import React from 'react';
import { P } from '../../../core/v1/core';
import { GlassPane, CurtainFolds, Sheen } from '../../_detail/v2/Detail';
import { Plant, WallGrain, Shadow, Poster, StringLights, PerspFloor, Moon, PerspRoad } from '../../_detail/v1/Detail';

type Waktu = 'pagi' | 'sore' | 'malam';
const LANGIT: Record<Waktu, [string, string]> = { pagi: ['#CFE8F2', '#F6E6C8'], sore: ['#F6C79A', '#E99A78'], malam: ['#2B3A4A', '#1C2732'] };
const CAHAYA: Record<Waktu, [string, number]> = { pagi: ['#FFF4D6', 0.35], sore: ['#FFC58A', 0.3], malam: ['#FFD9A0', 0.18] };

export const KAMAR = { floor: 1620, bedTop: 1390 };

export function KamarBack({ f, waktu = 'pagi' }: { f: number; waktu?: Waktu }) {
  const [sky, deep] = LANGIT[waktu];
  const [light, lo] = CAHAYA[waktu];
  return (
    <g data-set="kamar-naya">
      <rect x="-400" y="-200" width="1880" height="2400" fill="#E6E9DA" />
      <rect x="-400" y="-200" width="1880" height="560" fill="#DCE2CF" />
      <WallGrain x={-400} y={-200} w={1880} h={1700} o={0.02} seed={9} />
      {/* jendela + tirai */}
      <GlassPane x={560} y={380} w={400} h={520} f={f} sky={sky} deep={deep} frame={P.cream} frameW={18} id="kamar-kaca" />
      {waktu === 'malam' && <Moon x={840} y={480} r={36} />}
      <CurtainFolds x={500} y={340} w={120} h={640} color="#E7A9A0" sway={Math.sin(f * 0.03) * 6} id="tirai-kiri" />
      <CurtainFolds x={900} y={340} w={120} h={640} color="#E7A9A0" sway={Math.sin(f * 0.03 + 1) * 6} id="tirai-kanan" />
      <rect x="480" y="330" width="560" height="18" rx="9" fill="#BA906B" />
      {/* berkas cahaya dari jendela */}
      <path d="M560 900L960 900L1180 1620L420 1620Z" fill={light} opacity={lo} />
      {/* lampu tali + foto polaroid */}
      <StringLights x0={40} x1={470} y={430} sag={50} f={f} n={9} />
      {[[90, 470, -6], [210, 486, 4], [330, 474, -3]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <rect x={x - 46} y={y} width="92" height="104" fill="#FFFDF7" />
          <rect x={x - 38} y={y + 8} width="76" height="68" fill={['#95B8A2', '#E7A9A0', '#F1C977'][i]} />
        </g>
      ))}
      <Poster x={250} y={640} w={190} h={250} rot={-2} art="#7E8FB0" />
      {/* rak dinding */}
      <rect x="60" y="960" width="330" height="16" rx="5" fill="#BA906B" />
      {[80, 118, 150, 190, 226].map((x, i) => (
        <rect key={x} x={x} y={890 - (i % 2) * 10} width={i === 2 ? 26 : 32} height={70 + (i % 2) * 10} rx="4" fill={['#8B4354', '#95B8A2', '#F1C977', '#7E8FB0', '#E8D7B8'][i]} />
      ))}
      <Plant x={330} y={960} s={0.7} kind={2} />
      {/* lantai kayu terang */}
      <PerspFloor vx={540} vy={1180} yTop={1500} a="#D8C3A3" b="#D1BA98" line="#C2A985" cols={10} rows={6} checker={false} />
      <rect x="-400" y="1488" width="1880" height="16" fill="#C9B391" />
      {/* meja kecil + lampu */}
      <Shadow x={170} y={1530} w={260} />
      <rect x="60" y="1300" width="220" height="24" rx="6" fill="#BA906B" />
      <rect x="80" y="1324" width="180" height="200" fill="#C99E77" />
      <path d="M90 1400h160" stroke="#A9805C" strokeWidth="4" />
      <path d="M150 1300v-70" stroke="#5E5A55" strokeWidth="6" />
      <path d="M110 1230h80l-16 -60h-48Z" fill="#F1C977" />
    </g>
  );
}

/** Kasur di depan tokoh; selimut bermotif kotak, bantal. Kucing bisa diletakkan di atasnya (y ≈ 1400). */
export function KasurDepan() {
  return (
    <g data-set="kasur">
      <Shadow x={720} y={1740} w={760} o={0.15} />
      <rect x="360" y="1400" width="760" height="330" rx="26" fill="#F4EFE4" />
      <path d="M360 1450h760v270a26 26 0 0 1 -26 26H386a26 26 0 0 1 -26 -26Z" fill="#A9C7D6" />
      <g stroke="#93B4C6" strokeWidth="6" opacity=".7">
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${420 + i * 100} 1460v270`} />)}
        <path d="M360 1560h760M360 1650h760" />
      </g>
      <Sheen x={360} y={1450} w={760} h={120} opacity={0.18} id="kasur-kilau" />
      <rect x="900" y="1340" width="200" height="90" rx="40" fill="#FFFDF7" />
    </g>
  );
}

/** Depan kos malam: pagar, pintu kos bernomor, lampu jalan dengan kerucut cahaya, jalan kampung. */
export function DepanKos({ f }: { f: number }) {
  return (
    <g data-set="depan-kos">
      <rect x="-400" y="-200" width="1880" height="1300" fill="#24323F" />
      <Moon x={860} y={260} r={40} />
      {[[120, 180], [380, 120], [620, 220], [980, 160]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#FFF9EF" opacity={0.5 + 0.3 * Math.sin(f * 0.1 + i)} />)}
      {/* bangunan kos */}
      <rect x="-60" y="560" width="760" height="900" fill="#D9CDB6" />
      <rect x="-60" y="540" width="780" height="40" fill="#8B4354" />
      {[60, 330].map((x, i) => (
        <g key={x}>
          <rect x={x} y="900" width="170" height="320" fill="#9E7B5B" />
          <text x={x + 85} y="880" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="28" fill="#5E5A55">{['07', '08'][i]}</text>
          <rect x={x + 20} y="680" width="130" height="140" fill="#FFE2A0" opacity={i ? 0.9 : 0.55} />
        </g>
      ))}
      <WallGrain x={-60} y={560} w={760} h={900} o={0.03} seed={3} />
      {/* rumah tetangga */}
      <rect x="720" y="700" width="500" height="760" fill="#BFC9B9" />
      <rect x="800" y="820" width="140" height="160" fill="#FFD9A0" opacity=".7" />
      {/* pagar */}
      <rect x="-60" y="1220" width="1300" height="20" fill="#3B3F3C" />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-40 + i * 60} y="1240" width="10" height="200" fill="#3B3F3C" />)}
      {/* lampu jalan */}
      <path d="M980 1560V600q0 -40 -60 -40h-60" stroke="#4A4542" strokeWidth="14" fill="none" />
      <path d="M820 560h80l-10 24h-60Z" fill="#4A4542" />
      <path d="M830 584L940 584L1180 1600L560 1600Z" fill="#FFE2A0" opacity=".14" />
      <ellipse cx="870" cy="1610" rx="320" ry="40" fill="#FFE2A0" opacity=".18" />
      {/* jalan */}
      <PerspRoad vx={540} vy={1100} yTop={1440} asphalt="#4C4B48" />
    </g>
  );
}
