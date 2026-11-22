// Lokasi bersama: ruang operator akun buzzer, PANGGUNG FLAT 2D dari depan (v1, 20 Nov 2026). Dibuat untuk "Cuekin
// Buzzer" v1 (pengguna 20 Nov 2026: "buat tempat baru loh"; naskah: "Padahal dia dibayar", "Mereka boleh punya ribuan
// akun"). Ruang sewaan yang redup: dinding gelap, rak-rak berisi deretan HP yang menyala (satu HP = satu akun), meja
// panjang dengan laptop, kursi, kabel pengisi daya, lampu neon tunggal. Tanpa merek, tanpa wajah/tokoh nyata.
// Bingkai 1080×1920 (dunia). Kamera = bungkus transform di proyek.
//   RB.lantai   y kaki tokoh berdiri (1700)
//   RB.kursi    { x, y } kaki operator di balik meja, menghadap kamera (panel depan meja menutup kaki; pakai isi)
// Prop: f, rak 1..4 (jumlah rak HP yang menyala, mulai dari dua rak tengah), nyala 0..1 (terang layar HP), isi (tokoh), isiDepan (di depan meja).
import React from 'react';

export const RB = { lantai: 1700, meja: { y0: 1330, y1: 1380 }, kursi: { x: 560, y: 1690 } };

const rnd = (n: number) => {
  const v = Math.sin(n * 57.3 + 7.7) * 43758.5453;
  return v - Math.floor(v);
};

/** satu rak HP berdiri: kolom × baris HP, layar menyala (feed abu/biru) */
const RakHP = ({ x, y, kolom = 8, baris = 5, nyala = 1, f = 0, seed = 0 }: { x: number; y: number; kolom?: number; baris?: number; nyala?: number; f?: number; seed?: number }) => {
  const w = 44,
    h = 80,
    gx = 10,
    gy = 30;
  const W = kolom * (w + gx) + 20,
    H = baris * (h + gy) + 10;
  return (
    <g data-detail="rak-hp">
      <rect x={x} y={y} width={W} height={H} fill="#2C2F36" />
      {Array.from({ length: baris }, (_, r) => (
        <g key={r}>
          <rect x={x} y={y + (r + 1) * (h + gy) - 6} width={W} height="10" fill="#4A4E57" />
          {Array.from({ length: kolom }, (_, c) => {
            const k = seed * 100 + r * kolom + c;
            const hidup = nyala * (0.75 + 0.25 * Math.sin(f * 0.3 + k));
            const px = x + 10 + c * (w + gx),
              py = y + 10 + r * (h + gy);
            return (
              <g key={c}>
                <rect x={px} y={py} width={w} height={h} rx="6" fill="#111317" />
                <rect x={px + 3} y={py + 4} width={w - 6} height={h - 8} rx="4" fill={rnd(k) > 0.5 ? '#E8EEF5' : '#D5E3F0'} opacity={hidup.toFixed(2)} />
                <rect x={px + 7} y={py + 12} width={w - 14} height="6" fill="#9AA6B2" opacity={hidup.toFixed(2)} />
                <rect x={px + 7} y={py + 24} width={(w - 14) * (0.5 + rnd(k + 9) * 0.5)} height="5" fill="#B8C2CC" opacity={hidup.toFixed(2)} />
                <path d={`M${px + w / 2} ${py + h}v${gy - 8}`} stroke="#15171B" strokeWidth="2" />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
};

export function RuangBuzzer2D({ f = 0, rak = 4, nyala = 1, isi, isiDepan }: { f?: number; rak?: number; nyala?: number; isi?: React.ReactNode; isiDepan?: React.ReactNode }) {
  const RAK: [number, number, number, number][] = [
    [140, 380, 8, 6],
    [610, 380, 8, 6],
    [-330, 380, 8, 6],
    [1080, 380, 8, 6],
  ];
  return (
    <g data-set="ruang-buzzer">
      <rect x="-400" y="-200" width="1880" height="2400" fill="#23262D" />
      {/* plafon + neon tunggal */}
      <rect x="-400" y="-200" width="1880" height="420" fill="#1B1D22" />
      <rect x="330" y="150" width="420" height="22" rx="8" fill="#E9F1F6" opacity={0.6 + 0.4 * nyala} />
      <path d="M260 172L820 172L1100 900L-20 900Z" fill="#CFE0EA" opacity={0.05 * nyala} />
      {/* rak HP */}
      {RAK.map(([x, y, k, b], i) => <RakHP key={i} x={x} y={y} kolom={k} baris={b} nyala={i < rak ? nyala : 0.08} f={f} seed={i} />)}
      {/* cahaya layar memantul */}
      <rect x="-400" y="360" width="1880" height="700" fill="#9EC3E6" opacity={0.06 * nyala * rak / 4} />
      {/* dinding bawah + lantai */}
      <rect x="-400" y="1080" width="1880" height="260" fill="#2A2D34" />
      <rect x="-400" y={RB.meja.y1} width="1880" height="900" fill="#34373E" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${-400 + i * 170} ${RB.meja.y1 + 80}h120`} stroke="#3E424A" strokeWidth="3" />
      ))}
      {/* kabel pengisi daya menjuntai dari rak */}
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${-300 + i * 100} 1040Q${-280 + i * 100} ${1160 + (i % 3) * 30} ${-250 + i * 100} 1330`} stroke="#15171B" strokeWidth="3" fill="none" />
      ))}
      {isi}
      {/* meja panjang + laptop */}
      <rect x="-400" y={RB.meja.y0} width="1880" height={RB.meja.y1 - RB.meja.y0} fill="#5A4B3E" />
      <rect x="-400" y={RB.meja.y0} width="1880" height="10" fill="#6E5D4D" />
      {/* laptop membelakangi kamera (layar menghadap operator) */}
      {[380, 820].map((x) => (
        <g key={x}>
          <path d={`M${x} ${RB.meja.y0}l14 -130h150l14 130Z`} fill="#4A4F58" />
          <circle cx={x + 89} cy={RB.meja.y0 - 70} r="12" fill="#5F6570" />
        </g>
      ))}
      {/* panel depan meja menutup kaki operator */}
      <rect x="-400" y={RB.meja.y1} width="1880" height={RB.lantai - RB.meja.y1 + 40} fill="#4A3E33" />
      <rect x="-400" y={RB.meja.y1} width="1880" height="24" fill="#000" opacity=".25" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-400 + i * 240} ${RB.meja.y1 + 30}v${RB.lantai - RB.meja.y1}`} stroke="#3E342B" strokeWidth="4" />)}
      {isiDepan}
    </g>
  );
}
