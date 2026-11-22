# kafe-2d v1 — kafe kecil tempat nongkrong (panggung flat 2D)

Dibuat 13 Nov 2026 oleh agen Buat konten untuk "Masih Ingat Hari Pertama Kerja?" v1 (pengguna: "ganti tempat baru misal lagi nongkrong di cafee bareng teman kerja gitu"). Status: baru, belum dipakai video terkirim.

**Isi:** dinding belakang 7 m: meja bar + mesin espreso + rak cangkir di kiri, papan menu kapur "KOPI KITA", lampu tali, jendela besar ke jalan (deret ruko, motor terparkir), pot besar di kanan; lambri kayu di bagian bawah dinding. Depan: meja panjang kayu menghadap kamera (panel depan sampai lantai, sesuai aturan "tokoh duduk di belakang penutup") dengan tiga kursi berandaran, tiga lampu gantung di atas meja (h 2,4 m, di atas zona subtitle pada shot sedang). Lantai teraso. Cahaya 2D dari `shared/film/v1/Cahaya2D.tsx`.

**Skala:** sama dengan `kantor-2d/v1` dan `kamar-kerja-2d/v1` (227 px/m di dinding, kaki dinding y 1180, cakrawala y 885, kamera 4 m). `titikKafe(X, h, d)`; tempat duduk `KURSI_KAFE[0..2]` (X −0,8 / 0 / 0,8, d 0,5) untuk Person `pose="sit"` `seatDrop={20}`.

| Prop | Arti |
|---|---|
| `t` | 0 siang → 0,5 sore (matahari rendah dari jendela kanan, berkas sinar di lantai) → 1 malam |
| `lampu` | lampu gantung + lampu tali (bawaan menyala mulai sore) |
| `meja` | `{ gelas (0..4 es kopi), pisang, hp }` |
| `isi` | tokoh/benda (urut kedalaman); `bercahaya` = digambar sesudah cahaya malam |
| `kabur` | lensa: ruang kabur kecuali isi `fokus` |

Ekspor tambahan: `EsKopi` (es kopi susu dalam gelas plastik, bisa dipegang lewat `holdRight` dengan pose `pegangDepanDada`).

Contoh: `contoh/ContohKafe2D.tsx` → `contoh/ContohKafe2D.png` (`node tools/render-thumb.cjs shared/locations/kafe-2d/v1/contoh/ContohKafe2D.tsx shared/locations/kafe-2d/v1/contoh/ContohKafe2D --only`).
