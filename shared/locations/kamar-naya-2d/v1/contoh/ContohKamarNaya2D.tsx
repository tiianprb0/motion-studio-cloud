// Lembar contoh Kamar Naya flat 2D v1 (12 Nov 2026): empat bingkai dari satu kamar di malam hujan.
//   kiri atas  = papan gabus: Naya memaku catatan penjelasan
//   kanan atas = cermin berdiri: Naya menatap pantulannya
//   kiri bawah = lebar: meja (laptop, lampu), catatan berguguran
//   kanan bawah = jendela berhujan dibuka, Naya memegang mug (lebih tenang)
// Render: node tools/render-thumb.cjs shared/locations/kamar-naya-2d/v1/contoh/ContohKamarNaya2D.tsx shared/locations/kamar-naya-2d/v1/contoh/ContohKamarNaya2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Mug } from '../../../../props/minum/v1/Minum';
import { KamarNaya2D, titikKamar, CERMIN2D, MEJA2D, type Isi2D, type Kam2D, type Catatan } from '../KamarNaya2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const naya = (o: { dir?: number; mood?: any; pose?: any; gaze?: number; gazeY?: number; hold?: React.ReactNode; holdLeft?: React.ReactNode }) => (q: Q) => (
  <Person who="her" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={o.dir ?? 1} mood={o.mood ?? 'soft'} gaze={o.gaze ?? 0} gazeY={o.gazeY ?? 0} role="principal" {...(o.pose ?? POSE.her.santai)} holdRight={o.hold} holdLeft={o.holdLeft} />
);
const kertas = <rect x="-20" y="-16" width="40" height="28" fill="#FFF3B8" />;
const PENJELASAN: Catatan[] = [
  { teks: 'aku cuma\ncapek', u: 0.08, v: 0.12, rot: -4 },
  { teks: 'bukan\nmaksudku', u: 0.32, v: 0.08, rot: 3 },
  { teks: 'aku sudah\ncoba', u: 0.56, v: 0.14, rot: -2 },
  { teks: 'EGOIS', u: 0.18, v: 0.48, warna: '#F2B8B8', tinta: P.wine, rot: 5 },
  { teks: 'KECEWA', u: 0.46, v: 0.52, warna: '#F2B8B8', tinta: P.wine, rot: -6 },
  { teks: 'tolong\ndengar', u: 0.72, v: 0.44, rot: 4 },
];
const pantulan = (fr: number) => {
  const G = CERMIN2D;
  const cx = (G.x0 + G.x1) / 2;
  return (
    <g opacity=".85">
      <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} fill="#3E4A5A" opacity=".35" />
      <Person who="her" x={cx + 10} y={G.y1 - 6} s={G.pxM / 200 * 0.92} f={fr} view="three" dir={1} mood="unsure" gaze={0.6} role="background" {...POSE.her.santai} />
    </g>
  );
};
const ADEGAN: { kam: Kam2D; isi: Isi2D[]; papan?: Catatan[]; cermin?: (f: number) => React.ReactNode; laptop?: { layar?: number }; buka?: number; tenang?: number; judul: string }[] = [
  { kam: { zoom: 1.35, cx: 330, cy: 910 }, papan: PENJELASAN, judul: 'papan · memaku penjelasan', isi: [{ ...titikKamar(-0.55, 0, 0.5), s: undefined, gambar: naya({ dir: -1, mood: 'hurt', pose: POSE.her.melambai, gazeY: -0.5, holdLeft: kertas }), jarakDinding: 0.5 }] },
  { kam: { zoom: 1.3, cx: 60, cy: 920 }, papan: PENJELASAN, cermin: pantulan, judul: 'cermin · pantulan', isi: [{ ...titikKamar(-1.75, 0, 0.55), s: undefined, gambar: naya({ dir: -1, mood: 'thinking', gaze: -1 }), jarakDinding: 0.55 }] },
  { kam: { zoom: 0.85, cx: 300, cy: 1000 }, papan: PENJELASAN.map((q, i) => ({ ...q, jatuh: i % 2 ? 1 : 0.5 })), laptop: { layar: 1 }, judul: 'lebar · meja, catatan jatuh', isi: [{ x: MEJA2D.x, y: MEJA2D.y, gambar: naya({ dir: -1, mood: 'soft', gazeY: 0.5, pose: POSE.her.bertaut }), jarakDinding: 0.45 }] },
  { kam: { zoom: 1.2, cx: 1000, cy: 960 }, buka: 1, tenang: 1, judul: 'jendela hujan · tenang', isi: [{ ...titikKamar(1.95, 0, 0.6), s: undefined, gambar: naya({ dir: -1, mood: 'warm', gaze: 0.6, pose: POSE.her.pegangDepanDada, hold: <g transform="translate(0 6)"><Mug s={0.45} /></g> }), jarakDinding: 0.6 }] },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cn-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#cn-klip)">
          <KamarNaya2D f={f} kam={a.kam} isi={a.isi} papan={a.papan} cermin={a.cermin} laptop={a.laptop} jendelaBuka={a.buka} tenang={a.tenang} id={`cn${i}`} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
