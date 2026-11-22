# Callout v2 — label bergaris penunjuk bersiku L (13 Nov 2026)

`shared/film/v2/Callout.tsx`. Dibuat agen Buat konten atas dua keluhan pengguna pada video Hari Pertama Kerja v1: "garis untuk overlay tolong dibenerin", lalu "garisnya jangan tarik lurus, tapi bersiku L".

- **Props sama dengan Callout v1** (`shared/film/v1/Screen.tsx`, terkunci) plus `geser` (opsional, bawaan 60 px). Ganti impor saja.
- **Garis bersiku L** (`garisSiku`), satu belokan 90°:
  - sasaran di samping label (di luar rentang mendatarnya): keluar dari tengah sisi kiri/kanan yang menghadap sasaran → mendatar sampai x sasaran → tegak ke sasaran;
  - sasaran di atas/bawah label (di dalam rentang mendatarnya): keluar dari tepi atas/bawah, `geser` px dari x sasaran ke arah tengah label → tegak sampai y sasaran → mendatar ke sasaran.
  - v1 menarik garis miring dari tengah sisi kiri/kanan; garis ke sasaran di atas/bawah keluar dari sudut kotak dan bisa memotong label lain.
- **Terbaca di latar terang dan gelap:** garis krem 5 px dengan bayang ink tipis, sudut membulat, titik ujung bercincin ink. Garis digambar bertahap mengikuti panjangnya selama 8 frame.
- **Label yang tetap tampil melewati potongan shot:** teruskan `a` asli (frame pertama label muncul), bukan awal shot baru. Kalau `a` diisi awal shot, animasi muncul dan pop-nya terulang (pengguna: "overlay kurang bersyukurnya kok kayak dua kali popup?").
- **Tata letak tetap dicek di adegan:** garis antar-label tidak bersilangan, tidak memotong label lain atau wajah; label diletakkan di sisi benda yang ditunjuk.
- Audit tidak berubah: `data-box` (label + sasaran, termasuk siku) di dalam safe zone x ≥ 110, `data-sfx="pop"`.
