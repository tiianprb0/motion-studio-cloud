import React from 'react';
import { P } from './rig';

export const ROOM = {
  wall: { l: -260, r: 1620, b: 1270 },
  floorY: 1270,
  mirror: { x: 52, y: 300, w: 376, h: 970 },
  board: { x: 620, y: 540, w: 360, h: 310 },
  win: { x: 1010, y: 250, w: 450, h: 650 },
  desk: { x: 1120, y: 1010, w: 440 },
  rug: { x: 800, y: 1372, rx: 350, ry: 80 },
};
export const MIRROR_PLANE = 220;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Wall = ({ warm }: { warm: number }) => (
  <g data-part="wall">
    <rect
      x={ROOM.wall.l}
      y={0}
      width={ROOM.wall.r - ROOM.wall.l}
      height={ROOM.wall.b}
      fill={P.paper}
    />
    <rect
      x={ROOM.wall.l}
      y={0}
      width={ROOM.wall.r - ROOM.wall.l}
      height={ROOM.wall.b}
      fill="url(#wallShade)"
    />
    {Array.from({ length: 11 }).map((_, i) => (
      <line
        key={i}
        x1={-140 + i * 168}
        y1={0}
        x2={-140 + i * 168}
        y2={ROOM.wall.b}
        stroke={P.line}
        strokeWidth="1.5"
        opacity=".28"
      />
    ))}
    <rect
      x={ROOM.wall.l}
      y={1035}
      width={ROOM.wall.r - ROOM.wall.l}
      height={3}
      fill={P.line}
      opacity=".35"
    />
    <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFD9A0" stopOpacity={0.55 * warm} />
      <stop offset="55%" stopColor="#FFCE93" stopOpacity={0.2 * warm} />
      <stop offset="100%" stopColor="#FFCE93" stopOpacity="0" />
    </radialGradient>
    <ellipse cx={1215} cy={1000} rx={520} ry={520} fill="url(#lampGlow)" />
    <radialGradient id="winCold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#8FB4C6" stopOpacity=".22" />
      <stop offset="100%" stopColor="#8FB4C6" stopOpacity="0" />
    </radialGradient>
    <ellipse cx={1235} cy={700} rx={520} ry={620} fill="url(#winCold)" />
  </g>
);

export const Floor = () => (
  <g data-part="floor">
    <rect
      x={ROOM.wall.l}
      y={ROOM.floorY}
      width={ROOM.wall.r - ROOM.wall.l}
      height={620}
      fill="#E6D6BD"
    />
    {Array.from({ length: 9 }).map((_, i) => {
      const spread = (i - 4) * 210;
      return (
        <path
          key={i}
          d={`M${800 + spread * 0.06} ${ROOM.floorY}L${800 + spread} 1890`}
          stroke="#CFBB9D"
          strokeWidth={2}
          opacity=".55"
          fill="none"
        />
      );
    })}
    {[1320, 1395, 1490, 1610, 1760].map((y, i) => (
      <line
        key={i}
        x1={ROOM.wall.l}
        y1={y}
        x2={ROOM.wall.r}
        y2={y}
        stroke="#CFBB9D"
        strokeWidth={i === 0 ? 3 : 2}
        opacity={i === 0 ? 0.8 : 0.45}
      />
    ))}
    <rect
      x={ROOM.wall.l}
      y={ROOM.floorY - 16}
      width={ROOM.wall.r - ROOM.wall.l}
      height={16}
      fill="#D8C6AA"
    />
    <rect
      x={ROOM.wall.l}
      y={ROOM.floorY - 16}
      width={ROOM.wall.r - ROOM.wall.l}
      height={4}
      fill="#EFE3CE"
    />
  </g>
);

export const Rug = () => (
  <g data-part="rug">
    <ellipse cx={ROOM.rug.x} cy={ROOM.rug.y} rx={ROOM.rug.rx} ry={ROOM.rug.ry} fill="#C9D4BC" />
    <ellipse
      cx={ROOM.rug.x}
      cy={ROOM.rug.y}
      rx={ROOM.rug.rx - 26}
      ry={ROOM.rug.ry - 12}
      fill="none"
      stroke="#AEC0A2"
      strokeWidth="3"
    />
    <ellipse
      cx={ROOM.rug.x}
      cy={ROOM.rug.y}
      rx={ROOM.rug.rx - 62}
      ry={ROOM.rug.ry - 26}
      fill="none"
      stroke="#AEC0A2"
      strokeWidth="2"
      opacity=".8"
    />
    {Array.from({ length: 9 }).map((_, i) => (
      <path
        key={i}
        d={`M${650 + i * 34} ${ROOM.rug.y}l16 -14 16 14 -16 14Z`}
        fill="none"
        stroke="#B7C7AA"
        strokeWidth="1.6"
        opacity=".8"
      />
    ))}
  </g>
);

export const WindowView = ({ t, open }: { t: number; open: number }) => {
  const w = ROOM.win;
  const city = [
    { x: 0.02, w: 0.13, h: 0.3 },
    { x: 0.16, w: 0.17, h: 0.46 },
    { x: 0.35, w: 0.12, h: 0.26 },
    { x: 0.49, w: 0.19, h: 0.54 },
    { x: 0.7, w: 0.13, h: 0.34 },
    { x: 0.85, w: 0.15, h: 0.44 },
  ];
  const sash = 70 * open;
  return (
    <g data-part="window">
      <rect x={w.x - 22} y={w.y - 22} width={w.w + 44} height={w.h + 44} rx="4" fill="#A9784F" />
      <rect x={w.x - 8} y={w.y - 8} width={w.w + 16} height={w.h + 16} rx="2" fill="#8E6340" />
      <g clipPath="url(#winClip)">
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22322E" />
          <stop offset="62%" stopColor="#3C5350" />
          <stop offset="100%" stopColor="#546A63" />
        </linearGradient>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="url(#nightSky)" />
        {city.map((b, i) => {
          const bx = w.x + b.x * w.w,
            bw = b.w * w.w,
            bh = b.h * w.h,
            by = w.y + w.h - bh;
          return (
            <g key={i}>
              <rect x={bx} y={by} width={bw} height={bh} fill="#2B3C38" />
              {Array.from({ length: Math.floor(bh / 34) }).map((_, r) =>
                Array.from({ length: Math.max(1, Math.floor(bw / 26)) }).map((__, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={bx + 9 + c * 26}
                    y={by + 14 + r * 34}
                    width="10"
                    height="13"
                    fill={rnd(i * 31 + r * 7 + c) > 0.55 ? '#EBC587' : '#3D524C'}
                    opacity={rnd(i * 31 + r * 7 + c) > 0.55 ? 0.55 + 0.35 * rnd(r * 5 + c) : 0.9}
                  />
                )),
              )}
            </g>
          );
        })}
        <g opacity=".85">
          <rect x={w.x + 150} y={w.y + 250} width="46" height="34" fill="#22322E" />
          <ellipse cx={w.x + 173} cy={w.y + 250} rx="23" ry="7" fill="#1B2825" />
          <path d={`M${w.x + 173} ${w.y + 250}v-10`} stroke="#1B2825" strokeWidth="3" />
        </g>
        <path
          d={`M${w.x - 4} ${w.y + 96}q120 34 200 -8t260 22`}
          stroke="#1E2C29"
          strokeWidth="2.4"
          fill="none"
          opacity=".7"
        />
        <path
          d={`M${w.x - 4} ${w.y + 122}q150 26 230 -14t250 30`}
          stroke="#1E2C29"
          strokeWidth="1.8"
          fill="none"
          opacity=".5"
        />
        {Array.from({ length: 44 }).map((_, i) => {
          const rx = w.x + rnd(i) * w.w;
          const ry = ((t * 420 + rnd(i + 9) * w.h * 1.6) % (w.h + 90)) - 45;
          const len = 18 + rnd(i + 3) * 44;
          return (
            <line
              key={i}
              x1={rx}
              y1={w.y + ry}
              x2={rx - len * 0.22}
              y2={w.y + ry + len}
              stroke="#C6DCD8"
              strokeWidth={rnd(i + 11) > 0.75 ? 2.2 : 1.3}
              opacity={0.1 + 0.22 * rnd(i + 5)}
              strokeLinecap="round"
            />
          );
        })}
        <g transform={`translate(0 ${-sash})`}>
          <rect x={w.x} y={w.y + w.h - 4} width={w.w} height={8} fill="#8E6340" />
        </g>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#9BC0C6" opacity=".07" />
        <path d={`M${w.x} ${w.y + 120}l${w.w} -90v120l${-w.w} 90Z`} fill="#FFF6E4" opacity=".05" />
      </g>
      <g fill="#8E6340">
        <rect x={w.x + w.w / 2 - 5} y={w.y} width="10" height={w.h} />
        <rect x={w.x} y={w.y + 210} width={w.w} height="9" />
        <rect
          x={w.x - 8}
          y={w.y + 470}
          width={w.w + 16}
          height="12"
          transform={`translate(0 ${-sash})`}
        />
      </g>
      <rect x={w.x - 34} y={w.y + w.h + 18} width={w.w + 68} height="18" rx="3" fill="#B4895F" />
      <rect x={w.x - 34} y={w.y + w.h + 18} width={w.w + 68} height="6" rx="3" fill="#C9A075" />
      <g data-part="sill-objects">
        <rect x={w.x + 42} y={w.y + w.h - 26} width="34" height="30" rx="5" fill="#C9D4BC" />
        <path
          d={`M${w.x + 50} ${w.y + w.h - 26}q4 -20 18 -26M${w.x + 62} ${w.y + w.h - 26}q-2 -22 -8 -30`}
          stroke="#7E9B82"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <rect x={w.x + 330} y={w.y + w.h - 20} width="62" height="8" rx="2" fill={P.wine} />
        <rect x={w.x + 334} y={w.y + w.h - 28} width="52" height="8" rx="2" fill="#6F8A7C" />
        <rect x={w.x + 336} y={w.y + w.h - 35} width="46" height="7" rx="2" fill={P.gold} />
      </g>
    </g>
  );
};

export const Desk = ({ mug }: { mug: boolean }) => {
  const d = ROOM.desk;
  return (
    <g data-part="desk">
      <rect x={d.x - 14} y={d.y - 4} width={d.w + 28} height="26" rx="3" fill={P.wood} />
      <rect x={d.x - 14} y={d.y - 4} width={d.w + 28} height="7" rx="3" fill="#CDA37D" />
      <rect x={d.x - 6} y={d.y + 22} width={d.w + 12} height="16" fill="#A57C57" />
      <rect x={d.x + 22} y={d.y + 40} width="26" height={ROOM.floorY - d.y - 40} fill="#A57C57" />
      <rect
        x={d.x + d.w - 48}
        y={d.y + 40}
        width="26"
        height={ROOM.floorY - d.y - 40}
        fill="#A57C57"
      />
      <rect
        x={d.x + 22}
        y={d.y + 40}
        width="9"
        height={ROOM.floorY - d.y - 40}
        fill="#B88D66"
        opacity=".7"
      />
      <rect x={d.x + 90} y={d.y + 46} width="150" height="72" rx="4" fill="#C19871" />
      <rect x={d.x + 90} y={d.y + 46} width="150" height="14" rx="4" fill="#D2AA83" />
      <circle cx={d.x + 165} cy={d.y + 86} r="7" fill={P.ink} opacity=".55" />
      <g data-part="desk-books">
        <rect x={d.x + 336} y={d.y - 30} width="86" height="10" rx="2" fill={P.wine} />
        <rect x={d.x + 330} y={d.y - 46} width="96" height="10" rx="2" fill="#6F8A7C" />
        <rect x={d.x + 338} y={d.y - 60} width="80" height="9" rx="2" fill={P.gold} />
      </g>
      <g data-part="desk-papers">
        <rect
          x={d.x + 42}
          y={d.y - 22}
          width="96"
          height="12"
          rx="2"
          fill={P.cream}
          transform="rotate(-4 90 0)"
        />
        <rect
          x={d.x + 46}
          y={d.y - 30}
          width="92"
          height="12"
          rx="2"
          fill="#FFF3DF"
          transform="rotate(3 92 0)"
        />
        <path
          d={`M${d.x + 54} ${d.y - 24}h60M${d.x + 54} ${d.y - 18}h44`}
          stroke={P.line}
          strokeWidth="1.6"
        />
      </g>
      {mug && (
        <g data-part="desk-mug">
          <Mug x={d.x + 276} y={d.y - 6} s={1} steam={0} />
        </g>
      )}
      <Lamp x={d.x + 424} y={d.y - 4} />
    </g>
  );
};

export const Mug = ({ x, y, s, steam }: { x: number; y: number; s: number; steam: number }) => (
  <g data-prop="mug" transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="2" rx="21" ry="5" fill={P.ink} opacity=".14" />
    <path d="M-19 -40h38l-4 34a15 15 0 01-30 0Z" fill={P.wine} />
    <path d="M-19 -40h38l-2 12h-34Z" fill="#A15263" />
    <path
      d="M19 -32q14 2 12 14t-16 10"
      stroke={P.wine}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {steam > 0 &&
      [0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${-8 + i * 8} -46q${6 - i * 3} -14 0 -26`}
          stroke="#FFF6E6"
          strokeWidth="2.4"
          fill="none"
          opacity={steam * 0.5}
          strokeLinecap="round"
          transform={`translate(0 ${-steam * 4 * Math.sin(steam * 9 + i)})`}
        />
      ))}
  </g>
);

export const Lamp = ({ x, y }: { x: number; y: number }) => (
  <g data-part="lamp">
    <ellipse cx={x} cy={y + 2} rx="30" ry="7" fill={P.ink} opacity=".12" />
    <rect x={x - 6} y={y - 96} width="12" height="96" fill="#55665E" />
    <path d={`M${x} ${y - 96}l-42 -50`} stroke="#55665E" strokeWidth="10" strokeLinecap="round" />
    <path d={`M${x - 62} ${y - 162}l44 26 -12 16 -44 -26Z`} fill={P.ink} />
    <path d={`M${x - 76} ${y - 148}l22 40 16 -12 -22 -40Z`} fill="#33443D" />
    <ellipse cx={x - 57} cy={y - 118} rx="15" ry="6" fill="#FFE2B0" opacity=".95" />
    <path d={`M${x - 82} ${y}l52 -88 18 12 -50 76Z`} fill="#FFD79C" opacity=".16" />
  </g>
);

export const Laptop = ({ x, y, screen }: { x: number; y: number; screen: number }) => (
  <g data-prop="laptop">
    <ellipse cx={x + 60} cy={y + 4} rx="86" ry="9" fill={P.ink} opacity=".13" />
    <rect x={x - 26} y={y - 8} width="172" height="12" rx="3" fill="#4E6159" />
    <rect x={x - 26} y={y - 8} width="172" height="4" rx="2" fill="#6A7F76" />
    <g
      transform={`translate(${x + 4} ${y - 8}) skewX(-4) scale(1 ${0.12 + 0.88 * screen}) translate(0 ${-160 * (1 - screen)})`}
    >
      <rect x="0" y="-152" width="146" height="146" rx="5" fill="#33443D" />
      <rect x="6" y="-146" width="134" height="134" rx="3" fill={P.cream} />
      {screen > 0.5 && (
        <g opacity={(screen - 0.5) * 2}>
          <rect x="6" y="-146" width="134" height="20" fill="#E7DFCE" />
          <circle cx="16" cy="-136" r="4" fill={P.sage} />
          <rect x="26" y="-139" width="42" height="6" rx="3" fill="#B9B098" />
          <rect x="16" y="-116" width="82" height="26" rx="6" fill={P.ink} />
          <rect x="24" y="-108" width="60" height="5" rx="2.5" fill={P.cream} />
          <rect x="24" y="-99" width="38" height="5" rx="2.5" fill="#CFC7B4" />
          <rect x="62" y="-80" width="66" height="20" rx="6" fill="#DCE4D4" />
          <rect x="70" y="-73" width="48" height="5" rx="2.5" fill="#8B9F8E" />
          <circle cx="122" cy="-46" r="4" fill={P.sage} />
          <path
            d="M118 -46l3 3 5 -7"
            stroke={P.cream}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="16" y="-40" width="52" height="5" rx="2.5" fill="#C9C1AE" />
        </g>
      )}
      <rect x="0" y="-152" width="146" height="146" rx="5" fill="#BFD6DA" opacity=".07" />
    </g>
  </g>
);

type Note = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  kind: 'dense' | 'lines' | 'quote';
  text?: string;
  ink?: string;
};
export const NOTES: Note[] = [
  { x: 656, y: 572, w: 100, h: 88, rot: -4, kind: 'quote', text: 'kamu egois' },
  { x: 772, y: 566, w: 104, h: 92, rot: 3, kind: 'lines' },
  { x: 886, y: 578, w: 92, h: 84, rot: 5, kind: 'dense' },
  { x: 646, y: 676, w: 112, h: 96, rot: 2, kind: 'dense' },
  { x: 768, y: 672, w: 122, h: 98, rot: -3, kind: 'quote', text: 'kamu berubah' },
  { x: 896, y: 684, w: 90, h: 88, rot: 4, kind: 'lines' },
  { x: 650, y: 784, w: 104, h: 74, rot: -2, kind: 'quote', text: 'kamu dingin' },
  { x: 768, y: 790, w: 116, h: 80, rot: 3, kind: 'dense', ink: P.wine },
  { x: 894, y: 796, w: 84, h: 70, rot: -5, kind: 'lines' },
];

export const Board = ({
  notes,
}: {
  notes: { dx: number; dy: number; rot: number; a: number }[];
}) => {
  const b = ROOM.board;
  return (
    <g data-part="board">
      <rect x={b.x - 12} y={b.y - 12} width={b.w + 24} height={b.h + 24} rx="4" fill={P.wood} />
      <rect x={b.x - 6} y={b.y - 6} width={b.w + 12} height={b.h + 12} rx="2" fill="#A57C57" />
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#CBAA80" />
      {Array.from({ length: 90 }).map((_, i) => (
        <circle
          key={i}
          cx={b.x + rnd(i * 3) * b.w}
          cy={b.y + rnd(i * 3 + 1) * b.h}
          r="1.4"
          fill="#B08F66"
          opacity=".6"
        />
      ))}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#7A5F3E" opacity=".06" />
      {NOTES.map((n, i) => {
        const s = notes[i] || { dx: 0, dy: 0, rot: 0, a: 1 };
        if (s.a <= 0.01) return null;
        return (
          <g
            key={i}
            opacity={s.a}
            transform={`translate(${n.x + s.dx} ${n.y + s.dy}) rotate(${n.rot + s.rot} ${n.w / 2} ${n.h / 2})`}
          >
            <rect
              x="0"
              y="0"
              width={n.w}
              height={n.h}
              rx="2"
              fill={n.ink ? '#FFF1E4' : P.cream}
              stroke={P.line}
              strokeWidth="1"
            />
            <rect x={n.w - 16} y="-6" width="14" height="10" fill={P.gold} opacity=".35" />
            {n.kind === 'quote' ? (
              <text
                x={7}
                y={n.h * 0.55}
                fontFamily="Lato"
                fontWeight="700"
                fontSize={n.w / (n.text!.length * 0.52)}
                fill={n.ink || P.ink}
              >{`“${n.text}”`}</text>
            ) : n.kind === 'dense' ? (
              Array.from({ length: Math.floor(n.h / 13) }).map((_, r) => (
                <rect
                  key={r}
                  x={8}
                  y={12 + r * 13}
                  width={n.w - 16 - (r % 3) * 14}
                  height="2.6"
                  rx="1.3"
                  fill={n.ink || '#6E7F72'}
                  opacity=".75"
                />
              ))
            ) : (
              Array.from({ length: Math.max(2, Math.floor(n.h / 18)) }).map((_, r) => (
                <rect
                  key={r}
                  x={8}
                  y={14 + r * 18}
                  width={n.w - 16 - (r % 2) * 20}
                  height="3"
                  rx="1.5"
                  fill="#7C8B7E"
                  opacity=".7"
                />
              ))
            )}
            <circle cx={n.w / 2} cy={6} r="4.6" fill={P.wine} />
            <circle cx={n.w / 2 - 1.4} cy={4.6} r="1.5" fill="#E8A9A2" opacity=".9" />
          </g>
        );
      })}
    </g>
  );
};

export const Chair = () => (
  <g data-part="chair">
    <g opacity=".96">
      <path d="M150 1258l64 -6 16 300 -58 8Z" fill="#8A6A4A" />
      <path d="M470 1250l66 8 -18 300 -58 -8Z" fill="#8A6A4A" />
      <path d="M164 1290q150 -54 322 -18l-24 118q-140 -30 -282 8Z" fill="#B08A63" />
      <path d="M170 1296q148 -50 310 -16" stroke="#C6A177" strokeWidth="6" fill="none" />
      <path d="M96 1640q140 -70 320 -30l26 96q-170 -34 -330 44Z" fill="#A77F58" />
      <path d="M118 1600q120 -48 306 -22" stroke="#8A6A4A" strokeWidth="5" fill="none" />
      <path d="M232 1360q96 -34 190 -12l14 210q-96 -22 -196 8Z" fill="#9E8B78" />
      <path d="M244 1372q88 -30 172 -10l10 150q-88 -18 -178 8Z" fill="#B6A48F" opacity=".7" />
    </g>
  </g>
);

export const Plant = ({ t }: { t: number }) => (
  <g data-part="plant">
    <path d="M300 -14q60 40 66 92" stroke="#7E9B82" strokeWidth="3" fill="none" />
    {Array.from({ length: 7 }).map((_, i) => {
      const sw = Math.sin(t * 0.8 + i) * 6;
      const bx = 330 + i * 12 + sw,
        by = 40 + i * 26;
      return (
        <g key={i}>
          <path d={`M${bx - 6} ${by}q22 -8 34 6`} stroke="#7E9B82" strokeWidth="2" fill="none" />
          <ellipse
            cx={bx}
            cy={by}
            rx="17"
            ry="11"
            fill={i % 2 ? '#8FB098' : '#7E9B82'}
            transform={`rotate(${-18 + i * 4} ${bx} ${by})`}
          />
        </g>
      );
    })}
    <ellipse cx={300} cy={8} rx="34" ry="10" fill="#C9D4BC" />
    <path d="M268 -6h64l-8 66a24 24 0 01-48 0Z" fill="#D9C6AC" />
    <path d="M268 -6h64l-3 18h-58Z" fill="#C7B296" />
  </g>
);

export const Mirror = ({
  t,
  stage,
  plaque,
  children,
}: {
  t: number;
  stage: number;
  plaque: [number, number, number];
  children: React.ReactNode;
}) => {
  const m = ROOM.mirror;
  const inner = { x: m.x + 20, y: m.y + 22, w: m.w - 40, h: m.h - 44 };
  const curtain = stage;
  return (
    <g data-part="mirror" transform={`rotate(-1.7 ${m.x + m.w / 2} ${m.h + m.y})`}>
      <rect x={m.x} y={m.y + 40} width={m.w} height={m.h - 40} rx="10" fill={P.wood} />
      <path
        d={`M${m.x} ${m.y + 40}q0 -40 ${m.w / 2} -40t${m.w / 2} 40v${m.h - 40}h${-m.w}Z`}
        fill={P.wood}
      />
      <path
        d={`M${m.x + 8} ${m.y + 44}q0 -32 ${m.w / 2 - 8} -32t${m.w / 2 - 8} 32v${m.h - 44}h${-m.w + 16}Z`}
        fill="#A57C57"
      />
      <path
        d={`M${m.x + 14} ${m.y + 46}q0 -26 ${m.w / 2 - 14} -26t${m.w / 2 - 14} 26v${m.h - 46}h${-m.w + 28}Z`}
        fill={P.gold}
        opacity=".55"
      />
      <defs>
        <clipPath id="mirrorClip">
          <path
            d={`M${inner.x} ${inner.y + 20}q0 -20 ${inner.w / 2} -20t${inner.w / 2} 20v${inner.h - 20}h${-inner.w}Z`}
          />
        </clipPath>
        <linearGradient id="mirrorGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A4A44" />
          <stop offset="55%" stopColor="#2E3D38" />
          <stop offset="100%" stopColor="#455A52" />
        </linearGradient>
      </defs>
      <g clipPath="url(#mirrorClip)">
        <path
          d={`M${inner.x} ${inner.y + 20}q0 -20 ${inner.w / 2} -20t${inner.w / 2} 20v${inner.h - 20}h${-inner.w}Z`}
          fill="url(#mirrorGlass)"
        />
        <g opacity={1 - 0.55 * curtain}>{children}</g>
        {curtain > 0.01 && (
          <g data-part="theatre" opacity={curtain}>
            <rect
              x={inner.x}
              y={inner.y}
              width={inner.w}
              height={inner.h}
              fill="#20120F"
              opacity=".55"
            />
            <rect
              x={inner.x}
              y={inner.y + 96}
              width={inner.w}
              height={inner.h - 96}
              fill="#EAD8B9"
              opacity=".92"
            />
            <rect
              x={inner.x}
              y={inner.y + 96}
              width={inner.w}
              height="8"
              fill={P.wine}
              opacity=".6"
            />
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d={`M${inner.x} ${inner.y + 100 + i * 26}q${inner.w / 2} ${18 + i * 2} ${inner.w} 0`}
                stroke="#D9C6A6"
                strokeWidth="1.6"
                fill="none"
                opacity=".5"
              />
            ))}
            <rect x={inner.x} y={inner.y} width={inner.w * 0.27} height={inner.h} fill={P.wine} />
            <rect
              x={inner.x + inner.w * 0.73}
              y={inner.y}
              width={inner.w * 0.27}
              height={inner.h}
              fill={P.wine}
            />
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <path
                  d={`M${inner.x + i * inner.w * 0.045} ${inner.y}v${inner.h}`}
                  stroke="#7A3546"
                  strokeWidth="6"
                  opacity=".55"
                />
                <path
                  d={`M${inner.x + inner.w - i * inner.w * 0.045} ${inner.y}v${inner.h}`}
                  stroke="#7A3546"
                  strokeWidth="6"
                  opacity=".55"
                />
              </g>
            ))}
            <path d={`M${inner.x} ${inner.y}v44h${inner.w}v-44Z`} fill="#6E2F3E" />
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={inner.x + (inner.w * (i + 0.5)) / 5}
                cy={inner.y + 44}
                r={inner.w / 12}
                fill="#6E2F3E"
              />
            ))}
            <path
              d={`M${inner.x} ${inner.y + 44}h${inner.w}`}
              stroke={P.gold}
              strokeWidth="3"
              opacity=".8"
            />
            <rect
              x={inner.x}
              y={inner.y + inner.h - 78}
              width={inner.w}
              height="78"
              fill="#8B6A46"
            />
            <rect
              x={inner.x}
              y={inner.y + inner.h - 78}
              width={inner.w}
              height="6"
              fill="#B98F60"
            />
            {Array.from({ length: 7 }).map((_, i) => (
              <circle
                key={i}
                cx={inner.x + 22 + (i * (inner.w - 44)) / 6}
                cy={inner.y + inner.h - 84}
                r="6"
                fill="#FFD79C"
                opacity=".9"
              />
            ))}
            <path
              d={`M${inner.x + inner.w * 0.5} ${inner.y + 46}l${inner.w * 0.46} ${inner.h - 130}h${-inner.w * 0.92}Z`}
              fill="#FFE7B8"
              opacity=".14"
            />
            {[0.16, 0.5, 0.84].map((fx, i) => {
              const a = plaque[i];
              if (a <= 0.01) return null;
              return (
                <g
                  key={i}
                  opacity={a}
                  transform={`translate(${inner.x + inner.w * fx} ${inner.y + 66}) scale(${0.85 + 0.15 * a})`}
                >
                  <rect x="-34" y="-13" width="68" height="26" rx="3" fill={P.gold} />
                  <rect x="-31" y="-10" width="62" height="20" rx="2" fill="#6E2F3E" />
                  <text
                    y="4"
                    textAnchor="middle"
                    fontFamily="Lato"
                    fontWeight="900"
                    fontSize="14"
                    fill={P.gold}
                    letterSpacing="1"
                  >
                    {['SALAH', 'JAHAT', 'MENYEBALKAN'][i]}
                  </text>
                </g>
              );
            })}
          </g>
        )}
        <path
          d={`M${inner.x + inner.w * 0.08} ${inner.y}h40l-96 700h-40Z`}
          fill="#FFF6E4"
          opacity=".06"
        />
        <path
          d={`M${inner.x + inner.w * 0.34} ${inner.y}h16l-84 700h-16Z`}
          fill="#FFF6E4"
          opacity=".05"
        />
        <path
          d={`M${inner.x} ${inner.y + 20}q0 -20 ${inner.w / 2} -20t${inner.w / 2} 20v${inner.h - 20}h${-inner.w}Z`}
          fill="none"
          stroke="#1E2B27"
          strokeWidth="3"
          opacity=".35"
        />
      </g>
    </g>
  );
};
