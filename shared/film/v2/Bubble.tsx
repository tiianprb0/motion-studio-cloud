// Gelembung bicara v2 (12 Nov 2026). Pengguna atas Kritik v5: "bubble bicara juga aneh karena narik jauh dari sisi kepala
// ... perbaiki dong, dan hapus peraturan itu, tapi asal jangan semuanya nutupin kepala karakter. begitu juga untuk bubble
// kecil merah yang biasa tanda ! gitu gitu ya".
// Tampilan sama dengan v1 (gaya Kok Bisa?, disetujui 7 Nov 2026): oval krem tanpa garis tepi, Lato Black 60 px, maks 4 kata,
// bayangan sangat lembut, muncul memantul. Bedanya:
// - Ekor berpangkal di tepi oval yang paling dekat ke kepala (atas, bawah, atau samping), bukan selalu dari bawah.
// - letakBubble(): bubble MENEMPEL di kepala pembicara (tepi oval ±22 px dari kepala, ekor pendek). Boleh menimpa badan,
//   bahu, atau tepi kepala tokoh; TIDAK menutupi wajah siapa pun (>12% kotak wajah). Tetap di safe zone dan ≥100 px dari
//   subtitle.
// - letakTanda(): posisi tanda kecil (Mark ?/! dari rig/v2/fx) di sudut atas kepala, menempel.
// - data-box = badan oval saja (safe zone, jarak subtitle, wajah); data-ekor = "x1,y1,x2,y2" tepi oval → ujung ekor,
//   diperiksa tools/audit-overlay.cjs (ekor ≤ 90 px).
// Bubble v1 (shared/film/v1/Bubble.tsx) tetap untuk video lama yang terkunci.
import React from 'react';
import { P, popIn } from '../../core/v1/core';

const LATO_BLACK_EM = 0.62; // perkiraan lebar rata-rata huruf Lato Black per 1 em (sama dengan v1)

export type Kotak = [number, number, number, number];
/** kepala di layar: pusat dan jari-jari (rig v2: pusat (0,−279) unit, jari-jari ±66 unit × skala efektif) */
export type Kepala = { x: number; y: number; r: number };

// kiri 110 = tepi kiri subtitle (pengguna 12 Nov 2026: overlay tidak boleh lebih ke tepi daripada subtitle dan logo)
export const SAFE = { left: 110, top: 220, right: 920, bottom: 1480 };
/** bawah subtitle 2 baris di y 300 (Captions) + jarak 100 px (arahan 7 Nov 2026) */
export const ATAS_BUBBLE = 440 + 100;

export const ukuranBubble = (text: string, size = 60) => ({ w: Math.max(size * 2.6, text.length * size * LATO_BLACK_EM + size * 1.3), h: size * 1.9 });

/** kotak wajah rig v2 dari kepala (lokal: x ±62, y −318..−210, pusat kepala −279, jari-jari 66) */
export const wajahDari = (k: Kepala): Kotak => {
  const u = k.r / 66;
  return [k.x - 62 * u, k.y - 39 * u, k.x + 62 * u, k.y + 69 * u];
};

/** titik terdekat pada tulang oval (garis tengah horizontal) ke titik p */
const tulang = (x: number, y: number, w: number, h: number, p: [number, number]): [number, number] => {
  const half = Math.max(0, w / 2 - h / 2);
  return [Math.min(x + half, Math.max(x - half, p[0])), y];
};

const tutup = (b: Kotak, f: Kotak) => {
  const w = Math.min(b[2], f[2]) - Math.max(b[0], f[0]),
    h = Math.min(b[3], f[3]) - Math.max(b[1], f[1]);
  const area = (f[2] - f[0]) * (f[3] - f[1]);
  return w > 0 && h > 0 && area > 0 ? (w * h) / area : 0;
};

/**
 * Letak bubble yang menempel di kepala pembicara. Mengembalikan pusat bubble dan ujung ekor (di tepi kepala, bukan di wajah).
 * `wajah` = kotak wajah SEMUA tokoh di layar (termasuk pembicara), dipakai supaya oval tidak menutupi wajah.
 */
export function letakBubble({
  text,
  size = 60,
  kepala,
  wajah = [],
  jarak = 22,
  atas = ATAS_BUBBLE,
  safe = SAFE,
  arah,
}: {
  text: string;
  size?: number;
  kepala: Kepala;
  wajah?: Kotak[];
  /** jarak tepi oval ke tepi kepala (px) */
  jarak?: number;
  /** batas atas oval (di bawah subtitle) */
  atas?: number;
  safe?: typeof SAFE;
  /** -1 utamakan kiri, 1 kanan */
  arah?: number;
}): { x: number; y: number; tip: [number, number]; ekor: number } {
  const { w, h } = ukuranBubble(text, size);
  const { x: hx, y: hy, r } = kepala;
  const semuaWajah = [wajahDari(kepala), ...wajah];
  const kandidat: [number, number, number][] = []; // cx, cy, penalti arah
  // di atas kepala (oval digeser kiri/kanan supaya muat), di samping atas, di samping setinggi kepala
  for (const o of [0, -0.2, 0.2, -0.35, 0.35]) kandidat.push([hx + o * w, hy - r - jarak - h / 2, 0]);
  for (const s of [-1, 1]) {
    const pen = arah ? (s === arah ? 0 : 25) : 0;
    kandidat.push([hx + s * (r * 0.75 + jarak + w / 2 - h * 0.15), hy - r * 0.75 - h * 0.2, pen]);
    kandidat.push([hx + s * (r + jarak + w / 2), hy - r * 0.35, pen + 5]);
    kandidat.push([hx + s * (r + jarak + w / 2), hy + r * 0.1, pen + 15]);
  }
  let best: { x: number; y: number; tip: [number, number]; ekor: number; skor: number } | null = null;
  for (const [cx0, cy0, pen] of kandidat) {
    const cx = Math.min(safe.right - w / 2, Math.max(safe.left + w / 2, cx0));
    const cy = Math.min(safe.bottom - h / 2, Math.max(Math.max(safe.top, atas) + h / 2, cy0));
    const body: Kotak = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
    // ujung ekor: tepi kepala ke arah oval; dibatasi ke separuh atas/samping supaya tidak jatuh di wajah
    const C = tulang(cx, cy, w, h, [hx, hy]);
    let dx = C[0] - hx,
      dy = C[1] - hy;
    const n = Math.hypot(dx, dy) || 1;
    dx /= n;
    dy /= n;
    if (dy > 0.1) {
      // oval di bawah kepala: arahkan ekor ke sisi kepala, bukan ke dagu
      dy = 0.1;
      dx = Math.sign(dx || 1) * Math.sqrt(1 - dy * dy);
    }
    const tip: [number, number] = [hx + dx * r * 0.97, hy + dy * r * 0.97];
    const C2 = tulang(cx, cy, w, h, tip);
    const ekor = Math.max(0, Math.hypot(tip[0] - C2[0], tip[1] - C2[1]) - h / 2);
    const cover = Math.max(...semuaWajah.map((f) => tutup(body, f)));
    // batas 4% (audit menolak >12%): kotak wajah di sini perkiraan dari pusat kepala, rig bisa bergeser sedikit (tengok, napas)
    const skor = ekor + pen + (cover > 0.04 ? 1000 + cover * 1000 : cover * 200);
    if (!best || skor < best.skor) best = { x: cx, y: cy, tip, ekor, skor };
  }
  const { x, y, tip, ekor } = best!;
  return { x, y, tip, ekor };
}

/** posisi tanda kecil (Mark ?/!, bintang ±42 px) menempel di sudut atas kepala; sisi 1 = kanan, -1 = kiri */
export function letakTanda({ kepala, sisi = 1, atas = 490, safe = SAFE }: { kepala: Kepala; sisi?: number; atas?: number; safe?: typeof SAFE }) {
  const d = kepala.r + 30;
  const x = kepala.x + sisi * Math.cos((50 * Math.PI) / 180) * d;
  const y = kepala.y - Math.sin((50 * Math.PI) / 180) * d;
  return { x: Math.min(safe.right - 45, Math.max(safe.left + 45, x)), y: Math.min(safe.bottom - 45, Math.max(atas, y)) };
}

export function Bubble({
  f,
  a,
  b,
  x,
  y,
  tip,
  text,
  size = 60,
  fill = P.cream,
  ink = P.ink,
  shadow = true,
  id,
}: {
  f: number;
  /** frame muncul dan hilang */
  a: number;
  b: number;
  /** pusat bubble (layar); pakai letakBubble() supaya menempel di kepala */
  x: number;
  y: number;
  /** ujung ekor: tepi kepala pembicara */
  tip: [number, number];
  text: string;
  size?: number;
  fill?: string;
  ink?: string;
  shadow?: boolean;
  id?: string;
}) {
  if (f < a || f >= b) return null;
  const { s, o } = popIn(f, a, b);
  const { w, h } = ukuranBubble(text, size);
  // Ekor: dari tepi oval terdekat ke ujung, sedikit melengkung.
  const C = tulang(x, y, w, h, tip);
  let dx = tip[0] - C[0],
    dy = tip[1] - C[1];
  const n = Math.hypot(dx, dy) || 1;
  dx /= n;
  dy /= n;
  const nx = -dy,
    ny = dx;
  const base: [number, number] = [C[0] + dx * h * 0.36, C[1] + dy * h * 0.36];
  const edge: [number, number] = [C[0] + dx * (h / 2), C[1] + dy * (h / 2)];
  const half = size * 0.3;
  const bend = size * 0.12;
  const mx = (base[0] + tip[0]) / 2 + nx * bend,
    my = (base[1] + tip[1]) / 2 + ny * bend;
  const tail = `M${base[0] + nx * half} ${base[1] + ny * half} Q${mx + nx * half * 0.4} ${my + ny * half * 0.4} ${tip[0]} ${tip[1]} Q${mx - nx * half * 0.5} ${my - ny * half * 0.5} ${base[0] - nx * half} ${base[1] - ny * half} Z`;
  const words = text.trim().split(/\s+/).length;
  const ekorKe = Math.hypot(tip[0] - edge[0], tip[1] - edge[1]) > 1 && n > h / 2;
  return (
    <g
      opacity={o}
      data-fx="gelembung"
      data-box={`${Math.round(x - w / 2)},${Math.round(y - h / 2)},${Math.round(x + w / 2)},${Math.round(y + h / 2)}`}
      data-ekor={ekorKe ? `${Math.round(edge[0])},${Math.round(edge[1])},${Math.round(tip[0])},${Math.round(tip[1])}` : undefined}
      data-words={words}
      data-sfx="pop"
      data-sfx-id={id ?? `bubble-${a}-${text}`}
    >
      <g transform={`translate(${tip[0]} ${tip[1]}) scale(${s}) translate(${-tip[0]} ${-tip[1]})`}>
        {shadow && (
          <g opacity="0.13" transform={`translate(0 ${size * 0.12})`}>
            <path d={tail} fill={P.ink} />
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.5} ry={h * 0.5} fill={P.ink} />
          </g>
        )}
        <path d={tail} fill={fill} />
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.5} ry={h * 0.5} fill={fill} />
        <text x={x} y={y + size * 0.35} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={size} fill={ink}>
          {text}
        </text>
      </g>
    </g>
  );
}
