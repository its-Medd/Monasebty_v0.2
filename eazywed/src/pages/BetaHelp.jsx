import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiHeart, FiPhone, FiSearch } from "react-icons/fi";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import "./BetaHelp.css";
export default function BetaHelp() {
  usePageTitle("How Monasebty works");
  const { t } = useLocale();
  return (
    <>
      <Navbar />
      <main id="main-content" className="ew-shell ew-beta-help">
        <nav aria-label={t("Breadcrumb")}>
          <Link to="/">{t("Home")}</Link>
          <span>{t("/ How it works")}</span>
        </nav>
        <header>
          <span className="ew-eyebrow">
            {t("A LITTLE CLARITY FOR YOUR BIG DAY")}
          </span>
          <h1 className="ew-page-title">
            {t("Local people.")}
            <br />
            <em>{t("A simpler beginning.")}</em>
          </h1>
          <p>
            {t(
              "Monasebty helps you discover wedding services in Laayoune. This early beta is a public-source directory. You can browse, save favourites and contact businesses directly.",
            )}
          </p>
        </header>
        <section className="ew-help-steps" aria-label={t("Using Monasebty")}>
          <article>
            <FiSearch aria-hidden="true" />
            <div>
              <h2>{t("Find your people")}</h2>
              <p>
                {t(
                  "Explore venues, caterers and photographers. Every listing links to the public record behind it.",
                )}
              </p>
              <Link to="/services">
                {t("Browse local services") + " "}
                <FiArrowUpRight />
              </Link>
            </div>
          </article>
          <article>
            <FiHeart aria-hidden="true" />
            <div>
              <h2>{t("Keep a shortlist")}</h2>
              <p>
                {t(
                  "Tap a heart to save a business in this browser. No account is needed, and your list stays on this device.",
                )}
              </p>
              <Link to="/services?saved=true">
                {t("Open your shortlist") + " "}
                <FiArrowUpRight />
              </Link>
            </div>
          </article>
          <article>
            <FiPhone aria-hidden="true" />
            <div>
              <h2>{t("Start a conversation")}</h2>
              <p>
                {t(
                  "Call the business using its published number, or open its source listing. Confirm wedding services, prices and your date directly.",
                )}
              </p>
            </div>
          </article>
        </section>
        <section className="ew-help-details">
          <div>
            <h2>{t("Good to know.")}</h2>
            <p>
              {t(
                "This beta does not take payments, make bookings or send messages for you. We haven't contacted the listed businesses or confirmed their current availability.",
              )}
            </p>
            <p>
              {t(
                "Prices, reviews and discounts aren't invented. When a detail is not published, we say so. Wedding photos are credited inspiration, not photos of the listed businesses.",
              )}
            </p>
          </div>
          <div>
            <h2>{t("Where the details come from.")}</h2>
            <p>
              {t(
                "Public listings were checked on 5 November 2026. These are directory records, not confirmed Monasebty partners.",
              )}
            </p>
            <ul>
              <li>
                <a
                  href="https://www.charika.ma/societe-salle-taj-el-aarouss-1238004"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Charika · Salle Taj El Aarouss ↗")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.kerix.net/fr/annuaire-entreprise/machawi-dajaj"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Kerix · Machawi Dajaj ↗")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.yelo.ma/category/services_de_photographie/city:Laayoune"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Yelo · Photography services ↗")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.annuaire-gratuit.ma/traiteur/_laayoune"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("Annuaire Gratuit · Catering services ↗")}
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
