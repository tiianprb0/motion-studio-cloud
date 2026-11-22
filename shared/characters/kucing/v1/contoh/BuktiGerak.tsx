// Bukti gerak kucing oranye (7 Nov 2026, disetujui pengguna): 6 dtk, duduk (napas, kedip, telinga, ekor),
// tidur (napas, telinga), jalan (siklus kaki) melintas dari kanan ke kiri.
// Render: node tools/render-film.cjs shared/characters/kucing/v1/contoh --entry=BuktiGerak.tsx --from=0 --to=180 --out=<abs>/BuktiGerak.mp4
import React from 'react';
import { P, ramp } from '../../../../core/v1/core';
import { Kucing } from '../Kucing';

export const TOTAL = 180;
export const OUTRO = 0;
export const SHOTS: [number, string][] = [[0, 'gerak']];
export const shotAt = (_f: number) => ({ shot: 'gerak' });

export const Frame = ({ frame: f }: { frame: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <rect y="760" width="1080" height="1160" fill="#E9DCC5" />
    <Kucing x={540} y={760} s={6} f={f} gaze={Math.sin(f * 0.03) * 0.6} id="k-dekat" />
    <rect y="1240" width="1080" height="680" fill="#DCCBB0" />
    <Kucing x={250} y={1300} s={3} f={f} pose="tidur" seed={2} id="k-tidur" />
    <Kucing x={ramp(f, 0, 180, 1020, 60)} y={1560} s={3} f={f} pose="jalan" dir={-1} seed={5} id="k-jalan" />
    <text x="540" y="1760" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="40" fill={P.ink}>bukti gerak · kucing oranye v1</text>
  </svg>
);
