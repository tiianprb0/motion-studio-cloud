// Pratinjau subtitle untuk storyboard gambar diam (aturan pengguna 9 Nov 2026: "kenapa story board yang dia buat
// gak ada subtitle", lalu "Ya, buatkan"). Tampilan sama dengan Captions.tsx (gaya v7: Lato Bold 44 px, latar per
// kata, rata kiri, aksen wine), tapi diam: tanpa animasi masuk/keluar dan tanpa cues.json (narasi belum dibuat).
//
// Pemecahan kalimat meniru tools/captions.cjs: maks 7 kata dan 2 baris (lebar baris 700 px), utamakan potong di
// tanda baca, sisa 1–2 kata tidak dibiarkan sendirian. Lebar kata = jumlah lebar huruf Lato Bold 44 px yang diukur
// di Chrome dengan cara captions.cjs (9 Nov 2026; selisih rata-rata 0,3 px per kata, tanpa kerning). Subtitle film
// tetap memakai ukuran kata utuh dari tools/captions.cjs.
//
// Pakai di src/Storyboard.tsx (PHASES = 2):
//   <CaptionsDiam teks={panel.line} bagian={t ? 'akhir' : 0} />   // awal = potongan pertama, akhir = terakhir
// Seri Lirik tidak memakai ini (teks lirik punya gaya sendiri).
import React from 'react';
import { P } from '../../core/v1/core';

const MAXW = 700,
  PAD = 20,
  GAP = 8,
  MAXWORDS = 7,
  MAXROWS = 2;
// lebar huruf Lato Bold 44 px (px), diukur dengan canvas measureText di Chrome
const HURUF: Record<string, number> = {"0":25.5,"1":25.5,"2":25.5,"3":25.5,"4":25.5,"5":25.5,"6":25.5,"7":25.5,"8":25.5,"9":25.5,"a":23,"b":25.1,"c":21,"d":25.1,"e":23.5,"f":15.4,"g":22.8,"h":25,"i":11.9,"j":11.8,"k":24.3,"l":11.9,"m":37,"n":25,"o":25,"p":24.9,"q":25.1,"r":18,"s":19.2,"t":17,"u":25,"v":23.5,"w":34.8,"x":23.8,"y":23.5,"z":20.7,"A":31.2,"B":28.7,"C":29.5,"D":32.9,"E":25.2,"F":24.7,"G":31.8,"H":33.3,"I":13.8,"J":19.2,"K":30.7,"L":22.7,"M":40.9,"N":33.3,"O":35.2,"P":27.5,"Q":35.2,"R":28.8,"S":23.6,"T":26.2,"U":32,"V":31.2,"W":46,"X":29.9,"Y":28.8,"Z":27.1,".":9.9,",":9.9,"!":15.9,"?":18.5,":":11.7,";":11.7,"'":10.5,"\"":18.6,"“":17.2,"”":17.2,"‘":9.9,"’":9.9,"(":13.2,")":13.2,"-":15.8,"–":25,"—":37,"…":33.4,"/":17,"%":35.3,"&":31.4,"+":25.5,"=":25.5,"#":25.5,"@":36.2,"*":17.6};
const lebarTeks = (w: string) => Math.ceil([...w].reduce((s, c) => s + (HURUF[c] ?? 24), 0));
const lebarKata = (w: string) => lebarTeks(w) + PAD + GAP;
const tandaBaca = (w: string) => /[,.?!:;…"”]$/.test(w);

function barisDari(ws: string[]): string[][] {
  const rows: string[][] = [[]];
  let rw = 0;
  for (const w of ws) {
    if (rw + lebarKata(w) > MAXW && rows[rows.length - 1].length) {
      rows.push([]);
      rw = 0;
    }
    rows[rows.length - 1].push(w);
    rw += lebarKata(w);
  }
  if (rows.length !== 2) return rows;
  // dua baris diseimbangkan, seperti captions.cjs
  const lebar = (a: string[]) => a.reduce((s, w) => s + lebarKata(w), 0);
  let best: { k: number; d: number } | null = null;
  for (let k = 1; k < ws.length; k++) {
    const a = lebar(ws.slice(0, k)),
      b = lebar(ws.slice(k));
    if (a > MAXW || b > MAXW) continue;
    const d = Math.abs(a - b);
    if (!best || d < best.d) best = { k, d };
  }
  return best ? [ws.slice(0, best.k), ws.slice(best.k)] : rows;
}

function biaya(W: string[], i: number, j: number): number | null {
  const n = j - i;
  if (n > MAXWORDS) return null;
  if (barisDari(W.slice(i, j)).length > MAXROWS) return null;
  let c = 2;
  if (j < W.length && !tandaBaca(W[j - 1])) c += 1;
  for (let k = i; k < j - 1; k++) if (/[.?!…]["”]?$/.test(W[k])) c += 2;
  if (n <= 2 && W.length > 2) c += 3;
  else if (n === 3 && W.length > 3) c += 0.5;
  return c;
}

/** Pecah satu kalimat narasi menjadi potongan subtitle; tiap potongan berisi baris (maks 2). */
export function potongSubtitle(teks: string): string[][] {
  const W = String(teks || '').trim().split(/\s+/).filter(Boolean);
  if (!W.length) return [];
  const best = [0],
    from = [0];
  for (let j = 1; j <= W.length; j++) {
    best[j] = Infinity;
    for (let i = Math.max(0, j - MAXWORDS); i < j; i++) {
      const c = best[i] === Infinity ? null : biaya(W, i, j);
      if (c !== null && best[i] + c < best[j]) {
        best[j] = best[i] + c;
        from[j] = i;
      }
    }
    if (best[j] === Infinity) {
      best[j] = best[j - 1] + 10;
      from[j] = j - 1;
    }
  }
  const out: string[][] = [];
  for (let j = W.length; j > 0; j = from[j]) out.unshift(W.slice(from[j], j));
  return out.map((ws) => barisDari(ws).map((r) => r.join(' ')));
}

export function CaptionsDiam({
  teks,
  bagian = 0,
  accent,
  strip = /["“”.,!?:]/g,
  x = 110,
  y = 300,
}: {
  /** Kalimat narasi panel ini. */
  teks: string;
  /** Potongan yang ditampilkan: nomor (0 = pertama) atau 'akhir' (potongan terakhir). */
  bagian?: number | 'akhir';
  /** Kata yang diberi latar wine, sama dengan Captions. */
  accent?: RegExp;
  strip?: RegExp;
  /** Pojok kiri atas baris pertama; samakan dengan rencana posisi subtitle film. */
  x?: number;
  y?: number;
}) {
  const potongan = potongSubtitle(teks);
  if (!potongan.length) return null;
  const k = bagian === 'akhir' ? potongan.length - 1 : Math.min(Math.max(0, bagian), potongan.length - 1);
  const rows = potongan[k];
  return (
    <g data-layer="subtitle" data-pratinjau="true">
      <g data-caption="true" fontFamily="Lato" fontSize="44" fontWeight="700">
        {rows.map((row, i) => {
          let cx = x;
          return (
            <g key={i}>
              {row.split(' ').map((w, j) => {
                const width = lebarTeks(w) + PAD,
                  wx = cx;
                cx += width + GAP;
                const acc = !!accent && accent.test(w.replace(strip, ''));
                const wy = y + i * 70;
                return (
                  <g data-word="true" key={j}>
                    <rect x={wx} y={wy} width={width} height="62" rx="8" fill={acc ? P.wine : P.cream} />
                    <text x={wx + 10} y={wy + 45} fill={acc ? P.cream : P.ink}>
                      {w}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
    </g>
  );
}
