// Lembar contoh Gang Melati flat 2D v1 (12 Nov 2026): empat bingkai dari satu dunia.
//   kiri atas  = Warung Makmur siang (Yan memotret lubang, Pak Rus di teras, kucing)
//   kanan atas = rumah ibu no. 10 (ibu di gerbang, anak SD)
//   kiri bawah = Taman Baca (guru + papan tulis + anak)
//   kanan bawah = lebar sore (lubang tetap, Pak Rus di bangku)
// Render: node tools/render-thumb.cjs shared/locations/gang-melati-2d/v1/contoh/ContohGang.tsx shared/locations/gang-melati-2d/v1/contoh/ContohGang --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../characters/kucing/v1/Kucing';
import { PhoneInHand } from '../../../../props/harian/v1/Props';
import { Mug } from '../../../../props/minum/v1/Minum';
import { Kertas } from '../../../../props/jalan/v1/Jalan';
import { GangMelati2D, GANG2D, type Isi2D, type Kam2D } from '../GangMelati2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
type Q = { x: number; y: number; s: number };
const yan = (q: Q) => <Person who="him" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={1} mood="thinking" gaze={0.5} gazeY={0.8} role="principal" {...POSE.him.pegangDepanDada} holdRight={<PhoneInHand s={1} />} />;
const rus = (sit = false) => (q: Q) => <Person who="him" appearance={0} shirtColor="#8B6B4A" trouserColor="#3E3A36" x={q.x} y={q.y} s={q.s} f={f + 21} view="three" dir={-1} mood="thinking" gaze={-1} role="background" pose={sit ? 'sit' : 'stand'} seatDrop={sit ? 20 : 0} {...POSE.him.pegangDepanDada} holdRight={sit ? <PhoneInHand s={1} /> : <g transform="translate(0 6)"><Mug s={0.45} /></g>} />;
const ibu = (q: Q) => <Person who="her" appearance={1} shirtColor="#B58A9A" trouserColor="#6E6A7E" x={q.x} y={q.y} s={q.s} f={f + 3} dir={-1} mood="thinking" gazeY={0.7} role="background" {...POSE.her.pegangDepanDada} holdRight={<Kertas s={1.1} judul="RINCIAN BIAYA" />} />;
const anak = (dir: 1 | -1, seed = 0) => (q: Q) => <Person who="boy" appearance={3 + seed} shirtColor="#F7F3EA" trouserColor="#B23A3A" x={q.x} y={q.y} s={q.s * 0.62} f={f + 9 + seed} dir={dir} mood="warm" gaze={dir} role="background" {...POSE.him.bertaut} />;
const guru = (q: Q) => <Person who="her" appearance={2} shirtColor="#A65E6E" trouserColor="#5E5550" x={q.x} y={q.y} s={q.s} f={f + 5} dir={1} mood="warm" gaze={1} talk={1} role="background" {...POSE.her.melambai} />;
const kucing = (q: Q) => <Kucing x={q.x} y={q.y} s={q.s} f={f} pose="duduk" gaze={-0.3} />;

const ADEGAN: { kam: Kam2D; isi: Isi2D[]; waktu?: 'siang' | 'sore'; judul: string }[] = [
  { kam: { zoom: 1, cx: 540, cy: 960 }, judul: 'warung · siang', isi: [{ x: 340, y: 1505, gambar: yan }, { x: 800, y: GANG2D.terasDepan - 10, gambar: rus(), jarakDinding: 1.3 }, { x: 640, y: GANG2D.terasDepan + 16, gambar: kucing, jarakDinding: 1.5, tinggi: 0.38, lebar: 0.5 }] },
  { kam: { zoom: 1.2, cx: -1000, cy: 1000 }, judul: 'rumah ibu', isi: [{ x: -1080, y: 1250, gambar: ibu }, { x: -930, y: 1262, gambar: anak(1), tinggi: 1.05, lebar: 0.38 }] },
  { kam: { zoom: 1.1, cx: 2800, cy: 1000 }, judul: 'taman baca', isi: [{ x: 2700, y: 1215, gambar: guru, jarakDinding: 1.2 }, { x: 2950, y: 1300, gambar: anak(-1), tinggi: 1.05, lebar: 0.38 }, { x: 3120, y: 1320, gambar: anak(-1, 4), tinggi: 1.05, lebar: 0.38 }] },
  { kam: { zoom: 0.62, cx: 600, cy: 1150 }, waktu: 'sore', judul: 'lebar · sore', isi: [{ x: 300, y: 1232, gambar: rus(true), tinggi: 1.25, jarakDinding: 1.0 }, { x: 330, y: 1300, gambar: kucing, tinggi: 0.38 }] },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cg-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {ADEGAN.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#cg-klip)">
          <GangMelati2D f={f} kam={a.kam} isi={a.isi} waktu={a.waktu} id={`cg${i}`} />
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
