// Lokasi bersama: DERET JENDELA MALAM (v1, 18 Nov 2026), panggung flat 2D dilihat dari seberang jalan.
// Kos tiga lantai (12 kamar: 4 jendela × 3 lantai) diapit rumah tetangga kiri dan kanan (3 jendela masing-masing),
// malam, boleh hujan. Dibuat untuk "Keresahan yang Kamu Hapus Lagi" v3. Pengguna 17 Nov 2026 atas v2: "masih gak
// bagusss" → bagian yang paling mengganggu "Alur & adegannya".
// Gunanya motif "cuma aku / ternyata orang lain juga": di awal hanya satu jendela menyala ("paling cuma aku yang
// begini"); kemudian jendela-jendela lain menyala dan memperlihatkan orang yang juga terjaga; tirai menutup satu per
// satu ("makin merasa sendirian"); di akhir tali lampu menyambung jendela-jendela dari satu jendela ke semua.
// Slot per jendela lewat `jendela(i)`: nyala 0..1, cahaya 'hangat' (lampu kamar) | 'hp' (kamar gelap, hanya layar HP),
// tirai 0 terbuka..1 tertutup, lampion 0..1 (lampion kecil di jendela), isi(kotak) = tokoh di dalam (dipotong kaca;
// letakkan dengan `tokohJM(i)`). Lain-lain: `papan` (tulisan di atas pintu kos, bawaan 'KOS'), `tali` 0..1, `hujan`, `gelap` (malam makin sepi; jendela menyala tetap
// terang), `kucing` di ambang jendela. Kamera Kam2D { zoom, cx, cy } seperti lokasi flat 2D lain (`layarJM`).
// Skala: lantai kos ±3,2 m = 320 px; tokoh di jendela skala 0,62 (setengah badan terlihat).
import React from 'react';
import { P } from '../../../core/v1/core';
import { Moon, Plant, ACUnit, PowerPole } from '../../_detail/v1/Detail';
import { Lampion } from '../../../props/lampion/v1/Lampion';
import { Kucing } from '../../../characters/kucing/v1/Kucing';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type KotakJM = { x: number; y: number; w: number; h: number };
export type JendelaJM = KotakJM & { bangunan: 'kos' | 'kiri' | 'kanan'; baris: number; kolom: number };
export type IsiJendela = {
  nyala?: number;
  cahaya?: 'hangat' | 'hp';
  tirai?: number;
  lampion?: number;
  warnaLampion?: string;
  isi?: (k: KotakJM) => React.ReactNode;
};

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export const JM = { tanah: 1560, trotoar: 1640 };
const JW = 196,
  JH = 236;
const KOS = { x0: 60, x1: 1020, atap: 300 };
const KOLOM = [180, 420, 660, 900];
const BARIS = [350, 670, 990];
const j = (cx: number, y: number, bangunan: JendelaJM['bangunan'], baris: number, kolom: number): JendelaJM => ({ x: cx - JW / 2, y, w: JW, h: JH, bangunan, baris, kolom });
/** 0–11 kos (baris atas → bawah, kiri → kanan), 12–14 rumah kiri, 15–17 rumah kanan */
export const JENDELA_JM: JendelaJM[] = [
  ...BARIS.flatMap((y, b) => KOLOM.map((cx, k) => j(cx, y, 'kos', b, k))),
  j(-540, 760, 'kiri', 1, -2),
  j(-250, 760, 'kiri', 1, -1),
  j(-540, 1110, 'kiri', 2, -2),
  j(1330, 700, 'kanan', 1, 4),
  j(1620, 700, 'kanan', 1, 5),
  j(1330, 1080, 'kanan', 2, 4),
];
/** jendela kamar Naya: lantai dua, kolom kedua */
export const NAYA_JM = 5;
export const pusatJM = (i: number) => {
  const q = JENDELA_JM[i];
  return { x: q.x + q.w / 2, y: q.y + q.h / 2 };
};
/** titik tengah atas ambang jendela (untuk kucing/pot) */
export const ambangJM = (i: number) => {
  const q = JENDELA_JM[i];
  return { x: q.x + q.w / 2, y: q.y + q.h + 8 };
};
/** kaki tokoh di dalam jendela supaya setengah badan atas terlihat (pusat kepala di 42% tinggi kaca; rig v2: pusat kepala
 *  279·s di atas kaki) */
export const tokohJM = (i: number, dx = 0, s = 0.95) => {
  const q = JENDELA_JM[i];
  return { x: q.x + q.w / 2 + dx, y: q.y + q.h * 0.42 + 279 * s, s };
};
/** pusat dan jari-jari kepala tokoh dari tokohJM (untuk bubble/tanda/cahaya HP di wajah) */
export const kepalaJM = (i: number, dx = 0, s = 0.95) => {
  const t = tokohJM(i, dx, s);
  return { x: t.x, y: t.y - 279 * s, r: 66 * s };
};
export const layarJM = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });

const TIRAI = ['#C98F84', '#95B8A2', '#E8D7B8', '#7E8FB0', '#D9A65A', '#B9A3C9'];
const LAMPION_W = ['#D9A65A', '#8B4354', '#F3E3C4', '#7FA48D'];

/** sambungan tali lampu (pasangan jendela), diurut dari jendela Naya ke luar */
const SAMBUNG: [number, number][] = (() => {
  const s: [number, number][] = [];
  for (const b of [0, 1, 2]) for (const k of [0, 1, 2]) s.push([b * 4 + k, b * 4 + k + 1]);
  s.push([1, 5], [5, 9], [13, 4], [12, 13], [14, 8], [7, 15], [15, 16], [11, 17]);
  const n = pusatJM(NAYA_JM);
  const d = (p: [number, number]) => {
    const a = pusatJM(p[0]),
      b = pusatJM(p[1]);
    return Math.hypot((a.x + b.x) / 2 - n.x, (a.y + b.y) / 2 - n.y);
  };
  return s.sort((a, b) => d(a) - d(b));
})();

export function JendelaMalam2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  jendela = () => ({}),
  tali = 0,
  hujan = 0,
  gelap = 0,
  kilat = 0,
  kucing,
  kabur = 0,
  papan = 'KOS',
  id = 'jm',
}: {
  f?: number;
  kam?: Kam2D;
  jendela?: (i: number) => IsiJendela;
  tali?: number;
  hujan?: number;
  gelap?: number;
  /** 0..1 kilat (langit dan dinding terang sesaat) */
  kilat?: number;
  kucing?: { i: number; pose?: 'duduk' | 'tidur' | 'jalan'; dir?: number; dx?: number };
  kabur?: number;
  /** tulisan papan di atas pintu kos (mis. 'KOS PUTRI') */
  papan?: string;
  id?: string;
}) {
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  const vx0 = kam.cx - 540 / kam.zoom - 200,
    vx1 = kam.cx + 540 / kam.zoom + 200;
  const X0 = -1000,
    X1 = 2100;
  const opsi = JENDELA_JM.map((_, i) => jendela(i) ?? {});
  // ---------- langit
  const langit = (
    <g data-detail="langit">
      <defs>
        <linearGradient id={`${id}-langit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hujan > 0.5 ? '#161D2B' : '#121A2B'} />
          <stop offset="1" stopColor={hujan > 0.5 ? '#2C3546' : '#303D5A'} />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill={`url(#${id}-langit)`} />
      {Array.from({ length: 34 }, (_, i) => (
        <circle key={i} cx={acak(i) * 1080} cy={acak(i + 40) * 700} r={1 + acak(i + 3) * 1.5} fill="#F6EED8" opacity={(1 - hujan) * (0.3 + 0.45 * Math.abs(Math.sin(f * 0.05 + i)))} />
      ))}
      {hujan < 0.9 && (
        <g opacity={1 - hujan}>
          <Moon x={870} y={250} r={40} />
        </g>
      )}
      {hujan > 0 &&
        [[160, 230, 1.2], [520, 160, 1.5], [880, 260, 1.3], [300, 420, 1.0], [760, 470, 1.1]].map(([x, y, s], i) => (
          <g key={i} opacity={0.75 * hujan} transform={`translate(${(x + ((f * 0.4 + i * 90) % 140) - 70).toFixed(1)} ${y}) scale(${s})`}>
            <ellipse cx="0" cy="0" rx="150" ry="50" fill="#3A4357" />
            <ellipse cx="-70" cy="-24" rx="80" ry="44" fill="#3E485D" />
            <ellipse cx="60" cy="-30" rx="90" ry="50" fill="#3A4357" />
          </g>
        ))}
      {kilat > 0 && <rect width="1080" height="1920" fill="#DCE8FF" opacity={0.22 * kilat} />}
    </g>
  );
  // ---------- bangunan
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  const rumahKiri = tampak(-800, 0) && (
    <g data-bangunan="rumah-kiri">
      <path d="M-800 650L-390 470L20 650Z" fill="#4E2F38" />
      <rect x="-780" y="640" width="780" height={JM.tanah - 640} fill="#5B6270" />
      <rect x="-780" y="1010" width="780" height="22" fill="#4C525E" />
      <rect x="-320" y="1300" width="150" height="260" rx="6" fill="#3B3036" />
      <circle cx="-188" cy="1440" r="6" fill="#C9A86A" />
      <rect x="-330" y="1290" width="170" height="14" fill="#2E2A2C" />
    </g>
  );
  const rumahKanan = tampak(1080, 1900) && (
    <g data-bangunan="rumah-kanan">
      <path d="M1080 590L1480 420L1880 590Z" fill="#3E4A3F" />
      <rect x="1100" y="580" width="760" height={JM.tanah - 580} fill="#6B5F55" />
      <rect x="1100" y="980" width="760" height="22" fill="#5A4F47" />
      <rect x="1550" y="1300" width="150" height="260" rx="6" fill="#33302E" />
      <circle cx="1568" cy="1440" r="6" fill="#C9A86A" />
      <rect x="1540" y="1290" width="170" height="14" fill="#2B2826" />
    </g>
  );
  const kos = tampak(KOS.x0, KOS.x1) && (
    <g data-bangunan="kos">
      {/* tandon air + antena di atap */}
      <rect x="820" y="180" width="110" height="96" rx="10" fill="#3F4F5E" />
      <rect x="812" y="176" width="126" height="16" rx="6" fill="#4C5E6E" />
      <path d="M840 276v24M910 276v24" stroke="#2C3238" strokeWidth="8" />
      <path d="M200 300V170M170 200h60M180 220h40" stroke="#2C3238" strokeWidth="5" />
      <rect x={KOS.x0 - 20} y={KOS.atap - 30} width={KOS.x1 - KOS.x0 + 40} height="34" fill="#6A5A50" />
      <rect x={KOS.x0} y={KOS.atap} width={KOS.x1 - KOS.x0} height={JM.tanah - KOS.atap} fill="#7A6B5E" />
      {/* garis lantai */}
      {[630, 950, 1270].map((y) => <rect key={y} x={KOS.x0 - 10} y={y} width={KOS.x1 - KOS.x0 + 20} height="20" fill="#6A5B50" />)}
      {/* tekstur dinding */}
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={KOS.x0 + acak(i) * (KOS.x1 - KOS.x0 - 60)} y={KOS.atap + 40 + acak(i + 7) * 1180} width={30 + acak(i + 3) * 50} height="5" fill="#000" opacity=".06" />
      ))}
      {/* lantai bawah: pintu masuk, papan KOS, kotak surat */}
      <rect x="440" y="1330" width="200" height="230" rx="8" fill="#3A2F2C" />
      <path d="M540 1330v230" stroke="#2A2220" strokeWidth="6" />
      <rect x="400" y="1296" width="280" height="20" fill="#5A4A40" />
      <rect x="470" y="1286" width="140" height="0" fill="none" />
      <g data-detail="papan-kos">
        <rect x={540 - (papan.length * 19 + 50) / 2} y="1236" width={papan.length * 19 + 50} height="48" rx="8" fill={P.cream} stroke={P.ink} strokeWidth="4" />
        <text x="540" y="1272" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.ink}>{papan}</text>
      </g>
      <rect x="690" y="1400" width="56" height="70" rx="6" fill="#8B4354" />
      <rect x="700" y="1414" width="36" height="8" fill="#2A2220" />
      <rect x="180" y="1350" width="150" height="120" fill="#2B3448" />
      <rect x="180" y="1350" width="150" height="120" fill="none" stroke="#4E3F36" strokeWidth="7" />
      <rect x="820" y="1350" width="150" height="120" fill="#2B3448" />
      <rect x="820" y="1350" width="150" height="120" fill="none" stroke="#4E3F36" strokeWidth="7" />
    </g>
  );
  // AC dan pot di dinding (detail hidup)
  const dindingDetail = (
    <g data-detail="dinding">
      {[1, 6, 8, 16].map((i) => {
        const q = JENDELA_JM[i];
        return tampak(q.x - 100, q.x + 200) ? (
          <g key={i} transform={`translate(${q.x + q.w - 70} ${q.y + q.h + 30}) scale(0.5)`}>
            <ACUnit x={0} y={0} />
          </g>
        ) : null;
      })}
    </g>
  );
  // ---------- jalan
  const jalan = (
    <g data-detail="jalan">
      <rect x={X0} y={JM.tanah} width={X1 - X0} height={JM.trotoar - JM.tanah} fill="#655F57" />
      {Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${X0 + i * 120} ${JM.tanah}L${X0 + i * 120 - 24} ${JM.trotoar}`} stroke="#57524B" strokeWidth="3" />)}
      <rect x={X0} y={JM.trotoar} width={X1 - X0} height="20" fill="#A8A091" />
      <rect x={X0} y={JM.trotoar + 20} width={X1 - X0} height="900" fill="#323238" />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} x={X0 + i * 200} y={1820} width="110" height="12" fill="#D9D0BB" opacity=".45" />)}
      {hujan > 0 &&
        [[120, 1700, 160], [620, 1760, 220], [1150, 1690, 140], [-400, 1740, 180]].map(([x, y, w], i) => (
          <ellipse key={i} cx={x} cy={y} rx={w} ry={w * 0.12} fill="#56627A" opacity={0.6 * hujan} />
        ))}
      {[[300, 1560, 1], [790, 1560, 2], [-640, 1560, 0], [1460, 1560, 1]].map(([x, y, k]) => (tampak(x - 100, x + 100) ? <Plant key={x} x={x} y={y} s={0.9} kind={k} /> : null))}
    </g>
  );
  const lampuJalan = (
    <g data-detail="lampu-jalan">
      <rect x="1052" y="1250" width="16" height="390" fill="#25292C" />
      <path d="M1060 1260q-70 -36 -130 0" stroke="#25292C" strokeWidth="11" fill="none" />
      <rect x="908" y="1258" width="46" height="18" rx="6" fill="#25292C" />
    </g>
  );
  const pendarLampu = (k: number) => (
    <g data-fx="pendar-lampu" opacity={k}>
      <ellipse cx="931" cy="1282" rx="54" ry="26" fill="#FFE3A3" opacity=".85" />
      <path d="M931 1282L760 1640L1110 1640Z" fill="#FFD98F" opacity=".07" />
      <ellipse cx="931" cy="1650" rx="240" ry="40" fill="#FFD98F" opacity=".12" />
    </g>
  );
  // ---------- jendela
  const pendar = JENDELA_JM.map((q, i) => {
    const o = opsi[i];
    const n = klamp(o.nyala ?? 0);
    if (n <= 0 || !tampak(q.x - 120, q.x + q.w + 120)) return null;
    const hp = o.cahaya === 'hp';
    return <ellipse key={i} cx={q.x + q.w / 2} cy={q.y + q.h / 2} rx={q.w * 0.95} ry={q.h * 0.82} fill={hp ? '#8FB0FF' : '#FFCF86'} opacity={(hp ? 0.08 : 0.15) * n * (1 - 0.6 * klamp(o.tirai ?? 0))} />;
  });
  const kaca = JENDELA_JM.map((q, i) => {
    if (!tampak(q.x - 40, q.x + q.w + 40)) return null;
    const o = opsi[i];
    const n = klamp(o.nyala ?? 0);
    const hp = o.cahaya === 'hp';
    const tr = klamp(o.tirai ?? 0);
    const tw = q.w * (0.11 + 0.39 * tr);
    const warnaT = TIRAI[i % TIRAI.length];
    const lp = klamp(o.lampion ?? 0);
    return (
      <g key={i} data-detail="jendela" data-jendela={i}>
        <rect x={q.x - 12} y={q.y - 12} width={q.w + 24} height={q.h + 24} fill="#2A2526" />
        <rect x={q.x} y={q.y} width={q.w} height={q.h} fill="#1B2233" />
        {n > 0 && (hp ? <rect x={q.x} y={q.y} width={q.w} height={q.h} fill="#2E3B5C" opacity={n} /> : <rect x={q.x} y={q.y} width={q.w} height={q.h} fill={`url(#${id}-hangat)`} opacity={n} />)}
        <defs>
          <clipPath id={`${id}-k${i}`}>
            <rect x={q.x} y={q.y} width={q.w} height={q.h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-k${i})`}>
          {n > 0 && !hp && (
            <g opacity={0.55 * n}>
              <rect x={q.x + q.w * 0.1} y={q.y + q.h * 0.16} width={q.w * 0.22} height={q.h * 0.26} fill={['#E9C9A0', '#C9D8C0', '#E7B9B0'][i % 3]} />
              <path d={`M${q.x + q.w * 0.58} ${q.y + q.h * 0.4}h${q.w * 0.36}`} stroke="#B07F55" strokeWidth="6" />
              <rect x={q.x + q.w * 0.62} y={q.y + q.h * 0.3} width="14" height={q.h * 0.1} fill="#8B4354" />
              <rect x={q.x + q.w * 0.7} y={q.y + q.h * 0.28} width="12" height={q.h * 0.12} fill="#526B58" />
            </g>
          )}
          {o.isi && n > 0 && <g>{o.isi(q)}</g>}
          {/* cahaya ruang: tokoh ikut redup saat lampu baru menyala (pencahayaan, bukan tembus pandang) */}
          {o.isi && n > 0 && <rect x={q.x} y={q.y} width={q.w} height={q.h} fill="#1B2233" opacity={hp ? 0.25 + 0.75 * (1 - n) : 0.85 * (1 - n)} />}
          {n > 0 && !hp && <circle cx={q.x + q.w / 2} cy={q.y + 14} r="9" fill="#FFF3D0" opacity={n} />}
          {lp > 0 && <Lampion x={q.x + q.w * 0.8} y={q.y + 6} s={0.42 + 0.14 * lp} f={f + i * 11} nyala={lp} warna={o.warnaLampion ?? LAMPION_W[i % LAMPION_W.length]} tali={10} seed={i} id={`${id}-lj${i}`} />}
          {/* tirai dua sisi */}
          {[0, 1].map((s) => {
            const x = s === 0 ? q.x : q.x + q.w - tw;
            return (
              <g key={s}>
                <rect x={x} y={q.y} width={tw} height={q.h} fill={warnaT} />
                {Array.from({ length: 4 }, (_, k) => <path key={k} d={`M${x + ((k + 0.5) * tw) / 4} ${q.y}v${q.h}`} stroke="#000" strokeWidth="3" opacity=".12" />)}
                <rect x={x} y={q.y} width={tw} height={q.h} fill={hp ? '#1B2233' : '#FFE2B0'} opacity={hp ? 0.45 : 0.22 * n} />
                {n <= 0 && <rect x={x} y={q.y} width={tw} height={q.h} fill="#141A28" opacity=".55" />}
              </g>
            );
          })}
          {/* pantulan kaca + hujan di kaca */}
          <path d={`M${q.x + q.w * 0.1} ${q.y + q.h}L${q.x + q.w * 0.55} ${q.y}h${q.w * 0.12}L${q.x + q.w * 0.22} ${q.y + q.h}Z`} fill="#fff" opacity=".05" />
          {hujan > 0 &&
            Array.from({ length: 5 }, (_, k) => {
              const x = q.x + acak(i * 9 + k) * q.w,
                y = q.y + ((acak(i + k * 3) * q.h + f * (2 + k)) % q.h);
              return <path key={k} d={`M${x} ${y}q-3 14 0 26`} stroke="#B9C8DC" strokeWidth="3" opacity={0.35 * hujan} fill="none" />;
            })}
        </g>
        <rect x={q.x} y={q.y} width={q.w} height={q.h} fill="none" stroke="#4E3F36" strokeWidth="8" />
        <path d={`M${q.x} ${q.y + q.h * 0.24}H${q.x + q.w}`} stroke="#4E3F36" strokeWidth="6" />
        <rect x={q.x - 20} y={q.y + q.h + 6} width={q.w + 40} height="16" rx="3" fill="#8B7D70" />
        <rect x={q.x - 20} y={q.y + q.h + 22} width={q.w + 40} height="8" fill="#000" opacity=".2" />
      </g>
    );
  });
  // ---------- tali lampu (menyambung jendela dari jendela Naya ke luar)
  const taliNode =
    tali > 0 ? (
      <g data-fx="tali-jendela">
        {SAMBUNG.map(([a, b], k) => {
          const u = klamp(tali * (SAMBUNG.length + 2) - k);
          if (u <= 0) return null;
          const A = JENDELA_JM[a],
            B = JENDELA_JM[b];
          const kiri = A.x < B.x ? A : B,
            kanan = A.x < B.x ? B : A;
          const sejajar = Math.abs(A.y - B.y) < 80;
          const p0 = sejajar ? { x: kiri.x + kiri.w + 10, y: kiri.y + 6 } : { x: A.x + A.w / 2 + 40, y: A.y + A.h + 4 };
          const p1 = sejajar ? { x: kanan.x - 10, y: kanan.y + 6 } : { x: B.x + B.w / 2 + 40, y: B.y - 10 };
          const sag = sejajar ? 34 : 20;
          const titik = (t: number) => ({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t + sag * 4 * t * (1 - t) });
          const N = 12;
          const pts = Array.from({ length: N + 1 }, (_, i) => titik((i / N) * u));
          const m = titik(0.5);
          return (
            <g key={k}>
              <path d={`M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}`} stroke="#2A2422" strokeWidth="3" fill="none" />
              {pts.filter((_, i) => i % 2 === 1).map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y + 6} r="11" fill="#FFE3A3" opacity=".25" />
                  <circle cx={p.x} cy={p.y + 6} r="5" fill="#FFF0C8" />
                </g>
              ))}
              {u >= 1 && <Lampion x={m.x} y={m.y} s={0.32} f={f + k * 13} nyala={1} warna={LAMPION_W[k % LAMPION_W.length]} tali={6} seed={k} id={`${id}-tl${k}`} />}
            </g>
          );
        })}
      </g>
    ) : null;
  const kucingNode = kucing
    ? (() => {
        const a = ambangJM(kucing.i);
        return <Kucing x={a.x + (kucing.dx ?? 50)} y={a.y + 2} s={0.95} f={f} pose={kucing.pose ?? 'duduk'} dir={kucing.dir ?? -1} gaze={0.3} />;
      })()
    : null;
  const hujanNode =
    hujan > 0 ? (
      <g data-fx="hujan" opacity={hujan}>
        {Array.from({ length: 150 }, (_, i) => {
          const x = vx0 + acak(i) * (vx1 - vx0),
            y = -300 + ((acak(i + 9) * 2700 + f * 40) % 2700);
          return <path key={i} d={`M${x} ${y}l-10 48`} stroke="#B9C8DC" strokeWidth="2.4" opacity=".38" />;
        })}
      </g>
    ) : null;
  return (
    <g data-lokasi="jendela-malam-2d" filter={kabur > 0 ? `url(#${id}-kabur)` : undefined}>
      <defs>
        {kabur > 0 && (
          <filter id={`${id}-kabur`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={kabur.toFixed(2)} />
          </filter>
        )}
        <linearGradient id={`${id}-hangat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE2A8" />
          <stop offset="1" stopColor="#E9A866" />
        </linearGradient>
      </defs>
      {langit}
      <g transform={T}>
        <PowerPole x={-850} ground={JM.trotoar} top={260} wiresTo={[2000]} tone="#2E2B2A" />
        {rumahKiri}
        {rumahKanan}
        {kos}
        {dindingDetail}
        {jalan}
        {lampuJalan}
        {/* malam: bidang diredam; jendela menyala digambar sesudahnya supaya tetap terang */}
        <rect x={X0} y={-1000} width={X1 - X0} height="3400" fill="#0E1424" opacity={0.3 + 0.35 * gelap - 0.12 * kilat} />
        {pendar}
        {kaca}
        {kucingNode}
        {taliNode}
        {pendarLampu(1 - 0.6 * gelap)}
        {hujanNode}
      </g>
    </g>
  );
}
