// Variasi pose (7 Nov 2026): Yan menyodorkan kotak martabak dengan dua tangan (POSE.him.angkatGalon), framing sedang.
// Gagasan video dalam satu gambar: maaf yang ditunjukkan lewat makanan, bukan kata.
import React from 'react';
import { FaceThumb } from '../Thumb';
import { JalanSenja } from '../../../locations/taman-sore/v1/Taman';
import { MartabakBox } from '../../../props/harian/v1/Props';
const S = 3.8, HX = 560, FEET = 1120 + 285 * S;
export const Thumb = () => (
  <FaceThumb
    theme="hubungan"
    lines={['Dia nggak', 'bilang maaf.']}
    who="him"
    mood="unsure"
    gaze={-0.2}
    gazeY={0.6}
    head={-4}
    flush="#E98A80"
    pose="angkatGalon"
    s={S}
    scene={<JalanSenja f={60} />}
    front={<g data-box={`${HX - 150},${FEET - 150 * S - 120},${HX + 150},${FEET - 150 * S + 40}`} transform={`translate(${HX} ${FEET - 150 * S + 34})`}><MartabakBox open f={12} s={3.3} /></g>}
  />
);
