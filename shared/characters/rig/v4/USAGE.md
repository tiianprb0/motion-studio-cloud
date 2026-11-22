# Rig tokoh v4 (20 Nov 2026)
v4 = v3 + satu perbaikan: id pola rajut Naya (`knit-<who>-<warna baju>`) kini unik per warna baju. Di v3 semua tokoh perempuan memakai id `knit-her`, jadi kalau figuran perempuan berbaju lain digambar lebih dulu dalam satu bingkai, garis rajut Naya ikut warna baju figuran itu (storyboard Cuekin Buzzer v1: garis rajut Naya jadi biru; pengguna 20 Nov 2026: "garis yang ada di baju naya malah jadi biru air"). Gambar lain identik dengan v3. Video baru memakai v4; v3 tetap untuk proyek lama.

# Rig tokoh v3 (9 Nov 2026)
v3 = v2 + jalur `extra` untuk warga/figuran baru (shared/characters/extras/v2). **Naya dan Yan identik dengan v2**: jalur mereka (prop `extra` kosong) tidak berubah. Diff v2→v3 hanya:
- `ExtraLook.tsx` (baru): `ExtraKepala` (wajah, 17 gaya rambut/penutup kepala, kacamata, anting, kumis, jenggot) dan `ExtraBaju` (kaos, kemeja, jaket, hoodie, garis, kardigan, batik; pinggang tertutup; rok panjang opsional).
- `Person` menerima `extra?: ExtraLook`. Kalau diisi: wajah memakai `ExtraKepala`, detail baju memakai `ExtraBaju` (bukan kerah/kantong sage milik Yan), tanpa logo kaos less.certain.
- Warna kulit dan lengan panjang lewat React context (`KulitCtx`, `LenganCtx`); nilai bawaannya sama dengan v2 (`P.skin`, lengan pendek).
- Garis rok extras mengikuti warna rok (`shade(pants)`); Naya tetap `#8BA79A`/`#84A194`.
Proyek lama tetap menunjuk v2 (terkunci). Pakai v3 hanya untuk adegan yang memuat warga v2. Pose tangan tetap dari `poses.ts` (isi sama dengan v2).

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
