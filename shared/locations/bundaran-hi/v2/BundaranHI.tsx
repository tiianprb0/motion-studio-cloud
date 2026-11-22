// Lokasi bersama: Bundaran HI, Jakarta (v2, 10 Nov 2026; dibuat untuk "Kritik Bukan Utang Jasa" v2 atas permintaan
// pengguna: "aku mau ada bundaran HI nya. seperti di foto"). v1 = snapshot generasi lama (beku), tidak diubah.
//
// Komposisi mengikuti foto acuan pengguna: kamera rendah di tepi kolam, menengadah ke Monumen Selamat Datang
// (sepasang patung perunggu: pria melambai, wanita membawa karangan bunga) di atas tugu batu tinggi; gedung pencakar
// langit kaca di belakang, gedung kaca hijau melengkung, gedung batu dengan layar LED merah, deret pohon, kolam bundar
// dengan semburan air melengkung dan lampu-lampu kolam. Spanduk kuning menjuntai di muka tugu + pemanjat bertali.
// Peristiwa nyata: aksi Greenpeace Indonesia, Selasa 20 Okt 2026 pagi. Enam aktivis memanjat Patung Selamat Datang
// dan membentangkan dua spanduk; yang menghadap utara (ke Istana Merdeka) = "TANGANI KRISIS IKLIM, TURUNKAN BIAYA
// HIDUP" (bawaan `teks`, dengan nama GREENPEACE di bawahnya seperti aslinya). Sumber: Mongabay, Katadata,
// investortrust.id (lihat RISET proyek Kritik v2).
// ARAHAN PENGGUNA 10 Nov 2026: teks spanduk aksi nyata TIDAK diganti ("itu bentuk perjuangan nyata dari relawan
// aktivis, dan itu merusak semangat mereka"). Prop `teks`/`kredit` hanya untuk menampilkan spanduk asli lain.
// Yang tetap tidak disalin: iklan dan wajah orang di layar LED, nama hotel/gedung (prop `layar` = iklan generik).
//
// Bingkai 1080×1920. Tugu di x 500–700, puncak tugu y 620, patung y ±270–620, kaki tugu di air y 1520.
// Kamera = bungkus <Cam> di proyek (geser/zoom); lokasi tetap satu gambar supaya semua sudut konsisten.
// Prop:
//   spanduk 0..1  = bentang spanduk (0 tergulung di puncak, 1 terbentang penuh sampai y ±1240)
//   teks, kredit  = baris spanduk dan nama pembuatnya (bawaan: spanduk asli 20 Okt 2026, GREENPEACE)
//   pemanjat 0..3 = jumlah pemanjat bertali di sisi tugu
//   depan         = trotoar + pagar besi di depan kolam (y 1760+), tempat penonton/warga berdiri
//   isi           = node yang digambar di trotoar depan (tokoh), setelah pagar
//   waktu         = 'siang' (berkabut) | 'sore' (hangat)
import React from 'react';

import { Cloud, Plane, WallGrain } from '../../_detail/v1/Detail';
import { Sheen } from '../../_detail/v2/Material';

export const HI = { tugu: { x0: 500, x1: 700, top: 620, kaki: 1520 }, spanduk: { x0: 510, x1: 690, y0: 640, y1: 1240 }, trotoar: 1900 };

const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function Menara({ x, y, w, h, kaca, garis, sirip = 0, mahkota = 0, id }: { x: number; y: number; w: number; h: number; kaca: string; garis: string; sirip?: number; mahkota?: number; id: string }) {
  return (
    <g data-detail="menara">
      {mahkota > 0 && <path d={`M${x + w * 0.15} ${y}L${x + w * 0.5} ${y - mahkota}L${x + w * 0.85} ${y}Z`} fill={garis} opacity=".8" />}
      <rect x={x} y={y} width={w} height={h} fill={kaca} />
      {Array.from({ length: Math.floor(h / 26) }, (_, i) => <path key={i} d={`M${x} ${y + 18 + i * 26}h${w}`} stroke={garis} strokeWidth="3" opacity=".55" />)}
      {Array.from({ length: Math.floor(w / (sirip || 34)) }, (_, i) => <path key={'v' + i} d={`M${x + (i + 1) * (sirip || 34)} ${y}v${h}`} stroke={garis} strokeWidth={sirip ? 5 : 1.6} opacity={sirip ? 0.6 : 0.4} />)}
      <rect x={x + w * 0.72} y={y} width={w * 0.28} height={h} fill="#000" opacity=".1" />
      <Sheen x={x} y={y} w={w} h={h} opacity={0.18} id={`sheen-${id}`} />
    </g>
  );
}

function Patung() {
  // dua sosok perunggu di atas tugu (siluet bergaya, sedikit sorot cahaya di sisi kiri)
  const br = '#4D4A40',
    hi = '#6E6A5A';
  return (
    <g data-landmark="Monumen Selamat Datang" transform="translate(600 620) scale(1.35) translate(-600 -620)">
      {/* alas patung */}
      <rect x="548" y="604" width="104" height="18" rx="3" fill="#5E5A4E" />
      {/* pria: lengan kanan terangkat tinggi melambai */}
      <g>
        <ellipse cx="580" cy="452" rx="15" ry="18" fill={br} />
        <path d="M566 470q14 -8 30 0l6 70l-6 64h-12l-4 -52l-6 52h-12l-4 -66Z" fill={br} />
        <path d="M570 476l-14 -40l-8 -70" stroke={br} strokeWidth="12" strokeLinecap="round" fill="none" />
        <ellipse cx="547" cy="360" rx="8" ry="11" fill={br} />
        <path d="M596 478l12 34l-4 30" stroke={br} strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M570 482l-6 60M574 474l-12 -36" stroke={hi} strokeWidth="3" opacity=".6" fill="none" />
      </g>
      {/* wanita: karangan bunga di tangan terangkat */}
      <g>
        <ellipse cx="622" cy="468" rx="14" ry="17" fill={br} />
        <path d="M632 452q8 6 6 22l-10 -4Z" fill={br} />
        <path d="M608 486q14 -8 28 0l10 118h-48Z" fill={br} />
        <path d="M612 492l-18 -18l-6 -22" stroke={br} strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="586" cy="446" r="12" fill={br} />
        <circle cx="579" cy="438" r="7" fill={br} />
        <circle cx="593" cy="437" r="7" fill={br} />
        <path d="M636 494l8 40l-6 26" stroke={br} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M612 500l-4 90" stroke={hi} strokeWidth="3" opacity=".6" />
      </g>
    </g>
  );
}

function Tugu({ f, spanduk, teks, kredit, pemanjat }: { f: number; spanduk: number; teks: string[]; kredit: string; pemanjat: number }) {
  const { x0, x1, top, kaki } = HI.tugu;
  const S = HI.spanduk;
  const yb = S.y0 + (S.y1 - S.y0) * spanduk;
  const lampu = (x: number) => (
    <g>
      <path d={`M${x} ${top - 6}l${x < 600 ? -24 : 24} -18`} stroke="#3B3F3D" strokeWidth="5" />
      <rect x={x + (x < 600 ? -40 : 14)} y={top - 36} width="26" height="18" rx="3" fill="#3B3F3D" transform={`rotate(${x < 600 ? -20 : 20} ${x} ${top - 20})`} />
    </g>
  );
  return (
    <g data-landmark="tugu">
      {/* sisi kanan (perspektif) + muka depan batu */}
      <path d={`M${x1} ${top}l26 -14V${kaki - 10}l-26 10Z`} fill="#6F604F" />
      <rect x={x0} y={top} width={x1 - x0} height={kaki - top} fill="#8C7A66" />
      <WallGrain x={x0} y={top} w={x1 - x0} h={kaki - top} o={0.08} seed={21} />
      {Array.from({ length: Math.floor((kaki - top) / 60) }, (_, i) => <path key={i} d={`M${x0} ${top + 60 * (i + 1)}h${x1 - x0}`} stroke="#76664F" strokeWidth="2" opacity=".6" />)}
      <path d={`M${x0 + 6} ${top}V${kaki}`} stroke="#A8957D" strokeWidth="4" opacity=".6" />
      <path d={`M${x0 - 8} ${top}h${x1 - x0 + 34}l-8 -14h${-(x1 - x0 + 22)}Z`} fill="#9E8C76" />
      {lampu(x0 + 4)}
      {lampu(x1 + 10)}
      <Patung />
      {/* tali pemanjat dari puncak */}
      {pemanjat > 0 && <path d={`M${x0 + 4} ${top}V${kaki - 160}M${x1 + 4} ${top}V${kaki - 260}`} stroke="#2F3532" strokeWidth="2.5" opacity=".8" />}
      {/* spanduk kuning */}
      {spanduk > 0.02 && (
        <g data-detail="spanduk">
          <defs><clipPath id={`hi-spanduk-${Math.round(spanduk * 100)}`}><rect x={S.x0} y={S.y0} width={S.x1 - S.x0} height={yb - S.y0} /></clipPath></defs>
          <rect x={S.x0 + 4} y={S.y0 + 6} width={S.x1 - S.x0} height={yb - S.y0} fill="#000" opacity=".18" />
          <g clipPath={`url(#hi-spanduk-${Math.round(spanduk * 100)})`}>
            <rect x={S.x0} y={S.y0} width={S.x1 - S.x0} height={S.y1 - S.y0} fill="#F2C230" />
            {teks.map((t, i) => (
              <text key={i} x={(S.x0 + S.x1) / 2} y={S.y0 + 62 + i * 44} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="31" fill="#1F1F1C">{t}</text>
            ))}
            {kredit && <text x={(S.x0 + S.x1) / 2} y={S.y0 + 62 + teks.length * 44 + 4} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="15" fill="#1F1F1C" letterSpacing="1">{kredit}</text>}
            {/* dua siluet wajah berhadapan */}
            <path d={`M${S.x0} ${S.y1}V${S.y1 - 170}q22 -6 26 -40q2 -26 -8 -40q16 -10 18 18l8 10l-6 6l4 10l-6 4q2 18 -8 26q-10 8 -2 26q14 18 34 20V${S.y1}Z`} fill="#1F1F1C" />
            <path d={`M${S.x1} ${S.y1}V${S.y1 - 170}q-22 -6 -26 -40q-2 -26 8 -40q-16 -10 -18 18l-8 10l6 6l-4 10l6 4q-2 18 8 26q10 8 2 26q-14 18 -34 20V${S.y1}Z`} fill="#1F1F1C" />
            <path d={`M${S.x0} ${S.y0 + 4}h${S.x1 - S.x0}`} stroke="#000" strokeWidth="6" opacity=".15" />
            {/* lipatan kain */}
            {[0.3, 0.62].map((k) => <path key={k} d={`M${S.x0 + (S.x1 - S.x0) * k} ${S.y0}V${S.y1}`} stroke="#000" strokeWidth="5" opacity=".06" />)}
          </g>
          {/* gulungan yang belum terbentang */}
          {spanduk < 0.98 && <rect x={S.x0 - 4} y={yb - 10} width={S.x1 - S.x0 + 8} height="22" rx="11" fill="#D9A92A" />}
        </g>
      )}
      {/* pemanjat (tali, helm, harnes) */}
      {Array.from({ length: pemanjat }, (_, i) => {
        const [x, y, d] = [[x0 - 6, 1180, -1], [x1 + 18, 1080, 1], [x1 + 18, 780, 1]][i];
        const sway = 2 * Math.sin(f * 0.05 + i);
        return (
          <g key={i} data-detail="pemanjat" transform={`translate(${x + sway} ${y}) scale(${d} 1)`}>
            <path d="M0 -60V-14" stroke="#2F3532" strokeWidth="2.5" />
            <circle cx="0" cy="-12" r="9" fill="#E8743B" />
            <path d="M-8 -4h16l4 34h-24Z" fill="#2E3331" />
            <path d="M-6 30l-10 26M6 30l14 20" stroke="#2E3331" strokeWidth="7" strokeLinecap="round" />
            <path d="M-8 2l-12 -16M8 2l8 -18" stroke="#2E3331" strokeWidth="6" strokeLinecap="round" />
            <path d="M-8 18h16" stroke="#F2C230" strokeWidth="4" />
          </g>
        );
      })}
    </g>
  );
}

function Layar({ isi }: { isi?: React.ReactNode }) {
  // layar LED merah di gedung batu kiri (iklan generik; bukan merek/wajah nyata)
  return (
    <g data-detail="layar-led">
      <rect x="44" y="1012" width="276" height="330" rx="4" fill="#2F3532" />
      <rect x="52" y="1020" width="260" height="314" fill="#E8434A" />
      {isi ?? (
        <g>
          <path d="M150 1110h64l-10 150h-44Z" fill="#F7F3EA" opacity=".9" />
          <path d="M150 1110h64l-3 40h-58Z" fill="#C98445" />
          <path d="M196 1090l26 -40" stroke="#FFF9EF" strokeWidth="6" strokeLinecap="round" />
          {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 14} y={1160 + (i % 2) * 20} width="14" height="14" rx="3" fill="#CFE6F0" opacity=".9" />)}
          <text x="182" y="1300" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#FFF9EF">ES TEH SEGAR</text>
        </g>
      )}
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M52 ${1024 + i * 16}h260`} stroke="#000" strokeWidth="1" opacity=".06" />)}
    </g>
  );
}

function Air({ f }: { f: number }) {
  // kolam bundar: permukaan, semburan tegak melingkar, semburan melengkung, lampu kolam
  const cx = 600,
    cy = 1560;
  const tegak = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const x = cx + Math.cos(a) * 360,
      y = cy + 30 + Math.sin(a) * 46;
    const h = 70 + 50 * acak(i) + 8 * Math.sin(f * 0.2 + i);
    return { x, y, h, depan: Math.sin(a) > 0 };
  });
  const lengkung = [-1, 1].flatMap((side) =>
    [0, 1, 2, 3].map((k) => {
      const x0 = cx + side * (470 + k * 120),
        y0 = cy + 70 + k * 18;
      const x1 = x0 - side * (170 + k * 20),
        y1 = cy + 40;
      const peak = y0 - (260 - k * 30) - 10 * Math.sin(f * 0.1 + k);
      return { x0, y0, x1, y1, peak, k };
    }),
  );
  const plume = (x: number, y: number, h: number, key: string | number) => (
    <g key={key}>
      <path d={`M${x - 4} ${y}Q${x} ${y - h * 1.1} ${x + 4} ${y}Z`} fill="#FFFFFF" opacity=".85" />
      <ellipse cx={x} cy={y - h} rx="9" ry="12" fill="#FFFFFF" opacity=".6" />
      <ellipse cx={x} cy={y} rx="14" ry="5" fill="#FFFFFF" opacity=".7" />
    </g>
  );
  return (
    <g data-detail="kolam">
      <defs>
        <linearGradient id="hi-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FB7C4" />
          <stop offset="1" stopColor="#5F8D9C" />
        </linearGradient>
      </defs>
      <path d="M-200 1500Q600 1450 1300 1500V2100H-200Z" fill="url(#hi-air)" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 1530 + i * 26 + i * i * 3;
        const dx = 30 * Math.sin(f * 0.04 + i * 1.3);
        return <path key={i} d={`M${60 + acak(i) * 200 + dx} ${y}h${120 + acak(i + 9) * 260}M${560 + acak(i + 3) * 300 - dx} ${y + 8}h${90 + acak(i + 5) * 200}`} stroke="#FFFFFF" strokeWidth={2 + i * 0.5} opacity=".35" strokeLinecap="round" />;
      })}
      {/* pantulan spanduk/tugu di air */}
      <rect x="540" y="1530" width="120" height="120" fill="#F2C230" opacity=".12" />
      {tegak.filter((t) => !t.depan).map((t, i) => plume(t.x, t.y, t.h, 'b' + i))}
      {lengkung.map((j, i) => (
        <g key={'l' + i}>
          <path d={`M${j.x0} ${j.y0}Q${(j.x0 + j.x1) / 2} ${j.peak} ${j.x1} ${j.y1}`} stroke="#FFFFFF" strokeWidth="7" fill="none" opacity=".75" strokeLinecap="round" />
          <path d={`M${j.x0} ${j.y0}Q${(j.x0 + j.x1) / 2} ${j.peak} ${j.x1} ${j.y1}`} stroke="#FFFFFF" strokeWidth="16" fill="none" opacity=".18" strokeLinecap="round" />
          <ellipse cx={j.x1} cy={j.y1} rx="22" ry="8" fill="#FFFFFF" opacity=".55" />
        </g>
      ))}
      {tegak.filter((t) => t.depan).map((t, i) => plume(t.x, t.y, t.h, 'f' + i))}
      {/* lampu kolam bertiang */}
      {[[140, 1720, 1.1], [420, 1700, 0.9], [760, 1700, 0.9], [1000, 1730, 1.1], [300, 1640, 0.7], [880, 1640, 0.7]].map(([x, y, s], i) => (
        <g key={'lp' + i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 0v-80" stroke="#3B3F3D" strokeWidth="7" />
          <rect x="-26" y="-118" width="52" height="40" rx="18" fill="#2F3532" />
          <ellipse cx="0" cy="4" rx="22" ry="6" fill="#FFFFFF" opacity=".5" />
        </g>
      ))}
    </g>
  );
}

export const SPANDUK_ASLI = { teks: ['TANGANI', 'KRISIS', 'IKLIM,', 'TURUNKAN', 'BIAYA', 'HIDUP'], kredit: 'GREENPEACE' };
export function BundaranHI({ f, spanduk = 1, teks = SPANDUK_ASLI.teks, kredit = SPANDUK_ASLI.kredit, pemanjat = 2, depan = false, isi, layar, waktu = 'siang' }: { f: number; spanduk?: number; teks?: string[]; kredit?: string; pemanjat?: number; depan?: boolean; isi?: React.ReactNode; layar?: React.ReactNode; waktu?: 'siang' | 'sore' }) {
  const sore = waktu === 'sore';
  const drift = (base: number, sp: number) => ((base + f * sp + 1400) % 1500) - 200;
  return (
    <g data-set="bundaran-hi">
      <defs>
        <linearGradient id="hi-langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sore ? '#E9C9A6' : '#C9D6DC'} />
          <stop offset="1" stopColor={sore ? '#F6E2C6' : '#E6E8E2'} />
        </linearGradient>
      </defs>
      <rect x="-600" y="-600" width="2300" height="2700" fill="url(#hi-langit)" />
      <Cloud x={drift(860, 0.12)} y={260} s={1.1} tone="#FFFFFF" o={0.45} />
      <Cloud x={drift(300, 0.08)} y={520} s={0.8} tone="#FFFFFF" o={0.35} />
      <Plane x={drift(100, 1.4)} y={180} s={0.6} f={f} />
      {/* menara jauh (berkabut) */}
      <g opacity=".55">
        <Menara x={900} y={420} w={240} h={1100} kaca="#A9B9C2" garis="#8EA0AA" id="m-jauh1" />
        <Menara x={-120} y={560} w={140} h={900} kaca="#B4C2C6" garis="#98A8AE" id="m-jauh2" />
      </g>
      {/* pencakar langit utama */}
      <Menara x={630} y={40} w={250} h={1300} kaca="#7F9AA6" garis="#61808D" sirip={0} mahkota={60} id="m-c" />
      <Menara x={350} y={200} w={200} h={1150} kaca="#A6B4B6" garis="#8B9C9F" sirip={28} id="m-b" />
      <Menara x={-80} y={-200} w={370} h={1560} kaca="#5F7A86" garis="#4A6470" sirip={0} id="m-a" />
      <rect x="-600" y="-600" width="2300" height="2700" fill={sore ? '#F2C79B' : '#DCE4E6'} opacity=".18" />
      {/* gedung batu kiri + layar LED */}
      <rect x="-30" y="980" width="500" height="480" fill="#C9B79A" />
      <WallGrain x={-30} y={980} w={500} h={480} o={0.06} seed={8} />
      <path d="M-30 980h500v18h-500Z" fill="#B09E82" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M340 ${1030 + i * 58}h110`} stroke="#A9967B" strokeWidth="6" />)}
      <Layar isi={layar} />
      {/* gedung kaca hijau melengkung (atap bergelombang) */}
      <g data-detail="gedung-hijau">
        <path d="M560 1060q60 -40 120 0q60 -40 120 0q60 -40 120 0q60 -40 120 0q60 -40 120 0V1460H560Z" fill="#E7E2D4" />
        <rect x="570" y="1080" width="640" height="380" fill="#4F8F80" />
        {Array.from({ length: 11 }, (_, i) => <rect key={i} x="570" y={1092 + i * 33} width="640" height="14" fill="#7FB5A6" opacity=".7" />)}
        {Array.from({ length: 16 }, (_, i) => <path key={'v' + i} d={`M${590 + i * 40} 1080v380`} stroke="#3E7366" strokeWidth="2" opacity=".5" />)}
        <Sheen x={570} y={1080} w={640} h={380} opacity={0.15} id="sheen-hijau" />
      </g>
      {/* deret pohon di kaki gedung */}
      {Array.from({ length: 13 }, (_, i) => {
        const x = -40 + i * 95 + acak(i) * 30,
          r = 50 + acak(i + 4) * 30;
        return (
          <g key={'p' + i}>
            <path d={`M${x} 1500v-60`} stroke="#6B4A3A" strokeWidth="10" />
            <circle cx={x} cy={1440 - r * 0.6} r={r} fill={i % 2 ? '#5E8B6C' : '#6F9A7A'} />
            <circle cx={x - r * 0.4} cy={1440 - r * 0.9} r={r * 0.5} fill="#fff" opacity=".08" />
          </g>
        );
      })}
      <rect x="-200" y="1470" width="1500" height="40" fill="#8E9692" />
      <Air f={f} />
      <Tugu f={f} spanduk={spanduk} teks={teks} kredit={kredit} pemanjat={pemanjat} />
      {/* semburan di depan kaki tugu (menutup kaki) */}
      <g>
        {Array.from({ length: 9 }, (_, i) => {
          const x = 470 + i * 32,
            h = 80 + 40 * acak(i + 30) + 6 * Math.sin(f * 0.2 + i);
          return <path key={i} d={`M${x - 5} 1560Q${x} ${1560 - h} ${x + 5} 1560Z`} fill="#FFFFFF" opacity=".8" />;
        })}
        <ellipse cx="600" cy="1560" rx="170" ry="16" fill="#FFFFFF" opacity=".45" />
      </g>
      {depan && (
        <g data-detail="trotoar">
          <path d="M-200 1790H1300V2100H-200Z" fill="#B9B0A0" />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${540 + (i - 6) * 60} 1790L${540 + (i - 6) * 190} 2000`} stroke="#A39A89" strokeWidth="2" />)}
          {[1840, 1900, 1980].map((y) => <path key={y} d={`M-200 ${y}H1300`} stroke="#A39A89" strokeWidth="2" />)}
          <path d="M-200 1790H1300" stroke="#D8D0C2" strokeWidth="10" />
          {/* pagar besi tepi kolam */}
          <path d="M-200 1700H1300M-200 1740H1300" stroke="#4A5250" strokeWidth="7" />
          {Array.from({ length: 24 }, (_, i) => <path key={'pg' + i} d={`M${-180 + i * 64} 1690V1792`} stroke="#4A5250" strokeWidth="8" />)}
          {isi}
        </g>
      )}
      {sore && <rect x="-600" y="-600" width="2300" height="2700" fill="#F2A65A" opacity=".08" />}
    </g>
  );
}

// Data dipakai lembar contoh/storyboard: posisi tengah spanduk & patung untuk label/kamera.
export const HI_TITIK = { patung: [600, 460] as [number, number], spanduk: [600, 900] as [number, number], kolam: [600, 1600] as [number, number] };
