import "../styles/Loading.css";
import { useLocale } from "../i18n/useLocale";

const Loading = () => {
  const { t } = useLocale();
  return (
    <div className="loading-container loading-overlay" role="status">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p className="loading-text">{t("Loading…")}</p>
    </div>
  );
};

export default Loading;
