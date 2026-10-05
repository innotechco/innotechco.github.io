import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {fileURLToPath, URL} from "node:url";
import {brotliCompressSync, gzipSync} from "node:zlib";
import {Buffer} from "node:buffer";

/* Nothing here is about shaving kilobytes for their own sake.
 *
 * Measured against the live site from a filtered connection: every response
 * under roughly 50KB arrived complete and quickly - the HTML in 0.37s, a 40KB
 * image in 0.85s, the small route chunks immediately. The entry bundle, 103KB
 * gzipped, never arrived at all. It announced Content-Length: 104303, sent
 * about 59KB, and then the connection went silent - still 59KB after two
 * minutes, on two different Cloudflare addresses, with and without gzip. A
 * 285KB file from another Cloudflare zone came down in 1.97s on the same
 * connection, so this is the path to this origin being cut mid-transfer, not
 * congestion and not the server.
 *
 * The consequence was total: React lives in the entry chunk, so until that one
 * file completes nothing renders. The boot curtain sat there, removed itself
 * after its ten second fallback, and left a blank page. "The site doesn't come
 * up" was one file being a little too big to get through.
 *
 * So the build's job is now to keep every render-blocking file under that
 * ceiling. The split below is what does it, and CHUNK_CEILING_BYTES is what
 * stops it quietly regressing - a chunk that grows past the ceiling fails the
 * build here rather than becoming a blank page for somebody on a bad line.
 *
 * A deliberate margin under the ~59KB where transfers were observed to die.
 * The cut-off was not exact - it landed between 58.9KB and 61.6KB across runs -
 * so the ceiling sits far enough below the bottom of that range that a chunk
 * which just scrapes past it still has room.
 */
const CHUNK_CEILING_BYTES = 48 * 1024;

/* Measured on what the browser is actually sent, which is brotli: the live
   site answers Accept-Encoding: br with Content-Encoding: br. The stall was on
   compressed bytes on the wire - it died at the same ~59KB whether the body was
   gzip or brotli - so the compressed size is the number that matters, and the
   uncompressed one is irrelevant to it.

   A client too old for brotli gets gzip, which for a chunk at this ceiling
   lands around 55KB. That is still under the lowest stall observed (58.9KB),
   but with little to spare - which is the honest cost of not having a separate
   budget per encoding, and is why the ceiling is not set any higher. */

function chunkFor(id) {
  const path = id.split("\\").join("/");

  if (path.includes("/node_modules/")) {
    /* react-dom is the single biggest dependency and the one that has to be
       there before anything renders, so it gets a file of its own rather than
       being bundled with the app code that imports it. scheduler rides along
       because react-dom is its only consumer. */
    if (/\/node_modules\/(react-dom|scheduler)\//.test(path)) return "vendor-react-dom";
    if (/\/node_modules\/react\//.test(path)) return "vendor-react";
    if (/\/node_modules\/(react-router|react-router-dom|@remix-run)\//.test(path)) {
      return "vendor-router";
    }
    return "vendor";
  }

  /* The bundled page copy, one chunk per language.
   *
   * This was the second file that could not arrive: 105KB gzipped, because the
   * copy for all three languages is pulled in by an eager import.meta.glob and
   * a glob cannot know at build time which language a visitor will pick. So all
   * three were in one file, and that file was nearly as unreachable as the
   * entry chunk.
   *
   * Splitting by language does not stop all three being fetched - they are
   * static imports, and only an async refactor of localizedModule() would fix
   * that - but it turns one impossible request into three that each complete.
   * Wasteful and working beats economical and blank.
   */
  const locale = path.match(/\/src\/content\/(en|ar|tr)\//);
  if (locale) return `app-content-${locale[1]}`;

  /* The app's own always-loaded code, split along the lines it is already
     organised by. Each of these is on every page, so none of it can be made
     lazy - but it does not have to travel as one file. */
  if (path.includes("/src/shared/components/layout/")) return "app-layout";
  if (path.includes("/src/shared/components/modals/")) return "app-modals";
  if (path.includes("/src/shared/components/ui/")) return "app-ui";
  if (path.includes("/src/shared/i18n/")) return "app-i18n";
  if (path.includes("/src/content/")) return "app-content";
  if (path.includes("/src/integrations/")) return "app-integrations";

  return undefined;
}

/* The guard. Without it the split above is a one-off tidy-up that survives
   until the next dependency lands in the wrong chunk. */
function enforceTransferCeiling() {
  return {
    name: "enforce-transfer-ceiling",
    apply: "build",
    generateBundle(_options, bundle) {
      const oversized = [];

      for (const [fileName, output] of Object.entries(bundle)) {
        if (!/\.(js|css)$/.test(fileName)) continue;
        const source = output.type === "chunk" ? output.code : output.source;
        if (!source) continue;

        const bytes = Buffer.from(source);
        const brotli = brotliCompressSync(bytes).length;

        if (brotli > CHUNK_CEILING_BYTES) {
          const gzipped = gzipSync(bytes, {level: 9}).length;
          oversized.push(
            `  ${fileName} - ${(brotli / 1024).toFixed(1)}KB brotli` +
              ` (${(gzipped / 1024).toFixed(1)}KB gzip)`,
          );
        }
      }

      if (oversized.length) {
        this.error(
          `These files are over the ${CHUNK_CEILING_BYTES / 1024}KB transfer ceiling:\n` +
            `${oversized.join("\n")}\n\n` +
            "A render-blocking file this size was measured not arriving at all on a " +
            "filtered connection, which leaves the site on a blank page. Split it in " +
            "chunkFor() in vite.config.js, or make it lazy.",
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");

  return {
    base: env.VITE_BASE_PATH || "/",
    resolve: {
      alias: {
        "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
        "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
        "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
        "@content": fileURLToPath(new URL("./src/content", import.meta.url)),
        "@integrations": fileURLToPath(new URL("./src/integrations", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: chunkFor,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      enforceTransferCeiling(),
    ],
  };
});
