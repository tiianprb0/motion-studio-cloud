// Lembar contoh merauke-2d v1 (18 Nov 2026): empat tempat di satu dunia Papua Selatan.
//   kiri atas  = savana + rawa dari tanah (walabi, musamus, kayu putih), asap jauh di cakrawala
//   kanan atas = pembakaran savana kecil oleh warga adat (garis api, bekas hangus, tunas, walabi merumput)
//   kiri bawah = bukaan lahan dari atas (food estate, tebu, konsesi kayu, sawit) + titik panas
//   kanan bawah = petak bukaan dari dekat: tumpukan kayu dibakar, pemantau menerbangkan drone
// Render: node tools/render-thumb.cjs shared/locations/merauke-2d/v1/contoh/ContohMerauke2D.tsx shared/locations/merauke-2d/v1/contoh/ContohMerauke2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { POSE } from '../../../../characters/rig/v3/poses';
import { BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v3/Character';
import { WargaPapua } from '../../../../characters/extras/v3/WargaPapua';
import { Drone, RemoteDrone } from '../../../../props/drone/v1/Drone';
import { Merauke2D, MeraukeAtas2D, Petak2D, HutanLebat2D, Walabi, titikMerauke, WARGA_ADAT, ADAT } from '../Merauke2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const ranting = (
  <g transform="rotate(28)">
    <path d="M0 0L0 230" stroke="#6B4E36" strokeWidth="9" strokeLinecap="round" />
    <path d="M0 200l-30 40M0 210l26 36M0 220l-6 44" stroke="#7C8A55" strokeWidth="7" strokeLinecap="round" />
  </g>
);
const PANEL: { judul: string; isi: () => React.ReactNode }[] = [
  {
    judul: 'savana + rawa · siang kemarau',
    isi: () => {
      const w = titikMerauke(260, 1220);
      return <Merauke2D f={f} kam={{ zoom: 1, cx: 300, cy: 960 }} asap={0.25} asapJauh={0.6} rawaAir={0.3} isi={[{ x: w.x, y: w.y, gambar: (q) => <Walabi x={q.x} y={q.y} s={q.s} f={f} dir={1} pose="tegak" />, tinggi: 0.8, polos: true }]} id="c1" />;
    },
  },
  {
    judul: 'bakar savana adat · kecil, terkendali',
    isi: () => {
      const wb = titikMerauke(1420, 1255);
      return (
        <Merauke2D f={f} kam={{ zoom: 1.35, cx: 1640, cy: 1080 }} asap={0.3} asapJauh={0.7} apiAdat={0.6} tunas={0.8} id="c2"
          isi={[
            { x: WARGA_ADAT.x, y: WARGA_ADAT.y, gambar: (q) => <WargaPapua id="p01" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={-1} mood="thinking" gaze={-0.6} gazeY={0.5} {...POSE.him.pegangDepanDada} holdRight={ranting} /> },
            { x: wb.x, y: wb.y, gambar: (q) => <Walabi x={q.x} y={q.y} s={q.s} f={f} dir={1} pose="makan" />, tinggi: 0.6, polos: true },
          ]} />
      );
    },
  },
  { judul: 'bukaan dari atas · titik panas', isi: () => <MeraukeAtas2D f={f} asap={0.6} titik={1} id="c3" /> },
  {
    judul: 'petak · kayu dibakar, drone',
    isi: () => (
      <Petak2D f={f} asap={0.75} bakar={0.8} id="c4"
        drone={<Drone x={620} y={560} s={0.9} f={f} miring={-6} />}
        isi={[{ x: 300, y: 1560, gambar: (q) => <WargaPapua id="p04" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={1} mood="thinking" gaze={0.5} gazeY={-0.6} {...POSE.him.pegangDepanDada} holdRight={<g transform="translate(0 20)"><RemoteDrone s={1} /></g>} /> }]} />
    ),
  },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cm-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {PANEL.map((a, i) => (
      <g key={i} transform={`translate(${(i % 2) * 540} ${Math.floor(i / 2) * 960}) scale(0.5)`}>
        <g clipPath="url(#cm-klip)">
          {a.isi()}
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="54" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
