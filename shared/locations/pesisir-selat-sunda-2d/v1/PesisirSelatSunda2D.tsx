// Lokasi bersama: PESISIR SELAT SUNDA (Pandeglang, Banten), panggung flat 2D dari darat menghadap laut (v1, 21 Nov 2026).
// Dibuat untuk "Badaknya Diselamatkan, Warganya?" (relokasi badak Jawa): satu pantai yang sama menjadi rumah badak (hutan
// Taman Nasional Ujung Kulon, kiri) dan rumah warga (kampung nelayan, kanan), menghadap laut yang sama dengan Anak
// Krakatau berasap di cakrawala. Kamera berdiri di darat dan menghadap laut (utara-barat); kiri = hutan, kanan = kampung.
// Dunia lebar x −200..2600, y 0..1920; kamera = transform di proyek (geser cx untuk menyusuri hutan → kampung).
//   PESISIR.cakrawala 800 (laut bertemu langit), PESISIR.pantai 1120 (garis air), PESISIR.batasTN x pemisah hutan/kampung
//   PESISIR.kubang {x,y} kubangan lumpur badak, PESISIR.lantaiHutan / lantaiKampung (y kaki tokoh dekat, skala ±1,6–2)
//   skalaPesisir(y) skala rig/badak di kedalaman y (175 px/m × s; 1,0 di y 1500)
// Prop:
//   f          waktu (ombak, asap Anak Krakatau, burung, daun)
//   gelombang  0..1 dinding gelombang tsunami naik di laut (metafora ancaman; 1 = setinggi pohon kelapa, belum menyentuh darat)
//   malam      0..1 langit malam + rumah gelap (tsunami 22 Des 2018 terjadi malam)
//   puing      0..1 kampung rusak: atap runtuh, dinding patah, perahu terbalik, kelapa miring (tanpa korban digambar)
//   sirene     0..1 menara sirene menyala (lampu + gelombang bunyi)
//   evakuasi   0..1 papan + panah jalur evakuasi muncul di jalan kampung
//   isiHutan   lapisan di lantai hutan (badak), di belakang semak depan
//   isiKampung lapisan di jalan kampung (warga, Naya)
//   isiDepan   lapisan paling depan
// Tulisan satu-satunya: papan "TAMAN NASIONAL UJUNG KULON" (kayu, tanpa logo) di batas hutan dan warung "WARUNG IKAN".
import React from 'react';
import { MenaraSirene, PapanEvakuasi } from '../../../props/peringatan-dini/v1/PeringatanDini';

export const PESISIR = {
  cakrawala: 800,
  pantai: 1120,
  batasTN: 1130,
  kubang: { x: 520, y: 1640 },
  lantaiHutan: 1720,
  lantaiKampung: 1760,
  rumahY: 1360,
  sirene: { x: 2380, y: 1372 },
  krakatau: { x: 1330, y: 800 },
};
export const skalaPesisir = (y: number) => Math.max(0.15, (y - 1000) / 500);

const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const campur = (a: string, b: string, t: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('')}`;
};

/** pohon hutan dataran rendah: batang tinggi + tajuk berlapis */
function PohonHutan({ x, y, s, seed, warna = '#4F7A55', malam = 0 }: { x: number; y: number; s: number; seed: number; warna?: string; malam?: number }) {
  const t = (8 + rnd(seed) * 6) * 175 * s;
  const lebar = (3 + rnd(seed + 3) * 2.5) * 175 * s;
  const daun = campur(warna, '#1E2A2C', malam * 0.7);
  const gelap = campur(daun, '#000000', 0.25);
  const terang = campur(daun, '#FFFFFF', 0.12);
  return (
    <g>
      <path d={`M${x - 14 * s} ${y} C${x - 10 * s} ${y - t * 0.5} ${x - 6 * s} ${y - t * 0.7} ${x} ${y - t * 0.78} C${x + 6 * s} ${y - t * 0.7} ${x + 12 * s} ${y - t * 0.5} ${x + 16 * s} ${y} Z`} fill={campur('#6A5444', '#1E2224', malam * 0.6)} />
      <path d={`M${x} ${y - t * 0.55} L${x - lebar * 0.3} ${y - t * 0.75} M${x} ${y - t * 0.62} L${x + lebar * 0.28} ${y - t * 0.8}`} stroke={campur('#6A5444', '#1E2224', malam * 0.6)} strokeWidth={8 * s} />
      {[
        [0, 0.92, 0.55],
        [-0.28, 0.8, 0.42],
        [0.3, 0.82, 0.44],
        [-0.12, 1.0, 0.38],
        [0.16, 0.98, 0.36],
      ].map(([dx, h, r], i) => (
        <g key={i}>
          <ellipse cx={x + dx * lebar} cy={y - t * h + 10 * s} rx={lebar * r} ry={lebar * r * 0.62} fill={gelap} />
          <ellipse cx={x + dx * lebar} cy={y - t * h} rx={lebar * r * 0.96} ry={lebar * r * 0.56} fill={daun} />
          <ellipse cx={x + dx * lebar - lebar * r * 0.25} cy={y - t * h - lebar * r * 0.2} rx={lebar * r * 0.45} ry={lebar * r * 0.22} fill={terang} opacity=".5" />
        </g>
      ))}
    </g>
  );
}

/** langkap (Arenga obtusifolia): palem berpelepah menjuntai, tumbuh rapat di Ujung Kulon */
function Langkap({ x, y, s, f, seed, malam = 0 }: { x: number; y: number; s: number; f: number; seed: number; malam?: number }) {
  const t = (4 + rnd(seed) * 2) * 175 * s;
  const daun = campur('#5E8A4E', '#1E2A2C', malam * 0.7);
  const goyang = Math.sin(f * 0.05 + seed) * 4;
  return (
    <g>
      <path d={`M${x - 10 * s} ${y} L${x - 6 * s} ${y - t} L${x + 6 * s} ${y - t} L${x + 10 * s} ${y} Z`} fill={campur('#7B6A52', '#1E2224', malam * 0.6)} />
      {Array.from({ length: 4 }, (_, k) => (
        <path key={`b${k}`} d={`M${x - 9 * s} ${y - t * (0.2 + k * 0.2)} h${18 * s}`} stroke="#5E5040" strokeWidth={3 * s} opacity=".5" />
      ))}
      {Array.from({ length: 9 }, (_, k) => {
        const sud = -170 + k * 20 + goyang;
        const r = (1.8 + rnd(seed + k) * 0.6) * 175 * s;
        const ex = x + Math.cos((sud * Math.PI) / 180) * r;
        const ey = y - t + Math.sin((sud * Math.PI) / 180) * r * 0.55 + r * 0.45;
        const cx = x + Math.cos((sud * Math.PI) / 180) * r * 0.55;
        const cy = y - t - r * 0.35;
        return (
          <g key={k}>
            <path d={`M${x} ${y - t} Q${cx} ${cy} ${ex} ${ey}`} stroke={daun} strokeWidth={5 * s} fill="none" />
            {Array.from({ length: 7 }, (_, j) => {
              const u = 0.25 + j * 0.1;
              const px = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * cx + u * u * ex;
              const py = (1 - u) * (1 - u) * (y - t) + 2 * (1 - u) * u * cy + u * u * ey;
              return <path key={j} d={`M${px} ${py} l${-14 * s} ${34 * s} M${px} ${py} l${14 * s} ${34 * s}`} stroke={daun} strokeWidth={4 * s} />;
            })}
          </g>
        );
      })}
    </g>
  );
}

/** kelapa pantai */
function Kelapa({ x, y, s, f, miring = 0, seed = 0, malam = 0 }: { x: number; y: number; s: number; f: number; miring?: number; seed?: number; malam?: number }) {
  const t = 9 * 175 * s;
  const tx = x + (40 + miring * 260) * s,
    ty = y - t * (1 - miring * 0.25);
  const daun = campur('#6E9A55', '#1E2A2C', malam * 0.7);
  return (
    <g>
      <path d={`M${x - 12 * s} ${y} Q${x + 10 * s} ${y - t * 0.5} ${tx - 6 * s} ${ty} L${tx + 6 * s} ${ty} Q${x + 24 * s} ${y - t * 0.5} ${x + 12 * s} ${y} Z`} fill={campur('#8A7558', '#1E2224', malam * 0.6)} />
      {Array.from({ length: 8 }, (_, k) => {
        const sud = -180 + k * 26 + Math.sin(f * 0.06 + k + seed) * 5;
        const r = 2.6 * 175 * s;
        const ex = tx + Math.cos((sud * Math.PI) / 180) * r;
        const ey = ty + Math.abs(Math.sin((sud * Math.PI) / 180)) * -r * 0.25 + r * 0.55;
        return <path key={k} d={`M${tx} ${ty} Q${(tx + ex) / 2} ${ty - r * 0.35} ${ex} ${ey}`} stroke={daun} strokeWidth={14 * s} fill="none" strokeLinecap="round" />;
      })}
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={tx - 10 * s + k * 10 * s} cy={ty + 12 * s} r={9 * s} fill="#7A6A3A" />
      ))}
    </g>
  );
}

/** rumah kampung pesisir: dinding bata dicat / papan, atap genteng, teras */
function Rumah({ x, y, s, dinding, atap, pintu = '#7B5A40', papan = false, rusak = 0, malam = 0, seed = 0, label }: { x: number; y: number; s: number; dinding: string; atap: string; pintu?: string; papan?: boolean; rusak?: number; malam?: number; seed?: number; label?: string }) {
  const W = 6.4 * 175 * s,
    H = 3.0 * 175 * s,
    A = 2.0 * 175 * s;
  const d = campur(dinding, '#2A3036', malam * 0.65);
  const a = campur(atap, '#1F2226', malam * 0.6);
  const runtuh = rusak > 0.5;
  return (
    <g data-benda="rumah">
      <ellipse cx={x} cy={y + 4} rx={W * 0.56} ry={14 * s} fill="#000" opacity=".12" />
      {/* dinding */}
      {!runtuh ? (
        <rect x={x - W / 2} y={y - H} width={W} height={H} fill={d} />
      ) : (
        <path d={`M${x - W / 2} ${y} V${y - H * 0.7} L${x - W * 0.3} ${y - H * 0.85} L${x - W * 0.1} ${y - H * 0.4} L${x + W * 0.12} ${y - H * 0.55} L${x + W * 0.3} ${y - H * 0.2} L${x + W / 2} ${y - H * 0.3} V${y} Z`} fill={d} />
      )}
      {papan && !runtuh && Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${x - W / 2} ${y - H + (k + 1) * (H / 10)}H${x + W / 2}`} stroke={campur(d, '#000000', 0.18)} strokeWidth={2 * s} />)}
      <rect x={x - W / 2} y={y - H * 0.16} width={W} height={H * 0.16} fill={campur(d, '#000000', 0.12)} />
      {/* atap genteng */}
      {!runtuh ? (
        <g>
          <path d={`M${x - W / 2 - 40 * s} ${y - H} L${x - W * 0.22} ${y - H - A} L${x + W * 0.22} ${y - H - A} L${x + W / 2 + 40 * s} ${y - H} Z`} fill={a} />
          {Array.from({ length: 6 }, (_, k) => (
            <path key={k} d={`M${x - W / 2 - 40 * s + k * 14 * s} ${y - H - (k * A) / 6} H${x + W / 2 + 40 * s - k * 14 * s}`} stroke={campur(a, '#000000', 0.2)} strokeWidth={2.5 * s} />
          ))}
          <rect x={x - W / 2 - 40 * s} y={y - H - 6 * s} width={W + 80 * s} height={10 * s} fill={campur(a, '#000000', 0.3)} />
        </g>
      ) : (
        <g>
          <path d={`M${x - W / 2 - 30 * s} ${y - H * 0.7} L${x - W * 0.1} ${y - H * 1.05} L${x + W * 0.05} ${y - H * 0.55} Z`} fill={a} />
          <path d={`M${x + W * 0.05} ${y - 10 * s} L${x + W * 0.4} ${y - H * 0.5} L${x + W * 0.6} ${y - 10 * s} Z`} fill={campur(a, '#000000', 0.15)} />
        </g>
      )}
      {/* pintu + jendela */}
      {!runtuh && (
        <g>
          <rect x={x - W * 0.08} y={y - H * 0.78} width={W * 0.16} height={H * 0.62} fill={campur(pintu, '#1A1C1E', malam * 0.6)} />
          {[-0.32, 0.3].map((k, i) => (
            <g key={i}>
              <rect x={x + k * W - W * 0.09} y={y - H * 0.78} width={W * 0.18} height={H * 0.36} fill={malam > 0.5 ? '#2A2F35' : '#CFE3EA'} stroke={campur('#F4EBDA', '#3A3F44', malam)} strokeWidth={6 * s} />
              <path d={`M${x + k * W} ${y - H * 0.78}V${y - H * 0.42}`} stroke={campur('#F4EBDA', '#3A3F44', malam)} strokeWidth={4 * s} />
            </g>
          ))}
          {label && (
            <g>
              <rect x={x - W * 0.28} y={y - H - 64 * s} width={W * 0.56} height={52 * s} rx={6 * s} fill={campur('#FFF6E3', '#3A3F44', malam)} />
              <text x={x} y={y - H - 28 * s} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={30 * s} fill={campur('#2F6E8A', '#1E2226', malam)}>{label}</text>
            </g>
          )}
        </g>
      )}
      {/* puing di kaki rumah */}
      {rusak > 0 &&
        Array.from({ length: 9 }, (_, k) => (
          <rect key={k} x={x - W * 0.6 + rnd(seed + k) * W * 1.2} y={y - 8 * s - rnd(seed + k + 9) * 30 * s} width={(30 + rnd(seed + k * 3) * 60) * s} height={10 * s} fill={k % 3 ? '#8A6A4E' : a} transform={`rotate(${(rnd(seed + k * 7) - 0.5) * 50} ${x} ${y})`} opacity={rusak} />
        ))}
    </g>
  );
}

/** perahu nelayan cadik di pasir */
function Perahu({ x, y, s, warna, terbalik = false }: { x: number; y: number; s: number; warna: string; terbalik?: boolean }) {
  const L = 6 * 175 * s;
  return (
    <g transform={terbalik ? `rotate(172 ${x} ${y - 30 * s})` : undefined}>
      <ellipse cx={x} cy={y + 4} rx={L * 0.5} ry={10 * s} fill="#000" opacity=".12" />
      <path d={`M${x - L / 2} ${y - 60 * s} Q${x} ${y + 20 * s} ${x + L / 2} ${y - 70 * s} L${x + L / 2 - 30 * s} ${y - 60 * s} Q${x} ${y - 20 * s} ${x - L / 2 + 30 * s} ${y - 52 * s} Z`} fill={warna} />
      <path d={`M${x - L / 2 + 20 * s} ${y - 54 * s} Q${x} ${y - 8 * s} ${x + L / 2 - 20 * s} ${y - 62 * s}`} stroke="#FFF6E3" strokeWidth={8 * s} fill="none" />
      <path d={`M${x - L * 0.3} ${y - 40 * s} V${y - 110 * s} M${x + L * 0.25} ${y - 42 * s} V${y - 110 * s} M${x - L * 0.45} ${y - 110 * s} H${x + L * 0.42}`} stroke="#7B6A52" strokeWidth={6 * s} />
    </g>
  );
}

/** rak jemur ikan asin (para-para) */
function Jemuran({ x, y, s }: { x: number; y: number; s: number }) {
  const W = 3 * 175 * s,
    H = 0.9 * 175 * s;
  return (
    <g data-benda="jemuran-ikan">
      {[-0.45, 0.45].map((k, i) => (
        <path key={i} d={`M${x + k * W} ${y} V${y - H}`} stroke="#7B6A52" strokeWidth={8 * s} />
      ))}
      <path d={`M${x - W / 2 - 10 * s} ${y - H} H${x + W / 2 + 10 * s} L${x + W / 2 - 20 * s} ${y - H - 30 * s} H${x - W / 2 + 20 * s} Z`} fill="#B79C74" />
      {Array.from({ length: 12 }, (_, k) => (
        <ellipse key={k} cx={x - W / 2 + 30 * s + k * (W - 60 * s) / 11} cy={y - H - 16 * s} rx={16 * s} ry={6 * s} fill={k % 2 ? '#D7CBB4' : '#C9B994'} />
      ))}
    </g>
  );
}

export function PesisirSelatSunda2D({ f = 0, gelombang = 0, malam = 0, puing = 0, sirene = 0, evakuasi = 0, isiHutan, isiKampung, isiDepan, id = 'pss' }: { id?: string; f?: number; gelombang?: number; malam?: number; puing?: number; sirene?: number; evakuasi?: number; isiHutan?: React.ReactNode; isiKampung?: React.ReactNode; isiDepan?: React.ReactNode }) {
  const C = PESISIR.cakrawala,
    PT = PESISIR.pantai;
  const langitA = campur('#BFE0EC', '#1C2A44', malam),
    langitB = campur('#F4EBD6', '#3A4A66', malam);
  const laut = campur('#5FA3B8', '#1E3448', malam),
    lautDekat = campur('#7DBACB', '#28445A', malam);
  const pasir = campur('#E8D6AE', '#5A5A5E', malam * 0.8);
  const tanahHutan = campur('#6F7F4E', '#25302C', malam * 0.8);
  const tanahKampung = campur('#D9C49A', '#4A4A4E', malam * 0.8);
  const gw = Math.max(0, Math.min(1, gelombang));
  const yG = C - gw * 380; // puncak gelombang
  return (
    <g data-set="pesisir-selat-sunda">
      <defs>
        <linearGradient id={`${id}-langit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={langitA} />
          <stop offset="1" stopColor={langitB} />
        </linearGradient>
        <linearGradient id={`${id}-laut`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={laut} />
          <stop offset="1" stopColor={lautDekat} />
        </linearGradient>
        <linearGradient id={`${id}-gel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={campur('#2E6E86', '#14283A', malam)} />
          <stop offset="1" stopColor={campur('#1F4E66', '#0E1C2A', malam)} />
        </linearGradient>
      </defs>
      {/* langit */}
      <rect x="-400" y="-400" width="3400" height={C + 400} fill={`url(#${id}-langit)`} />
      {malam > 0.3 &&
        Array.from({ length: 40 }, (_, k) => <circle key={k} cx={-200 + rnd(k) * 2800} cy={60 + rnd(k + 50) * 600} r={1.5 + rnd(k + 9) * 2} fill="#FFFFFF" opacity={(malam - 0.3) * (0.5 + 0.5 * Math.sin(f * 0.1 + k))} />)}
      {malam > 0.3 && <circle cx="1900" cy="240" r="46" fill="#F4EBD0" opacity={malam} />}
      {malam < 0.7 &&
        [0, 1, 2, 3, 4].map((k) => {
          const x = ((k * 640 + f * 0.6) % 3200) - 400;
          return (
            <g key={k} opacity={(1 - malam) * 0.85} fill="#FFFFFF">
              <ellipse cx={x} cy={180 + k * 70} rx={120} ry={34} />
              <ellipse cx={x + 70} cy={165 + k * 70} rx={80} ry={30} />
              <ellipse cx={x - 60} cy={188 + k * 70} rx={70} ry={22} />
            </g>
          );
        })}
      {/* Anak Krakatau + pulau kecil */}
      <g data-detail="anak-krakatau">
        <path d={`M${PESISIR.krakatau.x - 230} ${C} L${PESISIR.krakatau.x - 40} ${C - 82} Q${PESISIR.krakatau.x} ${C - 96} ${PESISIR.krakatau.x + 40} ${C - 80} L${PESISIR.krakatau.x + 240} ${C} Z`} fill={campur('#6E6A66', '#2A2C33', malam)} />
        <path d={`M${PESISIR.krakatau.x - 520} ${C} Q${PESISIR.krakatau.x - 430} ${C - 70} ${PESISIR.krakatau.x - 300} ${C} Z`} fill={campur('#7E9A86', '#2A3438', malam)} />
        <path d={`M${PESISIR.krakatau.x + 380} ${C} Q${PESISIR.krakatau.x + 520} ${C - 90} ${PESISIR.krakatau.x + 700} ${C} Z`} fill={campur('#7E9A86', '#2A3438', malam)} />
        {Array.from({ length: 7 }, (_, k) => {
          const u = ((f * 0.012 + k / 7) % 1);
          return <circle key={k} cx={PESISIR.krakatau.x + u * 140 + Math.sin(u * 6 + k) * 20} cy={C - 96 - u * 380} r={20 + u * 70} fill={campur('#9A938A', '#4A4A50', malam)} opacity={(1 - u) * 0.7} />;
        })}
      </g>
      {/* laut */}
      <rect x="-400" y={C} width="3400" height={PT - C + 40} fill={`url(#${id}-laut)`} />
      {Array.from({ length: 14 }, (_, k) => {
        const y = C + 14 + k * k * 1.8;
        const geser = ((f * (1 + k * 0.3)) % 200) - 100;
        return <path key={k} d={`M${-400 + geser} ${y} ${Array.from({ length: 18 }, (_, j) => `q${100} ${-4 - k * 0.4} ${200} 0`).join(' ')}`} stroke="#FFFFFF" strokeWidth={1 + k * 0.25} fill="none" opacity={0.25 + k * 0.02} />;
      })}
      {/* gelombang tsunami (metafora ancaman) */}
      {gw > 0 && (
        <g data-detail="gelombang-tsunami">
          <path d={`M-400 ${C + 40} L-400 ${yG + 60} ${Array.from({ length: 12 }, (_, j) => `Q${-400 + j * 300 + 150} ${yG - 30 + Math.sin(f * 0.1 + j) * 12} ${-400 + (j + 1) * 300} ${yG + 40}`).join(' ')} L3000 ${C + 40} Z`} fill={`url(#${id}-gel)`} />
          {Array.from({ length: 12 }, (_, j) => {
            const cx = -400 + j * 300 + 150;
            const cy = yG - 30 + Math.sin(f * 0.1 + j) * 12;
            return (
              <g key={j}>
                <path d={`M${cx - 150} ${yG + 40} Q${cx - 40} ${cy - 40} ${cx + 60} ${cy + 10} Q${cx + 10} ${cy + 30} ${cx - 20} ${cy + 60}`} fill="#E9F4F6" opacity=".85" />
                {[0, 1, 2].map((k) => (
                  <circle key={k} cx={cx + 20 + k * 30} cy={cy + 20 + k * 6 + Math.sin(f * 0.3 + k + j) * 5} r={6 + k * 2} fill="#FFFFFF" opacity=".8" />
                ))}
              </g>
            );
          })}
          <path d={`M-400 ${yG + 90} H3000`} stroke="#9FD0DD" strokeWidth="4" opacity=".4" />
        </g>
      )}
      {/* pasir pantai */}
      <path d={`M-400 ${PT} ${Array.from({ length: 14 }, (_, j) => `Q${-400 + j * 250 + 125} ${PT - 10 + Math.sin(f * 0.08 + j) * 6} ${-400 + (j + 1) * 250} ${PT}`).join(' ')} L3100 ${PT + 160} L-400 ${PT + 160} Z`} fill={pasir} />
      <path d={`M-400 ${PT + 2} ${Array.from({ length: 14 }, (_, j) => `Q${-400 + j * 250 + 125} ${PT - 12 + Math.sin(f * 0.08 + j) * 6} ${-400 + (j + 1) * 250} ${PT + 2}`).join(' ')}`} stroke="#FFFFFF" strokeWidth="6" fill="none" opacity=".7" />

      {/* ============ HUTAN UJUNG KULON (kiri) ============ */}
      <g data-zona="hutan-ujung-kulon">
        <rect x="-400" y={PT + 100} width={PESISIR.batasTN + 400} height={1600} fill={tanahHutan} />
        {Array.from({ length: 7 }, (_, k) => (
          <PohonHutan key={`p0${k}`} x={-300 + k * 220 + rnd(k) * 80} y={PT + 120} s={0.32} seed={k + 1} warna="#5F8A60" malam={malam} />
        ))}
        {Array.from({ length: 6 }, (_, k) => (
          <PohonHutan key={`p1${k}`} x={-250 + k * 260 + rnd(k + 20) * 90} y={PT + 220} s={0.5} seed={k + 31} warna="#4F7A55" malam={malam} />
        ))}
        {Array.from({ length: 6 }, (_, k) => (
          <Langkap key={`l${k}`} x={-220 + k * 230 + rnd(k + 60) * 70} y={PT + 330 + rnd(k + 5) * 40} s={0.55} f={f} seed={k + 61} malam={malam} />
        ))}
        {/* lantai hutan + akar + serasah */}
        {Array.from({ length: 30 }, (_, k) => (
          <ellipse key={`s${k}`} cx={-380 + rnd(k + 90) * (PESISIR.batasTN + 360)} cy={PT + 420 + rnd(k + 91) * 380} rx={18 + rnd(k) * 30} ry={5} fill={campur('#5A6A3E', '#1E2622', malam)} opacity=".6" />
        ))}
        {Array.from({ length: 9 }, (_, k) => (
          <g key={`ub${k}`}>
            <ellipse cx={-340 + k * 170} cy={PT + 400 + rnd(k + 70) * 40} rx={110} ry={50} fill={campur('#4E7A46', '#1A2420', malam)} />
            <ellipse cx={-310 + k * 170} cy={PT + 385 + rnd(k + 70) * 40} rx={60} ry={30} fill={campur('#679A57', '#1E2A24', malam)} />
          </g>
        ))}
        {/* kubangan lumpur */}
        <ellipse cx={PESISIR.kubang.x} cy={PESISIR.kubang.y} rx="380" ry="60" fill={campur('#6E5A44', '#2A2624', malam)} />
        <ellipse cx={PESISIR.kubang.x - 20} cy={PESISIR.kubang.y - 6} rx="320" ry="40" fill={campur('#806A50', '#302A26', malam)} />
        {isiHutan}
        {/* semak depan hutan */}
        {Array.from({ length: 8 }, (_, k) => (
          <g key={`sm${k}`}>
            <ellipse cx={-360 + k * 200} cy={1880} rx={150} ry={80} fill={campur('#46703F', '#1A2420', malam)} />
            <ellipse cx={-330 + k * 200} cy={1860} rx={90} ry={50} fill={campur('#5A8A4C', '#1E2A24', malam)} />
          </g>
        ))}
      </g>

      {/* ============ KAMPUNG NELAYAN (kanan) ============ */}
      <g data-zona="kampung-nelayan">
        <rect x={PESISIR.batasTN} y={PT + 150} width="2000" height={1600} fill={tanahKampung} />
        {Array.from({ length: 5 }, (_, k) => (
          <g key={`bb${k}`}>
            <ellipse cx={PESISIR.batasTN - 10 + (k % 2) * 30} cy={PESISIR.pantai + 170 + k * 150} rx={90 + k * 12} ry={60 + k * 6} fill={campur('#4E7A46', '#1A2420', malam)} />
            <ellipse cx={PESISIR.batasTN + 20 + (k % 2) * 30} cy={PESISIR.pantai + 155 + k * 150} rx={50 + k * 8} ry={32 + k * 4} fill={campur('#679A57', '#1E2A24', malam)} />
          </g>
        ))}
        <Perahu x={1420} y={PT + 150} s={0.32} warna={campur('#3E7FA0', '#1E2A34', malam)} terbalik={puing > 0.5} />
        <Perahu x={2050} y={PT + 160} s={0.34} warna={campur('#C24E4E', '#2A1E22', malam)} terbalik={puing > 0.5} />
        <Kelapa x={1300} y={PESISIR.rumahY - 20} s={0.42} f={f} miring={puing * 0.5} seed={1} malam={malam} />
        <Kelapa x={1960} y={PESISIR.rumahY - 30} s={0.4} f={f} miring={puing * 0.7} seed={2} malam={malam} />
        <Rumah x={1640} y={PESISIR.rumahY} s={0.5} dinding="#E7C8A0" atap="#B4583E" rusak={puing} malam={malam} seed={3} />
        <Rumah x={2250} y={PESISIR.rumahY + 10} s={0.5} dinding="#A9C8C2" atap="#9C4A38" papan rusak={puing} malam={malam} seed={7} label="WARUNG IKAN" />
        <g transform={`translate(${PESISIR.sirene.x + 260} ${PESISIR.sirene.y})`}>
          <MenaraSirene s={0.45} nyala={sirene} f={f} />
        </g>
        {/* tiang listrik + kabel */}
        <path d={`M1480 ${PESISIR.rumahY + 40} V${PESISIR.rumahY - 640} M1430 ${PESISIR.rumahY - 610} H1530`} stroke={campur('#5E5A55', '#1E2022', malam)} strokeWidth="10" />
        <path d={`M1430 ${PESISIR.rumahY - 610} Q1900 ${PESISIR.rumahY - 520} 2600 ${PESISIR.rumahY - 600}`} stroke="#3E3A36" strokeWidth="2.5" fill="none" />
        {/* jalan kampung berpasir (perspektif: melebar ke depan) */}
        <path d={`M${PESISIR.batasTN - 300} 2600 L1560 ${PESISIR.rumahY + 70} L1900 ${PESISIR.rumahY + 70} L3000 2600 Z`} fill={campur('#CDB68A', '#44444A', malam * 0.8)} />
        <path d={`M1650 ${PESISIR.rumahY + 90} L1100 2600 M1820 ${PESISIR.rumahY + 90} L2700 2600`} stroke={campur('#B89F72', '#3A3A40', malam)} strokeWidth="6" opacity=".6" />
        <Jemuran x={2420} y={1560} s={0.7} />
        {/* jaring, ember, sandal di tepi jalan */}
        <g data-benda="jaring">
          <ellipse cx="1330" cy="1720" rx="120" ry="34" fill={campur('#3E6E6A', '#1E2A2C', malam)} />
          {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${1230 + k * 24} 1700 q12 20 24 0`} stroke={campur('#5E9690', '#2A3A3A', malam)} strokeWidth="3" fill="none" />)}
          <circle cx="1300" cy="1696" r="12" fill="#E8731E" />
          <circle cx="1370" cy="1704" r="10" fill="#E8731E" />
        </g>
        <path d="M2530 1800 l14 -70 h60 l14 70 Z" fill={campur('#3E7FA0', '#1E2A34', malam)} />
        <ellipse cx="2574" cy="1730" rx="30" ry="8" fill={campur('#2E5E78', '#1A2430', malam)} />
        <g fill={campur('#C24E4E', '#2A1E22', malam)}><ellipse cx="2160" cy="1860" rx="22" ry="8" /><ellipse cx="2200" cy="1866" rx="22" ry="8" /></g>
        {/* jalur evakuasi */}
        {evakuasi > 0 && (
          <g opacity={Math.min(1, evakuasi * 1.5)}>
            <g transform={`translate(1420 ${1600 + (1 - evakuasi) * 30})`}>
              <PapanEvakuasi s={0.85} arah={-1} />
            </g>
            {[0, 1, 2].map((k) => (
              <path key={k} transform={`translate(${1760 - k * 90} ${1640 + k * 90}) scale(${1 + k * 0.3}) rotate(200)`} d="M-30 -10 H10 V-22 L34 0 L10 22 V10 H-30 Z" fill="#E8731E" opacity={Math.min(1, evakuasi * 3 - k * 0.6)} />
            ))}
          </g>
        )}
        {puing > 0 &&
          Array.from({ length: 16 }, (_, k) => (
            <rect key={`pg${k}`} x={1250 + rnd(k + 300) * 1300} y={1450 + rnd(k + 301) * 380} width={40 + rnd(k) * 90} height="12" fill={k % 2 ? '#8A6A4E' : '#9C4A38'} transform={`rotate(${(rnd(k + 9) - 0.5) * 60} ${1250 + rnd(k + 300) * 1300} ${1450 + rnd(k + 301) * 380})`} opacity={puing} />
          ))}
        {isiKampung}
      </g>
      <g data-zona="batas">
        {/* papan batas taman nasional */}
          <g data-benda="papan-taman-nasional">
            <rect x={PESISIR.batasTN - 120} y={1460} width="16" height="200" fill="#6A5444" />
            <rect x={PESISIR.batasTN + 104} y={1460} width="16" height="200" fill="#6A5444" />
            <rect x={PESISIR.batasTN - 150} y={1380} width="300" height="120" rx="8" fill={campur('#8A6A4A', '#2A2624', malam * 0.7)} stroke="#5E4632" strokeWidth="6" />
            <text x={PESISIR.batasTN} y={1428} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="26" fill="#F4E9D2">TAMAN NASIONAL</text>
            <text x={PESISIR.batasTN} y={1466} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" fill="#F4E9D2">UJUNG KULON</text>
          </g>
      </g>
      {/* malam: lapisan gelap */}
      {malam > 0 && <rect x="-400" y="-400" width="3400" height="2720" fill="#0E1830" opacity={malam * 0.22} />}
      {isiDepan}
    </g>
  );
}
