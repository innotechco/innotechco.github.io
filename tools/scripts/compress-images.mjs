/* Re-encodes the bundled pictures to something a bad line can actually fetch.
 *
 * The pictures in src/ were exported straight from the design tool and never
 * resized: the ecosystem map was 5060px wide and 725KB, the history curve
 * 5000px, several heroes 3200px. Nothing on the site draws any of them above
 * about 1900px, so the extra pixels were only ever cost.
 *
 * That cost turned into a failure rather than a delay on a filtered
 * connection. Measured against the live site: responses over roughly 59KB stop
 * mid-transfer and never finish, and a connection that has already carried a
 * burst is throttled to a crawl. So an 725KB picture is not a slow picture, it
 * is a picture that never arrives - and the boot curtain waits on the ones in
 * the first screenful, so it took the whole page down with it.
 *
 * Run with: node tools/scripts/compress-images.mjs
 * Add --check to fail instead of rewriting, which is what CI wants.
 */
import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOTS = ["src", "public"];

/* Wider than any slot that draws them, with room for a 2x screen on the
   narrower ones, and far below the 3200-5060px the sources happened to be. */
const MAX_WIDTH = 1920;

/* Re-encoding something already lossy loses a little more, so this is not as
   low as it would be for a first encode. At 72 the photographs hold up and the
   flat areas in the generated artwork do not band. */
const QUALITY = 72;

/* Leaving the tiny ones alone: they already arrive, and a second lossy pass
   would cost quality for nothing. */
const FLOOR_BYTES = 60 * 1024;

const checkOnly = process.argv.includes("--check");

async function* walk(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) yield full;
  }
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

const oversized = [];
let savedBytes = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const before = (await stat(file)).size;
    if (before < FLOOR_BYTES) continue;

    const image = sharp(await readFile(file));
    const {width} = await image.metadata();

    const resized = width > MAX_WIDTH ? image.resize({width: MAX_WIDTH}) : image;
    const output = await resized.webp({quality: QUALITY, effort: 6}).toBuffer();

    /* A picture that is already smaller than what this would produce is left
       exactly as it is - rewriting it would only throw away quality. */
    if (output.length >= before) continue;

    if (checkOnly) {
      oversized.push(`  ${file} - ${kb(before)}, would be ${kb(output.length)}`);
      continue;
    }

    await writeFile(file, output);
    savedBytes += before - output.length;
    console.log(
      `${file}\n  ${kb(before)} -> ${kb(output.length)}` +
        `${width > MAX_WIDTH ? ` (${width}px -> ${MAX_WIDTH}px)` : ""}`,
    );
  }
}

if (checkOnly && oversized.length) {
  console.error(
    `These pictures are larger than they need to be:\n${oversized.join("\n")}\n\n` +
      "Run: node tools/scripts/compress-images.mjs",
  );
  process.exit(1);
}

if (!checkOnly) console.log(`\nSaved ${kb(savedBytes)} in total.`);
