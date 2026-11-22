# Rig tokoh v1 (Naya, Yan, extras) — 7 Nov 2026
Snapshot beku dari rig video "Kurang Yakin" v7 (rig terbaru: elbowDown, cek anatomi data-anatomy-warn, POSES, badan baru, extras body="lama").
Proyek baru mengimpor dari sini, BUKAN dari folder proyek lain:
  import { Person, P, quick, ramp } from '<relatif>/shared/characters/rig/v1/Character';
  import { Mark, popIn } from '<relatif>/shared/characters/rig/v1/fx';
  import { OutroB } from '<relatif>/shared/characters/rig/v1/OutroOptions';
  import { SVG_FONTS } from '<relatif>/shared/characters/rig/v1/font-data';
Modul (react, esbuild): require(tools/runtime.cjs).nodeModules(). Font TTF: shared/assets/fonts. Logo: shared/assets/logo/less-certain-logo-v1.png.
Perbaikan rig berikutnya dibuat sebagai rig/v2 (salin v1, ubah, catat di sini); proyek yang sudah disetujui tetap menunjuk v1.
File: Character, ExtraFace, ReferenceFace, Elements, SocialIcons, OutroOptions (dari v7, tidak diubah), fx.tsx (popIn + Mark dari Proto.tsx), brand-data/font-data (re-ekspor shared/assets v1).
