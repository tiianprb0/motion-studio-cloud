# Rig tokoh v2 (Naya, Yan, extras) — 7 Nov 2026
v2 = v1 + perbaikan view="back": tekstur rambut belakang (Yan: pusaran, garis tengkuk, telinga; Naya: bob berhelai), punggung polo (kerah belakang, jahitan bahu, tanpa kantong/kancing), punggung rajut Naya (leher bulat, tanpa logo). Proyek lama tetap v1.
view="serong" (7 Nov 2026): kepala berputar ±40° ke arah dir (fitur wajah bergeser & menyempit). CATATAN: pengguna mengoreksi bahwa "serong" yang dimaksud adalah sudut KAMERA, bukan kepala. view="serong" tetap ada, tapi jangan dipakai sebagai pengganti tampak belakang; pakai kamera serong (shared/locations/_detail wallMap). Bubble (gelembung bicara gaya v7) tersedia di fx.tsx.

## Catatan asal (v1)
Snapshot beku dari rig video "Kurang Yakin" v7 (rig terbaru: elbowDown, cek anatomi data-anatomy-warn, POSES, badan baru, extras body="lama").
Proyek baru mengimpor dari sini, BUKAN dari folder proyek lain:
  import { Person, P, quick, ramp } from '<relatif>/shared/characters/rig/v1/Character';
  import { Mark, popIn } from '<relatif>/shared/characters/rig/v1/fx';
  import { OutroB } from '<relatif>/shared/characters/rig/v1/OutroOptions';
  import { SVG_FONTS } from '<relatif>/shared/characters/rig/v1/font-data';
Modul (react, esbuild): require(tools/runtime.cjs).nodeModules(). Font TTF: shared/assets/fonts. Logo: shared/assets/logo/less-certain-logo-v1.png.
Perbaikan rig berikutnya dibuat sebagai rig/v2 (salin v1, ubah, catat di sini); proyek yang sudah disetujui tetap menunjuk v1.
File: Character, ExtraFace, ReferenceFace, Elements, SocialIcons, OutroOptions (dari v7, tidak diubah), fx.tsx (popIn + Mark dari Proto.tsx), brand-data/font-data (re-ekspor shared/assets v1).

## Pustaka pose (7 Nov 2026)
Sumber koordinat tangan satu-satunya: poses.ts (`POSE.her/him.<nama>`). Lembar visual: pose-sheet.png.
Disetujui pengguna: santai, melambai, pinggang, bertaut, berpikir (POSES), dan pegangDepanDada, angkatGalon, sodorKiri.
HP di tangan dengan kamera dari depan memakai PhoneInHand side="belakang" (bawaan): layar tidak terlihat.
