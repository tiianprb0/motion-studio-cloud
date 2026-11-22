// Api, asap, dan kabut asap (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1 (pengguna 18 Nov 2026: "buat kan
// konten soal kebakaran hutan di papua, kategori normal bukan stand up, narator naya"). Sebelumnya pustaka belum punya api
// atau asap. Gaya: vektor flat berlapis (merah-oranye-kuning), tepi asap dilembutkan blur, gerak deterministik dari f.
//   <Api x y s f kuat seed />            lidah api berkelompok, alas di (x, y); tinggi ±130·s px saat kuat 1
//   <GarisApi x0 x1 y s f kuat seed />   api rendah merambat di rumput (pembakaran savana kecil); lebar = x1 − x0
//   <KepulanAsap x y s f tinggi condong kuat warna seed />  kolom asap naik dan condong terbawa angin
//   <TumpukanKayu x y s f bakar seed />  kayu tebangan ditumpuk (bakar 0..1 = api + gosong)
//   <KabutAsap kuat warna f id />        kabut asap selayar penuh (layar, bukan dunia): atas lebih pekat
//   <MatahariKabur x y r kuat />         matahari jingga pucat di balik asap
//   <TitikPanas x y r f muncul />        penanda titik panas (merah, cincin berdenyut) untuk peta/overlay
//   <Bara x y s f n seed />              percik bara naik
// Semua id filter/gradien diberi akhiran `id` supaya aman dipakai berkali-kali dalam satu bingkai.
import React from 'react';

const rnd = (k: number, n: number) => {
  const v = Math.sin(k * 127.1 + n * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const WARNA_API = { luar: '#D9482B', tengah: '#F28A30', dalam: '#FFD66B', inti: '#FFF4C2', cahaya: '#FFB45A' };

/** satu lidah api (tetes terbalik), alas (cx, y), lebar w, tinggi h, ujung bergeser dx */
const lidah = (cx: number, y: number, w: number, h: number, dx: number) =>
  `M${(cx - w / 2).toFixed(1)} ${y.toFixed(1)}C${(cx - w / 2).toFixed(1)} ${(y - h * 0.45).toFixed(1)} ${(cx + dx - w * 0.18).toFixed(1)} ${(y - h * 0.72).toFixed(1)} ${(cx + dx).toFixed(1)} ${(y - h).toFixed(1)}C${(cx + dx + w * 0.18).toFixed(1)} ${(y - h * 0.72).toFixed(1)} ${(cx + w / 2).toFixed(1)} ${(y - h * 0.45).toFixed(1)} ${(cx + w / 2).toFixed(1)} ${y.toFixed(1)}Z`;

export function Api({ x, y, s = 1, f = 0, kuat = 1, seed = 0, lebar = 1, cahaya = true, id = 'api' }: { x: number; y: number; s?: number; f?: number; kuat?: number; seed?: number; lebar?: number; cahaya?: boolean; id?: string }) {
  const k = klamp(kuat, 0, 1.4);
  if (k <= 0.01) return null;
  const n = Math.max(3, Math.round(5 * lebar));
  const W = 110 * s * lebar;
  const lapis: [string, number, number][] = [
    [WARNA_API.luar, 1, 1],
    [WARNA_API.tengah, 0.74, 0.8],
    [WARNA_API.dalam, 0.48, 0.58],
    [WARNA_API.inti, 0.24, 0.34],
  ];
  return (
    <g data-api="api">
      {cahaya && (
        <>
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop offset="0" stopColor={WARNA_API.cahaya} stopOpacity={0.55 * Math.min(1, k)} />
              <stop offset="1" stopColor={WARNA_API.cahaya} stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={x} cy={y - 50 * s * k} rx={W * 1.1} ry={150 * s * k} fill={`url(#${id}-glow)`} />
        </>
      )}
      {lapis.map(([warna, skW, skH], li) => (
        <g key={li}>
          {Array.from({ length: n }, (_, i) => {
            const u = n === 1 ? 0.5 : i / (n - 1);
            const tengah = 1 - Math.abs(u - 0.5) * 1.3;
            const kedip = 0.82 + 0.18 * Math.sin(f * (0.55 + rnd(i, seed) * 0.3) + rnd(i, seed + 3) * 6 + li);
            const h = 130 * s * k * skH * (0.55 + 0.6 * tengah) * kedip * (0.8 + 0.4 * rnd(i, seed + 7));
            const w = (W / n) * 1.9 * skW;
            const cx = x - W / 2 + u * W + (rnd(i, seed + 11) - 0.5) * 12 * s;
            const dx = Math.sin(f * 0.33 + i * 1.7 + seed) * 12 * s + 6 * s;
            return <path key={i} d={lidah(cx, y, w, h, dx)} fill={warna} />;
          })}
        </g>
      ))}
    </g>
  );
}

/** api rendah merambat di rumput (pembakaran savana kecil) */
export function GarisApi({ x0, x1, y, s = 1, f = 0, kuat = 1, seed = 0, asap = true, id = 'garis-api' }: { x0: number; x1: number; y: number; s?: number; f?: number; kuat?: number; seed?: number; asap?: boolean; id?: string }) {
  const n = Math.max(2, Math.round((x1 - x0) / (60 * s)));
  return (
    <g data-api="garis">
      {/* rumput hangus di belakang garis api */}
      <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y - 8 * s} ${x1} ${y}L${x1} ${y + 6 * s}L${x0} ${y + 6 * s}Z`} fill="#3B302A" opacity=".55" />
      {asap &&
        Array.from({ length: Math.max(1, Math.round(n / 3)) }, (_, i) => (
          <KepulanAsap key={i} x={x0 + ((i + 0.5) / Math.max(1, Math.round(n / 3))) * (x1 - x0)} y={y - 10 * s} s={s * 0.45} f={f} tinggi={260 * s} condong={0.6} kuat={0.45 * kuat} warna="#B8ADA2" seed={seed + i * 5} id={`${id}-a${i}`} />
        ))}
      {Array.from({ length: n }, (_, i) => (
        <Api key={i} x={x0 + ((i + 0.5) / n) * (x1 - x0)} y={y + Math.sin(i * 1.9 + seed) * 4 * s} s={s * (0.32 + 0.14 * rnd(i, seed))} f={f + i * 3} kuat={kuat} seed={seed + i} lebar={0.7} cahaya={i % 2 === 0} id={`${id}-${i}`} />
      ))}
    </g>
  );
}

/** kolom asap: puff berlapis naik dari (x, y), condong (px per px naik) ke kanan bila positif */
export function KepulanAsap({
  x,
  y,
  s = 1,
  f = 0,
  tinggi = 700,
  condong = 0.35,
  kuat = 0.85,
  warna = '#6E6660',
  warnaAtas = '#B7ADA4',
  seed = 0,
  id = 'asap',
}: {
  x: number;
  y: number;
  s?: number;
  f?: number;
  tinggi?: number;
  condong?: number;
  kuat?: number;
  warna?: string;
  warnaAtas?: string;
  seed?: number;
  id?: string;
}) {
  if (kuat <= 0.01) return null;
  const mix = (a: string, b: string, t: number) => {
    const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const A = p(a),
      B = p(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
  };
  // gumpalan rapat: jarak antar-gumpalan ±45% jari-jarinya (tidak tampak seperti manik-manik), jari-jari membesar ke atas
  const r0 = 46 * s,
    r1 = Math.max(r0 * 2, 170 * s * Math.sqrt(tinggi / 700));
  const rAt = (h: number) => r0 + (r1 - r0) * Math.min(1, h / tinggi);
  const fase = ((f * 1.4 * s + rnd(seed, 1) * 40) % (r0 * 0.45) + r0 * 0.45) % (r0 * 0.45);
  const gumpal: { h: number; r: number; k: number }[] = [];
  let h = -r0 * 0.45 + fase,
    k = 0;
  while (h < tinggi && k < 60) {
    const r = rAt(Math.max(0, h));
    gumpal.push({ h, r, k });
    h += Math.max(r * 0.45, tinggi / 40);
    k++;
  }
  return (
    <g data-api="asap">
      <defs>
        <filter id={`${id}-blur`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={Math.max(1.5, 12 * s).toFixed(2)} />
        </filter>
      </defs>
      <g filter={`url(#${id}-blur)`}>
        {gumpal.map(({ h, r, k }) => {
          const t = klamp(h / tinggi);
          const goyang = Math.sin(t * 5 + seed + f * 0.02) * 26 * s * t;
          const cx = x + h * condong * (0.35 + 0.65 * t) + goyang;
          const cy = y - h;
          const o = kuat * (h < r0 ? klamp((h + r0 * 0.45) / (r0 * 1.2)) : 1) * (1 - t * 0.6);
          const rr = r * (0.9 + 0.25 * rnd(k, seed));
          return (
            <g key={k}>
              <circle cx={cx} cy={cy} r={rr} fill={mix(warna, warnaAtas, t)} opacity={klamp(o * 0.7).toFixed(3)} />
              <circle cx={cx + rr * (rnd(k, seed + 4) - 0.3) * 0.7} cy={cy - rr * 0.25} r={rr * 0.65} fill={mix(warna, warnaAtas, Math.min(1, t + 0.2))} opacity={klamp(o * 0.45).toFixed(3)} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** kayu tebangan ditumpuk (batang dengan ujung lingkaran tahun + ranting); bakar 0..1 */
export function TumpukanKayu({ x, y, s = 1, f = 0, bakar = 0, seed = 0, id = 'kayu' }: { x: number; y: number; s?: number; f?: number; bakar?: number; seed?: number; id?: string }) {
  const batang: [number, number, number, number][] = [
    // [dx, dy, panjang, jari-jari] dalam satuan s (alas tumpukan di y)
    [-120, -22, 260, 22],
    [10, -24, 250, 24],
    [130, -20, 210, 20],
    [-60, -62, 240, 21],
    [70, -60, 230, 22],
    [0, -98, 200, 19],
    [-140, -58, 140, 16],
  ];
  const gosong = klamp(bakar * 1.2);
  return (
    <g data-api="tumpukan-kayu">
      <ellipse cx={x} cy={y + 4 * s} rx={250 * s} ry={22 * s} fill="#2E2620" opacity=".28" />
      {/* ranting dan daun kering di sela */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = -0.9 + rnd(i, seed) * 1.8;
        const px = x + (rnd(i, seed + 2) - 0.5) * 380 * s,
          py = y - (20 + rnd(i, seed + 4) * 90) * s;
        return <path key={i} d={`M${px} ${py}l${Math.cos(a) * 70 * s} ${-Math.abs(Math.sin(a)) * 50 * s - 10 * s}`} stroke="#6B4E36" strokeWidth={5 * s} strokeLinecap="round" />;
      })}
      {batang.map(([dx, dy, pj, r], i) => {
        const cx = x + dx * s,
          cy = y + dy * s,
          L = pj * s,
          R = r * s;
        const kulit = i % 2 ? '#7A5A3E' : '#8A6646';
        return (
          <g key={i}>
            <rect x={cx - L / 2} y={cy - R} width={L} height={R * 2} rx={R * 0.4} fill={kulit} />
            <rect x={cx - L / 2} y={cy - R * 0.5} width={L} height={R * 0.25} fill="#5E4430" opacity=".35" />
            <ellipse cx={cx + L / 2} cy={cy} rx={R * 0.62} ry={R} fill="#D8B88A" />
            <ellipse cx={cx + L / 2} cy={cy} rx={R * 0.36} ry={R * 0.6} fill="none" stroke="#B48E62" strokeWidth={2 * s} />
            <rect x={cx - L / 2} y={cy - R} width={L + R * 0.7} height={R * 2} fill="#1E1714" opacity={(0.7 * gosong).toFixed(3)} />
          </g>
        );
      })}
      {bakar > 0.02 && (
        <>
          <Api x={x - 60 * s} y={y - 30 * s} s={s * 1.25} f={f} kuat={bakar} seed={seed + 1} lebar={1.6} id={`${id}-a1`} />
          <Api x={x + 90 * s} y={y - 40 * s} s={s * 1.05} f={f + 7} kuat={bakar * 0.9} seed={seed + 9} lebar={1.2} id={`${id}-a2`} />
          <Bara x={x} y={y - 120 * s} s={s} f={f} n={Math.round(10 * bakar)} seed={seed} />
        </>
      )}
    </g>
  );
}

export function Bara({ x, y, s = 1, f = 0, n = 8, seed = 0 }: { x: number; y: number; s?: number; f?: number; n?: number; seed?: number }) {
  return (
    <g data-api="bara">
      {Array.from({ length: n }, (_, i) => {
        const t = ((f * (0.012 + rnd(i, seed) * 0.01) + rnd(i, seed + 1)) % 1 + 1) % 1;
        const bx = x + (rnd(i, seed + 2) - 0.5) * 260 * s + Math.sin(t * 6 + i) * 30 * s + t * 80 * s;
        const by = y - t * 380 * s;
        return <circle key={i} cx={bx} cy={by} r={(3 + rnd(i, seed + 5) * 3) * s} fill={i % 3 ? '#FFB347' : '#FFE08A'} opacity={(1 - t).toFixed(3)} />;
      })}
    </g>
  );
}

/** kabut asap selayar penuh (koordinat layar 1080×1920): atas lebih pekat; kuat 0..1 */
export function KabutAsap({ kuat = 0.6, warna = '#C79E74', warnaBawah = '#D9C2A6', f = 0, id = 'kabut' }: { kuat?: number; warna?: string; warnaBawah?: string; f?: number; id?: string }) {
  if (kuat <= 0.01) return null;
  return (
    <g data-api="kabut" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warna} stopOpacity={klamp(0.85 * kuat).toFixed(3)} />
          <stop offset="0.55" stopColor={warna} stopOpacity={klamp(0.55 * kuat).toFixed(3)} />
          <stop offset="1" stopColor={warnaBawah} stopOpacity={klamp(0.35 * kuat).toFixed(3)} />
        </linearGradient>
        <filter id={`${id}-b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect x="-200" y="-200" width="1480" height="2320" fill={`url(#${id}-g)`} />
      <g filter={`url(#${id}-b)`} opacity={klamp(0.5 * kuat).toFixed(3)}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={((i * 260 + f * (0.6 + i * 0.15)) % 1500) - 200} cy={300 + i * 230} rx={340} ry={120} fill={warna} />
        ))}
      </g>
    </g>
  );
}

export function MatahariKabur({ x, y, r = 60, kuat = 1, id = 'mkab' }: { x: number; y: number; r?: number; kuat?: number; id?: string }) {
  return (
    <g data-api="matahari-kabur">
      <defs>
        <radialGradient id={`${id}-g`}>
          <stop offset="0" stopColor="#FFB56B" stopOpacity={0.55 * kuat} />
          <stop offset="1" stopColor="#FFB56B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3} fill={`url(#${id}-g)`} />
      <circle cx={x} cy={y} r={r} fill="#F27A3E" opacity={0.85 * kuat} />
    </g>
  );
}

/** penanda titik panas: titik merah + cincin berdenyut; muncul 0..1 (skala masuk) */
export function TitikPanas({ x, y, r = 10, f = 0, muncul = 1, warna = '#E2412F' }: { x: number; y: number; r?: number; f?: number; muncul?: number; warna?: string }) {
  const m = klamp(muncul);
  if (m <= 0) return null;
  const sk = m < 1 ? 0.4 + 0.75 * m - 0.15 * Math.sin(m * Math.PI) * -1 : 1;
  const d = (f * 0.04) % 1;
  return (
    <g data-api="titik-panas" transform={`translate(${x} ${y}) scale(${sk.toFixed(3)})`}>
      <circle r={r * (1.4 + 1.6 * d)} fill="none" stroke={warna} strokeWidth={r * 0.28} opacity={(0.6 * (1 - d) * m).toFixed(3)} />
      <circle r={r * 1.25} fill="#FFFFFF" opacity={0.85 * m} />
      <circle r={r} fill={warna} opacity={m} />
    </g>
  );
}
