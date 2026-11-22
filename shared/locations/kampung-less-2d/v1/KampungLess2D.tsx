// Lokasi bersama: KAMPUNG LESS. malam, PANGGUNG FLAT 2D dari depan (v1, 17 Nov 2026) dengan cahaya 2D malam.
// Dibuat untuk "Keresahan yang Kamu Hapus Lagi" v2 (video perkenalan web less.benaya.id). Pengguna 17 Nov 2026 atas v1:
// "boleh di satu dunia, tapi beberapa tempat laaa!. ini kosong banget loh ... visual harus nya menggambarkan apa yang
// dibicarin!". Satu jalan kampung (satu dunia) berisi tempat-tempat dari web Less. (tools/web-less, tangkapan
// shared/web-less/v2), digambar ulang dengan gaya animasi Less.:
//   GAPURA "Kampung Less." + papan less.benaya.id (x ±380) · KOS NAYA (±1080; jendela atas = kamar Naya) ·
//   POS KERESAHAN (±1880; pos ronda, kotak titip, tali lampion) · RUANG BACA (±2760; rak buku di jendela, kanopi lampion) ·
//   MEJA GAMBAR YAN (±3640; pergola + meja gambar di depan Kos Yan) · LAHAN CERITA (±4560; rumah cerita, petak berikutnya).
// Skala: trotoar (kaki tokoh) y 1250, 1 m = 230 px (tokoh skala 1,15 ≈ 1,65 m), bangunan berdiri di y 1180. Kamera Kam2D
// { zoom, cx, cy } seperti lokasi flat 2D lain (layar2D). Latar jauh (deret rumah + jendela) parallax 50%.
// Slot: `lampion` = [{ x, y, s, nyala, warna, emas }] (titik gantung, koordinat dunia; lihat TEMPAT_KL.pos.tali untuk tali
// pos), `isi` = tokoh/benda di trotoar [{ x, y, s?, gambar, tinggi? }] diurut y, `jendelaLampion` 0..1 = lampion menyala
// di jendela-jendela rumah latar (metafora "orang lain juga"), `hujan` 0..1, `gelap` 0..1 (malam makin sepi), `jendelaNaya`.
import React from 'react';
import { P } from '../../../core/v1/core';
import { Moon, Plant, StringLights, Laundry } from '../../_detail/v1/Detail';
import { TokohBercahaya, KontakKaki, type Cahaya2D } from '../../../film/v1/Cahaya2D';
import { Lampion } from '../../../props/lampion/v1/Lampion';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type IsiKL = { x: number; y: number; s?: number; gambar: (p: Titik2D) => React.ReactNode; tinggi?: number; lebar?: number; polos?: boolean; tanpaBayangan?: boolean };
export type LampionKL = { x: number; y: number; s?: number; nyala?: number; warna?: string; emas?: boolean; tali?: number };

export const KL = { trotoar: 1250, dasar: 1180, pxM: 230, skala: 1.15 };
const M = KL.pxM,
  Y0 = KL.dasar;
/** pusat tiap tempat (x dunia) + titik penting */
export const TEMPAT_KL = {
  gapura: { x: 380 },
  kosNaya: { x: 1080, jendela: { x: 1180, y: Y0 - 4.6 * M } },
  pos: { x: 1880, kotak: { x: 1640, y: Y0 - 1.05 * M }, tali: { x0: 1720, x1: 2330, y: Y0 - 2.55 * M, sag: 70 } },
  baca: { x: 2760, kanopi: { x0: 2560, x1: 2960, y: Y0 - 2.6 * M } },
  meja: { x: 3640, kursi: { x: 3560, y: KL.trotoar - 30 }, kertas: { x: 3700, y: Y0 - 0.86 * M } },
  lahan: { x: 4560, rumah: [{ x: 4360 }, { x: 4640 }], petak: { x: 4900 } },
};
/** titik di tali lampion pos (u 0..1) */
export const taliPos = (u: number) => {
  const t = TEMPAT_KL.pos.tali;
  return { x: t.x0 + (t.x1 - t.x0) * u, y: t.y + t.sag * 4 * u * (1 - u) };
};
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({ zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t, cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t, cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t });

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
/** cahaya malam kampung: lampu jalan hangat dari kanan atas */
export const cahayaKampung = (gelap = 0): Cahaya2D => ({
  matahari: { az: 58, el: 32, warna: '#FFD59A' },
  suasana: { bayangan: '#1C2236', ambient: 0.6 - 0.1 * gelap, diffuse: 0.8, lantai: 0.32, nada: { warna: '#2A3550', kuat: 0.1 + 0.08 * gelap } },
});

const Papan = ({ x, y, teks, w, warna = P.cream, tinta = P.ink, size = 34 }: { x: number; y: number; teks: string; w?: number; warna?: string; tinta?: string; size?: number }) => {
  const W = w ?? teks.length * size * 0.56 + 40;
  return (
    <g data-detail="papan-nama">
      <rect x={x - W / 2 + 4} y={y + 5} width={W} height={size * 1.6} rx="10" fill="#000" opacity=".25" />
      <rect x={x - W / 2} y={y} width={W} height={size * 1.6} rx="10" fill={warna} stroke={P.ink} strokeWidth="4" />
      <text x={x} y={y + size * 1.12} textAnchor="middle" fontFamily="Playfair Display, Lato" fontWeight="700" fontSize={size} fill={tinta}>{teks}</text>
    </g>
  );
};
const Jendela = ({ x, y, w, h, nyala = 0.8, f = 0, isi }: { x: number; y: number; w: number; h: number; nyala?: number; f?: number; isi?: React.ReactNode }) => (
  <g data-detail="jendela">
    <rect x={x} y={y} width={w} height={h} fill="#E8B866" opacity={0.25 + 0.6 * nyala} />
    <rect x={x} y={y} width={w} height={h} fill="#2B3448" opacity={0.65 * (1 - nyala)} />
    {isi}
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#5E4434" strokeWidth="8" />
    <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h * 0.5}H${x + w}`} stroke="#5E4434" strokeWidth="5" />
  </g>
);
const Pohon = ({ x, s = 1, warna = '#3E5E4C' }: { x: number; s?: number; warna?: string }) => (
  <g data-detail="pohon">
    <path d={`M${x - 16 * s} ${Y0}L${x - 8 * s} ${Y0 - 3 * M * s}L${x + 8 * s} ${Y0 - 3 * M * s}L${x + 16 * s} ${Y0}Z`} fill="#4A3A30" />
    {[[0, 6.1, 1.5], [-0.9, 5.2, 1.2], [0.9, 5.3, 1.25], [0, 4.4, 1.3]].map(([dx, h, r], i) => (
      <circle key={i} cx={x + dx * M * s} cy={Y0 - h * M * s} r={r * M * s} fill={i % 2 ? '#35523F' : warna} />
    ))}
  </g>
);
const LampuJalan = ({ x, y = KL.trotoar + 40, f = 0 }: { x: number; y?: number; f?: number }) => (
  <g data-detail="lampu-jalan">
    <rect x={x - 7} y={y - 4.6 * M} width="14" height={4.6 * M} fill="#2E3532" />
    <path d={`M${x} ${y - 4.55 * M}q60 -30 110 0`} stroke="#2E3532" strokeWidth="10" fill="none" />
    <rect x={x + 92} y={y - 4.55 * M} width="40" height="18" rx="6" fill="#2E3532" />
  </g>
);
const pendarLampu = (x: number, y = KL.trotoar + 40, kuat = 1) => (
  <g key={'pl' + x}>
    <ellipse cx={x + 112} cy={y - 4.5 * M + 20} rx="60" ry="30" fill="#FFE3A3" opacity={0.85 * kuat} />
    <path d={`M${x + 112} ${y - 4.5 * M + 20}L${x - 150} ${KL.trotoar + 60}L${x + 380} ${KL.trotoar + 60}Z`} fill="#FFD98F" opacity={0.08 * kuat} />
    <ellipse cx={x + 112} cy={KL.trotoar + 30} rx="260" ry="46" fill="#FFD98F" opacity={0.14 * kuat} />
  </g>
);

export function KampungLess2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  isi = [],
  lampion = [],
  jendelaLampion = 0,
  jendelaNaya = 1,
  hujan = 0,
  gelap = 0,
  kabur = 0,
  layarRumah = 1,
  id = 'kl',
}: {
  f?: number;
  kam?: Kam2D;
  isi?: IsiKL[];
  lampion?: LampionKL[];
  jendelaLampion?: number;
  jendelaNaya?: number;
  hujan?: number;
  gelap?: number;
  kabur?: number;
  /** 0..1 jendela rumah cerita memutar video (ikon ▶ menyala) */
  layarRumah?: number;
  id?: string;
}) {
  const c = cahayaKampung(gelap);
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  const vx0 = kam.cx - 540 / kam.zoom - 300,
    vx1 = kam.cx + 540 / kam.zoom + 300;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  const X0 = -800,
    X1 = 5800;
  // ---------- langit + latar jauh (parallax 50%)
  const px = (kam.cx - 540) * 0.5;
  const latar = (
    <g data-detail="latar-jauh" transform={`translate(${px.toFixed(1)} ${((kam.cy - 960) * 0.3).toFixed(1)})`}>
      {Array.from({ length: 34 }, (_, i) => {
        const x = X0 - 400 + i * 230 + acak(i) * 60,
          h = 2.6 + acak(i + 5) * 3.4,
          w = 190 + acak(i + 9) * 60;
        const y = Y0 - 120 - h * M * 0.75;
        return (
          <g key={i}>
            <path d={`M${x} ${y}L${x + w / 2} ${y - 70}L${x + w} ${y}V${Y0}H${x}Z`} fill={i % 2 ? '#262F42' : '#2C364B'} />
            {[0, 1].map((k) => {
              const jx = x + 30 + k * (w - 100),
                jy = y + 40 + (i % 3) * 30;
              const terang = acak(i * 3 + k) > 0.35;
              const lamp = jendelaLampion * (acak(i * 7 + k) > 0.25 ? 1 : 0);
              return (
                <g key={k}>
                  <rect x={jx} y={jy} width="44" height="52" fill="#F2C878" opacity={terang ? 0.35 + 0.35 * acak(i + k) : 0.08} />
                  {lamp > 0 && <Lampion x={jx + 22} y={jy - 6} s={0.8 * klamp(lamp * 1.4 - acak(i + k) * 0.4)} f={f + i * 9} nyala={klamp(lamp * 1.5 - 0.3)} warna={['#8B4354', '#D9A65A', '#F3E3C4', '#7FA48D'][(i + k) % 4]} tali={4} seed={i} id={`${id}-jl${i}-${k}`} />}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
  // ---------- tempat-tempat (bangunan berdiri di Y0)
  const gapura = (() => {
    const x = TEMPAT_KL.gapura.x;
    return (
      <g data-tempat="gapura">
        <rect x={x - 260} y={Y0 - 4.1 * M} width="60" height={4.1 * M} fill="#B5463F" />
        <rect x={x + 200} y={Y0 - 4.1 * M} width="60" height={4.1 * M} fill="#B5463F" />
        <rect x={x - 290} y={Y0 - 4.1 * M - 40} width="580" height="44" fill="#8E3A35" />
        <rect x={x - 250} y={Y0 - 3.75 * M} width="500" height="110" rx="8" fill={P.cream} stroke={P.ink} strokeWidth="5" />
        <text x={x} y={Y0 - 3.75 * M + 76} textAnchor="middle" fontFamily="Playfair Display, Lato" fontWeight="700" fontSize="64" fill={P.ink}>Kampung Less.</text>
        <rect x={x - 150} y={Y0 - 1.6 * M} width="300" height="64" rx="10" fill={P.wine} />
        <text x={x} y={Y0 - 1.6 * M + 44} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill={P.cream}>less.benaya.id</text>
      </g>
    );
  })();
  const kosNaya = (() => {
    const x = TEMPAT_KL.kosNaya.x,
      w = 700;
    return (
      <g data-tempat="kos-naya">
        <rect x={x - w / 2} y={Y0 - 6.2 * M} width={w} height={6.2 * M} fill="#C99A82" />
        <rect x={x - w / 2} y={Y0 - 3.15 * M} width={w} height="30" fill="#E8D7C6" />
        <path d={`M${x - w / 2 - 60} ${Y0 - 6.2 * M}L${x} ${Y0 - 7.9 * M}L${x + w / 2 + 60} ${Y0 - 6.2 * M}Z`} fill="#9E3E46" />
        <Jendela x={x - 260} y={Y0 - 5.4 * M} w={180} h={200} nyala={0.15} />
        <Jendela x={x + 90} y={Y0 - 5.4 * M} w={180} h={200} nyala={jendelaNaya} />
        <Jendela x={x - 260} y={Y0 - 2.4 * M} w={180} h={200} nyala={0.1} />
        <rect x={x + 60} y={Y0 - 2.3 * M} width="160" height={2.3 * M} fill="#6E4A38" />
        <circle cx={x + 195} cy={Y0 - 1.1 * M} r="8" fill={P.gold} />
        <Papan x={x} y={Y0 - 3.15 * M - 70} teks="Kos Naya" size={36} />
        <rect x={x + 330} y={Y0 - 2.9 * M} width="48" height={0.6 * M} rx="20" fill="#2E5C6B" />
      </g>
    );
  })();
  const pos = (() => {
    const x = TEMPAT_KL.pos.x,
      kt = TEMPAT_KL.pos.kotak;
    return (
      <g data-tempat="pos-keresahan">
        {/* pos ronda: lantai panggung, 4 tiang, atap */}
        {[-230, -80, 80, 230].map((dx) => <rect key={dx} x={x + dx - 12} y={Y0 - 2.4 * M} width="24" height={2.4 * M} fill="#6B4A36" />)}
        <rect x={x - 260} y={Y0 - 0.55 * M} width="520" height="34" fill="#8A6246" />
        <rect x={x - 250} y={Y0 - 0.55 * M + 34} width="500" height="16" fill="#5E4434" />
        <path d={`M${x - 330} ${Y0 - 2.4 * M}L${x} ${Y0 - 3.6 * M}L${x + 330} ${Y0 - 2.4 * M}Z`} fill="#B5643F" />
        <rect x={x - 330} y={Y0 - 2.4 * M} width="660" height="22" fill="#8E4A30" />
        {/* kentongan */}
        <rect x={x + 150} y={Y0 - 1.9 * M} width="26" height="110" rx="12" fill="#A0784E" />
        <Papan x={x} y={Y0 - 0.55 * M - 120} teks="Pos Keresahan" size={40} />
        {/* kotak titip */}
        <rect x={kt.x - 70} y={kt.y + 120} width="14" height={Y0 - kt.y - 120} fill="#5E4434" />
        <rect x={kt.x + 56} y={kt.y + 120} width="14" height={Y0 - kt.y - 120} fill="#5E4434" />
        <rect x={kt.x - 80} y={kt.y} width="160" height="130" rx="10" fill="#C98F5E" stroke="#6B4A36" strokeWidth="6" />
        <rect x={kt.x - 46} y={kt.y + 26} width="92" height="12" rx="6" fill="#3A2A22" />
        <text x={kt.x} y={kt.y + 98} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.ink}>TITIP</text>
        {/* tiang ujung tali lampion */}
        <rect x={TEMPAT_KL.pos.tali.x1 - 10} y={TEMPAT_KL.pos.tali.y - 30} width="20" height={Y0 - TEMPAT_KL.pos.tali.y + 30} fill="#4A4542" />
        <path d={`M${TEMPAT_KL.pos.tali.x0} ${TEMPAT_KL.pos.tali.y}Q${(TEMPAT_KL.pos.tali.x0 + TEMPAT_KL.pos.tali.x1) / 2} ${TEMPAT_KL.pos.tali.y + 2 * TEMPAT_KL.pos.tali.sag} ${TEMPAT_KL.pos.tali.x1} ${TEMPAT_KL.pos.tali.y}`} stroke="#2E2A28" strokeWidth="4" fill="none" />
      </g>
    );
  })();
  const baca = (() => {
    const x = TEMPAT_KL.baca.x,
      w = 760,
      kn = TEMPAT_KL.baca.kanopi;
    return (
      <g data-tempat="ruang-baca">
        <rect x={x - w / 2} y={Y0 - 3.6 * M} width={w} height={3.6 * M} fill="#D9CDB4" />
        <path d={`M${x - w / 2 - 50} ${Y0 - 3.6 * M}L${x} ${Y0 - 4.9 * M}L${x + w / 2 + 50} ${Y0 - 3.6 * M}Z`} fill="#4E7A62" />
        {/* jendela besar berisi rak buku */}
        <rect x={x - 330} y={Y0 - 2.9 * M} width="300" height="300" fill="#F0C98A" opacity=".85" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={x - 320} y={Y0 - 2.9 * M + 20 + r * 95} width="280" height="10" fill="#6B4A36" />
            {Array.from({ length: 9 }, (_, k) => <rect key={k} x={x - 314 + k * 30} y={Y0 - 2.9 * M + 30 + r * 95 + (k % 3) * 6} width="22" height={58 - (k % 3) * 6} fill={['#8B4354', '#3E7F6A', '#D1A258', '#4A6FB5'][(k + r) % 4]} />)}
          </g>
        ))}
        <rect x={x - 330} y={Y0 - 2.9 * M} width="300" height="300" fill="none" stroke="#5E4434" strokeWidth="8" />
        <rect x={x + 80} y={Y0 - 2.3 * M} width="170" height={2.3 * M} fill="#4E6A5A" />
        {/* kanopi lampion Diriset */}
        <rect x={kn.x0} y={kn.y} width={kn.x1 - kn.x0} height="26" fill="#3E6450" />
        <Papan x={x} y={Y0 - 3.6 * M + 30} teks="Ruang Baca" size={36} />
        {/* bangku */}
        <rect x={x + 290} y={Y0 - 0.45 * M} width="180" height="20" fill="#8A6246" />
        <rect x={x + 300} y={Y0 - 0.45 * M} width="14" height={0.45 * M} fill="#5E4434" />
        <rect x={x + 446} y={Y0 - 0.45 * M} width="14" height={0.45 * M} fill="#5E4434" />
      </g>
    );
  })();
  const meja = (() => {
    const x = TEMPAT_KL.meja.x,
      w = 760;
    return (
      <g data-tempat="meja-gambar-yan">
        {/* Kos Yan di belakang */}
        <rect x={x - w / 2} y={Y0 - 5.8 * M} width={w} height={5.8 * M} fill="#A9B79E" />
        <path d={`M${x - w / 2 - 50} ${Y0 - 5.8 * M}L${x} ${Y0 - 7.2 * M}L${x + w / 2 + 50} ${Y0 - 5.8 * M}Z`} fill="#5E6E8A" />
        <Jendela x={x - 280} y={Y0 - 5.1 * M} w={170} h={190} nyala={0.7} />
        <Jendela x={x + 110} y={Y0 - 5.1 * M} w={170} h={190} nyala={0.2} />
        <Papan x={x} y={Y0 - 5.8 * M + 40} teks="Kos Yan" size={32} />
        {/* pergola */}
        {[-300, 300].map((dx) => <rect key={dx} x={x + dx - 12} y={Y0 - 2.6 * M} width="24" height={2.6 * M} fill="#7A5844" />)}
        {Array.from({ length: 7 }, (_, k) => <rect key={k} x={x - 340 + k * 113} y={Y0 - 2.75 * M} width="20" height="30" fill="#8E6A52" />)}
        <rect x={x - 360} y={Y0 - 2.62 * M} width="720" height="22" fill="#8E6A52" />
        <Papan x={x} y={Y0 - 2.62 * M + 34} teks="Meja Gambar Yan" size={30} />
      </g>
    );
  })();
  /** meja gambar (di depan tokoh yang duduk, digambar sesudah isi supaya menutupi kaki) */
  const mejaDepan = (() => {
    const x = TEMPAT_KL.meja.x;
    const k = TEMPAT_KL.meja.kertas;
    return (
      <g data-detail="meja-gambar">
        <rect x={x - 130} y={Y0 - 0.82 * M} width="380" height="24" fill="#B98A62" />
        <rect x={x - 120} y={Y0 - 0.82 * M + 24} width="360" height={0.82 * M + (KL.trotoar - Y0) - 24} fill="#9A6E4E" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`rotate(${-4 + i * 5} ${k.x + i * 70} ${k.y})`}>
            <rect x={k.x - 40 + i * 70} y={k.y - 34} width="62" height="40" fill="#FFF9EF" stroke="#C9C2B4" strokeWidth="2" />
            <rect x={k.x - 34 + i * 70} y={k.y - 28} width="22" height="14" fill="#95B8A2" />
            <rect x={k.x - 8 + i * 70} y={k.y - 28} width="22" height="14" fill="#E7899A" />
          </g>
        ))}
      </g>
    );
  })();
  const lahan = (() => {
    const x = TEMPAT_KL.lahan.x;
    return (
      <g data-tempat="lahan-cerita">
        <Papan x={x - 60} y={Y0 - 2.9 * M} teks="Lahan Cerita" size={36} />
        <rect x={x - 70} y={Y0 - 2.9 * M + 58} width="20" height={2.9 * M - 58} fill="#5E4434" />
        {TEMPAT_KL.lahan.rumah.map((r, i) => (
          <g key={i}>
            <rect x={r.x - 110} y={Y0 - 1.9 * M} width="220" height={1.9 * M} fill={i ? '#E7C9A0' : '#CFE0D2'} />
            <path d={`M${r.x - 140} ${Y0 - 1.9 * M}L${r.x} ${Y0 - 2.7 * M}L${r.x + 140} ${Y0 - 1.9 * M}Z`} fill={i ? '#8B4354' : '#3E7F6A'} />
            <rect x={r.x - 70} y={Y0 - 1.55 * M} width="140" height="100" rx="6" fill="#1F2A26" />
            <rect x={r.x - 64} y={Y0 - 1.55 * M + 6} width="128" height="88" rx="4" fill="#F0C98A" opacity={0.3 + 0.6 * layarRumah} />
            <path d={`M${r.x - 14} ${Y0 - 1.55 * M + 28}L${r.x + 20} ${Y0 - 1.55 * M + 50}L${r.x - 14} ${Y0 - 1.55 * M + 72}Z`} fill={P.wine} opacity={0.4 + 0.6 * layarRumah} />
          </g>
        ))}
        {/* petak berikutnya: patok + tali */}
        {(() => {
          const p = TEMPAT_KL.lahan.petak.x;
          return (
            <g data-detail="petak-berikutnya">
              {[-120, 120].map((dx) => <rect key={dx} x={p + dx - 6} y={Y0 - 0.5 * M} width="12" height={0.5 * M} fill="#8A6246" />)}
              <path d={`M${p - 120} ${Y0 - 0.42 * M}H${p + 120}`} stroke="#E8DFC8" strokeWidth="4" strokeDasharray="12 8" />
            </g>
          );
        })()}
        {/* pagar rendah */}
        {Array.from({ length: 22 }, (_, k) => <rect key={k} x={4180 + k * 44} y={Y0 - 0.55 * M} width="14" height={0.55 * M} fill="#E8DFC8" opacity=".8" />)}
        <rect x={4170} y={Y0 - 0.45 * M} width={22 * 44} height="10" fill="#E8DFC8" opacity=".8" />
      </g>
    );
  })();
  // ---------- detail hidup di depan bangunan (pot, gerobak, jemuran, lampu tali)
  const hidup = (
    <g data-detail="hidup">
      {[[560, 0], [760, 1], [1460, 2], [2420, 0], [3060, 1], [3300, 2], [4060, 0], [5080, 1]].filter(([x]) => tampak(x - 100, x + 100)).map(([x, k]) => <Plant key={x} x={x} y={Y0 + 6} s={1.25} kind={k} />)}
      {tampak(700, 1700) && <Laundry x0={1420} x1={1620} y={Y0 - 2.6 * M} f={f} />}
      {tampak(700, 2400) && <StringLights x0={760} x1={1690} y={Y0 - 3.4 * M} sag={60} f={f} n={16} />}
      {tampak(3200, 4800) && <StringLights x0={3290} x1={4300} y={Y0 - 3.0 * M} sag={70} f={f} n={18} />}
      {tampak(5000, 5500) && (
        <g data-detail="gerobak">
          <rect x={5200} y={Y0 - 1.1 * M} width="190" height="120" rx="8" fill="#C9473F" />
          <rect x={5210} y={Y0 - 1.1 * M - 90} width="170" height="90" fill="#E9E1CF" opacity=".85" />
          <text x={5295} y={Y0 - 1.1 * M + 74} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#FFF3D6">BAKSO</text>
          <circle cx={5230} cy={Y0 - 0.2 * M} r="36" fill="#2E2A28" />
          <circle cx={5360} cy={Y0 - 0.2 * M} r="36" fill="#2E2A28" />
        </g>
      )}
    </g>
  );
  /** trotoar sisi kamera (lapisan depan): ubin, pot bunga, bangku; memberi kedalaman supaya jalan tidak kosong */
  const depan = (
    <g data-detail="trotoar-depan">
      <rect x={X0} y={1700} width={X1 - X0} height="600" fill="#6F685E" />
      <rect x={X0} y={1690} width={X1 - X0} height="18" fill="#B7AE9E" />
      {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${X0 + i * 150} 1708L${X0 + i * 150 - 60} 2300`} stroke="#5E584F" strokeWidth="4" />)}
      {Array.from({ length: 14 }, (_, i) => X0 + 300 + i * 520).filter((x) => tampak(x - 200, x + 200)).map((x, i) => (
        <g key={x}>
          <rect x={x - 90} y={1730} width="180" height="110" rx="10" fill="#8E6A52" />
          <ellipse cx={x} cy={1730} rx="110" ry="60" fill={i % 2 ? '#3E6A50' : '#4C7A5A'} />
          {[-50, 0, 50].map((d) => <circle key={d} cx={x + d} cy={1700 - Math.abs(d) * 0.3} r="16" fill={['#E7899A', '#F1C977', '#FFF3B8'][(i + d / 50 + 1) % 3]} />)}
        </g>
      ))}
    </g>
  );
  // ---------- tanah: trotoar + jalan
  const tanah = (
    <g data-detail="tanah">
      <rect x={X0} y={Y0} width={X1 - X0} height={KL.trotoar + 70 - Y0} fill="#7B746A" />
      {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${X0 + i * 120} ${Y0}L${X0 + i * 120 - 30} ${KL.trotoar + 70}`} stroke="#6A6359" strokeWidth="3" />)}
      <rect x={X0} y={KL.trotoar + 70} width={X1 - X0} height="22" fill="#B7AE9E" />
      <rect x={X0} y={KL.trotoar + 92} width={X1 - X0} height={2200 - KL.trotoar} fill="#3F3E44" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={X0 + i * 180} y={KL.trotoar + 300} width="100" height="12" fill="#D9D0BB" opacity=".55" />)}
    </g>
  );
  const pohon = [-150, 1580, 2250, 3150, 4100, 5200].filter((x) => tampak(x - 400, x + 400)).map((x, i) => <Pohon key={x} x={x} s={1} warna={i % 2 ? '#3E5E4C' : '#466A52'} />);
  const lampuX = [700, 2380, 4000, 5300].filter((x) => tampak(x - 300, x + 500));
  // ---------- isi (tokoh) diurut y
  const isiS = isi.map((q, i) => ({ ...q, s: q.s ?? KL.skala * (1 + (q.y - KL.trotoar) / 900), k: i })).sort((a, b) => a.y - b.y);
  const tokoh = isiS.map((q) => (
    <g key={q.k}>
      {!q.tanpaBayangan && <KontakKaki c={c} x={q.x} y={q.y} rx={(q.lebar ?? 0.5) * q.s * 120} ry={(q.lebar ?? 0.5) * q.s * 26} id={`${id}-kk${q.k}`} />}
      {q.polos ? q.gambar({ x: q.x, y: q.y, s: q.s }) : <TokohBercahaya c={c} x={q.x} y={q.y} s={q.s} tinggi={q.tinggi ?? 1.6} id={`${id}-tc${q.k}`}>{q.gambar({ x: q.x, y: q.y, s: q.s })}</TokohBercahaya>}
    </g>
  ));
  const lampionNode = lampion.map((l, i) => <Lampion key={i} x={l.x} y={l.y} s={l.s ?? 1} f={f} nyala={l.nyala ?? 1} warna={l.warna} emas={l.emas} tali={l.tali ?? 24} seed={i} id={`${id}-lp${i}`} />);
  const hujanNode =
    hujan > 0 ? (
      <g data-fx="hujan" opacity={hujan}>
        {Array.from({ length: 140 }, (_, i) => {
          const x = vx0 + acak(i) * (vx1 - vx0),
            y = -300 + ((acak(i + 9) * 2600 + f * 38) % 2600);
          return <path key={i} d={`M${x} ${y}l-10 46`} stroke="#B9C8DC" strokeWidth="2.4" opacity=".4" />;
        })}
      </g>
    ) : null;
  return (
    <g data-lokasi="kampung-less-2d" filter={kabur > 0 ? `url(#${id}-kabur)` : undefined}>
      {kabur > 0 && (
        <defs>
          <filter id={`${id}-kabur`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={kabur.toFixed(2)} />
          </filter>
        </defs>
      )}
      <defs>
        <linearGradient id={`${id}-langit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141B2B" />
          <stop offset="1" stopColor="#34405C" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill={`url(#${id}-langit)`} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={acak(i) * 1080} cy={acak(i + 40) * 900} r={1 + acak(i + 3) * 1.6} fill="#F6EED8" opacity={0.3 + 0.5 * Math.abs(Math.sin(f * 0.05 + i))} />)}
      <Moon x={820} y={420} r={42} />
      <g transform={T}>
        {latar}
        <rect x={X0} y={Y0 - 40} width={X1 - X0} height="40" fill="#222A3A" opacity=".6" />
        {pohon}
        {tampak(0, 760) && gapura}
        {tampak(700, 1500) && kosNaya}
        {tampak(1450, 2400) && pos}
        {tampak(2300, 3200) && baca}
        {tampak(3200, 4100) && meja}
        {tampak(4100, 5100) && lahan}
        {hidup}
        {tanah}
        {lampuX.map((x) => <LampuJalan key={x} x={x} f={f} />)}
        {/* malam: warna bidang diredam (sebelum tokoh dan cahaya) */}
        <rect x={X0} y={-2000} width={X1 - X0} height="4400" fill="#1A2236" opacity={0.28 + 0.2 * gelap} />
        {tokoh}
        {tampak(3200, 4100) && mejaDepan}
        {lampuX.map((x) => pendarLampu(x, KL.trotoar + 40, 1 - 0.5 * gelap))}
        {lampionNode}
        {depan}
        {hujanNode}
      </g>
      <rect width="1080" height="1920" fill="#0E1420" opacity={0.3 * gelap} />
    </g>
  );
}
