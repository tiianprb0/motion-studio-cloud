// Properti peringatan dini tsunami (v1, 21 Nov 2026). Dibuat untuk "Badaknya Diselamatkan, Warganya?" (pesisir
// Pandeglang/Selat Sunda). Tanpa logo instansi; bentuk mengikuti perangkat yang umum di pesisir Indonesia.
//   <MenaraSirene s nyala f />          menara rangka besi ±12 m, empat corong sirene + panel surya; nyala 0..1 = lampu
//                                        kedip + gelombang bunyi. Titik (0,0) = kaki menara di tanah. 175 px/m × s.
//   <PenerimaWRS s layar perbaikan f /> alat penerima peringatan dini (Warning Receiver System) di meja: kotak hitam
//                                        dengan layar kecil, pengeras suara, kabel antena. layar 'nyala' | 'mati';
//                                        perbaikan 0..1 = kertas "DALAM PERBAIKAN" ditempel + kabel terlepas.
//                                        Titik (0,0) = tengah alas di permukaan meja. Lebar ±0,45 m.
//   <PapanEvakuasi s arah teks />       papan jalur evakuasi tsunami (oranye, orang berlari + gelombang + panah).
//                                        Titik (0,0) = kaki tiang di tanah, tinggi ±2,4 m.
import React from 'react';

const M = 175; // px per meter pada s = 1 (sama dengan rig tokoh)

export function MenaraSirene({ s = 1, nyala = 0, f = 0 }: { s?: number; nyala?: number; f?: number }) {
  const H = 12 * M,
    a = 0.55 * M,
    b = 1.3 * M;
  const kedip = nyala > 0 && Math.floor(f / 6) % 2 === 0;
  return (
    <g data-benda="menara-sirene" transform={`scale(${s})`}>
      <ellipse cx="0" cy="0" rx={b * 1.1} ry={14} fill="#000" opacity=".15" />
      {/* kaki rangka */}
      <path d={`M${-b} 0 L${-a} ${-H} M${b} 0 L${a} ${-H}`} stroke="#6B7178" strokeWidth="14" />
      {Array.from({ length: 8 }, (_, i) => {
        const y0 = -i * (H / 8),
          y1 = -(i + 1) * (H / 8);
        const w0 = b - (b - a) * (i / 8),
          w1 = b - (b - a) * ((i + 1) / 8);
        return (
          <g key={i}>
            <path d={`M${-w0} ${y0} L${w1} ${y1} M${w0} ${y0} L${-w1} ${y1}`} stroke="#858B92" strokeWidth="5" />
            <path d={`M${-w1} ${y1} H${w1}`} stroke="#6B7178" strokeWidth="7" />
          </g>
        );
      })}
      {/* panel surya */}
      <g transform={`translate(${-a - 60} ${-H * 0.62}) rotate(-28)`}>
        <rect x="-70" y="-40" width="140" height="80" fill="#2F4A6B" stroke="#C9CED3" strokeWidth="5" />
        <path d="M-70 0H70 M-23 -40V40 M23 -40V40" stroke="#5C7AA0" strokeWidth="2" />
      </g>
      <rect x={-a - 30} y={-H * 0.55} width="60" height="80" rx="6" fill="#DADDE0" stroke="#9AA0A6" strokeWidth="3" />
      {/* kepala sirene: empat corong */}
      <rect x={-a - 10} y={-H - 30} width={2 * a + 20} height="36" fill="#9AA0A6" />
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${k * 30} ${-H - 110} L${k * (a + 110)} ${-H - 170} L${k * (a + 110)} ${-H - 20} L${k * 30} ${-H - 60} Z`} fill="#E9EBED" stroke="#9AA0A6" strokeWidth="4" />
          <ellipse cx={k * (a + 110)} cy={-H - 95} rx="16" ry="75" fill="#B9BEC3" />
          <path d={`M${k * 30} ${-H - 210} L${k * (a + 70)} ${-H - 250} L${k * (a + 70)} ${-H - 140} L${k * 30} ${-H - 160} Z`} fill="#E9EBED" stroke="#9AA0A6" strokeWidth="4" />
          <ellipse cx={k * (a + 70)} cy={-H - 195} rx="12" ry="55" fill="#B9BEC3" />
        </g>
      ))}
      <rect x="-30" y={-H - 230} width="60" height="210" fill="#C9CED3" />
      <circle cx="0" cy={-H - 260} r="26" fill={kedip ? '#FF4A3D' : '#8E3434'} />
      {kedip && <circle cx="0" cy={-H - 260} r="60" fill="#FF4A3D" opacity=".25" />}
      {/* gelombang bunyi */}
      {nyala > 0 &&
        [0, 1, 2].map((i) => {
          const u = ((f * 0.04 + i / 3) % 1);
          return [-1, 1].map((k) => (
            <path key={`${i}${k}`} d={`M${k * (a + 150 + u * 380)} ${-H - 260 - u * 120} q${k * 60} ${130 + u * 120} 0 ${260 + u * 240}`} stroke="#FF6A55" strokeWidth={10 - u * 6} fill="none" opacity={nyala * (1 - u) * 0.8} />
          ));
        })}
    </g>
  );
}

export function PenerimaWRS({ s = 1, layar = 'mati', perbaikan = 0, f = 0 }: { s?: number; layar?: 'nyala' | 'mati'; perbaikan?: number; f?: number }) {
  const w = 0.45 * M,
    h = 0.32 * M;
  const nyala = layar === 'nyala';
  return (
    <g data-benda="penerima-wrs" transform={`scale(${s})`}>
      <ellipse cx="0" cy="2" rx={w * 0.62} ry="8" fill="#000" opacity=".18" />
      {/* kabel antena ke dinding */}
      <path d={perbaikan > 0.5 ? `M${w / 2 - 6} ${-h + 20} C${w / 2 + 40} ${-h + 40} ${w / 2 + 50} -10 ${w / 2 + 90} 0` : `M${w / 2 - 6} ${-h + 20} C${w / 2 + 40} ${-h} ${w / 2 + 60} ${-h - 120} ${w / 2 + 70} ${-h - 260}`} stroke="#2B2D30" strokeWidth="5" fill="none" />
      {perbaikan > 0.5 && <rect x={w / 2 + 84} y="-8" width="16" height="10" rx="2" fill="#8C8F93" />}
      <rect x={-w / 2} y={-h} width={w} height={h} rx="8" fill="#33363A" />
      <rect x={-w / 2} y={-h} width={w} height="10" rx="5" fill="#45494E" />
      {/* layar kecil */}
      <rect x={-w / 2 + 12} y={-h + 18} width={w * 0.52} height={h * 0.42} rx="4" fill={nyala ? '#9FE3B0' : '#1C1E20'} />
      {nyala && <text x={-w / 2 + 18} y={-h + 18 + h * 0.3} fontFamily="Lato" fontWeight="900" fontSize="13" fill="#1F4A2B">SIAGA</text>}
      {!nyala && <path d={`M${-w / 2 + 16} ${-h + 22} l${w * 0.18} ${h * 0.12}`} stroke="#3A3D40" strokeWidth="2" />}
      {/* lampu status + tombol */}
      <circle cx={w / 2 - 22} cy={-h + 26} r="6" fill={nyala ? (Math.floor(f / 8) % 2 ? '#5BD57A' : '#2E8A47') : '#4A2A2A'} />
      <circle cx={w / 2 - 22} cy={-h + 46} r="6" fill="#55595E" />
      {/* kisi pengeras suara */}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={-w / 2 + 14} y={-h + 18 + h * 0.5 + i * 8} width={w * 0.52} height="3" rx="1.5" fill="#55595E" />
      ))}
      {/* kertas DALAM PERBAIKAN */}
      {perbaikan > 0 && (
        <g opacity={Math.min(1, perbaikan * 1.6)} transform={`translate(${-w * 0.08} ${-h * 0.62 - (1 - perbaikan) * 30}) rotate(-7)`}>
          <rect x={-w * 0.36} y="-26" width={w * 0.72} height="52" fill="#FFF6D8" stroke="#D8C98E" strokeWidth="1.5" />
          <rect x={-w * 0.36 + 6} y="-34" width="26" height="12" fill="#E8DFC0" opacity=".9" transform="rotate(-12)" />
          <text x="0" y="-4" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="13" fill="#B23A2E">DALAM</text>
          <text x="0" y="14" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="13" fill="#B23A2E">PERBAIKAN</text>
        </g>
      )}
    </g>
  );
}

export function PapanEvakuasi({ s = 1, arah = 1, teks = 'JALUR EVAKUASI' }: { s?: number; arah?: number; teks?: string }) {
  const tinggi = 2.4 * M,
    w = 0.9 * M,
    h = 0.62 * M;
  return (
    <g data-benda="papan-evakuasi" transform={`scale(${s})`}>
      <ellipse cx="0" cy="0" rx="26" ry="6" fill="#000" opacity=".15" />
      <rect x="-5" y={-tinggi} width="10" height={tinggi} fill="#8E949A" />
      <g transform={`translate(0 ${-tinggi})`}>
        <rect x={-w / 2} y="0" width={w} height={h} rx="8" fill="#E8731E" stroke="#FFFFFF" strokeWidth="5" />
        {/* gelombang */}
        <path d={`M${-w / 2 + 12} ${h * 0.6} q14 -26 30 -6 q10 12 22 0 q12 -14 22 0 v${h * 0.25} h-74 Z`} fill="#FFFFFF" />
        {/* orang berlari */}
        <g transform={`translate(${-w / 2 + w * 0.55} ${h * 0.2}) scale(${arah} 1)`} fill="#FFFFFF">
          <circle cx="6" cy="0" r="7" />
          <path d="M2 8 L-6 30 L4 30 L10 14 Z" />
          <path d="M-6 30 L-16 44 L-11 46 L0 34 Z M2 30 L12 46 L17 43 L8 30 Z" />
          <path d="M2 12 L-10 20 M6 12 L18 18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* panah */}
        <path transform={`translate(${w / 2 - 30} ${h * 0.42}) scale(${arah} 1)`} d="M-16 -6 H4 V-14 L18 0 L4 14 V6 H-16 Z" fill="#FFFFFF" />
        <text x="0" y={h - 10} textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="14" fill="#FFFFFF">{teks}</text>
      </g>
    </g>
  );
}
