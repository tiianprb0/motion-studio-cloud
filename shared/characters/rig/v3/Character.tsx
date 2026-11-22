import React from 'react';
import { SHIRT_LOGO } from './brand-data';
import { ReferenceFace } from './ReferenceFace';
import { ExtraFace } from './ExtraFace';
import { ExtraKepala, ExtraBaju, type ExtraLook } from './ExtraLook';
export type { ExtraLook } from './ExtraLook';
export const P = {
  paper: '#F7F0E4',
  cream: '#FFF9EF',
  ink: '#283D36',
  wine: '#8B4354',
  sage: '#95B8A2',
  pale: '#DEE2D4',
  wood: '#BA906B',
  gold: '#D1A258',
  skin: '#FCEADE',
  girl: '#FCEADE',
  line: '#CFC3AF',
  memory: '#EAD8B9',
  night: '#485850',
};
// v3: warna kulit extras diteruskan lewat context. Nilai bawaan = P.skin, jadi Naya/Yan identik dengan v2.
export const KulitCtx = React.createContext(P.skin);
// v3: lengan panjang untuk extras (warna baju sampai pergelangan). null = lengan pendek seperti v2.
export const LenganCtx = React.createContext<string | null>(null);
export const unit = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const t = unit(x);
  return t * t * (3 - 2 * t);
};
export const ramp = (f: number, a: number, b: number, x = 0, y = 1) =>
  x + (y - x) * smooth((f - a) / (b - a));
export const quick = (f: number, a: number, b: number, x = 0, y = 1) =>
  x + (y - x) * (1 - Math.pow(1 - unit((f - a) / (b - a)), 3));
type Point = [number, number];
export type Actor = {
  hideArms?: boolean;
  seatDrop?: number;
  appearance?: number;
  shirtColor?: string;
  trouserColor?: string;
  helmet?: boolean;
  pose?: 'stand' | 'sit';
  x: number;
  y: number;
  s?: number;
  who?: 'her' | 'him' | 'dad' | 'boy';
  view?: 'front' | 'three' | 'side' | 'back' | 'serong';
  dir?: number;
  mood?: 'annoyed' | 'hurt' | 'thinking' | 'soft' | 'warm' | 'unsure';
  gaze?: number;
  gazeY?: number;
  lean?: number;
  head?: number;
  left?: Point;
  right?: Point;
  step?: number;
  talk?: number;
  f?: number;
  role?: 'principal' | 'foreground' | 'background';
  framing?: 'full' | 'medium' | 'close';
  alpha?: number;
  legs?: 'lama' | 'baru';
  body?: 'lama' | 'baru';
  flush?: { color: string; amt: number };
  holdLeft?: React.ReactNode;
  holdRight?: React.ReactNode;
  raiseLeft?: boolean;
  raiseRight?: boolean;
  elbowDown?: boolean;
  /** v3: tampilan extras baru (shared/characters/extras/v2). Kosongkan untuk Naya/Yan. */
  extra?: ExtraLook;
};
// RIG v3 (9 Nov 2026): sama dengan v2 + jalur `extra` untuk extras baru (wajah/rambut/baju/kulit, file ExtraLook.tsx).
// Jalur Naya/Yan (extra kosong) identik dengan v2. RIG v2 (7 Nov 2026): sama dengan v1 + tampak belakang yang benar (rambut, kerah belakang, tanpa kantong/kancing).
// Saklar contoh badan baru (baju Yan, tangan, leher). Bawaan 'lama' = gambar asli.
// Bentuk tangan contoh: a = bulat besar polos, b = sarung + jempol, c = kartun empat jari.
export const HAND_STYLE: { v: 'a' | 'b' | 'c' } = { v: 'c' };
// Kedip alami: jarak antar kedip acak (2,3-5,3 detik), kadang kedip dua kali.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const naturalBlink = (f: number, seed: number) => {
  let t = seed % 40;
  for (let i = 0; t <= f; i++) {
    if (f >= t && f < t + 3) return true;
    const dbl = hash(seed + i * 7) > 0.72;
    if (dbl && f >= t + 7 && f < t + 9) return true;
    t += 70 + Math.floor(hash(seed + i * 13) * 90);
  }
  return false;
};
export const BODY_STYLE: { v: 'lama' | 'baru' } = { v: 'lama' };

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

// Lengan baru: lengan atas sedikit lebih tebal, lengan baju berbentuk dengan lipatan ujung,
// dan tangan berbentuk sarung (telapak lonjong searah lengan bawah + jempol di sisi dalam).
const NewArm = ({
  sx,
  sy,
  ex,
  ey,
  hx,
  hy,
  side,
  girl,
  cloth,
  warn,
  holding,
}: {
  warn?: string;
  holding?: React.ReactNode;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  hx: number;
  hy: number;
  side: number;
  girl: boolean;
  cloth: string;
}) => {
  const KULIT = React.useContext(KulitCtx);
  const LENGAN = React.useContext(LenganCtx);
  const w = girl ? 12.9 : 13.5;
  const ang = (Math.atan2(hy - ey, hx - ex) * 180) / Math.PI;
  const sl = 0.42;
  const cx = sx + (ex - sx) * sl,
    cy = sy + (ey - sy) * sl;
  const ua = (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;
  return (
    <g data-anatomy="two-bone-arm-v2" data-anatomy-warn={warn || undefined}>
      <path
        d={`M${sx} ${sy}L${ex} ${ey}`}
        stroke={KULIT}
        strokeWidth={w * 1.1}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${sx} ${sy}L${cx} ${cy}`}
        stroke={cloth}
        strokeWidth={girl ? 19 : 23}
        strokeLinecap="round"
        fill="none"
      />
      <g transform={`translate(${cx} ${cy}) rotate(${ua})`}>
        <rect
          x={-3}
          y={girl ? -10 : -12}
          width={6}
          height={girl ? 20 : 24}
          rx={3}
          fill={shade(cloth.startsWith('#') ? cloth : '#95B8A2', 0.88)}
        />
      </g>
      <path
        d={`M${ex} ${ey}L${hx} ${hy}`}
        stroke={KULIT}
        strokeWidth={w * 0.78}
        strokeLinecap="round"
        fill="none"
      />
      {LENGAN && (
        <path
          d={`M${sx} ${sy}L${ex} ${ey}L${hx - (hx - ex) * 0.2} ${hy - (hy - ey) * 0.2}`}
          stroke={LENGAN}
          strokeWidth={w * 1.15}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {holding && (
        <g transform={`translate(${hx} ${hy})`} data-grip="hand-anchor">
          {holding}
        </g>
      )}
      <g
        transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${girl ? 0.7 : 0.76})`}
        data-anatomy={`hand-${HAND_STYLE.v}`}
      >
        {[true, false].map((outline) => {
          const fill = outline ? '#F1CDBC' : KULIT;
          const st = outline
            ? { stroke: '#F1CDBC', strokeWidth: 1.8, strokeLinejoin: 'round' as const }
            : {};
          return (
            <g key={String(outline)}>
              {HAND_STYLE.v === 'a' && <circle cx={4} cy={0} r={10.5} fill={fill} {...st} />}
              {HAND_STYLE.v === 'b' && (
                <>
                  <path
                    d="M-4 -7C2 -10.5 10 -10.5 14 -6.5C17.5 -3 17.5 3 14 6.5C10 10.5 2 10.5 -4 7Z"
                    fill={fill}
                    {...st}
                  />
                  <ellipse
                    cx={5}
                    cy={side * -9}
                    rx={6}
                    ry={3.6}
                    transform={`rotate(${side * -28} 5 ${side * -9})`}
                    fill={fill}
                    {...st}
                  />
                </>
              )}
              {HAND_STYLE.v === 'c' && (
                <>
                  <path d="M-4 -7C1 -10 8 -10 11 -7L11 7C8 10 1 10 -4 7Z" fill={fill} {...st} />
                  {[-5.4, -1.8, 1.8, 5.4].map((y, i) => (
                    <rect
                      key={i}
                      x={8}
                      y={y - 2}
                      width={i === 0 || i === 3 ? 8.5 : 10}
                      height={4}
                      rx={2}
                      fill={fill}
                      {...st}
                    />
                  ))}
                  <ellipse
                    cx={4}
                    cy={side * -9.2}
                    rx={5.6}
                    ry={3.2}
                    transform={`rotate(${side * -30} 4 ${side * -9.2})`}
                    fill={fill}
                    {...st}
                  />
                </>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
};

export const Arm = ({
  side,
  hand,
  girl,
  cloth,
  raise = false,
  elbowDown = false,
  holding,
  occluded = false,
}: {
  occluded?: boolean;
  raise?: boolean;
  elbowDown?: boolean;
  holding?: React.ReactNode;
  side: number;
  hand: Point;
  girl: boolean;
  cloth: string;
}) => {
  const KULIT = React.useContext(KulitCtx);
  const LENGAN = React.useContext(LenganCtx);
  const sx = side * (girl ? 36 : 42),
    sy = girl ? -202 : -209,
    [hx, hy] = hand,
    dx = hx - sx,
    dy = hy - sy,
    d = Math.max(1, Math.hypot(dx, dy));
  const total = Math.max(girl ? 84 : 90, d + 2),
    upper = total * 0.52,
    lower = total * 0.48,
    a = (upper * upper - lower * lower + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, upper * upper - a * a)),
    ux = dx / d,
    uy = dy / d;
  const candidates = [
    [sx + ux * a + uy * h, sy + uy * a - ux * h],
    [sx + ux * a - uy * h, sy + uy * a + ux * h],
  ];
  const score = (p: number[]) =>
    0.6 * (p[1] - sy) + 0.6 * side * p[0] - (side * p[0] < 10 ? 35 : 0);
  const [ex, ey] = elbowDown
    ? candidates[0][1] > candidates[1][1]
      ? candidates[0]
      : candidates[1]
    : score(candidates[0]) > score(candidates[1])
      ? candidates[0]
      : candidates[1];
  // Pemeriksaan anatomi (lihat kontrak 6 Nov 2026): siku di atas bahu, atau tangan melewati panjang lengan.
  // occluded: lengan tersembunyi di balik benda (mis. tembok) dan hanya tangan yang tampil; cek dilewati.
  const warn = occluded
    ? ''
    : [
        !raise && ey < sy - 4
          ? `elbow-above-shoulder(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        // Lengan lurus kaku: siku hampir lurus (>160 derajat) dan tangan setinggi bahu (juga saat diangkat).
        Math.acos(
          Math.max(
            -1,
            Math.min(
              1,
              ((sx - ex) * (hx - ex) + (sy - ey) * (hy - ey)) /
                (Math.hypot(sx - ex, sy - ey) * Math.hypot(hx - ex, hy - ey) || 1),
            ),
          ),
        ) *
          (180 / Math.PI) >
          160 && hy < sy + 45
          ? `straight-arm(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        d > (girl ? 84 : 90) + 2
          ? `over-reach(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'} ${Math.round(((d - (girl ? 84 : 90)) / (girl ? 84 : 90)) * 100)}%)`
          : '',
        // Tangan di balik kepala: rig menggambar wajah di atas lengan, jadi tangan di area kepala tertutup/aneh.
        Math.hypot(hx, hy + 279) < 55
          ? `hand-behind-head(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        // Lengan menyilang badan seperti palang: tangan lewat garis tengah ke sisi lain dengan lengan bawah mendatar.
        side * hx < -10 && (Math.abs(Math.atan2(hy - ey, hx - ex)) * (180 / Math.PI)) % 180 < 30
          ? `cross-body(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        // Lengan bawah mendatar seperti palang di depan perut/dada (tangan dekat garis tengah).
        Math.abs(hx) < 30 &&
        Math.min(
          Math.abs(Math.atan2(hy - ey, hx - ex)) * (180 / Math.PI),
          180 - Math.abs(Math.atan2(hy - ey, hx - ex)) * (180 / Math.PI),
        ) < 20
          ? `bar-arm(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        // Tangan menempel di tengah badan (lengan bawah melilit/menyatu dengan badan dan sulit dibaca),
        // kecuali zona tangan bertaut (bawah, tengah) dan zona berpikir (di bawah dagu).
        Math.abs(hx) < (girl ? 30 : 36) &&
        hy > (girl ? -228 : -232) &&
        hy < -140 &&
        !(Math.abs(hx) <= 16 && hy >= -146) &&
        !(Math.abs(hx) <= 22 && hy <= -212) &&
        !(holding && hy <= -185)
          ? `hand-over-torso(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
        // Siku menjulur terlalu jauh dari badan.
        !raise && Math.abs(ex) > 80
          ? `elbow-out(${girl ? 'Naya' : 'Yan'} ${side < 0 ? 'kiri' : 'kanan'})`
          : '',
      ]
        .filter(Boolean)
        .join(' ');
  if (BODY_STYLE.v === 'baru')
    return (
      <NewArm
        sx={sx}
        sy={sy}
        ex={ex}
        ey={ey}
        hx={hx}
        hy={hy}
        side={side}
        girl={girl}
        cloth={cloth}
        warn={warn}
        holding={holding}
      />
    );
  return (
    <g data-anatomy="two-bone-arm">
      <path
        d={`M${sx} ${sy}L${ex} ${ey}L${hx} ${hy}`}
        stroke={KULIT}
        strokeWidth={girl ? 12.9 : 13.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${sx} ${sy}L${sx + (ex - sx) * 0.38} ${sy + (ey - sy) * 0.38}`}
        stroke={cloth}
        strokeWidth={girl ? 18 : 21}
        strokeLinecap="round"
        fill="none"
      />
      {LENGAN && (
        <path
          d={`M${sx} ${sy}L${ex} ${ey}L${hx - (hx - ex) * 0.18} ${hy - (hy - ey) * 0.18}`}
          stroke={LENGAN}
          strokeWidth={girl ? 15 : 16}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
      <circle cx={hx} cy={hy} r={girl ? 7.8 : 8.2} fill={KULIT} />
    </g>
  );
};

// ---------------------------------------------------------------- kaki baru (contoh)
// Gaya kaki dipilih lewat prop `legs`; bila kosong memakai LEG_STYLE.v ('lama' = kaki asli).
// Kaki baru punya tiga sendi: pinggul -> lutut -> pergelangan, plus sepatu berbentuk
// (tumit membulat, punggung kaki melengkung, ujung jari membulat, sol sedikit lebih gelap).
export const LEG_STYLE: { v: 'lama' | 'baru' } = { v: 'lama' };

const Shoe = ({ x, d, color, sole }: { x: number; d: number; color: string; sole: string }) => (
  <g transform={`translate(${x} 0) scale(${d} ${Math.abs(d)})`} data-anatomy="shoe">
    <path
      d="M-11 -1C-13 -7 -12 -13 -8 -15C-3 -17 3 -16 7 -12C12 -10 19 -9 22 -5C24 -2 23 0 20 0L-9 0C-10 0 -11 -0.5 -11 -1Z"
      fill={color}
    />
    <path d="M-10.5 -1.6L21.5 -1.6" stroke={sole} strokeWidth="3.2" strokeLinecap="round" />
    <path d="M2 -14.5Q5 -12 9 -11.5" stroke={sole} strokeWidth="1.2" fill="none" opacity=".55" />
  </g>
);

export const NewLegs = ({
  girl,
  pants,
  sit,
  drop,
  dir,
  stride,
  shorts = false,
  socks,
}: {
  shorts?: boolean;
  socks?: string;
  girl: boolean;
  pants: string;
  sit: boolean;
  drop: number;
  dir: number;
  stride: number;
}) => {
  const KULIT = React.useContext(KulitCtx);
  const leg = girl ? KULIT : pants;
  const w = girl ? 15 : 25;
  const shoe = girl ? '#78978A' : '#6F897B';
  const sole = girl ? '#5F7D70' : '#566F62';
  const out: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    const hip: [number, number] = [side * 16, -133 + drop];
    const st = -side * stride;
    let knee: [number, number], ankle: [number, number];
    if (sit) {
      // Paha mengarah ke depan (terlihat memendek), lutut menekuk, betis turun ke lantai.
      knee = [side * 24 + dir * 5, -112 + drop * 0.4];
      ankle = [side * 24 + dir * 9 + st * 0.6, -13];
    } else {
      ankle = [side * 21 + st, -13];
      knee = [(hip[0] + ankle[0]) / 2 + Math.abs(st) * 0.35 * dir, -72 - Math.abs(st) * 0.25];
    }
    if (shorts) {
      // Celana pendek kargo sampai sedikit di atas lutut, betis kulit, kaos kaki putih di atas mata kaki.
      const ang = (Math.atan2(knee[1] - hip[1], knee[0] - hip[0]) * 180) / Math.PI;
      const tl = Math.hypot(knee[0] - hip[0], knee[1] - hip[1]);
      const end = sit ? 1 : 0.84;
      const hem: [number, number] = [
        hip[0] + (knee[0] - hip[0]) * end,
        hip[1] + (knee[1] - hip[1]) * end,
      ];
      const sh = Math.atan2(ankle[1] - knee[1], ankle[0] - knee[0]);
      const sockTop: [number, number] = [
        ankle[0] - Math.cos(sh) * 17,
        ankle[1] - Math.sin(sh) * 17,
      ];
      const dark = shade(pants, 0.86);
      out.push(
        <g key={side} data-anatomy="three-joint-leg-shorts">
          <path
            d={`M${hip[0]} ${hip[1]}L${knee[0]} ${knee[1]}L${ankle[0]} ${ankle[1]}`}
            fill="none"
            stroke={KULIT}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {sit && <circle cx={knee[0]} cy={knee[1] + 3} r={8.5} fill={KULIT} />}
          <path
            d={`M${sockTop[0]} ${sockTop[1]}L${ankle[0]} ${ankle[1]}`}
            stroke="#F8F5EF"
            strokeWidth={15.5}
            strokeLinecap="round"
          />
          <path
            d={`M${sockTop[0] - 7.5} ${sockTop[1] + 1.5}h15`}
            stroke="#E4DED2"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M${hip[0]} ${hip[1] - 4}L${hem[0]} ${hem[1]}`}
            stroke={pants}
            strokeWidth={27}
            strokeLinecap="butt"
          />
          {sit && <ellipse cx={knee[0]} cy={knee[1] - 2} rx={14} ry={11} fill={pants} />}
          <g transform={`translate(${hem[0]} ${hem[1]}) rotate(${ang - 90})`}>
            <rect x={-13.5} y={-3} width={27} height={3.2} fill={dark} />
          </g>
          {!sit && (
            <g
              transform={`translate(${hip[0] + (knee[0] - hip[0]) * 0.55} ${hip[1] + (knee[1] - hip[1]) * 0.55}) rotate(${ang - 90})`}
            >
              <rect
                x={side * 6 - 6}
                y={-7}
                width={12}
                height={15}
                rx={2}
                fill={shade(pants, 0.94)}
                stroke={dark}
                strokeWidth="1.2"
              />
              <path d={`M${side * 6 - 6.5} -7h13v4.5h-13Z`} fill={dark} opacity=".7" />
            </g>
          )}
          <Shoe
            x={ankle[0] - side * 1 - dir * 2}
            d={dir * (side === dir ? 1 : 0.86) * 1.12}
            color={shoe}
            sole={sole}
          />
        </g>,
      );
      continue;
    }
    out.push(
      <g key={side} data-anatomy="three-joint-leg">
        <path
          d={`M${hip[0]} ${hip[1]}L${knee[0]} ${knee[1]}L${ankle[0]} ${ankle[1]}`}
          fill="none"
          stroke={leg}
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {sit && <circle cx={knee[0]} cy={knee[1]} r={w * 0.62} fill={leg} />}
        {girl && !sit && socks && (
          <path
            d={`M${knee[0] - 4} ${knee[1] + 1}q4 3 8 0`}
            stroke="#EDC6B3"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {socks &&
          (() => {
            const sh = Math.atan2(ankle[1] - knee[1], ankle[0] - knee[0]);
            const top: [number, number] = [
              ankle[0] - Math.cos(sh) * 6,
              ankle[1] - Math.sin(sh) * 6,
            ];
            const at = (t: number): [number, number] => [
              ankle[0] + (top[0] - ankle[0]) * t,
              ankle[1] + (top[1] - ankle[1]) * t,
            ];
            return (
              <g data-socks="motif">
                <path
                  d={`M${top[0]} ${top[1]}L${ankle[0]} ${ankle[1]}`}
                  stroke={socks}
                  strokeWidth={w + 1.5}
                  strokeLinecap="round"
                />

                <path
                  d={`M${top[0] - (w + 1.5) / 2} ${top[1]}h${w + 1.5}`}
                  stroke="#E4DED2"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            );
          })()}
        {!girl && (
          <path
            d={`M${ankle[0] - w / 2 + 1} ${ankle[1] + 2}h${w - 2}`}
            stroke={sole}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity=".5"
          />
        )}
        <Shoe
          x={ankle[0] - side * 1 - dir * 2}
          d={dir * (side === dir ? 1 : 0.86) * (girl ? 1 : 1.18)}
          color={shoe}
          sole={sole}
        />
      </g>,
    );
  }
  return <>{out}</>;
};

export const Person: React.FC<Actor> = ({
  x,
  y,
  s = 1,
  who = 'him',
  view = 'three',
  dir = 1,
  mood = 'soft',
  gaze = 0,
  gazeY = 0,
  lean = 0,
  head = 0,
  left = [-47, -139],
  right = [47, -139],
  step = 0,
  talk = 0,
  f = 0,
  role = 'principal',
  framing = 'full',
  alpha = 1,
  pose = 'stand',
  appearance,
  shirtColor,
  trouserColor,
  helmet = false,
  seatDrop = 0,
  hideArms = false,
  legs,
  body,
  flush,
  holdLeft,
  holdRight,
  raiseLeft,
  raiseRight,
  elbowDown,
  extra,
}) => {
  const KULIT = extra?.kulit ?? P.skin;
  const nb = (body ?? BODY_STYLE.v) === 'baru';
  const drop = seatDrop,
    k = drop / 20;
  const girl = who === 'her',
    dad = who === 'dad',
    boy = who === 'boy',
    cloth = shirtColor ?? (girl ? '#FFCDB2' : boy ? '#B8BBA6' : dad ? '#8BA38F' : '#95B8A2'),
    pants = trouserColor ?? (girl ? '#9FB8AD' : nb && who === 'him' ? '#EDAE8C' : '#829B8E'),
    stride = step * 14;
  const blink = nb ? naturalBlink(f, who.length * 19) : Math.floor(f + who.length * 19) % 143 > 139;
  // Napas: badan atas naik-turun sangat halus (hanya badan baru).
  const breath = nb ? -0.7 * (0.5 + 0.5 * Math.sin(f * 0.1 + who.length)) : 0;
  const headTurn = nb ? head + gaze * 2.2 : head;
  return (
    <KulitCtx.Provider value={KULIT}>
    <LenganCtx.Provider value={extra?.lenganPanjang ? extra.warnaBaju : null}>
    <g
      data-actor={who}
      data-extra-look={extra?.id}
      data-role={role}
      data-framing={framing}
      opacity={alpha}
      transform={`translate(${x} ${y}) scale(${s})`}
    >
      <ellipse
        cx={pose === 'sit' ? dir * 40 : 0}
        cy="3"
        rx="53"
        ry="7"
        fill={P.ink}
        opacity=".10"
      />
      {(legs ?? LEG_STYLE.v) === 'baru' ? (
        <NewLegs
          girl={girl}
          pants={pants}
          sit={pose === 'sit'}
          drop={drop}
          dir={dir}
          stride={stride}
          shorts={nb && who === 'him'}
          socks={nb && girl ? '#F8F5EF' : undefined}
        />
      ) : pose === 'sit' ? (
        <>
          <path
            d={`M-16 ${-133 + drop}Q${-20 + (-28 + 20) * k - stride * 0.5 * (1 - k)} ${-76 + 7 * k} ${-21 + (-26 + 21) * k + stride * (1 - k)} -5M16 ${-133 + drop}Q${20 + (28 - 20) * k + stride * 0.5 * (1 - k)} ${-76 + 7 * k} ${21 + (26 - 21) * k - stride * (1 - k)} -5`}
            fill="none"
            stroke={girl ? KULIT : pants}
            strokeWidth={girl ? 13.5 : 26}
            strokeLinecap="round"
          />
          <path
            d={`M${-33 + (-26 + 21) * k + stride * (1 - k)} -1h27M${11 + (26 - 21) * k - stride * (1 - k)} -1h27`}
            stroke={girl ? '#78978A' : '#6F897B'}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d={`M-16-133Q${-20 - stride * 0.5}-76 ${-21 + stride}-4M16-133Q${20 + stride * 0.5}-76 ${21 - stride}-4`}
            fill="none"
            stroke={girl ? KULIT : pants}
            strokeWidth={girl ? 13.5 : 26}
            strokeLinecap="round"
          />
          <path
            d={`M${-33 + stride} -1h27M${11 - stride} -1h27`}
            stroke={girl ? '#78978A' : '#6F897B'}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </>
      )}
      <g transform={`translate(0 ${drop + breath}) rotate(${lean} 0 -135)`}>
        {girl && (
          <>
            <path d="M-27-171l-3 10q30 4 60 0l-3-10Z" fill={KULIT} />
            {nb ? (
              <g data-skirt="above-knee">
                <path d="M-30-161q30 4 60 0l10 72q-40 7-80 0Z" fill={pants} />
                <path
                  d="M-15-147l-5 55M15-147l5 55"
                  stroke={extra ? shade(pants, 0.86) : '#8BA79A'}
                  strokeWidth="1.5"
                  opacity=".7"
                  fill="none"
                />
                <path d="M-40-89q40 7 80 0" stroke={extra ? shade(pants, 0.82) : '#84A194'} strokeWidth="1.8" fill="none" />
              </g>
            ) : (
              <g data-skirt="knee-length">
                <path
                  d={
                    pose === 'sit'
                      ? `M-30-161q30 4 60 0l13 96q-43 8-86 0Z`
                      : 'M-30-161q30 4 60 0l13 96q-43 8-86 0Z'
                  }
                  fill={pants}
                />
                <path
                  d={pose === 'sit' ? `M-15-147l-7 76M15-147l7 76` : 'M-15-147l-7 76M15-147l7 76'}
                  stroke={extra ? shade(pants, 0.86) : '#8BA79A'}
                  strokeWidth="1.5"
                  opacity=".7"
                  fill="none"
                />
                <path
                  d={pose === 'sit' ? `M-43-65q43 8 86 0` : 'M-43-65q43 8 86 0'}
                  stroke={extra ? shade(pants, 0.82) : '#84A194'}
                  strokeWidth="1.8"
                  fill="none"
                />
              </g>
            )}
            <path d="M-30-161q30 4 60 0" stroke={extra ? shade(pants, 0.82) : '#84A194'} strokeWidth="2.6" fill="none" />
          </>
        )}
        <path
          d={
            girl
              ? 'M-40-202Q-37-235 0-235Q37-235 40-202L27-171Q0-168-27-171Z'
              : 'M-42-209Q-40-235 0-235Q40-235 42-209L37-136Q0-132-37-136Z'
          }
          fill={cloth}
        />
        {extra ? (
          <ExtraBaju look={extra} girl={girl} view={view} pose={pose} />
        ) : girl ? (
          <>
            {nb ? (
              <g data-shirt="knit-vneck">
                <pattern id={`knit-${who}`} width="5" height="6" patternUnits="userSpaceOnUse">
                  <path d="M1.2 0v6" stroke={shade(cloth, 0.93)} strokeWidth="1.3" />
                  <path
                    d="M0 3l1.2 1.2l1.2-1.2"
                    stroke={shade(cloth, 1.04)}
                    strokeWidth="0.6"
                    fill="none"
                    opacity=".8"
                  />
                </pattern>
                <path
                  d="M-40-202Q-37-235 0-235Q37-235 40-202L27-171Q0-168-27-171Z"
                  fill={`url(#knit-${who})`}
                />
{view === 'back' ? (
                  <path d="M-15-236q15 7 30 0" stroke="#EAA989" strokeWidth="3.6" fill="none" strokeLinecap="round" />
                ) : (
                  <>
                <path d="M-15-236L0-212L15-236Z" fill={KULIT} />
                <path
                  d="M-16.5-236L0-211L16.5-236"
                  stroke="#EAA989"
                  strokeWidth="3.6"
                  fill="none"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                                </>
                )}
              </g>
            ) : (
              <path
                d="M-16-233q16 17 32 0"
                stroke="#EAA989"
                strokeWidth="4.8"
                fill="none"
                strokeLinecap="round"
              />
            )}
            <path d="M-27-171q27 3 54 0" stroke="#EAA989" strokeWidth="2.8" fill="none" />
            {view !== 'back' && appearance === undefined && !extra && (
              <image
                data-shirt-logo="true"
                href={SHIRT_LOGO}
                x="-23"
                y="-211"
                width="46"
                height="16"
                transform={`translate(0 -204) skewX(${view === 'three' ? -dir * 4 : 0}) translate(0 204)`}
              />
            )}
          </>
        ) : nb ? (
          <g data-shirt="polo">
            <clipPath id={`torso-${who}`}>
              <path d="M-42-209Q-40-235 0-235Q40-235 42-209L39-137Q0-131-39-137Z" />
            </clipPath>
            <g clipPath={`url(#torso-${who})`}>
              <path d="M-48-235L-30-235Q-36-190-33-130L-48-130Z" fill={shade(cloth, 0.9)} />
              <path d="M48-235L33-235Q38-190 35-130L48-130Z" fill={shade(cloth, 0.93)} />
              <path
                d="M-31-196q-3 26 0 50M31-192q3 24 0 46"
                stroke={shade(cloth, 0.9)}
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M-42-143Q0-136 42-143L42-130L-42-130Z" fill={shade(cloth, 0.88)} />
            </g>
            <path d="M-39-137q39 6 78 0" stroke={shade(cloth, 0.8)} strokeWidth="2.2" fill="none" />
            {view === 'back' ? (
              // v2: punggung polo — kerah belakang, jahitan bahu (yoke), tanpa kancing/kantong
              <g data-shirt-side="belakang">
                <path d="M-19-237q19 7 38 0l1 7q-20 8 -40 0Z" fill={shade(cloth, 1.06)} stroke={shade(cloth, 0.8)} strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M-38-214q38 9 76 0" stroke={shade(cloth, 0.86)} strokeWidth="1.6" fill="none" />
                <path d="M0-206v60" stroke={shade(cloth, 0.92)} strokeWidth="1.2" opacity=".6" />
              </g>
            ) : (
              <>
            <path d="M0-231v26" stroke={shade(cloth, 0.84)} strokeWidth="1.6" />
            <circle cx="0.5" cy="-220" r="1.9" fill="#F4EEE2" />
            <circle cx="0.5" cy="-210" r="1.9" fill="#F4EEE2" />
            <path
              d="M-1-236L-19-235L-14-221Z"
              fill={shade(cloth, 1.06)}
              stroke={shade(cloth, 0.8)}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M1-236L19-235L14-221Z"
              fill={shade(cloth, 1.06)}
              stroke={shade(cloth, 0.8)}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M-26-198h15v16q-7.5 3-15 0Z"
              fill={shade(cloth, 0.95)}
              stroke={shade(cloth, 0.86)}
              strokeWidth="1.1"
              strokeDasharray="1.6 1.6"
            />
            <path d="M-26-195h15" stroke={shade(cloth, 0.84)} strokeWidth="1.4" />
              </>
            )}
          </g>
        ) : (
          <>
            <path
              d="M-16-236q16 16 32 0"
              stroke="#7A9E88"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M-25-199h15v17h-15Z" fill="#84A892" />
            <path d="M-35-140q35 4 70 0" stroke="#7A9E88" strokeWidth="2" fill="none" />
          </>
        )}
        {nb ? (
          <g data-anatomy="neck" transform={`rotate(${head * 0.35} 0 -232)`}>
            <path d="M-10.5-254L10.5-254L12-231Q0-226-12-231Z" fill={KULIT} />
            <path d="M-10.5-252q10.5 9 21 0v7q-10.5 8-21 0Z" fill="#EFBFAE" opacity=".6" />
            <path
              d="M-12-232q12 5 24 0"
              stroke="#EFC6B4"
              strokeWidth="1.4"
              fill="none"
              opacity=".8"
            />
          </g>
        ) : (
          <>
            <rect x="-10.3" y="-252" width="20.6" height="24" rx="8.6" fill={KULIT} />
            <path d="M-10-249q10 10 20 0v8q-10 9-20 0Z" fill="#F2C6B6" opacity=".5" />
          </>
        )}
        {nb && girl && view !== 'back' && (
          <g data-accessory="necklace">
            <path
              d="M-10.5-238Q-5-227 0-226.5Q5-227 10.5-238"
              stroke="#C9A25E"
              strokeWidth=".75"
              fill="none"
              opacity=".9"
            />
            <circle cx="0" cy="-225" r="1.5" fill="#D9B46A" />
          </g>
        )}
        {!hideArms && (
          <Arm
            side={-1}
            hand={left}
            girl={girl}
            cloth={cloth}
            holding={holdLeft}
            raise={raiseLeft}
            elbowDown={elbowDown}
          />
        )}
        {!hideArms && (
          <Arm
            side={1}
            hand={right}
            girl={girl}
            cloth={cloth}
            holding={holdRight}
            raise={raiseRight}
            elbowDown={elbowDown}
          />
        )}
        <g
          data-face={who}
          transform={`translate(${view === 'three' ? dir * 2 : 0} 0) rotate(${headTurn} 0 -279)`}
        >
          <>
            {extra ? (
              <ExtraKepala look={extra} mood={mood} blink={blink} gaze={gaze} gazeY={gazeY} view={view} dir={dir} />
            ) : appearance === undefined ? (
              <ReferenceFace
                who={who}
                view={view}
                dir={dir}
                mood={mood}
                blink={blink}
                flush={flush}
                gaze={gaze}
                gazeY={gazeY}
                talk={talk}
              />
            ) : (
              <ExtraFace
                variant={appearance}
                helmet={helmet}
                mood={mood}
                blink={blink}
                gaze={gaze}
                gazeY={gazeY}
              />
            )}
          </>
        </g>
      </g>
    </g>
    </LenganCtx.Provider>
    </KulitCtx.Provider>
  );
};

// ---------------------------------------------------------------- pustaka pose (6 Nov 2026)
// Hanya pose yang sudah lolos cek anatomi/gestur DAN diperiksa di crop 100%. Pose baru wajib lolos cek,
// diperiksa di crop 100%, lalu ditunjukkan ke pengguna sebelum masuk ke sini. Koordinat tangan lokal rig.
type PoseArms = {
  left: Point;
  right: Point;
  raiseLeft?: boolean;
  raiseRight?: boolean;
  elbowDown?: boolean;
};
export const POSES = {
  her: {
    santai: { left: [-40, -124], right: [40, -122] },
    melambai: { left: [-62, -262], right: [40, -122], raiseLeft: true },
    pinggang: { left: [-34, -150], right: [40, -122] },
    bertaut: { left: [-10, -140], right: [10, -140] },
    berpikir: { left: [-30, -150], right: [10, -224], elbowDown: true },
  },
  him: {
    santai: { left: [-44, -124], right: [44, -124] },
    melambai: { left: [-44, -124], right: [66, -268], raiseRight: true },
    pinggang: { left: [-44, -124], right: [40, -150] },
    bertaut: { left: [-11, -140], right: [11, -140] },
  },
} satisfies Record<'her' | 'him', Record<string, PoseArms>>;
