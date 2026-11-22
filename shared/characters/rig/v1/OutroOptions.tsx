// Contoh dua arah outro dengan CTA halus (belum disetujui; outro resmi tetap Elements.Outro).
// A: outro hidup di dunia krem, Naya menunjuk handle, Yan melambai, tombol "Ikuti" ditekan sekali.
// B: layout hijau tua lama + satu baris CTA dan tombol, dengan animasi masuk bertahap.
import React from 'react';
import { P, quick, Person } from './Character';
import { SocialIcon } from './SocialIcons';
import { Text } from './Elements';

const CTA = 'Ikuti untuk melihat lebih dekat.';

const Pill = ({ f, x, y, dark }: { f: number; x: number; y: number; dark: boolean }) => {
  const show = quick(f, 26, 38);
  // Tekan sekali: mengecil, memantul, lalu label berganti.
  const press = f >= 56 && f < 62 ? 0.93 : f >= 62 && f < 68 ? 1.05 : 1;
  const done = f >= 60;
  const ring = quick(f, 58, 76);
  const fill = done ? (dark ? P.cream : P.ink) : P.wine;
  const ink = done ? (dark ? P.ink : P.cream) : P.cream;
  return (
    <g opacity={show} transform={`translate(${x} ${y + 24 * (1 - show)}) scale(${press})`} data-cta="pill">
      {ring > 0 && ring < 1 && (
        <rect
          x={-170 - 30 * ring}
          y={-42 - 14 * ring}
          width={340 + 60 * ring}
          height={84 + 28 * ring}
          rx={42 + 14 * ring}
          fill="none"
          stroke={P.gold}
          strokeWidth="4"
          opacity={1 - ring}
        />
      )}
      <rect x="-170" y="-42" width="340" height="84" rx="42" fill={fill} />
      <Text x="0" y="15" textAnchor="middle" fontSize="40" fontWeight="900" fill={ink}>
        {done ? 'Mengikuti ✓' : '+ Ikuti'}
      </Text>
    </g>
  );
};

const SocialRow = ({ f, color }: { f: number; color: string }) => {
  const social = quick(f, 34, 48);
  return (
    <g data-social-row="true" opacity={social} transform={`translate(77 ${22 * (1 - social)})`}>
      <SocialIcon name="tiktok" x={247} y={1146} color={color} />
      <SocialIcon name="instagram" x={327} y={1146} color={color} />
      <Text x="415" y="1187" fontSize="45" fontWeight="700" fill={color}>
        @less.certain
      </Text>
    </g>
  );
};

const Wordmark = ({ f, color, y }: { f: number; color: string; y: number }) => {
  const q = quick(f, 3, 23);
  return (
    <g opacity={q} transform={`translate(540 ${y + 38 * (1 - q)})`}>
      <text fontFamily="Playfair" textAnchor="middle" fontSize="110" fill={color} letterSpacing="-5">
        less.certain
      </text>
      <path d={`M-265 46h${530 * quick(f, 14, 28)}`} stroke={P.gold} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
};

const CtaLine = ({ f, color, y }: { f: number; color: string; y: number }) => {
  const q = quick(f, 18, 30);
  return (
    <Text x="540" y={y + 18 * (1 - q)} textAnchor="middle" fontSize="44" fontWeight="700" fill={color} opacity={q}>
      {CTA}
    </Text>
  );
};

export const OutroA = ({ f }: { f: number }) => {
  const rise = quick(f, 4, 22);
  const wave = Math.sin(f * 0.32) * 16 * quick(f, 18, 28);
  const point = quick(f, 30, 42);
  return (
    <g data-outro="A">
      <rect width="1080" height="1920" fill={P.paper} />
      {/* Sisa cahaya jendela dari ruang baca: tetap terasa di dunia yang sama. */}
      <radialGradient id="oa-light" cx="78%" cy="18%" r="70%">
        <stop offset="0" stopColor="#FFF6DE" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FFF6DE" stopOpacity="0" />
      </radialGradient>
      <rect width="1080" height="1920" fill="url(#oa-light)" />
      <rect x="0" y="1640" width="1080" height="280" fill="#E9DCC5" />
      <Wordmark f={f} color={P.ink} y={560} />
      <CtaLine f={f} color="#4B5E56" y={690} />
      <Pill f={f} x={540} y={830} dark={false} />
      <g transform="translate(0 -200)">
        <SocialRow f={f} color={P.ink} />
      </g>
      <g transform={`translate(0 ${160 * (1 - rise)})`} opacity={rise}>
        <Person
          who="her"
          x={300}
          y={1740}
          s={2.15}
          dir={1}
          mood="warm"
          f={f}
          gaze={0.8}
          gazeY={-0.8}
          left={[-40, -142]}
          right={[30 + 34 * point, -150 - 120 * point]}
        />
        <Person
          who="him"
          x={790}
          y={1740}
          s={2.15}
          dir={-1}
          mood="warm"
          f={f + 30}
          gaze={-0.6}
          gazeY={-0.4}
          left={[-44, -142]}
          right={[66 + wave, -300]}
        />
      </g>
    </g>
  );
};

export const OutroB = ({ f }: { f: number }) => (
  <g data-outro="B">
    <rect width="1080" height="1920" fill={P.ink} />
    <Wordmark f={f} color={P.cream} y={760} />
    <CtaLine f={f} color="#DDE3D8" y={900} />
    <Pill f={f} x={540} y={1020} dark />
    <g transform="translate(0 120)">
      <SocialRow f={f} color={P.cream} />
    </g>
  </g>
);
