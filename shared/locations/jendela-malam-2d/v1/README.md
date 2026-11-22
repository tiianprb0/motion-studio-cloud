# Deret Jendela Malam 2D (v1, 18 Nov 2026)
Kos tiga lantai (12 kamar, 4 jendela × 3 lantai) diapit rumah tetangga kiri dan kanan (masing-masing 3 jendela), dilihat dari seberang jalan, malam, boleh hujan. Panggung flat 2D, kamera Kam2D `{ zoom, cx, cy }` (`layarJM`).

Dibuat untuk "Keresahan yang Kamu Hapus Lagi" v3. Pengguna 17 Nov 2026 atas v2: "masih gak bagusss" → "Alur & adegannya". Gunanya motif setup → payoff "cuma aku / ternyata orang lain juga":
- Jam satu: hanya satu jendela menyala.
- Jendela-jendela lain menyala dan memperlihatkan orang yang juga terjaga.
- Tirai menutup ("makin merasa sendirian").
- Tali lampu menyambung jendela dari satu jendela ke semua.

- Indeks jendela: `JENDELA_JM` 0–11 kos (baris atas → bawah, kiri → kanan), 12–14 rumah kiri, 15–17 rumah kanan. `NAYA_JM = 5` (lantai dua, kolom kedua).
- `jendela(i)` → `{ nyala, cahaya: 'hangat'|'hp', tirai, lampion, warnaLampion, isi }`. `isi` = tokoh di dalam (dipotong kaca); letakkan dengan `tokohJM(i, dx, s=0,95)` (setengah badan atas terlihat), kepala dengan `kepalaJM`.
- Lain-lain: `tali` 0..1 (menyebar dari jendela Naya), `hujan`, `gelap`, `kilat`, `kucing: { i, pose, dir, dx }` di ambang (`ambangJM`), `kabur`.
- Jendela gelap tidak menggambar isinya. Tokoh yang lampunya baru menyala diredupkan dengan cahaya, tidak dibuat tembus pandang.
- Kos Naya = kos putri (pengguna 18 Nov 2026): jendela kos 0–11 hanya perempuan (atau Yan); pria hanya di rumah tetangga. Pakai `papan="KOS PUTRI"` untuk kos Naya.
- Contoh: `contoh/ContohJendela.png` (`node tools/render-thumb.cjs shared/locations/jendela-malam-2d/v1/contoh/ContohJendela.tsx shared/locations/jendela-malam-2d/v1/contoh/ContohJendela --only`).
