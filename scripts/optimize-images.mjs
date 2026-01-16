import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const workspaceRoot = process.cwd();
const imagesRoot = path.join(workspaceRoot, 'assets', 'images');

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png']);

function formatBytes(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTS.has(ext)) results.push(fullPath);
    }
  }
  return results;
}

async function optimizeOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const beforeStat = await fs.stat(filePath);

  // On Windows, sharp can keep the input file handle open; overwriting the same
  // file may fail. Read into memory to avoid file locking issues.
  const inputBuffer = await fs.readFile(filePath);
  const pipeline = sharp(inputBuffer, { failOn: 'none' }).rotate();
  const metadata = await pipeline.metadata();

  // Resize to a sensible max width for web. Avoid enlarging small images.
  // Most e-commerce/product images are fine at <= 1400px.
  const resized = pipeline.resize({
    width: 1400,
    withoutEnlargement: true,
  });

  let output;
  if (ext === '.png') {
    // Keep PNGs as PNG (mostly logos/icons). Use lossless compression.
    output = await resized.png({ compressionLevel: 9, palette: true }).toBuffer();
  } else {
    // JPEG: strip metadata by not calling withMetadata.
    // Use mozjpeg for better compression when available.
    output = await resized.jpeg({ quality: 75, mozjpeg: true, progressive: true }).toBuffer();
  }

  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, output);
  await fs.rename(tmpPath, filePath);
  const afterStat = await fs.stat(filePath);

  const rel = path.relative(workspaceRoot, filePath).replaceAll('\\', '/');
  const dim = metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : 'unknown';

  return {
    file: rel,
    dim,
    before: beforeStat.size,
    after: afterStat.size,
    saved: beforeStat.size - afterStat.size,
  };
}

async function main() {
  const files = await walk(imagesRoot);
  if (files.length === 0) {
    console.log('No images found under assets/images');
    return;
  }

  console.log(`Found ${files.length} images. Optimizing...`);
  const results = [];
  for (const file of files) {
    results.push(await optimizeOne(file));
  }

  const totalBefore = results.reduce((sum, r) => sum + r.before, 0);
  const totalAfter = results.reduce((sum, r) => sum + r.after, 0);
  const totalSaved = totalBefore - totalAfter;

  console.log('');
  for (const r of results.sort((a, b) => b.saved - a.saved)) {
    const pct = r.before ? ((r.saved / r.before) * 100).toFixed(1) : '0.0';
    console.log(`${r.file} (${r.dim}): ${formatBytes(r.before)} -> ${formatBytes(r.after)} (saved ${formatBytes(r.saved)} / ${pct}%)`);
  }

  console.log('');
  console.log(`TOTAL: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (saved ${formatBytes(totalSaved)})`);
}

await main();
