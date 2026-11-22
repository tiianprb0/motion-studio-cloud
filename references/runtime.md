# Runtime workspace

Semua alat dijalankan dari root workspace Motion Studio; lihat `tools/README.md` untuk alur dan perintah. Proyek format baru (`src/Film.tsx`) tidak punya package.json atau node_modules sendiri.

## Toolchain
- Node: `.toolchain/node/bin/node`. FFmpeg: `.toolchain/bin/ffmpeg`. Playwright: `.toolchain/node/node_modules/playwright`. Chrome: aplikasi Google Chrome terpasang.
- react, react-dom dan esbuild: `tools/node_modules` (versi dipin di `tools/package.json`; pulihkan dengan `cd tools && npm install`).
- Lokasi dicari oleh `tools/runtime.cjs` dan `tools/runtime.py` (variabel lingkungan `MOTION_STUDIO_*` > `.toolchain`/`tools` > Homebrew). Tidak ada alat yang boleh bergantung pada `arsip/`; arsip harus bisa dipindah atau dibersihkan tanpa mematikan produksi.
- `.toolchain/` dan `tools/node_modules` tidak masuk git. Setelah memulihkan dari bundle cadangan, pasang ulang keduanya.

## Render
Jalur yang terbukti: komponen React dirender ke SVG (renderToStaticMarkup, font lokal), digambar ke canvas di Chrome headless, dibaca sebagai PNG, lalu di-pipe ke ffmpeg secara serial (CPU, concurrency 1). Pertahankan jalur ini; jangan menambah concurrency atau mengganti browser/render path tanpa bukti moving-frame yang relevan. Jangan menjalankan dua render bersamaan pada output yang sama. Tidak ada rendering atau instalasi dependensi hanya karena konfigurasi diperbarui.

Periksa ekspor aktual: decode penuh, audio sync, subtitle dan sambungan berisiko. `render-film.cjs` gagal dengan pesan jelas bila ffmpeg gagal.

## Proyek format lama
Proyek sebelum 7 Nov 2026 (kritik, kepedulian, tangan-kosong, villain, kurang-yakin) punya `scripts/` dan renderer sendiri; jalankan dari folder proyeknya. Alat lama yang memakai format itu ada di `tools/lama/`. Proyek lama tidak dimigrasi otomatis. Catatan 3 Nov 2026 tentang jalur SVG/canvas: ghost pada pan berasal dari montage tanpa pemisah, bukan dari capture; `DISABLE_FROM_SURFACE=1` menghasilkan frame putih dan tidak dipakai.
