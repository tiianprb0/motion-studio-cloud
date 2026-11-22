# diagram v1: grid ikon dan siklus tahun

Dibuat 18 Nov 2026 untuk "Bukan Kesalahan Kami?" (20 korporasi tersangka vs indikasi api di 372 perusahaan; pola kebakaran 2015–2026).

- `GridIkon({ x, y, w, n, kolom, tampil, sorot, api, warna, sorotWarna, kilat })`: n ikon perusahaan; `tampil` = berapa yang sudah muncul, `sorot` = berapa ikon pertama ditandai merah, `kilat` = ikon terbaru berpendar jingga (pertambahan terlihat). Untuk latar gelap pakai `warna="#EFE6D6"`. Ada `data-box`, jadi jaga x..x+w di dalam 110–920 (jangan diperbesar dengan transform skala; audit akan menolaknya).
- `SiklusTahun({ x, y, w, tahun, aktif, masuk, f })`: keping tahun + panah berulang; `masuk` 0..1 = keping aktif terakhir meluncur dari kanan.

Catatan gerak: diagram di atas latar kertas polos terbaca diam oleh `render-film --motion`. Di video asalnya, diagram diletakkan di atas adegan lahan (`MeraukeAtas2D`) yang digeser lebar lalu diredupkan (lapisan #26211E, opasitas 0,5), dan ikon/keping muncul mengikuti kata.
