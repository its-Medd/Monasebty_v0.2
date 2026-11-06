import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../pages/common/Navbar";
import Footer from "../pages/common/Footer";
import EstimateSidebar from "../pages/common/EstimateSidebar";
const categories = [
  ["wedding-venues", "Wedding venues"],
  ["photographers", "Photography"],
  ["bridal-makeup", "Bridal beauty"],
  ["henna-artists", "Henna artistry"],
  ["bridal-wear", "Caftans & bridal wear"],
  ["wedding-invitations", "Invitations"],
  ["car-rental", "Wedding transport"],
];
export default function VendorCategoryType() {
  usePageTitle("Wedding professionals");
  const { t } = useLocale();
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main id="main-content" className="ew-vendor-onboard ew-shell">
        <Link className="ew-text-link" to="/">
          {t("← Back to exploring") + " "}
        </Link>
        <span className="ew-eyebrow">
          {t("For Morocco's wedding professionals")}
        </span>
        <h1 className="ew-page-title">
          {t("Bring your craft") + " "}
          <br />
          {t("to their") + " "}
          <em>{t("beautiful day.")}</em>
        </h1>
        <p>{t("Tell us what you do. We'll help you take the next step.")}</p>
        <fieldset>
          <legend>{t("What is your line of business?")}</legend>
          <div className="ew-onboard-options">
            {categories.map(([id, label]) => (
              <label key={id} className={selected === id ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="business-category"
                  value={id}
                  checked={selected === id}
                  onChange={() => setSelected(id)}
                />
                <span>{t(label)}</span>
                <span aria-hidden="true">↗</span>
              </label>
            ))}
          </div>
        </fieldset>
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <p className="ew-demo-note">
            {t(
              "Local preview: you can explore the categories. Business registration will be available when a database is connected.",
            ) + " "}
          </p>
        )}
        <div className="ew-onboard-actions">
          <Link to="/vendor/login">{t("Already with us? Sign in")}</Link>
          <button
            className="ew-button"
            disabled={!selected}
            onClick={() =>
              navigate("/vendor/signup", {
                state: {
                  category: selected,
                },
              })
            }
          >
            {t("Continue ↗") + " "}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
