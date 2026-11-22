// Spanduk kain panjang yang dibentangkan dua orang (v2, 21 Nov 2026; v1 Aksi.tsx terkunci dan tidak diubah).
// Dibuat untuk "Badaknya Diselamatkan, Warganya?" (aksi warga di depan Balai TN Ujung Kulon).
//   <Spanduk x0 x1 y h teks buka f warna tinta />  x0..x1 = kedua tangan pemegang (koordinat dunia), y = tinggi tangan
//   buka 0..1: kain tergulung di kiri → terbentang penuh. Teks maks dua baris (array). Kain sedikit melambai mengikuti f.
// Aturan teks aksi nyata (arahan-pengguna.md, bagian Naskah): tulis teks asli spanduk bila diketahui dan catat sumbernya.
import React from 'react';

export function Spanduk({ x0, x1, y, h = 150, teks, buka = 1, f = 0, warna = '#FFF6E3', tinta = '#2B2A28', aksen = '#C24E4E', id = 'spanduk' }: { x0: number; x1: number; y: number; h?: number; teks: string[]; buka?: number; f?: number; warna?: string; tinta?: string; aksen?: string; id?: string }) {
  const u = Math.max(0, Math.min(1, buka));
  const xe = x0 + (x1 - x0) * u;
  const ombak = (k: number) => Math.sin(f * 0.12 + k) * 6;
  const W = x1 - x0;
  const fs = Math.min(h * 0.36, (W * 0.92) / (Math.max(...teks.map((t) => t.length)) * 0.6));
  return (
    <g data-benda="spanduk">
      <defs>
        <clipPath id={`${id}-k`}>
          <rect x={x0} y={y - 40} width={Math.max(1, xe - x0)} height={h + 80} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-k)`}>
        <path d={`M${x0} ${y} Q${x0 + W / 2} ${y + ombak(0)} ${x1} ${y} L${x1} ${y + h} Q${x0 + W / 2} ${y + h + ombak(1) + 10} ${x0} ${y + h} Z`} fill={warna} stroke="#D8CDB8" strokeWidth="3" />
        <rect x={x0} y={y} width={W} height={h * 0.12} fill={aksen} />
        <rect x={x0} y={y + h * 0.88} width={W} height={h * 0.12} fill={aksen} />
        {teks.map((t, i) => (
          <text key={i} x={x0 + W / 2} y={y + h * (teks.length === 1 ? 0.62 : 0.43 + i * 0.32)} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={fs} fill={i === 0 ? tinta : aksen}>{t}</text>
        ))}
      </g>
      {u < 1 && <rect x={xe - 14} y={y - 6} width="28" height={h + 12} rx="12" fill="#E8DCC4" stroke="#C9BC9F" strokeWidth="3" />}
    </g>
  );
}
