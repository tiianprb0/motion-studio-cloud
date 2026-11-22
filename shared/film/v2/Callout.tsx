// Label bergaris penunjuk v2 (13 Nov 2026). Tampilan label sama dengan Callout v1 (shared/film/v1/Screen.tsx, gaya Kok
// Bisa?, disetujui 7 Nov 2026): kotak berwarna, Lato Black huruf besar, titik di ujung, muncul memantul, data-box +
// data-sfx "pop". Dibuat atas dua koreksi pengguna pada video Hari Pertama Kerja v1 (13 Nov 2026):
//   1. "garis untuk overlay tolong dibenerin" — v1 selalu menarik garis dari tengah sisi kiri/kanan kotak, walaupun benda
//      yang ditunjuk ada di atas/bawah; garis keluar dari sudut lalu naik/turun tegak dan bisa memotong label lain.
//   2. "garisnya jangan tarik lurus, tapi bersiku L" — garis penunjuk BERSIKU L (satu belokan 90°), bukan garis miring.
// Bentuk garis (siku):
//   A. Sasaran di luar rentang mendatar label: garis keluar dari tengah sisi kiri/kanan yang menghadap sasaran, mendatar
//      sampai x sasaran, lalu tegak ke sasaran (siku di (x sasaran, y label)).
//   B. Sasaran di dalam rentang mendatar label (di atas/bawahnya): garis keluar dari tepi atas/bawah yang menghadap sasaran
//      (digeser `geser` px dari x sasaran ke arah tengah label, tidak di sudut), tegak sampai y sasaran, lalu mendatar ke
//      sasaran (siku di (x pangkal, y sasaran)).
// Garis krem berbayang ink tipis + titik bercincin ink, terbaca di latar terang maupun gelap. Garis digambar bertahap
// mengikuti panjangnya (8 frame) saat label muncul.
// Overlay yang tetap tampil melewati potongan shot: teruskan `a` ASLI (frame pertama label muncul), jangan `a` = awal shot
// baru, supaya animasi muncul dan efek suara pop tidak terulang ("kok kayak dua kali popup?").
// Pakai: <Callout f a b x y target={[tx, ty]} text size color ink geser />
import React from 'react';
import { P, popIn, quick } from '../../core/v1/core';

type Pt = [number, number];
/** titik-titik garis siku dari tepi label (pusat x,y; lebar w, tinggi h) ke sasaran */
export function garisSiku(x: number, y: number, w: number, h: number, target: Pt, geser = 60): Pt[] {
  const [tx, ty] = target;
  if (tx < x - w / 2 || tx > x + w / 2) {
    const sx = x + Math.sign(tx - x) * (w / 2);
    return [[sx, y], [tx, y], [tx, ty]];
  }
  const sisi = Math.sign(ty - y || 1);
  const sx = Math.max(x - w / 2 + 14, Math.min(x + w / 2 - 14, tx + (tx < x ? geser : -geser)));
  const sy = y + sisi * (h / 2);
  return [[sx, sy], [sx, ty], [tx, ty]];
}
/** potong polyline sampai bagian `t` (0..1) dari panjangnya */
function potong(pts: Pt[], t: number): Pt[] {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let sisa = seg.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, t));
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (sisa >= seg[i]) {
      out.push(pts[i + 1]);
      sisa -= seg[i];
      continue;
    }
    const k = seg[i] > 0 ? sisa / seg[i] : 0;
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
    break;
  }
  return out;
}

export function Callout({ f, a, b, x, y, target, text, size = 40, color = P.wine, ink = P.cream, geser = 60 }: { f: number; a: number; b: number; x: number; y: number; target: Pt; text: string; size?: number; color?: string; ink?: string; geser?: number }) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const w = text.length * size * 0.66 + size * 1.2,
    h = size * 1.7;
  const t = quick(f, a, a + 8);
  const pts = potong(garisSiku(x, y, w, h, target, geser), t);
  const d = 'M' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L');
  const L = Math.round(Math.min(x - w / 2, target[0] - 10)),
    T = Math.round(Math.min(y - h / 2, target[1] - 10));
  const R = Math.round(Math.max(x + w / 2, target[0] + 10)),
    B = Math.round(Math.max(y + h / 2, target[1] + 10));
  return (
    <g opacity={o} data-fx="label" data-box={`${L},${T},${R},${B}`} data-sfx="pop" data-sfx-id={`label-${a}-${text}`}>
      <path d={d} stroke={P.ink} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".35" />
      <path d={d} stroke={P.cream} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={target[0]} cy={target[1]} r={11 * t} fill={P.ink} opacity=".45" />
      <circle cx={target[0]} cy={target[1]} r={8 * t} fill={P.cream} />
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill={color} />
        <text x={x} y={y + size * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={ink} letterSpacing="1">{text.toUpperCase()}</text>
      </g>
    </g>
  );
}
