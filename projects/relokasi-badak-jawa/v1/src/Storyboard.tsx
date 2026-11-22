// Storyboard "awal → akhir": Badaknya Diselamatkan, Warganya? (relokasi badak Jawa v1, 21 Nov 2026). Satu panel per kalimat
// narasi (14). Frame 2p = awal, 2p+1 = akhir. Adegan dari src/Film.tsx (AdeganPanel). Menunggu persetujuan sebelum narasi.
// Render: node tools/render-film.cjs projects/relokasi-badak-jawa/v1 --entry=src/Storyboard.tsx --storyboard
import React from 'react';
import { P } from '../../../../shared/core/v1/core';
import { Vignette } from '../../../../shared/film/v1/Depth';
import { CaptionsDiam } from '../../../../shared/film/v1/CaptionsDiam';
import { OutroC } from '../../../../shared/outro/v3/OutroC';
import { AdeganPanel, NARASI, CTA, ACCENT } from './Film';

export { NARASI, CTA };
export const PHASES = 2;
const N = NARASI.length;
export const TOTAL = N * 2;
export const SHOTS: [number, string][] = Array.from({ length: N }, (_, i) => [2 * i, `panel-${i + 1}`]);
export const shotAt = (f: number) => ({ shot: `panel-${Math.min(N, Math.floor(f / 2) + 1)}` });

const KET: [string, string][] = [
  ['hutan Ujung Kulon: badak berkubang, laut tenang, Anak Krakatau berasap', 'kamera mundur: gelombang tsunami naik di laut (ancaman)'],
  ['briefing COP31: podium kosong, badak di layar, kartu sumber', 'peta Jawa: panah + badak berjalan Ujung Kulon → Alas Purwo'],
  ['kamera menyusuri pantai: badak di hutan → batas taman nasional', 'kampung nelayan yang sama: Naya menoleh ke kamera, warga, kucing'],
  ['kampung malam, gelombang besar: 22 DES 2018', 'kampung hancur (puing), kartu BNPB 400+ / terbanyak Pandeglang'],
  ['satu pantai: label "rumah badak"', 'label "rumah warga", gelombang yang sama di laut'],
  ['pos warga: alat penerima peringatan dini di meja', 'kertas DALAM PERBAIKAN ditempel, kabel lepas; catatan BNPB'],
  ['badak di hutan: kartu "Rumah baru ✓ Alas Purwo"', 'kampung: warga menatap, Naya tangan di pinggang, tanda "?"'],
  ['briefing COP31 disorot kamera wartawan: stempel KAJIAN: BELUM ADA', 'kartu Kemenhut: "Masih wacana."'],
  ['TAPI: depan Balai TN Ujung Kulon, gerbang tertutup, sepi', 'jalan penuh warga dengan poster (19 Nov 2026)'],
  ['dua warga mulai membentangkan spanduk', 'spanduk terbentang: tuntutan lindungi habitat asli'],
  ['kartu dugaan tambang emas (Walhi), latar batas taman nasional', 'stempel ESDM: BANTAH, ANTAM: BANTAH'],
  ['meja keputusan: papan nama PEMERINTAH, KEMENTERIAN, DELEGASI, WARGA', 'kursi WARGA kosong disorot lampu; label "tidak pernah diajak bicara"'],
  ['pantai yang sama: gelombang mengancam hutan dan kampung', 'sirene menyala, jalur evakuasi muncul, warga bergerak, badak berjalan'],
  ['dekat: badak makan di tepi hutan', 'kamera mundur: badak, warga, kucing, Naya dengan megafon → Outro C'],
];

const Label = ({ t1, t2 }: { t1: string; t2: string }) => (
  <g data-anno="label">
    <rect x="0" y="1690" width="1080" height="230" fill={P.wine} opacity="0.94" />
    <text x="50" y="1782" fontFamily="Lato" fontWeight="900" fontSize="40" fill={P.cream}>{t1}</text>
    <text x="50" y="1840" fontFamily="Lato" fontWeight="700" fontSize="28" fill="#F3DDE1">{t2}</text>
  </g>
);

export const Frame = ({ frame }: { frame: number }) => {
  const p = Math.floor(frame / 2);
  const akhir = frame % 2 === 1;
  const f = 40 + p * 37 + (akhir ? 29 : 0);
  const outro = p === N - 1 && akhir;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <rect width="1080" height="1920" fill={P.paper} />
      <AdeganPanel p={p} t={akhir ? 1 : 0} f={f} />
      <Vignette opacity={0.06} id={`vin-${frame}`} />
      {!outro && <CaptionsDiam teks={NARASI[p]} bagian={akhir ? 'akhir' : 0} accent={ACCENT} x={110} y={300} />}
      {outro && <OutroC f={65} cta={CTA} />}
      <Label t1={`${p + 1} · ${akhir ? 'akhir' : 'awal'}`} t2={akhir ? KET[p][1] : KET[p][0]} />
    </svg>
  );
};
