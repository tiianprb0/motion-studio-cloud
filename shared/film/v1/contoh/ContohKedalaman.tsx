// LEMBAR CONTOH (7 Nov 2026): kedalaman dan material ala Kok Bisa?. Render: node tools/render-thumb.cjs <ini> <out> --only
import React from 'react';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../characters/rig/v2/Character';
import { POSE } from '../../../characters/rig/v2/poses';
import { P } from '../../../core/v1/core';
import { TileWall, GlassPane, CurtainFolds, WaterSurface, Steam, Sheen, Plant } from '../../../locations/_detail/v2/Detail';
import { Blurred, Foreground, FrostedGlass, Bokeh, Vignette, Grain } from '../Depth';
import { Callout } from '../Screen';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const f = 40;
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    {/* latar jauh: ubin, jendela, tirai — sedikit buram karena kamera dekat */}
    <Blurred amount={2.4} id="latar">
      <TileWall x={0} y={0} w={1080} h={1360} tile={108} />
      <GlassPane x={560} y={300} w={400} h={480} f={f} frame={P.cream} />
      <CurtainFolds x={470} y={270} w={110} h={600} />
      <Bokeh spots={[[160, 560, 80], [900, 980, 95], [420, 1160, 60]]} opacity={0.45} id="bokeh-ubin" />
    </Blurred>
    {/* tokoh dan meja dapur */}
    <Person who="him" x={760} y={1660} s={2.5} f={f} dir={-1} mood="soft" gaze={-0.5} {...POSE.him.santai} />
    <rect x="0" y="1700" width="1080" height="220" fill="#D8CBB6" />
    <rect x="80" y="1330" width="1000" height="370" fill="#C79D72" />
    <rect x="80" y="1690" width="1000" height="10" fill="#000000" opacity="0.12" />
    <rect x="80" y="1312" width="1000" height="30" rx="6" fill="#D9B38A" />
    <Sheen x={80} y={1312} w={1000} h={30} opacity={0.4} />
    {/* gelas air dan cangkir panas */}
    <g>
      <rect x="560" y="1170" width="90" height="145" rx="10" fill="#FFFFFF" opacity="0.35" />
      <WaterSurface x={566} y={1225} w={78} h={86} f={f} />
      <Sheen x={560} y={1170} w={90} h={145} opacity={0.5} />
      <rect x="380" y="1235" width="110" height="80" rx="14" fill={P.cream} />
      <path d="M490 1255q34 4 0 40" stroke={P.cream} strokeWidth="12" fill="none" />
      <Steam x={435} y={1225} f={f} count={3} height={150} opacity={0.75} />
    </g>
    {/* Naya di balik kaca buram (lapisan depan kiri) */}
    <Person who="her" x={250} y={1790} s={2.5} f={f} mood="thinking" gaze={0.6} {...POSE.her.berpikir} />
    <FrostedGlass x={-20} y={420} w={440} h={1520} f={f} />
    {/* lapisan paling depan: tanaman gelap dan buram */}
    <Foreground blur={10} darken={0.6} id="fg-tanaman">
      <Plant x={1010} y={1990} s={3.4} kind={1} />
    </Foreground>
    <Vignette opacity={0.14} />
    <Grain opacity={0.035} />
    {/* anotasi */}
    <Callout f={f} a={0} b={300} x={250} y={300} target={[180, 760]} text="Kaca buram depan" size={32} />
    <Callout f={f} a={0} b={300} x={760} y={250} target={[790, 470]} text="Pantulan kaca" size={32} />
    <Callout f={f} a={0} b={300} x={470} y={1440} target={[435, 1150]} text="Uap" size={32} />
    <Callout f={f} a={0} b={300} x={760} y={1440} target={[605, 1250]} text="Air + kilau" size={32} />
  </svg>
);
