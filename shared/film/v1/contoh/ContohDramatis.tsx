// LEMBAR CONTOH (7 Nov 2026): mode dramatis tokoh — PERLU PERSETUJUAN PENGGUNA sebelum dipakai di video.
// Render: node tools/render-thumb.cjs <ini> <out> --only
import React from 'react';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../characters/rig/v2/Character';
import { POSE } from '../../../characters/rig/v2/poses';
import { P } from '../../../core/v1/core';
import { GlassPane, WallGrain } from '../../../locations/_detail/v2/Detail';
import { Dramatic, DramaBackdrop, personBox } from '../Drama';
import { Vignette } from '../Depth';
import { Half } from './Bagian';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 30;
const S = 3.4;
const Naya = ({ y0 }: { y0: number }) => <Person who="her" x={300} y={y0 + 1390} s={S} f={f} mood="hurt" gaze={0.3} gazeY={0.2} flush={{ color: '#E98A80', amt: 0.8 }} {...POSE.her.bertaut} />;
const Yan = ({ y0 }: { y0: number }) => <Person who="him" x={800} y={y0 + 1390} s={S} f={f} dir={-1} mood="unsure" gaze={-0.3} {...POSE.him.bertaut} />;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <Half y0={0} title="BIASA (flat, seperti sekarang)">
      <WallGrain x={0} y={0} w={1080} h={960} />
      <GlassPane x={430} y={140} w={240} h={300} f={f} />
      <Naya y0={0} />
      <Yan y0={0} />
    </Half>
    <Half y0={960} title="DRAMATIS (hanya momen emosi kuat)">
      <g transform="translate(0 960)"><DramaBackdrop /></g>
      <Dramatic box={personBox(300, 960 + 1390, S)} light="kiri" id="dn">
        <Naya y0={960} />
      </Dramatic>
      <Dramatic box={personBox(800, 960 + 1390, S)} light="kanan" id="dy">
        <Yan y0={960} />
      </Dramatic>
      <g transform="translate(0 960) scale(1 0.5)"><Vignette color="#000000" opacity={0.35} id="v-drama" /></g>
    </Half>
  </svg>
);
