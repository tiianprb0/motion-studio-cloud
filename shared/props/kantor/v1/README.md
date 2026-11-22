# props/kantor v1 — properti kantor

Dibuat 13 Nov 2026 oleh agen Buat konten untuk "Masih Ingat Hari Pertama Kerja?" v1. Status: baru, belum dipakai video terkirim.

| Komponen | Pakai |
|---|---|
| `TandaPengenal({ x, y, s, dir, view, nama, jabatan, tali, pudar, miring })` | Tali + kartu karyawan di dada tokoh rig v2/v3. Gambar SESUDAH `<Person>` dengan `x, y, s, dir` yang sama (koordinat rig: kerah ±-236, kartu ±-187..-147). Tokoh duduk (`seatDrop={20}`): pakai `y + 20·s`. `pudar` 0..1 = kartu lusuh, `miring` = derajat terpelintir. `view="back"` hanya menggambar tali di tengkuk. |
| `Kardus({ s })` | Kardus barang karyawan baru (pot kecil + buku). Pusat bawah di (0,0); bisa dipegang lewat `holdRight` (pose `pegangDepanDada`) atau diletakkan di meja. |
| `Stiker({ teks, warna, tinta, rot, s, opacity })` | Kertas tempel bertulisan tangan (`\n` = baris baru), pusat di (0,0), 76 px pada s=1. Tulisan di benda fisik, bukan bubble/subtitle. |
| `TumpukanMap({ n, s, seed })` | Tumpukan map/berkas berwarna, n lapis, pusat bawah di (0,0). |

Dipakai di `shared/locations/kantor-2d/v1`.
