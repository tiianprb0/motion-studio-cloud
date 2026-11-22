// Properti harian bersama (7 Nov 2026, asal: projects/maaf-tanpa-kata/v1).
// Semua digambar dengan titik genggam/alas di (0,0) dalam satuan rig: pakai di holdLeft/holdRight atau taruh di permukaan.
import React from 'react';
import { P } from '../../../characters/rig/v1/Character';

// Botol minum. level 0..1 = isi air. Alas di (0,0).
export const Bottle = ({ level = 1, f = 0, s = 1 }: { level?: number; f?: number; s?: number }) => {
  const h = 74,
    top = -h + 10;
  const wy = -6 - (h - 18) * level;
  return (
    <g transform={`scale(${s})`} data-prop="botol-minum">
      <rect x="-15" y={-h} width="30" height={h} rx="9" fill="#DCEBEA" opacity=".9" />
      <clipPath id="bottle-water"><rect x="-15" y={-h} width="30" height={h} rx="9" /></clipPath>
      <g clipPath="url(#bottle-water)">
        <path d={`M-16 ${wy}q8 ${-2 + Math.sin(f * 0.2) * 1.5} 16 0t16 0V2H-16Z`} fill="#8FC1C9" />
      </g>
      <rect x="-15" y={-h} width="30" height={h} rx="9" fill="none" stroke="#9FBDBB" strokeWidth="2" />
      <rect x="-11" y={top - 22} width="22" height="14" rx="4" fill={P.sage} />
      <path d={`M-9 ${top - 2}v${h - 18}`} stroke="#fff" strokeWidth="3" opacity=".55" strokeLinecap="round" />
    </g>
  );
};
// Charger: kepala adaptor + kabel melingkar. inHand = digenggam (kabel menjuntai).
export const Charger = ({ inHand = false, s = 1 }: { inHand?: boolean; s?: number }) => (
  <g transform={`scale(${s})`} data-prop="charger">
    {inHand ? (
      <>
        <path d="M0 4q-10 26 6 40t-4 30" stroke="#F4F1EA" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <rect x="-9" y="-20" width="18" height="22" rx="4" fill="#F4F1EA" stroke="#CFC8BA" strokeWidth="1.5" />
        <path d="M-4 -20v-7M4 -20v-7" stroke="#A9A39A" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="24" cy="-3" rx="22" ry="7" fill="none" stroke="#A9A091" strokeWidth="5.4" />
        <ellipse cx="24" cy="-3" rx="22" ry="7" fill="none" stroke="#F4F1EA" strokeWidth="3" />
        <rect x="-14" y="-16" width="20" height="16" rx="4" fill="#F4F1EA" stroke="#A9A091" strokeWidth="2" />
        <path d="M-9 -16v-6M0 -16v-6" stroke="#8E877C" strokeWidth="2.6" strokeLinecap="round" />
      </>
    )}
  </g>
);
// Ponsel di tangan (genggam di bawah). 7 Nov 2026 (pengguna): kalau kamera DI DEPAN tokoh, yang terlihat PUNGGUNG ponsel
// (casing + kamera), bukan layar. Layar (`side="layar"`) hanya untuk kamera dari belakang-serong tokoh atau insert layar penuh.
export const PhoneInHand = ({ s = 1, side = 'belakang', casing = '#8B4354' }: { s?: number; side?: 'belakang' | 'layar'; casing?: string }) => (
  <g transform={`scale(${s})`} data-prop="ponsel" data-phone-side={side}>
    {side === 'layar' ? (
      <>
        <rect x="-11" y="-34" width="22" height="40" rx="5" fill="#2D3532" />
        <rect x="-8.5" y="-30" width="17" height="30" rx="2.5" fill="#BFD7DD" />
      </>
    ) : (
      <>
        <rect x="-11" y="-34" width="22" height="40" rx="5" fill={casing} />
        <rect x="-8" y="-31" width="9" height="11" rx="2.5" fill="#2D3532" />
        <circle cx="-5.6" cy="-28" r="2" fill="#5E6B70" />
        <circle cx="-5.6" cy="-23" r="2" fill="#5E6B70" />
        <circle cx="4" cy="-28" r="1.2" fill="#F4F1EA" opacity=".8" />
        <path d="M-6 -8h12" stroke="#000" strokeWidth="1.2" opacity=".15" />
      </>
    )}
  </g>
);
// Jaket terlipat: menggantung dari genggaman (hang) atau tersampir di sandaran kursi (drape).
export const Jacket = ({ mode = 'hang', s = 1 }: { mode?: 'hang' | 'drape'; s?: number }) => (
  <g transform={`scale(${s})`} data-prop="jaket">
    {mode === 'hang' ? (
      <>
        <path d="M-16 -4h32l6 74h-44Z" fill="#C49A6C" />
        <path d="M0 -4v74M-12 20h8M4 20h8" stroke="#A8805A" strokeWidth="3" />
        <path d="M-18 -6q18 -8 36 0" stroke="#A8805A" strokeWidth="4" fill="none" />
      </>
    ) : (
      <>
        <path d="M-34 0q34 -12 68 0l4 58q-10 6 -14 0l-4 -40h-38l-4 40q-4 6 -14 0Z" fill="#C49A6C" />
        <path d="M-30 4q30 -10 60 0" stroke="#A8805A" strokeWidth="4" fill="none" />
      </>
    )}
  </g>
);
// Mangkuk lauk dengan uap. steam 0..1.
export const Bowl = ({ f = 0, steam = 1, s = 1 }: { f?: number; steam?: number; s?: number }) => (
  <g transform={`scale(${s})`} data-prop="mangkuk-lauk">
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${-10 + i * 10} -22q${6 * Math.sin(f * 0.15 + i)} -10 0 -20t0 -20`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity={steam * (0.35 + 0.25 * Math.sin(f * 0.1 + i * 2))} />
    ))}
    <path d="M-30 -18h60q-4 20 -30 20t-30 -20Z" fill="#F1E8D8" />
    <ellipse cx="0" cy="-18" rx="30" ry="7" fill="#C76F3E" />
    <ellipse cx="-8" cy="-20" rx="8" ry="3" fill="#E39A5C" />
    <path d="M-30 -10h60" stroke={P.wine} strokeWidth="2" opacity=".6" />
  </g>
);
export const Plate = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="piring">
    <ellipse cx="0" cy="-4" rx="26" ry="7" fill="#F4F1EA" stroke="#D8D0C2" strokeWidth="1.5" />
    <ellipse cx="0" cy="-5" rx="16" ry="4" fill="#E9E2D4" />
  </g>
);
// Foto kucing kecil (dipakai di chat). w x h, pusat (0,0).
export const CatPhoto = ({ w = 300, h = 300 }: { w?: number; h?: number }) => (
  <g data-prop="foto-kucing">
    <clipPath id="cat-clip"><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="18" /></clipPath>
    <g clipPath="url(#cat-clip)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#F2D9B5" />
      <rect x={-w / 2} y={h * 0.18} width={w} height={h} fill="#D9B98F" />
      <g transform={`scale(${w / 300})`}>
        <path d="M-80 140q0 -90 80 -90t80 90Z" fill="#E9A15A" />
        <path d="M-70 -40l-6 -70l52 38M70 -40l6 -70l-52 38" fill="#E9A15A" />
        <path d="M-62 -54l-4 -40l26 22M62 -54l4 -40l-26 22" fill="#F5C8B0" />
        <ellipse cx="0" cy="-10" rx="82" ry="70" fill="#E9A15A" />
        <path d="M-30 -60l10 22M0 -66v24M30 -60l-10 22" stroke="#C97C3A" strokeWidth="7" strokeLinecap="round" />
        <path d="M-40 -6q12 -12 24 0M16 -6q12 -12 24 0" stroke="#3A2E28" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M-6 12h12l-6 7Z" fill="#E57F86" />
        <path d="M0 19q-8 10 -16 4M0 19q8 10 16 4" stroke="#3A2E28" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M-30 16h-36M-30 24l-32 8M30 16h36M30 24l32 8" stroke="#3A2E28" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  </g>
);

// ---- tambahan 7 Nov 2026 (storyboard v2 maaf-tanpa-kata)
// Kantong plastik berisi kotak makanan; titik genggam = pegangan di (0,0), kantong menggantung ke bawah.
export const FoodBag = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="kantong-makanan">
    <path d="M-10 0q-8 10 -16 14M10 0q8 10 16 14" stroke="#EDE6D8" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M-28 12h56l4 56q-32 10 -64 0Z" fill="#F4EFE4" opacity=".92" />
    <rect x="-20" y="30" width="40" height="26" rx="3" fill="#C98E55" opacity=".75" />
    <path d="M-20 38h40" stroke="#A86F3E" strokeWidth="2" opacity=".7" />
  </g>
);
// Galon air; alas di (0,0). Dipegang dua tangan di depan dada: taruh pusatnya sedikit di bawah tangan.
export const Galon = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="galon">
    <rect x="-30" y="-92" width="60" height="92" rx="16" fill="#A9D3DC" opacity=".88" />
    <path d="M-30 -60h60M-30 -30h60" stroke="#8CBFCB" strokeWidth="4" />
    <rect x="-12" y="-106" width="24" height="16" rx="4" fill="#3E7FA0" />
    <path d="M-20 -84v70" stroke="#fff" strokeWidth="5" opacity=".5" strokeLinecap="round" />
  </g>
);
// Kotak martabak; alas di (0,0). open = tutup terbuka (potongan terlihat).
export const MartabakBox = ({ open = false, f = 0, s = 1 }: { open?: boolean; f?: number; s?: number }) => (
  <g transform={`scale(${s})`} data-prop="martabak">
    {open && [0, 1].map((i) => (
      <path key={i} d={`M${-12 + i * 22} -30q${5 * Math.sin(f * 0.15 + i)} -10 0 -20t0 -18`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />
    ))}
    <path d="M-48 0h96l-4 -20h-88Z" fill="#E8D7B8" />
    {open ? (
      <>
        <ellipse cx="0" cy="-20" rx="42" ry="9" fill="#C98E55" />
        <path d="M-30 -22l60 4M-34 -18l14 -6M0 -26v10M20 -24l10 8" stroke="#8E5A2E" strokeWidth="2.5" />
        <path d="M-46 -20l-6 -40h96l-6 40" fill="#EFE3CC" opacity=".9" />
        <text x="0" y="-36" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="13" fill={P.wine}>MARTABAK</text>
      </>
    ) : (
      <>
        <path d="M-48 -20h96l-6 -10h-84Z" fill="#EFE3CC" />
        <text x="0" y="-6" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="12" fill={P.wine}>MARTABAK</text>
      </>
    )}
  </g>
);
// Es teh plastik; titik genggam di tengah gelas.
export const IcedTea = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`} data-prop="es-teh">
    <path d="M-2 -36l6 -18" stroke="#3E6B57" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M-12 -30h24l-3 40h-18Z" fill="#E7D9C3" opacity=".8" />
    <path d="M-11 -20h22l-2.4 30h-17.2Z" fill="#C9874A" />
    <rect x="-13" y="-33" width="26" height="5" rx="2" fill="#F7F1E6" />
    <path d="M-6 -14h5M3 -6h5" stroke="#F6E6CC" strokeWidth="3" strokeLinecap="round" />
  </g>
);
// Motor matic tampak samping (parkir), alas di (0,0), menghadap kanan. Panjang ±190 satuan:
// untuk tokoh dewasa skala S, pakai s ≈ 2,1 × S supaya proporsional (motor ±1,9 m, orang ±1,65 m).
export const Motorbike = ({ s = 1, color = '#8B4354' }: { s?: number; color?: string }) => (
  <g transform={`scale(${s})`} data-prop="motor">
    <ellipse cx="0" cy="0" rx="96" ry="6" fill="#000" opacity=".18" />
    {/* roda */}
    {[-64, 66].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="-23" r="23" fill="#2D3532" />
        <circle cx={x} cy="-23" r="12" fill="#A9B2AE" />
        <circle cx={x} cy="-23" r="4" fill="#2D3532" />
      </g>
    ))}
    {/* bodi belakang + jok */}
    <path d="M-96 -44q2 -26 30 -34h56q14 0 18 14l4 22h-30q-6 -20 -28 -20h-14q-22 0 -26 18Z" fill={color} />
    <path d="M-88 -78q30 -10 80 -6q8 2 6 8h-86Z" fill="#2D3532" />
    {/* dek kaki */}
    <path d="M-30 -30h70l6 10h-82Z" fill="#3E4441" />
    {/* bodi depan / tameng */}
    <path d="M36 -26q4 -40 20 -70q6 -10 18 -8l6 4q-14 30 -14 74Z" fill={color} />
    <path d="M44 -26q30 -6 44 0l-4 -18q-20 -8 -38 -2Z" fill={color} opacity=".85" />
    {/* setang, spion, lampu */}
    <path d="M70 -100l6 -16M62 -118h30" stroke="#2D3532" strokeWidth="6" strokeLinecap="round" />
    <path d="M70 -118l-6 -18" stroke="#2D3532" strokeWidth="3" /><ellipse cx="62" cy="-140" rx="7" ry="5" fill="#2D3532" />
    <path d="M78 -96q12 2 12 12q-10 4 -14 -2Z" fill="#FFE7AE" />
    <path d="M-80 -54h40" stroke="#F4F1EA" strokeWidth="3" opacity=".5" />
    <path d="M-96 -48l-6 4" stroke="#C24E4E" strokeWidth="5" strokeLinecap="round" />
  </g>
);
