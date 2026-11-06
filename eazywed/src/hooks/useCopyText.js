import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n/useLocale";
export function useCopyText() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async (text) => {
    setCopyError("");
    setCopied(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(
        "Copy is unavailable in this browser. Select the information and copy it manually.",
      );
    }
  };
  return { copy, copied, copyError: t(copyError) };
}
