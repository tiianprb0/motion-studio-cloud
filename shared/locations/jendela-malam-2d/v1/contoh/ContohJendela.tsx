// Lembar contoh Deret Jendela Malam 2D v1: (1) jam satu hujan, hanya jendela Naya menyala; (2) jendela lain menyala, ada
// orang terjaga (kos Naya = kos putri: penghuni perempuan, pria hanya di rumah tetangga); (3) tirai menutup; (4) tali lampu menyambung jendela, hujan reda, kucing di ambang.
// Render: node tools/render-thumb.cjs shared/locations/jendela-malam-2d/v1/contoh/ContohJendela.tsx shared/locations/jendela-malam-2d/v1/contoh/ContohJendela --only
import React from 'react';
import { JendelaMalam2D, NAYA_JM, tokohJM, type KotakJM } from '../JendelaMalam2D';
import { Person, BODY_STYLE, LEG_STYLE } from '../../../../characters/rig/v2/Character';
import { POSE } from '../../../../characters/rig/v2/poses';
import { PhoneInHand } from '../../../../props/harian/v1/Props';

BODY_STYLE.v = 'baru';
LEG_STYLE.v = 'baru';
const ORANG: Record<number, { who: 'her' | 'him'; ap: number; baju: string; mood: any; arms: string; hp?: boolean }> = {
  [NAYA_JM]: { who: 'her', ap: 0, baju: '#E8A87C', mood: 'unsure', arms: 'pegangDepanDada', hp: true },
  0: { who: 'her', ap: 4, baju: '#7E8FB0', mood: 'hurt', arms: 'berpikir' },
  2: { who: 'her', ap: 1, baju: '#9CC7B4', mood: 'unsure', arms: 'pegangDepanDada', hp: true },
  7: { who: 'her', ap: 4, baju: '#D98F6F', mood: 'thinking', arms: 'pegangDepanDada', hp: true },
  9: { who: 'her', ap: 1, baju: '#C7B7D6', mood: 'hurt', arms: 'bertaut' },
  10: { who: 'her', ap: 7, baju: '#B5C99A', mood: 'unsure', arms: 'pegangDepanDada', hp: true },
  13: { who: 'her', ap: 1, baju: '#E7B9B0', mood: 'thinking', arms: 'berpikir' },
  15: { who: 'him', ap: 2, baju: '#9FB7D9', mood: 'hurt', arms: 'pegangDepanDada', hp: true },
};
const isiOrang = (i: number) => {
  const o = ORANG[i];
  if (!o) return undefined;
  return (k: KotakJM) => {
    const t = tokohJM(i, i === NAYA_JM ? -10 : 0);
    return (
      <Person who={o.who} appearance={i === NAYA_JM ? undefined : o.ap} shirtColor={o.who === 'her' && o.ap === 0 ? undefined : o.baju} x={t.x} y={t.y} s={t.s} f={40 + i * 7} view="three" dir={i % 2 ? -1 : 1}
        mood={o.mood} gazeY={0.5} role="background" {...(POSE[o.who] as any)[o.arms]} holdRight={o.hp ? <PhoneInHand s={1} /> : undefined} />
    );
  };
};
const ADEGAN: [string, (i: number) => any, any][] = [
  ['01.00 hujan: hanya jendela Naya', (i) => (i === NAYA_JM ? { nyala: 1, isi: isiOrang(i) } : {}), { hujan: 1, kam: { zoom: 0.62, cx: 520, cy: 960 } }],
  ['orang lain juga terjaga', (i) => (ORANG[i] ? { nyala: 1, cahaya: i % 3 === 1 && i !== NAYA_JM ? 'hp' : 'hangat', isi: isiOrang(i) } : {}), { hujan: 0.6, kam: { zoom: 0.62, cx: 520, cy: 960 } }],
  ['tirai menutup: sendirian', (i) => (ORANG[i] ? { nyala: 1, tirai: i === NAYA_JM ? 0 : 1, isi: isiOrang(i) } : {}), { hujan: 0.6, gelap: 1, kam: { zoom: 0.9, cx: 470, cy: 900 } }],
  ['tali lampu menyambung', (i) => (ORANG[i] ? { nyala: 1, lampion: 1, isi: isiOrang(i) } : { nyala: 0.5 }), { tali: 1, kucing: { i: NAYA_JM }, kam: { zoom: 0.62, cx: 520, cy: 960 } }],
];
export const Thumb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    {ADEGAN.map(([t, jd, p], i) => (
      <g key={i}>
        <svg x={(i % 2) * 540} y={Math.floor(i / 2) * 960} width="540" height="960" viewBox="0 0 1080 1920">
          <JendelaMalam2D f={30} papan="KOS PUTRI" jendela={jd} {...p} id={`c${i}`} />
        </svg>
        <rect x={(i % 2) * 540} y={Math.floor(i / 2) * 960 + 900} width="540" height="60" fill="#283D36" />
        <text x={(i % 2) * 540 + 20} y={Math.floor(i / 2) * 960 + 940} fontFamily="Lato" fontWeight="900" fontSize="28" fill="#FFF9EF">{t}</text>
      </g>
    ))}
  </svg>
);
