// Lokasi bersama: Gang Melati, PANGGUNG FLAT 2D dari depan (v1, 12 Nov 2026), dengan cahaya 2D (shared/film/v1/Cahaya2D.tsx,
// disetujui pengguna 11 Nov 2026). Dibuat untuk "Kritik Bukan Utang Jasa" v5. Pengguna 12 Nov 2026: "sekarang buat kritik
// itu versi terbaru", sesudah aturan diganti ("3d sebagai optional jika diminta oleh ku") dan cahaya 2D disetujui.
// Isi dan warna sama dengan Gang Melati 3D (jalan-kampung v3). Warung Makmur sama dengan warung-makmur/v1, ditambah bangku
// panjang di teras. Deret fasad satu dunia, dari kiri ke kanan:
//   rumah ibu no. 10 (x -1880..-330): dinding hijau pucat, pohon mangga, halaman berpot, pagar besi + gerbang terbuka
//   Warung Makmur   (x -300..990):   papan merah, terpal biru, rak sachet, etalase, galon, tabung gas, bangku
//   rumah tetangga  (x 990..2130):   dinding abu biru, jendela jalusi, AC, pot
//   tiang listrik   (x 2160)
//   Taman Baca      (x 2190..3520):  pendopo terbuka, rak buku, papan nama TAMAN BACA MELATI
// Di depan: tepi teras, selokan, kanstin, jalan aspal; lubang berisi genangan di depan warung (x 800, y 1760) yang
// memantulkan warung (atau tambalan aspal baru bila `tambal`).
// Skala: dinding 227 px/m (kaki dinding y 1180). Tokoh/benda: skala rig s = skala2D(y kaki) (garis cakrawala y 833,
// sama dengan contoh banding: Yan di y 1505 → s 2,43; teras depan y 1212 → s 1,37).
// Kamera { zoom, cx, cy }: titik dunia (cx, cy) di tengah layar; langit bergeser lebih lambat (parallax).
// `kabur` = lensa (px layar): seluruh dunia kabur kecuali isi bertanda `fokus`.
// Pakai: <GangMelati2D f kam isi waktu kabur tambal pantulan id />
import React from 'react';
import { Cloud, WallGrain, Plant, Bookshelf, ACUnit, PowerPole, Bird } from '../../_detail/v1/Detail';
import { CAHAYA_2D, Terang, GradasiDinding, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, Pantulan, NadaAkhir, geserDinding, tepiBayanganLantai, type Cahaya2D } from '../../../film/v1/Cahaya2D';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Titik2D = { x: number; y: number; s: number };
export type Isi2D = {
  x: number;
  y: number;
  /** skala rig; bawaan skala2D(y) */
  s?: number;
  gambar: (p: Titik2D) => React.ReactNode;
  /** jarak ke dinding belakang (m) → bayangan naik ke dinding */
  jarakDinding?: number;
  tinggi?: number;
  lebar?: number;
  /** seluruh badan di tempat teduh */
  teduh?: boolean;
  /** tetap tajam saat `kabur` */
  fokus?: boolean;
  /** tanpa cahaya badan (benda kecil) */
  polos?: boolean;
  /** tanpa bayangan jatuh */
  tanpaBayangan?: boolean;
  /** geser urutan gambar (px dunia, + = lebih depan) */
  urut?: number;
};
export const GANG2D = {
  kakiDinding: 1180,
  pxM: 227,
  terasDepan: 1222,
  jalan: 1282,
  cakrawala: 833,
  lubang: { x: 800, y: 1760 },
  gerbangIbu: { x: -1045, y: 1240 },
  bangku: { x0: 130, x1: 470, y: 1211 },
  teras: { warung: [-300, 990], ibu: [-1880, -330], tetangga: [990, 2130], tamanBaca: [2190, 3520] },
};
/** Skala rig untuk kaki di y (dunia). */
export const skala2D = (y: number) => Math.max(0.2, (y - GANG2D.cakrawala) / 276.4);
/** Titik dunia → layar untuk kamera `kam`. */
export const layar2D = (kam: Kam2D, x: number, y: number) => ({ x: 540 + (x - kam.cx) * kam.zoom, y: 960 + (y - kam.cy) * kam.zoom });
export const kamAntara2D = (a: Kam2D, b: Partial<Kam2D>, t: number): Kam2D => ({
  zoom: a.zoom + ((b.zoom ?? a.zoom) - a.zoom) * t,
  cx: a.cx + ((b.cx ?? a.cx) - a.cx) * t,
  cy: a.cy + ((b.cy ?? a.cy) - a.cy) * t,
});

const SACHET = ['#E7899A', '#F1C977', '#7E8FB0', '#95B8A2', '#E1A93B', '#C24E4E'];
const LANGIT = { siang: ['#9DC8DD', '#E2EFF0'] as [string, string], sore: ['#B9B6CF', '#F6D7B2'] as [string, string] };
const Y0 = GANG2D.kakiDinding,
  PX = GANG2D.pxM,
  TD = GANG2D.terasDepan;
const yM = (m: number) => Y0 - m * PX;
const acak = (n: number) => {
  const v = Math.sin(n * 91.7 + 37.3) * 43758.5;
  return v - Math.floor(v);
};

type Lapis = { y: number; x0: number; x1: number; node: React.ReactNode; bay?: { kaki: [number, number]; tinggiPx: number; siluet: React.ReactNode; kuat?: number; jarakPx?: number } };

export function GangMelati2D({
  f = 0,
  kam = { zoom: 1, cx: 540, cy: 960 },
  isi = [],
  waktu = 'siang',
  cahaya,
  kabur = 0,
  tambal = false,
  pantulan = true,
  id = 'gm',
}: {
  f?: number;
  kam?: Kam2D;
  isi?: Isi2D[];
  waktu?: 'siang' | 'sore';
  cahaya?: Cahaya2D;
  kabur?: number;
  tambal?: boolean;
  pantulan?: boolean;
  id?: string;
}) {
  const c = cahaya ?? CAHAYA_2D[waktu];
  const sore = waktu === 'sore';
  const bay = c.suasana.bayangan ?? '#2B2946';
  const T = `translate(540 960) scale(${kam.zoom.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  // batas pandang (dunia) untuk membuang benda ber-filter di luar layar
  const vx0 = kam.cx - 540 / kam.zoom - 250,
    vx1 = kam.cx + 540 / kam.zoom + 250;
  const tampak = (a: number, b: number) => b >= vx0 && a <= vx1;

  // ---------- langit (parallax 0,4)
  const zl = 1 + (kam.zoom - 1) * 0.4;
  const L = LANGIT[waktu];
  const langit = (
    <g transform={`translate(540 960) scale(${zl.toFixed(4)}) translate(${(-(540 + (kam.cx - 540) * 0.4)).toFixed(1)} ${(-(960 + (kam.cy - 960) * 0.4)).toFixed(1)})`}>
      <defs>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={L[0]} />
          <stop offset="1" stopColor={L[1]} />
        </linearGradient>
      </defs>
      <rect x="-2400" y="-1600" width="5600" height="2400" fill={`url(#${id}-lg)`} />
      <rect x="-2400" y="760" width="5600" height="2000" fill={L[1]} />
      {sore && <circle cx="1500" cy="180" r="70" fill="#FFE2B0" opacity=".75" />}
      <Cloud x={-600 + f * 0.22} y={120} s={1.1} o={0.8} />
      <Cloud x={70 + f * 0.25} y={190} s={1.25} o={0.9} />
      <Cloud x={720 + f * 0.18} y={110} s={0.8} o={0.75} />
      <Cloud x={1500 + f * 0.2} y={60} s={1.0} o={0.8} />
      <Cloud x={2300 + f * 0.24} y={170} s={1.15} o={0.85} />
      <Bird x={300 + f * 1.4} y={140 + 10 * Math.sin(f * 0.07)} f={f} />
      <Bird x={360 + f * 1.4} y={170 + 10 * Math.sin(f * 0.07 + 1)} f={f + 9} />
    </g>
  );

  // ---------- pembantu fasad
  const teritis = (x0: number, x1: number, yAtap: number, yLis: number, yBawah: number, genteng: string) => (
    <g>
      <path d={`M${x0 - 40} ${yLis}L${x0 + 30} ${yAtap}L${x1 - 30} ${yAtap}L${x1 + 40} ${yLis}Z`} fill={genteng} />
      {Array.from({ length: Math.max(1, Math.floor((yLis - yAtap) / 22)) }, (_, k) => (
        <path key={k} d={`M${x0 - 30 + k * 6} ${yLis - 14 - k * 22}H${x1 + 30 - k * 6}`} stroke="#000" strokeWidth="3" opacity=".12" />
      ))}
      <Terang c={c} n="atas" d={`M${x0 - 40} ${yLis}L${x0 + 30} ${yAtap}L${x1 - 30} ${yAtap}L${x1 + 40} ${yLis}Z`} />
      <rect x={x0 - 44} y={yLis} width={x1 - x0 + 88} height="20" fill="#EFE7D8" />
      <Terang c={c} n="depan" kotak={[x0 - 44, yLis, x1 - x0 + 88, 20]} />
      <rect x={x0 - 30} y={yLis + 20} width={x1 - x0 + 60} height={yBawah - yLis - 20} fill="#8E7A66" />
      <Terang c={c} n="bawah" kotak={[x0 - 30, yLis + 20, x1 - x0 + 60, yBawah - yLis - 20]} />
    </g>
  );
  /** bayangan teritis (menonjol `tonjol` m) di dinding x0..x1 mulai yAtas */
  const bayTeritis = (x0: number, x1: number, yAtas: number, tonjol: number, kuat = 0.26) => {
    const [gx, gy] = geserDinding(c, tonjol * PX);
    const h = Math.min(Y0 - yAtas, gy);
    if (h <= 0) return null;
    const a = Math.max(x0, x0 + gx),
      b = Math.min(x1, x1 + gx);
    return <path d={`M${a} ${yAtas}H${b}V${yAtas + h - 30}l-30 30H${a}Z`} fill={bay} opacity={kuat} />;
  };
  const dinding = (x0: number, x1: number, yAtas: number, warna: string, seed: number) => (
    <g>
      <rect x={x0} y={yAtas} width={x1 - x0} height={Y0 - yAtas} fill={warna} />
      <WallGrain x={x0} y={yAtas} w={x1 - x0} h={Y0 - yAtas} o={0.05} seed={seed} />
      <Terang c={c} n="depan" kotak={[x0, yAtas, x1 - x0, Y0 - yAtas]} />
      <GradasiDinding c={c} x={x0} y={yAtas} w={x1 - x0} h={Y0 - yAtas} id={`${id}-gd${seed}`} />
      <rect x={x0} y={Y0 - 28} width={x1 - x0} height="28" fill="#000" opacity=".12" />
    </g>
  );
  const jendela = (x: number, w: number, yA: number, yB: number, tirai: string, jalusi = false) => (
    <g>
      <rect x={x - 14} y={yA - 14} width={w + 28} height={yB - yA + 28} fill="#F2EBDD" />
      <Terang c={c} n="depan" kotak={[x - 14, yA - 14, w + 28, yB - yA + 28]} />
      <rect x={x} y={yA} width={w} height={yB - yA} fill={sore ? '#B7C0C8' : '#A9CBD6'} />
      <path d={`M${x} ${yA}L${x + w * 0.45} ${yA}L${x} ${yA + (yB - yA) * 0.7}Z`} fill="#FFFFFF" opacity=".25" />
      <rect x={x + w * 0.55} y={yA} width={w * 0.45} height={yB - yA} fill={tirai} opacity=".9" />
      {jalusi && Array.from({ length: Math.floor((yB - yA) / 22) }, (_, k) => <path key={k} d={`M${x} ${yA + 12 + k * 22}h${w}`} stroke="#E9E3D6" strokeWidth="6" opacity=".7" />)}
      <path d={`M${x + w / 2} ${yA}V${yB}`} stroke="#F2EBDD" strokeWidth="10" />
      <rect x={x - 24} y={yB + 10} width={w + 48} height="16" fill="#E2D9C8" />
      <rect x={x - 24} y={yB + 26} width={w + 48} height="6" fill="#000" opacity=".15" />
    </g>
  );

  // ---------- A. rumah ibu (no. 10)
  const rumahIbu = (
    <g data-bagian="rumah-ibu">
      {teritis(-1880, -330, 250, 400, 452, '#A9573F')}
      {dinding(-1880, -330, 452, '#BFD2B4', 11)}
      {bayTeritis(-1880, -330, 452, 0.55)}
      {jendela(-1760, 300, 640, 900, '#E7C9A9')}
      {jendela(-760, 300, 640, 900, '#E7C9A9')}
      {/* pintu + nomor */}
      <rect x="-1250" y="640" width="200" height={Y0 - 640} fill="#EFE7D8" />
      <rect x="-1236" y="654" width="172" height={Y0 - 654} fill="#8B6648" />
      <rect x="-1220" y="680" width="66" height="200" rx="4" fill="#7A5B3E" />
      <rect x="-1146" y="680" width="66" height="200" rx="4" fill="#7A5B3E" />
      <rect x="-1220" y="910" width="140" height="220" rx="4" fill="#7A5B3E" />
      <circle cx="-1084" cy="930" r="8" fill="#E1C17A" />
      <Terang c={c} n="depan" kotak={[-1250, 640, 200, Y0 - 640]} />
      <rect x="-1010" y="690" width="70" height="52" rx="6" fill="#2F5146" />
      <text x="-975" y="728" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill="#F3E9DF">10</text>
      {/* pohon mangga di halaman (tajuk menutup atap) + bayangannya di dinding */}
      {(() => {
        const [gx, gy] = geserDinding(c, 1.0 * PX);
        const tajuk = [[-1620, 470, 190], [-1480, 540, 150], [-1760, 560, 150], [-1600, 330, 140], [-1450, 400, 120]] as const;
        return (
          <g>
            <g opacity=".22" transform={`translate(${gx.toFixed(0)} ${gy.toFixed(0)})`}>
              <clipPath id={`${id}-pk`}>
                <rect x="-1880" y="452" width="1550" height={Y0 - 452} />
              </clipPath>
              <g clipPath={`url(#${id}-pk)`}>
                {tajuk.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={bay} />)}
              </g>
            </g>
            <path d="M-1640 1196L-1630 700Q-1626 640 -1600 600L-1590 1196Z" fill="#7A5B3E" />
            <path d="M-1632 760q-60 -60 -110 -70M-1610 720q50 -50 110 -60" stroke="#7A5B3E" strokeWidth="18" strokeLinecap="round" fill="none" />
            {tajuk.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#6E9C78' : '#5B8A66'} />)}
            {tajuk.map(([x, y, r], i) => <circle key={'t' + i} cx={x + r * 0.25} cy={y - r * 0.3} r={r * 0.55} fill={c.matahari.warna ?? '#FFE3B3'} opacity=".16" />)}
            {[[-1700, 520], [-1540, 610], [-1450, 450]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="12" ry="16" fill="#C9B24A" />)}
          </g>
        );
      })()}
    </g>
  );

  // ---------- B. Warung Makmur (= warung-makmur v1, dibatasi -300..990, + atap)
  const panelTop = yM(2.5);
  const papan = [0.5, 1.05, 1.6];
  const fasadWarung = (
    <g data-bagian="warung">
      <path d="M-340 352L-260 250L950 250L1030 352Z" fill="#9A5A42" />
      <Terang c={c} n="atas" d="M-340 352L-260 250L950 250L1030 352Z" />
      <rect x="-300" y="352" width="1290" height="22" fill="#EFE7D8" />
      <rect x="-300" y="374" width="1290" height={yM(3.3) - 374} fill="#9C8670" />
      <Terang c={c} n="bawah" kotak={[-300, 374, 1290, yM(3.3) - 374]} />
      <rect x="-300" y={yM(3.3)} width="1290" height={Y0 - yM(3.3)} fill="#CDB894" />
      <WallGrain x={-300} y={yM(3.3)} w={1290} h={Y0 - yM(3.3)} o={0.05} seed={3} />
      <Terang c={c} n="depan" kotak={[-300, yM(3.3), 1290, Y0 - yM(3.3)]} />
      <GradasiDinding c={c} x={-300} y={yM(3.3)} w={1290} h={Y0 - yM(3.3)} id={`${id}-gdw`} />
      <rect x="30" y={panelTop} width="945" height={Y0 - panelTop} fill="#4A3F36" />
      {papan.map((v, j) => (
        <g key={j}>
          <rect x="50" y={yM(v) - 11} width="910" height="11" fill="#8B6648" />
          <rect x="50" y={yM(v)} width="910" height="4" fill="#3A302A" opacity=".5" />
          {Array.from({ length: 11 }, (_, k) => {
            const h = (0.16 + ((k + j) % 3) * 0.05) * PX;
            return <rect key={k} x={68 + k * 81} y={yM(v) - 11 - h} width="40" height={h} rx="3" fill={SACHET[(k * 5 + j * 2) % 6]} />;
          })}
        </g>
      ))}
      {[70, 505, 940].map((x) => (
        <rect key={x} x={x - 7} y={panelTop + 12} width="14" height={Y0 - panelTop - 20} fill="#7A5B3E" />
      ))}
      <Terang c={c} n="depan" kotak={[30, panelTop, 945, Y0 - panelTop]} />
      <rect x="-60" y={yM(3.15)} width="1035" height={0.55 * PX} fill="#C24E4E" />
      <text x="458" y={yM(3.15) + 0.55 * PX * 0.5 + 33} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="92" letterSpacing="5" fill="#F3E9DF">
        WARUNG MAKMUR
      </text>
      <Terang c={c} n="depan" kotak={[-60, yM(3.15), 1035, 0.55 * PX]} />
    </g>
  );
  const yTempel = yM(2.75) + 4,
    yUjung = yTempel + 62;
  const [tgx, tgy] = geserDinding(c, 1.35 * PX);
  const tepiLantai = tepiBayanganLantai(c, 2.3, 1.35);
  const yTepiLantai = Y0 + Math.max(0, tepiLantai / 1.35) * (TD - Y0);
  const xTepi = 1000 + tgx * ((Y0 - yTempel) / tgy);
  const bayanganTerpal = `M-290 ${yTempel}L1000 ${yTempel}L${Math.min(990, xTepi)} ${Y0}L${Math.min(990, xTepi + 40)} ${yTepiLantai}L-290 ${yTepiLantai}Z`;
  const terpal = (
    <g>
      <path d={`M-290 ${yTempel}L1000 ${yTempel}L1000 ${yUjung}L-290 ${yUjung}Z`} fill="#3F7FA8" />
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={-250 + k * 160} y={yTempel} width="70" height={yUjung - yTempel} fill="#356E94" />
      ))}
      <Terang c={c} n="bawah" d={`M-290 ${yTempel}L1000 ${yTempel}L1000 ${yUjung}L-290 ${yUjung}Z`} />
      <rect x="-290" y={yUjung - 5} width="1290" height="7" fill="#6FA6C8" />
      {Array.from({ length: 7 }, (_, k) => {
        const x = 30 + k * 142,
          pj = (0.62 + (k % 3) * 0.12) * PX * 1.18;
        return (
          <g key={k}>
            <rect x={x} y={yUjung} width="38" height={pj} fill={SACHET[(k * 7) % 6]} />
            {Array.from({ length: Math.floor(pj / 26) }, (_, i) => (
              <rect key={i} x={x} y={yUjung + 12 + i * 26} width="38" height="3" fill="#FFFFFF" opacity=".35" />
            ))}
          </g>
        );
      })}
    </g>
  );

  // ---------- C. rumah tetangga
  const rumahTetangga = (
    <g data-bagian="rumah-tetangga">
      {teritis(990, 2130, 230, 392, 440, '#8F5A44')}
      {dinding(990, 2130, 440, '#B9C3C4', 21)}
      {bayTeritis(990, 2130, 440, 0.5)}
      {jendela(1080, 300, 620, 880, '#9DB3D6', true)}
      {jendela(1760, 300, 620, 880, '#9DB3D6', true)}
      <rect x="1470" y="630" width="190" height={Y0 - 630} fill="#EFE7D8" />
      <rect x="1484" y="644" width="162" height={Y0 - 644} fill="#6E7F8A" />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M1500 ${700 + k * 90}h130`} stroke="#5E6E78" strokeWidth="8" />)}
      <circle cx="1630" cy="930" r="8" fill="#E1C17A" />
      <Terang c={c} n="depan" kotak={[1470, 630, 190, Y0 - 630]} />
      <g transform="translate(1380 470) scale(0.9)">
        <ACUnit x={0} y={0} />
      </g>
      <rect x="1700" y="694" width="64" height="48" rx="6" fill="#2F5146" />
      <text x="1732" y="730" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="32" fill="#F3E9DF">11</text>
    </g>
  );

  // ---------- D. Taman Baca (pendopo terbuka)
  const tamanBaca = (
    <g data-bagian="taman-baca">
      <rect x="2190" y="420" width="1330" height={Y0 - 420} fill="#E8D7B8" />
      <WallGrain x={2190} y={420} w={1330} h={Y0 - 420} o={0.05} seed={31} />
      <Terang c={c} n="depan" kotak={[2190, 420, 1330, Y0 - 420]} />
      {/* mural matahari + daun */}
      <circle cx="3240" cy="640" r="90" fill="#F1C977" opacity=".8" />
      {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M3240 640l${Math.cos(k) * 150} ${Math.sin(k) * 150}`} stroke="#F1C977" strokeWidth="14" opacity=".6" />)}
      <path d="M2960 980q60 -160 160 -200q-40 120 -160 200Z" fill="#95B8A2" />
      <path d="M3330 1000q-40 -150 -150 -190q20 120 150 190Z" fill="#7FA889" />
      <g transform="translate(2300 690) scale(1.15)">
        <Bookshelf x={0} y={0} w={320} rows={4} />
      </g>
      <g transform="translate(2700 690) scale(1.15)">
        <Bookshelf x={0} y={0} w={200} rows={4} />
      </g>
      {/* bayangan atap pendopo di dinding dalam (dalam: selalu teduh di atas) */}
      <rect x="2190" y="420" width="1330" height="220" fill={bay} opacity=".22" />
      {bayTeritis(2190, 3520, 640, 1.6, 0.18)}
      {/* atap + papan nama */}
      <path d="M2150 430L2230 250L3480 250L3560 430Z" fill="#B5654A" />
      {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M${2170 + k * 10} ${410 - k * 24}H${3540 - k * 10}`} stroke="#000" strokeWidth="3" opacity=".12" />)}
      <Terang c={c} n="atas" d="M2150 430L2230 250L3480 250L3560 430Z" />
      <rect x="2150" y="430" width="1410" height="96" fill="#3E7F6A" />
      <text x="2855" y="496" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="56" letterSpacing="6" fill="#F3E9DF">TAMAN BACA MELATI</text>
      <Terang c={c} n="depan" kotak={[2150, 430, 1410, 96]} />
      <rect x="2150" y="526" width="1410" height="22" fill="#8E7A66" />
      <Terang c={c} n="bawah" kotak={[2150, 526, 1410, 22]} />
    </g>
  );

  // ---------- ujung dunia (dinding polos di luar deret)
  const ujung = (
    <g>
      {teritis(-2700, -1910, 280, 420, 466, '#9A6A52')}
      {dinding(-2700, -1910, 466, '#D9CBB4', 41)}
      {teritis(3550, 4300, 270, 410, 456, '#8F5A44')}
      {dinding(3550, 4300, 456, '#C9B8C8', 42)}
      <rect x="-1910" y="430" width="30" height={Y0 - 430} fill="#6F6A63" />
      <rect x="-330" y="430" width="30" height={Y0 - 430} fill="#6F6A63" />
      <rect x="2130" y="430" width="60" height={Y0 - 430} fill="#6F6A63" />
      <rect x="3520" y="430" width="30" height={Y0 - 430} fill="#6F6A63" />
    </g>
  );

  const fasad = (
    <g>
      {ujung}
      {rumahIbu}
      {fasadWarung}
      {rumahTetangga}
      {tamanBaca}
    </g>
  );

  // ---------- lantai
  const ubin = (x0: number, x1: number, warna: string, garis: string, lebar = 110) => (
    <g>
      <rect x={x0} y={Y0} width={x1 - x0} height={TD - Y0} fill={warna} />
      {Array.from({ length: Math.floor((x1 - x0) / lebar) }, (_, k) => (
        <path key={k} d={`M${x0 + k * lebar} ${Y0}L${x0 - 30 + k * (lebar + 6)} ${TD}`} stroke={garis} strokeWidth="2" />
      ))}
      <Terang c={c} n="atas" kotak={[x0, Y0, x1 - x0, TD - Y0]} />
    </g>
  );
  const kerikil = Array.from({ length: 260 }, (_, k) => {
    const y = GANG2D.jalan + 30 + acak(k * 5 + 1) * 1100;
    return <ellipse key={k} cx={-2600 + acak(k * 5 + 2) * 6900} cy={y} rx={4 + acak(k * 5 + 3) * 10 * ((y - 1200) / 500)} ry={2 + acak(k * 5 + 4) * 4} fill={acak(k * 5 + 5) > 0.5 ? '#6E6962' : '#9A948B'} opacity=".55" />;
  });
  const lantai = (
    <g>
      {ubin(-2700, -1880, '#CFC7B4', '#B9B09C')}
      {ubin(-1880, -330, '#CBC3A6', '#B5AD90', 90)}
      {ubin(-330, 990, '#D8CFC2', '#BFB5A6')}
      {ubin(990, 2130, '#D3CCC0', '#BCB4A6', 120)}
      <rect x="2130" y={Y0} width="60" height={TD - Y0} fill="#9C958A" />
      {ubin(2190, 3520, '#C9A97E', '#B08F64', 70)}
      {ubin(3520, 4300, '#CFC7B4', '#B9B09C')}
      <rect x="-2700" y={TD} width="7000" height="18" fill="#BDB3A2" />
      <Terang c={c} n="depan" kotak={[-2700, TD, 7000, 18]} />
      <rect x="-2700" y={TD + 18} width="7000" height="24" fill="#4E4A45" />
      <rect x="-2700" y={TD + 42} width="7000" height="10" fill="#C9C2B6" />
      <rect x="-2700" y={TD + 52} width="7000" height="8" fill="#A79F94" />
      <rect x="-2700" y={GANG2D.jalan} width="7000" height="1600" fill="#857F77" />
      {kerikil}
      <path d="M120 1640l60 22l40 -8l70 30M1500 1560l50 12l30 26M-900 1700l70 -10l40 20" stroke="#5E5953" strokeWidth="3" fill="none" opacity=".6" />
      <Terang c={c} n="atas" kotak={[-2700, GANG2D.jalan, 7000, 1600]} />
    </g>
  );

  // ---------- lubang + genangan (atau tambalan)
  const Lb = GANG2D.lubang;
  const tepiLubang = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2,
      j = 1 + 0.12 * Math.sin(i * 2.7);
    return `${(Lb.x + Math.cos(a) * 300 * j).toFixed(0)} ${(Lb.y + Math.sin(a) * 150 * j).toFixed(0)}`;
  });
  const air = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2,
      j = 1 + 0.1 * Math.sin(i * 2.7 + 1);
    return `${(Lb.x + 10 + Math.cos(a) * 250 * j).toFixed(0)} ${(Lb.y + 8 + Math.sin(a) * 118 * j).toFixed(0)}`;
  });
  const lubang = tambal ? (
    <g data-detail="tambalan">
      <path d={`M${tepiLubang.join('L')}Z`} fill="#56514C" transform={`translate(${Lb.x} ${Lb.y}) scale(1.08) translate(${-Lb.x} ${-Lb.y})`} />
      <path d={`M${tepiLubang.join('L')}Z`} fill="none" stroke="#3F3B37" strokeWidth="6" opacity=".6" transform={`translate(${Lb.x} ${Lb.y}) scale(1.08) translate(${-Lb.x} ${-Lb.y})`} />
      {Array.from({ length: 24 }, (_, k) => <circle key={k} cx={Lb.x - 260 + acak(k + 300) * 520} cy={Lb.y - 110 + acak(k + 400) * 220} r={3 + acak(k + 500) * 4} fill="#6B655E" opacity=".7" />)}
    </g>
  ) : (
    <g data-detail="lubang">
      <path d={`M${tepiLubang.join('L')}Z`} fill="#6B655E" />
      <path d={`M${tepiLubang.join('L')}Z`} fill="none" stroke="#9E978D" strokeWidth="10" opacity=".7" />
      {pantulan && tampak(Lb.x - 320, Lb.x + 320) ? (
        <Pantulan sumbuY={1150} klip={`M${air.join('L')}Z`} id={`${id}-pt`} kuat={0.6} langit={L}>
          {fasadWarung}
          {terpal}
        </Pantulan>
      ) : (
        <path d={`M${air.join('L')}Z`} fill={L[0]} opacity=".85" />
      )}
    </g>
  );

  // ---------- benda tetap (urut kedalaman bersama tokoh)
  const lapis: Lapis[] = [];
  const yAlas = (d: number) => Y0 + (d / 1.35) * (TD - Y0);
  // warung: etalase, galon, tabung gas [x, lebar, tinggi m, jarak dinding m, warna, atas]
  const bendaWarung: [number, number, number, number, string, string][] = [
    [45, 560, 0.45, 0.3, '#8B6648', '#A57E5B'],
    [600, 74, 0.48, 0.35, '#9CC7D8', '#C3E0EA'],
    [716, 74, 0.48, 0.35, '#9CC7D8', '#C3E0EA'],
    [850, 70, 0.58, 0.4, '#5BAA6A', '#7CC48A'],
  ];
  bendaWarung.forEach(([x, w, h, d, warna, atas], i) => {
    const yb = yAlas(d),
      hp = h * PX * 1.05;
    lapis.push({
      y: yb,
      x0: x,
      x1: x + w,
      node: (
        <g>
          <rect x={x} y={yb - hp} width={w} height={hp} fill={warna} />
          <Terang c={c} n="depan" kotak={[x, yb - hp, w, hp]} teduh={d < tepiLantai} />
          <rect x={x} y={yb - hp - 10} width={w} height="10" fill={atas} />
          <Terang c={c} n="atas" kotak={[x, yb - hp - 10, w, 10]} teduh={d < tepiLantai} />
          {i === 0 && (
            <g>
              <rect x="62" y={yb - hp - 10 - 0.55 * PX} width="526" height={0.55 * PX} fill="#CFE3EA" opacity=".5" />
              {Array.from({ length: 6 }, (_, k) => (
                <rect key={k} x={92 + k * 82} y={yb - hp - 10 - 0.55 * PX + 30 + (k % 2) * 30} width="44" height={70 - (k % 2) * 30} fill="#E7899A" opacity=".8" />
              ))}
              <path d={`M80 ${yb - hp - 12}L170 ${yb - hp - 0.55 * PX}`} stroke="#FFFFFF" strokeWidth="10" opacity=".35" />
            </g>
          )}
        </g>
      ),
      bay: { kaki: [x + w / 2, yb], tinggiPx: h * PX, siluet: <rect x={x} y={yb - hp} width={w} height={hp} fill="#000" />, kuat: d < tepiLantai ? 0.12 : 0.3, jarakPx: d * PX },
    });
  });
  // bangku panjang di teras warung (dudukan 0,45 m)
  {
    const { x0, x1, y } = GANG2D.bangku;
    const sb = skala2D(y) * 200,
      hd = 0.45 * sb;
    const kaki = [x0 + 20, x0 + 60, x1 - 60, x1 - 20];
    lapis.push({
      y,
      x0,
      x1,
      node: (
        <g data-benda="bangku">
          {kaki.map((x, k) => <rect key={k} x={x - 7} y={y - hd} width="14" height={hd} fill={k === 1 || k === 2 ? '#5E4632' : '#6E5038'} />)}
          <rect x={x0 + 12} y={y - hd * 0.35} width={x1 - x0 - 24} height="8" fill="#6E5038" />
          <rect x={x0} y={y - hd - 14} width={x1 - x0} height="14" fill="#B08A64" />
          <Terang c={c} n="atas" kotak={[x0, y - hd - 14, x1 - x0, 14]} />
          <rect x={x0} y={y - hd} width={x1 - x0} height="22" fill="#8B6648" />
          <Terang c={c} n="depan" kotak={[x0, y - hd, x1 - x0, 22]} />
        </g>
      ),
      bay: { kaki: [(x0 + x1) / 2, y], tinggiPx: hd, siluet: <rect x={x0} y={y - hd - 14} width={x1 - x0} height={hd + 14} fill="#000" />, kuat: 0.3, jarakPx: 1.0 * PX },
    });
  }
  // pot di halaman ibu dan teras tetangga
  (
    [
      [-1450, 1200, 0.95, 2],
      [-880, 1198, 0.9, 0],
      [-560, 1202, 1.0, 1],
      [1050, 1200, 0.9, 1],
      [1700, 1199, 0.85, 2],
      [2080, 1201, 0.95, 0],
      [3460, 1200, 1.0, 1],
    ] as const
  ).forEach(([x, y, s, kind]) => {
    const node = <Plant x={x} y={y} s={s} kind={kind} />;
    lapis.push({ y, x0: x - 60, x1: x + 60, node, bay: { kaki: [x, y], tinggiPx: 150 * s, siluet: node, kuat: 0.3, jarakPx: (y - Y0) * 2 } });
  });
  // pagar besi + gerbang rumah ibu (tepi depan halaman)
  {
    const yp = TD + 2,
      sp = skala2D(yp) * 200;
    const hPagar = 1.05 * sp,
      hTiang = 1.3 * sp;
    const ruas = (a: number, b: number) => (
      <g>
        {Array.from({ length: Math.floor((b - a) / 34) + 1 }, (_, k) => <rect key={k} x={a + k * 34} y={yp - hPagar} width="9" height={hPagar} fill="#35574B" />)}
        <rect x={a} y={yp - hPagar} width={b - a} height="14" fill="#2F5146" />
        <rect x={a} y={yp - hPagar * 0.45} width={b - a} height="10" fill="#2F5146" />
        <rect x={a} y={yp - 16} width={b - a} height="10" fill="#2F5146" />
      </g>
    );
    const tiang = (x: number) => (
      <g>
        <rect x={x} y={yp - hTiang} width="46" height={hTiang} fill="#E2D9C8" />
        <Terang c={c} n="depan" kotak={[x, yp - hTiang, 46, hTiang]} />
        <rect x={x - 6} y={yp - hTiang - 14} width="58" height="16" fill="#CFC4AE" />
        <rect x={x + 32} y={yp - hTiang} width="14" height={hTiang} fill="#000" opacity=".12" />
      </g>
    );
    const g0 = GANG2D.gerbangIbu.x;
    lapis.push({
      y: yp,
      x0: -1880,
      x1: -330,
      node: (
        <g data-benda="pagar-ibu">
          {ruas(-1880, g0 - 160)}
          {ruas(g0 + 160, -340)}
          {/* daun gerbang terbuka ke dalam halaman */}
          <path d={`M${g0 + 114} ${yp}L${g0 + 40} ${yp - 26}L${g0 + 40} ${yp - 26 - hPagar * 0.95}L${g0 + 114} ${yp - hPagar}Z`} fill="#2F5146" opacity=".9" />
          {Array.from({ length: 4 }, (_, k) => <path key={k} d={`M${g0 + 100 - k * 18} ${yp - 4 - k * 6}V${yp - hPagar + 4 - k * 6}`} stroke="#4E7A6A" strokeWidth="5" />)}
          {tiang(g0 - 160)}
          {tiang(g0 + 114)}
        </g>
      ),
    });
  }
  // tiang listrik di antara rumah tetangga dan Taman Baca
  lapis.push({
    y: GANG2D.jalan + 4,
    x0: 2100,
    x1: 2230,
    node: <PowerPole x={2160} ground={GANG2D.jalan + 4} top={60} wiresTo={[-700, 3800]} />,
  });

  // isi (tokoh/benda bergerak)
  const isiS = isi.map((t, i) => ({ ...t, s: t.s ?? skala2D(t.y), k: i }));
  const tajam = isiS.filter((t) => t.fokus && kabur > 0);
  const kaburIsi = isiS.filter((t) => !(t.fokus && kabur > 0));

  const bayanganTokoh = isiS.map((t) => {
    if (t.teduh || t.tanpaBayangan) return null;
    const H = (t.tinggi ?? 1.65) * t.s * 200;
    return (
      <BayanganJatuh key={t.k} c={c} kaki={[t.x, t.y]} tinggiPx={H} id={`${id}-bt${t.k}`} dindingY={t.jarakDinding !== undefined ? Y0 : undefined} jarakDindingPx={t.jarakDinding !== undefined ? t.jarakDinding * PX : undefined}>
        {t.gambar({ x: t.x, y: t.y, s: t.s })}
      </BayanganJatuh>
    );
  });
  const badan = (t: (typeof isiS)[number]) => {
    const W = (t.lebar ?? 0.5) * t.s * 200;
    return (
      <g key={`b${t.k}`}>
        {!t.tanpaBayangan && <KontakKaki c={c} x={t.x} y={t.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${t.k}`} />}
        {t.polos ? (
          t.gambar({ x: t.x, y: t.y, s: t.s })
        ) : (
          <TokohBercahaya c={c} x={t.x} y={t.y} s={t.s} tinggi={t.tinggi ?? 1.65} teduh={t.teduh} id={`${id}-tc${t.k}`}>
            {t.gambar({ x: t.x, y: t.y, s: t.s })}
          </TokohBercahaya>
        )}
      </g>
    );
  };
  const lapisTampak = lapis.filter((b) => tampak(b.x0, b.x1));
  const urutan: { y: number; node: React.ReactNode }[] = [
    ...lapisTampak.map((b) => ({ y: b.y, node: b.node })),
    ...kaburIsi.map((t) => ({ y: t.y + (t.urut ?? 0), node: badan(t) })),
  ].sort((a, b) => a.y - b.y);
  const bayanganBenda = lapisTampak
    .filter((b) => b.bay)
    .map((b, i) => (
      <BayanganJatuh key={i} c={c} kaki={b.bay!.kaki} tinggiPx={b.bay!.tinggiPx} id={`${id}-bb${i}`} dindingY={Y0} jarakDindingPx={b.bay!.jarakPx} kuat={b.bay!.kuat ?? 0.3}>
        {b.bay!.siluet}
      </BayanganJatuh>
    ));

  const dunia = (
    <g transform={T}>
      {fasad}
      {tampak(-300, 1000) && <path d={bayanganTerpal} fill={bay} opacity=".3" />}
      <AmbientKaki c={c} x0={-2700} x1={4300} y={Y0} tinggi={110} id={`${id}-ak`} />
      {tampak(-300, 1000) && <AmbientKaki c={c} x0={-290} x1={1000} y={Y0} tinggi={60} yAtas={yUjung} id={`${id}-aw`} />}
      {lantai}
      {tampak(Lb.x - 320, Lb.x + 320) && lubang}
      {bayanganBenda}
      {bayanganTokoh}
      {tampak(-300, 1000) && terpal}
      {urutan.map((u, i) => (
        <React.Fragment key={i}>{u.node}</React.Fragment>
      ))}
    </g>
  );

  return (
    <g data-lokasi="gang-melati-2d">
      {kabur > 0 ? (
        <>
          <defs>
            <filter id={`${id}-kb`} filterUnits="userSpaceOnUse" x="-40" y="-40" width="1160" height="2000" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={kabur.toFixed(2)} />
            </filter>
          </defs>
          <g filter={`url(#${id}-kb)`}>
            {langit}
            {dunia}
          </g>
          <g transform={T}>{tajam.map((t) => badan(t))}</g>
        </>
      ) : (
        <>
          {langit}
          {dunia}
        </>
      )}
      <NadaAkhir c={c} id={id} />
    </g>
  );
}
