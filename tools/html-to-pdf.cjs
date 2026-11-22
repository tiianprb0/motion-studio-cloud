// HTML → PDF (A4) dengan Chrome toolchain (7 Nov 2026; dipakai untuk buku gaya Less.).
// Font Lato/Playfair disuntikkan dari shared/assets/font-data/v1.ts supaya sama dengan video dan tidak butuh internet.
// Pakai: node tools/html-to-pdf.cjs <file.html> <out.pdf>
const fs = require('node:fs');
const path = require('node:path');
const rt = require('./runtime.cjs');
const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Pakai: node tools/html-to-pdf.cjs <file.html> <out.pdf>'); process.exit(1); }
const fontTs = fs.readFileSync(path.join(rt.ROOT, 'shared/assets/font-data/v1.ts'), 'utf8');
const fonts = /SVG_FONTS\s*=\s*'([^']*)'/.exec(fontTs)[1];
(async () => {
  const { chromium } = require(rt.playwrightPath());
  const b = await chromium.launch({ executablePath: rt.chrome(), headless: true });
  try {
    const p = await b.newPage();
    await p.goto('file://' + path.resolve(src), { waitUntil: 'load' });
    await p.addStyleTag({ content: fonts });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log('pdf -> ' + out);
  } finally { await b.close(); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
