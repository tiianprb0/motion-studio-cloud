// Lokasi bersama: kos Yan v3 (8 Nov 2026, the cure v4). Semua dari v2 (kamar, ranjang dari ujung kaki, balkon) +
// sudut pandang baru atas permintaan pengguna ("perspektif kameranya buat lebih kaya dong, jangan diulang ulang"):
// FasadKos (gedung kos dari luar, malam), JendelaLuar (jendela kamar Yan dilihat dari luar kaca, Yan di meja belajar
// menghadap jendela), LorongKos (lorong lantai 2, perspektif satu titik: pintu-pintu, neon, pagar), dan insert
// JamDekat, LampuDekat, MugDekat. v1 dan v2 beku.
import React from 'react';
import { P } from '../../../core/v1/core';
import { Sheen } from '../../_detail/v2/Detail';
import { WallGrain, Moon, Cloud, Plant, Laundry, Poster } from '../../_detail/v1/Detail';
import { Jam } from '../../../props/benda/v1/Benda';
import { Mug } from '../../../props/minum/v1/Minum';

export * from '../v2/KosYan';

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const Bintang = ({ x0, x1, y0, y1, f, n = 30, seed = 1 }: { x0: number; x1: number; y0: number; y1: number; f: number; n?: number; seed?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x0 + acak(i * 3 + seed) * (x1 - x0)} cy={y0 + acak(i * 5 + seed) * (y1 - y0)} r={1.4 + acak(i + seed) * 2} fill="#FFF9EF" opacity={0.3 + 0.35 * Math.sin(f * 0.08 + i)} />)}</g>
);
function Kota({ x0, x1, y, f, seed = 1, tone = '#1C2731' }: { x0: number; x1: number; y: number; f: number; seed?: number; tone?: string }) {
  const out: React.ReactNode[] = [];
  let x = x0, i = 0;
  while (x < x1) {
    const w = 60 + acak(i + seed) * 100, h = 70 + acak(i * 3 + seed) * 170;
    out.push(
      <g key={i}>
        <rect x={x} y={y - h} width={w} height={h} fill={tone} />
        {Array.from({ length: Math.floor(h / 40) * 2 }, (_, k) => (acak(i * 31 + k * 7 + seed) > 0.6 ? <rect key={k} x={x + 10 + (k % 2) * (w / 2 - 4)} y={y - h + 14 + Math.floor(k / 2) * 40} width={w / 2 - 22} height="16" fill="#F4C982" opacity={0.6 + 0.2 * Math.sin(f * 0.05 + k)} /> : null))}
      </g>,
    );
    x += w + 8;
    i++;
  }
  return <g>{out}</g>;
}

// ------------------------------------------------------------------ fasad gedung kos (luar, malam)
// Langit dari y -900 sampai atap y 380. Jendela kamar Yan: lantai 2 tengah (x 430–650, y 980–1260).
// nyala 0..1 = terang jendela Yan; hangat 0..1 = warna cahayanya (0 biru dingin, 1 kuning lampu meja).
export const JENDELA_YAN = { x: 540, y: 1120 };
export function FasadKos({ f, nyala = 0.6, hangat = 0 }: { f: number; nyala?: number; hangat?: number }) {
  const col = [120, 540, 960];
  const row = [520, 980, 1440];
  const terang = (r: number, c: number) => (r === 1 && c === 1 ? -1 : r === 2 && c === 2 ? 0.55 : r === 0 && c === 0 ? 0.3 : 0);
  const kaca = hangat > 0.5 ? '#FFD9A0' : '#A9C4E8';
  return (
    <g data-set="fasad-kos">
      <defs>
        <linearGradient id="fasad-langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C141C" />
          <stop offset="1" stopColor="#2A3A4C" />
        </linearGradient>
      </defs>
      <rect x="-500" y="-1300" width="2100" height="1800" fill="url(#fasad-langit)" />
      <Bintang x0={-300} x1={1400} y0={-1100} y1={300} f={f} n={60} seed={7} />
      <Moon x={820} y={-420} r={64} />
      <Cloud x={((200 + f * 0.3) % 1600) - 300} y={-200} s={1.4} tone="#2E3D4A" o={0.7} />
      <Cloud x={((900 + f * 0.2) % 1600) - 300} y={80} s={1.0} tone="#33424F" o={0.6} />
      {/* gedung */}
      <rect x="-300" y="380" width="1700" height="2000" fill="#46505A" />
      <WallGrain x={-300} y={380} w={1700} h={1600} o={0.04} seed={33} />
      <rect x="-300" y="370" width="1700" height="34" fill="#353D45" />
      {/* roster ventilasi di bawah atap */}
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-280 + i * 76} y="420" width="60" height="40" rx="4" fill="#3A434B" stroke="#2F363D" strokeWidth="4" />)}
      {/* pipa air dan noda */}
      {[320, 760].map((x) => <rect key={x} x={x} y="404" width="16" height="1600" fill="#3C454D" />)}
      {row.map((y, r) =>
        col.map((x, c) => {
          const t = terang(r, c);
          const yan = t === -1;
          const fill = yan ? kaca : t > 0 ? '#F4C982' : '#1C252E';
          const op = yan ? 0.25 + 0.75 * nyala : t > 0 ? t : 1;
          return (
            <g key={`${r}-${c}`}>
              <path d={`M${x - 100} ${y + 300}l20 220h160l20 -220Z`} fill="#000" opacity=".12" />
              <rect x={x - 118} y={y - 18} width="236" height="316" fill="#5A646D" />
              <rect x={x - 110} y={y - 10} width="220" height="280" fill="#1C252E" />
              <rect x={x - 110} y={y - 10} width="220" height="280" fill={fill} opacity={op} />
              {yan && <rect x={x - 110} y={y - 10} width="220" height="280" fill={kaca} opacity={0.35 * nyala} filter="url(#fasad-glow)" />}
              {Array.from({ length: 4 }, (_, k) => <rect key={k} x={x - 110} y={y - 10 + k * 16} width="220" height="12" fill={yan ? '#D8C7A8' : '#2A333C'} opacity=".85" />)}
              <path d={`M${x} ${y + 54}v216M${x - 110} ${y + 120}h220`} stroke="#5A646D" strokeWidth="8" />
              <rect x={x - 130} y={y + 270} width="260" height="14" fill="#5E6871" />
              {(r + c) % 2 === 0 && !yan && <g transform={`translate(${x + 60} ${y + 330})`}><rect width="110" height="70" rx="6" fill="#B9C0C5" /><circle cx="40" cy="35" r="24" fill="#8E979D" /><rect x="76" y="14" width="26" height="42" fill="#9AA3A9" /></g>}
              {yan && <Plant x={x - 80} y={y + 270} s={0.55} kind={1} pot="#A86F4E" />}
            </g>
          );
        }),
      )}
      <defs><filter id="fasad-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter></defs>
      <Laundry x0={-40} x1={260} y={430} f={f} />
      {/* kabel listrik */}
      <path d="M-400 300q500 120 1900 40M-400 340q600 140 1900 60" stroke="#141B22" strokeWidth="4" fill="none" />
    </g>
  );
}

// ------------------------------------------------------------------ jendela kamar Yan dari luar kaca
// Bukaan jendela x 150–930, y 380–1520. isi = tokoh di dalam (Yan duduk di meja: Person x 540, y 1630, s 2,2).
// geser = paralaks pantulan kaca (geser kamera ke kanan → pantulan bergeser ke kiri). lampu 0..1 = lampu meja.
export const JENDELA_LUAR = { x: 540, y: 1630, s: 2.2 };
export function JendelaLuar({ f, geser = 0, lampu = 0.3, isi }: { f: number; geser?: number; lampu?: number; isi?: React.ReactNode }) {
  return (
    <g data-set="jendela-luar">
      <defs>
        <clipPath id="jl-buka"><rect x="150" y="380" width="780" height="1140" /></clipPath>
        <radialGradient id="jl-lampu" cx="250" cy="1300" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD68A" stopOpacity={0.55 * lampu} />
          <stop offset="1" stopColor="#FFD68A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* dinding luar */}
      <rect x="-500" y="-300" width="2100" height="2600" fill="#46505A" />
      <WallGrain x={-500} y={-300} w={2100} h={2600} o={0.05} seed={44} />
      <rect x="1010" y="-300" width="18" height="2600" fill="#3C454D" />
      <g clipPath="url(#jl-buka)">
        {/* bagian dalam kamar (dinding depan kamar, gelap) */}
        <rect x="150" y="380" width="780" height="1140" fill="#2A333D" />
        <rect x="700" y="560" width="200" height="760" fill="#3A2E25" />
        <Poster x={250} y={700} w={150} h={190} rot={-2} art="#7E8FB0" />
        <rect x="420" y="640" width="200" height="12" fill="#5B4636" />
        {[430, 456, 480, 510].map((x, i) => <rect key={x} x={x} y={580 - (i % 2) * 8} width="20" height={60 + (i % 2) * 8} fill={['#7E8FB0', '#8B4354', '#D1A258', '#4F6B5E'][i]} opacity=".7" />)}
        <rect x="150" y="380" width="780" height="1140" fill="url(#jl-lampu)" />
        {isi}
        {/* meja belajar (sisi depan, menutup tubuh bawah) */}
        <rect x="150" y="1380" width="780" height="26" fill="#8C6A4E" />
        <rect x="150" y="1406" width="780" height="120" fill="#5E4836" />
        <rect x="700" y="1352" width="150" height="28" rx="4" fill="#59626A" />
        {/* pantulan di kaca: kota dan bulan, terbalik dan samar */}
        <g opacity=".16" transform={`translate(${-geser} 0)`}>
          <Kota x0={0} x1={1100} y={760} f={f} seed={9} tone="#9FB3C8" />
          <circle cx="780" cy="520" r="34" fill="#EAF2FF" />
        </g>
        <Sheen x={150} y={380} w={780} h={1140} opacity={0.1} id="jl-kilau" />
        <path d={`M${200 - geser * 0.5} 380l-120 1140M${300 - geser * 0.5} 380l-120 1140`} stroke="#fff" strokeWidth="26" opacity=".05" />
        {/* krei setengah turun */}
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x="150" y={380 + i * 20} width="780" height="16" rx="3" fill={i % 2 ? '#BFAE8E' : '#CBBB9C'} opacity=".95" />)}
      </g>
      {/* kusen: dua daun (sambungan di x 760, jauh dari wajah), palang di bawah krei */}
      <rect x="138" y="368" width="804" height="1164" fill="none" stroke="#D8D2C6" strokeWidth="26" />
      <path d="M760 560v960M150 560h780" stroke="#D8D2C6" strokeWidth="16" />
      {/* ambang luar + pot */}
      <rect x="110" y="1528" width="860" height="34" rx="4" fill="#B8B1A4" />
      <Plant x={220} y={1530} s={0.9} kind={2} pot="#A86F4E" />
      <rect x="820" y="1470" width="44" height="60" rx="8" fill="#8FA9A0" opacity=".85" />
    </g>
  );
}

// ------------------------------------------------------------------ lorong lantai 2 (perspektif satu titik)
// Kamera di ujung lorong setinggi 1,8 m. proj(X, Y, Z): X kiri(-)/kanan(+), Y turun (+), Z jauh. Dinding pintu di X -220,
// pagar di X 200, lantai Y 180, langit-langit Y -120. lorong(X, Z) = posisi tokoh berdiri {x, y, s} (s 2 di Z 150).
const F = 600, VX = 540, VY = 900;
const proj = (X: number, Y: number, Z: number): [number, number] => [VX + (X * F) / Z, VY + (Y * F) / Z];
const pt = (X: number, Y: number, Z: number) => proj(X, Y, Z).map((v) => v.toFixed(1)).join(' ');
const quad = (a: [number, number, number], b: [number, number, number], c: [number, number, number], d: [number, number, number]) => `M${pt(...a)}L${pt(...b)}L${pt(...c)}L${pt(...d)}Z`;
export const lorong = (X: number, Z: number) => { const [x, y] = proj(X, 180, Z); return { x, y, s: 300 / Z }; };
export const PINTU_LORONG = { 12: [250, 340], 11: [620, 710], 10: [990, 1080], 9: [1360, 1450] } as const;

export function LorongKos({ f, pintu12 = 0, celah = 0 }: { f: number; pintu12?: number; celah?: number }) {
  const ZN = 100, ZF = 2600;
  const zs = [130, 160, 200, 250, 310, 380, 470, 580, 720, 900, 1120, 1400, 1750, 2200, 2600];
  return (
    <g data-set="lorong-kos">
      {/* luar pagar: langit dan kota */}
      <rect x="-200" y="-200" width="1500" height="2400" fill="#121B24" />
      <Bintang x0={540} x1={1300} y0={0} y1={820} f={f} n={30} seed={12} />
      <Kota x0={560} x1={1400} y={960} f={f} seed={21} />
      <Moon x={980} y={300} r={34} />
      {/* langit-langit, lantai, dinding pintu, ujung lorong */}
      <path d={quad([-220, -120, ZN], [200, -120, ZN], [200, -120, ZF], [-220, -120, ZF])} fill="#2F363D" />
      <path d={quad([-220, 180, ZN], [200, 180, ZN], [200, 180, ZF], [-220, 180, ZF])} fill="#6F6C66" />
      {Array.from({ length: 11 }, (_, i) => -220 + i * 42).map((X) => <path key={X} d={`M${pt(X, 180, ZN)}L${pt(X, 180, ZF)}`} stroke="#5E5B55" strokeWidth="2" />)}
      {zs.map((Z) => <path key={Z} d={`M${pt(-220, 180, Z)}L${pt(200, 180, Z)}`} stroke="#5E5B55" strokeWidth={Math.max(1, 300 / Z)} />)}
      <path d={quad([-220, -120, ZN], [-220, 180, ZN], [-220, 180, ZF], [-220, -120, ZF])} fill="#8E979F" />
      <path d={quad([-220, 150, ZN], [-220, 180, ZN], [-220, 180, ZF], [-220, 150, ZF])} fill="#6B747C" />
      <path d={quad([-220, -120, ZF], [200, -120, ZF], [200, 180, ZF], [-220, 180, ZF])} fill="#59636B" />
      <rect x={proj(-60, -40, ZF)[0]} y={proj(-60, -40, ZF)[1]} width={(120 * F) / ZF} height={(80 * F) / ZF} fill="#F4C982" opacity=".7" />
      {/* pintu-pintu */}
      {Object.entries(PINTU_LORONG).map(([no, [z0, z1]]) => {
        const buka = no === '12' ? pintu12 : 0;
        return (
          <g key={no}>
            <path d={quad([-220, -36, z0 - 8], [-220, -36, z1 + 8], [-220, 180, z1 + 8], [-220, 180, z0 - 8])} fill="#6A5240" />
            <path d={quad([-220, -30, z0], [-220, -30, z1], [-220, 180, z1], [-220, 180, z0])} fill={buka > 0.02 ? '#FFE2A0' : '#8E6B4E'} />
            {buka > 0.02 && <path d={quad([-220, -30, z0], [-220 + 80 * buka, -30, z0 + 10], [-220 + 80 * buka, 180, z0 + 10], [-220, 180, z0])} fill="#9A7656" />}
            {buka > 0.02 && <path d={quad([-220, 180, z0], [-220, 180, z1], [-60 * buka, 180, z1 + 60], [-80 * buka, 180, z0 - 30])} fill="#FFE2A0" opacity={0.35 * buka} />}
            {no === '12' && buka <= 0.02 && celah > 0 && <path d={`M${pt(-220, 178, z0)}L${pt(-220, 178, z1)}`} stroke="#FFD68A" strokeWidth={Math.max(2, 1200 / z1)} opacity={celah} />}
            <circle cx={proj(-220, 80, z0 + 12)[0]} cy={proj(-220, 80, z0 + 12)[1]} r={Math.max(2, 1000 / z0)} fill="#D1A258" />
            <text x={proj(-220, -52, (z0 + z1) / 2)[0]} y={proj(-220, -52, (z0 + z1) / 2)[1]} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={Math.max(8, 4200 / z0)} fill="#3A2E25">{no}</text>
            <ellipse cx={proj(-190, 180, z1 + 30)[0]} cy={proj(-190, 180, z1 + 30)[1]} rx={4000 / z1} ry={1200 / z1} fill="#3E6B57" opacity=".8" />
          </g>
        );
      })}
      {/* pagar besi */}
      <path d={`M${pt(200, 80, ZN)}L${pt(200, 80, ZF)}`} stroke="#2F3438" strokeWidth="10" />
      <path d={`M${pt(200, 170, ZN)}L${pt(200, 170, ZF)}`} stroke="#2F3438" strokeWidth="6" />
      {Array.from({ length: 40 }, (_, i) => 110 + i * 64).map((Z) => <path key={Z} d={`M${pt(200, 80, Z)}L${pt(200, 180, Z)}`} stroke="#3A4045" strokeWidth={Math.max(1.5, 900 / Z)} />)}
      {/* neon di langit-langit + genangan cahaya di lantai */}
      {[420, 1000, 1600, 2200].map((Z, i) => (
        <g key={Z}>
          <ellipse cx={proj(-10, 180, Z + 40)[0]} cy={proj(-10, 180, Z + 40)[1]} rx={(260 * F) / Z} ry={(70 * F) / Z} fill="#E6F3FF" opacity=".12" />
          <path d={`M${pt(-10, -116, Z)}L${pt(-10, -116, Z + 70)}`} stroke="#F4FBFF" strokeWidth={Math.max(2, 1800 / Z)} strokeLinecap="round" opacity={i === 1 ? 0.6 + 0.4 * (Math.sin(f * 0.9) > 0.85 ? 0 : 1) : 1} />
        </g>
      ))}
      <Plant x={proj(170, 180, 900)[0]} y={proj(170, 180, 900)[1]} s={0.5} kind={0} pot="#A86F4E" />
    </g>
  );
}

// ------------------------------------------------------------------ insert benda
/** Jam dinding dekat (01.40), jarum detik berjalan, sorot bulan memotong dinding. */
export function JamDekat({ f }: { f: number }) {
  return (
    <g data-set="insert-jam">
      <rect x="-300" y="-300" width="1700" height="2500" fill="#2E3843" />
      <WallGrain x={-300} y={-300} w={1700} h={2500} o={0.05} seed={51} />
      <path d="M-300 520L1400 140L1400 760L-300 1140Z" fill="#9DB4D0" opacity=".14" />
      <g transform="translate(540 900)">
        <circle r="360" fill="#000" opacity=".25" transform="translate(16 22)" />
        <Jam s={5.6} jam={50} menit={240} />
        <path d="M0 30v-250" stroke={P.wine} strokeWidth="5" strokeLinecap="round" transform={`rotate(${Math.floor(f / 30) * 6})`} />
        <circle r="14" fill={P.wine} />
      </g>
    </g>
  );
}
/** Lampu meja dekat; nyala 0..1 (bohlam dan cahaya meredup). */
export function LampuDekat({ f, nyala = 1 }: { f: number; nyala?: number }) {
  const kedip = nyala < 0.6 && Math.sin(f * 1.7) > 0.7 ? 0.7 : 1;
  const n = nyala * kedip;
  return (
    <g data-set="insert-lampu">
      <defs>
        <radialGradient id="ld-glow" cx="560" cy="980" r="700" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE2A0" stopOpacity={0.75 * n} />
          <stop offset="1" stopColor="#FFE2A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-300" y="-300" width="1700" height="2500" fill="#1E262E" />
      <rect x="-300" y="1300" width="1700" height="900" fill="#5E4836" />
      <rect x="-300" y="1290" width="1700" height="24" fill="#8C6A4E" />
      <rect x="-300" y="-300" width="1700" height="2500" fill="url(#ld-glow)" />
      <path d="M840 1300l-120 -420l-200 -200" stroke="#3A3532" strokeWidth="26" fill="none" strokeLinecap="round" />
      <ellipse cx="840" cy="1300" rx="120" ry="26" fill="#3A3532" />
      <path d="M300 520l330 140l-120 150l-300 -170Z" fill="#E7B65A" />
      <path d="M300 520l330 140l-30 30l-300 -140Z" fill="#C99A44" />
      <ellipse cx="470" cy="760" rx="150" ry="44" fill="#FFF6DA" opacity={0.2 + 0.8 * n} transform="rotate(28 470 760)" />
      <path d="M380 800L560 760L760 1300L120 1300Z" fill="#FFE2A0" opacity={0.18 * n} />
      <rect x="120" y="1246" width="300" height="44" rx="6" fill="#7E8FB0" />
      <rect x="140" y="1210" width="260" height="38" rx="6" fill="#E8D7B8" />
    </g>
  );
}
/** Mug di atas selimut, dekat; hangat 0..1. */
export function MugDekat({ f, hangat = 0 }: { f: number; hangat?: number }) {
  return (
    <g data-set="insert-mug">
      <rect x="-300" y="-300" width="1700" height="2500" fill="#5E2E3B" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-200 + i * 170} 600q80 500 -40 1400`} stroke="#4E2531" strokeWidth="40" fill="none" opacity=".55" />)}
      <Sheen x={-300} y={400} w={1700} h={800} opacity={0.08} id="md-kilau" />
      <ellipse cx="540" cy="1240" rx="230" ry="40" fill="#000" opacity=".3" />
      <g transform="translate(540 1100) scale(7.5)"><Mug f={f} hangat={hangat} /></g>
    </g>
  );
}
