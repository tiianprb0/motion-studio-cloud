# Siap unggah

Folder umum berisi **video yang sudah disetujui pengguna** dan siap diunggah (arahan pengguna 7 Nov 2026). Agen pengunggah cukup membaca folder ini; tidak perlu mencari di dalam `projects/`.

## Isi tiap video
Satu folder per video, **dinamai slug judul tanpa tanggal**, misalnya `maaf-yang-nggak-pernah-diucapin/`. Tanggal persetujuan ada di `unggah.json`.

| File | Isi |
|---|---|
| `video.mp4` | file master final (1080×1920, 30 fps, −14 LUFS). Unggah file ini langsung ke tiap platform. |
| `cover-9x16.png` | **cover utama = versi pose** (pilihan bawaan pengguna; untuk TikTok, Reels, Shorts). Push dari dashboard memasangnya otomatis di Instagram Reels dan TikTok (sejak 10 Nov 2026); YouTube Shorts dan Facebook memakai frame video |
| `cover-3x4.png`, `cover-4x5.png` | potongan cover utama untuk grid profil Instagram/TikTok dan Facebook |
| `cover-alternatif/` | cover cadangan = versi wajah (`cover-wajah-*.png`); dipakai hanya kalau pengguna minta |
| `CAPTION.md` | caption per platform, judul YouTube Shorts, komentar sematan |
| `unggah.json` | data mesin: judul, tanggal disetujui, caption, hashtag, file, sha256 video, **status_unggah per platform** |
| `video-backsound.mp4` | (kalau ada) versi dengan lagu dari web Backsound/dashboard; ditulis otomatis, lihat bagian "Video dengan backsound" |

## Aturan
- Hanya video yang **disetujui pengguna di chat** yang masuk ke sini. Persetujuan dikutip di `unggah.json`.
- Nama folder **tanpa tanggal**. Kalau video yang sama direvisi dan disetujui lagi, folder lamanya diganti isinya (catat versi di `unggah.json`) setelah status unggahnya dicek; jangan membuat folder bertanggal.
- Cover utama selalu versi **pose**; versi wajah masuk `cover-alternatif/`.
- Agen pengunggah memperbarui `status_unggah` (`belum` → `terunggah` + tanggal/tautan) setelah mengunggah.
- Mengunggah tetap hanya atas permintaan pengguna. Pedoman unggah: `references/kemasan.md`.

## Seri Lirik: video tanpa audio (7 Nov 2026)
- `video.mp4` sengaja **tanpa audio**, jadi tidak ada angka kenyaringan. Lagu dipasang saat unggah dari pustaka musik platform, bukan ditempel di file (arahan pengguna, `references/arahan-pengguna.md` bagian "Seri Lirik").
- `unggah.json` punya blok `lagu`:
  ```json
  "lagu": {
   "judul": "the cure",
   "penyanyi": "Olivia Rodrigo",
   "mulai_di_lagu": "3:45.08",
   "vokal_pertama_di_video": 0.5,
   "durasi_potongan_detik": 45.9,
   "catatan": "pilih rekaman resmi dari pustaka musik platform"
  }
  ```
- Agen pengunggah wajib memasang lagu itu dari pustaka platform dan menggeser titik mulainya ke `mulai_di_lagu`. Kalau lagu tidak tersedia, jangan unggah versi bisu atau versi dengan lagu ditempel. Tulis `"lagu tidak tersedia"` di `status_unggah` platform itu dan laporkan ke pengguna.
- File `*-PREVIEW-lagu.mp4` hanya untuk review dan **tidak** disalin ke sini.

## Video dengan backsound (8 Nov 2026)
**Sejak 9 Nov 2026 otomatis** (pengguna: "waktu di dashboard isi backsound dia otomatis di simpan di mac dan masuk ke bagian siap unggah"). Setelah render dari web Backsound atau dashboard, mix disalin ke `video-backsound.mp4` di folder video ini, dan blok `backsound` ditulis ke `unggah.json` (termasuk `file`, `sha256`, `baris_caption`, `lisensi_status`, `sumber_file`). `video.mp4` tanpa lagu dan `CAPTION.md` tidak diubah. Halaman Unggah memakai versi dengan lagu sebagai bawaan (bisa pilih "Tanpa lagu") dan menambahkan baris kredit lagu ke caption yang akan dikirim. Mix yang lebih baru menggantikan `video-backsound.mp4`; sumbernya tetap di `04-Hasil/backsound/`.

**Siap unggah = sudah berlagu** (pengguna 10 Nov 2026: "video yang ada di siap unggah harusnya yang sudah berlagu. mau itu aku tandai manual atau via dashboard"). Dashboard baru menghitung folder ini sebagai Siap unggah kalau ada `video-backsound.mp4` yang tercatat di blok `backsound`, atau videonya ditandai ♪ manual (lagu dipasang di aplikasi). Tanpa salah satunya, statusnya **Perlu lagu** dan video ini tidak ditawarkan di halaman Unggah. Folder tetap dibuat saat video disetujui, karena Backsound menyalin hasilnya ke sini.

Cara lama di bawah (mengganti `video.mp4` dengan mix) hanya untuk agen yang diminta pengguna secara eksplisit:
Kalau pengguna menyetujui hasil mix dari alat backsound (`tools/backsound`, file `04-Hasil/backsound/<nama>.mp4`), file itulah yang disalin sebagai `video.mp4`. Lalu:
- Salin blok `backsound` dari `<nama>.kredit.md` ke `unggah.json`:
  ```json
  "backsound": {
   "judul": "…", "penyanyi": "…", "sumber": "impor | openverse | jamendo | freesound",
   "url": "…", "lisensi": "…", "lisensi_url": "…", "atribusi": "…",
   "mulai_di_lagu": "0:03.00", "masuk_di_video": 0, "resep": "<nama>.resep.json"
  }
  ```
- Tambahkan baris caption dari `.kredit.md` ke `CAPTION.md`. Untuk CC BY/BY-SA, baris ini wajib.
- Lagu impor yang berhak cipta bisa kena klaim atau dibisukan. Status keputusan mengunggah versi ini ada di `references/arahan-pengguna.md` bagian "Menunggu konfirmasi".
