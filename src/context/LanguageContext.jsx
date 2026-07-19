import {useCallback, useEffect, useMemo, useState} from "react";
import {getActiveLocale, isRtlLocale, normalizeLocale} from "../i18n/locale";
import {LanguageContext} from "./language-context";

export function LanguageProvider({children}) {
  const [locale] = useState(getActiveLocale);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
    document.body.dataset.locale = locale;
  }, [locale]);

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
