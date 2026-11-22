"""Buat impulse response (IR) ruangan kecil untuk pantulan narasi seri Open Mic (7 Nov 2026).
Deterministik (seed tetap) supaya hasil bisa dibuat ulang tanpa berkas dari luar.
Pakai: python3 tools/make_room_ir.py shared/audio/ruang-kecil/v1/ir-ruang-kecil.wav [--rt60 0.35]
IR berisi pantulan awal + ekor difus (derau meluruh eksponensial, diredam frekuensi tingginya); tanpa suara langsung,
jadi dicampur sebagai lapisan 'basah' di bawah narasi kering (standup_timeline.py: reverb.wet).
"""
import argparse, math, random, struct, wave, pathlib
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--rt60', type=float, default=0.35); ap.add_argument('--sr', type=int, default=48000)
a = ap.parse_args()
sr, n = a.sr, int(a.sr * (a.rt60 * 1.3))
rnd = random.Random(7)
ir = [0.0] * n
for ms, g in [(6, 0.55), (9, 0.42), (13, 0.36), (17, 0.3), (22, 0.26), (29, 0.2), (37, 0.15)]:  # pantulan awal dinding/meja
    ir[int(sr * ms / 1000)] += g * (1 if rnd.random() > 0.5 else -1)
decay = math.log(1000) / (a.rt60 * sr)  # -60 dB pada rt60
lp, start = 0.0, int(sr * 0.012)
for i in range(start, n):
    lp = 0.75 * lp + 0.25 * rnd.uniform(-1, 1)  # derau diredam frekuensi tinggi
    ir[i] += 0.35 * lp * math.exp(-decay * (i - start))
peak = max(abs(v) for v in ir)
p = pathlib.Path(a.out); p.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(p), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(b''.join(struct.pack('<h', int(32000 * v / peak)) for v in ir))
print(f'IR {n / sr:.2f} dtk (rt60 {a.rt60}) -> {p}')
