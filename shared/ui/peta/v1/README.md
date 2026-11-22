# peta v1: Peta Indonesia disederhanakan (diagram)

Dibuat 18 Nov 2026 untuk "Bukan Kesalahan Kami?" (Kebakaran Hutan Papua v1). Garis pantai sengaja kasar: ini diagram gaya Kok Bisa?, bukan peta akurat. Negara tetangga pucat, batas darat Papua–PNG putus-putus.

- `PetaIndonesia({ f, pandang, asap, sorot, pin, label, redup, id })`: koordinat bujur/lintang; `pandang = { lon, lat, k }` (pusat layar, piksel per derajat).
- `pandangAntara(a, b, t)`: zoom logaritmik untuk kamera menukik. `proyPeta(pandang, lon, lat)`: titik layar untuk callout.
- `sorot`: lingkaran + label pil (teks kosong = hanya titik). `asap`: pita asap dari sumber ke tujuan. `pin`: pin lokasi jatuh.
- Contoh: `contoh/ContohPeta.tsx` → `contoh/ContohPeta.png`.

Catatan gerak (render-film `--motion`): alat mengukur beda gambar tiap 0,5 dtk di ukuran 36×64 dan menganggap beda < 8 sebagai diam. Peta yang hanya zoom pelan hampir selalu terbaca diam. Yang terbukti cukup: kamera menyusuri wilayah yang sedang disebut (k ≥ 40, pindah beberapa derajat per detik), warna daratan cukup kontras dengan laut (warna v1 sekarang), dan kejadian yang muncul mengikuti kata.
