// Bagian luar kos Naya (7 Nov 2026, asal: projects/maaf-tanpa-kata/v2). Bingkai 1080x1920, tokoh skala 2,0.
// Gerbang: kamera DI TROTOAR (luar kos) menghadap pagar; halaman dan bangunan kos di balik pagar. Trotoar y 1620, jalan di bawah.
//   Tokoh berdiri di trotoar di DEPAN pagar (digambar setelah <Gerbang/>), palang atas pagar y 1290.
// Lorong: lantai y 1620, pintu kamar 07/08, rak sepatu, papan pengumuman.
// Atap kos (jemuran): lantai y 1620, pagar atap di belakang tokoh (setinggi pinggang), kota di bawah, langit senja.
import React from 'react';
import { P } from '../../../characters/rig/v2/Character';
import { Motorbike } from '../../../props/harian/v1/Props';
import { PowerPole, Plant, ACUnit, WallGrain, Tiles, Laundry, Sandals, Poster, Shadow, Bird, PerspFloor, wallMap, quad, SkyLife } from '../../_detail/v1/Detail';

export const LUAR = { floor: 1620, gateTop: 1290 };
// GERBANG, KAMERA SERONG: kamera di trotoar sisi kanan, menghadap serong ke kiri; pagar & bangunan menjauh ke titik hilang kiri.
// Posisi orang di trotoar tepat di depan pagar: GERBANG.at(z) -> {x, y, s} (z=1 paling dekat). Puncak pagar di kedalaman z: GERBANG.fenceTop(z).
export const GERBANG = {
  vx: -260,
  vy: 1060,
  at: (z: number) => ({ x: -260 + (1250 + 260) / z, y: 1060 + (1800 - 1060) / z, s: 2.6 / z }),
  fenceTop: (z: number) => ({ x: -260 + (1250 + 260) / z, y: 1060 + (1420 - 1060) / z }),
};
export function Gerbang({ f }: { f: number }) {
  const vx = GERBANG.vx,
    vy = GERBANG.vy;
  const facade = wallMap(vx, vy, 1320, 360, 1460, -100);
  const fence = wallMap(vx, vy, 1250, 1420, 1780, -200);
  const sideNear: [number, number] = [1250, 1780];
  return (
    <g data-set="gerbang-kos-serong">
      <rect x="-600" y="-400" width="2300" height="2700" fill="#CFE6EC" />
      <circle cx="260" cy="320" r="70" fill="#FFF3C8" opacity=".9" />
      <SkyLife f={f} time="siang" />
      {/* atap + fasad bangunan kos (menjauh ke kiri) */}
      <path d={`M${facade(0, 1)[0] + 40} ${facade(0, 1)[1]}L${facade(1, 1)[0]} ${facade(1, 1)[1]}L${facade(1, 1)[0]} ${facade(1, 1)[1] - 70}L${facade(0, 1)[0] + 60} ${facade(0, 1)[1] - 160}Z`} fill="#B5674E" />
      <path d={quad(facade, 0, 1, 0, 1)} fill="#EBD9BE" />
      <path d={quad(facade, 0, 1, 0.47, 0.5)} fill="#D9C29C" />
      {[0.04, 0.3, 0.56].map((u, i) => (
        <g key={i}>
          <path d={quad(facade, u, u + 0.16, 0.6, 0.86)} fill="#9EC3CC" />
          <path d={quad(facade, u, u + 0.05, 0.6, 0.86)} fill={['#E7899A', '#95B8A2', '#F1C977'][i]} opacity=".85" />
          <path d={quad(facade, u + 0.078, u + 0.088, 0.6, 0.86)} fill="#E2D3B9" />
          <path d={quad(facade, u - 0.01, u + 0.17, 0.585, 0.6)} fill="#D9C29C" />
          <path d={quad(facade, u, u + 0.16, 0.12, 0.38)} fill="#9EC3CC" />
          <path d={quad(facade, u + 0.078, u + 0.088, 0.12, 0.38)} fill="#E2D3B9" />
        </g>
      ))}
      <path d={quad(facade, 0.22, 0.28, 0, 0.36)} fill="#B88E68" />
      <path d={quad(facade, 0.47, 0.55, 0.72, 0.8)} fill="#DAD6CE" />
      {/* jemuran di depan jendela lantai 2 */}
      {[0.08, 0.13, 0.18, 0.34, 0.4].map((u, i) => <path key={'j' + i} d={quad(facade, u, u + 0.035, 0.47, 0.58)} fill={['#E7899A', '#95B8A2', '#F1C977', '#7E8FB0', '#FFF9EF'][i]} transform="translate(0 30)" />)}
      {/* halaman (ubin) antara fasad dan pagar */}
      <path d={`M${facade(0, 0)[0]} ${facade(0, 0)[1]}L${vx} ${vy}L${fence(0, 0)[0]} ${fence(0, 0)[1]}L1700 ${fence(0, 0)[1]}L1700 ${facade(0, 0)[1]}Z`} fill="#D8CDB9" />
      {[1.2, 1.5, 1.9, 2.5, 3.4].map((z, i) => <path key={i} d={`M${vx + (1320 - vx) / z} ${vy + (1460 - vy) / z}L${vx + (1250 - vx) / z} ${vy + (1780 - vy) / z}`} stroke="#BFB29C" strokeWidth="2" />)}
      {/* pot & rak sepatu di halaman */}
      <Plant x={facade(0.15, 0)[0]} y={facade(0.15, 0)[1] + 20} s={0.8} kind={2} />
      <Plant x={facade(0.4, 0)[0]} y={facade(0.4, 0)[1] + 16} s={0.6} kind={1} />
      {/* trotoar (posisi kamera): ubin menyatu ke titik hilang */}
      <path d={`M${vx} ${vy}L${sideNear[0] + 600} ${sideNear[1]}L1700 2400L-600 2400L-600 ${vy + 200}Z`} fill="#BDB4A4" />
      {Array.from({ length: 10 }, (_, i) => <path key={'s' + i} d={`M${vx} ${vy}L${-600 + i * 260} 2400`} stroke="#A39A89" strokeWidth="2" opacity=".8" />)}
      {[1, 1.2, 1.45, 1.8, 2.3, 3].map((z, i) => <path key={'c' + i} d={`M${vx + (1250 - vx) / z} ${vy + (1790 - vy) / z}L${vx + (-600 - vx) / z} ${vy + (2400 - vy) / z}`} stroke="#A39A89" strokeWidth="2" opacity=".8" />)}
      {/* tiang listrik dekat kamera */}
      <PowerPole x={1010} ground={1980} top={120} wiresTo={[-500, 1500]} />
    </g>
  );
}
// Pagar besi + tembok pendek + pilar gerbang dengan papan KOS MELATI (miring mengikuti kamera serong). Gambar setelah Gerbang, sebelum tokoh.
export const PagarBesi = () => {
  const fence = wallMap(GERBANG.vx, GERBANG.vy, 1250, 1420, 1780, -200);
  const ang = (Math.atan2(fence(1, 1)[1] - fence(0, 1)[1], fence(1, 1)[0] - fence(0, 1)[0]) * 180) / Math.PI + 180;
  const sign = fence(0.33, 1.55);
  const zSign = 1 + 0.33 * ((1250 + 260) / (-200 + 260) - 1);
  return (
    <g data-set="pagar-serong">
      <path d={quad(fence, 0, 1, 0, 0.3)} fill="#E2D3B9" />
      <path d={quad(fence, 0, 1, 0.3, 0.33)} fill="#C9B79A" />
      {Array.from({ length: 46 }, (_, i) => {
        const u = i / 46;
        return <path key={i} d={quad(fence, u, u + 0.006, 0.33, 0.97)} fill="#5E7070" />;
      })}
      <path d={quad(fence, 0, 1, 0.95, 1)} fill="#4E5F66" />
      <path d={quad(fence, 0, 1, 0.6, 0.63)} fill="#4E5F66" />
      {/* pilar gerbang */}
      {[0.28, 0.4].map((u, i) => <path key={i} d={quad(fence, u, u + 0.02, 0, 1.25)} fill="#C9B79A" />)}
      <g transform={`translate(${sign[0]} ${sign[1]}) rotate(${ang}) scale(${1.4 / zSign})`}>
        <rect x="-150" y="-36" width="300" height="72" rx="8" fill="#FFF9EF" stroke="#B88E68" strokeWidth="6" />
        <text y="14" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="38" fill={P.ink} letterSpacing="3">KOS MELATI</text>
      </g>
    </g>
  );
};
export function Lorong({ f }: { f: number }) {
  return (
    <g data-set="lorong-kos">
      <rect x="-600" y="-400" width="2300" height="2700" fill="#EADFCB" />
      <WallGrain x={0} y={600} w={1080} h={1000} seed={4} o={0.06} />
      <rect x="-600" y="1180" width="2300" height="440" fill="#DCCDB3" />
      <path d="M-600 1180h2300" stroke="#C9B79A" strokeWidth="8" />
      <PerspFloor vx={540} vy={1060} yTop={1620} a="#CDBFA7" b="#C4B59C" line="#B3A48A" cols={12} rows={6} />
      {/* jendela lorong dengan cahaya */}
      <rect x="60" y="760" width="260" height="300" rx="6" fill="#CFE6EC" />
      <path d="M190 760v300M60 910h260" stroke="#C9B79A" strokeWidth="10" />
      <path d="M60 1060L320 1060L560 1620H200Z" fill="#FFF3C8" opacity=".25" />
      {/* pintu kamar */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${420 + i * 360} 980)`}>
          <rect x="-12" y="-12" width="244" height="652" fill="#C9B79A" />
          <rect width="220" height="640" fill="#B88E68" />
          <rect x="24" y="40" width="172" height="250" rx="6" fill="none" stroke="#A47C58" strokeWidth="6" />
          <rect x="24" y="330" width="172" height="270" rx="6" fill="none" stroke="#A47C58" strokeWidth="6" />
          <rect x="70" y="-70" width="80" height="44" rx="6" fill="#FFF9EF" />
          <text x="110" y="-38" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="28" fill={P.ink}>{['07', '08'][i]}</text>
          <circle cx="196" cy="330" r="9" fill={P.gold} />
          <rect x="10" y="630" width="200" height="22" rx="6" fill={['#C98F84', '#7E8FB0'][i]} />
        </g>
      ))}
      {/* rak sepatu + sandal, papan pengumuman, lampu dinding, tanaman */}
      <rect x="40" y="1460" width="250" height="160" fill="#9C7552" />
      <rect x="50" y="1520" width="230" height="10" fill="#7E5C40" />
      <Sandals x={80} y={1514} /><Sandals x={90} y={1604} />
      <rect x="60" y="1180" width="220" height="190" fill="#C9A47A" />
      <rect x="72" y="1192" width="196" height="166" fill="#D9BC92" />
      <Poster x={86} y={1206} w={80} h={100} rot={-4} art="#95B8A2" />
      <rect x="176" y="1210" width="80" height="60" fill="#FFF9EF" />
      <text x="216" y="1240" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="12" fill="#C24E4E">JAM MALAM</text>
      <text x="216" y="1258" textAnchor="middle" fontFamily="Lato" fontWeight="900" fontSize="16" fill={P.ink}>22.00</text>
      <path d="M720 880h40v-30" stroke="#8B6648" strokeWidth="6" fill="none" />
      <circle cx="760" cy="840" r="16" fill="#FFE7AE" /><circle cx="760" cy="840" r="60" fill="#FFD98A" opacity=".2" />
      <Plant x={1010} y={1620} s={1.3} kind={0} />
    </g>
  );
}
export function AtapKos({ f }: { f: number }) {
  return (
    <g data-set="atap-kos-senja">
      <linearGradient id="senja-atap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5E6E92" />
        <stop offset=".4" stopColor="#D9907A" />
        <stop offset=".62" stopColor="#F4C389" />
      </linearGradient>
      <rect x="-600" y="-400" width="2300" height="2700" fill="url(#senja-atap)" />
      <circle cx="260" cy="1120" r="80" fill="#FFE2A8" opacity=".9" />
      <SkyLife f={f} time="senja" />
      {/* kota di bawah: kubah masjid, menara, atap-atap, kabel */}
      <path d="M-40 1160h1160v300H-40Z" fill="#8E6E6A" opacity=".55" />
      <g fill="#7A5C5A" opacity=".85">
        <rect x="560" y="1020" width="40" height="200" />
        <path d="M580 980l-16 40h32Z" />
        <path d="M640 1160q60 -110 120 0Z" />
        <rect x="660" y="1150" width="80" height="80" />
        <rect x="820" y="1010" width="140" height="240" />
      </g>
      {[[-40, 1230, 220], [160, 1250, 200], [330, 1220, 240], [600, 1260, 180], [760, 1240, 220], [940, 1250, 200]].map(([x, y, w], i) => (
        <g key={i}>
          <path d={`M${x} ${y}l${w / 2} -60l${w / 2} 60v300h${-w}Z`} fill={['#7C5A55', '#6B4F4D', '#80605A', '#6E5250', '#755753', '#6B4F4D'][i]} />
          <rect x={x + w / 2 - 18} y={y + 50} width="36" height="36" fill="#F1C977" opacity=".55" />
        </g>
      ))}
      <path d="M-40 1120Q300 1180 600 1110T1120 1130" stroke="#3B3430" strokeWidth="2.5" fill="none" opacity=".6" />
      {/* lantai atap (ubin) */}
      <PerspFloor vx={540} vy={1060} yTop={1440} a="#C9B9A0" b="#C1B097" line="#AE9D84" cols={12} rows={8} />
      {/* pagar atap: tembok rendah + besi (di belakang tokoh) */}
      <rect x="-600" y="1300" width="2300" height="140" fill="#D9C7AA" />
      <rect x="-600" y="1292" width="2300" height="14" fill="#BFAE93" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={-20 + i * 48} y="1180" width="8" height="112" fill="#5B4A44" />)}
      <rect x="-600" y="1176" width="2300" height="10" fill="#5B4A44" />
      {/* toren air, kursi plastik, tanaman, jemuran */}
      <g transform="translate(900 1440)">
        <Shadow x={0} y={0} w={200} />
        <rect x="-80" y="-60" width="160" height="60" fill="#8E8A82" />
        <rect x="-70" y="-260" width="140" height="200" rx="30" fill="#E1A93B" />
        <path d="M-70 -200h140M-70 -140h140" stroke="#C9922E" strokeWidth="5" />
      </g>
      <Plant x={110} y={1560} s={1.3} kind={2} />
      <Plant x={250} y={1540} s={1.0} kind={1} pot="#7E8FB0" />
      <Laundry x0={-40} x1={1120} y={760} f={f} colors={['#FFF9EF', '#E7899A', '#95B8A2', '#F1C977', '#7E8FB0', '#FFCDB2']} />
      <path d="M-40 760V1440M1120 760V1440" stroke="#6E6A64" strokeWidth="8" />
    </g>
  );
}
