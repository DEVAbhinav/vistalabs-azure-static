import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const portfolioDir = path.resolve(__dirname, '../public/portfolio');

const TARGET_WIDTH = 1600;
const WEBP_QUALITY = 78;
const PNG_QUALITY = 80;

const formatBytes = bytes => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const optimizeImage = async fileName => {
  const inputPath = path.join(portfolioDir, fileName);
  const base = sharp(inputPath);
  const meta = await base.metadata();
  const working = sharp(inputPath);

  if (meta.width && meta.width > TARGET_WIDTH) {
    working.resize({ width: TARGET_WIDTH });
  }

  const webpPath = inputPath.replace(/\.[^.]+$/, '.webp');
  await working
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(webpPath);

  const optimizedBuffer = await working
    .clone()
    .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true, progressive: true })
    .toBuffer();

  const originalStat = await stat(inputPath);
  if (optimizedBuffer.length < originalStat.size) {
    await writeFile(inputPath, optimizedBuffer);
  }

  const newStat = await stat(inputPath);
  return {
    file: fileName,
    original: originalStat.size,
    optimized: newStat.size,
    webp: (await stat(webpPath)).size
  };
};

const run = async () => {
  const entries = await readdir(portfolioDir, { withFileTypes: true });
  const targets = entries.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.png'));

  if (!targets.length) {
    console.log('No PNG images found in public/portfolio');
    return;
  }

  const results = [];
  for (const entry of targets) {
    const report = await optimizeImage(entry.name);
    results.push(report);
  }

  console.table(
    results.map(({ file, original, optimized, webp }) => ({
      file,
      original: formatBytes(original),
      optimized: formatBytes(optimized),
      webp: formatBytes(webp)
    }))
  );
};

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
