// Lembar contoh kota-biak-2d v1 (18 Nov 2026): kiri = lebar, kabut asap, sekolah libur, pesawat berputar;
// kanan = sedang, warga membagikan masker di trotoar.
// Render: node tools/render-thumb.cjs shared/locations/kota-biak-2d/v1/contoh/ContohKotaBiak2D.tsx shared/locations/kota-biak-2d/v1/contoh/ContohKotaBiak2D --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { POSE } from '../../../../characters/rig/v3/poses';
import { BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v3/Character';
import { WargaPapua } from '../../../../characters/extras/v3/WargaPapua';
import { Masker } from '../../../../props/kesehatan/v1/Masker';
import { KotaBiak2D, titikKota, MEJA_MASKER } from '../KotaBiak2D';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const masker = (
  <g transform="translate(0 6)">
    <rect x="-22" y="-12" width="44" height="26" rx="8" fill="#DCE6EA" />
    <path d="M-22 -6L-34 -14M22 -6L34 -14" stroke="#C3CED3" strokeWidth="3" />
  </g>
);
const pembagi = titikKota(MEJA_MASKER.x + 140, MEJA_MASKER.y + 10);
const penerima = titikKota(MEJA_MASKER.x - 230, MEJA_MASKER.y + 60);
const pejalan = titikKota(150, 1330);
const isi = [
  { x: pembagi.x, y: pembagi.y, gambar: (q: any) => <g><WargaPapua id="p02" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={-1} mood="soft" gaze={-0.6} {...POSE.her.sodorKiri} holdLeft={masker} /><Masker x={q.x} y={q.y} s={q.s} dir={-1} /></g> },
  { x: penerima.x, y: penerima.y, gambar: (q: any) => <g><WargaPapua id="p03" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={1} mood="unsure" gaze={0.6} {...POSE.him.santai} /></g> },
  { x: pejalan.x, y: pejalan.y, gambar: (q: any) => <g><WargaPapua id="p05" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={1} mood="hurt" gaze={0.3} {...POSE.her.bertaut} /><Masker x={q.x} y={q.y} s={q.s} dir={1} /></g> },
];
const PANEL = [
  { judul: 'lebar · sekolah libur, asap', node: <KotaBiak2D f={f} kam={{ zoom: 0.8, cx: 480, cy: 900 }} asap={0.75} pesawat={0.45} isi={isi} id="b1" /> },
  { judul: 'sedang · bagi masker', node: <KotaBiak2D f={f} kam={{ zoom: 1.5, cx: 760, cy: 1020 }} asap={0.75} pesawat={0.45} isi={isi} id="b2" /> },
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs><clipPath id="kb-klip"><rect width="1080" height="1920" /></clipPath></defs>
    {PANEL.map((a, i) => (
      <g key={i} transform={`translate(${i * 540} 0) scale(0.5) translate(0 0)`}>
        <g clipPath="url(#kb-klip)">
          {a.node}
          <rect x="0" y="1760" width="1080" height="160" fill={P.ink} opacity=".85" />
          <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="54" fill={P.cream}>{a.judul}</text>
        </g>
      </g>
    ))}
    <g transform="translate(0 960) scale(0.5)">
      <g clipPath="url(#kb-klip)">{PANEL[0].node}</g>
    </g>
    <path d="M540 0V960" stroke={P.cream} strokeWidth="6" />
  </svg>
);
