# Setup ElevenLabs API

1. Buka ElevenLabs → Developers / ElevenAPI → API Keys → Create Key. Beri nama Motion Studio.
2. Izinkan Text to Speech (Access) dan Voices (Read). Tidak perlu izin menghapus suara atau mengatur akun.
3. Untuk Naya, pastikan Leya yang lama tersedia di akun yang sama. Suara Yan (Ibnu) berasal dari pustaka bersama ElevenLabs dan bisa dipakai lewat API tanpa ditambahkan ke My Voices.
4. Klik dua kali Setup ElevenLabs.command di folder Motion Studio. Tempel key di jendela yang terbuka, lalu Enter. Tulisan key tidak terlihat; itu normal.
5. Tunggu pesan koneksi berhasil. Pemeriksaan hanya membaca data suara, tidak membuat narasi. Key disimpan di file .env pada root folder Motion Studio di Mac ini. File itu diabaikan git sehingga tidak ikut commit atau cadangan, tetapi jangan mengirim atau mengompres folder Motion Studio mentah ke orang lain.
6. Mulai chat baru pada profil Motion Studio. Contoh: Buat narasi naskah ini dengan Yan.

Jika key/suara belum bisa diakses, key baru tidak menggantikan konfigurasi yang bekerja. Baca pesan kesalahan, cek izin Voices Read dan tambahkan suara ke akun; lalu ulangi setup. Jangan kirim key ke chat. Setup siap secara lokal dan berdiri sendiri di folder Motion Studio (hanya butuh python3 bawaan Mac), tetapi koneksi langsung belum diuji karena key akan kamu isi sendiri. Sampai setup dijalankan di folder ini, helper menjawab "API key belum diisi".

Yan memakai Ibnu (7 Nov 2026), dipilih pengguna setelah mendengar audisi bit stand-up yang sama (shared/audio/uji-suara-yan/v1). Sebelumnya Abi. Pembawaan santai/sedikit pemalu diarahkan lewat naskah dan tag.

Naya dan Yan selalu memakai eleven_v4 untuk semua nada (arahan pengguna 7 Nov 2026), karena nadanya tidak datar. Lihat references/audio.md. Naya tetap suara perempuan lama. Jangan membuat ulang audio untuk revisi visual. Helper menyimpan rekaman/timing dan memblokir permintaan sama yang statusnya belum pasti. Tidak ada narasi/sampel baru dalam tugas setup ini.
