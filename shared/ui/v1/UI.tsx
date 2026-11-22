// Komponen layar bersama (7 Nov 2026, asal: projects/maaf-tanpa-kata/v1). Semua di koordinat layar 1080x1920
// dan menulis data-box supaya tools/audit-overlay.cjs bisa memeriksa safe zone (kiri ≥60, atas ≥220, kanan ≤920, bawah ≤1480).
import React from 'react';
import { P, unit, quick } from '../../characters/rig/v1/Character';
import { popIn } from '../../characters/rig/v1/fx';
import { CatPhoto } from '../../props/harian/v1/Props';

// Gelembung ucapan. tip = ujung ekor (dekat mulut tokoh), x,y = pusat gelembung. dream = garis putus (bayangan/harapan).
export function SpeechBubble({ f, a, b, x, y, tip, text, size = 34, dream = false, strike = false }: { f: number; a: number; b: number; x: number; y: number; tip: [number, number]; text: string; size?: number; dream?: boolean; strike?: boolean }) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const w = Math.max(90, text.length * size * 0.52 + 52),
    h = size + 34;
  const fill = dream ? '#FFFDF8' : '#FFF9EF';
  return (
    <g opacity={o} data-fx="gelembung" data-box={`${Math.round(Math.min(x - w / 2, tip[0]))},${Math.round(Math.min(y - h / 2, tip[1]))},${Math.round(Math.max(x + w / 2, tip[0]))},${Math.round(Math.max(y + h / 2, tip[1]))}`}>
      <g transform={`translate(${tip[0]} ${tip[1]}) scale(${s}) translate(${-tip[0]} ${-tip[1]})`}>
        {dream ? (
          <>
            <circle cx={tip[0]} cy={tip[1]} r="7" fill={fill} stroke="#CDBFA6" strokeWidth="3" />
            <circle cx={(tip[0] * 2 + x) / 3} cy={(tip[1] * 2 + y) / 3} r="11" fill={fill} stroke="#CDBFA6" strokeWidth="3" />
          </>
        ) : (
          <path d={`M${x - 16} ${y + h / 2 - 2}L${tip[0]} ${tip[1]}L${x + 16} ${y + h / 2 - 2}Z`} fill={fill} stroke="#CDBFA6" strokeWidth="3" strokeLinejoin="round" />
        )}
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke="#CDBFA6" strokeWidth="3" strokeDasharray={dream ? '10 8' : undefined} />
        {!dream && <path d={`M${x - 15} ${y + h / 2 - 3.5}h30`} stroke={fill} strokeWidth="5" />}
        <text x={x} y={y + size * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={P.ink}>
          {text}
        </text>
        {strike && <path d={`M${x - w / 2 + 22} ${y + 2}L${x + w / 2 - 22} ${y - 4}`} stroke={P.wine} strokeWidth="6" strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - quick(f, a + 10, a + 18))} />}
      </g>
    </g>
  );
}

// Layar chat ponsel (insert layar penuh). side: 'terima' (foto di kiri) | 'kirim' (di kanan).
// typed = teks di kolom ketik, photoAt = frame foto muncul, dots = indikator mengetik (frame [a,b]), incoming = pesan teks masuk.
export function PhoneChat({ f, name, side, typed = '', caret = true, photoAt, dots, bg = '#DCE6DE', incoming, incomingAt = 0 }: { f: number; name: string; side: 'terima' | 'kirim'; typed?: string; caret?: boolean; photoAt?: number; dots?: [number, number]; bg?: string; incoming?: string; incomingAt?: number }) {
  const X = 250,
    Y = 490,
    W = 580,
    H = 960;
  const ph = photoAt !== undefined && f >= photoAt ? popIn(f, photoAt, 999999) : null;
  return (
    <g data-fx="layar-hp" data-box={`${X - 20},${Y - 20},${X + W + 20},${Y + H + 20}`}>
      {bg !== 'none' && <rect width="1080" height="1920" fill={bg} />}
      <rect x={X - 20} y={Y - 20} width={W + 40} height={H + 40} rx="70" fill="#2D3532" />
      <rect x={X} y={Y} width={W} height={H} rx="54" fill="#F6F2EA" />
      <rect x={X} y={Y} width={W} height="120" rx="54" fill="#E9E1D3" />
      <rect x={X} y={Y + 70} width={W} height="50" fill="#E9E1D3" />
      <circle cx={X + 70} cy={Y + 66} r="30" fill={side === 'terima' ? P.sage : '#FFCDB2'} />
      <text x={X + 120} y={Y + 76} fontFamily="Lato" fontWeight="900" fontSize="34" fill={P.ink}>{name}</text>
      {/* pesan lama */}
      <rect x={X + 30} y={Y + 160} width="250" height="58" rx="22" fill="#FFFFFF" opacity=".7" />
      <rect x={X + W - 230} y={Y + 240} width="200" height="58" rx="22" fill="#D6E7DA" opacity=".7" />
      {incoming && f >= incomingAt && (() => {
        const q = popIn(f, incomingAt, 999999);
        const w = incoming.length * 21 + 60;
        return (
          <g opacity={q.o} transform={`translate(${X + 30} ${Y + 360}) scale(${q.s})`}>
            <rect width={w} height="76" rx="26" fill="#FFFFFF" />
            <text x="30" y="50" fontFamily="Lato" fontWeight="700" fontSize="38" fill={P.ink}>{incoming}</text>
          </g>
        );
      })()}
      {ph && (
        <g opacity={ph.o} transform={`translate(${side === 'terima' ? X + 190 : X + W - 190} ${Y + 520}) scale(${ph.s})`}>
          <rect x="-150" y="-150" width="300" height="300" rx="22" fill={side === 'terima' ? '#FFFFFF' : '#D6E7DA'} />
          <g transform="scale(0.92)"><CatPhoto w={300} h={300} /></g>
        </g>
      )}
      {dots && f >= dots[0] && f < dots[1] && (
        <g transform={`translate(${X + 90} ${Y + 760})`}>
          <rect x="-60" y="-30" width="120" height="60" rx="30" fill="#FFFFFF" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-28 + i * 28} cy={-4 * Math.abs(Math.sin(f * 0.25 - i * 0.7))} r="8" fill="#A9A39A" />
          ))}
        </g>
      )}
      {/* kolom ketik */}
      <rect x={X + 24} y={Y + H - 110} width={W - 140} height="72" rx="36" fill="#FFFFFF" stroke="#D8D0C2" strokeWidth="2" />
      <text x={X + 56} y={Y + H - 62} fontFamily="Lato" fontWeight="700" fontSize="32" fill={typed ? P.ink : '#B8B0A2'}>
        {typed || 'Ketik pesan'}
        {caret && Math.floor(f / 12) % 2 === 0 ? '|' : ''}
      </text>
      <circle cx={X + W - 68} cy={Y + H - 74} r="36" fill={P.sage} />
      <path d={`M${X + W - 84} ${Y + H - 90}l34 16l-34 16l6 -16Z`} fill="#FFF9EF" />
    </g>
  );
}
