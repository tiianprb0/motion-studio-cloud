// Lokasi bersama: kos Yan v1 (8 Nov 2026, seri Lirik "the cure" v2; latar baru atas permintaan pengguna).
// Bingkai 1080×1920, lantai y 1620 untuk tokoh skala 2 (sama dengan kamar-naya v1, jadi rig dan kamera bisa dipakai sama).
// KamarYanBack (malam: jendela dengan kota di luar, krei, meja belajar + lampu, kipas, jam dinding, rak, jaket, pintu,
//   gitar) → (tokoh) → KasurYanDepan (dipan, sprei abu-biru, bantal, selimut kusut). pintu 0..1 = daun pintu terbuka,
//   cahaya lorong masuk ke lantai.
// BalkonKos (malam, lantai 2 di depan kamar): langit, atap kampung + tandon air + tiang listrik di kejauhan, pagar besi,
//   lampu neon dinding, jemuran, nomor pintu, sandal. Tokoh berdiri bersandar di depan pagar menghadap kamera.
import React from 'react';
import { P } from '../../../core/v1/core';
import { Sheen } from '../../_detail/v2/Detail';
import { Plant, WallGrain, Shadow, Poster, PerspFloor, Moon, Sandals, Laundry, PowerPole, Cloud, Plane } from '../../_detail/v1/Detail';
import { Jam } from '../../../props/benda/v1/Benda';
import { Jacket } from '../../../props/harian/v1/Props';

export const KOS_YAN = { floor: 1620, bedTop: 1400 };

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Siluet kota malam: deretan atap tidak seragam dengan jendela menyala. Koordinat dunia, dasar di y. */
function KotaMalam({ x0, x1, y, f, seed = 1, tone = '#22303A', lit = '#F4C982' }: { x0: number; x1: number; y: number; f: number; seed?: number; tone?: string; lit?: string }) {
  const rumah: React.ReactNode[] = [];
  let x = x0, i = 0;
  while (x < x1) {
    const w = 70 + acak(i + seed) * 110, h = 90 + acak(i * 3 + seed) * 210;
    const atap = acak(i * 7 + seed) > 0.5;
    rumah.push(
      <g key={i}>
        <rect x={x} y={y - h} width={w} height={h} fill={tone} />
        {atap && <path d={`M${x - 8} ${y - h}L${x + w / 2} ${y - h - 34}L${x + w + 8} ${y - h}Z`} fill={tone} />}
        {Array.from({ length: Math.floor(h / 46) * 2 }, (_, k) => {
          const on = acak(i * 31 + k * 7 + seed) > 0.55;
          if (!on) return null;
          const kedip = acak(i + k) > 0.92 ? 0.55 + 0.45 * Math.sin(f * 0.07 + k) : 1;
          return <rect key={k} x={x + 12 + (k % 2) * (w / 2 - 6)} y={y - h + 18 + Math.floor(k / 2) * 46} width={w / 2 - 26} height="20" fill={lit} opacity={0.75 * kedip} />;
        })}
      </g>,
    );
    x += w + 6 + acak(i * 13 + seed) * 20;
    i++;
  }
  return <g data-detail="kota-malam">{rumah}</g>;
}

export function KamarYanBack({ f, pintu = 0 }: { f: number; pintu?: number }) {
  const putar = f * 0.9; // baling-baling kipas
  return (
    <g data-set="kamar-kos-yan">
      {/* dinding: atas abu kebiruan, bawah lambris lebih gelap */}
      <rect x="-400" y="-200" width="1900" height="2400" fill="#BCC6CC" />
      <rect x="-400" y="-200" width="1900" height="230" fill="#AEB9C0" />
      <rect x="-400" y="1180" width="1900" height="320" fill="#A3AFB7" />
      <rect x="-400" y="1172" width="1900" height="10" fill="#93A0A9" />
      <WallGrain x={-400} y={-200} w={1900} h={1700} o={0.025} seed={21} />
      {/* jendela: langit malam, kota, bulan, krei setengah turun, pantulan kaca */}
      <g data-detail="jendela">
        <defs>
          <linearGradient id="kosyan-langit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A2530" />
            <stop offset="1" stopColor="#34465A" />
          </linearGradient>
          <clipPath id="kosyan-kaca"><rect x="110" y="380" width="360" height="480" /></clipPath>
        </defs>
        <g clipPath="url(#kosyan-kaca)">
          <rect x="110" y="380" width="360" height="480" fill="url(#kosyan-langit)" />
          <Moon x={400} y={470} r={30} />
          {[[150, 430], [250, 400], [330, 520], [190, 560]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#FFF9EF" opacity={0.4 + 0.3 * Math.sin(f * 0.09 + i)} />)}
          <KotaMalam x0={90} x1={490} y={870} f={f} seed={4} tone="#1E2A33" />
          <Sheen x={110} y={380} w={360} h={480} opacity={0.12} id="kosyan-kilau" />
        </g>
        {/* krei: bilah horizontal, turun sampai sepertiga jendela */}
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x="100" y={372 + i * 19} width="380" height="15" rx="3" fill={i % 2 ? '#D8C7A8' : '#E2D3B6'} />)}
        <path d="M290 524v40" stroke="#A9926C" strokeWidth="3" />
        <circle cx="290" cy="568" r="6" fill="#A9926C" />
        {/* kusen */}
        <rect x="96" y="366" width="388" height="508" fill="none" stroke={P.cream} strokeWidth="16" />
        <path d="M290 528v340M110 620h360" stroke={P.cream} strokeWidth="10" />
        <rect x="80" y="868" width="420" height="20" rx="4" fill="#E7E1D4" />
      </g>
      {/* sorot cahaya biru jendela di lantai */}
      <path d="M110 880L470 880L600 1620L-60 1620Z" fill="#9DB4D0" opacity=".12" />
      {/* jam dinding: pukul 01.40 */}
      <g transform="translate(700 470)"><Jam s={0.95} jam={50} menit={240} /></g>
      {/* rak dinding: buku, speaker kecil, kaktus */}
      <rect x="520" y="760" width="320" height="16" rx="5" fill="#8C6A4E" />
      {[540, 572, 600, 634, 660].map((x, i) => (
        <rect key={x} x={x} y={690 - (i % 3) * 8} width={i === 2 ? 22 : 28} height={70 + (i % 3) * 8} rx="3" fill={['#7E8FB0', '#8B4354', '#D1A258', '#4F6B5E', '#E8D7B8'][i]} />
      ))}
      <rect x="700" y="700" width="56" height="60" rx="8" fill="#3B4248" />
      <circle cx="728" cy="730" r="17" fill="#2A2F33" />
      <circle cx="728" cy="730" r="7" fill="#4A5258" />
      <Plant x={800} y={760} s={0.55} kind={1} pot="#C9805A" />
      {/* poster kecil + kalender coret */}
      <Poster x={560} y={900} w={150} h={190} rot={3} art="#95B8A2" />
      {/* jaket di gantungan dekat pintu */}
      <circle cx="880" cy="790" r="6" fill="#6F5A48" />
      <g transform="translate(880 790) scale(1.6)"><Jacket mode="hang" /></g>
      {/* pintu kamar: kusen kayu; daun pintu membuka ke dalam (menyempit), cahaya lorong hangat */}
      <g data-detail="pintu">
        <rect x="930" y="640" width="240" height="860" fill="#7A5B42" />
        <rect x="946" y="656" width="208" height="844" fill={pintu > 0.02 ? '#F2D9A6' : '#8E6B4E'} />
        {pintu > 0.02 && <path d="M946 656h208v844H946Z" fill="#FFE7B5" opacity={0.6 * pintu} />}
        <g transform={`translate(946 656) scale(${1 - 0.78 * pintu} 1)`}>
          <rect width="208" height="844" fill="#9A7656" />
          <rect x="22" y="40" width="164" height="300" rx="6" fill="none" stroke="#86664A" strokeWidth="6" />
          <rect x="22" y="400" width="164" height="380" rx="6" fill="none" stroke="#86664A" strokeWidth="6" />
          <circle cx="184" cy="470" r="9" fill="#D1A258" />
          <text x="104" y="24" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill="#5E4836">12</text>
        </g>
      </g>
      {pintu > 0.02 && <path d={`M946 1500L1154 1500L${1154 + 260 * pintu} 1620L${946 - 120 * pintu} 1620Z`} fill="#FFE2A0" opacity={0.35 * pintu} />}
      {/* gitar bersandar di dinding kanan pintu */}
      <g data-detail="gitar" transform="translate(1260 1480) rotate(-8)">
        <rect x="-11" y="-520" width="22" height="300" rx="4" fill="#5A3E2C" />
        <rect x="-16" y="-570" width="32" height="56" rx="6" fill="#3F2B1F" />
        <ellipse cx="0" cy="-190" rx="78" ry="70" fill="#C98A4E" />
        <ellipse cx="0" cy="-70" rx="98" ry="88" fill="#C98A4E" />
        <circle cx="0" cy="-160" r="26" fill="#3F2B1F" />
        <rect x="-34" y="-74" width="68" height="12" rx="3" fill="#3F2B1F" />
        <ellipse cx="-30" cy="-100" rx="22" ry="60" fill="#fff" opacity=".1" />
      </g>
      {/* lantai keramik kos dalam perspektif */}
      <PerspFloor vx={540} vy={1180} yTop={1500} a="#D3CFC7" b="#CCC7BE" line="#B8B2A7" cols={12} rows={6} checker={false} />
      <rect x="-400" y="1488" width="1900" height="14" fill="#8F9AA2" />
      <Sandals x={1080} y={1590} />
      {/* meja belajar di bawah jendela */}
      <g data-detail="meja">
        <Shadow x={250} y={1560} w={420} o={0.16} />
        <rect x="40" y="1240" width="440" height="24" rx="5" fill="#8C6A4E" />
        <rect x="60" y="1264" width="20" height="290" fill="#7A5B42" />
        <rect x="440" y="1264" width="20" height="290" fill="#7A5B42" />
        <rect x="320" y="1264" width="120" height="120" fill="#7F6047" />
        <rect x="334" y="1300" width="92" height="8" rx="3" fill="#5E4836" />
        {/* laptop tertutup + buku + mi cup */}
        <rect x="90" y="1222" width="190" height="18" rx="5" fill="#59626A" />
        <rect x="96" y="1218" width="178" height="6" rx="3" fill="#6E7880" />
        <rect x="292" y="1196" width="80" height="14" rx="2" fill="#7E8FB0" />
        <rect x="296" y="1210" width="76" height="14" rx="2" fill="#E8D7B8" />
        <rect x="290" y="1224" width="84" height="16" rx="2" fill="#8B4354" />
        <path d="M392 1240l6 -56h44l6 56Z" fill="#FFF9EF" />
        <rect x="392" y="1196" width="56" height="16" fill="#D96B4C" />
        <path d="M430 1188l22 -40" stroke="#C9C3B8" strokeWidth="4" strokeLinecap="round" />
        {/* kipas meja berputar */}
        <g transform="translate(150 1110)">
          <rect x="-8" y="50" width="16" height="62" fill="#C9D1D6" />
          <ellipse cx="0" cy="112" rx="40" ry="10" fill="#B6BFC5" />
          <circle r="56" fill="#E6ECEF" opacity=".55" stroke="#C9D1D6" strokeWidth="5" />
          {[0, 120, 240].map((a) => <ellipse key={a} cx="0" cy="-26" rx="13" ry="26" fill="#9DB4C8" opacity=".75" transform={`rotate(${a + putar * 40})`} />)}
          <circle r="10" fill="#7E8FB0" />
        </g>
        {/* lampu belajar menyala */}
        <path d="M60 1238l40 -110l60 -50" stroke="#4A4542" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M140 1062l70 30l-26 30l-62 -34Z" fill="#E7B65A" />
        <ellipse cx="190" cy="1112" rx="34" ry="10" fill="#FFF1C9" opacity=".9" />
      </g>
      {/* cahaya hangat lampu belajar */}
      <defs>
        <radialGradient id="kosyan-lampu" cx="200" cy="1160" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE2A0" stopOpacity=".45" />
          <stop offset="1" stopColor="#FFE2A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-400" y="700" width="1100" height="1000" fill="url(#kosyan-lampu)" />
    </g>
  );
}

/** Dipan di depan tokoh duduk: rangka kayu gelap, sprei abu-biru bergaris, bantal di kiri, selimut kusut di kanan. */
export function KasurYanDepan() {
  return (
    <g data-set="kasur-yan">
      <Shadow x={740} y={1745} w={800} o={0.18} />
      <rect x="330" y="1396" width="820" height="340" rx="18" fill="#5E4836" />
      <rect x="346" y="1400" width="788" height="60" rx="16" fill="#E9E6DF" />
      <path d="M346 1440h788v250a20 20 0 0 1 -20 20H366a20 20 0 0 1 -20 -20Z" fill="#6E8396" />
      <g stroke="#7F95A8" strokeWidth="10" opacity=".8">
        {[1470, 1530, 1590, 1650].map((y) => <path key={y} d={`M346 ${y}h788`} />)}
      </g>
      <Sheen x={346} y={1440} w={788} h={110} opacity={0.14} id="kasur-yan-kilau" />
      <rect x="342" y="1350" width="112" height="70" rx="30" fill="#F3F0E8" />
      <path d="M362 1362q36 -8 74 4" stroke="#DCD6C9" strokeWidth="4" fill="none" />
      {/* selimut kusut */}
      <path d="M930 1408q40 -46 110 -30q70 6 84 40q-10 34 -96 36q-90 4 -98 -46Z" fill="#8B4354" opacity=".9" />
      <path d="M960 1400q40 -20 90 -10" stroke="#A25A6B" strokeWidth="6" fill="none" />
    </g>
  );
}

/** Balkon/lorong lantai 2 di depan kamar Yan, malam. Pagar besi setinggi pinggang (atas y 1225), kota di belakang. */
export function BalkonKos({ f }: { f: number }) {
  const drift = (base: number, sp: number) => ((base + f * sp + 1400) % 1500) - 200;
  return (
    <g data-set="balkon-kos">
      <defs>
        <linearGradient id="kosyan-langit-luar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141E27" />
          <stop offset="0.7" stopColor="#2C3D4E" />
          <stop offset="1" stopColor="#3E4F5E" />
        </linearGradient>
      </defs>
      <rect x="-400" y="-200" width="1900" height="1700" fill="url(#kosyan-langit-luar)" />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={-200 + acak(i * 3) * 1500} cy={80 + acak(i * 5) * 600} r={1.5 + acak(i) * 2} fill="#FFF9EF" opacity={0.3 + 0.35 * Math.sin(f * 0.08 + i)} />)}
      <Moon x={820} y={330} r={40} />
      <Cloud x={drift(200, 0.15)} y={420} s={1.1} tone="#3A4A56" o={0.6} />
      <Plane x={drift(100, 1.4)} y={540} s={0.6} night f={f} />
      {/* kampung jauh: atap, tandon air, tiang listrik */}
      <KotaMalam x0={-300} x1={1500} y={1180} f={f} seed={11} tone="#24323C" />
      <g transform="translate(980 1000)">
        <rect x="-50" y="-120" width="100" height="90" rx="12" fill="#2B3944" />
        <path d="M-40 -30l-20 200M40 -30l20 200M-50 60h100" stroke="#2B3944" strokeWidth="8" />
      </g>
      <PowerPole x={140} ground={1180} top={640} wiresTo={[-300, 1500]} tone="#1C262E" />
      {/* atap/overhang + lampu neon dingin */}
      <rect x="-400" y="-200" width="1900" height="330" fill="#3A3F44" />
      <rect x="-400" y="110" width="1900" height="26" fill="#2C3034" />
      <rect x="220" y="150" width="200" height="16" rx="8" fill="#F4FBFF" />
      <path d="M220 166L420 166L620 1620L-60 1620Z" fill="#E6F3FF" opacity=".07" />
      {/* jemuran di bawah atap */}
      <Laundry x0={460} x1={1180} y={210} f={f} />
      {/* dinding kamar kiri: kusen pintu bernomor, sandal */}
      <rect x="-400" y="136" width="460" height="1364" fill="#9FAAB2" />
      <rect x="-60" y="640" width="120" height="860" fill="#7A5B42" />
      <text x="0" y="620" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="26" fill="#E8E2D6">12</text>
      {/* pagar besi: tiang, besi silang, pegangan */}
      <g data-detail="pagar">
        <rect x="-400" y="1225" width="1900" height="18" rx="6" fill="#2F3438" />
        <rect x="-400" y="1402" width="1900" height="12" fill="#2F3438" />
        {Array.from({ length: 26 }, (_, i) => <rect key={i} x={-380 + i * 74} y="1243" width="8" height="160" fill="#3A4045" />)}
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${-380 + i * 148} 1243l148 159M${-232 + i * 148} 1243l-148 159`} stroke="#3A4045" strokeWidth="4" opacity=".7" />)}
      </g>
      {/* lantai balkon */}
      <PerspFloor vx={540} vy={1240} yTop={1414} a="#9C9A94" b="#959289" line="#7D7A73" cols={12} rows={6} checker={false} />
      <Sandals x={-10} y={1560} />
      <Plant x={160} y={1500} s={0.8} kind={0} pot="#A86F4E" />
    </g>
  );
}
