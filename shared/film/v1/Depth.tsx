// Kedalaman ala Kok Bisa? (disetujui pengguna 7 Nov 2026). Sebagian filter diambil dari v7 Kurang Yakin
// (projects/kurang-yakin-bukan-kurang-tahu/v7/src/Profil.tsx: pd-far, pd-fg, pd-mid rim, vignette, grain) yang
// dulu terkunci di folder proyek. Semua filter colorInterpolationFilters="sRGB"; tanpa mix-blend-mode (kontrak 6 Nov).
// Setiap komponen yang memakai filter/gradien menerima `id` unik per frame (bawaan dari parameternya).
import React from 'react';
import { ramp, unit } from '../../core/v1/core';

type Kids = { children?: React.ReactNode };
const fid = (p: string, ...xs: (number | string)[]) => `${p}-${xs.map((x) => String(x).replace(/[^\w]/g, '')).join('-')}`;

/** Blur latar yang naik saat kamera mendekat (v7: 3,2 × ramp(z, 1,15, 1,6)). */
export const farBlurFromZoom = (z: number, from = 1.15, to = 1.6, max = 3.2) => max * ramp(z, from, to);

/** Bungkus lapisan dengan blur Gaussian. amount 0 = tanpa filter. */
export function Blurred({ amount, id, children }: Kids & { amount: number; id?: string }) {
  if (amount <= 0.05) return <>{children}</>;
  const k = id ?? fid('blur', amount.toFixed(2));
  return (
    <>
      <defs>
        <filter id={k} colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={amount} />
        </filter>
      </defs>
      <g filter={`url(#${k})`}>{children}</g>
    </>
  );
}

/** Latar jauh: makin buram saat kamera zoom masuk (z = zoom kamera aktual). */
export const FarLayer = ({ z, id, from, to, max, children }: Kids & { z: number; id?: string; from?: number; to?: number; max?: number }) => (
  <Blurred amount={farBlurFromZoom(z, from, to, max)} id={id ?? 'far'}>{children}</Blurred>
);

/** Lapisan paling depan (kusen, tanaman, bahu extras): lebih gelap dan buram, seperti dekat lensa (v7 pd-fg). */
export function Foreground({ blur = 9, darken = 0.72, id = 'fg', children }: Kids & { blur?: number; darken?: number; id?: string }) {
  const d = darken.toFixed(3);
  return (
    <>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
          <feColorMatrix type="matrix" values={`${d} 0 0 0 0  0 ${d} 0 0 0  0 0 ${d} 0 0  0 0 0 1 0`} />
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g filter={`url(#${id})`} data-layer="depan">{children}</g>
    </>
  );
}

/** Cahaya tepi (rim light) pada sisi yang terkena cahaya (v7 pd-mid). dx/dy = arah DARI cahaya. */
export function RimLight({ color = '#FFF1CF', opacity = 0.6, dx = 5, dy = 7, soft = 1.4, id = 'rim', children }: Kids & { color?: string; opacity?: number; dx?: number; dy?: number; soft?: number; id?: string }) {
  return (
    <>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
          <feOffset in="SourceAlpha" dx={dx} dy={dy} result="shifted" />
          <feComposite in="SourceAlpha" in2="shifted" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation={soft} result="edgeSoft" />
          <feFlood floodColor={color} floodOpacity={opacity} />
          <feComposite in2="edgeSoft" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </>
  );
}

/** Bercak cahaya buram (pantulan/bokeh) di kaca, ubin, atau latar jauh. spots: [x, y, rx, ry?]. */
export function Bokeh({ spots, color = '#FFFFFF', opacity = 0.35, blur = 10, id = 'bokeh' }: { spots: number[][]; color?: string; opacity?: number; blur?: number; id?: string }) {
  return (
    <g data-layer="bokeh" pointerEvents="none">
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g filter={`url(#${id})`} opacity={opacity}>
        {spots.map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry ?? rx * 0.7} fill={color} />)}
      </g>
    </g>
  );
}

/** Kaca buram di DEPAN tokoh (partisi, etalase): tokoh tetap terlihat, bagian bawah memudar, ada garis pantulan. */
export function FrostedGlass({ x, y, w, h, f = 0, tint = '#E4F1F6', haze = 0.55, streaks = true, frame = '#7F98A6', id }: { x: number; y: number; w: number; h: number; f?: number; tint?: string; haze?: number; streaks?: boolean; frame?: string; id?: string }) {
  const k = id ?? fid('frost', x, y, w, h);
  const drift = 6 * Math.sin(f * 0.02);
  return (
    <g data-layer="kaca-depan" pointerEvents="none">
      <defs>
        <linearGradient id={`${k}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity={0.12 * haze} />
          <stop offset="0.55" stopColor={tint} stopOpacity={0.35 * haze} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0.9 * haze} />
        </linearGradient>
        <clipPath id={`${k}-c`}><rect x={x} y={y} width={w} height={h} /></clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${k}-g)`} />
      {streaks && (
        <g clipPath={`url(#${k}-c)`} opacity="0.5">
          <path d={`M${x + w * 0.12 + drift} ${y + h}L${x + w * 0.42 + drift} ${y}h${w * 0.07}L${x + w * 0.19 + drift} ${y + h}Z`} fill="#FFFFFF" opacity="0.35" />
          <path d={`M${x + w * 0.3 + drift} ${y + h}L${x + w * 0.6 + drift} ${y}h${w * 0.022}L${x + w * 0.322 + drift} ${y + h}Z`} fill="#FFFFFF" opacity="0.5" />
        </g>
      )}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={frame} strokeWidth="10" />
      <path d={`M${x + 8} ${y + 10}h${w - 16}`} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="3" />
    </g>
  );
}

/** Transisi fokus: blur memuncak di frame `at` lalu tajam lagi. Total ≤ 0,7 dtk (21 frame) sesuai kontrak transisi. */
export function focusPullAmount(f: number, at: number, dur = 14, max = 16) {
  const half = Math.min(dur, 21) / 2;
  return max * (1 - unit(Math.abs(f - at) / half));
}
export function FocusPull({ f, at, dur = 14, max = 16, sfx = false, children }: Kids & { f: number; at: number; dur?: number; max?: number; sfx?: boolean }) {
  const amt = focusPullAmount(f, at, dur, max);
  return (
    <g data-sfx={sfx && Math.abs(f - at) < dur / 2 ? 'slide' : undefined} data-sfx-id={sfx ? `fokus-${at}` : undefined}>
      <Blurred amount={amt} id={`focus-${at}`}>{children}</Blurred>
    </g>
  );
}

/** Vinyet halus (v7 pd-vignette). Untuk momen dramatis, naikkan opacity dan pakai warna gelap. */
export const Vignette = ({ color = '#8A6E4E', opacity = 0.08, id = 'vignette', cy = '46%' }: { color?: string; opacity?: number; id?: string; cy?: string }) => (
  <g pointerEvents="none">
    <defs>
      <radialGradient id={id} cx="50%" cy={cy} r="75%">
        <stop offset="0.62" stopColor={color} stopOpacity="0" />
        <stop offset="1" stopColor={color} stopOpacity={opacity} />
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill={`url(#${id})`} />
  </g>
);

/** Butiran halus seluruh layar (v7 pd-grain). opacity kecil: 0,03–0,06. */
export const Grain = ({ opacity = 0.04, seed = 7, id = 'grain' }: { opacity?: number; seed?: number; id?: string }) => (
  <g pointerEvents="none">
    <defs>
      <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1080" height="1920" filter={`url(#${id})`} opacity={opacity} />
  </g>
);

/** Coretan gerak (smear) untuk gerak cepat 2–4 frame: kapsul buram tembus pandang dari `from` ke `to`. */
export function Smear({ from, to, width = 40, color = '#5FC4C4', opacity = 0.55, id }: { from: [number, number]; to: [number, number]; width?: number; color?: string; opacity?: number; id?: string }) {
  const k = id ?? fid('smear', from[0], from[1], to[0], to[1]);
  return (
    <g pointerEvents="none">
      <defs>
        <filter id={k} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={width * 0.18} />
        </filter>
      </defs>
      <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity} filter={`url(#${k})`} />
    </g>
  );
}
