import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import "react";
import { Link } from "react-router-dom";
import Navbar from "../pages/common/Navbar";
import Footer from "../pages/common/Footer";
import EstimateSidebar from "../pages/common/EstimateSidebar";
export default function NotFound() {
  usePageTitle("Page not found");
  const { t } = useLocale();
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-shell ew-preview-gateway">
        <span className="ew-eyebrow">{t("404 · A little detour")}</span>
        <h1 className="ew-page-title">
          {t("Let's find your way") + " "}
          <br />
          <em>{t("back to the celebration.")}</em>
        </h1>
        <p>
          {t(
            "This page may have moved, or the address may be incomplete. Your next great wedding find is still waiting.",
          ) + " "}
        </p>
        <div>
          <Link className="ew-button" to="/services">
            {t("Explore wedding vendors ↗") + " "}
          </Link>
          <Link className="ew-text-link" to="/">
            {t("Back to home") + " "}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
