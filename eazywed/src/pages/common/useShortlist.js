import { useEffect, useState } from "react";
const KEY = "monasebty-laayoune-shortlist-v1";
const LEGACY_KEY = "eazywed-laayoune-shortlist-v1";
let memoryFallback;
function read() {
  if (memoryFallback) return memoryFallback;
  try {
    const value = JSON.parse(
      localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY) || "[]",
    );
    return Array.isArray(value)
      ? value.filter((item) => item && typeof item.id === "string")
      : [];
  } catch {
    return [];
  }
}
export function useShortlist() {
  const [savedItems, setSavedItems] = useState(read);
  useEffect(() => {
    const sync = () => setSavedItems(read());
    window.addEventListener("storage", sync);
    window.addEventListener("ew-shortlist-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ew-shortlist-change", sync);
    };
  }, []);
  const toggleSaved = (item) => {
    const existing = read();
    const next = existing.some((saved) => saved.id === item.id)
      ? existing.filter((saved) => saved.id !== item.id)
      : [...existing, item];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      memoryFallback = undefined;
    } catch {
      memoryFallback = next;
    }
    setSavedItems(next);
    window.dispatchEvent(new Event("ew-shortlist-change"));
  };
  return {
    savedItems,
    toggleSaved,
    isSaved: (id) => savedItems.some((item) => item.id === id),
  };
}
