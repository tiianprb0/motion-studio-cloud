// Lembar contoh Bundaran HI v3 (Dunia3D). Spanduk = teks asli aksi Greenpeace Indonesia 20 Okt 2026 (tidak diganti).
// Render: node tools/render-thumb.cjs shared/locations/bundaran-hi/v3/contoh/ContohHI.tsx shared/locations/bundaran-hi/v3/contoh/ContohHI --only
// Satu sudut ukuran penuh: PANEL=0..2 (0 kamera rendah dengan penonton, 1 lebar, 2 spanduk setengah terbentang)
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { BundaranHI, type Kam, type IsiHI } from '../BundaranHI';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const penonton: IsiHI[] = [
  { X: -2.3, Z: 4.4, gambar: (p) => <Person who="her" appearance={4} shirtColor="#9DB3D6" trouserColor="#6F7C8C" x={p.x} y={p.y} s={p.s} f={f + 5} dir={1} mood="thinking" gazeY={-0.7} gaze={0.6} role="background" {...POSE.her.santai} /> },
  { X: -0.9, Z: 4.7, gambar: (p) => <Person who="her" appearance={2} shirtColor="#A65E6E" trouserColor="#5E5550" x={p.x} y={p.y} s={p.s} f={f + 19} dir={1} mood="soft" gazeY={-0.7} gaze={0.5} role="background" {...POSE.her.bertaut} /> },
  { X: 2.4, Z: 4.5, gambar: (p) => <Person who="him" appearance={5} shirtColor="#C98F84" trouserColor="#4E5A63" x={p.x} y={p.y} s={p.s} f={f + 33} dir={-1} mood="thinking" gazeY={-0.7} gaze={-0.6} role="background" {...POSE.him.bertaut} /> },
];
const views: [Kam, string, number, typeof penonton][] = [
  [{ x: -0.2, z: 0.0, yaw: 2, h: 1.6, F: 1500, vy: 1480 }, 'kamera rendah + penonton', 1, penonton],
  [{ x: 0.5, z: -4, yaw: 0, h: 1.6, F: 700, vy: 1100 }, 'lebar', 1, []],
  [{ x: 0.3, z: -2, yaw: 0, h: 1.6, F: 900, vy: 1250 }, 'spanduk dibentangkan', 0.35, []],
];
const pilih = typeof process !== 'undefined' ? process.env.PANEL : undefined;
const Satu = ({ i }: { i: number }) => {
  const [k, t, sp, isi] = views[i];
  return (
    <>
      <BundaranHI f={f} kam={k} spanduk={sp} pemanjat={3} isi={isi} id={`hi${i}`} />
      <rect x="0" y="1780" width="1080" height="140" fill={P.ink} opacity=".85" />
      <text x="40" y="1872" fontFamily="Lato" fontWeight="900" fontSize="64" fill={P.cream}>{t}</text>
    </>
  );
};
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="ch">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {pilih ? (
      <g clipPath="url(#ch)">
        <Satu i={Number(pilih)} />
      </g>
    ) : (
      <>
        {[0, 1].map((v, i) => (
          <g key={i} transform={`translate(${i * 540} 480) scale(0.5)`}>
            <g clipPath="url(#ch)">
              <Satu i={v} />
            </g>
          </g>
        ))}
        <path d="M540 480V1440" stroke={P.cream} strokeWidth="6" />
      </>
    )}
  </svg>
);
