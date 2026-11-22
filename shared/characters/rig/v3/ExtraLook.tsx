// Extras v3 (9 Nov 2026): wajah, rambut, aksesori, dan baju untuk warga/figuran baru. Dipakai lewat Person `extra={look}`.
// Bahasa gambar sama dengan wajah yang disetujui: kepala kotak membulat, mata lonjong, pipi merona, hidung titik.
// Dibuat supaya JELAS berbeda dari Naya (bob cokelat tua + rajut peach) dan Yan (rambut hitam berponi + polo sage):
// tidak ada kombinasi bob cokelat tua + baju peach, atau rambut hitam berponi samping + baju sage.
import React from 'react';

export type Rambut =
  | 'panjang' | 'kuncir' | 'cepol' | 'kepang' | 'keriting' | 'pixie' | 'sanggul' | 'hijab'
  | 'cepak' | 'jabrik' | 'belah' | 'ikat' | 'topi' | 'kupluk' | 'peci' | 'botak' | 'afro';
export type Baju = 'kaos' | 'kemeja' | 'jaket' | 'hoodie' | 'garis' | 'kardigan' | 'batik';
export type ExtraLook = {
  id: string;
  nama: string;
  who: 'her' | 'him';
  rambut: Rambut;
  warnaRambut: string;
  kulit: string;
  baju: Baju;
  warnaBaju: string;
  warnaDalam?: string;
  bawah: string;
  aksen?: string;
  kacamata?: boolean;
  kumis?: boolean;
  jenggot?: boolean;
  anting?: boolean;
  lenganPanjang?: boolean;
  rokPanjang?: boolean;
};

const gelap = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

// ---------------------------------------------------------------- kepala
export function ExtraKepala({
  look,
  mood = 'soft',
  blink = false,
  gaze = 0,
  gazeY = 0,
  dir = 1,
}: {
  look: ExtraLook;
  mood?: string;
  blink?: boolean;
  gaze?: number;
  gazeY?: number;
  view?: string;
  dir?: number;
}) {
  const H = look.warnaRambut;
  const A = look.aksen ?? '#8D7A70';
  const sk = look.kulit;
  const gy = Math.max(-1.6, Math.min(3, gazeY * 2.6));
  const r = look.rambut;
  const belakang = -dir; // sisi kepala yang menjauh dari kamera (tampak tiga perempat)
  return (
    <g data-extra-look={look.id}>
      <g transform="translate(0 -279)">
        {/* ---- lapisan belakang (di balik wajah) ---- */}
        {r === 'panjang' && (
          <>
            <path d="M-38-16Q-44-60 0-60Q44-60 38-16Z" fill={H} />
            <path d="M-40-22Q-47 20-46 62Q-36 68-27 62Q-31 20-31-8Z" fill={H} />
            <path d="M40-22Q47 20 46 62Q36 68 27 62Q31 20 31-8Z" fill={H} />
          </>
        )}
        {r === 'kuncir' && (
          <>
            <path d={`M${belakang * 30}-30Q${belakang * 62}-24 ${belakang * 50} 22Q${belakang * 44} 8 ${belakang * 36}-8Z`} fill={H} />
            <circle cx={belakang * 33} cy="-30" r="5" fill={A} />
            <path d="M-37-14Q-40-56 0-56Q40-56 37-14Z" fill={H} />
          </>
        )}
        {(r === 'cepol' || r === 'ikat') && (
          <>
            <circle cx={r === 'ikat' ? belakang * 10 : 0} cy={r === 'ikat' ? -60 : -64} r={r === 'ikat' ? 11 : 16} fill={H} />
            <path d="M-37-14Q-40-56 0-56Q40-56 37-14Z" fill={H} />
          </>
        )}
        {r === 'sanggul' && (
          <>
            <circle cx={belakang * 30} cy="-14" r="15" fill={H} />
            <path d="M-37-12Q-40-56 0-56Q40-56 37-12Z" fill={H} />
          </>
        )}
        {(r === 'kepang' || r === 'pixie' || r === 'cepak' || r === 'jabrik' || r === 'belah' || r === 'peci') && (
          <path d="M-37-14Q-39-55 0-55Q39-55 37-14Z" fill={H} />
        )}
        {r === 'keriting' && (
          <path
            d="M-44 26Q-58 12-48-4Q-60-22-44-36Q-46-58-22-60Q-8-72 8-62Q28-70 40-52Q60-46 52-24Q62-6 48 8Q56 24 42 32Q30 20 0 18Q-30 20-44 26Z"
            fill={H}
          />
        )}
        {r === 'afro' && (
          <path d="M-40 4Q-62-6-56-30Q-62-56-36-66Q-20-82 0-74Q20-82 36-66Q62-56 56-30Q62-6 40 4Q20-18 0-18Q-20-18-40 4Z" fill={H} />
        )}
        {r === 'hijab' && <path d="M-44-16Q-48-64 0-64Q48-64 44-16L56 58Q0 72-56 58Z" fill={A} />}

        {/* ---- wajah ---- */}
        <rect x="-35" y="-39" width="70" height="78" rx="33" fill={sk} />
        <circle cx="-25" cy="10" r="7.5" fill="#E2877C" opacity=".32" />
        <circle cx="25" cy="10" r="7.5" fill="#E2877C" opacity=".32" />
        {[-17, 17].map((x, i) => (
          <g key={i}>
            <ellipse cx={x + gaze * 1.7} cy={-4 + gy} rx="4.3" ry={blink ? 0.7 : 5.2} fill="#3E342D" />
            <circle cx={x + 1.5 + gaze * 1.7} cy={-6 + gy} r={blink ? 0 : 1.7} fill="white" />
          </g>
        ))}
        <path
          d={r === 'botak' || r === 'peci' ? 'M-25-18q9-5 17-2M8-20q9-3 17 2' : 'M-25-17q9-4 17-1M8-18q9-3 17 1'}
          stroke={gelap(H === '#B9B3AC' ? '#8A847E' : H, 0.9)}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cy="6" r="1.9" fill={gelap(sk, 0.84)} />
        <path
          d={mood === 'soft' || mood === 'warm' ? 'M-7 20q7 5 14 0' : mood === 'thinking' ? 'M-6 21q6-2 12 0' : 'M-7 21q7-3 14 0'}
          stroke="#9E5F5B"
          strokeWidth="2.3"
          fill="none"
          strokeLinecap="round"
        />
        {look.kumis && <path d="M-11 13q5-4 11-1q6-3 11 1q-5 4-11 2q-6 2-11-2Z" fill={gelap(H, 0.95)} />}
        {look.jenggot && <path d="M-33 6Q-31 42 0 46Q31 42 33 6Q26 30 10 31Q0 26-10 31Q-26 30-33 6Z" fill={H} opacity=".92" />}

        {/* ---- lapisan depan (rambut atas, aksesori) ---- */}
        {(r === 'panjang') && <path d="M-36-12Q-36-52 4-52Q38-52 37-14Q26-32 6-35Q-14-30-36-12Z" fill={H} />}
        {(r === 'kuncir' || r === 'cepol' || r === 'ikat') && <path d="M-36-16Q-33-53 0-53Q33-53 36-16Q22-35 0-37Q-22-35-36-16Z" fill={H} />}
        {r === 'kepang' && (
          <>
            <path d="M-36-14Q-34-53 0-53Q34-53 36-14Q22-36 2-38L0-32L-2-38Q-22-36-36-14Z" fill={H} />
            {[-1, 1].map((s) => (
              <g key={s} fill={H}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <ellipse key={i} cx={s * (37 + i * 0.6)} cy={4 + i * 12} rx="6.5" ry="7.5" />
                ))}
                <circle cx={s * 40} cy="62" r="3.6" fill={A} />
              </g>
            ))}
          </>
        )}
        {r === 'keriting' && (
          <path d="M-37-10Q-44-26-32-38Q-30-56-10-52Q2-62 16-52Q34-56 36-38Q46-26 37-10Q30-26 18-24Q6-32-6-24Q-20-30-37-10Z" fill={H} />
        )}
        {r === 'pixie' && <path d="M-36-8Q-40-50-2-54Q36-56 37-20Q30-30 18-30Q2-24-12-32Q-24-22-36-8Z" fill={H} />}
        {r === 'sanggul' && (
          <>
            <path d="M-36-14Q-33-53 0-53Q33-53 36-14Q24-34 2-37Q-22-34-36-14Z" fill={H} />
            <path d="M2-52Q0-44 2-37" stroke={gelap(H, 0.82)} strokeWidth="1.6" fill="none" />
          </>
        )}
        {r === 'hijab' && (
          <>
            <path d="M-39-12Q-41-58 0-58Q41-58 39-12Q36-42 0-44Q-36-42-39-12Z" fill={A} />
            <path d="M-39-12Q-40 24-24 40" stroke={gelap(A, 0.86)} strokeWidth="2" fill="none" />
            <path d={`M${belakang * -30} 30q${belakang * 14} 14 ${belakang * 34} 10`} stroke={gelap(A, 0.86)} strokeWidth="2" fill="none" />
          </>
        )}
        {r === 'cepak' && (
          <>
            <path d="M-35-17Q-33-53 0-53Q33-53 35-17Q28-37 0-39Q-28-37-35-17Z" fill={H} />
            <path d="M-26-40q26-9 52 0" stroke={gelap(H, 1.25)} strokeWidth="1.4" fill="none" opacity=".5" />
          </>
        )}
        {r === 'jabrik' && (
          <path d="M-37-14L-36-44L-26-40L-22-60L-10-46L0-66L10-47L22-60L26-41L37-46L37-14Q22-34 0-35Q-22-34-37-14Z" fill={H} />
        )}
        {r === 'belah' && (
          <>
            <path d={`M${-dir * 36}-14Q${-dir * 36}-54 ${-dir * -4}-55Q${dir * 39}-54 ${dir * 37}-18Q${dir * 30}-36 ${dir * 8}-38Q${-dir * 10}-32 ${-dir * 36}-14Z`} fill={H} />
            <path d={`M${dir * 8}-38Q${dir * 4}-48 ${dir * 6}-54`} stroke={gelap(H, 1.3)} strokeWidth="1.6" fill="none" opacity=".6" />
          </>
        )}
        {r === 'topi' && (
          <>
            <path d="M-37-18Q-38-62 0-62Q38-62 37-18Z" fill={A} />
            <path d="M-37-18Q0-26 37-18" stroke={gelap(A, 0.8)} strokeWidth="3" fill="none" />
            <path d={`M${-dir * 32}-20Q${dir * 10}-30 ${dir * 52}-16Q${dir * 54}-8 ${dir * 40}-9Q${dir * 6}-16 ${-dir * 32}-13Z`} fill={gelap(A, 0.86)} />
            <circle cx="0" cy="-62" r="3.4" fill={gelap(A, 0.8)} />
          </>
        )}
        {r === 'kupluk' && (
          <>
            <path d="M-38-12Q-40-66 0-66Q40-66 38-12Z" fill={A} />
            <rect x="-40" y="-24" width="80" height="14" rx="6" fill={gelap(A, 0.86)} />
            <path d="M-30-34v-14M-15-38v-20M0-40v-22M15-38v-20M30-34v-14" stroke={gelap(A, 0.9)} strokeWidth="1.6" opacity=".7" />
            <circle cx="0" cy="-70" r="8" fill={look.warnaDalam ?? '#F7F0E4'} />
          </>
        )}
        {r === 'peci' && <path d="M-31-34L-29-62Q0-68 29-62L31-34Q0-39-31-34Z" fill="#2E2A28" />}
        {r === 'botak' && <ellipse cx="-12" cy="-31" rx="9" ry="4" fill="#fff" opacity=".35" />}
        {r === 'afro' && <path d="M-37-14Q-42-32-30-42Q-26-58-6-54Q8-62 22-52Q40-50 38-30Q42-20 37-14Q24-34 0-34Q-24-34-37-14Z" fill={H} />}

        {look.anting && (
          <>
            <circle cx="-35" cy="15" r="3" fill="#D9B46A" />
            <circle cx="35" cy="15" r="3" fill="#D9B46A" />
          </>
        )}
        {look.kacamata && (
          <g fill="none" stroke="#4E4A45" strokeWidth="2.6">
            <circle cx="-17" cy="-3" r="11" />
            <circle cx="17" cy="-3" r="11" />
            <path d="M-6-4H6M-28-5l-7-3M28-5l7-3" />
          </g>
        )}
      </g>
    </g>
  );
}

// ---------------------------------------------------------------- baju (di atas badan, di bawah lengan)
const BADAN = {
  her: 'M-40-202Q-37-235 0-235Q37-235 40-202L27-171Q0-168-27-171Z',
  him: 'M-42-209Q-40-235 0-235Q40-235 42-209L37-136Q0-132-37-136Z',
};
export function ExtraBaju({ look, girl, pose }: { look: ExtraLook; girl: boolean; view?: string; pose?: string }) {
  return (
    <>
      {girl && (
        <g data-extra-pinggang>
          {look.rokPanjang && pose !== 'sit' && (
            <>
              <path d="M-30-161q30 4 60 0l15 150q-45 8-90 0Z" fill={look.bawah} />
              <path d="M-14-150l-6 132M14-150l6 132" stroke={gelap(look.bawah, 0.86)} strokeWidth="1.5" opacity=".7" fill="none" />
            </>
          )}
          <path d="M-27-174l-3 14q30 4 60 0l-3-14Z" fill={look.warnaBaju} />
          <path d="M-30-161q30 4 60 0" stroke={gelap(look.bawah, 0.82)} strokeWidth="2.6" fill="none" />
        </g>
      )}
      <BajuAtas look={look} girl={girl} />
    </>
  );
}
function BajuAtas({ look, girl }: { look: ExtraLook; girl: boolean }) {
  const c = look.warnaBaju;
  const d = look.warnaDalam ?? '#F4EEE2';
  const bawah = girl ? -171 : -136;
  const garisLeher = <path d="M-14-235q14 14 28 0" stroke={gelap(c, 0.8)} strokeWidth="3" fill="none" strokeLinecap="round" />;
  const kelim = <path d={girl ? 'M-28-174q28 4 56 0' : 'M-37-140q37 5 74 0'} stroke={gelap(c, 0.84)} strokeWidth="2" fill="none" />;
  const pid = `pola-${look.id}`;
  switch (look.baju) {
    case 'kemeja':
      return (
        <g data-shirt="kemeja">
          <path d={`M0-229V${bawah + 2}`} stroke={gelap(c, 0.84)} strokeWidth="1.6" />
          {[-220, -204, -188, -172, -156].filter((y) => y < bawah - 4).map((y) => (
            <circle key={y} cx="2.5" cy={y} r="1.8" fill={gelap(c, 1.18)} stroke={gelap(c, 0.8)} strokeWidth=".6" />
          ))}
          <path d="M-1-236L-17-234L-11-219Z" fill={gelap(c, 1.1)} stroke={gelap(c, 0.8)} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M1-236L17-234L11-219Z" fill={gelap(c, 1.1)} stroke={gelap(c, 0.8)} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14-206h14v13q-7 3-14 0Z" fill="none" stroke={gelap(c, 0.84)} strokeWidth="1.3" />
          {kelim}
        </g>
      );
    case 'jaket':
      return (
        <g data-shirt="jaket">
          <path d={`M-12-234Q0-226 12-234L14 ${bawah + 1}H-14Z`} fill={d} />
          <path d={`M-12-234L-14 ${bawah + 1}M12-234L14 ${bawah + 1}`} stroke={gelap(c, 0.72)} strokeWidth="2.2" />
          <path d="M-12-234L-24-224L-18-238ZM12-234L24-224L18-238Z" fill={gelap(c, 0.9)} />
          <path d={`M-30 ${bawah - 30}l8 14M30 ${bawah - 30}l-8 14`} stroke={gelap(c, 0.78)} strokeWidth="2" strokeLinecap="round" />
          <path d={girl ? 'M-28-174q28 4 56 0' : 'M-38-142q38 6 76 0'} stroke={gelap(c, 0.78)} strokeWidth="4" fill="none" />
        </g>
      );
    case 'hoodie':
      return (
        <g data-shirt="hoodie">
          <path d="M-26-236Q0-250 26-236Q22-222 0-222Q-22-222-26-236Z" fill={gelap(c, 0.86)} />
          <path d="M-5-226v18M5-226v18" stroke={d} strokeWidth="2" strokeLinecap="round" />
          <circle cx="-5" cy="-207" r="2" fill={d} />
          <circle cx="5" cy="-207" r="2" fill={d} />
          {!girl && <path d="M-22-168h44l5 22h-54Z" fill={gelap(c, 0.92)} stroke={gelap(c, 0.82)} strokeWidth="1.4" />}
          <path d={girl ? 'M-28-176q28 5 56 0' : 'M-38-142q38 6 76 0'} stroke={gelap(c, 0.8)} strokeWidth="4" fill="none" />
        </g>
      );
    case 'garis':
      return (
        <g data-shirt="garis">
          <pattern id={pid} width="12" height="13" patternUnits="userSpaceOnUse">
            <rect width="12" height="5" fill={d} />
          </pattern>
          <path d={girl ? BADAN.her : BADAN.him} fill={`url(#${pid})`} opacity=".9" />
          {garisLeher}
          {kelim}
        </g>
      );
    case 'kardigan':
      return (
        <g data-shirt="kardigan">
          <path d={`M-13-235L0-214L13-235L15 ${bawah + 1}H-15Z`} fill={d} />
          <path d={`M-13-235L-15 ${bawah + 1}M13-235L15 ${bawah + 1}`} stroke={gelap(c, 0.78)} strokeWidth="2" />
          {[-214, -200, -186].filter((y) => y < bawah - 4).map((y) => (
            <circle key={y} cx="-17" cy={y} r="2" fill={gelap(c, 0.75)} />
          ))}
          <path d={girl ? 'M-28-174q28 4 56 0' : 'M-38-142q38 6 76 0'} stroke={gelap(c, 0.82)} strokeWidth="3.4" fill="none" />
        </g>
      );
    case 'batik':
      return (
        <g data-shirt="batik">
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 8h16" stroke={d} strokeWidth="2.4" opacity=".55" />
            <circle cx="8" cy="3" r="1.6" fill={d} opacity=".7" />
            <circle cx="8" cy="13" r="1.6" fill={d} opacity=".7" />
          </pattern>
          <path d={girl ? BADAN.her : BADAN.him} fill={`url(#${pid})`} />
          <path d="M-1-236L-15-234L-10-221Z" fill={gelap(c, 0.92)} />
          <path d="M1-236L15-234L10-221Z" fill={gelap(c, 0.92)} />
          <path d={`M0-229V${bawah + 2}`} stroke={gelap(c, 0.8)} strokeWidth="1.4" />
          {kelim}
        </g>
      );
    default:
      return (
        <g data-shirt="kaos">
          {garisLeher}
          {kelim}
        </g>
      );
  }
}
