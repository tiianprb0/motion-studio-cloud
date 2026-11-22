# Efek suara lokal v1

Lima efek ringan yang disintesis lokal dengan ffmpeg untuk v7 "Kurang Yakin" (commit 84d1b85, 6 Nov 2026). Disalin ke sini 7 Nov 2026 supaya proyek lain tidak mengambil dari folder proyek v7. Skrip pembuat aslinya tidak tersimpan; kalau perlu efek baru, buat v2 dan simpan skripnya di tools/.

| Berkas | Dipakai untuk | Gain awal (v7) |
|---|---|---|
| pop.wav | gelembung, tanda ?/!, tombol | −14 dB |
| pin.wav | catatan ditempel | −15 dB |
| click.wav | tombol "+ Ikuti" | −11 dB |
| tick.wav | baris tagline / teks outro | −18 s.d. −22 dB |
| swish.wav | transisi lembut | −17 s.d. −22 dB |

Aturan (references/audio.md): bukan default setiap aksi, volume jauh di bawah narasi, tanpa ambient, tanpa ElevenLabs.
Campur ke video: `python3 tools/mix_sfx.py <folder-proyek> --video 04-Hasil/<Judul>.mp4` dengan daftar efek di `<proyek>/src/sfx.json`.
