"""Sambung narasi: ganti SATU baris rekaman narasi dengan take baru, bagian lain dipakai ulang (17 Nov 2026).
Dibuat untuk revisi "Keresahan yang Kamu Hapus Lagi" v2: pengguna "cara baca less.benaya.id itu less (dot) benaya (dot) id
(dibaca:ai di)". Aturan audio: perubahan ucapan memakai ulang bagian yang tidak berubah bila memungkinkan (references/audio.md).

Pakai: python3 tools/sambung_narasi.py <proj> --baris N --take <folder take> [--dari <folder audio lama>]
- <proj>/01-Brief/NARASI.txt sudah berisi teks BARU untuk baris N (baris = baris tidak kosong, mulai 1). Baris lain sama
  persis dengan rekaman lama (tag [..] ikut).
- --take = folder hasil `scripts/elevenlabs_api.py --generate` untuk teks baris N saja (narration.mp3 + alignment.json).
- --dari = folder audio lama (bawaan isi 01-Brief/audio-aktif.txt), relatif ke <proj>/audio.
Hasil: <proj>/audio/sambung-<sha8>/ (narration.mp3, alignment.json, request.json berisi asal-usul). Potongan diambil di
tengah jeda sebelum dan sesudah baris lama; take baru dipotong dari 0,08 dtk sebelum kata pertama sampai 0,12 dtk sesudah
kata terakhir. Waktu karakter sesudahnya digeser. Setelah itu tulis nama folder ke 01-Brief/audio-aktif.txt lalu jalankan
tools/narration_timeline.py seperti biasa. Tidak memanggil ElevenLabs dan tidak memakai kredit.
"""
import argparse, hashlib, json, pathlib, re, subprocess, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from runtime import ffmpeg

FF = ffmpeg()
ap = argparse.ArgumentParser()
ap.add_argument('proj'); ap.add_argument('--baris', type=int, required=True); ap.add_argument('--take', required=True); ap.add_argument('--dari')
a = ap.parse_args()
P = pathlib.Path(a.proj).resolve()
dari = P / 'audio' / (a.dari or (P / '01-Brief/audio-aktif.txt').read_text().strip())
take = pathlib.Path(a.take).resolve()
al_lama = json.load(open(dari / 'alignment.json'))['alignment']
al_baru = json.load(open(take / 'alignment.json'))['alignment']
C, S, E = al_lama['characters'], al_lama['character_start_times_seconds'], al_lama['character_end_times_seconds']
full = ''.join(C)
baris = [l.strip() for l in (P / '01-Brief/NARASI.txt').read_text().splitlines() if l.strip()]
n = a.baris - 1
if not 0 <= n < len(baris): raise SystemExit(f'baris {a.baris} tidak ada (NARASI.txt punya {len(baris)} baris)')
# letak baris sebelum/sesudah (tidak berubah) di rekaman lama → baris lama = di antaranya
pos = 0
for l in baris[:n]:
    k = full.find(l, pos)
    if k < 0: raise SystemExit('baris sebelum tidak ketemu di rekaman lama: ' + l)
    pos = k + len(l)
akhir_prev = pos
mulai_next = full.find(baris[n + 1], akhir_prev) if n + 1 < len(baris) else len(full)
if mulai_next < 0: raise SystemExit('baris sesudah tidak ketemu di rekaman lama: ' + baris[n + 1])
seg = full[akhir_prev:mulai_next]
i0 = akhir_prev + (len(seg) - len(seg.lstrip()))
i1 = akhir_prev + len(seg.rstrip())
lama = full[i0:i1]
print(f'baris lama: {lama}')
print(f'baris baru: {baris[n]}')

def kata_idx(chars, lo, hi):
    """indeks karakter kata pertama/terakhir (bukan tag, bukan spasi) di rentang [lo, hi)"""
    idx, i, t = [], lo, ''.join(chars)
    while i < hi:
        if t[i] == '[': i = t.index(']', i) + 1; continue
        if not t[i].isspace(): idx.append(i)
        i += 1
    return idx[0], idx[-1]

f0, f1 = kata_idx(C, i0, i1)
prev_end = max(E[:i0]) if i0 > 0 else 0.0
next_start = min(S[i1:]) if i1 < len(S) else E[-1] + 0.3
next_start = min([S[j] for j in range(i1, len(C)) if not C[j].isspace()] or [next_start])
t0 = prev_end + 0.5 * (S[f0] - prev_end)
t1 = E[f1] + 0.5 * (next_start - E[f1])
Cb, Sb, Eb = al_baru['characters'], al_baru['character_start_times_seconds'], al_baru['character_end_times_seconds']
tb = ''.join(Cb).strip()
if tb != baris[n]: raise SystemExit(f'teks take tidak sama dengan NARASI.txt baris {a.baris}:\n  take : {tb}\n  narasi: {baris[n]}')
lb = len(''.join(Cb)) - len(''.join(Cb).lstrip())
g0, g1 = kata_idx(Cb, lb, lb + len(tb))
b0 = max(0.0, Sb[g0] - 0.08)
b1 = Eb[g1] + 0.12
dur_b = b1 - b0
geser = t0 + dur_b - t1
C2 = C[:i0] + Cb[lb:lb + len(tb)] + C[i1:]
S2 = S[:i0] + [max(t0, x - b0 + t0) for x in Sb[lb:lb + len(tb)]] + [x + geser for x in S[i1:]]
E2 = E[:i0] + [max(t0, x - b0 + t0) for x in Eb[lb:lb + len(tb)]] + [x + geser for x in E[i1:]]
h = hashlib.sha256((str(dari) + str(take) + str(a.baris)).encode()).hexdigest()[:8]
out = P / 'audio' / f'sambung-{h}'
out.mkdir(parents=True, exist_ok=True)
fc = (f'[0:a]aresample=44100,aformat=channel_layouts=mono,atrim=0:{t0:.3f},asetpts=PTS-STARTPTS[a];'
      f'[1:a]aresample=44100,aformat=channel_layouts=mono,atrim={b0:.3f}:{b1:.3f},asetpts=PTS-STARTPTS[b];'
      f'[0:a]aresample=44100,aformat=channel_layouts=mono,atrim=start={t1:.3f},asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[o]')
subprocess.run([FF, '-v', 'error', '-y', '-i', str(dari / 'narration.mp3'), '-i', str(take / 'narration.mp3'), '-filter_complex', fc, '-map', '[o]',
                '-c:a', 'libmp3lame', '-b:a', '192k', str(out / 'narration.mp3')], check=True)
json.dump({'alignment': {'characters': C2, 'character_start_times_seconds': S2, 'character_end_times_seconds': E2}}, open(out / 'alignment.json', 'w'), ensure_ascii=False)
json.dump({'status': 'complete', 'jenis': 'sambung', 'dari': str(dari.relative_to(P)), 'take': str(take.relative_to(P)), 'baris': a.baris,
           'baris_lama': lama, 'baris_baru': baris[n], 'potong_lama_detik': [round(t0, 3), round(t1, 3)], 'potong_take_detik': [round(b0, 3), round(b1, 3)],
           'catatan': 'tanpa panggilan ElevenLabs; bagian lain dari rekaman lama'}, open(out / 'request.json', 'w'), ensure_ascii=False, indent=1)
print(f'lama {t0:.2f}–{t1:.2f} dtk diganti take {b0:.2f}–{b1:.2f} dtk (selisih {geser:+.2f} dtk)')
print(out.name)
