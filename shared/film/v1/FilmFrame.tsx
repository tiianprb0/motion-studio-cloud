// Bingkai film 1080×1920: isi adegan, lapisan layar, lalu outro. Fade ke hijau tua 12 frame sebelum outro.
// Outro diberikan oleh proyek (OutroB dari rig yang dipakai) supaya film/v1 tidak terikat versi rig.
import React from 'react';
import { P, ramp } from '../../core/v1/core';

export const FilmFrame = ({ f, OUTRO, outro, screen, children }: { f: number; OUTRO: number; outro: React.ReactNode; screen?: React.ReactNode; children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    {f >= OUTRO ? (
      outro
    ) : (
      <>
        {children}
        {screen}
        {f >= OUTRO - 12 && <rect width="1080" height="1920" fill={P.ink} opacity={ramp(f, OUTRO - 12, OUTRO)} />}
      </>
    )}
  </svg>
);
