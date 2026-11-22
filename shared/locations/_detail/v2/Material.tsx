// Material permukaan ala Kok Bisa? (disetujui pengguna 7 Nov 2026): sedikit benda pun terasa "mahal" karena
// permukaannya punya pantulan, gradasi, nat, dan uap. Melengkapi benda-benda di _detail/v1 (tetap dipakai).
// Semua gradien memakai id unik dari parameter; frame-driven dan deterministik.
import React from 'react';
import { P } from '../../../core/v1/core';

const fid = (p: string, ...xs: number[]) => `${p}-${xs.map((x) => Math.round(x)).join('-')}`;

/** Kaca jendela/etalase: gradasi langit, dua garis pantulan diagonal, kilau sudut, kusen opsional. */
export function GlassPane({ x, y, w, h, f = 0, sky = '#CFE6F0', deep = '#9CC3D4', frame = P.cream, frameW = 14, mullion = true, id }: { x: number; y: number; w: number; h: number; f?: number; sky?: string; deep?: string; frame?: string | null; frameW?: number; mullion?: boolean; id?: string }) {
  const k = id ?? fid('glass', x, y, w, h);
  const s = 4 * Math.sin(f * 0.015);
  return (
    <g data-material="kaca">
      <defs>
        <linearGradient id={`${k}-g`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <clipPath id={`${k}-c`}><rect x={x} y={y} width={w} height={h} /></clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${k}-g)`} />
      <g clipPath={`url(#${k}-c)`}>
        <path d={`M${x + w * 0.08 + s} ${y + h}L${x + w * 0.62 + s} ${y - 2}h${w * 0.13}L${x + w * 0.21 + s} ${y + h}Z`} fill="#FFFFFF" opacity="0.28" />
        <path d={`M${x + w * 0.33 + s} ${y + h}L${x + w * 0.87 + s} ${y - 2}h${w * 0.035}L${x + w * 0.365 + s} ${y + h}Z`} fill="#FFFFFF" opacity="0.42" />
        <ellipse cx={x + w * 0.85} cy={y + h * 0.12} rx={w * 0.08} ry={h * 0.03} fill="#FFFFFF" opacity="0.35" />
      </g>
      {mullion && <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h * 0.45}h${w}`} stroke={frame ?? P.cream} strokeWidth={frameW * 0.6} />}
      {frame && <rect x={x} y={y} width={w} height={h} fill="none" stroke={frame} strokeWidth={frameW} />}
      {frame && <path d={`M${x - frameW / 2} ${y + h + frameW / 2}h${w + frameW}`} stroke={P.ink} strokeOpacity="0.12" strokeWidth="6" />}
    </g>
  );
}

/** Dinding ubin: tiap ubin bergradasi (terang di atas), nat terang, beberapa kilau buram. */
export function TileWall({ x, y, w, h, tile = 96, color = '#BFDCE6', shade = '#A9CCD8', grout = '#EAF5F8', glints = true, id }: { x: number; y: number; w: number; h: number; tile?: number; color?: string; shade?: string; grout?: string; glints?: boolean; id?: string }) {
  const k = id ?? fid('tile', x, y, w, h, tile);
  const cols = Math.ceil(w / tile), rows = Math.ceil(h / tile);
  return (
    <g data-material="ubin">
      <defs>
        <linearGradient id={`${k}-g`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <clipPath id={`${k}-c`}><rect x={x} y={y} width={w} height={h} /></clipPath>
        <filter id={`${k}-b`} colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <g clipPath={`url(#${k}-c)`}>
        <rect x={x} y={y} width={w} height={h} fill={grout} />
        {Array.from({ length: rows * cols }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          return <rect key={i} x={x + c * tile + 3} y={y + r * tile + 3} width={tile - 6} height={tile - 6} rx="3" fill={`url(#${k}-g)`} />;
        })}
        {glints && (
          <g filter={`url(#${k}-b)`} opacity="0.55">
            <ellipse cx={x + w * 0.18} cy={y + h * 0.62} rx={tile * 0.42} ry={tile * 0.26} fill="#FFFFFF" />
            <ellipse cx={x + w * 0.78} cy={y + h * 0.4} rx={tile * 0.55} ry={tile * 0.32} fill="#FFFFFF" />
          </g>
        )}
      </g>
    </g>
  );
}

/** Permukaan air (bak, gelas, kolam): tembus pandang, garis pantulan putih tipis yang bergeser pelan. */
export function WaterSurface({ x, y, w, h, f = 0, color = '#A9D3E6', opacity = 0.72 }: { x: number; y: number; w: number; h: number; f?: number; color?: string; opacity?: number }) {
  const lines = [[0.06, 0.18, 0.3], [0.5, 0.42, 0.26], [0.22, 0.7, 0.18]];
  return (
    <g data-material="air">
      <rect x={x} y={y} width={w} height={h} fill={color} opacity={opacity} />
      <path d={`M${x} ${y + 2}h${w}`} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="4" />
      {lines.map(([lx, ly, lw], i) => {
        const dx = 18 * Math.sin(f * 0.04 + i * 1.7);
        return <path key={i} d={`M${x + w * lx + dx} ${y + h * ly}h${w * lw}`} stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />;
      })}
    </g>
  );
}

/** Uap tipis naik (kopi, mie, bak mandi). Gerak pelan mengikuti frame; tanpa loop serempak. */
export function Steam({ x, y, f, count = 3, height = 160, color = '#FFFFFF', opacity = 0.45, id }: { x: number; y: number; f: number; count?: number; height?: number; color?: string; opacity?: number; id?: string }) {
  const k = id ?? fid('steam', x, y);
  return (
    <g data-material="uap" pointerEvents="none">
      <defs><filter id={k} colorInterpolationFilters="sRGB" x="-100%" y="-50%" width="300%" height="200%"><feGaussianBlur stdDeviation="5" /></filter></defs>
      <g filter={`url(#${k})`}>
        {Array.from({ length: count }, (_, i) => {
          const t = ((f * 0.6 + i * 47) % 90) / 90; // 0..1 naik
          const ox = (i - (count - 1) / 2) * 34;
          const sway = 14 * Math.sin(f * 0.05 + i * 2.1);
          return <path key={i} d={`M${x + ox} ${y}c${sway} ${-height * 0.3} ${-sway} ${-height * 0.6} ${sway * 0.6} ${-height}`} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" opacity={opacity * Math.sin(Math.PI * t)} transform={`translate(0 ${-t * 40})`} />;
        })}
      </g>
    </g>
  );
}

/** Tirai berlipat: pita vertikal bergradasi (terang di punggung lipatan, gelap di lekuk). */
export function CurtainFolds({ x, y, w, h, color = '#9CC7B4', folds = 7, sway = 0, id }: { x: number; y: number; w: number; h: number; color?: string; folds?: number; sway?: number; id?: string }) {
  const k = id ?? fid('curtain', x, y, w, h);
  const fw = w / folds;
  return (
    <g data-material="tirai">
      <defs>
        <linearGradient id={k} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={color} />
      {Array.from({ length: folds }, (_, i) => (
        <rect key={i} x={x + i * fw + sway * Math.sin(i)} y={y} width={fw} height={h} fill={`url(#${k})`} />
      ))}
      <path d={`M${x} ${y + 6}h${w}`} stroke="#000000" strokeOpacity="0.12" strokeWidth="10" />
    </g>
  );
}

/** Kilap diagonal untuk permukaan halus (meja vernis, layar mati, logam, kulkas). */
export function Sheen({ x, y, w, h, opacity = 0.22, angle = 0.35, id }: { x: number; y: number; w: number; h: number; opacity?: number; angle?: number; id?: string }) {
  const k = id ?? fid('sheen', x, y, w, h);
  return (
    <g data-material="kilap" pointerEvents="none">
      <defs><clipPath id={k}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
      <g clipPath={`url(#${k})`} opacity={opacity}>
        <path d={`M${x + w * 0.1} ${y + h}L${x + w * (0.1 + angle)} ${y}h${w * 0.12}L${x + w * 0.22} ${y + h}Z`} fill="#FFFFFF" />
        <path d={`M${x + w * 0.3} ${y + h}L${x + w * (0.3 + angle)} ${y}h${w * 0.04}L${x + w * 0.34} ${y + h}Z`} fill="#FFFFFF" />
      </g>
    </g>
  );
}
