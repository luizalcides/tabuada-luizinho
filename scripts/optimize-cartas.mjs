import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const DIR = "public/cartas";
const MAX_WIDTH = 900;
const QUALITY = 82;

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".png"));
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inPath = join(DIR, file);
    const outPath = join(DIR, file.replace(/\.png$/, ".webp"));
    const before = (await stat(inPath)).size;
    totalBefore += before;

    await sharp(inPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath);

    const after = (await stat(outPath)).size;
    totalAfter += after;
    await unlink(inPath);

    const kbBefore = Math.round(before / 1024);
    const kbAfter = Math.round(after / 1024);
    const pct = Math.round((1 - after / before) * 100);
    console.log(
      `${file.padEnd(22)} ${String(kbBefore).padStart(5)} KB → ${String(kbAfter).padStart(4)} KB  (-${pct}%)`
    );
  }

  const mbBefore = (totalBefore / 1024 / 1024).toFixed(1);
  const mbAfter = (totalAfter / 1024 / 1024).toFixed(1);
  const pct = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(
    `\nTotal: ${mbBefore} MB → ${mbAfter} MB  (-${pct}%)  |  ${files.length} arquivos`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
