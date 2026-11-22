# kantor-2d v1 — kantor kecil lantai dua ruko (panggung flat 2D)

Dibuat 13 Nov 2026 oleh agen Buat konten untuk "Masih Ingat Hari Pertama Kerja?" v1. Status: baru, belum dipakai video terkirim.

**Isi:** dinding belakang 7 m (papan tulis, pot, jam dinding, jendela berkerai ke deret ruko seberang, spanduk SELAMAT BERGABUNG, papan gabus, dispenser, pintu), lemari arsip + printer dan meja rekan berpartisi di kiri depan, meja Yan di tengah menghadap kamera (panel depan sampai lantai untuk tokoh duduk; monitor membelakangi kamera, lampu meja di kanan), lantai vinil, plafon dengan tiga panel neon. Cahaya 2D dari `shared/film/v1/Cahaya2D.tsx`.

**Skala:** sama dengan `kamar-kerja-2d/v1` (227 px/m di dinding, kaki dinding y 1180, cakrawala y 885, kamera 4 m). `titikKantor(X, h, d)` mengubah meter dunia ke koordinat layar dunia + skala rig. `DUDUK_KANTOR` = tokoh duduk di belakang meja (Person `pose="sit"`, `seatDrop={20}`).

**Props penting:**
| Prop | Arti |
|---|---|
| `t` | 0 pagi ±07.10 (matahari dari jendela) → 0,5 senja → 1 malam ±21.40; jam dinding ikut (`jamKantor`) |
| `fajar` | 0..1 langit subuh/fajar di atas suasana malam |
| `neon` | lampu plafon; bawaan nyala siang, 0,25 malam (hanya panel di atas meja) |
| `lampu`, `monitor` | lampu meja hangat; layar monitor (pendar biru ke wajah saat malam) |
| `meja` | `{ stiker, map, kardus, gelas, buku }`: kertas tempel di punggung monitor (`titikMonitor(u,v)`), tumpukan map 0..1 |
| `gabus` | kertas tempel di papan gabus (`titikGabus(u,v)`), `jatuh` 0..1 = lepas ke lantai, `pudar` |
| `spanduk` | 0 / 1 / `'lepas'` (satu ujung terlepas, menggantung miring) |
| `papan` | 0..1 coretan tenggat di papan tulis |
| `kucing` | `{ u, pose, dir }` kucing oranye di tembok atap ruko sebelah; u 0,55–0,65 tidak tertutup kerai/monitor/kursi |
| `isi` | tokoh/benda bergerak (urut kedalaman); `bercahaya: true` = digambar sesudah cahaya malam (tokoh kenangan yang bersinar sendiri; hanya untuk tokoh yang tidak tertutup benda di depannya) |
| `kabur` | lensa: seluruh ruang kabur kecuali isi `fokus` |

Contoh: `contoh/ContohKantor2D.tsx` → `contoh/ContohKantor2D.png`
(`node tools/render-thumb.cjs shared/locations/kantor-2d/v1/contoh/ContohKantor2D.tsx shared/locations/kantor-2d/v1/contoh/ContohKantor2D --only`).
