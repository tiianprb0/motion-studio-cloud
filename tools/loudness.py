#!/usr/bin/env python3
"""Kenyaringan video final (7 Nov 2026, arahan pengguna butir 2): target -14 LUFS terintegrasi, puncak sejati <= -1 dBTP.

Ukuran video lama tidak seragam (Maaf v2 -14,6; Syarat Protes -19,6; Kurang Yakin v7 -21,9 LUFS), sehingga video yang
pelan terdengar lemah di feed. -14 LUFS / -1 dBTP adalah patokan umum untuk YouTube, TikTok, dan Reels (YouTube hanya
menurunkan yang terlalu keras; TikTok/Instagram tidak menerbitkan angka resmi).

Pakai:
  python3 tools/loudness.py <video-atau-audio> ...        -> ukur dan cek (kode keluar 1 bila di luar target)
  python3 tools/loudness.py --fix <video> [--out <file>]  -> normalisasi 2 tahap (linear), gambar disalin apa adanya;
                                                             tanpa --out: menimpa file itu sendiri (dipakai render-film
                                                             dan mix_sfx.py untuk hasil yang baru saja mereka buat)
Toleransi cek: I -14 ± 1 LU, TP <= -1,0 dBTP (setelah AAC, sedikit di atas -1 masih dilaporkan sebagai temuan).
"""
import argparse, shutil, json, os, pathlib, re, subprocess, sys, tempfile
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ffmpeg

I_TARGET, TP_TARGET, LRA_TARGET = -14.0, -1.0, 11.0


def measure(path):
    """Ukur dengan loudnorm (pass 1). Kembali: dict input_i, input_tp, input_lra, input_thresh, target_offset."""
    r = subprocess.run([ffmpeg(), '-hide_banner', '-nostats', '-i', str(path), '-vn', '-af',
                        f'loudnorm=I={I_TARGET}:TP={TP_TARGET}:LRA={LRA_TARGET}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True)
    m = re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S)
    if not m:
        raise SystemExit(f'gagal mengukur {path}: tidak ada audio?')
    return {k: float(v) for k, v in json.loads(m.group(0)).items() if k != 'normalization_type'}


def check(path):
    m = measure(path)
    ok = abs(m['input_i'] - I_TARGET) <= 1.0 and m['input_tp'] <= TP_TARGET + 0.05
    print(f"{'OK   ' if ok else 'TEMUAN'} {path}: {m['input_i']:.1f} LUFS, puncak {m['input_tp']:.1f} dBTP, LRA {m['input_lra']:.1f} (target {I_TARGET:.0f} LUFS, <= {TP_TARGET:.0f} dBTP)")
    return ok


def fix(src, out=None):
    """Normalisasi linear ke -14 LUFS / -1 dBTP. Encoder AAC bisa menaikkan puncak sejati 0,1–0,3 dB setelah normalisasi
    (Kritik v2, 10 Nov 2026: hasil -0,9 dBTP). Karena itu hasil diukur ulang; bila puncak masih di atas batas, proses
    diulang dari salinan sumber asli dengan target puncak yang lebih rendah (maks 4 percobaan)."""
    src = pathlib.Path(src)
    m = measure(src)
    dst = pathlib.Path(out) if out else src
    fd, orig = tempfile.mkstemp(suffix=src.suffix, dir=dst.parent)
    os.close(fd)
    shutil.copyfile(src, orig)  # sumber asli disimpan: dst bisa sama dengan src
    video = ['-map', '0:v?', '-c:v', 'copy'] if src.suffix.lower() in ('.mp4', '.mov', '.m4v') else []
    codec = ['-c:a', 'aac', '-b:a', '192k'] if video else ['-c:a', 'pcm_s16le']
    tp = TP_TARGET
    try:
        for _ in range(4):
            flt = (f"loudnorm=I={I_TARGET}:TP={tp:.2f}:LRA={LRA_TARGET}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
                   f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
            fd, tmp = tempfile.mkstemp(suffix=src.suffix, dir=dst.parent)
            os.close(fd)
            try:
                subprocess.run([ffmpeg(), '-v', 'error', '-y', '-i', orig, *video, '-map', '0:a', '-af', flt, '-ar', '48000',
                                *codec, '-movflags', '+faststart', tmp], check=True)
                os.chmod(tmp, 0o644)  # mkstemp membuat 0600; file video harus bisa dibaca agen/aplikasi lain
                os.replace(tmp, dst)
            finally:
                if os.path.exists(tmp):
                    os.unlink(tmp)
            after = measure(dst)
            if after['input_tp'] <= TP_TARGET:  # ketat (-1,0), bukan toleransi cek, supaya tidak mepet batas
                break
            tp -= max(0.2, after['input_tp'] - TP_TARGET + 0.1)
    finally:
        if os.path.exists(orig):
            os.unlink(orig)
    print(f"kenyaringan: {m['input_i']:.1f} -> {after['input_i']:.1f} LUFS, puncak {after['input_tp']:.1f} dBTP -> {dst}")
    return after


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('files', nargs='*')
    ap.add_argument('--fix')
    ap.add_argument('--out')
    a = ap.parse_args()
    if a.fix:
        fix(a.fix, a.out)
    elif a.files:
        sys.exit(0 if all([check(f) for f in a.files]) else 1)
    else:
        ap.error('beri file untuk dicek, atau --fix <video>')
