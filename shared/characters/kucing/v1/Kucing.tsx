// Kucing oranye callback (v1, 7 Nov 2026). Arahan pengguna: "kucingnya kucing orange, dan bisa buat detail? dan bergerak".
// Muncul kecil di latar hampir setiap video Less., tidak pernah dijelaskan dan tidak disebut narasi.
// STATUS: DISETUJUI pengguna 7 Nov 2026 ("Setuju") setelah lembar contoh + bukti gerak (contoh/). Siap dipakai di video.
//
// Identitas (jangan diubah tanpa persetujuan): kucing oranye belang gaya flat pastel Less., moncong dan dada krem,
// mata hijau sage, KALUNG WINE dengan liontin emas (warna brand). Pose: 'duduk' (3/4 menghadap kamera), 'tidur'
// (meringkuk), 'jalan' (profil samping).
// Gerak bawaan (dari frame f, deterministik): napas, kedip acak (kadang dua kali), telinga berkedut, ekor mengayun;
// 'jalan' punya siklus kaki ±0,8 dtk + badan naik-turun. Posisi x untuk 'jalan' digerakkan pemanggil (mis. ramp()).
// Skala: s = skala tokoh di garis lantai yang sama (duduk ±60 satuan ≈ 18% tinggi orang 330 satuan).
// Satu kucing per shot; kecil di latar, tidak menutupi tokoh/subtitle. Lokasi lama yang menggambar kucing lain
// (kota-malam v1 abu, rumah-kenangan v1 krem, taman-sore v1 hitam): jangan tambah kucing kedua di shot yang sama.
import React from 'react';
import { P } from '../../../core/v1/core';

export const KUCING = {
  fur: '#E9A15A',
  light: '#F6C48A',
  shade: '#C67A3B',
  stripe: '#BC6A2E',
  cream: '#FCE9CF',
  pink: '#E8968A',
  eye: '#93B06F',
  whisker: '#7A4A26',
  collar: P.wine,
  tag: P.gold,
};
const C = KUCING;
const K = 0.3; // satuan gambar → satuan rig (duduk ±200 → ±60)

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** 0 = mata terbuka … 1 = tertutup. Kedip tiap ±3,2 dtk dengan jeda acak, kadang dua kali. */
export const kedip = (f: number, seed = 0) => {
  const W = 96;
  const k = Math.floor((f + seed * 37) / W);
  const t = (f + seed * 37) - k * W;
  const o = 8 + Math.floor(rnd(k + seed * 13) * 70);
  const tri = (d: number) => (d < 0 || d > 5 ? 0 : 1 - Math.abs(d - 2.5) / 2.5);
  const twice = rnd(k * 3 + seed) > 0.7;
  return Math.max(tri(t - o), twice ? tri(t - o - 9) : 0);
};
/** sudut kedutan telinga (derajat), sesekali. */
const kedut = (f: number, seed = 0) => {
  const W = 140;
  const k = Math.floor((f + seed * 53) / W);
  const t = (f + seed * 53) - k * W;
  const o = 20 + Math.floor(rnd(k * 7 + seed) * 90);
  const d = t - o;
  return d < 0 || d > 8 ? 0 : 16 * Math.sin((d / 8) * Math.PI);
};

type Props = {
  x: number;
  y: number;
  /** skala tokoh di garis lantai yang sama */
  s?: number;
  /** 1 = menghadap kanan, -1 = kiri */
  dir?: 1 | -1;
  f?: number;
  pose?: 'duduk' | 'tidur' | 'jalan';
  /** arah lirikan pupil (-1 kiri … 1 kanan), hanya 'duduk' */
  gaze?: number;
  seed?: number;
  id?: string;
};

const Grad = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={`${id}-bulu`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={C.light} />
      <stop offset="0.45" stopColor={C.fur} />
      <stop offset="1" stopColor={C.shade} />
    </linearGradient>
    <linearGradient id={`${id}-kepala`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={C.light} />
      <stop offset="0.7" stopColor={C.fur} />
      <stop offset="1" stopColor={C.shade} />
    </linearGradient>
  </defs>
);

/** Mata almond dengan pupil vertikal dan kilau; menutup jadi garis lengkung saat kedip. */
const Mata = ({ cx, cy, rx, ry, close, gx = 0 }: { cx: number; cy: number; rx: number; ry: number; close: number; gx?: number }) => {
  if (close > 0.6) return <path d={`M${cx - rx} ${cy}q${rx} ${ry * 0.55} ${2 * rx} 0`} stroke={P.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
  const k = 1 - close;
  return (
    <g transform={`translate(${cx} ${cy}) scale(1 ${k}) translate(${-cx} ${-cy})`}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.eye} />
      <ellipse cx={cx + gx * rx * 0.35} cy={cy} rx={rx * 0.3} ry={ry * 0.78} fill={P.ink} />
      <circle cx={cx + gx * rx * 0.35 + rx * 0.28} cy={cy - ry * 0.38} r={Math.max(1.4, rx * 0.24)} fill={P.cream} />
      <path d={`M${cx - rx} ${cy - ry * 0.2}q${rx} ${-ry * 1.15} ${2 * rx} 0`} stroke={C.shade} strokeWidth="2" fill="none" opacity="0.7" />
    </g>
  );
};

const Kumis = ({ x, y, side }: { x: number; y: number; side: 1 | -1 }) => (
  <g stroke={C.whisker} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" fill="none">
    <path d={`M${x} ${y}q${14 * side} -6 ${30 * side} -7`} />
    <path d={`M${x} ${y + 3}q${15 * side} 0 ${32 * side} 1`} />
    <path d={`M${x} ${y + 6}q${14 * side} 5 ${28 * side} 9`} />
  </g>
);

// ------------------------------------------------------------------ DUDUK (3/4, menghadap kanan)
const Duduk = ({ f, gaze, seed, id }: { f: number; gaze: number; seed: number; id: string }) => {
  const sway = Math.sin(f * 0.09 + seed);
  const flick = Math.max(0, Math.sin(f * 0.05 + seed * 2)) ** 6; // sesekali ujung ekor naik
  const tipY = -6 - 10 * flick - 3 * sway;
  const tipX = 44 + 6 * sway;
  const tail = `M-58 -14Q-74 4 -30 2Q10 1 ${tipX - 14} ${-2 - 2 * flick}Q${tipX} ${-2} ${tipX} ${tipY}`;
  const ear = kedut(f, seed);
  const close = kedip(f, seed);
  const tilt = 2.5 * Math.sin(f * 0.031 + seed);
  return (
    <g>
      {/* kaki depan yang jauh */}
      <rect x="4" y="-66" width="14" height="66" rx="7" fill={C.shade} />
      <ellipse cx="11" cy="-3" rx="9" ry="5" fill="#EBCFAE" />
      {/* badan + paha belakang */}
      <path d="M-64 0C-76 -52 -62 -104 -20 -116C6 -122 24 -112 30 -96C38 -70 36 -30 32 0Z" fill={`url(#${id}-bulu)`} />
      <ellipse cx="-30" cy="-34" rx="38" ry="33" fill={C.fur} />
      <path d="M-66 -34q4 -30 34 -34" stroke={C.light} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M-62 -10q26 10 62 2" stroke={C.shade} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* belang punggung */}
      <g stroke={C.stripe} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M-52 -84q10 -12 22 -14" />
        <path d="M-60 -62q12 -10 26 -10" />
        <path d="M-62 -40q10 -6 22 -4" />
      </g>
      {/* dada krem */}
      <path d="M6 -106C30 -98 34 -52 24 -18C14 -40 6 -72 6 -106Z" fill={C.cream} />
      {/* ekor melingkar di depan kaki (di bawah kaki depan yang dekat) */}
      <path d={tail} stroke={C.fur} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={tail} stroke={C.stripe} strokeWidth="14" fill="none" strokeDasharray="4 17" strokeDashoffset="6" opacity="0.65" />
      {/* kaki depan yang dekat */}
      <rect x="17" y="-62" width="15" height="62" rx="7.5" fill={C.fur} />
      <ellipse cx="25" cy="-3" rx="10" ry="5.5" fill={C.cream} />
      <path d="M21 -3v-3M26 -3v-3" stroke={C.shade} strokeWidth="1.3" />
      {/* kalung */}
      <path d="M-6 -113Q14 -99 36 -112" stroke={C.collar} strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="-100" r="5" fill={C.tag} />
      <circle cx="14.5" cy="-101.5" r="1.6" fill={P.cream} opacity="0.8" />
      {/* kepala */}
      <g transform={`translate(18 -148) rotate(${tilt})`}>
        <g transform={`rotate(${-ear * 0.4} -20 -30)`}>
          <path d="M-34 -16L-26 -60L-4 -30Z" fill={C.fur} />
          <path d="M-27 -24L-23 -48L-11 -30Z" fill={C.pink} />
        </g>
        <g transform={`rotate(${ear} 30 -30)`}>
          <path d="M12 -32L36 -62L44 -18Z" fill={C.fur} />
          <path d="M20 -30L34 -50L38 -24Z" fill={C.pink} />
        </g>
        <path d="M-40 6Q-46 -36 4 -38Q52 -38 50 4Q48 34 6 36Q-36 34 -40 6Z" fill={`url(#${id}-kepala)`} />
        {/* belang dahi "M" */}
        <g stroke={C.stripe} strokeWidth="4" strokeLinecap="round" opacity="0.8">
          <path d="M-6 -34l2 12" />
          <path d="M6 -36v13" />
          <path d="M18 -34l-2 12" />
        </g>
        <Mata cx={-8} cy={-4} rx={7} ry={9} close={close} gx={gaze} />
        <Mata cx={28} cy={-4} rx={8} ry={10} close={close} gx={gaze} />
        <ellipse cx="19" cy="14" rx="17" ry="11" fill={C.cream} />
        <ellipse cx="17" cy="25" rx="10" ry="6" fill={C.cream} />
        <path d="M15 6L23 6L19 11Z" fill={C.pink} />
        <path d="M19 11q-3 5 -7 3M19 11q3 5 7 3" stroke={P.ink} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Kumis x={30} y={13} side={1} />
        <Kumis x={6} y={13} side={-1} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ TIDUR (meringkuk, kepala di kanan)
const Tidur = ({ f, seed, id }: { f: number; seed: number; id: string }) => {
  const b = Math.sin(f * 0.08 + seed);
  const ear = kedut(f, seed);
  const tip = Math.max(0, Math.sin(f * 0.04 + seed)) ** 8;
  const tail = `M-84 -18Q-92 6 -30 6Q20 6 ${48 + 4 * tip} ${-4 - 8 * tip}`;
  return (
    <g>
      <g transform={`translate(0 0) scale(1 ${1 + 0.035 * b})`}>
        <ellipse cx="-8" cy="-36" rx="82" ry="38" fill={`url(#${id}-bulu)`} />
        <path d="M-80 -44q30 -36 90 -30" stroke={C.light} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
        <g stroke={C.stripe} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M-62 -52q4 10 2 20" />
          <path d="M-40 -60q4 12 2 22" />
          <path d="M-16 -62q4 12 2 22" />
          <path d="M8 -60q3 10 1 18" />
        </g>
      </g>
      <path d={tail} stroke={C.fur} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d={tail} stroke={C.stripe} strokeWidth="15" fill="none" strokeDasharray="4 18" strokeDashoffset="8" opacity="0.65" />
      <ellipse cx="66" cy="-7" rx="13" ry="7" fill={C.cream} />
      <path d="M30 -46Q40 -30 46 -16" stroke={C.collar} strokeWidth="6" fill="none" strokeLinecap="round" />
      <g transform={`translate(58 ${-30 + 0.8 * b})`}>
        <g transform={`rotate(${-ear * 0.5} -10 -20)`}>
          <path d="M-26 -14L-18 -48L0 -22Z" fill={C.fur} />
          <path d="M-19 -20L-15 -38L-6 -22Z" fill={C.pink} />
        </g>
        <path d="M8 -24L28 -46L32 -12Z" fill={C.fur} />
        <path d="M14 -22L26 -38L28 -16Z" fill={C.pink} />
        <ellipse cx="2" cy="0" rx="34" ry="27" fill={`url(#${id}-kepala)`} />
        <g stroke={C.stripe} strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
          <path d="M-8 -24l1 9" />
          <path d="M2 -26v10" />
          <path d="M12 -24l-1 9" />
        </g>
        <path d="M-14 -2q6 4 12 0M10 -2q6 4 12 0" stroke={P.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="12" cy="12" rx="14" ry="9" fill={C.cream} />
        <path d="M9 6L15 6L12 10Z" fill={C.pink} />
        <Kumis x={22} y={12} side={1} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ JALAN (profil, menghadap kanan)
const Jalan = ({ f, seed, id }: { f: number; seed: number; id: string }) => {
  const p = f * 0.26 + seed;
  const bob = 2.5 * Math.abs(Math.sin(p));
  const leg = (hx: number, ph: number, near: boolean) => {
    const sw = 13 * Math.sin(p + ph);
    const lift = 7 * Math.max(0, Math.cos(p + ph));
    const kx = hx + sw * 0.4 + (near ? 2 : 0);
    return (
      <g key={hx + ph}>
        <path d={`M${hx} -58Q${kx} -28 ${hx + sw} ${-lift}`} stroke={near ? C.fur : C.shade} strokeWidth="13" fill="none" strokeLinecap="round" />
        <ellipse cx={hx + sw + 3} cy={-lift - 1} rx="8" ry="5" fill={near ? C.cream : '#EBCFAE'} />
      </g>
    );
  };
  const tsw = Math.sin(f * 0.12 + seed);
  const tail = `M-58 -72Q-92 -86 -88 -${120 + 4 * tsw}Q-86 -${136 + 3 * tsw} ${-74 + 8 * tsw} -142`;
  const close = kedip(f, seed);
  const ear = kedut(f, seed);
  return (
    <g>
      {leg(-40, Math.PI, false)}
      {leg(38, 0, false)}
      <g transform={`translate(0 ${-bob})`}>
        <path d={tail} stroke={C.fur} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={tail} stroke={C.stripe} strokeWidth="14" fill="none" strokeDasharray="4 15" opacity="0.65" />
        <ellipse cx="0" cy="-66" rx="64" ry="27" fill={`url(#${id}-bulu)`} />
        <ellipse cx="6" cy="-50" rx="44" ry="10" fill={C.cream} opacity="0.85" />
        <g stroke={C.stripe} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M-36 -90q4 10 2 18" />
          <path d="M-14 -93q4 10 2 18" />
          <path d="M8 -92q4 10 2 17" />
        </g>
        <path d="M44 -88Q50 -74 56 -64" stroke={C.collar} strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="56" cy="-60" r="4" fill={C.tag} />
        <g transform={`translate(70 -96) rotate(${2 * Math.sin(p * 2)})`}>
          <g transform={`rotate(${ear} -6 -22)`}>
            <path d="M-16 -16L-10 -46L6 -22Z" fill={C.fur} />
            <path d="M-10 -20L-7 -38L1 -22Z" fill={C.pink} />
          </g>
          <path d="M4 -20L16 -44L22 -14Z" fill={C.shade} />
          <ellipse cx="0" cy="0" rx="28" ry="24" fill={`url(#${id}-kepala)`} />
          <path d="M14 -2Q32 -2 34 8Q30 18 14 16Z" fill={C.cream} />
          <path d="M31 2l4 0l-2 4Z" fill={C.pink} />
          <Mata cx={12} cy={-6} rx={5.5} ry={8} close={close} gx={0.6} />
          <g stroke={C.stripe} strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
            <path d="M-8 -20l2 9" />
            <path d="M2 -22l1 9" />
          </g>
          <Kumis x={28} y={10} side={1} />
        </g>
      </g>
      {leg(-34, 0, true)}
      {leg(44, Math.PI, true)}
    </g>
  );
};

export const Kucing = ({ x, y, s = 1, dir = 1, f = 0, pose = 'duduk', gaze = 0, seed = 0, id = 'kucing' }: Props) => {
  const breath = pose === 'duduk' ? 1 + 0.012 * Math.sin(f * 0.12 + seed) : 1;
  const w = pose === 'tidur' ? 96 : pose === 'jalan' ? 74 : 80;
  return (
    <g data-callback="kucing" data-pose={pose} transform={`translate(${x} ${y}) scale(${s * K * dir} ${s * K})`}>
      <Grad id={id} />
      <ellipse cx={pose === 'tidur' ? -4 : 0} cy="2" rx={w} ry="10" fill={P.ink} opacity="0.13" />
      <g transform={`scale(1 ${breath})`}>
        {pose === 'duduk' && <Duduk f={f} gaze={gaze} seed={seed} id={id} />}
        {pose === 'tidur' && <Tidur f={f} seed={seed} id={id} />}
        {pose === 'jalan' && <Jalan f={f} seed={seed} id={id} />}
      </g>
    </g>
  );
};
