// Variasi pose Open Mic (7 Nov 2026): Yan memegang struk panjang di depan dada (POSE.him.pegangDepanDada), mic berdiri.
import React from 'react';
import { FaceThumb } from '../Thumb';
import { StageWorld } from '../../../locations/kafe-open-mic/v1/OpenMic';
import { Struk, MicBerdiri } from '../../../props/benda/v1/Benda';
export const Thumb = () => (
  <FaceThumb
    theme="openmic"
    lines={['Protes ada', 'syaratnya.']}
    who="him"
    mood="soft"
    gaze={0.6}
    gazeY={0.3}
    head={-3}
    pose="pegangDepanDada"
    s={3.8}
    dx={40}
    scene={<StageWorld f={60} warm={1}>{null}</StageWorld>}
    holdRight={<g transform="translate(16 -7)"><Struk s={0.42} rot={-6} /></g>}
    front={<g transform="translate(380 1250)"><MicBerdiri s={2} tiang={700} miring={-8} /></g>}
  />
);
