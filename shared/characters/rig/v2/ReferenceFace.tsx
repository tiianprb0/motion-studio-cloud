import React from 'react';
// Face geometry and palette adapted directly from the SVG supplied by the user.
export const ReferenceFace: React.FC<{
  who: string;
  view: string;
  dir: number;
  mood: string;
  blink: boolean;
  flush?: { color: string; amt: number };
  gaze: number;
  gazeY?: number;
  talk: number;
}> = ({ who, view, dir, mood, blink, gaze, gazeY = 0, talk, flush }) => {
  const girl = who === 'her',
    boy = who === 'boy',
    dad = who === 'dad',
    cx = girl ? 355 : 185,
    back = view === 'back',
    // v2: 'serong' = badan/kepala berputar ±40° ke arah dir; fitur wajah bergeser & menyempit, telinga sisi belakang tetap.
    serong = view === 'serong';
  const smile = mood === 'warm' || mood === 'soft',
    angry = mood === 'annoyed',
    hurt = mood === 'hurt' || mood === 'unsure';
  const g = Math.max(-2.4, Math.min(2.4, gaze * 1.35)),
    gy = Math.max(-1.6, Math.min(3.1, gazeY * 2.6)),
    brown = girl ? '#3D281D' : '#382E31';
  return (
    <g transform={`translate(${-cx * 0.86} ${-279 - 180 * 0.86}) scale(.86)`}>
      {back ? null : girl ? (
        <path
          d="M312 170 Q305 130 350 120 Q405 118 412 165 Q418 215 390 225 Q375 230 360 225 Q320 230 312 170Z"
          fill="#3D281D"
        />
      ) : (
        <path
          d="M135 160 Q125 125 175 118 Q225 112 235 155 Q240 185 225 205 Q190 215 135 160Z"
          fill="#382E31"
        />
      )}
      {back ? (
        // v2 (7 Nov 2026): tampak belakang dengan tekstur rambut, garis rambut tengkuk, dan telinga (laki-laki).
        girl ? (
          <g data-back-hair="bob">
            <path d="M308 175Q305 113 355 110Q408 113 405 175Q409 214 399 233Q380 242 356 237Q332 242 313 233Q303 214 308 175Z" fill={brown} />
            <path d="M330 128q-14 40 -12 96M352 118q-6 50 -2 116M376 120q8 50 4 112M396 140q8 40 2 84" stroke="#5A3D2E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".8" />
            <path d="M318 226q8 8 18 4M346 232q10 6 20 0M374 230q10 6 20 -4" stroke="#2C1C14" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".6" />
            <path d="M336 132q20 -14 44 0" stroke="#6B4A38" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
          </g>
        ) : (
          <g data-back-hair="pendek">
            <circle cx="139" cy="182" r="11" fill="#FCEADE" />
            <circle cx="231" cy="182" r="11" fill="#FCEADE" />
            <circle cx="139" cy="182" r="5" fill="#F2C6B6" opacity=".7" />
            <circle cx="231" cy="182" r="5" fill="#F2C6B6" opacity=".7" />
            <path d="M160 186h50l-4 50h-42Z" fill="#FCEADE" />
            <path d="M140 192Q134 118 185 113Q236 118 230 192Q224 206 214 204Q206 214 196 208Q185 216 174 208Q164 214 156 204Q146 206 140 192Z" fill={brown} />
            <path d="M178 140q10 -6 16 2q4 8 -6 12" stroke="#55474B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M158 128q-10 28 -8 58M172 122q-6 34 -2 72M200 122q6 34 2 72M214 130q10 28 6 56" stroke="#4E4145" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".85" />
            
          </g>
        )
      ) : (
        <>
          <circle cx={girl ? 398 : 140} cy={girl ? 182 : 180} r={girl ? 11 : 12} fill="#FCEADE" />
          <circle
            cx={girl ? 398 : 140}
            cy={girl ? 182 : 180}
            r={girl ? 2.5 : 6}
            fill={girl ? '#FFF' : '#F2C6B6'}
            opacity={girl ? 1 : 0.6}
          />
          <rect
            x={girl ? 314 : 144}
            y="135"
            width="82"
            height="90"
            rx={boy ? 40 : 38}
            fill="#FFF2E8"
          />
          <g transform={serong ? `translate(${cx + dir * 15} 0) scale(.8 1) translate(${-cx} 0)` : undefined} data-view={serong ? 'serong' : undefined}>
          {flush && flush.amt > 0 && (
            <g data-face-flush="gradient">
              <linearGradient id={`flush-${who}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={flush.color} stopOpacity={0.62 * flush.amt} />
                <stop
                  offset={0.25 + 0.45 * flush.amt}
                  stopColor={flush.color}
                  stopOpacity={0.18 * flush.amt}
                />
                <stop offset={0.35 + 0.55 * flush.amt} stopColor={flush.color} stopOpacity="0" />
              </linearGradient>
              <rect
                x={girl ? 314 : 144}
                y="135"
                width="82"
                height="90"
                rx={boy ? 40 : 38}
                fill={`url(#flush-${who})`}
              />
              <path
                d={`M${girl ? 398 : 228} 146c-3 5-5 8-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11Z`}
                fill="#BFD9E6"
                stroke="#9FC0D1"
                strokeWidth="1"
                opacity={Math.min(1, flush.amt * 1.4)}
              />
            </g>
          )}
          <circle
            cx={girl ? 326 : 156}
            cy={girl ? 188 : 190}
            r={girl ? 9 : 8.5}
            fill={girl ? '#FF9E80' : '#E8998D'}
            opacity=".45"
          />
          <circle
            cx={girl ? 384 : 214}
            cy={girl ? 188 : 190}
            r={girl ? 9 : 8.5}
            fill={girl ? '#FF9E80' : '#E8998D'}
            opacity=".45"
          />
          {(girl ? [334, 374] : [166, 206]).map((x, i) => (
            <g key={i}>
              {blink ? (
                <path
                  d={`M${x - 5} 174q5 3 10 0`}
                  stroke={brown}
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <ellipse
                    cx={x + g}
                    cy={173 + gy}
                    rx={boy ? 5.3 : 5}
                    ry={6 - Math.max(0, gy) * 0.65}
                    fill={brown}
                  />
                  <circle cx={x + g + (girl ? -2 : 2)} cy={171 + gy} r="2" fill="#FFF" />
                </>
              )}
            </g>
          ))}
          <path
            d={
              girl
                ? angry
                  ? 'M328 159l16 6M366 165l16-6'
                  : hurt
                    ? 'M328 164q8-8 16-7M366 157q8-1 16 7'
                    : 'M328 161 Q336 156 344 160 M366 160 Q374 156 382 161'
                : angry
                  ? 'M158 159l16 6M198 165l16-6'
                  : hurt
                    ? 'M158 164q8-8 16-7M198 157q8-1 16 7'
                    : 'M158 162 Q166 157 174 161 M198 161 Q206 157 214 162'
            }
            stroke={girl ? '#543A2A' : '#4A3E41'}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {talk > 0.15 ? (
            <ellipse
              cx={girl ? 355 : 186}
              cy={girl ? 197 : 198}
              rx="6"
              ry={2.3 + talk * 5}
              fill={girl ? '#D15368' : '#A84C62'}
            />
          ) : (
            <path
              d={
                girl
                  ? smile
                    ? 'M347 194Q355 203 363 194'
                    : hurt
                      ? 'M347 198Q355 191 363 198'
                      : 'M347 196h16'
                  : smile
                    ? 'M178 196Q186 203 194 196'
                    : hurt
                      ? 'M178 200Q186 193 194 200'
                      : 'M178 198h16'
              }
              stroke={girl ? '#D15368' : '#A84C62'}
              strokeWidth={girl ? 2.8 : 2.6}
              strokeLinecap="round"
              fill="none"
            />
          )}
          <circle cx={girl ? 355 : 186} cy="184" r="2" fill="#EAA89B" />
          </g>
          {girl ? (
            <>
              <path
                d="M312 160 Q325 140 355 138 Q385 140 398 160"
                stroke="#4A3326"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M310 160 Q308 195 318 215"
                stroke="#4A3326"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <path
                d="M140 152 Q136 122 176 116 Q226 112 234 145 Q210 132 186 138 Q162 144 140 152Z"
                fill="#4A3E41"
              />
              <path
                d="M172 136 Q180 148 184 156"
                stroke="#4A3E41"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {dad && (
                <path
                  d="M143 153q-3 17 2 29M226 149l3 25"
                  stroke="#BDB3A4"
                  strokeWidth="5"
                  fill="none"
                />
              )}
            </>
          )}
        </>
      )}
    </g>
  );
};
