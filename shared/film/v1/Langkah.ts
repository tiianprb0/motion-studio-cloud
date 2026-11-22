// Langkah kaki tokoh berjalan (12 Nov 2026). Pengguna atas Kritik v5: "proses jalan karakter kok aneh ya? kaki udah bergerak
// tapi masih jalan di tempat beberapa detik, begitu juga diam. dia udah diam tapi kaki masih gerak."
// Penyebab lama: ayunan kaki memakai jam tetap (sin(f·0,42), ±4 langkah/dtk) sementara posisi memakai percepatan halus
// sepanjang jalan, jadi di awal/akhir kaki mengayun padahal badan hampir tidak berpindah.
// Di sini:
// - Kecepatan trapesium: mulai bergerak dalam `mulai` frame, kecepatan tetap, berhenti dalam `henti` frame.
// - Fase ayunan dihitung dari JARAK TEMPUH (meter): satu langkah tiap `panjang` m, jadi kaki hanya bergerak saat badan
//   berpindah dan iramanya sesuai kecepatan.
// - Besar ayunan ikut kecepatan: nol saat diam, penuh saat kecepatan tetap → kaki kembali lurus saat berhenti.
// Pakai (panggung 2D Gang Melati):
//   const j = langkah({ f, a, b, jalur: (t) => ({ x: lerp(x0, x1, t), y: lerp(y0, y1, t) }), skala: skala2D });
//   di(j.x, j.y, orang('ibu', { ..., step: j.step }))
// `skala(y)` = skala rig di y kaki (rig: tinggi 1,65 m = 330 unit → 1 m = 200 unit × skala).

export type Titik = { x: number; y: number };

export type Langkah = {
  x: number;
  y: number;
  /** 0..1 bagian jarak yang sudah ditempuh */
  t: number;
  /** ayunan kaki untuk prop `step` rig (−1..1), 0 saat diam */
  step: number;
  /** sedang berpindah */
  bergerak: boolean;
  /** kecepatan relatif 0..1 */
  laju: number;
};

const TABEL = new WeakMap<(t: number) => Titik, { t: number[]; d: number[] }>();

/** panjang lintasan kumulatif (meter) dari jalur(0) sampai jalur(t), disampel 64 titik */
function tabelJarak(jalur: (t: number) => Titik, skala: (y: number) => number) {
  const ada = TABEL.get(jalur);
  if (ada) return ada;
  const n = 64,
    t: number[] = [0],
    d: number[] = [0];
  let p = jalur(0);
  for (let i = 1; i <= n; i++) {
    const q = jalur(i / n);
    const m = Math.hypot(q.x - p.x, q.y - p.y) / (200 * Math.max(0.05, skala((p.y + q.y) / 2)));
    t.push(i / n);
    d.push(d[i - 1] + m);
    p = q;
  }
  const hasil = { t, d };
  TABEL.set(jalur, hasil);
  return hasil;
}

/** posisi + ayunan kaki tokoh yang berjalan menyusuri `jalur` dari frame a sampai b */
export function langkah({
  f,
  a,
  b,
  jalur,
  skala,
  mulai = 8,
  henti = 10,
  panjang = 0.5,
}: {
  f: number;
  a: number;
  b: number;
  /** lintasan kaki di dunia, t 0..1 (boleh melengkung) */
  jalur: (t: number) => Titik;
  /** skala rig di y kaki */
  skala: (y: number) => number;
  /** frame percepatan di awal dan perlambatan di akhir */
  mulai?: number;
  henti?: number;
  /** panjang satu langkah (m) */
  panjang?: number;
}): Langkah {
  const T = Math.max(1, b - a);
  const ta = Math.min(mulai, T / 2),
    td = Math.min(henti, T / 2);
  const vmax = 1 / (T - ta / 2 - td / 2); // bagian lintasan per frame pada kecepatan tetap
  const tau = Math.min(T, Math.max(0, f - a));
  let p: number, v: number;
  if (tau < ta) {
    p = (0.5 * vmax * tau * tau) / ta;
    v = tau / ta;
  } else if (tau <= T - td) {
    p = vmax * (tau - ta / 2);
    v = 1;
  } else {
    const r = T - tau;
    p = 1 - (0.5 * vmax * r * r) / td;
    v = r / td;
  }
  p = Math.min(1, Math.max(0, p));
  const bergerak = f > a && f < b;
  if (!bergerak) v = 0;
  // jarak (m) → parameter t jalur (lintasan bisa tidak rata kecepatannya)
  const tb = tabelJarak(jalur, skala);
  const total = tb.d[tb.d.length - 1];
  const target = p * total;
  let k = 1;
  while (k < tb.d.length - 1 && tb.d[k] < target) k++;
  const d0 = tb.d[k - 1],
    d1 = tb.d[k];
  const t = tb.t[k - 1] + (tb.t[k] - tb.t[k - 1]) * (d1 > d0 ? (target - d0) / (d1 - d0) : 0);
  const pos = jalur(Math.min(1, Math.max(0, t)));
  // satu periode sinus = dua langkah
  const amp = v * v * (3 - 2 * v);
  const step = amp * Math.sin((Math.PI * target) / panjang);
  return { x: pos.x, y: pos.y, t: p, step, bergerak, laju: v };
}

/** jalur lurus dari a ke b */
export const garis = (p: Titik, q: Titik) => (t: number): Titik => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
