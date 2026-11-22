// Audit bersama untuk video vertikal 1080x1920 (TikTok/Reels/Shorts). Dipakai tools/render-film.cjs --audit.
// Aturan sumber: references/creative-contract.md (pemeriksaan anatomi 1–17) dan references/arahan-pengguna.md.
// Uji alat ini dengan: node tools/test-audit.cjs (contoh yang sengaja salah harus tertangkap).
//
// Perbaikan 7 Nov 2026:
// - SVG dibaca sebagai pohon dengan transform bertingkat, jadi skala tokoh dan kotak popup dihitung
//   SETELAH zoom kamera (dulu hanya skala lokal tokoh, sehingga tokoh 2× di dalam zoom 2,5× lolos).
// - Batas durasi shot tidak lagi bisa dilonggarkan oleh Film.tsx proyek.
// - Subtitle dicek jumlah kata (≤7) dan baris (≤2) dari cues.json, serta jarak ke gelembung (≥100 px).
// - Impor dari proyek lain / arsip ditolak; dua versi rig dalam satu film diperingatkan.

const fs = require('node:fs');
const path = require('node:path');

// Kiri 110 = tepi kiri subtitle (12 Nov 2026, pengguna: "overlay yang ada harus sama seperti jarak cation dan logo, jangan
// lebih dalam, maksudnya jangan lebih ke tepian"). Kanan 920 sudah di dalam tepi kanan logo (±985) dan menjauhi tombol sosmed.
const SAFE = { left: 110, top: 220, right: 920, bottom: 1480 };
const MIN_SHOT = 39; // 1,3 dtk @30fps (creative-contract butir 15)
const MAX_SCALE = 4.6; // skala tokoh efektif maksimal (butir 3)
const MAX_WORDS = 7; // kata per kemunculan subtitle (arahan 7 Nov 2026)
const MAX_ROWS = 2;
const BUBBLE_GAP = 100; // jarak gelembung ke subtitle (arahan 7 Nov 2026)
const MAX_BUBBLE_WORDS = 4; // bubble gaya Kok Bisa? (keputusan pengguna 7 Nov 2026)
// Bubble v2 (12 Nov 2026, pengguna: "bubble bicara juga aneh karena narik jauh dari sisi kepala"): oval menempel di kepala,
// data-ekor = tepi oval → ujung ekor; ekor lebih panjang dari ini berarti bubble terlalu jauh dari pembicara.
const MAX_EKOR = 90;

// ------------------------------------------------------------------ transform 2D
const I = [1, 0, 0, 1, 0, 0];
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
function parseTransform(t) {
  let m = I;
  if (!t) return m;
  for (const [, fn, args] of t.matchAll(/(\w+)\(([^)]*)\)/g)) {
    const a = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    let n = I;
    if (fn === 'translate') n = [1, 0, 0, 1, a[0] || 0, a[1] || 0];
    else if (fn === 'scale') n = [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0];
    else if (fn === 'rotate') {
      const r = ((a[0] || 0) * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
      n = [c, s, -s, c, 0, 0];
      if (a.length === 3) n = mul(mul([1, 0, 0, 1, a[1], a[2]], n), [1, 0, 0, 1, -a[1], -a[2]]);
    } else if (fn === 'matrix') n = a.slice(0, 6);
    else if (fn === 'skewX') n = [1, 0, Math.tan((a[0] * Math.PI) / 180), 1, 0, 0];
    else if (fn === 'skewY') n = [1, Math.tan((a[0] * Math.PI) / 180), 0, 1, 0, 0];
    m = mul(m, n);
  }
  return m;
}
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const scaleOf = (m) => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
const attr = (tag, name) => {
  const x = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return x ? x[1] : undefined;
};
function boxOnScreen(m, l, t, r, b) {
  const pts = [apply(m, l, t), apply(m, r, t), apply(m, l, b), apply(m, r, b)];
  return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))].map(Math.round);
}

// Jelajahi tag SVG secara berurutan dengan tumpukan transform dan tumpukan tokoh.
function walk(svg, visit) {
  const stack = [{ m: I, actor: null }];
  for (const x of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [tag, closing, , , self] = x;
    if (closing) { if (stack.length > 1) stack.pop(); continue; }
    const top = stack[stack.length - 1];
    const own = mul(top.m, parseTransform(attr(tag, 'transform')));
    const actor = attr(tag, 'data-actor') || top.actor;
    visit({ tag, parent: top.m, m: own, actor, next: svg.slice(x.index + tag.length, x.index + tag.length + 400) });
    if (!self) stack.push({ m: own, actor });
  }
}

// ------------------------------------------------------------------ pemeriksaan per frame
// Kotak wajah di koordinat lokal grup data-face rig (kepala berpusat di (0,-279), lebar ±62, dahi -318 (di bawah rambut), dagu -210).
const FACE_BOX = [-62, -318, 62, -210];
const FACE_COVER = 0.12; // gelembung boleh menyentuh tepi kepala, tapi tidak menutupi >12% kotak wajah

function checkFrameSvg(svg, report) {
  const words = [], bubbles = [], faces = [];
  walk(svg, ({ tag, parent, m, actor, next }) => {
    if (attr(tag, 'data-face')) faces.push([actor || attr(tag, 'data-face'), boxOnScreen(m, ...FACE_BOX)]);
    if (attr(tag, 'data-actor')) {
      const s = scaleOf(m);
      if (s > MAX_SCALE + 1e-6) report(`${attr(tag, 'data-actor')}: skala efektif ${s.toFixed(2)} > ${MAX_SCALE} (ganti framing, jangan perbesar)`);
    }
    const warn = attr(tag, 'data-anatomy-warn');
    if (warn) report(`${actor || '?'}: ${warn}`);
    const box = attr(tag, 'data-box');
    if (box) {
      const [l, t, r, b] = box.split(',').map(Number);
      const [L, T, R, B] = boxOnScreen(parent, l, t, r, b);
      if (L < SAFE.left || T < SAFE.top || R > SAFE.right || B > SAFE.bottom) report(`popup keluar safe zone (${L},${T},${R},${B})`);
      if (attr(tag, 'data-fx') === 'gelembung') bubbles.push([L, T, R, B]);
      const ekor = attr(tag, 'data-ekor');
      if (ekor) {
        const [x1, y1, x2, y2] = boxOnScreen(parent, ...ekor.split(',').map(Number));
        const len = Math.round(Math.hypot(x2 - x1, y2 - y1));
        if (len > MAX_EKOR) report(`ekor gelembung ${len} px > ${MAX_EKOR} (tempel bubble di kepala pembicara: letakBubble di shared/film/v2/Bubble)`);
      }
      const nw = Number(attr(tag, 'data-words'));
      if (nw > MAX_BUBBLE_WORDS) report(`bubble ${nw} kata > ${MAX_BUBBLE_WORDS} (bubble gaya Kok Bisa?: seruan pendek)`);
    }
    if (attr(tag, 'data-word') === 'true') {
      const rect = /^\s*<rect\b([^>]*)>/.exec(next);
      if (rect) {
        const g = (n) => Number(attr(rect[0], n));
        words.push(boxOnScreen(m, g('x'), g('y'), g('x') + g('width'), g('y') + g('height')));
      }
    }
  });
  if (words.length) {
    const sub = [Math.min(...words.map((w) => w[0])), Math.min(...words.map((w) => w[1])), Math.max(...words.map((w) => w[2])), Math.max(...words.map((w) => w[3]))];
    if (sub[0] < SAFE.left - 12) report('subtitle keluar: kiri'); // subtitle masuk sambil bergeser 12 px dari kiri (Captions)
    if (sub[1] < SAFE.top) report('subtitle keluar: atas');
    if (sub[2] > SAFE.right) report('subtitle keluar: kanan');
    if (sub[3] > SAFE.bottom) report('subtitle keluar: bawah');
    for (const b of bubbles) {
      const overlapX = b[0] < sub[2] && b[2] > sub[0];
      const gap = Math.max(b[1] - sub[3], sub[1] - b[3]);
      if (overlapX && gap < BUBBLE_GAP) report(`gelembung terlalu dekat subtitle: ${gap} px < ${BUBBLE_GAP}`);
    }
  }
  // Gelembung tidak boleh menutupi wajah (checklist F2; shared/film/v1/Bubble: "di samping kepala, bukan di atas wajah").
  for (const b of bubbles)
    for (const [who, f] of faces) {
      const w = Math.min(b[2], f[2]) - Math.max(b[0], f[0]), h = Math.min(b[3], f[3]) - Math.max(b[1], f[1]);
      const area = (f[2] - f[0]) * (f[3] - f[1]);
      if (w > 0 && h > 0 && area > 0 && (w * h) / area > FACE_COVER)
        report(`gelembung menutupi wajah ${who}: ${Math.round((100 * w * h) / area)}% kotak wajah (geser ke samping/atas kepala)`);
    }
}

function checkShots(shots, end, projectMin, add) {
  if (projectMin !== undefined && projectMin < MIN_SHOT) add(`MIN_SHOT proyek ${projectMin} di bawah batas ${MIN_SHOT} frame; batas tetap ${MIN_SHOT}`, 0);
  shots.forEach(([a, sh], i) => {
    const b = shots[i + 1]?.[0] ?? end;
    if (b - a < MIN_SHOT) add(`shot ${sh} terlalu pendek: ${((b - a) / 30).toFixed(2)} dtk`, a);
  });
}

function checkCues(cues, add) {
  for (const c of cues) {
    const n = c.rows.join(' ').split(/\s+/).filter(Boolean).length;
    if (n > MAX_WORDS) add(`subtitle ${n} kata > ${MAX_WORDS}: "${c.rows.join(' / ')}"`, c.start);
    if (c.rows.length > MAX_ROWS) add(`subtitle ${c.rows.length} baris > ${MAX_ROWS}: "${c.rows.join(' / ')}"`, c.start);
  }
}

// ------------------------------------------------------------------ pemeriksaan struktur proyek
// inputs: path relatif root workspace dari metafile esbuild.
function checkInputs(inputs, projRel, error, warn) {
  const rigs = new Set();
  for (const p of inputs) {
    if (p.startsWith('projects/') && !p.startsWith(projRel + '/')) error(`mengimpor dari proyek lain: ${p} (pindahkan ke shared/ lalu impor dari sana)`);
    if (p.startsWith('arsip/')) error(`mengimpor dari arsip: ${p}`);
    const r = /^shared\/characters\/rig\/(v\d+)\//.exec(p);
    if (r) rigs.add(r[1]);
  }
  if (rigs.size > 1) warn(`satu film menarik ${rigs.size} versi rig (${[...rigs].sort().join(', ')}). Aset baru sebaiknya mengimpor palet dari shared/core/v1, bukan dari Character.tsx`);
}

const ALLOWED_SRC = /^(Film\.tsx|Thumb[\w-]*\.tsx|Storyboard[\w-]*\.tsx(\.txt)?|[\w.-]+\.json|[\w.-]+\.txt)$/;
function checkProjectFiles(root, warn) {
  const src = path.join(root, 'src');
  if (fs.existsSync(src))
    for (const f of fs.readdirSync(src))
      if (!f.startsWith('.') && !ALLOWED_SRC.test(f)) warn(`src/${f} ada di folder proyek. Kalau berguna untuk konten lain, pindahkan ke shared/ (komponen) atau tools/ (alat)`);
  const scripts = path.join(root, 'scripts');
  if (fs.existsSync(scripts) && fs.readdirSync(scripts).some((f) => !f.startsWith('.')))
    warn('folder scripts/ di proyek: alat produksi tempatnya tools/, bukan folder proyek');
}

// Kompatibilitas skrip lama (syarat-protes-struk-kopi/scripts/render.cjs): hanya cek kotak popup.
function checkBoxes(svg, report) {
  walkBoxes(svg, ([L, T, R, B]) => {
    if (L < SAFE.left || T < SAFE.top || R > SAFE.right || B > SAFE.bottom) report(`popup keluar safe zone (${L},${T},${R},${B})`);
  });
}

// Setiap data-box dalam koordinat layar (setelah transform induk, seperti di checkFrameSvg). Dipakai render-thumb.cjs (8 Nov 2026).
function walkBoxes(svg, fn) {
  walk(svg, ({ tag, parent }) => {
    const box = attr(tag, 'data-box');
    if (box) fn(boxOnScreen(parent, ...box.split(',').map(Number)), tag);
  });
}

// Pembuka (7 Nov 2026, arahan "frame pertama = hook"): skala efektif tokoh terbesar dan ada/tidaknya kata subtitle.
function openingInfo(svg) {
  let maxScale = 0, words = 0;
  walk(svg, ({ tag, m }) => {
    if (attr(tag, 'data-actor')) maxScale = Math.max(maxScale, scaleOf(m));
    if (attr(tag, 'data-word') === 'true') words++;
  });
  return { maxScale, words };
}
const GREETING = /^\s*(selamat (pagi|siang|sore|malam)|halo|hai|hi|assalamu|apa kabar|oke,? (jadi|guys)|guys)/i;

module.exports = { openingInfo, GREETING, SAFE, MIN_SHOT, MAX_SCALE, MAX_WORDS, MAX_ROWS, BUBBLE_GAP, parseTransform, checkFrameSvg, checkBoxes, walkBoxes, checkShots, checkCues, checkInputs, checkProjectFiles };
