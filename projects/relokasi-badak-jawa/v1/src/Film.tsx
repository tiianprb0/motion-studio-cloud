// Film: Badaknya Diselamatkan, Warganya? (relokasi badak Jawa v1, 21 Nov 2026). Pengguna: "buat yang badak lagi
// sekarang", dengan arah "coba cari narasi yang dukung rakyat dong, berorasi". Naskah 01-Brief/NASKAH.md (disetujui
// 21 Nov 2026: "Oke, lanjut storyboard"), sumber 01-Brief/RISET.md.
// Benang merah: satu pantai, dua rumah. Hutan Ujung Kulon (rumah badak) dan kampung nelayan (rumah warga) menghadap laut
// yang sama; wacana menyiapkan rumah baru untuk badak, warga tidak ditanya; warga bersuara di Balai TN; penutup kembali
// ke pantai yang sama, kali ini sirene dan jalur evakuasi menyala untuk semuanya.
// Lokasi baru (shared): pesisir-selat-sunda-2d, balai-tn-2d, ruang-konferensi-2d; badak Jawa (characters/badak/v1);
// peringatan dini (props/peringatan-dini/v1); spanduk (props/aksi/v2). Tidak ada tokoh nyata yang digambar: utusan
// khusus presiden hanya disebut di narasi + kartu sumber, podium kosong.
// AdeganPanel(p, t, f): t 0..1 dalam panel (storyboard memakai t = 0 dan 1). Timeline dipasang setelah narasi direkam.
import React from 'react';
import { P } from '../../../../shared/core/v1/core';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../shared/characters/rig/v4/Character';
import { POSE } from '../../../../shared/characters/rig/v4/poses';
import { Kucing } from '../../../../shared/characters/kucing/v1/Kucing';
import { Badak } from '../../../../shared/characters/badak/v1/Badak';
import { PesisirSelatSunda2D, PESISIR } from '../../../../shared/locations/pesisir-selat-sunda-2d/v1/PesisirSelatSunda2D';
import { BalaiTN2D, BALAI } from '../../../../shared/locations/balai-tn-2d/v1/BalaiTN2D';
import { RuangKonferensi2D, RK } from '../../../../shared/locations/ruang-konferensi-2d/v1/RuangKonferensi2D';
import { PenerimaWRS } from '../../../../shared/props/peringatan-dini/v1/PeringatanDini';
import { Megafon, PosterAksi } from '../../../../shared/props/aksi/v1/Aksi';
import { Spanduk } from '../../../../shared/props/aksi/v2/Spanduk';
import { PetaIndonesia, proyPeta, type Pandang } from '../../../../shared/ui/peta/v1/PetaIndonesia';
import { KartuData } from '../../../../shared/ui/kartu/v1/KartuData';
import { Callout } from '../../../../shared/film/v2/Callout';
import { Stempel } from '../../../../shared/film/v2/Stempel';
import { Blurred } from '../../../../shared/film/v1/Depth';
import { OutroC, type CtaC } from '../../../../shared/outro/v3/OutroC';
import { Captions, type Cue } from '../../../../shared/film/v1/Captions';
import { Vignette } from '../../../../shared/film/v1/Depth';
import { makeTimeline, shotIndex, MIN_SHOT as MIN } from '../../../../shared/film/v1/timeline';
import TL from './timeline.json';
import CUES from './cues.json';
import METRICS from './caption-metrics.json';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';

export const NARASI = [
  'Pemerintah takut badak Jawa punah disapu tsunami.',
  'Makanya di COP31, utusan khusus presiden mengusulkan sebagian badak dari Ujung Kulon dipindah ke Alas Purwo.',
  'Oke. Terus warganya?',
  'Tsunami Selat Sunda dua ribu delapan belas menewaskan lebih dari empat ratus orang. Korban terbanyak di Pandeglang.',
  'Pandeglang itu rumah badak Jawa. Dan rumah warga yang dulu dikubur gelombang yang sama.',
  'September kemarin, alat penerima peringatan dini tsunami di Tanjung Lesung masih diperbaiki.',
  'Badaknya disiapkan rumah baru. Warganya disiapkan apa?',
  'Wacana sebesar ini diumumkan ke dunia, sebelum kajiannya ada. Kementerian Kehutanan sendiri bilang, ini masih wacana.',
  'Tapi warga Ujung Kulon nggak diam. Ratusan orang datang ke Balai Taman Nasional, menolak.',
  'Tuntutannya sederhana: jaga habitat aslinya, jangan dipindah.',
  'Ada juga yang curiga, ini soal tambang emas di perbatasan taman nasional. ESDM membantah. Antam juga.',
  'Tapi kecurigaan itu tumbuh karena satu hal: warga nggak pernah diajak bicara.',
  'Kalau tsunami memang ancaman, selamatkan semuanya.',
  'Badaknya, dan orang-orang yang hidup di sampingnya.',
];
// CTA per topik ke web (aturan 20 Nov 2026)
export const CTA: CtaC = { kind: 'seri', text: 'Kampungmu juga nggak diajak bicara?\nCeritain di less.benaya.id' };
export const ACCENT = /^(badak|tsunami|warganya|warga|pandeglang|rumah|diperbaiki|apa|wacana|kajiannya|menolak|habitat|dipindah|tambang|membantah|bicara|semuanya|sampingnya)$/i;

// ---------------------------------------------------------------- pembantu
type Kam = { zoom: number; cx: number; cy: number };
const kamT = (k: Kam) => `translate(540 960) scale(${k.zoom}) translate(${-k.cx} ${-k.cy})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const halus = (u: number) => {
  const x = klamp(u);
  return x * x * (3 - 2 * x);
};
const di = (t: number, a: number, b: number) => klamp((t - a) / Math.max(1e-4, b - a));
const kamAntara = (a: Kam, b: Kam, u: number): Kam => ({ zoom: lerp(a.zoom, b.zoom, halus(u)), cx: lerp(a.cx, b.cx, halus(u)), cy: lerp(a.cy, b.cy, halus(u)) });
const bicara = (f: number, on = true) => (on ? 0.25 + 0.45 * Math.abs(Math.sin(f * 0.55)) : 0);
type Mood = 'annoyed' | 'hurt' | 'thinking' | 'soft' | 'warm' | 'unsure';
const Pose = (who: 'her' | 'him', n: string) => (POSE[who] as any)[n];
const keLayar = (k: Kam, x: number, y: number): [number, number] => [540 + (x - k.cx) * k.zoom, 960 + (y - k.cy) * k.zoom];

// ---------------------------------------------------------------- pesisir: satu pantai, dua rumah
const K_BADAK: Kam = { zoom: 1.25, cx: 640, cy: 1420 };
const K_HUTAN_LEBAR: Kam = { zoom: 0.95, cx: 700, cy: 1180 };
const K_DUA_RUMAH: Kam = { zoom: 0.72, cx: 1180, cy: 1320 };
const K4 = (t: number): Kam => kamAntara({ zoom: 0.8, cx: 900, cy: 1300 }, { zoom: 0.72, cx: 1300, cy: 1320 }, t);
const K_KAMPUNG: Kam = { zoom: 1.0, cx: 1800, cy: 1300 };
const K_NAYA: Kam = { zoom: 1.35, cx: 1780, cy: 1430 };
const NAYA_X = 1780,
  NAYA_Y = 1800;

type OPesisir = { gelombang?: number; malam?: number; puing?: number; sirene?: number; evakuasi?: number; badak?: React.ReactNode; warga?: React.ReactNode; naya?: React.ReactNode; depan?: React.ReactNode };
const pesisir = (f: number, kam: Kam, o: OPesisir = {}) => (
  <g transform={kamT(kam)}>
    <PesisirSelatSunda2D f={f} gelombang={o.gelombang} malam={o.malam} puing={o.puing} sirene={o.sirene} evakuasi={o.evakuasi}
      isiHutan={o.badak} isiKampung={<>{o.warga}{o.naya}</>} isiDepan={o.depan} />
  </g>
);
const badakKubang = (f: number, x = PESISIR.kubang.x, s = 1.25) => <Badak x={x} y={PESISIR.kubang.y + 14} s={s} f={f} pose="kubang" id="bk" />;
const badakJalan = (f: number, x: number, y = 1760, s = 1.35, pose: 'jalan' | 'makan' | 'berdiri' = 'jalan') => <Badak x={x} y={y} s={s} f={f} pose={pose} lumpur={0.6} id="bj" />;

/** warga kampung nelayan: menjemur ikan, membawa ember, anak bermain (figuran rig v4, beda jelas dari Naya) */
const WARGA: { who: 'her' | 'him'; ap: number; baju: string; celana: string; x: number; y: number; xd: number; yd: number; s: number; dir: number; pose: string }[] = [
  { who: 'him' as const, ap: 0, baju: '#C98F84', celana: '#4E5A63', x: 2330, y: 1600, xd: 1560, yd: 1560, s: 1.05, dir: -1, pose: 'santai' },
  { who: 'her' as const, ap: 4, baju: '#9DB3D6', celana: '#6E6A7E', x: 2120, y: 1640, xd: 1720, yd: 1620, s: 1.1, dir: 1, pose: 'santai' },
  { who: 'him' as const, ap: 2, baju: '#7FA48D', celana: '#3F4A55', x: 1500, y: 1680, xd: 1400, yd: 1700, s: 1.2, dir: 1, pose: 'santai' },
  { who: 'her' as const, ap: 7, baju: '#E3B58A', celana: '#5E5A6E', x: 2000, y: 1900, xd: 1820, yd: 1820, s: 1.6, dir: -1, pose: 'santai' },
];
const wargaKampung = (f: number, n = 4, o: { lari?: number; gazeY?: number; dekat?: boolean } = {}) =>
  WARGA.slice(0, n).map((w, i) => {
    const dx = (o.lari ?? 0) * -(120 + i * 40);
    return (
      <Person key={i} who={w.who} appearance={w.ap} shirtColor={w.baju} trouserColor={w.celana} x={(o.dekat ? w.xd : w.x) + dx} y={(o.dekat ? w.yd : w.y) + (o.lari ?? 0) * 200} s={w.s} f={f + i * 7} view="three" dir={o.lari ? -1 : w.dir}
        step={o.lari ? Math.sin(f * 0.4 + i) : 0} mood="thinking" gazeY={o.gazeY ?? 0.2} role="background" {...Pose(w.who, w.pose)} />
    );
  });
const naya = (f: number, mood: Mood, o: { x?: number; y?: number; s?: number; pose?: string; talk?: boolean; gaze?: number; dir?: number; megafon?: boolean } = {}) => (
  <Person who="her" x={o.x ?? NAYA_X} y={o.y ?? NAYA_Y} s={o.s ?? 1.75} f={f} view="three" dir={o.dir ?? -1} mood={mood} talk={bicara(f, o.talk ?? true)} gaze={o.gaze ?? -0.1} gazeY={-0.05} role="principal"
    {...Pose('her', o.megafon ? 'melambai' : o.pose ?? 'santai')} holdRight={o.megafon ? <Megafon s={0.75} arah={-1} sudut={70} /> : undefined} />
);

// ---------------------------------------------------------------- latar kartu (adegan yang sama, diredam)
const latar = (isi: React.ReactNode, id: string) => (
  <g data-latar="adegan">
    <Blurred amount={6} id={id}>{isi}</Blurred>
    <rect x="-200" y="-200" width="1480" height="2320" fill="#EDE6D8" opacity="0.32" />
  </g>
);

// ---------------------------------------------------------------- peta Ujung Kulon → Alas Purwo
const UK: [number, number] = [105.35, -6.78];
const AP: [number, number] = [114.37, -8.62];
const PANDANG_JAWA: Pandang = { lon: 109.9, lat: -7.4, k: 84 };
const PANDANG_JAWA_JAUH: Pandang = { lon: 106.2, lat: -6.9, k: 190 };
const peta = (f: number, t: number) => {
  const pd: Pandang = { lon: lerp(PANDANG_JAWA_JAUH.lon, PANDANG_JAWA.lon, halus(t)), lat: lerp(PANDANG_JAWA_JAUH.lat, PANDANG_JAWA.lat, halus(t)), k: lerp(PANDANG_JAWA_JAUH.k, PANDANG_JAWA.k, halus(t)) };
  const a = proyPeta(pd, UK[0], UK[1]),
    b = proyPeta(pd, AP[0], AP[1]);
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 300 };
  const u = halus(di(t, 0.2, 0.95));
  const bez = (v: number) => ({ x: (1 - v) * (1 - v) * a.x + 2 * (1 - v) * v * c.x + v * v * b.x, y: (1 - v) * (1 - v) * a.y + 2 * (1 - v) * v * c.y + v * v * b.y });
  const ujung = bez(Math.max(0.02, u));
  const panjang = 1400;
  return (
    <g>
      <PetaIndonesia f={f} pandang={pd} id="pjawa"
        sorot={[
          { lon: UK[0], lat: UK[1], teks: 'UJUNG KULON', muncul: 1, sisi: 1, geser: [10, 70] },
          { lon: AP[0], lat: AP[1], teks: 'ALAS PURWO', muncul: di(t, 0.7, 0.9), sisi: -1, geser: [-10, 70] },
        ]} />
      <path d={`M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`} stroke={P.wine} strokeWidth="9" fill="none" strokeDasharray={`${panjang * u} ${panjang}`} strokeLinecap="round" />
      {u > 0.9 && <path d={`M${b.x} ${b.y} l-34 -20 l8 34 Z`} fill={P.wine} />}
      <g transform={`translate(${ujung.x} ${ujung.y - 20})`}>
        <Badak x={0} y={0} s={0.2} f={f} pose="jalan" id="bpeta" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- dinding pos (sisipan alat penerima)
const posWRS = (f: number, t: number) => (
  <g>
    <rect x="-200" y="-200" width="1480" height="2320" fill="#D9D2C2" />
    <rect x="-200" y="1180" width="1480" height="1200" fill="#B9A88A" />
    {/* papan informasi + jam dinding */}
    <rect x="150" y="730" width="330" height="240" fill="#F4EEDF" stroke="#8A7A62" strokeWidth="8" />
    <text x="315" y="790" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="28" fill="#2F6E8A">PETA EVAKUASI</text>
    <path d="M190 840 q60 -40 120 0 t120 0" stroke="#5FA3B8" strokeWidth="10" fill="none" />
    <path d="M200 910 L300 860 L420 900" stroke="#E8731E" strokeWidth="8" fill="none" />
    <circle cx="790" cy="820" r="70" fill="#FFFFFF" stroke="#4A4542" strokeWidth="8" />
    <path d={`M790 820 L790 770 M790 820 L${790 + 40 * Math.cos(f * 0.02)} ${820 + 40 * Math.sin(f * 0.02)}`} stroke="#283D36" strokeWidth="6" />
    {/* kalender dinding: lembar berganti sampai SEPTEMBER */}
    <rect x="600" y="1000" width="180" height="150" fill="#FFFFFF" stroke="#8A7A62" strokeWidth="5" />
    <rect x="600" y="1000" width="180" height="40" fill="#C24E4E" />
    <text x="690" y="1105" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="44" fill="#283D36">{['JUN', 'JUL', 'AGU', 'SEP'][Math.min(3, Math.floor(di(t, 0.05, 0.4) * 4))]}</text>
    <text x="690" y="1032" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill="#FFFFFF">2026</text>
    {/* meja */}
    <rect x="60" y="1180" width="960" height="40" fill="#8A6A4E" />
    <rect x="100" y="1220" width="40" height="300" fill="#6A5444" />
    <rect x="940" y="1220" width="40" height="300" fill="#6A5444" />
    <g transform="translate(540 1180)">
      <PenerimaWRS s={4.2} layar="mati" perbaikan={halus(di(t, 0.2, 0.8))} f={f} />
    </g>
  </g>
);

// ---------------------------------------------------------------- Balai TN: aksi warga
const K_BALAI_LEBAR: Kam = { zoom: 0.92, cx: 540, cy: 1180 };
const K_BALAI_SPANDUK: Kam = { zoom: 1.3, cx: 560, cy: 1560 };
const POSTER: string[][] = [['TOLAK', 'PEMINDAHAN'], ['JAGA', 'UJUNG KULON'], ['BADAK', 'TETAP DI SINI']];
const kerumunan = (f: number, n: number, angkat = 0.5) => {
  const orang = [
    { who: 'him' as const, ap: 0, baju: '#C98F84', x: 60, y: 1760 },
    { who: 'her' as const, ap: 4, baju: '#9DB3D6', x: 200, y: 1730 },
    { who: 'him' as const, ap: 2, baju: '#7FA48D', x: 330, y: 1780 },
    { who: 'her' as const, ap: 1, baju: '#E3B58A', x: 780, y: 1740 },
    { who: 'him' as const, ap: 0, baju: '#8EA0B5', x: 900, y: 1780 },
    { who: 'her' as const, ap: 7, baju: '#C7B7D6', x: 1030, y: 1750 },
    { who: 'him' as const, ap: 2, baju: '#D8B66E', x: 450, y: 1700 },
    { who: 'her' as const, ap: 4, baju: '#A9C8C2', x: 640, y: 1700 },
  ];
  return (
    <g data-crowd="aksi-balai">
      {/* barisan belakang (kecil, di jalan dekat pagar) */}
      {Array.from({ length: Math.round(n * 1.6) }, (_, i) => (
        <Person key={`b${i}`} who={i % 2 ? 'her' : 'him'} appearance={[0, 4, 2, 1, 7][i % 5]} shirtColor={['#B98B7A', '#8FA9C0', '#9DBA9A', '#D8B66E', '#C7B7D6'][i % 5]} x={-80 + i * 95} y={1600 + (i % 3) * 18} s={0.78} f={f + i * 5} view="three" dir={i % 2 ? -1 : 1} gazeY={-0.2} role="background" {...Pose(i % 2 ? 'her' : 'him', 'santai')} />
      ))}
      {orang.slice(0, n).map((q, i) => (
        <Person key={i} who={q.who} appearance={q.ap} shirtColor={q.baju} x={q.x} y={q.y} s={1.15} f={f + 5 * i} dir={q.x < 540 ? 1 : -1} gazeY={-0.3} role="background" mood="annoyed" {...Pose(q.who, q.who === 'him' ? 'melambai' : 'pegangDepanDada')}
          holdRight={i < 3 ? <PosterAksi teks={POSTER[i]} s={0.8} miring={Math.sin(f * 0.16 + i) * (2 + 6 * angkat)} /> : undefined} />
      ))}
    </g>
  );
};
// Teks spanduk = tuntutan tercatat Aliansi Masyarakat Peduli Ujung Kulon (Radar Nusantara/Tuntasmedia), bukan teks asli
// spanduk (belum ditemukan foto/kutipan teksnya; ditanyakan ke pengguna sebelum video).
const TEKS_SPANDUK = ['LINDUNGI HABITAT ASLI BADAK JAWA', 'DI UJUNG KULON · TOLAK PEMINDAHAN'];
const balai = (f: number, kam: Kam, o: { n?: number; buka?: number; naya?: React.ReactNode } = {}) => (
  <g transform={kamT(kam)}>
    <BalaiTN2D f={f} gerbang={0} isi={<>
      {(o.n ?? 0) > 0 && kerumunan(f, o.n ?? 0)}
      {(o.buka ?? 0) > 0 && (
        <g>
          <Person who="him" appearance={0} shirtColor="#7A6A58" x={250} y={1860} s={1.3} f={f} view="three" dir={1} gazeY={-0.2} role="background" mood="annoyed" {...Pose('him', 'melambai')} />
          <Person who="him" appearance={2} shirtColor="#5E7D9A" x={850} y={1860} s={1.3} f={f + 9} view="three" dir={-1} gazeY={-0.2} role="background" mood="annoyed" {...Pose('him', 'melambai')} />
          <Spanduk x0={290} x1={810} y={1430} h={170} teks={TEKS_SPANDUK} buka={o.buka} f={f} id="sp1" />
        </g>
      )}
      {o.naya}
      <Kucing x={1000} y={1890} s={1.1} f={f} pose="duduk" gaze={-0.4} />
    </>} />
  </g>
);

// ---------------------------------------------------------------- COP31
const K_COP: Kam = { zoom: 1.0, cx: 540, cy: 1000 };
const K_COP_DEKAT: Kam = { zoom: 1.35, cx: 540, cy: 1300 };
const cop = (f: number, kam: Kam, o: { meja?: number; sorot?: number; layar?: React.ReactNode; kosong?: number } = {}) => (
  <g transform={kamT(kam)}>
    <RuangKonferensi2D f={f} meja={o.meja} sorot={o.sorot ?? 0.6} kursi={['PEMERINTAH', 'KEMENTERIAN', 'DELEGASI', 'WARGA']} kosong={o.kosong ?? -1} layar={o.layar} />
  </g>
);
const layarBadak = (f: number) => (
  <g>
    <rect x={RK.layar.x} y={RK.layar.y} width={RK.layar.w} height={RK.layar.h} fill="#7FA48D" />
    <Badak x={RK.layar.x + 130} y={RK.layar.y + 160} s={0.32} f={f} id="blayar" />
  </g>
);

// ---------------------------------------------------------------- stempel
const Tanya = ({ x, y, s, muncul }: { x: number; y: number; s: number; muncul: number }) =>
  muncul <= 0 ? null : (
    <g data-sfx="pop" transform={`translate(${x} ${y}) scale(${s * halus(muncul)})`}>
      <circle r="90" fill={P.wine} />
      <text y="44" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="130" fill={P.cream}>?</text>
    </g>
  );

// ---------------------------------------------------------------- adegan per kalimat
export function AdeganPanel({ p, t, f }: { p: number; t: number; f: number }) {
  switch (p) {
    case 0: // takut punah disapu tsunami
      return (
        <g>
          {pesisir(f, kamAntara(K_BADAK, { zoom: 0.85, cx: 900, cy: 1150 }, t), { gelombang: lerp(0, 0.75, halus(di(t, 0.3, 1))), badak: badakKubang(f) })}
          {t > 0.5 && <Callout f={50} a={0} b={999} x={540} y={1400} target={[440, 1180]} text="satu-satunya populasi: 75–100 ekor" size={28} />}
        </g>
      );
    case 1: // COP31 → peta
      if (t < 0.5)
        return (
          <g>
            {cop(f, kamAntara({ zoom: 0.9, cx: 380, cy: 950 }, { zoom: 1.15, cx: 640, cy: 1050 }, t * 2), { layar: layarBadak(f), sorot: 0.8 })}
            <KartuData goyang={f} muncul={di(t, 0.12, 0.3)} x={200} y={1080} w={680} h={300} judul="COP31, 12 November 2026" sumber="Sumber: Kompas, Liputan6, CNN Indonesia">
              <text x={232} y={1170} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>Utusan Khusus Presiden bidang</text>
              <text x={232} y={1212} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>Iklim dan Energi: sebagian badak</text>
              <text x={232} y={1254} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>dipindah ke Alas Purwo</text>
            </KartuData>
          </g>
        );
      return peta(f, di(t, 0.5, 0.95));
    case 2: // terus warganya?
      return (
        <g>
          {pesisir(f, kamAntara({ zoom: 1.1, cx: 900, cy: 1350 }, K_NAYA, t), {
            badak: badakJalan(f, 760, 1700, 1.2),
            warga: <>{wargaKampung(f, 4)}<Kucing x={1600} y={1830} s={1.1} f={f} pose="duduk" gaze={0.4} /></>,
            naya: naya(f, 'annoyed', { pose: t > 0.5 ? 'pinggang' : 'santai', gaze: -0.2 }),
          })}
        </g>
      );
    case 3: // tsunami 2018
      if (t < 0.5)
        return (
          <g>
            {pesisir(f, kamAntara({ zoom: 0.85, cx: 1650, cy: 1150 }, { zoom: 1.15, cx: 1850, cy: 1250 }, t * 2), { malam: 1, gelombang: lerp(0.3, 1, halus(t * 2)) })}
            <Stempel x={540} y={1300} teks="22 DES 2018" muncul={di(t, 0.08, 0.16)} rot={-4} />
          </g>
        );
      return (
        <g>
          {latar(pesisir(f, { zoom: 1.1, cx: lerp(1300, 2500, t), cy: lerp(1200, 1400, t) }, { malam: 0.6, puing: 1 }), 'bl3')}
          <KartuData goyang={f} x={200} y={600} w={680} h={520} judul="Tsunami Selat Sunda, 22 Des 2018" sumber="Sumber: BNPB (via Setkab, Liputan6, Medcom)">
            <text x={240} y={760} fontFamily="Lato" fontWeight="900" fontSize="96" fill={P.wine}>{Math.round(lerp(0, 400, halus(di(t, 0.52, 0.75))))}+</text>
            <text x={240} y={810} fontFamily="Lato" fontWeight="700" fontSize="32" fill={P.ink}>orang meninggal</text>
            <rect x={240} y={850} width={600} height={4} fill={P.line} />
            <g opacity={di(t, 0.8, 0.88)} transform={`translate(${(1 - di(t, 0.8, 0.88)) * 40} 0)`}><text x={240} y={920} fontFamily="Lato" fontWeight="900" fontSize="44" fill={P.ink}>Terbanyak: Pandeglang</text>
            <text x={240} y={970} fontFamily="Lato" fontWeight="700" fontSize="28" fill="#7A7468">wilayah paling parah terdampak</text></g>
          </KartuData>
        </g>
      );
    case 4: // dua rumah, gelombang yang sama
      return (
        <g>
          {pesisir(f, K4(t), { gelombang: lerp(0, 0.6, halus(di(t, 0.5, 0.9))), badak: badakJalan(f, 820, 1760, 1.3, 'makan'), warga: wargaKampung(f, 4, { dekat: true }) })}
          <Callout f={50} a={0} b={999} x={320} y={560} target={keLayar(K4(t), 800, 1500)} text="rumah badak" size={36} />
          {t > 0.5 && <Callout f={50} a={0} b={999} x={640} y={640} target={keLayar(K4(t), 1500, 1180)} text="rumah warga" size={36} />}
        </g>
      );
    case 5: // alat penerima diperbaiki
      return (
        <g>
          <g transform={kamT(kamAntara({ zoom: 0.75, cx: 700, cy: 900 }, { zoom: 1.3, cx: 540, cy: 1080 }, t))}>{posWRS(f, t)}</g>
          <Callout f={50} a={0} b={999} x={540} y={1380} target={[540, 1000]} text="alat penerima · Tanjung Lesung" size={28} />
          {t > 0.5 && <text x={540} y={1460} textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="26" fill="#5A5248">BNPB, 10 Sep 2026: sirene Sumur & Panimbang siap</text>}
        </g>
      );
    case 6: // badak disiapkan rumah baru, warga?
      if (t < 0.5)
        return (
          <g>
            {pesisir(f, { zoom: 0.95, cx: lerp(560, 860, t * 2), cy: 1180 }, { badak: badakJalan(f, lerp(420, 900, t * 2), 1760, 1.4) })}
            <KartuData goyang={f} muncul={di(t, 0.05, 0.2)} x={200} y={560} w={420} h={220} judul="Rumah baru ✓" sumber="Alas Purwo, Jawa Timur">
              <text x={232} y={680} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>disiapkan untuk badak</text>
            </KartuData>
          </g>
        );
      return (
        <g>
          {pesisir(f, kamAntara(K_KAMPUNG, { zoom: 1.3, cx: 1780, cy: 1420 }, di(t, 0.5, 1)), { warga: wargaKampung(f, 4, { gazeY: -0.4 }), naya: naya(f, 'unsure', { pose: 'pinggang', s: 1.6, y: 1760 }) })}
          <Tanya x={540} y={640} s={1.2} muncul={di(t, 0.55, 0.65)} />
        </g>
      );
    case 7: // diumumkan ke dunia sebelum kajian; Kemenhut: masih wacana
      if (t < 0.5)
        return (
          <g>
            {cop(f, kamAntara({ zoom: 1.0, cx: 300, cy: 1100 }, { zoom: 1.35, cx: 760, cy: 1300 }, t * 2), { sorot: 1, layar: layarBadak(f) })}
            <Stempel x={540} y={1300} teks="KAJIAN: BELUM ADA" muncul={di(t, 0.3, 0.38)} />
          </g>
        );
      return (
        <g>
          {latar(cop(f, { zoom: lerp(1.0, 1.4, t), cx: lerp(200, 900, t), cy: 1150 }, { sorot: 0.5 }), 'bl7')}
          <KartuData goyang={f} x={200} y={600} w={680} h={420} judul="Kementerian Kehutanan" sumber="Sumber: Kompas (15 Nov), CNA, CNN Indonesia (20 Nov)">
            <text x={240} y={720} fontFamily="Lato" fontWeight="900" fontSize="54" fill={P.wine}>“Masih wacana.”</text>
            <text x={240} y={790} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>Alas Purwo baru calon habitat;</text>
            <text x={240} y={832} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>tidak dipindah sebelum</text>
            <text x={240} y={874} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>kajian ilmiah lengkap.</text>
          </KartuData>
        </g>
      );
    case 8: // TAPI warga nggak diam
      return (
        <g>
          {balai(f, kamAntara({ zoom: 1.35, cx: 700, cy: 1050 }, K_BALAI_LEBAR, t), { n: Math.round(lerp(0, 8, di(t, 0.15, 0.6))) })}
          {t > 0.5 && <Callout f={50} a={0} b={999} x={540} y={560} target={[540, 800]} text="Balai TN Ujung Kulon · 19 Nov 2026" size={28} />}
        </g>
      );
    case 9: // tuntutan: jaga habitat, jangan dipindah
      return <g>{balai(f, K_BALAI_SPANDUK, { n: 6, buka: lerp(0.1, 1, halus(t)) })}</g>;
    case 10: // dugaan tambang, dibantah
      return (
        <g>
          {latar(pesisir(f, { zoom: 1.1, cx: lerp(400, 1900, t), cy: lerp(1250, 1450, t) }, { badak: badakJalan(f, lerp(500, 1000, t), 1760, 1.2) }), 'bl10')}
          <KartuData goyang={f} muncul={di(t, 0.02, 0.15)} x={200} y={560} w={680} h={440} judul="Dugaan: tambang emas" sumber="Walhi; ESDM (17 Nov); Antam (Katadata, CNA)">
            <text x={240} y={680} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>Konsesi lama di perbatasan</text>
            <text x={240} y={722} fontFamily="Lato" fontWeight="700" fontSize="30" fill={P.ink}>Taman Nasional Ujung Kulon</text>
            <text x={240} y={780} fontFamily="Lato" fontWeight="900" fontSize="28" fill="#7A7468">kaitannya belum terbukti</text>
          </KartuData>
          <Stempel x={400} y={1120} teks="ESDM: BANTAH" muncul={di(t, 0.55, 0.62)} rot={-8} />
          <Stempel x={630} y={1240} teks="ANTAM: BANTAH" muncul={di(t, 0.66, 0.73)} rot={6} />
        </g>
      );
    case 11: // warga tidak pernah diajak bicara
      return (
        <g>
          {cop(f, kamAntara(K_COP, { zoom: 1.5, cx: 1080, cy: 1060 }, t), { meja: 1, kosong: 3, sorot: t > 0.5 ? 1 : 0 })}
          {t > 0.5 && <Callout f={50} a={0} b={999} x={480} y={620} target={[700, 900]} text="tidak pernah diajak bicara" size={34} />}
        </g>
      );
    case 12: // selamatkan semuanya
      return (
        <g>
          {pesisir(f, kamAntara({ zoom: 0.62, cx: 1100, cy: 1250 }, K_DUA_RUMAH, t), {
            gelombang: t < 0.5 ? lerp(0.3, 0.8, halus(t * 2)) : lerp(0.8, 0.35, halus(di(t, 0.5, 0.8))),
            sirene: t > 0.5 ? 1 : 0,
            evakuasi: t > 0.5 ? 1 : 0,
            badak: badakJalan(f, 760, 1760, 1.3, t > 0.5 ? 'jalan' : 'berdiri'),
            warga: wargaKampung(f, 4, { dekat: true, lari: t > 0.5 ? 1 : 0 }),
          })}
        </g>
      );
    case 13: // badaknya, dan orang-orang di sampingnya
      return (
        <g>
          {pesisir(f, kamAntara({ zoom: 1.3, cx: 820, cy: 1460 }, K_DUA_RUMAH, t), {
            sirene: 1,
            evakuasi: 1,
            badak: badakJalan(f, 820, 1760, 1.3, 'makan'),
            warga: <>{wargaKampung(f, 4, { dekat: true })}<Kucing x={1560} y={1900} s={1.4} f={f} pose="duduk" gaze={0.3} /></>,
            naya: naya(f, 'warm', { x: 1400, y: 2060, s: 2.0, megafon: true, dir: -1 }),
          })}
        </g>
      );
  }
  return null;
}

// ---------------------------------------------------------------- film: panel mengikuti narasi
const T = makeTimeline(TL as any);
const N = NARASI.length;
/** kata potong per panel: t = 0,5 jatuh tepat di kata ini (keadaan "akhir" / shot kedua dimulai) */
const POTONG: [string, number?][] = [['disapu'], ['mengusulkan'], ['terus'], ['menewaskan'], ['dan'], ['masih'], ['warganya'], ['kementerian'], ['ratusan'], ['jaga'], ['esdm'], ['warga'], ['selamatkan'], ['dan']];
const MULAI = Array.from({ length: N }, (_, p) => (p === 0 ? 0 : Math.round((T.LE(p - 1) + T.LS(p)) / 2)));
const AKHIR = (p: number) => (p === N - 1 ? T.TOTAL : MULAI[p + 1]);
const CUT = POTONG.map(([w, n], p) => T.W(p, w, n ?? 0));
const panelDi = (f: number) => {
  let p = 0;
  for (let k = 0; k < N; k++) if (f >= MULAI[k]) p = k;
  return p;
};
const tDi = (f: number, p: number) => {
  const s = MULAI[p],
    c = CUT[p],
    e = p === N - 1 ? Math.min(T.TOTAL, T.OUTRO + 20) : AKHIR(p);
  if (f < c) return 0.5 * klamp((f - s) / Math.max(1, c - s));
  return 0.5 + 0.5 * klamp((f - c) / Math.max(1, e - c));
};
/** panel yang berganti tempat/shot di kata potong */
const GANTI = new Set([1, 3, 6, 7]);
export const TOTAL = T.TOTAL;
export const OUTRO = T.OUTRO;
export const MIN_SHOT = MIN;
export const SHOTS: [number, string][] = (() => {
  const out: [number, string][] = [];
  for (let p = 0; p < N; p++) {
    out.push([MULAI[p], `p${p + 1}`]);
    if (GANTI.has(p)) out.push([CUT[p], `p${p + 1}b`]);
  }
  return out;
})();
export const shotAt = (f: number) => ({ shot: SHOTS[shotIndex(SHOTS, f)][1] });

export const Frame = ({ frame }: { frame: number }) => {
  const f = frame;
  const p = panelDi(f);
  const t = tDi(f, p);
  const u = halus((f - MULAI[p]) / Math.max(1, AKHIR(p) - MULAI[p]));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <rect width="1080" height="1920" fill={P.paper} />
      <g transform={`translate(540 1000) scale(${(1 + 0.08 * u).toFixed(4)}) translate(-540 ${(-1000 - 40 * u).toFixed(1)})`}>
        <AdeganPanel p={p} t={t} f={f} />
      </g>
      <Vignette opacity={0.06} />
      {f < OUTRO && <Captions f={f} cues={CUES as Cue[]} metrics={METRICS as Record<string, number>} accent={ACCENT} x={110} y={300} />}
      {f >= OUTRO && <OutroC f={f - OUTRO} cta={CTA} />}
    </svg>
  );
};
