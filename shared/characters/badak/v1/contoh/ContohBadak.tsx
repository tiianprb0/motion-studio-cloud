// Lembar contoh badak Jawa v1 (21 Nov 2026): empat pose + skala dibanding rig Naya.
// Render: node tools/render-thumb.cjs shared/characters/badak/v1/contoh/ContohBadak.tsx shared/characters/badak/v1/contoh/ContohBadak --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Badak } from '../Badak';
import { Person } from '../../../rig/v4/Character';
import { POSE } from '../../../rig/v4/poses';

const Lbl = ({ x, y, t }: { x: number; y: number; t: string }) => <text x={x} y={y} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill={P.ink}>{t}</text>;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <Badak x={300} y={420} s={0.8} f={0} pose="berdiri" id="b1" />
    <Lbl x={300} y={480} t="berdiri" />
    <Badak x={800} y={420} s={0.8} f={9} pose="jalan" dir={-1} lumpur={0.8} id="b2" />
    <Lbl x={800} y={480} t="jalan + lumpur" />
    <Badak x={300} y={860} s={0.8} f={5} pose="makan" id="b3" />
    <Lbl x={300} y={920} t="makan" />
    <Badak x={800} y={860} s={0.8} f={5} pose="kubang" dir={-1} id="b4" />
    <Lbl x={800} y={920} t="kubang" />
    <Badak x={420} y={1500} s={1.4} f={3} pose="berdiri" id="b5" />
    <Person who="her" x={860} y={1500} s={1.4} f={0} view="three" dir={-1} mood="soft" role="principal" {...POSE.her.santai} />
    <Lbl x={540} y={1600} t="skala sama dengan rig (tinggi bahu ±1,55 m)" />
  </svg>
);
