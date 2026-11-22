// Extras v3 = warga Papua (18 Nov 2026): figuran untuk adegan di Papua ("Kebakaran Hutan Papua" v1; pengguna 18 Nov 2026:
// "buat kan konten soal kebakaran hutan di papua, kategori normal bukan stand up, narator naya").
// Digambar dengan rig v3 (`Person extra={look}`), bahasa gambar sama dengan warga v2 dan Naya/Yan. Kulit lebih gelap dari
// skala warga v2 (k1–k5 berhenti di sawo matang), rambut keriting/afro hitam, pakaian sehari-hari masa kini (kaos, kemeja,
// jaket, topi). Tidak ada kostum "adat" atau atribut tempelan: warga adat di video hari ini tetap memakai baju sehari-hari.
// STATUS: DISETUJUI pengguna 18 Nov 2026 ("Setujui storyboard" atas storyboard "Bukan Kesalahan Kami?" yang memuat p01, p02,
// p03, p05; lembar contoh/LembarWargaPapua.png dikirim bersama storyboard pertama). Boleh dipakai di video.
// Pakai: <WargaPapua id="p01" x y s f view dir mood {...POSE.him.santai} holdRight=... />
import React from 'react';
import { Person, type Actor } from '../../rig/v3/Character';
import type { ExtraLook } from '../../rig/v3/Character';

export const KULIT_PAPUA = { p1: '#9A6A4A', p2: '#7E5238', p3: '#6A432E' };
const R = { hitam: '#1F1B19', tua: '#2E2622' };

export const WARGA_PAPUA: ExtraLook[] = [
  { id: 'p01', nama: 'Bapak, rambut keriting pendek, kaos hijau tua', who: 'him', rambut: 'keriting', warnaRambut: R.hitam, kulit: KULIT_PAPUA.p2, baju: 'kaos', warnaBaju: '#5E7F5A', bawah: '#4A4540', kumis: true },
  { id: 'p02', nama: 'Mama, rambut keriting panjang, kemeja kuning', who: 'her', rambut: 'keriting', warnaRambut: R.hitam, kulit: KULIT_PAPUA.p1, baju: 'kemeja', warnaBaju: '#E2B24E', bawah: '#6B4E5A', rokPanjang: true },
  { id: 'p03', nama: 'Pemuda, afro, kaos merah bata', who: 'him', rambut: 'afro', warnaRambut: R.hitam, kulit: KULIT_PAPUA.p3, baju: 'kaos', warnaBaju: '#B4553F', bawah: '#3F4A55' },
  { id: 'p04', nama: 'Pemantau, topi, jaket lapangan', who: 'him', rambut: 'topi', warnaRambut: R.tua, kulit: KULIT_PAPUA.p2, baju: 'jaket', warnaBaju: '#7C7A52', warnaDalam: '#E9E1CF', bawah: '#4E4A42', aksen: '#C98E4A', lenganPanjang: true },
  { id: 'p05', nama: 'Ibu muda, kuncir, kaos garis', who: 'her', rambut: 'kuncir', warnaRambut: R.hitam, kulit: KULIT_PAPUA.p3, baju: 'garis', warnaBaju: '#F4EADB', warnaDalam: '#3F7F8F', bawah: '#4B5664', aksen: '#3F7F8F' },
];
export const cariWargaPapua = (id: string) => WARGA_PAPUA.find((w) => w.id === id) ?? null;

export const WargaPapua = ({ id, ...p }: Omit<Actor, 'who' | 'extra' | 'appearance'> & { id: string }) => {
  const look = cariWargaPapua(id);
  if (!look) return null;
  return <Person {...p} who={look.who} extra={look} shirtColor={look.warnaBaju} trouserColor={look.bawah} role={p.role ?? 'background'} body="lama" />;
};
