# Warga Kampung Less. (extras v2) — 9 Nov 2026

**Status: KANDIDAT.** Desain 18 warga menunggu persetujuan pengguna lewat `contoh/LembarWarga.png`. Sebelum disetujui, warga hanya dipakai sebagai avatar di web Kampung Less. (`tools/web-less`), tidak di video.

Asal: arahan pengguna 9 Nov 2026, yaitu donatur bisa memilih karakter dari banyak pilihan extras baru yang lebih bagus, tanpa mengganggu Naya dan Yan. Lihat `references/arahan-pengguna.md` bagian "Web interaktif".

## Isi
- `Warga.tsx`:
  - `WARGA`: 18 resep (id `w01`–`w18`, `nama`, rambut, kulit, baju, warna).
  - `Warga`: komponen bungkus `Person` rig v3 dengan `extra={look}`.
  - `cariWarga`, `WARGA_ID`.
- `contoh/LembarWarga.tsx` dan `.png`: lembar contoh. Naya dan Yan ada di kiri atas sebagai pembanding.

## Pakai
    import { Warga } from '<relatif>/shared/characters/extras/v2/Warga';
    import { POSE } from '<relatif>/shared/characters/rig/v3/poses';
    <Warga id="w05" x={..} y={..} s={..} f={f} {...POSE.her.santai} />
    <Warga id="w16" x={..} y={..} s={..} f={f} pose="sit" seatDrop={20} {...POSE.him.bertaut} />  // duduk di belakang penutup

- `who` (her/him) mengikuti resep. Pose tangan wajib dari POSE.
- `role` bawaan `background`, `body` selalu `lama`.

## Aturan desain
- Harus jelas berbeda dari Naya (bob cokelat tua + rajut peach + rok sage) dan Yan (rambut hitam berponi + polo sage).
- Pinggang tertutup. Pemakai hijab dan ibu-ibu memakai lengan panjang dan rok panjang. Jaket, hoodie, dan batik bapak berlengan panjang.
- Ragam warna kulit (`K.k1`–`K.k5`), rambut, dan pakaian khas Indonesia (hijab, peci, batik, kupluk).
- Id **tidak boleh diganti**, karena dipakai database web untuk pilihan karakter donatur. Gambar baru dibuat sebagai versi baru (v3) dengan id baru.
- Gambar ulang lembar contoh:
  ```bash
  node tools/render-thumb.cjs shared/characters/extras/v2/contoh/LembarWarga.tsx shared/characters/extras/v2/contoh/LembarWarga --only
  ```
- Sprite web: `node tools/web-less/sprite.cjs`.
