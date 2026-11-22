// Lokasi bersama: rumah masa kecil Yan (tanpa kalender bertahun: ini kilas balik) (7 Nov 2026, Maaf v3; dibuat baru). Satu ruang tamu-makan malam tahun 2000-an:
// wallpaper garis, pintu depan, jendela malam, TV tabung di bufet, foto keluarga, jam dinding, kipas, sofa.
// Bingkai 1080×1920, lantai y 1620 untuk dewasa skala 2 (anak skala 1,45). RumahYanBack → (tokoh) → MejaMakan (opsional).
// Dipakai sebagai kilas balik: tambahkan lapisan sepia lewat KilasBalik.
import React from 'react';
import { P } from '../../../core/v1/core';
import { GlassPane, Sheen } from '../../_detail/v2/Detail';
import { Plant, Shadow, PerspFloor, Rug } from '../../_detail/v1/Detail';

export const RUMAH_YAN = { floor: 1620, door: [820, 1620] as [number, number] };

export function RumahYanBack({ f, pintuTerbuka = 0 }: { f: number; pintuTerbuka?: number }) {
  return (
    <g data-set="rumah-yan-kecil">
      <rect x="-400" y="-200" width="1880" height="2400" fill="#E7D9B8" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={-400 + i * 80} y="-200" width="34" height="1700" fill="#DCCBA5" opacity=".7" />)}
      <rect x="-400" y="1240" width="1880" height="300" fill="#C8B288" />
      <path d="M-400 1240h1880" stroke="#A88F65" strokeWidth="12" />
      {/* jendela malam */}
      <GlassPane x={110} y={430} w={300} h={360} f={f} sky="#2E3B4B" deep="#1E2833" frame="#8E6A4C" frameW={16} id="rumah-yan-kaca" />
      <rect x="90" y="410" width="340" height="20" fill="#8E6A4C" />
      {/* foto keluarga + jam + kalender */}
      <g data-detail="foto-keluarga">
        <rect x="470" y="420" width="240" height="180" rx="6" fill="#8E6A4C" />
        <rect x="486" y="436" width="208" height="148" fill="#F1E3C4" />
        {[[540, '#7E8FB0'], [600, '#C78F6A'], [650, '#95B8A2']].map(([x, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={490 + (i === 2 ? 14 : 0)} r={i === 2 ? 15 : 19} fill="#F4D9C4" />
            <rect x={(x as number) - 20} y={514 + (i === 2 ? 14 : 0)} width="40" height={60 - (i === 2 ? 14 : 0)} rx="10" fill={c as string} />
          </g>
        ))}
      </g>
      <g transform="translate(560 300)" data-detail="jam-dinding">
        <circle r="54" fill="#8E6A4C" /><circle r="44" fill="#FFF9EF" />
        <path d="M0 0v-30M0 0l22 8" stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* pintu depan */}
      <rect x="700" y="760" width="260" height="860" fill="#7A5A40" />
      <g transform={`translate(700 760) scale(${1 - 0.55 * pintuTerbuka} 1)`}>
        <rect x="0" y="0" width="260" height="860" fill="#9E7553" />
        <rect x="30" y="40" width="200" height="300" rx="6" fill="#B08560" />
        <rect x="30" y="400" width="200" height="400" rx="6" fill="#B08560" />
        <circle cx="226" cy="470" r="11" fill="#E0B44E" />
      </g>
      {pintuTerbuka > 0 && <path d={`M${960 - 260 * 0.55 * pintuTerbuka} 760h${260 * 0.55 * pintuTerbuka}v860h${-260 * 0.55 * pintuTerbuka}Z`} fill="#24323F" />}
      {/* bufet + TV tabung */}
      <rect x="-20" y="1080" width="440" height="200" fill="#8E6A4C" />
      <path d="M-20 1180h440M200 1080v200" stroke="#6E5038" strokeWidth="6" />
      <rect x="40" y="900" width="230" height="180" rx="22" fill="#5E5A55" />
      <rect x="60" y="918" width="170" height="140" rx="18" fill="#7FA0A8" />
      <rect x="60" y="918" width="170" height="140" rx="18" fill="#B9D6DB" opacity={0.25 + 0.2 * Math.abs(Math.sin(f * 0.21))} />
      <path d="M150 900l-30 -60M150 900l34 -56" stroke="#4A4542" strokeWidth="4" />
      <Plant x={350} y={1080} s={0.8} kind={0} />
      {/* kipas berdiri */}
      <g transform="translate(1010 1300)" data-detail="kipas">
        <path d="M0 0v300" stroke="#9AA4A0" strokeWidth="10" />
        <circle r="70" fill="#E6EFEB" stroke="#9AA4A0" strokeWidth="6" />
        <g transform={`rotate(${f * 40})`} opacity=".7">{[0, 120, 240].map((r) => <ellipse key={r} rx="16" ry="56" cy="-30" fill="#A9C7D6" transform={`rotate(${r})`} />)}</g>
      </g>
      <PerspFloor vx={540} vy={1150} yTop={1530} a="#D9C9A4" b="#E7DAB9" line="#C5B38E" cols={10} rows={6} />
      <Rug x={160} y={1590} w={760} h={70} a="#B5655A" b="#E8D7B8" />
      <Sheen x={-400} y={1530} w={1880} h={200} opacity={0.12} id="rumah-yan-lantai" />
    </g>
  );
}

/** Meja makan depan (di depan tokoh duduk), taplak bermotif, sampai lantai. */
export function MejaMakan() {
  return (
    <g data-set="meja-makan">
      <Shadow x={540} y={1760} w={900} o={0.14} />
      <path d="M80 1430h920l30 60H50Z" fill="#F4E9D2" />
      <path d="M50 1490h980v440H50Z" fill="#E9D8BC" />
      <g fill="#C98F84" opacity=".55">{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={100 + i * 100} cy={1560 + (i % 2) * 60} r="12" />)}</g>
      <path d="M50 1490h980" stroke="#C9B391" strokeWidth="8" />
    </g>
  );
}

/** Lapisan kilas balik: sepia hangat + vinyet, di atas seluruh adegan. */
export const KilasBalik = ({ amt = 1 }: { amt?: number }) => (
  <g data-fx="kilas-balik" opacity={amt}>
    <rect width="1080" height="1920" fill="#C8A26E" opacity=".22" style={{ mixBlendMode: 'multiply' }} />
    <radialGradient id="kb-vin" cx="50%" cy="50%" r="70%">
      <stop offset=".55" stopColor="#5A4030" stopOpacity="0" />
      <stop offset="1" stopColor="#5A4030" stopOpacity=".45" />
    </radialGradient>
    <rect width="1080" height="1920" fill="url(#kb-vin)" />
  </g>
);
