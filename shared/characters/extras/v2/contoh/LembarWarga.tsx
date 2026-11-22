// Lembar contoh warga (extras v2) untuk persetujuan pengguna. Naya dan Yan di kiri atas sebagai pembanding (rig v3, tidak berubah).
// Render: node tools/render-thumb.cjs shared/characters/extras/v2/contoh/LembarWarga.tsx shared/characters/extras/v2/contoh/LembarWarga --only
import React from 'react';
import { Person, P } from '../../../rig/v3/Character';
import { POSE } from '../../../rig/v3/poses';
import { WARGA, Warga } from '../Warga';

const S = 0.78;
export const Thumb = () => (
  <svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1920" fill={P.paper} />
    <text x="60" y="96" fontFamily="Playfair" fontSize="54" fill={P.ink}>Warga Kampung Less.</text>
    <text x="60" y="142" fontFamily="Lato" fontWeight="700" fontSize="24" fill="#6E7C76">Extras v2 (kandidat) · 18 pilihan karakter donatur · Naya &amp; Yan sebagai pembanding</text>
    <rect x="40" y="180" width="300" height="430" rx="26" fill={P.cream} stroke={P.line} strokeWidth="2" />
    <text x="190" y="214" fontFamily="Lato" fontWeight="900" fontSize="20" textAnchor="middle" fill={P.wine}>PEMBANDING</text>
    <Person who="her" x={120} y={570} s={S} f={12} mood="warm" {...POSE.her.santai} />
    <Person who="him" x={260} y={570} s={S} f={12} dir={-1} mood="soft" {...POSE.him.santai} />
    {WARGA.map((w, i) => {
      const kol = (i + 2) % 6;
      const bar = Math.floor((i + 2) / 6);
      const x = 100 + kol * 176;
      const y = 570 + bar * 430;
      const pose = w.who === 'her' ? POSE.her.santai : POSE.him.santai;
      return (
        <g key={w.id}>
          {kol >= 2 || bar > 0 ? <rect x={x - 82} y={y - 390} width="164" height="430" rx="22" fill="#FFFDF9" stroke="#ECE4D6" strokeWidth="2" /> : null}
          <Warga id={w.id} x={x} y={y - 6} s={S} f={12} dir={i % 2 ? -1 : 1} mood="soft" {...pose} />
          <text x={x} y={y + 26} fontFamily="Lato" fontWeight="900" fontSize="22" textAnchor="middle" fill={P.ink}>{w.id}</text>
        </g>
      );
    })}
  </svg>
);
