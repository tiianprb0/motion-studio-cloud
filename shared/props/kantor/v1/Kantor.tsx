// Properti kantor (v1, 13 Nov 2026), dibuat untuk "Hari Pertama Kerja" v1 (agen Buat konten).
// - TandaPengenal: tali + kartu pengenal karyawan di dada tokoh rig v2/v3. Digambar SESUDAH <Person> dengan x, y, s
//   yang sama (koordinat rig: kaki di (x,y), kerah ±-236, pinggang ±-136). `pudar` 0..1 = kartu lusuh/kusam,
//   `miring` = kartu terpelintir (derajat). Tampak belakang tidak menggambar kartu (hanya tali di tengkuk).
// - Kardus: kotak barang karyawan baru (isi pot kecil + buku), untuk dipegang (holdRight/holdLeft) atau diletakkan.
// - Stiker: kertas tempel (sticky note) dengan tulisan tangan, untuk partisi/monitor/papan.
// - TumpukanMap: tumpukan map/berkas (tinggi = jumlah), untuk meja.
import React from 'react';
import { P } from '../../../core/v1/core';

export function TandaPengenal({ x, y, s = 1, dir = 1, view = 'three', nama = 'YAN', jabatan = 'STAF BARU', tali = P.wine, pudar = 0, miring = 0 }: { x: number; y: number; s?: number; dir?: number; view?: 'front' | 'three' | 'back' | 'side' | 'serong'; nama?: string; jabatan?: string; tali?: string; pudar?: number; miring?: number }) {
  if (view === 'back') {
    return (
      <g data-prop="tanda-pengenal" transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-14 -238Q0 -232 14 -238" stroke={tali} strokeWidth="3.2" fill="none" />
      </g>
    );
  }
  const dx = view === 'three' ? dir * 3 : 0;
  const kartu = pudar > 0 ? `rgb(${Math.round(250 - 40 * pudar)},${Math.round(248 - 44 * pudar)},${Math.round(240 - 40 * pudar)})` : '#FAF8F0';
  return (
    <g data-prop="tanda-pengenal" transform={`translate(${x + dx * s} ${y}) scale(${s})`}>
      <path d="M-13 -236L-4 -190M13 -236L4 -190" stroke={tali} strokeWidth="3.4" strokeLinecap="round" opacity={1 - 0.3 * pudar} />
      <g transform={`rotate(${miring} 0 -190)`}>
        <rect x="-3" y="-193" width="6" height="7" rx="1.5" fill="#B9BEBB" />
        <rect x="-15" y="-187" width="30" height="40" rx="3" fill={kartu} stroke="#C9CFCB" strokeWidth="1" />
        <rect x="-15" y="-187" width="30" height="9" rx="3" fill={tali} opacity={1 - 0.4 * pudar} />
        <rect x="-8" y="-175" width="16" height="15" rx="2" fill="#C7D3CC" opacity={1 - 0.5 * pudar} />
        <text x="0" y="-152" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="6.4" fill={P.ink} opacity={1 - 0.6 * pudar}>{nama}</text>
        <text x="0" y="-148.6" textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="3.2" fill={P.ink} opacity={0.8 - 0.6 * pudar}>{jabatan}</text>
      </g>
    </g>
  );
}

/** kardus karyawan baru, pusat bawah di (0,0), lebar ±70 px pada s=1 */
export const Kardus = ({ s = 1 }: { s?: number }) => (
  <g data-prop="kardus" transform={`scale(${s})`}>
    {/* pot kecil + daun */}
    <path d="M18 -62q-6 -26 4 -40q8 14 -2 40M24 -62q10 -22 26 -26q-6 20 -24 26" fill="#6F9C74" />
    <rect x="12" y="-64" width="22" height="16" rx="3" fill="#C9805A" />
    {/* buku */}
    <rect x="-40" y="-70" width="34" height="24" fill="#3E7F6A" transform="rotate(-8 -23 -58)" />
    <rect x="-56" y="-52" width="112" height="52" rx="3" fill="#C99B6A" />
    <path d="M-56 -52h112l-8 -12h-96Z" fill="#D9AE7E" />
    <path d="M-56 -30h112" stroke="#A97E52" strokeWidth="2" opacity=".6" />
    <rect x="-18" y="-40" width="36" height="10" fill="#F1E6D0" opacity=".9" />
  </g>
);

/** kertas tempel; teks pakai \n untuk baris; pusat di (0,0), lebar 76 px pada s=1 */
export const Stiker = ({ teks, warna = '#FFE58A', tinta = P.ink, rot = 0, s = 1, opacity = 1 }: { teks: string; warna?: string; tinta?: string; rot?: number; s?: number; opacity?: number }) => {
  const baris = teks.split('\n');
  return (
    <g data-prop="stiker" opacity={opacity} transform={`rotate(${rot}) scale(${s})`}>
      <rect x="-38" y="-34" width="76" height="68" fill="#000" opacity=".1" transform="translate(2 3)" />
      <rect x="-38" y="-34" width="76" height="68" fill={warna} />
      <rect x="-38" y="-34" width="76" height="12" fill="#000" opacity=".05" />
      {baris.map((b, i) => (
        <text key={i} x="0" y={-4 + (i - (baris.length - 1) / 2) * 15 + 6} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={b.length > 9 ? 10 : 12} fill={tinta}>{b}</text>
      ))}
    </g>
  );
};

/** tumpukan map/berkas; n = jumlah lapis; pusat bawah di (0,0), lebar 120 px pada s=1 */
export const TumpukanMap = ({ n = 6, s = 1, seed = 1 }: { n?: number; s?: number; seed?: number }) => {
  const warna = ['#E8C76A', '#9CB7D1', '#E9A08C', '#F4F0E6', '#A9C9A4', '#D6B98E'];
  const acak = (k: number) => {
    const v = Math.sin((k + seed * 13) * 91.7) * 4375.5;
    return v - Math.floor(v);
  };
  return (
    <g data-prop="map" transform={`scale(${s})`}>
      {Array.from({ length: n }, (_, i) => {
        const dx = (acak(i) - 0.5) * 14,
          h = 9 + acak(i + 5) * 5;
        const y = -i * 11 - h;
        return (
          <g key={i} transform={`translate(${dx.toFixed(1)} 0)`}>
            <rect x="-60" y={y} width="120" height={h} fill={warna[(i + seed) % warna.length]} />
            <rect x="-56" y={y + 2} width="112" height="2" fill="#FFFFFF" opacity=".5" />
            {acak(i + 9) > 0.6 && <rect x="30" y={y - 6} width="14" height="8" fill="#F0D98A" />}
          </g>
        );
      })}
    </g>
  );
};
