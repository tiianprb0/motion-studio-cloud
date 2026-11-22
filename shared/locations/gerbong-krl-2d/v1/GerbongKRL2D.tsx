// Lokasi bersama: gerbong KRL commuter line, PANGGUNG FLAT 2D dari depan (v1, 20 Nov 2026). Dibuat untuk "Cuekin Buzzer"
// v1 (pengguna 20 Nov 2026: "jangan terus terus di bundaran HI lah", "buat tempat baru loh"). Tempat orang membaca
// media sosial sambil berdiri dalam perjalanan.
// SKALA METER (pengguna 20 Nov 2026: "propotional di krl gak bener, masa jendela kaca dengan propotional badan seperti
// itu?"): dinding sisi gerbong 200 px/m, kaki dinding (lantai bertemu dinding) y 1560. Ukuran nyata kira-kira: dudukan
// kursi 0,45 m, sandaran sampai 0,95 m, jendela 0,95–1,75 m (lebar 1,0 m), palang pegangan 1,95 m, gantungan sampai
// 1,75 m, plafon 2,25 m. Tokoh berdiri di depan (lebih dekat ke kamera) memakai skala ≥ 1,15 (rig ±1,6 m = 280·s px).
// Kamera menghadap sisi gerbong: plafon dengan lampu neon, palang + gantungan tangan, deret jendela dengan kota yang
// lewat (bergeser mengikuti f), kursi panjang menempel dinding, tiang kuning, lantai abu. Tanpa logo/merek operator.
// Bingkai 1080×1920 (dunia). Kamera = bungkus transform di proyek.
//   KRL.lantai   y kaki penumpang berdiri di depan (1640)
//   KRL.pxM, KRL.kaki, KRL.y(h) = y dinding pada ketinggian h meter
// Prop: f, lampu 0..1 (redup → terang), isiBelakang (di depan kursi, di belakang tiang), isi (penumpang berdiri).
import React from 'react';

const PXM = 200,
  KAKI = 1560;
const yH = (h: number) => KAKI - h * PXM;
export const KRL = {
  lantai: 1640,
  pxM: PXM,
  kaki: KAKI,
  y: yH,
  kursi: { y0: yH(0.45), y1: yH(0.4) },
  jendela: { y0: yH(1.75), y1: yH(0.95), lebar: 1.0 * PXM, jarak: 1.35 * PXM },
  palang: yH(1.95),
  gantungBawah: yH(1.75),
  plafon: yH(2.25),
  gantungX: [60, 200, 340, 480, 620, 760, 900, 1040],
};

const rnd = (n: number) => {
  const v = Math.sin(n * 91.7 + 13.1) * 43758.5453;
  return v - Math.floor(v);
};

/** kota di luar jendela: siluet gedung + tiang listrik, bergeser ke kiri (skala jauh) */
const Kota = ({ f, y0, y1 }: { f: number; y0: number; y1: number }) => {
  const geser = (f * 10) % 1100;
  const H = y1 - y0;
  const gedung = Array.from({ length: 26 }, (_, i) => ({ x: i * 90 - geser - 300, w: 50 + rnd(i) * 60, h: H * (0.25 + rnd(i + 40) * 0.5) }));
  return (
    <g data-detail="kota-lewat">
      <rect x="-400" y={y0} width="1880" height={H} fill="#BFD6E2" />
      {gedung.map((g, i) => (
        <g key={i}>
          <rect x={g.x} y={y1 - H * 0.18 - g.h} width={g.w} height={g.h} fill={i % 3 ? '#9FB1BA' : '#8DA0AA'} />
          {Array.from({ length: Math.floor(g.h / 18) }, (_, k) => (
            <rect key={k} x={g.x + 6} y={y1 - H * 0.18 - g.h + 6 + k * 18} width={g.w - 12} height="5" fill="#C7D6DC" opacity=".6" />
          ))}
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((i * 380 - f * 30) % 1900 + 1900) % 1900 - 400;
        return <rect key={`t${i}`} x={x} y={y0 + 10} width="6" height={H} fill="#5F6B70" />;
      })}
      <path d={`M-400 ${y0 + 22}Q300 ${y0 + 34} 1480 ${y0 + 20}`} stroke="#4E585C" strokeWidth="1.5" fill="none" />
      <rect x="-400" y={y1 - H * 0.18} width="1880" height={H * 0.18} fill="#8F9A8B" />
    </g>
  );
};

export function GerbongKRL2D({ f = 0, lampu = 1, isi, isiBelakang }: { f?: number; lampu?: number; isi?: React.ReactNode; isiBelakang?: React.ReactNode }) {
  const J = KRL.jendela;
  const jendelaX = Array.from({ length: 8 }, (_, i) => -400 + 60 + i * J.jarak);
  return (
    <g data-set="gerbong-krl">
      {/* plafon (dilihat dari bawah: makin ke atas makin dekat kamera) */}
      <rect x="-400" y="-400" width="1880" height={KRL.plafon + 400} fill="#EEEAE2" />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M-400 ${KRL.plafon - 60 - k * k * 70}H1480`} stroke="#DCD6CA" strokeWidth={2 + k} />
      ))}
      {/* lampu neon memanjang (makin dekat makin lebar) */}
      {[0, 1, 2].map((k) => {
        const y = KRL.plafon - 40 - k * k * 160 - k * 40,
          t = 10 + k * 14;
        return (
          <g key={`l${k}`}>
            <rect x="-400" y={y - t} width="1880" height={t} fill="#FFFFFF" />
            <rect x="-400" y={y - t - 6} width="1880" height="6" fill="#D6D0C3" />
          </g>
        );
      })}
      {/* dinding sisi */}
      <rect x="-400" y={KRL.plafon} width="1880" height={KAKI - KRL.plafon} fill="#E3DFD4" />
      <rect x="-400" y={KRL.plafon} width="1880" height="10" fill="#CFC9BC" />
      {/* palang pegangan + gantungan */}
      <rect x="-400" y={KRL.palang - 4} width="1880" height="8" rx="4" fill="#B9BDC0" />
      {KRL.gantungX.map((x, i) => (
        <g key={i} transform={`rotate(${Math.sin(f * 0.12 + i) * 3} ${x} ${KRL.palang})`}>
          <rect x={x - 3} y={KRL.palang} width="6" height={(KRL.gantungBawah - KRL.palang) * 0.55} fill="#5C6266" />
          <path d={`M${x} ${KRL.palang + (KRL.gantungBawah - KRL.palang) * 0.55}l-12 ${(KRL.gantungBawah - KRL.palang) * 0.45}h24Z`} fill="none" stroke="#E2DED2" strokeWidth="5" strokeLinejoin="round" />
        </g>
      ))}
      {/* jendela */}
      <defs>
        <clipPath id="krl-jendela">{jendelaX.map((x) => <rect key={x} x={x} y={J.y0} width={J.lebar} height={J.y1 - J.y0} rx="16" />)}</clipPath>
      </defs>
      <g clipPath="url(#krl-jendela)">
        <Kota f={f} y0={J.y0} y1={J.y1} />
        <rect x="-400" y={J.y0} width="1880" height={J.y1 - J.y0} fill="#FFFFFF" opacity=".12" />
      </g>
      {jendelaX.map((x) => (
        <g key={x}>
          <rect x={x} y={J.y0} width={J.lebar} height={J.y1 - J.y0} rx="16" fill="none" stroke="#C4BEB1" strokeWidth="8" />
          <path d={`M${x + 30} ${J.y1 - 8}L${x + 90} ${J.y0 + 8}`} stroke="#FFFFFF" strokeWidth="12" opacity=".2" />
        </g>
      ))}
      {/* garis merah badan di bawah jendela */}
      <rect x="-400" y={yH(0.93)} width="1880" height="10" fill="#B5423E" />
      {/* sandaran + kursi panjang */}
      <rect x="-400" y={yH(0.9)} width="1880" height={yH(0.45) - yH(0.9)} rx="10" fill="#5B7A8C" />
      <rect x="-400" y={yH(0.9)} width="1880" height="8" fill="#6E8DA0" />
      <rect x="-400" y={KRL.kursi.y0} width="1880" height="22" rx="8" fill="#4E6B7C" />
      <rect x="-400" y={KRL.kursi.y0 + 22} width="1880" height={KAKI - KRL.kursi.y0 - 22} fill="#9EA4A6" />
      {/* lantai */}
      <rect x="-400" y={KAKI} width="1880" height="900" fill="#B9B8B1" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${-400 + i * 120} ${KAKI}l${(i - 8) * 60} 900`} stroke="#ABAAA2" strokeWidth="3" />
      ))}
      <rect x="-400" y={KAKI} width="1880" height="14" fill="#000" opacity=".08" />
      {isiBelakang}
      {/* tiang kuning (dekat kamera: dari plafon sampai lantai depan) */}
      {[20, 1060].map((x) => (
        <g key={x}>
          <rect x={x - 12} y="-400" width="24" height="2200" rx="12" fill="#E6B93A" />
          <rect x={x - 5} y="-400" width="7" height="2200" fill="#F4D879" opacity=".7" />
        </g>
      ))}
      {isi}
      <rect x="-400" y="-400" width="1880" height="2800" fill="#1E2A38" opacity={0.25 * (1 - lampu)} />
    </g>
  );
}
