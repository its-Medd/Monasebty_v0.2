import { Link } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import "./Brand.css";
export default function Brand({ onClick, light = false }) {
  const { isRtl } = useLocale();
  return (
    <Link
      to="/"
      className={`ew-brand${light ? " ew-brand--light" : ""}`}
      aria-label="Monasebty"
      dir={isRtl ? "rtl" : "ltr"}
      onClick={onClick}
    >
      <img
        className="ew-brand-logo"
        src="/brand/monasebty-mark.svg"
        width="40"
        height="46"
        alt=""
      />
      <span className="ew-brand-words">
        <span className="ew-brand-wordmark" lang={isRtl ? "ar" : "en"}>
          {isRtl ? "مناسبتي" : "monasebty"}
        </span>
        <span className="ew-brand-signature" lang={isRtl ? "en" : "ar"}>
          {isRtl ? "MONASEBTY" : "مناسبتي"}
        </span>
      </span>
    </Link>
  );
}
