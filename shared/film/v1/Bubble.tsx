// Gelembung bicara gaya Kok Bisa? (keputusan pengguna 7 Nov 2026). Satu-satunya komponen bubble untuk video baru.
// - Oval krem tanpa garis tepi; ekor pendek MELENGKUNG ke kepala/mulut pembicara.
//   Satu penyesuaian dari Kok Bisa?: bayangan sangat lembut (bawaan aktif), karena bubble krem hilang di dinding
//   krem palet Less.; matikan dengan shadow={false} bila latarnya sudah kontras.
// - Huruf Lato Black besar (bawaan 60 px @1080), rata tengah, 1 baris; maksimal 4 kata (seruan/ucapan pendek).
// - Muncul memantul (popIn), tampil singkat; menulis data-box (safe zone + jarak ke subtitle) dan data-words (≤4).
// - data-sfx="pop": tools/render-film.cjs --sfx menaruh efek pop di frame kemunculannya.
// Taruh di samping kepala, bukan di atas wajah. Kalimat panjang dipecah jadi seruan pendek atau masuk narasi.
import React from 'react';
import { P, popIn } from '../../core/v1/core';

const LATO_BLACK_EM = 0.62; // perkiraan lebar rata-rata huruf Lato Black (kapital & kecil campur) per 1 em

export function Bubble({
  f,
  a,
  b,
  x,
  y,
  tip,
  text,
  size = 60,
  fill = P.cream,
  ink = P.ink,
  shadow = true,
  id,
}: {
  f: number;
  /** frame muncul dan hilang */
  a: number;
  b: number;
  /** pusat bubble (koordinat layar/dunia yang sama dengan tip) */
  x: number;
  y: number;
  /** ujung ekor: dekat kepala/mulut pembicara, bukan di atas wajah */
  tip: [number, number];
  text: string;
  size?: number;
  fill?: string;
  ink?: string;
  /** bayangan lembut di bawah bubble supaya terbaca di latar krem */
  shadow?: boolean;
  /** id unik untuk efek suara; bawaan dari teks + frame muncul */
  id?: string;
}) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const w = Math.max(size * 2.6, text.length * size * LATO_BLACK_EM + size * 1.3);
  const h = size * 1.9;
  // Ekor: dua kurva dari tepi bawah oval ke tip, sedikit melengkung ke arah luar.
  const side = tip[0] < x ? -1 : 1;
  const bx = x + side * Math.min(w * 0.22, Math.abs(tip[0] - x)); // pangkal ekor
  const by = y + h * 0.38;
  const half = size * 0.32;
  const mx = (bx + tip[0]) / 2 + side * size * 0.1,
    my = (by + tip[1]) / 2 - size * 0.06;
  const tail = `M${bx - half} ${by} Q${mx - half * 0.4} ${my} ${tip[0]} ${tip[1]} Q${mx + half * 0.6} ${my + half * 0.2} ${bx + half} ${by} Z`;
  const words = text.trim().split(/\s+/).length;
  const L = Math.round(Math.min(x - w / 2, tip[0])),
    T = Math.round(Math.min(y - h / 2, tip[1])),
    R = Math.round(Math.max(x + w / 2, tip[0])),
    B = Math.round(Math.max(y + h / 2, tip[1]));
  return (
    <g opacity={o} data-fx="gelembung" data-box={`${L},${T},${R},${B}`} data-words={words} data-sfx="pop" data-sfx-id={id ?? `bubble-${a}-${text}`}>
      <g transform={`translate(${tip[0]} ${tip[1]}) scale(${s}) translate(${-tip[0]} ${-tip[1]})`}>
        {shadow && (
          <g opacity="0.13" transform={`translate(0 ${size * 0.12})`}>
            <path d={tail} fill={P.ink} />
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.5} ry={h * 0.5} fill={P.ink} />
          </g>
        )}
        <path d={tail} fill={fill} />
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.5} ry={h * 0.5} fill={fill} />
        <text x={x} y={y + size * 0.35} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={ink}>
          {text}
        </text>
      </g>
    </g>
  );
}
