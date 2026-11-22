# Tangkapan layar Kampung Less. (web less.benaya.id), v2

Bahan video untuk konten TENTANG web Less. Aturan isi: `references/web-less-untuk-konten.md`. v1 (10 Nov 2026) tetap utuh.

- **Asal:** web online less.benaya.id, diambil 17 Nov 2026 dengan `node tools/web-less/tangkap.cjs --versi=v2` (pengguna 17 Nov 2026 memilih "Ambil ulang" untuk video perkenalan web). Ambil ulang satu gambar: `node tools/web-less/tangkap.cjs --versi=v2 <nama>`.
- **Isi = data asli saat diambil** (17 Nov 2026: 3 keresahan, 2 di Pos Keresahan, 1 Tayang; 3 avatar penitip anonim). Jangan menyebut angka di gambar sebagai keadaan terbaru.
- `tangkapan/` = asli (tegak 1080×1920, `-16x9` 1920×1080); `kecil/` = 720×1280 untuk layar HP/kartu (komponen `LayarWeb.tsx`).

## Tambahan v2
| Berkas | Isi |
|---|---|
| `ruang-baca-senja.jpg` | Ruang Baca (tempat lampion Diriset), senja. Kanopinya kosong saat diambil. |
| `meja-gambar-yan-senja.jpg` | Pergola Meja Gambar Yan di depan Kos Yan (tahap Storyboard), senja. |
| `ui-foto.jpg` | Mode foto: avatar menghadap kamera, pilihan pose Santai / Dadah / Gaya. |
| `ui-foto-hasil.jpg` | Lembar hasil foto dengan tombol "Bagikan ke Story" (tampilan HP). |
| `foto-avatar-hasil.jpg` | Gambar 1080×1920 yang dibuat web untuk Story: "Aku lagi nongkrong di Kampung Less." + less.benaya.id. |

**Avatar contoh:** web hanya membuka mode foto untuk pemilik avatar, jadi `tangkap.cjs` menyuntik satu avatar contoh tanpa nama (warga `w05`) di browser saat pengambilan; `/api/saya` dan `/api/kampung` dijawab di browser, tidak ada kiriman ke server. Kampung di belakangnya data online. Tampilkan sebagai contoh fitur, bukan sebagai avatar penonton tertentu. Latar diputar 125 px (`TANGKAP_PUTAR`) supaya gapura "Kampung Less." di belakang dan tiang tidak menutupi avatar.

Gambar lain sama dengan daftar di `shared/web-less/v1/README.md` (diambil ulang). `ui-titip` tetap memakai contoh ketikan yang tidak dikirim.

## Cara memakai di video
Gaya web 3D low-poly berbeda dari animasi Less.: pakai `LayarHP` (sisipan HP), `KartuWeb` (kartu kecil), atau `LayarPenuh` (B-roll singkat) dari `LayarWeb.tsx`. Cerita tetap dibawakan tokoh. Label/garis penunjuk boleh di atasnya; jangan menambahkan angka atau kiriman karangan ke dalam gambar.
