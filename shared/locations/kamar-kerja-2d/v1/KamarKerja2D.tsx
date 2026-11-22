// Lokasi bersama: kamar kerja di rumah, PANGGUNG FLAT 2D dari depan (v1, 12 Nov 2026) dengan cahaya 2D
// (shared/film/v1/Cahaya2D.tsx, disetujui pengguna 11 Nov 2026). Dibuat untuk "Tangan Kosong" v3. Pengguna 12 Nov 2026:
// "sekarang lanjut ke tangan kosong"; v2 ditahan karena kamar-kerja/v1 (proyeksi 3D tanpa cahaya) tidak sesuai aturan
// 3D wajib saat itu. Aturan sekarang (11 Nov 2026 sore): flat 2D bawaan, Dunia3D hanya kalau diminta.
// Isi sama dengan kamar-kerja/v1, dilihat dari depan (satu titik hilang di tengah, perspektif digambar):
//   dinding belakang (lebar 6,6 m, kiri → kanan): rak buku berdiri, kipas berdiri, poster, jam dinding + kalender,
//   meja tulis menghadap kamera (Yan duduk di belakangnya; lampu meja di sisi kiri, buku + mug di kanan), jendela berteralis + gorden (pemandangan atap kampung,
//   tiang listrik, pohon; langit sore → senja → malam), pot, pintu + saklar. Lantai ubin, karpet, plafon + neon (mati).
// Waktu `t` 0..1: 0 = sore ±16.30 (matahari dari jendela, berkas cahaya di lantai), 0,5 = senja, 1 = malam ±21.00
// (bulan, bintang, lampu rumah). `lampu` 0..1 = lampu meja (bawaan menyala setelah senja) = sumber cahaya malam.
// Cahaya 2D dihitung dari waktu: matahari dari jendela kanan-belakang (sore) → lampu meja di sisi kiri meja (malam);
// cahayaKamar(t, lampu) bisa dipakai di luar lokasi (insert, kartu). Jam dinding = 16,5 + 4,5·t jam (atau prop `jam`).
// Skala: dinding 227 px/m (kaki dinding y 1180), mata kamera 1,3 m (cakrawala y 885), kamera 4 m dari dinding.
// titikKamar(X, h, d): X meter dari tengah dinding (+ kanan), h meter tinggi, d meter di depan dinding belakang.
// Tokoh/benda bergerak: `isi` = [{ x, y, gambar, s? }] di koordinat dunia (kaki di lantai); skala bawaan skalaKamar(y).
// Yan duduk: DUDUK2D (pakai pose 'sit', seatDrop 20). Kamera { zoom, cx, cy } sama dengan gang-melati-2d.
// `kabur` = lensa (px layar): seluruh kamar kabur kecuali isi bertanda `fokus`.
// Pakai: <KamarKerja2D f kam t lampu jam meja isi kabur id />
import React from 'react';
import { P } from '../../../core/v1/core';
import { Plant, Bookshelf } from '../../_detail/v1/Detail';
import { Mug } from '../../../props/minum/v1/Minum';
import { Terang, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, NadaAkhir, type Cahaya2D } from '../../../film/v1/Cahaya2D';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type Isi2D = {
  x: number;
  y: number;
  /** skala rig; bawaan skalaKamar(y) */
  s?: number;
  gambar: (p: Titik2D) => React.ReactNode;
  /** jarak ke dinding belakang (m) → bayangan naik ke dinding */
  jarakDinding?: number;
  tinggi?: number;
  lebar?: number;
  teduh?: boolean;
  /** tetap tajam saat `kabur` */
  fokus?: boolean;
  /** tanpa cahaya badan */
  polos?: boolean;
  tanpaBayangan?: boolean;
  /** geser urutan gambar (px dunia, + = lebih depan) */
  urut?: number;
};
export type Meja = { daftar?: 'rapi' | 'centang' | 'coret'; kertasBaru?: boolean; hp?: boolean; hpNyala?: number; pena?: boolean };

export const KAMAR2D = {
  kakiDinding: 1180,
  pxM: 227,
  cakrawala: 885,
  mata: 1.3,
  jarakKamera: 4.0,
  plafon: 2.85,
  /** dinding belakang (m dari tengah) */
  X0: -3.3,
  X1: 3.3,
  meja: { X0: -0.95, X1: 0.95, d0: 0.75, d1: 1.35, tinggi: 0.75 },
  jendela: { X0: 0.45, X1: 2.05, h0: 0.95, h1: 2.25 },
};
const K = KAMAR2D;
/** lampu meja di sisi kiri meja (menjauh dari jendela) */
const LAMPU_X = -0.72;
/** tepi kiri kalender (di bawah jam, tidak tertutup kepala lampu meja) */
const KAL = -1.45;
const FOK = K.pxM * K.jarakKamera;
/** piksel per meter untuk benda d meter di depan dinding belakang */
export const pxMd = (d: number) => FOK / (K.jarakKamera - d);
/** titik dunia (X m dari tengah, h m tinggi, d m di depan dinding) → koordinat dunia layar + skala rig */
export const titikKamar = (X: number, h: number, d: number): Titik2D => {
  const m = pxMd(d);
  return { x: 540 + X * m, y: K.cakrawala + (K.mata - h) * m, s: m / 200 };
};
export const yLantai = (d: number) => titikKamar(0, 0, d).y;
/** jarak ke dinding belakang (m) untuk kaki di y (dunia) */
export const dDariY = (y: number) => Math.max(0, K.jarakKamera - (K.mata * FOK) / Math.max(1, y - K.cakrawala));
/** skala rig untuk kaki di y (dunia) */
export const skalaKamar = (y: number) => Math.max(0.2, (y - K.cakrawala) / (K.mata * 200));
/** Yan duduk di belakang meja (kaki di lantai, d 0,45 m) */
export const DUDUK2D = titikKamar(0, 0, 0.45);
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara2D = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({
  zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t,
  cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t,
  cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t,
});
export const jamKamar = (t: number) => 16.5 + 4.5 * t;

// ------------------------------------------------------------------ warna & cahaya menurut waktu
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
const SORE: Keadaan = { az: 150, el: 24, warna: '#FFC98A', bay: '#5A4458', amb: 0.7, dif: 0.65, nada: '#F2A65A', nk: 0.07 };
const SENJA: Keadaan = { az: 150, el: 10, warna: '#E9A3A0', bay: '#4A3E5E', amb: 0.62, dif: 0.35, nada: '#8E6A9A', nk: 0.08 };
const MALAM: Keadaan = { az: 150, el: 30, warna: '#9FB2D8', bay: '#1A2034', amb: 0.42, dif: 0.18, nada: '#1E2A44', nk: 0.14 };
const LAMPU: Keadaan = { az: -66, el: 32, warna: '#FFD68A', bay: '#1E2438', amb: 0.52, dif: 0.85, nada: '#2A3048', nk: 0.1 };
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
/** Cahaya 2D kamar pada waktu t (0 sore → 1 malam) dengan lampu meja 0..1. */
export function cahayaKamar(t: number, lampu = klamp((t - 0.4) / 0.1)): Cahaya2D {
  const dasar = t <= 0.5 ? campur(SORE, SENJA, t / 0.5) : campur(SENJA, MALAM, (t - 0.5) / 0.5);
  const k = campur(dasar, LAMPU, lampu * klamp((t - 0.35) / 0.4));
  return { matahari: { az: k.az, el: k.el, warna: k.warna }, suasana: { bayangan: k.bay, ambient: k.amb, diffuse: k.dif, lantai: 0.32, nada: { warna: k.nada, kuat: k.nk } } };
}

type Lapis = { y: number; x0: number; x1: number; node: React.ReactNode; bay?: { kaki: [number, number]; tinggiPx: number; siluet: React.ReactNode; kuat?: number; jarakPx?: number } };
const pt = (X: number, h: number, d: number) => {
  const p = titikKamar(X, h, d);
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
};
const quad = (a: [number, number, number], b: [number, number, number], c2: [number, number, number], d2: [number, number, number]) => `M${pt(...a)}L${pt(...b)}L${pt(...c2)}L${pt(...d2)}Z`;

export function KamarKerja2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  t = 0,
  lampu,
  jam,
  meja = {},
  isi = [],
  cahaya,
  kabur = 0,
  id = 'kk2',
}: {
  f?: number;
  kam?: Kam2D;
  t?: number;
  lampu?: number;
  jam?: number;
  meja?: Meja;
  isi?: Isi2D[];
  cahaya?: Cahaya2D;
  kabur?: number;
  id?: string;
}) {
  const L = lampu ?? klamp((t - 0.4) / 0.1);
  const c = cahaya ?? cahayaKamar(t, L);
  const J = jam ?? jamKamar(t);
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  const vx0 = kam.cx - 540 / kam.zoom - 250,
    vx1 = kam.cx + 540 / kam.zoom + 250;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  const malam = klamp((t - 0.55) / 0.45);
  const sore = klamp(1 - t * 2.2);
  const Y0 = K.kakiDinding,
    PX = K.pxM;
  const yW = (h: number) => Y0 - h * PX; // tinggi di dinding belakang
  const xW = (X: number) => 540 + X * PX;
  const yPlafon = yW(K.plafon);
  const dDekat = 3.5;

  // warna menurut waktu (malam dingin; lampu meja menghangatkan lewat lapisan cahaya di akhir)
  const cat = tri(['#E9D8BF', '#C9B4B4', '#46506A'], t);
  const catSisi = tri(['#DCC8AC', '#B9A4A8', '#3C4560'], t);
  const plafon = tri(['#F1E6D3', '#CFC2C2', '#363E56'], t);
  const lantaiA = tri(['#C9B293', '#A9948E', '#3A4256'], t),
    lantaiB = tri(['#BFA787', '#9E8A84', '#333A4D'], t);
  const plint = tri(['#A9876A', '#8E7468', '#3E3A40'], t);
  const kayu = tri(['#B88A62', '#9E7A66', '#5A4A44'], t),
    kayuGelap = tri(['#94694A', '#7E5E52', '#463A36'], t),
    kayuAtas = tri(['#C99C72', '#B08A74', '#6A5850'], t);
  const kusen = tri(['#F5EFE3', '#E3D8D0', '#9C979A'], t);

  // ---------- luar jendela (parallax: bergeser 40% dari gerak kamera)
  const Jd = K.jendela;
  const jx0 = xW(Jd.X0),
    jx1 = xW(Jd.X1),
    jy0 = yW(Jd.h1),
    jy1 = yW(Jd.h0);
  const langit = tri(['#F4B98A', '#B48AA6', '#1E2A3C'], t);
  const cakrawalaL = tri(['#FCE0B0', '#F0A98A', '#34425A'], t);
  const atap = tri(['#9C6A55', '#6E4E5C', '#1B2230'], t);
  const dindingL = tri(['#D8B79A', '#9E8090', '#2A3242'], t);
  const px = (kam.cx - 540) * 0.6,
    py = (kam.cy - 960) * 0.6;
  const rumah: [number, number, number][] = [
    [560, 700, 870], [690, 820, 850], [810, 930, 880], [915, 1040, 845], [1030, 1160, 875], [440, 575, 860],
  ];
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
          <rect x={jx0 - 400} y={jy0 - 400} width={jx1 - jx0 + 800} height={jy1 - jy0 + 800} fill={`url(#${id}-lg)`} />
          {t < 0.55 && <circle cx={930 - 140 * t} cy={760 + 260 * t} r="34" fill="#FFE2A0" opacity={0.9 - t * 1.4} />}
          {malam > 0 && (
            <g opacity={malam}>
              <circle cx="700" cy="730" r="22" fill="#F6EED8" />
              <circle cx="708" cy="725" r="19" fill={langit} />
              {Array.from({ length: 20 }, (_, i) => (
                <circle key={i} cx={jx0 - 60 + acak(i) * (jx1 - jx0 + 120)} cy={jy0 + acak(i + 7) * 160} r={1.2 + acak(i + 3) * 1.4} fill="#FFF9EF" opacity={0.4 + 0.4 * Math.sin(f * 0.08 + i)} />
              ))}
            </g>
          )}
          {t < 0.45 &&
            [0, 1, 2].map((i) => {
              const bx = 600 + ((f * 0.9 + i * 50) % 500),
                by = 760 + (i % 2) * 14;
              return <path key={'b' + i} d={`M${bx - 7} ${by}q7 -5 7 0q0 -5 7 0`} stroke="#5A4440" strokeWidth="2" fill="none" opacity={1 - t * 2} />;
            })}
          {/* pohon + tiang listrik */}
          <circle cx="590" cy="840" r="48" fill={tri(['#6F8F6A', '#4F5E5A', '#1A2420'], t)} />
          <circle cx="560" cy="860" r="34" fill={tri(['#7D9C74', '#566660', '#1C2622'], t)} />
          <path d="M760 980V770" stroke={tri(['#6B5B54', '#4A4048', '#141A24'], t)} strokeWidth="5" />
          <path d="M400 790Q700 815 1100 780" stroke={tri(['#5A4C48', '#40363E', '#141A24'], t)} strokeWidth="1.6" fill="none" />
          {/* deret atap kampung */}
          {rumah.map(([a, b, y], i) => (
            <g key={i}>
              <rect x={a} y={y + 22} width={b - a} height="160" fill={dindingL} />
              <path d={`M${a - 10} ${y + 24}L${(a + b) / 2} ${y - 10}L${b + 10} ${y + 24}Z`} fill={atap} />
              {[0.22, 0.62].map((k) => {
                const nyala = malam > 0 && acak(i * 5 + k * 10) > 0.3;
                return <rect key={k} x={a + (b - a) * k} y={y + 42} width="18" height="20" fill={nyala ? '#F6CF7A' : atap} opacity={nyala ? 0.6 + 0.4 * malam : 0.6} />;
              })}
            </g>
          ))}
          <rect x={jx0 - 400} y="935" width={jx1 - jx0 + 800} height="80" fill={tri(['#CDB79A', '#8E7E8A', '#262C38'], t)} />
          <rect x={jx0 - 400} y="930" width={jx1 - jx0 + 800} height="7" fill={tri(['#B49E82', '#7A6C78', '#1E2430'], t)} />
        </g>
      </g>
    </g>
  );

  // ---------- dinding belakang (berlubang jendela), hiasan
  const dindingD = `M${xW(K.X0)} ${yPlafon}H${xW(K.X1)}V${Y0}H${xW(K.X0)}Z M${jx0} ${jy0}V${jy1}H${jx1}V${jy0}Z`;
  const hJam = ((J % 12) / 12) * 360,
    mJam = (J % 1) * 360;
  const jamP = { x: xW(-1.25), y: yW(2.2), r: 0.22 * PX };
  const hiasan = (
    <g data-detail="hiasan-dinding">
      {/* poster */}
      <rect x={xW(-1.95)} y={yW(1.95)} width={0.45 * PX} height={0.6 * PX} fill="#7E8FB0" />
      <rect x={xW(-1.9)} y={yW(1.89)} width={0.35 * PX} height={0.26 * PX} fill="#F1C977" opacity=".8" />
      <path d={`M${xW(-1.88)} ${yW(1.5)}h${0.3 * PX}M${xW(-1.88)} ${yW(1.44)}h${0.22 * PX}`} stroke="#E8ECF4" strokeWidth="4" opacity=".7" />
      {/* jam dinding */}
      <g data-detail="jam-dinding">
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r * 1.08} fill="#8B6648" />
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r} fill={P.cream} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${jamP.x} ${jamP.y - jamP.r * 0.86}v${jamP.r * 0.12}`} stroke={P.ink} strokeWidth={jamP.r * (i % 3 ? 0.03 : 0.06)} transform={`rotate(${i * 30} ${jamP.x} ${jamP.y})`} />
        ))}
        <path d={`M${jamP.x} ${jamP.y}v${-jamP.r * 0.5}`} stroke={P.ink} strokeWidth={jamP.r * 0.08} strokeLinecap="round" transform={`rotate(${hJam} ${jamP.x} ${jamP.y})`} />
        <path d={`M${jamP.x} ${jamP.y}v${-jamP.r * 0.78}`} stroke={P.ink} strokeWidth={jamP.r * 0.05} strokeLinecap="round" transform={`rotate(${mJam} ${jamP.x} ${jamP.y})`} />
        <circle cx={jamP.x} cy={jamP.y} r={jamP.r * 0.06} fill={P.wine} />
      </g>
      {/* kalender */}
      <rect x={xW(KAL)} y={yW(1.75)} width={0.4 * PX} height={0.5 * PX} fill="#FFF9EF" />
      <rect x={xW(KAL)} y={yW(1.75)} width={0.4 * PX} height={0.13 * PX} fill={P.wine} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={xW(KAL + 0.03 + (i % 4) * 0.09)} y={yW(1.56 - Math.floor(i / 4) * 0.1)} width={0.06 * PX} height={0.06 * PX} fill="#D8CFC0" />
      ))}
      {/* pintu + saklar (kanan) */}
      <g data-detail="pintu">
        <rect x={xW(2.52)} y={yW(2.16)} width={0.76 * PX} height={2.16 * PX} fill={tri(['#E2D2B8', '#C4B2AE', '#5A6278'], t)} />
        <rect x={xW(2.57)} y={yW(2.1)} width={0.66 * PX} height={2.1 * PX} fill={tri(['#A57B57', '#8C6A5A', '#4A3E3C'], t)} />
        <rect x={xW(2.64)} y={yW(1.95)} width={0.52 * PX} height={0.75 * PX} fill="#000" opacity=".08" />
        <rect x={xW(2.64)} y={yW(1.0)} width={0.52 * PX} height={0.82 * PX} fill="#000" opacity=".08" />
        <circle cx={xW(2.66)} cy={yW(1.0)} r={0.035 * PX} fill={P.gold} />
        <rect x={xW(2.3)} y={yW(1.32)} width={0.1 * PX} height={0.12 * PX} fill="#F7F3EA" />
      </g>
    </g>
  );
  const jendela = (
    <g data-detail="jendela">
      {/* kusen, palang tengah, ambang atas, teralis */}
      <rect x={jx0 - 0.07 * PX} y={jy0 - 0.07 * PX} width={jx1 - jx0 + 0.14 * PX} height={0.07 * PX} fill={kusen} />
      <rect x={jx0 - 0.07 * PX} y={jy1} width={jx1 - jx0 + 0.14 * PX} height={0.07 * PX} fill={kusen} />
      <rect x={jx0 - 0.07 * PX} y={jy0} width={0.07 * PX} height={jy1 - jy0} fill={kusen} />
      <rect x={jx1} y={jy0} width={0.07 * PX} height={jy1 - jy0} fill={kusen} />
      <rect x={(jx0 + jx1) / 2 - 0.025 * PX} y={jy0} width={0.05 * PX} height={jy1 - jy0} fill={kusen} />
      <rect x={jx0} y={jy0 + 0.31 * PX} width={jx1 - jx0} height={0.04 * PX} fill={kusen} />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${jx0 + 0.2 * PX * (i + 1)} ${jy0 + 0.35 * PX}V${jy1}`} stroke={tri(['#5E5650', '#4A4448', '#2A2C34'], t)} strokeWidth="2" opacity=".7" />
      ))}
      <path d={`M${jx0 + 0.1 * PX} ${jy1}L${jx0 + 0.35 * PX} ${jy1}L${jx0 + 0.75 * PX} ${jy0 + 0.35 * PX}L${jx0 + 0.5 * PX} ${jy0 + 0.35 * PX}Z`} fill="#fff" opacity={0.12 - 0.06 * t} />
      {/* ambang (menonjol 0,12 m) */}
      <path d={quad([Jd.X0 - 0.12, Jd.h0 - 0.05, 0], [Jd.X1 + 0.12, Jd.h0 - 0.05, 0], [Jd.X1 + 0.12, Jd.h0 - 0.05, 0.12], [Jd.X0 - 0.12, Jd.h0 - 0.05, 0.12])} fill={kusen} />
      <Terang c={c} n="atas" d={quad([Jd.X0 - 0.12, Jd.h0 - 0.05, 0], [Jd.X1 + 0.12, Jd.h0 - 0.05, 0], [Jd.X1 + 0.12, Jd.h0 - 0.05, 0.12], [Jd.X0 - 0.12, Jd.h0 - 0.05, 0.12])} />
      <path d={quad([Jd.X0 - 0.12, Jd.h0 - 0.05, 0.12], [Jd.X1 + 0.12, Jd.h0 - 0.05, 0.12], [Jd.X1 + 0.12, Jd.h0 - 0.1, 0.12], [Jd.X0 - 0.12, Jd.h0 - 0.1, 0.12])} fill={tri(['#E2D6C2', '#CABBB4', '#7E7A82'], t)} />
      {/* gorden kiri-kanan + rel */}
      {[[Jd.X0 - 0.42, Jd.X0 - 0.02], [Jd.X1 + 0.02, Jd.X1 + 0.42]].map(([a, b], i) => (
        <g key={'g' + i}>
          <path d={quad([a, 0.7, 0.06], [b, 0.7, 0.06], [b, Jd.h1 + 0.3, 0.06], [a, Jd.h1 + 0.3, 0.06])} fill={tri(['#9CC7B4', '#7FA49C', '#3E5452'], t)} />
          <Terang c={c} n="depan" d={quad([a, 0.7, 0.06], [b, 0.7, 0.06], [b, Jd.h1 + 0.3, 0.06], [a, Jd.h1 + 0.3, 0.06])} />
          {[0.2, 0.45, 0.7].map((k) => {
            const p1 = titikKamar(a + (b - a) * k, 0.72, 0.065),
              p2 = titikKamar(a + (b - a) * k, Jd.h1 + 0.28, 0.065);
            return <path key={k} d={`M${p1.x} ${p1.y}L${p2.x} ${p2.y}`} stroke="#000" strokeWidth="3" opacity=".12" />;
          })}
        </g>
      ))}
      {(() => {
        const a = titikKamar(Jd.X0 - 0.5, Jd.h1 + 0.32, 0.08),
          b = titikKamar(Jd.X1 + 0.5, Jd.h1 + 0.32, 0.08);
        return <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={tri(['#8B6648', '#6E5650', '#2E2A2E'], t)} strokeWidth="6" />;
      })()}
    </g>
  );

  // ---------- lantai, plafon, dinding samping (perspektif satu titik hilang)
  const ubin: React.ReactNode[] = [];
  for (let ix = 0; ix < 17; ix++)
    for (let iz = 0; iz < 9; iz++) {
      if ((ix + iz) % 2) continue;
      const xa = K.X0 + ix * 0.4,
        da = iz * 0.4;
      ubin.push(<path key={ix + '-' + iz} d={quad([xa, 0, da], [Math.min(K.X1, xa + 0.4), 0, da], [Math.min(K.X1, xa + 0.4), 0, da + 0.4], [xa, 0, da + 0.4])} fill={lantaiB} />);
    }
  // berkas cahaya sore dari jendela di lantai (sudut matahari dari cahaya 2D)
  const berkas = (() => {
    if (sore <= 0) return null;
    const az = (c.matahari.az * Math.PI) / 180,
      el = (Math.max(8, c.matahari.el) * Math.PI) / 180;
    const kd = (-Math.cos(az) * Math.cos(el)) / Math.sin(el),
      kx = (-Math.sin(az) * Math.cos(el)) / Math.sin(el);
    if (kd <= 0) return null;
    const hMax = Math.min(Jd.h1, 3.4 / kd);
    const p = (X: number, h: number): [number, number, number] => [X + kx * h, 0, kd * h];
    const lantaiPatch = quad(p(Jd.X0, Jd.h0), p(Jd.X1, Jd.h0), p(Jd.X1, hMax), p(Jd.X0, hMax));
    const sinar = `M${jx0} ${jy1}L${jx1} ${jy1}L${pt(...p(Jd.X1, Jd.h0))}L${pt(...p(Jd.X0, Jd.h0))}Z M${jx0} ${jy0}L${jx1} ${jy0}L${pt(...p(Jd.X1, hMax))}L${pt(...p(Jd.X0, hMax))}Z`;
    return (
      <g pointerEvents="none" data-fx="berkas-jendela">
        <path d={lantaiPatch} fill={c.matahari.warna} opacity={0.16 * sore} />
        <path d={sinar} fill={c.matahari.warna} opacity={0.035 * sore} />
      </g>
    );
  })();
  const ruang = (
    <g data-detail="ruang">
      {/* plafon + neon (mati) */}
      <path d={quad([K.X0, K.plafon, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X0, K.plafon, dDekat])} fill={plafon} />
      <path d={quad([-0.6, K.plafon - 0.01, 1.6], [0.6, K.plafon - 0.01, 1.6], [0.6, K.plafon - 0.01, 1.72], [-0.6, K.plafon - 0.01, 1.72])} fill="#F7F3EA" />
      {/* dinding samping */}
      <path d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} fill={catSisi} />
      <path d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} fill={catSisi} />
      <Terang c={c} n="kanan" d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} />
      <Terang c={c} n="kiri" d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} />
      {/* lantai ubin */}
      <path d={quad([K.X0, 0, 0], [K.X1, 0, 0], [K.X1, 0, dDekat], [K.X0, 0, dDekat])} fill={lantaiA} />
      {ubin}
      {/* karpet */}
      <path d={quad([-1.45, 0, 0.05], [1.45, 0, 0.05], [1.45, 0, 1.9], [-1.45, 0, 1.9])} fill={tri(['#C98F84', '#A87C7C', '#5A4448'], t)} opacity=".9" />
      <path d={quad([-1.35, 0, 0.12], [1.35, 0, 0.12], [1.35, 0, 1.8], [-1.35, 0, 1.8])} fill="none" stroke={tri(['#E8D7B8', '#CDB9A8', '#6E5E5E'], t)} strokeWidth="4" />
      {berkas}
      {/* dinding belakang */}
      <path d={dindingD} fillRule="evenodd" fill={cat} />
      <rect x={xW(K.X0)} y={Y0 - 0.1 * PX} width={(K.X1 - K.X0) * PX} height={0.1 * PX} fill={plint} />
      <AmbientKaki c={c} x0={xW(K.X0)} x1={xW(K.X1)} y={Y0} tinggi={100} yAtas={yPlafon} id={`${id}-ak`} />
      {hiasan}
      {jendela}
    </g>
  );

  // ---------- benda berdiri (urut kedalaman bersama tokoh)
  const lapis: Lapis[] = [];
  // rak buku berdiri (d 0,15)
  {
    const d = 0.15,
      m = pxMd(d);
    const a = titikKamar(-3.15, 1.8, d);
    const w = 0.9 * m,
      h = 1.8 * m;
    const sc = h / (4 * 90 + 20);
    const node = (
      <g data-benda="rak-buku">
        <g transform={`translate(${a.x} ${a.y}) scale(${(w / 220).toFixed(4)} ${sc.toFixed(4)})`}>
          <Bookshelf x={0} y={0} w={220} rows={4} />
        </g>
        <Terang c={c} n="depan" kotak={[a.x, a.y, w, h]} />
      </g>
    );
    lapis.push({ y: yLantai(d), x0: a.x, x1: a.x + w, node, bay: { kaki: [a.x + w / 2, yLantai(d)], tinggiPx: h, siluet: <rect x={a.x} y={a.y} width={w} height={h} fill="#000" />, kuat: 0.3, jarakPx: d * PX } });
  }
  // kipas berdiri (d 0,45)
  {
    const d = 0.45,
      p = titikKamar(-1.75, 0, d),
      m = pxMd(d);
    const a = (f * 22) % 360;
    const node = (
      <g data-benda="kipas" transform={`translate(${p.x} ${p.y})`}>
        <ellipse cx="0" cy="0" rx={0.22 * m} ry={0.05 * m} fill="#59615E" />
        <path d={`M0 0V${-1.05 * m}`} stroke="#8E9692" strokeWidth={0.04 * m} />
        <circle cx="0" cy={-1.25 * m} r={0.24 * m} fill="#DCE6E2" stroke="#8E9692" strokeWidth={0.02 * m} />
        {[0, 120, 240].map((r) => (
          <ellipse key={r} cx="0" cy={-1.25 * m - 0.11 * m} rx={0.05 * m} ry={0.11 * m} fill={tri(['#95B8A2', '#86A096', '#4E5A58'], t)} opacity=".8" transform={`rotate(${r + a} 0 ${-1.25 * m})`} />
        ))}
        <circle cx="0" cy={-1.25 * m} r={0.04 * m} fill="#59615E" />
      </g>
    );
    lapis.push({ y: p.y, x0: p.x - 0.3 * m, x1: p.x + 0.3 * m, node, bay: { kaki: [p.x, p.y], tinggiPx: 1.45 * m, siluet: <g transform={`translate(${p.x} ${p.y})`}><rect x={-0.02 * m} y={-1.05 * m} width={0.04 * m} height={1.05 * m} fill="#000" /><circle cx="0" cy={-1.25 * m} r={0.24 * m} fill="#000" /></g>, kuat: 0.25, jarakPx: d * PX } });
  }
  // pot di dekat jendela (d 0,3)
  {
    const d = 0.3,
      p = titikKamar(2.3, 0, d),
      s = (pxMd(d) / 200) * 1.25;
    const node = <Plant x={p.x} y={p.y} s={s} kind={2} pot="#C9805A" />;
    lapis.push({ y: p.y, x0: p.x - 80 * s, x1: p.x + 80 * s, node, bay: { kaki: [p.x, p.y], tinggiPx: 160 * s, siluet: node, kuat: 0.3, jarakPx: d * PX } });
  }
  // kursi di belakang Yan (d 0,2)
  {
    const d = 0.2,
      m = pxMd(d);
    const a = titikKamar(-0.26, 1.0, d),
      b = titikKamar(0.26, 0.44, d),
      g = titikKamar(0, 0, d);
    const w = tri(['#7A5644', '#664C44', '#3A302E'], t);
    const node = (
      <g data-benda="kursi">
        <path d={`M${a.x + 0.03 * m} ${b.y}V${g.y}M${b.x - 0.03 * m} ${b.y}V${g.y}`} stroke={w} strokeWidth={0.04 * m} />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={0.03 * m} fill={w} />
        <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
      </g>
    );
    lapis.push({ y: g.y, x0: a.x, x1: b.x, node, bay: { kaki: [g.x, g.y], tinggiPx: 1.0 * m, siluet: <rect x={a.x} y={a.y} width={b.x - a.x} height={g.y - a.y} fill="#000" />, kuat: 0.25, jarakPx: d * PX } });
  }
  // meja tulis + benda di atasnya
  {
    const M = K.meja;
    const H = M.tinggi;
    const fA = titikKamar(M.X0, H, M.d1),
      fB = titikKamar(M.X1, 0, M.d1);
    const lip = 0.04 * pxMd(M.d1);
    const atas = quad([M.X0, H, M.d0], [M.X1, H, M.d0], [M.X1 + 0.03, H, M.d1 + 0.02], [M.X0 - 0.03, H, M.d1 + 0.02]);
    const kertas = (X0: number, X1: number, d0: number, d1: number, warna: string, garis: number, coret = false, centang = 0, key = 'k') => (
      <g key={key}>
        <path d={quad([X0, H + 0.003, d0], [X1, H + 0.003, d0], [X1, H + 0.003, d1], [X0, H + 0.003, d1])} fill={warna} />
        {Array.from({ length: garis }, (_, i) => {
          const d = d0 + 0.05 + i * ((d1 - d0 - 0.08) / garis);
          const a = titikKamar(X0 + 0.05, H + 0.004, d),
            b = titikKamar(X0 + 0.05 + (X1 - X0) * (0.5 + 0.2 * (i % 2)), H + 0.004, d);
          return (
            <g key={i}>
              <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={P.ink} strokeWidth="1.6" opacity=".35" />
              {coret && i < 3 && <path d={`M${a.x - 3} ${a.y}L${b.x + 6} ${b.y}`} stroke={P.wine} strokeWidth="2.6" />}
              {i < centang && <circle cx={a.x - 8} cy={a.y} r="2.6" fill="#3E7F6A" />}
            </g>
          );
        })}
      </g>
    );
    const lampuP = titikKamar(LAMPU_X, H, 0.95),
      ls = lampuP.s;
    const mugP = titikKamar(0.78, H, 1.15);
    const hpNyala = meja.hpNyala ?? 0;
    const bukuA = titikKamar(0.6, H + 0.12, 0.92),
      bukuB = titikKamar(0.9, H, 0.92);
    const node = (
      <g data-benda="meja">
        {/* badan meja: panel depan sampai lantai (tokoh duduk di belakangnya) */}
        <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill={kayu} />
        <Terang c={c} n="depan" kotak={[fA.x, fA.y, fB.x - fA.x, fB.y - fA.y]} />
        {[-0.5, 0.5].map((cx) => {
          const a = titikKamar(cx - 0.32, 0.66, M.d1),
            b = titikKamar(cx + 0.32, 0.42, M.d1),
            g1 = titikKamar(cx - 0.08, 0.54, M.d1),
            g2 = titikKamar(cx + 0.08, 0.54, M.d1);
          return (
            <g key={cx}>
              <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={kayuGelap} opacity=".5" />
              <path d={`M${g1.x} ${g1.y}H${g2.x}`} stroke={P.gold} strokeWidth="5" strokeLinecap="round" />
            </g>
          );
        })}
        <rect x={fA.x} y={fB.y - 0.06 * pxMd(M.d1)} width={fB.x - fA.x} height={0.06 * pxMd(M.d1)} fill={kayuGelap} />
        {/* daun meja */}
        <path d={atas} fill={kayuAtas} />
        <Terang c={c} n="atas" d={atas} />
        <rect x={fA.x - 0.03 * pxMd(M.d1)} y={fA.y - lip} width={fB.x - fA.x + 0.06 * pxMd(M.d1)} height={lip} fill={kayuGelap} />
        {/* benda di atas meja */}
        {kertas(-0.52, -0.1, 0.85, 1.22, '#FFFDF7', 5, meja.daftar === 'coret', meja.daftar === 'centang' || meja.daftar === 'coret' ? 4 : 0, 'daftar')}
        {meja.kertasBaru && kertas(-0.04, 0.3, 0.88, 1.24, '#F6F1DF', 4, false, 0, 'baru')}
        {meja.pena !== false && (() => {
          const a = titikKamar(-0.05, H + 0.01, 0.95),
            b = titikKamar(0.1, H + 0.01, 1.15);
          return <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={P.wine} strokeWidth="5" strokeLinecap="round" />;
        })()}
        {meja.hp && (
          <g data-detail="ponsel-meja">
            <path d={quad([0.36, H + 0.006, 1.02], [0.48, H + 0.006, 1.02], [0.48, H + 0.006, 1.24], [0.36, H + 0.006, 1.24])} fill="#2D3532" />
            <path d={quad([0.37, H + 0.008, 1.04], [0.47, H + 0.008, 1.04], [0.47, H + 0.008, 1.22], [0.37, H + 0.008, 1.22])} fill={hpNyala > 0 ? '#CFE6F0' : '#3B4542'} opacity={0.5 + 0.5 * hpNyala} />
            {hpNyala > 0 && (() => {
              const p = titikKamar(0.42, H + 0.01, 1.13);
              return <ellipse cx={p.x} cy={p.y} rx={0.3 * pxMd(1.13)} ry={0.14 * pxMd(1.13)} fill="#CFE6F0" opacity={0.3 * hpNyala * (0.8 + 0.2 * Math.sin(f * 0.3))} />;
            })()}
          </g>
        )}
        {/* tumpukan buku */}
        <rect x={bukuA.x} y={bukuA.y} width={bukuB.x - bukuA.x} height={bukuB.y - bukuA.y} fill="#3E7F6A" />
        <rect x={bukuA.x} y={bukuA.y - 4} width={bukuB.x - bukuA.x} height="5" fill="#F1EEE4" />
        <rect x={bukuA.x + 6} y={bukuA.y - 0.08 * pxMd(0.95) - 4} width={bukuB.x - bukuA.x - 12} height={0.08 * pxMd(0.95)} fill={P.wine} />
        <Terang c={c} n="depan" kotak={[bukuA.x, bukuA.y - 0.08 * pxMd(0.95) - 4, bukuB.x - bukuA.x, bukuB.y - bukuA.y + 0.08 * pxMd(0.95) + 4]} />
        {/* mug */}
        <g transform={`translate(${mugP.x} ${mugP.y})`}>
          <Mug s={mugP.s * 0.55} f={f} hangat={0.6} />
        </g>
        {/* lampu meja */}
        <g data-detail="lampu-meja" transform={`translate(${lampuP.x} ${lampuP.y}) scale(${ls.toFixed(4)})`}>
          <ellipse cx="0" cy="0" rx="34" ry="8" fill="#3B3F3D" />
          <path d="M-2 0l-14 -110l46 -40" stroke="#3B3F3D" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M18 -166l50 22l-16 34l-48 -24Z" fill={tri(['#3E7F6A', '#3E7F6A', '#2E5A4E'], t)} />
          {L > 0 && <ellipse cx="44" cy="-112" rx="22" ry="8" fill="#FFE7AE" opacity={L} transform="rotate(26 44 -112)" />}
        </g>
      </g>
    );
    lapis.push({ y: fB.y, x0: fA.x, x1: fB.x, node, bay: { kaki: [(fA.x + fB.x) / 2, fB.y], tinggiPx: H * pxMd(M.d1), siluet: <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill="#000" />, kuat: 0.3, jarakPx: M.d1 * PX } });
  }

  // ---------- isi (tokoh/benda bergerak)
  const isiS = isi.map((q, i) => ({ ...q, s: q.s ?? skalaKamar(q.y), k: i }));
  const tajam = isiS.filter((q) => q.fokus && kabur > 0);
  const kaburIsi = isiS.filter((q) => !(q.fokus && kabur > 0));
  const bayanganTokoh = isiS.map((q) => {
    if (q.teduh || q.tanpaBayangan) return null;
    const H = (q.tinggi ?? 1.65) * q.s * 200;
    return (
      <BayanganJatuh key={q.k} c={c} kaki={[q.x, q.y]} tinggiPx={H} id={`${id}-bt${q.k}`} dindingY={Y0} jarakDindingPx={(q.jarakDinding ?? dDariY(q.y)) * PX} kuat={0.4}>
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

  // ---------- cahaya lampu meja (malam): gelap menjauh dari lampu + pendar hangat
  const bohlam = titikKamar(LAMPU_X, K.meja.tinggi, 0.95);
  const bx = bohlam.x + 44 * bohlam.s,
    by = bohlam.y - 112 * bohlam.s;
  const gelap = klamp((t - 0.35) / 0.45);
  const cahayaLampu = (
    <g pointerEvents="none" data-fx="lampu-meja">
      <defs>
        <radialGradient id={`${id}-gl`} cx={bx} cy={by} r="1300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141C2A" stopOpacity={0.05 * gelap * (1 - L)} />
          <stop offset="0.35" stopColor="#141C2A" stopOpacity={0.12 * gelap} />
          <stop offset="1" stopColor="#141C2A" stopOpacity={0.48 * gelap} />
        </radialGradient>
        <radialGradient id={`${id}-pl`} cx={bx} cy={by} r="720" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD68A" stopOpacity={0.5 * L} />
          <stop offset="0.4" stopColor="#FFC873" stopOpacity={0.2 * L} />
          <stop offset="1" stopColor="#FFC873" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-kr`} x1="0" y1={by} x2="0" y2={by + 260} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE2A6" stopOpacity={0.3 * L} />
          <stop offset="1" stopColor="#FFE2A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gelap > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-gl)`} />}
      {L > 0 && (
        <>
          <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-pl)`} />
          <path d={`M${bx - 18} ${by}L${bx + 18} ${by}L${bx + 150} ${by + 250}L${bx - 210} ${by + 250}Z`} fill={`url(#${id}-kr)`} />
        </>
      )}
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
      {cahayaLampu}
    </g>
  );

  return (
    <g data-lokasi="kamar-kerja-2d">
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
