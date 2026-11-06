import { useLocale } from "../../i18n/useLocale";
import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiArrowUpRight,
  FiCamera,
  FiCoffee,
  FiHome,
} from "react-icons/fi";
import { useShortlist } from "./useShortlist";
import "./ServiceCard.css";
import { weddingInspiration } from "../../data/weddingInspiration";
const icons = {
  "Wedding Venues": FiHome,
  Catering: FiCoffee,
  Photographers: FiCamera,
};
export default function ServiceCard({ service }) {
  const { t, vendorText } = useLocale();
  const { isSaved, toggleSaved } = useShortlist();
  const saved = isSaved(service.id);
  const inspiration = weddingInspiration[service.id];
  const path =
    service.type === "card"
      ? `/cards/${service.id}`
      : `/services/${encodeURIComponent(service.category)}/${service.id}`;
  return (
    <article className="ew-vendor-card">
      {inspiration && (
        <figure className="ew-vendor-photo">
          <img
            src={inspiration.src}
            alt={t("Moroccan wedding inspiration")}
            width="1000"
            height="1500"
            loading="lazy"
            style={{ objectPosition: inspiration.position }}
          />
          <figcaption>
            <a
              href={inspiration.source}
              target="_blank"
              rel="noreferrer"
              title={`${t("Photo source")}: ${inspiration.credit}`}
            >
              {t("Wedding inspiration · Not a business photo")} ↗
            </a>
          </figcaption>
        </figure>
      )}
      <div className="ew-vendor-card-content">
        <div className="ew-vendor-card-top">
          <span className="ew-vendor-category">
            {createElement(icons[service.category] || FiHome, {
              "aria-hidden": true,
            })}
            {t(service.category)}
          </span>
          <button
            type="button"
            className={`ew-save ${saved ? "is-saved" : ""}`}
            aria-label={t(
              saved
                ? "Remove {name} from shortlist"
                : "Save {name} to shortlist",
              { name: service.title },
            )}
            aria-pressed={saved}
            onClick={() => toggleSaved(service)}
          >
            <FiHeart aria-hidden="true" />
          </button>
        </div>
        <h3>
          <Link to={path}>
            <bdi>{service.title}</bdi>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </h3>
        <p className="ew-vendor-summary">
          {vendorText(service, "description")}
        </p>
        <p className="ew-vendor-location">
          <FiMapPin aria-hidden="true" />
          <span>
            {vendorText(service, "address") ||
              t("Laayoune · Address on request")}
          </span>
        </p>
        <div className="ew-vendor-bottom">
          <strong>{t("Quote on request")}</strong>
          <Link to={path}>
            {t("View details") + " "}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
