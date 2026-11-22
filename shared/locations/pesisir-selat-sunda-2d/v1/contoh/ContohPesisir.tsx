// Lembar contoh pesisir Selat Sunda v1 (21 Nov 2026): atas = siang (badak berkubang, warga, sirene mati);
// bawah = malam + gelombang + puing + sirene + jalur evakuasi (semua saklar).
// Render: node tools/render-thumb.cjs shared/locations/pesisir-selat-sunda-2d/v1/contoh/ContohPesisir.tsx shared/locations/pesisir-selat-sunda-2d/v1/contoh/ContohPesisir --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { PesisirSelatSunda2D, PESISIR } from '../PesisirSelatSunda2D';
import { Badak } from '../../../../characters/badak/v1/Badak';
import { Person } from '../../../../characters/rig/v4/Character';
import { POSE } from '../../../../characters/rig/v4/poses';

const K = 1080 / 2800;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="c1"><rect width="1080" height="950" /></clipPath>
      <clipPath id="c2"><rect y="970" width="1080" height="950" /></clipPath>
    </defs>
    <g clipPath="url(#c1)">
      <g transform={`translate(0 ${-20}) scale(${K}) translate(200 300)`}>
        <PesisirSelatSunda2D f={40} isiHutan={<Badak x={PESISIR.kubang.x} y={PESISIR.kubang.y + 10} s={1.1} f={40} pose="kubang" id="cb" />}
          isiKampung={<Person who="her" x={1750} y={PESISIR.lantaiKampung} s={1.7} f={0} view="three" dir={-1} mood="thinking" role="principal" {...POSE.her.santai} />} />
      </g>
    </g>
    <g clipPath="url(#c2)">
      <g transform={`translate(0 ${950}) scale(${K}) translate(200 300)`}>
        <PesisirSelatSunda2D id="p2" f={40} malam={1} gelombang={0.8} puing={1} sirene={1} evakuasi={1} />
      </g>
    </g>
  </svg>
);
