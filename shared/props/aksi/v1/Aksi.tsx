// Properti aksi/orasi (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1 revisi naskah 1 (pengguna: "aku mau
// naskah nya soal kritik ke pemerintah, orasi nya tajam, sedikit marah, mention kebakaran hutan di province lain juga").
//   <Megafon s arah />         megafon dipegang (anchor tangan di gagang, 0,0); arah 1 = corong ke kanan layar, sudut derajat
//   <PosterAksi teks s ... />  poster karton bertangkai (anchor tangan di ujung bawah tangkai); teks = baris (huruf besar)
//   <PanggungKTT x y w h teks /> isi layar berita: podium + mikrofon + bendera Indonesia, Singapura, Malaysia + teks berjalan.
//                              TANPA wajah/tokoh nyata (aturan: tidak meniru orang nyata); kutipan ditulis dengan sumbernya.
// Poster aksi adalah karangan Less. untuk aksi fiktif Naya (bukan spanduk aksi nyata; spanduk nyata tidak diganti, lihat
// references/arahan-pengguna.md bagian Naskah).
import React from 'react';
import { P } from '../../../core/v1/core';

export function Megafon({ s = 1, arah = 1, sudut = -18 }: { s?: number; arah?: number; sudut?: number }) {
  return (
    <g data-detail="megafon" transform={`scale(${s * arah} ${s}) rotate(${sudut})`}>
      <rect x="-8" y="-6" width="16" height="34" rx="5" fill="#3C3F44" />
      <path d="M-10 -14L34 -24L84 -54L84 34L34 6L-10 -2Z" fill="#E9E4DA" />
      <path d="M34 -24L84 -54L84 34L34 6Z" fill="#D9D2C4" />
      <ellipse cx="84" cy="-10" rx="10" ry="44" fill="#C24E4E" />
      <ellipse cx="86" cy="-10" rx="5" ry="34" fill="#8E3434" />
      <rect x="-22" y="-18" width="22" height="20" rx="5" fill="#C24E4E" />
      <path d="M10 -18L28 -22" stroke="#FFFFFF" strokeWidth="3" opacity=".6" />
    </g>
  );
}

export function PosterAksi({ teks, s = 1, w = 220, h = 140, warna = '#FFF6E3', tinta = '#2B2A28', aksen = '#C24E4E', miring = 0 }: { teks: string[]; s?: number; w?: number; h?: number; warna?: string; tinta?: string; aksen?: string; miring?: number }) {
  const fs = Math.min(42, (h - 30) / teks.length - 4, (w - 24) / (Math.max(...teks.map((t) => t.length)) * 0.62));
  return (
    <g data-detail="poster-aksi" transform={`scale(${s}) rotate(${miring})`}>
      <rect x="-4" y={-h - 150} width="8" height={h + 160} fill="#9B7650" />
      <g transform={`translate(0 ${-150 - h})`}>
        <rect x={-w / 2 + 6} y="8" width={w} height={h} fill="#000" opacity=".15" />
        <rect x={-w / 2} y="0" width={w} height={h} fill={warna} />
        <rect x={-w / 2} y="0" width={w} height="10" fill={aksen} />
        {teks.map((t, i) => (
          <text key={i} x="0" y={18 + (h - 18) / 2 + (i - (teks.length - 1) / 2) * (fs + 6) + fs * 0.36} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={fs} fill={i === teks.length - 1 ? aksen : tinta}>{t}</text>
        ))}
      </g>
    </g>
  );
}

const Bendera = ({ x, y, w, jenis, f = 0 }: { x: number; y: number; w: number; jenis: 'id' | 'sg' | 'my'; f?: number }) => {
  const h = w * 0.62;
  const g = Math.sin(f * 0.15 + x) * w * 0.03;
  const isi =
    jenis === 'id' ? (
      <>
        <rect x="0" y="0" width={w} height={h / 2} fill="#D93B33" />
        <rect x="0" y={h / 2} width={w} height={h / 2} fill="#FFFFFF" />
      </>
    ) : jenis === 'sg' ? (
      <>
        <rect x="0" y="0" width={w} height={h / 2} fill="#D93B33" />
        <rect x="0" y={h / 2} width={w} height={h / 2} fill="#FFFFFF" />
        <circle cx={w * 0.2} cy={h * 0.25} r={h * 0.15} fill="#FFFFFF" />
        <circle cx={w * 0.24} cy={h * 0.25} r={h * 0.13} fill="#D93B33" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={w * 0.33 + Math.cos((i / 5) * Math.PI * 2 - Math.PI / 2) * h * 0.08} cy={h * 0.25 + Math.sin((i / 5) * Math.PI * 2 - Math.PI / 2) * h * 0.08} r={h * 0.022} fill="#FFFFFF" />
        ))}
      </>
    ) : (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="0" y={(i * h) / 8} width={w} height={h / 16} fill="#D93B33" />
        ))}
        <rect x="0" y={h / 16} width={w} height={h} fill="none" />
        <rect x="0" y="0" width={w * 0.5} height={h * 0.56} fill="#2B3F8F" />
        <circle cx={w * 0.2} cy={h * 0.28} r={h * 0.17} fill="#F2C33A" />
        <circle cx={w * 0.25} cy={h * 0.28} r={h * 0.15} fill="#2B3F8F" />
        <circle cx={w * 0.36} cy={h * 0.28} r={h * 0.07} fill="#F2C33A" />
      </>
    );
  return (
    <g data-detail={`bendera-${jenis}`}>
      <rect x={x - 3} y={y - 6} width="5" height={h * 2.4} fill="#B9B4AA" />
      <g transform={`translate(${x} ${y}) skewY(${g})`}>{isi}</g>
    </g>
  );
};

/** layar berita: podium KTT kosong dengan mikrofon + tiga bendera + teks berjalan (koordinat layar/dunia bebas) */
export function PanggungKTT({ x, y, w, h, f = 0, judul = 'KTT ASEAN', teks = 'Minta maaf soal asap ke Singapura dan Malaysia', id = 'ktt' }: { x: number; y: number; w: number; h: number; f?: number; judul?: string; teks?: string; id?: string }) {
  const bw = w * 0.16;
  return (
    <g data-detail="panggung-ktt">
      <defs>
        <clipPath id={`${id}-k`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24456E" />
          <stop offset="1" stopColor="#3B6496" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-k)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-bg)`} />
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={x + w * (0.1 + i * 0.17)} cy={y + h * 0.22} r={w * 0.07} fill="#FFFFFF" opacity=".06" />
        ))}
        <Bendera x={x + w * 0.12} y={y + h * 0.16} w={bw} jenis="sg" f={f} />
        <Bendera x={x + w * 0.42} y={y + h * 0.12} w={bw} jenis="id" f={f} />
        <Bendera x={x + w * 0.72} y={y + h * 0.16} w={bw} jenis="my" f={f} />
        {/* podium + mikrofon, kosong */}
        <path d={`M${x + w * 0.36} ${y + h * 0.5}H${x + w * 0.64}L${x + w * 0.6} ${y + h * 0.82}H${x + w * 0.4}Z`} fill="#D8CDB8" />
        <rect x={x + w * 0.36} y={y + h * 0.48} width={w * 0.28} height={h * 0.04} fill="#BFB29A" />
        <path d={`M${x + w * 0.5} ${y + h * 0.48}L${x + w * 0.47} ${y + h * 0.38}`} stroke="#3C3F44" strokeWidth={Math.max(2, w * 0.008)} />
        <ellipse cx={x + w * 0.468} cy={y + h * 0.37} rx={w * 0.012} ry={w * 0.02} fill="#3C3F44" />
        <rect x={x} y={y + h * 0.82} width={w} height={h * 0.18} fill="#C24E4E" />
        <rect x={x} y={y + h * 0.82} width={w * 0.3} height={h * 0.18} fill="#8E3434" />
        <text x={x + w * 0.15} y={y + h * 0.93} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={Math.min(h * 0.08, (w * 0.27) / (judul.length * 0.62))} fill="#FFFFFF">{judul}</text>
        <clipPath id={`${id}-tk`}>
          <rect x={x + w * 0.32} y={y + h * 0.82} width={w * 0.68} height={h * 0.18} />
        </clipPath>
        <g clipPath={`url(#${id}-tk)`}>
          <text x={x + w * 0.33 - ((f * 1.2) % (w * 0.6))} y={y + h * 0.935} fontFamily="Lato" fontWeight="700" fontSize={h * 0.07} fill="#FFFFFF">{teks}</text>
        </g>
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={P.ink} strokeWidth={Math.max(2, w * 0.01)} opacity=".4" />
    </g>
  );
}
