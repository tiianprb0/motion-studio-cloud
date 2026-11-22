# Inti format Less. (satu halaman per seri)

Arahan pengguna 7 Nov 2026 ("1-13 jalankan"), diadaptasi dari halaman "inti format" buku gaya Republik Netizenia. Ini **ringkasan**. Rinciannya ada di dokumen yang ditautkan. Kalau ada yang bertentangan, `arahan-pengguna.md` yang menang.

## Less. (seri reguler)
**Rumus satu kalimat:** Naya atau Yan menghadapi satu situasi sehari-hari yang biasanya langsung dinilai. Lalu konteks yang jarang terlihat dibuka, dan video ditutup dengan pertanyaan yang tertinggal di kepala penonton.

**Rasa yang harus selalu ada:**
- hangat dan tenang;
- kritis tapi tidak agresif; memahami bukan membenarkan;
- humor situasional atau menertawakan diri sendiri, tanpa ada yang dipermalukan;
- dunia Indonesia nyata yang kaya detail.

**Tokoh:**
- **Naya** (penasaran, suka memberi contoh, pemarah), suara Leya.
- **Yan** (tenang, suka belajar, pendiam), suara Ibnu.
- Satu narator per naskah.
- **Kucing oranye berkalung wine** muncul di latar hampir setiap video, bergerak (duduk/tidur/jalan), tanpa pernah dijelaskan (`shared/characters/kucing/v1`, disetujui 7 Nov 2026).

**Struktur 61–75 detik** (pola-naskah.md):

| Detik | Bagian |
|---|---|
| 0–3 | Hook: salah satu rumus, tanpa salam atau kartu judul |
| 3–±15 | Situasi akrab + penilaian cepat |
| ±35–45 (55–65%) | "Tapi…" dengan perubahan visual |
| sampai akhir narasi | Alasan dan bukti (bersumber), lalu penutup berupa pertanyaan atau pengamatan |
| +3 dtk | Outro C (kartu di atas adegan terakhir) |

**Visual:**
- rig vektor pastel dari `shared/`;
- kedalaman dan material;
- bubble gaya Kok Bisa? (maksimal 4 kata);
- subtitle per kata (maksimal 7 kata, 2 baris);
- satu kalimat, satu perubahan; tidak ada diam beruntun lebih dari 3 detik.

**Audio:** narasi saja + pop/slide lokal. Tanpa musik. Kenyaringan final −14 LUFS / −1 dBTP (otomatis di render).

**Format teknis:**
- 9:16, 1080×1920, 30 fps;
- ±145–175 kata;
- storyboard disetujui sebelum audio dan render;
- thumbnail "wajah + latar lokasi";
- kemasan (references/kemasan.md).

**Alur kerja:** lembar ide (references/lembar-ide.md) → naskah → storyboard → (disetujui) → narasi → film → audit → kemasan.

**Jadwal:** tidak ada jadwal tetap. Video dibuat dari ide dan pemikiran pengguna, bukan konten harian (keputusan pengguna 7 Nov 2026). Kualitas lebih penting daripada frekuensi.

## Open Mic (seri stand-up)
**Rumus satu kalimat:** Yan naik panggung open mic kafe membawa satu keresahan sehari-hari. Logika sistemnya dibawa sampai ujungnya yang absurd dengan nada datar, lalu ditutup dengan callback yang tajam tanpa ceramah.

**Rasa:**
- deadpan dengan 1–2 ledakan;
- yang disindir sistem, logika, dan pihak berkuasa, bukan orang (lolos uji tunjuk);
- fakta yang disindir selalu bersumber.

**Struktur di bawah 90 detik** (pola-standup.md):
1. Hook berupa premis (0–3 detik).
2. 2–3 bit, masing-masing setup → punchline → tag.
3. Callback.
4. Outro C varian `seri` (untuk ajakan menitipkan keresahan: `SERI_WEB`, "Keresahanmu bisa jadi episode berikutnya: less.benaya.id"; episode dari keresahan web: varian `dari`).

**Suara:**
- Ibnu di eleven_v4, stability 0,0;
- jeda 1,2–1,8 detik sebelum punchline terkuat;
- tawa maksimal 10% durasi (pustaka `tawa-standup` v1/v2);
- room tone + pantulan ruangan kecil.

**Penonton:** topik boleh dari komentar, dengan izin dan janji yang ditepati (pola-standup bagian 10).

**Seri:** "Open Mic #N" di caption dan judul, playlist di tiap platform; Syarat Protes = #1. Tanpa salam pembuka (pola-standup bagian 11).

## Lirik (seri tanpa narasi)
Arahan pengguna 7 Nov 2026: kategori baru "versi tanpa suara", tokoh hanya memerankan lirik lagu, karena banyak penonton relate dengan lirik yang diberi visual keadaan mereka. "Lirik" adalah nama kerja; nama publik seri belum ditentukan pengguna.
**Video acuan yang disetujui:** "the cure" (Olivia Rodrigo), disetujui 8 Nov 2026 setelah lima versi. Semua yang perlu diketahui dari video itu dirangkum di bagian ini; folder proyeknya tidak dipakai sebagai acuan (pengguna 8 Nov 2026).

**Riwayat penolakan (supaya tidak diulang):**

| Versi | Yang ditolak pengguna | Aturan yang lahir |
|---|---|---|
| v1 (storyboard) | Lembar contoh berisi kata karangan bahasa Indonesia di latar kosong ("kok malah kayak lirik lagu sih?") | Contoh gaya selalu memakai lirik asli di atas adegan bertokoh |
| v2 | Pastel terang, simbol penjelas (tanda tanya, label obat, kata retak), kamera cuma maju-mundur, ranjang dari samping padahal tokoh menghadap kamera | Cahaya sebagai cerita, tata letak sesuai arah hadap, kamera bukan zoom |
| v3 | Sinematik, tapi hampir semua shot dari sudut ujung ranjang ("jangan diulang ulang") | Sudut benar-benar beragam |
| v4 | Logo tidak terlihat, gradasi biru tidak sesuai ukuran wajah, kucing muncul di akhir tanpa terlihat berpindah, cover masih latar lama | Logo terang, flush rig, daftar kontinuitas, cover ikut video final |
| v5 | Disetujui ("Setuju, salin") | |

**Rumus satu kalimat:** satu tokoh utama memerankan potongan lagu (reff atau bagian yang paling kena) tanpa narasi, diceritakan lewat **cahaya, akting, dan sudut kamera yang terus berganti**, dengan lirik asli sebagai kutipan sederhana.
- Tokoh utama ditentukan dari isi lagu (the cure: Yan, pengguna 8 Nov 2026: "ini lagu lebih ke yan sebagai objek utama nya").
- "Konteks yang tidak dinyanyikan" di akhir (the cure: Naya ternyata juga memikul beban sendiri) dipakai di video yang disetujui, tapi sebagai aturan umum masih **menunggu konfirmasi** (arahan-pengguna.md).

**Rasa:**
- relate, emosional, sinematik; tidak lebay atau dibuat-buat filosofis;
- dunia Indonesia nyata yang kaya detail (kos, lorong, jemuran, tandon, neon);
- tokoh tidak bicara: tanpa bubble dan tanpa subtitle narasi.

**Lagu dan durasi:**
- Biasanya reff atau bagian yang menarik. Durasi mengikuti potongan lagu, rata-rata di bawah satu menit; target 61–75 dtk **tidak berlaku** (pengguna 7 Nov 2026). Akibatnya tidak masuk Creator Rewards TikTok.
- Waktu baris di `01-Brief/lagu.json` (`python3 tools/lirik_timeline.py <proj> --lrclib ID --jendela A-B`), teks di `01-Brief/lirik.txt` yang **diisi pengguna**. Agen tidak menyalin atau menerjemahkan lirik; baris dirujuk lewat nomornya. Awalan nomor/waktu template di `lirik.txt` dibuang alat.

**Visual (pelajaran v1–v5, 7–8 Nov 2026):**
1. **Cahaya adalah cerita** (acuan @blazenodes, https://vt.tiktok.com/ZSpkYVW1Q/). Malam benar-benar gelap: `Gelap` (multiply, lubang cahaya bulat dan berkas) + `Sorot` + `Debu` + `Silau` dari `shared/film/v1/Cahaya.tsx`. Perubahan emosi = perubahan cahaya (sorot bulan → cahaya pintu hangat → lampu meja menyala → meredup → hilang). Pastel rata dengan "overlay gelap" ditolak (v2).
2. **Sudut kamera beragam, jangan diulang** (pengguna setelah v2: "kamera mu cuma maju dan mundur itu pun aneh"; setelah v3: "perspektif kameranya buat lebih kaya dong, jangan diulang ulang"). Variasi ukuran shot dari sudut yang sama tidak cukup. Pakai sudut yang benar-benar beda: dari luar gedung, lewat kaca jendela, lorong (perspektif satu titik), insert benda (jam, lampu, mug), balkon, rendah dan miring, ganti fokus. Gerak kamera: geser menyamping dengan paralaks, turun/naik (crane), miring, dorong pelan; bukan zoom maju-mundur. Dua shot berurutan tidak boleh dari sudut yang sama. Baris panjang dipecah jadi dua shot (masing-masing ≥1,3 dtk).
3. **Tata letak harus masuk akal dengan arah hadap tokoh.** Rig hanya bisa menghadap depan/tiga perempat; ranjang dilihat dari ujung kaki bila tokoh duduk di kasur menghadap kamera (pengguna: "posisi kasur dari perspektif samping, tapi yan ... menghadap kamera" = salah). Pilih sudut di mana tokoh wajar menghadap kamera (mis. Yan di meja menghadap jendela, kamera di luar kaca).
4. **Tanda sedih yang disetujui:** pita kusut `AwanKusut` (warna pucat `#CDBBD9` di latar gelap supaya terlihat), gradasi biru di wajah lewat **`flush` bawaan rig** (`{ color: '#4A6FB5', amt }`, pas dengan bentuk wajah; elips di atas wajah ditolak karena tidak sesuai ukuran wajah), dan `AirMata`. Simbol penjelas lain (tanda tanya, label obat, kata retak) ditolak di v2 karena terasa seperti video penjelasan.
5. **Batas rig v2** (diuji 8 Nov 2026): belum bisa tangan ke wajah, memeluk diri, berlutut, profil samping sungguhan, atau mata terpejam (audit anatomi menolak). Untuk itu perlu rig versi baru + lembar pose disetujui.

**Teks lirik di layar:**
- **Kutipan sederhana** (`Kutipan` di `shared/lirik/v2`): satu baris lirik asli dalam tanda kutip, putih, kecil (46 px), rata tengah, muncul per baris, semua baris. Mengikuti acuan; gaya kinetik `shared/lirik/v1` (ganti font, label, retak, dll.) tidak dipakai lagi kecuali pengguna minta.
- **Bahasa asli lirik saja, tanpa bahasa Indonesia** (pengguna 8 Nov 2026).
- Posisi bawah (y 1390) bawaan; **pindah ke atas (y 330) bila di bawah bertabrakan dengan tokoh** (pengguna 8 Nov 2026). Dua baris naik ke atas, tetap di safe zone.
- Aturan subtitle narasi (7 kata, 44 px, latar per kata) tidak berlaku.

**Logo:** adegan gelap memakai logo terang: `export const LOGO = 'terang'` di Film.tsx (logo krem + bayangan; pengguna: "logo less certain di sudut kanan atas gak kelihatan").

**Kontinuitas (pengguna 8 Nov 2026: "continuity nya harus diperiksa"):** sebelum render, buat daftar per shot untuk setiap benda/hewan/cahaya yang berpindah: siapa memegang apa, pintu terbuka/tertutup, lampu nyala/redup, kucing di mana. Benda atau kucing yang muncul di akhir harus terlihat berpindah ke sana. Contoh daftar dari "the cure" (Yan di kamar kos, Naya datang membawa teh):

| Shot | Yan memegang | Pintu kamar | Lampu meja | Kucing |
|---|---|---|---|---|
| Yan di meja (dari luar kaca) | — | tutup | redup | tidur di meja dekat jendela |
| Yan di ranjang, sendirian | — | tutup | mati | tidur di kusen jendela |
| Naya datang | — (Naya membawa mug) | terbuka | mati | di kusen |
| Teh terasa seperti obat | mug hangat | terbuka | dinyalakan | (di luar bingkai) |
| Insert mug di selimut | mug diletakkan | terbuka | redup | — |
| Sesudah insert mug | **tidak lagi memegang mug** | terbuka | tetap redup | — |
| Naya keluar kamar (lorong) | — | menutup, cahaya segaris di bawah pintu | — | **ikut Naya keluar** |
| Yan sendirian lagi | — | tutup | tetap redup (bukan tiba-tiba mati) | **tidak ada** (sudah ikut Naya) |
| Lorong jauh, balkon | — | tutup | — | duduk di samping Naya |

**Audio:** file video **tanpa audio**; lagu dipasang pengguna dari pustaka musik tiap platform (mulai dari titik di `unggah.json`). Tanpa narasi dan efek. Lagu panduan milik pengguna (`01-Brief/panduan-lagu.*`) hanya untuk preview sinkron, tidak dikomit.

**Format teknis:** 9:16, 1080×1920, 30 fps; vokal pertama ≤1 dtk; frame pertama sudah menampilkan tokoh; Outro C 3 dtk; kucing oranye dengan kontinuitas; cover v2 yang **mengikuti latar dan suasana video final** (pengguna: "latar kan banyak berubah, cover ny gak diubah?"), judul sampul kata sendiri; kemasan dengan kredit lagu (`references/kemasan.md` "Seri Lirik").

**Alur kerja:** lembar ide → `lagu.json` + `lirik.txt` (pengguna) → `lirik_timeline.py` → **frame contoh gaya** bila ada gaya/latar/pose baru (pengguna menyetujui sebelum render penuh; pada the cure pengguna kadang minta langsung render) → Film.tsx (sudut beragam, daftar kontinuitas) → audit + `--motion` (≤50% diam) + stills dicek mata → render master tanpa audio → cover baru sesuai video → kemasan → setelah disetujui: `siap-unggah/<slug>/` dengan blok `lagu` di `unggah.json`.

## Pelajaran dari data
- **Data sendiri:** belum ada (catat lewat references/kemasan.md "Catatan data").
- **Pembanding luar** (dipakai sebagai arah, bukan target):
  - Buku Republik Netizenia (6 reel mereka): video 50 detik ditonton rata-rata 64%, video 2 menit 35–44%. 80% penonton bukan pengikut, jadi tiap video harus bisa dipahami sendiri.
  - Riset penutup 11 Shorts animasi (7 Nov 2026): penutup 0–4 detik setelah kata terakhir. Dasar Outro C.
