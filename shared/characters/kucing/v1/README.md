# Kucing oranye callback (v1, 7 Nov 2026)

**Status: disetujui pengguna 7 Nov 2026** ("Setuju") setelah melihat lembar contoh (`contoh/ContohKucing.png`) dan bukti gerak (`contoh/BuktiGerak.mp4`). Siap dipakai di video. Mengubah identitas atau gambarnya = versi baru (v2) + persetujuan baru.

Asalnya dari butir 12 adaptasi buku gaya Republik Netizenia ("1-13 jalankan"), lalu dikoreksi pengguna 7 Nov 2026: "kucingnya kucing orange, dan bisa buat detail? dan bergerak". Kucing ini menggantikan usulan kucing hitam. Ia muncul kecil di latar hampir setiap video, tidak pernah dijelaskan, sebagai hadiah untuk penonton lama.

## Identitas (jangan diubah tanpa persetujuan)
- Oranye belang dengan gaya flat pastel Less. dan gradasi volume.
- Moncong dan dada krem, mata hijau sage dengan pupil vertikal dan kilau.
- Belang "M" di dahi, telinga dalam merah muda, kumis tipis.
- **Kalung wine dengan liontin emas** (warna brand). Ini ciri pembedanya.

## Pose dan gerak (dari frame `f`, deterministik)
| Pose | Gerak bawaan |
|---|---|
| `duduk` (3/4 menghadap kamera) | napas, kedip acak (kadang dua kali), telinga berkedut, kepala sedikit miring, ekor mengayun dan sesekali ujungnya naik; `gaze` menggeser pupil |
| `tidur` (meringkuk) | napas lebih dalam, telinga berkedut, ujung ekor berkedut |
| `jalan` (profil) | siklus kaki ±0,8 dtk, badan naik-turun, kepala mengangguk, ekor tegak mengayun; posisi `x` digerakkan pemanggil (mis. `ramp`) |

## Pakai
    import { Kucing } from '.../shared/characters/kucing/v1/Kucing';
    <Kucing x={760} y={1640} s={1.6} f={f} pose="duduk" gaze={-0.5} />
    <Kucing x={ramp(f, a, b, 1000, 80)} y={1560} s={1.2} f={f} pose="jalan" dir={-1} />

- `s` = skala tokoh di garis lantai yang sama (duduk ±18% tinggi orang).
- `dir` -1 = menghadap kiri.
- `seed` membedakan ritme kedip kalau ada dua kemunculan berdekatan.

## Aturan
- Kecil di latar, tidak disebut narasi, tidak menutupi tokoh atau subtitle. Satu kucing per shot.
- Lokasi lama yang menggambar kucing lain (kota-malam v1 abu, rumah-kenangan v1 krem, taman-sore v1 hitam): jangan tambah kucing kedua di shot yang sama. Versi lokasi berikutnya mengganti kucingnya dengan kucing ini.
- `render-film --audit` memberi peringatan kalau kucing ini tidak muncul sama sekali di film atau storyboard proyek.
- Gambar ulang: `node tools/render-thumb.cjs shared/characters/kucing/v1/contoh/ContohKucing.tsx shared/characters/kucing/v1/contoh/ContohKucing --only`. Bukti gerak: lihat kepala `contoh/BuktiGerak.tsx`.
