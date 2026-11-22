# Shared Motion Studio

Semua komponen, aset dan pustaka yang bisa dipakai lebih dari satu konten. Tabel tempat: `../MULAI-DI-SINI.md` bagian "Di mana menaruh apa". Daftar lengkap dan status: `catalog.json` (tampilan: `catalog.html`, dibuat ulang oleh `node tools/check-shared.cjs --write`). Aturan: `../references/shared-library.md`.

- Setiap aset berversi (`<id>/vN`). File yang sudah dipakai video terkirim terkunci oleh `<Judul>.lock.json` di proyeknya; perubahan dibuat di versi baru.
- Aset baru mengimpor palet dan fungsi waktu dari `core/v1`, bukan dari `characters/rig/vN/Character.tsx`.
- Snapshot lokasi lama (bundaran-hi, ruang-kerja-yan, lingkungan-kritik, profil-less-lokasi, kamar-villain) menyalin dependensinya sendiri supaya beku; tokohnya generasi lama. Untuk produksi baru, tokoh selalu dari `characters/rig/`.
