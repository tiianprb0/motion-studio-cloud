#!/usr/bin/env python3
"""Motion Studio narration: direct ElevenLabs API, no automatic paid retry."""
import argparse,base64,contextlib,getpass,hashlib,json,os,re,sys,tempfile,urllib.request,urllib.error
from pathlib import Path

PROFILE=Path(__file__).resolve().parents[1]
ENV_FILE=PROFILE/'.env'
VOICES=PROFILE/'VOICE-PROFILES.json'
BASE='https://api.elevenlabs.io/v1'

class SafeError(Exception): pass

def key():
    value=os.environ.get('ELEVENLABS_API_KEY','').strip()
    if not value and ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if line.startswith('ELEVENLABS_API_KEY='):value=line.split('=',1)[1].strip().strip('\"\x27')
    if not value:raise SafeError('API key belum diisi. Buka Setup ElevenLabs.command terlebih dahulu.')
    return value

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None

def api(path,token,body=None):
    req=urllib.request.Request(BASE+path,headers={'xi-api-key':token,'Content-Type':'application/json'},data=None if body is None else json.dumps(body).encode())
    try:
        with urllib.request.build_opener(NoRedirect).open(req,timeout=180) as response:return json.load(response)
    except urllib.error.HTTPError as e:
        # Only publish known error codes and our own messages; never echo response text,
        # request headers, submitted key or other account data.
        known={
            'invalid_api_key':'API key tidak cocok atau sudah kedaluwarsa.',
            'missing_permissions':'Izin key belum cukup. Aktifkan Voices: Read dan Text to Speech: Access.',
            'voice_not_found':'Suara belum tersedia di akun/workspace ini. Tambahkan suara yang dipilih ke My Voices; jangan membuat key baru dulu.',
            'invalid_voice_id':'ID suara tidak dikenali. Periksa ID suara yang dipilih.',
            'quota_exceeded':'Kuota akun tidak cukup.',
            'max_character_limit_exceeded':'Naskah melebihi batas model.',
            'invalid_voice_settings':'Pengaturan suara ditolak model.',
            'model_not_found':'Model yang dipilih tidak tersedia.',
            'voice_not_allowed':'Akun belum mendapat akses ke suara ini.',
            'subscription_required':'Suara atau fitur ini memerlukan paket yang sesuai.'}
        status=''
        try:
            detail=json.loads(e.read(32768)).get('detail',{})
            if isinstance(detail,dict):status=detail.get('status','')
        except (ValueError,AttributeError):pass
        label=(' ['+status+']') if status in known else ''
        helptext=known.get(status,{400:'Permintaan ditolak; penyebab spesifik belum dikenali.',401:'API key tidak cocok atau sudah kedaluwarsa.',403:'Izin key atau akses suara belum cukup.',404:'Suara/model tidak tersedia. Tambahkan suara ke My Voices.',429:'Batas layanan/kuota tercapai; tidak diulang otomatis.'}.get(e.code,'Permintaan gagal; tidak diulang otomatis.'))
        raise SafeError(f'ElevenLabs HTTP {e.code}{label}. {helptext}') from None
    except (urllib.error.URLError,TimeoutError,OSError):raise SafeError('Koneksi terputus. Jangan ulangi generasi sebelum memeriksa riwayat pemakaian; hasil sebelumnya mungkin sudah ditagih.') from None

def atomic(path,text,mode=0o600):
    path.parent.mkdir(parents=True,exist_ok=True)
    fd,tmp=tempfile.mkstemp(dir=path.parent,prefix='.'+path.name+'-')
    try:
        os.fchmod(fd,mode)
        with os.fdopen(fd,'w') as f:f.write(text)
        os.replace(tmp,path)
    finally:
        if os.path.exists(tmp):os.unlink(tmp)

def check(token):
    settings=json.loads(VOICES.read_text());results=[]
    for actor in ['naya','yan']:
        voice=settings[actor]['voice_id']
        print('Memeriksa suara '+actor.title()+'...',flush=True)
        try:data=api('/voices/'+voice,token)
        except SafeError as exc:raise SafeError('Saat memeriksa '+actor.title()+': '+str(exc)) from None
        if data.get('voice_id')!=voice:raise SafeError('ID suara tidak cocok. Tidak ada suara pengganti otomatis.')
        results.append(actor.title()+': '+str(data.get('name','suara tersedia')))
    print('Koneksi API berhasil. Suara ditemukan: '+', '.join(results)+'.')
    print('Pemeriksaan ini tidak membuat audio. Siap dipakai untuk naskah berikutnya.')

def setup():
    if not sys.stdin.isatty():raise SafeError('Buka file Setup ElevenLabs.command dengan klik dua kali, bukan mengirim key lewat chat.')
    print('SETUP ELEVENLABS — MOTION STUDIO\nTempel API key milikmu, lalu Enter. Karakter sengaja tidak ditampilkan.\nTidak ada narasi yang dibuat pada langkah ini.')
    token=getpass.getpass('API key: ').strip()
    if not token or any(c.isspace() for c in token):raise SafeError('Key kosong/tidak valid; tidak disimpan.')
    # Validate via read-only voice requests before replacing a working key.
    check(token)
    old=ENV_FILE.read_text() if ENV_FILE.exists() else ''
    lines=old.splitlines();lines=[x for x in lines if not re.match(r'^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=',x)]
    lines.append('ELEVENLABS_API_KEY='+token)
    atomic(ENV_FILE,'\n'.join(lines)+'\n')
    print('Key disimpan di .env pada root workspace Motion Studio di Mac ini. File itu diabaikan git, jadi tidak ikut commit atau cadangan.\nJangan mengirim atau mengompres folder workspace mentah ke orang lain.\nMulai chat baru pada profil Motion Studio setelah setup.')

def request_for(text,actor,tone,model=None,stability=None,voice_id=None):
    voices=json.loads(VOICES.read_text());selected=dict(voices[actor])
    # Audisi (7 Nov 2026): voice_id lain hanya untuk uji dengar atas permintaan pengguna; VOICE-PROFILES.json tidak berubah.
    if voice_id:selected={'voice_id':voice_id}
    # Profil tokoh boleh punya model_policy sendiri (Yan/Ibnu: eleven_v4, karena eleven_v3 berderau untuk suara itu).
    chosen=model or selected.get('model_policy',{}).get(tone) or ('eleven_flash_v2_5' if tone=='normal' else 'eleven_v3')
    if tone!='normal' and chosen not in ('eleven_v3','eleven_v4','eleven_v4_turbo'):raise SafeError('Untuk nada marah/sarkastis gunakan model ekspresif (eleven_v3 atau eleven_v4); tidak diturunkan diam-diam.')
    bad=selected.get('avoid_models',{})
    if chosen in bad:raise SafeError(f'Model {chosen} tidak dipakai untuk suara {actor.title()}: {bad[chosen]} Pilih model dari verified_models di VOICE-PROFILES.json.')
    if selected.get('verified_models') and chosen not in selected['verified_models']:print(f'Peringatan: {chosen} belum terverifikasi untuk suara {actor.title()}; cek derau sebelum dipakai.',file=sys.stderr)
    tagged=({'angry':'[angry] ','sarcastic':'[sarcastic] '}.get(tone,'')+text)
    # stability v3: 0.0 Creative (paling ekspresif), 0.5 Natural (bawaan), 1.0 Robust. Bawaan tidak berubah agar hash cache lama tetap cocok.
    body={'text':tagged,'model_id':chosen,'voice_settings':{'stability':0.5 if stability is None else stability,'similarity_boost':0.75,'speed':1.0}}
    if chosen not in ('eleven_v3','eleven_v4','eleven_v4_turbo'):body['voice_settings']['use_speaker_boost']=True
    if chosen in ('eleven_v4','eleven_v4_turbo'):body['voice_settings'].pop('speed',None)
    limit=10000 if chosen=='eleven_v3' else 40000 if chosen=='eleven_flash_v2_5' else 10000
    if len(tagged)>limit:raise SafeError('Naskah melebihi batas satu permintaan. Pecah berdasarkan unit makna dan rencanakan sambungan sebelum generasi.')
    return selected['voice_id'],body

def generate(args):
    text=Path(args.text_file).read_text().strip()
    if not text:raise SafeError('Naskah kosong.')
    voice,body=request_for(text,args.actor,args.tone,args.model,args.stability,args.voice_id)
    # Angka ditulis dengan huruf (arahan 7 Nov 2026, pola-naskah "Angka di narasi"): peringatan, bukan blokir.
    nums=sorted(set(re.findall(r'\d+(?:[.,]\d+)*',text)))
    if nums:print('Peringatan: ada angka di naskah ('+', '.join(nums[:8])+'). Tulis dengan huruf supaya tidak salah baca, lalu jalankan lagi.',file=sys.stderr)
    if args.voice_id:print('AUDISI: suara '+args.voice_id+' menggantikan '+args.actor.title()+' hanya untuk permintaan ini. Profil suara tidak berubah.')
    digest=hashlib.sha256(json.dumps({'voice':voice,'body':body,'output_format':'mp3_44100_128'},sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    print(f'Narator: {args.actor.title()} | Nada: {args.tone} | Model: {body["model_id"]} | Karakter: {len(body["text"])}')
    if body['model_id'] in ('eleven_v4','eleven_v4_turbo'):print('Tarif v4 mengikuti akun/model; tidak memakai tarif estimasi v2/v3 sebagai tagihan aktual.')
    else:print('Estimasi tarif dasar: US$'+format(len(body['text'])/1000*(.04 if body['model_id']=='eleven_flash_v2_5' else .08),'.4f')+' (tarif akun/voice dapat berbeda; bukan jaminan tagihan).')
    if not args.generate:print('Pratinjau rencana saja. Tidak ada permintaan generasi/biaya.');return
    root=Path(args.out_dir).resolve();root.mkdir(parents=True,exist_ok=True)
    cache=root/('elevenlabs-'+digest);cache.mkdir(exist_ok=True)
    marker=cache/'request.json';audio=cache/'narration.mp3';timing=cache/'alignment.json'
    if marker.exists():
        old=json.loads(marker.read_text())
        if old.get('status')=='complete' and audio.exists() and timing.exists():
            print('Memakai audio cache yang sama. Tidak membuat suara baru.');print(str(audio));return
        if old.get('status')=='ditolak' and not audio.exists():marker.unlink()
        else:raise SafeError('Permintaan sama pernah dimulai tetapi hasil belum terkonfirmasi. Periksa riwayat ElevenLabs sebelum mencoba lagi; generasi ulang otomatis diblokir.')
    token=key();meta={'status':'started','request_sha256':digest,'voice_id':voice,'model_id':body['model_id'],'actor':args.actor,'tone':args.tone,'characters':len(body['text']),'voice_settings':body['voice_settings']}
    # Exclusive marker prevents a second process from charging the same request concurrently.
    fd=os.open(marker,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
    with os.fdopen(fd,'w') as f:json.dump(meta,f)
    try:
        result=api('/text-to-speech/'+voice+'/with-timestamps?output_format=mp3_44100_128',token,body)
        payload=base64.b64decode(result.pop('audio_base64'),validate=True)
        fd=os.open(audio,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
        with os.fdopen(fd,'wb') as f:f.write(payload)
        atomic(timing,json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        meta['status']='complete';atomic(marker,json.dumps(meta,indent=2)+'\n')
    except SafeError as e:
        # 400/401/403/404 = ditolak sebelum diproses, tidak ditagih; boleh dicoba lagi setelah akses diperbaiki.
        meta['status']='ditolak' if re.search(r'HTTP 40[0134]\b',str(e)) else 'unconfirmed';atomic(marker,json.dumps(meta,indent=2)+'\n');raise
    except Exception:
        meta['status']='unconfirmed';atomic(marker,json.dumps(meta,indent=2)+'\n');raise
    print('Audio dan timing tersimpan. Gunakan rekaman ini kembali untuk revisi visual.');print(str(audio))

def api_bytes(path,token,body):
    """POST yang mengembalikan audio biner (Sound Effects). Galat ditangani seperti api()."""
    req=urllib.request.Request(BASE+path,headers={'xi-api-key':token,'Content-Type':'application/json'},data=json.dumps(body).encode())
    try:
        with urllib.request.build_opener(NoRedirect).open(req,timeout=180) as response:return response.read()
    except urllib.error.HTTPError as e:
        status=''
        try:
            detail=json.loads(e.read(32768)).get('detail',{})
            if isinstance(detail,dict):status=detail.get('status','')
        except (ValueError,AttributeError):pass
        hint={'missing_permissions':' Izin key belum mencakup Sound Effects.','quota_exceeded':' Kuota akun tidak cukup.'}.get(status,'')
        raise SafeError(f'ElevenLabs HTTP {e.code}.{hint} Tidak diulang otomatis.') from None
    except (urllib.error.URLError,TimeoutError,OSError):raise SafeError('Koneksi terputus. Periksa riwayat pemakaian sebelum mencoba lagi.') from None

def sfx(args):
    """Pustaka efek suara sekali-buat (mis. tawa penonton Open Mic). Tiap klip: marker eksklusif, tanpa ulang otomatis."""
    plan=json.loads(Path(args.sfx_plan).read_text());root=Path(args.sfx_plan).resolve().parent
    clips=plan['clips'];total=sum(c['duration'] for c in clips)
    print(f'{len(clips)} klip, total {total:.1f} detik. Tarif mengikuti akun; tidak ditebak.')
    if not args.generate:
        for c in clips:print(' -',c['id'],c['duration'],'dtk:',c['prompt'][:70])
        print('Pratinjau saja. Tidak ada permintaan/biaya.');return
    token=key()
    for c in clips:
        out=root/(c['id']+'.mp3');marker=root/(c['id']+'.request.json')
        if out.exists():print('ada:',out.name);continue
        if marker.exists() and json.loads(marker.read_text()).get('status')!='ditolak':print('LEWATI (pernah dimulai, belum terkonfirmasi):',c['id']);continue
        body={'text':c['prompt'],'duration_seconds':c['duration'],'prompt_influence':c.get('influence',0.45)}
        meta={'status':'started','body':body}
        if marker.exists():marker.unlink()
        fd=os.open(marker,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
        with os.fdopen(fd,'w') as f:json.dump(meta,f)
        try:
            data=api_bytes('/sound-generation?output_format=mp3_44100_128',token,body)
            fd=os.open(out,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o644)
            with os.fdopen(fd,'wb') as f:f.write(data)
            meta['status']='complete';atomic(marker,json.dumps(meta,indent=2,ensure_ascii=False)+'\n',0o644);print('ok:',out.name)
        except SafeError as e:
            # 400/401/403 = ditolak sebelum diproses, tidak ditagih; boleh dicoba lagi setelah izin diperbaiki.
            meta['status']='ditolak' if re.search(r'HTTP 40[013]\b',str(e)) else 'unconfirmed'
            atomic(marker,json.dumps(meta,indent=2,ensure_ascii=False)+'\n',0o644);raise
        except Exception:
            meta['status']='unconfirmed';atomic(marker,json.dumps(meta,indent=2,ensure_ascii=False)+'\n',0o644);raise

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--setup',action='store_true');parser.add_argument('--check',action='store_true');parser.add_argument('--text-file');parser.add_argument('--out-dir');parser.add_argument('--actor',choices=['naya','yan'],default='naya');parser.add_argument('--tone',choices=['normal','angry','sarcastic'],default='normal');parser.add_argument('--model');parser.add_argument('--stability',type=float,help='v3: 0.0 Creative, 0.5 Natural (bawaan), 1.0 Robust');parser.add_argument('--voice-id',help='audisi: voice_id lain untuk uji dengar saja; VOICE-PROFILES.json tidak berubah');parser.add_argument('--generate',action='store_true');parser.add_argument('--sfx-plan');args=parser.parse_args()
    try:
        if args.setup:setup()
        elif args.check:check(key())
        elif args.sfx_plan:sfx(args)
        else:
            if not args.text_file or not args.out_dir:parser.error('Gunakan --text-file dan --out-dir.')
            generate(args)
    except (SafeError,ValueError,KeyError) as e:
        print(str(e) if isinstance(e,SafeError) else 'Respons/data belum sesuai. Jangan ulangi generasi otomatis.',file=sys.stderr);return 1
    return 0
if __name__=='__main__':sys.exit(main())
