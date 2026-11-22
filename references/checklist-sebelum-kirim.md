# Checklist sebelum mengirim storyboard, stills, atau video

Checklist ini dibuat 7 Nov 2026 dari koreksi pengguna yang berulang. Periksa setiap panel atau shot dengan mata, bukan hanya mengandalkan audit otomatis. Tulis jawabannya dalam pikiran untuk setiap panel. Kalau ada yang ragu, perbaiki dulu sebelum mengirim.

## A. Logika dunia nyata
1. Untuk setiap benda besar (kendaraan, perabot, gerobak), tanyakan: "Di dunia nyata, benda ini wajar ada di posisi ini?"
   - Kendaraan diparkir di jalan atau tepi trotoar, tidak di belakang meja makan atau warung.
   - Barang ada di permukaan (meja, lantai, rak), tidak melayang.
2. Benda dan tempat harus cocok dengan kalimat yang sedang diucapkan dan waktunya (pagi, sore, atau malam).
3. Tokoh berada di sisi pagar, pintu, atau meja yang masuk akal untuk aksinya.
4. Aksi tokoh memperlihatkan kata kerja di narasi. Kalau narasi bilang "beliin makanan", kantongnya harus dipegang. Kalau "ngangkat galon", galonnya harus diangkat. Jangan ganti dengan benda yang sudah diletakkan atau digantung hanya supaya pose lebih mudah. Kalau posenya belum ada, buat pose kandidat dan tunjukkan ke pengguna (7 Nov 2026).
5. Semua tulisan di satu lokasi harus konsisten sebagai satu tempat. Spanduk, papan, dan gerobak menunjukkan satu usaha yang sama; jangan ada dua nama usaha yang saling bertabrakan. Contoh yang salah: spanduk "PECEL LELE • NASI GORENG" berdampingan dengan gerobak "NASI GORENG" (7 Nov 2026).
6. Lokasi shared yang dipakai ulang tidak membawa detail khusus cerita asalnya yang janggal untuk adegan baru, misalnya lubang jalan bergenangan Gang Melati di adegan hari pertama kerja yang hangat (pengguna 13 Nov 2026: "masa jalan berlobang?"). Matikan lewat prop (`tambal`), pilih lokasi lain, atau buat lokasi baru.

## B. Perspektif dan skala
1. Tentukan garis lantai setiap benda. Benda di garis lantai yang sama dengan tokoh harus proporsional dengan tokoh.
   - Tinggi tokoh dewasa = 330 satuan × skala, setara sekitar 1,65 m.
   - Motor: panjang sekitar 1,15× tinggi orang, dan setang sekitar 0,65× tinggi orang. Untuk `Motorbike`, gunakan s ≈ 2,1 × skala tokoh.
   - Pintu sekitar 1,25×, meja makan sekitar 0,45×, dan kursi sekitar 0,55× tinggi orang.
2. Benda yang lebih jauh harus lebih kecil dan alasnya lebih tinggi di layar. Jangan menaruh benda besar di latar belakang dengan skala latar depan.
3. Benda yang terpotong di tepi bingkai boleh, asal bentuknya masih terbaca.
4. Lantai, ubin, jalan, dan trotoar harus trapesium (perspektif): garis menyatu ke titik hilang di horizon setinggi mata, dan baris makin rapat ke arah jauh. Tidak boleh ada grid kotak datar.

## C. Sudut pandang (POV)
1. Tulis untuk setiap panel: kamera di mana, menghadap ke mana, dan setinggi apa.
2. Latar depan harus menunjukkan sisi kamera. Contohnya: trotoar dan jalan berarti kamera di luar, ubin halaman berarti kamera di dalam.
3. Dua panel berbeda jangan memakai komposisi latar yang terlihat sama, misalnya balkon dan jalan senja.

## D. Tokoh
1. Jangan pakai tampak belakang penuh. Ubah sudut KAMERA (serong, dua titik hilang) dan biarkan tokoh tetap tiga perempat ke kamera. "Serong" = POV kamera, bukan kepala tokoh yang menoleh.
2. Tokoh duduk digambar di belakang penutup yang sampai ke lantai. Tanpa itu, tokoh terlihat seperti berdiri.
3. Pose tangan hanya dari `POSE` (shared/characters/rig/v2/poses.ts). Audit menolak koordinat tangan yang dikarang. Pose kandidat harus ditunjukkan ke pengguna dulu.
4. Benda yang punya sisi depan/belakang harus menghadap logis ke kamera. HP yang dipegang tokoh menghadap kamera = punggung HP, bukan layar.
5. Tangan harus memegang benda di anchor tangan (`holdLeft`/`holdRight`). Jalankan `node tools/render-film.cjs <proj> --audit=1` sampai bersih, lalu periksa crop 100% di area tangan.
6. Extras harus berbeda dari Naya dan Yan, dan jenis kelaminnya harus terbaca jelas.
7. Mata dan tubuh harus hidup: lirikan, napas, dan langkah.
8. Tokoh berjalan memakai `langkah()` (`shared/film/v1/Langkah.ts`): kaki mengayun hanya saat badan berpindah, iramanya dari jarak tempuh, lurus lagi saat berhenti. Cek frame demi frame di awal dan akhir setiap jalan: tidak ada kaki mengayun di tempat, tidak ada kaki bergerak saat sudah diam. Jangan memakai ayunan berjam tetap seperti `sin(f*0.42)` (pengguna 12 Nov 2026: "kaki udah bergerak tapi masih jalan di tempat beberapa detik ... udah diam tapi kaki masih gerak").
9. Adegan cermin/kaca: tokoh yang menatap cermin tampak belakang (`view="back"`), wajahnya di pantulan yang diletakkan di bayangan maya (`titikPantulan`). Tidak boleh tokoh dan pantulannya sama-sama menghadap kamera (pengguna 12 Nov 2026: "masa dua badan menghadap kamera").
10. Tampak `serong` rig v2 tidak dipakai untuk Naya/tokoh berambut bob: belakang kepala terlihat botak (pengguna 12 Nov 2026). Pakai `three` atau, di cermin, `back`.
11. Tidak ada tampak yang meloncat depan/tiga perempat ↔ belakang di dalam satu shot. Tokoh berbalik dengan `berbalik()` (`shared/film/v1/Berbalik.ts`, ±10 frame, tampak diganti di titik tengah) dan baru berjalan sesudahnya. Cek frame di sekitar setiap pergantian `view` (pengguna 12 Nov 2026: "detik 17 kok langsung hadap belakang si naya?"). Tokoh tidak berjalan menyamping sambil membelakangi kamera: berjalan menghadap arah jalannya, lalu berbalik setelah sampai di depan benda yang ditatap (Villain v2: berbalik di detik 21 setelah koreksi 19 → 20 → 21, 12 Nov 2026).
12. Di depan cermin, pantulan selalu tampak kebalikan tokoh, juga saat tokoh berbalik. Metafora di dalam cermin (panggung, sosok lain) ditutup dulu sebelum tokoh berbalik (pengguna 12 Nov 2026: "naya yang di cermin masih hadap kamera juga loh?").
13. Tidak ada tokoh yang dipudarkan sampai tembus pandang (tokoh kenangan/"hantu" tetap padat; bedakan lewat cahaya, sikap, atau potongan). Pengguna 13 Nov 2026: "yan yang bicara kok transparansi banget di akhir?"
14. Tokoh yang sedang dibicarakan tidak diam sepanjang adegan: ia melakukan kegiatan yang memperlihatkan keadaannya (mengetik, membawa berkas, fotokopi, memegang HP kerja), dan kegiatannya berubah mengikuti narasi. Ganti ekspresi saja tidak cukup. Pengguna 13 Nov 2026: "alih alih tian diam, mending tian kayak sambil kerja, kerja sambil frustasi, lagi fotocopy tapi lesuh gitu gitu."
15. Kos Naya = kos putri: tidak ada laki-laki di dalam atau di jendela kos Naya selain Yan (pengguna 18 Nov 2026: "gak mau ada laki laki yang masuk ke kost naya, selain yan"). Figuran pria hanya di luar kos.
- Tokoh memakai rig terbaru; cek crop 100% baju Naya saat ada figuran perempuan berbaju lain (warna rajut tidak bocor) (20 Nov 2026).

## E. Kekayaan latar
1. Setiap lokasi minimal punya 6–8 benda khas tempat itu, tekstur dinding atau lantai, bayangan, dan 3 lapis kedalaman (latar jauh, tengah, depan).
2. Pakai `shared/locations/_detail/v1/Detail.tsx`. Tambahkan benda baru ke pustaka itu, bukan ke file proyek.
3. Cahaya dan warna harus sesuai waktu, dan sama di seluruh shot dalam satu kejadian.
4. Deretan bangunan terdiri dari beberapa unit berbeda, bukan satu dinding memanjang.
5. Langit hidup: awan, burung, pesawat, layangan, atau bulan (`SkyLife`).
6. Kedalaman dan material: ada lapisan depan, latar diburamkan saat close-up, dan permukaan punya material (kaca berpantulan, ubin bergradasi, air/uap) dari `_detail/v2` dan `film/v1/Depth.tsx`.
7. Mode dramatis hanya untuk momen emosi kuat, dan hanya setelah lembar contohnya disetujui pengguna.

7. Satu dunia boleh, tetapi beberapa tempat: setiap tempat/benda yang disebut narasi terlihat di dunia animasi pada kalimatnya (tokoh atau kamera pergi ke sana), bukan hanya di tangkapan layar/diagram atau di ruangan yang sama terus (pengguna 17 Nov 2026: "boleh di satu dunia, tapi beberapa tempat laaa!. ini kosong banget loh ... visual harus nya menggambarkan apa yang dibicarin!").
8. Satu benang merah dari awal sampai akhir (pengguna 18 Nov 2026 atas v2 perkenalan web: "masih gak bagusss", bagian yang mengganggu "Alur & adegannya"): tiap kalimat memperlihatkan sebab atau akibat pada benda/tokoh cerita; fitur bukan daftar tur; setup di awal dibayar di akhir; tokoh tidak berdiri diam + label; tempat yang sama tidak diulang tanpa perubahan.
- Lokasi mengikuti isi kalimat; tidak satu lokasi untuk sebagian besar panel kalau naskah berpindah topik. Lokasi baru dibuat bila belum ada (20 Nov 2026).

## F. Layar
0. Bubble memakai `shared/film/v2/Bubble.tsx` + `letakBubble()` (gaya Kok Bisa?, sejak 12 Nov 2026): maksimal 4 kata.
   - Oval menempel di kepala pembicara (tepi ±20–30 px dari kepala), ekor pendek ≤90 px (diaudit), ujung ekor di tepi kepala.
   - Boleh menimpa badan, bahu, atau tepi kepala; tidak menutupi wajah siapa pun.
   - Tanda kecil `?`/`!` (Mark) menempel di sudut atas kepala tokohnya (`letakTanda()`), bukan di titik bebas.
   - Pengguna 12 Nov 2026: "bubble bicara juga aneh karena narik jauh dari sisi kepala".
1. Subtitle, popup, kartu, dan gelembung harus di dalam safe zone: kiri ≥110, atas ≥220, kanan ≤920, bawah ≤1480. Audit memeriksa `data-box`.
   - Kiri 110 = tepi kiri subtitle; kanan 920 sudah di dalam tepi kanan logo (±985).
   - Overlay tidak boleh lebih ke tepi daripada subtitle dan logo. Ini berlaku untuk label, tag panel layar terbelah, bubble, tanda `?`/`!`, kartu, inset, diagram, dan kartu outro (pakai Outro C v3).
   - Pengguna 12 Nov 2026: "overlay yang ada harus sama seperti jarak cation dan logo, jangan lebih dalam, maksudnya jangan lebih ke tepian".
2. Gelembung dan kartu tidak boleh menutupi wajah, tanda lokasi, atau benda penting. Wajah dicek otomatis oleh `render-film --audit` (gelembung menutupi >12% kotak wajah = temuan, 7 Nov 2026); tanda lokasi dan benda tetap dicek mata.
3. Ukuran kartu harus sesuai isinya.
   - Insert besar tanpa `data-box` (layar ponsel penuh, kertas) yang dianimasikan membesar harus berjangkar di tepi atasnya, supaya tidak naik ke zona subtitle (y ±260–440). Audit tidak memeriksa ini; cek stills dari MP4 (Tangan Kosong v3, 12 Nov 2026).
   - Insert yang membesar juga tidak boleh melebar melewati x 110–970: hitung lebar terbesarnya (lebar × skala akhir), bukan hanya lebar awal. Kalau perlu kesan mendekat, mulai dari skala <1 dan berhenti di 1 (Villain v2: laptop 1→1,22 melebar ke x 50–1030, 12 Nov 2026).
   - Yang masuk menggeser hanya benda sisipannya. Jangan menggeser grup yang berisi latar penuh: tepi frame jadi kosong (pita pucat) selama animasi masuk.
4. Subtitle maksimal 7 kata dan 2 baris per kemunculan.
5. Jarak gelembung ke subtitle minimal sekitar 100 px (diaudit). Kalau di atas kepala tidak muat karena subtitle, `letakBubble()` memindahkannya ke samping kepala.
6. Label bergaris penunjuk memakai `shared/film/v2/Callout.tsx`: garis keluar dari tepi label yang menghadap benda (bukan dari sudut), terbaca di latar terang/gelap, dan garis antar-label di satu shot tidak bersilangan atau memotong label lain/wajah. Cek di stills (pengguna 13 Nov 2026: "garis untuk overlay tolong dibenerin").
   - Garis bersiku L (satu belokan 90°), bukan garis miring (pengguna 13 Nov 2026: "garisnya jangan tarik lurus, tapi bersiku L").
7. Overlay yang tetap tampil melewati potongan shot tidak muncul/pop ulang: `a` sama dengan frame munculnya yang asli, letaknya sama antar-shot, dan `src/sfx.json` tidak berisi pop kedua untuk label yang sama. Cek frame tepat setelah potongan (pengguna 13 Nov 2026: "overlay kurang bersyukurnya kok kayak dua kali popup?").
- Layar media sosial meniru platform nyata yang dipilih (tata letak, ikon, huruf, warna); akun dan isi karangan (20 Nov 2026).

## G. Kamera dan waktu
0. Satu kalimat, satu perubahan: storyboard awal → akhir berbeda; `render-film.cjs --motion` tidak menandai shot terlalu diam (target ≤50% waktu diam) dan tidak ada diam beruntun lebih dari 3 detik.
0a. Panel atau frame pertama sudah menjadi hook: tokoh dan situasi terlihat dalam shot sedang/close-up (skala ≥2,4), narasi dan subtitle mulai ≤0,3 dtk, tanpa salam atau kartu judul. Belokan "Tapi…" di ±55–65% durasi dengan perubahan visual.
0b. Kucing oranye callback muncul kecil di latar setidaknya sekali (`shared/characters/kucing/v1`), bergerak, satu kucing per shot, kecuali memang tidak cocok untuk video ini.
0c. Outro C: kartu muncul 0,8 dtk setelah kata terakhir, ekor total 3 dtk.
1. Shot minimal 1,3 detik. Variasikan zoom dan sudut, dan jangan mengulang resep yang sama.
   - Di panggung flat 2D, dorongan kamera pelan saja biasanya terbaca diam oleh `--motion`. Beri aksi yang bermakna: tokoh berjalan, benda berpindah tangan, kamera mengikuti tokoh, atau label/inset masuk pada kata kuncinya.
   - Layar terbelah cenderung ditandai terlalu diam karena separuh layarnya area krem. Ia hanya pilihan, bukan bawaan.
   - Tulis ukuran bingkai tiap bagian berurutan (lebar/sedang/dekat/sisipan + subjek). Dua bagian berurutan tidak boleh sama ukuran, sudut, dan titik tengahnya (sedang → sedang dengan zoom hampir sama = terasa "looping"). Pengguna 13 Nov 2026: "cut tapi tetap sama posisi kamera (kayak setengah karakter) gitu dan sama sama zoom, jadi kayak looping".
2. Tanda atau identitas lokasi harus tetap terlihat di semua shot yang menghadap ke arahnya.

## H. Audio (kalau ada)
0. Tanpa musik latar. Efek hanya pop/slide lokal dari `--sfx` + `mix_sfx.py`, volume jauh di bawah narasi.
1. Awal tawa tepat di ujung punchline. Cetak selisihnya dan periksa angkanya.
2. Volume tawa agak kecil. Narasi tidak dipercepat.
3. Kenyaringan video final −14 LUFS (±1) dan puncak ≤ −1 dBTP: `python3 tools/loudness.py <video>` (render penuh dan `mix_sfx.py` sudah menormalkan otomatis).
4. Alamat web di narasi ditulis `less dot benaya dot I. D.` dan terdengar "less dot benaya dot ai di", bukan "titik" (aturan 18 Nov 2026). Subtitle tetap `less.benaya.id` lewat `01-Brief/subtitle-ganti.json`. Dengarkan potongannya sebelum render.

## I. Proses
0. Lembar ide (`01-Brief/LEMBAR-IDE.md`) terisi sebelum naskah. Untuk Open Mic: lolos uji tunjuk (pola-standup 3a), dan izin komentator ada kalau topiknya dari komentar.
0a. Durasi: reguler 61–75 dtk, Open Mic di bawah 90 dtk. Angka di naskah ElevenLabs ditulis dengan huruf.
0b. Setelah video final: kemasan (`references/kemasan.md`) disiapkan di `04-Hasil/KEMASAN.md`.
1. Sebelum memakai arahan yang terasa baru, cek `references/arahan-pengguna.md`. Kalau ada yang bertentangan, tanya pengguna dulu.
2. Simpan perbaikan umum di `shared/`, `tools/`, atau `references/`, lalu catat di `shared/catalog.json`. Penjelasan di file umum ditulis lengkap, tanpa menyuruh membuka folder proyek (8 Nov 2026). Folder proyek hanya berisi hal khusus cerita itu; audit memperingatkan kalau tidak.
3. Storyboard sudah disetujui pengguna sebelum audio dan render video.
4. `node tools/render-film.cjs <proj> --audit=1` bersih (tanpa temuan; peringatan dibaca dan dijelaskan).
5. `node tools/check-shared.cjs --locks` bersih: tidak ada file shared yang dipakai video terkirim ikut berubah. Kalau perlu mengubahnya, buat versi baru.
6. **ATURAN WAJIB 2D/3D (11 Nov 2026 sore):** apakah dunia dibuat flat 2D (bawaan)? `Dunia3D` (`shared/locations/_proyeksi/v3/Dunia.tsx`, `cahaya` menyala) hanya boleh kalau pengguna memintanya, dan kalimat permintaannya dikutip di `01-Brief/`. Di flat 2D, cek cahaya dari `shared/film/v1/Cahaya2D.tsx` (disetujui 11 Nov 2026): satu arah matahari yang konsisten untuk bidang, bayangan jatuh tokoh/benda dan cahaya badan tokoh, bayangan kontak di kaki, dan tokoh yang tidak terlihat seperti stiker. Di dunia 3D, cek pencahayaan berarah, bayangan jatuh, kedalaman, bokeh, pantulan kaca, ambient, dan tokoh yang tidak terlihat seperti stiker. Cek juga urutan depan-belakang (pengguna 11 Nov 2026, Kritik v3 ditolak): tokoh di depan pagar/tiang/dinding tidak tertutup, pintu-jendela-papan nama di fasad dan isi rak terlihat, benda di halaman tetap di balik pagar. Mesin v2 salah di sini; pakai v3.
- CTA Outro C dipilih sesuai topik dan mengarah ke less.benaya.id; bukan bawaan `ikuti` (20 Nov 2026).
- Hadirin/kerumunan memakai figuran extras rig (depan detail, belakang siluet rig beranatomi utuh); tidak ada bulatan kepala-bahu buatan sendiri (21 Nov 2026).
- CTA Outro C dibaca keras-keras: kalimat lisan yang masuk akal dan menyambung inti video, bukan `Resah soal <topik>` yang ditempel (21 Nov 2026).

## J. Khusus seri Lirik (7 Nov 2026)
1. `01-Brief/lagu.json` berisi judul, penyanyi, sumber timing, dan waktu tiap baris. `lirik.txt` diisi pengguna dengan jumlah baris yang sama (`python3 tools/lirik_timeline.py <proj>` memeriksanya).
2. Frame pertama adalah hook visual dan vokal pertama ≤1 dtk. Butir G0a soal narasi/subtitle ≤0,3 dtk tidak berlaku.
3. Satu baris lirik = satu perubahan. Teks hanya muncul di baris yang ditonjolkan.
3a. Teks = lirik asli dari `lirik.txt` (bukan kata contoh/terjemahan). Tanpa bahasa Indonesia di layar (8 Nov 2026).
3b. Teks tampil di atas adegan bertokoh. Lembar yang hanya berisi teks di latar kosong tidak dikirim sebagai pengganti storyboard.
4. Teks lirik di dalam safe zone (`data-box`), terbaca, dan tidak menutupi wajah kecuali disengaja dan disetujui di storyboard. Butir F4 (subtitle) dan bubble tidak berlaku.
5. Master tanpa audio (render otomatis) dan tanpa efek pop/slide. Bagian H tidak berlaku. Sinkron dicek lewat `<Judul>-PREVIEW-lagu.mp4` kalau ada lagu panduan; file itu tidak diunggah.
6. Durasi mengikuti potongan lagu (butir I0a tidak berlaku).
7. Kemasan: kredit lagu di caption, dan `unggah.json` berisi blok `lagu` dengan titik mulai (`references/kemasan.md` bagian "Seri Lirik").
8. Lirik lagu tidak disalin agen ke file atau pesan; rujuk nomor baris.
9. Sudut kamera: dua shot berurutan tidak dari sudut yang sama; ada sudut berbeda (luar, kaca, lorong, insert, balkon), gerak kamera bukan hanya zoom. Tata letak (mis. ranjang) masuk akal dengan arah hadap tokoh.
10. Teks kutipan tidak menabrak tokoh (pindah ke atas bila perlu); logo terang di adegan gelap (`LOGO = 'terang'`), cek crop kanan atas.
11. Daftar kontinuitas per shot sudah dicek: benda yang dipegang, pintu, lampu, kucing.
12. Cover dibuat ulang bila latar/gaya video berubah; cover harus mencerminkan video final.
