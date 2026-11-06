import { useLocale } from "../../i18n/useLocale";
import LanguageSwitch from "./LanguageSwitch";
import MobileNavigation from "./MobileNavigation";
import { BETA_MODE } from "../../data/laayoune";
import { useShortlist } from "./useShortlist";
import Brand from "./Brand";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeart,
  FiArrowUpRight,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useEstimate } from "../../context/EstimateContext";
import "./Navbar.css";
const categories = ["Wedding Venues", "Catering", "Photographers"];
export default function Navbar() {
  const { t, formatNumber } = useLocale();
  const { user, logout } = useAuth();
  const { savedItems } = useShortlist();
  const { toggleSidebar } = useEstimate();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [services, setServices] = useState(false);
  const [account, setAccount] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) {
        setServices(false);
        setAccount(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const onEscape = (e) => {
    if (e.key === "Escape") {
      setServices(false);
      setAccount(false);
      setMobile(false);
      e.target.closest(".ew-nav-dropdown")?.querySelector("button")?.focus();
    }
  };
  const close = () => {
    setMobile(false);
    setServices(false);
    setAccount(false);
  };
  return (
    <>
      <a className="ew-skip" href="#main-content">
        {t("Skip to content") + " "}
      </a>
      <header className="ew-header" ref={ref} onKeyDown={onEscape}>
        <div className="ew-shell ew-nav">
          <Brand onClick={close} />
          <nav
            className={`ew-nav-links ${mobile ? "is-open" : ""}`}
            id="primary-navigation"
            aria-label={t("Main navigation")}
          >
            <div className="ew-nav-dropdown">
              <button
                type="button"
                className={
                  location.pathname.startsWith("/services") ? "is-active" : ""
                }
                aria-expanded={services}
                aria-controls="vendor-categories"
                onClick={() => {
                  setServices(!services);
                  setAccount(false);
                }}
              >
                {t("Find vendors") + " "}
                <FiChevronDown aria-hidden="true" />
              </button>
              {services && (
                <div className="ew-nav-popover" id="vendor-categories">
                  <span className="ew-eyebrow">
                    {t("For every part of your day")}
                  </span>
                  <Link to="/services" onClick={close}>
                    {t("All wedding vendors") + " "}
                    <span aria-hidden="true">↗</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      onClick={close}
                      to={`/services?category=${encodeURIComponent(cat)}`}
                    >
                      {t(cat)}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <NavLink to="/deals" onClick={close}>
              {t("Vendor offers") + " "}
            </NavLink>
            <NavLink to="/about" onClick={close}>
              {t("Our story") + " "}
            </NavLink>
            <NavLink to="/contact" onClick={close}>
              {t("How it works") + " "}
            </NavLink>
            {!BETA_MODE && (
              <button
                type="button"
                className="ew-mobile-plan"
                onClick={() => {
                  close();
                  toggleSidebar();
                }}
              >
                {t("My wedding plan") + " "}
              </button>
            )}
            <Link
              className="ew-mobile-business"
              to="/vendor/category"
              onClick={close}
            >
              {t("For wedding professionals") + " "}
              <FiArrowUpRight />
            </Link>
          </nav>
          <div className="ew-nav-actions">
            <LanguageSwitch />
            <Link
              to="/services?saved=true"
              className="ew-nav-heart ew-nav-heart--label"
              aria-label={t("Your saved vendors")}
              onClick={close}
            >
              <FiHeart aria-hidden="true" />
              <span>
                {t("Saved")}
                {savedItems.length
                  ? ` (${formatNumber(savedItems.length)})`
                  : ""}
              </span>
            </Link>
            {!BETA_MODE && (
              <button
                type="button"
                className="ew-plan-button"
                onClick={toggleSidebar}
              >
                {t("My plan") + " "}
              </button>
            )}
            {!BETA_MODE &&
              (user ? (
                <div className="ew-nav-dropdown">
                  <button
                    className="ew-account"
                    aria-expanded={account}
                    onClick={() => {
                      setAccount(!account);
                      setServices(false);
                    }}
                  >
                    {user.full_name?.split(" ")[0] || t("Account")}
                    <FiChevronDown />
                  </button>
                  {account && (
                    <div className="ew-nav-popover ew-account-popover">
                      <Link
                        to={
                          ["superadmin", "moderator"].includes(user.role)
                            ? "/admin/dashboard"
                            : user.role === "vendor"
                              ? "/vendor/dashboard"
                              : "/dashboard"
                        }
                        onClick={close}
                      >
                        {t("Your dashboard") + " "}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          close();
                        }}
                      >
                        {t("Sign out") + " "}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link className="ew-signin" to="/signin" onClick={close}>
                  {t("Sign in") + " "}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            <button
              className="ew-menu-toggle"
              type="button"
              aria-label={t(mobile ? "Close navigation" : "Open navigation")}
              aria-expanded={mobile}
              aria-controls="primary-navigation"
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation />
    </>
  );
}
