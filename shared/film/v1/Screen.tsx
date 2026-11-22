// Teks dan shot non-adegan ala Kok Bisa? (disetujui pengguna 7 Nov 2026): label bergaris penunjuk, teks bunyi,
// layar terbelah, inset, dan diagram batang. Semua menulis data-box (audit safe zone) dan data-sfx untuk efek
// suara lokal (pop saat muncul, slide saat panel bergeser; tools/render-film.cjs --sfx).
import React from 'react';
import { P, popIn, quick, unit } from '../../core/v1/core';

/** Label merah/wine dengan garis penunjuk ke benda (mis. "BANTALAN ANUS" di Kok Bisa?). */
export function Callout({ f, a, b, x, y, target, text, size = 40, color = P.wine, ink = P.cream }: { f: number; a: number; b: number; x: number; y: number; target: [number, number]; text: string; size?: number; color?: string; ink?: string }) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const w = text.length * size * 0.66 + size * 1.2, h = size * 1.7;
  const line = quick(f, a, a + 8);
  const ex = x + (x < target[0] ? w / 2 : -w / 2);
  const L = Math.round(Math.min(x - w / 2, target[0] - 10)), T = Math.round(Math.min(y - h / 2, target[1] - 10));
  const R = Math.round(Math.max(x + w / 2, target[0] + 10)), B = Math.round(Math.max(y + h / 2, target[1] + 10));
  return (
    <g opacity={o} data-fx="label" data-box={`${L},${T},${R},${B}`} data-sfx="pop" data-sfx-id={`label-${a}-${text}`}>
      <path d={`M${ex} ${y}L${ex + (target[0] - ex) * line} ${y + (target[1] - y) * line}`} stroke={P.cream} strokeWidth="5" strokeLinecap="round" />
      <circle cx={target[0]} cy={target[1]} r={9 * line} fill={P.cream} />
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill={color} />
        <text x={x} y={y + size * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={ink} letterSpacing="1">{text.toUpperCase()}</text>
      </g>
    </g>
  );
}

/** Teks bunyi lepas (onomatope), miring, bergoyang kecil; tanpa bubble (mis. "Plung.. Plung.."). */
export function Onomatope({ f, a, b, x, y, text, size = 56, rot = -14, color = '#FFFFFF', shadow = P.ink }: { f: number; a: number; b: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string; shadow?: string }) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const wob = 3 * Math.sin((f - a) * 0.6);
  const w = text.length * size * 0.55;
  return (
    <g opacity={o} data-fx="bunyi" data-box={`${Math.round(x - 10)},${Math.round(y - size)},${Math.round(x + w + 10)},${Math.round(y + size * 0.4)}`} transform={`rotate(${rot + wob} ${x} ${y}) translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <text x={x + 3} y={y + 4} fontFamily="Lato" fontWeight="900" fontStyle="italic" fontSize={size} fill={shadow} opacity="0.25">{text}</text>
      <text x={x} y={y} fontFamily="Lato" fontWeight="900" fontStyle="italic" fontSize={size} fill={color}>{text}</text>
    </g>
  );
}

/** Layar terbelah vertikal-format: 2–3 panel bertumpuk; tiap panel menggeser masuk berurutan (efek slide). */
export function SplitPanels({ f, a, panels, top = 230, bottom = 1470, gap = 14, stagger = 8, edge = P.cream }: { f: number; a: number; panels: (() => React.ReactNode)[]; top?: number; bottom?: number; gap?: number; stagger?: number; edge?: string }) {
  if (f < a) return null;
  const n = panels.length, h = (bottom - top - gap * (n - 1)) / n;
  return (
    <g data-fx="layar-terbelah">
      <rect x="0" y={top - gap} width="1080" height={bottom - top + gap * 2} fill={edge} />
      {panels.map((draw, i) => {
        const y = top + i * (h + gap);
        const q = quick(f, a + i * stagger, a + i * stagger + 12);
        const dx = (i % 2 ? 1 : -1) * 1080 * (1 - q);
        const id = `split-${a}-${i}`;
        return (
          <g key={i} data-sfx="slide" data-sfx-id={id} opacity={unit(q * 3)}>
            <defs><clipPath id={id}><rect x="0" y={y} width="1080" height={h} /></clipPath></defs>
            <g clipPath={`url(#${id})`} transform={`translate(${dx} 0)`}>{draw()}</g>
          </g>
        );
      })}
    </g>
  );
}

/** Inset bulat (detail dari dekat, wajah reaksi, benda kecil) dengan cincin krem. */
export function Inset({ f, a, b, x, y, r, children, ring = P.cream }: { f: number; a: number; b: number; x: number; y: number; r: number; children: React.ReactNode; ring?: string }) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const id = `inset-${a}-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g opacity={o} data-fx="inset" data-box={`${Math.round(x - r - 8)},${Math.round(y - r - 8)},${Math.round(x + r + 8)},${Math.round(y + r + 8)}`} data-sfx="pop" data-sfx-id={id} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <defs><clipPath id={id}><circle cx={x} cy={y} r={r} /></clipPath></defs>
      <circle cx={x + 4} cy={y + 8} r={r + 8} fill="#000000" opacity="0.15" />
      <circle cx={x} cy={y} r={r + 8} fill={ring} />
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
}

/** Diagram batang perbandingan yang tumbuh bertahap (grafik data muncul saat dijelaskan). */
export function BarCompare({ f, a, x, y, w, items, max, row = 92 }: { f: number; a: number; x: number; y: number; w: number; items: { label: string; value: number; color?: string; note?: string }[]; max?: number; row?: number }) {
  if (f < a) return null;
  const m = max ?? Math.max(...items.map((i) => i.value));
  return (
    <g data-fx="diagram" data-box={`${x - 10},${y - 20},${x + w + 10},${y + items.length * row}`}>
      {items.map((it, i) => {
        const q = quick(f, a + i * 6, a + i * 6 + 18);
        const bw = (w - 20) * (it.value / m) * q;
        return (
          <g key={i} data-sfx="pop" data-sfx-id={`bar-${a}-${i}`} opacity={unit(q * 4)}>
            <text x={x} y={y + i * row + 14} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>{it.label}</text>
            <rect x={x} y={y + i * row + 26} width={Math.max(bw, 4)} height="40" rx="8" fill={it.color ?? P.sage} />
            {it.note && <text x={x + bw + 14} y={y + i * row + 56} fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.wine} opacity={unit((q - 0.7) * 4)}>{it.note}</text>}
          </g>
        );
      })}
    </g>
  );
}
