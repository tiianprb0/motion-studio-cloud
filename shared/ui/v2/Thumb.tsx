// Thumbnail bersama v2 (7 Nov 2026, DISETUJUI pengguna: "Setuju semua"), gaya "Wajah + latar lokasi". Keputusan pengguna setelah review grid profil:
//   - label tema (PERILAKU/HUBUNGAN) DIHAPUS: tertutup ikon Reels di grid Instagram;
//   - kontras: WAJAH = bagian paling terang. Latar diburamkan, diwarnai tema lebih tipis, diberi vinyet gelap di tepi,
//     dan cahaya lembut di belakang kepala (menggantikan lingkaran putih datar v1 yang membuat cover kusam);
//   - satu benda PETUNJUK cerita di dekat wajah (prop `clue`), seperti benda kunci di thumbnail Kok Bisa?;
//   - tema 'openmic' untuk seri stand-up: panggung gelap + lampu sorot;
//   - POSE BOLEH BERUBAH (pengguna 7 Nov 2026: "pose nya gak harus gitu"): `pose` dari POSE (rig v2) dengan framing
//     sedang (s ±3,3, gestur dan tangan terlihat) atau `pose` kosong = close-up wajah tanpa tangan (s 4,6).
//     Benda petunjuk boleh DIPEGANG (holdLeft/holdRight) supaya tidak melayang; pose baru = kandidat, tunjukkan dulu.
// v1 (shared/ui/v1/Thumb.tsx) beku: dipakai thumbnail Maaf v2 yang sudah terkirim.
// Grid profil IG/TikTok memotong 3:4 (y 240–1680): teks, wajah, dan petunjuk harus di dalamnya. Pojok kanan atas
// (ikon Reels) dan kiri bawah (jumlah tayangan) dibiarkan kosong. Bawah 9:16 tertutup judul di rak YouTube Shorts.
// Render: node tools/render-thumb.cjs <file.tsx yang export Thumb> <out-tanpa-ekstensi>  -> 9:16, 4:5, 3:4.
import React from 'react';
import { Person, P, BODY_STYLE, LEG_STYLE } from '../../characters/rig/v2/Character';
import { POSE } from '../../characters/rig/v2/poses';
import { Mark } from '../../characters/rig/v2/fx';

export const THEMES = {
  // tint = kekuatan warna tema di atas lokasi. v1 memakai 0,5 rata: warna tema yang berseberangan dengan warna lokasi
  // (sage di atas langit senja oranye) jadi abu kusam. v2: lokasi dibuat sedikit lebih jenuh, tema lebih tipis.
  perilaku: { bg: '#F2B79B', ink: P.ink, glow: '#FFF4EA', tint: 0.3, vignette: 0.4, stage: false },
  hubungan: { bg: '#A9CDB3', ink: P.ink, glow: '#FFFBF2', tint: 0.22, vignette: 0.42, stage: false },
  sosial: { bg: P.ink, ink: P.cream, glow: '#FFF9EF', tint: 0.45, vignette: 0.45, stage: false },
  refleksi: { bg: P.wine, ink: P.cream, glow: '#FFEFF2', tint: 0.45, vignette: 0.45, stage: false },
  filosofis: { bg: '#E2BE74', ink: P.ink, glow: '#FFF7E4', tint: 0.3, vignette: 0.4, stage: false },
  openmic: { bg: '#1E2824', ink: P.cream, glow: '#FFE9B8', tint: 0.35, vignette: 0.6, stage: true },
} as const;
export type ThumbTheme = keyof typeof THEMES;
type Mood = 'annoyed' | 'hurt' | 'thinking' | 'soft' | 'warm' | 'unsure';

// Wordmark asli Less.: teks less.certain (Playfair) dengan garis emas. Jangan ditambah ikon.
const Word = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <text fontFamily="Playfair" fontSize="56" fill={color} letterSpacing="-2">
      less.certain
    </text>
    <path d="M2 20h165" stroke={P.gold} strokeWidth="4" strokeLinecap="round" />
  </g>
);

/** Benda petunjuk dengan cahaya lembut di belakangnya supaya terbaca di ukuran grid. */
export const Petunjuk = ({ x, y, r = 120, color = '#FFFFFF', children }: { x: number; y: number; r?: number; color?: string; children: React.ReactNode }) => (
  <g data-thumb="petunjuk" data-box={`${Math.round(x - r * 0.7)},${Math.round(y - r * 0.7)},${Math.round(x + r * 0.7)},${Math.round(y + r * 0.7)}`}>
    <defs>
      <radialGradient id={`pt-${x}-${y}`}>
        <stop offset="0" stopColor={color} stopOpacity=".8" />
        <stop offset=".6" stopColor={color} stopOpacity=".35" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#pt-${x}-${y})`} />
    <g transform={`translate(${x} ${y})`}>{children}</g>
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
  clue,
  front,
  scene,
  pose,
  holdLeft,
  holdRight,
  head = 0,
  lean = 0,
  dx = 0,
  facing,
  s,
}: {
  theme: ThumbTheme;
  lines: [string, string?];
  who: 'her' | 'him';
  mood: Mood;
  gaze?: number;
  gazeY?: number;
  flush?: string;
  mark?: { ch: string; color: string };
  /** digambar di belakang tokoh */
  prop?: React.ReactNode;
  /** benda petunjuk cerita (pakai <Petunjuk>), digambar di depan tokoh, di samping wajah */
  clue?: React.ReactNode;
  /** benda di depan tokoh selain petunjuk (mis. mic berdiri) */
  front?: React.ReactNode;
  /** skala tokoh; bawaan 4,6 (close-up tanpa tangan) atau 3,3 bila ada pose */
  s?: number;
  scene?: React.ReactNode;
  /** nama pose dari POSE[who] (santai, melambai, pinggang, bertaut, berpikir, pegangDepanDada, …) */
  pose?: string;
  holdLeft?: React.ReactNode;
  holdRight?: React.ReactNode;
  /** miring kepala (derajat) dan condong badan */
  head?: number;
  lean?: number;
  /** geser tokoh mendatar (px) supaya ada ruang untuk petunjuk */
  dx?: number;
  /** arah hadap; bawaan Naya kanan, Yan kiri */
  facing?: 1 | -1;
}) => {
  BODY_STYLE.v = 'baru';
  LEG_STYLE.v = 'baru';
  const t = THEMES[theme];
  const HX = 560 + dx, HY = 1120; // pusat kepala tetap di HY untuk semua skala
  const arms = pose ? (POSE as Record<string, Record<string, object>>)[who][pose] : undefined;
  if (pose && !arms) throw new Error(`pose "${pose}" tidak ada di POSE.${who} (shared/characters/rig/v2/poses.ts)`);
  const S = s ?? (pose ? 3.3 : 4.6);
  const feetY = pose || s ? HY + 285 * S : 1550 + 192 * S; // close-up lama tetap identik
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <filter id="th2-blur" colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix type="saturate" values="1.3" />
        </filter>
        <radialGradient id="th2-vin" cx="50%" cy="55%" r="75%">
          <stop offset="0.38" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity={t.vignette} />
        </radialGradient>
        <radialGradient id="th2-glow" cx={HX} cy={HY} r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={t.glow} stopOpacity={t.stage ? 0.42 : 0.7} />
          <stop offset="0.55" stopColor={t.glow} stopOpacity={t.stage ? 0.16 : 0.22} />
          <stop offset="1" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill={t.bg} />
      {scene && (
        <g data-thumb-scene="lokasi">
          <g filter="url(#th2-blur)">{scene}</g>
          <rect width="1080" height="1920" fill={t.bg} opacity={t.tint} />
        </g>
      )}
      <rect width="1080" height="1920" fill="url(#th2-vin)" />
      {t.stage && <path d="M420 -40h280l300 1960H120Z" fill={t.glow} opacity=".1" />}
      <rect width="1080" height="1920" fill="url(#th2-glow)" />
      {prop}
      <Person
        who={who}
        x={HX}
        y={feetY}
        s={S}
        dir={facing ?? (who === 'her' ? 1 : -1)}
        mood={mood}
        f={7}
        gaze={gaze}
        gazeY={gazeY}
        head={head}
        lean={lean}
        hideArms={!arms}
        {...(arms ?? {})}
        holdLeft={holdLeft}
        holdRight={holdRight}
        flush={flush ? { color: flush, amt: 0.85 } : undefined}
      />
      {front}
      {clue}
      {mark && (
        <g transform="translate(880 820) scale(2.3) translate(-880 -820)">
          <Mark f={20} a={0} b={99} x={880} y={820} ch={mark.ch} color={mark.color} rot={10} />
        </g>
      )}
      <g fontFamily="Lato" fontWeight="900" letterSpacing="-3" fill={t.ink}>
        <text x="100" y="530" fontSize="108">{lines[0]}</text>
        {lines[1] && <text x="100" y="648" fontSize="108">{lines[1]}</text>}
      </g>
      <Word x={100} y={370} color={t.ink} />
    </svg>
  );
};
