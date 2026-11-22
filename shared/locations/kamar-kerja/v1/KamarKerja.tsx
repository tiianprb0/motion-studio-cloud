// Lokasi bersama: kamar kerja di rumah (v1, 10 Nov 2026; dibuat untuk "Tangan Kosong" v2). Dunia 3D dalam meter
// (shared/locations/_proyeksi/v1), dilihat dari kamera mana pun; geometri, jam dinding, dan benda di meja tetap sama.
//
// Ruang: X -2,3..2,3 (lebar 4,6 m), dinding belakang Z 4,6, plafon 2,85 m. Meja tulis menghadap kamera (Z 2,55–3,25,
// tinggi 0,75, panel depan menutup sampai lantai: tokoh duduk di belakangnya), kursi di Z 3,65. Jendela di dinding
// belakang (X 0,25–1,85, Y 0,95–2,25) dengan pemandangan atap kampung, tiang listrik, dan langit yang berubah dari sore ke
// malam. Detail: jam dinding (jarum mengikuti waktu), kalender, rak buku di dinding kiri, poster, kipas berdiri, pot,
// gorden, pintu + saklar di dinding kanan, ubin lantai berperspektif, karpet, lampu meja, mug, tumpukan buku.
//
// Waktu `t` 0..1: 0 = sore ±16.30 (cahaya jendela jatuh di lantai), 0,5 = senja, 1 = malam ±21.00 (lampu kota, bulan).
// `lampu` 0..1 = lampu meja (bawaan menyala setelah senja). Jam dinding = 16,5 + 4,5·t jam (atau prop `jam`).
// `meja`: keadaan benda di meja (daftar rapi/dicoret, kertas baru, ponsel di meja + layar menyala).
// Tokoh: `isi` = [{ X, Z, gambar }]; posisi duduk Yan DUDUK = { X: 0, Z: 3.35 } (pakai pose 'sit', seatDrop 20).
import React from 'react';
import { P } from '../../../core/v1/core';
import { kamera, type Kam, type Isi, type Titik, type K, type V3, Path, Bidang, Balok, NEAR } from '../../_proyeksi/v1/Proyeksi';
import { Plant } from '../../_detail/v1/Detail';
import { Mug } from '../../../props/minum/v1/Minum';

export const KAMAR = { x0: -2.3, x1: 2.3, zBelakang: 4.6, plafon: 2.85, mejaTop: 0.75, meja: { x0: -0.95, x1: 0.95, z0: 2.55, z1: 3.25 } };
export const DUDUK = { X: 0, Z: 3.35 };
export const JENDELA = { x0: 0.25, x1: 1.85, y0: 0.95, y1: 2.25 };
export type Meja = { daftar?: 'rapi' | 'centang' | 'coret'; kertasBaru?: boolean; hp?: boolean; hpNyala?: number; pena?: boolean };

const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16),
    pb = parseInt(b.slice(1), 16);
  const c = (sh: number) => Math.round(((pa >> sh) & 255) + (((pb >> sh) & 255) - ((pa >> sh) & 255)) * t);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};
const tri = (stops: [string, string, string], t: number) => (t < 0.5 ? mix(stops[0], stops[1], t * 2) : mix(stops[1], stops[2], (t - 0.5) * 2));
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// ------------------------------------------------------------------ pemandangan luar jendela (bidang Z 9–30)
function Luar({ K, t, f }: { K: K; t: number; f: number }) {
  const langit = tri(['#F4B98A', '#B48AA6', '#1E2A3C'], t);
  const cakrawala = tri(['#FCE0B0', '#F0A98A', '#34425A'], t);
  const atap = tri(['#9C6A55', '#6E4E5C', '#1B2230'], t);
  const dinding = tri(['#D8B79A', '#9E8090', '#2A3242'], t);
  const malam = Math.max(0, (t - 0.55) / 0.45);
  const Z = 30;
  const rumah: [number, number, number, number][] = [[-9, -4.4, 4.0, 24], [-4.6, -0.4, 5.4, 26], [-0.6, 3.2, 4.2, 23], [3.0, 7.6, 6.0, 27], [7.4, 12, 4.6, 24], [-14, -8.6, 4.8, 25]];
  return (
    <g data-detail="luar-jendela">
      <Path d={K.poly([[-60, -10, Z], [60, -10, Z], [60, 40, Z], [-60, 40, Z]])} fill={langit} />
      <Path d={K.poly([[-60, -10, Z], [60, -10, Z], [60, 5, Z], [-60, 5, Z]])} fill={cakrawala} opacity=".8" />
      {/* matahari sore / bulan malam */}
      {(() => {
        const p = K.titik(t < 0.5 ? 6 : -3, t < 0.5 ? 6 - 6 * t : 16, Z - 1);
        if (p.z < NEAR) return null;
        const r = 1.6 * p.s * 200;
        return t < 0.5 ? <circle cx={p.x} cy={p.y} r={r} fill="#FFE2A0" opacity={0.9 - t} /> : <g opacity={malam}><circle cx={p.x} cy={p.y} r={r * 0.7} fill="#F6EED8" /><circle cx={p.x + r * 0.25} cy={p.y - r * 0.12} r={r * 0.6} fill={langit} /></g>;
      })()}
      {malam > 0 &&
        Array.from({ length: 24 }, (_, i) => {
          const p = K.titik(-20 + acak(i) * 40, 8 + acak(i + 7) * 14, Z - 0.5);
          return p.z > NEAR ? <circle key={i} cx={p.x} cy={p.y} r={1.6 + acak(i + 3) * 1.6} fill="#FFF9EF" opacity={malam * (0.4 + 0.4 * Math.sin(f * 0.08 + i))} /> : null;
        })}
      {/* burung sore */}
      {t < 0.45 && [0, 1, 2].map((i) => {
        const p = K.titik(-2 + i * 0.9 + (f * 0.004) % 6, 7 + (i % 2) * 0.6, 16);
        return p.z > NEAR ? <path key={'b' + i} d={`M${p.x - 8} ${p.y}q8 -6 8 0q0 -6 8 0`} stroke="#5A4440" strokeWidth="2" fill="none" opacity={1 - t * 2} /> : null;
      })}
      {/* deret atap kampung */}
      {rumah.map(([x0, x1, hgt, z], i) => (
        <g key={i}>
          <Path d={K.poly([[x0, -6, z], [x1, -6, z], [x1, hgt - 1.6, z], [x0, hgt - 1.6, z]])} fill={dinding} />
          <Path d={K.poly([[x0 - 0.4, hgt - 1.6, z], [x1 + 0.4, hgt - 1.6, z], [(x0 + x1) / 2, hgt, z]])} fill={atap} />
          {[0.25, 0.65].map((k) => {
            const nyala = malam > 0 && acak(i * 5 + k * 10) > 0.35;
            return <Path key={k} d={K.poly([[x0 + (x1 - x0) * k, hgt - 3.6, z - 0.01], [x0 + (x1 - x0) * k + 0.7, hgt - 3.6, z - 0.01], [x0 + (x1 - x0) * k + 0.7, hgt - 2.6, z - 0.01], [x0 + (x1 - x0) * k, hgt - 2.6, z - 0.01]])} fill={nyala ? '#F6CF7A' : atap} opacity={nyala ? 0.6 + 0.4 * malam : 0.7} />;
          })}
        </g>
      ))}
      {/* tembok halaman */}
      <Path d={K.poly([[-14, -3, 7], [14, -3, 7], [14, 1.05, 7], [-14, 1.05, 7]])} fill={tri(['#CDB79A', '#8E7E8A', '#262C38'], t)} />
      <Path d={K.poly([[-14, 1.05, 7], [14, 1.05, 7], [14, 1.16, 6.9], [-14, 1.16, 6.9]])} fill={tri(['#B49E82', '#7A6C78', '#1E2430'], t)} />
      {/* pohon + tiang listrik */}
      {(() => {
        const p = K.titik(-4.2, 0, 11);
        if (p.z < NEAR) return null;
        const m = p.s * 200;
        return (
          <g>
            <circle cx={p.x} cy={p.y - 5.4 * m} r={2.2 * m} fill={tri(['#6F8F6A', '#4F5E5A', '#1A2420'], t)} />
            <circle cx={p.x - 1.4 * m} cy={p.y - 4.6 * m} r={1.6 * m} fill={tri(['#7D9C74', '#566660', '#1C2622'], t)} />
          </g>
        );
      })()}
      <Path d={K.garis([[-2.4, 1.5, 14], [-2.4, 8, 14]])} stroke={tri(['#6B5B54', '#4A4048', '#141A24'], t)} strokeWidth={4} />
      <Path d={K.garis([[-12, 7.4, 14], [-2.4, 7.6, 14], [6, 7.2, 16], [14, 7.5, 16]])} stroke={tri(['#5A4C48', '#40363E', '#141A24'], t)} strokeWidth={1.4} fill="none" />
    </g>
  );
}

// ------------------------------------------------------------------ dinding, lantai, plafon
function Ruang({ K, t, f }: { K: K; t: number; f: number }) {
  const { x0, x1, zBelakang: zb, plafon } = KAMAR;
  const zA = -2;
  const J = JENDELA;
  const cat = tri(['#E9D8BF', '#C9B4B4', '#55607A'], t);
  const catSisi = tri(['#DCC8AC', '#B9A4A8', '#4A546C'], t);
  const lantaiA = tri(['#C9B293', '#A9948E', '#485064'], t),
    lantaiB = tri(['#BFA787', '#9E8A84', '#41485A'], t);
  // dinding belakang berlubang jendela (evenodd)
  const luarD = K.poly([[x0, 0, zb], [x1, 0, zb], [x1, plafon, zb], [x0, plafon, zb]]);
  const lubang = K.poly([[J.x0, J.y0, zb], [J.x1, J.y0, zb], [J.x1, J.y1, zb], [J.x0, J.y1, zb]]);
  const ubin: React.ReactNode[] = [];
  for (let ix = 0; ix < 12; ix++)
    for (let iz = 0; iz < 17; iz++) {
      if ((ix + iz) % 2) continue;
      const xa = x0 + ix * 0.4,
        za = zA + iz * 0.4;
      ubin.push(<Path key={ix + '-' + iz} d={K.poly([[xa, 0, za], [xa + 0.4, 0, za], [xa + 0.4, 0, za + 0.4], [xa, 0, za + 0.4]])} fill={lantaiB} />);
    }
  return (
    <g data-detail="ruang">
      {/* pemandangan luar dulu; semua bidang ruang menutupinya kecuali lubang jendela */}
      <Luar K={K} t={t} f={f} />
      {/* lantai ubin */}
      <Path d={K.poly([[x0, 0, zA], [x1, 0, zA], [x1, 0, zb], [x0, 0, zb]])} fill={lantaiA} />
      {ubin}
      {/* berkas cahaya sore dari jendela di lantai */}
      {t < 0.45 && (() => {
        const pat = K.poly([[J.x0 - 0.6, 0.003, 3.0], [J.x1 - 0.6, 0.003, 3.0], [J.x1 - 0.2, 0.003, 4.6], [J.x0 - 0.2, 0.003, 4.6]]);
        return pat ? <path d={pat} fill="#FFD9A0" opacity={0.35 * Math.max(0, 1 - t * 2.2)} /> : null;
      })()}
      {/* karpet */}
      <Path d={K.poly([[-1.3, 0.003, 2.3], [1.3, 0.003, 2.3], [1.3, 0.003, 4.2], [-1.3, 0.003, 4.2]])} fill={tri(['#C98F84', '#A87C7C', '#5A4448'], t)} opacity=".85" />
      <Path d={K.poly([[-1.2, 0.004, 2.4], [1.2, 0.004, 2.4], [1.2, 0.004, 4.1], [-1.2, 0.004, 4.1]])} fill="none" stroke={tri(['#E8D7B8', '#CDB9A8', '#6E5E5E'], t)} strokeWidth={3} />
      {/* plafon */}
      <Path d={K.poly([[x0, plafon, zA], [x1, plafon, zA], [x1, plafon, zb], [x0, plafon, zb]])} fill={tri(['#F1E6D3', '#CFC2C2', '#4A5268'], t)} />
      {/* lampu neon plafon (mati; malam memakai lampu meja) */}
      <Path d={K.poly([[-0.6, plafon - 0.01, 1.9], [0.6, plafon - 0.01, 1.9], [0.6, plafon - 0.01, 2.02], [-0.6, plafon - 0.01, 2.02]])} fill="#F7F3EA" />
      <Path d={K.poly([[-0.65, plafon - 0.03, 1.88], [0.65, plafon - 0.03, 1.88], [0.65, plafon - 0.01, 1.88], [-0.65, plafon - 0.01, 1.88]])} fill="#C9C2B4" />
      {/* dinding kiri dan kanan */}
      <Path d={K.poly([[x0, 0, zA], [x0, 0, zb], [x0, plafon, zb], [x0, plafon, zA]])} fill={catSisi} />
      <Path d={K.poly([[x1, 0, zA], [x1, 0, zb], [x1, plafon, zb], [x1, plafon, zA]])} fill={catSisi} />
      {/* plint */}
      <Path d={K.poly([[x0 + 0.001, 0, zA], [x0 + 0.001, 0, zb], [x0 + 0.001, 0.1, zb], [x0 + 0.001, 0.1, zA]])} fill={tri(['#A9876A', '#8E7468', '#4E4A4E'], t)} />
      <Path d={K.poly([[x1 - 0.001, 0, zA], [x1 - 0.001, 0, zb], [x1 - 0.001, 0.1, zb], [x1 - 0.001, 0.1, zA]])} fill={tri(['#A9876A', '#8E7468', '#4E4A4E'], t)} />
      {/* dinding belakang berlubang jendela */}
      {luarD && lubang && <path d={luarD + lubang} fillRule="evenodd" fill={cat} />}
      <Path d={K.poly([[x0, 0, zb - 0.001], [x1, 0, zb - 0.001], [x1, 0.1, zb - 0.001], [x0, 0.1, zb - 0.001]])} fill={tri(['#A9876A', '#8E7468', '#4E4A4E'], t)} />
      {/* kusen jendela + teralis */}
      {(() => {
        const z = zb - 0.01;
        const kayu = tri(['#F5EFE3', '#E3D8D0', '#9C979A'], t);
        const w = 0.07;
        return (
          <g data-detail="jendela">
            <Path d={K.poly([[J.x0 - w, J.y0 - w, z], [J.x1 + w, J.y0 - w, z], [J.x1 + w, J.y0, z], [J.x0 - w, J.y0, z]])} fill={kayu} />
            <Path d={K.poly([[J.x0 - w, J.y1, z], [J.x1 + w, J.y1, z], [J.x1 + w, J.y1 + w, z], [J.x0 - w, J.y1 + w, z]])} fill={kayu} />
            <Path d={K.poly([[J.x0 - w, J.y0, z], [J.x0, J.y0, z], [J.x0, J.y1, z], [J.x0 - w, J.y1, z]])} fill={kayu} />
            <Path d={K.poly([[J.x1, J.y0, z], [J.x1 + w, J.y0, z], [J.x1 + w, J.y1, z], [J.x1, J.y1, z]])} fill={kayu} />
            <Path d={K.poly([[(J.x0 + J.x1) / 2 - 0.025, J.y0, z], [(J.x0 + J.x1) / 2 + 0.025, J.y0, z], [(J.x0 + J.x1) / 2 + 0.025, J.y1, z], [(J.x0 + J.x1) / 2 - 0.025, J.y1, z]])} fill={kayu} />
            <Path d={K.poly([[J.x0, J.y1 - 0.35, z], [J.x1, J.y1 - 0.35, z], [J.x1, J.y1 - 0.31, z], [J.x0, J.y1 - 0.31, z]])} fill={kayu} />
            {Array.from({ length: 7 }, (_, i) => <Path key={i} d={K.garis([[J.x0 + 0.2 * (i + 1), J.y0, z - 0.01], [J.x0 + 0.2 * (i + 1), J.y1 - 0.35, z - 0.01]])} stroke={tri(['#5E5650', '#4A4448', '#2A2C34'], t)} strokeWidth={1.4} opacity=".7" />)}
            {/* ambang + pantulan kaca */}
            <Path d={K.poly([[J.x0 - 0.12, J.y0 - 0.05, z - 0.12], [J.x1 + 0.12, J.y0 - 0.05, z - 0.12], [J.x1 + 0.12, J.y0 - 0.05, z], [J.x0 - 0.12, J.y0 - 0.05, z]])} fill={kayu} />
            <Path d={K.poly([[J.x0 + 0.1, J.y0, z - 0.005], [J.x0 + 0.35, J.y0, z - 0.005], [J.x0 + 0.75, J.y1 - 0.35, z - 0.005], [J.x0 + 0.5, J.y1 - 0.35, z - 0.005]])} fill="#fff" opacity={0.12 - 0.06 * t} />
          </g>
        );
      })()}
      {/* gorden kiri-kanan jendela */}
      {[[J.x0 - 0.42, J.x0 - 0.02], [J.x1 + 0.02, J.x1 + 0.42]].map(([a, b], i) => (
        <g key={'g' + i}>
          <Path d={K.poly([[a, 0.7, zb - 0.06], [b, 0.7, zb - 0.06], [b, J.y1 + 0.3, zb - 0.06], [a, J.y1 + 0.3, zb - 0.06]])} fill={tri(['#9CC7B4', '#7FA49C', '#3E5452'], t)} />
          {[0.2, 0.45, 0.7].map((k) => <Path key={k} d={K.garis([[a + (b - a) * k, 0.72, zb - 0.07], [a + (b - a) * k, J.y1 + 0.28, zb - 0.07]])} stroke="#000" strokeWidth={2} opacity=".12" />)}
        </g>
      ))}
      <Path d={K.garis([[J.x0 - 0.5, J.y1 + 0.32, zb - 0.08], [J.x1 + 0.5, J.y1 + 0.32, zb - 0.08]])} stroke={tri(['#8B6648', '#6E5650', '#2E2A2E'], t)} strokeWidth={4} />
    </g>
  );
}

// ------------------------------------------------------------------ hiasan dinding (di bidang dinding, setelah dinding)
function Dinding({ K, t, jam }: { K: K; t: number; jam: number }) {
  const zb = KAMAR.zBelakang - 0.01;
  const x0 = KAMAR.x0 + 0.01;
  const j = K.titik(-1.25, 2.2, zb);
  const jr = j.z > NEAR ? 0.22 * j.s * 200 : 0;
  const hJam = ((jam % 12) / 12) * 360,
    mJam = ((jam % 1) * 60 / 60) * 360;
  return (
    <g data-detail="hiasan-dinding">
      {/* jam dinding */}
      {jr > 0 && (
        <g data-detail="jam-dinding">
          <circle cx={j.x} cy={j.y} r={jr * 1.08} fill="#8B6648" />
          <circle cx={j.x} cy={j.y} r={jr} fill={P.cream} />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${j.x} ${j.y - jr * 0.86}v${jr * 0.12}`} stroke={P.ink} strokeWidth={Math.max(1, jr * (i % 3 ? 0.03 : 0.06))} transform={`rotate(${i * 30} ${j.x} ${j.y})`} />)}
          <path d={`M${j.x} ${j.y}v${-jr * 0.5}`} stroke={P.ink} strokeWidth={jr * 0.08} strokeLinecap="round" transform={`rotate(${hJam} ${j.x} ${j.y})`} />
          <path d={`M${j.x} ${j.y}v${-jr * 0.78}`} stroke={P.ink} strokeWidth={jr * 0.05} strokeLinecap="round" transform={`rotate(${mJam} ${j.x} ${j.y})`} />
          <circle cx={j.x} cy={j.y} r={jr * 0.06} fill={P.wine} />
        </g>
      )}
      {/* kalender */}
      <Path d={K.poly([[-0.85, 1.25, zb], [-0.45, 1.25, zb], [-0.45, 1.75, zb], [-0.85, 1.75, zb]])} fill="#FFF9EF" />
      <Path d={K.poly([[-0.85, 1.62, zb - 0.001], [-0.45, 1.62, zb - 0.001], [-0.45, 1.75, zb - 0.001], [-0.85, 1.75, zb - 0.001]])} fill={P.wine} />
      {Array.from({ length: 12 }, (_, i) => <Path key={i} d={K.poly([[-0.82 + (i % 4) * 0.09, 1.3 + Math.floor(i / 4) * 0.1, zb - 0.002], [-0.76 + (i % 4) * 0.09, 1.3 + Math.floor(i / 4) * 0.1, zb - 0.002], [-0.76 + (i % 4) * 0.09, 1.36 + Math.floor(i / 4) * 0.1, zb - 0.002], [-0.82 + (i % 4) * 0.09, 1.36 + Math.floor(i / 4) * 0.1, zb - 0.002]])} fill="#D8CFC0" />)}
      {/* poster dinding belakang kiri */}
      <Path d={K.poly([[-2.0, 1.3, zb], [-1.55, 1.3, zb], [-1.55, 1.9, zb], [-2.0, 1.9, zb]])} fill="#7E8FB0" />
      <Path d={K.poly([[-1.95, 1.36, zb - 0.001], [-1.6, 1.36, zb - 0.001], [-1.6, 1.62, zb - 0.001], [-1.95, 1.62, zb - 0.001]])} fill="#F1C977" opacity=".8" />
      {/* rak buku di dinding kiri */}
      {[1.35, 1.75].map((y, i) => (
        <g key={'r' + i}>
          <Path d={K.poly([[x0, y, 1.6], [x0, y, 2.9], [x0 + 0.28, y, 2.9], [x0 + 0.28, y, 1.6]])} fill="#8B6648" />
          {Array.from({ length: 9 }, (_, k) => (
            <Path key={k} d={K.poly([[x0 + 0.02, y, 1.65 + k * 0.13], [x0 + 0.02, y, 1.75 + k * 0.13], [x0 + 0.02, y + 0.22 + (k % 3) * 0.04, 1.75 + k * 0.13], [x0 + 0.02, y + 0.22 + (k % 3) * 0.04, 1.65 + k * 0.13]])} fill={['#8B4354', '#3E7F6A', '#D1A258', '#7E8FB0', '#C98F84'][(k + i * 2) % 5]} />
          ))}
        </g>
      ))}
      {/* pintu + saklar di dinding kanan */}
      {(() => {
        const x = KAMAR.x1 - 0.01;
        return (
          <g data-detail="pintu">
            <Path d={K.poly([[x, 0, 0.6], [x, 0, 1.55], [x, 2.1, 1.55], [x, 2.1, 0.6]])} fill={tri(['#A57B57', '#8C6A5A', '#4A3E3C'], t)} />
            <Path d={K.poly([[x - 0.002, 0.15, 0.7], [x - 0.002, 0.15, 1.45], [x - 0.002, 1.0, 1.45], [x - 0.002, 1.0, 0.7]])} fill="#000" opacity=".08" />
            <Path d={K.poly([[x - 0.002, 1.15, 0.7], [x - 0.002, 1.15, 1.45], [x - 0.002, 1.95, 1.45], [x - 0.002, 1.95, 0.7]])} fill="#000" opacity=".08" />
            {(() => {
              const p = K.titik(x - 0.01, 1.0, 1.45);
              return p.z > NEAR ? <circle cx={p.x} cy={p.y} r={p.s * 200 * 0.035} fill={P.gold} /> : null;
            })()}
            <Path d={K.poly([[x, 1.2, 1.75], [x, 1.2, 1.85], [x, 1.32, 1.85], [x, 1.32, 1.75]])} fill="#F7F3EA" />
          </g>
        );
      })()}
    </g>
  );
}

// ------------------------------------------------------------------ benda berdiri (diurutkan kedalamannya)
type Obj = { z: number; node: React.ReactNode };
function Meja({ K, t, meja, lampu, f }: { K: K; t: number; meja: Meja; lampu: number; f: number }) {
  const { x0, x1, z0, z1 } = KAMAR.meja;
  const top = KAMAR.mejaTop;
  const kayu = tri(['#B88A62', '#9E7A66', '#5A4A44'], t),
    kayuGelap = tri(['#94694A', '#7E5E52', '#463A36'], t),
    atas = tri(['#C99C72', '#B08A74', '#6A5850'], t);
  const kertas = (xa: number, xb: number, za: number, zb: number, warna: string, garis: number, coret = false, key = 'k') => (
    <g key={key}>
      <Path d={K.poly([[xa, top + 0.003, za], [xb, top + 0.003, za], [xb, top + 0.003, zb], [xa, top + 0.003, zb]])} fill={warna} />
      {Array.from({ length: garis }, (_, i) => {
        const z = za + 0.05 + i * ((zb - za - 0.08) / garis);
        return (
          <g key={i}>
            <Path d={K.garis([[xa + 0.04, top + 0.004, z], [xa + 0.04 + (xb - xa) * (0.5 + 0.2 * (i % 2)), top + 0.004, z]])} stroke={P.ink} strokeWidth={1.4} opacity=".35" />
            {coret && i < 2 && <Path d={K.garis([[xa + 0.03, top + 0.005, z], [xa + 0.03 + (xb - xa) * 0.75, top + 0.005, z]])} stroke={P.wine} strokeWidth={2.2} />}
          </g>
        );
      })}
    </g>
  );
  const lampuP = K.titik(0.72, top, 3.08);
  const mugP = K.titik(-0.68, top, 2.85);
  const hpNyala = meja.hpNyala ?? 0;
  return (
    <g data-detail="meja">
      {/* bayangan meja di lantai */}
      <Path d={K.poly([[x0 - 0.05, 0.002, z0 + 0.05], [x1 + 0.08, 0.002, z0 + 0.05], [x1 + 0.08, 0.002, z1 + 0.1], [x0 - 0.05, 0.002, z1 + 0.1]])} fill="#000" opacity=".1" />
      <Balok K={K} x0={x0} x1={x1} y0={0} y1={top - 0.04} z0={z0 + 0.02} z1={z1} warna={kayu} sisi={kayuGelap} depan={kayu} />
      <Balok K={K} x0={x0 - 0.03} x1={x1 + 0.03} y0={top - 0.04} y1={top} z0={z0} z1={z1 + 0.02} warna={kayuGelap} atas={atas} depan={kayuGelap} />
      {/* laci + pegangan di panel depan */}
      {K.k.z < z0 && [-0.55, 0.55].map((cx) => (
        <g key={cx}>
          <Path d={K.poly([[cx - 0.3, 0.42, z0 + 0.019], [cx + 0.3, 0.42, z0 + 0.019], [cx + 0.3, 0.66, z0 + 0.019], [cx - 0.3, 0.66, z0 + 0.019]])} fill={kayuGelap} opacity=".55" />
          <Path d={K.garis([[cx - 0.08, 0.55, z0 + 0.017], [cx + 0.08, 0.55, z0 + 0.017]])} stroke={P.gold} strokeWidth={3} />
        </g>
      ))}
      {/* benda di atas meja */}
      {kertas(-0.48, -0.06, 2.68, 3.02, '#FFFDF7', 5, meja.daftar === 'coret', 'daftar')}
      {meja.kertasBaru && kertas(0.0, 0.4, 2.64, 2.98, '#F6F1DF', 4, false, 'baru')}
      {meja.pena !== false && <Path d={K.garis([[-0.02, top + 0.01, 2.75], [0.12, top + 0.01, 2.95]])} stroke={P.wine} strokeWidth={3} strokeLinecap="round" />}
      {meja.hp && (
        <g data-detail="ponsel-meja">
          <Path d={K.poly([[0.42, top + 0.006, 2.72], [0.52, top + 0.006, 2.72], [0.52, top + 0.006, 2.92], [0.42, top + 0.006, 2.92]])} fill="#2D3532" />
          <Path d={K.poly([[0.43, top + 0.008, 2.73], [0.51, top + 0.008, 2.73], [0.51, top + 0.008, 2.91], [0.43, top + 0.008, 2.91]])} fill={hpNyala > 0 ? '#CFE6F0' : '#3B4542'} opacity={0.4 + 0.6 * hpNyala} />
          {hpNyala > 0 && (() => {
            const p = K.titik(0.47, top + 0.01, 2.82);
            return p.z > NEAR ? <circle cx={p.x} cy={p.y} r={p.s * 200 * 0.22} fill="#CFE6F0" opacity={0.25 * hpNyala * (0.8 + 0.2 * Math.sin(f * 0.3))} /> : null;
          })()}
        </g>
      )}
      {/* tumpukan buku */}
      <Balok K={K} x0={-0.9} x1={-0.62} y0={top} y1={top + 0.12} z0={3.0} z1={3.2} warna="#3E7F6A" atas="#F1EEE4" />
      <Balok K={K} x0={-0.88} x1={-0.64} y0={top + 0.12} y1={top + 0.2} z0={3.02} z1={3.18} warna={P.wine} atas="#F1EEE4" />
      {/* mug */}
      {mugP.z > NEAR && <g transform={`translate(${mugP.x} ${mugP.y})`}><Mug s={mugP.s * 0.55} f={f} hangat={0.6} /></g>}
      {/* lampu meja */}
      {lampuP.z > NEAR && (
        <g data-detail="lampu-meja" transform={`translate(${lampuP.x} ${lampuP.y}) scale(${lampuP.s})`}>
          <ellipse cx="0" cy="0" rx="34" ry="8" fill="#3B3F3D" />
          <path d="M-2 0l-14 -110l46 -40" stroke="#3B3F3D" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M18 -166l50 22l-16 34l-48 -24Z" fill={tri(['#3E7F6A', '#3E7F6A', '#2E5A4E'], t)} />
          {lampu > 0 && <ellipse cx="44" cy="-112" rx="22" ry="8" fill="#FFE7AE" opacity={lampu} transform="rotate(26 44 -112)" />}
        </g>
      )}
    </g>
  );
}

function Kursi({ K, t }: { K: K; t: number }) {
  const w = tri(['#7A5644', '#664C44', '#3A302E'], t);
  return (
    <g data-detail="kursi">
      <Balok K={K} x0={-0.26} x1={0.26} y0={0.44} y1={1.18} z0={3.66} z1={3.72} warna={w} />
      <Path d={K.garis([[-0.23, 0, 3.7], [-0.23, 0.44, 3.7]])} stroke={w} strokeWidth={5} />
      <Path d={K.garis([[0.23, 0, 3.7], [0.23, 0.44, 3.7]])} stroke={w} strokeWidth={5} />
    </g>
  );
}

function Kipas({ K, t, f }: { K: K; t: number; f: number }) {
  const p = K.titik(-1.85, 0, 4.0);
  if (p.z < NEAR) return null;
  const m = p.s * 200;
  const a = (f * 22) % 360;
  return (
    <g data-detail="kipas" transform={`translate(${p.x} ${p.y})`}>
      <ellipse cx="0" cy="0" rx={0.22 * m} ry={0.05 * m} fill="#59615E" />
      <path d={`M0 0V${-1.05 * m}`} stroke="#8E9692" strokeWidth={0.04 * m} />
      <circle cx="0" cy={-1.25 * m} r={0.24 * m} fill="#DCE6E2" stroke="#8E9692" strokeWidth={0.02 * m} />
      {[0, 120, 240].map((r) => <ellipse key={r} cx="0" cy={-1.25 * m - 0.11 * m} rx={0.05 * m} ry={0.11 * m} fill={tri(['#95B8A2', '#86A096', '#4E5A58'], t)} opacity=".8" transform={`rotate(${r + a} 0 ${-1.25 * m})`} />)}
      <circle cx="0" cy={-1.25 * m} r={0.04 * m} fill="#59615E" />
    </g>
  );
}

// ------------------------------------------------------------------ cahaya
function Cahaya({ K, t, lampu }: { K: K; t: number; lampu: number }) {
  const J = JENDELA;
  const sore = Math.max(0, 1 - t * 2.2);
  const malam = Math.max(0, (t - 0.35) / 0.65);
  const lp = K.titik(0.6, KAMAR.mejaTop + 0.25, 2.95);
  void J;
  return (
    <g data-detail="cahaya" pointerEvents="none">
      <rect x="-600" y="-600" width="2300" height="3200" fill="#F2A65A" opacity={0.08 * sore} />
      <rect x="-600" y="-600" width="2300" height="3200" fill="#141C2A" opacity={0.08 * malam} />
      {lampu > 0 && lp.z > NEAR && (
        <g>
          <defs>
            <radialGradient id={`kk-lampu-${Math.round(lp.x)}-${Math.round(lp.y)}`} cx={lp.x} cy={lp.y} r={Math.max(160, lp.s * 200 * 1.5)} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFD68A" stopOpacity={0.5 * lampu} />
              <stop offset="0.45" stopColor="#FFC873" stopOpacity={0.18 * lampu} />
              <stop offset="1" stopColor="#FFC873" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="-600" y="-600" width="2300" height="3200" fill={`url(#kk-lampu-${Math.round(lp.x)}-${Math.round(lp.y)})`} />
        </g>
      )}
    </g>
  );
}

// ------------------------------------------------------------------ adegan
export function KamarKerja({ f, kam, t = 0, lampu, jam, meja = {}, isi = [] }: { f: number; kam: Kam; t?: number; lampu?: number; jam?: number; meja?: Meja; isi?: Isi[] }) {
  const K = kamera(kam);
  const L = lampu ?? Math.min(1, Math.max(0, (t - 0.4) / 0.1));
  const J = jam ?? 16.5 + 4.5 * t;
  const objek: Obj[] = [];
  const zOf = (X: number, Z: number) => K.cam(X, 0, Z)[2];
  objek.push({ z: zOf(0, 2.9) - 0.4, node: <Meja key="meja" K={K} t={t} meja={meja} lampu={L} f={f} /> });
  objek.push({ z: zOf(0, 3.69), node: <Kursi key="kursi" K={K} t={t} /> });
  objek.push({ z: zOf(-1.85, 4.0), node: <Kipas key="kipas" K={K} t={t} f={f} /> });
  const pot = K.titik(2.0, 0, 4.25);
  if (pot.z > NEAR) objek.push({ z: pot.z, node: <Plant key="pot" x={pot.x} y={pot.y} s={pot.s * 1.3} kind={2} pot="#C9805A" /> });
  // karpet di bawah meja-kursi
  for (const it of isi) {
    const p = K.titik(it.X, 0, it.Z);
    if (p.z > NEAR) objek.push({ z: p.z + (it.dalam ?? 0), node: <g key={'isi' + it.X + '-' + it.Z}>{it.gambar(p)}</g> });
  }
  objek.sort((a, b) => b.z - a.z);
  return (
    <g data-set="kamar-kerja">
      <rect x="-600" y="-600" width="2300" height="3200" fill="#2A2C34" />
      <Ruang K={K} t={t} f={f} />
      <Dinding K={K} t={t} jam={J} />
      {objek.map((o) => o.node)}
      <Cahaya K={K} t={t} lampu={L} />
    </g>
  );
}
export type { Kam, Isi, Titik, V3 };
