import { createElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPause,
  FiPlay,
  FiCamera,
  FiCoffee,
  FiHome,
} from "react-icons/fi";
import { findVendor } from "../../data/laayoune";
import { useLocale } from "../../i18n/useLocale";
import "./HeroOffers.css";
const items = [
  "laayoune-taj-el-aarouss",
  "laayoune-machawi-dajaj",
  "laayoune-photo-chabab",
]
  .map(findVendor)
  .filter(Boolean);
const icons = {
  "Wedding Venues": FiHome,
  Catering: FiCoffee,
  Photographers: FiCamera,
};
export default function HeroOffers() {
  const { t, isRtl, formatNumber } = useLocale();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const touch = useRef(null);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setPaused(true);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (paused || hover || focused || hidden) return;
    const timer = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [paused, hover, focused, hidden]);
  const move = (index) => {
    setPaused(true);
    setActive((index + items.length) % items.length);
  };
  return (
    <section
      className="ew-ribbon"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("Local service highlights")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onTouchStart={(event) => {
        touch.current = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        };
      }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x,
          dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
          move(active + (isRtl ? (dx > 0 ? 1 : -1) : dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <div className="ew-shell ew-ribbon-inner">
        <div
          className="ew-ribbon-viewport"
          aria-live={paused ? "polite" : "off"}
        >
          <div
            className="ew-ribbon-track"
            style={{
              transform: `translateX(${(isRtl ? 1 : -1) * active * 100}%)`,
            }}
          >
            {items.map((vendor, index) => (
              <article
                className="ew-ribbon-slide"
                key={vendor.id}
                aria-hidden={index !== active}
                inert={index !== active ? true : undefined}
              >
                <span className="ew-ribbon-label">
                  {createElement(icons[vendor.category], {
                    "aria-hidden": true,
                  })}
                  {t("Local spotlight")}
                </span>
                <div className="ew-ribbon-business">
                  <span>{t(vendor.category)}</span>
                  <h2>
                    <bdi>{vendor.title}</bdi>
                  </h2>
                </div>
                <span className="ew-ribbon-quote">{t("Quote on request")}</span>
                <Link
                  to={`/services/${encodeURIComponent(vendor.category)}/${vendor.id}`}
                  className="ew-ribbon-link"
                >
                  {t("View details")}
                  {isRtl ? <FiArrowLeft /> : <FiArrowRight />}
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className="ew-ribbon-controls">
          <div className="ew-ribbon-dots">
            {items.map((vendor, index) => (
              <button
                key={vendor.id}
                type="button"
                aria-label={`${t("Show business")}: ${vendor.title}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => move(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <span className="ew-ribbon-count" aria-hidden="true">
            {formatNumber(active + 1)} / {formatNumber(items.length)}
          </span>
          <button
            type="button"
            aria-label={t("Previous offer banner")}
            onClick={() => move(active - 1)}
          >
            {isRtl ? <FiArrowRight /> : <FiArrowLeft />}
          </button>
          <button
            type="button"
            aria-label={t(
              paused ? "Play offer banners" : "Pause offer banners",
            )}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button
            type="button"
            aria-label={t("Next offer banner")}
            onClick={() => move(active + 1)}
          >
            {isRtl ? <FiArrowLeft /> : <FiArrowRight />}
          </button>
        </div>
      </div>
    </section>
  );
}
