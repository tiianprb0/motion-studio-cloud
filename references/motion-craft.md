# Dunia, kamera dan aksi

Baca ../CREATIVE-BRIEF.md untuk kontrak terkini. Bangun satu master world per lokasi/waktu dengan clock adegan yang terus berjalan melintasi banyak beat kamera. Tempatkan aktor, penanda tempat dan properti di koordinat dunia yang konsisten; lapisan layar (subtitle, watermark) tetap screen-space. Kedalaman lebih disukai daripada panggung datar, tanpa mengubah identitas tokoh yang flat.

Bawa posisi/zoom kamera aktual melintasi batas beat, termasuk drift atau interpolasi yang belum selesai. Tangani daftar beat kosong, celah timeline dan akhir timeline; jangan kembali ke beat pertama pada frame yang tidak tercakup. Pakai lebar/tinggi composition untuk pusat viewport. Jaga titik fokus dan kontinuitas aksi melintasi potongan yang disengaja; pergantian adegan mengikuti cerita.

Kamera kira-kira 70% bereaksi/30% mengamati sebagai arahan, bukan kuota. Pan, whip-pan, tracking, zoom, close-up, slide/mask dan parallax adalah alat bercerita yang opsional. Pilih easing/spring per aksi, bukan satu preset spring wajib. Gerak ambient boleh terus berjalan di waktu adegan bila cocok; hold yang bertujuan diperbolehkan. Jangan mengganti adegan statis berulang dengan loop dekoratif berulang.

Pakai antisipasi dan reaksi yang jelas. Periksa genggaman tangan, langkah kaki, sendi, urutan lapisan dan transform properti yang dibawa. Jaga waktu dan keadaan adegan. Pakai ulang komponen, bukan koreografi adegan jadi, untuk kejadian berikutnya. Kejadian berulang pun butuh visualisasi berbeda.

Subtitle hanya di kiri (atas/tengah/bawah), rata kiri dan screen-space, ditempatkan di sekitar objek penting tanpa menyisakan kolom kiri kosong permanen. Maksimal 7 kata dan 2 baris per kemunculan. Frasa harus terbaca dengan penekanan yang terkendali. Tinjau batas transisi lewat moving proof dan sampel frame ekspor akhir; pertahankan render CPU/frame-ready yang terbukti sampai alternatif lolos pemeriksaan.

Pembaruan 6 Nov 2026: transisi (termasuk whip-pan, kabut atau slide) boleh asal total masuk+keluar ≤0,7 dtk dan tidak heboh; potongan biasa tetap bawaan di dalam satu lokasi. Kamera boleh mengalir saat mendekat; kembali keluar dengan potongan. Tokoh yang duduk menyerahkan benda di level meja (diletakkan, didorong, meluncur, ditarik), tidak di udara dengan lengan lurus mendatar. Jalankan `node tools/render-film.cjs <proj> --audit=1` sebelum mengirim render.

Pembaruan 12 Nov 2026:
- **Langkah kaki.** Pengguna: "kaki udah bergerak tapi masih jalan di tempat beberapa detik ... udah diam tapi kaki masih gerak". Ayunan kaki harus berasal dari perpindahan badan, bukan jam tetap. Pakai `langkah()` di `shared/film/v1/Langkah.ts`: kecepatan naik singkat, tetap, lalu turun; fase langkah dari jarak tempuh (±0,5 m per langkah); ayunan nol saat diam. Kalau tokoh masuk atau keluar bingkai sambil berjalan, mulai `langkah` beberapa frame sebelum potongan (atau akhiri sesudahnya) supaya tidak terlihat mulai atau berhenti di dalam shot.
- **Bubble dan tanda.** Hitung posisinya dari kepala pembicara di tiap frame (`letakBubble()`, `letakTanda()` di `shared/film/v2/Bubble.tsx`), jangan koordinat tetap.
