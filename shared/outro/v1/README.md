# Outro C (disetujui 7 Nov 2026)

Status: **disetujui pengguna** setelah melihat storyboard ("nice aku suka. boleh pakai itu"). Menggantikan Outro B (`shared/characters/rig/v2/OutroOptions.tsx`) untuk video baru; video lama tidak diubah.

Dasar: riset penutup 11 Shorts animasi dari 6 kanal (Kok Bisa?, Sprouts, The School of Life, Kurzgesagt, TED-Ed, Psych2Go). Mereka selesai 0–4 detik setelah kata terakhir. Less. sekarang 5–8,5 detik:
- Maaf v2: 5,0 dtk
- Kurang Yakin v7: 8,5 dtk
- Syarat Protes v5: 7,5 dtk

Selain lebih lama, Outro B memudar ke layar hijau tua yang memberi tanda "selesai" sebelum CTA sempat terbaca.

## Bentuk
- **Kartu di atas adegan terakhir.** Unsur dan warnanya sama dengan Outro B, tanpa memudar ke layar gelap.
- **Posisi bawaan: atas**, di tempat subtitle. Komposisi Less. mengosongkan area itu, jadi tokoh tetap terlihat. `place="bawah"` untuk adegan yang bagian atasnya ramai.
- **Waktu** (`OUTRO_C`): adegan ditahan 0,8 dtk setelah kata terakhir, lalu kartu 2,2 dtk. Ekor total 3,0 dtk. Tombol ditekan di detik ke-1,3 kartu.
- **CTA bergantian, bukan formula:**
  - `ikuti` (bawaan)
  - `tanya`: pertanyaan spesifik topik, sama dengan kalimat penutup narasi
  - `seri`: misalnya Open Mic ("Ikuti seri Open Mic." atau, untuk topik dari komentar, "Keresahanmu bisa jadi episode berikutnya.")
  - Jangan meminta share/tag/komen secara eksplisit.
- **Safe zone:** isi kartu di x 60–920, tengahnya x=490, y ≥250. Lolos audit `data-box`.
- **Efek suara:** `data-sfx` slide saat kartu masuk, click saat tombol ditekan.

## Storyboard
`contoh/storyboard/Storyboard.jpg` berisi 7 panel awal → akhir. Latarnya frame asli dari Maaf v2 dan Syarat Protes v5 (`contoh/latar-data.ts`).

Render ulang:

    node tools/render-film.cjs shared/outro/v1/contoh --entry=StoryboardOutroC.tsx --audit=1
    node tools/render-film.cjs shared/outro/v1/contoh --entry=StoryboardOutroC.tsx --storyboard --out=storyboard

## Cara memakai di Film.tsx

`narration_timeline.py` dan `standup_timeline.py` sudah menulis `outro_start`, `outro`, dan `total` sesuai Outro C di `src/timeline.json` (sama dengan `outroCTimes`).

    import { OutroC, outroCTimes } from '../../../shared/outro/v1/OutroC';
    const T = outroCTimes(lastWordEndFrame);   // frame kata terakhir selesai (dari timeline)
    export const OUTRO = T.OUTRO, TOTAL = T.TOTAL;
    // di Frame: gambar adegan terakhir seperti biasa (shot terakhir berlanjut sampai TOTAL), lalu
    // {f >= T.start && <OutroC f={f - T.start} cta={{ kind: 'ikuti' }} />}

- `OUTRO = start + 12`, karena renderer hanya menampilkan watermark bila f < OUTRO − 12. Watermark hilang tepat saat kartu muncul.
- Jangan pakai `rect` fade hijau lama (`OUTRO - 12 … OUTRO`).
- Subtitle kalimat terakhir selesai sebelum `start`. Area atas kosong saat kartu muncul.
- Efek suara: `--sfx` menangkap `slide` (kartu masuk) dan `click` (tombol ditekan).

## CTA yang menyebut web (DISETUJUI 10 Nov 2026) → pakai v2
Pengguna: "itu outro nya oke menurut ku.. finalin". Jenis `titip`, `dari`, dan `SERI_WEB` ada di **`shared/outro/v2/OutroC.tsx`**, bukan di sini: v1 beku karena dipakai video terkirim. Proyek baru mengimpor v2 (lihat `shared/outro/v2/README.md`).

Lembar contoh yang disetujui: `contoh/storyboard-web/Storyboard.jpg` (sumber `contoh/StoryboardOutroWeb.tsx`, memakai jenis `seri` + teks supaya bisa dirender dengan v1; hasilnya sama persis dengan v2).
