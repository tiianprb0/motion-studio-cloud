// Subtitle narasi Less. (gaya v7): Lato Bold 44px, latar per kata, rata kiri, kata aksen wine.
// Diambil dari projects/maaf-tanpa-kata/v2 dan syarat-protes-struk-kopi (dulu disalin per proyek).
// Input: src/cues.json dan src/caption-metrics.json dari tools/captions.cjs.
// Audit (tools/render-film.cjs --audit) membaca data-word untuk safe area dan cues.json untuk batas kata.
import React from 'react';
import { P, quick, ramp } from '../../core/v1/core';

export type Cue = { start: number; end: number; rows: string[] };

export function Captions({
  f,
  cues,
  metrics,
  accent,
  strip = /["“”.,!?:]/g,
  x = 110,
  y = 300,
}: {
  f: number;
  cues: Cue[];
  metrics: Record<string, number>;
  /** Kata yang diberi latar wine, mis. /^(maaf|gengsi)$/i. Dicocokkan setelah tanda baca `strip` dibuang. */
  accent?: RegExp;
  strip?: RegExp;
  /** Pojok kiri atas baris pertama. Default kiri atas (110, 300). Tetap di dalam safe area. */
  x?: number;
  y?: number;
}) {
  return (
    <g data-layer="subtitle">
      {cues.map((c, k) => {
        if (f < c.start || f >= c.end) return null;
        const e = quick(f, c.start, c.start + 7),
          out = 1 - ramp(f, c.end - 3, c.end);
        return (
          <g key={k} data-caption="true" opacity={e * out} transform={`translate(${-12 * (1 - e)} ${-8 * (1 - e)})`} fontFamily="Lato" fontSize="44" fontWeight="700">
            {c.rows.map((row, i) => {
              let cx = x;
              return (
                <g key={i}>
                  {row.split(' ').map((w, j) => {
                    const width = Math.ceil(metrics[w]) + 20,
                      wx = cx;
                    cx += width + 8;
                    const acc = !!accent && accent.test(w.replace(strip, ''));
                    const wy = y + i * 70;
                    return (
                      <g data-word="true" key={j}>
                        <rect x={wx} y={wy} width={width} height="62" rx="8" fill={acc ? P.wine : P.cream} />
                        <text x={wx + 10} y={wy + 45} fill={acc ? P.cream : P.ink}>{w}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
