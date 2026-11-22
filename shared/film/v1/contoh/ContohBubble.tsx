// LEMBAR CONTOH (7 Nov 2026): bubble lama vs bubble baru gaya Kok Bisa?. Render: node tools/render-thumb.cjs <ini> <out> --only
import React from 'react';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../characters/rig/v2/Character';
import { POSE } from '../../../characters/rig/v2/poses';
import { Bubble as BubbleLama } from '../../../characters/rig/v2/fx';
import { SpeechBubble } from '../../../ui/v1/UI';
import { P } from '../../../core/v1/core';
import { GlassPane, WallGrain } from '../../../locations/_detail/v2/Detail';
import { Bubble } from '../Bubble';
import { Half } from './Bagian';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 20;
const Room = ({ y0 }: { y0: number }) => (
  <g>
    <WallGrain x={0} y={y0} w={1080} h={960} />
    <GlassPane x={430} y={y0 + 300} w={260} h={330} f={f} />
    <rect x="0" y={y0 + 830} width="1080" height="130" fill="#D9C8AE" />
    <Person who="her" x={260} y={y0 + 1170} s={2.3} f={f} mood="annoyed" gaze={0.6} head={3} flush={{ color: '#E98A80', amt: 0.7 }} {...POSE.her.pinggang} />
    <Person who="him" x={820} y={y0 + 1170} s={2.3} f={f} dir={-1} mood="unsure" gaze={-0.6} head={-3} {...POSE.him.santai} />
  </g>
);
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <Half y0={0} title="LAMA: pil bergaris tepi, huruf kecil">
      <Room y0={0} />
      <BubbleLama f={f} a={0} b={200} x={250} y={250} tip={[270, 330]} text="Serius?!" />
      <SpeechBubble f={f} a={0} b={200} x={770} y={250} tip={[800, 330]} text="Iya, maaf ya, aku lupa." size={30} />
    </Half>
    <Half y0={960} title="BARU: gaya Kok Bisa?">
      <Room y0={960} />
      <Bubble f={f} a={0} b={200} x={250} y={960 + 235} tip={[300, 960 + 330]} text="Serius?!" />
      <Bubble f={f} a={0} b={200} x={790} y={960 + 235} tip={[790, 960 + 330]} text="Maaf..." />
    </Half>
  </svg>
);
