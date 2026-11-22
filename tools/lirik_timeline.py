"""Timeline seri Lirik (tanpa narasi, 7 Nov 2026): waktu tiap baris lagu + teks lirik dari pengguna -> src/lirik.json.

Pakai:
  python3 tools/lirik_timeline.py <folder-proyek> [--lead 0.5]
      01-Brief/lagu.json (waktu baris di lagu) + 01-Brief/lirik.txt (teks, diisi pengguna) -> src/lirik.json
  python3 tools/lirik_timeline.py <folder-proyek> --lrclib <id> --jendela 225-270
      isi "baris" dan "selesai" di 01-Brief/lagu.json dari lirik tersinkron LRCLIB (lrclib.net), lalu buat src/lirik.json.

Aturan (references/arahan-pengguna.md bagian "Seri Lirik"):
- Agen tidak menyalin lirik lagu ke file. Teks hanya datang dari lirik.txt yang diisi pengguna.
  --lrclib hanya menyimpan WAKTU dan JUMLAH KATA tiap baris, bukan teksnya.
- Kalau lirik.txt belum ada, alat membuat template berisi patokan waktu supaya pengguna tinggal menempel lirik.
- Terjemahan Indonesia (opsional) ditulis pengguna di 01-Brief/lirik-id.txt dengan urutan baris yang sama -> "terjemahan".
  Di layar ukurannya sepertiga teks asli (arahan pengguna 7 Nov 2026). Agen tidak menerjemahkan lirik.

lagu.json:
  {"judul", "penyanyi", "album"?, "bagian"?, "sumber_timing", "lead"? (dtk sebelum vokal pertama, bawaan 0,5),
   "geser"? (koreksi dtk bila lagu panduan/platform tidak pas), "baris": [{"t": dtk di lagu, "kata": n}], "selesai": dtk di lagu,
   "panduan"? (file lagu panduan milik pengguna, relatif folder proyek; hanya untuk preview review)}
Hasil src/lirik.json (waktu dalam detik, relatif awal klip):
  {fps, lagu:{judul, penyanyi}, mulai_lagu, outro_start, outro, total, lines:[{i, text, words, terjemahan, start, end}]}
  Outro C sama dengan narration_timeline.py: kartu 24 frame setelah vokal terakhir selesai, outro = +12, total = +66.
"""
import argparse, json, pathlib, re, sys, urllib.request

FPS = 30
ap = argparse.ArgumentParser()
ap.add_argument('proj')
ap.add_argument('--lead', type=float, help='detik sebelum vokal pertama (bawaan: lagu.json "lead" atau 0,5)')
ap.add_argument('--lrclib', type=int, help='id lirik tersinkron di lrclib.net')
ap.add_argument('--jendela', help='rentang detik di lagu, mis. 225-270 (dipakai bersama --lrclib)')
a = ap.parse_args()

P = pathlib.Path(a.proj).resolve()
brief = P / '01-Brief'
lagu_f, lirik_f, id_f = brief / 'lagu.json', brief / 'lirik.txt', brief / 'lirik-id.txt'
if not lagu_f.exists():
    sys.exit(f'{lagu_f} belum ada. Isi minimal: {{"judul": "...", "penyanyi": "...", "sumber_timing": "...", "baris": [], "selesai": 0}}')
lagu = json.loads(lagu_f.read_text())
tanpa_kurung = lambda s: re.sub(r'\([^)]*\)', ' ', s)
hitung_kata = lambda s: len(tanpa_kurung(s).split())


def fmt(t):
    return f'{int(t // 60)}:{t % 60:05.2f}'


# ------------------------------------------------------------------ LRCLIB: hanya waktu + jumlah kata
if a.lrclib:
    if not a.jendela:
        sys.exit('--lrclib butuh --jendela A-B (detik di lagu)')
    lo, hi = (float(x) for x in a.jendela.split('-'))
    req = urllib.request.Request(f'https://lrclib.net/api/get/{a.lrclib}', headers={'User-Agent': 'MotionStudio-lirik-timeline/1.0'})
    d = json.load(urllib.request.urlopen(req, timeout=20))
    rows = []
    for ln in (d.get('syncedLyrics') or '').splitlines():
        m = re.match(r'\[(\d+):(\d+(?:\.\d+)?)\](.*)', ln)
        if m:
            rows.append((int(m.group(1)) * 60 + float(m.group(2)), m.group(3).strip()))
    if not rows:
        sys.exit(f'LRCLIB {a.lrclib}: tidak ada lirik tersinkron')
    idx = [i for i, (t, txt) in enumerate(rows) if lo <= t < hi and txt]
    if not idx:
        sys.exit(f'tidak ada baris di jendela {a.jendela}')
    nxt = rows[idx[-1] + 1][0] if idx[-1] + 1 < len(rows) else float(d.get('duration') or rows[idx[-1]][0] + 4)
    lagu['baris'] = [{'t': round(rows[i][0], 2), 'kata': hitung_kata(rows[i][1])} for i in idx]
    lagu['selesai'] = round(nxt, 2)
    lagu['sumber_timing'] = f'LRCLIB id {a.lrclib} ({d.get("trackName")} – {d.get("artistName")}, album "{d.get("albumName")}", durasi {d.get("duration")} dtk); perkiraan ±0,3 dtk, cocokkan dengan lagu panduan bila ada'
    lagu_f.write_text(json.dumps(lagu, ensure_ascii=False, indent=1) + '\n')
    print(f'lagu.json: {len(idx)} baris dari LRCLIB {a.lrclib}, {fmt(lagu["baris"][0]["t"])}–{fmt(lagu["selesai"])}')

baris = lagu.get('baris') or []
if not baris:
    sys.exit('lagu.json belum punya "baris" (isi manual atau pakai --lrclib ID --jendela A-B)')
lead = a.lead if a.lead is not None else float(lagu.get('lead', 0.5))
# "geser" = vokal di lagu sebenarnya (panduan/platform) datang `geser` dtk lebih lambat dari waktu di "baris".
# Perbaikan 20 Nov 2026: dulu geser ikut mengurangi waktu teks, jadi selisih teks–vokal tidak pernah berubah (koreksi
# tidak berefek). Sekarang hanya titik mulai lagu yang digeser; teks tetap `lead` dtk setelah awal klip.
geser = float(lagu.get('geser', 0))
mulai = round(baris[0]['t'] - lead + geser, 2)

# ------------------------------------------------------------------ lirik.txt (diisi pengguna)
if not lirik_f.exists():
    patokan = '\n'.join(f'#   {i + 1:>2}) {fmt(b["t"])} di lagu, ±{b.get("kata", "?")} kata' for i, b in enumerate(baris))
    lirik_f.write_text(
        f'# Lirik "{lagu.get("judul", "?")}" – {lagu.get("penyanyi", "?")}, DIISI PENGGUNA (agen tidak menyalin lirik lagu).\n'
        f'# Tempel {len(baris)} baris di bawah (tanpa nomor/waktu), satu baris lagu per baris, urutan sama dengan 01-Brief/lagu.json.\n'
        '# Baris yang diawali # dan baris kosong diabaikan. Ad-lib dalam kurung boleh ditulis di baris yang sama.\n'
        f'# Patokan waktu:\n{patokan}\n\n')
    print(f'template dibuat: {lirik_f.relative_to(P)} (minta pengguna menempel lirik)')
# Awalan patokan dari template ("3) 3:53.13 di lagu, ±6 kata") yang ikut tertempel dibuang; isi baris tidak diubah.
AWALAN = re.compile(r'^\s*\d+\s*[).:-]\s*(\d+:\d+(?:[.,]\d+)?)?\s*(di lagu,?\s*)?(±?\s*\d+\s*kata,?\s*)?')
bersih = lambda l: AWALAN.sub('', l).strip() if AWALAN.match(l) and AWALAN.match(l).group(1) else l.strip()
teks = [bersih(l) for l in lirik_f.read_text().splitlines() if l.strip() and not l.lstrip().startswith('#')]
if any(bersih(l) != l.strip() for l in lirik_f.read_text().splitlines() if l.strip() and not l.lstrip().startswith('#')):
    print('catatan: awalan nomor/waktu dari template di lirik.txt dibuang otomatis')
if teks and len(teks) != len(baris):
    sys.exit(f'lirik.txt berisi {len(teks)} baris, lagu.json {len(baris)} baris; samakan dulu')
if not teks:
    print('peringatan: lirik.txt masih kosong; teks lirik di storyboard/film akan kosong')
if not id_f.exists():
    id_f.write_text(
        f'# Terjemahan Indonesia "{lagu.get("judul", "?")}" (OPSIONAL), DIISI PENGGUNA (agen tidak menerjemahkan lirik).\n'
        f'# {len(baris)} baris, urutan sama dengan lirik.txt. Biarkan kosong kalau video tanpa terjemahan.\n'
        '# Di layar: sepertiga ukuran teks asli, di bawahnya. Baris yang diawali # diabaikan.\n\n')
    print(f'template dibuat: {id_f.relative_to(P)} (opsional, diisi pengguna)')
terj = [bersih(l) for l in id_f.read_text().splitlines() if l.strip() and not l.lstrip().startswith('#')]
if terj and len(terj) != len(baris):
    sys.exit(f'lirik-id.txt berisi {len(terj)} baris, lagu.json {len(baris)} baris; samakan dulu')

lines = []
for i, b in enumerate(baris):
    end_lagu = baris[i + 1]['t'] if i + 1 < len(baris) else float(lagu['selesai'])
    text = teks[i] if teks else ''
    if text and b.get('kata') and abs(hitung_kata(text) - b['kata']) > 1:
        print(f'peringatan: baris {i + 1}: {hitung_kata(text)} kata di lirik.txt vs ±{b["kata"]} di sumber timing; cek urutan baris')
    lines.append({'i': i + 1, 'text': text, 'words': text.split(), 'terjemahan': terj[i] if terj else '', 'start': round(b['t'] + geser - mulai, 3), 'end': round(end_lagu + geser - mulai, 3)})

outro_start = round(lines[-1]['end'] * FPS) + 24
out = {'fps': FPS, 'lagu': {'judul': lagu.get('judul'), 'penyanyi': lagu.get('penyanyi')}, 'mulai_lagu': mulai,
       'outro_start': outro_start, 'outro': outro_start + 12, 'total': outro_start + 66, 'lines': lines}
(P / 'src').mkdir(exist_ok=True)
(P / 'src/lirik.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print(f'mulai di lagu {fmt(mulai)} (lead {lead} dtk), vokal pertama {lines[0]["start"]:.2f} dtk di video')
for L in lines:
    print(f'  baris {L["i"]:>2}: {L["start"]:6.2f}–{L["end"]:6.2f} dtk')
print(f'outro frame {out["outro"]}, total {out["total"]} ({out["total"] / FPS:.1f} dtk) -> src/lirik.json')
