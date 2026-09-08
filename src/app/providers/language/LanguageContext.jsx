import {useCallback, useEffect, useMemo, useState} from "react";
import {getActiveLocale, isRtlLocale, normalizeLocale} from "../../../shared/i18n/locale.js";
import {LanguageContext} from "./language-context.js";

export function LanguageProvider({children}) {
  const [locale] = useState(getActiveLocale);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
  }, [locale]);

  /* The full reload here is load-bearing, not laziness.
     Page content is resolved once at module evaluation, not per render - see
     the feature-level *Content.js modules, which do
       export const {hero, capabilities} = getIndustryPage("automotive");
     and localizedModule(), which reads getActiveLocale() at import time.
     Nothing re-reads the locale afterwards, so the only way a language change
     reaches that content is by re-evaluating every module.

     Switching this to client-side state without also making content resolution
     reactive would leave most of the site rendering the previous language, and
     it would fail silently. */
  const changeLanguage = useCallback((nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    if (normalized === locale || isLanguageLoading) return;
    setIsLanguageLoading(true);
    window.setTimeout(() => {
      window.localStorage.setItem("innotech-language", normalized);
      window.location.reload();
    }, 500);
  }, [isLanguageLoading, locale]);

  const value = useMemo(() => ({
    locale,
    isRtl: isRtlLocale(locale),
    isLanguageLoading,
    changeLanguage,
  }), [changeLanguage, isLanguageLoading, locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
