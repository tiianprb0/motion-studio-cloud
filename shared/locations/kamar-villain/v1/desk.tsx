import React from 'react';
import { P } from './rig';
import { ROOM, Mug } from './world';
import { Laptop } from './devices';

/** Meja kerja solid: permukaan + badan meja penuh (bukan rangka berkaki),
 *  supaya orang yang berdiri di belakangnya terbaca "di balik meja",
 *  bukan mengambang atau menembus. */
export const Desk = ({
  layer,
  laptop,
}: {
  layer: 'back' | 'front';
  laptop?: { open: number; msg: number };
}) => {
  const d = ROOM.desk;
  const left = d.x + 10,
    right = d.x + d.w - 10;
  if (layer === 'back') {
    return (
      <g data-part="desk-back">
        <rect x={d.x - 14} y={d.y - 4} width={d.w + 28} height="28" rx="3" fill={P.wood} />
        <rect x={d.x - 14} y={d.y - 4} width={d.w + 28} height="8" rx="3" fill="#D2AB84" />
        <rect x={d.x - 14} y={d.y + 24} width={d.w + 28} height="4" fill="#8A6444" />
        <g data-part="desk-books">
          <rect x={d.x + 292} y={d.y - 33} width="74" height="11" rx="2" fill={P.wine} />
          <rect x={d.x + 286} y={d.y - 46} width="84" height="10" rx="2" fill="#6F8A7C" />
          <rect x={d.x + 294} y={d.y - 58} width="70" height="9" rx="2" fill={P.gold} />
        </g>
        <g data-part="desk-papers">
          <rect
            x={d.x + 200}
            y={d.y - 20}
            width="86"
            height="11"
            rx="2"
            fill={P.cream}
            transform={`rotate(-4 ${d.x + 240} ${d.y - 14})`}
          />
          <rect
            x={d.x + 206}
            y={d.y - 28}
            width="80"
            height="11"
            rx="2"
            fill="#FFF3DF"
            transform={`rotate(3 ${d.x + 244} ${d.y - 22})`}
          />
        </g>
        {laptop && <Laptop x={d.x + 40} y={d.y + 6} open={laptop.open} msg={laptop.msg} />}
        <Mug x={d.x + 250} y={d.y - 4} s={0.9} steam={0.5} />
        <g data-part="lamp">
          <ellipse cx={d.x + 400} cy={d.y + 2} rx="28" ry="7" fill={P.ink} opacity=".12" />
          <rect x={d.x + 394} y={d.y - 92} width="12" height="92" fill="#55665E" />
          <path
            d={`M${d.x + 400} ${d.y - 92}l-40 -48`}
            stroke="#55665E"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path d={`M${d.x + 340} ${d.y - 156}l44 26 -12 16 -44 -26Z`} fill={P.ink} />
          <path d={`M${d.x + 326} ${d.y - 142}l22 40 16 -12 -22 -40Z`} fill="#33443D" />
          <ellipse cx={d.x + 411} cy={d.y - 112} rx="15" ry="6" fill="#FFE2B0" opacity=".95" />
        </g>
      </g>
    );
  }
  return (
    <g data-part="desk-front">
      <rect x={left} y={d.y + 28} width={right - left} height="216" fill="#B08660" />
      <rect x={left} y={d.y + 28} width={right - left} height="10" fill="#C29872" />
      <rect
        x={left + 8}
        y={d.y + 46}
        width={(right - left) / 2 - 22}
        height="86"
        rx="3"
        fill="#BE9670"
      />
      <rect
        x={left + 8}
        y={d.y + 46}
        width={(right - left) / 2 - 22}
        height="8"
        rx="3"
        fill="#CEA87F"
      />
      <circle cx={left + (right - left) / 4} cy={d.y + 94} r="7" fill={P.ink} opacity=".5" />
      <rect
        x={left + (right - left) / 2 + 14}
        y={d.y + 46}
        width={(right - left) / 2 - 22}
        height="86"
        rx="3"
        fill="#BE9670"
      />
      <rect
        x={left + (right - left) / 2 + 14}
        y={d.y + 46}
        width={(right - left) / 2 - 22}
        height="8"
        rx="3"
        fill="#CEA87F"
      />
      <circle cx={left + (right - left) * 0.75} cy={d.y + 94} r="7" fill={P.ink} opacity=".5" />
      <rect x={left} y={d.y + 150} width={right - left} height="94" fill="#A87C57" />
      <rect x={left} y={d.y + 150} width={right - left} height="6" fill="#B98F68" />
      <rect x={left} y={d.y + 244} width={right - left} height="26" fill="#8F6647" />
      <ellipse
        cx={d.x + d.w / 2}
        cy={ROOM.floorY + 4}
        rx={d.w * 0.46}
        ry="12"
        fill={P.ink}
        opacity=".08"
      />
    </g>
  );
};
