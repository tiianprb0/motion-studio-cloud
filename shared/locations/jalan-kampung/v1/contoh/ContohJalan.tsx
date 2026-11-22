// Lembar contoh jalan-kampung v1: empat sudut dari dunia yang sama (lurus jalan, sudut tinggi, menghadap rumah ibu, balik).
// Render: node tools/render-thumb.cjs shared/locations/jalan-kampung/v1/contoh/ContohJalan.tsx shared/locations/jalan-kampung/v1/contoh/ContohJalan --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { JalanKampung, LUBANG, type Kam, type Isi } from '../JalanKampung';
import { Sepeda, Kerucut } from '../../../../props/jalan/v1/Jalan';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const isi: Isi[] = [
  { X: -0.4, Z: 11.2, gambar: (p) => <Person who="him" x={p.x} y={p.y} s={p.s} f={f} view="three" dir={1} mood="thinking" gazeY={0.6} {...POSE.him.santai} /> },
  { X: 1.6, Z: 8.4, gambar: (p) => <Kerucut s={p.s} /> },
  { X: 2.1, Z: 13, gambar: (p) => <Sepeda s={p.s} /> },
  { X: -3.3, Z: 6.4, gambar: (p) => <Kucing x={p.x} y={p.y} s={p.s} f={f} pose="duduk" /> },
];
const views: [Kam, string][] = [
  [{ x: 0.2, z: -1, yaw: 0, F: 1100 }, 'lurus jalan (lebar)'],
  [{ x: 0.5, z: 2, yaw: 0, h: 6, F: 1000, vy: 330 }, 'sudut tinggi'],
  [{ x: -1.6, z: 4.8, yaw: 90, F: 1300 }, 'menghadap rumah ibu'],
  [{ x: -0.6, z: 18, yaw: 180, F: 1100 }, 'balik (ke ruko)'],
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cj"><rect width="1080" height="1920" /></clipPath>
    </defs>
    {views.map(([k, t], i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#cj)">
          <JalanKampung f={f} kam={k} isi={isi} />
        </g>
        <rect x="0" y="1780" width="1080" height="140" fill={P.ink} opacity=".85" />
        <text x="40" y="1872" fontFamily="Lato" fontWeight="900" fontSize="64" fill={P.cream}>{t}</text>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
// LUBANG dipakai supaya impor tetap terbaca di lembar: lubang di X {LUBANG.X}, Z {LUBANG.Z}
void LUBANG;
