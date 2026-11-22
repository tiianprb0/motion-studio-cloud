# Outro C v3 (12 Nov 2026)

**v3 = v2 dengan tepi kiri kartu sejajar subtitle.** Kartu x 110–920 (tengah x 515); v2 memakai x 60–920 (tengah 490). Isi, waktu (`OUTRO_C`, `outroCTimes`), jenis CTA (`ikuti`, `tanya`, `seri`, `titip`, `dari`, `SERI_WEB`), dan bentuk lainnya sama persis dengan `shared/outro/v2` (disetujui pengguna 10 Nov 2026).

Alasan: pengguna 12 Nov 2026, "overlay yang ada harus sama seperti jarak cation dan logo, jangan lebih dalam, maksudnya jangan lebih ke tepian". Tepi kiri subtitle ada di x 110, tepi kanan logo ±985. Kartu v2 di x 60 lebih ke tepi daripada subtitle. Tepi kanan 920 tetap, karena sudah di dalam tepi logo dan menjauhi tombol platform. Aturan lengkap: `references/arahan-pengguna.md`, butir "Overlay tidak lebih ke tepi daripada subtitle dan logo".

v2 beku karena dipakai video terkirim (`references/shared-library.md` bagian "Kunci versi"). Video lama tetap memakai v1/v2; jangan dipindah diam-diam.

## Cara memakai di Film.tsx (proyek baru)

    import { OutroC, outroCTimes, SERI_WEB } from '../../../shared/outro/v3/OutroC';
    const T = outroCTimes(lastWordEndFrame);
    export const OUTRO = T.OUTRO, TOTAL = T.TOTAL;
    // {f >= T.start && <OutroC f={f - T.start} cta={{ kind: 'titip' }} />}

Pertama dipakai: Kritik Bukan Utang Jasa v5 (disetujui 12 Nov 2026). Audit (`node tools/render-film.cjs <proj> --audit`) memeriksa kartu di dalam safe zone kiri 110.
