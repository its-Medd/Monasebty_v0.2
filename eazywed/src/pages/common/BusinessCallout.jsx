import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useLocale } from "../../i18n/useLocale";
import "./BusinessCallout.css";
export default function BusinessCallout({ eyebrow, title, description }) {
  const { t } = useLocale();
  return (
    <section className="ew-business-callout">
      <div className="ew-business-copy">
        <span className="ew-eyebrow">{t(eyebrow)}</span>
        <h2>{t(title)}</h2>
        <p>{t(description)}</p>
      </div>
      <Link className="ew-business-cta" to="/vendor/category">
        {t("For wedding professionals")}
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    </section>
  );
}
