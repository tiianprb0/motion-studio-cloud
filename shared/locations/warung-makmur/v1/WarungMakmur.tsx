// Lokasi bersama: Warung Makmur di Gang Melati, PANGGUNG FLAT 2D dari depan (v1, 11 Nov 2026).
// Dibuat untuk contoh banding 3D vs 2D (pengguna 11 Nov 2026: "3d sebagai optional jika diminta oleh ku ... coba buat 5 detik
// perbedaan antara 3d dan 2d yang kamu perbaharui fungsi pencahayaannya"). Isi dan warna sama dengan Warung Makmur di
// jalan-kampung v3 (3D): papan WARUNG MAKMUR, terpal biru, rak sachet, etalase, galon, tabung gas, bangku, teras ubin,
// selokan, jalan aspal, lubang berisi genangan.
// Cahaya: modul cahaya 2D (shared/film/v1/Cahaya2D.tsx, disetujui pengguna 11 Nov 2026). Satu arah matahari menentukan terang-gelap bidang,
// bayangan terpal di dinding, bayangan jatuh benda dan tokoh (di lantai lalu naik ke dinding), cahaya di badan tokoh,
// ambient di kaki dinding, dan pantulan warung di genangan.
// Skala: dinding 227 px per meter (kaki dinding y 1180). Tokoh: isi [{ x, y (kaki), s (skala rig), gambar, jarakDinding (m),
// tinggi, lebar, teduh }]. Kamera: { zoom, cx, cy } (dorong/geser), langit bergerak lebih lambat (parallax).
// Pakai: <WarungMakmur f kam isi cahaya id />
import React from 'react';
import { Cloud, WallGrain } from '../../_detail/v1/Detail';
import { CAHAYA_2D, Terang, GradasiDinding, AmbientKaki, BayanganJatuh, TokohBercahaya, KontakKaki, Pantulan, NadaAkhir, geserDinding, tepiBayanganLantai, type Cahaya2D } from '../../../film/v1/Cahaya2D';

export type Kam2D = { zoom: number; cx: number; cy: number };
export type Isi2D = { x: number; y: number; s: number; gambar: (p: { x: number; y: number; s: number }) => React.ReactNode; jarakDinding?: number; tinggi?: number; lebar?: number; teduh?: boolean };
export const WARUNG2D = { kakiDinding: 1180, pxM: 227, terasDepan: 1222, jalan: 1282, lubang: { x: 800, y: 1760 } };
const SACHET = ['#E7899A', '#F1C977', '#7E8FB0', '#95B8A2', '#E1A93B', '#C24E4E'];
const LANGIT: [string, string] = ['#9DC8DD', '#E2EFF0'];
const Y0 = WARUNG2D.kakiDinding,
  PX = WARUNG2D.pxM;
const yM = (m: number) => Y0 - m * PX; // tinggi di dinding (m) → y layar

export function WarungMakmur({ f = 0, kam = { zoom: 1, cx: 540, cy: 960 }, isi = [], cahaya = CAHAYA_2D.siang, id = 'wm' }: { f?: number; kam?: Kam2D; isi?: Isi2D[]; cahaya?: Cahaya2D; id?: string }) {
  const c = cahaya;
  const T = (z = kam.zoom) => `translate(540 960) scale(${z.toFixed(4)}) translate(${(-kam.cx).toFixed(1)} ${(-kam.cy).toFixed(1)})`;
  // langit: parallax setengah
  const zl = 1 + (kam.zoom - 1) * 0.4;
  const langit = (
    <g transform={`translate(540 960) scale(${zl.toFixed(4)}) translate(${(-(540 + (kam.cx - 540) * 0.4)).toFixed(1)} ${(-(960 + (kam.cy - 960) * 0.4)).toFixed(1)})`}>
      <defs>
        <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LANGIT[0]} />
          <stop offset="1" stopColor={LANGIT[1]} />
        </linearGradient>
      </defs>
      <rect x="-400" y="-400" width="1900" height="1000" fill={`url(#${id}-lg)`} />
      <Cloud x={70 + f * 0.25} y={190} s={1.25} o={0.9} />
      <Cloud x={720 + f * 0.18} y={110} s={0.8} o={0.75} />
    </g>
  );

  // ---------- fasad warung (dipakai ulang di pantulan genangan)
  const panelTop = yM(2.5);
  const papan = [0.5, 1.05, 1.6];
  const fasad = (
    <g>
      {/* rumah tetangga kanan + atapnya */}
      <rect x="985" y="-200" width="400" height={Y0 + 200} fill="#B9C3C4" />
      <Terang c={c} n="depan" kotak={[985, -200, 400, Y0 + 200]} />
      <path d="M840 -200L1040 260L1100 260L900 -200Z" fill="#8F5A44" />
      <Terang c={c} n="bawah" d="M840 -200L1040 260L1100 260L900 -200Z" />
      {/* lisplang + teritis (dilihat dari bawah) */}
      <rect x="-300" y="352" width="1290" height="22" fill="#EFE7D8" />
      <rect x="-300" y="374" width="1290" height={yM(3.3) - 374} fill="#9C8670" />
      <Terang c={c} n="bawah" kotak={[-300, 374, 1290, yM(3.3) - 374]} />
      {/* dinding */}
      <rect x="-300" y={yM(3.3)} width="1290" height={Y0 - yM(3.3)} fill="#CDB894" />
      <WallGrain x={-300} y={yM(3.3)} w={1290} h={Y0 - yM(3.3)} o={0.05} seed={3} />
      <Terang c={c} n="depan" kotak={[-300, yM(3.3), 1290, Y0 - yM(3.3)]} />
      <GradasiDinding c={c} x={-300} y={yM(3.3)} w={1290} h={Y0 - yM(3.3)} id={`${id}-gd`} />
      {/* rak: panel belakang, papan, tiang, renceng sachet */}
      <rect x="30" y={panelTop} width="975" height={Y0 - panelTop} fill="#4A3F36" />
      {papan.map((v, j) => (
        <g key={j}>
          <rect x="50" y={yM(v) - 11} width="940" height="11" fill="#8B6648" />
          <rect x="50" y={yM(v)} width="940" height="4" fill="#3A302A" opacity=".5" />
          {Array.from({ length: 11 }, (_, k) => {
            const h = (0.16 + ((k + j) % 3) * 0.05) * PX;
            return <rect key={k} x={68 + k * 84} y={yM(v) - 11 - h} width="40" height={h} rx="3" fill={SACHET[(k * 5 + j * 2) % 6]} />;
          })}
        </g>
      ))}
      {[70, 520, 968].map((x) => (
        <rect key={x} x={x - 7} y={panelTop + 12} width="14" height={Y0 - panelTop - 20} fill="#7A5B3E" />
      ))}
      <Terang c={c} n="depan" kotak={[30, panelTop, 975, Y0 - panelTop]} />
      {/* papan nama */}
      <rect x="-60" y={yM(3.15)} width="1065" height={0.55 * PX} fill="#C24E4E" />
      <text x="470" y={yM(3.15) + 0.55 * PX * 0.5 + 33} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="92" letterSpacing="5" fill="#F3E9DF">
        WARUNG MAKMUR
      </text>
      <Terang c={c} n="depan" kotak={[-60, yM(3.15), 1065, 0.55 * PX]} />
    </g>
  );

  // ---------- terpal (bawahnya terlihat dari bawah) + bayangannya di dinding dan teras
  const yTempel = yM(2.75) + 4,
    yUjung = yTempel + 62;
  const [gx, gy] = geserDinding(c, 1.35 * PX);
  const tepiLantai = tepiBayanganLantai(c, 2.3, 1.35); // m dari dinding
  const yTepiLantai = Y0 + Math.max(0, tepiLantai / 1.35) * (WARUNG2D.terasDepan - Y0);
  const bayanganTerpal = `M-300 ${yTempel}L1300 ${yTempel}L${1300 + gx * ((Y0 - yTempel) / gy)} ${Y0}L${1300 + gx * ((Y0 - yTempel) / gy) + 40} ${yTepiLantai}L-300 ${yTepiLantai}Z`;
  const terpal = (
    <g>
      <path d={`M-300 ${yTempel}L1300 ${yTempel}L1300 ${yUjung}L-300 ${yUjung}Z`} fill="#3F7FA8" />
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={-260 + k * 175} y={yTempel} width="70" height={yUjung - yTempel} fill="#356E94" />
      ))}
      <Terang c={c} n="bawah" d={`M-300 ${yTempel}L1300 ${yTempel}L1300 ${yUjung}L-300 ${yUjung}Z`} />
      <rect x="-300" y={yUjung - 5} width="1600" height="7" fill="#6FA6C8" />
      {/* renceng sachet menggantung di tepi terpal (lebih dekat ke kamera, jadi sedikit lebih besar) */}
      {Array.from({ length: 8 }, (_, k) => {
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

  // ---------- benda di teras (etalase, galon, tabung gas, bangku): [x, lebar, tinggi m, jarak dari dinding m, warna, atas]
  const benda: [number, number, number, number, string, string][] = [
    [45, 560, 0.45, 0.3, '#8B6648', '#A57E5B'], // etalase (dasar)
    [600, 74, 0.48, 0.35, '#9CC7D8', '#C3E0EA'], // galon
    [716, 74, 0.48, 0.35, '#9CC7D8', '#C3E0EA'],
    [865, 70, 0.58, 0.4, '#5BAA6A', '#7CC48A'], // tabung gas
  ];
  const yAlas = (d: number) => Y0 + (d / 1.35) * (WARUNG2D.terasDepan - Y0);
  const bendaNode = (
    <g>
      {benda.map(([x, w, h, d, warna, atas], i) => {
        const yb = yAlas(d),
          hp = h * PX * 1.05;
        return (
          <g key={i}>
            <rect x={x} y={yb - hp} width={w} height={hp} fill={warna} />
            <Terang c={c} n="depan" kotak={[x, yb - hp, w, hp]} teduh={d < tepiLantai} />
            <rect x={x} y={yb - hp - 10} width={w} height="10" fill={atas} />
            <Terang c={c} n="atas" kotak={[x, yb - hp - 10, w, 10]} teduh={d < tepiLantai} />
          </g>
        );
      })}
      {/* kaca etalase berisi tumpukan sachet */}
      <rect x="62" y={yAlas(0.3) - 0.45 * PX * 1.05 - 10 - 0.55 * PX} width="526" height={0.55 * PX} fill="#CFE3EA" opacity=".5" />
      {Array.from({ length: 6 }, (_, k) => (
        <rect key={k} x={92 + k * 82} y={yAlas(0.3) - 0.45 * PX * 1.05 - 10 - 0.55 * PX + 30 + (k % 2) * 30} width="44" height={70 - (k % 2) * 30} fill="#E7899A" opacity=".8" />
      ))}
      <path d={`M80 ${yAlas(0.3) - 0.45 * PX * 1.05 - 12}L170 ${yAlas(0.3) - 0.45 * PX * 1.05 - 0.55 * PX}`} stroke="#FFFFFF" strokeWidth="10" opacity=".35" />
    </g>
  );
  const bayanganBenda = benda.map(([x, w, h, d], i) => (
    <BayanganJatuh key={i} c={c} kaki={[x + w / 2, yAlas(d)]} tinggiPx={h * PX} id={`${id}-bb${i}`} dindingY={Y0} jarakDindingPx={d * PX} kuat={d < tepiLantai ? 0.12 : 0.3}>
      <rect x={x} y={yAlas(d) - h * PX * 1.05} width={w} height={h * PX * 1.05} fill="#000" />
    </BayanganJatuh>
  ));

  // ---------- lantai: teras ubin, tepi teras, selokan, kanstin, jalan
  const lantai = (
    <g>
      <rect x="-300" y={Y0} width="1600" height={WARUNG2D.terasDepan - Y0} fill="#D8CFC2" />
      {Array.from({ length: 16 }, (_, k) => (
        <path key={k} d={`M${-300 + k * 110} ${Y0}L${-330 + k * 116} ${WARUNG2D.terasDepan}`} stroke="#BFB5A6" strokeWidth="2" />
      ))}
      <Terang c={c} n="atas" kotak={[-300, Y0, 1600, WARUNG2D.terasDepan - Y0]} />
      <rect x="-300" y={WARUNG2D.terasDepan} width="1600" height="18" fill="#BDB3A2" />
      <Terang c={c} n="depan" kotak={[-300, WARUNG2D.terasDepan, 1600, 18]} />
      <rect x="-300" y={WARUNG2D.terasDepan + 18} width="1600" height="24" fill="#4E4A45" />
      <rect x="-300" y={WARUNG2D.terasDepan + 42} width="1600" height="10" fill="#C9C2B6" />
      <rect x="-300" y={WARUNG2D.terasDepan + 52} width="1600" height="8" fill="#A79F94" />
      <rect x="-300" y={WARUNG2D.jalan} width="1600" height={2400 - WARUNG2D.jalan} fill="#857F77" />
      {Array.from({ length: 70 }, (_, k) => {
        const r = (n: number) => {
          const v = Math.sin(k * 91.7 + n * 37.3) * 43758.5;
          return v - Math.floor(v);
        };
        const y = WARUNG2D.jalan + 30 + r(1) * 640;
        return <ellipse key={k} cx={-100 + r(2) * 1300} cy={y} rx={4 + r(3) * 10 * ((y - 1200) / 500)} ry={2 + r(4) * 4} fill={r(5) > 0.5 ? '#6E6962' : '#9A948B'} opacity=".55" />;
      })}
      <path d="M120 1640l60 22l40 -8l70 30" stroke="#5E5953" strokeWidth="3" fill="none" opacity=".6" />
      <Terang c={c} n="atas" kotak={[-300, WARUNG2D.jalan, 1600, 2400 - WARUNG2D.jalan]} />
    </g>
  );

  // ---------- lubang + genangan (memantulkan fasad)
  const L = WARUNG2D.lubang;
  const tepiLubang = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2,
      j = 1 + 0.12 * Math.sin(i * 2.7);
    return `${(L.x + Math.cos(a) * 300 * j).toFixed(0)} ${(L.y + Math.sin(a) * 150 * j).toFixed(0)}`;
  });
  const air = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2,
      j = 1 + 0.1 * Math.sin(i * 2.7 + 1);
    return `${(L.x + 10 + Math.cos(a) * 250 * j).toFixed(0)} ${(L.y + 8 + Math.sin(a) * 118 * j).toFixed(0)}`;
  });
  const lubang = (
    <g>
      <path d={`M${tepiLubang.join('L')}Z`} fill="#6B655E" />
      <path d={`M${tepiLubang.join('L')}Z`} fill="none" stroke="#9E978D" strokeWidth="10" opacity=".7" />
      <Pantulan sumbuY={1150} klip={`M${air.join('L')}Z`} id={`${id}-pt`} kuat={0.6} langit={LANGIT}>
        {fasad}
        {terpal}
      </Pantulan>
    </g>
  );

  // ---------- tokoh: bayangan (lapisan lantai/dinding) lalu badan (urut kaki)
  const urut = [...isi].sort((a, b) => a.y - b.y);
  const bayanganTokoh = urut.map((t, i) => {
    const pxM = t.s * 200,
      H = (t.tinggi ?? 1.65) * pxM;
    if (t.teduh) return null;
    return (
      <BayanganJatuh key={i} c={c} kaki={[t.x, t.y]} tinggiPx={H} id={`${id}-bt${i}`} dindingY={t.jarakDinding !== undefined ? Y0 : undefined} jarakDindingPx={t.jarakDinding !== undefined ? t.jarakDinding * PX : undefined}>
        {t.gambar({ x: t.x, y: t.y, s: t.s })}
      </BayanganJatuh>
    );
  });
  const badan = urut.map((t, i) => {
    const pxM = t.s * 200,
      W = (t.lebar ?? 0.5) * pxM;
    return (
      <g key={i}>
        <KontakKaki c={c} x={t.x} y={t.y} rx={W * 0.6} ry={W * 0.13} id={`${id}-kk${i}`} />
        <TokohBercahaya c={c} x={t.x} y={t.y} s={t.s} tinggi={t.tinggi ?? 1.65} teduh={t.teduh} id={`${id}-tc${i}`}>
          {t.gambar({ x: t.x, y: t.y, s: t.s })}
        </TokohBercahaya>
      </g>
    );
  });

  return (
    <g data-lokasi="warung-makmur-2d">
      {langit}
      <g transform={T()}>
        {fasad}
        {/* bayangan terpal: seluruh dinding di bawah terpal dan strip teras dekat dinding */}
        <path d={bayanganTerpal} fill={c.suasana.bayangan ?? '#2B2946'} opacity=".3" />
        <AmbientKaki c={c} x0={-300} x1={1300} y={Y0} tinggi={110} yAtas={yUjung} id={`${id}-ak`} />
        {lantai}
        {lubang}
        {bayanganBenda}
        {bayanganTokoh}
        {bendaNode}
        {terpal}
        {badan}
      </g>
      <NadaAkhir c={c} id={id} />
    </g>
  );
}
