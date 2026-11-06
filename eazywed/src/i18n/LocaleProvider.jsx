import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { LocaleContext } from "./context";
import french from "./locales/fr.json";
import arabic from "./locales/ar.json";
import spanish from "./locales/es.json";

const KEY = "monasebty-language";
const dictionaries = { fr: french, ar: arabic, es: spanish };
const supported = ["en", "fr", "ar", "es"];

export default function LocaleProvider({ children }) {
  const [locale, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return supported.includes(saved) ? saved : "en";
    } catch {
      return "en";
    }
  });
  const setLocale = useCallback((value) => {
    const next = supported.includes(value) ? value : "en";
    setValue(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* Language still works for this visit. */
    }
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(() => {
    const dictionary = dictionaries[locale];
    const numberFormat = new Intl.NumberFormat(
      locale === "ar"
        ? "ar-MA-u-nu-arab"
        : locale === "fr"
          ? "fr-MA"
          : locale === "es"
            ? "es-MA"
            : "en-GB",
    );
    return {
      locale,
      setLocale,
      isRtl: locale === "ar",
      t: (text, variables = {}) => {
        const translated = dictionary?.messages[text] ?? text;
        return String(translated).replace(
          /\{(\w+)\}/g,
          (_, key) => variables[key] ?? `{${key}}`,
        );
      },
      vendorText: (vendor, field) =>
        dictionary?.vendors[vendor.id]?.[field] ?? vendor[field],
      formatNumber: (number) => numberFormat.format(number),
    };
  }, [locale, setLocale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
