// Lembar contoh Kampung Less. 2D v1: empat sudut (gapura + Kos Naya, Pos Keresahan, Ruang Baca + Meja Gambar Yan, Lahan Cerita).
// Render: node tools/render-thumb.cjs shared/locations/kampung-less-2d/v1/contoh/ContohKampung.tsx shared/locations/kampung-less-2d/v1/contoh/ContohKampung --only
import React from 'react';
import { KampungLess2D, TEMPAT_KL, taliPos } from '../KampungLess2D';
const V: [string, { zoom: number; cx: number; cy: number }][] = [
  ['gapura + Kos Naya', { zoom: 0.55, cx: 760, cy: 760 }],
  ['Pos Keresahan', { zoom: 0.8, cx: TEMPAT_KL.pos.x, cy: 880 }],
  ['Ruang Baca + Meja Gambar Yan', { zoom: 0.5, cx: 3200, cy: 760 }],
  ['Lahan Cerita', { zoom: 0.7, cx: TEMPAT_KL.lahan.x, cy: 900 }],
];
const lam = Array.from({ length: 6 }, (_, i) => ({ ...taliPos(0.12 + i * 0.15), s: 0.9, warna: ['#8B4354', '#D9A65A', '#F3E3C4'][i % 3] }));
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    {V.map(([t, k], i) => (
      <g key={i}>
        <svg x={(i % 2) * 540} y={Math.floor(i / 2) * 960} width="540" height="960" viewBox="0 0 1080 1920">
          <KampungLess2D f={30} kam={k} lampion={lam} jendelaLampion={i === 2 ? 1 : 0} id={`c${i}`} />
        </svg>
        <rect x={(i % 2) * 540} y={Math.floor(i / 2) * 960 + 900} width="540" height="60" fill="#283D36" />
        <text x={(i % 2) * 540 + 20} y={Math.floor(i / 2) * 960 + 940} fontFamily="Lato" fontWeight="900" fontSize="28" fill="#FFF9EF">{t}</text>
      </g>
    ))}
  </svg>
);
