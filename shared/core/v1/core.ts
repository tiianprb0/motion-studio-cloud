// Inti bersama Motion Studio v1 (7 Nov 2026): palet brand dan fungsi waktu.
// Nilai identik dengan shared/characters/rig/v1 dan v2 (Character.tsx, fx.tsx).
// Aset baru (lokasi, properti, UI, film) mengimpor dari SINI, bukan dari Character.tsx,
// supaya satu film tidak menarik dua versi rig hanya demi warna. Rig v3 nanti juga
// wajib mengimpor P dari sini. Mengubah nilai di file ini = buat shared/core/v2.

export const P = {
  paper: '#F7F0E4',
  cream: '#FFF9EF',
  ink: '#283D36',
  wine: '#8B4354',
  sage: '#95B8A2',
  pale: '#DEE2D4',
  wood: '#BA906B',
  gold: '#D1A258',
  skin: '#FCEADE',
  girl: '#FCEADE',
  line: '#CFC3AF',
  memory: '#EAD8B9',
  night: '#485850',
};

export const unit = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const t = unit(x);
  return t * t * (3 - 2 * t);
};
/** Transisi halus (smoothstep) dari x ke y antara frame a dan b. */
export const ramp = (f: number, a: number, b: number, x = 0, y = 1) =>
  x + (y - x) * smooth((f - a) / (b - a));
/** Transisi cepat di awal lalu melambat (ease-out kubik). */
export const quick = (f: number, a: number, b: number, x = 0, y = 1) =>
  x + (y - x) * (1 - Math.pow(1 - unit((f - a) / (b - a)), 3));
/** Muncul memantul (skala s, opasitas o) di frame a, hilang menjelang frame b. */
export const popIn = (f: number, a: number, b: number) => {
  const x = unit((f - a) / 7);
  const out = 1 - unit((f - (b - 6)) / 6);
  const back = 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  return { s: Math.max(0, back) * out, o: Math.min(1, x * 2) * out };
};
