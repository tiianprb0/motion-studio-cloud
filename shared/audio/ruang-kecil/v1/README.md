# Ruang kecil v1 (7 Nov 2026) — suara ruangan seri Open Mic
Dibuat lokal, deterministik, tanpa biaya. Pengecualian "tanpa ambient" khusus seri Open Mic (disetujui pengguna 7 Nov 2026).
- `ir-ruang-kecil.wav`: impulse response ruangan kecil (rt60 0,35 dtk, pantulan awal 6–37 ms). Dibuat ulang: `python3 tools/make_room_ir.py <out> --rt60 0.35`. Dipakai `standup_timeline.py` → `"reverb": {"ir": ..., "wet": 0.22}`.
- `dengung-ruang.wav`: dengung ruangan 20 dtk (derau coklat 80–700 Hz, RMS −46 dBFS), aman diulang. Dibuat ulang: `python3 tools/make_room_tone.py <out> --db -46`. Dipakai sebagai lapisan `"room"`.
