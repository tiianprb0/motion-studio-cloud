// Gelembung pikiran (awan berisi gambar) untuk "di kepalaku / bayanganku" (v1 di film/v2, 18 Nov 2026). Dibuat untuk
// "Kebakaran Hutan Papua" v1 (Naya membayangkan hutan Papua yang lebat dan basah). Berbeda dengan Bubble (ucapan, maks
// 4 kata): ini wadah GAMBAR, ekornya tiga lingkaran kecil menuju kepala, tanpa teks wajib.
//   <GelembungPikir x y w h kepala muncul id>{isi gambar, koordinat layar}</GelembungPikir>
//   (x, y) = pusat awan di layar; kepala = { x, y, r } layar (ekor menuju tepi kepala); muncul 0..1 (skala + opasitas).
//   data-box = kotak awan (dicek audit safe zone: kiri ≥ 110, kanan ≤ 920, atas ≥ 220, bawah ≤ 1480).
import React from 'react';
import { P } from '../../core/v1/core';
import type { Kepala } from './Bubble';

const awan = (x: number, y: number, w: number, h: number) => {
  // tepi bergelombang dari 12 busur
  const n = 12;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [x + Math.cos(a) * w * 0.5, y + Math.sin(a) * h * 0.5];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i],
      b = pts[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2,
      my = (a[1] + b[1]) / 2;
    const ox = (mx - x) * 0.22,
      oy = (my - y) * 0.22;
    d += `Q${(mx + ox).toFixed(1)} ${(my + oy).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return d + 'Z';
};

export function GelembungPikir({ x, y, w, h, kepala, muncul = 1, warna = P.cream, id = 'pikir', children }: { x: number; y: number; w: number; h: number; kepala: Kepala; muncul?: number; warna?: string; id?: string; children?: React.ReactNode }) {
  const m = Math.max(0, Math.min(1, muncul));
  if (m <= 0) return null;
  const sk = m < 1 ? 0.55 + 0.45 * m + 0.08 * Math.sin(m * Math.PI) : 1;
  // ekor: tiga lingkaran dari tepi kepala ke tepi bawah awan
  const tx = kepala.x + (x - kepala.x) * 0.0,
    ty = kepala.y;
  const ex = x + (kepala.x - x) * 0.35,
    ey = y + h * 0.48;
  const dx = ex - tx,
    dy = ey - ty;
  const L = Math.hypot(dx, dy) || 1;
  const mulai = [tx + (dx / L) * (kepala.r + 16), ty + (dy / L) * (kepala.r + 16)];
  const ekor = [0.18, 0.5, 0.82].map((t, i) => ({ cx: mulai[0] + (ex - mulai[0]) * t, cy: mulai[1] + (ey - mulai[1]) * t, r: 10 + i * 9 }));
  const d = awan(x, y, w, h);
  return (
    <g data-fx="pikiran" opacity={Math.min(1, m * 2).toFixed(3)} data-sfx="pop" data-sfx-id={`${id}-pop`}>
      {ekor.map((e, i) => (
        <circle key={i} cx={e.cx} cy={e.cy} r={e.r * Math.min(1, m * 1.5)} fill={warna} stroke={P.ink} strokeOpacity=".12" strokeWidth="3" />
      ))}
      <g transform={`translate(${x} ${y}) scale(${sk.toFixed(3)}) translate(${-x} ${-y})`}>
        <path d={d} transform={`translate(10 16)`} fill={P.ink} opacity=".14" />
        <path d={d} fill={warna} data-box={`${Math.round(x - w / 2)},${Math.round(y - h / 2)},${Math.round(x + w / 2)},${Math.round(y + h / 2)}`} />
        <defs>
          <clipPath id={`${id}-isi`}>
            <path d={awan(x, y, w * 0.9, h * 0.86)} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-isi)`}>{children}</g>
      </g>
    </g>
  );
}
