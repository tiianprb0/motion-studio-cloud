// Lembar contoh kucing oranye callback (7 Nov 2026, disetujui pengguna).
// Render: node tools/render-thumb.cjs shared/characters/kucing/v1/contoh/ContohKucing.tsx shared/characters/kucing/v1/contoh/ContohKucing --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../rig/v2/Character';
import { POSE } from '../../../rig/v2/poses';
import { Kucing } from '../Kucing';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 30;
const Label = ({ x, y, t }: { x: number; y: number; t: string }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill={P.ink}>{t}</text>
);
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    {/* close-up detail */}
    <rect y="560" width="1080" height="80" fill="#E9DCC5" />
    <Kucing x={540} y={600} s={7} f={f} gaze={-0.4} id="k-besar" />
    <Label x={540} y={680} t="duduk (close-up, s = 7)" />
    {/* tiga pose */}
    <rect y="860" width="1080" height="70" fill="#E9DCC5" />
    <Kucing x={180} y={900} s={3.2} f={f} id="k1" />
    <Kucing x={540} y={900} s={3.2} f={f} pose="tidur" id="k2" />
    <Kucing x={880} y={900} s={3.2} f={f} pose="jalan" dir={-1} id="k3" />
    <Label x={180} y={975} t="duduk" />
    <Label x={540} y={975} t="tidur" />
    <Label x={880} y={975} t="jalan (dir -1)" />
    {/* skala dengan tokoh di garis lantai yang sama */}
    <rect y="1060" width="1080" height="860" fill="#F1E6D3" />
    <rect y="1600" width="1080" height="320" fill="#D9C8AE" />
    <Person who="her" x={420} y={1640} s={1.6} f={f} mood="warm" gaze={0.6} gazeY={0.6} {...POSE.her.santai} />
    <Kucing x={640} y={1640} s={1.6} f={f} gaze={-0.8} id="k4" />
    <Label x={540} y={1760} t="skala: s kucing = s tokoh (1,6)" />
  </svg>
);
