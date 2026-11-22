#!/usr/bin/env python3
"""Cari kandidat suara ElevenLabs untuk audisi (7 Nov 2026). Hanya membaca; tidak membuat audio, tidak mengubah akun.

Pakai:
  python3 tools/voice_library.py --mine                         # suara di My Voices akun ini
  python3 tools/voice_library.py --gender male --age young      # pustaka bersama, bahasa Indonesia
  python3 tools/voice_library.py --gender male --search santai --use-case conversational --limit 30

Keluaran: id, nama, umur, aksen, deskripsi singkat, use case, jumlah pemakai, apakah sudah ada di My Voices.
Mendengar/menguji kandidat dilakukan terpisah dengan scripts/elevenlabs_api.py --voice-id (audisi; profil
VOICE-PROFILES.json tidak berubah). Suara Naya/Yan hanya diganti atas pilihan pengguna.
"""
import argparse, json, sys, urllib.parse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import elevenlabs_api as el  # noqa: E402


def mine(token):
    data = el.api('/voices', token)
    rows = []
    for v in data.get('voices', []):
        lab = v.get('labels') or {}
        rows.append([v.get('voice_id'), v.get('name'), v.get('category'), lab.get('gender', ''), lab.get('age', ''), lab.get('accent', ''), lab.get('language', '') or (v.get('fine_tuning') or {}).get('language', '') or ''])
    return ['id', 'nama', 'kategori', 'gender', 'umur', 'aksen', 'bahasa'], rows


def shared(token, a):
    q = {'page_size': min(100, a.limit), 'language': a.language}
    for k in ('gender', 'age', 'search', 'accent', 'descriptives'):
        if getattr(a, k):
            q[k] = getattr(a, k)
    if a.use_case:
        q['use_cases'] = a.use_case
    data = el.api('/shared-voices?' + urllib.parse.urlencode(q), token)
    rows = []
    for v in data.get('voices', [])[: a.limit]:
        desc = (v.get('description') or '').replace('\n', ' ')
        rows.append([v.get('voice_id'), v.get('name'), v.get('age', ''), v.get('accent', ''), v.get('descriptive', ''), v.get('use_case', ''), v.get('cloned_by_count', 0), 'ya' if v.get('is_added_by_user') else '', desc[:90]])
    return ['id', 'nama', 'umur', 'aksen', 'sifat', 'use case', 'dipakai', 'di akun', 'deskripsi'], rows


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--mine', action='store_true')
    p.add_argument('--language', default='id')
    p.add_argument('--gender')
    p.add_argument('--age', help='young | middle_aged | old')
    p.add_argument('--accent')
    p.add_argument('--search')
    p.add_argument('--descriptives', help='mis. casual, calm, confident')
    p.add_argument('--use-case', help='mis. conversational, narrative_story, characters_animation, social_media')
    p.add_argument('--limit', type=int, default=25)
    p.add_argument('--json', action='store_true')
    a = p.parse_args()
    try:
        token = el.key()
        head, rows = mine(token) if a.mine else shared(token, a)
    except el.SafeError as e:
        print(str(e), file=sys.stderr)
        return 1
    if a.json:
        print(json.dumps([dict(zip(head, r)) for r in rows], ensure_ascii=False, indent=1))
    else:
        print(' | '.join(head))
        for r in rows:
            print(' | '.join(str(x) for x in r))
        print(f'({len(rows)} suara)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
