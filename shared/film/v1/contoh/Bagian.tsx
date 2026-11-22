// Pembantu lembar contoh: membagi kanvas 1080×1920 jadi dua bagian bertanda judul.
import React from 'react';
import { P } from '../../../core/v1/core';

export const Half = ({ y0, title, bg = P.paper, children }: { y0: number; title: string; bg?: string; children: React.ReactNode }) => (
  <g>
    <defs><clipPath id={`half-${y0}`}><rect x="0" y={y0} width="1080" height="960" /></clipPath></defs>
    <g clipPath={`url(#half-${y0})`}>
      <rect x="0" y={y0} width="1080" height="960" fill={bg} />
      {children}
    </g>
    <rect x="36" y={y0 + 36} width={title.length * 19 + 48} height="62" rx="31" fill={P.ink} opacity="0.92" />
    <text x="60" y={y0 + 78} fontFamily="Lato" fontWeight="900" fontSize="30" fill={P.cream}>{title}</text>
    <rect x="0" y={y0 + 956} width="1080" height="8" fill={P.ink} />
  </g>
);
