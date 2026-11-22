// Teks lirik untuk seri Lirik (v2, 8 Nov 2026: v1 + Kutipan sederhana; v1 beku, dikunci video the cure v2).
// Asal v1 (7 Nov 2026): STATUS: KANDIDAT. Lembar contohnya = storyboard projects/lirik-the-cure
// (lirik asli di atas adegan bertokoh); harus disetujui pengguna sebelum dipakai di video final.
// Arahan pengguna 7 Nov 2026: hanya baris yang ditonjolkan; gayanya bebas di luar pedoman subtitle
// ("berbagai gaya di luar pedoman umum kita", "font nya berganti dengan cepat").
// Yang tetap dijaga: data-box (safe zone sosmed dicek audit), terbaca (bayangan tinta), tidak menutupi wajah.
// Komponen ini TIDAK memuat lirik. Teks selalu datang dari src/lirik.json proyek (lirik.txt yang diisi pengguna);
// pilih kata lewat nomor dengan kata()/kataAdlib().
// Waktu: f = frame sekarang, a = frame mulai, b = frame selesai (opsional). Koordinat di ruang layar, kecuali Label
// yang boleh ditaruh di ruang dunia (data-box ikut transform kamera).
// Bahasa (arahan pengguna 7 Nov 2026, khusus seri Lirik): teks besar = lirik asli persis seperti di lirik.txt.
// Terjemahan Indonesia opsional (`terjemahan`, dari lirik-id.txt pengguna) tampil di bawahnya, sepertiga ukuran teks
// asli, diam (tidak ikut ganti font atau terurai) supaya terbaca.
// Font yang tersedia di render: Lato 400/700/900 dan Playfair 400. Variasi "ganti font" memakai keduanya plus
// miring, rapat/renggang, huruf besar/kecil, dan garis tepi.
import React from 'react';
import { P, unit, quick } from '../../core/v1/core';

export type Baris = { i: number; text: string; words: string[]; terjemahan?: string; start: number; end: number };
/** Tengah horizontal safe zone sosmed (kiri 60, kanan 920; sisi kanan tertutup tombol platform) dan lebar aman teks. */
export const TENGAH_X = 490;
export const LEBAR_AMAN = 760;

// ------------------------------------------------------------------ memilih kata (tanpa menyalin lirik)
export const tanpaKurung = (s: string) => s.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
export const teksAdlib = (s: string) => (/\(([^)]*)\)/.exec(s)?.[1] ?? '').trim();
const potong = (w: string[], dari: number, sampai?: number) => {
  const n = w.length;
  const a = dari < 0 ? n + dari : dari;
  const b = sampai === undefined ? n : sampai < 0 ? n + sampai : sampai;
  return w.slice(a, b).join(' ');
};
/** Kata dari baris (ad-lib dalam kurung dibuang). dari/sampai boleh negatif. Baris kosong → penanda "[baris N]". */
export const kata = (b: Baris, dari = 0, sampai?: number) => {
  const w = tanpaKurung(b.text).split(' ').filter(Boolean);
  return w.length ? potong(w, dari, sampai) : `[baris ${b.i}]`;
};
/** Kata dari ad-lib dalam kurung di baris itu. Kosong → penanda "[ad-lib N]". */
export const kataAdlib = (b: Baris, dari = 0, sampai?: number) => {
  const w = teksAdlib(b.text).split(' ').filter(Boolean);
  return w.length ? potong(w, dari, sampai) : `[ad-lib ${b.i}]`;
};

/** Terjemahan baris dari lirik-id.txt. contoh=true: penanda "[terjemahan baris N]" bila kosong (untuk storyboard). */
export const terjemahan = (b: Baris, contoh = false) => (b.terjemahan || '').trim() || (contoh ? `[terjemahan baris ${b.i}]` : '');

/** Teks terjemahan kecil (sepertiga ukuran teks asli), diam, Lato 700 krem dengan bayangan tinta. */
export function Terjemahan({ x, y, text, size, anchor = 'middle', opacity = 0.92 }: { x: number; y: number; text?: string; size: number; anchor?: 'start' | 'middle'; opacity?: number }) {
  if (!text) return null;
  return (
    <g data-lirik="terjemahan" opacity={opacity}>
      <text x={x + size * 0.05} y={y + size * 0.07} textAnchor={anchor} fontFamily="Lato" fontWeight="700" fontSize={size} fill={P.ink} opacity=".45">{text}</text>
      <text x={x} y={y} textAnchor={anchor} fontFamily="Lato" fontWeight="700" fontSize={size} fill={P.cream}>{text}</text>
    </g>
  );
}
const subY = (bawah: number, size: number) => bawah + (size / 3) * 1.15;

// ------------------------------------------------------------------ ukuran teks (perkiraan untuk data-box)
type Fam = 'Lato' | 'Playfair';
const em = (ch: string, w: number, fam: Fam) => {
  if (ch === ' ') return 0.26;
  if (/[.,'’:;!|]/.test(ch)) return 0.27;
  if (/[\[\]()]/.test(ch)) return 0.34;
  if (/[MW]/.test(ch)) return 0.9;
  if (/[A-Z]/.test(ch)) return fam === 'Playfair' ? 0.7 : w >= 900 ? 0.72 : 0.66;
  if (/[mw]/.test(ch)) return 0.84;
  if (/[ijlft]/.test(ch)) return 0.33;
  if (/[0-9]/.test(ch)) return 0.58;
  return fam === 'Playfair' ? 0.53 : w >= 900 ? 0.6 : 0.54;
};
export const lebar = (t: string, size: number, fam: Fam = 'Lato', w = 900, spacing = 0) =>
  [...t].reduce((s, c) => s + em(c, w, fam) * size + spacing, 0);

// ------------------------------------------------------------------ gaya huruf
export type Gaya = { fam: Fam; w: number; upper?: boolean; skew?: number; sx?: number; spacing?: number; outline?: boolean };
/** Urutan variasi untuk GantiFont. */
export const GAYA_FONT: Gaya[] = [
  { fam: 'Lato', w: 900, upper: true },
  { fam: 'Playfair', w: 400, skew: -12 },
  { fam: 'Lato', w: 400, upper: true, spacing: 0.14 },
  { fam: 'Lato', w: 900, upper: true, outline: true },
  { fam: 'Playfair', w: 400, upper: true, sx: 0.8 },
  { fam: 'Lato', w: 700, sx: 1.2 },
  { fam: 'Lato', w: 900, skew: 10 },
];
const ukur = (t: string, size: number, g: Gaya) => lebar(g.upper ? t.toUpperCase() : t, size, g.fam, g.w, (g.spacing ?? 0) * size) * (g.sx ?? 1) + Math.abs(g.skew ?? 0) * size * 0.012;

/** Satu teks dengan bayangan tinta. Lebar dipaskan ke maxW bila perlu. */
function Tulis({ x, y, t, size, g, color, anchor = 'middle', opacity = 1, maxW = 9999, shadow = 0.35 }: { x: number; y: number; t: string; size: number; g: Gaya; color: string; anchor?: 'start' | 'middle'; opacity?: number; maxW?: number; shadow?: number }) {
  const s = g.upper ? t.toUpperCase() : t;
  const w = ukur(t, size, g);
  const fit = w > maxW ? maxW / w : 1;
  const tr = `translate(${x} ${y}) skewX(${g.skew ?? 0}) scale(${(g.sx ?? 1) * fit} ${fit < 1 ? Math.max(fit, 0.82) : 1})`;
  const common = { x: 0, y: 0, textAnchor: anchor, fontFamily: g.fam, fontWeight: g.w, fontSize: size, letterSpacing: (g.spacing ?? 0) * size };
  return (
    <g transform={tr} opacity={opacity}>
      {shadow > 0 && <text {...common} transform={`translate(${size * 0.035} ${size * 0.05})`} fill={P.ink} opacity={shadow}>{s}</text>}
      {g.outline ? (
        <text {...common} fill="none" stroke={color} strokeWidth={size * 0.035} strokeLinejoin="round">{s}</text>
      ) : (
        <text {...common} fill={color}>{s}</text>
      )}
    </g>
  );
}

const masukKeluar = (f: number, a: number, b: number, inn = 5, out = 5) => Math.min(quick(f, a, a + inn), b === Infinity ? 1 : 1 - unit((f - (b - out)) / out));

/** Pecah teks jadi baris-baris yang muat di maxW (perkiraan gaya terlebar). */
const pecah = (text: string, size: number, maxW: number) => {
  const rows: string[] = [];
  for (const w of text.split(' ')) {
    const cur = rows[rows.length - 1];
    if (cur !== undefined && Math.max(...GAYA_FONT.map((g) => ukur(cur + ' ' + w, size, g))) <= maxW) rows[rows.length - 1] = cur + ' ' + w;
    else rows.push(w);
  }
  return rows;
};

// ------------------------------------------------------------------ 1. Ganti font cepat
/** Font, gaya, dan warna berganti tiap `every` frame. makinCepat: jedanya menyusut ke 2 frame dalam 2 dtk.
 *  perKata: tiap kata punya urutan sendiri (tidak serempak). Titik (x, y) = garis dasar baris pertama, rata tengah. */
export function GantiFont({ f, a, b = Infinity, x, y, text, size = 130, every = 4, makinCepat = false, perKata = false, maxW = LEBAR_AMAN, lineH = 1.08, warna = [P.cream, P.gold, '#F3B7A8'], terjemahan: terj, id = 'ganti-font' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; every?: number; makinCepat?: boolean; perKata?: boolean; maxW?: number; lineH?: number; warna?: string[]; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const t = f - a;
  const step = makinCepat ? Math.max(2, every - (every - 2) * unit(t / 60)) : every;
  const k = Math.floor(t / step);
  const o = masukKeluar(f, a, b, 3, 4);
  const pop = 1 + 0.18 * (1 - quick(f, a, a + 6));
  const rows = pecah(text, size, maxW);
  const h = size * lineH;
  const bawah = y + (rows.length - 1) * h + size * 0.3;
  const box = [x - maxW / 2, y - size * 0.9, x + maxW / 2, terj ? subY(bawah, size) + size * 0.12 : bawah].map(Math.round);
  return (
    <g data-fx="lirik" data-lirik="ganti-font" data-box={box.join(',')} id={id} opacity={o} transform={`translate(${x} ${y}) scale(${pop}) translate(${-x} ${-y})`}>
      {rows.map((r, i) => {
        if (!perKata) {
          const v = (k + i * 2) % GAYA_FONT.length;
          return <Tulis key={i} x={x} y={y + i * h} t={r} size={size} g={GAYA_FONT[v]} color={warna[(k + i) % warna.length]} maxW={maxW} />;
        }
        const words = r.split(' ');
        const ws = words.map((w, j) => ({ w, g: GAYA_FONT[(k + j * 3 + i) % GAYA_FONT.length] }));
        const widths = ws.map(({ w, g }) => ukur(w, size, g) + size * 0.28);
        const total = widths.reduce((s, v) => s + v, 0);
        const fit = total > maxW ? maxW / total : 1;
        let cx = x - (total * fit) / 2;
        return ws.map(({ w, g }, j) => {
          const mid = cx + (widths[j] * fit) / 2;
          cx += widths[j] * fit;
          return <Tulis key={i + '-' + j} x={mid} y={y + i * h} t={w} size={size * fit} g={g} color={warna[(k + j) % warna.length]} />;
        });
      })}
      <Terjemahan x={x} y={subY(bawah, size)} text={terj} size={size / 3} />
    </g>
  );
}

// ------------------------------------------------------------------ 2. Ketik, ragu, hapus, ketik lagi
/** Diketik per huruf, berhenti, `hapus` huruf terakhir dihapus cepat, diam ragu, lalu diketik ulang pelan.
 *  Kursor berkedip. Rata kiri dari (x, y). */
export function KetikHapus({ f, a, b = Infinity, x, y, text, size = 96, cps = 12, jeda = 10, hapus = 3, ulang = true, g = { fam: 'Lato', w: 700 }, color = P.cream, terjemahan: terj, id = 'ketik-hapus' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; cps?: number; jeda?: number; hapus?: number; ulang?: boolean; g?: Gaya; color?: string; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const n = text.length, fpc = 30 / cps, t = f - a;
  const t1 = n * fpc, t2 = t1 + jeda, t3 = t2 + (hapus * fpc) / 2, t4 = t3 + jeda * 1.6, t5 = t4 + (hapus * fpc) / 0.6;
  let shown = n, aktif = false;
  if (t < t1) { shown = Math.floor(t / fpc); aktif = true; }
  else if (t < t2) shown = n;
  else if (t < t3) { shown = n - Math.floor((t - t2) / (fpc / 2)); aktif = true; }
  else if (t < t4) shown = n - hapus;
  else if (ulang && t < t5) { shown = n - hapus + Math.floor((t - t4) / (fpc / 0.6)); aktif = true; }
  else shown = ulang ? n : n - hapus;
  const kedip = aktif || Math.floor(t / 8) % 2 === 0;
  const w = ukur(text, size, g);
  const box = [x - 10, y - size * 0.9, x + w + size * 0.3, terj ? subY(y + size * 0.3, size) + size * 0.12 : y + size * 0.3].map(Math.round);
  const s = g.upper ? text.toUpperCase() : text;
  return (
    <g data-fx="lirik" data-lirik="ketik-hapus" data-box={box.join(',')} id={id} opacity={masukKeluar(f, a, b, 2, 4)}>
      <text x={x + size * 0.035} y={y + size * 0.05} fontFamily={g.fam} fontWeight={g.w} fontSize={size} fill={P.ink} opacity=".35">{s.slice(0, shown)}</text>
      <text x={x} y={y} fontFamily={g.fam} fontWeight={g.w} fontSize={size} fill={color}>
        {s.slice(0, shown)}
        <tspan fill={P.gold} fillOpacity={kedip ? 1 : 0}>|</tspan>
      </text>
      <Terjemahan x={x} y={subY(y + size * 0.3, size)} text={terj} size={size / 3} anchor="start" />
    </g>
  );
}

// ------------------------------------------------------------------ 3. Huruf terurai
const acak = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
/** Huruf-huruf pelan-pelan lepas dari barisnya (geser, miring, turun ke ujung). `lepas` 0..1 = seberapa terurai
 *  (naikkan tiap kali muncul lagi). Rata kiri dari (x, y). */
export function Terurai({ f, a, b = Infinity, x, y, text, size = 64, lepas = 0.5, color = P.cream, opacity = 0.9, seed = 1, g = { fam: 'Playfair', w: 400, skew: -10 }, terjemahan: terj, id = 'terurai' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; lepas?: number; color?: string; opacity?: number; seed?: number; g?: Gaya; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const t = f - a;
  const amt = lepas * (0.04 + 0.96 * quick(t, 8, 60));
  const chars = [...(g.upper ? text.toUpperCase() : text)];
  let cx = 0;
  const pos = chars.map((c) => { const p = cx; cx += em(c, g.w, g.fam) * size + (g.spacing ?? 0) * size; return p; });
  const n = chars.length;
  const box = [x - size * 0.8, y - size * 1.5, x + cx + size * 0.9, y + size * 1.4 + (terj ? size * 0.5 : 0)].map(Math.round);
  return (
    <g data-fx="lirik" data-lirik="terurai" data-box={box.join(',')} id={id} opacity={opacity * masukKeluar(f, a, b, 8, 6)}>
      {chars.map((c, i) => {
        const r1 = acak(i * 3 + seed), r2 = acak(i * 7 + seed * 5), ujung = i / Math.max(1, n - 1);
        const dx = (r1 - 0.5) * size * 0.7 * amt + ujung * size * 0.6 * amt;
        const dy = (r2 - 0.35) * size * 0.9 * amt + ujung * ujung * size * 1.2 * amt + Math.sin(f * 0.08 + i) * 3 * amt;
        const rot = (r1 - 0.5) * 55 * amt;
        return (
          <g key={i} transform={`translate(${x + pos[i] + dx} ${y + dy}) rotate(${rot}) skewX(${g.skew ?? 0})`} opacity={1 - 0.45 * amt * r2}>
            <text x={size * 0.03} y={size * 0.04} fontFamily={g.fam} fontWeight={g.w} fontSize={size} fill={P.ink} opacity=".3">{c}</text>
            <text fontFamily={g.fam} fontWeight={g.w} fontSize={size} fill={color}>{c}</text>
          </g>
        );
      })}
      <Terjemahan x={x} y={y + size * 1.55} text={terj} size={Math.max(24, size / 3)} anchor="start" />
    </g>
  );
}

// ------------------------------------------------------------------ 4. Label apotek (ditempel)
/** Stiker label obat yang "ditempel" (masuk membesar lalu menempel, sedikit miring). Bisa diberi garis penunjuk ke
 *  benda (`tunjuk`, koordinat sama dengan x/y). `judul` = tulisan kecil di pita atas (bahasa kita sendiri). */
export function Label({ f, a, b = Infinity, x, y, text, size = 64, rot = -4, judul = 'Diminum 3× sehari', tunjuk, terjemahan: terj, id = 'label' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; rot?: number; judul?: string; tunjuk?: [number, number]; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const t = f - a;
  const s = 1.35 - 0.35 * quick(t, 0, 6) + 0.04 * Math.sin(unit(t / 10) * Math.PI) * (t < 10 ? 1 : 0);
  const T = text.toUpperCase();
  const ts = size / 3;
  const w = Math.max(lebar(T, size, 'Lato', 900) + 80, lebar(judul, 28, 'Lato', 700) + 70, terj ? lebar(terj, ts, 'Lato', 700) + 60 : 0);
  const h = size + 96 + (terj ? ts * 1.4 : 0);
  const o = masukKeluar(f, a, b, 3, 5);
  const box = [x - w / 2 - 14, y - h / 2 - 14, x + w / 2 + 14, y + h / 2 + 14].map(Math.round);
  return (
    <g data-fx="lirik" data-lirik="label" data-box={box.join(',')} id={id} opacity={o}>
      {tunjuk && <path d={`M${x} ${y + h / 2}L${tunjuk[0]} ${tunjuk[1]}`} stroke={P.cream} strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" opacity={quick(t, 6, 14)} />}
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <rect x={-w / 2 + 6} y={-h / 2 + 10} width={w} height={h} rx="16" fill={P.ink} opacity=".25" />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="16" fill={P.cream} />
        <path d={`M${-w / 2} ${-h / 2 + 16}a16 16 0 0 1 16 -16h${w - 32}a16 16 0 0 1 16 16v32h${-w}Z`} fill={P.wine} />
        <text x="0" y={-h / 2 + 37} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="28" fill={P.cream}>{judul}</text>
        <text x="0" y={h / 2 - 26 - (terj ? ts * 1.4 : 0)} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={P.ink}>{T}</text>
        {terj && <text x="0" y={h / 2 - 24} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize={ts} fill={P.wine}>{terj}</text>}
        <path d={`M${-w / 2 + 24} ${h / 2 - 12}h${w - 48}`} stroke={P.line} strokeWidth="3" strokeDasharray="6 8" />
      </g>
    </g>
  );
}

// ------------------------------------------------------------------ 5. Kata besar yang retak
/** Kata besar dibanting masuk; di frame a + retakDi retakan menjalar dari titik benturan (hanya di permukaan huruf),
 *  kata bergetar, lalu sedikit terbelah di retakan utama dan serpihan kecil jatuh. Rata tengah di (x, y). */
export function Retak({ f, a, b = Infinity, x, y, text, size = 220, retakDi = 24, color = P.cream, terjemahan: terj, id = 'retak' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; retakDi?: number; color?: string; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const t = f - a;
  const T = text.toUpperCase();
  const w0 = lebar(T, size, 'Lato', 900);
  const fit = w0 > LEBAR_AMAN - 100 ? (LEBAR_AMAN - 100) / w0 : 1;
  const sz = size * fit, w = w0 * fit;
  const slam = 1 + 0.6 * (1 - quick(t, 0, 5));
  const c = quick(t, retakDi, retakDi + 8);
  const getar = t >= retakDi && t < retakDi + 6 ? Math.sin((t - retakDi) * 2.6) * sz * 0.025 : 0;
  const sp = quick(t, retakDi + 6, retakDi + 26);
  // titik benturan sedikit di kanan tengah, setinggi tengah huruf kapital
  const ix = w * 0.06, iy = -sz * 0.36;
  const U = (pts: number[][]) => pts.map(([u, v]) => [ix + u * sz, iy + v * sz]);
  const utama = U([[-0.03, -0.62], [0.04, -0.42], [-0.01, -0.2], [0, 0], [0.05, 0.16], [-0.01, 0.32], [0.04, 0.6]]);
  const cabang = [
    U([[0, 0], [0.22, -0.08], [0.42, -0.03], [0.66, -0.15], [0.9, -0.08]]),
    U([[0, 0], [-0.2, 0.07], [-0.42, 0.01], [-0.66, 0.12], [-0.92, 0.04]]),
    U([[-0.01, -0.2], [0.16, -0.32], [0.3, -0.5]]),
    U([[0.05, 0.16], [0.22, 0.24], [0.44, 0.2], [0.6, 0.3]]),
    U([[-0.01, -0.2], [-0.18, -0.29], [-0.36, -0.44]]),
    U([[0.42, -0.03], [0.5, 0.14], [0.47, 0.3]]),
    U([[-0.42, 0.01], [-0.5, -0.2]]),
  ];
  const garis = (pts: number[][]) => 'M' + pts.map((q) => q.join(' ')).join('L');
  const panjang = (pts: number[][]) => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
  const L = w, Hh = sz * 1.2;
  const kiri = `M${-L} ${-Hh}L${utama.map((q) => q.join(' ')).join('L')}L${-L} ${Hh}Z`;
  const kanan = `M${L} ${-Hh}L${utama.map((q) => q.join(' ')).join('L')}L${L} ${Hh}Z`;
  const tulis = (fill: string, op = 1) => <text x="0" y="0" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={sz} fill={fill} opacity={op}>{T}</text>;
  const retakan = (
    <g mask={`url(#${id}-m)`} stroke={P.ink} fill="none" strokeLinejoin="round" strokeLinecap="round">
      {[utama, ...cabang].map((pts, i) => {
        const len = panjang(pts);
        const k = unit(c * 1.4 - i * 0.12);
        return <path key={i} d={garis(pts)} strokeWidth={sz * (i ? 0.016 : 0.026)} strokeDasharray={`${k * len} 9999`} />;
      })}
    </g>
  );
  const box = [x - w / 2 - 60, y - sz - 40, x + w / 2 + 60, terj ? y + subY(sz * 0.3, sz) + sz * 0.1 : y + sz * 0.4].map(Math.round);
  const separuh = (sisi: 'l' | 'r', arah: number) => (
    <g transform={`translate(${arah * sp * sz * 0.03} ${sp * sz * (arah > 0 ? 0.05 : 0.02)}) rotate(${arah * sp * 2} ${ix} ${iy})`} clipPath={`url(#${id}-${sisi})`}>
      <g transform={`translate(${sz * 0.03} ${sz * 0.045})`}>{tulis(P.ink, 0.35)}</g>
      {tulis(color)}
      {retakan}
    </g>
  );
  return (
    <g data-fx="lirik" data-lirik="retak" data-box={box.join(',')} id={id} opacity={masukKeluar(f, a, b, 2, 6)}>
    <Terjemahan x={x} y={y + subY(sz * 0.3, sz)} text={terj} size={sz / 3} />
    <g transform={`translate(${x + getar} ${y}) scale(${slam})`}>
      <defs>
        <clipPath id={`${id}-l`}><path d={kiri} /></clipPath>
        <clipPath id={`${id}-r`}><path d={kanan} /></clipPath>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-L} y={-Hh} width={2 * L} height={2 * Hh}>{tulis('#fff')}</mask>
      </defs>
      {c > 0 ? (
        <>
          {separuh('l', -1)}
          {separuh('r', 1)}
        </>
      ) : (
        <>
          <g transform={`translate(${sz * 0.03} ${sz * 0.045})`}>{tulis(P.ink, 0.35)}</g>
          {tulis(color)}
        </>
      )}
      {sp > 0 && [[0.0, 0.02, 18], [0.05, 0.06, 13], [-0.02, 0.0, 10]].map(([u, v, r], i) => (
        <path key={i} d={`M0 ${-r}L${r * 0.9} ${-r * 0.2}L${r * 0.3} ${r}L${-r * 0.8} ${r * 0.4}Z`} fill={color} stroke={P.ink} strokeWidth="2" opacity={1 - sp * 0.9}
          transform={`translate(${ix + u * sz} ${v * sz + sp * (70 + i * 55)}) rotate(${sp * (140 + i * 90)})`} />
      ))}
    </g>
    </g>
  );
}

// ------------------------------------------------------------------ 6. Kalimat yang terpotong
/** Diketik per huruf lalu berhenti; kursor terus berkedip, kalimatnya tidak pernah selesai. Rata kiri dari (x, y). */
export function Terpotong({ f, a, b = Infinity, x, y, text, size = 84, cps = 9, maxW = 700, g = { fam: 'Lato', w: 700 }, color = P.cream, terjemahan: terj, id = 'terpotong' }: { f: number; a: number; b?: number; x: number; y: number; text: string; size?: number; cps?: number; maxW?: number; g?: Gaya; color?: string; terjemahan?: string; id?: string }) {
  if (f < a || f >= b) return null;
  const t = f - a, fpc = 30 / cps, n = text.length;
  const shown = Math.min(n, Math.floor(t / fpc));
  const selesai = n * fpc;
  const kedip = t < selesai || Math.floor((t - selesai) / 9) % 2 === 0;
  const w0 = ukur(text + ' |', size, g);
  const sz = w0 > maxW ? (size * maxW) / w0 : size;
  const w = Math.min(w0, maxW);
  const redup = 1 - 0.25 * quick(t, selesai + 20, selesai + 50);
  const s = g.upper ? text.toUpperCase() : text;
  const box = [x - 10, y - sz * 0.9, x + w + 20, terj ? subY(y + sz * 0.3, sz) + sz * 0.12 : y + sz * 0.3].map(Math.round);
  return (
    <g data-fx="lirik" data-lirik="terpotong" data-box={box.join(',')} id={id} opacity={masukKeluar(f, a, b, 2, 4)}>
      <text x={x + sz * 0.035} y={y + sz * 0.05} fontFamily={g.fam} fontWeight={g.w} fontSize={sz} fill={P.ink} opacity=".35">{s.slice(0, shown)}</text>
      <text x={x} y={y} fontFamily={g.fam} fontWeight={g.w} fontSize={sz} fill={color} opacity={redup}>
        {s.slice(0, shown)}
        <tspan fill={P.gold} fillOpacity={kedip ? 1 : 0}> |</tspan>
      </text>
      <Terjemahan x={x} y={subY(y + sz * 0.3, sz)} text={terj} size={sz / 3} anchor="start" opacity={redup} />
    </g>
  );
}

// ------------------------------------------------------------------ 7. Kutipan sederhana (acuan pengguna 8 Nov 2026)
/** Satu baris lirik dalam tanda kutip, putih, kecil, rata tengah di sepertiga bawah; muncul dan hilang pelan.
 *  Gaya utama seri Lirik sejak acuan @blazenodes: teks tidak bersaing dengan gambar. */
export function Kutipan({ f, a, b = Infinity, text, y = 1390, size = 46, maxW = 720, id = 'kutipan' }: { f: number; a: number; b?: number; text: string; y?: number; size?: number; maxW?: number; id?: string }) {
  if (f < a || f >= b || !text) return null;
  const o = Math.min(quick(f, a, a + 8), b === Infinity ? 1 : 1 - unit((f - (b - 8)) / 8));
  const isi = `“${text}”`;
  const rows: string[] = [];
  for (const w of isi.split(' ')) {
    const cur = rows[rows.length - 1];
    if (cur !== undefined && lebar(cur + ' ' + w, size, 'Lato', 700) <= maxW) rows[rows.length - 1] = cur + ' ' + w;
    else rows.push(w);
  }
  const h = size * 1.25;
  y = y - (rows.length - 1) * h; // baris kedua naik ke atas, bukan turun keluar safe zone
  const lebarMaks = Math.max(...rows.map((r) => lebar(r, size, 'Lato', 700)));
  const box = [TENGAH_X - lebarMaks / 2 - 10, y - size, TENGAH_X + lebarMaks / 2 + 10, y + (rows.length - 1) * h + size * 0.35].map(Math.round);
  return (
    <g data-fx="lirik" data-lirik="kutipan" data-box={box.join(',')} id={id} opacity={o}>
      {rows.map((r, i) => (
        <g key={i}>
          <text x={TENGAH_X + 2} y={y + i * h + 3} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize={size} fill="#000" opacity=".55">{r}</text>
          <text x={TENGAH_X} y={y + i * h} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize={size} fill="#F6F3EC">{r}</text>
        </g>
      ))}
    </g>
  );
}
