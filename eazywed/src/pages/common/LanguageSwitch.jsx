import { useLocale } from "../../i18n/useLocale";
import "./LanguageSwitch.css";
const languages = [
  { value: "fr", name: "Français", label: "FR" },
  { value: "es", name: "Español", label: "ES" },
  { value: "ar", name: "العربية", label: "ع" },
  { value: "en", name: "English", label: "EN" },
];
export default function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div
      className="ew-languages"
      role="group"
      aria-label={t("Change language")}
      dir="ltr"
    >
      {languages.map((language) => (
        <button
          key={language.value}
          type="button"
          lang={language.value}
          aria-label={language.name}
          title={language.name}
          aria-pressed={locale === language.value}
          onClick={() => setLocale(language.value)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
