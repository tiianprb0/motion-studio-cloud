// Peta Indonesia sederhana (v1, 18 Nov 2026) untuk diagram gaya Kok Bisa?: pulau-pulau digambar sebagai garis pantai
// yang DISEDERHANAKAN (bukan peta akurat), di atas laut krem kebiruan. Dibuat untuk "Kebakaran Hutan Papua" v1 (asap
// dari Papua Selatan menyeberang ke Maluku; enam provinsi prioritas penanganan karhutla; peringkat area terbakar).
// Koordinat dunia = bujur/lintang (equirectangular). Pandangan `pandang` = { lon, lat, k } (pusat layar dan piksel per
// derajat); animasikan dengan `pandangAntara`. Negara tetangga (Malaysia, PNG, Timor Leste, Filipina) diberi warna lebih
// pucat supaya batas Indonesia terbaca. Semua isi tambahan (asap, sorot provinsi, pin) memakai koordinat bujur/lintang.
//   <PetaIndonesia f pandang asap sorot pin label id />
//   asap  = [{ dari: [lon, lat], ke: [lon, lat], panjang 0..1, kuat }]  pita asap melengkung dari sumber ke tujuan
//   sorot = [{ lon, lat, teks, muncul 0..1, warna?, tanda? }]           lingkaran bercahaya + label pil (mis. provinsi prioritas)
//   pin   = { lon, lat, teks, muncul 0..1 }                               pin lokasi (mis. Merauke)
// Ekspor `proyPeta(pandang, lon, lat)` → { x, y } layar, dipakai untuk callout/label di proyek.
import React from 'react';
import { P } from '../../../core/v1/core';

export type Pandang = { lon: number; lat: number; k: number };
export const PANDANG = {
  indonesia: { lon: 118, lat: -2.2, k: 19 } as Pandang,
  timur: { lon: 132.5, lat: -4.6, k: 46 } as Pandang,
  papuaSelatan: { lon: 139.2, lat: -6.8, k: 120 } as Pandang,
};
export const proyPeta = (p: Pandang, lon: number, lat: number) => ({ x: 540 + (lon - p.lon) * p.k, y: 960 - (lat - p.lat) * p.k });
export const pandangAntara = (a: Pandang, b: Pandang, t: number): Pandang => {
  // zoom logaritmik supaya terasa halus
  const u = Math.max(0, Math.min(1, t));
  const k = Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * u);
  const w = (k - a.k) / (b.k - a.k || 1);
  return { lon: a.lon + (b.lon - a.lon) * w, lat: a.lat + (b.lat - a.lat) * w, k };
};
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// garis pantai disederhanakan [bujur, lintang]
type Pulau = { nama: string; id: boolean; t: [number, number][] };
const PULAU: Pulau[] = [
  { nama: 'Sumatra', id: true, t: [[95.3, 5.6], [95.9, 4.3], [96.9, 3.6], [97.9, 2.4], [98.8, 1.6], [99.6, 0.2], [100.4, -1.0], [101.2, -2.4], [102.3, -3.8], [103.6, -4.9], [104.6, -5.9], [105.8, -5.8], [105.9, -4.4], [106.0, -3.2], [105.1, -2.3], [104.5, -1.6], [103.8, -1.0], [103.4, -0.3], [102.9, 0.6], [102.2, 1.4], [101.4, 1.8], [100.6, 2.3], [99.8, 3.0], [98.7, 3.8], [97.8, 4.7], [96.9, 5.2], [95.9, 5.7]] },
  { nama: 'Bangka', id: true, t: [[105.2, -1.6], [106.4, -2.0], [106.7, -3.0], [105.7, -2.6]] },
  { nama: 'Belitung', id: true, t: [[107.6, -2.6], [108.3, -2.7], [108.2, -3.2], [107.6, -3.1]] },
  { nama: 'Jawa', id: true, t: [[105.2, -6.8], [106.0, -6.0], [107.0, -5.95], [108.3, -6.3], [109.4, -6.85], [110.4, -6.95], [111.5, -6.6], [112.6, -6.9], [113.6, -7.7], [114.4, -7.8], [114.5, -8.7], [113.2, -8.3], [112.0, -8.3], [110.4, -8.1], [109.0, -7.75], [107.6, -7.6], [106.4, -7.4], [105.4, -6.9]] },
  { nama: 'Madura', id: true, t: [[112.7, -6.9], [114.1, -6.9], [114.0, -7.15], [112.8, -7.2]] },
  { nama: 'Bali', id: true, t: [[114.45, -8.1], [115.7, -8.4], [115.2, -8.8], [114.6, -8.45]] },
  { nama: 'Lombok', id: true, t: [[116.0, -8.35], [116.7, -8.3], [116.6, -8.9], [116.0, -8.85]] },
  { nama: 'Sumbawa', id: true, t: [[116.8, -8.4], [118.0, -8.2], [119.1, -8.35], [118.7, -8.8], [117.3, -9.05]] },
  { nama: 'Flores', id: true, t: [[119.8, -8.5], [121.5, -8.45], [123.0, -8.2], [122.8, -8.7], [121.0, -8.9], [119.9, -8.8]] },
  { nama: 'Sumba', id: true, t: [[118.9, -9.5], [120.8, -9.6], [120.6, -10.2], [119.2, -9.8]] },
  { nama: 'Timor Barat', id: true, t: [[123.5, -10.2], [124.5, -9.4], [125.1, -9.05], [125.1, -9.5], [124.2, -10.3]] },
  { nama: 'Timor Leste', id: false, t: [[125.1, -9.05], [125.8, -8.55], [127.2, -8.4], [126.5, -8.9], [125.1, -9.5]] },
  { nama: 'Kalimantan', id: true, t: [[109.0, 1.0], [109.6, 1.95], [110.5, 1.7], [111.3, 1.4], [112.5, 1.5], [113.5, 1.3], [114.5, 1.4], [115.5, 2.4], [116.4, 4.3], [117.6, 4.15], [118.3, 2.6], [118.9, 1.1], [117.9, 0.1], [117.5, -0.6], [116.8, -1.3], [116.3, -2.6], [116.0, -3.9], [114.6, -3.65], [113.0, -3.2], [111.6, -3.2], [110.3, -2.95], [110.0, -1.8], [109.2, -0.7], [108.9, 0.3]] },
  { nama: 'Borneo utara', id: false, t: [[109.6, 1.95], [110.3, 1.75], [111.0, 1.7], [113.0, 3.2], [115.0, 4.9], [116.1, 6.0], [117.2, 7.0], [118.6, 5.8], [119.2, 5.2], [118.0, 4.4], [117.6, 4.15], [116.4, 4.3], [115.5, 2.4], [114.5, 1.4], [113.5, 1.3], [112.5, 1.5], [111.3, 1.4], [110.5, 1.7]] },
  { nama: 'Sulawesi', id: true, t: [[125.2, 1.7], [124.3, 0.4], [123.0, 0.45], [121.5, 0.5], [120.5, 0.3], [121.0, -0.6], [122.2, -0.8], [123.4, -0.8], [123.3, -1.1], [122.0, -1.5], [121.4, -1.9], [122.4, -3.4], [123.1, -4.3], [122.6, -5.4], [121.8, -4.7], [121.4, -4.0], [120.9, -3.0], [120.4, -2.9], [120.5, -4.5], [120.4, -5.6], [119.5, -5.6], [119.4, -4.5], [118.8, -3.0], [119.0, -1.4], [119.8, -0.6], [120.0, 0.6], [120.8, 1.3], [122.5, 1.0], [124.4, 1.0], [125.0, 1.8]] },
  { nama: 'Halmahera', id: true, t: [[127.5, 2.2], [128.2, 1.6], [128.7, 1.4], [127.9, 1.0], [128.6, 0.5], [127.9, 0.3], [128.4, -0.6], [127.6, -0.5], [127.4, 0.6], [127.8, 1.5], [127.4, 2.0]] },
  { nama: 'Seram', id: true, t: [[127.9, -3.0], [129.5, -2.8], [130.9, -3.4], [129.8, -3.55], [128.2, -3.6]] },
  { nama: 'Buru', id: true, t: [[125.9, -3.2], [126.9, -3.1], [127.2, -3.6], [126.1, -3.85]] },
  { nama: 'Aru', id: true, t: [[134.2, -5.6], [134.8, -5.8], [134.7, -6.9], [134.2, -6.6]] },
  { nama: 'Tanimbar', id: true, t: [[131.0, -7.4], [131.7, -7.2], [131.3, -8.1]] },
  { nama: 'Biak', id: true, t: [[135.5, -0.85], [136.2, -0.85], [136.4, -1.2], [135.8, -1.25]] },
  { nama: 'Papua', id: true, t: [[131.0, -0.9], [131.8, -0.4], [132.6, -0.35], [133.9, -0.7], [134.2, -1.6], [134.0, -2.6], [135.2, -3.4], [135.8, -2.6], [136.3, -2.2], [137.8, -1.5], [139.0, -2.1], [140.7, -2.5], [141.0, -2.6], [141.0, -6.9], [140.95, -9.1], [140.4, -8.6], [139.6, -8.1], [138.9, -8.4], [138.0, -8.1], [138.5, -7.3], [137.8, -5.3], [136.9, -4.8], [135.6, -4.4], [134.2, -3.9], [133.6, -3.6], [132.8, -4.0], [132.0, -2.9], [133.0, -2.5], [132.2, -2.2], [131.3, -1.5]] },
  { nama: 'Papua Nugini', id: false, t: [[141.0, -2.6], [143.5, -3.2], [145.8, -4.9], [147.5, -6.1], [148.2, -8.0], [150.0, -10.3], [148.5, -10.2], [147.2, -9.5], [146.0, -8.1], [144.5, -7.6], [143.5, -8.5], [142.5, -9.2], [140.95, -9.1], [141.0, -6.9]] },
  { nama: 'Semenanjung Malaysia', id: false, t: [[100.3, 6.4], [101.3, 5.8], [102.5, 5.9], [103.4, 4.0], [103.5, 2.6], [104.3, 1.4], [103.5, 1.3], [101.3, 2.8], [100.4, 4.2], [100.1, 5.6]] },
  { nama: 'Mindanao', id: false, t: [[121.9, 7.0], [123.5, 7.8], [125.5, 9.4], [126.5, 8.0], [126.2, 6.3], [125.4, 5.6], [124.2, 6.4], [123.0, 7.4]] },
  { nama: 'Australia utara', id: false, t: [[129.0, -14.5], [130.2, -12.4], [132.6, -11.4], [136.6, -12.0], [136.0, -13.4], [135.5, -14.8], [138.5, -16.8], [141.5, -15.0], [141.6, -12.5], [142.5, -10.7], [143.5, -12.5], [145.0, -15.5], [146.0, -19], [128, -19]] },
];

const jalur = (p: Pandang, t: [number, number][]) => {
  const q = t.map(([lo, la]) => proyPeta(p, lo, la));
  return `M${q.map((v) => `${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join('L')}Z`;
};

export type AsapPeta = { dari: [number, number]; ke: [number, number]; panjang: number; kuat?: number; lebar?: number };
export type SorotPeta = { lon: number; lat: number; teks: string; muncul: number; warna?: string; tanda?: string; sisi?: 1 | -1; geser?: [number, number] };
export type PinPeta = { lon: number; lat: number; teks: string; muncul: number };

export function PetaIndonesia({ f = 0, pandang = PANDANG.indonesia, asap = [], sorot = [], pin, label = true, redup = [], id = 'peta' }: { f?: number; pandang?: Pandang; asap?: AsapPeta[]; sorot?: SorotPeta[]; pin?: PinPeta; label?: boolean; redup?: string[]; id?: string }) {
  const p = pandang;
  const sk = Math.min(2.2, Math.max(0.8, p.k / 30)); // skala ikon/label mengikuti zoom (dibatasi)
  const garis = Math.max(1.5, Math.min(4, p.k / 14));
  const asapNode = asap.filter((a) => a.panjang > 0.01).map((a, i) => {
    const A = proyPeta(p, a.dari[0], a.dari[1]),
      B = proyPeta(p, a.ke[0], a.ke[1]);
    const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.18,
      my = (A.y + B.y) / 2 - (B.x - A.x) * 0.18;
    const n = 16;
    const L = klamp(a.panjang);
    return (
      <g key={i} filter={`url(#${id}-asb)`} opacity={(a.kuat ?? 0.8).toFixed(3)}>
        {Array.from({ length: n }, (_, j) => {
          const t = (j / (n - 1)) * L;
          const x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * mx + t * t * B.x;
          const y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * my + t * t * B.y;
          const r = (a.lebar ?? 1) * p.k * (0.35 + 0.9 * t) * (1 + 0.15 * Math.sin(f * 0.1 + j));
          return <circle key={j} cx={x} cy={y} r={r} fill={j < 3 ? '#6F625A' : '#9C8B7E'} opacity={(0.55 - 0.3 * (t / Math.max(0.01, L)) * 0.5).toFixed(3)} />;
        })}
      </g>
    );
  });
  const sorotNode = sorot.map((s, i) => {
    const m = klamp(s.muncul);
    if (m <= 0) return null;
    const q = proyPeta(p, s.lon, s.lat);
    const w = s.warna ?? P.gold;
    const dx = (s.geser?.[0] ?? 0) * sk,
      dy = (s.geser?.[1] ?? 0) * sk;
    const lx = q.x + dx + (s.sisi ?? 1) * 18 * sk,
      ly = q.y + dy - 30 * sk;
    const tw = s.teks.length * 14.5 * sk + 30 * sk;
    const pop = m < 1 ? 0.6 + 0.4 * m + 0.12 * Math.sin(m * Math.PI) : 1;
    return (
      <g key={i} data-peta="sorot" opacity={Math.min(1, m * 2).toFixed(3)}>
        <circle cx={q.x} cy={q.y} r={30 * sk * pop} fill={w} opacity=".35" />
        <circle cx={q.x} cy={q.y} r={11 * sk * pop} fill={w} stroke={P.cream} strokeWidth={3 * sk} />
        {s.teks !== '' && <g transform={`translate(${(s.sisi ?? 1) < 0 ? lx - tw : lx} ${ly}) scale(${pop.toFixed(3)})`}>
          <rect x="0" y={-22 * sk} width={tw} height={40 * sk} rx={20 * sk} fill={P.ink} />
          <text x={tw / 2} y={6 * sk} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={24 * sk} fill={P.cream}>{s.teks}</text>
          {s.tanda && <text x={tw + 8 * sk} y={8 * sk} fontFamily="Lato" fontWeight="900" fontSize={30 * sk} fill={w}>{s.tanda}</text>}
        </g>}
      </g>
    );
  });
  const pinNode = pin && pin.muncul > 0 ? (() => {
    const q = proyPeta(p, pin.lon, pin.lat);
    const m = klamp(pin.muncul);
    const jatuh = (1 - m) * -80 * sk;
    const tw = pin.teks.length * 17 * sk + 36 * sk;
    return (
      <g data-peta="pin" opacity={Math.min(1, m * 2).toFixed(3)}>
        <ellipse cx={q.x} cy={q.y + 4} rx={16 * sk} ry={6 * sk} fill={P.ink} opacity=".25" />
        <g transform={`translate(${q.x} ${q.y + jatuh})`}>
          <path d={`M0 0C${-8 * sk} ${-22 * sk} ${-26 * sk} ${-34 * sk} ${-26 * sk} ${-54 * sk}A${26 * sk} ${26 * sk} 0 1 1 ${26 * sk} ${-54 * sk}C${26 * sk} ${-34 * sk} ${8 * sk} ${-22 * sk} 0 0Z`} fill="#D9482B" />
          <circle cx="0" cy={-54 * sk} r={10 * sk} fill={P.cream} />
          <rect x={-tw / 2} y={-124 * sk} width={tw} height={44 * sk} rx={22 * sk} fill={P.wine} />
          <text x="0" y={-93 * sk} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={28 * sk} fill={P.cream}>{pin.teks}</text>
        </g>
      </g>
    );
  })() : null;
  return (
    <g data-ui="peta-indonesia">
      <defs>
        <filter id={`${id}-asb`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={Math.max(3, p.k * 0.35).toFixed(1)} />
        </filter>
        <pattern id={`${id}-ombak`} width="60" height="30" patternUnits="userSpaceOnUse">
          <path d="M0 15q15 -8 30 0t30 0" stroke="#C7D8D6" strokeWidth="2" fill="none" />
        </pattern>
      </defs>
      <rect x="-200" y="-200" width="1480" height="2320" fill="#E2EDEC" />
      <rect x="-200" y="-200" width="1480" height="2320" fill={`url(#${id}-ombak)`} opacity=".5" />
      {PULAU.map((pl) => (
        <path key={pl.nama} d={jalur(p, pl.t)} fill={pl.id ? (redup.includes(pl.nama) ? '#D6DBC2' : '#9FB984') : '#E2DDCB'} stroke={pl.id ? '#6A8560' : '#BDB7A4'} strokeWidth={garis} strokeLinejoin="round" />
      ))}
      {/* batas darat Indonesia–PNG dan Timor */}
      {(() => {
        const a = proyPeta(p, 141, -2.6),
          b = proyPeta(p, 141, -6.9),
          c = proyPeta(p, 140.95, -9.1);
        return <path d={`M${a.x} ${a.y}L${b.x} ${b.y}L${c.x} ${c.y}`} stroke="#8FA486" strokeWidth={garis} strokeDasharray={`${garis * 3} ${garis * 2}`} fill="none" />;
      })()}
      {asapNode}
      {label && p.k < 60 && (
        <g fontFamily="Lato" fontWeight="700" fill="#6F8169" opacity=".9" fontSize={Math.min(30, 14 + p.k * 0.25)}>
          {([['SUMATRA', 101.2, -1.0], ['KALIMANTAN', 113.6, -0.8], ['SULAWESI', 120.6, -2.3], ['JAWA', 110.0, -7.3], ['PAPUA', 138.2, -4.3], ['MALUKU', 128.5, -2.4]] as [string, number, number][]).map(([t, lo, la]) => {
            const q = proyPeta(p, lo, la);
            return <text key={t} x={q.x} y={q.y} textAnchor="middle" letterSpacing="3">{t}</text>;
          })}
        </g>
      )}
      {sorotNode}
      {pinNode}
    </g>
  );
}
