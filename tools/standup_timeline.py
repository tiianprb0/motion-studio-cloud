"""Timeline stand-up (seri Open Mic): narasi dipotong per baris + tawa dari pustaka bersama -> mix.wav + timeline.json.
Digeneralisasi 7 Nov 2026 dari projects/syarat-protes-struk-kopi/scripts/lines.py + build-audio.py (v5 disetujui).

Pakai: python3 tools/standup_timeline.py <folder-proyek> [--out-dir <folder>] [--config <pengaturan.json>]
Masukan proyek:
  01-Brief/NARASI.txt      satu baris = satu baris narasi (tag nada [..] dibuang dari teks)
  01-Brief/audio-aktif.txt nama folder cache di <proyek>/audio/ (alignment.json + narration.mp3)
  01-Brief/standup.json    pengaturan episode, contoh:
    {"lead": 0.3, "tempo": 1.0, "pre": [2, 5], "laugh_trim": -4, "extra_gap": {"11": 0.5},
     "laughs": {"3": {"clip": "tawa-sedang-1", "gain": -4, "back": true}}}
    - pre: baris sebelum punchline -> jeda asli dipertahankan (min 0,35 dtk); baris lain 0,22 dtk.
    - laughs: baris punchline -> klip shared/audio/tawa-standup/v1. back=true: kalimat berikutnya masuk
      saat tawa mereda (max 1,6 dtk, 70% durasi tawa). gain + laugh_trim = level akhir (≈ -18 dB puncak).
Aturan: references/audio.md (onset tawa tepat di ujung punchline; selisih dicetak tiap build).

v2 (7 Nov 2026, references/pola-standup.md) — semua opsional; tanpa kunci ini hasilnya sama persis dengan v1:
  "pause_before": {"12": 1.6}   jeda senyap sebelum baris punchline (target 1,2–1,8 dtk untuk yang terkuat)
  "ride": 0.4, "ride_min": 0.5  kalimat berikut masuk di 40% durasi tawa (v1: 70%, min 1,6 dtk); per tawa juga "ride"
  "duck_db": -6                 tawa diredam saat narasi masuk lagi menimpa ekornya
  laughs.N.trim: 1.8            pakai tawa lebih pendek (ekor dipudarkan)
  "reactions": {"4": [{"clip": "kekeh-tersebar-1", "gain": -10, "offset": -0.4, "trim": 1.2}]}
                                kekeh kecil di sekitar ujung baris N (tidak mengubah timing)
  "room": [{"file": "shared/audio/ruang-kecil/v1/dengung-ruang.wav", "db": 0}, {"clip": "ruang-penonton", "db": 28}]
                                lapisan room tone (diulang) di bawah semua audio; target total ±−44 dBFS RMS
  "reverb": {"ir": "shared/audio/ruang-kecil/v1/ir-ruang-kecil.wav", "wet": 0.22}  pantulan ruangan pada narasi
Klip dicari di shared/audio/tawa-standup/v2 lalu v1. Laporan porsi bicara/senyap/tawa dicetak di akhir.
"""
import argparse, json, pathlib, re, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ffmpeg, ROOT as WS
from laugh_library import clip, find

ap = argparse.ArgumentParser(); ap.add_argument('proj'); ap.add_argument('--out-dir'); ap.add_argument('--config', help='berkas pengaturan lain (bawaan 01-Brief/standup.json)')
a = ap.parse_args()
root = pathlib.Path(a.proj).resolve()
cfg = json.load(open(pathlib.Path(a.config).resolve() if a.config else root / '01-Brief/standup.json'))
LEAD, TEMPO = cfg.get('lead', 0.3), cfg.get('tempo', 1.0)
PRE = set(cfg.get('pre', []))
EXTRA = {int(k): v for k, v in cfg.get('extra_gap', {}).items()}
TRIM = cfg.get('laugh_trim', 0)
LAUGH = {int(k): v for k, v in cfg.get('laughs', {}).items()}
PAUSE = {int(k): v for k, v in cfg.get('pause_before', {}).items()}
RIDE, RIDE_MIN, DUCK = cfg.get('ride'), cfg.get('ride_min', 0.5), cfg.get('duck_db')
REACT = {int(k): (v if isinstance(v, list) else [v]) for k, v in cfg.get('reactions', {}).items()}
ROOM, REVERB = cfg.get('room'), cfg.get('reverb')
V2 = DUCK is not None or ROOM is not None or REVERB is not None or bool(REACT)

d = root / 'audio' / (root / '01-Brief/audio-aktif.txt').read_text().strip()
nar = d / 'narration.mp3'
al = json.load(open(d / 'alignment.json'))['alignment']
ch, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
full = ''.join(ch)

# waktu tiap baris (lewati tag di awal baris untuk waktu mulai)
lines, pos = [], 0
for l in [x for x in (root / '01-Brief/NARASI.txt').read_text().splitlines() if x.strip()]:
    i = full.find(l.strip(), pos)
    if i < 0:
        raise SystemExit('baris tidak ketemu di alignment: ' + l)
    j = i + len(l.strip())
    m = re.match(r'(\s*\[[^\]]*\]\s*)+', full[i:j])
    k = i + m.end() if m else i
    lines.append({'text': re.sub(r'\[[^\]]*\]\s*', '', l).strip(), 'start': round(st[k], 3), 'end': round(max(en[k:j]), 3)})
    pos = j

# kata + waktu (lewati tag [..])
words, i = [], 0
while i < len(full):
    if full[i] == '[':
        i = full.index(']', i) + 1; continue
    if full[i].isspace():
        i += 1; continue
    j = i
    while j < len(full) and not full[j].isspace() and full[j] != '[':
        j += 1
    words.append({'w': full[i:j], 's': st[i], 'e': max(en[i:j])}); i = j

SRC = {k: {**clip(v['clip']), 'gain': v.get('gain', 0) + TRIM, 'back': v.get('back', True)} for k, v in LAUGH.items()}
for k, v in LAUGH.items():
    if v.get('trim'):
        SRC[k]['dur'] = round(min(SRC[k]['dur'], v['trim']), 3); SRC[k]['trimmed'] = True
    if 'ride' in v:
        SRC[k]['ride'] = v['ride']
t = LEAD
clips, out_lines, laughs = [], [], []
for k, L in enumerate(lines):
    s0 = L['start'] - 0.08
    b = L['end'] + 0.15
    if k + 1 < len(lines):
        b = min(b, (L['end'] + lines[k + 1]['start']) / 2)
    if k > 0:
        s0 = max(s0, (lines[k - 1]['end'] + L['start']) / 2)
    mp = lambda x, s0=s0, t=t: t + (x - s0) / TEMPO
    clips.append((s0, b, t))
    ws = [{'w': w['w'], 's': round(mp(w['s']), 3), 'e': round(mp(w['e']), 3)} for w in words if s0 <= w['s'] < b]
    out_lines.append({'text': L['text'], 'start': round(mp(L['start']), 3), 'end': round(mp(L['end']), 3), 'words': ws})
    line_end = mp(L['end'])  # dibekukan sebelum t maju (bug v3: tawa telat 1,3-2 dtk)
    t += (b - s0) / TEMPO
    if k in LAUGH:
        laughs.append({'line': k, **SRC[k], 'at': round(line_end - 0.05, 3), 'line_end': round(line_end, 3)})
    if k + 1 < len(lines):
        orig_gap = (lines[k + 1]['start'] - L['end'] - 0.23) / TEMPO
        if k in LAUGH and SRC[k]['back']:
            r = SRC[k].get('ride', RIDE)
            gap = max(1.6, SRC[k]['dur'] * 0.7) if r is None else max(RIDE_MIN, SRC[k]['dur'] * r)
        elif k in PRE:
            gap = max(0.35, orig_gap)
        else:
            gap = 0.22
        if (k + 1) in PAUSE:
            gap = max(gap, PAUSE[k + 1])
        t += gap + EXTRA.get(k, 0.0)
fps = 30
# Outro C (bawaan sejak 7 Nov 2026; "outro": "B" di standup.json = cara lama): kartu muncul 0,8 dtk setelah kata
# terakhir di atas tepuk tangan, video selesai 3 dtk setelah kata terakhir; tepuk tangan dipotong dengan fade 0,5 dtk.
OUTRO_STYLE = cfg.get('outro', 'C')
if OUTRO_STYLE == 'C':
    outro_start = round(max(L['end'] for L in out_lines) * fps) + 24
    outro = outro_start + 12
    TOTAL = outro_start + 66
else:
    total = max(t + 1.0, laughs[-1]['at'] + 4.0) if laughs else t + 1.0
    outro = round(total * fps)
    TOTAL = outro + 105
    outro_start = outro

reactions = []
for k, rs in REACT.items():
    for r in rs:
        c = clip(r['clip'])
        reactions.append({'line': k, 'src': c['src'], 'file': c['file'], 'from': c['from'], 'dur': round(min(c['dur'], r.get('trim', c['dur'])), 3),
                          'gain': r.get('gain', -8) + TRIM, 'at': round(out_lines[k]['end'] + r.get('offset', 0.1), 3)})

args, fc, labels, n = [ffmpeg(), '-v', 'error', '-y'], [], [], 0
for (s0, b, at) in clips:
    args += ['-ss', f'{s0:.3f}', '-t', f'{b - s0:.3f}', '-i', str(nar)]
    ms = round(at * 1000)
    fc.append(f'[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,atempo={TEMPO},afade=t=in:d=0.02,afade=t=out:st={max(0, (b - s0) / TEMPO - 0.04):.3f}:d=0.04,adelay={ms}|{ms}[c{n}]')
    labels.append(f'[c{n}]'); n += 1
if V2:
    fc.append(''.join(labels) + f'amix=inputs={len(labels)}:duration=longest:normalize=0[nar]')
    labels = ['[nar]']
    if REVERB:
        args += ['-i', str(WS / REVERB['ir'])]
        fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=mono[ir];[nar]asplit=2[nd][nw];[nw][ir]afir=irfmt=mono[nr];[nd][nr]amix=inputs=2:weights='1 {REVERB.get('wet', 0.22)}':normalize=0[narR]")
        labels = ['[narR]']; n += 1
for i, L in enumerate(laughs):
    args += ['-ss', f"{L['from']:.3f}", '-t', f"{L['dur']:.3f}", '-i', L['file']]
    ms = round(L['at'] * 1000)
    fade = 0.4 if L.get('trimmed') else 0.9
    duck = ''
    if DUCK is not None and L['line'] + 1 < len(clips):
        rs, end = clips[L['line'] + 1][2], L['at'] + L['dur']
        if rs < end:
            duck = f",volume=enable='between(t,{rs:.3f},{end:.3f})':volume={10 ** (DUCK / 20):.4f}"
    fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={L['gain']}dB,afade=t=in:d=0.03,afade=t=out:st={max(0, L['dur'] - fade):.3f}:d={fade},adelay={ms}|{ms}{duck}[c{n}]")
    labels.append(f'[c{n}]'); n += 1
for R in reactions:
    args += ['-ss', f"{R['from']:.3f}", '-t', f"{R['dur']:.3f}", '-i', R['file']]
    ms = round(max(0, R['at']) * 1000)
    fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={R['gain']}dB,afade=t=in:d=0.02,afade=t=out:st={max(0, R['dur'] - 0.3):.3f}:d=0.3,adelay={ms}|{ms}[c{n}]")
    labels.append(f'[c{n}]'); n += 1
for layer in ([ROOM] if isinstance(ROOM, dict) else ROOM or []):
    # lapisan room tone: {"clip": nama di pustaka tawa} atau {"file": path relatif workspace}; "db" = penguatan
    args += ['-stream_loop', '-1', '-i', str(find(layer['clip']) if 'clip' in layer else WS / layer['file'])]
    T = TOTAL / fps
    fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{T:.3f},volume={layer.get('db', 0)}dB,afade=t=in:d=0.8,afade=t=out:st={max(0, T - 1.2):.3f}:d=1.2[c{n}]")
    labels.append(f'[c{n}]'); n += 1
endfade = f',afade=t=out:st={TOTAL / fps - 0.5:.3f}:d=0.5' if OUTRO_STYLE == 'C' else ''
fc.append(''.join(labels) + f'amix=inputs={len(labels)}:duration=longest:normalize=0,apad=whole_dur={TOTAL / fps:.3f},atrim=0:{TOTAL / fps:.3f}{endfade}[a]')
out_dir = pathlib.Path(a.out_dir).resolve() if a.out_dir else root
(out_dir / 'public').mkdir(parents=True, exist_ok=True); (out_dir / 'src').mkdir(parents=True, exist_ok=True)
subprocess.run(args + ['-filter_complex', ';'.join(fc), '-map', '[a]', str(out_dir / 'public/mix.wav')], check=True)
for L in laughs + reactions:
    L.pop('file')
data = {'fps': fps, 'outro': outro, 'outro_start': outro_start, 'total': TOTAL, 'lines': out_lines, 'laughs': laughs}
if V2:
    data.update({'reactions': reactions, 'room': bool(ROOM), 'reverb': bool(REVERB)})
json.dump(data, open(out_dir / 'src/timeline.json', 'w'), ensure_ascii=False, indent=1)
for L in out_lines:
    print(f"{L['start']:7.2f} {L['end']:7.2f} {L['text']}")
for l in laughs:
    print(f"tawa baris {l['line']:2d}: punchline selesai {l['line_end']:7.2f}  tawa terdengar {l['at']:7.2f}  selisih {l['at'] - l['line_end']:+.2f} dtk  [{l['src']}, buang hening {l['from']:.2f}]")
print('outro frame', outro, 'total', TOTAL, f'({TOTAL / fps:.1f} dtk)')
# Laporan ritme (references/pola-standup.md bagian 5): bandingkan dengan set asli (Coki/Tretan: senyap 7–8%, tawa 6–8%).
# Tepuk/tawa penutup setelah kalimat terakhir tidak dihitung (pengukuran set asli juga tidak memasukkannya).
speech_end = out_lines[-1]['end']
talk = sum(l['end'] - l['start'] for l in out_lines)
heard = 0.0
for l in laughs:
    k = l['line']
    if k == len(out_lines) - 1:
        continue
    stop = out_lines[k + 1]['start'] if k + 1 < len(out_lines) else l['at'] + l['dur']
    heard += max(0.0, min(l['at'] + l['dur'], stop) - l['at'])
silent = max(0.0, speech_end - LEAD - talk - heard)
pre = [round(out_lines[l['line']]['start'] - out_lines[l['line'] - 1]['end'], 2) for l in laughs if l['line'] > 0]
print(f"porsi: bicara {100 * talk / speech_end:.0f}% · tawa terdengar sendiri {100 * heard / speech_end:.0f}% (target ≤10%) · senyap {100 * silent / speech_end:.0f}% (target ±8%)")
print('jeda sebelum baris punchline (dtk):', pre, '(target 1,2–1,8 untuk yang terkuat)')
