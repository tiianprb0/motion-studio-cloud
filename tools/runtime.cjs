// Resolusi lokasi toolchain untuk skrip produksi Motion Studio.
//
// Sebelumnya setiap skrip menanam path absolut ke mesin ini — termasuk ke
// ~/.cache/ dan ke folder bernama judul percakapan. Keduanya lokasi yang
// wajar dibersihkan sewaktu-waktu, dan Node sendiri tidak terpasang di
// sistem. Modul ini memusatkan resolusinya dan memberi pesan jelas saat
// sebuah komponen hilang, bukan error path yang membingungkan.
//
// Urutan pencarian: variabel lingkungan > .toolchain/ di workspace >
// lokasi sistem yang umum.

const fs = require('node:fs');
const path = require('node:path');

function workspaceRoot() {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'MULAI-DI-SINI.md'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(__dirname, '..');
}

const ROOT = workspaceRoot();
const TOOLCHAIN = path.join(ROOT, '.toolchain');

function resolve(label, envVar, candidates, hint) {
  const fromEnv = process.env[envVar];
  for (const candidate of fromEnv ? [fromEnv, ...candidates] : candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    `${label} tidak ditemukan.\n` +
      `  Dicari di: ${candidates.join('\n             ')}\n` +
      `  Setel ${envVar}=<path> untuk menunjuk lokasi lain.\n` +
      `  ${hint}`
  );
}

const ffmpeg = () =>
  resolve('FFmpeg', 'MOTION_STUDIO_FFMPEG', [
    path.join(TOOLCHAIN, 'bin/ffmpeg'),
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
  ], 'Pasang lewat: brew install ffmpeg');

const playwrightPath = () =>
  resolve('Playwright', 'MOTION_STUDIO_PLAYWRIGHT', [
    path.join(TOOLCHAIN, 'node/node_modules/playwright'),
    path.join(ROOT, 'tools/node_modules/playwright'),
  ], 'Pasang ulang: cd tools && npm install (versi dipin di tools/package.json).');

const chrome = () =>
  resolve('Google Chrome', 'MOTION_STUDIO_CHROME', [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ], 'Pasang Google Chrome, atau tunjuk Chromium lain.');

const node = () =>
  resolve('Node.js', 'MOTION_STUDIO_NODE', [
    path.join(TOOLCHAIN, 'node/bin/node'),
    '/opt/homebrew/bin/node',
    '/usr/local/bin/node',
  ], 'Pasang lewat: brew install node');

// node_modules bersama (react, react-dom, esbuild) untuk proyek yang membundel komponen shared/.
// Tempatnya tools/node_modules (versi dipin di tools/package.json). Folder arsip/ TIDAK boleh
// jadi sumber: arsip harus bisa dibersihkan tanpa mematikan alat produksi (perbaikan 7 Nov 2026).
const nodeModules = () =>
  resolve('node_modules (react, esbuild)', 'MOTION_STUDIO_NODE_MODULES', [
    path.join(ROOT, 'tools/node_modules'),
  ], 'Pasang ulang: cd tools && npm install (versi dipin di tools/package.json).');

module.exports = { ROOT, TOOLCHAIN, ffmpeg, playwrightPath, chrome, node, nodeModules };
