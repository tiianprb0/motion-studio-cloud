// Thumbnail (cover utama, versi pose): Badaknya Diselamatkan, Warganya? v1. Naya di kampung nelayan pesisir Selat Sunda,
// tangan di pinggang; petunjuk = badak Jawa di lingkaran. Tema sosial. shared/ui/v2/Thumb.tsx.
// Render: node tools/render-thumb.cjs projects/relokasi-badak-jawa/v1/src/Thumb.tsx projects/relokasi-badak-jawa/v1/04-Hasil/Thumbnail-Badaknya-Diselamatkan-Warganya-v1-pose
import React from 'react';
import { FaceThumb, Petunjuk } from '../../../../shared/ui/v2/Thumb';
import { PesisirSelatSunda2D } from '../../../../shared/locations/pesisir-selat-sunda-2d/v1/PesisirSelatSunda2D';
import { Badak } from '../../../../shared/characters/badak/v1/Badak';

export const Latar = () => (
  <g transform="translate(540 960) scale(1.1) translate(-1500 -1150)">
    <PesisirSelatSunda2D f={40} gelombang={0.45} id="thm" />
  </g>
);
export const PetunjukBadak = () => (
  <g>
    <circle r="190" fill="#9CC28A" />
    <Badak x={-10} y={95} s={0.55} f={20} pose="berdiri" id="thb" />
  </g>
);
export const Thumb = () => (
  <FaceThumb theme="sosial" lines={['Badaknya selamat.', 'Warganya?']} who="her" mood="annoyed" gazeY={0.1} pose="pinggang" dx={-90}
    scene={<Latar />} clue={<Petunjuk x={820} y={1230} r={220}><PetunjukBadak /></Petunjuk>} />
);
