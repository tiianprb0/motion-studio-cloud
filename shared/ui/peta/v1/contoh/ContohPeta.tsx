// Lembar contoh peta v1 (18 Nov 2026): atas = Indonesia (enam provinsi prioritas + Papua berasap tanpa tanda);
// kiri bawah = Indonesia timur (asap Papua Selatan ke Maluku, pin Merauke); kanan bawah = Papua Selatan (pin Merauke).
// Render: node tools/render-thumb.cjs shared/ui/peta/v1/contoh/ContohPeta.tsx shared/ui/peta/v1/contoh/ContohPeta --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { PetaIndonesia, PANDANG } from '../PetaIndonesia';

const SOROT = [
  { lon: 101.5, lat: 0.4, teks: 'RIAU', muncul: 1, tanda: '✓', sisi: -1 as const },
  { lon: 103.1, lat: -1.7, teks: 'JAMBI', muncul: 1, tanda: '✓', sisi: -1 as const },
  { lon: 104.2, lat: -3.3, teks: 'SUMSEL', muncul: 1, tanda: '✓', sisi: -1 as const },
  { lon: 110.6, lat: -0.2, teks: 'KALBAR', muncul: 1, tanda: '✓' },
  { lon: 113.6, lat: -1.7, teks: 'KALTENG', muncul: 1, tanda: '✓' },
  { lon: 115.3, lat: -3.0, teks: 'KALSEL', muncul: 1, tanda: '✓' },
];
const ASAP = [{ dari: [140.3, -7.9] as [number, number], ke: [128.5, -3.5] as [number, number], panjang: 1, kuat: 0.8 }];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs><clipPath id="cp-k"><rect width="1080" height="1920" /></clipPath></defs>
    <g transform="translate(0 -480)" clipPath="url(#cp-k)"><PetaIndonesia f={30} pandang={{ ...PANDANG.indonesia, k: 21 }} sorot={SOROT} asap={[{ dari: [140.3, -7.9], ke: [134, -6], panjang: 1, kuat: 0.8 }]} id="p1" /></g>
    <g transform="translate(0 960) scale(0.5)"><g clipPath="url(#cp-k)"><PetaIndonesia f={30} pandang={PANDANG.timur} asap={ASAP} pin={{ lon: 140.4, lat: -8.5, teks: 'MERAUKE', muncul: 1 }} id="p2" /></g></g>
    <g transform="translate(540 960) scale(0.5)"><g clipPath="url(#cp-k)"><PetaIndonesia f={30} pandang={PANDANG.papuaSelatan} pin={{ lon: 140.4, lat: -8.5, teks: 'MERAUKE', muncul: 1 }} id="p3" /></g></g>
    <path d="M540 960V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
