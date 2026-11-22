// Pemeran dan label bersama untuk contoh banding 3D vs 2D (11 Nov 2026). Dua sisi memakai tokoh, pose, dan properti yang sama
// persis; yang berbeda hanya dunianya (Dunia3D vs panggung flat + Cahaya2D).
import React from 'react';
import { P } from '../../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../../characters/rig/v2/Character';
import { POSE } from '../../../../../characters/rig/v2/poses';
import { Kucing } from '../../../../../characters/kucing/v1/Kucing';
import { PhoneInHand } from '../../../../../props/harian/v1/Props';
import { Mug } from '../../../../../props/minum/v1/Minum';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
export const TOTAL = 150;
export const OUTRO = 150;
export const SHOTS: [number, string][] = [[0, 'banding']];
export const shotAt = (_f: number) => ({ shot: 'banding' });
export const u = (f: number) => {
  const t = Math.min(1, Math.max(0, f / (TOTAL - 1)));
  return t * t * (3 - 2 * t);
};
type Q = { x: number; y: number; s: number };
export const yan = (f: number) => (q: Q) => (
  <Person who="him" x={q.x} y={q.y} s={q.s} f={f} view="three" dir={1} mood="thinking" gaze={0.5} gazeY={0.8} role="principal" {...POSE.him.pegangDepanDada} holdRight={<PhoneInHand s={1} />} />
);
export const rus = (f: number) => (q: Q) => (
  <Person who="him" appearance={0} shirtColor="#8B6B4A" trouserColor="#3E3A36" x={q.x} y={q.y} s={q.s} f={f + 21} view="three" dir={-1} mood="thinking" gaze={-1} role="background" {...POSE.him.pegangDepanDada} holdRight={<g transform="translate(0 6)"><Mug s={0.45} /></g>} />
);
export const kucing = (f: number) => (q: Q) => <Kucing x={q.x} y={q.y} s={q.s} f={f} pose="duduk" gaze={-0.3} />;
export const Label = ({ teks, sub }: { teks: string; sub: string }) => (
  <g>
    <rect x="40" y="96" width={teks.length * 30 + 60} height="86" rx="43" fill={P.ink} opacity=".88" />
    <text x="70" y="153" fontFamily="Lato" fontWeight="900" fontSize="46" fill={P.cream}>{teks}</text>
    <text x="44" y="230" fontFamily="Lato" fontWeight="700" fontSize="32" fill={P.ink} stroke={P.cream} strokeWidth="8" paintOrder="stroke">{sub}</text>
  </g>
);
