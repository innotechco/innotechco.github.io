export const supportedLocales = ["en", "ar", "tr"];

export function normalizeLocale(value) {
  const locale = String(value ?? "").toLowerCase();
  return supportedLocales.includes(locale) ? locale : "en";
}

export function getActiveLocale() {
  if (typeof window === "undefined") return "en";
  return normalizeLocale(window.localStorage.getItem("innotech-language"));
}

export function isRtlLocale(locale = getActiveLocale()) {
  return locale === "ar";
}

/* Callers almost always invoke this at module scope, so the locale is baked in
   when the module first evaluates and never re-read. That is only safe because
   changeLanguage() reloads the page - see the comment in LanguageContext.jsx
   before making language switching client-side. */
export function localizedModule(modules, englishPath) {
  const localePath = englishPath.replace("/en/", `/${getActiveLocale()}/`);
  return modules[localePath] ?? modules[englishPath];
}
