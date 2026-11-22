"""Campur efek suara lokal ke video yang sudah dirender, tanpa merender ulang gambar.
Digeneralisasi dari projects/kurang-yakin-bukan-kurang-tahu/v7/scripts/mix-sfx.py (7 Nov 2026).

Pakai: python3 tools/mix_sfx.py <folder-proyek> --video 04-Hasil/Judul.mp4 [--out 04-Hasil/Judul-SFX.mp4]
Daftar efek: <proyek>/src/sfx.json = [{"sfx": "pop", "frame": 592, "db": -14}, ...]
Efek diambil dari shared/audio/sfx-lokal/v1 (atau --lib lain). Audio dasar = audio video itu sendiri.
"""
import argparse, json, pathlib, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ROOT, ffmpeg

ap = argparse.ArgumentParser()
ap.add_argument('proj'); ap.add_argument('--video', required=True); ap.add_argument('--out')
ap.add_argument('--lib', default='shared/audio/sfx-lokal/v1'); ap.add_argument('--fps', type=float, default=30)
a = ap.parse_args()
P = pathlib.Path(a.proj).resolve()
src = (P / a.video).resolve()
out = (P / a.out).resolve() if a.out else src.with_name(src.stem + '-SFX' + src.suffix)
lib = (ROOT / a.lib).resolve()
ev = json.load(open(P / 'src/sfx.json'))
args = [ffmpeg(), '-v', 'error', '-y', '-i', str(src)]
fc = ['[0:a]aformat=sample_rates=48000:channel_layouts=stereo[n]']
ALIAS = {'slide': 'swish'}  # pengguna: "suara popup, slide dari ffmpeg"; slide memakai swish.wav
for i, e in enumerate(ev):
    f = lib / f"{ALIAS.get(e['sfx'], e['sfx'])}.wav"
    if not f.exists():
        raise SystemExit(f'efek {f} tidak ada di pustaka {lib}')
    args += ['-i', str(f)]
    ms = round(e['frame'] / a.fps * 1000)
    fc.append(f"[{i + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={e.get('db', -16)}dB,adelay={ms}|{ms}[s{i}]")
fc.append('[n]' + ''.join(f'[s{i}]' for i in range(len(ev))) + f'amix=inputs={len(ev) + 1}:duration=first:normalize=0[a]')
args += ['-filter_complex', ';'.join(fc), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)]
subprocess.run(args, check=True)
print(f'{len(ev)} efek -> {out}')
# Kenyaringan final (7 Nov 2026): efek menambah sedikit energi; normalisasi ulang ke -14 LUFS / -1 dBTP.
from loudness import fix
fix(out)
