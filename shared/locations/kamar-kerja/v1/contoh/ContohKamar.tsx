// Lembar contoh kamar-kerja v1: sudut depan (sore), lebar dari pojok (senja), samping (malam), depan dekat (malam).
// Render: node tools/render-thumb.cjs shared/locations/kamar-kerja/v1/contoh/ContohKamar.tsx shared/locations/kamar-kerja/v1/contoh/ContohKamar --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { KamarKerja, DUDUK, type Kam, type Isi } from '../KamarKerja';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const yan: Isi = { X: DUDUK.X, Z: DUDUK.Z, gambar: (p) => <Person who="him" x={p.x} y={p.y} s={p.s} f={f} pose="sit" seatDrop={20} view="three" dir={-1} mood="thinking" gazeY={0.5} {...POSE.him.bertaut} /> };
const kucing: Isi = { X: 1.6, Z: 4.0, gambar: (p) => <Kucing x={p.x} y={p.y} s={p.s} f={f} pose="tidur" /> };
const views: [Kam, number, string][] = [
  [{ x: 0.15, z: 0.2, yaw: 0, h: 1.2, F: 1300, vy: 980 }, 0, 'depan, sore'],
  [{ x: -1.9, z: 0.1, yaw: 24, h: 1.6, F: 900, vy: 900 }, 0.5, 'lebar pojok, senja'],
  [{ x: 2.0, z: 2.2, yaw: -62, h: 1.3, F: 1200, vy: 980 }, 1, 'serong kanan, malam'],
  [{ x: 0.1, z: 1.0, yaw: 0, h: 1.15, F: 2000, vy: 900 }, 0.9, 'depan dekat, malam'],
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs><clipPath id="c"><rect width="1080" height="1920" /></clipPath></defs>
    {views.map(([k, t, label], i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#c)"><KamarKerja f={f} kam={k} t={t} meja={{ daftar: t > 0.6 ? 'coret' : 'rapi', hp: true, hpNyala: t > 0.8 ? 1 : 0, kertasBaru: t > 0.8 }} isi={[yan, kucing]} /></g>
        <rect x="0" y="1780" width="1080" height="140" fill={P.ink} opacity=".85" />
        <text x="40" y="1872" fontFamily="Lato" fontWeight="900" fontSize="64" fill={P.cream}>{label}</text>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
