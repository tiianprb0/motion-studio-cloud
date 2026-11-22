// Extras v2 = "warga" (9 Nov 2026): 18 figuran bernama-kode untuk video dan avatar Kampung Less. (web).
// Digambar dengan rig v3 (`Person extra={look}`); Naya dan Yan tidak berubah (jalur rig mereka identik dengan v2).
// STATUS: KANDIDAT. Belum boleh dipakai di video sebelum pengguna menyetujui lembar contoh (contoh/LembarWarga.png).
// Id (w01..w18) dipakai database web untuk pilihan karakter donatur; jangan diganti. Gambar baru = versi baru (v3).
import React from 'react';
import { Person, type Actor } from '../../rig/v3/Character';
import type { ExtraLook } from '../../rig/v3/Character';

const K = { k1: '#FFF1E6', k2: '#F7DCC6', k3: '#EBC6A6', k4: '#D7A784', k5: '#BE8C68' };
const R = { hitam: '#2F2A27', tua: '#4A3A30', cokelat: '#6B4C3B', merah: '#7A4436', uban: '#B9B3AC' };

export const WARGA: ExtraLook[] = [
  { id: 'w01', nama: 'Rambut panjang, kemeja biru', who: 'her', rambut: 'panjang', warnaRambut: R.hitam, kulit: K.k2, baju: 'kemeja', warnaBaju: '#A9BED0', bawah: '#6F7C8C' },
  { id: 'w02', nama: 'Kuncir, kaos garis', who: 'her', rambut: 'kuncir', warnaRambut: R.cokelat, kulit: K.k1, baju: 'garis', warnaBaju: '#F4EADB', warnaDalam: '#C98E7A', bawah: '#5E6B78', aksen: '#C98E7A' },
  { id: 'w03', nama: 'Hijab mauve, kardigan', who: 'her', rambut: 'hijab', warnaRambut: R.tua, kulit: K.k3, baju: 'kardigan', warnaBaju: '#E6D2B5', warnaDalam: '#F7F1E8', bawah: '#7D7A8C', aksen: '#B58A9A', lenganPanjang: true, rokPanjang: true },
  { id: 'w04', nama: 'Hijab hijau laut, kemeja krem', who: 'her', rambut: 'hijab', warnaRambut: R.tua, kulit: K.k2, baju: 'kemeja', warnaBaju: '#F1E3CB', bawah: '#8A7C70', aksen: '#6E9C97', lenganPanjang: true, rokPanjang: true },
  { id: 'w05', nama: 'Cepol, hoodie mustard', who: 'her', rambut: 'cepol', warnaRambut: R.hitam, kulit: K.k3, baju: 'hoodie', warnaBaju: '#D8B66E', warnaDalam: '#F7F0E4', bawah: '#5F6F78', lenganPanjang: true },
  { id: 'w06', nama: 'Kepang, batik wine', who: 'her', rambut: 'kepang', warnaRambut: R.tua, kulit: K.k4, baju: 'batik', warnaBaju: '#A65E6E', warnaDalam: '#F3D79F', bawah: '#5E5550', aksen: '#F3D79F' },
  { id: 'w07', nama: 'Keriting, jaket denim', who: 'her', rambut: 'keriting', warnaRambut: '#5A3E31', kulit: K.k5, baju: 'jaket', warnaBaju: '#7C8FA8', warnaDalam: '#F2D6CB', bawah: '#4B5664', lenganPanjang: true },
  { id: 'w08', nama: 'Pixie, kaos lavender', who: 'her', rambut: 'pixie', warnaRambut: R.merah, kulit: K.k1, baju: 'kaos', warnaBaju: '#C7B7D6', bawah: '#6E6A7E', anting: true },
  { id: 'w09', nama: 'Sanggul uban, batik ungu', who: 'her', rambut: 'sanggul', warnaRambut: R.uban, kulit: K.k2, baju: 'batik', warnaBaju: '#7E6A9A', warnaDalam: '#E9D9F2', bawah: '#6E5F57', kacamata: true, lenganPanjang: true, rokPanjang: true },
  { id: 'w10', nama: 'Cepak, kaos terakota', who: 'him', rambut: 'cepak', warnaRambut: R.hitam, kulit: K.k4, baju: 'kaos', warnaBaju: '#D98F6F', bawah: '#4E5A63' },
  { id: 'w11', nama: 'Jabrik, hoodie biru abu', who: 'him', rambut: 'jabrik', warnaRambut: R.tua, kulit: K.k2, baju: 'hoodie', warnaBaju: '#8EA0B5', warnaDalam: '#F7F0E4', bawah: '#3F4A55', lenganPanjang: true },
  { id: 'w12', nama: 'Belah samping, kemeja krem, kacamata', who: 'him', rambut: 'belah', warnaRambut: R.cokelat, kulit: K.k1, baju: 'kemeja', warnaBaju: '#F1E3CB', bawah: '#7A6A58', kacamata: true },
  { id: 'w13', nama: 'Rambut diikat, jaket cokelat', who: 'him', rambut: 'ikat', warnaRambut: R.hitam, kulit: K.k3, baju: 'jaket', warnaBaju: '#7A6A58', warnaDalam: '#E7DCC6', bawah: '#3E4A44', jenggot: true, lenganPanjang: true },
  { id: 'w14', nama: 'Topi, kaos garis biru', who: 'him', rambut: 'topi', warnaRambut: R.tua, kulit: K.k4, baju: 'garis', warnaBaju: '#F7F0E4', warnaDalam: '#8EA0B5', bawah: '#5B6470', aksen: '#C98E7A' },
  { id: 'w15', nama: 'Kupluk, jaket mustard', who: 'him', rambut: 'kupluk', warnaRambut: R.hitam, kulit: K.k5, baju: 'jaket', warnaBaju: '#D8B66E', warnaDalam: '#F7F0E4', bawah: '#4E5A63', aksen: '#B58A9A', lenganPanjang: true },
  { id: 'w16', nama: 'Peci, batik sogan, kumis', who: 'him', rambut: 'peci', warnaRambut: R.uban, kulit: K.k3, baju: 'batik', warnaBaju: '#8B6B4A', warnaDalam: '#E9C9A6', bawah: '#3E3A36', kumis: true, lenganPanjang: true },
  { id: 'w17', nama: 'Botak, kemeja biru muda', who: 'him', rambut: 'botak', warnaRambut: R.tua, kulit: K.k2, baju: 'kemeja', warnaBaju: '#B7C9D9', bawah: '#6E6A62', kacamata: true, jenggot: true },
  { id: 'w18', nama: 'Afro, kaos merah muda', who: 'him', rambut: 'afro', warnaRambut: R.hitam, kulit: K.k5, baju: 'kaos', warnaBaju: '#E9B7C1', bawah: '#3F4A55' },
];
export const WARGA_ID = WARGA.map((w) => w.id);
export const cariWarga = (id: string) => WARGA.find((w) => w.id === id) ?? null;

// Pakai: <Warga id="w05" x={..} y={..} s={..} f={f} {...POSE.her.santai} />  (pose tangan dari POSE rig v3)
export const Warga = ({ id, ...p }: Omit<Actor, 'who' | 'extra' | 'appearance'> & { id: string }) => {
  const look = cariWarga(id);
  if (!look) return null;
  return <Person {...p} who={look.who} extra={look} shirtColor={look.warnaBaju} trouserColor={look.bawah} role={p.role ?? 'background'} body="lama" />;
};
