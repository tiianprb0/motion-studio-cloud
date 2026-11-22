# Mulai di sini — Motion Studio
Pintu masuk aturan aktif. Dokumen ini hanya indeks; isi aturan ada di file yang ditunjuk. Verifikasi source, versi, audio dan status proyek aktual. Jangan menganggap versi terbesar atau hasil render otomatis disetujui.

**⚠️ ATURAN WAJIB (11 Nov 2026 sore): video flat 2D sebagai bawaan; mesin 3D `Dunia3D` hanya kalau pengguna memintanya.** Untuk semua seri, dunia video dibuat sebagai panggung flat dari depan dengan perspektif digambar dan komponen kedalaman/cahaya 2D. `Dunia3D` (`shared/locations/_proyeksi/v3/Dunia.tsx`) dipakai hanya atas permintaan pengguna untuk video atau shot itu (kutip permintaannya di `01-Brief/`). Kalau ragu, tanya dulu. Aturan ini menimpa aturan 11 Nov pagi (3D bawaan), dikonfirmasi pengguna. Rinci: `references/arahan-pengguna.md` bagian "ATURAN WAJIB".

## Baca dulu, berurutan
1. `references/arahan-pengguna.md`: semua arahan umum pengguna, termasuk aturan "arahan baru yang menimpa arahan lama harus dikonfirmasi pengguna dulu" dan daftar "Menunggu konfirmasi".
2. `CREATIVE-BRIEF.md`: ringkasan keputusan produksi. Detail dan riwayatnya di `references/creative-contract.md`.
3. `ACTIVE-WORKSPACE.json`: proyek yang sedang aktif dan statusnya (diperbarui otomatis oleh render).
4. `references/checklist-sebelum-kirim.md`: jalankan sebelum mengirim storyboard, stills, video, atau thumbnail.
5. `tools/README.md`: alur kerja dan alat.
6. `siap-unggah/README.md`: video yang **sudah disetujui** dan siap diunggah (satu folder per video tanpa tanggal: video, cover utama versi pose, caption, `unggah.json`). Agen pengunggah hanya memakai folder ini.

Kalau dua dokumen bertentangan: permintaan pengguna terbaru > `arahan-pengguna.md` > `CREATIVE-BRIEF.md` > `creative-contract.md` > referensi lain. Konflik yang belum diputuskan ditanyakan ke pengguna, bukan dipilih sendiri.

## Di mana menaruh apa
Aturan pengguna: setiap perbaikan yang bisa dipakai konten lain dibuat di folder umum, bukan di folder proyek yang sedang dikerjakan. Kalau yang dibutuhkan belum ada, buat di folder umum dulu, lalu impor. Setiap kritik atau saran pengguna yang bisa berlaku umum juga dicatat di `references/arahan-pengguna.md` (kutipan, penyebab, cara yang benar), plus butir di `references/checklist-sebelum-kirim.md` kalau bisa dicek (pengguna 12 dan 13 Nov 2026).

| Isi | Tempat |
|---|---|
| Tokoh Naya/Yan, extras, pose, efek ekspresi | `shared/characters/rig/vN/` (pose: `poses.ts`) |
| Outro (kartu brand + CTA) | `shared/outro/vN/` (Outro C sejak 7 Nov 2026, video baru pakai v3: kartu sejajar tepi subtitle x 110; Outro B lama di rig/v2) |
| Kucing oranye callback (latar, hampir tiap video, bergerak) | `shared/characters/kucing/vN/` |
| Lokasi, detail latar, material (kaca, ubin, air, uap) | `shared/locations/<id>/vN/`, `shared/locations/_detail/vN/` |
| Mesin 3D (hanya bila pengguna meminta, aturan 11 Nov 2026 sore): kamera proyeksi dan sistem cahaya `Dunia3D` | `shared/locations/_proyeksi/vN/` (v1 `Proyeksi.tsx`; `Dunia.tsx` terbaru di v3 = urutan depan-belakang benar, v2 beku; contoh di `v3/contoh/`) |
| Properti | `shared/props/<kelompok>/vN/` |
| Layar HP, gelembung, thumbnail | `shared/ui/vN/` |
| Kerangka film: subtitle, bubble gaya Kok Bisa?, kartu gag, label, layar terbelah, kedalaman, mode dramatis, timeline | `shared/film/vN/` (lihat `USAGE.md`; bubble video baru = `film/v2/Bubble.tsx` + `letakBubble`; tokoh berjalan = `film/v1/Langkah.ts`) |
| Teks lirik (seri Lirik) | `shared/lirik/vN/` (v2: `Kutipan` sederhana, gaya yang disetujui; v1 kinetik, beku) |
| Cahaya sinematik, tanda sedih | `shared/film/v1/Cahaya.tsx` (Gelap, Sorot, Debu, Silau, AirMata), `Metafora.tsx` (AwanKusut) |
| Palet brand dan fungsi waktu (P, ramp, quick, popIn) | `shared/core/vN/` |
| Audio pakai ulang: tawa, efek suara | `shared/audio/<id>/vN/` |
| Font, logo, data brand | `shared/assets/` |
| Alat (render, audit, subtitle, timeline, mix) | `tools/` |
| Aturan dan arahan | `references/` |
| Khusus satu cerita: naskah, audio narasi, timeline, `src/Film.tsx`, `src/Storyboard.tsx`, `src/Thumb.tsx`, hasil | `projects/<slug>/vN/` |

Proyek tidak boleh mengimpor dari folder proyek lain atau dari `arsip/`. Folder proyek tidak berisi `scripts/` atau komponen umum; audit memperingatkannya. Setiap aset baru dicatat di `shared/catalog.json` (`node tools/check-shared.cjs --write` juga membuat ulang `shared/catalog.html`).

Versi shared: file yang sudah dipakai video terkirim dibekukan oleh `<Judul>.lock.json`. Perubahan berikutnya dibuat sebagai versi baru (salin ke vN+1, ubah di sana). Cek: `node tools/check-shared.cjs --locks`.

## Alur proyek baru (rinci di tools/README.md)
1. Riset dan naskah → `projects/<slug>/v1/01-Brief/`.
2. Storyboard gambar diam "awal → akhir" dari dunia yang sama dengan film (bawaan flat 2D; `Dunia3D` bila diminta), satu panel per baris narasi, dengan metafora untuk kata kunci abstrak → kirim ke pengguna dan **tunggu persetujuan** sebelum audio atau render.
3. Narasi ElevenLabs (references/audio.md) → timeline → subtitle.
4. `src/Film.tsx` dari aset `shared/` (panggung flat 2D kecuali pengguna meminta `Dunia3D`; setiap shot punya perubahan; kedalaman dan material) → audit dan cek gerak → stills/proof → render → efek suara pop/slide (tanpa musik).
5. Thumbnail otomatis untuk setiap video final (references/thumbnails.md); kirim bersama video.

Seri Lirik (tanpa narasi): langkah 1 dan 3 diganti `01-Brief/lagu.json` + `01-Brief/lirik.txt` (diisi pengguna) → `python3 tools/lirik_timeline.py <proj>`. Render menghasilkan master tanpa audio dan tanpa efek suara; lagu dipasang pengguna saat unggah (tools/README.md, references/format-less.md bagian "Lirik").

Revisi cerita yang sama naik ke v2, v3, dan seterusnya; folder versi lama tidak diubah.

## Pilih referensi sesuai tugas
- Format ringkas per seri: `references/format-less.md` (Less. reguler, Open Mic, dan Lirik tanpa narasi; satu halaman per seri).
- Buku gaya lengkap (ringkasan seluruh sistem untuk dibagikan umum: tanpa nama folder/file; PDF 37 halaman termasuk bagian teknis untuk agent AI, tag ekspresi suara, dan contoh prompt): `references/buku-gaya/Buku-Gaya-Less.pdf`; sumber HTML di folder yang sama, cetak ulang dengan `node tools/html-to-pdf.cjs references/buku-gaya/Buku-Gaya-Less.html references/buku-gaya/Buku-Gaya-Less.pdf`. Kalau berbeda dengan arahan-pengguna.md, arahan yang menang.
- Naskah/storyboard: `references/lembar-ide.md` (diisi sebelum naskah), `references/pola-naskah.md` (hook, belokan, penutup, durasi), `references/pola-standup.md` (seri Open Mic, batas aman satire), `references/storyboard-first.md`, `references/storyboard-review.md`.
- Setelah render: `references/kemasan.md` (caption, komentar sematan, catatan data). Setelah pengguna menyetujui video: salin ke `siap-unggah/` (lihat README di sana).
- Dunia/kamera: `references/motion-craft.md`, `references/breath-led-direction.md`.
- Extras/properti: `references/crowds-and-props.md`, `references/shared-library.md`, `shared/catalog.json`.
- Audio: `references/audio.md`. Revisi visual memakai audio lama.
- Render/QA: `references/runtime.md`. Renderer CPU serial adalah jalur yang terbukti; ubah hanya setelah proof relevan.
- Thumbnail: `references/thumbnails.md`.
- Brand: `brand/brand-identity-guide.md` adalah fondasi editorial. Aset visual yang sudah disetujui tetap berlaku; perbedaan nama Less./less.certain bukan izin mengganti logo. `brand/STRATEGY-NOTES.md` masih rekomendasi asisten.

Video yang sudah disetujui (Kurang Yakin v7, Maaf v3, Open Mic Syarat Protes v5, seri Lirik "the cure" v5) **tidak dibuka sebagai acuan**: ciri gayanya sudah dirangkum di file umum (CREATIVE-BRIEF, creative-contract, format-less, pola-standup, thumbnails) dan komponennya ada di `shared/` (arahan pengguna 8 Nov 2026: "jangan ada acuan ke folder proyek, jelaskan di file general").

Arsip dan catatan versi lama adalah riwayat, bukan instruksi aktif. Pembaruan dokumen tidak membuat audio/video. Publikasi dan commit hanya atas permintaan.
