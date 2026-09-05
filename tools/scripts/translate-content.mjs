import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src/content");
const sourceRoot = path.join(root, "en");
const targets = ["ar", "tr"];
const skipKeys = new Set([
  "id", "slug", "to", "href", "url", "image", "imageKey", "icon", "logo",
  "date", "type", "actionId", "partnerSlug", "route", "email", "phone",
]);
const protectedValue = /^(?:https?:|mailto:|tel:|\/|#)|\.(?:webp|png|jpe?g|svg)$/i;
const delimiter = "\n<<<INNOTECH_TRANSLATION_BREAK>>>\n";

async function walk(directory) {
  const entries = await fs.readdir(directory, {withFileTypes: true});
  return (await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }))).flat();
}

function collect(value, key, output) {
  if (typeof value === "string") {
    if (!skipKeys.has(key) && !protectedValue.test(value) && /[A-Za-z]/.test(value)) {
      output.push(value);
    }
    return;
  }
  if (Array.isArray(value)) return value.forEach((item) => collect(item, key, output));
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([childKey, child]) => collect(child, childKey, output));
  }
}

function replace(value, key, translations) {
  if (typeof value === "string") return translations.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => replace(item, key, translations));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [
      childKey,
      replace(child, childKey, translations),
    ]));
  }
  return value;
}

async function translateBatch(values, language) {
  const joined = values.join(delimiter);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  Object.entries({client: "gtx", sl: "en", tl: language, dt: "t", q: joined})
    .forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation failed (${response.status})`);
  const payload = await response.json();
  const translated = payload[0].map((part) => part[0]).join("");
  const pieces = translated.split(/\s*<<<\s*INNOTECH_TRANSLATION_BREAK\s*>>>\s*/i);
  if (pieces.length !== values.length) {
    throw new Error(`Translation boundary mismatch: ${values.length} != ${pieces.length}`);
  }
  return pieces.map((piece) => piece.trim());
}

async function translateValues(values, language) {
  const unique = [...new Set(values)];
  const translations = new Map();
  let batch = [];
  let size = 0;

  async function flush() {
    if (!batch.length) return;
    const translated = await translateBatch(batch, language);
    batch.forEach((source, index) => translations.set(source, translated[index]));
    batch = [];
    size = 0;
  }

  for (const value of unique) {
    if (batch.length && size + value.length + delimiter.length > 3600) await flush();
    batch.push(value);
    size += value.length + delimiter.length;
  }
  await flush();
  return translations;
}

const files = (await walk(sourceRoot)).filter((file) => file.endsWith(".json"));
const documents = await Promise.all(files.map(async (file) => ({
  file,
  data: JSON.parse(await fs.readFile(file, "utf8")),
})));

for (const language of targets) {
  const strings = [];
  documents.forEach(({data}) => collect(data, "", strings));
  const translations = await translateValues(strings, language);

  for (const {file, data} of documents) {
    const destination = path.join(root, language, path.relative(sourceRoot, file));
    await fs.mkdir(path.dirname(destination), {recursive: true});
    await fs.writeFile(destination, `${JSON.stringify(replace(data, "", translations), null, 2)}\n`);
  }
  console.log(`${language}: translated ${translations.size} unique strings across ${documents.length} files`);
}
