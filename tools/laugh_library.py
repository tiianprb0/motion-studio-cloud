"""Pustaka tawa Open Mic bersama (shared/audio/tawa-standup/v1) + deteksi awal tawa.
Dipakai build-audio proyek stand-up mana pun. Aturan: references/audio.md.
- onset(): detik pertama tawa benar-benar terdengar (RMS 20 ms > 18% puncak), supaya hening di kepala klip dibuang.
- clip(): berkas, titik mulai (sudah dipangkas) dan durasi sebuah klip pustaka.
- Taruh 'at' = ujung punchline - 0,05 dtk; kalimat berikutnya masuk di max(1,6 dtk, 70% durasi tawa).
- Level: puncak klip -6…-15 dB; gain disetel supaya tawa sekitar -18 dB puncak, di bawah narasi.
"""
import array, pathlib, subprocess
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ROOT, ffmpeg
FF = ffmpeg()
LIB = ROOT / 'shared/audio/tawa-standup/v1'
# v2 (7 Nov 2026): kekeh tersebar, huuu, tawa singkat, room tone. Nama klip dicari di v2 lalu v1.
LIBS = [ROOT / 'shared/audio/tawa-standup/v2', LIB]

def onset(path, start=0.0, dur=None):
    cmd = [FF, '-v', 'error', '-ss', f'{start:.3f}'] + (['-t', f'{dur:.3f}'] if dur else []) + ['-i', str(path), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']
    a = array.array('f', subprocess.run(cmd, capture_output=True, check=True).stdout)
    w = 320
    rms = [(sum(x * x for x in a[i:i + w]) / w) ** 0.5 for i in range(0, len(a) - w, w)]
    top = max(rms)
    first = next(i for i, r in enumerate(rms) if r > 0.18 * top)
    return max(0.0, first * 0.02 - 0.04), len(a) / 16000

def find(name):
    for lib in LIBS:
        f = lib / (name + '.mp3')
        if f.exists():
            return f
    raise FileNotFoundError(f'{name}.mp3 tidak ada di {[str(l) for l in LIBS]}. Pustaka tawa dibuat sekali; jangan generate ulang tanpa izin.')

def clip(name):
    f = find(name)
    on, length = onset(f)
    return {'file': str(f), 'src': name, 'from': round(on, 3), 'dur': round(length - on, 3)}
