import { useLocale } from "../../i18n/useLocale";
import Brand from "./Brand";
import { Link } from "react-router-dom";
import "./Footer.css";
export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="ew-footer">
      <div className="ew-shell">
        <div className="ew-footer-main">
          <div>
            <Brand />
            <p>
              {t("Thoughtfully planned.") + " "}
              <br />
              {t("Beautifully yours.") + " "}
            </p>
          </div>
          <div className="ew-footer-links">
            <div>
              <h2>{t("Your wedding")}</h2>
              <Link to="/services">{t("Find vendors")}</Link>
              <Link to="/deals">{t("Vendor offers")}</Link>
              <Link to="/services?saved=true">{t("Your shortlist")}</Link>
            </div>
            <div>
              <h2>{t("A little about us")}</h2>
              <Link to="/about">{t("Our story")}</Link>
              <Link to="/contact">{t("How it works")}</Link>
              <Link to="/vendor/category">{t("List your business ↗")}</Link>
            </div>
          </div>
          <div className="ew-footer-note">
            <span className="ew-eyebrow">
              {t("Made for your next chapter")}
            </span>
            <p>
              {t("From the first idea") + " "}
              <br />
              {t("to the final detail.") + " "}
            </p>
            <Link className="ew-text-link" to="/services">
              {t("Let's find your people") + " "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="ew-footer-bottom">
          <span>
            © {new Date().getFullYear()}{" "}
            {t("Monasebty. All rights reserved.") + " "}
          </span>
          <span>{t("Made with care, for a day that matters.")}</span>
        </div>
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <p className="ew-footer-demo">
            {t(
              "Laayoune beta · Public-source listings. Shortlists stay on this device. No online bookings, accounts or message delivery.",
            ) + " "}
          </p>
        )}
      </div>
    </footer>
  );
}
