// v2 (17 Nov 2026, video perkenalan web Less.): salinan v1 (terkunci, dipakai Villain v2) + dua slot baru, sisanya sama:
//   `luar(f, jendela)`  = isi tambahan di luar jendela (di bawah hujan, ikut parallax 60%), mis. lampion dari jendela lain;
//                         jendela = { x0, y0, x1, y1 } kotak kaca (koordinat dunia).
//   `gantung`           = benda yang digantung di dinding belakang di depan lampu tali (mis. lampion), di belakang
//                         perabot dan tokoh. Koordinat dunia (titikKamar(X, h, 0.05)).
// Lokasi bersama: kamar Naya di malam hujan, PANGGUNG FLAT 2D dari depan (v1, 12 Nov 2026) dengan cahaya 2D
// (shared/film/v1/Cahaya2D.tsx, disetujui pengguna 11 Nov 2026). Dibuat untuk "Aku Bisa Jadi Villain" v2. Pengguna 12 Nov
// 2026: "sekarang lanjut ke aku bisa jadi villain, itu kan belum ada finalnya, buat dengan style baru".
// Isi menurut gagasan v1 (kamar-villain/v1, cara lama), dibuat ulang untuk sistem 2D sekarang:
//   dinding belakang (lebar 6,6 m, kiri → kanan): cermin berdiri bersandar ke dinding, papan gabus berisi catatan,
//   lampu tali, meja menghadap kamera (laptop, lampu meja, mug, buku; di kiri jendela supaya sisi kanan jendela lapang
//   untuk tokoh berdiri), jendela berhujan + gorden (lampu kota, hujan, tetes di kaca), pot, pintu. Lantai kayu, karpet, plafon.
// Satu malam hujan tanpa lompatan waktu. Cahaya: lampu meja (kanan) + cahaya dingin dari jendela; `tenang` 0..1 membuat
// cahaya sedikit lebih hangat dan terang (beat lega). cahayaNaya(tenang) bisa dipakai di luar lokasi.
// Keadaan:
//   `papan` = catatan di papan gabus (u, v 0..1 dari kiri-atas papan; jatuh 0..1 = berguguran ke lantai).
//   `cermin` = isi pantulan (fungsi, digambar terpotong di kaca cermin; koordinat dunia; lihat CERMIN2D, titikPantulan).
//   Adegan cermin: tokoh yang menghadap cermin tampak belakang, wajahnya terlihat di pantulan (titikPantulan menghitung
//   letak bayangan maya); jangan menggambar tokoh dan pantulannya sama-sama menghadap kamera.
//   `laptop` = { layar 0..1, tutup } layar menyala; tutup = laptop dilipat rata di meja (v2: tangan/HP Naya tidak tertutup) (layarnya menghadap Naya; isi pesan lewat insert penuh di proyek).
//   `jendelaBuka` 0..1 = daun jendela kanan terbuka.
// Skala & kamera sama dengan kamar-kerja-2d/v1: dinding 227 px/m (kaki dinding y 1180), mata 1,3 m (cakrawala y 885),
// kamera 4 m dari dinding; titikKamar(X, h, d). Tokoh: `isi` [{ x, y, gambar, s? }] (kaki di lantai), skala skalaKamar(y).
// Pakai: <KamarNaya2D f kam papan cermin laptop jendelaBuka tenang isi kabur id />
import React from 'react';
import { P } from '../../../core/v1/core';
import { Plant, StringLights } from '../../_detail/v1/Detail';
import { Mug } from '../../../props/minum/v1/Minum';
import { Terang, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, NadaAkhir, type Cahaya2D } from '../../../film/v1/Cahaya2D';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type Isi2D = {
  x: number;
  y: number;
  s?: number;
  gambar: (p: Titik2D) => React.ReactNode;
  jarakDinding?: number;
  tinggi?: number;
  lebar?: number;
  teduh?: boolean;
  fokus?: boolean;
  polos?: boolean;
  tanpaBayangan?: boolean;
  urut?: number;
};
/** catatan di papan gabus: u, v = posisi 0..1 dari kiri-atas papan; jatuh 0..1 = berguguran ke lantai */
export type Catatan = { teks: string; u: number; v: number; warna?: string; tinta?: string; rot?: number; jatuh?: number; k?: number };

export const KAMAR_NAYA = {
  kakiDinding: 1180,
  pxM: 227,
  cakrawala: 885,
  mata: 1.3,
  jarakKamera: 4.0,
  plafon: 2.75,
  X0: -3.3,
  X1: 3.3,
  meja: { X0: -0.2, X1: 1.3, d0: 0.75, d1: 1.35, tinggi: 0.74 },
  jendela: { X0: 0.6, X1: 2.2, h0: 0.95, h1: 2.2 },
  papan: { X0: -1.95, X1: -0.3, h0: 0.95, h1: 1.95 },
  cermin: { X0: -3.0, X1: -2.22, h0: 0.06, h1: 1.86, d: 0.12 },
};
const K = KAMAR_NAYA;
const FOK = K.pxM * K.jarakKamera;
export const pxMd = (d: number) => FOK / (K.jarakKamera - d);
export const titikKamar = (X: number, h: number, d: number): Titik2D => {
  const m = pxMd(d);
  return { x: 540 + X * m, y: K.cakrawala + (K.mata - h) * m, s: m / 200 };
};
export const yLantai = (d: number) => titikKamar(0, 0, d).y;
export const dDariY = (y: number) => Math.max(0, K.jarakKamera - (K.mata * FOK) / Math.max(1, y - K.cakrawala));
export const skalaKamar = (y: number) => Math.max(0.2, (y - K.cakrawala) / (K.mata * 200));
/** Naya duduk/berdiri di belakang meja (kaki di lantai, d 0,45 m) */
export const MEJA2D = titikKamar(0.55, 0, 0.45);
/** kaca cermin (koordinat dunia) untuk isi pantulan */
export const CERMIN2D = (() => {
  const a = titikKamar(K.cermin.X0 + 0.06, K.cermin.h1 - 0.06, K.cermin.d),
    b = titikKamar(K.cermin.X1 - 0.06, K.cermin.h0 + 0.06, K.cermin.d);
  return { x0: a.x, y0: a.y, x1: b.x, y1: b.y, pxM: pxMd(K.cermin.d) };
})();
/** Titik bayangan maya di cermin untuk benda di (X, h, d): bidang cermin di d = cermin.d, bayangan berada sama jauh di
 *  belakangnya. Dipakai untuk menaruh pantulan tokoh di dalam kaca (posisi dan skala ikut perspektif kamera). */
export const titikPantulan = (X: number, h: number, d: number): Titik2D => titikKamar(X, h, 2 * K.cermin.d - d);
/** papan gabus (koordinat dunia) */
export const PAPAN2D = { x0: 540 + K.papan.X0 * K.pxM, x1: 540 + K.papan.X1 * K.pxM, y0: K.kakiDinding - K.papan.h1 * K.pxM, y1: K.kakiDinding - K.papan.h0 * K.pxM };
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara2D = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({
  zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t,
  cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t,
  cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t,
});

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const hex = (s: string) => {
  if (s.startsWith('rgb')) return s.match(/\d+/g)!.map(Number) as [number, number, number];
  const p = parseInt(s.slice(1), 16);
  return [(p >> 16) & 255, (p >> 8) & 255, p & 255] as [number, number, number];
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * klamp(t))).join(',')})`;
};
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
/** Cahaya kamar Naya: lampu meja dari kanan, malam hujan; tenang 0..1 = lebih hangat dan terang. */
export function cahayaNaya(tenang = 0): Cahaya2D {
  return {
    matahari: { az: 62, el: 30, warna: mix('#FFD08A', '#FFDFA6', tenang) },
    suasana: { bayangan: mix('#1E2438', '#33304A', tenang), ambient: 0.58 + 0.08 * tenang, diffuse: 0.85, lantai: 0.32, nada: { warna: mix('#2A3550', '#7A6A62', tenang), kuat: 0.12 - 0.06 * tenang } },
  };
}

type Lapis = { y: number; x0: number; x1: number; node: React.ReactNode; bay?: { kaki: [number, number]; tinggiPx: number; siluet: React.ReactNode; kuat?: number; jarakPx?: number } };
const pt = (X: number, h: number, d: number) => {
  const p = titikKamar(X, h, d);
  return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
};
const quad = (a: [number, number, number], b: [number, number, number], c2: [number, number, number], d2: [number, number, number]) => `M${pt(...a)}L${pt(...b)}L${pt(...c2)}L${pt(...d2)}Z`;
const LAMPU_X = 1.08;

export function KamarNaya2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  papan = [],
  cermin,
  laptop = {},
  jendelaBuka = 0,
  tenang = 0,
  isi = [],
  cahaya,
  kabur = 0,
  id = 'kn2',
  luar: luarIsi,
  gantung,
}: {
  f?: number;
  kam?: Kam2D;
  papan?: Catatan[];
  cermin?: (f: number) => React.ReactNode;
  laptop?: { layar?: number; tutup?: boolean };
  jendelaBuka?: number;
  tenang?: number;
  isi?: Isi2D[];
  cahaya?: Cahaya2D;
  kabur?: number;
  id?: string;
  luar?: (f: number, jendela: { x0: number; y0: number; x1: number; y1: number }) => React.ReactNode;
  gantung?: React.ReactNode;
}) {
  const c = cahaya ?? cahayaNaya(tenang);
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  const vx0 = kam.cx - 540 / kam.zoom - 250,
    vx1 = kam.cx + 540 / kam.zoom + 250;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  const Y0 = K.kakiDinding,
    PX = K.pxM;
  const yW = (h: number) => Y0 - h * PX;
  const xW = (X: number) => 540 + X * PX;
  const yPlafon = yW(K.plafon);
  const dDekat = 3.5;
  const hangat = (a: string, b: string) => mix(a, b, tenang * 0.35);
  const cat = hangat('#5A6A6C', '#727068'),
    catSisi = hangat('#4C5A5C', '#62625C'),
    plafon = hangat('#424C4E', '#58554F'),
    lantaiA = hangat('#5E4A3E', '#6E5644'),
    lantaiB = hangat('#54423A', '#644E40'),
    plint = '#3A3634';
  const kayu = '#7A5844',
    kayuGelap = '#5E4434',
    kayuAtas = '#8E6A52';

  // ---------- luar jendela (malam hujan, lampu kota; parallax 60%)
  const Jd = K.jendela;
  const jx0 = xW(Jd.X0),
    jx1 = xW(Jd.X1),
    jy0 = yW(Jd.h1),
    jy1 = yW(Jd.h0);
  const px = (kam.cx - 540) * 0.6,
    py = (kam.cy - 960) * 0.6;
  const gedung: [number, number, number][] = [[600, 700, 760], [690, 790, 700], [780, 860, 790], [850, 980, 720], [970, 1060, 770], [1050, 1160, 690], [520, 610, 800]];
  const luar = (
    <g data-detail="luar-jendela">
      <defs>
        <clipPath id={`${id}-jw`}>
          <rect x={jx0} y={jy0} width={jx1 - jx0} height={jy1 - jy0} />
        </clipPath>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2333" />
          <stop offset="1" stopColor="#36405A" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-jw)`}>
        <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
          <rect x={jx0 - 400} y={jy0 - 400} width={jx1 - jx0 + 800} height={jy1 - jy0 + 800} fill={`url(#${id}-lg)`} />
          {gedung.map(([a, b, y], i) => (
            <g key={i}>
              <rect x={a} y={y} width={b - a} height="400" fill={i % 2 ? '#222B3C' : '#283246'} />
              {Array.from({ length: 12 }, (_, k) => {
                const nyala = acak(i * 13 + k) > 0.45;
                return nyala ? <rect key={k} x={a + 10 + (k % 3) * ((b - a - 20) / 3)} y={y + 16 + Math.floor(k / 3) * 34} width="12" height="14" fill="#F2C878" opacity={0.45 + 0.4 * acak(k + i)} /> : null;
              })}
            </g>
          ))}
          {luarIsi && <g data-detail="luar-isi">{luarIsi(f, { x0: jx0, y0: jy0, x1: jx1, y1: jy1 })}</g>}
          {/* hujan di luar */}
          {Array.from({ length: 46 }, (_, i) => {
            const x = jx0 - 60 + acak(i) * (jx1 - jx0 + 120),
              y = jy0 - 40 + (((acak(i + 9) * 400 + f * 26) % 400) as number);
            return <path key={'h' + i} d={`M${x} ${y}l-5 22`} stroke="#B9C8DC" strokeWidth="1.6" opacity=".45" />;
          })}
        </g>
        {/* tetes di kaca (tidak ikut parallax) */}
        {Array.from({ length: 22 }, (_, i) => {
          const x = jx0 + 10 + acak(i + 40) * (jx1 - jx0 - 20),
            y = jy0 + ((acak(i + 60) * (jy1 - jy0) + f * (0.4 + acak(i) * 1.2)) % (jy1 - jy0));
          return (
            <g key={'t' + i}>
              <path d={`M${x} ${y - 14}L${x} ${y}`} stroke="#9FB3C8" strokeWidth="1.2" opacity=".35" />
              <circle cx={x} cy={y} r={2.4 + acak(i + 3) * 2} fill="#C9D8E8" opacity=".55" />
            </g>
          );
        })}
      </g>
    </g>
  );

  // ---------- dinding belakang, hiasan, papan, cermin, jendela
  const dindingD = `M${xW(K.X0)} ${yPlafon}H${xW(K.X1)}V${Y0}H${xW(K.X0)}Z M${jx0} ${jy0}V${jy1}H${jx1}V${jy0}Z`;
  const B = PAPAN2D;
  const papanNode = (
    <g data-detail="papan-gabus">
      <rect x={B.x0 - 12} y={B.y0 - 12} width={B.x1 - B.x0 + 24} height={B.y1 - B.y0 + 24} rx="6" fill="#7A5844" />
      <rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} fill="#B98A5E" />
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={B.x0 + acak(i + 200) * (B.x1 - B.x0)} cy={B.y0 + acak(i + 300) * (B.y1 - B.y0)} r={1.5 + acak(i) * 2} fill="#9E7148" opacity=".55" />
      ))}
      <Terang c={c} n="depan" kotak={[B.x0 - 12, B.y0 - 12, B.x1 - B.x0 + 24, B.y1 - B.y0 + 24]} />
    </g>
  );
  const catatanNode = (q: Catatan, i: number) => {
    const w = 96,
      h = 64;
    const j = klamp(q.jatuh ?? 0);
    const x0 = B.x0 + q.u * (B.x1 - B.x0),
      y0 = B.y0 + q.v * (B.y1 - B.y0);
    // jatuh: melayang turun ke lantai di depan dinding, sedikit bergeser dan berputar
    const yLantaiJ = yLantai(0.25 + 0.3 * acak(i + 7)) - h / 2;
    const x = x0 + j * (40 * (acak(i + 3) - 0.5) + 30 * Math.sin(j * 6 + i)),
      y = y0 + j * j * (yLantaiJ - y0);
    const rot = (q.rot ?? 0) + Math.sin(j * Math.PI) * (acak(i + 11) > 0.5 ? 50 : -50) + j * (acak(i + 13) - 0.5) * 30;
    const sk = 1 + 0.15 * j;
    const rebah = 1 - 0.62 * klamp((j - 0.8) / 0.2);
    return (
      <g key={'c' + i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sk.toFixed(3)} ${(sk * rebah).toFixed(3)})`} opacity={q.k ?? 1} data-detail="catatan">
        <rect x={-w / 2 + 3} y={-h / 2 + 4} width={w} height={h} fill="#000" opacity=".18" />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={q.warna ?? '#FFF3B8'} />
        {q.teks.split('\n').map((t, k) => (
          <text key={k} x="0" y={-h / 2 + 26 + k * 18} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={t.length > 9 ? 13 : 15} fill={q.tinta ?? P.ink}>
            {t}
          </text>
        ))}
        {j < 0.05 && <circle cx="0" cy={-h / 2 + 7} r="5" fill={i % 2 ? P.wine : '#3E7F6A'} />}
      </g>
    );
  };
  const CM = K.cermin;
  const cerminNode = (
    <g data-benda="cermin">
      {(() => {
        const a = titikKamar(CM.X0, CM.h1, CM.d),
          b = titikKamar(CM.X1, CM.h0, CM.d);
        const G = CERMIN2D;
        return (
          <g>
            <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx="14" fill="#6A4E3E" />
            <defs>
              <linearGradient id={`${id}-kc`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8EA4B4" />
                <stop offset="1" stopColor="#4A5A6E" />
              </linearGradient>
              <clipPath id={`${id}-cm`}>
                <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx="8" />
              </clipPath>
            </defs>
            <rect x={G.x0} y={G.y0} width={G.x1 - G.x0} height={G.y1 - G.y0} rx="8" fill={`url(#${id}-kc)`} />
            <g clipPath={`url(#${id}-cm)`}>
              {cermin ? cermin(f) : null}
              <path d={`M${G.x0 + 20} ${G.y1}L${G.x0 + 60} ${G.y1}L${G.x1} ${G.y0 + 120}L${G.x1} ${G.y0 + 40}Z`} fill="#fff" opacity=".1" />
            </g>
            <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
            {/* kaki penyangga */}
            <path d={`M${b.x - 20} ${b.y}l18 ${0.12 * CM.d * PX + 8}`} stroke="#5A4234" strokeWidth="8" />
          </g>
        );
      })()}
    </g>
  );
  const jendela = (
    <g data-detail="jendela">
      {[jy0 - 0.06 * PX, jy1].map((y, i) => <rect key={i} x={jx0 - 0.06 * PX} y={y} width={jx1 - jx0 + 0.12 * PX} height={0.06 * PX} fill="#E6E2D8" />)}
      <rect x={jx0 - 0.06 * PX} y={jy0} width={0.06 * PX} height={jy1 - jy0} fill="#E6E2D8" />
      <rect x={jx1} y={jy0} width={0.06 * PX} height={jy1 - jy0} fill="#E6E2D8" />
      {/* daun jendela: kiri tetap, kanan bisa terbuka (menyempit ke arah engsel kanan) */}
      <rect x={jx0} y={jy0} width={(jx1 - jx0) / 2} height={jy1 - jy0} fill="none" stroke="#E6E2D8" strokeWidth="10" />
      {(() => {
        const mx = (jx0 + jx1) / 2,
          lebar = ((jx1 - jx0) / 2) * (1 - 0.82 * klamp(jendelaBuka));
        return (
          <g>
            <rect x={jx1 - lebar} y={jy0 - 6 * jendelaBuka} width={lebar} height={jy1 - jy0 + 12 * jendelaBuka} fill="#9FB3C8" opacity={0.08 + 0.1 * jendelaBuka} stroke="#E6E2D8" strokeWidth="10" />
            {jendelaBuka < 0.05 && <path d={`M${mx + 18} ${jy0 + 30}L${mx + 70} ${jy0 + 30}L${mx + 140} ${jy1 - 30}L${mx + 88} ${jy1 - 30}Z`} fill="#fff" opacity=".06" />}
          </g>
        );
      })()}
      {/* ambang */}
      <path d={quad([Jd.X0 - 0.1, Jd.h0 - 0.04, 0], [Jd.X1 + 0.1, Jd.h0 - 0.04, 0], [Jd.X1 + 0.1, Jd.h0 - 0.04, 0.14], [Jd.X0 - 0.1, Jd.h0 - 0.04, 0.14])} fill="#E6E2D8" />
      <Terang c={c} n="atas" d={quad([Jd.X0 - 0.1, Jd.h0 - 0.04, 0], [Jd.X1 + 0.1, Jd.h0 - 0.04, 0], [Jd.X1 + 0.1, Jd.h0 - 0.04, 0.14], [Jd.X0 - 0.1, Jd.h0 - 0.04, 0.14])} />
      {/* gorden */}
      {[[Jd.X0 - 0.45, Jd.X0 - 0.03], [Jd.X1 + 0.03, Jd.X1 + 0.45]].map(([a, b], i) => (
        <g key={'g' + i}>
          <path d={quad([a, 0.55, 0.06], [b, 0.55, 0.06], [b, Jd.h1 + 0.28, 0.06], [a, Jd.h1 + 0.28, 0.06])} fill={hangat('#8E6A7A', '#A07A86')} />
          <Terang c={c} n="depan" d={quad([a, 0.55, 0.06], [b, 0.55, 0.06], [b, Jd.h1 + 0.28, 0.06], [a, Jd.h1 + 0.28, 0.06])} />
          {[0.25, 0.5, 0.75].map((k) => {
            const p1 = titikKamar(a + (b - a) * k, 0.57, 0.065),
              p2 = titikKamar(a + (b - a) * k, Jd.h1 + 0.26, 0.065);
            return <path key={k} d={`M${p1.x} ${p1.y}L${p2.x} ${p2.y}`} stroke="#000" strokeWidth="3" opacity=".14" />;
          })}
        </g>
      ))}
      {(() => {
        const a = titikKamar(Jd.X0 - 0.5, Jd.h1 + 0.3, 0.08),
          b = titikKamar(Jd.X1 + 0.5, Jd.h1 + 0.3, 0.08);
        return <path d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke="#3A2E2A" strokeWidth="6" />;
      })()}
    </g>
  );
  const hiasan = (
    <g data-detail="hiasan">
      {/* lampu tali di atas papan dan cermin */}
      <StringLights x0={xW(-3.1)} x1={xW(-0.1)} y={yW(2.38)} sag={22} f={f} n={14} />
      {gantung && <g data-detail="gantung">{gantung}</g>}
      {/* rak dinding kecil + tanaman gantung di atas pintu */}
      <rect x={xW(2.55)} y={yW(2.16)} width={0.76 * PX} height={2.16 * PX} fill={hangat('#5C6466', '#6E6E66')} />
      <rect x={xW(2.6)} y={yW(2.1)} width={0.66 * PX} height={2.1 * PX} fill="#6E5242" />
      <circle cx={xW(2.68)} cy={yW(1.0)} r={0.035 * PX} fill={P.gold} />
      <rect x={xW(2.67)} y={yW(1.95)} width={0.52 * PX} height={0.75 * PX} fill="#000" opacity=".1" />
      {/* poster kecil di kanan papan */}
      <rect x={xW(-0.15)} y={yW(1.92)} width={0.36 * PX} height={0.48 * PX} fill="#E7899A" />
      <circle cx={xW(0.03)} cy={yW(1.7)} r={0.1 * PX} fill="#FFF3B8" opacity=".8" />
    </g>
  );

  // ---------- lantai, plafon, dinding samping
  const papanLantai: React.ReactNode[] = [];
  for (let k = 0; k < 24; k++) {
    const X = K.X0 + k * 0.28;
    papanLantai.push(<path key={'pl' + k} d={`M${pt(X, 0, 0)}L${pt(X, 0, dDekat)}`} stroke={lantaiB} strokeWidth="3" opacity=".8" />);
  }
  for (let k = 1; k < 12; k++) {
    const d = k * 0.3;
    const p1 = titikKamar(K.X0, 0, d),
      p2 = titikKamar(K.X1, 0, d);
    papanLantai.push(<path key={'pd' + k} d={`M${p1.x} ${p1.y}L${p2.x} ${p2.y}`} stroke={lantaiB} strokeWidth="1.5" opacity=".35" strokeDasharray={`${60 + k * 10} ${30 + k * 6}`} />);
  }
  const ruang = (
    <g data-detail="ruang">
      <path d={quad([K.X0, K.plafon, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X0, K.plafon, dDekat])} fill={plafon} />
      <path d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} fill={catSisi} />
      <path d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} fill={catSisi} />
      <Terang c={c} n="kanan" d={quad([K.X0, 0, 0], [K.X0, K.plafon, 0], [K.X0, K.plafon, dDekat], [K.X0, 0, dDekat])} />
      <Terang c={c} n="kiri" d={quad([K.X1, 0, 0], [K.X1, K.plafon, 0], [K.X1, K.plafon, dDekat], [K.X1, 0, dDekat])} />
      <path d={quad([K.X0, 0, 0], [K.X1, 0, 0], [K.X1, 0, dDekat], [K.X0, 0, dDekat])} fill={lantaiA} />
      {papanLantai}
      <path d={quad([-2.2, 0, 0.3], [1.0, 0, 0.3], [1.0, 0, 2.1], [-2.2, 0, 2.1])} fill={hangat('#6E7E78', '#7E8A80')} opacity=".9" />
      <path d={quad([-2.1, 0, 0.38], [0.9, 0, 0.38], [0.9, 0, 2.0], [-2.1, 0, 2.0])} fill="none" stroke="#C9D2C4" strokeWidth="4" opacity=".5" />
      <path d={dindingD} fillRule="evenodd" fill={cat} />
      <rect x={xW(K.X0)} y={Y0 - 0.1 * PX} width={(K.X1 - K.X0) * PX} height={0.1 * PX} fill={plint} />
      <AmbientKaki c={c} x0={xW(K.X0)} x1={xW(K.X1)} y={Y0} tinggi={100} yAtas={yPlafon} id={`${id}-ak`} />
      {hiasan}
      {papanNode}
      {jendela}
    </g>
  );

  // ---------- benda berdiri (urut kedalaman bersama tokoh)
  const lapis: Lapis[] = [];
  {
    const b = titikKamar(K.cermin.X1, 0, K.cermin.d);
    lapis.push({ y: b.y, x0: titikKamar(K.cermin.X0, 0, K.cermin.d).x, x1: b.x, node: cerminNode });
  }
  {
    const d = 0.3,
      p = titikKamar(2.55, 0, d),
      s = (pxMd(d) / 200) * 1.2;
    const node = <Plant x={p.x} y={p.y} s={s} kind={0} pot="#C9805A" />;
    lapis.push({ y: p.y, x0: p.x - 80 * s, x1: p.x + 80 * s, node, bay: { kaki: [p.x, p.y], tinggiPx: 150 * s, siluet: node, kuat: 0.3, jarakPx: d * PX } });
  }
  // meja + benda di atasnya (laptop menghadap Naya: kamera melihat punggung layar)
  {
    const M = K.meja,
      H = M.tinggi;
    const fA = titikKamar(M.X0, H, M.d1),
      fB = titikKamar(M.X1, 0, M.d1);
    const atas = quad([M.X0, H, M.d0], [M.X1, H, M.d0], [M.X1 + 0.03, H, M.d1 + 0.02], [M.X0 - 0.03, H, M.d1 + 0.02]);
    const lp = titikKamar(0.5, H, 1.05),
      m = pxMd(1.05);
    const layar = laptop.layar ?? 0;
    const lampuP = titikKamar(LAMPU_X, H, 0.95);
    const mugP = titikKamar(0.02, H, 1.18);
    const bukuA = titikKamar(-0.15, H + 0.1, 0.9),
      bukuB = titikKamar(0.2, H, 0.9);
    const node = (
      <g data-benda="meja">
        <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill={kayu} />
        <Terang c={c} n="depan" kotak={[fA.x, fA.y, fB.x - fA.x, fB.y - fA.y]} />
        {[0.15, 0.95].map((cx) => {
          const a = titikKamar(cx - 0.32, 0.64, M.d1),
            b = titikKamar(cx + 0.32, 0.4, M.d1),
            g1 = titikKamar(cx - 0.07, 0.52, M.d1),
            g2 = titikKamar(cx + 0.07, 0.52, M.d1);
          return (
            <g key={cx}>
              <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={kayuGelap} opacity=".5" />
              <path d={`M${g1.x} ${g1.y}H${g2.x}`} stroke={P.gold} strokeWidth="5" strokeLinecap="round" />
            </g>
          );
        })}
        <path d={atas} fill={kayuAtas} />
        <Terang c={c} n="atas" d={atas} />
        <rect x={fA.x - 0.03 * pxMd(M.d1)} y={fA.y - 0.04 * pxMd(M.d1)} width={fB.x - fA.x + 0.06 * pxMd(M.d1)} height={0.04 * pxMd(M.d1)} fill={kayuGelap} />
        {/* buku */}
        <rect x={bukuA.x} y={bukuA.y} width={bukuB.x - bukuA.x} height={bukuB.y - bukuA.y} fill="#3E7F6A" />
        <rect x={bukuA.x + 4} y={bukuA.y - 0.07 * pxMd(0.9)} width={bukuB.x - bukuA.x - 8} height={0.07 * pxMd(0.9)} fill="#E7899A" />
        {/* laptop: punggung layar + pendar layar ke arah Naya */}
        {laptop.tutup ? (
          <g data-detail="laptop-tutup">
            <rect x={lp.x - 0.2 * m} y={lp.y - 0.03 * m} width={0.4 * m} height={0.03 * m} rx={0.008 * m} fill="#8E969A" />
            <rect x={lp.x - 0.2 * m} y={lp.y - 0.008 * m} width={0.4 * m} height={0.012 * m} fill="#6E7478" />
          </g>
        ) : (
        <g data-detail="laptop">
          {layar > 0 && <ellipse cx={lp.x} cy={lp.y - 0.25 * m} rx={0.45 * m} ry={0.28 * m} fill="#BFD8F0" opacity={0.18 * layar} />}
          <path d={`M${lp.x - 0.2 * m} ${lp.y}L${lp.x + 0.2 * m} ${lp.y}L${lp.x + 0.17 * m} ${lp.y - 0.26 * m}L${lp.x - 0.17 * m} ${lp.y - 0.26 * m}Z`} fill="#8E969A" />
          <circle cx={lp.x} cy={lp.y - 0.13 * m} r={0.025 * m} fill="#C9D0D4" />
          <rect x={lp.x - 0.24 * m} y={lp.y - 0.01 * m} width={0.48 * m} height={0.025 * m} fill="#6E7478" />
        </g>
        )}
        {/* mug */}
        <g transform={`translate(${mugP.x} ${mugP.y})`}>
          <Mug s={mugP.s * 0.55} f={f} hangat={0.7} />
        </g>
        {/* lampu meja (kanan), kepala ke kiri ke arah laptop */}
        <g data-detail="lampu-meja" transform={`translate(${lampuP.x} ${lampuP.y}) scale(${(-lampuP.s).toFixed(4)} ${lampuP.s.toFixed(4)})`}>
          <ellipse cx="0" cy="0" rx="34" ry="8" fill="#3B3F3D" />
          <path d="M-2 0l-14 -110l46 -40" stroke="#3B3F3D" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M18 -166l50 22l-16 34l-48 -24Z" fill="#C98F84" />
          <ellipse cx="44" cy="-112" rx="22" ry="8" fill="#FFE7AE" transform="rotate(26 44 -112)" />
        </g>
      </g>
    );
    lapis.push({ y: fB.y, x0: fA.x, x1: fB.x, node, bay: { kaki: [(fA.x + fB.x) / 2, fB.y], tinggiPx: H * pxMd(M.d1), siluet: <rect x={fA.x} y={fA.y} width={fB.x - fA.x} height={fB.y - fA.y} fill="#000" />, kuat: 0.3, jarakPx: M.d1 * PX } });
  }
  // kursi di belakang meja
  {
    const d = 0.2,
      m = pxMd(d);
    const a = titikKamar(0.29, 0.98, d),
      b = titikKamar(0.81, 0.44, d),
      g = titikKamar(0.55, 0, d);
    const node = (
      <g data-benda="kursi">
        <path d={`M${a.x + 0.03 * m} ${b.y}V${g.y}M${b.x - 0.03 * m} ${b.y}V${g.y}`} stroke="#4E3A30" strokeWidth={0.04 * m} />
        <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={0.03 * m} fill="#5E4638" />
        <Terang c={c} n="depan" kotak={[a.x, a.y, b.x - a.x, b.y - a.y]} />
      </g>
    );
    lapis.push({ y: g.y, x0: a.x, x1: b.x, node });
  }

  // ---------- isi
  const isiS = isi.map((q, i) => ({ ...q, s: q.s ?? skalaKamar(q.y), k: i }));
  const tajam = isiS.filter((q) => q.fokus && kabur > 0);
  const kaburIsi = isiS.filter((q) => !(q.fokus && kabur > 0));
  const bayanganTokoh = isiS.map((q) => {
    if (q.teduh || q.tanpaBayangan) return null;
    const H = (q.tinggi ?? 1.6) * q.s * 200;
    return (
      <BayanganJatuh key={q.k} c={c} kaki={[q.x, q.y]} tinggiPx={H} id={`${id}-bt${q.k}`} dindingY={Y0} jarakDindingPx={(q.jarakDinding ?? dDariY(q.y)) * PX} kuat={0.4}>
        {q.gambar({ x: q.x, y: q.y, s: q.s })}
      </BayanganJatuh>
    );
  });
  const badan = (q: (typeof isiS)[number]) => {
    const W = (q.lebar ?? 0.5) * q.s * 200;
    return (
      <g key={`b${q.k}`}>
        {!q.tanpaBayangan && <KontakKaki c={c} x={q.x} y={q.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${q.k}`} />}
        {q.polos ? (
          q.gambar({ x: q.x, y: q.y, s: q.s })
        ) : (
          <TokohBercahaya c={c} x={q.x} y={q.y} s={q.s} tinggi={q.tinggi ?? 1.6} teduh={q.teduh} id={`${id}-tc${q.k}`}>
            {q.gambar({ x: q.x, y: q.y, s: q.s })}
          </TokohBercahaya>
        )}
      </g>
    );
  };
  const lapisTampak = lapis.filter((b) => tampak(b.x0, b.x1));
  const urutan: { y: number; node: React.ReactNode }[] = [
    ...lapisTampak.map((b) => ({ y: b.y, node: b.node })),
    ...kaburIsi.map((q) => ({ y: q.y + (q.urut ?? 0), node: badan(q) })),
  ].sort((a, b) => a.y - b.y);
  const bayanganBenda = lapisTampak
    .filter((b) => b.bay)
    .map((b, i) => (
      <BayanganJatuh key={i} c={c} kaki={b.bay!.kaki} tinggiPx={b.bay!.tinggiPx} id={`${id}-bb${i}`} dindingY={Y0} jarakDindingPx={b.bay!.jarakPx} kuat={b.bay!.kuat ?? 0.3}>
        {b.bay!.siluet}
      </BayanganJatuh>
    ));

  // ---------- cahaya: lampu meja hangat + gelap menjauh dari lampu + cahaya dingin jendela
  const lampuP = titikKamar(LAMPU_X, K.meja.tinggi, 0.95);
  const bx = lampuP.x - 44 * lampuP.s,
    by = lampuP.y - 112 * lampuP.s;
  const cahayaNode = (
    <g pointerEvents="none" data-fx="lampu-meja">
      <defs>
        <radialGradient id={`${id}-gl`} cx={bx} cy={by} r={1400 + 300 * tenang} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#141C2A" stopOpacity="0" />
          <stop offset="0.35" stopColor="#141C2A" stopOpacity={0.12 * (1 - 0.4 * tenang)} />
          <stop offset="1" stopColor="#141C2A" stopOpacity={0.3 * (1 - 0.3 * tenang)} />
        </radialGradient>
        <radialGradient id={`${id}-pl`} cx={bx} cy={by} r={700 + 200 * tenang} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD68A" stopOpacity={0.42 + 0.06 * tenang} />
          <stop offset="0.4" stopColor="#FFC873" stopOpacity={0.15 + 0.05 * tenang} />
          <stop offset="1" stopColor="#FFC873" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-tl`} cx={xW(-1.6)} cy={yW(2.2)} r={1.8 * PX} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD98A" stopOpacity={0.12 + 0.05 * tenang} />
          <stop offset="1" stopColor="#FFD98A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-jl`} x1="0" y1="0" x2="-0.4" y2="1">
          <stop offset="0" stopColor="#9FB8D8" stopOpacity=".12" />
          <stop offset="1" stopColor="#9FB8D8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-gl)`} />
      <rect x={xW(-3.6)} y={yW(3.2)} width={4 * PX} height={2.4 * PX} fill={`url(#${id}-tl)`} />
      <rect x="-3000" y="-2000" width="7000" height="6000" fill={`url(#${id}-pl)`} />
      <path d={`M${jx0} ${jy1}L${jx1} ${jy1}L${xW(0.4)} ${yLantai(2.4)}L${xW(-1.5)} ${yLantai(2.4)}Z`} fill={`url(#${id}-jl)`} />
    </g>
  );

  const dunia = (
    <g transform={T}>
      {luar}
      {ruang}
      {bayanganBenda}
      {bayanganTokoh}
      {/* catatan (di papan, sedang jatuh, di lantai dekat dinding) selalu di belakang tokoh */}
      {papan.map((q, i) => catatanNode(q, i))}
      {urutan.map((u, i) => (
        <React.Fragment key={i}>{u.node}</React.Fragment>
      ))}
      {cahayaNode}
    </g>
  );

  return (
    <g data-lokasi="kamar-naya-2d">
      <rect x="-200" y="-200" width="1480" height="2320" fill={plafon} />
      {kabur > 0 ? (
        <>
          <defs>
            <filter id={`${id}-kb`} filterUnits="userSpaceOnUse" x="-40" y="-40" width="1160" height="2000" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={kabur.toFixed(2)} />
            </filter>
          </defs>
          <g filter={`url(#${id}-kb)`}>{dunia}</g>
          <g transform={T}>{tajam.map((q) => badan(q))}</g>
        </>
      ) : (
        dunia
      )}
      <NadaAkhir c={c} id={id} />
    </g>
  );
}
