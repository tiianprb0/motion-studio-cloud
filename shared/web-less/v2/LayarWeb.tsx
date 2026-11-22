// Komponen bersama: tangkapan layar ASLI web Less. (less.benaya.id) di dalam bingkai HP atau kartu (v2, 17 Nov 2026).
// Dibuat untuk video perkenalan web (pengguna 17 Nov 2026: "sekalian bikin konten memperkenalkan web kita less.benaya.id").
// Aturan isi: references/web-less-untuk-konten.md. Gambarnya diambil dengan `node tools/web-less/tangkap.cjs --versi=v2`
// (daftar di README.md folder ini). Gaya gambar web 3D low-poly berbeda dari animasi Less., jadi pakai sebagai layar HP
// (insert penuh) atau kartu kecil; cerita tetap dibawakan tokoh. Jangan menempelkan angka/kiriman karangan di atas gambar.
//
// Gambar dimuat sebagai data URI (renderer membaca SVG sebagai gambar, jadi href luar tidak termuat): `gambarWeb(nama)`
// membaca `kecil/<nama>.jpg` (720×1280, untuk HP/kartu) atau `tangkapan/<nama>.jpg` (asli 1080×1920, layar penuh).
//
// <LayarHP nama cx cy w muncul zoom fx fy ketuk id />   HP tegak berisi tangkapan layar; zoom memperbesar di titik (fx, fy)
//   0..1 dari kiri-atas gambar; ketuk = { u, v, t } jari mengetuk di titik (u, v) layar, t 0..1 = gelombang ketukan.
//   muncul 0..1 = HP naik dari bawah + memudar masuk. data-box = badan HP (dicek audit safe zone).
// <KartuWeb nama x y w h fx fy zoom judul sub muncul id />  kartu bersudut bulat berisi potongan tangkapan layar + label.
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { P } from '../../core/v1/core';

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const cache = new Map<string, string>();
function akar(): string {
  let d = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(d, 'shared/catalog.json'))) return d;
    d = path.dirname(d);
  }
  throw new Error('LayarWeb: akar workspace (shared/catalog.json) tidak ditemukan dari ' + process.cwd());
}
/** data URI tangkapan layar web v2; ukuran 'kecil' = 720×1280, 'asli' = 1080×1920 */
export function gambarWeb(nama: string, ukuran: 'kecil' | 'asli' = 'kecil'): string {
  const k = ukuran + ':' + nama;
  const ada = cache.get(k);
  if (ada) return ada;
  const p = path.join(akar(), 'shared/web-less/v2', ukuran === 'kecil' ? 'kecil' : 'tangkapan', nama + '.jpg');
  const uri = 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  cache.set(k, uri);
  return uri;
}

/** gambar tangkapan layar di kotak (x, y, w, h) dengan zoom di titik (fx, fy); gambar 9:16 menutupi kotak */
function Isi({ nama, x, y, w, h, zoom = 1, fx = 0.5, fy = 0.5, ukuran = 'kecil' as 'kecil' | 'asli' }: { nama: string; x: number; y: number; w: number; h: number; zoom?: number; fx?: number; fy?: number; ukuran?: 'kecil' | 'asli' }) {
  // ukuran dasar: lebar penuh kotak (gambar 9:16); kalau kotak lebih "pendek" dari 9:16, gambar dipotong atas-bawah
  const gw0 = Math.max(w, (h * 9) / 16),
    gh0 = (gw0 * 16) / 9;
  const gw = gw0 * zoom,
    gh = gh0 * zoom;
  // titik (fx, fy) gambar diletakkan di posisi yang sama relatif terhadap kotak (zoom berporos di titik itu)
  const ix = x + fx * w - fx * gw,
    iy = y + fy * h - fy * gh;
  return <image href={gambarWeb(nama, ukuran)} x={ix.toFixed(1)} y={iy.toFixed(1)} width={gw.toFixed(1)} height={gh.toFixed(1)} preserveAspectRatio="xMidYMid slice" />;
}

/** tangkapan layar ASLI selebar layar video (B-roll singkat), zoom di titik (fx, fy) */
export const LayarPenuh = ({ nama, zoom = 1, fx = 0.5, fy = 0.5 }: { nama: string; zoom?: number; fx?: number; fy?: number }) => (
  <g data-fx="layar-penuh-web">
    <rect width="1080" height="1920" fill={P.paper} />
    <Isi nama={nama} x={0} y={0} w={1080} h={1920} zoom={zoom} fx={fx} fy={fy} ukuran="asli" />
  </g>
);
/** titik layar (px) dari titik gambar (u, v 0..1) pada LayarPenuh dengan zoom yang sama */
export const titikPenuh = (u: number, v: number, zoom = 1, fx = 0.5, fy = 0.5): [number, number] => [fx * 1080 + (u - fx) * 1080 * zoom, fy * 1920 + (v - fy) * 1920 * zoom];
/** titik layar (px) dari titik gambar (u, v) di dalam LayarHP (cx, cy, w, zoom, fx, fy sama) */
export const titikHP = (u: number, v: number, o: { cx?: number; cy?: number; w?: number; zoom?: number; fx?: number; fy?: number } = {}): [number, number] => {
  const { cx = 540, cy = 975, w = 540, zoom = 1, fx = 0.5, fy = 0.5 } = o;
  const sh = (w * 16) / 9,
    sx = cx - w / 2,
    sy = cy - sh / 2;
  return [sx + fx * w + (u - fx) * w * zoom, sy + fy * sh + (v - fy) * sh * zoom];
};

export function LayarHP({
  nama,
  cx = 540,
  cy = 975,
  w = 540,
  muncul = 1,
  zoom = 1,
  fx = 0.5,
  fy = 0.5,
  ketuk,
  rot = 0,
  id = 'hp',
}: {
  nama: string;
  cx?: number;
  cy?: number;
  w?: number;
  muncul?: number;
  zoom?: number;
  fx?: number;
  fy?: number;
  ketuk?: { u: number; v: number; t: number };
  rot?: number;
  id?: string;
}) {
  const m = klamp(muncul);
  if (m <= 0) return null;
  const sh = (w * 16) / 9,
    bz = 16;
  const W = w + 2 * bz,
    H = sh + 2 * bz;
  const x0 = cx - W / 2,
    y0 = cy - H / 2;
  const sx = x0 + bz,
    sy = y0 + bz;
  // masuk: naik sedikit (40 px) + membesar dari 0,94 berjangkar di tepi atas, tetap di dalam safe zone (checklist F3)
  const naik = (1 - m) * 40;
  const e = 1 - Math.pow(1 - m, 3);
  const sk = 0.94 + 0.06 * e;
  return (
    <g data-fx="layar-hp" data-box={`${Math.round(x0)},${Math.round(y0)},${Math.round(x0 + W)},${Math.round(y0 + H)}`} opacity={e.toFixed(3)} transform={`translate(0 ${naik.toFixed(1)}) rotate(${rot} ${cx} ${cy}) translate(${cx} ${y0}) scale(${sk.toFixed(4)}) translate(${-cx} ${-y0})`}>
      <defs>
        <clipPath id={`${id}-layar`}>
          <rect x={sx} y={sy} width={w} height={sh} rx="30" />
        </clipPath>
      </defs>
      <rect x={x0 + 10} y={y0 + 18} width={W} height={H} rx="52" fill="#000" opacity=".28" />
      <rect x={x0} y={y0} width={W} height={H} rx="52" fill="#1F2A26" />
      <rect x={x0 + 3} y={y0 + 3} width={W - 6} height={H - 6} rx="50" fill="none" stroke="#3A4A44" strokeWidth="3" />
      <g clipPath={`url(#${id}-layar)`}>
        <rect x={sx} y={sy} width={w} height={sh} fill={P.paper} />
        <Isi nama={nama} x={sx} y={sy} w={w} h={sh} zoom={zoom} fx={fx} fy={fy} />
        {ketuk && ketuk.t > 0 && ketuk.t < 1 && (
          <g data-fx="ketuk">
            <circle cx={sx + ketuk.u * w} cy={sy + ketuk.v * sh} r={18 + 46 * ketuk.t} fill="none" stroke="#fff" strokeWidth={6 * (1 - ketuk.t)} opacity={0.9 * (1 - ketuk.t)} />
            <circle cx={sx + ketuk.u * w} cy={sy + ketuk.v * sh} r="22" fill="#fff" opacity={0.55 * (1 - ketuk.t)} />
          </g>
        )}
      </g>
      {/* kamera depan */}
      <rect x={cx - 46} y={y0 + 26} width="92" height="22" rx="11" fill="#11181A" />
    </g>
  );
}

export function KartuWeb({
  nama,
  x,
  y,
  w,
  h,
  zoom = 1,
  fx = 0.5,
  fy = 0.5,
  judul,
  sub,
  warna = P.cream,
  muncul = 1,
  sorot = 0,
  id = 'kw',
}: {
  nama: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zoom?: number;
  fx?: number;
  fy?: number;
  judul?: string;
  sub?: string;
  warna?: string;
  muncul?: number;
  /** 0..1 bingkai emas menyala (tahap yang sedang aktif) */
  sorot?: number;
  id?: string;
}) {
  const m = klamp(muncul);
  if (m <= 0) return null;
  const sk = 0.85 + 0.15 * (1 - Math.pow(1 - m, 3));
  const lab = judul ? 84 : 0;
  const cx = x + w / 2,
    cy = y + (h + lab) / 2;
  return (
    <g data-fx="kartu-web" data-box={`${Math.round(x)},${Math.round(y)},${Math.round(x + w)},${Math.round(y + h + lab)}`} opacity={m.toFixed(3)} transform={`translate(${cx} ${cy}) scale(${sk.toFixed(4)}) translate(${-cx} ${-cy})`}>
      <defs>
        <clipPath id={`${id}-k`}>
          <rect x={x} y={y} width={w} height={h} rx="22" />
        </clipPath>
      </defs>
      <rect x={x + 7} y={y + 10} width={w} height={h + lab} rx="24" fill="#000" opacity=".22" />
      <rect x={x} y={y} width={w} height={h + lab} rx="24" fill={warna} />
      <g clipPath={`url(#${id}-k)`}>
        <Isi nama={nama} x={x} y={y} w={w} h={h} zoom={zoom} fx={fx} fy={fy} />
      </g>
      {sorot > 0 && <rect x={x - 5} y={y - 5} width={w + 10} height={h + lab + 10} rx="28" fill="none" stroke={P.gold} strokeWidth="8" opacity={klamp(sorot)} />}
      {judul && (
        <>
          <text x={x + 22} y={y + h + 40} fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.ink}>{judul}</text>
          {sub && <text x={x + 22} y={y + h + 72} fontFamily="Lato" fontWeight="700" fontSize="23" fill={P.wine}>{sub}</text>}
        </>
      )}
    </g>
  );
}
