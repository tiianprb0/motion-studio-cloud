// Storyboard Outro C (7 Nov 2026, disetujui pengguna). Latar = frame asli video final (latar-data.ts).
// Render: node tools/render-film.cjs shared/outro/v1/contoh --entry=StoryboardOutroC.tsx --storyboard --out=storyboard
// Audit:  node tools/render-film.cjs shared/outro/v1/contoh --entry=StoryboardOutroC.tsx --audit=1
// Label di bawah (y ≥1690, zona UI platform) hanya keterangan lembar, bukan bagian video.
import React from 'react';
import { P } from '../../../core/v1/core';
import { OutroB } from '../../../characters/rig/v2/OutroOptions';
import { OutroC, CtaC } from '../OutroC';
import { MAAF_KATA_TERAKHIR, MAAF_TAHAN, SYARAT_KATA_TERAKHIR, SYARAT_PENONTON } from './latar-data';

export const PHASES = 2;
const END = 65;
const TANYA: CtaC = { kind: 'tanya', text: 'Kamu tipe yang bilang,\natau yang nunjukin?' };
const SERI: CtaC = { kind: 'seri', text: 'Ikuti seri Open Mic.' };

type View = { bg?: string; c?: number; cta?: CtaC; place?: 'atas' | 'bawah'; b?: boolean; t1: string; t2: string };
// [awal, akhir] per panel
const PANELS: [string, View, View][] = [
  ['1-tahan', { bg: MAAF_KATA_TERAKHIR, t1: '1 · Kata terakhir selesai', t2: 'detik 0,0 · adegan & subtitle tetap' }, { bg: MAAF_TAHAN, c: 5, t1: '1 · Adegan ditahan 0,8 dtk', t2: 'detik 0,8 · subtitle hilang, kartu muncul' }],
  ['2-naik', { bg: MAAF_TAHAN, c: 10, t1: '2 · Kartu di area subtitle', t2: 'detik 1,1 · tokoh tetap terlihat utuh' }, { bg: MAAF_TAHAN, c: 26, t1: '2 · Wordmark, garis emas, CTA', t2: 'detik 1,7 · tombol + ikon masuk' }],
  ['3-ikuti', { bg: MAAF_TAHAN, c: 40, t1: '3 · Tombol ditekan', t2: 'detik 2,1 · efek klik' }, { bg: MAAF_TAHAN, c: END, t1: '3 · Frame terakhir', t2: 'detik 3,0 · video selesai' }],
  ['4-tanya', { bg: MAAF_TAHAN, c: 26, cta: TANYA, t1: 'Varian · pertanyaan topik', t2: 'sama dengan kalimat penutup narasi' }, { bg: MAAF_TAHAN, c: END, cta: TANYA, t1: 'Varian · pertanyaan topik', t2: 'frame terakhir' }],
  ['5-openmic', { bg: SYARAT_KATA_TERAKHIR, t1: 'Open Mic · kata terakhir', t2: '"Kopi saya sudah dingin."' }, { bg: SYARAT_PENONTON, c: END, cta: SERI, t1: 'Open Mic · kartu saat tepuk tangan', t2: 'tepuk tangan tidak jadi waktu mati' }],
  ['6-banding', { b: true, t1: 'SEKARANG · Outro B', t2: 'ekor 5,0–8,5 dtk, layar gelap' }, { bg: MAAF_TAHAN, c: END, t1: 'USULAN · Outro C', t2: 'ekor 3,0 dtk, adegan tetap' }],
  ['7-posisi', { bg: MAAF_TAHAN, c: END, t1: 'Posisi bawaan · atas', t2: 'di tempat subtitle, tokoh terlihat' }, { bg: MAAF_TAHAN, c: END, place: 'bawah', t1: 'Pilihan · bawah', t2: 'untuk adegan yang atasnya ramai' }],
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
      {v.b ? <OutroB f={104} /> : <image href={v.bg} x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" />}
      {v.c !== undefined && <OutroC f={v.c} cta={v.cta} place={v.place} />}
      <Label t1={v.t1} t2={v.t2} />
    </svg>
  );
};
