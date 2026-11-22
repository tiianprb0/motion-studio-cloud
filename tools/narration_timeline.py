"""Timeline narasi umum (tanpa tawa): baris NARASI.txt + kata dari alignment ElevenLabs -> src/timeline.json dan public/mix.wav.
Pakai: python3 tools/narration_timeline.py <folder-proyek> [--lead 0.15] [--tail 1.2] [--maxgap 1.1] [--hold 16:0.6 ...] [--outro C|B]
- Baris = satu baris tidak kosong di 01-Brief/NARASI.txt (tag [..] dibuang dari teks).
- Audio narasi dipakai utuh. Jeda antar-baris (dari kata terakhir ke kata pertama berikutnya, tanpa --hold) dibatasi --maxgap:
  jeda pendek diberi ruang napas tambahan sampai batas itu; jeda asli yang lebih panjang dipendekkan dengan membuang
  senyap di tengahnya (sisa minimal 0,35 dtk di tiap sisi kata, karena alignment bisa meleset ±0,3 dtk).
  Perbaikan 8 Nov 2026: dulu jeda panjang tidak pernah dipendekkan (potongan audio bersambung, jadi jeda asli utuh +
  tambahan sampai 0,6 dtk). Hasil untuk jeda yang totalnya sudah <= --maxgap tidak berubah (diuji: Maaf v1–v3 identik).
- Hasil timeline: {fps, outro, outro_start, total, lines:[{text,start,end,words:[{w,s,e}]}]}.
  Outro C (bawaan sejak 7 Nov 2026): kartu mulai 24 frame (0,8 dtk) setelah kata terakhir, outro = mulai + 12, total = mulai + 66
  (sama dengan outroCTimes di shared/outro/v1/OutroC.tsx). --outro B = cara lama (tail + 105 frame layar hijau).
- --lead bawaan 0,15 dtk (7 Nov 2026; kata pertama ±0,27 dtk karena potongan audio mulai 0,12 dtk sebelum kata): narasi dan subtitle mulai <= 0,3 dtk, frame pertama langsung hook.
"""
import argparse, json, re, subprocess, pathlib
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ROOT, ffmpeg
FF = ffmpeg()
ap = argparse.ArgumentParser(); ap.add_argument('proj'); ap.add_argument('--lead', type=float, default=0.15); ap.add_argument('--tail', type=float, default=1.2); ap.add_argument('--maxgap', type=float, default=1.1); ap.add_argument('--hold', action='append', default=[], help='jeda tambahan setelah baris: IDX:DETIK'); ap.add_argument('--outro', choices=['C', 'B'], default='C')
a = ap.parse_args(); P = pathlib.Path(a.proj).resolve()
d = P / 'audio' / (P / '01-Brief/audio-aktif.txt').read_text().strip()
al = json.load(open(d / 'alignment.json'))['alignment']
ch, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
full = ''.join(ch)
words, i = [], 0
while i < len(full):
    if full[i] == '[': i = full.index(']', i) + 1; continue
    if full[i].isspace(): i += 1; continue
    j = i
    while j < len(full) and not full[j].isspace() and full[j] != '[': j += 1
    words.append({'w': full[i:j], 's': st[i], 'e': max(en[i:j]), 'i': i}); i = j
raw = [l for l in (P / '01-Brief/NARASI.txt').read_text().splitlines() if l.strip()]
lines, pos = [], 0
for l in raw:
    clean = re.sub(r'\[[^\]]*\]\s*', '', l).strip()
    k = full.find(l.strip(), pos)
    if k < 0: raise SystemExit('baris tidak ketemu di alignment: ' + l)
    pos = k + len(l.strip())
    ws = [w for w in words if k <= w['i'] < pos]
    lines.append({'text': clean, 'ws': ws})
# segmen audio: tiap baris dipotong di titik PALING SENYAP di sekitar jeda (7 Nov 2026). Dulu dipotong di tengah jeda
# menurut alignment, tapi alignment ElevenLabs bisa terlambat ±0,1–0,3 dtk; di Maaf v3 potongan jatuh di tengah
# "Kalau" sehingga suku kata pertama terpotong dan terdengar "salah cut". Sekarang dicari jendela 20 ms dengan energi
# terendah dari audio sebenarnya, di rentang [akhir kata - 0,35, awal kata berikut + 0,1].
import array as _arr, math as _math
_pcm = _arr.array('h', subprocess.run([FF, '-v', 'error', '-i', str(d / 'narration.mp3'), '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout)
def quiet(t0, t1, fallback):
    best, at = None, fallback
    i0, i1 = max(0, int(t0 * 16000)), min(len(_pcm) - 320, int(t1 * 16000))
    for i in range(i0, i1, 80):
        w = _pcm[i:i + 320]
        e = sum(v * v for v in w) / 320
        if best is None or e < best: best, at = e, (i + 160) / 16000
    return at
MARGIN = 0.35  # senyap minimal yang disisakan di tiap sisi kata saat jeda panjang dipendekkan
holds = dict((int(x.split(':')[0]), float(x.split(':')[1])) for x in a.hold)
# Per batas antar-baris n: ujung segmen n (bn), awal segmen n+1 (an1), dan senyap tambahan (extra).
bounds = []
for n in range(len(lines) - 1):
    e0, s1 = lines[n]['ws'][-1]['e'], lines[n + 1]['ws'][0]['s']
    cut = quiet(min(e0, s1) - 0.35, max(e0, s1) + 0.1, (e0 + s1) / 2)
    orig = s1 - e0
    extra = max(0.0, min(s1 - cut - min(0.25, orig / 2), a.maxgap - 0.5))  # ruang napas (rumus lama)
    keep = max(a.maxgap, 2 * MARGIN)
    if orig > keep:  # jeda asli terlalu panjang: buang senyap di tengah, sisakan `keep` dtk
        mid, drop = (e0 + s1) / 2, orig - keep
        bounds.append((mid - drop / 2, mid + drop / 2, 0.0))
    elif orig + extra > a.maxgap:  # jeda pendek + ruang napas melewati batas: kurangi ruang napas saja
        bounds.append((cut, cut, max(0.0, a.maxgap - orig)))
    else:  # kasus umum: sama persis dengan perilaku lama
        bounds.append((cut, cut, extra))
    if orig > keep:
        print(f'catatan: jeda setelah baris {n} dipendekkan {orig:.2f} -> {keep:.2f} dtk (--maxgap {a.maxgap})')
segs, t, out = [], a.lead, []
for n, L in enumerate(lines):
    s0, e0 = L['ws'][0]['s'], L['ws'][-1]['e']
    a0 = s0 - 0.12 if n == 0 else bounds[n - 1][1]
    b0 = e0 + 0.3 if n == len(lines) - 1 else bounds[n][0]
    segs.append((a0, b0, t))
    mp = lambda x, a0=a0, t=t: round(t + x - a0, 3)
    out.append({'text': L['text'], 'start': mp(s0), 'end': mp(e0), 'words': [{'w': w['w'], 's': mp(w['s']), 'e': mp(w['e'])} for w in L['ws']]})
    t += b0 - a0
    if n + 1 < len(lines):
        t += bounds[n][2] + holds.get(n, 0.0)
fps = 30
if a.outro == 'C':
    outro_start = round(out[-1]['end'] * fps) + 24; outro = outro_start + 12; total = outro_start + 66
else:
    outro = round((t + a.tail) * fps); total = outro + 105; outro_start = outro
args, fc, lab = [FF, '-v', 'error', '-y'], [], []
nar = d / 'narration.mp3'
for k, (a0, b0, at) in enumerate(segs):
    args += ['-ss', f'{a0:.3f}', '-t', f'{b0 - a0:.3f}', '-i', str(nar)]
    ms = round(at * 1000)
    fc.append(f'[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st={max(0, b0 - a0 - 0.04):.3f}:d=0.04,adelay={ms}|{ms}[c{k}]'); lab.append(f'[c{k}]')
fc.append(''.join(lab) + f'amix=inputs={len(lab)}:duration=longest:normalize=0,apad=whole_dur={total / fps:.3f},atrim=0:{total / fps:.3f}[a]')
(P / 'public').mkdir(exist_ok=True); (P / 'src').mkdir(exist_ok=True)
subprocess.run(args + ['-filter_complex', ';'.join(fc), '-map', '[a]', str(P / 'public/mix.wav')], check=True)
json.dump({'fps': fps, 'outro': outro, 'outro_start': outro_start, 'total': total, 'lines': out}, open(P / 'src/timeline.json', 'w'), ensure_ascii=False, indent=1)
for k, L in enumerate(out): print(f"{k:2d} {L['start']:7.2f} {L['end']:7.2f} {L['text']}")
print('outro frame', outro, 'total', total, f'({total / fps:.1f} dtk)')
