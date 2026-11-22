// Lokasi bersama: deretan rumah kampung malam dengan jendela menyala (7 Nov 2026, Maaf v3 baris "di banyak rumah").
// Metafora visual: tiap jendela memperlihatkan satu cara orang menunjukkan sayang/maaf tanpa kata. Isi jendela diberikan
// pemanggil lewat `isi` (render prop per indeks), digambar terpotong di kaca. Bingkai 1080×1920; dunia lebih lebar
// (x -300…1380) supaya kamera bisa menggeser.
import React from 'react';
import { P } from '../../../core/v1/core';
import { Moon, PowerPole, Plant } from '../../_detail/v1/Detail';

/** Pusat dan ukuran jendela: [x, y, w, h]. */
export const JENDELA: [number, number, number, number][] = [
  [-130, 560, 280, 300], [250, 520, 300, 320], [640, 560, 280, 300], [1040, 540, 280, 300],
  [60, 1060, 300, 300], [460, 1080, 280, 280], [860, 1060, 300, 300],
];

export function DeretRumah({ f, isi, terang = (i: number) => 1 }: { f: number; isi?: (i: number) => React.ReactNode; terang?: (i: number) => number }) {
  return (
    <g data-set="jendela-kampung">
      <rect x="-400" y="-200" width="1880" height="2400" fill="#1F2B37" />
      <Moon x={880} y={220} r={46} />
      {[[100, 150], [300, 260], [520, 120], [700, 300], [1200, 180]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#FFF9EF" opacity={0.4 + 0.3 * Math.sin(f * 0.1 + i)} />)}
      {/* atap dan dinding dua lantai */}
      {[[-300, 420, '#C9B79A'], [430, 400, '#BFC9B9'], [880, 430, '#D9C3A8']].map(([x, y, c], i) => (
        <g key={i}>
          <path d={`M${x} ${y}l230 -130l230 130Z`} fill="#8B4354" opacity=".9" />
          <rect x={x as number} y={y as number} width={i === 1 ? 460 : 520} height={1200} fill={c as string} />
        </g>
      ))}
      {JENDELA.map(([x, y, w, h], i) => {
        const on = terang(i);
        return (
          <g key={i} data-detail="jendela">
            <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="#6E5038" />
            <rect x={x} y={y} width={w} height={h} fill="#2E3540" />
            <rect x={x} y={y} width={w} height={h} fill="#FFD9A0" opacity={0.85 * on} />
            <defs><clipPath id={`jd-${i}`}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
            <g clipPath={`url(#jd-${i})`} opacity={on}>{isi?.(i)}</g>
            <path d={`M${x + w / 2} ${y}v${h}`} stroke="#6E5038" strokeWidth="8" opacity=".6" />
            <rect x={x - 20} y={y + h + 10} width={w + 40} height="16" fill="#8E6A4C" />
          </g>
        );
      })}
      <PowerPole x={-60} ground={1700} top={200} wiresTo={[-400, 1400]} />
      <rect x="-400" y="1600" width="1880" height="400" fill="#3A3F3C" />
      <Plant x={420} y={1600} s={1.1} kind={1} />
      <Plant x={960} y={1600} s={0.9} kind={0} />
      <rect x="-400" y="1600" width="1880" height="12" fill={P.ink} opacity=".4" />
    </g>
  );
}
