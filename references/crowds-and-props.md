# Kerumunan dan kontak properti

Dokumen ini adalah catatan kerja. **Teks aturan yang mengikat ada di
`references/creative-contract.md`** — pada bagian "Extras, kerumunan dan
kedalaman" dan "Koreksi dialog, kontinuitas, siluet". Baca di sana saat
ada keraguan atau saat menilai hasil.

Sebelumnya kedua bagian itu disalin utuh ke sini. Salinannya sudah mulai
menyimpang dari aslinya, jadi yang tersisa di bawah adalah ringkasan
pengingat dan satu bagian yang memang hanya ada di sini.

## Pengingat extras dan kedalaman

Ringkasan, bukan sumber aturan. Rinciannya di creative-contract.md.

- Rig, sendi dan logika animasi Naya/Yan boleh dipakai ulang untuk extras.
  Yang tidak boleh ikut: baju, wajah dan rambut tokoh utama. Rig sama
  bukan berarti karakter sama.
- Hanya baris paling depan digambar detail. Baris di belakang adalah
  siluet tanpa mata, mulut, blush, detail baju atau logo — tetapi tetap
  beranatomi utuh: leher, dua lengan, dua kaki.
- Kepudaran bertingkat mengikuti jarak, begitu pula ukuran, overlap dan
  parallax. Bukan sekadar menurunkan opacity seluruh crowd.
- Occlusion oleh figur foreground diperbolehkan selama wajah, aksi/kontak
  penting dan subtitle tetap terbaca.
- Ekspresi extras bervariasi sebagai individu; siluet belakang berbicara
  lewat gestur, bukan wajah.
- Mayoritas bergerak kecil dan terarah, hanya beberapa menonjol. Tidak ada
  loop serempak. Gerak mengikuti clock scene yang kontinu.

## Properti yang dipegang

Bagian ini hanya ada di sini.

Definisikan anchor genggaman bersama untuk tangan, batang papan dan
telapak. Gerakan translasi/rotasi/lift mengikuti hierarki atau koordinat
lokal yang sama. Gambar genggaman di depan batang agar kontak terbaca.
Uji sepanjang entrance, aksi dan exit, termasuk saat kamera bergerak; satu
still tidak membuktikan kontak selalu benar. Jaga papan/pole dari wajah dan
subtitle. Lokasi serta isu mengikuti riset topik masing-masing, bukan
template demonstrasi universal.

## Pemeriksaan mekanis

Proyek format Film.tsx: `node tools/render-film.cjs <proj> --audit=1`
memeriksa tanda anatomi dari rig (siku, lengan lurus kaku, tangan di kepala,
dan seterusnya), skala tokoh efektif dan safe area di setiap frame. Proyek
format lama: `tools/lama/audit.cjs` (jangkauan lengan pada scene yang
dimodelkan `state()`). Keduanya tidak membuktikan kontak properti tiap
frame — gunakan moving proof dan crop 100% untuk itu.
