// Lokasi bersama: depan kantor BALAI TAMAN NASIONAL (Labuan, Pandeglang), panggung flat 2D dari jalan (v1, 21 Nov 2026).
// Dibuat untuk "Badaknya Diselamatkan, Warganya?": warga datang ke Balai TN Ujung Kulon menolak relokasi badak.
// Kamera berdiri di jalan depan kantor, menghadap gedung. Lapisan: langit → pohon belakang → gedung satu lantai (pilar,
// atap limasan, papan nama di atas teras) → halaman paving (perspektif) → pagar besi + gerbang → jalan aspal (warga).
// Tanpa logo instansi; papan nama hanya teks (bisa diganti lewat `nama`).
//   BALAI.jalan y kaki tokoh di jalan depan pagar (skala ±1,6–2); BALAI.halaman y kaki di halaman (skala ±0,9)
//   BALAI.gerbang {x0, x1} celah gerbang di pagar
// Prop: f, gerbang 0..1 (0 tertutup, 1 terbuka), nama (dua baris), isiHalaman (di balik pagar), isi (di jalan), isiDepan
import React from 'react';

export const BALAI = { jalan: 1820, halaman: 1360, pagar: 1500, gerbang: { x0: 400, x1: 700 } };
const rnd = (n: number) => {
  const v = Math.sin(n * 77.7 + 9.1) * 43758.5453;
  return v - Math.floor(v);
};

function Ketapang({ x, y, s, f }: { x: number; y: number; s: number; f: number }) {
  const g = Math.sin(f * 0.04) * 4;
  return (
    <g>
      <path d={`M${x - 16 * s} ${y} L${x - 8 * s} ${y - 420 * s} L${x + 8 * s} ${y - 420 * s} L${x + 16 * s} ${y} Z`} fill="#6A5444" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k} transform={`translate(${g * (k + 1) * 0.3} 0)`}>
          <ellipse cx={x} cy={y - (260 + k * 90) * s} rx={(260 - k * 45) * s} ry={46 * s} fill={k % 2 ? '#5E8A55' : '#4F7A4A'} />
          <ellipse cx={x - 40 * s} cy={y - (270 + k * 90) * s} rx={(150 - k * 25) * s} ry={22 * s} fill="#79A26A" opacity=".6" />
        </g>
      ))}
    </g>
  );
}

export function BalaiTN2D({ f = 0, gerbang = 0, nama = ['BALAI TAMAN NASIONAL', 'UJUNG KULON'], isiHalaman, isi, isiDepan, id = 'btn' }: { f?: number; gerbang?: number; nama?: string[]; isiHalaman?: React.ReactNode; isi?: React.ReactNode; isiDepan?: React.ReactNode; id?: string }) {
  const G = BALAI.gerbang;
  const geser = (G.x1 - G.x0) * 0.5 * Math.max(0, Math.min(1, gerbang));
  return (
    <g data-set="balai-tn">
      <defs>
        <linearGradient id={`${id}-langit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE0EC" />
          <stop offset="1" stopColor="#F4EBD6" />
        </linearGradient>
      </defs>
      <rect x="-300" y="-300" width="1680" height="1400" fill={`url(#${id}-langit)`} />
      {[0, 1, 2].map((k) => {
        const x = ((k * 560 + f * 0.5) % 1700) - 300;
        return (
          <g key={k} fill="#FFFFFF" opacity=".85">
            <ellipse cx={x} cy={200 + k * 90} rx="120" ry="34" />
            <ellipse cx={x + 70} cy={186 + k * 90} rx="80" ry="30" />
          </g>
        );
      })}
      {/* pohon belakang */}
      {Array.from({ length: 6 }, (_, k) => (
        <ellipse key={k} cx={-200 + k * 300} cy={760 + rnd(k) * 40} rx="220" ry="120" fill={k % 2 ? '#7EA27A' : '#6F956C'} />
      ))}
      {/* gedung */}
      <rect x="-300" y="820" width="1680" height="560" fill="#E9E2D2" />
      <g data-benda="gedung-balai">
        <rect x="-120" y="900" width="1320" height="460" fill="#F3EEE2" />
        <rect x="-120" y="1300" width="1320" height="60" fill="#D8CFBC" />
        {/* jendela */}
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k}>
            <rect x={-60 + k * 220} y="1040" width="130" height="170" fill="#B9D2DA" stroke="#5E7F6A" strokeWidth="10" />
            <path d={`M${5 + k * 220} 1040V1210M${-60 + k * 220} 1120H${70 + k * 220}`} stroke="#5E7F6A" strokeWidth="6" />
            <path d={`M${-50 + k * 220} 1060 l40 50`} stroke="#FFFFFF" strokeWidth="6" opacity=".5" />
          </g>
        ))}
        {/* pintu utama */}
        <rect x="480" y="1080" width="120" height="220" fill="#7A5A42" />
        <path d="M540 1080V1300" stroke="#5E4632" strokeWidth="4" />
        {/* teras + pilar */}
        <rect x="300" y="940" width="480" height="26" fill="#5E7F6A" />
        {[320, 470, 610, 760].map((x) => (
          <rect key={x} x={x - 14} y="966" width="28" height="334" fill="#FFFFFF" stroke="#D8CFBC" strokeWidth="3" />
        ))}
        {/* atap limasan */}
        <path d="M-160 900 L60 760 L1020 760 L1240 900 Z" fill="#9C4A38" />
        {Array.from({ length: 5 }, (_, k) => (
          <path key={k} d={`M${-160 + k * 44} ${900 - k * 28}H${1240 - k * 44}`} stroke="#7E3A2C" strokeWidth="3" />
        ))}
        <path d="M200 850 L300 790 L780 790 L880 850 Z" fill="#8A3F30" />
        {/* papan nama di atas teras */}
        <rect x="250" y="850" width="580" height="96" rx="6" fill="#5E7F6A" />
        <text x="540" y="890" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="32" fill="#FFF6E3">{nama[0]}</text>
        <text x="540" y="930" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="36" fill="#F3D79F">{nama[1]}</text>
      </g>
      {/* tiang bendera */}
      <g data-benda="tiang-bendera">
        <rect x="954" y="900" width="10" height="460" fill="#C9CED3" />
        <path d={`M964 910 q40 ${8 + Math.sin(f * 0.15) * 8} 80 0 v34 q-40 ${-8 + Math.sin(f * 0.15) * 8} -80 0 Z`} fill="#D33A2E" />
        <path d={`M964 944 q40 ${8 + Math.sin(f * 0.15) * 8} 80 0 v34 q-40 ${-8 + Math.sin(f * 0.15) * 8} -80 0 Z`} fill="#FFFFFF" />
      </g>
      {/* halaman paving (perspektif) */}
      <path d={`M-300 1380 H1380 V${BALAI.pagar} H-300 Z`} fill="#CFC6B4" />
      {Array.from({ length: 16 }, (_, k) => (
        <path key={k} d={`M${540 + (k - 8) * 70} 1380 L${540 + (k - 8) * 150} ${BALAI.pagar}`} stroke="#BDB3A0" strokeWidth="2" />
      ))}
      <path d={`M-300 1430H1380`} stroke="#BDB3A0" strokeWidth="2" />
      <Ketapang x={-60} y={1400} s={1.2} f={f} />
      <Ketapang x={1160} y={1410} s={1.1} f={f + 30} />
      {isiHalaman}
      {/* pagar besi + gerbang */}
      <g data-benda="pagar">
        <rect x="-300" y={BALAI.pagar - 14} width="1680" height="30" fill="#B5AC98" />
        {Array.from({ length: 40 }, (_, k) => {
          const x = -300 + k * 44;
          if (x > G.x0 && x < G.x1) return null;
          return <rect key={k} x={x} y={BALAI.pagar - 230} width="10" height="230" fill="#3F6B55" />;
        })}
        <path d={`M-300 ${BALAI.pagar - 220}H${G.x0} M${G.x1} ${BALAI.pagar - 220}H1380 M-300 ${BALAI.pagar - 110}H${G.x0} M${G.x1} ${BALAI.pagar - 110}H1380`} stroke="#3F6B55" strokeWidth="12" />
        <rect x={G.x0 - 30} y={BALAI.pagar - 280} width="34" height="296" fill="#E9E2D2" stroke="#B5AC98" strokeWidth="4" />
        <rect x={G.x1 - 4} y={BALAI.pagar - 280} width="34" height="296" fill="#E9E2D2" stroke="#B5AC98" strokeWidth="4" />
        {/* daun gerbang geser */}
        {[0, 1].map((k) => {
          const x0 = k === 0 ? G.x0 + 4 - geser : (G.x0 + G.x1) / 2 + geser;
          const w = (G.x1 - G.x0) / 2 - 4;
          return (
            <g key={k}>
              <rect x={x0} y={BALAI.pagar - 220} width={w} height="12" fill="#2F5745" />
              <rect x={x0} y={BALAI.pagar - 30} width={w} height="12" fill="#2F5745" />
              {Array.from({ length: 5 }, (_, j) => (
                <rect key={j} x={x0 + 8 + j * (w / 5)} y={BALAI.pagar - 220} width="9" height="202" fill="#2F5745" />
              ))}
            </g>
          );
        })}
      </g>
      {/* jalan aspal depan */}
      <rect x="-300" y={BALAI.pagar + 16} width="1680" height="1400" fill="#6E6A64" />
      <rect x="-300" y={BALAI.pagar + 16} width="1680" height="26" fill="#9E978A" />
      {Array.from({ length: 6 }, (_, k) => (
        <rect key={k} x={-260 + k * 300} y={BALAI.pagar + 300} width="160" height="14" fill="#E8DFC8" opacity=".8" />
      ))}
      {isi}
      {isiDepan}
    </g>
  );
}
