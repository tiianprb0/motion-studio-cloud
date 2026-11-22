// Lembar contoh Kantor flat 2D v1 (13 Nov 2026): empat bingkai dari satu kantor.
//   kiri atas  = lebar pagi, hari pertama (spanduk, kardus, neon nyala), Yan berdiri dengan tanda pengenal
//   kanan atas = dekat pagi: kertas tempel harapan di punggung monitor
//   kiri bawah = lebar malam lembur: neon tinggal satu, monitor menyala, map menumpuk, spanduk terlepas
//   kanan bawah = fajar: lampu meja menyala, kucing di tembok atap seberang
// Render: node tools/render-thumb.cjs shared/locations/kantor-2d/v1/contoh/ContohKantor2D.tsx shared/locations/kantor-2d/v1/contoh/ContohKantor2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { TandaPengenal } from '../../../../props/kantor/v1/Kantor';
import { Kantor2D, DUDUK_KANTOR, titikKantor, type Isi2D, type Kam2D, type MejaKantor } from '../Kantor2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const yanDuduk = (mood: 'thinking' | 'soft' | 'hurt', gazeY = 0.5, pudar = 0.6) => (q: Q) => (
  <>
    <Person who="him" x={q.x} y={q.y} s={q.s} f={f} pose="sit" seatDrop={20} view="three" dir={-1} mood={mood} gazeY={gazeY} role="principal" {...POSE.him.bertaut} />
    <TandaPengenal x={q.x} y={q.y + 20 * q.s} s={q.s} dir={-1} pudar={pudar} miring={14} />
  </>
);
const yanBerdiri = (q: Q) => (
  <>
    <Person who="him" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={-1} mood="warm" gaze={0.4} role="principal" {...POSE.him.santai} />
    <TandaPengenal x={q.x} y={q.y} s={q.s} dir={-1} />
  </>
);
const duduk = (g: (q: Q) => React.ReactNode): Isi2D => ({ x: DUDUK_KANTOR.x, y: DUDUK_KANTOR.y, gambar: g, tinggi: 1.25, jarakDinding: 0.45 });
const HARAPAN = [
  { teks: 'INGIN\nBELAJAR', u: 0.22, v: 0.3, rot: -5 },
  { teks: 'INGIN\nDITERIMA', u: 0.72, v: 0.55, rot: 4, warna: '#CFE6D8' },
];

const ADEGAN: { kam: Kam2D; t: number; meja: MejaKantor; isi: Isi2D[]; judul: string; extra?: object }[] = [
  { kam: { zoom: 0.85, cx: 540, cy: 1010 }, t: 0, meja: { kardus: true }, judul: 'lebar · pagi hari pertama', isi: [{ ...titikKantor(1.3, 0, 1.2), s: undefined, gambar: yanBerdiri, jarakDinding: 1.2 }], extra: { spanduk: 1 } },
  { kam: { zoom: 2.2, cx: 430, cy: 1000 }, t: 0.05, meja: { stiker: HARAPAN, buku: true }, judul: 'dekat · kertas harapan', isi: [] },
  { kam: { zoom: 0.85, cx: 540, cy: 1010 }, t: 1, meja: { map: 1, gelas: 3, stiker: [...HARAPAN.map((h) => ({ ...h, pudar: 0.6 })), { teks: 'REVISI\nLAGI!', u: 0.45, v: 0.4, warna: '#F2B8B8', tinta: P.wine, rot: 8 }] }, judul: 'lebar · malam lembur', isi: [duduk(yanDuduk('hurt'))], extra: { spanduk: 'lepas', papan: 1 } },
  { kam: { zoom: 1.2, cx: 560, cy: 960 }, t: 1, meja: { map: 1, gelas: 3 }, judul: 'fajar · lampu meja', isi: [duduk(yanDuduk('soft', -0.3))], extra: { fajar: 1, lampu: 1, spanduk: 'lepas', kucing: { u: 0.6, pose: 'jalan' } } },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="ckt-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#ckt-klip)">
          <Kantor2D f={f} kam={a.kam} t={a.t} meja={a.meja} isi={a.isi} id={`ckt${i}`} {...(a.extra as any)} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
