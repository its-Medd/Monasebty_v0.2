import { useContext } from "react";
import { LocaleContext } from "./context";
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("LocaleProvider is required");
  return value;
}
