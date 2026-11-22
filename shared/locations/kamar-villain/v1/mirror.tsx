import React from 'react';
import { P } from './rig';
import { ROOM } from './world';

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Mirror = jendela ke "cerita orang lain".
 * Lapisan: kaca -> latar panggung -> bayangan -> lantai panggung -> tirai/plakat -> penonton -> kilau kaca.
 */
export const Mirror = ({
  stage,
  close,
  plaque,
  children,
}: {
  stage: number;
  close: number;
  plaque: [number, number, number];
  children: React.ReactNode;
}) => {
  const m = ROOM.mirror;
  const inner = { x: m.x + 20, y: m.y + 22, w: m.w - 40, h: m.h - 44 };
  const panelW = inner.w * (0.27 + 0.25 * close);
  const stageFloorTop = inner.y + inner.h - 86;
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
          <stop offset="0%" stopColor="#3C4C46" />
          <stop offset="55%" stopColor="#2E3D38" />
          <stop offset="100%" stopColor="#48605A" />
        </linearGradient>
        <filter id="silhouette" x="-40%" y="-40%" width="180%" height="180%">
          <feFlood floodColor="#16211E" result="f" />
          <feComposite in="f" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <g clipPath="url(#mirrorClip)">
        <path
          d={`M${inner.x} ${inner.y + 20}q0 -20 ${inner.w / 2} -20t${inner.w / 2} 20v${inner.h - 20}h${-inner.w}Z`}
          fill="url(#mirrorGlass)"
        />
        {/* pantulan ruangan di balik kaca */}
        <g opacity={1 - 0.9 * stage}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill="#2B3833" />
          <rect
            x={inner.x + inner.w * 0.52}
            y={inner.y + 60}
            width={inner.w * 0.44}
            height={inner.h * 0.52}
            fill="#5A7380"
            opacity=".55"
          />
          <rect
            x={inner.x}
            y={inner.y + inner.h * 0.66}
            width={inner.w}
            height={inner.h * 0.34}
            fill="#24302C"
          />
          <ellipse
            cx={inner.x + inner.w * 0.3}
            cy={inner.y + inner.h * 0.5}
            rx={110}
            ry={140}
            fill="#FFD79C"
            opacity=".12"
          />
          <line
            x1={inner.x}
            y1={inner.y + inner.h * 0.66}
            x2={inner.x + inner.w}
            y2={inner.y + inner.h * 0.66}
            stroke="#182421"
            strokeWidth="3"
          />
        </g>
        {/* latar panggung kertas */}
        {stage > 0.01 && (
          <g opacity={stage}>
            <rect
              x={inner.x}
              y={inner.y}
              width={inner.w}
              height={inner.h}
              fill="#20120F"
              opacity=".5"
            />
            <rect
              x={inner.x + 10}
              y={inner.y + 92}
              width={inner.w - 20}
              height={inner.h - 178}
              fill="#EAD8B9"
            />
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d={`M${inner.x + 10} ${inner.y + 100 + i * 30}q${inner.w / 2 - 10} ${16 + i * 3} ${inner.w - 20} 0`}
                stroke="#D3BE9C"
                strokeWidth="1.6"
                fill="none"
                opacity=".55"
              />
            ))}
            <path
              d={`M${inner.x + inner.w * 0.5} ${inner.y + 46}l${inner.w * 0.5} ${inner.h - 132}h${-inner.w}Z`}
              fill="#FFE7B8"
              opacity=".22"
            />
            <path
              d={`M${inner.x + 10} ${inner.y + 92}h${inner.w - 20}`}
              stroke={P.wine}
              strokeWidth="5"
              opacity=".5"
            />
          </g>
        )}
        {children}
        {/* lantai panggung di depan bayangan */}
        {stage > 0.01 && (
          <g opacity={stage}>
            <rect x={inner.x} y={stageFloorTop} width={inner.w} height={86} fill="#8B6A46" />
            <rect x={inner.x} y={stageFloorTop} width={inner.w} height="7" fill="#BC9162" />
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={i}
                x1={inner.x}
                y1={stageFloorTop + 18 + i * 17}
                x2={inner.x + inner.w}
                y2={stageFloorTop + 18 + i * 17}
                stroke="#75583B"
                strokeWidth="1.6"
                opacity=".7"
              />
            ))}
          </g>
        )}
        {/* tirai + plakat peran */}
        {stage > 0.01 && (
          <g opacity={stage} data-part="curtain">
            <rect x={inner.x} y={inner.y} width={panelW} height={inner.h} fill={P.wine} />
            <rect
              x={inner.x + inner.w - panelW}
              y={inner.y}
              width={panelW}
              height={inner.h}
              fill={P.wine}
            />
            {Array.from({ length: 7 }).map((_, i) => (
              <g key={i}>
                <path
                  d={`M${inner.x + (i * panelW) / 7} ${inner.y}v${inner.h}`}
                  stroke="#6E2F3E"
                  strokeWidth="7"
                  opacity=".6"
                />
                <path
                  d={`M${inner.x + inner.w - (i * panelW) / 7} ${inner.y}v${inner.h}`}
                  stroke="#6E2F3E"
                  strokeWidth="7"
                  opacity=".6"
                />
              </g>
            ))}
            <path d={`M${inner.x} ${inner.y}v46h${inner.w}v-46Z`} fill="#6E2F3E" />
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={inner.x + (inner.w * (i + 0.5)) / 5}
                cy={inner.y + 46}
                r={inner.w / 13}
                fill="#6E2F3E"
              />
            ))}
            <path
              d={`M${inner.x} ${inner.y + 46}h${inner.w}`}
              stroke={P.gold}
              strokeWidth="3.5"
              opacity=".85"
            />
            {[0.16, 0.5, 0.84].map((fx, i) => {
              const a = plaque[i];
              if (a <= 0.01) return null;
              return (
                <g
                  key={i}
                  opacity={a}
                  transform={`translate(${inner.x + inner.w * fx} ${inner.y + 70}) scale(${0.8 + 0.2 * a})`}
                >
                  <rect x="-36" y="-13" width="72" height="26" rx="3" fill={P.gold} />
                  <rect x="-33" y="-10" width="66" height="20" rx="2" fill="#6E2F3E" />
                  <text
                    y="4"
                    textAnchor="middle"
                    fontFamily="Lato"
                    fontWeight="900"
                    fontSize="13"
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
        {/* penonton kertas */}
        {stage > 0.01 && (
          <g data-part="audience" opacity={stage * (1 - close)}>
            {[
              [0.1, 46],
              [0.26, 54],
              [0.42, 44],
              [0.55, 58],
              [0.69, 46],
              [0.82, 52],
              [0.94, 42],
            ].map(([fx, r], i) => {
              const cx = inner.x + inner.w * fx,
                cy = inner.y + inner.h - 8 - (i % 3) * 6;
              return (
                <g key={i}>
                  <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.92} fill="#1E1A17" />
                  <path
                    d={`M${cx - r * 1.5} ${inner.y + inner.h}h${r * 3}l-6 -${r * 0.7}q-${r * 1.2} -${r * 0.5} -${r * 1.5} 0Z`}
                    fill="#241F1B"
                  />
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={r}
                    ry={r * 0.92}
                    fill="none"
                    stroke="#3A302A"
                    strokeWidth="1.4"
                    opacity=".8"
                  />
                </g>
              );
            })}
            <rect x={inner.x} y={inner.y + inner.h - 6} width={inner.w} height="6" fill="#140F0C" />
          </g>
        )}
        {/* lampu kaki */}
        {stage > 0.01 && (
          <g opacity={stage}>
            {Array.from({ length: 7 }).map((_, i) => (
              <circle
                key={i}
                cx={inner.x + 22 + (i * (inner.w - 44)) / 6}
                cy={stageFloorTop - 4}
                r="6"
                fill="#FFD79C"
                opacity=".9"
              />
            ))}
          </g>
        )}
        <path
          d={`M${inner.x + inner.w * 0.06} ${inner.y}h44l-104 720h-44Z`}
          fill="#FFF6E4"
          opacity=".06"
        />
        <path
          d={`M${inner.x + inner.w * 0.33} ${inner.y}h16l-90 720h-16Z`}
          fill="#FFF6E4"
          opacity=".05"
        />
        <path
          d={`M${inner.x} ${inner.y + 20}q0 -20 ${inner.w / 2} -20t${inner.w / 2} 20v${inner.h - 20}h${-inner.w}Z`}
          fill="none"
          stroke="#17231F"
          strokeWidth="3"
          opacity=".3"
        />
      </g>
      <rect x={m.x + 2} y={m.y + 44} width={m.w - 4} height="6" fill="#FFF6E4" opacity=".18" />
    </g>
  );
};
