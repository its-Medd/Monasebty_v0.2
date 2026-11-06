import { Link, useLocation } from "react-router-dom";
import { createElement } from "react";
import { FiHome, FiSearch, FiHeart, FiHelpCircle } from "react-icons/fi";
import { useLocale } from "../../i18n/useLocale";
import { useShortlist } from "./useShortlist";
export default function MobileNavigation() {
  const { t, formatNumber } = useLocale();
  const { pathname, search } = useLocation();
  const { savedItems } = useShortlist();
  const saved =
    pathname === "/services" &&
    new URLSearchParams(search).get("saved") === "true";
  const items = [
    { to: "/", label: "Home", Icon: FiHome, active: pathname === "/" },
    {
      to: "/services",
      label: "Explore",
      Icon: FiSearch,
      active: pathname.startsWith("/services") && !saved,
    },
    {
      to: "/services?saved=true",
      label: "Saved",
      Icon: FiHeart,
      active: saved,
      badge: savedItems.length,
    },
    {
      to: "/contact",
      label: "Help",
      Icon: FiHelpCircle,
      active: pathname === "/contact" || pathname === "/about",
    },
  ];
  return (
    <nav className="ew-mobile-tabs" aria-label={t("Main navigation")}>
      {items.map(({ to, label, Icon, active, badge }) => (
        <Link
          key={label}
          to={to}
          className={`ew-mobile-tab${active ? " is-active" : ""}`}
          aria-current={active ? "page" : undefined}
        >
          <span className="ew-mobile-tab-icon">
            {createElement(Icon, { "aria-hidden": true })}
            {badge > 0 && (
              <span className="ew-mobile-tab-badge">{formatNumber(badge)}</span>
            )}
          </span>
          <span>{t(label)}</span>
        </Link>
      ))}
    </nav>
  );
}
