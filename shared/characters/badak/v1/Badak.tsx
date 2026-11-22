// Badak Jawa (Rhinoceros sondaicus), tokoh hewan flat 2D (v1, 21 Nov 2026). Dibuat untuk "Badaknya Diselamatkan,
// Warganya?" (relokasi badak Jawa). Ciri yang dijaga supaya tidak terbaca badak India/Afrika:
//   - SATU cula kecil (±25 cm) di atas moncong; betina boleh tanpa cula (`cula={false}`)
//   - lipatan kulit seperti pelana: lipatan di belakang bahu yang melingkar ke punggung, lipatan pinggul, lipatan leher
//   - kulit bertekstur sisik mosaik kecil, abu-abu kecokelatan; bibir atas runcing (bisa memegang daun)
//   - telinga bulat berumbai, mata kecil
// SKALA sama dengan rig tokoh (rig ±1,6 m = 280·s px → 175 px/m): tinggi bahu ±1,55 m (±270·s), panjang badan ±3 m.
// Titik (x, y) = tanah di bawah tengah badan. `dir` 1 menghadap kanan, -1 kiri.
//   <Badak x y s f dir pose cula lumpur id />
//   pose: 'berdiri' | 'jalan' (kaki berayun mengikuti f) | 'makan' (kepala turun, bibir meraih daun) | 'kubang' (berendam
//   di lumpur: hanya badan atas, permukaan lumpur digambar oleh komponen ini)
//   lumpur 0..1: kaki dan perut berlumur lumpur.  kepala -1..1: angguk kecil (mis. menoleh/terkejut).
// Id pola kulit unik per `id` (aturan id SVG unik, 20 Nov 2026).
import React from 'react';

export type PoseBadak = 'berdiri' | 'jalan' | 'makan' | 'kubang';
const KULIT = '#8A857C',
  KULIT_GELAP = '#716C64',
  KULIT_TERANG = '#A39D92',
  GARIS = '#5C5852',
  LUMPUR = '#6E5A44';
/** kepala berat segitiga: dahi landai, moncong tebal, bibir atas runcing */
const KEPALA =
  'M136 -248 C186 -256 230 -236 260 -204 C284 -178 300 -150 304 -128 C307 -116 304 -106 296 -102 C282 -96 262 -96 244 -100 C214 -104 184 -112 158 -126 Z';

function Kaki({ x, ayun, jauh, lumpur = 0 }: { x: number; ayun: number; jauh?: boolean; lumpur?: number }) {
  const w = 54;
  const kx = x + ayun * 26;
  return (
    <g>
      <path
        d={`M${x - w / 2} -120 C${x - w / 2 - 4} -70 ${kx - w / 2 - 2} -30 ${kx - w / 2} -8 L${kx + w / 2} -8 C${kx + w / 2 + 2} -30 ${x + w / 2 + 4} -70 ${x + w / 2} -120 Z`}
        fill={jauh ? KULIT_GELAP : KULIT}
      />
      {lumpur > 0 && (
        <path d={`M${(x + kx) / 2 - w / 2 - 2} -62 L${kx - w / 2} -8 L${kx + w / 2} -8 L${(x + kx) / 2 + w / 2 + 2} -62 Q${(x + kx) / 2} -50 ${(x + kx) / 2 - w / 2 - 2} -62Z`} fill={LUMPUR} opacity={0.8 * lumpur} />
      )}
      <ellipse cx={kx} cy={-6} rx={w / 2 + 4} ry={9} fill={jauh ? '#615C55' : KULIT_GELAP} />
      {[-1, 0, 1].map((k) => (
        <path key={k} d={`M${kx + k * 15 - 7} -3 q7 7 14 0`} fill="#4F4B46" opacity=".8" />
      ))}
      {/* lipatan lutut */}
      <path d={`M${x - w / 2 + 4} -70 q${w / 2 - 4} 10 ${w - 8} 0`} stroke={GARIS} strokeWidth="2.5" fill="none" opacity=".5" />
    </g>
  );
}

export function Badak({ x, y, s = 1, f = 0, dir = 1, pose = 'berdiri', cula = true, lumpur = 0, kepala = 0, id = 'badak' }: { x: number; y: number; s?: number; f?: number; dir?: number; pose?: PoseBadak; cula?: boolean; lumpur?: number; kepala?: number; id?: string }) {
  const jalan = pose === 'jalan';
  const fase = f * 0.16;
  const ay = (k: number) => (jalan ? Math.sin(fase + k * Math.PI) : 0);
  const naik = jalan ? Math.abs(Math.sin(fase)) * 4 : Math.sin(f * 0.05) * 1.5; // napas / langkah
  const turun = pose === 'makan' ? 34 : 0;
  const angguk = kepala * 8 + (pose === 'makan' ? Math.sin(f * 0.12) * 4 : 0);
  const kubang = pose === 'kubang';
  const kunyah = pose === 'makan' ? Math.abs(Math.sin(f * 0.3)) * 3 : 0;
  const kulitId = `${id}-kulit`;
  const klipId = `${id}-klip`;
  const lumpurId = `${id}-lumpur`;
  const badan =
    'M-232 -150 C-244 -232 -172 -272 -60 -270 C40 -270 118 -264 160 -228 C200 -196 206 -140 190 -110 C172 -90 100 -88 40 -92 L-120 -92 C-192 -94 -226 -110 -232 -150 Z';
  return (
    <g data-tokoh="badak-jawa" transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <defs>
        <pattern id={kulitId} width="22" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 9 L6 2 L16 2 L22 9 L16 16 L6 16 Z" fill="none" stroke={GARIS} strokeWidth="1" opacity=".22" />
        </pattern>
        <clipPath id={klipId}>
          <path d={badan} />
        </clipPath>
        <linearGradient id={lumpurId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LUMPUR} stopOpacity="0" />
          <stop offset=".55" stopColor={LUMPUR} stopOpacity=".55" />
          <stop offset="1" stopColor={LUMPUR} stopOpacity=".9" />
        </linearGradient>
      </defs>
      {!kubang && <ellipse cx={-20} cy={0} rx={250} ry={22} fill="#000" opacity=".16" />}
      <g transform={`translate(0 ${(kubang ? 70 : 0) - naik})`}>
        {/* kaki jauh */}
        {!kubang && (
          <>
            <Kaki x={-120} ayun={ay(0)} jauh lumpur={lumpur} />
            <Kaki x={70} ayun={ay(1)} jauh lumpur={lumpur} />
          </>
        )}
        {/* ekor */}
        <path d={`M-228 -196 C-246 -176 ${-250 + Math.sin(f * 0.2) * 6} -152 ${-242 + Math.sin(f * 0.2) * 8} -128`} stroke={KULIT_GELAP} strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* badan */}
        <path d={badan} fill={KULIT} />
        <g clipPath={`url(#${klipId})`}>
          <rect x="-260" y="-280" width="480" height="200" fill={`url(#${kulitId})`} />
          {/* gelap perut, terang punggung */}
          <path d="M-240 -128 C-120 -104 60 -104 210 -128 L210 -80 L-240 -80 Z" fill={KULIT_GELAP} opacity=".55" />
          <path d="M-200 -262 C-100 -278 60 -276 150 -236" stroke={KULIT_TERANG} strokeWidth="14" fill="none" opacity=".45" />
          {lumpur > 0 && <rect x="-260" y="-200" width="480" height="120" fill={`url(#${lumpurId})`} opacity={lumpur} />}
        </g>
        {/* lipatan pelana (ciri badak Jawa) */}
        <path d="M96 -264 C80 -214 84 -150 104 -96" stroke={GARIS} strokeWidth="5" fill="none" opacity=".75" />
        <path d="M96 -264 C70 -236 58 -234 40 -268" stroke={GARIS} strokeWidth="4" fill="none" opacity=".55" />
        <path d="M-116 -266 C-132 -206 -138 -146 -118 -94" stroke={GARIS} strokeWidth="5" fill="none" opacity=".7" />
        <path d="M-150 -258 C-170 -236 -186 -232 -206 -238" stroke={GARIS} strokeWidth="3" fill="none" opacity=".45" />
        {/* kaki dekat */}
        {!kubang && (
          <>
            <Kaki x={-170} ayun={ay(1)} lumpur={lumpur} />
            <Kaki x={122} ayun={ay(0)} lumpur={lumpur} />
          </>
        )}
        {/* kepala + leher */}
        <g transform={`translate(0 ${turun}) rotate(${(pose === 'makan' ? 16 : 0) + angguk} 150 -200)`}>
          <path d={KEPALA} fill={KULIT} />
          <path d={KEPALA} fill={`url(#${kulitId})`} />
          <path d="M250 -112 C266 -106 284 -104 296 -108" stroke={GARIS} strokeWidth="2.5" fill="none" opacity=".5" />
          {/* lipatan leher */}
          <path d="M162 -240 C150 -210 150 -168 164 -130" stroke={GARIS} strokeWidth="4.5" fill="none" opacity=".7" />
          <path d="M184 -244 C174 -214 174 -174 186 -126" stroke={GARIS} strokeWidth="2.5" fill="none" opacity=".45" />
          {/* bibir atas runcing (bisa memegang daun) + mulut */}
          <path d={`M300 -112 C306 -106 306 -100 298 ${-96 + kunyah}`} stroke={GARIS} strokeWidth="3" fill="none" />
          <path d={`M296 -104 C282 ${-100 + kunyah} 266 ${-101 + kunyah} 252 -106`} stroke={GARIS} strokeWidth="2.5" fill="none" />
          <ellipse cx="292" cy="-136" rx="3" ry="4" fill="#3E3B37" />
          {/* cula tunggal kecil */}
          {cula && <path d="M258 -176 C262 -200 272 -214 282 -220 C286 -202 284 -186 280 -170 Z" fill="#6A645B" stroke={GARIS} strokeWidth="1.5" />}
          {/* mata kecil */}
          <ellipse cx="224" cy="-180" rx="5.5" ry="4.5" fill="#2E2B28" />
          <circle cx="225.5" cy="-181.5" r="1.6" fill="#FFFFFF" />
          <path d="M215 -188 q9 -5 18 0" stroke={GARIS} strokeWidth="2" fill="none" />
          {/* telinga berumbai di belakang kepala */}
          <g transform={`rotate(${Math.sin(f * 0.09) * 6} 186 -236)`}>
            <path d="M176 -234 C166 -258 176 -280 194 -278 C204 -262 200 -246 194 -232 Z" fill={KULIT_GELAP} />
            <path d="M179 -266 l-5 -9 M186 -274 l-1 -10 M193 -276 l3 -9" stroke="#4F4B46" strokeWidth="2" />
          </g>
        </g>
      </g>
      {kubang && (
        <g data-detail="kubangan">
          <ellipse cx="0" cy="-8" rx="330" ry="46" fill={LUMPUR} />
          <ellipse cx="-20" cy="-14" rx="290" ry="30" fill="#7E6950" />
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={-120 + k * 130} cy={-18} rx={30 + ((f * 0.6 + k * 20) % 40)} ry={5 + ((f * 0.1 + k) % 4)} fill="none" stroke="#9A8468" strokeWidth="2" opacity={0.6 - ((f * 0.6 + k * 20) % 40) / 80} />
          ))}
        </g>
      )}
    </g>
  );
}
