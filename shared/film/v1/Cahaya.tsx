// Cahaya sinematik (8 Nov 2026, seri Lirik "the cure" v3; acuan pengguna: cahaya adalah cerita).
// STATUS: kandidat (ditunjukkan lewat frame contoh the cure v3).
// Gelap = ruangan gelap dengan lubang cahaya; Sorot = berkas cahaya (bulan/jendela/pintu); Debu = partikel di berkas;
// Silau = cahaya menyilaukan (bloom). Semua di ruang yang sama dengan tokoh (ikut kamera).
import React from 'react';

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
type Lampu = { x: number; y: number; r: number; kuat?: number };

/** Gelap: lapisan malam dengan campuran "multiply" (bayangan benar-benar gelap, warna di area terang tetap hidup).
 *  lampu = lubang cahaya bulat; berkas = lubang berbentuk poligon (sinar jendela/pintu), tepinya dilembutkan.
 *  hangat = cahaya hangat tambahan (campuran "screen") di sekitar sumber lampu. */
export function Gelap({ lampu = [], berkas = [], hangat = [], gelap = 1, warna = '#1A2533', id = 'gelap' }: { lampu?: Lampu[]; berkas?: number[][][]; hangat?: (Lampu & { warna?: string })[]; gelap?: number; warna?: string; id?: string }) {
  return (
    <g data-fx="gelap" pointerEvents="none">
      <defs>
        {lampu.map((l, i) => (
          <radialGradient key={i} id={`${id}-g${i}`} cx={l.x} cy={l.y} r={l.r} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity={l.kuat ?? 1} />
            <stop offset="0.5" stopColor="#000" stopOpacity={(l.kuat ?? 1) * 0.6} />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        ))}
        {hangat.map((l, i) => (
          <radialGradient key={i} id={`${id}-h${i}`} cx={l.x} cy={l.y} r={l.r} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={l.warna ?? '#FFB866'} stopOpacity={l.kuat ?? 0.5} />
            <stop offset="1" stopColor={l.warna ?? '#FFB866'} stopOpacity="0" />
          </radialGradient>
        ))}
        <filter id={`${id}-bl`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28" /></filter>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="6000">
          <rect x="-2000" y="-2000" width="5000" height="6000" fill="#fff" />
          {lampu.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}-g${i})`} />)}
          {berkas.map((pts, i) => <path key={i} d={'M' + pts.map((q) => q.join(' ')).join('L') + 'Z'} fill="#000" opacity=".85" filter={`url(#${id}-bl)`} />)}
        </mask>
      </defs>
      <rect x="-2000" y="-2000" width="5000" height="6000" fill={warna} opacity={gelap} mask={`url(#${id}-m)`} style={{ mixBlendMode: 'multiply' }} />
      {hangat.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}-h${i})`} style={{ mixBlendMode: 'screen' }} />)}
    </g>
  );
}

/** Berkas cahaya dari bukaan (x0,y0 lebar w0) ke lantai/benda (x1,y1 lebar w1), memudar ke ujung. */
export function Sorot({ x0, y0, w0, x1, y1, w1, warna = '#CFE0FF', kuat = 0.32, id = 'sorot' }: { x0: number; y0: number; w0: number; x1: number; y1: number; w1: number; warna?: string; kuat?: number; id?: string }) {
  return (
    <g data-fx="sorot" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-l`} x1={x0} y1={y0} x2={x1} y2={y1} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={warna} stopOpacity={kuat} />
          <stop offset="1" stopColor={warna} stopOpacity={kuat * 0.25} />
        </linearGradient>
        <filter id={`${id}-b`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <path d={`M${x0 - w0 / 2} ${y0}L${x0 + w0 / 2} ${y0}L${x1 + w1 / 2} ${y1}L${x1 - w1 / 2} ${y1}Z`} fill={`url(#${id}-l)`} filter={`url(#${id}-b)`} />
    </g>
  );
}

/** Debu melayang pelan di dalam kotak (x,y,w,h); terlihat terutama di berkas cahaya. */
export function Debu({ x, y, w, h, f, n = 26, warna = '#F4F1EA', kuat = 0.7, seed = 1 }: { x: number; y: number; w: number; h: number; f: number; n?: number; warna?: string; kuat?: number; seed?: number }) {
  return (
    <g data-fx="debu" pointerEvents="none">
      {Array.from({ length: n }, (_, i) => {
        const a = acak(i * 3 + seed), b = acak(i * 7 + seed * 2), c = acak(i * 11 + seed * 5);
        const yy = y + ((b * h - f * (0.25 + c * 0.35)) % h + h) % h;
        const xx = x + a * w + Math.sin(f * 0.02 + i) * 10;
        return <circle key={i} cx={xx} cy={yy} r={1.5 + c * 2.8} fill={warna} opacity={kuat * (0.35 + 0.65 * Math.abs(Math.sin(f * 0.03 + i)))} />;
      })}
    </g>
  );
}

/** Cahaya menyilaukan (bloom) di (x,y). */
export function Silau({ x, y, r, warna = '#FFE2A0', kuat = 0.8, id = 'silau' }: { x: number; y: number; r: number; warna?: string; kuat?: number; id?: string }) {
  return (
    <g data-fx="silau" pointerEvents="none">
      <defs>
        <radialGradient id={id} cx={x} cy={y} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF5" stopOpacity={kuat} />
          <stop offset="0.25" stopColor={warna} stopOpacity={kuat * 0.7} />
          <stop offset="1" stopColor={warna} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  );
}

/** Air mata: garis basah dari mata (x,y) turun ke pipi, berkilau. panjang 0..1. */
export function AirMata({ x, y, s = 1, panjang = 1, f = 0 }: { x: number; y: number; s?: number; panjang?: number; f?: number }) {
  const L = 34 * s * panjang;
  return (
    <g data-fx="air-mata" pointerEvents="none">
      <path d={`M${x} ${y}q${2 * s} ${L * 0.5} ${-1 * s} ${L}`} stroke="#E9F4FF" strokeWidth={3.2 * s} fill="none" strokeLinecap="round" opacity=".85" />
      {panjang > 0.6 && <circle cx={x - s} cy={y + L + 3 * s + Math.sin(f * 0.2) * s} r={2.6 * s} fill="#F4FAFF" opacity=".9" />}
    </g>
  );
}
