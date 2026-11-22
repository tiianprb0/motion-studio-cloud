// Lembar contoh URUTAN GAMBAR Dunia3D v3 (11 Nov 2026). Pengguna melihat Kritik v3: "banyak bagian yang awalnya di depan
// jadi mundur ke belakang ... z indexnya ... perbaikannya buat di folder general".
// Kiri = dunia yang sama digambar mesin v2 (urut dari titik tengah benda), kanan = mesin v3 (bidang pemisah + urutan
// topologis). Dunia, kamera, dan tokoh identik: jalan-kampung v2 (mesin v2) vs jalan-kampung v3 (mesin v3).
//   Baris 1 (sudut tinggi, seperti Kritik shot 03): pintu + nomor rumah 10 tertutup dinding, orang di depan warung
//     terpotong dinding warung, strip polisi tidur hilang separuh (v2) → utuh (v3).
//   Baris 2 (rumah ibu, seperti Kritik shot 04): orang di depan pagar tertutup tiang pagar, pot di halaman hilang (v2) →
//     orang di depan tiang, pot di balik pagar (v3).
// Render: node tools/render-thumb.cjs shared/locations/_proyeksi/v3/contoh/ContohUrut.tsx shared/locations/_proyeksi/v3/contoh/ContohUrut --only
import React from 'react';
import { P } from '../../../../core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { orbit, kamAntara, type Kam } from '../../v1/Proyeksi';
import { JalanKampung as Jalan2, type Isi } from '../../../jalan-kampung/v2/JalanKampung';
import { JalanKampung as Jalan3 } from '../../../jalan-kampung/v3/JalanKampung';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
const lelaki = (X: number, Z: number, baju: string, dir: 1 | -1, seed = 0): Isi => ({
  X,
  Z,
  gambar: (p) => <Person who="him" appearance={seed} shirtColor={baju} trouserColor="#3E3A36" x={p.x} y={p.y} s={p.s} f={f + seed} view="three" dir={dir} mood="soft" role="background" {...POSE.him.bertaut} />,
});
const perempuan = (X: number, Z: number, baju: string, dir: 1 | -1, seed = 0): Isi => ({
  X,
  Z,
  gambar: (p) => <Person who="her" appearance={seed} shirtColor={baju} trouserColor="#5E5550" x={p.x} y={p.y} s={p.s} f={f + seed} dir={dir} mood="thinking" role="background" {...POSE.her.bertaut} />,
});
const ADEGAN: { kam: Kam; isi: Isi[]; judul: string }[] = [
  {
    kam: orbit(kamAntara({ x: 2.6, z: 3.6, yaw: -26, h: 3.6, F: 1450, vy: 500 }, { h: 4.8, vy: 320 }, 0.38), 0.55, 9.5, 28 * 0.38),
    isi: [lelaki(-0.3, 8.6, '#7FB59A', 1), lelaki(-3.0, 9.9, '#8B6B4A', -1, 3)],
    judul: 'jalan · sudut tinggi',
  },
  {
    kam: orbit(kamAntara({ x: -1.9, z: 4.4, yaw: 90, F: 1750, vy: 1000 }, { F: 2150, vy: 960 }, 0.66), 3.05, 4.4, 24 - 70 * 0.66),
    isi: [perempuan(3.05, 4.2, '#A65E6E', -1, 2), lelaki(2.85, 4.75, '#D8C3A5', 1, 5)],
    judul: 'rumah ibu',
  },
];
const Panel = ({ i, baru }: { i: number; baru: boolean }) => {
  const a = ADEGAN[i];
  const J = baru ? Jalan3 : Jalan2;
  return (
    <>
      <J f={f} kam={a.kam} isi={a.isi} id={`cu${i}${baru ? 'b' : 'l'}`} />
      <rect x="0" y="1760" width="1080" height="160" fill={baru ? '#2F6B4F' : '#8B4354'} opacity=".9" />
      <text x="40" y="1862" fontFamily="Lato" fontWeight="900" fontSize="60" fill={P.cream}>
        {baru ? 'v3 (baru)' : 'v2 (lama)'} · {a.judul}
      </text>
    </>
  );
};
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill={P.paper} />
    <defs>
      <clipPath id="cu-klip">
        <rect width="1080" height="1920" />
      </clipPath>
    </defs>
    {[0, 1].map((i) =>
      [false, true].map((baru, j) => (
        <g key={`${i}${j}`} transform={`translate(${j * 540} ${i * 960}) scale(0.5)`}>
          <g clipPath="url(#cu-klip)">
            <Panel i={i} baru={baru} />
          </g>
        </g>
      )),
    )}
    <path d="M540 0V1920M0 960H1080" stroke={P.cream} strokeWidth="6" />
  </svg>
);
