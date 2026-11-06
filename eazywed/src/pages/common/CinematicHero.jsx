import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useLocale } from "../../i18n/useLocale";
import "./CinematicHero.css";
export default function CinematicHero() {
  const navigate = useNavigate();
  const { t } = useLocale();
  return (
    <section className="ew-cinematic" aria-labelledby="home-title">
      <img
        className="ew-cinematic-photo"
        src="/images/moroccan-caftan-wedding.jpg"
        alt=""
        width="1500"
        height="2250"
        fetchPriority="high"
      />
      <div className="ew-cinematic-shade" />
      <div className="ew-shell ew-cinematic-inner">
        <div className="ew-cinematic-copy">
          <span className="ew-eyebrow">{t("LAAYOUNE · BETA")}</span>
          <h1 id="home-title">
            {t("Your wedding.")}
            <br />
            <em>{t("Closer to home.")}</em>
          </h1>
          <p>
            {t(
              "Find the people who will make your day. Local wedding venues, catering and photography.",
            )}
          </p>
        </div>
        <a
          className="ew-cinematic-credit"
          href="https://www.roadtobeauty.co.nz/blog/moroccanwedding-marrakech"
          target="_blank"
          rel="noreferrer"
        >
          {t(
            "Moroccan wedding inspiration · Alami Photography / Road to Beauty",
          )}{" "}
          ↗
        </a>
      </div>
      <div className="ew-cinematic-search" id="find-vendors">
        <SearchBar
          onSearch={(query) =>
            navigate(`/services?${new URLSearchParams(query)}`)
          }
        />
      </div>
    </section>
  );
}
