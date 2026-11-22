// Sisi 3D: Gang Melati (jalan-kampung v3, mesin Dunia3D v3), kamera sama dengan shot pembuka Kritik (dorong + putar 14°).
import React from 'react';
import { JalanKampung, type Kam } from '../../../../../locations/jalan-kampung/v3/JalanKampung';
import { orbit, kamAntara } from '../../../../../locations/_proyeksi/v1/Proyeksi';
import { yan, rus, kucing, u, Label } from './Pemeran';
export { TOTAL, OUTRO, SHOTS, shotAt } from './Pemeran';

const K1: Kam = { x: 3.2, z: 9.0, yaw: -90, F: 1700, vy: 830 };
export const Frame = ({ frame: f }: { frame: number }) => {
  const k = orbit(kamAntara(K1, { F: 1860 }, u(f)), -0.3, 8.6, -14 * u(f));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <JalanKampung f={f} kam={k} id="b3" isi={[
        { X: -0.3, Z: 8.6, gambar: yan(f), tinggi: 1.65, lebar: 0.5 },
        { X: -3.0, Z: 9.9, gambar: rus(f), tinggi: 1.65, lebar: 0.5 },
        { X: -2.8, Z: 9.3, gambar: kucing(f), tinggi: 0.38, lebar: 0.5 },
      ]} />
      <Label teks="3D · Dunia3D" sub="cahaya dihitung dari bentuk 3D" />
    </svg>
  );
};
