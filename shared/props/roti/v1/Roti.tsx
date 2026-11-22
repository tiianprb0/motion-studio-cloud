// Properti bersama: roti kelapa bungkus plastik (9 Nov 2026, dibuat untuk proyek "Hadiah Kecil" atas izin pengguna).
// Roti bulat cokelat keemasan dengan isi kelapa-gula merah yang mengintip, di dalam plastik bening berujung kerut,
// stiker kecil "ROTI KELAPA". Titik genggam (0,0) = tengah bungkus: pakai di holdRight/holdLeft rig,
// atau taruh di permukaan dengan `letak` (alas di y 0). Satuan rig: lebar ±56 (≈ 28 cm bila tokoh 330 = 1,65 m;
// sedikit dibesarkan supaya terbaca di layar HP). Warna dari shared/core/v1.
import React from 'react';
import { P } from '../../../core/v1/core';

export function Roti({ s = 1, letak = false, label = 'ROTI KELAPA', terbuka = false }: { s?: number; letak?: boolean; label?: string; terbuka?: boolean }) {
  const dy = letak ? -17 : 0; // letak: alas bungkus di y 0
  return (
    <g transform={`scale(${s}) translate(0 ${dy})`} data-prop="roti-kelapa">
      {letak && <ellipse cx="0" cy="18" rx="30" ry="4" fill={P.ink} opacity=".14" />}
      {/* roti */}
      <path d="M-22 10q-2 -22 22 -24q24 2 22 24Z" fill="#C98445" />
      <path d="M-22 10h44q0 6 -4 7h-36q-4 -1 -4 -7Z" fill="#A9662F" />
      <path d="M-14 -6q8 -8 20 -6" stroke="#E6B172" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".85" />
      {/* belahan isi kelapa-gula merah */}
      <path d="M-12 3q12 -5 24 0q-12 5 -24 0Z" fill="#7A4A26" />
      <g stroke="#F4EBD8" strokeWidth="1.4" strokeLinecap="round">
        <path d="M-8 2l3 1M-2 1l3 2M4 1l3 1M-5 4l2 1M6 3l2 1" />
      </g>
      {/* taburan wijen */}
      {[[-10, -7], [-3, -11], [5, -10], [12, -5]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="1.6" ry="1" fill="#FFF1D6" />)}
      {/* plastik bening */}
      {!terbuka && (
        <g>
          <rect x="-26" y="-17" width="52" height="36" rx="9" fill="#FFFFFF" opacity=".22" stroke="#E9EEF0" strokeWidth="1.6" />
          <path d="M-26 -12l-6 3l5 3l-5 3l5 3l-5 3l6 3M26 -12l6 3l-5 3l5 3l-5 3l5 3l-6 3" fill="#FFFFFF" opacity=".55" stroke="#E2E8EA" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M-19 -13q3 12 -1 26" stroke="#FFFFFF" strokeWidth="2.4" opacity=".7" fill="none" strokeLinecap="round" />
          <path d="M14 -14l6 0" stroke="#FFFFFF" strokeWidth="2" opacity=".8" strokeLinecap="round" />
          {/* stiker */}
          <rect x="-18" y="9" width="36" height="9" rx="2.5" fill={P.cream} stroke={P.wine} strokeWidth="1" />
          <text x="0" y="15.4" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="4.6" fill={P.wine}>{label}</text>
        </g>
      )}
    </g>
  );
}
