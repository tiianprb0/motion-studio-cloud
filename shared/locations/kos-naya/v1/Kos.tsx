// Lokasi bersama: kamar kos Naya (+ pojok kamar Yan). v1, 7 Nov 2026, asal: projects/maaf-tanpa-kata/v1.
// Satu dunia, lantai y 1500, satuan rig skala 1,5 untuk tokoh dewasa:
//   kasur x 60–660 (permukaan duduk y 1395; sprei depan sampai lantai, tokoh duduk di kasur digambar di belakangnya), bantal x 110–250,
//   jendela x 780–1240 / y 700–1120, meja x 800–1220 (atas y 1354, panel depan menutupi kaki), pintu x 1400–1640,
//   kursi dekat pintu x 1700 (sandaran atas y 1252), lampu gantung x 1000.
// Waktu: 'pagi' | 'sore' | 'malam' mengubah dinding, langit, berkas cahaya, dan lapisan warna.
// Urutan gambar: <KosBack/> -> tokoh -> <BedFront/> <Desk/> <DoorChair/> -> properti di meja -> <KosLight/>.
import React from 'react';
import { P } from '../../../characters/rig/v1/Character';
import { Bookshelf, StringLights, Plant, Calendar, Rug, WallGrain, Poster, Shadow, PerspFloor } from '../../_detail/v1/Detail';

export type Time = 'pagi' | 'sore' | 'malam';
export const KOS = { floor: 1500, seatBed: 1395, deskTop: 1354, chairBack: [1700, 1252] as [number, number], pillow: [180, 1376] as [number, number] };
const C = {
  pagi: { wall: '#F1E6D2', trim: '#E2D3B9', floor: '#D8C2A3', sky: '#CFE6EC', beam: '#FFF3C8', beamA: 0.22, tint: '#000', tintA: 0 },
  sore: { wall: '#EBD2B0', trim: '#DDBF97', floor: '#CDB08C', sky: '#F3B98A', beam: '#FFC98A', beamA: 0.24, tint: '#F2A65A', tintA: 0.08 },
  malam: { wall: '#7E8A80', trim: '#6F7A71', floor: '#6A5C50', sky: '#2C3E50', beam: '#FFE2A8', beamA: 0, tint: '#1F2B38', tintA: 0.26 },
};
export function KosBack({ time, f, door = 0 }: { time: Time; f: number; door?: number }) {
  const c = C[time];
  return (
    <g data-set="kos-naya">
      <rect x="-1500" y="-600" width="4800" height="3200" fill={c.wall} />
      <PerspFloor vx={1000} vy={1080} yTop={1500} yBot={2300} spread={2600} cols={16} rows={7} a={c.floor} b={c.floor} line={c.trim} checker={false} />
      <path d="M-1500 1500h4800" stroke={c.trim} strokeWidth="14" />
      <path d="M-1500 1440h4800" stroke={c.trim} strokeWidth="6" opacity=".7" />
      <WallGrain x={-400} y={500} w={2400} h={900} seed={6} o={time === 'malam' ? 0.08 : 0.05} />
      {/* lemari baju + cermin + gantungan di kiri kasur */}
      <g transform="translate(-380 760)">
        <rect width="400" height="740" rx="6" fill="#B88E68" />
        <path d="M200 0v740" stroke="#A47C58" strokeWidth="6" />
        <circle cx="185" cy="380" r="8" fill={P.gold} /><circle cx="215" cy="380" r="8" fill={P.gold} />
        <rect x="-10" y="-20" width="420" height="24" rx="6" fill="#A47C58" />
        <rect x="40" y="-90" width="110" height="70" rx="6" fill="#C98F84" /><rect x="170" y="-70" width="90" height="50" rx="6" fill="#9FB8AD" />
      </g>
      {/* lampu tumblr di atas kasur, papan gabus berfoto */}
      <StringLights x0={70} x1={700} y={760} sag={26} f={f} n={13} />
      <g transform="translate(540 850)">
        <rect width="190" height="150" rx="6" fill="#C9A47A" />
        <rect x="16" y="16" width="60" height="70" fill="#FFF9EF" transform="rotate(-6 46 51)" />
        <rect x="90" y="24" width="70" height="56" fill="#E7899A" opacity=".8" transform="rotate(5 125 52)" />
        <rect x="40" y="96" width="110" height="34" fill="#FFF9EF" />
        <circle cx="46" cy="20" r="4" fill="#C24E4E" /><circle cx="125" cy="26" r="4" fill="#3E7FA0" />
      </g>
      {/* cermin + kalender di antara jendela dan pintu */}
      <rect x="1262" y="760" width="110" height="300" rx="55" fill="#D7E4E6" stroke="#B88E68" strokeWidth="8" />
      <path d="M1290 820q20 -20 40 0" stroke="#fff" strokeWidth="6" fill="none" opacity=".6" />
      <Calendar x={1262} y={1110} />
      {/* rak buku dinding kanan pintu */}
      <Bookshelf x={1760} y={820} w={260} rows={3} />
      <Plant x={1880} y={1500} s={1.4} kind={0} />
      {/* jendela */}
      <rect x="780" y="700" width="460" height="420" rx="10" fill={c.sky} />
      {time === 'malam' && (
        <g>
          <circle cx="1150" cy="790" r="34" fill="#F6EED8" />
          {[[860, 760], [940, 840], [1060, 730], [900, 980], [1180, 1000]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#F6EED8" opacity={0.5 + 0.5 * Math.sin(f * 0.08 + i)} />
          ))}
        </g>
      )}
      {time !== 'malam' && <path d="M780 1040q120 -60 230 -10t230 -30V1120H780Z" fill={time === 'pagi' ? '#B9D3B0' : '#D99A6C'} opacity=".7" />}
      <path d="M1010 700v420M780 910h460" stroke={c.trim} strokeWidth="12" />
      <rect x="780" y="700" width="460" height="420" rx="10" fill="none" stroke={c.trim} strokeWidth="16" />
      <path d="M740 680q40 260 10 470h70q-30 -200 0 -470Z" fill={P.sage} opacity=".9" />
      <path d="M1280 680q-40 260 -10 470h-70q30 -200 0 -470Z" fill={P.sage} opacity=".9" />
      <rect x="760" y="1120" width="500" height="18" rx="4" fill={c.trim} />
      {/* pot tanaman di ambang jendela */}
      <g transform="translate(1180 1120)">
        <path d="M-18 0h36l-5 -30h-26Z" fill="#C9805A" />
        <path d="M0 -30q-20 -30 -6 -60M0 -30q18 -26 10 -54M0 -30q-2 -30 2 -44" stroke="#6E9C78" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {/* poster */}
      <g transform="translate(300 820) rotate(-2)">
        <rect width="200" height="250" rx="6" fill="#FFF9EF" />
        <rect x="16" y="16" width="168" height="168" rx="4" fill={P.pale} />
        <circle cx="100" cy="90" r="40" fill={P.gold} opacity=".8" />
        <path d="M16 184l60 -70l40 46l30 -30l38 54Z" fill={P.sage} />
        <rect x="40" y="204" width="120" height="10" rx="5" fill={P.line} />
      </g>
      {/* pintu */}
      <rect x="1388" y="868" width="264" height="632" fill={c.trim} />
      <rect x="1400" y="880" width="240" height="620" fill={door > 0 ? '#5E5148' : '#B88E68'} />
      {door > 0 && <path d={`M1400 880h${240 * (1 - door)}v620h${-240 * (1 - door)}Z`} fill="#B88E68" />}
      {door === 0 && (
        <g>
          <rect x="1430" y="920" width="180" height="230" rx="6" fill="none" stroke="#A47C58" strokeWidth="6" />
          <rect x="1430" y="1200" width="180" height="250" rx="6" fill="none" stroke="#A47C58" strokeWidth="6" />
          <circle cx="1610" cy="1200" r="9" fill={P.gold} />
        </g>
      )}
      {/* lampu gantung */}
      <path d="M1000 -600v1180" stroke="#3B4541" strokeWidth="3" />
      <path d="M960 600q40 -44 80 0Z" fill={time === 'malam' ? '#F1C977' : '#D9CBB2'} />
      {/* bantal + selimut di atas kasur (lapisan belakang) */}
      <rect x="60" y="1180" width="44" height="320" rx="10" fill="#A47C58" />
      <path d="M80 1380h580v24H80Z" fill="#F4EEE3" />
      <ellipse cx="180" cy="1376" rx="78" ry="24" fill="#FFFDF8" />
      <path d="M120 1372q60 -10 120 0" stroke="#E6DED0" strokeWidth="3" fill="none" />
      <path d="M440 1386q100 -26 220 -6v20H430Z" fill="#9FB8AD" />
      {/* karpet + boneka di kasur */}
      <Rug x={1100} y={1560} w={520} h={70} />
      <g transform="translate(270 1372)"><circle r="22" fill="#D9B98F" /><circle cx="-16" cy="-18" r="9" fill="#D9B98F" /><circle cx="16" cy="-18" r="9" fill="#D9B98F" /><circle cx="-7" cy="-2" r="2.5" fill="#3A2E28" /><circle cx="7" cy="-2" r="2.5" fill="#3A2E28" /></g>
    </g>
  );
}
// Depan kasur: menutupi kaki tokoh yang duduk di kasur (lapisan depan).
export const BedFront = () => (
  <g data-set="kasur-depan">
    {/* sprei menjuntai sampai lantai: tokoh yang duduk di kasur digambar DI BELAKANG lapisan ini */}
    <rect x="80" y="1392" width="582" height="108" rx="12" fill="#F4EEE3" />
    <path d="M80 1440h582" stroke="#E6DED0" strokeWidth="4" />
    <path d="M420 1392q120 6 242 0v108H404Z" fill="#9FB8AD" />
    <path d="M420 1430q120 8 242 0M412 1470q125 8 250 0" stroke="#8AA399" strokeWidth="4" fill="none" />
    <rect x="70" y="1488" width="604" height="12" rx="4" fill="#A47C58" />
  </g>
);
// Meja: atas di y 1354, panel depan menutupi kaki tokoh yang duduk di belakangnya.
export const Desk = () => (
  <g data-set="meja">
    <rect x="800" y="1350" width="420" height="16" rx="5" fill="#B88E68" />
    <rect x="812" y="1366" width="396" height="134" fill="#A47C58" />
    <rect x="830" y="1384" width="170" height="56" rx="6" fill="none" stroke="#8B6648" strokeWidth="5" />
    <rect x="1020" y="1384" width="170" height="56" rx="6" fill="none" stroke="#8B6648" strokeWidth="5" />
    <circle cx="915" cy="1412" r="6" fill={P.gold} />
    <circle cx="1105" cy="1412" r="6" fill={P.gold} />
    {/* buku bertumpuk + lampu meja + pot kecil */}
    {[0, 1, 2].map((i) => <rect key={i} x={1130 - i * 4} y={1336 - i * 16} width="70" height="14" rx="3" fill={['#7E8FB0', '#E1A93B', '#C24E4E'][i]} />)}
    <path d="M846 1350v-90l40 -30" stroke="#5E5148" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M870 1222l40 10l-14 26Z" fill="#E1C48A" />
    <ellipse cx="846" cy="1350" rx="26" ry="6" fill="#5E5148" />
  </g>
);
// Kursi dekat pintu (sandaran atas di KOS.chairBack).
export const DoorChair = () => (
  <g data-set="kursi-pintu">
    <path d="M1676 1252v248M1724 1252v248" stroke="#8B6648" strokeWidth="10" strokeLinecap="round" />
    <rect x="1664" y="1246" width="72" height="12" rx="5" fill="#A47C58" />
    <rect x="1652" y="1384" width="96" height="14" rx="5" fill="#A47C58" />
  </g>
);
// Lapisan cahaya: berkas jendela (pagi/sore), warna waktu, cahaya lampu malam. Digambar paling atas.
export function KosLight({ time, f }: { time: Time; f: number }) {
  const c = C[time];
  return (
    <g data-layer="cahaya-kos" pointerEvents="none">
      {c.beamA > 0 && <path d="M780 700h460L1600 1520H540Z" fill={c.beam} opacity={c.beamA * (0.92 + 0.08 * Math.sin(f * 0.03))} />}
      {c.tintA > 0 && <rect x="-1500" y="-600" width="4800" height="3300" fill={c.tint} opacity={c.tintA} />}
      {time === 'malam' && (
        <g>
          <radialGradient id="lampu-malam" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFD99A" stopOpacity=".45" />
            <stop offset="1" stopColor="#FFD99A" stopOpacity="0" />
          </radialGradient>
          <ellipse cx="1000" cy="900" rx="900" ry="800" fill="url(#lampu-malam)" />
        </g>
      )}
    </g>
  );
}
// Pojok kamar Yan (malam): dinding biru tua, meja dengan lampu belajar. Lantai y 1500, meja atas y 1354, x 300–780.
export function YanCorner({ f }: { f: number }) {
  return (
    <g data-set="kamar-yan">
      <rect x="-1500" y="-600" width="4800" height="3200" fill="#4E5F66" />
      <rect x="-1500" y="1500" width="4800" height="1200" fill="#4A4038" />
      <rect x="120" y="760" width="300" height="360" rx="8" fill="#22313D" />
      <circle cx="350" cy="840" r="22" fill="#F6EED8" />
      <path d="M270 760v360M120 940h300" stroke="#3D4D55" strokeWidth="10" />
      <rect x="560" y="880" width="180" height="140" rx="6" fill="#3F5058" />
      <path d="M580 990l40 -50l30 30l26 -24l44 44Z" fill="#5E7470" />
    </g>
  );
}
export const YanDesk = ({ f }: { f: number }) => (
  <g data-set="meja-yan">
    <rect x="280" y="1350" width="520" height="16" rx="5" fill="#7A6250" />
    <rect x="292" y="1366" width="496" height="134" fill="#6A5444" />
    {/* lampu belajar */}
    <path d="M720 1350v-110l-60 -50" stroke="#2F3A36" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M630 1170l60 20l-14 30Z" fill="#E6C27A" />
    <ellipse cx="690" cy="1350" rx="40" ry="8" fill="#2F3A36" />
  </g>
);
export const YanLight = ({ f }: { f: number }) => (
  <g data-layer="cahaya-yan" pointerEvents="none">
    <rect x="-1500" y="-600" width="4800" height="3300" fill="#18232B" opacity=".3" />
    <radialGradient id="lampu-belajar" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFD99A" stopOpacity={0.5 + 0.03 * Math.sin(f * 0.2)} />
      <stop offset="1" stopColor="#FFD99A" stopOpacity="0" />
    </radialGradient>
    <ellipse cx="640" cy="1280" rx="520" ry="420" fill="url(#lampu-belajar)" />
  </g>
);
