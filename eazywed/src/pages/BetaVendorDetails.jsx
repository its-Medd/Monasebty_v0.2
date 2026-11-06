import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { useCopyText } from "../hooks/useCopyText";
import { Link, useParams } from "react-router-dom";
import { FiMapPin, FiPhone, FiExternalLink, FiHeart } from "react-icons/fi";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import { useShortlist } from "./common/useShortlist";
import { findVendor } from "../data/laayoune";
import "./BetaVendorDetails.css";
export default function BetaVendorDetails() {
  usePageTitle("Business details");
  const { t, vendorText } = useLocale();
  const { id } = useParams();
  const vendor = findVendor(id);
  const { isSaved, toggleSaved } = useShortlist();
  const { copy, copied, copyError } = useCopyText();
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-shell ew-beta-detail">
        {!vendor ? (
          <div className="ew-empty">
            <h1 className="ew-page-title">
              {t("This listing isn't in our beta.")}
            </h1>
            <p>{t("Explore our current Laayoune directory.")}</p>
            <Link className="ew-button" to="/services">
              {t("Find local vendors ↗") + " "}
            </Link>
          </div>
        ) : (
          <>
            <nav aria-label={t("Breadcrumb")}>
              <Link to="/">{t("Home")}</Link> /{" "}
              <Link to="/services">{t("Laayoune vendors")}</Link> /{" "}
              <bdi>{vendor.title}</bdi>
            </nav>
            <div className="ew-beta-detail-grid">
              <article>
                <span className="ew-eyebrow">
                  {t(vendor.category)}
                  {t("· Laayoune beta") + " "}
                </span>
                <h1 className="ew-page-title ew-business-title">
                  <bdi>{vendor.title}</bdi>
                </h1>
                <p className="ew-beta-detail-location">
                  <FiMapPin />
                  {vendorText(vendor, "address") ||
                    t("Laayoune · Street address not published in our source")}
                </p>
                <p className="ew-beta-description">
                  {vendorText(vendor, "description")}
                </p>
                <section className="ew-beta-facts">
                  <h2>{t("Know before you enquire.")}</h2>
                  <p>{vendorText(vendor, "confirmationNote")}</p>
                  <dl>
                    <div>
                      <dt>{t("Starting price")}</dt>
                      <dd>{t("Request a quote")}</dd>
                    </div>
                    <div>
                      <dt>{t("Available dates")}</dt>
                      <dd>{t("Confirm directly with the business")}</dd>
                    </div>
                    <div>
                      <dt>{t("Cancellation policy")}</dt>
                      <dd>{t("Not published in our source")}</dd>
                    </div>
                    <div>
                      <dt>{t("Business photos")}</dt>
                      <dd>{t("Not supplied to Monasebty")}</dd>
                    </div>
                  </dl>
                </section>
                <section className="ew-beta-facts">
                  <h2>{t("A few helpful questions.")}</h2>
                  <ul>
                    <li>{t("Are you available on our wedding date?")}</li>
                    <li>{t("What is included in the total price?")}</li>
                    <li>{t("What deposit and cancellation terms apply?")}</li>
                    <li>
                      {t("Can we see recent work and confirm the location?")}
                    </li>
                  </ul>
                </section>
              </article>
              <aside className="ew-beta-contact">
                <span className="ew-eyebrow">{t("Your next step")}</span>
                <h2>{t("Start a conversation.")}</h2>
                <p>
                  {t(
                    "Bookings and quote requests happen directly with the business in this beta.",
                  ) + " "}
                </p>
                {vendor.phone ? (
                  <a className="ew-button" href={`tel:${vendor.phone}`}>
                    <FiPhone />
                    {t("Call") + " "}
                    <bdi dir="ltr">{vendor.phone}</bdi>
                  </a>
                ) : (
                  <p className="ew-beta-unavailable">
                    {t(
                      "No public phone number was confirmed. Use the source listing to find current contact information.",
                    ) + " "}
                  </p>
                )}
                <a
                  className="ew-button ew-button--outline"
                  href={vendor.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("View public source") + " "}
                  <FiExternalLink />
                </a>
                <button
                  className="ew-button ew-button--outline"
                  aria-pressed={isSaved(vendor.id)}
                  onClick={() => toggleSaved(vendor)}
                >
                  <FiHeart />
                  {isSaved(vendor.id)
                    ? t("Saved to your shortlist")
                    : t("Save to your shortlist")}
                </button>
                {vendor.phone && (
                  <button
                    type="button"
                    className="ew-button ew-button--outline"
                    onClick={() => copy(vendor.phone)}
                  >
                    {copied ? t("Phone copied") : t("Copy phone number")}
                  </button>
                )}
                {vendor.address && (
                  <a
                    className="ew-button ew-button--outline"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.title + " " + vendor.address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("Find directions ↗")}
                  </a>
                )}
                <span className="ew-copy-status" role="status">
                  {copied ? t("Copied to clipboard.") : copyError}
                </span>
                <div className="ew-beta-provenance">
                  <strong>{t("Where this information comes from")}</strong>
                  <a href={vendor.sourceUrl} target="_blank" rel="noreferrer">
                    {t(vendor.sourceName)} ↗
                  </a>
                  <span>{t("Source checked 5 November 2026.")}</span>
                  <p>
                    {t(
                      "Public listing, not a confirmed Monasebty partner. Contact details and services may change. We haven't contacted the business or verified availability.",
                    ) + " "}
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
