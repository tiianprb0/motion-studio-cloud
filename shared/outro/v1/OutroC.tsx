// Outro C: DISETUJUI pengguna 7 Nov 2026 setelah storyboard ("nice aku suka. boleh pakai itu").
// Menggantikan Outro B (shared/characters/rig/v2/OutroOptions.tsx) untuk video baru; video lama tidak diubah.
// Dasar: riset penutup 11 Shorts animasi dari 6 kanal. Penutup mereka 0–4 detik setelah kata terakhir;
// Less. sekarang 5–8,5 detik, termasuk layar hijau tua yang memberi tanda "selesai" sebelum CTA terbaca.
//
// Bentuk:
// - Adegan terakhir TIDAK diganti layar gelap. Kartu hijau tua (P.ink) muncul DI ATAS adegan.
//   Bawaan: posisi 'atas', di tempat subtitle biasa berada. Komposisi Less. selalu mengosongkan area itu,
//   jadi tokoh tetap terlihat utuh. Pilihan 'bawah' untuk adegan yang bagian atasnya ramai.
//   Isinya wordmark less.certain + garis emas, satu baris CTA, tombol "+ Ikuti" → "Mengikuti ✓",
//   ikon TikTok/IG dan @less.certain. Unsur dan warna sama dengan Outro B.
// - Waktu (30 fps): kata terakhir selesai → tahan 0,8 dtk (OUTRO_C.hold) → kartu 2,2 dtk (OUTRO_C.len).
//   Ekor total 3,0 dtk.
// - Semua isi di dalam safe zone (x 60–920, y ≤1480); kolom kanan dibiarkan untuk tombol platform.
//   Tengah kartu x=490, bukan 540.
// - CTA bergantian, bukan formula:
//   { kind: 'ikuti' }               → "Ikuti untuk melihat lebih dekat." (bawaan)
//   { kind: 'tanya', text }         → pertanyaan spesifik topik (sama dengan kalimat penutup narasi)
//   { kind: 'seri', text }          → seri, misalnya Open Mic
//   Jangan meminta share/tag/komen secara eksplisit (engagement bait diturunkan Meta, termasuk di audio).
// - Watermark pojok kanan atas hilang saat kartu muncul. Wordmark di kartu menggantikannya.
import React from 'react';
import { P, quick, ramp } from '../../core/v1/core';
import { SocialIcon } from '../../characters/rig/v2/SocialIcons';

export const OUTRO_C = { hold: 24, len: 66 };
/** Waktu outro dari frame kata terakhir selesai. `start` = kartu mulai; `OUTRO` diekspor Film.tsx supaya
 *  renderer menyembunyikan watermark tepat saat kartu muncul (renderer: watermark hanya bila f < OUTRO - 12);
 *  `TOTAL` = frame terakhir video. Di Frame: adegan terakhir tetap digambar, lalu <OutroC f={f - start} /> di atasnya. */
export const outroCTimes = (lastWordEnd: number) => {
  const start = lastWordEnd + OUTRO_C.hold;
  return { start, OUTRO: start + 12, TOTAL: start + OUTRO_C.len };
};
export type CtaC = { kind: 'ikuti' } | { kind: 'tanya'; text: string } | { kind: 'seri'; text: string };

const CX = 490;
const X0 = 60;
const X1 = 920;
const Y1B = 1460; // batas bawah kartu untuk posisi 'bawah' (safe zone ≤1480)
const PRESS = 40;

export function OutroC({ f, cta = { kind: 'ikuti' }, place = 'atas', id = 'outro-c' }: { f: number; cta?: CtaC; place?: 'atas' | 'bawah'; id?: string }) {
  if (f < 0) return null;
  const lines = cta.kind === 'ikuti' ? ['Ikuti untuk melihat lebih dekat.'] : cta.text.split('\n');
  const H = 370 + (lines.length - 1) * 48;
  const top = place === 'atas';
  const Y0 = top ? 250 : Y1B - H;
  const Y1 = Y0 + H;
  const up = quick(f, 0, 10);
  const word = quick(f, 4, 14);
  const line = quick(f, 8, 20);
  const text = quick(f, 10, 20);
  const row = quick(f, 16, 26);
  const press = f >= PRESS && f < PRESS + 5 ? 0.93 : f >= PRESS + 5 && f < PRESS + 10 ? 1.05 : 1;
  const done = f >= PRESS + 4;
  const ring = quick(f, PRESS + 2, PRESS + 18);
  // Baris bawah: tombol (250) + ikon (2 × 44) + handle; total ±660 px, berpusat di CX.
  const rowX = CX - 330;
  return (
    <g data-outro="C">
      <defs>
        <linearGradient id={`${id}-scrim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.ink} stopOpacity="0" />
          <stop offset="1" stopColor={P.ink} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* Adegan diredupkan sedikit di sisi kartu saja, supaya tetap terbaca sebagai dunia yang sama. */}
      {top ? (
        <rect x="0" y="0" width="1080" height="1000" fill={`url(#${id}-scrim)`} transform="translate(0 1000) scale(1 -1)" opacity={ramp(f, 0, 12) * 0.8} />
      ) : (
        <rect x="0" y="900" width="1080" height="1020" fill={`url(#${id}-scrim)`} opacity={ramp(f, 0, 12)} />
      )}
      {/* Atas: turun pendek 60 px sambil muncul. Bawah: naik dari luar layar. */}
      <g transform={`translate(0 ${top ? -60 * (1 - up) : (1 - up) * (H + 160)})`} opacity={Math.min(1, up * 1.6)} data-sfx="slide" data-sfx-id={`${id}-masuk`}>
        <g {...(up > 0.99 ? { 'data-box': `${X0},${Y0},${X1},${Y1}` } : {})}>
          <rect x={X0} y={Y0} width={X1 - X0} height={H} rx="40" fill={P.ink} opacity="0.97" />
          <g opacity={word} transform={`translate(${CX} ${Y0 + 112 + 20 * (1 - word)})`}>
            <text fontFamily="Playfair" textAnchor="middle" fontSize="88" fill={P.cream} letterSpacing="-4">
              less.certain
            </text>
            <path d={`M-200 34h${400 * line}`} stroke={P.gold} strokeWidth="5" strokeLinecap="round" />
          </g>
          {lines.map((l, i) => (
            <text
              key={i}
              x={CX}
              y={Y0 + 208 + i * 48 + 14 * (1 - text)}
              textAnchor="middle"
              fontFamily="Lato"
              fontWeight={cta.kind === 'ikuti' ? 700 : 900}
              fontSize="38"
              fill={cta.kind === 'ikuti' ? '#DDE3D8' : P.cream}
              opacity={text}
            >
              {l}
            </text>
          ))}
          <g opacity={row} transform={`translate(0 ${16 * (1 - row)})`}>
            <g transform={`translate(${rowX + 125} ${Y1 - 62}) scale(${press})`} data-cta="pill" {...(f >= PRESS ? { 'data-sfx': 'click', 'data-sfx-id': `${id}-ikuti` } : {})}>
              {ring > 0 && ring < 1 && (
                <rect x={-125 - 24 * ring} y={-35 - 12 * ring} width={250 + 48 * ring} height={70 + 24 * ring} rx={35 + 12 * ring} fill="none" stroke={P.gold} strokeWidth="4" opacity={1 - ring} />
              )}
              <rect x="-125" y="-35" width="250" height="70" rx="35" fill={done ? P.cream : P.wine} />
              <text x="0" y="13" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="34" fill={done ? P.ink : P.cream}>
                {done ? 'Mengikuti ✓' : '+ Ikuti'}
              </text>
            </g>
            <g data-social-row="true">
              <SocialIcon name="tiktok" x={rowX + 286} y={Y1 - 84} size={44} color={P.cream} />
              <SocialIcon name="instagram" x={rowX + 342} y={Y1 - 84} size={44} color={P.cream} />
              <text x={rowX + 404} y={Y1 - 49} fontFamily="Lato" fontWeight="700" fontSize="38" fill={P.cream}>
                @less.certain
              </text>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
