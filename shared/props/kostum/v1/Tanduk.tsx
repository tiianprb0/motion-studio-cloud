// Tanduk iblis kecil (kostum "villain") untuk tokoh rig v2 (12 Nov 2026). Saran pengguna atas Aku Bisa Jadi Villain v2:
// "jadi villain saran aku tambahin tanduk kayak iblis gitu wkwk di naya yang di cermin".
// Rig v2 tidak punya slot aksesori kepala, jadi tanduk digambar SESUDAH tokoh, di koordinat kepala:
//   pusat kepala = (x kaki + dir·2·s untuk tampak three, y kaki − 279·s), r = 66·s (sama dengan kepalaDi/Bubble).
// Ubun-ubun rambut bob rata kira-kira ±0,4·r dari tengah dan 0,7·r di atas pusat (ReferenceFace: wajah ×0,86), jadi pangkal
// tanduk di (±0,38·r, −0,64·r) supaya tertanam di rambut; di tepi bulatan r tanduk tampak mengambang (cek 12 Nov 2026).
// muncul 0..1 = tanduk tumbuh dari pangkalnya (sedikit lewat lalu kembali). Merah bata + garis terang, cocok dengan palet P.
import React from 'react';

/** satu tanduk menghadap kanan; pangkal di (0,0), ujung ke atas melengkung keluar (satuan = jari-jari kepala) */
const tanduk = 'M-0.2 0C-0.22 -0.42 -0.02 -0.74 0.24 -0.9C0.13 -0.62 0.2 -0.32 0.2 0Z';

export function TandukIblis({ x, y, r, muncul = 1, warna = '#B3262E', gelap = '#6E1218' }: { x: number; y: number; r: number; muncul?: number; warna?: string; gelap?: string }) {
  if (muncul <= 0) return null;
  const m = Math.min(1, muncul);
  const k = m * (1 + 0.22 * Math.sin(Math.PI * m));
  return (
    <g data-prop="tanduk-iblis" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${r.toFixed(3)})`}>
      {[-1, 1].map((sisi) => (
        <g key={sisi} transform={`translate(${0.38 * sisi} -0.64) rotate(${20 * sisi}) scale(${sisi * k * 0.72} ${k * 0.72})`}>
          <path d={tanduk} fill={warna} stroke={gelap} strokeWidth={0.05} strokeLinejoin="round" />
          <path d="M-0.08 -0.1C-0.08 -0.38 0.02 -0.6 0.14 -0.72" fill="none" stroke="#F08A7E" strokeWidth={0.05} strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}
