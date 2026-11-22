# shared/film/v1 — kerangka film dan gaya Kok Bisa?

Semua komponen di sini dipakai dari `src/Film.tsx` / `src/Storyboard.tsx` proyek. Palet dan fungsi waktu dari `shared/core/v1`.

| File | Isi | Status |
|---|---|---|
| `Captions.tsx` | Subtitle narasi gaya v7 (Lato Bold 44 px, latar per kata, aksen wine) | dipakai (identik dengan maaf v2 & Syarat Protes) |
| `CaptionsDiam.tsx` | Pratinjau subtitle diam untuk `src/Storyboard.tsx`: gaya sama dengan `Captions`, tanpa animasi dan tanpa `cues.json`; kalimat dipecah seperti `tools/captions.cjs` (maks 7 kata, 2 baris). `<CaptionsDiam teks={kalimat} bagian={t ? 'akhir' : 0} />` | wajib di storyboard sejak 9 Nov 2026 (aturan pengguna) |
| `timeline.ts` | `makeTimeline` (fr, LS, LE, W, LA), `shotIndex`, `MIN_SHOT` | dipakai |
| `Card.tsx` | Kartu gag ber-data-box, `CardText`, `Tick` | dari Syarat Protes v5 (disetujui) |
| `FilmFrame.tsx` | Bingkai 1080×1920 + fade ke outro | baru |
| `Bubble.tsx` | Gelembung bicara gaya Kok Bisa?: oval krem tanpa garis tepi, ekor melengkung, Lato Black 60 px, maks 4 kata, bayangan sangat lembut | disetujui pengguna 7 Nov 2026 (gaya); video baru pakai `shared/film/v2/Bubble.tsx` (+ `letakBubble`, `letakTanda`: menempel di kepala, ekor ≤90 px), 12 Nov 2026 |
| `Langkah.ts` | `langkah()`: posisi + ayunan kaki tokoh berjalan; kecepatan trapesium, fase langkah dari jarak tempuh, kaki lurus saat diam | 12 Nov 2026 (pengguna: kaki jalan di tempat / masih bergerak saat diam) |
| `Berbalik.ts` | `berbalik()`: tokoh rig v2 balik badan dalam ±10 frame (badan menyempit, tampak diganti di titik tengah); `sxDi()` = transform penyempit di x kaki. Pantulan cermin: tukar `dari`/`ke` | 12 Nov 2026 (pengguna: Naya langsung hadap belakang di detik 17) |
| `Depth.tsx` | `FarLayer`/`Blurred` (blur latar ikut zoom), `Foreground`, `RimLight`, `Bokeh`, `FrostedGlass`, `FocusPull`, `Vignette`, `Grain`, `Smear` | disetujui sebagai arah 7 Nov 2026; filter dari v7 |
| `Drama.tsx` | `Dramatic` (cahaya hangat + bayangan volume + cahaya tepi, dipotong ke siluet), `DramaBackdrop`, `personBox` | **kandidat: tunggu persetujuan lembar contoh** |
| `Cahaya2D.tsx` | Cahaya 2D dari satu arah matahari (`CAHAYA_2D.siang/sore`): `Terang`/`nadaMuka` (terang-gelap per bidang), `GradasiDinding`, `BayanganJatuh` (siluet tokoh/benda di lantai, naik ke dinding bila sampai), `BayanganTempel`, `geserDinding`, `TokohBercahaya` (filter cahaya badan Dunia3D), `KontakKaki`, `AmbientKaki`, `Pantulan` (genangan), `NadaAkhir`. Contoh: `contoh/banding-3d-2d/` (klip 5 dtk 3D vs 2D) | **disetujui pengguna 11 Nov 2026** ("Setujui cahaya 2D"); cahaya bawaan panggung flat |
| `Screen.tsx` | `Callout` (label + garis penunjuk), `Onomatope`, `SplitPanels`, `Inset`, `BarCompare` | disetujui sebagai arah 7 Nov 2026 |

Material latar (kaca berpantulan, ubin, air, uap, tirai, kilap) ada di `shared/locations/_detail/v2` (`GlassPane`, `TileWall`, `WaterSurface`, `Steam`, `CurtainFolds`, `Sheen`).

Lembar contoh: `contoh/Lembar-Contoh-Kok-Bisa.jpg` (bubble lama vs baru, kedalaman & material, biasa vs dramatis). Sumbernya `contoh/*.tsx`; render ulang: `node tools/render-thumb.cjs shared/film/v1/contoh/ContohX.tsx <out> --only`.

Efek suara: komponen yang muncul menulis `data-sfx` (`pop`, `slide`). `node tools/render-film.cjs <proj> --sfx` → `src/sfx.json`, lalu `python3 tools/mix_sfx.py <proj> --video 04-Hasil/<Judul>.mp4`. Tanpa musik latar.
