// Lembar contoh Bundaran HI v2: kiri = komposisi foto acuan (spanduk terbentang, pemanjat), kanan = trotoar depan
// dengan warga + spanduk setengah terbentang (sore).
// Render: node tools/render-thumb.cjs shared/locations/bundaran-hi/v2/contoh/ContohHI.tsx shared/locations/bundaran-hi/v2/contoh/ContohHI --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { BundaranHI } from '../BundaranHI';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs><clipPath id="c"><rect width="1080" height="1920" /></clipPath></defs>
    <g transform="translate(0 240) scale(0.5)"><g clipPath="url(#c)"><BundaranHI f={f} /></g></g>
    <g transform="translate(540 240) scale(0.5)"><g clipPath="url(#c)">
      <BundaranHI f={f} spanduk={0.45} waktu="sore" depan isi={<>
        <Person who="her" appearance={4} shirtColor="#9DB3D6" x={260} y={1960} s={1.5} f={f} dir={1} gazeY={-0.6} {...POSE.her.santai} role="background" />
        <Person who="him" appearance={0} shirtColor="#C98F84" x={820} y={1980} s={1.6} f={f} dir={-1} gazeY={-0.6} {...POSE.him.bertaut} role="background" />
      </>} />
    </g></g>
    <path d="M540 240V1200" stroke={P.cream} strokeWidth="6" />
  </svg>
);
