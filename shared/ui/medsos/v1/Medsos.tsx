// Layar Instagram (v1, 20 Nov 2026). Dibuat untuk "Cuekin Buzzer" v1. Pengguna 20 Nov 2026: "contoh sosmed harus real
// kayak di dunia nyata ... harus mirip", platform dipilih: Instagram. Meniru antarmuka Instagram (tema terang) sedekat
// mungkin: lembar komentar Reels (pegangan abu, judul "Komentar" di tengah, avatar bulat, nama + waktu abu, "Balas",
// hati garis di kanan + angka, baris emoji, kolom "Tambahkan komentar…"), postingan beranda (kepala akun + •••, foto,
// ikon suka/komentar/kirim/simpan, "Disukai oleh …"), dan lembar menu akun (Laporkan/Blokir merah). Akun dan isi karangan.
//   <HPLayar cx cy w reel goyang>{isi}</HPLayar>  goyang = f → HP seperti dipegang tangan  HP besar; reel = video Reels gelap di atas + lembar komentar putih dari tengah
//   KOM_Y0 / FEED_Y0(cy,w) = y baris pertama isi; isi memakai koordinat layar 1080×1920
//   <Komentar x y w nama waktu teks avatar suka sorot muncul balasan />
//   <KolomKomentar x y w teks ketik />      baris emoji + kolom "Tambahkan komentar…" (teks diketik 0..1)
//   <PostIG x y w akun jenis caption suka muncul />  postingan beranda; jenis 'warga' | 'data'
//   <MenuAkun x y w item />                  lembar menu: item { teks, merah?, coret?, centang?, tampil? }
//   <GridAkun x y w n kolom tampil />        grid avatar kosong (ribuan akun)
// Koordinat layar; jaga di safe zone (kiri ≥ 110, kanan ≤ 920, atas ≥ 220, bawah ≤ 1480).
import React from 'react';

const klamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const FONT = 'Lato';
export const IG = { teks: '#000000', abu: '#737373', garis: '#DBDBDB', latar: '#FFFFFF', biru: '#0095F6', merah: '#ED4956', isian: '#EFEFEF' };

export function AvatarKosong({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  return (
    <g data-detail="avatar-kosong">
      <circle cx={x} cy={y} r={r} fill="#C7C7C7" />
      <circle cx={x} cy={y - r * 0.2} r={r * 0.36} fill="#FFFFFF" />
      <path d={`M${x - r * 0.64} ${y + r * 0.78}C${x - r * 0.52} ${y + r * 0.2} ${x + r * 0.52} ${y + r * 0.2} ${x + r * 0.64} ${y + r * 0.78}Z`} fill="#FFFFFF" />
    </g>
  );
}
/** avatar berfoto (lingkaran berwarna dengan kepala sederhana) */
const AvatarFoto = ({ x, y, r, warna }: { x: number; y: number; r: number; warna: string }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={warna} />
    <circle cx={x} cy={y - r * 0.12} r={r * 0.38} fill="#F2D3B8" />
    <path d={`M${x - r * 0.42} ${y - r * 0.22}Q${x} ${y - r * 0.78} ${x + r * 0.42} ${y - r * 0.22}Q${x} ${y - r * 0.5} ${x - r * 0.42} ${y - r * 0.22}Z`} fill="#3A2A22" />
    <path d={`M${x - r * 0.7} ${y + r * 0.74}Q${x} ${y + r * 0.22} ${x + r * 0.7} ${y + r * 0.74}Z`} fill="#FFFFFF" opacity=".55" />
  </g>
);
const Hati = ({ x, y, s = 1, isi = false }: { x: number; y: number; s?: number; isi?: boolean }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 6C-9 -2 -14 -6 -14 -11C-14 -15 -11 -18 -7 -18C-4 -18 -1 -16 0 -13C1 -16 4 -18 7 -18C11 -18 14 -15 14 -11C14 -6 9 -2 0 6Z" fill={isi ? IG.merah : 'none'} stroke={isi ? IG.merah : IG.teks} strokeWidth={isi ? 0 : 2.2 / s} strokeLinejoin="round" />
);

export const geomHP = (cx: number, cy: number, w: number) => {
  const sh = w * 1.62,
    bz = 18;
  return { sx: cx - w / 2, sy: cy - sh / 2, sw: w, sh, bz };
};
/** y baris komentar pertama di lembar komentar Reels */
export const KOM_Y0 = (cy = 1000, w = 520) => {
  const g = geomHP(540, cy, w);
  return g.sy + g.sh * 0.36 + 108;
};
/** y isi pertama di beranda/menu (di bawah bilah atas) */
export const FEED_Y0 = (cy = 1000, w = 520) => geomHP(540, cy, w).sy + 150;

export function HPLayar({ cx = 540, cy = 1000, w = 520, reel = false, judul, goyang, children }: { cx?: number; cy?: number; w?: number; reel?: boolean; judul?: string; /** f: HP dipegang tangan (naik-turun + miring halus) */ goyang?: number; children?: React.ReactNode }) {
  const { sx, sy, sw, sh, bz } = geomHP(cx, cy, w);
  const W = sw + 2 * bz,
    H = sh + 2 * bz,
    x0 = sx - bz,
    y0 = sy - bz;
  const id = `hpclip-${Math.round(cx)}-${Math.round(cy)}-${Math.round(w)}`;
  const lembar = sy + sh * 0.36;
  return (
    <g data-fx="hp-instagram" data-box={`${Math.round(x0)},${Math.round(y0)},${Math.round(x0 + W)},${Math.round(y0 + H)}`}
      transform={goyang === undefined ? undefined : `translate(${(8 * Math.sin(goyang * 0.045)).toFixed(1)} ${(14 * Math.sin(goyang * 0.07)).toFixed(1)}) rotate(${(1.6 * Math.sin(goyang * 0.035)).toFixed(2)} ${cx} ${cy})`}>
      <defs>
        <clipPath id={id}><rect x={sx} y={sy} width={sw} height={sh} rx="34" /></clipPath>
      </defs>
      <rect x={x0 + 12} y={y0 + 20} width={W} height={H} rx="56" fill="#000" opacity=".26" />
      <rect x={x0} y={y0} width={W} height={H} rx="56" fill="#16181B" />
      <g clipPath={`url(#${id})`}>
        <rect x={sx} y={sy} width={sw} height={sh} fill={reel ? '#121212' : IG.latar} />
        {/* bilah status */}
        <text x={sx + 44} y={sy + 46} fontFamily={FONT} fontWeight="900" fontSize="22" fill={reel ? '#FFFFFF' : IG.teks}>19.42</text>
        <rect x={sx + sw - 92} y={sy + 30} width="46" height="20" rx="5" fill="none" stroke={reel ? '#FFFFFF' : IG.teks} strokeWidth="2" />
        <rect x={sx + sw - 89} y={sy + 33} width="30" height="14" rx="3" fill={reel ? '#FFFFFF' : IG.teks} />
        {reel ? (
          <g>
            {/* potongan video Reels di atas (gelap, buram) */}
            <rect x={sx} y={sy + 60} width={sw} height={lembar - sy - 40} fill="#2B2F36" />
            <circle cx={sx + sw * 0.5} cy={sy + 230} r="70" fill="#4A505A" />
            <rect x={sx + sw * 0.5 - 110} y={sy + 300} width="220" height="140" rx="40" fill="#4A505A" />
            <text x={sx + 34} y={sy + 110} fontFamily={FONT} fontWeight="900" fontSize="30" fill="#FFFFFF">Reels</text>
            {/* lembar komentar */}
            <rect x={sx} y={lembar} width={sw} height={sh} rx="28" fill={IG.latar} />
            <rect x={sx + sw / 2 - 30} y={lembar + 14} width="60" height="7" rx="3.5" fill="#C7C7C7" />
            <text x={sx + sw / 2} y={lembar + 62} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="25" fill={IG.teks}>Komentar</text>
            <path d={`M${sx} ${lembar + 84}h${sw}`} stroke={IG.garis} strokeWidth="1.5" />
          </g>
        ) : (
          <g>
            <text x={sx + 30} y={sy + 112} fontFamily={judul ? FONT : 'Georgia'} fontStyle={judul ? 'normal' : 'italic'} fontWeight="900" fontSize={judul ? 30 : 40} fill={IG.teks}>{judul ?? 'Instagram'}</text>
            {!judul && <Hati x={sx + sw - 104} y={sy + 104} s={1.2} />}
            {!judul && <path d={`M${sx + sw - 60} ${sy + 82}l26 14l-26 14l5 -14Z`} fill="none" stroke={IG.teks} strokeWidth="2.6" strokeLinejoin="round" />}
            <path d={`M${sx} ${sy + 138}h${sw}`} stroke={IG.garis} strokeWidth="1.5" />
          </g>
        )}
        {children}
        {!reel && (
          <g data-detail="bilah-atas">
            <rect x={sx} y={sy} width={sw} height="138" fill={IG.latar} />
            <text x={sx + 44} y={sy + 46} fontFamily={FONT} fontWeight="900" fontSize="22" fill={IG.teks}>19.42</text>
            <rect x={sx + sw - 92} y={sy + 30} width="46" height="20" rx="5" fill="none" stroke={IG.teks} strokeWidth="2" />
            <rect x={sx + sw - 89} y={sy + 33} width="30" height="14" rx="3" fill={IG.teks} />
            <text x={sx + 30} y={sy + 112} fontFamily={judul ? FONT : 'Georgia'} fontStyle={judul ? 'normal' : 'italic'} fontWeight="900" fontSize={judul ? 30 : 40} fill={IG.teks}>{judul ?? 'Instagram'}</text>
            {!judul && <Hati x={sx + sw - 104} y={sy + 104} s={1.2} />}
            {!judul && <path d={`M${sx + sw - 60} ${sy + 82}l26 14l-26 14l5 -14Z`} fill="none" stroke={IG.teks} strokeWidth="2.6" strokeLinejoin="round" />}
            <path d={`M${sx} ${sy + 138}h${sw}`} stroke={IG.garis} strokeWidth="1.5" />
          </g>
        )}
        {/* garis rumah */}
        <rect x={sx + sw / 2 - 70} y={sy + sh - 18} width="140" height="6" rx="3" fill={IG.teks} opacity=".85" />
      </g>
      <rect x={sx + sw / 2 - 58} y={sy + 12} width="116" height="30" rx="15" fill="#16181B" />
    </g>
  );
}

const bungkus = (t: string, n: number) => {
  const out: string[] = [];
  for (const k of t.split(' ')) {
    const l = out.length ? out[out.length - 1] : '';
    if (!out.length || (l + ' ' + k).length > n) out.push(k);
    else out[out.length - 1] = l + ' ' + k;
  }
  return out;
};

export function Komentar({ x, y, w, nama, waktu = '2 j', teks, avatar = 'kosong', suka = 0, sorot = 0, muncul = 1, balasan }: { x: number; y: number; w: number; nama: string; waktu?: string; teks: string; avatar?: 'kosong' | string; suka?: number; sorot?: number; muncul?: number; balasan?: number }) {
  if (muncul <= 0) return null;
  const baris = bungkus(teks, Math.floor((w - 130) / 13.2));
  const h = 74 + baris.length * 31 + (balasan ? 40 : 0);
  return (
    <g opacity={klamp(muncul * 1.5).toFixed(3)} transform={`translate(0 ${((1 - klamp(muncul)) * 20).toFixed(1)})`} data-detail="komentar-ig">
      {sorot > 0 && <rect x={x - 14} y={y - 12} width={w + 28} height={h + 6} fill="#FFE8EA" opacity={sorot} />}
      {avatar === 'kosong' ? <AvatarKosong x={x + 24} y={y + 24} r={24} /> : <AvatarFoto x={x + 24} y={y + 24} r={24} warna={avatar} />}
      <text x={x + 64} y={y + 16} fontFamily={FONT} fontSize="21">
        <tspan fontWeight="900" fill={IG.teks}>{nama}</tspan>
        <tspan fontWeight="400" fill={IG.abu}>{'  '}{waktu}</tspan>
      </text>
      {baris.map((b, i) => (
        <text key={i} x={x + 64} y={y + 48 + i * 31} fontFamily={FONT} fontWeight="400" fontSize="24" fill={IG.teks}>{b}</text>
      ))}
      <text x={x + 64} y={y + 50 + baris.length * 31} fontFamily={FONT} fontWeight="700" fontSize="19" fill={IG.abu}>Balas</text>
      {balasan ? (
        <g>
          <path d={`M${x + 64} ${y + 84 + baris.length * 31}h34`} stroke={IG.abu} strokeWidth="1.5" />
          <text x={x + 108} y={y + 90 + baris.length * 31} fontFamily={FONT} fontWeight="700" fontSize="19" fill={IG.abu}>Lihat {balasan.toLocaleString('id-ID')} balasan lainnya</text>
        </g>
      ) : null}
      <Hati x={x + w - 14} y={y + 34} s={0.9} isi={suka > 0 && sorot > 0} />
      {suka > 0 && <text x={x + w - 14} y={y + 64} textAnchor="middle" fontFamily={FONT} fontWeight="400" fontSize="17" fill={IG.abu}>{suka}</text>}
    </g>
  );
}

export function KolomKomentar({ x, y, w, teks = '', ketik = 1 }: { x: number; y: number; w: number; teks?: string; ketik?: number }) {
  const isi = teks.slice(0, Math.round(teks.length * klamp(ketik)));
  const EMO = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];
  return (
    <g data-detail="kolom-komentar-ig">
      <path d={`M${x - 30} ${y - 16}h${w + 60}`} stroke={IG.garis} strokeWidth="1.5" />
      {EMO.map((e, i) => (
        <text key={i} x={x + 10 + i * ((w - 20) / 8)} y={y + 22} fontSize="28">{e}</text>
      ))}
      <AvatarFoto x={x + 26} y={y + 82} r={26} warna="#C99A6B" />
      <rect x={x + 66} y={y + 56} width={w - 66} height="54" rx="27" fill="none" stroke={IG.garis} strokeWidth="2" />
      <text x={x + 90} y={y + 91} fontFamily={FONT} fontWeight="400" fontSize="22" fill={isi ? IG.teks : IG.abu}>{isi || 'Tambahkan komentar…'}</text>
      {isi && <text x={x + w - 22} y={y + 91} textAnchor="end" fontFamily={FONT} fontWeight="900" fontSize="22" fill={IG.biru}>Kirim</text>}
    </g>
  );
}

const FotoWarga = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#C9A47E" />
    <rect x={x} y={y} width={w} height={h * 0.55} fill="#D8B48A" />
    <circle cx={x + w * 0.8} cy={y + h * 0.2} r={h * 0.08} fill="#F2C27A" opacity=".8" />
    {[0.22, 0.5, 0.78].map((u, i) => (
      <g key={i}>
        <path d={`M${x + u * w - h * 0.2} ${y + h}C${x + u * w - h * 0.19} ${y + h * 0.62} ${x + u * w + h * 0.19} ${y + h * 0.62} ${x + u * w + h * 0.2} ${y + h}Z`} fill={['#5E8C6A', '#9E4A52', '#4E6B8A'][i]} />
        <circle cx={x + u * w} cy={y + h * 0.48} r={h * 0.12} fill={['#8D5B3F', '#6E4630', '#A06A49'][i]} />
        <path d={`M${x + u * w - h * 0.12} ${y + h * 0.42}a${h * 0.12} ${h * 0.12} 0 0 1 ${h * 0.24} 0Z`} fill="#2B2220" />
        <rect x={x + u * w - h * 0.09} y={y + h * 0.5} width={h * 0.18} height={h * 0.07} rx="4" fill="#F5F2EA" />
      </g>
    ))}
    <rect x={x} y={y} width={w} height={h} fill="#B88A5A" opacity=".25" />
  </g>
);
const FotoData = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#F3E3C4" />
    <text x={x + 28} y={y + 52} fontFamily={FONT} fontWeight="900" fontSize="30" fill="#2B2A28">Data hari ini</text>
    {[0.35, 0.55, 0.85, 0.6].map((v, i) => (
      <rect key={i} x={x + 40 + i * ((w - 80) / 4)} y={y + h - 30 - v * (h - 110)} width={(w - 80) / 4 - 22} height={v * (h - 110)} rx="6" fill={i === 2 ? '#8B4354' : '#7FA48D'} />
    ))}
  </g>
);

export function PostIG({ x, y, w, akun, jenis, caption, suka = 0, muncul = 1, warna = '#7FA48D' }: { x: number; y: number; w: number; akun: string; jenis: 'warga' | 'data'; caption: string; suka?: number; muncul?: number; warna?: string }) {
  if (muncul <= 0) return null;
  const fh = w * 0.62;
  const Foto = jenis === 'warga' ? FotoWarga : FotoData;
  return (
    <g opacity={klamp(muncul * 1.5).toFixed(3)} data-detail={`post-ig-${jenis}`}>
      <AvatarFoto x={x + 26} y={y + 26} r={22} warna={warna} />
      <text x={x + 60} y={y + 33} fontFamily={FONT} fontWeight="900" fontSize="22" fill={IG.teks}>{akun}</text>
      <text x={x + w - 10} y={y + 33} textAnchor="end" fontFamily={FONT} fontWeight="900" fontSize="22" fill={IG.teks}>•••</text>
      <Foto x={x - 30} y={y + 60} w={w + 60} h={fh} />
      <g transform={`translate(0 ${y + 60 + fh + 34})`}>
        <Hati x={x + 16} y={6} s={1.15} isi={suka > 1000} />
        <path d={`M${x + 62} -12a17 17 0 1 1 7 27l-12 4l4 -11a17 17 0 0 1 1 -20Z`} fill="none" stroke={IG.teks} strokeWidth="2.4" strokeLinejoin="round" />
        <path d={`M${x + 112} -14l30 10l-30 12l6 -12Z`} fill="none" stroke={IG.teks} strokeWidth="2.4" strokeLinejoin="round" />
        <path d={`M${x + w - 24} -14h20v30l-10 -8l-10 8Z`} fill="none" stroke={IG.teks} strokeWidth="2.4" strokeLinejoin="round" />
        <text x={x} y={46} fontFamily={FONT} fontWeight="900" fontSize="21" fill={IG.teks}>{Math.round(suka).toLocaleString('id-ID')} suka</text>
        <text x={x} y={78} fontFamily={FONT} fontSize="21" fill={IG.teks}>
          <tspan fontWeight="900">{akun}</tspan>
          <tspan fontWeight="400">{' '}{caption}</tspan>
        </text>
      </g>
    </g>
  );
}

export function MenuAkun({ x, y, w, item }: { x: number; y: number; w: number; item: { teks: string; merah?: boolean; coret?: boolean; centang?: boolean; tampil?: number }[] }) {
  return (
    <g data-fx="menu-ig" data-box={`${x},${y},${x + w},${y + item.length * 82}`}>
      {item.map((it, i) => {
        const m = klamp(it.tampil ?? 1);
        if (m <= 0) return null;
        const yy = y + i * 82;
        return (
          <g key={i} opacity={klamp(m * 1.5).toFixed(3)} data-sfx="pop" data-sfx-id={`menu-${i}-${it.teks}`}>
            <text x={x + 10} y={yy + 46} fontFamily={FONT} fontWeight={it.merah ? 700 : 400} fontSize="28" fill={it.coret ? '#A8A8A8' : it.merah ? IG.merah : IG.teks}>{it.teks}</text>
            {it.coret && <path d={`M${x + 4} ${yy + 37}h${it.teks.length * 15.5 + 14}`} stroke="#8B4354" strokeWidth="4" strokeLinecap="round" />}
            {it.coret && <path d={`M${x + w - 44} ${yy + 22}l26 26M${x + w - 18} ${yy + 22}l-26 26`} stroke="#8B4354" strokeWidth="5" strokeLinecap="round" />}
            {it.centang && <path d={`M${x + w - 48} ${yy + 36}l11 12l22 -24`} stroke="#3E8E5B" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            <path d={`M${x - 30} ${yy + 76}h${w + 60}`} stroke={IG.garis} strokeWidth="1.5" />
          </g>
        );
      })}
    </g>
  );
}

export function GridAkun({ x, y, w, n, kolom = 20, tampil }: { x: number; y: number; w: number; n: number; kolom?: number; tampil?: number }) {
  const sel = w / kolom;
  const t = Math.floor(Math.min(n, tampil ?? n));
  const h = Math.ceil(n / kolom) * sel;
  return (
    <g data-fx="diagram" data-box={`${Math.round(x)},${Math.round(y)},${Math.round(x + w)},${Math.round(y + h)}`}>
      {Array.from({ length: t }, (_, i) => (
        <AvatarKosong key={i} x={x + (i % kolom) * sel + sel / 2} y={y + Math.floor(i / kolom) * sel + sel / 2} r={sel * 0.42} />
      ))}
    </g>
  );
}
