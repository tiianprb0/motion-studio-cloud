// Sumber lembar contoh yang DISETUJUI pengguna 10 Nov 2026 ("itu outro nya oke menurut ku.. finalin"): varian CTA Outro C
// yang menyebut web Less. (less.benaya.id). Di sini dibuat dengan jenis `seri` + teks supaya bisa dirender dengan v1 (v1 beku,
// dipakai video terkirim). Proyek baru memakai jenis `titip` / `dari` / SERI_WEB dari shared/outro/v2/OutroC.tsx (hasilnya sama
// persis). Bentuk kartu Outro C TIDAK diubah. Latar = frame asli video final (latar-data.ts).
// Render: node tools/render-film.cjs shared/outro/v1/contoh --entry=StoryboardOutroWeb.tsx --storyboard --out=storyboard-web
// Label di bawah (y ≥1690, zona UI platform) hanya keterangan lembar, bukan bagian video.
import React from 'react';
import { P } from '../../../core/v1/core';
import { OutroC, CtaC } from '../OutroC';
import { MAAF_TAHAN, SYARAT_PENONTON } from './latar-data';

export const PHASES = 2;
const TENGAH = 26;
const AKHIR = 65;
const TITIP: CtaC = { kind: 'seri', text: 'Lagi resah soal sesuatu?\nTitip di less.benaya.id' };
const DARI: CtaC = { kind: 'seri', text: 'Dari keresahan Dita.\nTitip punyamu di less.benaya.id' };
const DARI_ANONIM: CtaC = { kind: 'seri', text: 'Dari keresahan seorang penonton.\nTitip punyamu di less.benaya.id' };
const OPEN_MIC: CtaC = { kind: 'seri', text: 'Keresahanmu bisa jadi\nepisode berikutnya: less.benaya.id' };

type View = { bg: string; c: number; cta: CtaC; t1: string; t2: string };
// [awal, akhir] per panel
const PANELS: [string, View, View][] = [
  ['1-titip', { bg: MAAF_TAHAN, c: TENGAH, cta: TITIP, t1: '1 · Varian titip (umum)', t2: 'bergantian dengan ikuti / tanya / seri' }, { bg: MAAF_TAHAN, c: AKHIR, cta: TITIP, t1: '1 · Varian titip (umum)', t2: 'frame terakhir · ekor tetap 3 dtk' }],
  ['2-dari', { bg: MAAF_TAHAN, c: TENGAH, cta: DARI, t1: '2 · Video dari keresahan web', t2: 'nama hanya kalau penanya mengizinkan' }, { bg: MAAF_TAHAN, c: AKHIR, cta: DARI_ANONIM, t1: '2 · Tanpa izin sebut nama', t2: 'tetap terbaca sebagai titipan penonton' }],
  ['3-openmic', { bg: SYARAT_PENONTON, c: TENGAH, cta: OPEN_MIC, t1: '3 · Open Mic', t2: 'kartu saat tepuk tangan' }, { bg: SYARAT_PENONTON, c: AKHIR, cta: OPEN_MIC, t1: '3 · Open Mic', t2: 'frame terakhir' }],
];

export const TOTAL = PANELS.length * 2;
export const OUTRO = 0; // latar sudah membawa watermark aslinya; renderer tidak menambah logo
export const SHOTS: [number, string][] = PANELS.map(([n], i) => [2 * i, n]);
export const shotAt = (f: number) => ({ shot: PANELS[Math.min(PANELS.length - 1, Math.floor(f / 2))][0] });

const Label = ({ t1, t2 }: { t1: string; t2: string }) => (
  <g data-anno="label">
    <rect x="0" y="1690" width="1080" height="230" fill={P.wine} opacity="0.94" />
    <text x="60" y="1782" fontFamily="Lato" fontWeight="900" fontSize="56" fill={P.cream}>{t1}</text>
    <text x="60" y="1860" fontFamily="Lato" fontWeight="700" fontSize="44" fill="#F3DDE1">{t2}</text>
  </g>
);

export const Frame = ({ frame }: { frame: number }) => {
  const [, a, z] = PANELS[Math.floor(frame / 2)];
  const v = frame % 2 ? z : a;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <image href={v.bg} x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" />
      <OutroC f={v.c} cta={v.cta} />
      <Label t1={v.t1} t2={v.t2} />
    </svg>
  );
};
