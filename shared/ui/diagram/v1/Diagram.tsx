// Diagram perbandingan sederhana gaya Kok Bisa? (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1 revisi naskah 1
// (20 korporasi tersangka vs indikasi api di 372 perusahaan; pola kebakaran yang berulang tiap tahun).
//   <GridIkon x y w n kolom tampil sorot sorotWarna label />  n ikon pabrik/kebun kecil dalam grid; `tampil` = berapa yang
//      sudah muncul (animasi isi), `sorot` = berapa ikon pertama yang diberi tanda (mis. tersangka). data-box = kotak grid.
//   <SiklusTahun x y w tahun aktif />  keping tahun berderet dengan ikon api, panah berputar dari ujung ke awal (pola berulang).
// Koordinat layar 1080×1920; jaga di dalam safe zone (kiri ≥ 110, kanan ≤ 920, atas ≥ 220, bawah ≤ 1480).
import React from 'react';
import { P } from '../../../core/v1/core';

const IkonPabrik = ({ x, y, u, warna }: { x: number; y: number; u: number; warna: string }) => (
  <g transform={`translate(${x} ${y}) scale(${u})`}>
    <path d="M-10 8V-2L-4 -6V-2L2 -6V-2L8 -6V8Z" fill={warna} />
    <rect x="4" y="-12" width="3" height="8" fill={warna} />
  </g>
);
const IkonApi = ({ x, y, u }: { x: number; y: number; u: number }) => (
  <g transform={`translate(${x} ${y}) scale(${u})`}>
    <path d="M0 -10C6 -4 8 0 6 5C4 9 -4 9 -6 5C-8 0 -4 -3 -2 -8C-1 -4 1 -3 0 -10Z" fill="#E2572B" />
    <path d="M0 -3C3 0 3 3 2 5C1 7 -2 7 -3 5C-4 2 -1 0 0 -3Z" fill="#FFD66B" />
  </g>
);

export function GridIkon({
  x,
  y,
  w,
  n,
  kolom = 24,
  tampil,
  sorot = 0,
  api = true,
  warna = '#8A8378',
  sorotWarna = '#C24E4E',
  kilat = 0,
}: {
  x: number;
  y: number;
  w: number;
  n: number;
  kolom?: number;
  /** jumlah ikon yang sudah terlihat (bawaan semua) */
  tampil?: number;
  /** ikon yang baru muncul (dalam `kilat` ikon terakhir) berpendar jingga, supaya pertambahan terlihat */
  kilat?: number;
  /** berapa ikon pertama yang diberi tanda (lingkaran merah) */
  sorot?: number;
  api?: boolean;
  warna?: string;
  sorotWarna?: string;
}) {
  const sel = w / kolom;
  const baris = Math.ceil(n / kolom);
  const h = baris * sel;
  const t = Math.min(n, tampil ?? n);
  return (
    <g data-fx="diagram" data-box={`${Math.round(x)},${Math.round(y)},${Math.round(x + w)},${Math.round(y + h)}`}>
      {Array.from({ length: Math.floor(t) }, (_, i) => {
        const cx = x + (i % kolom) * sel + sel / 2,
          cy = y + Math.floor(i / kolom) * sel + sel / 2;
        const ditandai = i < sorot;
        return (
          <g key={i}>
            {ditandai && <circle cx={cx} cy={cy} r={sel * 0.48} fill={sorotWarna} />}
            {!ditandai && kilat > 0 && i >= t - kilat && <circle cx={cx} cy={cy} r={sel * 0.5} fill="#F28A30" opacity={(0.25 + 0.6 * ((i - (t - kilat)) / kilat)).toFixed(3)} />}
            <IkonPabrik x={cx} y={cy + sel * 0.05} u={sel / 28} warna={ditandai ? '#FFF9EF' : warna} />
            {api && !ditandai && <IkonApi x={cx + sel * 0.28} y={cy - sel * 0.22} u={sel / 44} />}
          </g>
        );
      })}
    </g>
  );
}

/** masuk 0..1 (opsional) = keping aktif terakhir meluncur masuk dari kanan; keping yang belum aktif tidak digambar */
export function SiklusTahun({ x, y, w, tahun, aktif, f = 0, masuk }: { x: number; y: number; w: number; tahun: string[]; aktif?: number; f?: number; masuk?: number }) {
  const n = tahun.length;
  const kw = (w - (n - 1) * 24) / n,
    kh = 120;
  const a = aktif ?? n;
  return (
    <g data-fx="diagram" data-box={`${Math.round(x)},${Math.round(y - 70)},${Math.round(x + w)},${Math.round(y + kh + 20)}`}>
      {/* panah berputar dari keping terakhir kembali ke awal */}
      <path d={`M${x + w - kw / 2} ${y - 8}C${x + w - kw / 2} ${y - 64} ${x + kw / 2} ${y - 64} ${x + kw / 2} ${y - 14}`} stroke={P.wine} strokeWidth="7" fill="none" strokeDasharray="18 12" strokeDashoffset={-f * 1.5} opacity={a >= n ? 1 : 0.25} />
      <path d={`M${x + kw / 2 - 16} ${y - 34}L${x + kw / 2} ${y - 8}L${x + kw / 2 + 16} ${y - 34}`} stroke={P.wine} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={a >= n ? 1 : 0.25} />
      {tahun.map((th, i) => {
        const on = i < a;
        if (masuk !== undefined && !on) return null;
        const baru = masuk !== undefined && i === a - 1;
        const m = baru ? Math.max(0, Math.min(1, masuk as number)) : 1;
        const kx = x + i * (kw + 24) + (1 - m * m * (3 - 2 * m)) * 320;
        return (
          <g key={th} opacity={on ? m : 0.35}>
            <rect x={kx + 6} y={y + 10} width={kw} height={kh} rx="16" fill={P.ink} opacity=".15" />
            <rect x={kx} y={y} width={kw} height={kh} rx="16" fill={P.cream} />
            <text x={kx + kw / 2} y={y + 56} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="40" fill={P.ink}>{th}</text>
            <IkonApi x={kx + kw / 2} y={y + 92} u={2.2} />
          </g>
        );
      })}
    </g>
  );
}
