// Properti bersama: benda jalan kampung (v1, 10 Nov 2026; dibuat untuk "Kritik Bukan Utang Jasa" v2).
// Gaya flat pastel Less., tanpa garis tepi tebal. Satuan RIG: tokoh dewasa 330 = 1,65 m (1 satuan = 0,5 cm).
// Benda berdiri: alas di (0,0), skala s = skala tokoh di garis lantai yang sama.
// Benda genggam: titik genggam di (0,0) untuk holdRight/holdLeft rig.
//   Sepeda       sepeda kota (jengki) tampak samping, keranjang depan, boncengan, standar samping. Panjang ±340 (1,7 m).
//   Kerucut      kerucut lalu lintas oranye dengan dua pita reflektor. Tinggi 140 (0,7 m).
//   KantongSampah kantong plastik hitam terikat, untuk pose angkatGalon (alas di y 0 → taruh di y -140 tangan).
//   GerobakSampah gerobak sampah kampung (tampak samping), muatan kantong. Panjang ±330.
//   Kertas       lembar surat/rincian di tangan (genggam di sudut bawah), judul pendek.
//   Mesin gilas  `MesinGilas`: ikon kecil mesin gilas aspal untuk metafora (bukan benda di dunia).
import React from 'react';
import { P } from '../../../core/v1/core';

export const Sepeda = ({ s = 1, warna = '#3E7F6A', keranjang = true, dir = 1 }: { s?: number; warna?: string; keranjang?: boolean; dir?: number }) => {
  const R = 66; // jari-jari roda (0,66 m)
  const bx = -105, fx = 105; // poros roda belakang/depan
  const y = -R;
  const crank: [number, number] = [-8, -60];
  const seat: [number, number] = [-40, -200];
  const head: [number, number] = [78, -212];
  const roda = (cx: number) => (
    <g>
      <circle cx={cx} cy={y} r={R} fill="none" stroke="#2F3532" strokeWidth="9" />
      <circle cx={cx} cy={y} r={R - 6} fill="none" stroke="#9BA3A0" strokeWidth="2.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${cx} ${y}L${cx + Math.cos(a) * (R - 7)} ${y + Math.sin(a) * (R - 7)}`} stroke="#B9BFBC" strokeWidth="1.2" />;
      })}
      <circle cx={cx} cy={y} r="7" fill="#7D8582" />
    </g>
  );
  return (
    <g transform={`scale(${s * dir} ${s})`} data-prop="sepeda">
      <ellipse cx="0" cy="2" rx="190" ry="12" fill={P.ink} opacity=".14" />
      {roda(bx)}
      {roda(fx)}
      {/* spakbor */}
      <path d={`M${bx - R - 4} ${y}A${R + 6} ${R + 6} 0 0 1 ${bx + 30} ${y - R + 2}`} fill="none" stroke={warna} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${fx - 32} ${y - R + 2}A${R + 6} ${R + 6} 0 0 1 ${fx + R + 2} ${y - 6}`} fill="none" stroke={warna} strokeWidth="7" strokeLinecap="round" />
      {/* rangka jengki: dua pipa melengkung dari kepala ke poros belakang */}
      <path d={`M${head[0]} ${head[1] + 30}C20 -120 -40 -70 ${crank[0]} ${crank[1]}`} fill="none" stroke={warna} strokeWidth="11" strokeLinecap="round" />
      <path d={`M${head[0]} ${head[1] + 18}C10 -150 -70 -150 ${bx} ${y}`} fill="none" stroke={warna} strokeWidth="9" strokeLinecap="round" />
      <path d={`M${seat[0]} ${seat[1] + 12}L${crank[0]} ${crank[1]}M${crank[0]} ${crank[1]}L${bx} ${y}M${seat[0] + 4} ${seat[1] + 30}L${bx} ${y}`} stroke={warna} strokeWidth="8" strokeLinecap="round" />
      <path d={`M${head[0]} ${head[1]}L${fx} ${y}`} stroke="#59615E" strokeWidth="8" strokeLinecap="round" />
      {/* boncengan */}
      <path d={`M${seat[0] - 10} ${seat[1] + 34}H${bx - 30}M${bx - 26} ${seat[1] + 34}L${bx} ${y}`} stroke="#59615E" strokeWidth="5" strokeLinecap="round" />
      {/* sadel + tiang */}
      <path d={`M${seat[0]} ${seat[1]}v20`} stroke="#59615E" strokeWidth="6" />
      <path d={`M${seat[0] - 30} ${seat[1] - 6}q30 -14 52 0q-2 12 -24 12q-24 0 -28 -12Z`} fill="#3B3430" />
      {/* setang */}
      <path d={`M${head[0]} ${head[1]}v-14q0 -10 -26 -14`} fill="none" stroke="#59615E" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${head[0] - 34} ${head[1] - 30}h18`} stroke="#3B3430" strokeWidth="10" strokeLinecap="round" />
      {/* keranjang depan */}
      {keranjang && (
        <g>
          <path d={`M${head[0] + 6} ${head[1] - 8}h70l-8 58h-56Z`} fill="#C9A66B" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${head[0] + 10} ${head[1] + 4 + i * 13}h62`} stroke="#A9834A" strokeWidth="2.5" />)}
          {[0, 1, 2, 3, 4].map((i) => <path key={'v' + i} d={`M${head[0] + 14 + i * 14} ${head[1] - 8}v58`} stroke="#A9834A" strokeWidth="2" opacity=".7" />)}
        </g>
      )}
      {/* gir + pedal + rantai */}
      <circle cx={crank[0]} cy={crank[1]} r="16" fill="none" stroke="#59615E" strokeWidth="5" />
      <path d={`M${crank[0]} ${crank[1] - 16}L${bx} ${y - 6}M${crank[0]} ${crank[1] + 16}L${bx} ${y + 6}`} stroke="#3B3430" strokeWidth="2.5" />
      <path d={`M${crank[0]} ${crank[1]}l20 26`} stroke="#59615E" strokeWidth="6" strokeLinecap="round" />
      <rect x={crank[0] + 12} y={crank[1] + 24} width="22" height="7" rx="2" fill="#3B3430" />
      {/* standar samping */}
      <path d={`M${bx + 40} ${y + 10}l-26 ${R - 12}`} stroke="#59615E" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
};

export const Kerucut = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="kerucut">
    <ellipse cx="0" cy="2" rx="62" ry="10" fill={P.ink} opacity=".16" />
    <path d="M-44 0h88l-6 -14h-76Z" fill="#C8572A" />
    <path d="M-34 -14L-10 -136h20L34 -14Z" fill="#E8743B" />
    <path d="M-29 -40h58l-4 -20h-50Z" fill="#F7F3EA" />
    <path d="M-20 -86h40l-3 -16h-34Z" fill="#F7F3EA" />
    <path d="M6 -134l20 120h8L10 -136Z" fill="#000" opacity=".12" />
    <path d="M-8 -130l-18 110" stroke="#fff" strokeWidth="4" opacity=".25" strokeLinecap="round" />
  </g>
);

export const KantongSampah = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="kantong-sampah">
    <path d="M-34 0q-12 -38 6 -62q10 -10 28 -10q18 0 28 10q18 24 6 62Z" fill="#2E3331" />
    <path d="M-10 -72q10 -12 20 0l-4 8q-6 -4 -12 0Z" fill="#2E3331" />
    <path d="M-6 -78q-10 -16 -18 -10M6 -78q10 -16 18 -10" stroke="#2E3331" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M-20 -50q-6 18 0 40" stroke="#fff" strokeWidth="4" opacity=".14" fill="none" strokeLinecap="round" />
    <path d="M8 -58l12 20M-2 -30l18 6" stroke="#000" strokeWidth="2" opacity=".25" />
  </g>
);

export const GerobakSampah = ({ s = 1, warna = '#D9A441', dir = 1 }: { s?: number; warna?: string; dir?: number }) => (
  <g transform={`scale(${s * dir} ${s})`} data-prop="gerobak-sampah">
    <ellipse cx="0" cy="2" rx="190" ry="12" fill={P.ink} opacity=".15" />
    {/* muatan */}
    {[[-110, -232, '#2E3331'], [-40, -246, '#5E7F96'], [30, -236, '#2E3331'], [95, -228, '#E8E2D4'], [-70, -262, '#8B9A86']].map(([x, y, c], i) => (
      <ellipse key={i} cx={x as number} cy={y as number} rx="52" ry="36" fill={c as string} />
    ))}
    {/* bak */}
    <path d="M-160 -220h300l-14 150h-272Z" fill={warna} />
    <path d="M-160 -220h300v16h-300Z" fill="#000" opacity=".12" />
    {[-110, -50, 10, 70].map((x) => <path key={x} d={`M${x} -204v128`} stroke="#000" strokeWidth="4" opacity=".1" />)}
    <text x="-10" y="-130" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.cream} letterSpacing="1">KEBERSIHAN</text>
    {/* pegangan */}
    <path d="M136 -190l90 -30" stroke="#59615E" strokeWidth="9" strokeLinecap="round" />
    {/* roda */}
    <circle cx="-30" cy="-50" r="50" fill="#2F3532" />
    <circle cx="-30" cy="-50" r="22" fill="#9BA3A0" />
    <path d="M110 -70v66" stroke="#59615E" strokeWidth="8" strokeLinecap="round" />
  </g>
);

/** Lembar surat/rincian. Genggam di sudut kanan bawah (0,0); kertas naik ke kiri atas. */
export const Kertas = ({ s = 1, judul = 'RINCIAN', rot = -8, warnaJudul = P.wine }: { s?: number; judul?: string; rot?: number; warnaJudul?: string }) => (
  <g transform={`rotate(${rot}) scale(${s})`} data-prop="kertas">
    <rect x="-62" y="-92" width="74" height="98" rx="3" fill="#000" opacity=".12" transform="translate(4 4)" />
    <rect x="-62" y="-92" width="74" height="98" rx="3" fill="#FFFDF7" />
    <rect x="-56" y="-84" width="62" height="12" rx="2" fill={warnaJudul} />
    <text x="-25" y="-75" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="8.5" fill={P.cream}>{judul}</text>
    {[-60, -50, -40, -30, -20].map((y, i) => (
      <g key={y} opacity=".5">
        <path d={`M-54 ${y}h${22 + (i % 2) * 8}`} stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
        <path d={`M-10 ${y}h12`} stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
      </g>
    ))}
    <path d="M-54 -8h56" stroke={P.ink} strokeWidth="1.5" opacity=".4" />
  </g>
);

/** Ikon mesin gilas aspal (metafora, untuk Inset/diagram). Alas di (0,0), panjang ±300·s. */
export const MesinGilas = ({ s = 1, warna = '#E1A93B' }: { s?: number; warna?: string }) => (
  <g transform={`scale(${s})`} data-prop="mesin-gilas">
    <ellipse cx="0" cy="4" rx="170" ry="12" fill={P.ink} opacity=".15" />
    <rect x="-150" y="-130" width="210" height="80" rx="10" fill={warna} />
    <rect x="-40" y="-230" width="110" height="110" rx="8" fill={warna} />
    <rect x="-28" y="-216" width="84" height="56" rx="6" fill="#BFD7DD" />
    <path d="M-50 -236h130" stroke="#59615E" strokeWidth="10" strokeLinecap="round" />
    <rect x="-180" y="-110" width="120" height="110" rx="55" fill="#59615E" />
    <rect x="-172" y="-102" width="104" height="94" rx="47" fill="#7D8582" />
    <circle cx="80" cy="-45" r="45" fill="#2F3532" />
    <circle cx="80" cy="-45" r="18" fill="#9BA3A0" />
  </g>
);
