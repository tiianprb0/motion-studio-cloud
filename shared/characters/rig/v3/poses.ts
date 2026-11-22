// Pustaka pose tangan bersama (7 Nov 2026). SATU-SATUNYA sumber koordinat tangan untuk proyek.
// Audit (tools/render-film.cjs --audit) menolak `left={[..]}` / `right={[..]}` berisi angka di Film.tsx — pakai {...POSE.him.santai} dst.
// status 'disetujui' = dari POSES Character.tsx (sudah lolos cek & dilihat pengguna).
// status 'kandidat' = lolos audit anatomi, tapi BELUM ditunjukkan ke pengguna sebagai pose pustaka (aturan creative-contract butir 10).
// Pose baru berikutnya: tambahkan di blok terpisah dengan status 'kandidat' dan tunjukkan lembar pose ke pengguna.
// Catatan pengguna (7 Nov 2026) untuk pegangDepanDada dengan HP: layar tidak terlihat kalau kamera dari depan (PhoneInHand side='belakang').
import { POSES } from './Character';

type Pt = [number, number];
type Pose = { left: Pt; right: Pt; raiseLeft?: boolean; raiseRight?: boolean; elbowDown?: boolean };
export const POSE_STATUS: Record<string, 'disetujui' | 'kandidat'> = {};
const tag = <T extends Record<string, Pose>>(o: T, st: 'disetujui' | 'kandidat', who: string) => {
  for (const k of Object.keys(o)) POSE_STATUS[who + '.' + k] = st;
  return o;
};
export const POSE = {
  her: {
    ...tag(POSES.her as Record<string, Pose>, 'disetujui', 'her'),
    ...tag({ pegangDepanDada: { left: [-40, -124], right: [30, -190] } }, 'disetujui', 'her'), // disetujui pengguna 7 Nov 2026 (lembar Pose-Kandidat) // HP/gelas di depan dada
  },
  him: {
    ...tag(POSES.him as Record<string, Pose>, 'disetujui', 'him'),
    ...tag(
      {
        pegangDepanDada: { left: [-44, -124], right: [30, -190] }, // HP di depan dada
        sodorKiri: { left: [-50, -132], right: [44, -124] }, // menyodorkan benda kecil di pangkuan ke kiri (duduk)
        angkatGalon: { left: [-40, -150], right: [40, -150] }, // mengangkat benda besar (galon/kardus) dua tangan di depan badan; benda digambar terpisah dengan alas di y -140
      },
      'disetujui', // disetujui pengguna 7 Nov 2026 (lembar Pose-Kandidat): pegangDepanDada, sodorKiri, angkatGalon
      'him',
    ),
  },
} as const;
