// Lokasi bersama: kantor kecil di lantai dua ruko, PANGGUNG FLAT 2D dari depan (v1, 13 Nov 2026) dengan cahaya 2D
// (shared/film/v1/Cahaya2D.tsx, disetujui pengguna 11 Nov 2026). Dibuat agen Buat konten untuk "Hari Pertama Kerja" v1.
// Struktur dan skala sama dengan kamar-kerja-2d/v1 (satu titik hilang di tengah, perspektif digambar):
//   dinding belakang (lebar 7 m, kiri → kanan): papan tulis putih (target/coretan), pot, jam dinding, jendela lebar
//   berkerai (seberang jalan: deret ruko + tembok pembatas atap tempat kucing lewat; langit pagi → malam, atau fajar),
//   spanduk "SELAMAT BERGABUNG" di atas jendela (opsional, bisa terlepas satu ujung), papan gabus, dispenser, pintu.
//   Kiri depan: lemari arsip + printer, meja rekan dengan partisi (kosong). Tengah: meja Yan menghadap kamera (panel depan
//   sampai lantai; tokoh duduk di belakangnya) dengan monitor (punggung monitor menghadap kamera = tempat kertas tempel),
//   lampu meja di kanan, mug, tumpukan map. Lantai vinil, plafon dengan tiga panel neon.
// Waktu `t` 0..1: 0 = pagi ±07.10 (matahari dari jendela), 0,5 = senja, 1 = malam ±21.40. `fajar` 0..1 menimpa langit
// jadi subuh/fajar (setelah malam). `neon` 0..1 = lampu plafon (bawaan: nyala penuh siang, 0,25 malam = hanya panel
// di atas meja). `lampu` 0..1 = lampu meja. `monitor` 0..1 = layar menyala (pendar biru ke wajah tokoh di malam hari).
// Meja: `meja.stiker` (kertas tempel di punggung monitor, u/v 0..1), `meja.map` 0..1 (tumpukan berkas), `meja.kardus`
// (kardus karyawan baru), `meja.gelas` (jumlah gelas kopi). `spanduk` 0 (tidak ada) / 1 (terpasang) / 'lepas'.
// `papan` 0..1 = papan tulis makin penuh coretan tenggat. `gabus` = kertas tempel di papan gabus (u/v 0..1, `jatuh` 0..1). `kucing` = kucing oranye di tembok atap seberang (u 0..1 sepanjang
// jendela, ikut paralaks). Skala: dinding 227 px/m (kaki dinding y 1180), mata 1,3 m (cakrawala y 885), kamera 4 m.
// titikKantor(X, h, d) = titik dunia; isi = tokoh/benda bergerak (urut kedalaman bersama benda). Kamera { zoom, cx, cy }.
// Isi bertanda `bercahaya` digambar sesudah cahaya malam (tokoh kenangan yang bersinar sendiri).
// Pakai: <Kantor2D f kam t neon lampu monitor fajar meja spanduk papan gabus kucing isi kabur id />
import React from 'react';
import { P } from '../../../core/v1/core';
import { Plant } from '../../_detail/v1/Detail';
import { Mug } from '../../../props/minum/v1/Minum';
import { Kucing } from '../../../characters/kucing/v1/Kucing';
import { Stiker, TumpukanMap, Kardus } from '../../../props/kantor/v1/Kantor';
import { Terang, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, NadaAkhir, type Cahaya2D } from '../../../film/v1/Cahaya2D';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type Isi2D = {
  x: number;
  y: number;
  s?: number;
  gambar: (p: Titik2D) => React.ReactNode;
  jarakDinding?: number;
  tinggi?: number;
  lebar?: number;
  teduh?: boolean;
  fokus?: boolean;
  polos?: boolean;
  tanpaBayangan?: boolean;
  urut?: number;
  /** digambar SESUDAH cahaya malam (tidak ikut digelapkan), mis. tokoh kenangan yang bercahaya sendiri. Hanya untuk isi
   *  yang tidak tertutup benda di depannya (urutan kedalaman dilewati). */
  bercahaya?: boolean;
};
export type StikerKantor = { teks: string; u: number; v: number; warna?: string; tinta?: string; rot?: number; jatuh?: number; pudar?: number };
export type MejaKantor = { stiker?: StikerKantor[]; map?: number; kardus?: boolean; gelas?: number; buku?: boolean };

export const KANTOR2D = {
  kakiDinding: 1180,
  pxM: 227,
  cakrawala: 885,
  mata: 1.3,
  jarakKamera: 4.0,
  plafon: 2.9,
  X0: -3.5,
  X1: 3.5,
  meja: { X0: -0.95, X1: 0.95, d0: 0.75, d1: 1.35, tinggi: 0.75 },
  jendela: { X0: -1.15, X1: 1.55, h0: 0.85, h1: 2.3 },
  /** punggung monitor (bidang menghadap kamera) */
  monitor: { X0: -0.72, X1: -0.18, h0: 0.95, h1: 1.27, d: 0.98 },
  lampuX: 0.72,
  jam: { X: -1.65, h: 2.3 },
  gabus: { X0: 1.68, X1: 2.28, h0: 1.22, h1: 1.85 },
};
const K = KANTOR2D;
const GB = K.gabus;
/** titik dunia di papan gabus (u kiri→kanan, v atas→bawah) */
export const titikGabus = (u: number, v: number) => titikKantor(GB.X0 + (GB.X1 - GB.X0) * u, GB.h1 - (GB.h1 - GB.h0) * v, 0);
const FOK = K.pxM * K.jarakKamera;
export const pxMd = (d: number) => FOK / (K.jarakKamera - d);
export const titikKantor = (X: number, h: number, d: number): Titik2D => {
  const m = pxMd(d);
  return { x: 540 + X * m, y: K.cakrawala + (K.mata - h) * m, s: m / 200 };
};
export const yLantai = (d: number) => titikKantor(0, 0, d).y;
export const dDariY = (y: number) => Math.max(0, K.jarakKamera - (K.mata * FOK) / Math.max(1, y - K.cakrawala));
export const skalaKantor = (y: number) => Math.max(0.2, (y - K.cakrawala) / (K.mata * 200));
/** tokoh duduk di belakang meja (kaki di lantai, d 0,45 m) */
export const DUDUK_KANTOR = titikKantor(0.05, 0, 0.45);
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara2D = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({
  zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t,
  cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t,
  cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t,
});
/** jam dinding menurut waktu: 07.10 → 21.40 */
export const jamKantor = (t: number) => 7.17 + 14.5 * t;
/** titik dunia untuk kertas tempel di punggung monitor (u kiri→kanan, v atas→bawah) */
export const titikMonitor = (u: number, v: number) => {
  const M = K.monitor;
  return titikKantor(M.X0 + (M.X1 - M.X0) * u, M.h1 - (M.h1 - M.h0) * v, M.d);
};

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const hex = (s: string) => {
  if (s.startsWith('rgb')) return s.match(/\d+/g)!.map(Number) as [number, number, number];
  const p = parseInt(s.slice(1), 16);
  return [(p >> 16) & 255, (p >> 8) & 255, p & 255] as [number, number, number];
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * klamp(t))).join(',')})`;
};
const tri = (s: [string, string, string], t: number) => (t < 0.5 ? mix(s[0], s[1], t * 2) : mix(s[1], s[2], (t - 0.5) * 2));
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

type Keadaan = { az: number; el: number; warna: string; bay: string; amb: number; dif: number; nada: string; nk: number };
const PAGI: Keadaan = { az: 165, el: 26, warna: '#FFE2B0', bay: '#4E4A62', amb: 0.74, dif: 0.6, nada: '#F6C27A', nk: 0.05 };
const SENJA: Keadaan = { az: 165, el: 10, warna: '#E9A3A0', bay: '#4A3E5E', amb: 0.62, dif: 0.35, nada: '#8E6A9A', nk: 0.08 };
const MALAM: Keadaan = { az: 10, el: 70, warna: '#C9D6EE', bay: '#1A2034', amb: 0.44, dif: 0.25, nada: '#1E2A44', nk: 0.14 };
const LAMPU: Keadaan = { az: 70, el: 30, warna: '#FFD68A', bay: '#1E2438', amb: 0.52, dif: 0.85, nada: '#2A3048', nk: 0.1 };
const FAJAR: Keadaan = { az: 170, el: 6, warna: '#F7B9A0', bay: '#3E3A58', amb: 0.56, dif: 0.4, nada: '#C98A9A', nk: 0.09 };
const campur = (a: Keadaan, b: Keadaan, t: number): Keadaan => ({
  az: a.az + (b.az - a.az) * t,
  el: a.el + (b.el - a.el) * t,
  warna: mix(a.warna, b.warna, t),
  bay: mix(a.bay, b.bay, t),
  amb: a.amb + (b.amb - a.amb) * t,
  dif: a.dif + (b.dif - a.dif) * t,
  nada: mix(a.nada, b.nada, t),
  nk: a.nk + (b.nk - a.nk) * t,
});
/** cahaya 2D kantor: t 0 pagi → 1 malam, lampu meja 0..1, fajar 0..1 */
export function cahayaKantor(t: number, lampu = 0, fajar = 0): Cahaya2D {
  let k = t <= 0.5 ? campur(PAGI, SENJA, t / 0.5) : campur(SENJA, MALAM, (t - 0.5) / 0.5);
  k = campur(k, LAMPU, lampu * klamp((t - 0.35) / 0.4) * 0.8);
  k = campur(k, FAJAR, fajar * 0.7);
  return { matahari: { az: k.az, el: k.el, warna: k.warna }, suasana: { bayangan: k.bay, ambient: k.amb, diffuse: k.dif, lantai: 0.32, nada: { warna: k.nada, kuat: k.nk } } };
}

type Lapis = { y: number; x0: number; x1: number; node: React.ReactNode; bay?: { kaki: [number, number]; tinggiPx: number; siluet: React.ReactNode; kuat?: number; jarakPx?: number } };
const pt = (X: number, h: number, d: number) => {
  const p = titikKantor(X, h, d);
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
};
const quad = (a: [number, number, number], b: [number, number, number], c2: [number, number, number], d2: [number, number, number]) => `M${pt(...a)}L${pt(...b)}L${pt(...c2)}L${pt(...d2)}Z`;

export function Kantor2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  t = 0,
  neon,
  lampu = 0,
  monitor,
  fajar = 0,
  jam,
  meja = {},
  spanduk = 0,
  papan = 0,
  gabus = [],
  kucing,
  isi = [],
  cahaya,
  kabur = 0,
  id = 'kt2',
}: {
  f?: number;
  kam?: Kam2D;
  t?: number;
  neon?: number;
  lampu?: number;
  monitor?: number;
  fajar?: number;
  jam?: number;
  meja?: MejaKantor;
  spanduk?: 0 | 1 | 'lepas';
  papan?: number;
  gabus?: StikerKantor[];
  kucing?: { u: number; pose?: 'duduk' | 'tidur' | 'jalan'; dir?: number; gaze?: number };
  isi?: Isi2D[];
  cahaya?: Cahaya2D;
  kabur?: number;
  id?: string;
}) {
  const malam = klamp((t - 0.55) / 0.45);
  const N = neon ?? 1 - 0.75 * malam;
  const MON = monitor ?? (t > 0.3 ? 1 : 0.4);
  const L = lampu;
  const c = cahaya ?? cahayaKantor(t, L, fajar);
  const J = jam ?? jamKantor(t);
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  const vx0 = kam.cx - 540 / kam.zoom - 250,
    vx1 = kam.cx + 540 / kam.zoom + 250;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  const Y0 = K.kakiDinding,
    PX = K.pxM;
  const yW = (h: number) => Y0 - h * PX;
  const xW = (X: number) => 540 + X * PX;
  const yPlafon = yW(K.plafon);
  const dDekat = 3.5;
  // malam yang diterangi neon tetap tidak segelap kamar
  const tw = Math.min(t, 0.5 + 0.5 * malam * (1 - 0.35 * N));
  const cat = tri(['#EDE5D6', '#CDBFBC', '#4C566E'], tw);
  const catSisi = tri(['#E1D8C6', '#BFB0B0', '#424B63'], tw);
  const plafon = tri(['#F5F0E6', '#D6CBC8', '#3A4258'], tw);
  const lantaiA = tri(['#B9AE9C', '#9E9290', '#3C4458'], tw),
    lantaiB = tri(['#AFA391', '#958A88', '#363D50'], tw);
  const plint = tri(['#8E8376', '#7A6E70', '#30343E'], tw);
  const kayu = tri(['#CBB08C', '#AE9684', '#5E544E'], tw),
    kayuGelap = tri(['#A88D6C', '#8E786C', '#4A423E'], tw),
    kayuAtas = tri(['#DCC4A0', '#BFA894', '#6E6258'], tw);
  const abu = tri(['#7E8A92', '#6E7480', '#3A404C'], tw);
  const partisi = tri(['#8FA3B0', '#7E8C9A', '#3E4858'], tw);
  const kusen = tri(['#F2EEE6', '#DCD3CE', '#8E8E98'], tw);

  // ---------- luar jendela (seberang jalan: deret ruko; paralaks 60%)
  const Jd = K.jendela;
  const jx0 = xW(Jd.X0),
    jx1 = xW(Jd.X1),
    jy0 = yW(Jd.h1),
    jy1 = yW(Jd.h0);
  const fj = klamp(fajar);
  const langit = mix(tri(['#BFDDEE', '#B48AA6', '#1C2638'], t), '#E9A9A0', fj);
  const cakrawalaL = mix(tri(['#F6E6C8', '#F0A98A', '#2E3A52'], t), '#FFD9A8', fj);
  const malamLuar = malam * (1 - fj * 0.7);
  const fasad = mix(tri(['#D9C7A8', '#9E8090', '#283042'], t), '#A88A90', fj);
  const fasad2 = mix(tri(['#C9B597', '#8E7484', '#222A3A'], t), '#9A7E88', fj);
  const px = (kam.cx - 540) * 0.6,
    py = (kam.cy - 960) * 0.6;
  // puncak tembok pembatas atap ruko sebelah, sedikit di atas ambang jendela (dunia, sebelum paralaks). Kucing di u ±0,55–0,65
  // tidak tertutup kerai (u < 0,14 / > 0,86), monitor, atau sandaran kursi.
  const yTembok = 915;
  const ruko: [number, number, number, string][] = [
    [200, 420, 700, fasad], [420, 600, 740, fasad2], [600, 800, 690, fasad], [800, 990, 735, fasad2], [990, 1200, 705, fasad],
  ];
  const kucingNode = kucing
    ? (() => {
        const kx = jx0 - px + (jx1 - jx0) * kucing.u;
        return <Kucing x={kx} y={yTembok} s={0.62} f={f} pose={kucing.pose ?? 'duduk'} dir={kucing.dir ?? 1} gaze={kucing.gaze ?? 0} id={`${id}-kc`} />;
      })()
    : null;
  const luar = (
    <g data-detail="luar-jendela">
      <defs>
        <clipPath id={`${id}-jw`}>
          <rect x={jx0} y={jy0} width={jx1 - jx0} height={jy1 - jy0} />
        </clipPath>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={langit} />
          <stop offset="1" stopColor={cakrawalaL} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-jw)`}>
        <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
          <rect x={jx0 - 500} y={jy0 - 500} width={jx1 - jx0 + 1000} height={jy1 - jy0 + 1000} fill={`url(#${id}-lg)`} />
          {t < 0.5 && fj === 0 && [0, 1].map((i) => <ellipse key={i} cx={360 + ((f * 0.4 + i * 330) % 800)} cy={560 + i * 40} rx={60} ry={16} fill="#FFFFFF" opacity={0.7 - t} />)}
          {fj > 0 && <circle cx={820} cy={720 - 40 * fj} r="30" fill="#FFE2B0" opacity={0.85 * fj} />}
          {malamLuar > 0 && (
            <g opacity={malamLuar}>
              <circle cx="380" cy="560" r="20" fill="#F6EED8" />
              <circle cx="388" cy="555" r="17" fill={langit} />
              {Array.from({ length: 16 }, (_, i) => (
                <circle key={i} cx={jx0 - 80 + acak(i) * (jx1 - jx0 + 160)} cy={jy0 - 60 + acak(i + 7) * 140} r={1.2 + acak(i + 3) * 1.3} fill="#FFF9EF" opacity={0.4 + 0.4 * Math.sin(f * 0.08 + i)} />
              ))}
            </g>
          )}
          {/* deret ruko seberang: papan nama, jendela, AC */}
          {ruko.map(([a, b, y, w], i) => (
            <g key={i}>
              <rect x={a} y={y} width={b - a} height={400} fill={w} />
              <rect x={a} y={y} width={b - a} height="10" fill="#000" opacity=".12" />
              <rect x={a + 18} y={y + 60} width={b - a - 36} height="30" fill={['#8B4354', '#3E7F6A', '#C08A1E', '#4A6FB5', '#8B4354'][i]} opacity={0.75 - 0.35 * malamLuar} />
              {[0.18, 0.55].map((k) => {
                const nyala = malamLuar > 0 && acak(i * 3 + k * 10) > 0.35;
                return <rect key={k} x={a + (b - a) * k} y={y + 120} width={(b - a) * 0.26} height="60" fill={nyala ? '#F6CF7A' : '#5E6A78'} opacity={nyala ? 0.55 + 0.4 * malamLuar : 0.55} />;
              })}
              <rect x={a + (b - a) * 0.7} y={y + 196} width="34" height="22" fill="#D8DCDD" opacity=".8" />
            </g>
          ))}
          {/* kabel listrik */}
          <path d={`M${jx0 - 400} 640Q${(jx0 + jx1) / 2} 690 ${jx1 + 400} 650`} stroke="#2E3336" strokeWidth="1.8" fill="none" opacity=".6" />
          {/* tembok pembatas atap seberang (tempat kucing lewat) */}
          <rect x={jx0 - 500} y={yTembok} width={jx1 - jx0 + 1000} height="200" fill={mix(tri(['#BFAE98', '#8E7E8A', '#262C38'], t), '#8E7A86', fj)} />
          <rect x={jx0 - 500} y={yTembok - 6} width={jx1 - jx0 + 1000} height="8" fill={mix(tri(['#A8977F', '#7A6C78', '#1E2430'], t), '#7A6874', fj)} />
          {kucingNode}
        </g>
        {/* pantulan kaca */}
        <path d={`M${jx0 + 40} ${jy1}L${jx0 + 110} ${jy1}L${jx0 + 260} ${jy0}L${jx0 + 190} ${jy0}Z`} fill="#fff" opacity={0.1 + 0.06 * malam} />
        <path d={`M${jx0 + 330} ${jy1}L${jx0 + 360} ${jy1}L${jx0 + 510} ${jy0}L${jx0 + 480} ${jy0}Z`} fill="#fff" opacity={0.07 + 0.05 * malam} />
      </g>
    </g>
  );

  // ---------- dinding belakang + hiasan
  const dindingD = `M${xW(K.X0)} ${yPlafon}H${xW(K.X1)}V${Y0}H${xW(K.X0)}Z M${jx0} ${jy0}V${jy1}H${jx1}V${jy0}Z`;
  const hJam = ((J % 12) / 12) * 360,
    mJam = (J % 1) * 360;
  const jamP = { x: xW(K.jam.X), y: yW(K.jam.h), r: 0.19 * PX };
  const coret = klamp(papan);
  const hiasan = (
    <g data-detail="hiasan-dinding">
      {/* papan tulis putih */}
      <g data-detail="papan-tulis">
        <rect x={xW(-3.25)} y={yW(1.95)} width={1.3 * PX} height={0.85 * PX} fill="#9AA0A4" />
        <rect x={xW(-3.21)} y={yW(1.91)} width={1.22 * PX} height={0.77 * PX} fill={tri(['#FBFBF7', '#E6E0DE', '#7C8494'], tw)} />
        <text x={xW(-3.12)} y={yW(1.78)} fontFamily="Lato" fontWeight="900" fontSize="17" fill="#3E5B8A">TARGET MINGGU INI</text>
        <path d={`M${xW(-3.12)} ${yW(1.25)}l40 -30l34 14l46 -52l40 22`} stroke="#3E7F6A" strokeWidth="3" fill="none" />
        {coret > 0 && (
          <g opacity={coret}>
            <text x={xW(-2.55)} y={yW(1.42)} fontFamily="Lato" fontWeight="900" fontSize="22" fill="#C0392B" transform={`rotate(-6 ${xW(-2.55)} ${yW(1.42)})`}>DEADLINE!!</text>
            <path d={`M${xW(-3.1)} ${yW(1.62)}h${0.5 * PX}M${xW(-3.1)} ${yW(1.56)}h${0.38 * PX}`} stroke="#C0392B" strokeWidth="3" />
            <text x={xW(-2.3)} y={yW(1.2)} fontFamily="Lato" fontWeight="900" fontSize="15" fill="#C0392B">REVISI!</text>
          </g>
        )}
        <rect x={xW(-3.0)} y={yW(1.12)} width={0.5 * PX} height={0.035 * PX} fill="#8E9498" />
      </g>
      {/* jam dinding */}
      <g data-detail="jam-dinding">
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r * 1.1} fill="#5E6468" />
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r} fill={P.cream} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${jamP.x} ${jamP.y - jamP.r * 0.86}v${jamP.r * 0.12}`} stroke={P.ink} strokeWidth={jamP.r * (i % 3 ? 0.03 : 0.06)} transform={`rotate(${i * 30} ${jamP.x} ${jamP.y})`} />
        ))}
        <path d={`M${jamP.x} ${jamP.y}v${-jamP.r * 0.5}`} stroke={P.ink} strokeWidth={jamP.r * 0.08} strokeLinecap="round" transform={`rotate(${hJam} ${jamP.x} ${jamP.y})`} />
        <path d={`M${jamP.x} ${jamP.y}v${-jamP.r * 0.78}`} stroke={P.ink} strokeWidth={jamP.r * 0.05} strokeLinecap="round" transform={`rotate(${mJam} ${jamP.x} ${jamP.y})`} />
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r * 0.06} fill={P.wine} />
      </g>
      {/* papan gabus (X 1,68..2,28, h 1,22..1,85): kertas bawaan + `gabus` (kertas tempel, u/v 0..1) */}
      <g data-detail="papan-gabus">
        <rect x={xW(GB.X0)} y={yW(GB.h1)} width={(GB.X1 - GB.X0) * PX} height={(GB.h1 - GB.h0) * PX} fill="#8E6A48" />
        <rect x={xW(GB.X0 + 0.03)} y={yW(GB.h1 - 0.03)} width={(GB.X1 - GB.X0 - 0.06) * PX} height={(GB.h1 - GB.h0 - 0.06) * PX} fill={tri(['#C99B6A', '#A88468', '#5A4A40'], tw)} />
        {[[1.74, 1.8, '#FFF9EF'], [2.08, 1.48, '#CFE1F0']].map(([X, h, w], i) => (
          <g key={i}>
            <rect x={xW(X as number)} y={yW(h as number)} width={0.15 * PX} height={0.17 * PX} fill={w as string} transform={`rotate(${(i % 2 ? 4 : -3)} ${xW(X as number)} ${yW(h as number)})`} />
            <circle cx={xW((X as number) + 0.07)} cy={yW((h as number) - 0.01)} r="3" fill={P.wine} />
          </g>
        ))}
        {gabus.map((q, i) => {
          const x = xW(GB.X0 + (GB.X1 - GB.X0) * q.u),
            y0 = yW(GB.h1 - (GB.h1 - GB.h0) * q.v);
          const jatuh = klamp(q.jatuh ?? 0);
          const y = y0 + jatuh * (Y0 - 20 - y0);
          return (
            <g key={'gb' + i} transform={`translate(${x} ${y})`}>
              <Stiker teks={q.teks} warna={q.warna} tinta={q.tinta} rot={(q.rot ?? 0) + jatuh * 70} s={0.62} opacity={1 - 0.6 * (q.pudar ?? 0)} />
              {jatuh === 0 && <circle cx="0" cy="-17" r="3" fill={P.wine} />}
            </g>
          );
        })}
      </g>
      {/* pintu */}
      <g data-detail="pintu">
        <rect x={xW(2.65)} y={yW(2.16)} width={0.8 * PX} height={2.16 * PX} fill={kusen} />
        <rect x={xW(2.7)} y={yW(2.1)} width={0.7 * PX} height={2.1 * PX} fill={tri(['#9A7B5E', '#836A5C', '#46403E'], tw)} />
        <rect x={xW(2.82)} y={yW(1.9)} width={0.46 * PX} height={0.42 * PX} fill={tri(['#CFE1EA', '#B7AEB8', '#2A3244'], tw)} opacity=".85" />
        <circle cx={xW(2.78)} cy={yW(1.0)} r={0.035 * PX} fill={P.gold} />
        <rect x={xW(2.45)} y={yW(1.32)} width={0.1 * PX} height={0.12 * PX} fill="#F7F3EA" />
      </g>
    </g>
  );
  // kerai vertikal di sisi jendela + kusen
  const jendela = (
    <g data-detail="jendela">
      <rect x={jx0 - 0.06 * PX} y={jy0 - 0.06 * PX} width={jx1 - jx0 + 0.12 * PX} height={0.06 * PX} fill={kusen} />
      <rect x={jx0 - 0.06 * PX} y={jy1} width={jx1 - jx0 + 0.12 * PX} height={0.06 * PX} fill={kusen} />
      <rect x={jx0 - 0.06 * PX} y={jy0} width={0.06 * PX} height={jy1 - jy0} fill={kusen} />
      <rect x={jx1} y={jy0} width={0.06 * PX} height={jy1 - jy0} fill={kusen} />
      {[1, 2].map((i) => (
        <rect key={i} x={jx0 + ((jx1 - jx0) * i) / 3 - 0.02 * PX} y={jy0} width={0.04 * PX} height={jy1 - jy0} fill={kusen} />
      ))}
      {[[Jd.X0, Jd.X0 + 0.38], [Jd.X1 - 0.38, Jd.X1]].map(([a, b], s) =>
        Array.from({ length: 5 }, (_, i) => {
          const x = xW(a + ((b - a) * i) / 5);
          return <rect key={`${s}-${i}`} x={x} y={jy0} width={((b - a) / 5) * PX * 0.92} height={jy1 - jy0 + 0.05 * PX} fill={tri(['#EFE8DA', '#D3C6C2', '#5A6274'], tw)} opacity=".95" />;
        }),
      )}
      <rect x={jx0 - 0.08 * PX} y={jy0 - 0.12 * PX} width={jx1 - jx0 + 0.16 * PX} height={0.05 * PX} fill={tri(['#C9C2B6', '#AFA4A4', '#4A505E'], tw)} />
    </g>
  );
  // spanduk selamat datang (digantung tali di atas jendela)
  const spandukNode = spanduk
    ? (() => {
        const a = { x: xW(-0.95), y: yW(2.42) },
          b = { x: xW(1.35), y: yW(2.42) };
        const lepas = spanduk === 'lepas';
        const w = b.x - a.x,
          h = 0.24 * PX;
        return (
          <g data-detail="spanduk" transform={lepas ? `rotate(17 ${a.x} ${a.y})` : undefined}>
            <path d={`M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${a.y + 18} ${b.x} ${a.y}`} stroke="#6E5A4A" strokeWidth="2" fill="none" />
            <rect x={a.x} y={a.y} width={w} height={h} fill={tri(['#F4E3C2', '#D9C2B4', '#6E6870'], tw)} />
            <rect x={a.x} y={a.y} width={w} height="6" fill={P.wine} opacity=".85" />
            <rect x={a.x} y={a.y + h - 6} width={w} height="6" fill={P.wine} opacity=".85" />
            <text x={a.x + w / 2} y={a.y + h * 0.66} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={0.12 * PX} fill={P.wine} opacity={lepas ? 0.75 : 1}>SELAMAT BERGABUNG, YAN!</text>
            {[0.1, 0.3, 0.7, 0.9].map((k) => <path key={k} d={`M${a.x + w * k} ${a.y + h}l-8 16h16Z`} fill={['#E9A08C', '#9CB7D1', '#E8C76A', '#A9C9A4'][Math.round(k * 3)]} opacity={lepas ? 0.5 : 1} />)}
          </g>
        );
      })()
    : null;

  // ---------- lantai, plafon, dinding samping
  const ruang = (
    <g data-detail="ruang">
      <path d={quad([K.X0, K.plafon, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X0, K.plafon, dDekat])} fill={plafon} />
      {/* panel plafon */}
      {[0.9, 1.9].map((d) => <path key={d} d={`M${pt(K.X0, K.plafon - 0.005, d)}L${pt(K.X1, K.plafon - 0.005, d)}`} stroke="#000" strokeWidth="1.2" opacity=".08" />)}
      {/* neon panel: kiri, tengah (di atas meja), kanan */}
      {[-2.0, 0, 2.0].map((X, i) => {
        // malam: hanya panel tengah (di atas meja) yang tetap menyala selama neon > 0
        const tingkat = i === 1 ? Math.min(1, N * 4) : N;
        return (
          <g key={X}>
            <path d={quad([X - 0.5, K.plafon - 0.01, 1.2], [X + 0.5, K.plafon - 0.01, 1.2], [X + 0.5, K.plafon - 0.01, 1.8], [X - 0.5, K.plafon - 0.01, 1.8])} fill={mix(tri(['#C9CCD0', '#A8A6AE', '#4A5266'], tw), '#FFFDF4', tingkat)} />
            {tingkat > 0.3 && <path d={quad([X - 0.45, K.plafon - 0.012, 1.25], [X + 0.45, K.plafon - 0.012, 1.25], [X + 0.45, K.plafon - 0.012, 1.75], [X - 0.45, K.plafon - 0.012, 1.75])} fill="#FFFFFF" opacity={0.5 * tingkat} />}
          </g>
        );
      })}
      <path d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} fill={catSisi} />
      <path d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} fill={catSisi} />
      <Terang c={c} n="kanan" d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} />
      <Terang c={c} n="kiri" d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} />
      {/* lantai vinil papan kayu */}
      <path d={quad([K.X0, 0, 0], [K.X1, 0, 0], [K.X1, 0, dDekat], [K.X0, 0, dDekat])} fill={lantaiA} />
      {Array.from({ length: 18 }, (_, i) => {
        const X = K.X0 + i * 0.4;
        return <path key={i} d={`M${pt(X, 0, 0)}L${pt(X, 0, dDekat)}`} stroke={lantaiB} strokeWidth="3" />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const d = i * 0.4;
        return <path key={'z' + i} d={`M${pt(K.X0 + (i % 2) * 0.2, 0, d)}L${pt(K.X1, 0, d)}`} stroke={lantaiB} strokeWidth="1.5" opacity=".6" />;
      })}
      {/* berkas matahari pagi dari jendela */}
      {t < 0.45 && fj === 0 && <path d={quad([Jd.X0, 0, 0.05], [Jd.X1, 0, 0.05], [Jd.X1 - 0.3, 0, 2.4], [Jd.X0 - 0.3, 0, 2.4])} fill={c.matahari.warna} opacity={0.18 * (1 - t * 2)} />}
      {fj > 0 && <path d={quad([Jd.X0, 0, 0.05], [Jd.X1, 0, 0.05], [Jd.X1 - 0.2, 0, 3.0], [Jd.X0 - 0.2, 0, 3.0])} fill="#F7B9A0" opacity={0.16 * fj} />}
      <path d={dindingD} fillRule="evenodd" fill={cat} />
      <rect x={xW(K.X0)} y={Y0 - 0.1 * PX} width={(K.X1 - K.X0) * PX} height={0.1 * PX} fill={plint} />
      <AmbientKaki c={c} x0={xW(K.X0)} x1={xW(K.X1)} y={Y0} tinggi={100} yAtas={yPlafon} id={`${id}-ak`} />
      {hiasan}
      {jendela}
      {spandukNode}
    </g>
  );

  // ---------- benda berdiri
  const lapis: Lapis[] = [];
  // lemari arsip + printer (kiri, d 0,2)
  {
    const d = 0.2,
      m = pxMd(d);
    const a = titikKantor(-3.35, 0.95, d),
      w = 0.7 * m,
      h = 0.95 * m;
    const node = (
      <g data-benda="lemari-arsip">
        <rect x={a.x} y={a.y} width={w} height={h} fill={abu} />
        {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M${a.x} ${a.y + h * k}h${w}`} stroke="#000" strokeWidth="2" opacity=".18" />)}
        {[0.12, 0.37, 0.62, 0.87].map((k) => <rect key={k} x={a.x + w * 0.4} y={a.y + h * k - 3} width={w * 0.2} height="6" rx="2" fill="#D6DADC" />)}
        <Terang c={c} n="depan" kotak={[a.x, a.y, w, h]} />
        {/* printer */}
        <rect x={a.x + w * 0.08} y={a.y - 0.26 * m} width={w * 0.84} height={0.26 * m} rx="6" fill={tri(['#E6E8E6', '#CFCACA', '#5E6470'], tw)} />
        <rect x={a.x + w * 0.18} y={a.y - 0.3 * m} width={w * 0.64} height={0.05 * m} fill="#FFFFFF" opacity=".85" />
        <circle cx={a.x + w * 0.8} cy={a.y - 0.12 * m} r="4" fill={malam > 0.5 ? '#7CD39A' : '#4E9A6A'} />
      </g>
    );
    lapis.push({ y: yLantai(d), x0: a.x, x1: a.x + w, node, bay: { kaki: [a.x + w / 2, yLantai(d)], tinggiPx: 1.2 * m, siluet: <rect x={a.x} y={a.y - 0.26 * m} width={w} height={h + 0.26 * m} fill="#000" />, kuat: 0.3, jarakPx: d * PX } });
  }
  // pot di antara papan tulis dan jendela (d 0,25)
  {
    const d = 0.25,
      p = titikKantor(-1.55, 0, d),
      s = (pxMd(d) / 200) * 1.3;
    const node = <Plant x={p.x} y={p.y} s={s} kind={1} pot="#B8A48E" />;
    lapis.push({ y: p.y, x0: p.x - 80 * s, x1: p.x + 80 * s, node, bay: { kaki: [p.x, p.y], tinggiPx: 170 * s, siluet: node, kuat: 0.3, jarakPx: d * PX } });
  }
  // dispenser (kanan, di samping pintu, d 0,22; tidak menutupi papan gabus)
  {
    const d = 0.22,
      p = titikKantor(2.47, 0, d),
      m = pxMd(d);
    const node = (
      <g data-benda="dispenser" transform={`translate(${p.x} ${p.y})`}>
        <rect x={-0.16 * m} y={-0.95 * m} width={0.32 * m} height={0.95 * m} rx="5" fill={tri(['#F1F0EC', '#D8D0CE', '#646A76'], tw)} />
        <rect x={-0.1 * m} y={-0.7 * m} width={0.2 * m} height={0.14 * m} fill="#3A3F44" opacity=".7" />
        <circle cx={-0.05 * m} cy={-0.78 * m} r="4" fill="#C0392B" />
        <circle cx={0.05 * m} cy={-0.78 * m} r="4" fill="#3E6FB5" />
        <path d={`M${-0.13 * m} ${-0.95 * m}Q${-0.16 * m} ${-1.35 * m} 0 ${-1.38 * m}Q${0.16 * m} ${-1.35 * m} ${0.13 * m} ${-0.95 * m}Z`} fill="#9CCBE6" opacity=".75" />
        <path d={`M${-0.08 * m} ${-1.25 * m}v${0.24 * m}`} stroke="#fff" strokeWidth="4" opacity=".5" />
        <Terang c={c} n="depan" kotak={[-0.16 * m, -0.95 * m, 0.32 * m, 0.95 * m]} />
      </g>
    );
    lapis.push({ y: p.y, x0: p.x - 0.2 * m, x1: p.x + 0.2 * m, node, bay: { kaki: [p.x, p.y], tinggiPx: 1.38 * m, siluet: <rect x={p.x - 0.16 * m} y={p.y - 1.38 * m} width={0.32 * m} height={1.38 * m} fill="#000" />, kuat: 0.25, jarakPx: d * PX } });
  }
  // meja rekan + partisi (kiri depan, d 1,0..1,5), kosong
  {
    const X0 = -3.05,
      X1 = -1.55,
      dF = 1.55;
    const a = titikKantor(X0, 1.12, dF),
      b = titikKantor(X1, 0, dF);
    const kursi = titikKantor(-2.3, 0, 1.05);
    const node = (
      <g data-benda="meja-rekan">
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={partisi} />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={0.05 * pxMd(dF)} fill={abu} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${a.x + ((b.x - a.x) * (i + 0.5)) / 6} ${a.y + 10}V${b.y - 6}`} stroke="#000" strokeWidth="1" opacity=".06" />)}
        <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
        {/* sandaran kursi rekan menyembul */}
        <rect x={kursi.x - 0.22 * kursi.s * 200} y={titikKantor(0, 1.2, 1.05).y} width={0.44 * kursi.s * 200} height={(titikKantor(0, 1.12, dF).y - titikKantor(0, 1.2, 1.05).y) + 4} rx="10" fill={tri(['#4A5058', '#40444C', '#22262E'], tw)} />
      </g>
    );
    lapis.push({ y: b.y, x0: a.x, x1: b.x, node, bay: { kaki: [(a.x + b.x) / 2, b.y], tinggiPx: 1.12 * pxMd(dF), siluet: <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill="#000" />, kuat: 0.3, jarakPx: dF * PX } });
  }
  // kursi Yan (d 0,22)
  {
    const d = 0.22,
      m = pxMd(d);
    const a = titikKantor(-0.27, 1.12, d),
      b = titikKantor(0.37, 0.5, d),
      g = titikKantor(0.05, 0, d);
    const w = tri(['#3E444C', '#363A42', '#1E2228'], tw);
    const node = (
      <g data-benda="kursi">
        <path d={`M${g.x} ${b.y}V${g.y - 6}`} stroke="#22262A" strokeWidth={0.04 * m} />
        <path d={`M${g.x - 0.25 * m} ${g.y}L${g.x + 0.25 * m} ${g.y}`} stroke="#22262A" strokeWidth={0.03 * m} strokeLinecap="round" />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={0.06 * m} fill={w} />
        <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
      </g>
    );
    lapis.push({ y: g.y, x0: a.x, x1: b.x, node, bay: { kaki: [g.x, g.y], tinggiPx: 1.12 * m, siluet: <rect x={a.x} y={a.y} width={b.x - a.x} height={g.y - a.y} fill="#000" />, kuat: 0.25, jarakPx: d * PX } });
  }
  // meja Yan
  const M = K.meja,
    H = M.tinggi;
  {
    const fA = titikKantor(M.X0, H, M.d1),
      fB = titikKantor(M.X1, 0, M.d1);
    const lip = 0.035 * pxMd(M.d1);
    const atas = quad([M.X0, H, M.d0], [M.X1, H, M.d0], [M.X1 + 0.03, H, M.d1 + 0.02], [M.X0 - 0.03, H, M.d1 + 0.02]);
    const Mo = K.monitor;
    const mA = titikKantor(Mo.X0, Mo.h1, Mo.d),
      mB = titikKantor(Mo.X1, Mo.h0, Mo.d);
    const kaki = titikKantor((Mo.X0 + Mo.X1) / 2, H, Mo.d + 0.04);
    const lampuP = titikKantor(K.lampuX, H, 1.0),
      ls = lampuP.s;
    const mugP = titikKantor(0.45, H, 1.18);
    const nMap = Math.round(klamp(meja.map ?? 0) * 12);
    const mapA = titikKantor(-0.82, H, 1.12),
      mapB = titikKantor(0.32, H, 1.0);
    const gelas = meja.gelas ?? 0;
    const node = (
      <g data-benda="meja">
        <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill={kayu} />
        <Terang c={c} n="depan" kotak={[fA.x, fA.y, fB.x - fA.x, fB.y - fA.y]} />
        <rect x={fA.x + (fB.x - fA.x) * 0.66} y={fA.y + 0.08 * pxMd(M.d1)} width={(fB.x - fA.x) * 0.3} height={0.5 * pxMd(M.d1)} fill={kayuGelap} opacity=".45" />
        {[0.18, 0.34, 0.5].map((k) => <rect key={k} x={fA.x + (fB.x - fA.x) * 0.77} y={fA.y + k * pxMd(M.d1)} width={(fB.x - fA.x) * 0.08} height="5" rx="2" fill={P.gold} />)}
        <rect x={fA.x} y={fB.y - 0.05 * pxMd(M.d1)} width={fB.x - fA.x} height={0.05 * pxMd(M.d1)} fill={kayuGelap} />
        <path d={atas} fill={kayuAtas} />
        <Terang c={c} n="atas" d={atas} />
        <rect x={fA.x - 0.03 * pxMd(M.d1)} y={fA.y - lip} width={fB.x - fA.x + 0.06 * pxMd(M.d1)} height={lip} fill={kayuGelap} />
        {/* monitor: punggung menghadap kamera */}
        <g data-detail="monitor">
          <rect x={kaki.x - 0.03 * kaki.s * 200} y={mB.y} width={0.06 * kaki.s * 200} height={kaki.y - mB.y} fill="#2E3236" />
          <ellipse cx={kaki.x} cy={kaki.y} rx={0.12 * kaki.s * 200} ry={0.025 * kaki.s * 200} fill="#2E3236" />
          <rect x={mA.x} y={mA.y} width={mB.x - mA.x} height={mB.y - mA.y} rx="6" fill={tri(['#3A3F44', '#34383E', '#22262C'], tw)} />
          <rect x={mA.x + (mB.x - mA.x) * 0.3} y={mA.y + (mB.y - mA.y) * 0.3} width={(mB.x - mA.x) * 0.4} height={(mB.y - mA.y) * 0.35} rx="4" fill="#000" opacity=".15" />
          {MON > 0 && <rect x={mA.x - 3} y={mA.y - 3} width={mB.x - mA.x + 6} height={mB.y - mA.y + 6} rx="8" fill="none" stroke="#BFE0F6" strokeWidth="3" opacity={0.25 * MON * (0.3 + malam)} />}
          {(meja.stiker ?? []).map((q, i) => {
            const p = titikMonitor(q.u, q.v);
            const jatuh = klamp(q.jatuh ?? 0);
            const y = p.y + jatuh * (fB.y - p.y - 10);
            return (
              <g key={i} transform={`translate(${p.x} ${y})`}>
                <Stiker teks={q.teks} warna={q.warna} tinta={q.tinta} rot={(q.rot ?? 0) + jatuh * 60} s={p.s * 0.5} opacity={1 - 0.6 * (q.pudar ?? 0)} />
              </g>
            );
          })}
        </g>
        {/* tumpukan map (kiri meja, di sebelah monitor) dan kardus */}
        {nMap > 0 && (
          <>
            <g transform={`translate(${mapA.x} ${mapA.y})`}><TumpukanMap n={nMap} s={mapA.s * 0.55} seed={2} /></g>
            {nMap > 5 && <g transform={`translate(${mapB.x} ${mapB.y})`}><TumpukanMap n={Math.round(nMap * 0.7)} s={mapB.s * 0.5} seed={5} /></g>}
          </>
        )}
        {meja.kardus && (() => {
          const k = titikKantor(0.45, H, 1.1);
          return <g transform={`translate(${k.x} ${k.y})`}><Kardus s={k.s * 0.75} /></g>;
        })()}
        {meja.buku && (() => {
          const a = titikKantor(-0.1, H + 0.03, 1.2),
            b = titikKantor(0.2, H, 1.2);
          return (
            <g data-detail="buku-catatan">
              <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y + 2} fill="#8B4354" />
              <rect x={a.x} y={a.y - 3} width={b.x - a.x} height="4" fill="#F1EEE4" />
            </g>
          );
        })()}
        {/* gelas kopi */}
        {Array.from({ length: gelas }, (_, i) => {
          const g = titikKantor(0.85 - i * 0.11, H, 1.25 - (i % 2) * 0.06);
          const s = g.s;
          return (
            <g key={'g' + i} transform={`translate(${g.x} ${g.y}) scale(${s})`}>
              <path d="M-10 0L-12 -30H12L10 0Z" fill="#F1EDE4" />
              <rect x="-13" y="-34" width="26" height="5" rx="2" fill="#5A4A42" />
              <rect x="-11" y="-22" width="22" height="8" fill="#8B5E3C" opacity=".8" />
            </g>
          );
        })}
        {/* mug */}
        <g transform={`translate(${mugP.x} ${mugP.y})`}>
          <Mug s={mugP.s * 0.55} f={f} hangat={t < 0.3 ? 0.8 : 0} />
        </g>
        {/* lampu meja (kanan) */}
        <g data-detail="lampu-meja" transform={`translate(${lampuP.x} ${lampuP.y}) scale(${(-ls).toFixed(4)} ${ls.toFixed(4)})`}>
          <ellipse cx="0" cy="0" rx="34" ry="8" fill="#3B3F3D" />
          <path d="M-2 0l-14 -110l46 -40" stroke="#3B3F3D" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M18 -166l50 22l-16 34l-48 -24Z" fill="#C08A1E" />
          {L > 0 && <ellipse cx="44" cy="-112" rx="22" ry="8" fill="#FFE7AE" opacity={L} transform="rotate(26 44 -112)" />}
        </g>
      </g>
    );
    lapis.push({ y: fB.y, x0: fA.x, x1: fB.x, node, bay: { kaki: [(fA.x + fB.x) / 2, fB.y], tinggiPx: H * pxMd(M.d1), siluet: <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill="#000" />, kuat: 0.3, jarakPx: M.d1 * PX } });
  }

  // ---------- isi
  const isiS = isi.map((q, i) => ({ ...q, s: q.s ?? skalaKantor(q.y), k: i }));
  const tajam = isiS.filter((q) => q.fokus && kabur > 0);
  const kaburIsi = isiS.filter((q) => !(q.fokus && kabur > 0) && !q.bercahaya);
  const terangIsi = isiS.filter((q) => q.bercahaya && !(q.fokus && kabur > 0));
  const bayanganTokoh = isiS.map((q) => {
    if (q.teduh || q.tanpaBayangan) return null;
    const Ht = (q.tinggi ?? 1.65) * q.s * 200;
    return (
      <BayanganJatuh key={q.k} c={c} kaki={[q.x, q.y]} tinggiPx={Ht} id={`${id}-bt${q.k}`} dindingY={Y0} jarakDindingPx={(q.jarakDinding ?? dDariY(q.y)) * PX} kuat={0.4}>
        {q.gambar({ x: q.x, y: q.y, s: q.s })}
      </BayanganJatuh>
    );
  });
  const badan = (q: (typeof isiS)[number]) => {
    const W = (q.lebar ?? 0.5) * q.s * 200;
    return (
      <g key={`b${q.k}`}>
        {!q.tanpaBayangan && <KontakKaki c={c} x={q.x} y={q.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${q.k}`} />}
        {q.polos ? (
          q.gambar({ x: q.x, y: q.y, s: q.s })
        ) : (
          <TokohBercahaya c={c} x={q.x} y={q.y} s={q.s} tinggi={q.tinggi ?? 1.65} teduh={q.teduh} id={`${id}-tc${q.k}`}>
            {q.gambar({ x: q.x, y: q.y, s: q.s })}
          </TokohBercahaya>
        )}
      </g>
    );
  };
  const lapisTampak = lapis.filter((b) => tampak(b.x0, b.x1));
  const urutan: { y: number; node: React.ReactNode }[] = [
    ...lapisTampak.map((b) => ({ y: b.y, node: b.node })),
    ...kaburIsi.map((q) => ({ y: q.y + (q.urut ?? 0), node: badan(q) })),
  ].sort((a, b) => a.y - b.y);
  const bayanganBenda = lapisTampak
    .filter((b) => b.bay)
    .map((b, i) => (
      <BayanganJatuh key={i} c={c} kaki={b.bay!.kaki} tinggiPx={b.bay!.tinggiPx} id={`${id}-bb${i}`} dindingY={Y0} jarakDindingPx={b.bay!.jarakPx} kuat={b.bay!.kuat ?? 0.3}>
        {b.bay!.siluet}
      </BayanganJatuh>
    ));

  // ---------- cahaya malam: gelap menjauh dari meja; pendar lampu meja (hangat) + monitor (biru)
  const lb = titikKantor(K.lampuX, H, 1.0);
  const bx = lb.x - 44 * lb.s,
    by = lb.y - 112 * lb.s;
  const mo = titikKantor((K.monitor.X0 + K.monitor.X1) / 2, (K.monitor.h0 + K.monitor.h1) / 2, K.monitor.d - 0.2);
  const gelap = malam * (1 - 0.5 * N) * (1 - 0.4 * fj);
  const cahayaMalam = (
    <g pointerEvents="none" data-fx="cahaya-malam">
      <defs>
        <radialGradient id={`${id}-gl`} cx={mo.x + 80} cy={mo.y} r="1250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141C2A" stopOpacity={0.04 * gelap} />
          <stop offset="0.35" stopColor="#141C2A" stopOpacity={0.14 * gelap} />
          <stop offset="1" stopColor="#141C2A" stopOpacity={0.5 * gelap} />
        </radialGradient>
        <radialGradient id={`${id}-pl`} cx={bx} cy={by} r="680" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD68A" stopOpacity={0.5 * L} />
          <stop offset="0.4" stopColor="#FFC873" stopOpacity={0.2 * L} />
          <stop offset="1" stopColor="#FFC873" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-mo`} cx={mo.x + 60} cy={mo.y} r="320" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#BFE0F6" stopOpacity={0.32 * MON * malam} />
          <stop offset="1" stopColor="#BFE0F6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-fj`} x1="0" y1={jy0} x2="0" y2={Y0 + 300} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC9A8" stopOpacity={0.22 * fj} />
          <stop offset="1" stopColor="#FFC9A8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gelap > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-gl)`} />}
      {MON > 0 && malam > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-mo)`} />}
      {L > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-pl)`} />}
      {fj > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-fj)`} />}
    </g>
  );

  const dunia = (
    <g transform={T}>
      {luar}
      {ruang}
      {bayanganBenda}
      {bayanganTokoh}
      {urutan.map((u, i) => (
        <React.Fragment key={i}>{u.node}</React.Fragment>
      ))}
      {cahayaMalam}
      {terangIsi.map((q) => badan(q))}
    </g>
  );

  return (
    <g data-lokasi="kantor-2d">
      <rect x="-200" y="-200" width="1480" height="2320" fill={plafon} />
      {kabur > 0 ? (
        <>
          <defs>
            <filter id={`${id}-kb`} filterUnits="userSpaceOnUse" x="-40" y="-40" width="1160" height="2000" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={kabur.toFixed(2)} />
            </filter>
          </defs>
          <g filter={`url(#${id}-kb)`}>{dunia}</g>
          <g transform={T}>{tajam.map((q) => badan(q))}</g>
        </>
      ) : (
        dunia
      )}
      <NadaAkhir c={c} id={id} />
    </g>
  );
}
