// Masker kain/medis di wajah tokoh rig v2/v3 (v1, 18 Nov 2026). Dibuat untuk "Kebakaran Hutan Papua" v1 (warga kota
// berasap memakai masker). Rig tidak punya slot aksesori wajah, jadi masker digambar SESUDAH tokoh di koordinat kepala:
//   pusat kepala = (x kaki + dir·2·s untuk tampak three, y kaki − 279·s), r = 66·s (sama dengan Tanduk/Bubble).
// Hanya untuk tampak `three`/`front` (bukan `back`). Tokoh yang kepalanya bergerak besar (lean/head) perlu dicek di stills.
// Pakai: {tokoh}<Masker x={kakiX} y={kakiY} s={s} dir={dir} warna="#DDE7EA" />
import React from 'react';

export function Masker({ x, y, s, dir = 1, view = 'three', warna = '#DCE6EA', tali = '#C3CED3', n95 = false }: { x: number; y: number; s: number; dir?: number; view?: 'three' | 'front'; warna?: string; tali?: string; n95?: boolean }) {
  const r = 66 * s;
  const cx = x + (view === 'three' ? dir * 2 * s : 0) + (view === 'three' ? dir * r * 0.1 : 0);
  const cy = y - 279 * s + r * 0.36;
  const w = r * 1.02,
    h = r * 0.62;
  const badan = n95
    ? `M${cx - w / 2} ${cy - h * 0.3}Q${cx} ${cy - h * 0.75} ${cx + w / 2} ${cy - h * 0.3}Q${cx + w * 0.45} ${cy + h * 0.55} ${cx} ${cy + h * 0.62}Q${cx - w * 0.45} ${cy + h * 0.55} ${cx - w / 2} ${cy - h * 0.3}Z`
    : `M${cx - w / 2} ${cy - h * 0.38}Q${cx} ${cy - h * 0.62} ${cx + w / 2} ${cy - h * 0.38}L${cx + w * 0.47} ${cy + h * 0.32}Q${cx} ${cy + h * 0.66} ${cx - w * 0.47} ${cy + h * 0.32}Z`;
  return (
    <g data-detail="masker">
      <path d={`M${cx - w / 2} ${cy - h * 0.3}L${cx - r * 0.86} ${cy - h * 0.5}M${cx - w / 2} ${cy + h * 0.25}L${cx - r * 0.84} ${cy - h * 0.1}`} stroke={tali} strokeWidth={Math.max(1, 2.4 * s)} />
      <path d={`M${cx + w / 2} ${cy - h * 0.3}L${cx + r * 0.86} ${cy - h * 0.5}M${cx + w / 2} ${cy + h * 0.25}L${cx + r * 0.84} ${cy - h * 0.1}`} stroke={tali} strokeWidth={Math.max(1, 2.4 * s)} />
      <path d={badan} fill={warna} />
      {!n95 && [0.0, 0.22, 0.44].map((k, i) => <path key={i} d={`M${cx - w * 0.46} ${cy - h * 0.12 + k * h * 0.7}Q${cx} ${cy - h * 0.2 + k * h * 0.7} ${cx + w * 0.46} ${cy - h * 0.12 + k * h * 0.7}`} stroke="#B8C5CA" strokeWidth={Math.max(0.8, 2 * s)} fill="none" />)}
      <path d={`M${cx - w * 0.3} ${cy - h * 0.48}Q${cx} ${cy - h * 0.58} ${cx + w * 0.3} ${cy - h * 0.48}`} stroke="#A7B4B9" strokeWidth={Math.max(0.8, 2.4 * s)} fill="none" />
    </g>
  );
}
