// One-off: recompress the images that are actually SERVED from public/ to
// visitors (hero banners + the quienes-somos group photo). Everything else in
// public/images (projects/, people/) is dead weight uploaded to Sanity and is
// not fetched at runtime, so it's left untouched.
//
// Resizes to a max width and recompresses as progressive mozjpeg in place.
// Originals are in git, so this is fully reversible with `git checkout`.
//
//   node scripts/optimize-images.mjs

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';

const MAX_WIDTH = 1920;   // full-bleed hero banners never need more
const QUALITY = 80;

// Files served from public/ that we want optimized.
const TARGETS = [
  { dir: 'public/images/banners', recurse: false },
  { file: 'public/images/groupal/recorridos_de_ciudad.jpeg' },
];

const isJpegLike = (f) => /\.(jpe?g)$/i.test(f);

async function collect() {
  const out = [];
  for (const t of TARGETS) {
    if (t.file) {
      out.push(t.file);
      continue;
    }
    for (const name of await readdir(t.dir)) {
      const p = join(t.dir, name);
      if ((await stat(p)).isFile() && isJpegLike(name)) out.push(p);
    }
  }
  return out;
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function optimize(file) {
  const before = (await stat(file)).size;
  const meta = await sharp(file).metadata();

  // Recompress to a temp buffer (can't read+write the same path in one stream).
  const buf = await sharp(file)
    .rotate() // respect EXIF orientation, then strip it
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  // Normalise extension to lowercase .jpg (handles the .JPG case issue).
  const lowerExt = extname(file).toLowerCase() === '.jpeg' ? '.jpeg' : '.jpg';
  const finalPath = join(dirname(file), basename(file, extname(file)) + lowerExt);
  const tmp = finalPath + '.tmp';

  const { writeFile } = await import('node:fs/promises');
  await writeFile(tmp, buf);
  if (finalPath !== file) await unlink(file); // remove old-cased original
  await rename(tmp, finalPath);

  const after = buf.length;
  const pct = (100 * (1 - after / before)).toFixed(0);
  const renamed = finalPath !== file ? `  (→ ${basename(finalPath)})` : '';
  console.log(
    `${basename(file).padEnd(34)} ${String(meta.width).padStart(5)}px  ` +
    `${fmt(before).padStart(9)} → ${fmt(after).padStart(8)}  (-${pct}%)${renamed}`
  );
  return { before, after };
}

const files = await collect();
let totalBefore = 0, totalAfter = 0;
for (const f of files) {
  const { before, after } = await optimize(f);
  totalBefore += before;
  totalAfter += after;
}
console.log('─'.repeat(70));
console.log(
  `TOTAL ${files.length} archivos: ${fmt(totalBefore)} → ${fmt(totalAfter)} ` +
  `(-${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`
);
