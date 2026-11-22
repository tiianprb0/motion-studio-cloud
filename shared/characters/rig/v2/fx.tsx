// popIn dan Mark (tanda reaksi bintang), disalin dari Proto.tsx proyek v7 Kurang Yakin.
import React from 'react';
import { unit, P } from './Character';

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

// Gelembung bicara tokoh (gaya v7 Kurang Yakin, disalin dari Proto.tsx). Koordinat dunia; tip = ujung ekor dekat mulut.
export const Bubble = ({
  f,
  a,
  b,
  x,
  y,
  tip,
  text,
}: {
  f: number;
  a: number;
  b: number;
  x: number;
  y: number;
  tip: [number, number];
  text: string;
}) => {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const w = text.length * 13.6 + 40,
    h = 58;
  return (
    <g
      opacity={o}
      transform={`translate(${tip[0]} ${tip[1]}) scale(${s}) translate(${-tip[0]} ${-tip[1]})`}
      data-fx="bubble"
    >
      <path
        d={`M${x - 14} ${y + h / 2 - 2}L${tip[0]} ${tip[1]}L${x + 16} ${y + h / 2 - 2}Z`}
        fill="#FCF7EC"
        stroke="#DCCFB6"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill="#FCF7EC"
        stroke="#DCCFB6"
        strokeWidth="3"
      />
      <path d={`M${x - 13} ${y + h / 2 - 3.5}h26`} stroke="#FCF7EC" strokeWidth="5" />
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontFamily="Lato"
        fontWeight="900"
        fontSize="25"
        fill={P.ink}
      >
        {text}
      </text>
    </g>
  );
};
