// Mesin fotokopi kantor (v1, 13 Nov 2026), dibuat untuk "Hari Pertama Kerja" v1 rev6.
// Pengguna 13 Nov 2026: "alih alih tian diam, mending tian kayak sambil kerja, kerja sambil frustasi, lagi fotocopy tapi
// lesuh gitu gitu."
// Gambar flat 2D tampak depan, satuan rig: 1 m = 200 unit, pusat bawah di (0,0). Lebar 0,56 m (±56), tinggi 0,84 m.
// Dipakai sebagai `isi` panggung 2D (mis. kantor-2d/v1) supaya ikut urutan kedalaman dan cahaya:
//   { x, y, gambar: (q) => <g transform={`translate(${q.x} ${q.y}) scale(${q.s})`}><Fotokopi .../></g>, tinggi: 0.84, lebar: 0.6 }
// Props:
//   pindai 0..1  = lampu pindai (garis hijau terang) bergerak kiri → kanan di celah tutup; null = mati
//   salinan      = jumlah lembar di baki keluaran (kiri)
//   keluar 0..1  = satu lembar sedang meluncur keluar dari celah ke baki
//   status       = 'siap' (lampu hijau) | 'macet' (lampu merah, layar merah) | 'kerja' (lampu kuning)
//   kedip        = lampu status berkedip (frame)
//   asli         = tumpukan kertas asli di atas tutup (jumlah lembar, 0 = tidak ada)
//   malam 0..1   = warna badan menggelap untuk adegan malam (cahaya panggung tetap diterapkan di atasnya)
// TumpukanKertas: rim kertas fotokopi untuk dibawa (pose `angkatGalon`, alas di y −140 unit rig) atau diletakkan.
import React from 'react';

const campur = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a),
    B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

export function Fotokopi({ pindai = null, salinan = 0, keluar = 0, status = 'siap', kedip = 0, asli = 0, malam = 0 }: { pindai?: number | null; salinan?: number; keluar?: number; status?: 'siap' | 'macet' | 'kerja'; kedip?: number; asli?: number; malam?: number }) {
  const t = Math.max(0, Math.min(1, malam));
  const badan = campur('#E4E6E3', '#8E949C', t);
  const badanGelap = campur('#C9CCC9', '#6F757E', t);
  const tutup = campur('#5B6168', '#3A3F47', t);
  const alas = campur('#3E444B', '#262A30', t);
  const nyalaLed = status === 'macet' ? '#E5484D' : status === 'kerja' ? '#F2C14E' : '#5FD38D';
  const ledHidup = status === 'macet' ? Math.floor(kedip / 6) % 2 === 0 : true;
  const layar = status === 'macet' ? '#F2A3A3' : '#9FE3D1';
  const n = Math.max(0, Math.min(14, Math.round(salinan)));
  return (
    <g data-prop="fotokopi">
      {/* baki keluaran (kiri) */}
      <path d="M-56 -112L-84 -104L-84 -100L-56 -106Z" fill={badanGelap} />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${-57 - (i % 2)} ${-108 - i * 1.6}L${-82 - (i % 3)} ${-101.5 - i * 1.6}L${-82 - (i % 3)} ${-100 - i * 1.6}L${-57 - (i % 2)} ${-106.5 - i * 1.6}Z`} fill="#FBFAF5" stroke="#CFCBC0" strokeWidth="0.5" />
      ))}
      {keluar > 0 && keluar < 1 && (
        <path d={`M-56 ${-124 + 14 * keluar}l${-26 * keluar} ${6 * keluar}l0 1.6l${26 * keluar} ${-6 * keluar}Z`} fill="#FFFFFF" stroke="#CFCBC0" strokeWidth="0.5" />
      )}
      {/* lemari laci kertas */}
      <rect x="-54" y="-104" width="108" height="98" rx="3" fill={badan} />
      <rect x="-56" y="-8" width="112" height="8" rx="2" fill={alas} />
      {[-70, -38].map((y) => (
        <g key={y}>
          <path d={`M-54 ${y}h108`} stroke="#000" strokeWidth="1.4" opacity=".16" />
          <rect x="-14" y={y + 10} width="28" height="5" rx="2" fill={alas} opacity=".75" />
        </g>
      ))}
      <rect x="-14" y="-94" width="28" height="5" rx="2" fill={alas} opacity=".75" />
      {/* badan pencetak + celah keluar */}
      <rect x="-56" y="-150" width="112" height="46" rx="4" fill={badan} />
      <rect x="-56" y="-128" width="6" height="6" fill={alas} opacity=".55" />
      <path d="M-50 -110h100" stroke="#000" strokeWidth="1.2" opacity=".12" />
      {/* panel kendali (kanan depan) */}
      <rect x="18" y="-148" width="36" height="16" rx="3" fill={tutup} />
      <rect x="22" y="-145" width="16" height="9" rx="1.5" fill={layar} opacity={0.55 + 0.45 * (1 - t * 0.3)} />
      <circle cx="44" cy="-140.5" r="2.4" fill="#D9DCDB" />
      <circle cx="50" cy="-140.5" r="2.4" fill={ledHidup ? nyalaLed : '#55595F'} />
      {ledHidup && <circle cx="50" cy="-140.5" r="6" fill={nyalaLed} opacity=".28" />}
      {/* tutup kaca pindai */}
      <rect x="-58" y="-162" width="116" height="12" rx="3" fill={tutup} />
      <path d="M-56 -151h112" stroke="#000" strokeWidth="1.2" opacity=".3" />
      {asli > 0 &&
        Array.from({ length: Math.min(8, asli) }, (_, i) => (
          <rect key={i} x={-40 + (i % 2) * 1.5} y={-165 - i * 1.6} width="44" height="2.4" fill="#FBFAF5" stroke="#CFCBC0" strokeWidth="0.4" />
        ))}
      {/* macet: kertas kusut terjepit di celah tutup, dekat panel (tempat tangan meraih) */}
      {status === 'macet' && (
        <path d="M-6 -152l3 -9l7 3l4 -10l8 5l6 -8l5 9l9 -3l-2 10l6 3l-37 0Z" fill="#FBFAF5" stroke="#B9B4A8" strokeWidth="0.8" />
      )}
      {/* lampu pindai: garis hijau terang di celah tutup + pendar */}
      {pindai != null && pindai >= 0 && pindai <= 1 && (
        <g data-fx="lampu-pindai">
          <ellipse cx={-52 + 104 * pindai} cy="-151" rx="22" ry="9" fill="#C9FFE6" opacity=".45" />
          <rect x={-55 + 104 * pindai} y="-152.5" width="6" height="3" rx="1" fill="#F2FFF8" />
        </g>
      )}
    </g>
  );
}

/** rim kertas fotokopi; pusat bawah di (0,0), lebar 60 unit; n = jumlah lapis tampak */
export const TumpukanKertas = ({ n = 6, miring = 0 }: { n?: number; miring?: number }) => (
  <g data-prop="tumpukan-kertas" transform={`rotate(${miring})`}>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={-30 + ((i * 7) % 5) - 2} y={-3 - i * 3} width="60" height="3.2" fill={i % 3 === 2 ? '#F1EEE4' : '#FBFAF5'} stroke="#CFCBC0" strokeWidth="0.5" />
    ))}
  </g>
);
