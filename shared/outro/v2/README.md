# Outro C v2 (10 Nov 2026)

**v2 = v1 + jenis CTA yang menyebut web Less.** Bentuk kartu, waktu (`OUTRO_C`, `outroCTimes`), dan jenis lama (`ikuti`, `tanya`, `seri`) sama persis dengan `shared/outro/v1`. Dibuat sebagai versi baru karena v1 beku: v1 dipakai video terkirim (`references/shared-library.md` bagian "Kunci versi").

Disetujui pengguna 10 Nov 2026: "itu outro nya oke menurut ku.. finalin". Lembar contoh yang disetujui: `shared/outro/v1/contoh/storyboard-web/Storyboard.jpg` (hasil v2 sama persis). Domain final: **less.benaya.id** (konstanta `WEB`).

## Jenis CTA baru
- `{ kind: 'titip' }`: "Lagi resah soal sesuatu? / Titip di less.benaya.id". Ikut bergantian dengan ikuti / tanya / seri.
- `{ kind: 'dari', nama }`: untuk video yang lahir dari keresahan web, "Dari keresahan <nama>. / Titip punyamu di less.benaya.id".
  - Isi `nama` hanya kalau penanya mengizinkan (centang "boleh disebut" di web). Tanpa nama: "Dari keresahan seorang penonton."
  - Nama lebih dari 18 huruf dipendekkan jadi kata pertamanya, supaya baris tetap di dalam kartu.
- `SERI_WEB` (jenis `seri`, untuk Open Mic): "Keresahanmu bisa jadi / episode berikutnya: less.benaya.id".

## Cara memakai di Film.tsx (proyek baru)

    import { OutroC, outroCTimes, SERI_WEB } from '../../../shared/outro/v2/OutroC';
    const T = outroCTimes(lastWordEndFrame);
    export const OUTRO = T.OUTRO, TOTAL = T.TOTAL;
    // {f >= T.start && <OutroC f={f - T.start} cta={{ kind: 'dari', nama: 'Dita' }} />}

Proyek lama yang mengimpor v1 tetap memakai v1; jangan dipindah diam-diam.

Audit contoh: `node tools/render-film.cjs shared/outro/v2/contoh --entry=StoryboardOutroWeb.tsx --audit=1`
