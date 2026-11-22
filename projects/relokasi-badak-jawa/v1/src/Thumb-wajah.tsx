// Thumbnail alternatif (versi wajah): Badaknya Diselamatkan, Warganya? v1. Close-up Naya kesal, petunjuk = badak Jawa.
import React from 'react';
import { FaceThumb, Petunjuk } from '../../../../shared/ui/v2/Thumb';
import { Latar, PetunjukBadak } from './Thumb';

export const Thumb = () => (
  <FaceThumb theme="sosial" lines={['Badaknya selamat.', 'Warganya?']} who="her" mood="annoyed" gaze={0.3} dx={-120}
    scene={<Latar />} clue={<Petunjuk x={800} y={1260} r={230}><PetunjukBadak /></Petunjuk>} />
);
