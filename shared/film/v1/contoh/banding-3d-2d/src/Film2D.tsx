// Sisi 2D: Warung Makmur flat dari depan (warung-makmur v1) + modul Cahaya2D (kandidat), kamera dorong pelan.
import React from 'react';
import { WarungMakmur, WARUNG2D } from '../../../../../locations/warung-makmur/v1/WarungMakmur';
import { yan, rus, kucing, u, Label } from './Pemeran';
export { TOTAL, OUTRO, SHOTS, shotAt } from './Pemeran';

export const Frame = ({ frame: f }: { frame: number }) => {
  const t = u(f);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <WarungMakmur f={f} id="b2" kam={{ zoom: 1 + 0.08 * t, cx: 540 - 40 * t, cy: 960 + 60 * t }} isi={[
        { x: 340, y: 1505, s: 2.43, gambar: yan(f) },
        { x: 800, y: WARUNG2D.terasDepan - 10, s: 1.37, gambar: rus(f), jarakDinding: 1.3 },
        { x: 640, y: WARUNG2D.terasDepan + 16, s: 1.4, gambar: kucing(f), jarakDinding: 1.5, tinggi: 0.38 },
      ]} />
      <Label teks="2D · cahaya 2D baru" sub="panggung flat, cahaya ditiru" />
    </svg>
  );
};
