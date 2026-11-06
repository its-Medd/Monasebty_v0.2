import BusinessCallout from "./common/BusinessCallout";
import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCamera,
  FiHome,
  FiArrowRight,
  FiArrowUpRight,
  FiTruck,
} from "react-icons/fi";
import HeroOffers from "./common/HeroOffers";
import Navbar from "./common/Navbar";
import CinematicHero from "./common/CinematicHero";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import ServiceCard from "./common/ServiceCard";
import { fetchServicesByCategory } from "../services/api";
import "./Home.css";
const categories = [
  {
    name: "Wedding Venues",
    label: "Spaces for your day",
    icon: FiHome,
  },
  {
    name: "Catering",
    label: "Bring everyone together",
    icon: FiTruck,
  },
  {
    name: "Photographers",
    label: "Keep your moments",
    icon: FiCamera,
  },
];
export default function Home() {
  usePageTitle("Wedding services in Laayoune");
  const { t } = useLocale();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeCategory, setActiveCategory] = useState("");
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    fetchServicesByCategory("all", {
      limit: 24,
    })
      .then((res) => {
        if (alive) setData(res.data || []);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retry]);
  const visible = (
    activeCategory
      ? data.filter((item) => item.category === activeCategory)
      : [data[0], data[1], data[4], data[2], data[5], data[3]].filter(Boolean)
  ).slice(0, 6);
  return (
    <div className="ew-home">
      <Navbar />
      <EstimateSidebar />
      <main id="main-content">
        <CinematicHero />
        <HeroOffers />
        <section
          className="ew-shell ew-categories"
          aria-labelledby="category-title"
        >
          <div className="ew-section-head">
            <div>
              <span className="ew-eyebrow">
                {t("The people behind your day")}
              </span>
              <h2 id="category-title">{t("Every detail, in good hands.")}</h2>
            </div>
            <Link className="ew-text-link" to="/services">
              {t("Explore all vendors") + " "}
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="ew-category-grid">
            {categories.map(({ name, label, icon: Icon }) => (
              <Link
                className="ew-category"
                to={`/services?category=${encodeURIComponent(name)}`}
                key={name}
              >
                <span className="ew-category-icon">
                  {createElement(Icon, {
                    "aria-hidden": true,
                  })}
                </span>
                <strong>{t(name)}</strong>
                <span>{t(label)}</span>
                <FiArrowUpRight
                  className="ew-category-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
        <section className="ew-discover" aria-labelledby="discover-title">
          <div className="ew-shell">
            <div className="ew-section-head">
              <div>
                <span className="ew-eyebrow">{t("Find your perfect fit")}</span>
                <h2 id="discover-title">{t("Some lovely places to start.")}</h2>
                <p>
                  {t(
                    "A wedding full of possibility. A shortlist full of favourites.",
                  ) + " "}
                </p>
              </div>
              <Link className="ew-text-link" to="/services">
                {t("Meet the vendors") + " "}
                <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div
              className="ew-city-tabs"
              aria-label={t("Filter featured vendors by category")}
            >
              {["", "Wedding Venues", "Catering", "Photographers"].map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={activeCategory === c}
                  className={activeCategory === c ? "is-active" : ""}
                  onClick={() => setActiveCategory(c)}
                >
                  {t(c || "All local vendors")}
                </button>
              ))}
            </div>
            {loading ? (
              <div
                className="ew-card-grid"
                role="status"
                aria-label={t("Loading wedding vendors")}
              >
                {[0, 1, 2, 3].map((n) => (
                  <div className="ew-skeleton" key={n} />
                ))}
              </div>
            ) : error ? (
              <div className="ew-error" role="alert">
                <p>
                  {t(
                    "We couldn't load the vendors. Check your connection and try again.",
                  ) + " "}
                </p>
                <button
                  className="ew-button"
                  onClick={() => setRetry(retry + 1)}
                >
                  {t("Try again") + " "}
                </button>
              </div>
            ) : visible.length ? (
              <div className="ew-card-grid">
                {visible.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="ew-empty">
                <h3>{t("Your search starts here.")}</h3>
                <p>
                  {t(
                    "Explore all vendors to find more options for your celebration.",
                  ) + " "}
                </p>
                <Link
                  className="ew-button"
                  to={`/services?category=${activeCategory}`}
                >
                  {t("Explore") + " "}
                  {t(activeCategory || "vendors")} <FiArrowRight />
                </Link>
              </div>
            )}
            {import.meta.env.VITE_DEMO_MODE === "true" && (
              <p className="ew-demo-note ew-demo-catalog">
                {t(
                  "Real Laayoune businesses · Public-source beta directory. Confirm contact details, wedding services and prices directly. No invented ratings or discounts.",
                ) + " "}
              </p>
            )}
          </div>
        </section>
        <section className="ew-shell ew-planning">
          <div className="ew-planning-intro">
            <span className="ew-eyebrow">{t("Room for the joy")}</span>
            <h2>
              {t("A wedding to remember.") + " "}
              <br />
              <em>{t("A simpler way to plan.")}</em>
            </h2>
            <p>
              {t(
                "Big decisions, little details, and everything in between. Take it one step at a time.",
              ) + " "}
            </p>
            <Link to="/services" className="ew-text-link">
              {t("Find your first vendor") + " "}
              <FiArrowUpRight />
            </Link>
          </div>
          <div className="ew-planning-steps">
            <div>
              <span>01</span>
              <div>
                <h3>{t("Find your people")}</h3>
                <p>{t("Explore real Laayoune listings by category.")}</p>
              </div>
            </div>
            <div>
              <span>02</span>
              <div>
                <h3>{t("Make it your own")}</h3>
                <p>
                  {t(
                    "Save your favourites and review their public contact details.",
                  ) + " "}
                </p>
              </div>
            </div>
            <div>
              <span>03</span>
              <div>
                <h3>{t("Bring your day together")}</h3>
                <p>
                  {t(
                    "Contact businesses directly to ask about packages, prices and dates.",
                  ) + " "}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="ew-shell">
          <BusinessCallout
            eyebrow="For the makers of beautiful days"
            title="Your craft. Their forever."
            description="Connect your wedding business with couples planning their next chapter."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
