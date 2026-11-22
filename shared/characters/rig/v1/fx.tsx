// popIn dan Mark (tanda reaksi bintang), disalin dari Proto.tsx proyek v7 Kurang Yakin.
import React from 'react';
import { unit } from './Character';

export const popIn = (f: number, a: number, b: number) => {
  const x = unit((f - a) / 7);
  const out = 1 - unit((f - (b - 6)) / 6);
  const back = 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  return { s: Math.max(0, back) * out, o: Math.min(1, x * 2) * out };
};
export const Mark = ({
  f,
  a,
  b,
  x,
  y,
  ch,
  color,
  rot,
}: {
  f: number;
  a: number;
  b: number;
  x: number;
  y: number;
  ch: string;
  color: string;
  rot: number;
}) => {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const wob = Math.sin((f - a) * 0.5) * 3 * (1 - unit((f - a) / 20));
  const pts = Array.from({ length: 22 }, (_, i) => {
    const r = i % 2 ? 26 : 38 + (i % 4 === 0 ? 4 : 0);
    const t = (i / 22) * Math.PI * 2;
    return `${(Math.cos(t) * r).toFixed(1)} ${(Math.sin(t) * r).toFixed(1)}`;
  });
  return (
    <g
      opacity={o}
      transform={`translate(${x} ${y}) rotate(${rot + wob}) scale(${s})`}
      data-fx={`mark-${ch}`}
    >
      <path d={`M${pts.join('L')}Z`} fill={color} />
      <text
        y="15"
        textAnchor="middle"
        fontFamily="Lato"
        fontWeight="900"
        fontSize="44"
        fill="#FCF7EC"
      >
        {ch}
      </text>
    </g>
  );
};
