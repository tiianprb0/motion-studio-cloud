"""Dengung ruangan kecil sintetis untuk room tone seri Open Mic (7 Nov 2026). Deterministik (seed tetap), tanpa biaya.
Pakai: python3 tools/make_room_tone.py shared/audio/ruang-kecil/v1/dengung-ruang.wav [--db -46]
Isi: derau coklat yang dibatasi 80–700 Hz (dengung ruangan/kipas/gumam jauh), level RMS sekitar --db dBFS, ujung dipudarkan
50 ms supaya aman diulang (stream_loop) di standup_timeline.py.
"""
import argparse, pathlib, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ffmpeg
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--db', type=float, default=-46.0); ap.add_argument('--dur', type=float, default=20.0)
a = ap.parse_args()
out = pathlib.Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
src = f'anoisesrc=color=brown:amplitude=0.5:seed=7:duration={a.dur}:sample_rate=48000'
chain = f'highpass=f=80,lowpass=f=700,afade=t=in:d=0.05,afade=t=out:st={a.dur - 0.05}:d=0.05'
tmp = out.with_suffix('.tmp.wav')
subprocess.run([ffmpeg(), '-v', 'error', '-y', '-f', 'lavfi', '-i', src, '-af', chain, str(tmp)], check=True)
r = subprocess.run([ffmpeg(), '-hide_banner', '-i', str(tmp), '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
mean = float(r.split('mean_volume:')[1].split('dB')[0])
subprocess.run([ffmpeg(), '-v', 'error', '-y', '-i', str(tmp), '-af', f'volume={a.db - mean:.2f}dB', '-ac', '1', str(out)], check=True)
tmp.unlink()
print(f'dengung ruang {a.dur:.0f} dtk, RMS {a.db} dBFS -> {out}')
