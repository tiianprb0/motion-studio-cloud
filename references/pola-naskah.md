# Pola naskah (panduan pilihan, bukan formula wajib)

Disimpan 7 Nov 2026 atas persetujuan pengguna ("gas"), setelah membandingkan Less. dengan video panjang Kok Bisa?. Statusnya **panduan pilihan**: brand guide (bagian 11) dan kontrak melarang formula cerita yang wajib. Jangan membuat setiap video terasa memakai resep yang sama.

**Seri Lirik** (7 Nov 2026) tidak memakai naskah narasi, jadi pola ini tidak berlaku. Polanya ada di `format-less.md` bagian "Lirik".

## Kenapa pola ini cocok untuk Less.
Brand guide sudah menyarankan struktur Pembuka → Pertanyaan → Perspektif → Penalaran → Penutup, dan setiap ide punya situasi yang dikenali, asumsi yang layak dipertanyakan, perspektif, alasan dan contoh, serta pemikiran yang tertinggal. Kok Bisa? memakai kerangka yang hampir sama. Yang bisa dipelajari dari mereka adalah **cara mengeksekusinya**: jawaban cepat yang sengaja dipatahkan, belokan "Tapi…" yang jelas, contoh konkret di setiap kalimat, dan humor kecil yang menjaga perhatian.

## Pola dasar Kok Bisa? (diamati dari 2 video panjang)
1. Situasi akrab, lalu pertanyaan judul diucapkan.
2. Jawaban cepat yang terdengar benar, lalu langsung dipatahkan.
3. Beberapa sudut pandang; tiap sudut 1–2 kalimat, contoh konkret dan humor kecil.
4. Belokan "Tapi…": asumsi tersembunyi dibuka, dijelaskan dengan contoh sederhana.
5. Contoh nyata yang dekat (kasus, data, tempat).
6. Kembali ke penonton: refleksi singkat, bukan ceramah.

## Penyesuaian untuk Less.
| Kok Bisa? | Less. |
|---|---|
| Topik sains/fakta; ujungnya jawaban | Topik perilaku, hubungan, norma; ujungnya **pemahaman konteks**, bukan vonis. Memahami bukan membenarkan. |
| 5–6 sudut pandang dalam 3–5 menit | Video **61–75 dtk** (arahan 7 Nov 2026): **maksimal 2 sudut pandang**, ±145–175 kata lisan. |
| Humor sarkas, kadang mengejek pihak tertentu | Humor situasional atau menertawakan diri sendiri. **Tidak merendahkan orang yang sedang kita pahami.** Seri Open Mic punya nada sarkas sendiri (lihat audio.md), tetap tanpa mengarang fakta. |
| Data dan mekanisme | Riset psikologi/sosial dan contoh konkret. Bedakan fakta, dugaan, opini; sumber dicatat di 01-Brief; jangan mengarang angka. |
| Tempo cepat sepanjang video | Visual tetap hidup (satu kalimat, satu perubahan; tidak ada diam beruntun lebih dari 3 detik), tetapi narasi diberi **jeda** setelah belokan "Tapi…" dan sebelum penutup. |
| Penutup salam khas | Penutup berupa pertanyaan atau pengamatan yang tertinggal. CTA hanya di kartu Outro C (bergantian: ikuti / pertanyaan topik / seri / titip; video dari keresahan web memakai `dari`); kalau memakai pertanyaan topik, kalimat penutup narasi = pertanyaan itu. Tanpa kesimpulan moral. |

## Hook 0–3 detik (arahan 7 Nov 2026)
Kalimat pertama langsung masuk ke situasi. **Tanpa salam, tanpa kartu judul, tanpa "jadi gini ceritanya".** Penonton yang baru pertama kali melihat Less. harus langsung paham. Frame pertama juga jadi sampul cadangan, jadi tokoh dan situasinya harus sudah terlihat.

Pilih salah satu rumus berikut dan gilir antar-video:

| Rumus | Bentuk | Contoh |
|---|---|---|
| Kalimat yang sering didengar | "Katanya, …" / kutipan yang akrab | "Sok-sokan kritik pemerintah. Emang udah ngasih apa ke negara?" (Kritik) |
| Situasi + penilaian cepat | situasi singkat, lalu vonis yang biasa muncul | "Dia telat lagi. Pasti nggak menghargai waktuku." |
| Pengakuan "aku" | satu hal pribadi yang sedikit memalukan | "Pacarku punya satu kebiasaan yang dulu selalu bikin aku kesal." (Maaf v2) |
| Angka nyata | angka spesifik yang mengejutkan (**wajib bersumber**, ditulis dengan huruf untuk narasi) | |
| Pertanyaan judul | pertanyaan yang langsung bikin penasaran | "Pernah nggak, kamu yakin banget sama penilaianmu tentang seseorang…" (Kurang Yakin) |

Dasar: panduan iklan TikTok mencatat lebih dari 63% video dengan klik tertinggi menaruh pesan utamanya di 3 detik pertama (konteks iklan, tapi arahnya sama). Bacaan pendukung: buku gaya Republik Netizenia (7 Nov 2026).

### Frame pertama = hook (arahan 7 Nov 2026)
Di feed TikTok, Reels, dan Shorts video langsung diputar, jadi frame pertama ikut menentukan orang berhenti atau lewat.
- Narasi mulai **paling lambat 0,3 detik** (`narration_timeline.py` bawaan `--lead 0.15`, kata pertama ±0,27 dtk; `standup_timeline.py` `lead` 0,3).
- **Subtitle sudah tampil** dalam 0,3 detik pertama.
- **Shot pertama sedang atau close-up** (skala tokoh ≥ 2,4) dan langsung memperlihatkan tokoh dalam situasinya. Bukan shot lebar kosong, bukan fade dari hitam.
- **Tanpa salam**, termasuk Open Mic: "Selamat malam!" dipotong; Yan langsung masuk ke premis.
- Dicek otomatis oleh `render-film --audit`. Narasi atau subtitle yang terlambat = temuan; shot lebar dan salam = peringatan.

### Kata kunci pencarian (arahan 7 Nov 2026)
Pilih **satu kata kunci** yang kira-kira diketik orang di pencarian TikTok, Instagram, atau YouTube (misalnya "minta maaf", "pacar gengsi", "telat"). Taruh kata itu di:
- kalimat hook yang diucapkan (pencarian TikTok juga membaca ucapan dan teks di layar);
- subtitle;
- baris pertama caption dan judul YouTube Shorts (`references/kemasan.md`).

Kata kuncinya harus muncul alami. Jangan dijejalkan.

## Momen "oh ternyata" dan "dikirim ke siapa?" (arahan 7 Nov 2026)
- **Satu momen "oh ternyata"** di belokan "Tapi…": konteks yang mengejutkan dan membuat penonton melihat ulang penilaiannya.
  - Alasan: Berger & Milkman (2012, *Journal of Marketing Research*) menemukan konten yang membangkitkan emosi kuat lebih sering dibagikan. Emosi itu bisa kagum atau terkejut, tapi juga marah dan cemas. Emosi yang menurunkan energi, terutama sedih, paling jarang dibagikan.
  - Untuk Less., pilih **kagum atau terkejut**. Bukan amarah atau pancingan cemas.
  - Jangan menutup video hanya dengan rasa sedih: tinggalkan pemahaman baru atau pertanyaan.
- **Dikirim ke siapa?** Tulis satu orang yang paling mungkin dikirimi video ini (pasangan, sahabat, orang tua, teman kantor). Kalau tidak terbayang siapa pun, gagasannya belum cukup "kena". Instagram menghitung kiriman (sends) sebagai salah satu sinyal utama; kiriman lahir dari isi, bukan dari ajakan.

## Waktu belokan "Tapi…"
Untuk video di atas 45 detik, belokan "Tapi…" atau pembalikan terbesar jatuh di sekitar **55–65% durasi** (detik ±35–45 untuk video 70 detik). Belokan ini juga berfungsi sebagai pengait ulang bagi penonton yang mulai bosan. Selalu tandai dengan **perubahan visual**: cahaya berganti, fokus berpindah, transisi, atau mode dramatis.

## Penutup dan CTA (Outro C)
- Kalimat terakhir narasi berupa pertanyaan atau pengamatan yang tertinggal, bukan kesimpulan moral.
- Kalau memakai varian pertanyaan di kartu Outro C, kalimat penutup narasi = pertanyaan itu.
  - Pertanyaannya tentang **pengalaman atau kebiasaan penonton sendiri** dan bisa dijawab dalam **1–3 kata**. Contoh: "Kamu tipe yang bilang, atau yang nunjukin?"
  - Bukan "setuju nggak?", karena itu memecah penonton jadi dua kubu.
  - Alasan: orang suka bercerita tentang dirinya sendiri. Tamir & Mitchell (2012, PNAS) menemukan bahwa membagikan informasi tentang diri sendiri mengaktifkan sistem penghargaan otak, dan peserta rela melepas uang untuk melakukannya.
- **Jangan meminta share, tag, atau "komen ya"** secara eksplisit. Meta menurunkan jangkauan *engagement bait*, termasuk yang diucapkan di audio video.

## Angka di narasi
Tulis angka dengan huruf di teks yang dikirim ke ElevenLabs ("tiga ratus sembilan belas", bukan "319"), supaya tidak salah baca. Helper ElevenLabs memberi peringatan kalau ada angka.

## Tiga varian (pilih sesuai topik, jangan selalu sama)
**A. "Tapi ternyata"** — cocok untuk perilaku manusia.
Situasi yang sering dilihat → penilaian yang biasanya muncul → "Tapi…" konteks/alasan yang jarang terlihat → alasan + contoh/bukti → pertanyaan yang tertinggal.

**B. "Cerita lalu mundur"** — cocok untuk hubungan; pengguna suka narasi orang pertama ("pacarku…").
Cerita aku → momen yang bikin tidak mengerti → mundur selangkah: kenapa orang bisa begitu (riset/contoh lain) → kembali ke cerita dengan cara pandang baru → penutup terbuka.
(Contoh yang sudah ada: Maaf yang Nggak Pernah Diucapin v2. Yang belum ada di sana: langkah "mundur" dengan contoh atau bukti di luar cerita.)

**C. "Dua sisi"** — cocok untuk pengamatan sosial.
Kalimat yang sering didengar → sudut pandang 1 → sudut pandang 2 → apa yang sama-sama terlewat → pertanyaan.
(Contoh yang dekat: Syarat Protes, dalam bentuk stand-up.)

## Peta beat ke visual (sambung dengan shared/film/v1)
| Beat | Visual yang membantu |
|---|---|
| Situasi akrab | Lokasi nyata yang kaya detail, tokoh beraksi |
| Penilaian / jawaban cepat | Bubble pendek, label bergaris penunjuk, tanda ?/! |
| "Tapi…" | Transisi fokus, perubahan cahaya, mode dramatis (hemat, setelah disetujui) |
| Alasan dan contoh | Metafora visual, layar terbelah, inset, diagram batang, benda dipersonifikasi |
| Penutup | Shot tenang yang ditahan sebentar, tanpa teks berlebihan |

## Cek naskah sebelum storyboard
Isi dulu lembar ide (`references/lembar-ide.md`), lalu cek:
0. Hook: kalimat pertama memakai salah satu rumus hook, tanpa salam, dan penonton baru langsung paham?
1. Apakah situasi pembukanya langsung dikenali dalam 1–2 kalimat?
2. Asumsi apa yang dipertanyakan, dan di kalimat mana belokan "Tapi…" terjadi?
3. Setiap klaim: fakta (bersumber), dugaan, atau opini? Tidak ada angka karangan.
4. Apakah ada pihak yang diejek atau dihakimi? Ubah jadi pemahaman.
5. Apakah penutup meninggalkan pertanyaan, bukan vonis atau moral?
6. Panjang ±145–175 kata untuk 61–75 detik (arahan 7 Nov 2026; tetap di atas 60 detik karena Creator Rewards TikTok hanya membayar video di atas 1 menit). Satu ide per kalimat.
6a. Belokan "Tapi…" di sekitar 55–65% durasi, dengan perubahan visual?
6b. Kalau penutupnya pertanyaan: tentang penonton sendiri dan bisa dijawab 1–3 kata? Angka sudah ditulis dengan huruf?
6c. Kalimat pertama tanpa salam dan memuat kata kunci pencarian? Ada momen "oh ternyata"? Jelas video ini akan dikirim ke siapa?
7. Apakah video ini terasa sama persis dengan video sebelumnya? Kalau ya, ganti varian.
