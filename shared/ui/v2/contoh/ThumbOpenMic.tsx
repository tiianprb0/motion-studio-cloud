// Contoh Thumb v2 tema 'openmic' (disetujui 7 Nov 2026): Syarat Protes, Yan deadpan di lampu sorot, mic berdiri, petunjuk struk.
import React from 'react';
import { FaceThumb, Petunjuk } from '../Thumb';
import { StageWorld } from '../../../locations/kafe-open-mic/v1/OpenMic';
import { Struk, MicBerdiri } from '../../../props/benda/v1/Benda';
export const Thumb = () => (
  <FaceThumb
    theme="openmic"
    lines={['Protes ada', 'syaratnya.']}
    who="him"
    mood="soft"
    gaze={0.7}
    gazeY={0.1}
    scene={<StageWorld f={60} warm={1}>{null}</StageWorld>}
    front={<g transform="translate(470 1330)"><MicBerdiri s={2} tiang={420} miring={-10} /></g>}
    clue={<Petunjuk x={815} y={1215} r={150} color="#FFE9B8"><g transform="translate(0 -105)"><Struk s={1.12} rot={8} /></g></Petunjuk>}
  />
);
