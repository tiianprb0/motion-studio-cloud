// Lokasi bersama: jalan di kota pesisir Biak (Papua) saat kabut asap, PANGGUNG FLAT 2D dari depan (v1, 18 Nov 2026).
// Dibuat untuk "Kebakaran Hutan Papua" v1 (pengguna 18 Nov 2026: "buat kan konten soal kebakaran hutan di papua ...").
// Fakta acuan: Mongabay 3 Sep 2026, asap mengepung kota Biak, sekolah libur, warga membagikan masker karena persediaan
// terbatas; Kemenhub (Okt 2026) penerbangan di Papua terganggu. Nama sekolah sengaja umum ("SEKOLAH DASAR"), tidak
// meniru sekolah nyata.
// Isi (kiri → kanan, dinding 227 px/m, kaki bangunan y 1180, cakrawala y 885 = mata 1,3 m): gedung SD satu lantai (atap
// seng merah, jendela nako, tiang bendera merah putih di halaman), pagar + gerbang terkunci rantai dengan kertas
// pengumuman, pohon ketapang; rumah panggung kayu beratap seng + pohon kelapa; di kejauhan bukit dan laut. Depan: trotoar
// + jalan aspal. Meja kecil pembagian masker (`mejaMasker`). Langit: pesawat berputar tak bisa mendarat (`pesawat` 0..1).
// `asap` 0..1 = kabut asap (benda jauh memudar, matahari jingga).
// Pakai: <KotaBiak2D f kam asap pesawat mejaMasker isi id />   titikKota(x, y) → { x, y, s } untuk tokoh (kaki di jalan/trotoar)
import React from 'react';
import { P } from '../../../core/v1/core';
import { WallGrain, Plane } from '../../_detail/v1/Detail';
import { Terang, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, NadaAkhir, type Cahaya2D } from '../../../film/v1/Cahaya2D';
import { KabutAsap, MatahariKabur } from '../../../props/api/v1/Api';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type IsiKota = { x: number; y: number; s?: number; gambar: (p: Titik2D) => React.ReactNode; tinggi?: number; lebar?: number; polos?: boolean };

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const campur = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b),
    u = klamp(t);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join('');
};
export const KOTA_BIAK = { kakiDinding: 1180, pxM: 227, cakrawala: 885, mata: 1.3, trotoar: 1236, jalan: 1290 };
const K = KOTA_BIAK;
export const skalaKota = (y: number) => Math.max(0.2, (y - K.cakrawala) / (K.mata * 200));
export const titikKota = (x: number, y: number): Titik2D => ({ x, y, s: skalaKota(y) });
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
/** gerbang sekolah (tengah) dan kertas pengumuman di gerbang (koordinat dunia) */
export const GERBANG = { x: 380, y: 1236, kertas: { x: 380, y: 1060 } };
/** meja pembagian masker di trotoar (kaki meja) */
export const MEJA_MASKER = { x: 860, y: 1300 };

export function cahayaKota(asap: number): Cahaya2D {
  return {
    matahari: { az: -40, el: 46 - 10 * asap, warna: campur('#FFF0D2', '#FFBE86', asap) },
    suasana: { bayangan: '#4D3E44', ambient: 0.72 + 0.1 * asap, diffuse: 0.6 - 0.35 * asap, lantai: 0.32, nada: { warna: '#E39A55', kuat: 0.04 + 0.15 * asap } },
  };
}

export function KotaBiak2D({ f = 0, kam = { zoom: 1, cx: 540, cy: 960 }, asap = 0.7, pesawat = 0.5, mejaMasker = true, isi = [], id = 'kbk' }: { f?: number; kam?: Kam2D; asap?: number; pesawat?: number; mejaMasker?: boolean; isi?: IsiKota[]; id?: string }) {
  const c = cahayaKota(asap);
  const Y0 = K.kakiDinding,
    PX = K.pxM;
  const yM = (m: number) => Y0 - m * PX;
  const jauh = (w: string) => campur(w, '#D7B595', 0.25 + 0.55 * asap); // benda jauh memudar dalam asap
  const zl = 1 + (kam.zoom - 1) * 0.35;
  // pesawat berputar: lintasan elips di langit, garis putus = rencana mendarat yang batal
  const tP = pesawat * Math.PI * 1.6 + 0.4;
  const px = 600 + Math.cos(tP) * 380,
    py = 330 + Math.sin(tP) * 90;
  const langit = (
    <g transform={`translate(540 960) scale(${zl.toFixed(4)}) translate(${(-(540 + (kam.cx - 540) * 0.35)).toFixed(1)} ${(-(960 + (kam.cy - 960) * 0.35)).toFixed(1)})`}>
      <defs>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={campur('#A9CBD6', '#B98F74', asap)} />
          <stop offset="1" stopColor={campur('#EFE6D2', '#E2B78E', asap)} />
        </linearGradient>
      </defs>
      <rect x="-700" y="-600" width="2500" height="1600" fill={`url(#${id}-lg)`} />
      <MatahariKabur x={830} y={250} r={50} kuat={0.4 + 0.6 * asap} id={`${id}-mk`} />
    </g>
  );
  // pesawat berputar tak bisa turun: digambar di atas kabut (samar) supaya tetap terbaca
  const pesawatNode =
    pesawat > 0 ? (
      <g transform={`translate(540 960) scale(${zl.toFixed(4)}) translate(${(-(540 + (kam.cx - 540) * 0.35)).toFixed(1)} ${(-(960 + (kam.cy - 960) * 0.35)).toFixed(1)})`} opacity=".8">
        <ellipse cx="600" cy="330" rx="380" ry="90" fill="none" stroke="#FFF6E8" strokeWidth="5" strokeDasharray="16 18" opacity=".7" />
        <g transform={`translate(${px} ${py}) scale(${Math.sin(tP) > 0 ? -1 : 1} 1)`}>
          <Plane x={0} y={0} s={1.1} f={f} />
        </g>
      </g>
    ) : null;
  // latar jauh: bukit hijau + laut di kiri
  const latar = (
    <g>
      <path d={`M-600 ${K.cakrawala - 40}Q-200 ${K.cakrawala - 260} 200 ${K.cakrawala - 150}Q600 ${K.cakrawala - 300} 1000 ${K.cakrawala - 170}Q1400 ${K.cakrawala - 240} 1800 ${K.cakrawala - 60}L1800 ${K.cakrawala + 40}L-600 ${K.cakrawala + 40}Z`} fill={jauh('#7E9C7A')} />
      <rect x="-700" y={K.cakrawala - 30} width="700" height="70" fill={jauh('#8FB3BE')} />
    </g>
  );
  // gedung SD
  const atapY = yM(3.6),
    dindingAtas = yM(3.0);
  const sd = (
    <g data-detail="sekolah">
      <path d={`M-420 ${dindingAtas}L-360 ${atapY}L800 ${atapY}L860 ${dindingAtas}Z`} fill="#B5503F" />
      {Array.from({ length: 26 }, (_, i) => (
        <path key={i} d={`M${-400 + i * 48} ${dindingAtas}L${-345 + i * 46} ${atapY}`} stroke="#9A4234" strokeWidth="5" />
      ))}
      <Terang c={c} n="atas" d={`M-420 ${dindingAtas}L-360 ${atapY}L800 ${atapY}L860 ${dindingAtas}Z`} />
      <rect x="-400" y={dindingAtas} width="1240" height={Y0 - dindingAtas} fill="#EDE4D0" />
      <WallGrain x={-400} y={dindingAtas} w={1240} h={Y0 - dindingAtas} o={0.05} seed={4} />
      <rect x="-400" y={yM(0.6)} width="1240" height={0.6 * PX} fill="#8DAE9A" />
      {/* jendela nako */}
      {[-330, -60, 520, 700].map((x) => (
        <g key={x}>
          <rect x={x} y={yM(2.4)} width="150" height={1.4 * PX} fill="#5D7A80" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={x + 6} y={yM(2.4) + 8 + i * 44} width="138" height="30" fill="#A9C6CB" opacity=".75" />
          ))}
          <rect x={x - 8} y={yM(2.4) - 8} width="166" height={1.4 * PX + 16} fill="none" stroke="#7E5A3E" strokeWidth="10" />
        </g>
      ))}
      {/* papan nama */}
      <rect x="80" y={yM(2.85)} width="380" height="92" rx="6" fill="#2F5E86" />
      <text x="270" y={yM(2.85) + 60} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="44" fill="#FFF9EF">SEKOLAH DASAR</text>
      <Terang c={c} n="depan" kotak={[-400, dindingAtas, 1240, Y0 - dindingAtas]} />
      <rect x="-400" y={dindingAtas} width="1240" height="34" fill="#4D3E44" opacity=".25" />
      {/* tiang bendera */}
      <rect x="640" y={yM(5.2)} width="10" height={5.2 * PX} fill="#C9CCCC" />
      <g transform={`translate(650 ${yM(5.1)})`}>
        <path d={`M0 0Q60 ${8 + Math.sin(f * 0.2) * 6} 120 0V40Q60 ${48 + Math.sin(f * 0.2) * 6} 0 40Z`} fill="#D93B33" />
        <path d={`M0 40Q60 ${48 + Math.sin(f * 0.2) * 6} 120 40V80Q60 ${88 + Math.sin(f * 0.2) * 6} 0 80Z`} fill="#FFFFFF" />
      </g>
    </g>
  );
  // rumah panggung kayu + kelapa (kanan)
  const rumah = (
    <g data-detail="rumah-panggung">
      <path d={`M880 ${yM(3.1)}L1080 ${yM(4.4)}L1300 ${yM(3.1)}Z`} fill="#9AA3A6" />
      <Terang c={c} n="atas" d={`M880 ${yM(3.1)}L1080 ${yM(4.4)}L1300 ${yM(3.1)}Z`} />
      <rect x="910" y={yM(3.1)} width="360" height={2.2 * PX} fill="#B48A62" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="910" y={yM(3.1) + i * 55} width="360" height="4" fill="#8E6A4A" />
      ))}
      <rect x="1000" y={yM(2.5)} width="110" height="150" fill="#5B4636" />
      <rect x="1150" y={yM(2.6)} width="90" height="90" fill="#A9C6CB" />
      <Terang c={c} n="depan" kotak={[910, yM(3.1), 360, 2.2 * PX]} />
      {[930, 1090, 1250].map((x) => (
        <rect key={x} x={x} y={yM(0.9)} width="18" height={0.9 * PX} fill="#6E5440" />
      ))}
      <path d={`M960 ${Y0}L1000 ${yM(0.9)}M1000 ${Y0 - 40}h60M985 ${Y0 - 100}h60`} stroke="#6E5440" strokeWidth="10" />
    </g>
  );
  const kelapa = (x: number, h: number, seed: number) => {
    const top = Y0 - h;
    return (
      <g data-detail="kelapa">
        <path d={`M${x} ${Y0}Q${x + 30} ${Y0 - h * 0.5} ${x + 60} ${top}`} stroke="#8A7458" strokeWidth="26" fill="none" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.sin(f * 0.05 + seed) * 0.05;
          const L = 230;
          return <path key={i} d={`M${x + 60} ${top}Q${x + 60 + Math.cos(a) * L * 0.6} ${top + Math.sin(a) * L * 0.25 - 60} ${x + 60 + Math.cos(a) * L} ${top + Math.abs(Math.sin(a)) * L * 0.5 + 40}`} stroke={i % 2 ? '#6F8F4E' : '#7FA05A'} strokeWidth="22" fill="none" strokeLinecap="round" />;
        })}
        <circle cx={x + 52} cy={top + 18} r="16" fill="#8D6B3A" />
        <circle cx={x + 74} cy={top + 22} r="14" fill="#7E5F33" />
      </g>
    );
  };
  // ketapang (kiri, di halaman sekolah)
  const ketapang = (
    <g data-detail="ketapang">
      <path d={`M-470 ${Y0}L-460 ${yM(2.6)}`} stroke="#6A5340" strokeWidth="34" />
      {[[-560, yM(3.0), 190], [-380, yM(3.3), 170], [-470, yM(3.9), 200], [-300, yM(2.7), 130]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.42} fill={i % 2 ? '#6F9361' : '#5F8455'} />
      ))}
    </g>
  );
  // pagar + gerbang terkunci + kertas pengumuman
  const pagarY = 1222;
  const pagar = (
    <g data-detail="pagar">
      {Array.from({ length: 30 }, (_, i) => {
        const x = -420 + i * 44;
        if (x > 200 && x < 560) return null;
        if (x > 840) return null;
        return <rect key={i} x={x} y={pagarY - 150} width="12" height="150" fill="#3F6F8E" />;
      })}
      <rect x="-420" y={pagarY - 150} width="620" height="12" fill="#3F6F8E" />
      <rect x="560" y={pagarY - 150} width="280" height="12" fill="#3F6F8E" />
      <rect x="-420" y={pagarY - 30} width="1260" height="30" fill="#BDB4A6" />
      {/* gerbang tertutup */}
      <rect x="200" y={pagarY - 210} width="20" height="210" fill="#2F5E86" />
      <rect x="540" y={pagarY - 210} width="20" height="210" fill="#2F5E86" />
      <rect x="220" y={pagarY - 190} width="320" height="170" fill="none" stroke="#2F5E86" strokeWidth="10" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={232 + i * 34} y={pagarY - 186} width="8" height="164" fill="#2F5E86" />
      ))}
      <path d={`M372 ${pagarY - 120}q8 22 16 0`} stroke="#7A7F82" strokeWidth="6" fill="none" />
      <rect x="370" y={pagarY - 104} width="22" height="18" rx="3" fill="#C9A23A" />
      {/* kertas pengumuman */}
      <g transform={`translate(${GERBANG.kertas.x - 70} ${GERBANG.kertas.y - 40}) rotate(-2)`}>
        <rect x="0" y="0" width="140" height="100" fill="#FFFDF5" />
        <text x="70" y="40" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="26" fill="#C0392B">LIBUR</text>
        <text x="70" y="70" textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="17" fill="#333">KABUT ASAP</text>
        <rect x="64" y="-6" width="12" height="12" fill="#C9C2B4" />
      </g>
    </g>
  );
  // jalan
  const jalan = (
    <g>
      <rect x="-800" y={K.trotoar - 16} width="2700" height="16" fill="#CFC6B8" />
      <rect x="-800" y={K.trotoar} width="2700" height={K.jalan - K.trotoar} fill="#D6CDBF" />
      {Array.from({ length: 30 }, (_, i) => (
        <path key={i} d={`M${-800 + i * 92} ${K.trotoar}L${-830 + i * 96} ${K.jalan}`} stroke="#BEB4A5" strokeWidth="2" />
      ))}
      <rect x="-800" y={K.jalan} width="2700" height="14" fill="#A49B8E" />
      <rect x="-800" y={K.jalan + 14} width="2700" height="1100" fill="#6E6A66" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={-600 + i * 420} y={K.jalan + 260} width="200" height="16" fill="#E8DFC8" opacity=".8" />
      ))}
      <Terang c={c} n="atas" kotak={[-800, K.trotoar, 2700, 1200]} />
    </g>
  );
  const meja = mejaMasker ? (
    <g data-detail="meja-masker">
      <rect x={MEJA_MASKER.x - 120} y={MEJA_MASKER.y - 150} width="240" height="22" fill="#9C7A55" />
      <rect x={MEJA_MASKER.x - 110} y={MEJA_MASKER.y - 128} width="14" height="128" fill="#7E6244" />
      <rect x={MEJA_MASKER.x + 96} y={MEJA_MASKER.y - 128} width="14" height="128" fill="#7E6244" />
      <rect x={MEJA_MASKER.x - 100} y={MEJA_MASKER.y - 220} width="110" height="70" fill="#DCE6EA" />
      <text x={MEJA_MASKER.x - 45} y={MEJA_MASKER.y - 178} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="20" fill="#2F5E86">MASKER</text>
      <rect x={MEJA_MASKER.x + 20} y={MEJA_MASKER.y - 196} width="80" height="46" fill="#C9D6DB" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${MEJA_MASKER.x + 26 + i * 22} ${MEJA_MASKER.y - 168}q10 -10 20 0`} stroke="#9FB0B6" strokeWidth="4" fill="none" />
      ))}
    </g>
  ) : null;
  // tokoh
  const urut = [...isi].sort((a, b) => a.y - b.y);
  const bayangan = urut.map((t, i) => {
    const s = t.s ?? skalaKota(t.y);
    return (
      <BayanganJatuh key={i} c={c} kaki={[t.x, t.y]} tinggiPx={(t.tinggi ?? 1.65) * s * 200} id={`${id}-bt${i}`} kuat={0.28 - 0.15 * asap}>
        {t.gambar({ x: t.x, y: t.y, s })}
      </BayanganJatuh>
    );
  });
  const badan = urut.map((t, i) => {
    const s = t.s ?? skalaKota(t.y);
    const W = (t.lebar ?? 0.5) * s * 200;
    return (
      <g key={i}>
        <KontakKaki c={c} x={t.x} y={t.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${i}`} />
        {t.polos ? t.gambar({ x: t.x, y: t.y, s }) : (
          <TokohBercahaya c={c} x={t.x} y={t.y} s={s} tinggi={t.tinggi ?? 1.65} id={`${id}-tc${i}`}>
            {t.gambar({ x: t.x, y: t.y, s })}
          </TokohBercahaya>
        )}
      </g>
    );
  });
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  return (
    <g data-lokasi="kota-biak-2d">
      {langit}
      <g transform={T}>
        {latar}
        <rect x="-900" y={K.cakrawala - 300} width="2900" height="600" fill={campur('#E6D3B6', '#CFA37E', asap)} opacity={0.2 + 0.4 * asap} />
        {ketapang}
        {sd}
        {rumah}
        {kelapa(820, 4.8 * PX, 1)}
        {kelapa(1330, 5.4 * PX, 2)}
        <AmbientKaki c={c} x0={-420} x1={1300} y={Y0} tinggi={90} id={`${id}-ak`} />
        {pagar}
        {jalan}
        {meja}
        {bayangan}
        {badan}
      </g>
      <KabutAsap kuat={asap * 0.75} f={f} id={`${id}-kb`} />
      {pesawatNode}
      <NadaAkhir c={c} id={id} />
    </g>
  );
}
