# Thumbnail video

**Status sekarang (7 Nov 2026):** gaya final = "Wajah + latar lokasi" **versi v2** (`shared/ui/v2/Thumb.tsx`, lihat "Keputusan 7 November 2026" di bawah: tanpa label, wajah paling terang, benda petunjuk, pose boleh berubah, tema Open Mic). Komponen lama: `shared/ui/v1/Thumb.tsx` (`FaceThumb`, `THEMES`). Proyek cukup menulis `src/Thumb.tsx` kecil yang memakai komponen itu. Render: `node tools/render-thumb.cjs <proj>/src/Thumb.tsx <proj>/04-Hasil/Thumbnail-<Judul>` → PNG 9:16 + 4:5 + 3:4 + lock. Bagian bertanggal di bawah adalah riwayat keputusan.
Setiap produksi video Motion Studio secara otomatis mencakup thumbnail/cover; tidak perlu permintaan atau ACC terpisah untuk membuatnya. Untuk permintaan yang hanya mengubah profil, naskah, storyboard atau audio, jangan memulai render video/thumbnail tanpa lingkup produksi yang sesuai.
Ekspor PNG 1080×1920, simpan bersama MP4 final di 04-Hasil dan sertakan tautan/preview pada penyerahan. Simpan source yang dapat diedit atau skrip pembuatnya. Revisi cover bila perubahan naskah/visual membuatnya tidak sesuai; tidak perlu merender ulang cover yang masih relevan.
Pakai karakter, proporsi wajah, rambut, pakaian/logo dan aset tempat dari versi video yang telah diperiksa. Rig bersama boleh digunakan jika identitasnya cocok. Jangan mempercantik/mendesain ulang karakter atau menciptakan landmark pengganti. Pilih ilustrasi dan judul singkat yang mewakili gagasan video tanpa clickbait atau menambah klaim.
Referensi gaya cover yang disukai pengguna (cover Kurang Yakin v5, sekarang di arsip): krem/sage, Lato tebal, aksen wine, wordmark asli, karakter jelas. Ini rujukan keluarga visual, bukan kewajiban mengulang pose atau komposisi yang sama.
Periksa PNG aktual pada ukuran kecil; teks harus terbaca, tidak menabrak wajah/properti, dan informasi utama aman untuk crop profil platform. Jangan menyatakan aman untuk semua UI/crop tanpa memeriksa format yang dipakai. Status persetujuan video dan thumbnail dicatat terpisah. Membuat thumbnail tidak memerlukan audio baru dan tidak mengizinkan publikasi otomatis.

## Keputusan 6 November 2026
- Setiap thumbnail harus aman untuk potongan 4:5 Instagram: judul, wordmark dan karakter berada di tengah 1080×1350 (y 285–1635 pada kanvas 1080×1920). Ekspor juga versi 4:5 terpisah.
- Pengguna tidak lagi menyukai gaya cover v5 (judul besar menumpuk). Gaya pilihan: konsep "Lensa" v7 — pastel krem, ruang kosong lega, judul dua baris sedang (Lato Black ±84px, aksen wine), wordmark kecil, satu adegan cerita yang menggambarkan gagasan (contoh: kaca pembesar memperlihatkan detail yang tersembunyi). Jangan memadatkan teks; tidak perlu subjudul.
- Sumber: arsip/usang-20261106/v7-sisa/src/ThumbOptions.tsx (ThumbLens).

Status 6 November 2026 (lanjutan): thumbnail final v7 = konsep "Lensa". Usulan sistem baru (wajah besar maks 4,6× rig, kait 2–4 kata, warna latar per tema brand, latar lokasi buram berwarna tema, dan seri Open Mic gelap dengan lampu sorot) masih contoh dan BELUM disetujui sebagai standar (dulu ditulis di proyek Kurang Yakin v7; versi umumnya sekarang `shared/ui/v1/Thumb.tsx`). Wordmark selalu asli (teks less.certain + garis emas), tanpa ikon tambahan. Thumbnail wajib lolos pemeriksaan anatomi (tanda `data-anatomy-warn` dari rig, skala ≤4,6×, crop 100% tangan/siku) dan pedoman extras.

Koreksi 6 November 2026: thumbnail final v7 yang disepakati pengguna = "Wajah + latar lokasi" (Naya kesal wajah besar maks 4,6× rig, kait "Dia telat lagi.", latar ruang baca diburamkan dan dilapisi warna tema Perilaku/peach, wordmark asli, label tema). Menggantikan "Lensa" sebagai thumbnail final; file Lensa disimpan di arsip/usang-20261106/v7-sisa/04-Hasil/thumbnail-konsep/lama. Versi umumnya sekarang `shared/ui/v1/Thumb.tsx`. Ekspor 9:16, 4:5 dan 3:4.

## Keputusan 7 November 2026 (review grid profil)
Dasar: simulasi grid profil 3:4. Sejak awal 2025 Instagram memotong cover jadi 3:4 di grid, TikTok juga begitu. Ditambah perbandingan dengan thumbnail Kok Bisa?. Jawaban pengguna:
1. **Empat cover lama** (Villain, Kepedulian, Tangan Kosong, Kritik; gaya badan penuh di atas krem) **tidak berlaku** dan sudah diarsipkan pengguna di sosial media. Jangan dijadikan acuan; tidak perlu dibuat ulang.
2. **Label tema (PERILAKU/HUBUNGAN/…) dihapus.** Di grid Instagram label itu tertutup ikon Reels di kanan atas.
3. **Kontras: wajah harus jadi bagian paling terang.** Lokasi diburamkan lalu sedikit dijenuhkan, warna tema dibuat lebih tipis (v1: 0,5 → v2: 0,22–0,3), vinyet gelap di tepi, dan cahaya lembut di belakang kepala.
   - Cover Maaf v1 kusam karena warna sage menimpa langit senja oranye sehingga jadi abu.
   - Ukuran: selisih terang wajah dan latar naik dari +27 jadi +41.
4. **Satu benda petunjuk cerita** di samping wajah (`Petunjuk`), misalnya kotak martabak (Maaf), jam (telat), atau struk (Syarat Protes). Benda ini sengaja "melayang" sebagai ikon bercahaya, karena berfungsi sebagai komposisi thumbnail, bukan benda di dunia cerita.
5. **Cover Open Mic** (tema `openmic`): panggung gelap, lampu sorot, mic berdiri, teks krem. **Disetujui 7 Nov 2026.**

Seri Lirik (7 Nov 2026): memakai thumbnail v2 yang sama (cover utama versi pose). Judul sampul 2–4 kata ditulis sendiri, bukan kutipan lirik; benda petunjuk diambil dari aksi di video. Koreksi 8 Nov 2026: cover harus mengikuti latar dan suasana video final (dibuat ulang bila latar berubah); untuk video gelap pakai tema `sosial` (huruf krem) supaya judul terbaca, latar = lokasi video dengan cahayanya, tanda sedih (pita kusut, flush biru) boleh ikut. Resep cover "the cure" yang disetujui: `FaceThumb` tema `sosial`, `pose="pegangDepanDada"` dengan mug dingin (`Mug hangat={0}`) di tangan, `flush="#4A6FB5"`, `scene` = lokasi video + `Gelap` (berkas bulan) + `Sorot`, `prop` = `AwanKusut` di belakang kepala (x 560, y 1060, r 250, warna `#CDBBD9`) supaya tidak menabrak judul; versi wajah memakai `Petunjuk` mug.

Komponen: `shared/ui/v2/Thumb.tsx` (`FaceThumb`, `Petunjuk`, `THEMES`). v1 beku (dipakai thumbnail Maaf v2). Benda: `shared/props/benda/v1/Benda.tsx` (Jam, Struk, MicBerdiri).

Lembar contoh: `shared/ui/v2/contoh/Lembar-Thumbnail-v2.jpg` (Maaf sebelum/sesudah, Open Mic baru, simulasi grid). **Disetujui pengguna 7 Nov 2026 ("Setuju semua")**: semua video baru memakai `shared/ui/v2/Thumb.tsx`.

Aturan grid (semua platform):
- Teks, wajah, dan petunjuk harus berada di dalam potongan 3:4 (y 240–1680).
- **Kanan atas** (ikon Reels) dan **kiri bawah** (jumlah tayangan) dibiarkan kosong.
- Bagian bawah 9:16 bisa tertutup judul di rak YouTube Shorts.
- Instagram memungkinkan menggeser potongan grid saat mengunggah.

### Pose boleh berubah (7 Nov 2026, pengguna: "pose nya gak harus gitu gasih? maksud ku boleh berubah")
- **Dua framing, boleh dicampur di grid:**
  - **Close-up wajah** (`pose` kosong, s 4,6, tanpa tangan): pakai kalau emosinya yang jadi cerita.
  - **Framing sedang** (`pose="…"`, s ±3,8): gestur dan tangan terlihat. Pakai kalau gestur atau benda yang dipegang menceritakan gagasan video, misalnya Yan menyodorkan martabak, Naya bertolak pinggang, atau Yan memegang struk.
- **Pose hanya dari `POSE`** (`shared/characters/rig/v2/poses.ts`): santai, melambai, pinggang, bertaut, berpikir (Naya), pegangDepanDada, sodorKiri, angkatGalon (Yan). Pose baru = kandidat yang harus ditunjukkan ke pengguna dulu.
- **Benda petunjuk sebaiknya dipegang** (`holdLeft`/`holdRight` atau di antara dua tangan), bukan melayang. Kalau dipegang, tangan menjepit tepi benda, bukan menutupi tulisannya. Periksa di crop 100%.
- **Gestur penting tidak di kiri bawah potongan 3:4**, karena tertutup jumlah tayangan di grid.
- `node tools/render-thumb.cjs` sekarang memeriksa anatomi rig, skala efektif ≤4,6, dan benda (`data-box`) di dalam potongan 3:4. Contoh di luar proyek tidak menulis lock.
- Lembar: `shared/ui/v2/contoh/Lembar-Pose-Thumbnail.jpg`. Disetujui 7 Nov 2026 bersama tampilan v2 dan cover Open Mic.

### Hasil ekspor (7 Nov 2026, setelah "Setuju semua")
Semua ekspor berupa file baru; file lama tidak ditimpa. Masing-masing ada versi 9:16, -4x5, -3x4, dan .lock.json.
- **Maaf v2:** versi wajah dan pose; thumbnail v1 lama tetap disimpan.
- **Syarat Protes (Open Mic):** versi wajah dan pose; thumbnail pertama video tersebut.
- Sumber per proyek ada di `src/Thumb-*.tsx`; audit sekarang mengizinkan beberapa varian `Thumb*.tsx` di folder proyek.
- `shared/ui/v2/Thumb.tsx` dan `shared/props/benda/v1` sekarang **terkunci** karena dipakai thumbnail terkirim. Perubahan berikutnya dibuat sebagai v3/v2.

### Cover bawaan (7 Nov 2026, pengguna)
Kalau ada dua versi, **versi pose adalah cover utama** yang dipakai pengguna; versi wajah jadi alternatif. Di `siap-unggah/` pose = `cover-*.png`, wajah = `cover-alternatif/`.
