// Lembar contoh jalan-kampung v3 (Dunia3D, cahaya menyala): empat sudut dari dunia yang sama.
// Render lembar: node tools/render-thumb.cjs shared/locations/jalan-kampung/v3/contoh/ContohJalan.tsx shared/locations/jalan-kampung/v3/contoh/ContohJalan --only
// Satu sudut ukuran penuh: PANEL=0..5 node tools/render-thumb.cjs ... (0 frontal warung siang, 1 sudut tinggi, 2 rumah ibu,
// 3 balik ke ruko, 4 penutup sore, 5 close-up dengan lensa)
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { JalanKampung, type Kam, type Isi } from '../JalanKampung';
import { Sepeda, Kerucut } from '../../../../props/jalan/v1/Jalan';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const isi: Isi[] = [
  { X: -0.3, Z: 8.6, gambar: (p) => <Person who="him" x={p.x} y={p.y} s={p.s} f={f} view="three" dir={1} mood="thinking" gazeY={0.6} {...POSE.him.santai} /> },
  { X: -3.0, Z: 9.9, gambar: (p) => <Person who="him" appearance={0} shirtColor="#8B6B4A" trouserColor="#3E3A36" x={p.x} y={p.y} s={p.s} f={f + 9} view="three" dir={-1} mood="soft" role="background" {...POSE.him.bertaut} /> },
  { X: 1.2, Z: 8.85, tinggi: 0.7, lebar: 0.4, gambar: (p) => <g transform={`translate(${p.x} ${p.y})`}><Kerucut s={p.s * 0.9} /></g> },
  { X: 2.1, Z: 13, tinggi: 1.0, lebar: 0.8, gambar: (p) => <g transform={`translate(${p.x} ${p.y})`}><Sepeda s={p.s} /></g> },
  { X: -2.8, Z: 9.3, tinggi: 0.35, lebar: 0.5, gambar: (p) => <Kucing x={p.x} y={p.y} s={p.s} f={f} pose="duduk" /> },
];
const views: [Kam, string, 'siang' | 'sore', { fokus: number; bukaan?: number }?][] = [
  [{ x: 3.2, z: 9.0, yaw: -90, F: 1700, vy: 830 }, 'frontal warung · siang', 'siang'],
  [{ x: 2.6, z: 3.6, yaw: -26, h: 4.2, F: 1450, vy: 420 }, 'sudut tinggi · siang', 'siang'],
  [{ x: -1.9, z: 4.4, yaw: 90, F: 1800, vy: 1000 }, 'rumah ibu · siang', 'siang'],
  [{ x: -0.6, z: 18, yaw: 180, F: 1100 }, 'balik ke ruko · sore', 'sore'],
  [{ x: 0.6, z: 3.4, yaw: 3, F: 1500, vy: 1000 }, 'penutup · sore', 'sore'],
  [{ x: 3.2, z: 8.6, yaw: -90, F: 2700, vy: 700 }, 'close-up + lensa · siang', 'siang', { fokus: 3.5, bukaan: 0.06 }],
];
const pilih = typeof process !== 'undefined' ? process.env.PANEL : undefined;
const Satu = ({ i, label }: { i: number; label: boolean }) => {
  const [k, t, w, lensa] = views[i];
  return (
    <>
      <JalanKampung f={f} kam={k} isi={isi} waktu={w} lensa={lensa} id={`cj${i}`} />
      {label && (
        <>
          <rect x="0" y="1780" width="1080" height="140" fill={P.ink} opacity=".85" />
          <text x="40" y="1872" fontFamily="Lato" fontWeight="900" fontSize="64" fill={P.cream}>{t}</text>
        </>
      )}
    </>
  );
};
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cj">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {pilih ? (
      <g clipPath="url(#cj)">
        <Satu i={Number(pilih)} label />
      </g>
    ) : (
      <>
        {[0, 1, 2, 4].map((v, i) => (
          <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
            <g clipPath="url(#cj)">
              <Satu i={v} label />
            </g>
          </g>
        ))}
        <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
      </>
    )}
  </svg>
);
