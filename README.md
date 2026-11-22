# Motion Studio Cloud

Pipeline produksi video 2D Less. untuk agent cloud. Mulai dari [AGENTS.md](AGENTS.md). Proyek contoh ada di `projects/relokasi-badak-jawa/v1`, lengkap dengan naskah, storyboard, sumber animasi, audio, dan subtitle.

## Setup Linux

Siapkan Node.js 22, npm, Python 3, dan FFmpeg dengan `ffprobe` di PATH. Pasang dependensi dan Chromium.

```bash
npm --prefix tools install
npm --prefix tools exec -- playwright install --with-deps chromium
```

Setel variabel berikut di lingkungan tempat agent menjalankan perintah. Jika sesi setup dan agent terpisah, simpan nilainya di konfigurasi environment.

```bash
export MOTION_STUDIO_NODE="$(command -v node)"
export MOTION_STUDIO_FFMPEG="$(command -v ffmpeg)"
export MOTION_STUDIO_CHROME="$(node -p "require('./tools/node_modules/playwright').chromium.executablePath()")"
```

## Pemeriksaan dan render

Jalankan dari root repo.

```bash
node tools/check-shared.cjs --locks
node tools/test-audit.cjs
node tools/render-film.cjs projects/relokasi-badak-jawa/v1 --audit=1
mkdir -p output
node tools/render-film.cjs projects/relokasi-badak-jawa/v1 --from=0 --to=30 --out="$PWD/output/proof.mp4"
ffmpeg -v error -i output/proof.mp4 -f null -
```

Perintah proof menghasilkan klip pendek tanpa audio. Setelah persetujuan storyboard, lihat `tools/README.md` untuk render lengkap dengan audio dan thumbnail. Simpan hasil sebagai artefak cloud. Untuk narasi baru, masukkan `ELEVENLABS_API_KEY` melalui konfigurasi rahasia environment. Proyek contoh dapat memakai audio yang tersedia tanpa API key.
