# Web Less. (Kampung Less.) sebagai bahan konten

Baca ini sebelum membuat konten TENTANG web Less., misalnya video perkenalan Kampung Less. Pengguna 10 Nov 2026: "rencana nya aku mau suruh dia buat konten soal ini".

Isinya ringkasan dari keputusan pengguna di `references/arahan-pengguna.md` bagian "Web interaktif". Kalau ada yang bertentangan, arahan-pengguna yang berlaku. Rincian teknis ada di `tools/web-less/README.md`.

## Apa itu, dari sisi penonton
- **Alamat final: less.benaya.id** (pengguna 10 Nov 2026). Di narasi diucapkan **"less dot benaya dot I. D."** (aturan umum 18 Nov 2026, menggantikan "less titik benaya titik id"); tulis persis begitu di NARASI dan pakai `01-Brief/subtitle-ganti.json` supaya subtitle tetap less.benaya.id. Rinciannya di `references/arahan-pengguna.md` bagian Naskah.
- **Kampung Less.** adalah kampung kecil 3D berisi tempat yang muncul di video: Kos Naya, Kos Yan, Ruang Baca, Kafe Open Mic, dan Taman Sore.
  - Pengunjung baru disambut tur singkat 4 langkah: Pos Keresahan, Lahan Cerita, Layar Tancap, Kafe Open Mic (bisa dilewati, bisa diputar lagi dari tombol (i)).
  - Naya, Yan, dan kucing oranye tinggal di sana, kadang berjalan, kadang bergumam.
  - Waktunya ikut jam WIB, dan cuacanya bergiliran.
- **Titip keresahan** (maksimal 280 huruf, boleh anonim).
  - Kiriman dibaca dulu, lalu tampil sebagai **lampion** di Pos Keresahan.
  - Penonton lain bisa menekan **"aku juga"**, dan lampionnya membesar.
- **Lampion pindah tempat mengikuti tahapnya:**
  - Pos Keresahan (dibaca)
  - Ruang Baca (diriset)
  - Meja Gambar Yan (storyboard)
  - Rumah di Lahan Cerita (sudah jadi video dan bisa ditonton)
  - Kalau tidak jadi, lampionnya pindah ke Pagar Catatan, selalu dengan alasannya.
- **Avatar.** Yang menitipkan keresahan mendapat avatar di kampung selama 14 hari. Pendukung mendapat 30 hari dan bisa memilih karakternya. Avatar bisa difoto dengan 3 pose, lalu dibagikan ke Story 9:16.
- **Layar Tancap** di Taman Sore memutar video Less. terbaru. Dua **banner Sorotan** di pinggir jalan diisi pilihan Less.
- **Dukung lewat Saweria** dengan tiga tingkat: Bertanya Rp10.000, Menimbang Rp50.000, Mendalami Rp150.000.
  - Haknya: nama di papan terima kasih (kalau mau), lampion berbingkai emas, kartu terima kasih bergambar Naya dan Yan, intip storyboard, dan balasan tertulis.
  - Nominal tidak pernah ditampilkan.
- **Akun** (Masuk dengan Google) menyimpan riwayat dan punya kotak keluhan pribadi.

## Yang boleh dan tidak boleh
- **Nada rendah hati, tidak arogan.**
  - Jangan menjelaskan "dukungan membeli kedekatan, bukan kendali isi" kepada penonton (arahan 9 Nov 2026).
  - Jangan menjanjikan setiap keresahan pasti jadi video. Pakai "bisa jadi" atau "siapa tahu".
- **Video dari ide Less. sendiri bukan keresahan penonton** (arahan 10 Nov 2026). Jangan menggambarkannya sebagai titipan penonton.
- **Nama penanya hanya kalau ia mengizinkan.** Kalau tidak, sebut "seorang penonton".
  - Kalau mengutip keresahan asli dari web, tanpa nama, kecuali penanyanya mengizinkan.
- **Donatur tidak dijadikan tokoh di video.** Ini masih aturan; usulan memasukkan karakter donatur ke video menunggu konfirmasi.
- **CTA:** jangan meminta share, tag, atau komentar. Ajakan ke web boleh, misalnya "Titip di less.benaya.id".
- **Kartu Outro C punya varian yang menyebut web** (disetujui 10 Nov 2026, `shared/outro/v2/README.md`; video baru pakai `shared/outro/v3`, isi sama, kartu sejajar tepi subtitle):
  - `titip` untuk ajakan umum.
  - `dari` untuk video dari keresahan web (nama hanya kalau boleh disebut).
  - `SERI_WEB` untuk Open Mic.
  - Untuk video perkenalan web, `titip` paling cocok. Alamat web juga boleh disebut di isi videonya.
- **Tampilan web: pakai tangkapan layar asli di `shared/web-less/v1/tangkapan/`** (16 gambar, diambil 10 Nov 2026 atas permintaan pengguna; daftar di `shared/web-less/v1/README.md`).
  - Isinya suasana kampung (siang/sore/malam/hujan), Pos Keresahan, Layar Tancap, Kafe Open Mic, Lahan Cerita, dan tampilan web di HP: titip keresahan, kartu lampion, daftar video, dan halaman Dukung.
  - Agen sendiri tidak bisa membuka web (dunia 3D, tidak bisa lewat WebFetch).
  - Gaya gambarnya 3D low-poly, berbeda dari animasi Less. Pasang sebagai layar HP yang dipegang Naya atau Yan, atau sebagai B-roll singkat. Ceritanya tetap dibawakan tokoh.
  - Data di gambar adalah keadaan 10 Nov 2026 (kampung masih baru). Jangan menyebut angkanya sebagai keadaan terbaru. Kalau perlu gambar terkini, minta pengguna mengambil ulang (`node tools/web-less/tangkap.cjs`).
  - **Tangkapan v2 (17 Nov 2026)** di `shared/web-less/v2/` (diambil ulang + Ruang Baca, Meja Gambar Yan, mode foto avatar dengan avatar contoh tanpa nama), dengan komponen `LayarWeb.tsx` (layar HP, kartu, B-roll). Daftar dan batasnya di README folder itu.
- **Jangan mengunggah, menjadwalkan, atau mengubah apa pun di web dan sosmed.** Membuat konten tetap lewat tahap storyboard yang disetujui pengguna.

## Teks yang sudah dipakai di web
- **Ajakan:** "Titip keresahan", "Apa yang lagi bikin kamu nggak yakin?", "aku juga".
- **Kaki halaman:** "Kampung Less. · Melihat lebih dekat. Berpikir lebih jauh."
- **Usulan bio** (belum dipasang pengguna): "Kamu yang resah, Naya & Yan yang mengurai."
