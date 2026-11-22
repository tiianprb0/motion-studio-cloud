---
name: motion-studio
description: Produce and revise less.certain motion videos with consistent characters, continuous world staging and narrative-led visuals; maintain its production profile and shared asset library.
---

# Motion Studio
Baca MULAI-DI-SINI.md di root workspace Motion Studio, lalu file yang ditunjuknya (references/arahan-pengguna.md, CREATIVE-BRIEF.md, ACTIVE-WORKSPACE.json, checklist, tools/README.md). Verifikasi proyek/versi dan audio aktual sebelum mengubah apa pun.

Aturan inti:
- **ATURAN WAJIB (11 Nov 2026 sore): video flat 2D sebagai bawaan; mesin 3D `Dunia3D` (shared/locations/_proyeksi/v3/Dunia.tsx) hanya kalau pengguna memintanya.** Berlaku untuk semua seri dan menimpa aturan 11 Nov pagi (3D bawaan). Rinci: references/arahan-pengguna.md bagian "ATURAN WAJIB".
- Perbaikan dan komponen yang bisa dipakai konten lain dibuat di shared/ atau tools/, bukan di folder proyek. Proyek tidak mengimpor dari proyek lain atau arsip/. Tabel tempat: MULAI-DI-SINI.md "Di mana menaruh apa".
- Storyboard gambar diam (satu panel per baris narasi; seri Lirik: per baris lirik) dikirim ke pengguna dan disetujui sebelum audio atau render.
- Aset shared yang sudah dipakai video terkirim beku (lock); perubahan jadi versi baru.
- Sebelum mengirim render atau thumbnail: `node tools/render-film.cjs <proj> --audit=1`, `node tools/check-shared.cjs --locks`, checklist-sebelum-kirim, dan crop 100% tangan/siku/benda yang dipegang.
- Setiap video final disertai thumbnail otomatis (references/thumbnails.md).
- Video yang disetujui pengguna disalin ke `siap-unggah/<slug>/` (tanpa tanggal; cover utama versi pose, wajah di cover-alternatif; CAPTION.md; unggah.json). Agen pengunggah hanya membaca folder itu (siap-unggah/README.md).
- Seri Lirik (tanpa narasi): master tanpa audio, lagu dipasang pengguna dari pustaka musik platform, caption memuat kredit lagu. Agen tidak menyalin lirik lagu; teks diisi pengguna di 01-Brief/lirik.txt (references/format-less.md).
- Arahan baru yang bertentangan dengan arahan tercatat ditanyakan ke pengguna dulu.
- Rekomendasi strategi, render yang belum ditinjau dan catatan arsip bukan keputusan brand. Pekerjaan konfigurasi tidak membuat audio/video; publikasi dan commit hanya atas permintaan.
