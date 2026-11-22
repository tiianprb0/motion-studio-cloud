# Kemasan setelah render: caption, komentar sematan, unggah

Arahan pengguna 7 Nov 2026 ("1-13 jalankan"), diadaptasi dari buku gaya Republik Netizenia dan riset platform. Dikerjakan setelah video final dan thumbnail jadi. Teksnya disimpan di `projects/<slug>/vN/04-Hasil/KEMASAN.md` dan diserahkan bersama MP4. Mengunggah dan memublikasikan tetap hanya atas permintaan pengguna.

## Caption
```
[hook satu kalimat: sama atau senada dengan kalimat pertama video, memuat KATA KUNCI pencarian]
[satu kalimat yang bikin penasaran; bukan ringkasan isi]
[pertanyaan penutup tentang penonton, bisa dijawab 1–3 kata] (opsional, sama dengan CTA Outro C varian tanya)
Sumber: [singkat] (kalau video memuat klaim fakta; atau "sumber di komentar")
#less #[topik] #[topik] #[satu tagar umum, mis. #psikologi atau #standupcomedy]
```
- 3–5 tagar; salah satunya kata kunci video (mis. #mintamaaf).
- **Judul YouTube Shorts:** kata kunci di awal + hook, maksimal ±60 karakter. Contoh: "Minta maaf tanpa kata: kenapa dia nggak pernah bilang maaf?"
- **Jangan meminta share, tag, atau "komen ya"** secara eksplisit. Meta menurunkan jangkauan *engagement bait*.
- Bedakan fakta, dugaan, dan opini, sama seperti di naskah.

## Komentar sematan (dari akun @less.certain)
- **Less. reguler:** sumber riset (judul atau tautan), ditambah satu pertanyaan lanjutan atau sudut lain yang tidak masuk video.
- **Open Mic:** keterangan "skenario fiktif, menyindir pola, bukan orang", lalu ajakan "keresahanmu bisa jadi episode berikutnya" (aturan izin di pola-standup bagian 10).

## Catatan per platform (dicek 7 Nov 2026)
- **TikTok:** Creator Rewards hanya membayar video di atas 1 menit. Karena itu target durasi Less. 61–75 detik (seri Lirik dikecualikan, lihat bagian "Seri Lirik"). Menyelesaikan video adalah sinyal kuat.
- **Instagram Reels:** sinyal utama menurut Adam Mosseri adalah waktu tonton, like, dan **kiriman (sends)**. Video yang ingin dikirim ke orang lain lahir dari isi, bukan dari ajakan.
- **YouTube Shorts:**
  - Tidak ada end screen.
  - Frame sampul bisa dipilih di aplikasi (thumbnail kustom mulai dibuka bertahap), jadi frame pertama tetap harus kuat.
  - Fitur "Related video" di YouTube Studio desktop bisa menautkan Short ke video lain di kanal.
- **Jam unggah:** belum jadi aturan.
  - Sumber publik tidak konsisten. Pola yang paling sering muncul: 19.00–22.00 WIB dan jam makan siang.
  - Patokan sebenarnya adalah Insights akun sendiri (Audiens → waktu paling aktif).

## Setelah disetujui: folder siap-unggah (arahan 7 Nov 2026)
Salin video final, cover (9:16, 3:4, 4:5, alternatif), dan caption ke `siap-unggah/<slug>/` (tanpa tanggal) beserta `unggah.json`. Cover utama = versi pose, versi wajah di `cover-alternatif/`. Agen pengunggah hanya membaca folder itu. Format lengkap: `siap-unggah/README.md`.

## Unggah (dilakukan pengguna)
Agen tidak mengunggah apa pun. Pedoman untuk pengguna:
- **Unggah file master dari `04-Hasil/` ke setiap platform.** Jangan mengunduh video dari TikTok lalu mengunggahnya ke Instagram atau Facebook. Instagram dan Facebook menurunkan jangkauan unggahan ulang dan video dengan watermark platform lain (aturan konten tidak orisinal Meta, Juli 2025).
- Pilih cover dari file thumbnail. Instagram juga memungkinkan menggeser potongan grid 3:4.
- **Dashboard Studio (8 Nov 2026):** pengguna bisa push video `siap-unggah/` ke tebar dari tab Unggah (`tools/studio`, cara pakai di `tools/README.md` bagian "Studio"), setelah layar Periksa. Push itu tindakan pengguna sendiri. Agen tetap tidak mengunggah atau menjadwalkan tanpa permintaan eksplisit. Story Instagram dari dashboard juga dijadwalkan hanya saat pengguna menekan Jadwalkan (tanpa autopilot, `references/arahan-pengguna.md` bagian "Dashboard Studio"). Seri Lirik dari dashboard hanya ke TikTok sebagai draf (lagu dipasang di aplikasi).

## Catatan data (keputusan pengguna 7 Nov 2026: belum dikerjakan)
- **Belum ada data** yang bisa dicek agen. Log metrik dan uji hook (Instagram Trial Reels) **tidak dikerjakan dulu**.
- **Rencana pengguna:** menyambungkan agen ke tebar.app untuk melihat analytics.
- **Metrik per platform** kalau data sudah tersedia:
  - Instagram: waktu tonton rata-rata, like per jangkauan, kiriman per jangkauan.
  - TikTok: rata-rata waktu tonton, persen yang menonton sampai habis.
  - YouTube Shorts: *engaged views* dan "viewed vs swiped away". Sejak 31 Maret 2025, *views* dihitung setiap kali video diputar.
- Hasilnya menjadi "Pelajaran dari data" di `references/format-less.md`.

## Seri (Open Mic) (arahan 7 Nov 2026)
- **Nomor episode:** "Open Mic #N: <judul>". Syarat Protes = **Open Mic #1**. Nomor hanya di caption dan judul, bukan di cover (cover seri sudah dikenali dari tema panggung gelap).
- **Kumpulkan dalam seri di tiap platform:** playlist TikTok "Open Mic", folder seri Reels di Instagram (kalau tersedia di akun), playlist YouTube "Open Mic Less.". Ini dibuat dan diisi oleh pengguna saat mengunggah.
- **Baris pertama caption:** "Open Mic #N: <hook>". Baris terakhir: ajakan seri dari Outro C varian `seri` (pola-standup bagian 10).
- **Tiap episode harus bisa dipahami sendiri,** karena kebanyakan penonton datang dari rekomendasi, bukan dari episode sebelumnya. Callback ke episode lain hanya bonus kecil.

## Seri Lirik: kredit lagu dan caption (arahan 7 Nov 2026)
Pengguna: "kasih arahan untuk caption bikin judul lagu dan penyanyi nya as a credit dan tentu dengan kalimat yang sesuai dengan lirik".

```
[satu kalimat sendiri yang senada dengan potongan lirik: rasanya, bukan kutipan liriknya; memuat kata kunci tema]
[opsional: satu kalimat konteks, atau pertanyaan tentang penonton yang bisa dijawab 1–3 kata]
Lagu: <judul lagu> – <penyanyi>
#less #[tema] #[penyanyi] #[judul lagu]
```
- **Kredit selalu ada**, di baris sendiri. Judul lagu ditulis seperti judul resminya (huruf kecil/besar mengikuti rilisan).
- **Jangan menempel lirik di caption.** Kalimat caption ditulis sendiri dalam bahasa sehari-hari; yang diambil dari lagu hanya rasanya.
- Kalimat pertama memuat kata kunci tema (mis. "disayang", "overthinking", "obat") supaya bisa dicari.
- Tagar penyanyi dan judul lagu membantu video ditemukan dari pencarian lagu. Total tetap 3–5 tagar.
- **Judul YouTube Shorts:** kalimat hook, lalu kredit singkat bila muat, maksimal ±60 karakter.
- **Komentar sematan:** konteks yang tidak dinyanyikan dalam satu kalimat, atau satu pertanyaan lanjutan. Tanpa sumber riset, karena seri ini tidak memuat klaim fakta.

**Memasang lagu saat unggah (dilakukan pengguna):**
- `video.mp4` sengaja tanpa audio. Pasang lagu dari pustaka musik platform: TikTok "Tambah suara", Instagram/Facebook "Audio"/"Musik", YouTube Shorts "Tambahkan suara". Pilih rekaman resmi penyanyi, bukan unggahan ulang akun lain.
- Geser titik mulai lagu ke `lagu.mulai_di_lagu` di `unggah.json`. Patokannya: vokal pertama terdengar tepat saat aksi atau teks pertama muncul (`lagu.vokal_pertama_di_video`).
- Kalau lagu tidak tersedia di pustaka satu platform, **jangan** mengunggah versi bisu atau versi dengan lagu ditempel di file. Lewati platform itu dan catat di `status_unggah`.
- Video di bawah 60 dtk tidak masuk Creator Rewards TikTok. Konsekuensi ini sudah diterima untuk seri Lirik.

**Contoh (draf, belum disetujui): the cure – Olivia Rodrigo**
```
Disayang itu enak. Tapi ada luka yang nggak sembuh cuma karena disayang.
Pernah berharap seseorang jadi obatmu?
Lagu: the cure – Olivia Rodrigo
#less #hubungan #oliviarodrigo #thecure
```
Judul YouTube Shorts: "Disayang, tapi nggak sembuh | the cure – Olivia Rodrigo"
Komentar sematan: "Dia nggak salah apa-apa. Kadang yang harus sembuh memang bukan urusan orang lain."

## Contoh: Maaf yang Nggak Pernah Diucapin (kalau diunggah ulang)
```
Pacarku nggak pernah bilang "maaf" habis kami bertengkar.
Tapi besoknya selalu ada yang berubah.
Kamu tipe yang bilang, atau yang nunjukin?
#less #mintamaaf #hubungan #psikologi
```
Judul YouTube Shorts: "Minta maaf tanpa kata: kenapa dia nggak pernah bilang maaf?"
Komentar sematan: "Ini cerita, bukan riset. Kalau mau baca lebih jauh: cara tiap keluarga berdamai sering terbawa sampai dewasa. Di keluargamu, maaf biasanya diucapin atau ditunjukin?"
