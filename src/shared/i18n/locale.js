export const supportedLocales = ["en", "ar", "tr"];

/* The locale the site is built around. Its content is bundled statically and
   is in the first wave of requests, so the common visit never waits for a
   second round trip to find out what the page says. */
export const defaultLocale = "en";

export function normalizeLocale(value) {
  const locale = String(value ?? "").toLowerCase();
  return supportedLocales.includes(locale) ? locale : defaultLocale;
}

export function getActiveLocale() {
  if (typeof window === "undefined") return defaultLocale;
  return normalizeLocale(window.localStorage.getItem("innotech-language"));
}

export function isRtlLocale(locale = getActiveLocale()) {
  return locale === "ar";
}

/* Arabic and Turkish, fetched only by somebody who reads them.
 *
 * This used to be three eager globs in every content module, so all three
 * languages were bundled and every single visitor downloaded all of them:
 * 385KB of page copy, of which an English reader used 109KB and threw away
 * 276KB. On localhost that is a few hundred milliseconds of parsing. On a
 * filtered line, where responses over about 59KB are liable not to arrive at
 * all, it is the difference between a page and a blank screen.
 *
 * A glob cannot be narrowed at build time to a language that is only known
 * from localStorage at runtime, so the split is by which language is the
 * common one rather than by which is wanted: English is static and arrives
 * with everything else, and the other two are fetched before the app is
 * imported - see main.jsx. A reader of those two pays one extra round trip
 * and still downloads less than everybody downloads today.
 */
const overrides = new Map();

const localeModules = import.meta.glob("../../content/{ar,tr}/**/*.json", {
  import: "default",
});

/* Resolved before anything that calls localizedModule() is imported, which is
   what lets that function stay synchronous. Every content module in the app
   reads its copy once, at module evaluation, so a value that arrives later
   than the module does is a value nobody reads - see the note in
   LanguageContext.jsx about why changing language reloads the page. */
export async function loadLocaleOverrides(locale = getActiveLocale()) {
  if (locale === defaultLocale) return;

  const wanted = Object.keys(localeModules).filter((path) =>
    path.includes(`/content/${locale}/`),
  );

  await Promise.all(
    wanted.map(async (path) => {
      try {
        overrides.set(path, await localeModules[path]());
      } catch {
        /* A file that will not load leaves its English original in place,
           which is a page in the wrong language rather than no page. */
      }
    }),
  );
}

/* Callers almost always invoke this at module scope, so the locale is baked in
   when the module first evaluates and never re-read. That is only safe because
   changeLanguage() reloads the page - see the comment in LanguageContext.jsx
   before making language switching client-side. */
export function localizedModule(modules, englishPath) {
  const locale = getActiveLocale();
  if (locale === defaultLocale) return modules[englishPath];

  /* The glob keys here are relative to the file that wrote the glob, while the
     override keys are relative to this one. Matching on the part from
     /content/ onwards is what lets the two meet. */
  const tail = englishPath.slice(englishPath.indexOf("/content/"));
  const localized = tail.replace(`/content/${defaultLocale}/`, `/content/${locale}/`);

  for (const [path, module] of overrides) {
    if (path.endsWith(localized)) return module;
  }

  return modules[englishPath];
}
