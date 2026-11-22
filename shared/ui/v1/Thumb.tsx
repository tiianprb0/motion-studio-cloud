// Thumbnail bersama gaya "Wajah + latar lokasi" (disetujui 6 Nov 2026 untuk v7; references/thumbnails.md).
// Disalin dari projects/kurang-yakin-bukan-kurang-tahu/v7/src/ThumbSystem.tsx (FaceThumb, THEMES, Word), dipindah ke shared 7 Nov 2026.
// Render: node tools/render-thumb.cjs <file.tsx yang export Thumb> <out-tanpa-ekstensi>  -> 9:16, 4:5, 3:4.
import React from 'react';
import { Person, P, BODY_STYLE, LEG_STYLE } from '../../characters/rig/v2/Character';
import { Mark } from '../../characters/rig/v2/fx';

export const THEMES = {
  perilaku: { bg: '#F2B79B', ink: P.ink, label: 'PERILAKU' },
  hubungan: { bg: '#9EC2AA', ink: P.ink, label: 'HUBUNGAN' },
  sosial: { bg: P.ink, ink: P.cream, label: 'SOSIAL' },
  refleksi: { bg: P.wine, ink: P.cream, label: 'REFLEKSI' },
  filosofis: { bg: '#E2BE74', ink: P.ink, label: 'FILOSOFIS' },
} as const;
type Theme = keyof typeof THEMES;
type Mood = 'annoyed' | 'hurt' | 'thinking' | 'soft' | 'warm' | 'unsure';

// Wordmark asli Less.: teks less.certain (Playfair) dengan garis emas di bawahnya. Jangan ditambah ikon.
const Word = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <text fontFamily="Playfair" fontSize="56" fill={color} letterSpacing="-2">
      less.certain
    </text>
    <path d="M2 20h165" stroke={P.gold} strokeWidth="4" strokeLinecap="round" />
  </g>
);

export const FaceThumb = ({
  theme,
  lines,
  who,
  mood,
  gaze = 0,
  gazeY = 0,
  flush,
  mark,
  prop,
  scene,
  s = 4.6,
}: {
  theme: Theme;
  lines: [string, string?];
  who: 'her' | 'him';
  mood: Mood;
  gaze?: number;
  gazeY?: number;
  flush?: string;
  mark?: { ch: string; color: string };
  prop?: React.ReactNode;
  s?: number;
  scene?: React.ReactNode; // latar lokasi (digambar di bingkai 1080x1920), otomatis diburamkan + dilapisi warna tema
}) => {
  BODY_STYLE.v = 'baru';
  LEG_STYLE.v = 'baru';
  const t = THEMES[theme];
  const dark = t.ink === P.cream;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <rect width="1080" height="1920" fill={t.bg} />
      {scene && (
        <g data-thumb-scene="lokasi">
          <filter id="th-blur" colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <g filter="url(#th-blur)">{scene}</g>
          {/* lapisan warna tema: lokasi tetap terbaca, sistem warna grid tetap jalan */}
          <rect width="1080" height="1920" fill={t.bg} opacity="0.5" />
        </g>
      )}
      {/* lingkaran lembut di belakang kepala supaya wajah menonjol dari latar */}
      <circle cx="560" cy="1150" r="380" fill={dark ? '#FFFFFF' : '#FFFFFF'} opacity={dark ? 0.08 : 0.28} />
      {prop}
      <Person who={who} x={560} y={1550 + 192 * s} s={s} dir={who === 'her' ? 1 : -1} mood={mood} f={7} gaze={gaze} gazeY={gazeY} hideArms flush={flush ? { color: flush, amt: 0.85 } : undefined} />
      {mark && (
        <g transform="translate(880 820) scale(2.3) translate(-880 -820)">
          <Mark f={20} a={0} b={99} x={880} y={820} ch={mark.ch} color={mark.color} rot={10} />
        </g>
      )}
      <g fontFamily="Lato" fontWeight="900" letterSpacing="-3" fill={t.ink}>
        <text x="100" y="530" fontSize="108">{lines[0]}</text>
        {lines[1] && <text x="100" y="648" fontSize="108">{lines[1]}</text>}
      </g>
      <g>
        <Word x={100} y={370} color={t.ink} />
        <text x="980" y="368" textAnchor="end" fontFamily="Lato" fontWeight="900" fontSize="26" letterSpacing="3" fill={t.ink} opacity=".75">
          {t.label}
        </text>
      </g>
    </svg>
  );
};

