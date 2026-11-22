// Balik badan (berbalik) untuk rig v2 (12 Nov 2026). Pengguna atas Aku Bisa Jadi Villain v2: "detik 17 kok langsung hadap
// belakang si naya? harusnya gak gitu kalau di logika in gak sih?"
// Penyebab lama: `view` diganti dari 'three' ke 'back' dalam satu frame saat tokoh mulai berjalan, jadi badannya meloncat.
// Di sini tokoh berputar dalam `durasi` frame:
// - badan menyempit mendatar (sx) sampai titik tengah, seperti badan yang sedang menyamping;
// - tampak diganti TEPAT di titik tengah (saat badan paling sempit), lalu melebar lagi.
// Tampak 'serong' rig v2 tidak dipakai (rambut bob membuat belakang kepala tampak botak), jadi putaran three/front ↔ back.
// Berbalik dulu di tempat, baru berjalan: mulai `langkah()` sesudah `a + durasi`.
// Di depan cermin, pantulan berputar bersamaan ke arah sebaliknya: berbalik({ ..., dari: ke, ke: dari }).
// Pakai:
//   const b = berbalik({ f, a: mulaiBalik, dari: 'three', ke: 'back' });
//   orang({ view: b.view, sx: b.sx })   // sx dipasang sebagai scale(sx 1) di sekitar x kaki tokoh

export type Tampak = 'front' | 'three' | 'back';

export type Balik = {
  /** tampak yang digambar pada frame ini */
  view: Tampak;
  /** lebar badan 0..1 (1 = normal), dipasang sebagai scale(sx 1) di sekitar x kaki */
  sx: number;
  /** kemajuan putaran 0..1 */
  u: number;
  /** sudah lewat titik tengah */
  sudah: boolean;
};

export function berbalik({ f, a, durasi = 10, dari, ke, sempit = 0.42 }: { f: number; a: number; durasi?: number; dari: Tampak; ke: Tampak; sempit?: number }): Balik {
  const u = Math.max(0, Math.min(1, (f - a) / durasi));
  const sudah = u >= 0.5;
  return { view: sudah ? ke : dari, sx: 1 - sempit * Math.sin(Math.PI * u), u, sudah };
}

/** transform SVG untuk menyempitkan gambar tokoh di sekitar x kakinya */
export const sxDi = (x: number, sx: number) => (sx >= 0.999 ? undefined : `translate(${x.toFixed(1)} 0) scale(${sx.toFixed(4)} 1) translate(${(-x).toFixed(1)} 0)`);
