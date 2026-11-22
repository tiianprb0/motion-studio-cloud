// Lembar contoh Kafe flat 2D v1 (13 Nov 2026): satu kafe, tiga waktu + bingkai dekat.
//   kiri atas  = lebar siang, meja kosong
//   kanan atas = lebar sore, tiga orang nongkrong (Yan + dua figuran rig v2)
//   kiri bawah = dekat sore (Yan memegang es kopi)
//   kanan bawah = lebar malam, lampu gantung + lampu tali menyala
// Render: node tools/render-thumb.cjs shared/locations/kafe-2d/v1/contoh/ContohKafe2D.tsx shared/locations/kafe-2d/v1/contoh/ContohKafe2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kafe2D, KURSI_KAFE, EsKopi, type Isi2D, type Kam2D } from '../Kafe2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const duduk = (i: number, g: (q: Q) => React.ReactNode): Isi2D => ({ x: KURSI_KAFE[i].x, y: KURSI_KAFE[i].y, gambar: g, tinggi: 1.25, jarakDinding: 0.5 });
const tiga: Isi2D[] = [
  duduk(0, (q) => <Person who="her" appearance={1} shirtColor="#C7B7D6" x={q.x} y={q.y} s={q.s} f={f} pose="sit" seatDrop={20} view="three" dir={1} mood="warm" gaze={0.8} role="background" {...POSE.her.bertaut} />),
  duduk(1, (q) => <Person who="him" x={q.x} y={q.y} s={q.s} f={f} pose="sit" seatDrop={20} view="three" dir={1} mood="warm" gaze={0.4} role="principal" {...POSE.him.pegangDepanDada} holdRight={<g transform="translate(0 30)"><EsKopi s={0.8} /></g>} />),
  duduk(2, (q) => <Person who="him" appearance={2} shirtColor="#D98F6F" x={q.x} y={q.y} s={q.s} f={f} pose="sit" seatDrop={20} view="three" dir={-1} mood="warm" gaze={-0.8} role="background" {...POSE.him.melambai} />),
];
const ADEGAN: { kam: Kam2D; t: number; isi: Isi2D[]; judul: string }[] = [
  { kam: { zoom: 0.85, cx: 540, cy: 980 }, t: 0, isi: [], judul: 'lebar · siang' },
  { kam: { zoom: 1.2, cx: 560, cy: 930 }, t: 0.5, isi: tiga, judul: 'sore · nongkrong' },
  { kam: { zoom: 1.9, cx: 540, cy: 950 }, t: 0.5, isi: tiga, judul: 'dekat · sore' },
  { kam: { zoom: 0.85, cx: 540, cy: 980 }, t: 1, isi: tiga, judul: 'lebar · malam' },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="ckf-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#ckf-klip)">
          <Kafe2D f={f} kam={a.kam} t={a.t} meja={{ gelas: a.isi.length ? 3 : 0, pisang: a.isi.length > 0, hp: true }} isi={a.isi} id={`ckf${i}`} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
