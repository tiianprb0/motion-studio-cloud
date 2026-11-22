// Lembar contoh warga Papua (extras v3, KANDIDAT, 18 Nov 2026). Naya di kiri sebagai pembanding skala dan gaya.
// Render: node tools/render-thumb.cjs shared/characters/extras/v3/contoh/LembarWargaPapua.tsx shared/characters/extras/v3/contoh/LembarWargaPapua --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../rig/v3/Character';
import { POSE } from '../../../rig/v3/poses';
import { WargaPapua, WARGA_PAPUA } from '../WargaPapua';
import { Masker } from '../../../../props/kesehatan/v1/Masker';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 30;
const S = 1.05;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <text x="540" y="150" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="52" fill={P.ink}>Warga Papua · kandidat</text>
    <g>
      <Person who="her" x={180} y={860} s={S} f={f} view="three" dir={1} mood="soft" role="principal" {...POSE.her.santai} />
      <text x="180" y="920" textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="26" fill={P.ink}>Naya (pembanding)</text>
    </g>
    {WARGA_PAPUA.map((w, i) => {
      const x = [540, 880, 180, 540, 880][i],
        y = [860, 860, 1560, 1560, 1560][i];
      const pose = w.who === 'her' ? POSE.her.santai : POSE.him.santai;
      return (
        <g key={w.id}>
          <WargaPapua id={w.id} x={x} y={y} s={S} f={f} view="three" dir={i % 2 ? -1 : 1} mood="soft" {...pose} />
          {i === 4 && <Masker x={x} y={y} s={S} dir={i % 2 ? -1 : 1} />}
          <text x={x} y={y + 60} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.ink}>{w.id}</text>
          <text x={x} y={y + 96} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="20" fill={P.ink}>{w.nama.split(',').slice(0, 2).join(',')}</text>
        </g>
      );
    })}
  </svg>
);
