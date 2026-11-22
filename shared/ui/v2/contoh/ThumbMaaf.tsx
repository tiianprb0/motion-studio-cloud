// Contoh Thumb v2: Maaf yang Nggak Pernah Diucapin (kontras diperbaiki, tanpa label, petunjuk kotak martabak:
// di cerita, martabak adalah cara keluarga Yan berdamai tanpa kata maaf).
import React from 'react';
import { FaceThumb, Petunjuk } from '../Thumb';
import { JalanSenja } from '../../../locations/taman-sore/v1/Taman';
import { MartabakBox } from '../../../props/harian/v1/Props';
export const Thumb = () => (
  <FaceThumb
    theme="hubungan"
    lines={['Dia nggak', 'bilang maaf.']}
    who="him"
    mood="unsure"
    gaze={-0.6}
    gazeY={0.4}
    flush="#E98A80"
    scene={<JalanSenja f={60} />}
    clue={<Petunjuk x={195} y={1225} r={160}><g transform="translate(0 70)"><MartabakBox open f={12} s={2.6} /></g></Petunjuk>}
  />
);
