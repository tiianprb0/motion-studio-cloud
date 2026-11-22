// Lokasi bersama: kafe Open Mic (seri stand-up Yan). v1, 7 Nov 2026, asal: projects/syarat-protes-struk-kopi v5.
// Satu dunia: koordinat panggung = bingkai lebar 1080x1920 (lantai panggung y 1420, Yan berdiri di x 540±170).
// Papan OPEN MIC selalu di (540, 700) dinding belakang, skala 0,85; gorden samping kiri x 60–190 dan kanan x 890–1020.
// Shot sedang/dekat adalah kamera yang memperbesar dunia ini, BUKAN latar terpisah — supaya papan dan gorden konsisten.
// Komponen hanya menggambar set; timing cerita (tawa, jalan, tatapan) dikirim lewat props.
import React from 'react';
import { Person, P } from '../../../characters/rig/v1/Character';

type Pt = [number, number];

export const IcedCoffee = ({ s = 1, held = false }: { s?: number; held?: boolean }) => (
  <g transform={`scale(${s}) translate(0 ${held ? 15 : 0})`} data-prop="es-kopi">
    <path d="M-3 -40l5 -16" stroke="#3E6B57" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M-10 -30h20l-3 34h-14Z" fill="#E9DCC6" opacity=".95" />
    <path d="M-9 -16h18l-2 20h-14Z" fill="#B98760" />
    <path d="M-9.5 -25h19l-.5 9h-18Z" fill="#F4ECDD" />
    <rect x="-11.5" y="-33" width="23" height="4.5" rx="2" fill="#F7F1E6" stroke="#D9CDB6" strokeWidth=".8" />
    <rect x="-7" y="-9" width="14" height="7" rx="1.5" fill={P.wine} opacity=".85" />
  </g>
);

export const bricks = (() => {
  const out: React.ReactNode[] = [];
  for (let r = 0; r < 30; r++)
    for (let c = -8; c < 16; c++) {
      const x = c * 140 + (r % 2 ? 70 : 0),
        y = r * 64;
      out.push(<rect key={r + '-' + c} x={x + 4} y={y + 4} width="132" height="56" rx="6" fill="#33413B" opacity={0.45 + 0.35 * Math.abs(Math.sin(r * 7.1 + c * 3.3 + 2))} />);
    }
  return out;
})();
export const Bulbs = ({ f, y, x0, x1, sag }: { f: number; y: number; x0: number; x1: number; sag: number }) => {
  const n = 9;
  return (
    <g data-layer="lampu-gantung">
      <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke="#141C19" strokeWidth="3" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n,
          bx = x0 + (x1 - x0) * t,
          by = y + sag * 4 * t * (1 - t) + 10;
        const tw = 0.85 + 0.15 * Math.sin(f * 0.05 + i * 1.7);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r="22" fill="#FFD98A" opacity={0.18 * tw} />
            <circle cx={bx} cy={by} r="7" fill="#FFE7AE" opacity={tw} />
          </g>
        );
      })}
    </g>
  );
};

// Papan neon OPEN MIC: menempel di dinding panggung yang sama, jadi terlihat di semua shot yang menghadap panggung.
export const OpenMicSign = ({ f, x, y, s = 1, skew = 0 }: { f: number; x: number; y: number; s?: number; skew?: number }) => {
  const fl = 0.9 + 0.1 * Math.sin(f * 0.21) * Math.sin(f * 0.057);
  return (
    <g transform={`translate(${x} ${y}) skewY(${skew}) scale(${s})`} data-prop="papan-open-mic">
      <rect x="-170" y="-60" width="340" height="120" rx="60" fill={P.gold} opacity={0.1 * fl} />
      <rect x="-150" y="-42" width="300" height="84" rx="42" fill="#1A2420" opacity=".55" />
      <rect x="-150" y="-42" width="300" height="84" rx="42" fill="none" stroke={P.gold} strokeWidth="6" opacity={0.9 * fl} />
      <text y="16" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="44" letterSpacing="6" fill={P.gold} opacity={fl}>
        OPEN MIC
      </text>
    </g>
  );
};
export const Silhouette = ({ id, color }: { id: string; color: string }) => (
  <filter id={id} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
    <feFlood floodColor={color} />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>
);
export const WORLD = { floorY: 1420, yanX: 540, yanRange: 170, yanScale: 1.95, sign: [540, 700] as Pt };
// Dunia panggung dilihat dari depan. children = Yan (digambar di koordinat dunia). warm = cahaya hangat penutup.
export function StageWorld({ f, warm = 0, children }: { f: number; warm?: number; children: React.ReactNode }) {
  return (
    <g data-set="panggung-open-mic">
      <rect x="-1200" y="-800" width="3480" height="3600" fill="#1E2824" />
      <g opacity=".82">{bricks}</g>
      <Bulbs f={f} y={560} x0={-300} x1={1380} sag={30} />
      <OpenMicSign f={f} x={540} y={700} s={0.85} />
      {/* lampu sorot dari atas */}
      <path d="M470 -200h140l230 1630H240Z" fill="#FFE9B8" opacity={0.08 + 0.03 * warm} />
      {/* gorden samping (sama di semua shot) */}
      {[
        [60, 190],
        [890, 1020],
      ].map(([a, b], i) => (
        <g key={i} data-prop="gorden">
          <path d={`M${a} -400h${b - a}v1820h${-(b - a)}Z`} fill="#6E3442" />
          <path d={`M${a + 30} -400v1820M${a + 70} -400v1820M${a + 105} -400v1820`} stroke="#5A2A36" strokeWidth="14" opacity=".6" />
          <path d={`M${a} 1380q${(b - a) / 2} 40 ${b - a} 0v40h${-(b - a)}Z`} fill="#5A2A36" opacity=".7" />
        </g>
      ))}
      <rect x="-1200" y="1420" width="3480" height="1400" fill="#2E2621" />
      <path d="M-1200 1560H2280M-1200 1700H2280M-1200 1850H2280" stroke="#26201C" strokeWidth="4" />
      <ellipse cx="540" cy="1428" rx="260" ry="32" fill="#FFE3A6" opacity=".22" />
      <rect x="20" y="1412" width="1040" height="24" rx="4" fill="#8C6A4E" />
      <rect x="20" y="1436" width="1040" height="120" fill="#4A372B" />
      <g data-prop="bangku-panggung">
        <ellipse cx="770" cy="1300" rx="44" ry="10" fill="#8A6A4F" />
        <path d="M770 1308v112M742 1420l28-60 28 60" stroke="#4E3A2C" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M748 1300h12v-18q-6-8-12 0Z" fill="#E6B65F" />
      </g>
      {children}
    </g>
  );
}

// Baris belakang: siluet berdiri beranatomi utuh (leher, dua lengan, dua kaki), makin jauh makin pudar.
const BACK = [
  { x: 70, s: 0.9, ph: 0.3, who: 'him' as const },
  { x: 230, s: 0.92, ph: 1.9, who: 'her' as const },
  { x: 390, s: 0.9, ph: 3.1, who: 'him' as const },
  { x: 560, s: 0.93, ph: 4.4, who: 'her' as const },
  { x: 720, s: 0.9, ph: 5.2, who: 'him' as const },
  { x: 880, s: 0.92, ph: 2.2, who: 'her' as const },
  { x: 1030, s: 0.9, ph: 0.9, who: 'him' as const },
];
const MID = [
  { x: 120, s: 1.15, ph: 2.6, who: 'her' as const },
  { x: 410, s: 1.18, ph: 0.9, who: 'him' as const },
  { x: 650, s: 1.14, ph: 3.8, who: 'her' as const },
  { x: 950, s: 1.17, ph: 1.4, who: 'him' as const },
];
function Silhouettes({ f, q, clap }: { f: number; q: number; clap: boolean }) {
  const row = (list: typeof BACK, y: number, filt: string, lift: number) =>
    list.map((p, i) => {
      const bob = q * lift * Math.abs(Math.sin(f * 0.42 + p.ph * 1.3));
      const idle = Math.sin(f * 0.04 + p.ph);
      const c = clap ? Math.abs(Math.sin(f * 0.55 + p.ph)) : 0;
      const arms = clap ? { left: [-6 - 10 * c, -143] as Pt, right: [6 + 10 * c, -143] as Pt } : { left: [-44, -124] as Pt, right: [44, -124] as Pt };
      return (
        <g key={i} filter={`url(#${filt})`}>
          <Person who={p.who} appearance={i % 3} x={p.x} y={y - bob + idle * 0.4} s={p.s} f={f + i * 37} lean={q * 3 * Math.sin(p.ph)} role="background" body="lama" {...arms} shirtColor="#777" trouserColor="#555" />
        </g>
      );
    });
  return (
    <g data-layer="penonton-siluet">
      <Silhouette id="sil-back" color="#36433D" />
      <Silhouette id="sil-mid" color="#4B5B53" />
      {row(BACK, 1330, 'sil-back', 5)}
      {row(MID, 1440, 'sil-mid', 8)}
    </g>
  );
}
// Wajah tertawa extras: digambar di atas ExtraFace dengan transform yang sama persis dengan rig
// (badan atas: translate(0, drop+napas) rotate(lean); wajah: rotate(head + gaze*2.2) di titik leher).
const LaughFace = ({ who, f, drop, lean, head, gaze, gazeY, dir, amt }: { who: string; f: number; drop: number; lean: number; head: number; gaze: number; gazeY: number; dir: number; amt: number }) => {
  if (amt < 0.25) return null;
  const breath = -0.7 * (0.5 + 0.5 * Math.sin(f * 0.1 + who.length));
  const ey = -4 + Math.max(-1.6, Math.min(3, gazeY * 2.6));
  const open = 0.6 + 0.4 * Math.abs(Math.sin(f * 0.5));
  return (
    <g transform={`translate(0 ${drop + breath}) rotate(${lean} 0 -135)`}>
      <g transform={`translate(${dir * 2} 0) rotate(${head + gaze * 2.2} 0 -279) translate(0 -279)`} data-fx="tawa">
        {[-17, 17].map((x, i) => (
          <g key={i}>
            <ellipse cx={x + gaze * 1.7} cy={ey} rx="7.5" ry="8" fill="#FFF2E8" />
            <path d={`M${x + gaze * 1.7 - 6} ${ey + 1}q6 -7 12 0`} stroke="#423830" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </g>
        ))}
        <ellipse cx="0" cy="20.5" rx="10" ry="4.5" fill="#FFF2E8" />
        <path d={`M-9 16h18q0 ${12 * open} -9 ${12 * open}q-9 0 -9 ${-12 * open}Z`} fill="#9B4A4E" />
        <ellipse cx="0" cy={16 + 9 * open} rx="4" ry={2 * open} fill="#E58C86" />
      </g>
    </g>
  );
};
// Baris depan: detail, duduk di belakang dua meja bundar, menghadap panggung (= kamera).
const FY = 1830,
  FS = 1.75;
const TABLES = [300, 790];
const FRONT = [
  { x: 192, side: 1, app: 0, who: 'her' as const, shirt: '#C9A27E', pants: '#6F7E8C', ph: 0.8 },
  { x: 408, side: -1, app: 1, who: 'him' as const, shirt: '#B98A8A', pants: '#5E5A52', ph: 2.3 },
  { x: 682, side: 1, app: 2, who: 'him' as const, shirt: '#7E8FB0', pants: '#4F5B57', ph: 3.6 },
  { x: 898, side: -1, app: 0, who: 'her' as const, shirt: '#D7B46A', pants: '#7D6E8A', ph: 5.0 },
];
function FrontRow({ f, q, clap }: { f: number; q: number; clap: boolean }) {
  const tableTop = FY - 97 * FS;
  return (
    <g data-layer="penonton-depan">
      {FRONT.map((p, i) => {
        const wave = Math.abs(Math.sin(f * 0.45 + p.ph));
        const bob = q * 10 * wave;
        const c = clap ? Math.abs(Math.sin(f * 0.6 + p.ph)) : 0;
        // tangan sisi meja memegang gelas di meja; tangan lain di pangkuan
        const toTable: Pt = [p.side * 50, -135];
        const lap: Pt = [-p.side * 44, -124];
        const arms = clap
          ? { left: [-6 - 10 * c, -143] as Pt, right: [6 + 10 * c, -143] as Pt }
          : p.side > 0
            ? { left: lap, right: toTable, holdRight: <IcedCoffee s={0.95} held /> }
            : { left: toTable, right: lap, holdLeft: <IcedCoffee s={0.95} held /> };
        const lean = -q * 4 * wave * p.side,
          head = -q * 7 * wave * p.side;
        const gaze = -0.15 * p.side,
          gazeY = -0.4;
        const dir = p.side;
        return (
          <g key={i} data-extra-id={`penonton-depan-${i}`}>
            <path d={`M${p.x - 58} ${FY - 40}h116M${p.x - 50} ${FY - 40}v40M${p.x + 50} ${FY - 40}v40`} stroke="#5A4636" strokeWidth="10" strokeLinecap="round" />
            <path d={`M${p.x - 60} ${FY - 46 - 200}h120v150h-120Z`} fill="#5A4636" />
            <Person who={p.who} appearance={p.app} x={p.x} y={FY - bob} s={FS} pose="sit" seatDrop={20} dir={dir} f={f + i * 53} mood={q > 0.15 ? 'warm' : 'soft'} gaze={gaze} gazeY={gazeY} head={head} lean={lean} role="foreground" body="lama" shirtColor={p.shirt} trouserColor={p.pants} {...arms} />
            <g transform={`translate(${p.x} ${FY - bob}) scale(${FS})`}>
              <LaughFace who={p.who} f={f + i * 53} drop={20} lean={lean} head={head} gaze={gaze} gazeY={gazeY} dir={dir} amt={q} />
            </g>
          </g>
        );
      })}
      {TABLES.map((x, i) => (
        <g key={i} data-prop="meja-kafe">
          {/* meja bertaplak panjang: menutup kaki penonton yang duduk */}
          <path d={`M${x - 196} ${tableTop}Q${x - 214} ${FY + 20} ${x - 222} ${FY + 70}H${x + 222}Q${x + 214} ${FY + 20} ${x + 196} ${tableTop}Z`} fill="#7A3B48" />
          <path d={`M${x - 120} ${tableTop + 30}Q${x - 126} ${FY} ${x - 130} ${FY + 70}M${x} ${tableTop + 30}V${FY + 70}M${x + 120} ${tableTop + 30}Q${x + 126} ${FY} ${x + 130} ${FY + 70}`} stroke="#6A3240" strokeWidth="6" fill="none" />
          <ellipse cx={x} cy={tableTop} rx="198" ry="28" fill="#8E4A58" />
        </g>
      ))}
    </g>
  );
}
export function CrowdView({ f, t, q, clap }: { f: number; t: number; q: number; clap: boolean }) {
  const z = 1 + 0.02 * t;
  return (
    <g data-shot="crowd" transform={`translate(540 1400) scale(${z}) translate(-540 -1400)`}>
      <rect width="1080" height="1920" fill="#28322D" />
      {/* dinding kafe: bar, rak botol, lampu gantung */}
      <rect y="1060" width="1080" height="260" fill="#3B2F28" />
      <rect y="1040" width="1080" height="26" fill="#5B4535" />
      {[...Array(14)].map((_, i) => (
        <rect key={i} x={40 + i * 75} y={960 - (i % 3) * 14} width="22" height={80 + (i % 3) * 14} rx="8" fill={['#4E6B5C', '#6E3442', '#8A6A4F'][i % 3]} opacity=".7" />
      ))}
      <path d="M0 960h1080" stroke="#4A3A30" strokeWidth="10" />
      {[180, 540, 900].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 520v190`} stroke="#141C19" strokeWidth="3" />
          <path d={`M${x - 40} 740q40-45 80 0Z`} fill="#D1A258" />
          <ellipse cx={x} cy="745" rx="70" ry="22" fill="#FFE3A6" opacity=".25" />
        </g>
      ))}
      {/* papan kapur OPEN MIC di dinding bar (identitas acara tetap terlihat dari arah panggung) */}
      <g transform="translate(790 870) rotate(-3)" data-prop="papan-kapur-open-mic">
        <rect x="-120" y="-62" width="240" height="124" rx="10" fill="#5B4535" />
        <rect x="-108" y="-50" width="216" height="100" rx="6" fill="#26302B" />
        <text y="-6" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="30" letterSpacing="4" fill="#F1E6CF">OPEN MIC</text>
        <text y="30" textAnchor="middle" fontFamily="Lato" fontWeight="700" fontSize="20" letterSpacing="2" fill={P.gold}>MALAM INI</text>
      </g>
      <Bulbs f={f} y={600} x0={-40} x1={1120} sag={26} />
      <rect y="1320" width="1080" height="600" fill="#2E2621" />
      <Silhouettes f={f} q={q} clap={clap} />
      {/* cahaya panggung dari arah kamera ke penonton */}
      <radialGradient id="crowd-light" cx="50%" cy="85%" r="60%">
        <stop offset="0" stopColor="#FFE3A6" stopOpacity=".22" />
        <stop offset="1" stopColor="#FFE3A6" stopOpacity="0" />
      </radialGradient>
      <rect width="1080" height="1920" fill="url(#crowd-light)" />
      <FrontRow f={f} q={q} clap={clap} />
    </g>
  );
}


// Penonton di kiri bawah (siluet punggung), dinding bata dalam perspektif, papan OPEN MIC miring.
// Jalan kiri-kanan di panggung terbaca sebagai mendekat/menjauh: skala ikut berubah sedikit.
export function SideView({ f, t, q, children }: { f: number; t: number; q: number; children: React.ReactNode }) {
  const z = 1.0 + 0.04 * t;
  return (
    <g data-shot="side" transform={`translate(560 1300) scale(${z}) translate(-560 -1300)`}>
      <rect width="1080" height="1920" fill="#1B2420" />
      <g transform="translate(0 -40) skewY(-9)" opacity=".75">{bricks}</g>
      <OpenMicSign f={f} x={330} y={700} s={0.95} skew={-9} />
      <Bulbs f={f} y={520} x0={-60} x1={1140} sag={70} />
      {/* tirai di sisi kanan (sayap panggung, dekat kamera) */}
      <path d="M1080 0h-170q-40 960 10 1920h160Z" fill="#6E3442" />
      <path d="M960 0q-30 960 6 1920M1030 0q-14 960 4 1920" stroke="#5A2A36" strokeWidth="18" fill="none" opacity=".6" />
      {/* lantai panggung miring */}
      <path d="M-40 1500L1120 1390V1920H-40Z" fill="#3A2E25" />
      <path d="M-40 1500L1120 1390" stroke="#8C6A4E" strokeWidth="14" />
      <path d="M200 1478L1120 1430M-40 1560L1120 1500M-40 1680L1120 1600" stroke="#2F251E" strokeWidth="4" />
      <ellipse cx="690" cy="1452" rx="260" ry="34" fill="#FFE3A6" opacity=".2" />
      <path d="M560 0h160l220 1450H420Z" fill="#FFE9B8" opacity=".07" />
      {/* Yan di titik dunia (690, 1452), skala dasar 2,55 */}
      {children}
      {/* penonton paling depan, punggung ke kamera (siluet), ikut terguncang saat tertawa */}
      <Silhouette id="sil-front" color="#121916" />
      <g filter="url(#sil-front)">
        {[
          { x: 70, y: 2060, s: 2.7, who: 'him' as const, ph: 0.4 },
          { x: 300, y: 2120, s: 2.9, who: 'her' as const, ph: 2.1 },
        ].map((p, i) => (
          <Person key={i} who={p.who} appearance={i} x={p.x} y={p.y - q * 8 * Math.abs(Math.sin(f * 0.42 + p.ph))} s={p.s} f={f + i * 41} pose="sit" seatDrop={20} role="background" body="lama" left={[-44, -124]} right={[44, -124]} shirtColor="#777" trouserColor="#555" />
        ))}
      </g>
    </g>
  );
}

// Gambar khusus dari atas: kepala (rambut), bahu, lengan pendek, gelas & mic terlihat sebagai lingkaran.
const TopPerson = ({ x, y, rot, hair, shirt, s = 1, cup, mic, bob = 0 }: { x: number; y: number; rot: number; hair: string; shirt: string; s?: number; cup?: Pt; mic?: boolean; bob?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (1 + 0.04 * bob)})`} data-top-person="true">
    <ellipse cx="4" cy="6" rx="62" ry="40" fill="#000" opacity=".22" />
    {/* lengan: dari bahu ke tangan (ke depan = sumbu +y) */}
    {mic && <path d="M34 0Q46 22 22 46" stroke={shirt} strokeWidth="17" fill="none" strokeLinecap="round" />}
    {mic && <circle cx="20" cy="50" r="9" fill={P.skin} />}
    {mic && <circle cx="14" cy="64" r="8" fill="#3A3A3A" />}
    {cup && <path d={`M-34 0Q${cup[0] - 8} ${cup[1] / 2} ${cup[0]} ${cup[1] - 6}`} stroke={shirt} strokeWidth="17" fill="none" strokeLinecap="round" />}
    {cup && <circle cx={cup[0]} cy={cup[1]} r="13" fill="#B98760" stroke="#F1E8D8" strokeWidth="4" />}
    {cup && <path d={`M${cup[0] + 2} ${cup[1] - 2}l12 -10`} stroke="#3E6B57" strokeWidth="3" strokeLinecap="round" />}
    {!mic && !cup && <path d="M-34 0Q-40 26 -18 40M34 0Q40 26 18 40" stroke={shirt} strokeWidth="16" fill="none" strokeLinecap="round" />}
    <rect x="-46" y="-20" width="92" height="40" rx="20" fill={shirt} />
    <circle cx="0" cy="2" r="27" fill={hair} />
    <ellipse cx="0" cy="22" rx="12" ry="6" fill={P.skin} opacity=".9" />
  </g>
);
const TOP_TABLES = [
  { x: 250, y: 1390, seats: [[-1, 0], [0.2, 1], [1, 0.2]] },
  { x: 820, y: 1370, seats: [[-1, 0.3], [0, 1], [1, 0]] },
  { x: 160, y: 1800, seats: [[1, 0.1], [-0.4, 1]] },
  { x: 540, y: 1720, seats: [[-1, 0], [1, 0.4], [0, 1]] },
  { x: 930, y: 1820, seats: [[-1, -0.3], [0.1, 1]] },
];
const HAIRS = ['#3B2A22', '#5A4030', '#2A2622', '#6B4A33', '#1F1D1B', '#4B3B30'];
const SHIRTS = ['#C9A27E', '#B98A8A', '#7E8FB0', '#D7B46A', '#9C8FB5', '#A7B48B', '#C78F6A'];
export function TopView({ f, t, q, p, face }: { f: number; t: number; q: number; p: number; face: number }) {
  const z = 1.1 - 0.1 * t; // pelan menjauh: ruangan makin terlihat utuh
  const YY = 860; // posisi Yan (dunia), di bawah area subtitle
  const yx = 540 + p * 170; // p = posisi jalan Yan (-1..1), face = rotasi tubuh (0 = menghadap penonton)
  return (
    <g data-shot="top" transform={`translate(540 1000) rotate(${-2 + 3 * t}) scale(${z}) translate(-540 -1000)`}>
      <rect x="-300" y="-300" width="1680" height="2520" fill="#2B2420" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x="-300" y={-300 + i * 110} width="1680" height="106" fill={i % 2 ? '#3A2E26' : '#362B23'} />
      ))}
      <g transform="translate(0 420)">
        <rect x="-300" y="-720" width="1680" height="840" fill="#1E2824" />
        <path d="M-300 120h1680" stroke="#6E3442" strokeWidth="36" />
        {/* gorden samping di dua sudut panggung (sama dengan shot depan) */}
        <path d="M40 120h120v190q-60 24 -120 0Z" fill="#6E3442" />
        <path d="M1040 120h-120v190q60 24 120 0Z" fill="#6E3442" />
        <path d="M40 140h1000v420q-500 260 -1000 0Z" fill="#4A372B" />
        <path d="M40 560q500 260 1000 0" stroke="#8C6A4E" strokeWidth="14" fill="none" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${100 + i * 110} 140v${440 + 120 * Math.sin((Math.PI * (i + 0.5)) / 9)}`} stroke="#3E2F25" strokeWidth="4" />
        ))}
        <circle cx="860" cy="250" r="44" fill="#8A6A4F" />
        <circle cx="850" cy="242" r="22" fill="#FFD98A" opacity=".2" />
        <circle cx="850" cy="242" r="8" fill="#E6B65F" />
      </g>
      <ellipse cx={yx} cy={YY} rx="230" ry="200" fill="#FFE3A6" opacity=".2" />
      <TopPerson x={yx} y={YY} rot={face} hair={P.ink} shirt="#95B8A2" s={2.1} mic cup={[-44, 34]} />
      {TOP_TABLES.map((tb, i) => (
        <g key={i} data-prop="meja-kafe-atas">
          {tb.seats.map(([sx, sy], j) => {
            const k = i * 3 + j;
            const px = tb.x + sx * 150,
              py = tb.y + sy * 150;
            const rot = (Math.atan2(yx - px, -(YY - py)) * 180) / Math.PI; // menghadap panggung
            const bob = q * Math.abs(Math.sin(f * 0.45 + k));
            return <TopPerson key={j} x={px} y={py} rot={180 + rot + bob * 6 * Math.sin(k)} hair={HAIRS[k % 6]} shirt={SHIRTS[k % 7]} s={1.45} bob={bob} />;
          })}
          <circle cx={tb.x + 6} cy={tb.y + 8} r="100" fill="#000" opacity=".2" />
          <circle cx={tb.x} cy={tb.y} r="96" fill="#8E4A58" />
          <circle cx={tb.x} cy={tb.y} r="76" fill="none" stroke="#7A3B48" strokeWidth="4" />
          {[[-30, -20], [26, 16], [-6, 34]].slice(0, 2 + (i % 2)).map(([cx, cy], j) => (
            <g key={j}>
              <circle cx={tb.x + cx} cy={tb.y + cy} r="14" fill="#B98760" stroke="#F1E8D8" strokeWidth="4" />
              <path d={`M${tb.x + cx + 2} ${tb.y + cy - 2}l14 -12`} stroke="#3E6B57" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ))}
        </g>
      ))}
      {[[-100, 1180, 1180, 1120], [-100, 1560, 1180, 1620]].map(([x0, y0, x1, y1], i) => (
        <g key={i}>
          <path d={`M${x0} ${y0}L${x1} ${y1}`} stroke="#141C19" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, j) => {
            const u = (j + 0.5) / 10,
              bx = x0 + (x1 - x0) * u,
              by = y0 + (y1 - y0) * u;
            return (
              <g key={j}>
                <circle cx={bx} cy={by} r="26" fill="#FFD98A" opacity=".14" />
                <circle cx={bx} cy={by} r="8" fill="#FFE7AE" />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}