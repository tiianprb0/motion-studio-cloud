// v2 (18 Nov 2026, "Kebakaran Hutan Papua" v1): salinan v1 (terkunci, dipakai Hari Pertama Kerja) dengan dua perubahan:
//   1. Langit di jendela lebih luas: deret ruko seberang diturunkan (atap ±50% tinggi kaca), ada awan, burung, dan
//      silau matahari siang, supaya "langit biru" terbaca dari dalam kafe (benang merah video itu).
//   2. `promo` (bawaan true): papan PROMO berdiri di depan jendela bisa disembunyikan (menutupi ambang jendela tempat
//      kucing duduk). Sisanya sama dengan v1.
// Lokasi bersama: kafe kecil tempat nongkrong (v1, 13 Nov 2026), PANGGUNG FLAT 2D dari depan dengan cahaya 2D
// (shared/film/v1/Cahaya2D.tsx). Dibuat agen Buat konten untuk "Hari Pertama Kerja" v1 (pengguna: "ganti tempat baru misal
// lagi nongkrong di cafee bareng teman kerja gitu"). Skala dan proyeksi sama dengan kantor-2d/v1 dan kamar-kerja-2d/v1.
// Isi (dinding belakang 7 m, kiri → kanan): meja bar + mesin espreso + rak cangkir + papan menu kapur, lampu tali di atas,
// jendela besar ke jalan (deret ruko seberang, motor terparkir), pot besar. Depan: meja panjang kayu menghadap kamera (panel
// depan sampai lantai, tokoh duduk di belakangnya) dengan tiga kursi; tiga lampu gantung di atas meja. Lantai teraso.
// Waktu `t` 0 siang → 0,5 sore (matahari dari jendela kanan) → 1 malam. `lampu` 0..1 = lampu gantung + lampu tali (bawaan
// menyala mulai sore). `meja` = isi meja: `gelas` (jumlah es kopi, 0..4), `pisang` (piring pisang goreng), `hp`.
// Tempat duduk: KURSI_KAFE[0..2] (X -0,8 / 0 / 0,8; d 0,5) — Person pose="sit" seatDrop={20}.
// Pakai: <Kafe2D f kam t lampu meja isi kabur id />  (isi = Isi2D seperti kantor-2d; `bercahaya` digambar sesudah cahaya)
import React from 'react';
import { P } from '../../../core/v1/core';
import { Plant, Cloud, Flock } from '../../_detail/v1/Detail';
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
  bercahaya?: boolean;
};
export type MejaKafe = { gelas?: number; pisang?: boolean; hp?: boolean };

export const KAFE2D = {
  kakiDinding: 1180,
  pxM: 227,
  cakrawala: 885,
  mata: 1.3,
  jarakKamera: 4.0,
  plafon: 2.9,
  X0: -3.5,
  X1: 3.5,
  meja: { X0: -1.3, X1: 1.3, d0: 0.85, d1: 1.4, tinggi: 0.75 },
  jendela: { X0: 1.05, X1: 3.15, h0: 0.8, h1: 2.35 },
};
const K = KAFE2D;
const FOK = K.pxM * K.jarakKamera;
export const pxMd = (d: number) => FOK / (K.jarakKamera - d);
export const titikKafe = (X: number, h: number, d: number): Titik2D => {
  const m = pxMd(d);
  return { x: 540 + X * m, y: K.cakrawala + (K.mata - h) * m, s: m / 200 };
};
export const yLantai = (d: number) => titikKafe(0, 0, d).y;
export const dDariY = (y: number) => Math.max(0, K.jarakKamera - (K.mata * FOK) / Math.max(1, y - K.cakrawala));
export const skalaKafe = (y: number) => Math.max(0.2, (y - K.cakrawala) / (K.mata * 200));
/** tiga tempat duduk di belakang meja panjang (kaki di lantai) */
export const KURSI_KAFE = [titikKafe(-0.8, 0, 0.5), titikKafe(0, 0, 0.5), titikKafe(0.8, 0, 0.5)];
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });

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

/** cahaya 2D kafe: t 0 siang → 0,5 sore (matahari rendah dari jendela kanan) → 1 malam (lampu gantung hangat) */
export function cahayaKafe(t: number, lampu = klamp((t - 0.35) / 0.2)): Cahaya2D {
  const sore = 1 - Math.abs(t - 0.5) * 2;
  const malam = klamp((t - 0.5) * 2);
  const az = 120 - 60 * malam,
    el = 40 - 22 * sore + 20 * malam;
  const warna = mix(mix('#FFF1D2', '#FFC98A', klamp(t * 2)), '#FFD68A', malam);
  return {
    matahari: { az, el, warna },
    suasana: {
      bayangan: tri(['#3A3F5A', '#47395A', '#1E2438'], t),
      ambient: 0.68 - 0.18 * malam + 0.06 * lampu * malam,
      diffuse: 0.72 + 0.1 * sore - 0.1 * malam,
      lantai: 0.32,
      nada: { warna: tri(['#F6E2B8', '#F2A65A', '#2A3048'], t), kuat: 0.03 + 0.05 * sore + 0.08 * malam },
    },
  };
}

type Lapis = { y: number; x0: number; x1: number; node: React.ReactNode; bay?: { kaki: [number, number]; tinggiPx: number; siluet: React.ReactNode; kuat?: number; jarakPx?: number } };
const pt = (X: number, h: number, d: number) => {
  const p = titikKafe(X, h, d);
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
};
const quad = (a: [number, number, number], b: [number, number, number], c2: [number, number, number], d2: [number, number, number]) => `M${pt(...a)}L${pt(...b)}L${pt(...c2)}L${pt(...d2)}Z`;

/** es kopi susu dalam gelas plastik, pusat bawah di (0,0), tinggi ±60 px pada s=1 */
export const EsKopi = ({ s = 1 }: { s?: number }) => (
  <g data-prop="es-kopi" transform={`scale(${s})`}>
    <path d="M-17 0L-21 -52H21L17 0Z" fill="#F4ECE0" opacity=".55" />
    <path d="M-17 0L-20 -38H20L17 0Z" fill="#B88A62" />
    <path d="M-19.4 -30H19.4L19 -38H-19.8Z" fill="#E9D7BC" />
    <rect x="-23" y="-56" width="46" height="6" rx="3" fill="#F7F3EA" />
    <path d="M4 -56L12 -84" stroke="#8B4354" strokeWidth="4" strokeLinecap="round" />
    <path d="M-12 -46v36" stroke="#fff" strokeWidth="3" opacity=".45" />
  </g>
);

export function Kafe2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  t = 0.5,
  lampu,
  meja = { gelas: 3, pisang: true },
  isi = [],
  cahaya,
  kabur = 0,
  promo = true,
  id = 'kf2',
}: {
  f?: number;
  kam?: Kam2D;
  t?: number;
  lampu?: number;
  meja?: MejaKafe;
  isi?: Isi2D[];
  cahaya?: Cahaya2D;
  kabur?: number;
  /** papan PROMO berdiri di depan jendela (v2: bisa disembunyikan) */
  promo?: boolean;
  id?: string;
}) {
  const L = lampu ?? klamp((t - 0.35) / 0.2);
  const c = cahaya ?? cahayaKafe(t, L);
  const malam = klamp((t - 0.55) / 0.45);
  const sore = 1 - Math.abs(t - 0.5) * 2;
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
  const cat = tri(['#F1E4CC', '#EBC9A6', '#4E4A5E'], t);
  const catSisi = tri(['#E6D6BA', '#DDB896', '#444258'], t);
  const kayuDinding = tri(['#9A6B4A', '#8C5E44', '#3E3236'], t);
  const plafon = tri(['#E9DCC4', '#DDC2A4', '#34303E'], t);
  const kayu = tri(['#B07A52', '#A06C48', '#4E3A34'], t),
    kayuGelap = tri(['#8A5C3E', '#7C5038', '#3A2C28'], t),
    kayuAtas = tri(['#C9946A', '#BC8460', '#5E463C'], t);
  const teraso = tri(['#D8CFC2', '#D2BFA8', '#4A4652'], t);

  // ---------- jendela: jalan + deret ruko seberang (paralaks 60%)
  const Jd = K.jendela;
  const jx0 = xW(Jd.X0),
    jx1 = xW(Jd.X1),
    jy0 = yW(Jd.h1),
    jy1 = yW(Jd.h0);
  const langit = tri(['#7DBDE4', '#F2B98A', '#1C2638'], t); // v2: biru siang lebih jelas
  const cak = tri(['#CFE6F1', '#FCE0B0', '#2E3A52'], t);
  const px = (kam.cx - 540) * 0.6,
    py = (kam.cy - 960) * 0.6;
  const fasad = [tri(['#D9C7A8', '#D8A88A', '#283042'], t), tri(['#C9B597', '#C49478', '#222A3A'], t)];
  const luar = (
    <g data-detail="luar-jendela">
      <defs>
        <clipPath id={`${id}-jw`}>
          <rect x={jx0} y={jy0} width={jx1 - jx0} height={jy1 - jy0} />
        </clipPath>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={langit} />
          <stop offset="1" stopColor={cak} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-jw)`}>
        <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
          <rect x={jx0 - 500} y={jy0 - 500} width={jx1 - jx0 + 1000} height={jy1 - jy0 + 1000} fill={`url(#${id}-lg)`} />
          {sore > 0.3 && <circle cx={jx1 - 120} cy={jy0 + 120} r="34" fill="#FFE2A0" opacity={0.8 * sore} />}
          {t < 0.5 && (
            <g opacity={1 - Math.max(0, (t - 0.3) / 0.2)}>
              <circle cx={jx0 + 70} cy={jy0 + 60} r="70" fill="#FFFFFF" opacity=".25" />
              <Cloud x={jx0 + 40 + ((f * 0.3) % 300)} y={jy0 + 70} s={0.75} o={0.9} />
              <Cloud x={jx0 + 330 - ((f * 0.2) % 200)} y={jy0 + 150} s={0.5} o={0.75} />
              <Flock x={jx0 + 150} y={jy0 + 120} f={f} n={3} s={0.6} />
            </g>
          )}
          {[0, 1, 2, 3].map((i) => {
            const a = jx0 - 60 + i * 190,
              y = jy0 + (jy1 - jy0) * 0.5 + (i % 2) * 26;
            return (
              <g key={i}>
                <rect x={a} y={y} width="180" height="420" fill={fasad[i % 2]} />
                <rect x={a + 14} y={y + 50} width="152" height="26" fill={['#8B4354', '#3E7F6A', '#C08A1E', '#4A6FB5'][i]} opacity={0.75 - 0.3 * malam} />
                {[0.15, 0.55].map((k) => <rect key={k} x={a + 180 * k} y={y + 110} width="50" height="56" fill={malam > 0 ? '#F6CF7A' : '#5E6A78'} opacity={0.55 + 0.35 * malam} />)}
              </g>
            );
          })}
          {/* jalan + trotoar seberang */}
          <rect x={jx0 - 500} y={jy1 - 70} width={jx1 - jx0 + 1000} height="200" fill={tri(['#8E8A84', '#8A7E78', '#22262E'], t)} />
          <rect x={jx0 - 500} y={jy1 - 78} width={jx1 - jx0 + 1000} height="10" fill={tri(['#BDB4A6', '#B8A898', '#3A3E46'], t)} />
          {/* motor terparkir */}
          <g transform={`translate(${jx0 + 300} ${jy1 - 60})`}>
            <circle cx="-34" cy="0" r="16" fill="#2E3236" />
            <circle cx="34" cy="0" r="16" fill="#2E3236" />
            <path d="M-34 0L-10 -26H22L34 0" stroke="#3A4044" strokeWidth="6" fill="none" />
            <path d="M-18 -30h40l6 -10h-34Z" fill="#B23A3A" />
            <path d="M24 -28l10 -20" stroke="#3A4044" strokeWidth="4" />
          </g>
        </g>
        <path d={`M${jx0 + 50} ${jy1}L${jx0 + 120} ${jy1}L${jx0 + 280} ${jy0}L${jx0 + 210} ${jy0}Z`} fill="#fff" opacity={0.1 + 0.05 * malam} />
      </g>
    </g>
  );

  // ---------- dinding belakang: plester atas, panel kayu bawah, menu kapur, lampu tali, rak
  const dindingD = `M${xW(K.X0)} ${yPlafon}H${xW(K.X1)}V${Y0}H${xW(K.X0)}Z M${jx0} ${jy0}V${jy1}H${jx1}V${jy0}Z`;
  const lampuTali = (
    <g data-detail="lampu-tali">
      <path d={`M${xW(-3.4)} ${yW(2.65)}Q${xW(-1.2)} ${yW(2.45)} ${xW(0.9)} ${yW(2.65)}`} stroke="#4A3A30" strokeWidth="1.6" fill="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const u = i / 11;
        const x = xW(-3.4 + 4.3 * u);
        const y = yW(2.65) + Math.sin(u * Math.PI) * 0.2 * PX * 0.45 + 6;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill={mix('#B8A88A', '#FFE7AE', L)} />
            {L > 0 && <circle cx={x} cy={y} r="13" fill="#FFE7AE" opacity={0.25 * L} />}
          </g>
        );
      })}
    </g>
  );
  const menu = (
    <g data-detail="papan-menu">
      <rect x={xW(-1.05)} y={yW(2.35)} width={1.7 * PX} height={0.8 * PX} rx="6" fill="#6E4A36" />
      <rect x={xW(-1.0)} y={yW(2.3)} width={1.6 * PX} height={0.7 * PX} rx="4" fill="#2E3532" />
      <text x={xW(-0.2)} y={yW(2.17)} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill="#F4EEE2">KOPI KITA</text>
      {[['KOPI SUSU', '18'], ['AMERICANO', '15'], ['TEH TARIK', '12'], ['PISANG GORENG', '10']].map(([a, b], i) => (
        <g key={i}>
          <text x={xW(-0.9)} y={yW(2.04 - i * 0.11)} fontFamily="Lato" fontWeight="700" fontSize="14" fill="#E6E0D2">{a}</text>
          <text x={xW(0.5)} y={yW(2.04 - i * 0.11)} textAnchor="end" fontFamily="Lato" fontWeight="700" fontSize="14" fill="#F1C977">{b}</text>
        </g>
      ))}
    </g>
  );
  const rak = (
    <g data-detail="rak-cangkir">
      {[1.6, 1.95].map((h) => (
        <g key={h}>
          <rect x={xW(-3.3)} y={yW(h)} width={1.9 * PX} height="7" fill={kayuGelap} />
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              {i % 2 ? (
                <rect x={xW(-3.2 + i * 0.26)} y={yW(h) - 26} width="20" height="26" rx="3" fill={['#F4EEE2', '#9CB7A8', '#E9C77A'][i % 3]} />
              ) : (
                <path d={`M${xW(-3.2 + i * 0.26)} ${yW(h)}h22l-3 -22h-16Z`} fill={['#E9A08C', '#F4EEE2', '#8EA0B5'][i % 3]} />
              )}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
  const ruang = (
    <g data-detail="ruang">
      <path d={quad([K.X0, K.plafon, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X0, K.plafon, dDekat])} fill={plafon} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${pt(K.X0 + i * 0.6, K.plafon - 0.005, 0)}L${pt(K.X0 + i * 0.6, K.plafon - 0.005, dDekat)}`} stroke={kayuGelap} strokeWidth="2" opacity=".35" />)}
      <path d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} fill={catSisi} />
      <path d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} fill={catSisi} />
      <Terang c={c} n="kanan" d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} />
      <Terang c={c} n="kiri" d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} />
      {/* lantai teraso */}
      <path d={quad([K.X0, 0, 0], [K.X1, 0, 0], [K.X1, 0, dDekat], [K.X0, 0, dDekat])} fill={teraso} />
      {Array.from({ length: 140 }, (_, i) => {
        const a = Math.sin(i * 91.7) * 4375.5,
          b = Math.sin(i * 47.3) * 9123.1;
        const X = K.X0 + (a - Math.floor(a)) * 7,
          d = (b - Math.floor(b)) * 3.4;
        const p = titikKafe(X, 0, d);
        return <ellipse key={i} cx={p.x} cy={p.y} rx={2 + p.s * 1.5} ry={1 + p.s * 0.6} fill={['#9A8E80', '#C08A6A', '#6E7A70'][i % 3]} opacity=".45" />;
      })}
      {Array.from({ length: 8 }, (_, i) => <path key={'g' + i} d={`M${pt(K.X0 + i, 0, 0)}L${pt(K.X0 + i, 0, dDekat)}`} stroke="#000" strokeWidth="1.2" opacity=".08" />)}
      {/* berkas sinar sore dari jendela */}
      {sore > 0.2 && <path d={quad([Jd.X0, 0, 0.05], [Jd.X1, 0, 0.05], [Jd.X1 - 1.4, 0, 2.6], [Jd.X0 - 1.4, 0, 2.6])} fill={c.matahari.warna} opacity={0.16 * sore} />}
      <path d={dindingD} fillRule="evenodd" fill={cat} />
      {/* panel kayu bawah (lambri) */}
      <path d={`M${xW(K.X0)} ${yW(1.0)}H${jx0}V${Y0}H${xW(K.X0)}Z M${jx1} ${yW(1.0)}H${xW(K.X1)}V${Y0}H${jx1}Z M${jx0} ${jy1}H${jx1}V${Y0}H${jx0}Z`} fill={kayuDinding} />
      {Array.from({ length: 28 }, (_, i) => <path key={'l' + i} d={`M${xW(K.X0 + i * 0.25)} ${Math.max(yW(1.0), i * 0.25 + K.X0 > Jd.X0 && i * 0.25 + K.X0 < Jd.X1 ? jy1 : yW(1.0))}V${Y0}`} stroke="#000" strokeWidth="1.2" opacity=".12" />)}
      <rect x={xW(K.X0)} y={yW(1.0) - 4} width={(Jd.X0 - K.X0) * PX} height="6" fill={kayuGelap} />
      <AmbientKaki c={c} x0={xW(K.X0)} x1={xW(K.X1)} y={Y0} tinggi={100} yAtas={yPlafon} id={`${id}-ak`} />
      {menu}
      {rak}
      {lampuTali}
      {/* bingkai foto + papan neon "ngopi dulu" + pot gantung */}
      <g data-detail="hiasan-kafe">
        {[[0.72, 1.95, 0.24, 0.3, '#9CB7A8'], [0.72, 1.55, 0.24, 0.2, '#E9C77A']].map(([X, h, w, hh, c2], i) => (
          <g key={i}>
            <rect x={xW(X as number)} y={yW(h as number)} width={(w as number) * PX} height={(hh as number) * PX} fill="#4A3A30" />
            <rect x={xW((X as number) + 0.02)} y={yW((h as number) - 0.02)} width={((w as number) - 0.04) * PX} height={((hh as number) - 0.04) * PX} fill={c2 as string} />
          </g>
        ))}
        <text x={xW(2.1)} y={yW(2.5)} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontStyle="italic" fontSize="30" fill={mix('#C98E7A', '#FFB4A8', L)}>ngopi dulu</text>
        {L > 0 && <text x={xW(2.1)} y={yW(2.5)} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontStyle="italic" fontSize="30" fill="none" stroke="#FFB4A8" strokeWidth="6" opacity={0.25 * L}>ngopi dulu</text>}
        <path d={`M${xW(3.0)} ${yPlafon}V${yW(2.2)}`} stroke="#4A3A30" strokeWidth="1.5" />
        <path d={`M${xW(3.0) - 18} ${yW(2.2)}h36l-6 24h-24Z`} fill="#C9805A" />
        {[-1, 0, 1].map((k) => <path key={k} d={`M${xW(3.0) + k * 10} ${yW(2.2) + 6}q${k * 14} 30 ${k * 6} 70`} stroke="#6F9C74" strokeWidth="5" fill="none" />)}
      </g>
      {/* kusen jendela */}
      <g data-detail="jendela">
        <rect x={jx0 - 10} y={jy0 - 10} width={jx1 - jx0 + 20} height="10" fill={kayuGelap} />
        <rect x={jx0 - 10} y={jy1} width={jx1 - jx0 + 20} height="12" fill={kayuGelap} />
        <rect x={jx0 - 10} y={jy0} width="10" height={jy1 - jy0} fill={kayuGelap} />
        <rect x={jx1} y={jy0} width="10" height={jy1 - jy0} fill={kayuGelap} />
        <rect x={(jx0 + jx1) / 2 - 4} y={jy0} width="8" height={jy1 - jy0} fill={kayuGelap} />
      </g>
    </g>
  );

  // ---------- benda berdiri
  const lapis: Lapis[] = [];
  // meja bar + mesin espreso (kiri belakang)
  {
    const d = 0.55;
    const a = titikKafe(-3.35, 1.05, d),
      b = titikKafe(-1.45, 0, d),
      m = pxMd(d);
    const atas = quad([-3.35, 1.05, 0.05], [-1.45, 1.05, 0.05], [-1.45, 1.05, d], [-3.35, 1.05, d]);
    const mesin = titikKafe(-2.7, 1.05, 0.3);
    const ms = pxMd(0.3);
    const node = (
      <g data-benda="meja-bar">
        <path d={atas} fill={kayuAtas} />
        <rect x={mesin.x - 0.28 * ms} y={mesin.y - 0.42 * ms} width={0.56 * ms} height={0.42 * ms} rx="8" fill="#C9CED0" />
        <rect x={mesin.x - 0.24 * ms} y={mesin.y - 0.38 * ms} width={0.48 * ms} height={0.1 * ms} fill="#8E9498" />
        {[-0.12, 0.12].map((k) => <rect key={k} x={mesin.x + k * ms - 6} y={mesin.y - 0.2 * ms} width="12" height={0.12 * ms} fill="#3A3F44" />)}
        <rect x={mesin.x + 0.36 * ms} y={mesin.y - 0.5 * ms} width={0.16 * ms} height={0.5 * ms} rx="6" fill="#3A3F44" />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={kayu} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${a.x + ((b.x - a.x) * (i + 1)) / 10} ${a.y + 8}V${b.y - 6}`} stroke="#000" strokeWidth="1.5" opacity=".12" />)}
        <rect x={a.x} y={a.y} width={b.x - a.x} height={0.04 * m} fill={kayuGelap} />
        <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
        <g transform={`translate(${titikKafe(-1.75, 1.05, 0.45).x} ${titikKafe(-1.75, 1.05, 0.45).y})`}><Plant x={0} y={0} s={pxMd(0.45) / 200 * 0.55} kind={0} pot="#E9D7BC" /></g>
      </g>
    );
    lapis.push({ y: b.y, x0: a.x, x1: b.x, node, bay: { kaki: [(a.x + b.x) / 2, b.y], tinggiPx: 1.05 * m, siluet: <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill="#000" />, kuat: 0.3, jarakPx: d * PX } });
  }
  // pot besar di kanan
  {
    const d = 0.35,
      p = titikKafe(3.2, 0, d),
      s = (pxMd(d) / 200) * 1.5;
    const node = <Plant x={p.x} y={p.y} s={s} kind={2} pot="#C9805A" />;
    lapis.push({ y: p.y, x0: p.x - 90 * s, x1: p.x + 90 * s, node, bay: { kaki: [p.x, p.y], tinggiPx: 170 * s, siluet: node, kuat: 0.3, jarakPx: d * PX } });
  }
  // meja bundar kecil + dua bangku di depan jendela (d 1,7, kosong; hanya tampak di shot sangat lebar, zoom ≤ 0,6)
  {
    const d = 1.7,
      p = titikKafe(2.35, 0.75, d),
      g = titikKafe(2.35, 0, d),
      m = pxMd(d);
    const node = (
      <g data-benda="meja-bundar">
        {[-0.38, 0.38].map((k) => {
          const b = titikKafe(2.35 + k, 0.45, d - 0.05),
            bg = titikKafe(2.35 + k, 0, d - 0.05);
          return (
            <g key={k}>
              <path d={`M${b.x - 0.1 * m} ${bg.y}L${b.x - 0.06 * m} ${b.y}M${b.x + 0.1 * m} ${bg.y}L${b.x + 0.06 * m} ${b.y}`} stroke={kayuGelap} strokeWidth="5" />
              <ellipse cx={b.x} cy={b.y} rx={0.15 * m} ry={0.04 * m} fill={kayu} />
            </g>
          );
        })}
        <path d={`M${g.x} ${g.y}V${p.y}`} stroke="#2E2A28" strokeWidth={0.04 * m} />
        <ellipse cx={g.x} cy={g.y} rx={0.2 * m} ry={0.04 * m} fill="#2E2A28" />
        <ellipse cx={p.x} cy={p.y} rx={0.32 * m} ry={0.07 * m} fill={kayuAtas} />
        <ellipse cx={p.x} cy={p.y + 3} rx={0.32 * m} ry={0.07 * m} fill="none" stroke={kayuGelap} strokeWidth="3" />
        <g transform={`translate(${p.x - 0.06 * m} ${p.y})`}><path d={`M-8 0l-2 -24h20l-2 24Z`} fill="#F4ECE0" /><path d="M-9 -18h18" stroke="#B88A62" strokeWidth="5" /></g>
      </g>
    );
    lapis.push({ y: g.y, x0: p.x - 0.6 * m, x1: p.x + 0.6 * m, node, bay: { kaki: [g.x, g.y], tinggiPx: 0.75 * m, siluet: <ellipse cx={p.x} cy={p.y} rx={0.32 * m} ry={0.07 * m} fill="#000" />, kuat: 0.25, jarakPx: d * PX } });
  }
  // papan promo berdiri (A-board) di depan jendela, kanan meja panjang (d 0,6)
  if (promo) {
    const d = 0.6,
      g = titikKafe(1.62, 0, d),
      m = pxMd(d);
    const node = (
      <g data-benda="papan-promo" transform={`translate(${g.x} ${g.y})`}>
        <path d={`M${-0.28 * m} 0L${-0.2 * m} ${-0.95 * m}H${0.2 * m}L${0.28 * m} 0`} stroke="#6E4A36" strokeWidth="6" fill="#2E3532" />
        <text x="0" y={-0.72 * m} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={0.075 * m} fill="#F1C977">PROMO</text>
        <text x="0" y={-0.58 * m} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize={0.055 * m} fill="#F4EEE2">ES KOPI</text>
        <text x="0" y={-0.48 * m} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize={0.055 * m} fill="#F4EEE2">SUSU</text>
        <path d={`M${-0.12 * m} ${-0.36 * m}q${0.12 * m} ${0.05 * m} ${0.24 * m} 0`} stroke="#E9A08C" strokeWidth="3" fill="none" />
      </g>
    );
    lapis.push({ y: g.y, x0: g.x - 0.3 * m, x1: g.x + 0.3 * m, node, bay: { kaki: [g.x, g.y], tinggiPx: 0.95 * m, siluet: <path d={`M${g.x - 0.28 * m} ${g.y}L${g.x - 0.2 * m} ${g.y - 0.95 * m}H${g.x + 0.2 * m}L${g.x + 0.28 * m} ${g.y}Z`} fill="#000" />, kuat: 0.25, jarakPx: d * PX } });
  }
  // sandaran kursi (d 0,3) di belakang tiap tempat duduk
  KURSI_KAFE.forEach((q, i) => {
    const d = 0.3,
      X = [-0.8, 0, 0.8][i];
    const a = titikKafe(X - 0.24, 1.0, d),
      b = titikKafe(X + 0.24, 0.45, d),
      g = titikKafe(X, 0, d);
    const node = (
      <g data-benda="kursi">
        <path d={`M${a.x + 6} ${b.y}V${g.y}M${b.x - 6} ${b.y}V${g.y}`} stroke={kayuGelap} strokeWidth="6" />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx="10" fill={kayuGelap} />
        {[0.3, 0.6].map((k) => <rect key={k} x={a.x + 6} y={a.y + (b.y - a.y) * k} width={b.x - a.x - 12} height="5" fill="#000" opacity=".15" />)}
      </g>
    );
    lapis.push({ y: g.y, x0: a.x, x1: b.x, node });
  });
  // meja panjang + isi meja
  {
    const M = K.meja,
      H = M.tinggi;
    const fA = titikKafe(M.X0, H, M.d1),
      fB = titikKafe(M.X1, 0, M.d1);
    const atas = quad([M.X0, H, M.d0], [M.X1, H, M.d0], [M.X1 + 0.03, H, M.d1 + 0.02], [M.X0 - 0.03, H, M.d1 + 0.02]);
    const lip = 0.04 * pxMd(M.d1);
    const gelasX = [-0.95, -0.3, 0.35, 0.95].slice(0, meja.gelas ?? 0);
    const node = (
      <g data-benda="meja-panjang">
        <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill={kayu} />
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${fA.x + ((fB.x - fA.x) * (i + 1)) / 14} ${fA.y + 6}V${fB.y - 4}`} stroke="#000" strokeWidth="1.6" opacity=".12" />)}
        <Terang c={c} n="depan" kotak={[fA.x, fA.y, fB.x - fA.x, fB.y - fA.y]} />
        <path d={atas} fill={kayuAtas} />
        <Terang c={c} n="atas" d={atas} />
        <rect x={fA.x - 0.03 * pxMd(M.d1)} y={fA.y - lip} width={fB.x - fA.x + 0.06 * pxMd(M.d1)} height={lip} fill={kayuGelap} />
        {gelasX.map((X, i) => {
          const g = titikKafe(X, H, 1.12);
          return <g key={i} transform={`translate(${g.x} ${g.y})`}><EsKopi s={g.s * 0.62} /></g>;
        })}
        {meja.pisang && (() => {
          const p = titikKafe(0.0, H, 1.2),
            s = p.s;
          return (
            <g data-prop="pisang-goreng" transform={`translate(${p.x} ${p.y}) scale(${s})`}>
              <ellipse cx="0" cy="-2" rx="52" ry="10" fill="#F4EEE2" />
              {[-26, 0, 24].map((x, i) => <ellipse key={i} cx={x} cy={-10 - (i % 2) * 4} rx="18" ry="9" fill="#D9A04E" transform={`rotate(${i * 12 - 10} ${x} -10)`} />)}
            </g>
          );
        })()}
        {meja.hp && (() => {
          const a = titikKafe(0.55, H + 0.005, 1.0),
            b = titikKafe(0.68, H + 0.005, 1.22);
          return <path d={`M${a.x} ${a.y}L${b.x} ${a.y}L${b.x + 4} ${b.y}L${a.x - 4} ${b.y}Z`} fill="#2D3532" />;
        })()}
      </g>
    );
    lapis.push({ y: fB.y, x0: fA.x, x1: fB.x, node, bay: { kaki: [(fA.x + fB.x) / 2, fB.y], tinggiPx: H * pxMd(M.d1), siluet: <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill="#000" />, kuat: 0.3, jarakPx: M.d1 * PX } });
  }

  // ---------- isi
  const isiS = isi.map((q, i) => ({ ...q, s: q.s ?? skalaKafe(q.y), k: i }));
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
        {q.polos ? q.gambar({ x: q.x, y: q.y, s: q.s }) : (
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

  // lampu gantung di atas meja (lapisan depan, di atas kepala tokoh duduk)
  const gantung = (
    <g data-detail="lampu-gantung">
      {[-0.85, 0, 0.85].map((X) => {
        const a = titikKafe(X, K.plafon, 1.15),
          b = titikKafe(X, 2.4, 1.15);
        const s = b.s;
        return (
          <g key={X}>
            <path d={`M${a.x} ${a.y}V${b.y}`} stroke="#2E2A28" strokeWidth={2 * s} />
            <path d={`M${b.x - 28 * s} ${b.y + 26 * s}Q${b.x} ${b.y - 6 * s} ${b.x + 28 * s} ${b.y + 26 * s}Z`} fill="#2E3532" />
            <ellipse cx={b.x} cy={b.y + 26 * s} rx={28 * s} ry={5 * s} fill={mix('#8E8470', '#FFE7AE', L)} />
          </g>
        );
      })}
    </g>
  );
  const gelap = malam * 0.8;
  const cahayaMalam = (
    <g pointerEvents="none" data-fx="cahaya-kafe">
      <defs>
        <radialGradient id={`${id}-gl`} cx="540" cy="900" r="1200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141C2A" stopOpacity={0.03 * gelap} />
          <stop offset="0.45" stopColor="#141C2A" stopOpacity={0.14 * gelap} />
          <stop offset="1" stopColor="#141C2A" stopOpacity={0.48 * gelap} />
        </radialGradient>
        <radialGradient id={`${id}-pl`} cx="540" cy={titikKafe(0, 1.8, 1.15).y} r="700" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD68A" stopOpacity={0.32 * L} />
          <stop offset="1" stopColor="#FFC873" stopOpacity="0" />
        </radialGradient>
      </defs>
      {gelap > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-gl)`} />}
      {L > 0 && <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-pl)`} />}
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
      {gantung}
      {cahayaMalam}
      {terangIsi.map((q) => badan(q))}
    </g>
  );
  return (
    <g data-lokasi="kafe-2d">
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
