# Pustaka penonton Open Mic v2 (7 Nov 2026)
Tambahan untuk v1 (v1 tetap dipakai). 5 klip ElevenLabs Sound Effects, dibuat sekali atas izin pengguna ("jalankan semuanya"); prompt dan status di plan.json dan *.request.json. Generate lagi butuh izin baru. `tools/laugh_library.py` mencari nama klip di v2 lalu v1.
| Klip | Durasi | Level (mean / puncak) | Kegunaan |
|---|---|---|---|
| kekeh-tersebar-1 | 1,5 dtk | −30 / −12 dB | kekeh tipis di tengah setup (perlu gain +4 dB) |
| kekeh-tersebar-2 | 1,5 dtk | −20 / −2 dB | dengus/cekikik satu-dua orang |
| huuu-1 | 2,5 dtk | −13 / 0 dB | "huuu" untuk lelucon gelap (turunkan gain) |
| tawa-reda-1 | 2,0 dtk | −21 / −0,5 dB | tawa singkat yang cepat reda |
| ruang-penonton | 20 dtk | −72 / −48 dB | **hampir senyap** (hasil ElevenLabs di luar harapan); hanya dipakai sebagai lapisan derit/denting tipis dengan gain +28 dB, ditumpuk di atas `shared/audio/ruang-kecil/v1/dengung-ruang.wav` |
