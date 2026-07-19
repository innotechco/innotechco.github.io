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

export function localizedModule(modules, englishPath) {
  const localePath = englishPath.replace("/en/", `/${getActiveLocale()}/`);
  return modules[localePath] ?? modules[englishPath];
}
