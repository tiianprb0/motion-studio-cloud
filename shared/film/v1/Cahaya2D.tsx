// Cahaya 2D (11 Nov 2026; DISETUJUI pengguna 11 Nov 2026: "Setujui cahaya 2D", setelah klip contoh/banding-3d-2d).
// Pengguna 11 Nov 2026: "3d sebagai optional jika diminta oleh ku. tapi metode pencahayaannya bisa dibuat di 2d gakk?"
// lalu "coba buat 5 detik perbedaan antara 3d dan 2d yang kamu perbaharui fungsi pencahayaannya".
// Metode cahaya Dunia3D (shared/locations/_proyeksi/v3/Dunia.tsx) dibawa ke panggung flat 2D (dilihat dari depan, perspektif
// digambar). Semua dihitung dari SATU arah matahari per adegan, jadi sisi terang/gelap, bayangan jatuh, dan cahaya di badan
// tokoh selalu sepakat:
//   - nadaMuka / <Terang>: terang-gelap per bidang menurut arah hadapnya (depan, atas, bawah, kiri, kanan; Lambert:
//     ambient + matahari), sama dengan rumus Dunia3D.
//   - <BayanganJatuh>: bayangan jatuh tokoh/benda dari siluetnya sendiri. Di lantai siluet dimiringkan dan dipendekkan
//     mengikuti arah dan tinggi matahari; bila mengenai dinding belakang, sisanya naik ke dinding (tergeser sesuai jarak
//     benda ke dinding). Tepi makin lembut menjauhi kaki.
//   - <BayanganTempel>: bayangan benda yang menempel/menonjol dari dinding (terpal, papan nama, kusen, teritis) di dinding.
//   - <TokohBercahaya>: bayangan inti di sisi badan yang membelakangi matahari (tipis di wajah), cahaya tepi di sisi
//     sumber, lebih gelap bila cahaya dari belakang, atau gelap seluruhnya bila tokoh di tempat teduh (filter Dunia3D yang
//     sama persis).
//   - <AmbientKaki>, <KontakKaki>: gradasi gelap di kaki dinding dan bayangan kontak di kaki tokoh/benda.
//   - <Pantulan>: lapisan dicerminkan di genangan/lantai mengilap, dipotong bentuk genangan.
//   - <NadaAkhir>: nada warna waktu (sore hangat) + vinyet + grain, sama dengan Dunia3D.
// Arah matahari relatif kamera: az 0 = dari arah kamera (depan), 90 = dari kanan layar, -90 = dari kiri, 180 = dari
// belakang (cahaya melawan). el = tinggi matahari (derajat). CAHAYA_2D.siang/sore = padanan cahaya Gang Melati 3D.
// Skala tokoh: pxM = s × 200 piksel per meter (rig: 330 satuan = 1,65 m).
// Biaya: filter SVG biasa, jauh lebih ringan dari Dunia3D (lihat contoh/banding-3d-2d).
import React from 'react';
import { Vignette, Grain } from './Depth';

export type Matahari2D = { az: number; el: number; warna?: string };
export type Suasana2D = {
  bayangan?: string;
  ambient?: number;
  diffuse?: number;
  /** Lapisan warna akhir seluruh bingkai (sore hangat). */
  nada?: { warna: string; kuat: number };
  /** Pemendekan lantai di layar (0..1): seberapa "rebah" lantai terlihat dari tinggi kamera. Bawaan 0,32. */
  lantai?: number;
};
export type Cahaya2D = { matahari: Matahari2D; suasana: Suasana2D };
export const CAHAYA_2D: Record<'siang' | 'sore', Cahaya2D> = {
  siang: { matahari: { az: 55, el: 56, warna: '#FFF1D2' }, suasana: { bayangan: '#3A3F5A', ambient: 0.66, diffuse: 0.72, lantai: 0.32 } },
  sore: { matahari: { az: 68, el: 25, warna: '#FFC98A' }, suasana: { bayangan: '#47395A', ambient: 0.62, diffuse: 0.82, lantai: 0.32, nada: { warna: '#F2A65A', kuat: 0.08 } } },
};

type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
/** Arah ke matahari di kerangka kamera: x kanan, y atas, z menjauh dari kamera. */
export const arahMatahari = (m: Matahari2D): V3 => [Math.sin(rad(m.az)) * Math.cos(rad(m.el)), Math.sin(rad(m.el)), -Math.cos(rad(m.az)) * Math.cos(rad(m.el))];
export type Hadap = 'depan' | 'atas' | 'bawah' | 'kiri' | 'kanan';
const NORMAL: Record<Hadap, V3> = { depan: [0, 0, -1], atas: [0, 1, 0], bawah: [0, -1, 0], kiri: [-1, 0, 0], kanan: [1, 0, 0] };

/** Lapisan terang/gelap untuk bidang yang menghadap `n` (rumus Dunia3D: ambient + diffuse × n·L). teduh = bidang itu
 *  sedang tertutup bayangan (hanya ambient). */
export function nadaMuka(c: Cahaya2D, n: Hadap, teduh = false): { warna: string; a: number } {
  const L = arahMatahari(c.matahari);
  const N = NORMAL[n];
  const ndl = teduh ? 0 : Math.max(0, N[0] * L[0] + N[1] * L[1] + N[2] * L[2]);
  const b = (c.suasana.ambient ?? 0.66) + (c.suasana.diffuse ?? 0.6) * ndl + (n === 'bawah' ? 0.05 : 0);
  return b < 1 ? { warna: c.suasana.bayangan ?? '#2B2946', a: klamp((1 - b) * 0.95, 0, 0.78) } : { warna: c.matahari.warna ?? '#FFE3B3', a: klamp((b - 1) * 1.0, 0, 0.4) };
}
/** Lapisan cahaya untuk satu bidang: path `d` atau kotak. */
export function Terang({ c, n, d, kotak, teduh = false }: { c: Cahaya2D; n: Hadap; d?: string; kotak?: [number, number, number, number]; teduh?: boolean }) {
  const t = nadaMuka(c, n, teduh);
  if (t.a < 0.01) return null;
  const dd = d ?? (kotak ? `M${kotak[0]} ${kotak[1]}h${kotak[2]}v${kotak[3]}h${-kotak[2]}Z` : '');
  return <path d={dd} fill={t.warna} opacity={t.a.toFixed(3)} pointerEvents="none" />;
}
/** Gradasi cahaya sepanjang dinding depan: sedikit lebih terang di sisi datangnya matahari. */
export function GradasiDinding({ c, x, y, w, h, id, kuat = 0.12 }: { c: Cahaya2D; x: number; y: number; w: number; h: number; id: string; kuat?: number }) {
  const kanan = Math.sin(rad(c.matahari.az)) >= 0;
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id={id} x1={kanan ? '1' : '0'} y1="0" x2={kanan ? '0' : '1'} y2="0.3">
          <stop offset="0" stopColor={c.matahari.warna ?? '#FFE3B3'} stopOpacity={kuat} />
          <stop offset="0.55" stopColor={c.matahari.warna ?? '#FFE3B3'} stopOpacity="0" />
          <stop offset="1" stopColor={c.suasana.bayangan ?? '#2B2946'} stopOpacity={kuat * 0.8} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
}

/** Matriks bayangan lantai: titik (dx, dy) relatif kaki (dy negatif = ke atas badan) → bayangan di lantai. */
export function matriksLantai(c: Cahaya2D) {
  const az = rad(c.matahari.az),
    el = rad(Math.max(6, c.matahari.el));
  const panjang = 1 / Math.tan(el);
  const fz = c.suasana.lantai ?? 0.32;
  // ujung kepala (0, -H) → (-sin(az)·H·panjang, -cos(az)·fz·H·panjang)
  return { a: Math.sin(az) * panjang, b: Math.cos(az) * fz * panjang };
}
/** Bayangan jatuh dari siluet `children` (tokoh atau benda, digambar dengan kaki/alas di `kaki`).
 *  dindingY = garis kaki dinding belakang di layar (bila ada); jarakDindingPx = jarak benda ke dinding (piksel pada skala
 *  benda, mis. meter × pxM). Bagian bayangan di atas garis itu naik ke dinding. */
export function BayanganJatuh({
  c,
  kaki,
  tinggiPx,
  id,
  dindingY,
  jarakDindingPx,
  kuat = 0.45,
  children,
}: {
  c: Cahaya2D;
  kaki: [number, number];
  tinggiPx: number;
  id: string;
  dindingY?: number;
  jarakDindingPx?: number;
  kuat?: number;
  children: React.ReactNode;
}) {
  const { a, b } = matriksLantai(c);
  const [x, y] = kaki;
  const warna = c.suasana.bayangan ?? '#2B2946';
  const az = rad(c.matahari.az),
    el = rad(Math.max(6, c.matahari.el));
  const lantaiT = `translate(${x.toFixed(1)} ${y.toFixed(1)}) matrix(1 0 ${a.toFixed(4)} ${b.toFixed(4)} 0 0) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})`;
  // arah ujung bayangan di layar (untuk gradasi kelembutan)
  const ux = -a * tinggiPx,
    uy = -b * tinggiPx;
  const blur = Math.max(1.5, tinggiPx * 0.01);
  // bayangan naik ke dinding hanya bila ujungnya di lantai melewati garis kaki dinding
  const dinding = dindingY !== undefined && jarakDindingPx !== undefined && Math.cos(az) > 0.15 && b > 0 && y + uy < dindingY;
  // di dinding: siluet tergeser ke samping −D·tan(az) dan turun D·tan(el)/cos(az)
  const gx = dinding ? -jarakDindingPx! * Math.tan(az) : 0,
    gy = dinding ? (jarakDindingPx! * Math.tan(el)) / Math.cos(az) : 0;
  // daerah kerja sesempit mungkin (mask/filter besar = render lambat)
  const r = tinggiPx * 0.6 + 20;
  const mx = Math.min(x, x + ux) - r,
    my = Math.min(y, y + uy) - r,
    mw = Math.abs(ux) + 2 * r,
    mh = Math.abs(uy) + 2 * r;
  const kotak = { x: mx.toFixed(0), y: my.toFixed(0), width: mw.toFixed(0), height: mh.toFixed(0) };
  return (
    <g pointerEvents="none" data-fx="bayangan-jatuh">
      <defs>
        <filter id={`${id}-f`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
          <feFlood floodColor={warna} floodOpacity="1" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feGaussianBlur stdDeviation={blur.toFixed(2)} />
        </filter>
        {/* tepi tajam di dekat kaki, makin lembut dan pudar menjauh */}
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x + ux} y2={y + uy}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" {...kotak}>
          <rect {...kotak} fill={`url(#${id}-g)`} />
        </mask>
        {dinding && (
          <>
            <clipPath id={`${id}-cl`}>
              <rect x={kotak.x} y={dindingY} width={kotak.width} height={Math.max(0, my + mh - dindingY!).toFixed(0)} />
            </clipPath>
            <clipPath id={`${id}-cd`}>
              <rect x={(mx + Math.min(0, gx) - r).toFixed(0)} y={(my + gy - r).toFixed(0)} width={(mw + Math.abs(gx) + 2 * r).toFixed(0)} height={Math.max(0, dindingY! - (my + gy - r)).toFixed(0)} />
            </clipPath>
          </>
        )}
      </defs>
      <g opacity={kuat} clipPath={dinding ? `url(#${id}-cl)` : undefined} mask={`url(#${id}-m)`}>
        <g transform={lantaiT} filter={`url(#${id}-f)`}>{children}</g>
      </g>
      {dinding && (
        <g opacity={kuat * 0.8} clipPath={`url(#${id}-cd)`}>
          <g transform={`translate(${gx.toFixed(1)} ${gy.toFixed(1)})`} filter={`url(#${id}-f)`}>
            {children}
          </g>
        </g>
      )}
    </g>
  );
}
/** Geseran bayangan di dinding depan untuk titik yang berada `tonjolPx` di depan dinding: [ke samping, ke bawah]. */
export function geserDinding(c: Cahaya2D, tonjolPx: number): [number, number] {
  const az = rad(c.matahari.az),
    el = rad(Math.max(6, c.matahari.el));
  if (Math.cos(az) < 0.15) return [0, 0];
  return [-tonjolPx * Math.tan(az), (tonjolPx * Math.tan(el)) / Math.cos(az)];
}
/** Jarak (meter) dari dinding ke tepi bayangan di lantai, untuk tepi benda setinggi `tinggi` m yang menonjol `tonjol` m. */
export function tepiBayanganLantai(c: Cahaya2D, tinggi: number, tonjol: number) {
  const az = rad(c.matahari.az),
    el = rad(Math.max(6, c.matahari.el));
  return tonjol - (tinggi / Math.tan(el)) * Math.cos(az);
}
/** Bayangan benda yang menonjol `tonjolPx` dari dinding (terpal, papan, teritis, kusen), jatuh di dinding itu. */
export function BayanganTempel({ c, tonjolPx, id, kuat = 0.3, klip, children }: { c: Cahaya2D; tonjolPx: number; id: string; kuat?: number; klip?: string; children: React.ReactNode }) {
  const az = rad(c.matahari.az),
    el = rad(Math.max(6, c.matahari.el));
  if (Math.cos(az) < 0.15) return null;
  const gx = -tonjolPx * Math.tan(az),
    gy = (tonjolPx * Math.tan(el)) / Math.cos(az);
  return (
    <g pointerEvents="none" data-fx="bayangan-tempel">
      <defs>
        <filter id={`${id}-f`} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
          <feFlood floodColor={c.suasana.bayangan ?? '#2B2946'} floodOpacity="1" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feGaussianBlur stdDeviation={Math.max(1.5, tonjolPx * 0.025).toFixed(2)} />
        </filter>
        {klip && (
          <clipPath id={`${id}-c`}>
            <path d={klip} />
          </clipPath>
        )}
      </defs>
      <g opacity={kuat} clipPath={klip ? `url(#${id}-c)` : undefined}>
        <g transform={`translate(${gx.toFixed(1)} ${gy.toFixed(1)})`} filter={`url(#${id}-f)`}>
          {children}
        </g>
      </g>
    </g>
  );
}

/** Cahaya di badan tokoh 2D (filter yang sama dengan Dunia3D): pita bayangan inti di sisi yang membelakangi sumber,
 *  cahaya tepi di sisi sumber, lebih gelap bila cahaya dari belakang. a = arah rambat cahaya di layar (satuan). */
function filterSinar(fid: string, a: [number, number], o: { w1: number; w2: number; k1: number; k2: number; kb: number; rim: number; rimW: string; kuatRim: number; lembut: number }, mode: 'inti' | 'tepi') {
  const f = (v: number) => v.toFixed(2);
  if (mode === 'tepi')
    return (
      <filter id={fid} colorInterpolationFilters="sRGB" x="-15%" y="-10%" width="130%" height="120%">
        <feOffset in="SourceAlpha" dx={f(a[0] * o.rim)} dy={f(a[1] * o.rim)} result="o3" />
        <feComposite in="SourceAlpha" in2="o3" operator="out" result="tp" />
        <feGaussianBlur in="tp" stdDeviation="1.2" result="tpb" />
        <feFlood floodColor={o.rimW} floodOpacity={f(o.kuatRim)} />
        <feComposite in2="tpb" operator="in" result="rim" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="rim" />
        </feMerge>
      </filter>
    );
  return (
    <filter id={fid} colorInterpolationFilters="sRGB" x="-15%" y="-10%" width="130%" height="120%">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.982 -0.147 -0.015 0 0  -0.038 0.771 -0.013 0 0  -0.036 -0.122 0.838 0 0  0 0 0 1 0" result="gl" />
      <feOffset in="SourceAlpha" dx={f(-a[0] * o.w1)} dy={f(-a[1] * o.w1)} result="o1" />
      <feComposite in="SourceAlpha" in2="o1" operator="out" result="p1" />
      <feOffset in="SourceAlpha" dx={f(-a[0] * o.w2)} dy={f(-a[1] * o.w2)} result="o2" />
      <feComposite in="SourceAlpha" in2="o2" operator="out" result="p2" />
      <feComponentTransfer in="p1" result="q1">
        <feFuncA type="linear" slope={f(o.k1)} />
      </feComponentTransfer>
      <feGaussianBlur in="q1" stdDeviation={f(o.lembut)} result="q1b" />
      <feComponentTransfer in="p2" result="q2">
        <feFuncA type="linear" slope={f(o.k2)} />
      </feComponentTransfer>
      <feGaussianBlur in="q2" stdDeviation={f(o.w2 * 0.3)} result="q2b" />
      <feFlood floodColor="#000" floodOpacity={f(o.kb)} result="fb" />
      <feComposite in="fb" in2="SourceAlpha" operator="in" result="qb" />
      <feMerge result="pm">
        <feMergeNode in="qb" />
        <feMergeNode in="q2b" />
        <feMergeNode in="q1b" />
      </feMerge>
      <feComposite in="pm" in2="SourceAlpha" operator="in" result="pk" />
      <feComposite in="gl" in2="pk" operator="in" result="sisi" />
    </filter>
  );
}
/** Tokoh 2D yang ikut cahaya. x, y = kaki di layar; s = skala rig (pxM = s × 200). teduh = seluruh badan di bayangan. */
export function TokohBercahaya({ c, x, y, s, id, tinggi = 1.65, teduh = false, children }: { c: Cahaya2D; x: number; y: number; s: number; id: string; tinggi?: number; teduh?: boolean; children: React.ReactNode }) {
  const pxM = s * 200;
  const L = arahMatahari(c.matahari);
  // arah rambat cahaya di layar (komponen tegak diredam: bayangan inti jatuh di SISI badan, bukan tepi bawah gambar)
  const a0: [number, number] = [-L[0], L[1] * 0.25];
  const la = Math.hypot(a0[0], a0[1] * 0.45) || 1;
  const a2: [number, number] = [a0[0] / la, (a0[1] * 0.45) / la];
  const keKam = -L[2]; // L·(0,0,-1)
  const samping = 1 - 0.8 * Math.max(0, keKam),
    belakang = klamp(-keKam);
  const kuat = teduh ? 0 : 1;
  const H = tinggi * pxM;
  const o = {
    w1: 0.035 * pxM,
    w2: 0.15 * pxM * (0.55 + 0.45 * samping),
    k1: 0.85 * samping * kuat,
    k2: 0.38 * samping * kuat,
    kb: 0.45 * belakang * kuat,
    rim: Math.max(2, 3 * Math.min(2.2, s)),
    rimW: c.matahari.warna ?? '#FFE3B3',
    kuatRim: (0.6 + 0.35 * belakang) * kuat,
    lembut: Math.max(0.7, 0.007 * pxM),
  };
  const x0 = x - 0.9 * pxM,
    y0 = y - H * 1.2,
    w = 1.8 * pxM,
    h = H * 1.3;
  if (teduh)
    return (
      <g>
        <defs>
          <filter id={`${id}-tg`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.984 -0.094 -0.01 0 0  -0.026 0.834 -0.009 0 0  -0.025 -0.082 0.877 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <g filter={`url(#${id}-tg)`}>{children}</g>
      </g>
    );
  return (
    <g>
      <defs>
        {filterSinar(`${id}-t`, a2, o, 'tepi')}
        {filterSinar(`${id}-i`, a2, o, 'inti')}
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1={(y - H * 1.02).toFixed(1)} x2="0" y2={(y - H * 0.72).toFixed(1)}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={x0.toFixed(0)} y={y0.toFixed(0)} width={w.toFixed(0)} height={h.toFixed(0)}>
          <rect x={x0.toFixed(0)} y={y0.toFixed(0)} width={w.toFixed(0)} height={h.toFixed(0)} fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g filter={`url(#${id}-t)`}>{children}</g>
      <g mask={`url(#${id}-m)`}>
        <g filter={`url(#${id}-i)`}>{children}</g>
      </g>
    </g>
  );
}

/** Bayangan kontak di kaki tokoh/benda. */
export const KontakKaki = ({ c, x, y, rx, ry, id }: { c: Cahaya2D; x: number; y: number; rx: number; ry: number; id: string }) => (
  <g pointerEvents="none">
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={Math.max(2, ry * 0.5).toFixed(1)} />
      </filter>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c.suasana.bayangan ?? '#2B2946'} opacity=".45" filter={`url(#${id})`} />
  </g>
);
/** Gradasi gelap ambient di kaki dinding (garis y), dan (opsional) di bawah teritis/plafon (yAtas). */
export function AmbientKaki({ c, x0, x1, y, tinggi = 120, yAtas, id }: { c: Cahaya2D; x0: number; x1: number; y: number; tinggi?: number; yAtas?: number; id: string }) {
  const w = c.suasana.bayangan ?? '#2B2946';
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-k`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={w} stopOpacity=".42" />
          <stop offset="0.35" stopColor={w} stopOpacity=".14" />
          <stop offset="1" stopColor={w} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={w} stopOpacity=".38" />
          <stop offset="1" stopColor={w} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={x0} y={y - tinggi} width={x1 - x0} height={tinggi} fill={`url(#${id}-k)`} />
      {yAtas !== undefined && <rect x={x0} y={yAtas} width={x1 - x0} height={tinggi * 0.9} fill={`url(#${id}-a)`} />}
    </g>
  );
}
/** Pantulan di genangan/lantai mengilap: `children` dicerminkan terhadap garis sumbuY, dipotong path `klip`. */
export function Pantulan({ sumbuY, klip, id, kuat = 0.55, kabur = 1.5, langit, children }: { sumbuY: number; klip: string; id: string; kuat?: number; kabur?: number; langit?: [string, string]; children: React.ReactNode }) {
  return (
    <g pointerEvents="none" data-fx="pantulan">
      <defs>
        <clipPath id={`${id}-c`}>
          <path d={klip} />
        </clipPath>
        <filter id={`${id}-f`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={kabur} />
        </filter>
        {langit && (
          <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={langit[1]} />
            <stop offset="1" stopColor={langit[0]} />
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        {langit && <path d={klip} fill={`url(#${id}-l)`} />}
        <g opacity={kuat} filter={`url(#${id}-f)`} transform={`translate(0 ${(2 * sumbuY).toFixed(1)}) scale(1 -1)`}>
          {children}
        </g>
        <path d={klip} fill="#FFFFFF" opacity=".08" />
      </g>
    </g>
  );
}
/** Penutup bingkai: nada warna waktu + vinyet + grain (sama dengan Dunia3D). */
export const NadaAkhir = ({ c, id }: { c: Cahaya2D; id: string }) => (
  <>
    {c.suasana.nada && <rect x="-2000" y="-2000" width="5000" height="6000" fill={c.suasana.nada.warna} opacity={c.suasana.nada.kuat} pointerEvents="none" />}
    <Vignette id={`${id}-vg`} opacity={0.1} color="#5A4636" />
    <Grain id={`${id}-gr`} opacity={0.035} />
  </>
);
