// Variasi pose (7 Nov 2026): Naya bertolak pinggang (POSE.her.pinggang), kesal, framing sedang; petunjuk jam.
import React from 'react';
import { FaceThumb, Petunjuk } from '../Thumb';
import { Environment } from '../../../locations/courtyard-ruang-baca/v1/World';
import { Jam } from '../../../props/benda/v1/Benda';
export const Thumb = () => (
  <FaceThumb
    theme="perilaku"
    lines={['Dia telat', 'lagi.']}
    who="her"
    mood="annoyed"
    gaze={0.7}
    gazeY={-0.2}
    head={5}
    flush="#E98A80"
    pose="pinggang"
    s={3.8}
    dx={-60}
    scene={<g transform="translate(-300 0)"><Environment frame={60} /></g>}
    clue={<Petunjuk x={830} y={1000} r={140}><Jam s={1.4} jam={250} menit={60} /></Petunjuk>}
  />
);
