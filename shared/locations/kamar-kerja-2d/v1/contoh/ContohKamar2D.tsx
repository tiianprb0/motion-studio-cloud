// Lembar contoh Kamar Kerja flat 2D v1 (12 Nov 2026): empat bingkai dari satu kamar, sore → malam.
//   kiri atas  = lebar sore (matahari dari jendela, berkas cahaya di lantai), Yan di meja, kucing tidur
//   kanan atas = dekat sore, Yan menatap jendela
//   kiri bawah = lebar malam, lampu meja menyala (sumber cahaya malam)
//   kanan bawah = malam di jendela: Yan berdiri, kucing di ambang
// Render: node tools/render-thumb.cjs shared/locations/kamar-kerja-2d/v1/contoh/ContohKamar2D.tsx shared/locations/kamar-kerja-2d/v1/contoh/ContohKamar2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { KamarKerja2D, DUDUK2D, titikKamar, pxMd, type Isi2D, type Kam2D, type Meja } from '../KamarKerja2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const yanDuduk = (mood: 'thinking' | 'soft' | 'hurt', gaze = 0, gazeY = 0.5) => (q: Q) => (
  <Person who="him" x={q.x} y={q.y} s={q.s} f={f} pose="sit" seatDrop={20} view="three" dir={-1} mood={mood} gaze={gaze} gazeY={gazeY} role="principal" {...POSE.him.bertaut} />
);
const yanBerdiri = (q: Q) => <Person who="him" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={-1} mood="warm" gaze={0.6} gazeY={-0.2} role="principal" {...POSE.him.santai} />;
const kucing = (pose: 'duduk' | 'tidur') => (q: Q) => <Kucing x={q.x} y={q.y} s={q.s} f={f} pose={pose} gaze={-0.5} />;
const duduk = (g: (q: Q) => React.ReactNode): Isi2D => ({ x: DUDUK2D.x, y: DUDUK2D.y, gambar: g, tinggi: 1.25, jarakDinding: 0.45 });
const ambang = titikKamar(1.95, 0.9, 0.06);

const ADEGAN: { kam: Kam2D; t: number; meja: Meja; isi: Isi2D[]; judul: string }[] = [
  { kam: { zoom: 0.85, cx: 540, cy: 1010 }, t: 0, meja: { daftar: 'rapi', hp: true }, judul: 'lebar · sore', isi: [duduk(yanDuduk('thinking')), { ...titikKamar(-1.2, 0, 0.6), s: undefined, gambar: kucing('tidur'), tinggi: 0.25, lebar: 0.5 }] },
  { kam: { zoom: 1.6, cx: 600, cy: 900 }, t: 0.08, meja: { daftar: 'rapi', hp: true }, judul: 'dekat · sore', isi: [duduk(yanDuduk('soft', 1, -0.2))] },
  { kam: { zoom: 0.85, cx: 540, cy: 1010 }, t: 0.8, meja: { daftar: 'coret', hp: true }, judul: 'lebar · malam, lampu meja', isi: [duduk(yanDuduk('hurt', 0, 0.6))] },
  { kam: { zoom: 1.1, cx: 820, cy: 980 }, t: 1, meja: { daftar: 'coret', kertasBaru: true, hp: true }, judul: 'malam · jendela', isi: [{ ...titikKamar(1.2, 0, 0.55), s: undefined, gambar: yanBerdiri, jarakDinding: 0.55 }, { x: ambang.x, y: ambang.y, s: pxMd(0.06) / 200, gambar: kucing('duduk'), tinggi: 0.38, lebar: 0.5, tanpaBayangan: true }] },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="ck-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#ck-klip)">
          <KamarKerja2D f={f} kam={a.kam} t={a.t} meja={a.meja} isi={a.isi} id={`ck${i}`} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
