// Pustaka detail latar bersama (7 Nov 2026). Tujuan: latar sekaya ilustrasi edukasi (mis. gaya "Kok Bisa?") —
// banyak benda kecil, bayangan lembut, tekstur tipis, lapisan kedalaman. Semua koordinat bebas (x,y = titik alas/kiri-atas).
import React from 'react';

export const Shadow = ({ x, y, w, o = 0.18 }: { x: number; y: number; w: number; o?: number }) => <ellipse cx={x} cy={y} rx={w / 2} ry={w / 12} fill="#000" opacity={o} />;
// tekstur dinding: noda halus + retak tipis (deterministik)
export const WallGrain = ({ x, y, w, h, tone = '#000', o = 0.05, seed = 1 }: { x: number; y: number; w: number; h: number; tone?: string; o?: number; seed?: number }) => {
  const r = (i: number) => {
    const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <g opacity={o}>
      {Array.from({ length: 26 }, (_, i) => (
        <ellipse key={i} cx={x + r(i) * w} cy={y + r(i + 50) * h} rx={20 + r(i + 9) * 70} ry={10 + r(i + 19) * 40} fill={tone} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <path key={'c' + i} d={`M${x + r(i + 70) * w} ${y + r(i + 80) * h}l${12 - r(i) * 24} ${20 + r(i + 3) * 30}l${10 - r(i + 5) * 20} ${16}`} stroke={tone} strokeWidth="3" fill="none" />
      ))}
    </g>
  );
};
// ubin lantai / paving
export const Tiles = ({ x, y, w, h, size = 90, a = '#CDB79A', b = '#C4AD8F', line = '#B39C7E' }: { x: number; y: number; w: number; h: number; size?: number; a?: string; b?: string; line?: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={a} />
    {Array.from({ length: Math.ceil(w / size) * Math.ceil(h / size) }, (_, i) => {
      const cx = i % Math.ceil(w / size),
        cy = Math.floor(i / Math.ceil(w / size));
      return (cx + cy) % 2 ? <rect key={i} x={x + cx * size} y={y + cy * size} width={size} height={size} fill={b} /> : null;
    })}
    {Array.from({ length: Math.ceil(w / size) }, (_, i) => <path key={'v' + i} d={`M${x + i * size} ${y}v${h}`} stroke={line} strokeWidth="2" />)}
    {Array.from({ length: Math.ceil(h / size) }, (_, i) => <path key={'h' + i} d={`M${x} ${y + i * size}h${w}`} stroke={line} strokeWidth="2" />)}
  </g>
);
// tiang listrik + kabel menjuntai (ciri jalan Indonesia)
export const PowerPole = ({ x, ground, top = 300, wiresTo = [-200, 1300], tone = '#4A4542' }: { x: number; ground: number; top?: number; wiresTo?: number[]; tone?: string }) => (
  <g data-detail="tiang-listrik">
    <path d={`M${x} ${ground}V${top}`} stroke={tone} strokeWidth="18" />
    <path d={`M${x - 70} ${top + 40}h140M${x - 50} ${top + 90}h100`} stroke={tone} strokeWidth="10" />
    <rect x={x + 12} y={top + 140} width="46" height="64" rx="6" fill="#7C8580" />
    {wiresTo.map((tx, i) => (
      <g key={i}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${x + (tx < x ? -60 : 60) + k * 8} ${top + 40 + k * 22}Q${(x + tx) / 2} ${top + 120 + k * 30} ${tx} ${top + 20 + k * 26}`} stroke="#2B2826" strokeWidth="2.6" fill="none" />
        ))}
      </g>
    ))}
    <path d={`M${x + 20} ${top + 200}q30 40 10 90q-20 40 10 70`} stroke="#2B2826" strokeWidth="2.6" fill="none" />
  </g>
);
export const Plant = ({ x, y, s = 1, kind = 0, pot = '#C9805A' }: { x: number; y: number; s?: number; kind?: number; pot?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-detail="tanaman">
    <Shadow x={0} y={0} w={80} />
    {kind === 0 && [-50, -20, 10, 40, -70, 60].map((a, i) => <path key={i} d={`M0 -50q${a * 0.6} -60 ${a} -${90 + (i % 3) * 20}`} stroke="#5E8C68" strokeWidth="12" fill="none" strokeLinecap="round" />)}
    {kind === 1 && [-36, -12, 12, 36].map((a, i) => <path key={i} d={`M${a * 0.3} -50l${a * 0.4} -${120 + (i % 2) * 30}l${8} ${120}Z`} fill={i % 2 ? '#6E9C78' : '#5B8A66'} />)}
    {kind === 2 && (
      <>
        {[[-30, -110], [20, -120], [0, -150], [-40, -150], [36, -90]].map(([a, b], i) => <ellipse key={i} cx={a} cy={b} rx="34" ry="22" transform={`rotate(${i * 30} ${a} ${b})`} fill={i % 2 ? '#6E9C78' : '#7FA889'} />)}
        {[[-20, -150], [30, -128], [-44, -112]].map(([a, b], i) => <circle key={'b' + i} cx={a} cy={b} r="8" fill={['#E7899A', '#F1C977', '#E7899A'][i]} />)}
      </>
    )}
    <path d="M-34 0h68l-8 -52h-52Z" fill={pot} />
    <rect x="-38" y="-58" width="76" height="12" rx="4" fill={pot} opacity=".85" />
  </g>
);
export const Poster = ({ x, y, w = 160, h = 210, rot = 0, bg = '#FFF9EF', art = '#95B8A2', text }: { x: number; y: number; w?: number; h?: number; rot?: number; bg?: string; art?: string; text?: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} data-detail="poster">
    <rect x="4" y="6" width={w} height={h} fill="#000" opacity=".12" />
    <rect width={w} height={h} fill={bg} />
    <rect x="12" y="12" width={w - 24} height={h * 0.55} fill={art} opacity=".8" />
    <circle cx={w * 0.7} cy={h * 0.25} r={w * 0.12} fill="#F1C977" />
    {text ? <text x={w / 2} y={h * 0.8} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={w * 0.13} fill="#3B3430">{text}</text> : <rect x="20" y={h * 0.74} width={w - 40} height="10" rx="5" fill="#CFC3AF" />}
    <circle cx={w / 2} cy="6" r="4" fill="#C24E4E" />
  </g>
);
export const ACUnit = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} data-detail="ac">
    <rect width="150" height="110" rx="6" fill="#DAD6CE" />
    <circle cx="80" cy="55" r="38" fill="#B9B4AA" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M48 ${32 + i * 14}h64`} stroke="#9C978D" strokeWidth="4" />)}
    <path d="M150 90q40 0 40 60" stroke="#8E8A82" strokeWidth="5" fill="none" />
  </g>
);
export const TrashBin = ({ x, y, color = '#3E7F6A' }: { x: number; y: number; color?: string }) => (
  <g transform={`translate(${x} ${y})`} data-detail="tempat-sampah">
    <Shadow x={0} y={0} w={90} />
    <path d="M-36 0h72l8 -110h-88Z" fill={color} />
    <rect x="-46" y="-126" width="92" height="18" rx="6" fill={color} opacity=".85" />
    <path d="M-20 -90v70M0 -90v70M20 -90v70" stroke="#000" strokeWidth="3" opacity=".15" />
  </g>
);
export const Bookshelf = ({ x, y, w = 220, rows = 3 }: { x: number; y: number; w?: number; rows?: number }) => (
  <g transform={`translate(${x} ${y})`} data-detail="rak-buku">
    <rect width={w} height={rows * 90 + 20} fill="#9C7552" />
    {Array.from({ length: rows }, (_, r) => (
      <g key={r}>
        <rect x="10" y={10 + r * 90} width={w - 20} height="80" fill="#7E5C40" />
        {Array.from({ length: Math.floor((w - 30) / 22) }, (_, i) => {
          const h = 50 + ((i * 7 + r * 3) % 4) * 8;
          return <rect key={i} x={16 + i * 22} y={90 + r * 90 - h} width="18" height={h} rx="2" fill={['#C24E4E', '#E1A93B', '#95B8A2', '#7E8FB0', '#E8D7B8', '#8B4354'][(i + r * 2) % 6]} />;
        })}
      </g>
    ))}
  </g>
);
export const StringLights = ({ x0, x1, y, sag = 30, f = 0, n = 12 }: { x0: number; x1: number; y: number; sag?: number; f?: number; n?: number }) => (
  <g data-detail="lampu-tumblr">
    <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke="#5E5148" strokeWidth="2" fill="none" />
    {Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n,
        bx = x0 + (x1 - x0) * t,
        by = y + sag * 4 * t * (1 - t);
      return (
        <g key={i}>
          <circle cx={bx} cy={by + 6} r="14" fill="#FFD98A" opacity={0.2 + 0.08 * Math.sin(f * 0.1 + i)} />
          <circle cx={bx} cy={by + 6} r="5" fill="#FFE7AE" />
        </g>
      );
    })}
  </g>
);
export const Rug = ({ x, y, w, h = 60, a = '#C98F84', b = '#E8D7B8' }: { x: number; y: number; w: number; h?: number; a?: string; b?: string }) => (
  <g data-detail="karpet">
    <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={a} />
    <ellipse cx={x} cy={y} rx={w / 2 - 24} ry={h / 2 - 9} fill="none" stroke={b} strokeWidth="5" strokeDasharray="14 10" />
  </g>
);
export const Calendar = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} data-detail="kalender">
    <rect width="110" height="150" fill="#FFF9EF" />
    <rect width="110" height="50" fill="#C24E4E" />
    <text x="55" y="34" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="22" fill="#FFF9EF">2026</text>
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={10 + (i % 5) * 19} y={62 + Math.floor(i / 5) * 20} width="12" height="10" fill={i === 12 ? '#C24E4E' : '#CFC3AF'} />)}
  </g>
);
export const Laundry = ({ x0, x1, y, colors = ['#E7899A', '#95B8A2', '#F1C977', '#7E8FB0', '#FFF9EF'], f = 0 }: { x0: number; x1: number; y: number; colors?: string[]; f?: number }) => (
  <g data-detail="jemuran">
    <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + 30} ${x1} ${y}`} stroke="#6E6A64" strokeWidth="3" fill="none" />
    {colors.map((c, i) => {
      const t = (i + 0.7) / (colors.length + 0.6),
        cx = x0 + (x1 - x0) * t,
        cy = y + 30 * 4 * t * (1 - t) * 0.5 + 4;
      const sw = Math.sin(f * 0.06 + i) * 4;
      return i % 2 ? (
        <path key={i} d={`M${cx - 40} ${cy}h80l-6 ${110}h-68Z`} fill={c} transform={`rotate(${sw} ${cx} ${cy})`} />
      ) : (
        <path key={i} d={`M${cx - 46} ${cy}h92l-16 30v74h-60v-74Z`} fill={c} transform={`rotate(${sw} ${cx} ${cy})`} />
      );
    })}
  </g>
);
export const Sandals = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} data-detail="sandal">
    <ellipse cx="0" cy="-6" rx="34" ry="11" fill="#3E7FA0" />
    <ellipse cx="66" cy="-4" rx="34" ry="11" fill="#3E7FA0" />
    <path d="M-10 -12q10 -10 20 0M56 -10q10 -10 20 0" stroke="#F4F1EA" strokeWidth="5" fill="none" />
  </g>
);
export const Bird = ({ x, y, f = 0 }: { x: number; y: number; f?: number }) => (
  <path d={`M${x - 18} ${y}q9 ${-8 + 4 * Math.sin(f * 0.4)} 18 0q9 ${-8 + 4 * Math.sin(f * 0.4)} 18 0`} stroke="#3B3430" strokeWidth="3" fill="none" strokeLinecap="round" />
);
export const Cat = ({ x, y, s = 1, color = '#E9A15A' }: { x: number; y: number; s?: number; color?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-detail="kucing">
    <Shadow x={0} y={0} w={110} />
    <path d="M-50 0q0 -50 46 -54q40 0 44 54Z" fill={color} />
    <path d="M40 -10q30 -10 24 -50" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="-40" cy="-58" r="26" fill={color} />
    <path d="M-60 -76l4 -24l14 16M-24 -78l-2 -24l-14 16" fill={color} />
    <path d="M-50 -60q4 -4 8 0M-36 -60q4 -4 8 0" stroke="#3A2E28" strokeWidth="2.6" fill="none" />
  </g>
);

// ---------------------------------------------------------------- PERSPEKTIF (7 Nov 2026)
// Pengguna: lantai/ubin/jalan harus trapesium — melebar saat dekat kamera, menyempit ke titik hilang.
// Horizon = tinggi mata kamera. Untuk kamera setinggi mata orang berdiri (tokoh skala S, kaki di yFeet): vy ≈ yFeet - 280*S.
type V = [number, number];
// Lantai satu titik hilang: baris ubin makin rapat ke arah jauh, kolom menyatu ke (vx,vy).
// yTop/yBot = batas lantai yang terlihat di layar; spread = lebar setengah grid di yBot (px).
export const PerspFloor = ({ vx, vy, yTop, yBot = 2000, spread = 2200, cols = 14, rows = 9, a = '#CDB79A', b = '#C4AD8F', line = '#B39C7E', checker = true }: { vx: number; vy: number; yTop: number; yBot?: number; spread?: number; cols?: number; rows?: number; a?: string; b?: string; line?: string; checker?: boolean }) => {
  const zFar = (yBot - vy) / (yTop - vy);
  const yAt = (t: number) => vy + (yBot - vy) / (zFar + (1 - zFar) * t); // t 0=jauh 1=dekat
  const xAt = (c: number, y: number) => vx + (-spread + (2 * spread * c) / cols) * ((y - vy) / (yBot - vy));
  const polys: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const y0 = yAt(r / rows),
      y1 = yAt((r + 1) / rows);
    for (let c = 0; c < cols; c++) {
      const fill = checker && (r + c) % 2 ? b : a;
      polys.push(<path key={r + '-' + c} d={`M${xAt(c, y0)} ${y0}L${xAt(c + 1, y0)} ${y0}L${xAt(c + 1, y1)} ${y1}L${xAt(c, y1)} ${y1}Z`} fill={fill} stroke={line} strokeWidth="2" />);
    }
  }
  return <g data-detail="lantai-perspektif"><rect x="-600" y={yTop} width="2300" height={yBot - yTop + 400} fill={a} />{polys}</g>;
};
// Jalan satu titik hilang: aspal + marka putus-putus + tepi, menyatu ke (vx,vy).
export const PerspRoad = ({ vx, vy, yTop, yBot = 2000, half = 1400, asphalt = '#5E5A55', mark = '#E8DFC8', curb = true }: { vx: number; vy: number; yTop: number; yBot?: number; half?: number; asphalt?: string; mark?: string; curb?: boolean }) => {
  const k = (y: number) => (y - vy) / (yBot - vy);
  const dashes = Array.from({ length: 7 }, (_, i) => {
    const t0 = Math.pow((i + 0.2) / 7, 1.8),
      t1 = Math.pow((i + 0.6) / 7, 1.8);
    const y0 = yTop + (yBot - yTop) * t0,
      y1 = yTop + (yBot - yTop) * t1;
    const w0 = 10 * k(y0),
      w1 = 10 * k(y1);
    return <path key={i} d={`M${vx - w0} ${y0}L${vx + w0} ${y0}L${vx + w1} ${y1}L${vx - w1} ${y1}Z`} fill={mark} />;
  });
  return (
    <g data-detail="jalan-perspektif">
      <path d={`M${vx - half * k(yTop)} ${yTop}L${vx + half * k(yTop)} ${yTop}L${vx + half} ${yBot}L${vx - half} ${yBot}Z`} fill={asphalt} />
      {curb && <path d={`M${vx - half * k(yTop)} ${yTop}L${vx - half} ${yBot}M${vx + half * k(yTop)} ${yTop}L${vx + half} ${yBot}`} stroke={mark} strokeWidth="6" opacity=".6" />}
      {dashes}
    </g>
  );
};
// Bidang dinding yang menjauh ke titik hilang (untuk kamera SERONG / dua titik hilang).
// Tepi dekat di x=nearX (atas nearTop, bawah nearBot), tepi jauh di x=farX. Mengembalikan pemeta (u 0..1 sepanjang dinding, v 0..1 tinggi) -> titik layar.
export const wallMap = (vx: number, vy: number, nearX: number, nearTop: number, nearBot: number, farX: number) => {
  const zf = (nearX - vx) / (farX - vx);
  return (u: number, v: number): V => {
    const z = 1 + u * (zf - 1); // 1 di dekat, zf di jauh
    const Y = nearBot + (nearTop - nearBot) * v;
    return [vx + (nearX - vx) / z, vy + (Y - vy) / z];
  };
};
export const quad = (m: (u: number, v: number) => V, u0: number, u1: number, v0: number, v1: number) => {
  const p = [m(u0, v0), m(u1, v0), m(u1, v1), m(u0, v1)];
  return `M${p.map((q) => q.map((n) => n.toFixed(1)).join(' ')).join('L')}Z`;
};

// ---------------------------------------------------------------- LANGIT HIDUP (7 Nov 2026)
// Pengguna: langit jangan kosong — beri awan, burung terbang, pesawat lewat, layangan, dsb. Semua bergerak pelan mengikuti f.
export const Cloud = ({ x, y, s = 1, tone = '#FFFFFF', o = 0.85 }: { x: number; y: number; s?: number; tone?: string; o?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} data-detail="awan">
    <ellipse cx="0" cy="0" rx="90" ry="34" fill={tone} />
    <circle cx="-40" cy="-20" r="38" fill={tone} />
    <circle cx="20" cy="-34" r="48" fill={tone} />
    <circle cx="66" cy="-12" r="30" fill={tone} />
  </g>
);
export const Plane = ({ x, y, s = 1, night = false, f = 0 }: { x: number; y: number; s?: number; night?: boolean; f?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} data-detail="pesawat">
    {!night && <path d="M-40 2h-260" stroke="#FFFFFF" strokeWidth="5" opacity=".55" strokeLinecap="round" />}
    <path d="M-40 0q4 -8 20 -8h52q10 0 14 8q-4 6 -14 6h-52q-16 0 -20 -6Z" fill={night ? '#2B3640' : '#E9EEF0'} />
    <path d="M0 -4l-22 -22h10l26 22ZM0 4l-18 16h10l22 -16ZM-34 -4l-10 -14h7l12 14Z" fill={night ? '#2B3640' : '#C9D3D6'} />
    {night && <circle cx="-44" cy="0" r="3" fill="#E85A5A" opacity={Math.floor(f / 8) % 2 ? 1 : 0.2} />}
    {night && <circle cx="10" cy="-20" r="2.5" fill="#FFFFFF" opacity={Math.floor(f / 8) % 2 ? 0.2 : 1} />}
  </g>
);
export const Flock = ({ x, y, f = 0, n = 5, s = 1, tone = '#3B3430' }: { x: number; y: number; f?: number; n?: number; s?: number; tone?: string }) => (
  <g transform={`translate(${x + f * 0.8} ${y}) scale(${s})`} data-detail="burung-terbang">
    {Array.from({ length: n }, (_, i) => {
      const bx = i * 46 - (i % 2) * 20,
        by = (i % 3) * 22 - i * 6,
        w = Math.sin(f * 0.35 + i) * 7;
      return <path key={i} d={`M${bx - 16} ${by}q8 ${-8 + w} 16 0q8 ${-8 + w} 16 0`} stroke={tone} strokeWidth="3" fill="none" strokeLinecap="round" />;
    })}
  </g>
);
export const Kite = ({ x, y, f = 0, s = 1, color = '#E85A5A' }: { x: number; y: number; f?: number; s?: number; color?: string }) => (
  <g transform={`translate(${x} ${y + 6 * Math.sin(f * 0.07)}) rotate(${6 * Math.sin(f * 0.05)}) scale(${s})`} data-detail="layangan">
    <path d="M0 -40L28 0L0 50L-28 0Z" fill={color} />
    <path d="M0 -40V50M-28 0H28" stroke="#FFF9EF" strokeWidth="2" />
    <path d="M0 50q14 30 -6 60t8 60" stroke="#FFF9EF" strokeWidth="2" fill="none" />
    <path d="M0 50Q200 300 420 800" stroke="#FFF9EF" strokeWidth="1.5" fill="none" opacity=".6" />
  </g>
);
export const Moon = ({ x, y, r = 46 }: { x: number; y: number; r?: number }) => (
  <g data-detail="bulan">
    <circle cx={x} cy={y} r={r * 2.2} fill="#F6EED8" opacity=".08" />
    <circle cx={x} cy={y} r={r} fill="#F6EED8" />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#E4DCC6" />
    <circle cx={x + r * 0.25} cy={y + r * 0.3} r={r * 0.1} fill="#E4DCC6" />
  </g>
);
// Paket langit siap pakai per waktu. Area langit kira-kira y 120–1000.
export const SkyLife = ({ f, time }: { f: number; time: 'pagi' | 'siang' | 'sore' | 'senja' | 'malam' }) => {
  const drift = (base: number, sp: number) => ((base + f * sp + 1400) % 1500) - 200;
  if (time === 'malam')
    return (
      <g data-detail="langit-malam">
        <Moon x={860} y={250} />
        <Cloud x={drift(200, 0.15)} y={360} s={1.1} tone="#3A4A56" o={0.7} />
        <Cloud x={drift(900, 0.1)} y={520} s={0.8} tone="#33424D" o={0.6} />
        <Plane x={drift(100, 1.6)} y={600} s={0.7} night f={f} />
      </g>
    );
  const tone = time === 'senja' ? '#F7C9A8' : time === 'sore' ? '#FFF1DE' : '#FFFFFF';
  return (
    <g data-detail="langit-siang">
      <Cloud x={drift(160, 0.2)} y={300} s={1.2} tone={tone} />
      <Cloud x={drift(820, 0.14)} y={470} s={0.9} tone={tone} o={0.75} />
      <Cloud x={drift(500, 0.1)} y={720} s={0.6} tone={tone} o={0.6} />
      <Flock x={120} y={560} f={f} n={5} s={0.9} tone={time === 'senja' ? '#5B3F3A' : '#3B3430'} />
      <Plane x={drift(40, 1.4)} y={250} s={0.6} f={f} />
    </g>
  );
};
