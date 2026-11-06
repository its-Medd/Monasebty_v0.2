import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { BETA_MODE } from "../data/laayoune";
import EstimateSidebar from "../pages/common/EstimateSidebar";
import { Link } from "react-router-dom";
import Navbar from "../pages/common/Navbar";
import Footer from "../pages/common/Footer";
import "../pages/AboutUs.css";
export default function PreviewGateway({ children, admin = false }) {
  usePageTitle("Monasebty beta");
  const { t } = useLocale();
  if (!BETA_MODE && import.meta.env.VITE_DEMO_MODE !== "true") return children;
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-shell ew-preview-gateway">
        <span className="ew-eyebrow">{t("Laayoune's wedding community")}</span>
        <h1 className="ew-page-title">
          {admin
            ? t("Your workspace, when you’re ready.")
            : t("Your craft. Their next chapter.")}
        </h1>
        <p>
          {t("This local preview lets you explore the wedding marketplace.")}{" "}
          {admin
            ? t("The administration workspace")
            : t("Business registration and sign-in")}{" "}
          {t("is outside the scope of this frontend-only Laayoune beta.") + " "}
        </p>
        <p>
          {t(
            "You can still browse public business listings, save your favourites, and try the planning experience.",
          ) + " "}
        </p>
        <div>
          <Link className="ew-button" to="/services">
            {t("Explore the marketplace ↗") + " "}
          </Link>
          <Link className="ew-text-link" to="/">
            {t("Back to the beginning") + " "}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
