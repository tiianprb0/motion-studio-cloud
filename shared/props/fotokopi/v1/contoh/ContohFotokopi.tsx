// Lembar contoh mesin fotokopi v1 (13 Nov 2026), di kantor-2d/v1 malam:
//   kiri atas  = memindai (lampu hijau), salinan keluar, Yan menekan tombol (sodorKiri)
//   kanan atas = macet: lampu merah + kertas kusut, Yan kesal (pinggang)
//   kiri bawah = mengambil salinan (pegangDepanDada + TumpukanKertas)
//   kanan bawah = lebar: letak mesin di bawah papan tulis, kiri meja Yan
// Render: node tools/render-thumb.cjs shared/props/fotokopi/v1/contoh/ContohFotokopi.tsx shared/props/fotokopi/v1/contoh/ContohFotokopi --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kantor2D, titikKantor, type Isi2D, type Kam2D } from '../../../../locations/kantor-2d/v1/Kantor2D';
import { Fotokopi, TumpukanKertas } from '../Fotokopi';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const FK = titikKantor(-2.1, 0, 0.3);
const DI_FK = titikKantor(-1.45, 0, 0.62);
const mesin = (a: Parameters<typeof Fotokopi>[0]): Isi2D => ({ x: FK.x, y: FK.y, s: FK.s, tinggi: 0.84, lebar: 0.6, jarakDinding: 0.3, gambar: (q: Q) => <g transform={`translate(${q.x} ${q.y}) scale(${q.s})`}><Fotokopi malam={1} {...a} /></g> });
const yan = (a: { pose: keyof typeof POSE.him; mood: 'hurt' | 'annoyed'; gaze?: number; gazeY?: number; hold?: React.ReactNode }): Isi2D => ({
  x: DI_FK.x, y: DI_FK.y, s: DI_FK.s, tinggi: 1.65, jarakDinding: 0.6,
  gambar: (q: Q) => <Person who="him" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={-1} mood={a.mood} gaze={a.gaze ?? -0.45} gazeY={a.gazeY ?? 0.6} role="principal" {...(POSE.him as any)[a.pose]} holdRight={a.hold} />,
});
const DEKAT: Kam2D = { zoom: 2.3, cx: 175, cy: 900 };
const ADEGAN: { kam: Kam2D; isi: Isi2D[]; judul: string }[] = [
  { kam: DEKAT, judul: 'memindai · salinan keluar', isi: [mesin({ status: 'kerja', pindai: 0.55, salinan: 4, keluar: 0.6, asli: 6 }), yan({ pose: 'sodorKiri', mood: 'hurt', gazeY: 0.8 })] },
  { kam: DEKAT, judul: 'macet · lampu merah', isi: [mesin({ status: 'macet', kedip: 0, salinan: 4, asli: 6 }), yan({ pose: 'pinggang', mood: 'annoyed', gaze: -0.85, gazeY: 0.3 })] },
  { kam: DEKAT, judul: 'mengambil salinan', isi: [mesin({ status: 'siap' }), yan({ pose: 'pegangDepanDada', mood: 'hurt', gaze: 0, gazeY: 0.7, hold: <g transform="translate(0 6)"><TumpukanKertas n={6} /></g> })] },
  { kam: { zoom: 0.9, cx: 380, cy: 980 }, judul: 'letak · bawah papan tulis', isi: [mesin({ status: 'kerja', pindai: 0.3, salinan: 2 }), yan({ pose: 'sodorKiri', mood: 'hurt' })] },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cfk-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#cfk-klip)">
          <Kantor2D f={f} kam={a.kam} t={1} spanduk="lepas" papan={1} meja={{ map: 1, gelas: 3 }} isi={a.isi} id={`cfk${i}`} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
