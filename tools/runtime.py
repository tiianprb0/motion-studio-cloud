"""Resolusi toolchain untuk alat Python Motion Studio (pasangan tools/runtime.cjs).

Urutan pencarian sama dengan runtime.cjs: variabel lingkungan > .toolchain/ > lokasi Homebrew.
Pakai: from runtime import ROOT, ffmpeg
"""
import os, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]


def _resolve(label, env, candidates, hint):
    found = [os.environ.get(env)] if os.environ.get(env) else []
    for c in found + [str(x) for x in candidates]:
        if c and pathlib.Path(c).exists():
            return c
    raise SystemExit(f'{label} tidak ditemukan. Dicari di: {", ".join(map(str, candidates))}. '
                     f'Setel {env}=<path>. {hint}')


def ffmpeg():
    return _resolve('FFmpeg', 'MOTION_STUDIO_FFMPEG',
                    [ROOT / '.toolchain/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'],
                    'Pasang lewat: brew install ffmpeg')
