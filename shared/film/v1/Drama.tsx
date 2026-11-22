// Mode dramatis tokoh ala Kok Bisa? (arah disetujui pengguna 7 Nov 2026; LEMBAR CONTOH harus disetujui
// pengguna sebelum dipakai di video final). Hanya untuk momen emosi kuat (kaget, takut, malu, marah besar).
// Tidak mengubah rig, wajah, rambut atau proporsi: tokoh digambar seperti biasa, lalu diberi
//   1) cahaya hangat di sisi terang dan bayangan volume di sisi gelap, dipotong tepat ke siluet tokoh (mask),
//   2) cahaya tepi di sisi terang,
// dan latar diganti/digelapkan dengan DramaBackdrop (gradasi gelap + vinyet).
// Mata Naya/Yan sudah punya titik kilau; tidak ditambah.
import React from 'react';

type Side = 'kiri' | 'kanan' | 'atas';

/** Perkiraan kotak tokoh untuk Person({x, y, s}): kaki di y, tinggi 330 × s. */
export const personBox = (x: number, y: number, s: number): [number, number, number, number] => [x - 110 * s, y - 345 * s, x + 110 * s, y + 10 * s];

export function Dramatic({
  box,
  light = 'kiri',
  amt = 1,
  shade = '#2A1714',
  rim = '#FFE3BC',
  id = 'drama',
  children,
}: {
  /** kotak tokoh [x0, y0, x1, y1] di koordinat yang sama dengan children (lihat personBox) */
  box: [number, number, number, number];
  /** arah datangnya cahaya */
  light?: Side;
  /** 0..1 kekuatan efek (bisa dianimasikan masuk pelan) */
  amt?: number;
  shade?: string;
  rim?: string;
  id?: string;
  children: React.ReactNode;
}) {
  if (amt <= 0.01) return <>{children}</>;
  const [x0, y0, x1, y1] = box;
  const g = light === 'kiri' ? { x1: x0, y1: y0, x2: x1, y2: y0 } : light === 'kanan' ? { x1: x1, y1: y0, x2: x0, y2: y0 } : { x1: x0, y1: y0, x2: x0, y2: y1 };
  const off = light === 'kiri' ? [7, 3] : light === 'kanan' ? [-7, 3] : [0, 8];
  return (
    <g data-fx="dramatis">
      <defs>
        <linearGradient id={`${id}-shade`} gradientUnits="userSpaceOnUse" {...g}>
          <stop offset="0" stopColor={rim} stopOpacity={0.2 * amt} />
          <stop offset="0.38" stopColor={rim} stopOpacity="0" />
          <stop offset="0.55" stopColor={shade} stopOpacity={0.14 * amt} />
          <stop offset="1" stopColor={shade} stopOpacity={0.5 * amt} />
        </linearGradient>
        <filter id={`${id}-white`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={x0 - 50} y={y0 - 50} width={x1 - x0 + 100} height={y1 - y0 + 100}>
          <g filter={`url(#${id}-white)`}>{children}</g>
        </mask>
        <filter id={`${id}-rim`} colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
          <feOffset in="SourceAlpha" dx={off[0]} dy={off[1]} result="shifted" />
          <feComposite in="SourceAlpha" in2="shifted" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation="2.2" result="soft" />
          <feFlood floodColor={rim} floodOpacity={0.85 * amt} />
          <feComposite in2="soft" operator="in" />
        </filter>
      </defs>
      {children}
      <rect x={x0 - 50} y={y0 - 50} width={x1 - x0 + 100} height={y1 - y0 + 100} fill={`url(#${id}-shade)`} mask={`url(#${id}-mask)`} />
      <g filter={`url(#${id}-rim)`}>{children}</g>
    </g>
  );
}

/** Latar momen dramatis: gradasi gelap hangat + vinyet kuat (contoh Kok Bisa?: close-up 1:41 latar merah gelap). */
export function DramaBackdrop({ top = '#3A2620', bottom = '#8C4B3A', vignette = 0.55, id = 'drama-bg' }: { top?: string; bottom?: string; vignette?: number; id?: string }) {
  return (
    <g data-layer="latar-dramatis">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`${id}-v`} cx="50%" cy="45%" r="70%">
          <stop offset="0.5" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity={vignette} />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill={`url(#${id}-g)`} />
      <rect width="1080" height="1920" fill={`url(#${id}-v)`} />
    </g>
  );
}
