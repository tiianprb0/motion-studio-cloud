// Pembantu waktu untuk Film.tsx (7 Nov 2026). Sebelumnya fr/LS/LE/W ditulis ulang di setiap proyek.
// Input: src/timeline.json hasil tools/narration_timeline.py atau tools/standup_timeline.py.
export type Word = { w: string; s: number; e: number };
export type Line = { text: string; start: number; end: number; words: Word[] };
export type Laugh = { line: number; at: number; dur: number; [k: string]: unknown };
export type Timeline = { fps: number; outro: number; total: number; lines: Line[]; laughs?: Laugh[] };

/** Buang tanda baca dan huruf besar supaya pencarian kata tidak gagal karena koma/titik. */
export const normWord = (w: string) => w.replace(/["“”.,!?:;…]/g, '').toLowerCase();

export function makeTimeline(tl: Timeline) {
  const FPS = tl.fps || 30;
  const fr = (sec: number) => Math.round(sec * FPS);
  const L = tl.lines;
  /** Frame awal / akhir baris narasi ke-i. */
  const LS = (i: number) => fr(L[i].start);
  const LE = (i: number) => fr(L[i].end);
  /** Frame saat kata `w` diucapkan di baris i (kemunculan ke-n, mulai 0). */
  const W = (i: number, w: string, n = 0) => {
    const hits = L[i].words.filter((x) => normWord(x.w) === normWord(w));
    if (!hits[n]) throw new Error(`kata "${w}" tidak ada di baris ${i}: ${L[i].text}`);
    return fr(hits[n].s);
  };
  /** Frame tawa yang menempel di baris punchline (khusus timeline stand-up). */
  const LA = (line: number) => {
    const l = tl.laughs?.find((x) => x.line === line);
    if (!l) throw new Error(`tidak ada tawa di baris ${line}`);
    return fr(l.at);
  };
  return { FPS, fr, L, LS, LE, W, LA, OUTRO: tl.outro, TOTAL: tl.total };
}

/** Indeks shot aktif dari daftar SHOTS [[frameMulai, nama], ...] yang terurut. */
export function shotIndex(shots: [number, string][], f: number) {
  let i = 0;
  for (let k = 0; k < shots.length; k++) if (f >= shots[k][0]) i = k;
  return i;
}
/** Batas minimum durasi shot yang diperiksa audit: 1,3 dtk @30fps. Jangan diturunkan per proyek. */
export const MIN_SHOT = 39;
