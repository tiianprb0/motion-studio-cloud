// Lokasi bersama: RUANG KONFERENSI INTERNASIONAL (briefing pers), panggung flat 2D dari kursi hadirin (v1, 21 Nov 2026).
// Dibuat untuk "Badaknya Diselamatkan, Warganya?": wacana diumumkan di briefing COP31. TIDAK ADA tokoh nyata yang
// digambar: podium kosong dengan mikrofon. Hadirin = figuran extras rig v4 (baju/wajah/rambut beda dari Naya-Yan):
// wartawan di tepi kiri-kanan digambar detail (tiga perempat, menghadap panggung, merekam dengan HP); barisan belakang
// di dekat panggung = siluet beranatomi utuh (rig yang sama diwarnai satu warna lewat filter, makin jauh makin pudar).
// Koreksi pengguna 21 Nov 2026 atas storyboard v1 (siluet kepala-bahu bulat di depan kamera): "SILUET DARI KARAKTER
// EXTRAS LAH!" (creative-contract: siluet tetap beranatomi utuh, bukan potongan kepala-badan).
// Tanpa logo resmi; latar panggung hanya teks `judul` + `sub` dan bola dunia sederhana.
// Kamera di tengah barisan kursi menghadap panggung. RK.podium {x,y} titik tengah atas podium.
// Prop:
//   f, judul ('COP31'), sub (baris kecil), sorot 0..1 (lampu panggung + kilat kamera)
//   meja 0..1  mode "meja keputusan": meja panjang dengan papan nama `kursi` (teks per kursi); kursi bertanda `kosong`
//              diberi sorot lampu (dipakai untuk metafora "warga tidak diajak bicara")
//   kursi      daftar papan nama, mis. ['PEMERINTAH', 'KEMENTERIAN', 'WARGA']; kosong = indeks kursi yang kosong
//   layar      isi layar samping kanan (React node, koordinat dunia; kotak 760..1020 × 420..620)
import React from 'react';
import { Person } from '../../../characters/rig/v4/Character';
import { POSE } from '../../../characters/rig/v4/poses';
import { PhoneInHand } from '../../../props/harian/v1/Props';

export const RK = { podium: { x: 540, y: 1180 }, lantaiPanggung: 1330, layar: { x: 770, y: 430, w: 250, h: 180 } };

/** figuran extras sebagai siluet beranatomi utuh: rig yang sama, diwarnai satu warna (filter flood) */
function SiluetExtras({ fid, warna, children }: { fid: string; warna: string; children: React.ReactNode }) {
  return (
    <g>
      <defs>
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feFlood floodColor={warna} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${fid})`}>{children}</g>
    </g>
  );
}
type Fig = { who: 'her' | 'him'; ap: number; baju: string; celana: string; x: number; y: number; s: number; dir: number };
// dua lapis siluet hadirin berdiri (wartawan + delegasi), tengah dikosongkan supaya podium/meja terbaca
const LAPIS_JAUH: Fig[] = [-150, -60, 30, 120, 210, 300, 780, 870, 960, 1050, 1140, 1230].map((x, i) => ({ who: (i % 3 === 1 ? 'her' : 'him') as 'her' | 'him', ap: [0, 4, 2, 7, 1][i % 5], baju: '#555', celana: '#333', x, y: 1430 + (i % 2) * 14, s: 0.68, dir: x < 540 ? 1 : -1 }));
const LAPIS_DEKAT: Fig[] = [-100, 40, 330, 760, 1040, 1180].map((x, i) => ({ who: (i % 2 ? 'her' : 'him') as 'her' | 'him', ap: [2, 4, 0, 7, 2, 1][i], baju: '#555', celana: '#333', x, y: 1560 + (i % 2) * 20, s: 0.95, dir: x < 540 ? 1 : -1 }));
const POSE_HADIRIN = ['santai', 'pegangDepanDada', 'melambai', 'pegangDepanDada', 'santai', 'pinggang'];
const DEPAN: Fig[] = [
  { who: 'him', ap: 2, baju: '#3E4A57', celana: '#2B3038', x: 190, y: 1830, s: 1.45, dir: 1 },
  { who: 'her', ap: 4, baju: '#7E6A9A', celana: '#3F4A55', x: 900, y: 1840, s: 1.4, dir: -1 },
];

export function RuangKonferensi2D({ f = 0, judul = 'COP31', sub = 'Konferensi Perubahan Iklim PBB · 2026', sorot = 0.5, meja = 0, kursi = [], kosong = -1, layar, isi, isiDepan, id = 'rk' }: { f?: number; judul?: string; sub?: string; sorot?: number; meja?: number; kursi?: string[]; kosong?: number; layar?: React.ReactNode; isi?: React.ReactNode; isiDepan?: React.ReactNode; id?: string }) {
  const kilat = sorot > 0 && f % 37 < 2;
  return (
    <g data-set="ruang-konferensi">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F3550" />
          <stop offset="1" stopColor="#2E4D70" />
        </linearGradient>
        <radialGradient id={`${id}-sorot`} cx=".5" cy=".3" r=".6">
          <stop offset="0" stopColor="#FFF4D6" stopOpacity=".55" />
          <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* dinding aula */}
      <rect x="-300" y="-300" width="1680" height="1700" fill="#1A2533" />
      {Array.from({ length: 9 }, (_, k) => (
        <rect key={k} x={-300 + k * 210} y="-300" width="12" height="1700" fill="#223044" />
      ))}
      {/* latar panggung */}
      <rect x="20" y="300" width="1040" height="1030" fill={`url(#${id}-bg)`} />
      {/* bola dunia sederhana */}
      <g opacity=".22">
        <circle cx="300" cy="860" r="210" fill="none" stroke="#9FC3E8" strokeWidth="6" />
        <ellipse cx="300" cy="860" rx="90" ry="210" fill="none" stroke="#9FC3E8" strokeWidth="4" />
        <path d="M90 860H510 M110 760H490 M110 960H490" stroke="#9FC3E8" strokeWidth="4" />
      </g>
      <text x="80" y="700" fontFamily="Lato" fontWeight="900" fontSize="120" fill="#FFFFFF">{judul}</text>
      <text x="84" y="760" fontFamily="Lato" fontWeight="700" fontSize="30" fill="#BFD5EE">{sub}</text>
      {/* layar samping */}
      <rect x={RK.layar.x - 10} y={RK.layar.y - 10} width={RK.layar.w + 20} height={RK.layar.h + 20} rx="8" fill="#0E1620" />
      <rect x={RK.layar.x} y={RK.layar.y} width={RK.layar.w} height={RK.layar.h} fill="#2B4A6E" />
      {layar}
      {/* lantai panggung */}
      <rect x="-300" y={RK.lantaiPanggung} width="1680" height="70" fill="#3A2E2A" />
      <rect x="-300" y={RK.lantaiPanggung} width="1680" height="10" fill="#5A4840" />
      {meja <= 0.5 ? (
        <g data-benda="podium-kosong">
          <path d={`M${RK.podium.x - 130} ${RK.podium.y} H${RK.podium.x + 130} L${RK.podium.x + 105} ${RK.lantaiPanggung} H${RK.podium.x - 105} Z`} fill="#D8CDB8" />
          <rect x={RK.podium.x - 140} y={RK.podium.y - 16} width="280" height="22" fill="#BFB29A" />
          <rect x={RK.podium.x - 70} y={RK.podium.y + 50} width="140" height="80" rx="6" fill="#B8AB92" />
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M${RK.podium.x + k * 30} ${RK.podium.y - 14} L${RK.podium.x + k * 50} ${RK.podium.y - 110}`} stroke="#2A2C30" strokeWidth="6" />
              <ellipse cx={RK.podium.x + k * 52} cy={RK.podium.y - 118} rx="9" ry="14" fill="#2A2C30" />
            </g>
          ))}
        </g>
      ) : (
        <g data-benda="meja-keputusan">
          <rect x="60" y="1150" width="960" height="40" fill="#E9DFC9" />
          <rect x="80" y="1190" width="920" height="140" fill="#D8CDB8" />
          {kursi.map((t, i) => {
            const n = kursi.length;
            const x = 60 + (960 / n) * (i + 0.5);
            const isKosong = i === kosong;
            return (
              <g key={i}>
                {/* sandaran kursi di balik meja */}
                <rect x={x - 70} y="960" width="140" height="190" rx="18" fill={isKosong ? '#6E5A52' : '#4A3C36'} />
                {isKosong && sorot > 0 && <ellipse cx={x} cy="1060" rx="150" ry="260" fill="#FFF4D6" opacity={0.18 * sorot} />}
                <rect x={x - 90} y="1110" width="180" height="46" rx="4" fill="#FFFFFF" />
                <text x={x} y="1142" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize={Math.min(26, 300 / t.length)} fill={isKosong ? '#8B4354' : '#283D36'}>{t}</text>
                {!isKosong && <path d={`M${x + 30} 1150 L${x + 50} 1080`} stroke="#2A2C30" strokeWidth="5" />}
              </g>
            );
          })}
        </g>
      )}
      {/* sorot lampu panggung */}
      {sorot > 0 && <rect x="-300" y="0" width="1680" height="1400" fill={`url(#${id}-sorot)`} opacity={sorot} />}
      {isi}
      {/* lantai aula: karpet */}
      <rect x="-300" y="1400" width="1680" height="1200" fill="#5A4A52" />
      {Array.from({ length: 12 }, (_, k) => (
        <path key={`kp${k}`} d={`M${540 + (k - 6) * 60} 1400 L${540 + (k - 6) * 260} 2600`} stroke="#4E4048" strokeWidth="3" />
      ))}
      {/* hadirin: siluet extras beranatomi di dekat panggung + tripod + wartawan detail di tepi depan */}
      <g data-lapisan="hadirin">
        <g opacity="0.85">
          <SiluetExtras fid={`${id}-sil1`} warna="#4A5A72">
            {LAPIS_JAUH.map((q, i) => {
              const ps = POSE_HADIRIN[(i * 7 + q.x) % POSE_HADIRIN.length];
              return <Person key={i} who={q.who} appearance={q.ap} shirtColor={q.baju} trouserColor={q.celana} x={q.x} y={q.y} s={q.s} f={f + i * 11} view="three" dir={q.dir} gazeY={-0.3} role="background" {...(POSE[q.who] as any)[ps]} holdRight={ps === 'pegangDepanDada' ? <PhoneInHand s={1} /> : undefined} />;
            })}
          </SiluetExtras>
        </g>
        <g opacity="1">
          <SiluetExtras fid={`${id}-sil2`} warna="#2E3B50">
            {LAPIS_DEKAT.map((q, i) => {
              const ps = POSE_HADIRIN[(i * 7 + q.x) % POSE_HADIRIN.length];
              return <Person key={i} who={q.who} appearance={q.ap} shirtColor={q.baju} trouserColor={q.celana} x={q.x} y={q.y} s={q.s} f={f + i * 11} view="three" dir={q.dir} gazeY={-0.3} role="background" {...(POSE[q.who] as any)[ps]} holdRight={ps === 'pegangDepanDada' ? <PhoneInHand s={1} /> : undefined} />;
            })}
          </SiluetExtras>
        </g>
        {[300, 790].map((x, i) => (
          <g key={i} data-benda="kamera-tripod">
            <path d={`M${x} 1480 L${x - 50} 1700 M${x} 1480 L${x + 50} 1700 M${x} 1480 V1700`} stroke="#1A222C" strokeWidth="7" />
            <rect x={x - 60} y="1420" width="120" height="70" rx="10" fill="#1A222C" />
            <rect x={x + (i ? -96 : 50)} y="1436" width="46" height="38" rx="8" fill="#2A3440" />
            {kilat && i === 0 && <circle cx={x + 90} cy="1455" r="80" fill="#FFFFFF" opacity=".45" />}
          </g>
        ))}
        {DEPAN.map((q, i) => (
          <Person key={i} who={q.who} appearance={q.ap} shirtColor={q.baju} trouserColor={q.celana} x={q.x} y={q.y} s={q.s} f={f + i * 13} view="three" dir={q.dir} gaze={q.dir * 0.4} gazeY={-0.3} mood="thinking" role="background" {...POSE[q.who].pegangDepanDada} holdRight={<PhoneInHand s={1} />} />
        ))}
      </g>
      {isiDepan}
    </g>
  );
}
