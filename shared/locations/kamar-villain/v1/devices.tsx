import React from 'react';
import { P } from './rig';

/** Laptop dengan pesan yang benar-benar terbaca saat kamera masuk. */
export const Laptop = ({
  x,
  y,
  open,
  msg,
}: {
  x: number;
  y: number;
  open: number;
  msg: number;
}) => {
  const lift = -152 * (1 - open);
  return (
    <g data-prop="laptop">
      <ellipse cx={x + 76} cy={y + 5} rx="88" ry="9" fill={P.ink} opacity=".14" />
      <rect x={x - 26} y={y - 9} width="180" height="13" rx="3" fill="#4E6159" />
      <rect x={x - 26} y={y - 9} width="180" height="4" rx="2" fill="#6A7F76" />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 11 }).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={x - 12 + c * 14}
            y={y - 6 + r * 2.6}
            width="10"
            height="1.4"
            rx=".7"
            fill="#8FA398"
            opacity=".55"
          />
        )),
      )}
      <g transform={`translate(${x + 6} ${y - 9})`}>
        <g transform={`scale(1 ${0.14 + 0.86 * open}) skewX(-3) translate(0 ${lift})`}>
          <rect x="0" y="-150" width="152" height="150" rx="6" fill="#33443D" />
          <rect x="6" y="-144" width="140" height="138" rx="4" fill={P.cream} />
          <g opacity={Math.max(0, (open - 0.55) / 0.45)}>
            <rect x="6" y="-144" width="140" height="22" fill="#E9E1D0" />
            <circle cx="17" cy="-133" r="4.4" fill={P.sage} />
            <rect x="28" y="-136" width="40" height="6" rx="3" fill="#B7AE96" />
            <rect x="112" y="-137" width="28" height="8" rx="4" fill="#D7CDB8" />

            <rect x="14" y="-112" width="104" height="36" rx="7" fill={P.ink} />
            <text x="22" y="-98" fontFamily="Lato" fontWeight="700" fontSize="9.6" fill={P.cream}>
              maaf, soal tadi.
            </text>
            <text x="22" y="-86" fontFamily="Lato" fontWeight="700" fontSize="9.6" fill={P.cream}>
              aku salah.
            </text>

            <g opacity={Math.max(0, (msg - 0.35) / 0.3)}>
              <circle cx="118" cy="-64" r="4" fill={P.sage} />
              <path
                d="M116 -64l2.6 2.6 4.6 -6"
                stroke={P.cream}
                strokeWidth="1.7"
                fill="none"
                strokeLinecap="round"
              />
              <text x="84" y="-60" fontFamily="Lato" fontSize="7.4" fill="#8B9F8E">
                terkirim
              </text>
            </g>

            <g opacity={1 - Math.min(1, msg * 2)}>
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  cx={24 + i * 11}
                  cy="-66"
                  r="3.2"
                  fill="#B9B098"
                  opacity={0.35 + 0.45 * Math.abs(Math.sin(i * 1.7 + msg * 12))}
                />
              ))}
            </g>

            <rect x="14" y="-16" width="110" height="7" rx="3.5" fill="#E9E1D0" />
          </g>
          <rect x="0" y="-150" width="152" height="150" rx="6" fill="#BFD6DA" opacity=".06" />
        </g>
      </g>
    </g>
  );
};

export const PhoneOnDesk = ({ x, y }: { x: number; y: number }) => (
  <g data-prop="phone" transform={`translate(${x} ${y})`}>
    <rect x="-16" y="-8" width="32" height="8" rx="2" fill={P.ink} />
    <rect x="-14" y="-7.4" width="28" height="6.4" rx="1.6" fill="#415852" />
  </g>
);
