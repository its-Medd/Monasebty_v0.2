import { useEffect } from "react";
import { useLocale } from "./useLocale";
export function usePageTitle(title) {
  const { t } = useLocale();
  useEffect(() => {
    document.title = `${t(title)} | Monasebty`;
  }, [title, t]);
}
