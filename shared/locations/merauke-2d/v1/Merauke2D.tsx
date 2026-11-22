// Lokasi bersama: Papua Selatan (Merauke) di musim kemarau, PANGGUNG FLAT 2D (v1, 18 Nov 2026). Dibuat untuk "Kebakaran
// Hutan Papua" v1 (pengguna 18 Nov 2026: "buat kan konten soal kebakaran hutan di papua, kategori normal bukan stand up,
// narator naya"). Satu dunia, beberapa tempat (aturan 17 Nov 2026):
//   <Merauke2D>     savana + rawa dilihat dari tanah (mata 1,6 m): musamus (rumah semut), kayu putih, rawa mengering,
//                   walabi, dan di kanan area pembakaran savana kecil oleh warga adat (apiAdat, tunas). Di cakrawala:
//                   kolom asap dari kebakaran jauh (asapJauh).
//   <MeraukeAtas2D> dilihat dari atas bukit/drone: bukaan lahan luas (petak food estate, kebun tebu, konsesi kayu, sawit),
//                   jalan tanah lurus, ekskavator, banyak titik api + kolom asap; di bawah kiri savana dengan pembakaran
//                   adat kecil (pembanding skala). titik 0..1 = penanda titik panas muncul. ZONA_ATAS = titik label zona.
//   <Petak2D>       satu petak bukaan dari dekat: deretan tumpukan kayu tebangan (bakar 0..1, dari belakang ke depan),
//                   tunggul, ekskavator, tepi hutan yang ditebang, asap pekat. Tempat pemantau menerbangkan drone.
//   <HutanLebat2D>  hutan hujan lebat dan basah seperti di BAYANGAN orang (hujan, kabut, pakis, sulur, cendrawasih).
// Waktu: siang kemarau, satu arah matahari (dari kiri atas). `asap` 0..1 = langit makin jingga-abu dan kabur.
// Skala tokoh (Merauke2D): kaki di y → s = skalaMerauke(y) (cakrawala y 820, mata 1,6 m; rig 330 = 1,65 m).
// Kamera semua tempat: { zoom, cx, cy } seperti lokasi 2D lain (layar2D untuk overlay).
// Pakai: <Merauke2D f kam asap asapJauh apiAdat tunas rawaAir isi id />
//        <MeraukeAtas2D f kam asap titik api id />   <Petak2D f kam asap bakar drone isi id />   <HutanLebat2D f kam hujan id />
import React from 'react';
import { P } from '../../../core/v1/core';
import { Cloud, Flock } from '../../_detail/v1/Detail';
import { TokohBercahaya, KontakKaki, BayanganJatuh, NadaAkhir, type Cahaya2D } from '../../../film/v1/Cahaya2D';
import { Api, GarisApi, KepulanAsap, TumpukanKayu, MatahariKabur, TitikPanas } from '../../../props/api/v1/Api';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type IsiM = { x: number; y: number; s?: number; gambar: (p: Titik2D) => React.ReactNode; tinggi?: number; lebar?: number; tanpaBayangan?: boolean; polos?: boolean };

const rnd = (k: number, n: number) => {
  const v = Math.sin(k * 127.1 + n * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const campur = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b),
    u = klamp(t);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join('');
};
/** path halus melewati titik-titik (kurva kuadrat lewat titik tengah) */
const halusPath = (pts: number[][], tutup = true) => {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  d += `L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
  return tutup ? d + 'Z' : d;
};
const kamT = (kam: Kam2D) => `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({
  zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t,
  cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t,
  cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t,
});

export const MERAUKE = { cakrawala: 820, mata: 1.6 };
export const skalaMerauke = (y: number) => Math.max(0.03, (y - MERAUKE.cakrawala) / (MERAUKE.mata * 200));
export const titikMerauke = (x: number, y: number): Titik2D => ({ x, y, s: skalaMerauke(y) });

/** cahaya siang kemarau; asap 0..1 = matahari meredup jingga, bayangan melunak */
export function cahayaMerauke(asap = 0): Cahaya2D {
  return {
    matahari: { az: -48, el: 50 - 12 * asap, warna: campur('#FFF0CF', '#FFBE86', asap) },
    suasana: { bayangan: '#4B3A3A', ambient: 0.7 + 0.1 * asap, diffuse: 0.62 - 0.32 * asap, lantai: 0.3, nada: { warna: '#E39A55', kuat: 0.03 + 0.15 * asap } },
  };
}
const langitWarna = (asap: number): [string, string] => [campur('#A9CBD6', '#B48C74', asap), campur('#F0E6CE', '#E6B98C', asap)];

// ================================================================ benda khas
/** musamus (rumah semut Merauke): tiang tanah liat bergalur, puncak bertonjolan; tinggi dalam meter */
export function Musamus({ x, y, s, tinggi = 3, seed = 0 }: { x: number; y: number; s: number; tinggi?: number; seed?: number }) {
  const H = tinggi * 200 * s,
    W = (0.75 + 0.3 * rnd(seed, 1)) * 200 * s;
  const j = (k: number) => (rnd(seed, k) - 0.5) * W * 0.12;
  const pts = [
    [x - W / 2, y],
    [x - W * 0.44 + j(2), y - H * 0.28],
    [x - W * 0.36 + j(3), y - H * 0.6],
    [x - W * 0.26 + j(4), y - H * 0.86],
    [x - W * 0.12, y - H * (0.97 + 0.03 * rnd(seed, 5))],
    [x + W * 0.0, y - H * 0.84],
    [x + W * 0.12, y - H * (0.92 + 0.06 * rnd(seed, 6))],
    [x + W * 0.26 + j(7), y - H * 0.72],
    [x + W * 0.38 + j(8), y - H * 0.44],
    [x + W * 0.47, y - H * 0.16],
    [x + W / 2, y],
  ];
  const badan = halusPath(pts);
  return (
    <g data-detail="musamus">
      <ellipse cx={x + W * 0.25} cy={y + 2} rx={W * 0.9} ry={W * 0.12} fill="#4B3A3A" opacity=".22" />
      <path d={badan} fill="#B4754E" />
      <clipPath id={`mus-${seed}-${Math.round(x)}`}>
        <path d={badan} />
      </clipPath>
      <g clipPath={`url(#mus-${seed}-${Math.round(x)})`}>
        <rect x={x + W * 0.04} y={y - H * 1.05} width={W} height={H * 1.1} fill="#7E4E33" opacity=".38" />
        <rect x={x - W / 2} y={y - H * 1.05} width={W * 0.22} height={H * 1.1} fill="#E0A877" opacity=".25" />
        {Array.from({ length: 6 }, (_, i) => {
          const gx = x - W * 0.4 + (i / 5) * W * 0.8;
          return <path key={i} d={`M${gx} ${y}Q${gx + j(10 + i) * 2} ${y - H * 0.5} ${gx + (x - gx) * 0.5} ${y - H}`} stroke={i < 3 ? '#D39A6C' : '#8E5A3B'} strokeWidth={Math.max(1, 5 * s)} fill="none" opacity=".55" />;
        })}
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={x - W * 0.2 + rnd(seed, 20 + i) * W * 0.5} cy={y - H * (0.15 + rnd(seed, 30 + i) * 0.7)} rx={W * 0.08} ry={W * 0.05} fill="#7A4A30" opacity=".45" />
        ))}
      </g>
    </g>
  );
}

/** pohon kayu putih (Melaleuca): batang pucat berkulit mengelupas, tajuk hijau keabuan yang jarang */
export function KayuPutih({ x, y, s, tinggi = 9, seed = 0, kering = 0 }: { x: number; y: number; s: number; tinggi?: number; seed?: number; kering?: number }) {
  const H = tinggi * 200 * s,
    tw = 0.3 * 200 * s;
  const lean = (rnd(seed, 1) - 0.5) * H * 0.12;
  const daun = campur('#8FA386', '#B3A56E', kering),
    daun2 = campur('#A7B897', '#C9B97F', kering),
    daunG = campur('#6F8468', '#8C7C4F', kering);
  const cabang = [
    [x + lean * 0.5, y - H * 0.55, x + lean - H * 0.16, y - H * 0.82],
    [x + lean * 0.55, y - H * 0.5, x + lean + H * 0.18, y - H * 0.78],
    [x + lean * 0.8, y - H * 0.7, x + lean + H * 0.02, y - H * 0.96],
  ];
  const tajuk = Array.from({ length: 9 }, (_, i) => {
    const c = cabang[i % 3];
    return { cx: c[2] + (rnd(seed, 10 + i) - 0.5) * H * 0.22, cy: c[3] + (rnd(seed, 20 + i) - 0.5) * H * 0.12, rx: H * (0.09 + 0.05 * rnd(seed, 30 + i)), ry: H * (0.05 + 0.025 * rnd(seed, 40 + i)) };
  });
  return (
    <g data-detail="kayu-putih">
      <ellipse cx={x + H * 0.18} cy={y + 2} rx={H * 0.24} ry={H * 0.025} fill="#4B3A3A" opacity=".18" />
      <path d={`M${x - tw / 2} ${y}Q${x - tw * 0.3 + lean * 0.3} ${y - H * 0.4} ${x - tw * 0.2 + lean * 0.6} ${y - H * 0.62}L${x + tw * 0.2 + lean * 0.6} ${y - H * 0.62}Q${x + tw * 0.3 + lean * 0.3} ${y - H * 0.4} ${x + tw / 2} ${y}Z`} fill="#E8E1D4" />
      <path d={`M${x + tw * 0.05} ${y}Q${x + tw * 0.15 + lean * 0.3} ${y - H * 0.4} ${x + tw * 0.2 + lean * 0.6} ${y - H * 0.62}L${x + tw * 0.2 + lean * 0.6} ${y - H * 0.62}Q${x + tw * 0.3 + lean * 0.3} ${y - H * 0.4} ${x + tw / 2} ${y}Z`} fill="#B9AE9C" opacity=".6" />
      {Array.from({ length: 7 }, (_, i) => {
        const yy = y - H * (0.05 + i * 0.08);
        return <path key={i} d={`M${x - tw * 0.35 + lean * (i * 0.08)} ${yy}q${tw * 0.3} ${-3 * s} ${tw * 0.55} ${2 * s}`} stroke="#A99C88" strokeWidth={Math.max(0.8, 3 * s)} fill="none" opacity=".7" />;
      })}
      {cabang.map((c, i) => (
        <path key={i} d={`M${c[0]} ${c[1]}Q${(c[0] + c[2]) / 2} ${c[3] + H * 0.08} ${c[2]} ${c[3]}`} stroke="#DCD3C3" strokeWidth={Math.max(1, tw * 0.32)} fill="none" strokeLinecap="round" />
      ))}
      {tajuk.map((t, i) => (
        <ellipse key={`g${i}`} cx={t.cx + t.rx * 0.1} cy={t.cy + t.ry * 0.35} rx={t.rx} ry={t.ry} fill={daunG} opacity=".8" />
      ))}
      {tajuk.map((t, i) => (
        <ellipse key={`d${i}`} cx={t.cx} cy={t.cy} rx={t.rx * 0.95} ry={t.ry * 0.85} fill={i % 2 ? daun : daun2} />
      ))}
    </g>
  );
}

/** rumpun rumput savana (helai), alas (x, y), skala s */
export function Rumput({ x, y, s, seed = 0, warna = '#C9A35B', tinggi = 0.7, n = 7 }: { x: number; y: number; s: number; seed?: number; warna?: string; tinggi?: number; n?: number }) {
  const H = tinggi * 200 * s;
  return (
    <g data-detail="rumput">
      {Array.from({ length: n }, (_, i) => {
        const a = ((i / (n - 1)) - 0.5) * 1.3 + (rnd(seed, i) - 0.5) * 0.3;
        const h = H * (0.6 + 0.5 * rnd(seed, 10 + i));
        const bx = x + (i - n / 2) * 4 * s;
        return <path key={i} d={`M${bx} ${y}Q${bx + Math.sin(a) * h * 0.3} ${y - h * 0.6} ${bx + Math.sin(a) * h * 0.7} ${y - h}`} stroke={i % 3 === 0 ? campur(warna, '#8F6F3A', 0.35) : warna} strokeWidth={Math.max(0.8, 4.5 * s)} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
}

/** walabi (kanguru kecil Taman Nasional Wasur); makan = menunduk merumput */
export function Walabi({ x, y, s, f = 0, dir = 1, pose = 'tegak' }: { x: number; y: number; s: number; f?: number; dir?: number; pose?: 'tegak' | 'makan' | 'lompat' }) {
  const k = s * 200 * 0.0042; // walabi ±0,8 m tegak
  const lompat = pose === 'lompat' ? Math.abs(Math.sin(f * 0.25)) * 40 : 0;
  const tunduk = pose === 'makan' ? 1 : 0;
  const tel = Math.sin(f * 0.2) * 4;
  return (
    <g data-detail="walabi" transform={`translate(${x} ${y - lompat * k}) scale(${k * dir} ${k})`}>
      <ellipse cx="0" cy={lompat ? 6 + lompat : 4} rx="70" ry="9" fill="#4B3A3A" opacity=".22" />
      {/* ekor */}
      <path d="M-30 -40Q-90 -20 -120 4Q-96 0 -36 -24Z" fill="#9C714F" />
      {/* kaki belakang besar */}
      <path d="M-34 -70Q-60 -30 -30 -6L30 -2Q40 -8 26 -14L-4 -18Q-4 -50 -10 -70Z" fill="#A47A56" />
      {/* badan */}
      <g transform={`rotate(${tunduk ? 38 : 0} 0 -60)`}>
        <ellipse cx="-6" cy="-92" rx="40" ry="58" fill="#B08560" />
        <ellipse cx="6" cy="-84" rx="22" ry="40" fill="#E6CDA8" />
        {/* lengan */}
        <path d="M18 -110Q34 -96 30 -80" stroke="#9C714F" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* kepala */}
        <g transform="translate(14 -158)">
          <path d={`M-14 -20L-20 ${-62 + tel}L-4 -26Z`} fill="#9C714F" />
          <path d={`M2 -22L4 ${-64 - tel}L14 -22Z`} fill="#A47A56" />
          <path d="M-6 -24L2 -60L8 -26Z" fill="#E7B9A6" opacity=".6" />
          <ellipse cx="0" cy="0" rx="24" ry="22" fill="#B08560" />
          <path d="M12 -6Q40 0 42 12Q30 18 12 12Z" fill="#B08560" />
          <circle cx="41" cy="10" r="4.5" fill="#2E2420" />
          <circle cx="10" cy="-4" r="4.6" fill="#2E2420" />
          <circle cx="11.5" cy="-5.5" r="1.4" fill="#FFF" />
        </g>
      </g>
    </g>
  );
}

/** ekskavator kuning: alas kaki y, menghadap kanan (dir 1); lengan 0..1 = bucket turun mengeruk */
export function Ekskavator({ x, y, s, dir = 1, lengan = 0.4, kotor = 0.3 }: { x: number; y: number; s: number; dir?: number; lengan?: number; kotor?: number }) {
  const k = s * 200 * 0.0052; // ±5 m panjang
  const a1 = -35 + 25 * lengan,
    a2 = 70 + 30 * lengan;
  return (
    <g data-detail="ekskavator" transform={`translate(${x} ${y}) scale(${k * dir} ${k})`}>
      <ellipse cx="20" cy="4" rx="260" ry="22" fill="#3A2F2A" opacity=".3" />
      {/* rantai */}
      <rect x="-210" y="-70" width="380" height="70" rx="35" fill="#3E3A37" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-200 + i * 31} y="-72" width="14" height="10" fill="#5A5550" />
      ))}
      {[-170, -110, -50, 10, 70, 130].map((cx) => (
        <circle key={cx} cx={cx} cy="-35" r="22" fill="#55504B" />
      ))}
      {/* badan + kabin */}
      <rect x="-200" y="-190" width="300" height="112" rx="10" fill="#E3A933" />
      <rect x="-200" y="-112" width="300" height="20" fill="#B9842A" />
      <path d="M20 -300L100 -300L118 -190L20 -190Z" fill="#E3A933" />
      <path d="M34 -284L92 -284L104 -206L34 -206Z" fill="#9FC0C9" opacity=".85" />
      <path d="M44 -278L62 -278L50 -214Z" fill="#FFFFFF" opacity=".45" />
      <rect x="-190" y="-230" width="150" height="44" rx="8" fill="#D79C2C" />
      <rect x="-182" y="-224" width="20" height="30" fill="#4A4540" />
      {/* lengan (boom → stick → bucket) */}
      <g transform={`translate(110 -170) rotate(${a1})`}>
        <rect x="0" y="-22" width="300" height="44" rx="16" fill="#E3A933" />
        <rect x="0" y="12" width="300" height="10" fill="#B9842A" />
        <g transform={`translate(300 0) rotate(${a2})`}>
          <rect x="0" y="-16" width="230" height="32" rx="12" fill="#E3A933" />
          <g transform="translate(230 0) rotate(30)">
            <path d="M0 -20L70 -30L80 30L20 46Q-10 30 0 -20Z" fill="#6E655C" />
            <path d="M70 -30L80 30" stroke="#3E3A37" strokeWidth="8" />
          </g>
        </g>
      </g>
      <rect x="-210" y="-190" width="380" height="190" fill="#7A5A3E" opacity={(0.35 * kotor).toFixed(3)} />
    </g>
  );
}

/** deret pohon jauh (siluet tajuk) sepanjang y; gundul 0..1 = sebagian ditebang (celah) */
function DeretHutan({ x0, x1, y, h, warna, seed = 0, celah = [] as [number, number][] }: { x0: number; x1: number; y: number; h: number; warna: string; seed?: number; celah?: [number, number][] }) {
  const pts: number[][] = [[x0, y]];
  const n = Math.max(6, Math.round((x1 - x0) / (h * 0.55)));
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i / n) * (x1 - x0);
    const kosong = celah.some(([a, b]) => x > a && x < b);
    const t = kosong ? h * 0.05 : h * (0.55 + 0.45 * rnd(i, seed));
    pts.push([x - h * 0.15, y - t * 0.8], [x, y - t]);
  }
  pts.push([x1, y]);
  return <path d={halusPath(pts)} fill={warna} />;
}

// ================================================================ 1. savana + rawa dari tanah
const RUMPUT_M = Array.from({ length: 260 }, (_, i) => {
  const v = Math.pow(rnd(i, 3), 1.7); // lebih banyak di jauh
  const y = 830 + v * 1300;
  return { x: -1200 + rnd(i, 4) * 4400, y, seed: i };
});
/** benda tetap di savana (urut kedalaman): [jenis, x, y, tinggi m, seed] */
const BENDA_M: [('musamus' | 'pohon'), number, number, number, number][] = [
  ['pohon', -560, 905, 11, 1],
  ['musamus', -300, 960, 2.6, 2],
  ['pohon', -120, 880, 10, 3],
  ['musamus', 120, 1010, 3.4, 4],
  ['musamus', 230, 990, 2.2, 5],
  ['pohon', 380, 930, 12, 6],
  ['musamus', 620, 1100, 3.8, 7],
  ['pohon', 820, 900, 9, 8],
  ['musamus', 980, 940, 2.4, 9],
  ['musamus', 1060, 1180, 3.1, 10],
  ['pohon', 1250, 880, 10, 11],
  ['musamus', 1420, 980, 2.8, 12],
  ['pohon', 1980, 905, 11, 13],
  ['musamus', 2150, 1040, 3.3, 14],
  ['musamus', 2420, 960, 2.5, 15],
  ['pohon', 2650, 890, 10, 16],
  ['musamus', -1250, 1300, 3.6, 17],
  ['musamus', 2700, 1300, 4.0, 18],
];
/** kolom asap jauh di balik cakrawala (x, kuat relatif) */
const ASAP_JAUH: [number, number][] = [
  [1560, 0.8],
  [1840, 1],
  [2120, 0.7],
  [2400, 1],
  [2760, 0.8],
  [3050, 0.9],
  [1180, 0.5],
];
/** area pembakaran adat: garis api dari kiri ke kanan, merambat ke arah kamera */
export const ADAT = { x0: 1340, x1: 1820, y0: 1250, y1: 1360 };
export const WARGA_ADAT = titikMerauke(1930, 1420);

export function Merauke2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  asap = 0.2,
  asapJauh = 0.5,
  apiAdat = 0,
  tunas = 0,
  rawaAir = 0.25,
  isi = [],
  kabur = 0,
  id = 'mrk',
}: {
  f?: number;
  kam?: Kam2D;
  asap?: number;
  asapJauh?: number;
  /** 0 belum dibakar; 0..1 garis api merambat dari y0 ke y1 (di belakangnya rumput hangus) */
  apiAdat?: number;
  /** 0..1 rumput muda hijau tumbuh di bekas bakaran (pakan satwa) */
  tunas?: number;
  rawaAir?: number;
  isi?: IsiM[];
  kabur?: number;
  id?: string;
}) {
  const c = cahayaMerauke(asap);
  const [l0, l1] = langitWarna(asap);
  const HZ = MERAUKE.cakrawala;
  const vx0 = kam.cx - 540 / kam.zoom - 300,
    vx1 = kam.cx + 540 / kam.zoom + 300;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;
  // parallax langit 35%
  const zl = 1 + (kam.zoom - 1) * 0.35;
  const langit = (
    <g transform={`translate(540 960) scale(${zl.toFixed(4)}) translate(${(-(540 + (kam.cx - 540) * 0.35)).toFixed(1)} ${(-(960 + (kam.cy - 960) * 0.35)).toFixed(1)})`}>
      <defs>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={l0} />
          <stop offset="1" stopColor={l1} />
        </linearGradient>
      </defs>
      <rect x="-900" y="-600" width="3200" height="1500" fill={`url(#${id}-lg)`} />
      {asap < 0.5 && <circle cx={260} cy={260} r={58} fill="#FFF6DD" opacity={0.9 - asap} />}
      {asap >= 0.3 && <MatahariKabur x={260} y={300} r={52} kuat={klamp((asap - 0.3) * 2)} id={`${id}-mk`} />}
      <Cloud x={-200 + f * 0.15} y={300} s={1.3} tone={campur('#FFFFFF', '#E8C3A0', asap)} o={0.6 * (1 - asap * 0.6)} />
      <Cloud x={700 + f * 0.1} y={190} s={0.9} tone={campur('#FFFFFF', '#E8C3A0', asap)} o={0.5 * (1 - asap * 0.6)} />
      <Flock x={-80} y={520} f={f} n={4} s={0.8} tone="#4A3B33" />
    </g>
  );
  // kolom asap jauh (di balik deret hutan)
  const asapNode = (
    <g>
      {ASAP_JAUH.filter(([x]) => tampak(x - 400, x + 600)).map(([x, k], i) => (
        <KepulanAsap key={i} x={x} y={HZ - 10} s={0.45} f={f + i * 13} tinggi={620} condong={0.6} kuat={0.75 * asapJauh * k} warna="#8E8178" warnaAtas={campur('#D2C2B2', '#C2A68E', asap)} seed={i * 7 + 2} id={`${id}-aj${i}`} />
      ))}
    </g>
  );
  const hutan = (
    <g>
      <DeretHutan x0={-1600} x1={3600} y={HZ + 4} h={70} warna={campur('#8FA29A', '#A8957F', asap)} seed={3} celah={[[1500, 2000], [2300, 2800]]} />
      <DeretHutan x0={-1600} x1={3600} y={HZ + 14} h={46} warna={campur('#75897A', '#9A8670', asap)} seed={8} celah={[[1550, 1900], [2350, 2700]]} />
    </g>
  );
  // tanah savana: gradasi jauh pucat → dekat keemasan
  const tanah = (
    <g>
      <defs>
        <linearGradient id={`${id}-tn`} x1="0" y1={HZ} x2="0" y2={HZ + 1300} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={campur('#D9C79C', '#D2B48F', asap)} />
          <stop offset="0.25" stopColor="#D4B26C" />
          <stop offset="1" stopColor="#C29A55" />
        </linearGradient>
      </defs>
      <rect x="-1800" y={HZ + 8} width="5600" height="1800" fill={`url(#${id}-tn)`} />
      {/* petak tanah gundul dan jejak jalan setapak */}
      <path d={`M-300 2400Q300 1500 760 ${HZ + 120}L800 ${HZ + 120}Q420 1500 60 2400Z`} fill="#BF9A62" opacity=".55" />
    </g>
  );
  // rawa mengering: dasar rawa retak-retak (sel lumpur), garis bekas air, genangan sisa (rawaAir), gelagah kering
  const RAWA = { x0: -1150, x1: 380, y0: 930, y1: 1230 };
  const tepiRawa = halusPath([
    [RAWA.x0, 1060], [-900, 950], [-500, 925], [-100, 935], [250, 975], [RAWA.x1, 1060], [250, 1170], [-200, 1235], [-700, 1225], [-1050, 1150],
  ]);
  const sel = (() => {
    // jaring retakan: titik-titik berjitter dalam perspektif (makin jauh makin rapat), disambung ke kanan dan ke bawah
    const kol = 16,
      bar = 7;
    const P2 = (i: number, j: number) => {
      const v = j / (bar - 1);
      const y = RAWA.y0 + 10 + Math.pow(v, 1.35) * (RAWA.y1 - RAWA.y0 - 20);
      const x = RAWA.x0 + 40 + ((i + (j % 2) * 0.5) / kol) * (RAWA.x1 - RAWA.x0 - 60) + (rnd(i * 7 + j, 120) - 0.5) * 60;
      return [x, y + (rnd(i * 5 + j, 121) - 0.5) * 18 * (0.4 + v)];
    };
    const garis: string[] = [];
    for (let j = 0; j < bar; j++)
      for (let i = 0; i < kol; i++) {
        const a0 = P2(i, j);
        if (i < kol - 1) {
          const a1 = P2(i + 1, j);
          garis.push(`M${a0[0].toFixed(0)} ${a0[1].toFixed(0)}L${((a0[0] + a1[0]) / 2 + (rnd(i, j + 130) - 0.5) * 20).toFixed(0)} ${((a0[1] + a1[1]) / 2 + (rnd(i, j + 131) - 0.5) * 10).toFixed(0)}L${a1[0].toFixed(0)} ${a1[1].toFixed(0)}`);
        }
        if (j < bar - 1) {
          const a2 = P2(i + (rnd(i, j + 132) > 0.5 ? 0 : 1), j + 1);
          garis.push(`M${a0[0].toFixed(0)} ${a0[1].toFixed(0)}L${a2[0].toFixed(0)} ${a2[1].toFixed(0)}`);
        }
      }
    return garis.join('');
  })();
  const rawa = (
    <g data-detail="rawa">
      <defs>
        <clipPath id={`${id}-rw`}>
          <path d={tepiRawa} />
        </clipPath>
      </defs>
      {/* garis bekas air (tepi rawa lama, lebih gelap) */}
      <path d={tepiRawa} fill="#9C8763" transform="translate(0 6)" />
      <path d={tepiRawa} fill="#CDB993" />
      <g clipPath={`url(#${id}-rw)`}>
        <path d={sel} stroke="#8C7552" strokeWidth="4" fill="none" strokeLinejoin="round" opacity=".85" />
        <path d={sel} stroke="#E2D1AE" strokeWidth="2" fill="none" transform="translate(2 -3)" opacity=".5" />
        {[[-640, 1060, 210], [-150, 1110, 150], [140, 1030, 90]].map(([x, y, r], i) => {
          const rr = r * (0.2 + 0.8 * rawaAir);
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={rr * 1.25} ry={rr * 0.24} fill="#A9946E" opacity=".7" />
              <ellipse cx={x} cy={y} rx={rr} ry={rr * 0.18} fill="#86AAA7" />
              <ellipse cx={x - rr * 0.25} cy={y - rr * 0.04} rx={rr * 0.45} ry={rr * 0.04} fill="#DDEBE6" opacity=".75" />
            </g>
          );
        })}
      </g>
      {Array.from({ length: 46 }, (_, i) => {
        const tepi = i % 2 === 0;
        const x = tepi ? RAWA.x0 + rnd(i, 60) * 260 + (i % 4 === 0 ? RAWA.x1 - RAWA.x0 - 300 : 0) : RAWA.x0 + 100 + rnd(i, 60) * (RAWA.x1 - RAWA.x0 - 200);
        const y = tepi ? 960 + rnd(i, 61) * 220 : 945 + rnd(i, 61) * 30;
        const s = skalaMerauke(y);
        return <path key={i} d={`M${x} ${y}q${-4 * s} ${-60 * s} ${-14 * s} ${-120 * s}M${x + 6 * s} ${y}q${6 * s} ${-50 * s} ${18 * s} ${-95 * s}M${x + 2 * s} ${y}l${-20 * s} ${-70 * s}`} stroke={i % 3 ? '#A99A63' : '#8E8350'} strokeWidth={Math.max(1, 4 * s)} fill="none" />;
      })}
    </g>
  );
  // pembakaran adat: garis api merambat, hangus di belakangnya, tunas hijau
  const yApi = ADAT.y0 + (ADAT.y1 - ADAT.y0) * klamp(apiAdat);
  const adat = (
    <g data-detail="bakar-adat">
      {apiAdat > 0 && (() => {
        // bekas hangus: tepi belakang bergelombang (garis api mulai), tepi depan = garis api sekarang
        const n = 12;
        const atas = Array.from({ length: n + 1 }, (_, i) => {
          const u = Math.pow(Math.sin((i / n) * Math.PI), 0.6); // ujung kiri-kanan menyempit ke garis api
          const yb = ADAT.y0 - 26 - Math.sin((i / n) * Math.PI) * 18 + (rnd(i, 77) - 0.5) * 14;
          return [ADAT.x0 - 50 + (i / n) * (ADAT.x1 - ADAT.x0 + 100), yApi - (yApi - yb) * u];
        });
        const bawah = Array.from({ length: n + 1 }, (_, i) => [ADAT.x1 + 30 - (i / n) * (ADAT.x1 - ADAT.x0 + 60), yApi + 4 + (rnd(i, 78) - 0.5) * 10]);
        const d = halusPath([...atas, ...bawah]);
        return (
          <g>
            <path d={d} fill="#5A4B40" opacity=".85" />
            <path d={d} fill="none" stroke="#3B312B" strokeWidth="6" opacity=".35" />
            {Array.from({ length: 18 }, (_, i) => (
              <ellipse key={i} cx={ADAT.x0 + rnd(i, 79) * (ADAT.x1 - ADAT.x0)} cy={ADAT.y0 - 15 + rnd(i, 80) * Math.max(8, yApi - ADAT.y0)} rx={10 + rnd(i, 81) * 22} ry={3 + rnd(i, 82) * 4} fill="#8A7B6C" opacity=".45" />
            ))}
          </g>
        );
      })()}
      {tunas > 0 &&
        Array.from({ length: 34 }, (_, i) => {
          const x = ADAT.x0 - 20 + rnd(i, 70) * (ADAT.x1 - ADAT.x0 + 40),
            y = ADAT.y0 - 25 + rnd(i, 71) * Math.max(10, yApi - ADAT.y0 + 15);
          return <Rumput key={i} x={x} y={y} s={skalaMerauke(y) * (0.3 + 0.35 * tunas)} seed={i + 300} warna="#8DBA5E" tinggi={0.22} n={5} />;
        })}
    </g>
  );
  const apiAdatNode = apiAdat > 0 && apiAdat < 1 ? <GarisApi x0={ADAT.x0} x1={ADAT.x1} y={yApi} s={skalaMerauke(yApi) * 0.9} f={f} kuat={0.9} seed={5} id={`${id}-ga`} /> : null;

  // benda + rumput + tokoh, urut kedalaman
  type Lapis = { y: number; node: React.ReactNode };
  const lapis: Lapis[] = [];
  for (const r of RUMPUT_M) {
    if (!tampak(r.x - 40, r.x + 40)) continue;
    if (r.x > -1100 && r.x < 360 && r.y > 935 && r.y < 1215) continue; // dasar rawa tanpa rumput
    if (apiAdat > 0 && r.x > ADAT.x0 - 60 && r.x < ADAT.x1 + 60 && r.y > ADAT.y0 - 40 && r.y < yApi) continue; // sudah hangus
    lapis.push({ y: r.y, node: <Rumput key={`r${r.seed}`} x={r.x} y={r.y} s={Math.min(1.7, skalaMerauke(r.y))} seed={r.seed} warna={r.seed % 4 ? '#CDA75C' : '#B88F4A'} tinggi={0.55} /> });
  }
  BENDA_M.forEach(([jenis, x, y, t, seed]) => {
    if (!tampak(x - 500, x + 500)) return;
    const s = skalaMerauke(y);
    lapis.push({ y, node: jenis === 'musamus' ? <Musamus key={`b${seed}`} x={x} y={y} s={s} tinggi={t} seed={seed} /> : <KayuPutih key={`b${seed}`} x={x} y={y} s={s} tinggi={t} seed={seed} kering={0.3} /> });
  });
  isi.forEach((t, i) => {
    const s = t.s ?? skalaMerauke(t.y);
    const pxM = s * 200;
    const W = (t.lebar ?? 0.5) * pxM;
    lapis.push({
      y: t.y + 0.5,
      node: (
        <g key={`i${i}`}>
          {!t.tanpaBayangan && (
            <BayanganJatuh c={c} kaki={[t.x, t.y]} tinggiPx={(t.tinggi ?? 1.65) * pxM} id={`${id}-bt${i}`} kuat={0.3 - 0.15 * asap}>
              {t.gambar({ x: t.x, y: t.y, s })}
            </BayanganJatuh>
          )}
          <KontakKaki c={c} x={t.x} y={t.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${i}`} />
          {t.polos ? (
            t.gambar({ x: t.x, y: t.y, s })
          ) : (
            <TokohBercahaya c={c} x={t.x} y={t.y} s={s} tinggi={t.tinggi ?? 1.65} id={`${id}-tc${i}`}>
              {t.gambar({ x: t.x, y: t.y, s })}
            </TokohBercahaya>
          )}
        </g>
      ),
    });
  });
  if (apiAdatNode) lapis.push({ y: yApi + 1, node: <g key="api">{apiAdatNode}</g> });
  lapis.sort((a, b) => a.y - b.y);

  return (
    <g data-lokasi="merauke-2d">
      {langit}
      <g transform={kamT(kam)}>
        {asapNode}
        {hutan}
        {tanah}
        {rawa}
        {adat}
        {kabur > 0 ? (
          <g>
            <defs>
              <filter id={`${id}-kb`}>
                <feGaussianBlur stdDeviation={kabur} />
              </filter>
            </defs>
            <g filter={`url(#${id}-kb)`}>{lapis.map((l) => l.node)}</g>
          </g>
        ) : (
          lapis.map((l) => l.node)
        )}
      </g>
      <rect x="-100" y="-100" width="1280" height="2120" fill={campur('#E8D4B4', '#C99A72', asap)} opacity={(0.08 + 0.3 * asap).toFixed(3)} pointerEvents="none" />
      <NadaAkhir c={c} id={id} />
    </g>
  );
}

// ================================================================ 2. bukaan lahan dilihat dari atas
/** bidang tanah dari ketinggian: X lateral, z kedalaman (1 = bawah layar, makin besar makin jauh); titik hilang (540, 430) */
export const ATAS = { vx: 540, vy: 300, k: 1620 };
export const proyAtas = (X: number, z: number) => ({ x: ATAS.vx + (X * 900) / z, y: ATAS.vy + ATAS.k / z });
const kuadAtas = (X0: number, X1: number, z0: number, z1: number) => {
  const a = proyAtas(X0, z0),
    b = proyAtas(X1, z0),
    cc = proyAtas(X1, z1),
    d = proyAtas(X0, z1);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}L${cc.x.toFixed(1)} ${cc.y.toFixed(1)}L${d.x.toFixed(1)} ${d.y.toFixed(1)}Z`;
};
/** zona bukaan (koordinat X, z) + titik label di layar (ZONA_ATAS) */
const ZONA = {
  pangan: { X0: -2.6, X1: -0.15, z0: 1.38, z1: 2.6, warna: '#9A8A6C' },
  tebu: { X0: 0.15, X1: 2.8, z0: 1.38, z1: 2.8, warna: '#A9B26A' },
  kayu: { X0: -5.2, X1: -0.15, z0: 2.75, z1: 5.6, warna: '#9C8160' },
  sawit: { X0: 0.15, X1: 5.4, z0: 2.95, z1: 6.2, warna: '#A49470' },
};
const tengahZona = (z: { X0: number; X1: number; z0: number; z1: number }) => proyAtas((z.X0 + z.X1) / 2, (z.z0 + z.z1) / 2);
export const ZONA_ATAS = {
  pangan: tengahZona(ZONA.pangan),
  tebu: tengahZona(ZONA.tebu),
  kayu: tengahZona(ZONA.kayu),
  sawit: tengahZona(ZONA.sawit),
};
/** pembakaran adat kecil di savana (bawah kiri), pembanding skala */
export const ADAT_ATAS = proyAtas(-0.36, 1.13);
/** titik api di bukaan (X, z, ukuran) */
const API_ATAS: [number, number, number][] = [
  [-2.1, 1.8, 1],
  [-1.0, 2.3, 0.9],
  [-0.5, 1.6, 1.1],
  [0.9, 1.9, 1],
  [2.2, 2.5, 0.9],
  [-4.0, 3.4, 1.1],
  [-2.4, 4.2, 1],
  [-1.1, 5.0, 0.9],
  [1.5, 3.9, 1],
  [3.0, 4.8, 1],
  [4.5, 5.6, 0.9],
  [0.7, 6.0, 0.8],
];
/** titik panas: 46 di zona proyek/konsesi + 39 di luarnya (hutan, savana) ≈ proporsi Walhi Jan–Okt 2026 (54% di zona);
 *  urutan diselang-seling supaya titik di luar zona juga muncul sejak awal */
const TITIK_ZONA: [number, number][] = Array.from({ length: 46 }, (_, i) => {
  const zona = [ZONA.pangan, ZONA.tebu, ZONA.kayu, ZONA.sawit][i % 4];
  return [zona.X0 + rnd(i, 80) * (zona.X1 - zona.X0), zona.z0 + rnd(i, 81) * (zona.z1 - zona.z0)];
});
const TITIK_LUAR: [number, number][] = Array.from({ length: 39 }, (_, i) => {
  const kiri = i % 2 === 0;
  if (i % 7 === 3) return [-2.4 + rnd(i, 85) * 4.6, 1.04 + rnd(i, 86) * 0.28]; // savana bawah
  return [kiri ? -8.4 + rnd(i, 83) * 3.0 : 5.7 + rnd(i, 83) * 3.2, 2.2 + rnd(i, 84) * 8];
});
const TITIK_ATAS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let a = 0,
    b = 0;
  for (let i = 0; i < TITIK_ZONA.length + TITIK_LUAR.length; i++) {
    if (b >= TITIK_LUAR.length || (a < TITIK_ZONA.length && a * TITIK_LUAR.length <= b * TITIK_ZONA.length)) out.push(TITIK_ZONA[a++]);
    else out.push(TITIK_LUAR[b++]);
  }
  return out;
})();

export function MeraukeAtas2D({ f = 0, kam = { zoom: 1, cx: 540, cy: 960 }, asap = 0.6, titik = 0, api = 1, id = 'mra' }: { f?: number; kam?: Kam2D; asap?: number; titik?: number; api?: number; id?: string }) {
  const c = cahayaMerauke(asap);
  const [l0, l1] = langitWarna(asap);
  const garisPetak = (z: typeof ZONA.pangan, kolom: number, baris: number, warna: string) => (
    <g>
      {Array.from({ length: kolom + 1 }, (_, i) => {
        const X = z.X0 + (i / kolom) * (z.X1 - z.X0);
        const a = proyAtas(X, z.z0),
          b = proyAtas(X, z.z1);
        return <path key={`k${i}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={warna} strokeWidth="3" opacity=".7" />;
      })}
      {Array.from({ length: baris + 1 }, (_, i) => {
        const zz = z.z0 + (i / baris) * (z.z1 - z.z0);
        const a = proyAtas(z.X0, zz),
          b = proyAtas(z.X1, zz);
        return <path key={`b${i}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={warna} strokeWidth="3" opacity=".7" />;
      })}
    </g>
  );
  // isi tiap zona
  const pangan = (
    <g data-zona="food-estate">
      <path d={kuadAtas(ZONA.pangan.X0, ZONA.pangan.X1, ZONA.pangan.z0, ZONA.pangan.z1)} fill="#8E7F63" />
      {Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => {
          const X0 = ZONA.pangan.X0 + (i / 4) * (ZONA.pangan.X1 - ZONA.pangan.X0),
            X1 = X0 + (ZONA.pangan.X1 - ZONA.pangan.X0) / 4;
          const z0 = ZONA.pangan.z0 + (j / 3) * (ZONA.pangan.z1 - ZONA.pangan.z0),
            z1 = z0 + (ZONA.pangan.z1 - ZONA.pangan.z0) / 3;
          const air = (i + j) % 2 === 0;
          return <path key={`${i}-${j}`} d={kuadAtas(X0 + 0.05, X1 - 0.05, z0 + 0.03, z1 - 0.03)} fill={air ? '#9DB3AE' : '#A79373'} opacity={air ? 0.9 : 1} />;
        }),
      )}
      {garisPetak(ZONA.pangan, 4, 3, '#6E604A')}
    </g>
  );
  const tebu = (
    <g data-zona="tebu">
      <path d={kuadAtas(ZONA.tebu.X0, ZONA.tebu.X1, ZONA.tebu.z0, ZONA.tebu.z1)} fill="#8E8452" />
      {Array.from({ length: 22 }, (_, i) => {
        const X = ZONA.tebu.X0 + ((i + 0.5) / 22) * (ZONA.tebu.X1 - ZONA.tebu.X0);
        const a = proyAtas(X, ZONA.tebu.z0 + 0.05),
          b = proyAtas(X, ZONA.tebu.z1 - 0.05);
        return <path key={i} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={i % 2 ? '#B9C277' : '#A3AE62'} strokeWidth={10} strokeLinecap="round" />;
      })}
      {/* sebagian tebu sudah dibakar */}
      <path d={kuadAtas(1.6, 3.4, 2.4, 3.8)} fill="#3F3832" opacity=".75" />
    </g>
  );
  const kayu = (
    <g data-zona="konsesi-kayu">
      <path d={kuadAtas(ZONA.kayu.X0, ZONA.kayu.X1, ZONA.kayu.z0, ZONA.kayu.z1)} fill="#9A7F5E" />
      {garisPetak(ZONA.kayu, 4, 3, '#7A6248')}
      {Array.from({ length: 12 }, (_, i) => {
        const X = ZONA.kayu.X0 + (((i % 4) + 0.5) / 4) * (ZONA.kayu.X1 - ZONA.kayu.X0);
        const z = ZONA.kayu.z0 + ((Math.floor(i / 4) + 0.5) / 3) * (ZONA.kayu.z1 - ZONA.kayu.z0);
        const p = proyAtas(X, z);
        const w = 600 / z;
        return <rect key={i} x={p.x - w / 2} y={p.y - w * 0.12} width={w} height={w * 0.2} rx={w * 0.08} fill="#6A4F38" />;
      })}
    </g>
  );
  const sawit = (
    <g data-zona="sawit">
      <path d={kuadAtas(ZONA.sawit.X0, ZONA.sawit.X1, ZONA.sawit.z0, ZONA.sawit.z1)} fill="#A08E68" />
      {Array.from({ length: 9 }, (_, i) =>
        Array.from({ length: 6 }, (_, j) => {
          const X = ZONA.sawit.X0 + ((i + 0.5) / 9) * (ZONA.sawit.X1 - ZONA.sawit.X0);
          const z = ZONA.sawit.z0 + ((j + 0.5) / 6) * (ZONA.sawit.z1 - ZONA.sawit.z0);
          const p = proyAtas(X, z),
            r = 70 / z;
          return (
            <g key={`${i}-${j}`} transform={`translate(${p.x} ${p.y})`}>
              {Array.from({ length: 6 }, (_, k) => (
                <path key={k} d={`M0 0L${Math.cos((k / 6) * Math.PI * 2) * r} ${Math.sin((k / 6) * Math.PI * 2) * r * 0.55}`} stroke="#6E8A4E" strokeWidth={Math.max(1, r * 0.3)} strokeLinecap="round" />
              ))}
            </g>
          );
        }),
      )}
    </g>
  );
  // jalan tanah lurus + truk/ekskavator kecil
  const jalan = (
    <g data-detail="jalan-tanah">
      <path d={kuadAtas(-0.14, 0.14, 1.05, 30)} fill="#C9A77A" />
      <path d={`M${proyAtas(0, 1.05).x} ${proyAtas(0, 1.05).y}L${proyAtas(0, 30).x} ${proyAtas(0, 30).y}`} stroke="#B08E62" strokeWidth="5" strokeDasharray="30 40" />
      <Ekskavator x={proyAtas(-1.0, 2.7).x} y={proyAtas(-1.0, 2.7).y} s={0.28} dir={-1} lengan={0.7} kotor={0.6} />
      <Ekskavator x={proyAtas(-3.5, 5.0).x} y={proyAtas(-3.5, 5.0).y} s={0.16} dir={1} lengan={0.3} kotor={0.6} />
    </g>
  );
  // savana di bawah (z 1..1.85) dengan musamus kecil + pembakaran adat kecil
  const savana = (
    <g data-detail="savana-bawah">
      <path d={kuadAtas(-4, 4, 1.0, 1.36)} fill="#CBA55E" />
      <path d={kuadAtas(-9, -2.65, 1.36, 2.8)} fill="#C49E5C" />
      <path d={kuadAtas(2.85, 9, 1.36, 2.9)} fill="#C49E5C" />
      {Array.from({ length: 70 }, (_, i) => {
        const X = -3.8 + rnd(i, 90) * 7.6,
          z = 1.02 + rnd(i, 91) * 0.32;
        if (Math.abs(X) < 0.2) return null;
        const p = proyAtas(X, z),
          h = 26 / z;
        return <path key={i} d={`M${p.x} ${p.y}l${-h * 0.2} ${-h}M${p.x} ${p.y}l${h * 0.25} ${-h * 0.8}`} stroke="#B48D4A" strokeWidth="3" />;
      })}
      {[[-0.5, 1.05], [-0.95, 1.2], [0.42, 1.1], [0.55, 1.28], [-0.25, 1.3]].map(([X, z], i) => {
        const p = proyAtas(X, z);
        return <Musamus key={i} x={p.x} y={p.y} s={0.12 / z} tinggi={3} seed={40 + i} />;
      })}
      <path d={`M${ADAT_ATAS.x - 46} ${ADAT_ATAS.y - 4}Q${ADAT_ATAS.x} ${ADAT_ATAS.y - 16} ${ADAT_ATAS.x + 46} ${ADAT_ATAS.y - 4}L${ADAT_ATAS.x + 40} ${ADAT_ATAS.y + 8}L${ADAT_ATAS.x - 40} ${ADAT_ATAS.y + 8}Z`} fill="#4B4038" opacity=".8" />
      <GarisApi x0={ADAT_ATAS.x - 40} x1={ADAT_ATAS.x + 40} y={ADAT_ATAS.y + 8} s={0.22} f={f} kuat={0.9} seed={3} asap={false} id={`${id}-ga`} />
    </g>
  );
  const apiNode = (
    <g>
      {API_ATAS.map(([X, z, u], i) => {
        const p = proyAtas(X, z);
        return (
          <g key={i}>
            <KepulanAsap x={p.x} y={p.y - 6} s={(0.9 / z) * u} f={f + i * 11} tinggi={1700 / z + 260} condong={0.45} kuat={0.85 * api} warna="#5E5650" warnaAtas={campur('#B8A698', '#A88E7A', asap)} seed={i * 5} id={`${id}-as${i}`} />
            <Api x={p.x} y={p.y} s={(1.15 / z) * u} f={f + i * 5} kuat={api} seed={i} lebar={1.4} id={`${id}-ap${i}`} />
          </g>
        );
      })}
    </g>
  );
  const n = Math.round(klamp(titik) * TITIK_ATAS.length);
  const titikNode = (
    <g data-detail="titik-panas">
      {TITIK_ATAS.map(([X, z], i) => {
        const p = proyAtas(X, z);
        const muncul = klamp(titik * TITIK_ATAS.length - i);
        return i < n + 1 ? <TitikPanas key={i} x={p.x} y={p.y} r={22 / Math.sqrt(z)} f={f + i * 4} muncul={muncul} /> : null;
      })}
    </g>
  );
  return (
    <g data-lokasi="merauke-atas-2d">
      <g transform={kamT(kam)}>
        <defs>
          <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={l0} />
            <stop offset="1" stopColor={l1} />
          </linearGradient>
          <linearGradient id={`${id}-dt`} x1="0" y1={ATAS.vy} x2="0" y2="1920" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={campur('#CDBA9C', '#C7A487', asap)} />
            <stop offset="0.35" stopColor="#BFA27A" />
            <stop offset="1" stopColor="#C29E62" />
          </linearGradient>
        </defs>
        <rect x="-1500" y="-900" width="4080" height={ATAS.vy + 900 + 20} fill={`url(#${id}-lg)`} />
        <MatahariKabur x={240} y={180} r={46} kuat={0.4 + 0.6 * asap} id={`${id}-mk`} />
        <rect x="-1500" y={ATAS.vy} width="4080" height="2400" fill={`url(#${id}-dt)`} />
        {/* hutan tersisa di kejauhan, gundul di tengah */}
        <DeretHutan x0={-1500} x1={2580} y={ATAS.vy + 8} h={36} warna={campur('#7D8E7F', '#9C8A74', asap)} seed={4} celah={[[300, 820]]} />
        <path d={kuadAtas(-9, -5.2, 2.8, 30)} fill="#7F9479" opacity=".9" />
        <path d={kuadAtas(5.4, 12, 2.95, 30)} fill="#7F9479" opacity=".9" />
        <path d={kuadAtas(-5.2, 5.4, 6.2, 30)} fill="#8A9A7E" opacity=".8" />
        {kayu}
        {sawit}
        {pangan}
        {tebu}
        {jalan}
        {savana}
        {apiNode}
        {titikNode}
      </g>
      <rect x="-100" y="-100" width="1280" height="2120" fill={campur('#E8D4B4', '#C99A72', asap)} opacity={(0.1 + 0.28 * asap).toFixed(3)} pointerEvents="none" />
      <NadaAkhir c={c} id={id} />
    </g>
  );
}

// ================================================================ 3. satu petak bukaan dari dekat
/** tumpukan kayu dalam petak (x, y kaki); urutan = urutan menyala (belakang dulu) */
export const KAYU_PETAK: [number, number][] = [
  [180, 900],
  [640, 905],
  [980, 915],
  [-120, 960],
  [420, 975],
  [860, 990],
  [120, 1080],
  [700, 1110],
  [-80, 1250],
  [430, 1290],
  [960, 1320],
];
export const PETAK = { cakrawala: 800, mata: 2.2 };
export const skalaPetak = (y: number) => Math.max(0.03, (y - PETAK.cakrawala) / (PETAK.mata * 200));

export function Petak2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  asap = 0.7,
  bakar = 1,
  drone,
  isi = [],
  id = 'ptk',
}: {
  f?: number;
  kam?: Kam2D;
  asap?: number;
  /** 0..1: tumpukan menyala bergiliran dari yang paling jauh */
  bakar?: number;
  drone?: React.ReactNode;
  isi?: IsiM[];
  id?: string;
}) {
  const c = cahayaMerauke(asap);
  const [l0, l1] = langitWarna(asap);
  const HZ = PETAK.cakrawala;
  const nyala = (i: number) => klamp(bakar * KAYU_PETAK.length * 1.15 - i);
  type Lapis = { y: number; node: React.ReactNode };
  const lapis: Lapis[] = [];
  KAYU_PETAK.forEach(([x, y], i) => {
    const s = skalaPetak(y) * 0.95;
    lapis.push({ y, node: <TumpukanKayu key={`k${i}`} x={x} y={y} s={s} f={f + i * 9} bakar={nyala(i) * (0.85 + 0.15 * rnd(i, 3))} seed={i * 3} id={`${id}-k${i}`} /> });
  });
  // tunggul
  Array.from({ length: 14 }, (_, i) => {
    const x = -300 + rnd(i, 100) * 1700,
      y = 860 + Math.pow(rnd(i, 101), 1.3) * 900;
    const s = skalaPetak(y);
    lapis.push({
      y,
      node: (
        <g key={`t${i}`}>
          <ellipse cx={x + 10 * s} cy={y} rx={40 * s} ry={8 * s} fill="#3A2F2A" opacity=".25" />
          <path d={`M${x - 26 * s} ${y}L${x - 22 * s} ${y - 46 * s}L${x + 22 * s} ${y - 50 * s}L${x + 26 * s} ${y}Z`} fill="#7A5B40" />
          <ellipse cx={x} cy={y - 48 * s} rx={22 * s} ry={7 * s} fill="#CFAE80" />
        </g>
      ),
    });
  });
  isi.forEach((t, i) => {
    const s = t.s ?? skalaPetak(t.y);
    lapis.push({
      y: t.y + 0.5,
      node: (
        <g key={`i${i}`}>
          <KontakKaki c={c} x={t.x} y={t.y} rx={(t.lebar ?? 0.5) * s * 120} ry={(t.lebar ?? 0.5) * s * 26} id={`${id}-kk${i}`} />
          {t.polos ? (
            t.gambar({ x: t.x, y: t.y, s })
          ) : (
            <TokohBercahaya c={c} x={t.x} y={t.y} s={s} tinggi={t.tinggi ?? 1.65} id={`${id}-tc${i}`}>
              {t.gambar({ x: t.x, y: t.y, s })}
            </TokohBercahaya>
          )}
        </g>
      ),
    });
  });
  lapis.sort((a, b) => a.y - b.y);
  return (
    <g data-lokasi="merauke-petak-2d">
      <g transform={kamT(kam)}>
        <defs>
          <linearGradient id={`${id}-lg`} x1="0" y1="-300" x2="0" y2={HZ} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={l0} />
            <stop offset="1" stopColor={l1} />
          </linearGradient>
          <linearGradient id={`${id}-tn`} x1="0" y1={HZ} x2="0" y2="2000" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A89276" />
            <stop offset="1" stopColor="#8E7154" />
          </linearGradient>
        </defs>
        <rect x="-1200" y="-900" width="3480" height={HZ + 920} fill={`url(#${id}-lg)`} />
        <MatahariKabur x={300} y={260} r={50} kuat={0.5 + 0.5 * asap} id={`${id}-mk`} />
        {/* tepi hutan yang tersisa (kiri jauh) dan batang-batang tumbang */}
        <DeretHutan x0={-1200} x1={260} y={HZ + 4} h={150} warna={campur('#6E8370', '#8E7D68', asap)} seed={9} />
        <DeretHutan x0={1100} x1={2300} y={HZ + 4} h={110} warna={campur('#7A8D7A', '#958470', asap)} seed={12} />
        <rect x="-1200" y={HZ} width="3480" height="1400" fill={`url(#${id}-tn)`} />
        {/* jejak roda ekskavator dalam perspektif */}
        {[-1, 1].map((k) => (
          <path key={k} d={`M${540 + k * 30} ${HZ + 4}L${540 + k * 40} ${HZ + 4}L${540 + k * 560} 2000L${540 + k * 470} 2000Z`} fill="#7E644A" opacity=".22" />
        ))}
        {[260, 330, 420, 540].map((y, i) => (
          <path key={i} d={`M-1200 ${HZ + y}L2300 ${HZ + y + 6}`} stroke="#9A8064" strokeWidth={2 + i} opacity=".35" />
        ))}
        <Ekskavator x={1240} y={1010} s={skalaPetak(1010)} dir={-1} lengan={0.65} kotor={0.6} />
        {KAYU_PETAK.map(([x, y], i) =>
          nyala(i) > 0.2 ? (
            <KepulanAsap key={i} x={x} y={y - 120 * skalaPetak(y)} s={skalaPetak(y) * 0.9} f={f + i * 7} tinggi={900} condong={0.5} kuat={0.8 * nyala(i)} warna="#4E4743" warnaAtas={campur('#A8988C', '#9C8574', asap)} seed={i * 11} id={`${id}-as${i}`} />
          ) : null,
        )}
        {lapis.map((l) => l.node)}
        {drone}
      </g>
      <rect x="-100" y="-100" width="1280" height="2120" fill={campur('#E2C6A2', '#B98B66', asap)} opacity={(0.12 + 0.25 * asap).toFixed(3)} pointerEvents="none" />
      <NadaAkhir c={c} id={id} />
    </g>
  );
}

// ================================================================ 4. hutan lebat (bayangan)
/** cendrawasih kecil bertengger (kepala kuning, bulu hias jingga menjuntai) */
export function Cendrawasih({ x, y, s = 1, f = 0, dir = 1 }: { x: number; y: number; s?: number; f?: number; dir?: number }) {
  const g = Math.sin(f * 0.18) * 6;
  return (
    <g data-detail="cendrawasih" transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M-10 10Q${-40 - i * 8} ${70 + i * 6} ${-30 - i * 14 + g} ${140 + i * 12}`} stroke={i % 2 ? '#F2B441' : '#F7CF6B'} strokeWidth={7 - i * 0.6} fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx="0" cy="0" rx="28" ry="20" fill="#7A3A2C" />
      <path d="M14 -10Q34 -26 40 -10Q34 4 16 4Z" fill="#F2D24A" />
      <path d="M8 -4Q20 -2 30 2" stroke="#2E7D6B" strokeWidth="6" />
      <circle cx="32" cy="-12" r="3" fill="#1E1A18" />
      <path d="M40 -12L52 -9L40 -6Z" fill="#9BA5A8" />
      <path d="M-6 18L-10 34M6 18L4 34" stroke="#5A4A40" strokeWidth="3" />
    </g>
  );
}

export function HutanLebat2D({ f = 0, kam = { zoom: 1, cx: 540, cy: 960 }, hujan = 0.7, burung = true, id = 'htn' }: { f?: number; kam?: Kam2D; hujan?: number; burung?: boolean; id?: string }) {
  const lapisPohon = (n: number, y: number, h: number, warna: string, seed: number, lebar: number) =>
    Array.from({ length: n }, (_, i) => {
      const x = -300 + (i / (n - 1)) * 1700 + (rnd(i, seed) - 0.5) * 80;
      const w = lebar * (0.8 + 0.4 * rnd(i, seed + 1));
      return (
        <g key={`${seed}-${i}`}>
          <rect x={x - w * 0.08} y={y - h} width={w * 0.16} height={h + 600} fill={campur(warna, '#2A3A30', 0.25)} />
          <ellipse cx={x} cy={y - h} rx={w * 0.55} ry={w * 0.32} fill={warna} />
          <ellipse cx={x - w * 0.3} cy={y - h + w * 0.12} rx={w * 0.4} ry={w * 0.25} fill={warna} />
          <ellipse cx={x + w * 0.32} cy={y - h + w * 0.1} rx={w * 0.38} ry={w * 0.24} fill={warna} />
        </g>
      );
    });
  return (
    <g data-lokasi="hutan-lebat-2d">
      <g transform={kamT(kam)}>
        <defs>
          <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B9D3CB" />
            <stop offset="1" stopColor="#E3EEE6" />
          </linearGradient>
          <linearGradient id={`${id}-kabut`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EAF2EE" stopOpacity="0" />
            <stop offset="0.5" stopColor="#EAF2EE" stopOpacity=".55" />
            <stop offset="1" stopColor="#EAF2EE" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="-600" y="-600" width="2300" height="3200" fill={`url(#${id}-lg)`} />
        {lapisPohon(9, 620, 120, '#8DB3A0', 1, 330)}
        <rect x="-600" y="420" width="2300" height="420" fill={`url(#${id}-kabut)`} />
        {lapisPohon(7, 860, 260, '#5E9479', 2, 420)}
        <rect x="-600" y="700" width="2300" height="380" fill={`url(#${id}-kabut)`} opacity=".7" />
        {lapisPohon(5, 1120, 520, '#3F7A5E', 3, 520)}
        {/* sulur menjuntai */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = -100 + i * 150 + rnd(i, 7) * 40;
          return <path key={i} d={`M${x} -100Q${x + 30} ${300 + rnd(i, 8) * 200} ${x - 10} ${700 + rnd(i, 9) * 300}`} stroke="#4E8A5F" strokeWidth="7" fill="none" />;
        })}
        {/* lantai hutan: lumut + pakis */}
        <rect x="-600" y="1300" width="2300" height="1300" fill="#3D6B4E" />
        <path d="M-600 1320Q200 1260 1700 1330L1700 1400L-600 1400Z" fill="#4E8460" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = -150 + i * 115,
            y = 1500 + (i % 3) * 160,
            r = 140 + (i % 4) * 40;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              {Array.from({ length: 7 }, (_, k) => {
                const a = -Math.PI * (0.15 + (k / 6) * 0.7);
                return <path key={k} d={`M0 0Q${Math.cos(a) * r * 0.5} ${Math.sin(a) * r * 0.8} ${Math.cos(a) * r} ${Math.sin(a) * r * 0.6}`} stroke={k % 2 ? '#6FAE74' : '#5C9A63'} strokeWidth="16" fill="none" strokeLinecap="round" />;
              })}
            </g>
          );
        })}
        {/* batang besar depan + dahan untuk cendrawasih */}
        <path d="M820 -200Q860 600 800 2200L1120 2200Q1020 600 1000 -200Z" fill="#4C3B2E" />
        <path d="M830 -200Q860 600 820 2200L870 2200Q900 600 880 -200Z" fill="#6A5240" opacity=".6" />
        <path d="M840 700Q600 680 420 760" stroke="#4C3B2E" strokeWidth="34" fill="none" strokeLinecap="round" />
        {burung && <Cendrawasih x={560} y={712} s={1.15} f={f} dir={-1} />}
        {/* tetes daun basah */}
        {Array.from({ length: 10 }, (_, i) => (
          <ellipse key={i} cx={-60 + i * 130} cy={1310 + (i % 3) * 40} rx="16" ry="5" fill="#CFE8DA" opacity=".6" />
        ))}
      </g>
      {/* hujan (layar) */}
      {hujan > 0 && (
        <g opacity={hujan} pointerEvents="none">
          {Array.from({ length: 90 }, (_, i) => {
            const x = (rnd(i, 200) * 1300 + f * 3) % 1300 - 110;
            const y = ((rnd(i, 201) * 2100 + f * (38 + rnd(i, 202) * 14)) % 2100) - 120;
            return <path key={i} d={`M${x} ${y}l-10 52`} stroke="#E6F2F2" strokeWidth="3" opacity=".55" strokeLinecap="round" />;
          })}
        </g>
      )}
      <rect x="-100" y="-100" width="1280" height="2120" fill="#DDEFE6" opacity=".12" pointerEvents="none" />
    </g>
  );
}
