// Lokasi bersama: kota malam (7 Nov 2026, asal: projects/maaf-tanpa-kata/v2). Koordinat bingkai 1080x1920, lantai/trotoar y 1620,
// tokoh dewasa skala 2,0. Tiga tempat: warung tenda, trotoar pertokoan, gerobak martabak.
// Tokoh duduk digambar DI BELAKANG penutup sampai lantai (taplak meja warung, badan gerobak).
import React from 'react';
import { P } from '../../../characters/rig/v2/Character';
import { PowerPole, Poster, ACUnit, TrashBin, Plant, Tiles, WallGrain, Cat, Shadow, PerspFloor, PerspRoad, wallMap, quad, SkyLife } from '../../_detail/v1/Detail';
import { Motorbike } from '../../../props/harian/v1/Props';

const Sky = ({ f }: { f: number }) => (
  <g>
    <rect x="-600" y="-400" width="2300" height="2700" fill="#22313D" />
    {[[90, 180], [300, 120], [520, 210], [760, 150], [980, 230], [180, 300], [860, 330]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#F6EED8" opacity={0.4 + 0.4 * Math.sin(f * 0.07 + i)} />
    ))}
    <SkyLife f={f} time="malam" />
  </g>
);
const Skyline = ({ y = 1180, tone = '#2E3E48' }: { y?: number; tone?: string }) => (
  <g>
    {[[-40, 260], [120, 380], [260, 300], [420, 440], [600, 340], [760, 420], [930, 300]].map(([x, h], i) => (
      <g key={i}>
        <rect x={x} y={y - h} width="170" height={h + 40} fill={tone} />
        {Array.from({ length: Math.floor(h / 70) }, (_, j) => (
          <rect key={j} x={x + 30 + (j % 2) * 70} y={y - h + 30 + j * 60} width="34" height="26" fill="#F1C977" opacity={(i + j) % 3 ? 0.55 : 0.12} />
        ))}
      </g>
    ))}
  </g>
);
export const Bulbs = ({ f, y, x0, x1, sag }: { f: number; y: number; x0: number; x1: number; sag: number }) => (
  <g>
    <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke="#141C19" strokeWidth="3" fill="none" />
    {Array.from({ length: 8 }, (_, i) => {
      const t = (i + 0.5) / 8,
        bx = x0 + (x1 - x0) * t,
        by = y + sag * 4 * t * (1 - t) + 10;
      return (
        <g key={i}>
          <circle cx={bx} cy={by} r="26" fill="#FFD98A" opacity={0.16 + 0.03 * Math.sin(f * 0.05 + i)} />
          <circle cx={bx} cy={by} r="8" fill="#FFE7AE" />
        </g>
      );
    })}
  </g>
);

// ---- warung tenda. Meja: atas y 1426, x 200–880. Tokoh duduk x 360 dan 720 (skala 2) di belakang taplak.
export const WARUNG = { floor: 1620, tableTop: 1426 };
export function WarungBack({ f }: { f: number }) {
  return (
    <g data-set="warung-tenda">
      <Sky f={f} />
      <Skyline y={1200} />
      <rect x="-600" y="1200" width="2300" height="1200" fill="#3A3430" />
      <rect x="-600" y="1620" width="2300" height="800" fill="#4A423B" />
      <PerspFloor vx={540} vy={1060} yTop={1620} a="#4A423B" b="#453E37" line="#3C3530" cols={12} rows={6} />
      {/* ruko di belakang tenda: pintu besi, papan nama, AC */}
      <rect x="-40" y="900" width="1160" height="720" fill="#5B5049" />
      <WallGrain x={-40} y={900} w={1160} h={720} seed={3} o={0.08} />
      <rect x="40" y="1060" width="420" height="560" fill="#7A726A" />
      {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M40 ${1080 + i * 30}h420`} stroke="#6A625B" strokeWidth="4" />)}
      <rect x="600" y="1000" width="200" height="140" rx="6" fill="#F1C977" opacity=".45" />
      <ACUnit x={840} y={960} />
      <PowerPole x={1010} ground={1620} top={260} wiresTo={[-300, 1500]} />
      {/* tenda: terpal bergaris */}
      <path d="M-40 560L1120 560L1080 700H0Z" fill="#B54B4B" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-40 + i * 100} 560l${i < 6 ? 10 : -10} 140h50l${i < 6 ? -6 : 6} -140Z`} fill="#F1E6D2" opacity=".85" />)}
      <path d="M30 700v920M1050 700v920" stroke="#5E5148" strokeWidth="14" />
      {/* spanduk menu */}
      <rect x="120" y="704" width="840" height="86" fill="#F3E9D6" />
      <text x="540" y="762" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="40" fill="#B54B4B" letterSpacing="3">NASI GORENG • MIE • CAPCAY</text>
      <rect x="120" y="704" width="840" height="86" fill="none" stroke="#B54B4B" strokeWidth="6" />
      <Bulbs f={f} y={800} x0={30} x1={1050} sag={30} />
      {/* gerobak nasi goreng di kanan belakang */}
      <g transform="translate(860 1360)">
        <rect x="-150" y="-180" width="300" height="200" rx="10" fill="#D9C29C" />
        <rect x="-140" y="-170" width="280" height="80" rx="6" fill="#F3E9D6" />
        {/* gerobak dapur milik warung yang sama: daftar harga, bukan nama warung lain */}
        <text x="0" y="-140" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill={P.wine}>Nasgor 15rb • Mie 15rb</text>
        <text x="0" y="-108" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill={P.wine}>Capcay 18rb • Es teh 4rb</text>
        <ellipse cx="-60" cy="-190" rx="50" ry="10" fill="#2D3532" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${-80 + i * 20} -200q${8 * Math.sin(f * 0.12 + i)} -20 0 -40t0 -40`} stroke="#fff" strokeWidth="5" fill="none" opacity=".35" strokeLinecap="round" />)}
        <circle cx="-110" cy="40" r="30" fill="#2D3532" /><circle cx="110" cy="40" r="30" fill="#2D3532" />
        {/* toples kerupuk + termos */}
        <rect x="80" y="-250" width="56" height="70" rx="10" fill="#E9E1D3" opacity=".8" />
        {[0, 1, 2].map((i) => <circle key={i} cx={96 + i * 12} cy={-220 + (i % 2) * 14} r="10" fill="#F1D9A0" />)}
        <rect x="-140" y="-250" width="36" height="70" rx="8" fill="#C24E4E" />
      </g>
      <TrashBin x={60} y={1620} />
      <Cat x={980} y={1630} s={1.1} color="#8E7A6E" />
    </g>
  );
}
export const WarungTable = () => (
  <g data-set="meja-warung">
    <path d="M200 1426h680l20 194H180Z" fill="#E9E1D3" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={200 + i * 85} y="1426" width="42" height="194" fill="#C9D9CF" opacity=".9" />)}
    <rect x="190" y="1416" width="700" height="16" rx="6" fill="#F4EFE4" />
    {/* tempat tisu, sambal, sendok garpu, teh botol */}
    <rect x="510" y="1376" width="60" height="42" rx="6" fill="#E1A93B" />
    <path d="M524 1376q16 -18 32 0" fill="#FFF9EF" />
    <rect x="590" y="1386" width="26" height="32" rx="6" fill="#C24E4E" />
    <rect x="440" y="1372" width="40" height="46" rx="6" fill="#B9B4AA" />
    <path d="M450 1372v-30M462 1372v-36M472 1372v-28" stroke="#8E8A82" strokeWidth="4" />
  </g>
);

// ---- trotoar pertokoan malam, KAMERA SERONG (dua titik hilang): deret toko menjauh ke kanan (VP x 1380, y 1060).
// Tokoh di trotoar: TROTOAR.at(z, side) -> {x, y, s}; z=1 paling dekat kamera, side 0=dekat dinding 1=tepi jalan.
export const TROTOAR = { vx: 760, vy: 1060, at: (z: number, side = 0.5) => ({ x: 760 + (-100 + 1200 * side - 760) / z, y: 1060 + (1700 + 300 * side - 1060) / z, s: 2.6 / z }) };
// Deret RUKO: beberapa unit berbeda (tinggi, warna, kanopi, papan nama, jendela lantai 2), dipisah pilar — bukan satu dinding melar.
const RUKO = [
  { u: [0, 0.24], top: 1, wall: '#C9B79A', shut: '#8D9692', name: 'FOTOKOPI', sign: '#2F3A36', ink: '#F1C977', awn: '#3E7F6A' },
  { u: [0.24, 0.42], top: 0.86, wall: '#B9A08A', shut: '#9A8F86', name: 'KELONTONG', sign: '#C24E4E', ink: '#FFF9EF', awn: '#C24E4E' },
  { u: [0.42, 0.58], top: 0.95, wall: '#A9B7B3', shut: '#8A9490', name: 'APOTEK', sign: '#3E7FA0', ink: '#FFF9EF', awn: '#3E7FA0' },
  { u: [0.58, 0.72], top: 0.8, wall: '#D2B48C', shut: '#9C9286', name: 'BENGKEL', sign: '#E1A93B', ink: '#2F3A36', awn: '#8B6648' },
  { u: [0.72, 0.85], top: 0.92, wall: '#C4A7A0', shut: '#948A84', name: 'LAUNDRY', sign: '#8B4354', ink: '#FFF9EF', awn: '#E7899A' },
  { u: [0.85, 1], top: 0.84, wall: '#B8B09A', shut: '#8E8A80', name: 'WARTEG', sign: '#2F3A36', ink: '#F1C977', awn: '#E1A93B' },
];
export function Trotoar({ f }: { f: number }) {
  const { vx, vy } = TROTOAR;
  // titik hilang di dalam bingkai (x 760): deret ruko di kiri menjauh ke tengah, jalan di kanan
  const wall = wallMap(vx, vy, -100, 380, 1700, 690);
  const curbNear: [number, number] = [1100, 2000];
  const zAt = (u: number) => (-100 - vx) / (wall(u, 0)[0] - vx);
  return (
    <g data-set="trotoar-ruko-malam">
      <Sky f={f} />
      <Skyline y={1000} tone="#28363F" />
      {/* jalan di sisi kanan bawah */}
      <path d={`M${vx} ${vy}L2400 ${vy + 60}L2400 2400L${curbNear[0]} ${curbNear[1]}Z`} fill="#2F3436" />
      {[0.35, 0.55, 0.72, 0.86].map((t, i) => {
        const p0: [number, number] = [vx + (1900 - vx) * t, vy + (2000 - vy) * t];
        const p1: [number, number] = [vx + (1900 - vx) * (t + 0.06), vy + (2000 - vy) * (t + 0.06)];
        return <path key={i} d={`M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}`} stroke="#E8DFC8" strokeWidth={4 + 10 * t} strokeLinecap="round" />;
      })}
      {/* trotoar */}
      <path d={`M-600 ${wall(0, 0)[1] - 40}L${wall(0, 0)[0]} ${wall(0, 0)[1]}L${vx} ${vy}L${curbNear[0]} ${curbNear[1]}L-600 2400Z`} fill="#8A847A" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i + 1) / 10;
        const a0 = wall(0, 0),
          xa = a0[0] + (curbNear[0] - a0[0]) * t,
          ya = a0[1] + (curbNear[1] - a0[1]) * t;
        return <path key={i} d={`M${vx} ${vy}L${xa + (xa - vx) * 0.6} ${ya + (ya - vy) * 0.6}`} stroke="#77716A" strokeWidth="2" opacity=".7" />;
      })}
      {[1.15, 1.4, 1.75, 2.2, 2.9, 4].map((z, i) => (
        <path key={'h' + i} d={`M${vx + (-100 - vx) / z} ${vy + (1700 - vy) / z}L${vx + (curbNear[0] - vx) / z} ${vy + (curbNear[1] - vy) / z}`} stroke="#77716A" strokeWidth="2" opacity=".7" />
      ))}
      <path d={`M${vx} ${vy}L${curbNear[0]} ${curbNear[1]}`} stroke="#B4AC9E" strokeWidth="14" />
      {/* deret ruko */}
      {RUKO.map((r, i) => {
        const [u0, u1] = r.u;
        const c = wall((u0 + u1) / 2, 0.715);
        const z = zAt((u0 + u1) / 2);
        const ang = (Math.atan2(wall(u1, 0.715)[1] - wall(u0, 0.715)[1], wall(u1, 0.715)[0] - wall(u0, 0.715)[0]) * 180) / Math.PI;
        return (
          <g key={i} data-detail="ruko">
            <path d={quad(wall, u0, u1, 0, r.top)} fill={r.wall} />
            <path d={quad(wall, u0, u1, r.top - 0.03, r.top)} fill="#000" opacity=".15" />
            {/* jendela lantai 2 */}
            {[0.2, 0.55].map((k, j) => (
              <g key={j}>
                <path d={quad(wall, u0 + (u1 - u0) * k, u0 + (u1 - u0) * (k + 0.25), 0.8, Math.min(r.top - 0.05, 0.93))} fill={j === (i % 2) ? '#F1C977' : '#4E5C64'} opacity={j === (i % 2) ? 0.75 : 1} />
              </g>
            ))}
            {/* papan nama + kanopi + rolling door */}
            <path d={quad(wall, u0 + 0.008, u1 - 0.008, 0.66, 0.77)} fill={r.sign} />
            <path d={quad(wall, u0, u1, 0.6, 0.66)} fill={r.awn} />
            <path d={quad(wall, u0 + 0.012, u1 - 0.012, 0, 0.6)} fill={r.shut} />
            {Array.from({ length: 11 }, (_, j) => <path key={j} d={quad(wall, u0 + 0.012, u1 - 0.012, 0.05 * j + 0.02, 0.05 * j + 0.03)} fill="#000" opacity=".12" />)}
            {/* pilar pemisah */}
            <path d={quad(wall, u0, u0 + 0.012, 0, r.top)} fill="#000" opacity=".22" />
            <text transform={`translate(${c[0]} ${c[1]}) rotate(${ang}) skewX(${ang * 0.4})`} y={10 / z} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={42 / z} fill={r.ink}>{r.name}</text>
            {i % 2 === 0 && <path d={quad(wall, u0 + (u1 - u0) * 0.15, u0 + (u1 - u0) * 0.35, 0.25, 0.45)} fill={['#E7899A', '#F1C977', '#95B8A2'][i % 3]} opacity=".85" />}
          </g>
        );
      })}
      {/* AC, lampu jalan di tepi trotoar */}
      {[0.1, 0.48, 0.77].map((u, i) => <path key={'ac' + i} d={quad(wall, u, u + 0.05, 0.94 - (i % 2) * 0.12, 0.99 - (i % 2) * 0.12)} fill="#DAD6CE" />)}
      {[0.08, 0.5, 0.82].map((u, i) => {
        const z = 1 + u * 3.2;
        const bx = vx + (curbNear[0] - 60 - vx) / z,
          by = vy + (curbNear[1] - vy) / z,
          h = 1250 / z;
        return (
          <g key={'l' + i}>
            <path d={`M${bx} ${by}V${by - h}l${-60 / z} 0`} stroke="#3A4541" strokeWidth={16 / z} fill="none" />
            <ellipse cx={bx - 70 / z} cy={by - h + 10 / z} rx={26 / z} ry={12 / z} fill="#FFE7AE" />
            <ellipse cx={bx - 70 / z} cy={by} rx={240 / z} ry={30 / z} fill="#FFE2A8" opacity=".16" />
          </g>
        );
      })}
    </g>
  );
}

// ---- gerobak martabak pinggir jalan. Penjual berdiri di belakang gerobak (x 680), pembeli di depan kiri.
export const GEROBAK = { floor: 1620, counter: 1360, x: 680 };
export function GerobakBack({ f }: { f: number }) {
  return (
    <g data-set="gerobak-martabak">
      <Sky f={f} />
      <Skyline y={1100} tone="#2B3943" />
      <rect x="-600" y="1100" width="2300" height="520" fill="#4F4A44" />
      <PerspFloor vx={540} vy={1060} yTop={1620} a="#5E574F" b="#58514A" line="#4E4842" cols={10} rows={6} />
      <path d="M-600 1620h2300" stroke="#7A7268" strokeWidth="10" />
      <rect x="-40" y="980" width="440" height="640" fill="#6A5E55" />
      <WallGrain x={-40} y={980} w={440} h={640} seed={9} o={0.1} />
      <rect x="40" y="1120" width="280" height="200" rx="6" fill="#F1C977" opacity=".4" />
      <Poster x={60} y={1360} w={120} h={150} art="#E7899A" text="PROMO" />
      <PowerPole x={980} ground={1620} top={300} wiresTo={[-300, 1400]} />
      {/* bangku kayu pembeli */}
      <rect x="40" y="1500" width="300" height="20" rx="6" fill="#8B6648" />
      <path d="M60 1520v100M320 1520v100" stroke="#6E4F38" strokeWidth="12" />
      <g transform="translate(1010 1615)"><Motorbike s={3.4} color="#8B4354" /></g>
      {/* atap gerobak + lampu */}
      <path d="M440 770h480l-30 -70H470Z" fill="#E1A93B" />
      <path d="M470 770v590M890 770v590" stroke="#7A5A3E" strokeWidth="10" />
      <circle cx="560" cy="930" r="12" fill="#FFE7AE" /><circle cx="560" cy="930" r="60" fill="#FFD98A" opacity=".2" />
      <rect x="480" y="800" width="400" height="70" rx="8" fill="#F3E9D6" />
      <text x="680" y="850" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="36" fill={P.wine}>MARTABAK</text>
    </g>
  );
}
export const GerobakFront = ({ f }: { f: number }) => (
  <g data-set="gerobak-depan">
    <rect x="440" y="1360" width="480" height="200" rx="10" fill="#C24E4E" />
    <rect x="460" y="1380" width="440" height="80" rx="6" fill="#E9E1D3" opacity=".75" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={520 + i * 140} cy="1440" rx="44" ry="14" fill="#D9A55A" />)}
    <rect x="430" y="1346" width="500" height="18" rx="6" fill="#8B6648" />
    <ellipse cx="800" cy="1340" rx="70" ry="12" fill="#2D3532" />
    {[0, 1, 2].map((i) => <path key={i} d={`M${770 + i * 30} 1320q${8 * Math.sin(f * 0.12 + i)} -26 0 -52t0 -50`} stroke="#fff" strokeWidth="5" fill="none" opacity=".35" strokeLinecap="round" />)}
    <circle cx="500" cy="1580" r="34" fill="#2D3532" /><circle cx="860" cy="1580" r="34" fill="#2D3532" />
    {/* daftar harga + kantong plastik tergantung + telur di rak kaca */}
    <rect x="460" y="1470" width="200" height="70" rx="6" fill="#FFF9EF" />
    <text x="560" y="1500" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="20" fill="#3B3430">MANIS 25rb</text>
    <text x="560" y="1528" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="20" fill="#3B3430">TELUR 30rb</text>
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={700 + i * 34} cy="1500" rx="14" ry="18" fill="#F4EEE3" />)}
  </g>
);
