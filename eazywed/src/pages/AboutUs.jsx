import BusinessCallout from "./common/BusinessCallout";
import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { Link } from "react-router-dom";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import "./AboutUs.css";
export default function AboutUs() {
  usePageTitle("Our story");
  const { t } = useLocale();
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-about ew-shell">
        <nav aria-label={t("Breadcrumb")}>
          <Link to="/">{t("Home")}</Link>
          <span>{t("/ Our story")}</span>
        </nav>
        <section className="ew-about-hero">
          <div>
            <span className="ew-eyebrow">
              {t("A beautiful beginning, made in Laayoune") + " "}
            </span>
            <h1>
              {t("For the day.") + " "}
              <br />
              {t("For the details.") + " "}
              <br />
              <em>{t("For you.")}</em>
            </h1>
            <p>
              {t(
                "A Moroccan wedding brings people together. Planning one should feel that way, too.",
              ) + " "}
            </p>
            <Link to="/services" className="ew-button">
              {t("Meet your wedding vendors ↗") + " "}
            </Link>
          </div>
          <figure>
            <img
              src="/images/marrakech-celebration.jpg"
              alt={t("Bride preparing for a wedding in Marrakech")}
              width="600"
              height="800"
            />
            <figcaption>
              {t("Marrakech wedding ·")}{" "}
              <a
                href="https://www.la-perle-events.com/en/portfolio/a-timeless-multicultural-wedding-at-palais-namaskar-marrakech"
                target="_blank"
                rel="noreferrer"
              >
                {t("Photography via La Perle Events ↗") + " "}
              </a>
            </figcaption>
          </figure>
        </section>
        <section className="ew-about-story">
          <span className="ew-eyebrow">{t("Why Monasebty")}</span>
          <h2>
            {t("More time for the moments.") + " "}
            <br />
            {t("Less time searching for them.") + " "}
          </h2>
          <p>
            {t(
              "From an intimate gathering to a family celebration in Laayoune, every couple has a different picture of their day. Monasebty brings wedding venues, caterers and photographers into one local directory.",
            ) + " "}
          </p>
          <p>
            {t(
              "Explore the Laayoune directory by category. Keep a shortlist of the people whose work you love. Ask about packages and prices, and make each choice with a little more confidence.",
            ) + " "}
          </p>
          <Link className="ew-text-link" to="/contact">
            {t("Have a question? Let's talk ↗") + " "}
          </Link>
        </section>
        <BusinessCallout
          eyebrow="Laayoune's wedding professionals"
          title="Beautiful days start with good people."
          description="Bring your craft to couples planning their wedding."
        />
      </main>
      <Footer />
    </>
  );
}
