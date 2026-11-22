# props/fotokopi v1 — mesin fotokopi kantor

Dibuat 13 Nov 2026 untuk "Masih Ingat Hari Pertama Kerja?" v1 rev6. Pengguna, setelah rev5 disetujui: "alih alih tian diam, mending tian kayak sambil kerja, kerja sambil frustasi, lagi fotocopy tapi lesuh gitu gitu." Status: dipakai rev6, disetujui pengguna 14 Nov 2026; `Fotokopi.tsx` terkunci oleh `projects/hari-pertama-kerja/v1/04-Hasil/Hari-Pertama-Kerja-v1-rev6.lock.json` (perubahan → buat v2).

Gambar flat 2D tampak depan, gaya sama dengan `shared/locations/kantor-2d/v1`. Satuan rig: 1 m = 200 unit, pusat bawah di (0,0).

| Komponen | Pakai |
|---|---|
| `Fotokopi({ pindai, salinan, keluar, status, kedip, asli, malam })` | Mesin 0,56 × 0,84 m: laci kertas, badan pencetak, baki keluaran di kiri, panel + lampu status di kanan depan, tutup kaca pindai. `pindai` 0..1 = lampu hijau bergerak di celah tutup (null = mati). `salinan` = jumlah lembar di baki. `keluar` 0..1 = selembar meluncur keluar. `status`: `'siap'` hijau, `'kerja'` kuning, `'macet'` merah berkedip (pakai `kedip={f}`) + kertas kusut terjepit di celah tutup dekat panel. `asli` = tumpukan berkas asli di atas tutup. `malam` 0..1 = warna badan menggelap. |
| `TumpukanKertas({ n, miring })` | Rim kertas fotokopi, lebar 60 unit, pusat bawah di (0,0). Dipegang dengan pose `pegangDepanDada` lewat `holdRight` (`<g transform="translate(0 6)"><TumpukanKertas n={6} /></g>`) atau diletakkan di meja (isi panggung dengan `urut` besar supaya digambar sesudah meja). |

**Di kantor-2d/v1:** jadikan `isi` supaya ikut urutan kedalaman dan cahaya:

```tsx
const FK = titikKantor(-2.1, 0, 0.3); // di bawah papan tulis, kanan partisi meja rekan, kiri pot
{ x: FK.x, y: FK.y, s: FK.s, tinggi: 0.84, lebar: 0.6, jarakDinding: 0.3,
  gambar: (q) => <g transform={`translate(${q.x} ${q.y}) scale(${q.s})`}><Fotokopi malam={1} status="kerja" pindai={u} /></g> }
```

Tokoh berdiri di sampingnya: `titikKantor(-1.45, 0, 0.62)`, `dir={-1}`, pose `sodorKiri` = tangan kiri di panel (menekan tombol). X fotokopi jangan kurang dari −2,33 (lebih kiri tertutup partisi meja rekan, d 1,55).

Pose yang lolos audit di sekitar mesin: `sodorKiri` (menekan tombol), `pinggang` (kesal saat macet), `pegangDepanDada` + `TumpukanKertas` (membawa berkas/salinan). Ganti pegangDepanDada ↔ sodorKiri secara langsung (satu frame, saat berkas diletakkan/diambil). Interpolasinya melewati zona `hand-over-torso`.

Contoh: `contoh/ContohFotokopi.tsx` → `contoh/ContohFotokopi.png`
(`node tools/render-thumb.cjs shared/props/fotokopi/v1/contoh/ContohFotokopi.tsx shared/props/fotokopi/v1/contoh/ContohFotokopi --only`).
