import { usePageTitle } from "../i18n/usePageTitle";
import SelectField from "../components/ui/SelectField";
import { useLocale } from "../i18n/useLocale";
import { useCopyText } from "../hooks/useCopyText";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FiArrowRight, FiSearch, FiX, FiSliders } from "react-icons/fi";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import ServiceCard from "./common/ServiceCard";
import { useShortlist } from "./common/useShortlist";
import { BETA_CATEGORIES, vendors, queryVendors } from "../data/laayoune";
import "./Listings.css";
const PAGE_SIZE = 12;
const resolveCategory = (value) =>
  BETA_CATEGORIES.find(
    (cat) =>
      cat.toLowerCase().replace(/\s+/g, "-") ===
      String(value || "")
        .toLowerCase()
        .replace(/\s+/g, "-"),
  ) || (value === "all" ? "" : value || "");
export default function Listings() {
  usePageTitle("Find local vendors");
  const { t, vendorText, formatNumber } = useLocale();
  const [params, setParams] = useSearchParams();
  const { category: routeCategory } = useParams();
  const offers = useLocation().pathname === "/deals";
  const savedOnly = params.get("saved") === "true";
  const category = resolveCategory(params.get("category") || routeCategory);
  const query = params.get("query") || "";
  const sort = params.get("sort") === "name" ? "name" : "recommended";
  const page = Math.max(1, parseInt(params.get("page")) || 1);
  const [draft, setDraft] = useState(query);
  const [composing, setComposing] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const input = useRef(null);
  const latestParams = useRef(params);
  latestParams.current = params;
  const { savedItems } = useShortlist();
  const update = (changes, replace = false) => {
    const next = new URLSearchParams(latestParams.current);
    for (const key of ["city", "budgetMin", "budgetMax", "refundPolicy"])
      next.delete(key);
    if (routeCategory && !next.has("category"))
      next.set("category", category || "all");
    for (const [key, value] of Object.entries(changes)) {
      if (value === "" || value == null || value === "recommended")
        next.delete(key);
      else next.set(key, String(value));
    }
    if (!Object.hasOwn(changes, "page")) next.delete("page");
    setParams(next, {
      replace,
    });
  };
  useEffect(() => {
    setDraft(query);
  }, [query]);
  useEffect(() => {
    if (composing || draft === query) return;
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(latestParams.current);
      if (draft.trim()) next.set("query", draft.trim());
      else next.delete("query");
      next.delete("page");
      setParams(next, {
        replace: true,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draft, query, composing, setParams]);
  const source = useMemo(
    () =>
      savedOnly
        ? vendors.filter((v) => savedItems.some((saved) => saved.id === v.id))
        : vendors,
    [savedOnly, savedItems],
  );
  const result = useMemo(
    () =>
      queryVendors(
        category || "all",
        {
          query,
          sort,
          page,
          limit: PAGE_SIZE,
        },
        source,
      ),
    [category, query, sort, page, source],
  );
  useEffect(() => {
    if (page > result.pagination.pages) {
      const next = new URLSearchParams(latestParams.current);
      next.set("page", String(result.pagination.pages));
      setParams(next, {
        replace: true,
      });
    }
  }, [page, result.pagination.pages, setParams]);
  useEffect(() => {
    if (
      !params.has("city") &&
      !params.has("budgetMin") &&
      !params.has("budgetMax") &&
      !params.has("refundPolicy")
    )
      return;
    const next = new URLSearchParams(params);
    for (const key of ["city", "budgetMin", "budgetMax", "refundPolicy"])
      next.delete(key);
    setParams(next, {
      replace: true,
    });
  }, [params, setParams]);
  const clear = () => {
    const next = new URLSearchParams();
    if (savedOnly) next.set("saved", "true");
    if (routeCategory) next.set("category", "all");
    setDraft("");
    setParams(next);
  };
  const clearSearch = () => {
    setDraft("");
    update({
      query: "",
    });
    input.current?.focus();
  };
  const total = result.pagination.total;
  const { copy, copied, copyError } = useCopyText();
  const copyShortlist = () =>
    copy(
      source
        .map(
          (v) =>
            `${v.title} — ${t(v.category)}\n${vendorText(v, "address") || v.city}\n${v.phone || t("Phone not published")}\n${v.sourceUrl}`,
        )
        .join("\n\n"),
    );
  return (
    <div className="ew-listings-page">
      <Navbar />
      <main id="main-content" className="ew-listings">
        <header className="ew-catalog-heading">
          <nav className="ew-catalog-breadcrumb" aria-label={t("Breadcrumb")}>
            <Link to="/">{t("Home")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {savedOnly
                ? t("Your shortlist")
                : offers
                  ? t("Local offers")
                  : t("Wedding vendors")}
            </span>
          </nav>
          <p className="ew-catalog-eyebrow">{t("LAAYOUNE, WITH LOVE")}</p>
          <h1>
            {savedOnly ? (
              <>
                {t("Your favourites,") + " "}
                <em>{t("all together.")}</em>
              </>
            ) : offers ? (
              <>
                {t("Local services.") + " "}
                <em>{t("Your possibilities.")}</em>
              </>
            ) : category ? (
              <>
                {t(category)}, <em>{t("your way.")}</em>
              </>
            ) : (
              <>
                {t("Find your") + " "}
                <em>{t("wedding people.")}</em>
              </>
            )}
          </h1>
          <p className="ew-catalog-intro">
            {savedOnly
              ? t("Saved here, on this device. No account needed.")
              : t(
                  "Real local listings, with public sources and contact details. Ask each business about prices and wedding availability.",
                )}
          </p>
          <form
            className="ew-catalog-search"
            role="search"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!composing)
                update({
                  query: draft.trim(),
                });
            }}
          >
            <FiSearch aria-hidden="true" />
            <label className="ew-catalog-sr-only" htmlFor="vendor-search">
              {t("Search local businesses")}
            </label>
            <input
              ref={input}
              id="vendor-search"
              type="search"
              value={draft}
              placeholder={t("Business name or keyword")}
              onChange={(event) => setDraft(event.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(event) => {
                setComposing(false);
                setDraft(event.currentTarget.value);
              }}
            />
            {draft && (
              <button
                type="button"
                className="ew-catalog-clear-search"
                onClick={clearSearch}
                aria-label={t("Clear business search")}
              >
                <FiX />
              </button>
            )}
            <button className="ew-catalog-search-submit" type="submit">
              {t("Search") + " "}
              <FiArrowRight aria-hidden="true" />
            </button>
          </form>
        </header>
        {savedOnly && source.length > 0 && (
          <div className="ew-shortlist-tools">
            <button
              type="button"
              className="ew-button ew-button--outline"
              onClick={copyShortlist}
            >
              {copied ? t("Shortlist copied") : t("Copy shortlist")}
            </button>
            <span role="status">
              {copied
                ? t("Ready to paste and share.")
                : copyError ||
                  t(
                    "Keep a copy of your favourites and their public contact details.",
                  )}
            </span>
          </div>
        )}
        <div className="ew-catalog-layout">
          <aside
            className="ew-catalog-filter-panel"
            aria-label={t("Browse vendor categories")}
          >
            <button
              className="ew-catalog-filter-toggle"
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="catalog-filters"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <FiSliders aria-hidden="true" />
              {t("Browse categories")}
            </button>
            <div
              id="catalog-filters"
              className={`ew-catalog-filters ${filtersOpen ? "is-open" : ""}`}
            >
              <div className="ew-catalog-filter-top">
                <h2>{t("What are you planning?")}</h2>
              </div>
              <div className="ew-category-filters">
                {["", ...BETA_CATEGORIES].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    aria-pressed={category === cat}
                    className={category === cat ? "is-active" : ""}
                    onClick={() =>
                      update({
                        category: cat || (routeCategory ? "all" : ""),
                      })
                    }
                  >
                    {t(cat || "All local services")}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="ew-catalog-planning-note">
                <p>{t("A little clarity helps.")}</p>
                <span>
                  {t(
                    "Prices are by quote. Ask about your date, what’s included and cancellation terms before booking.",
                  )}
                </span>
                <Link to="/contact">{t("How the beta works ↗")}</Link>
              </div>
            </div>
          </aside>
          <section
            className="ew-catalog-results"
            aria-labelledby="result-title"
          >
            <h2 id="result-title" className="ew-catalog-sr-only">
              {savedOnly ? t("Saved businesses") : t("Local business results")}
            </h2>
            <div className="ew-catalog-results-toolbar">
              <div
                className="ew-catalog-result-summary"
                role="status"
                aria-live="polite"
              >
                <strong>{formatNumber(total)}</strong>{" "}
                {total === 1 ? t("listing") : t("listings")}
                {query ? t(" for “{query}”", { query }) : ""}
                <span>
                  {total
                    ? t("Showing {start}–{end}", {
                        start: formatNumber((page - 1) * PAGE_SIZE + 1),
                        end: formatNumber(Math.min(page * PAGE_SIZE, total)),
                      })
                    : t("Try another name or category.")}
                </span>
              </div>
              <label className="ew-catalog-sort" htmlFor="vendor-sort">
                {t("Sort by")}
                <SelectField
                  id="vendor-sort"
                  label={t("Sort by")}
                  value={sort}
                  onValueChange={(value) => update({ sort: value })}
                  options={[
                    { value: "recommended", label: t("Directory order") },
                    { value: "name", label: t("Name: A–Z") },
                  ]}
                />
              </label>
            </div>
            {(category || query) && (
              <div
                className="ew-catalog-active-filters"
                aria-label={t("Active filters")}
              >
                {category && (
                  <button
                    type="button"
                    onClick={() =>
                      update({
                        category: routeCategory ? "all" : "",
                      })
                    }
                  >
                    {t(category)}
                    <FiX />
                    <span className="ew-catalog-sr-only">
                      {t("Remove category")}
                    </span>
                  </button>
                )}
                {query && (
                  <button type="button" onClick={clearSearch}>
                    {query}
                    <FiX />
                    <span className="ew-catalog-sr-only">
                      {t("Remove search")}
                    </span>
                  </button>
                )}
                <button
                  className="ew-catalog-clear-all"
                  type="button"
                  onClick={clear}
                >
                  {t("Clear all")}
                </button>
              </div>
            )}
            {result.data.length ? (
              <div className="ew-catalog-grid">
                {result.data.map((vendor) => (
                  <ServiceCard key={vendor.id} service={vendor} />
                ))}
              </div>
            ) : (
              <div className="ew-catalog-state">
                <h3>
                  {savedOnly && !category && !query
                    ? t("Keep the ones you love.")
                    : t("A fresh search might be the one.")}
                </h3>
                <p>
                  {savedOnly && !category && !query
                    ? t(
                        "Tap the heart on a business to save it here. Your shortlist stays in this browser.",
                      )
                    : t(
                        "No businesses matched this search. Try a different name or explore all local services.",
                      )}
                </p>
                {savedOnly && !category && !query ? (
                  <Link className="ew-catalog-state-button" to="/services">
                    {t("Explore local vendors") + " "}
                    <FiArrowRight />
                  </Link>
                ) : (
                  <button
                    className="ew-catalog-state-button"
                    type="button"
                    onClick={clear}
                  >
                    {t("Clear filters") + " "}
                    <FiArrowRight />
                  </button>
                )}
              </div>
            )}
            {result.pagination.pages > 1 && (
              <nav
                className="ew-catalog-pagination"
                aria-label={t("Result pages")}
              >
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    update({
                      page: page - 1,
                    })
                  }
                >
                  {t("Previous")}
                </button>
                <span>
                  {formatNumber(page)} / {formatNumber(result.pagination.pages)}
                </span>
                <button
                  type="button"
                  disabled={page === result.pagination.pages}
                  onClick={() =>
                    update({
                      page: page + 1,
                    })
                  }
                >
                  {t("Next")}
                </button>
              </nav>
            )}
            <p className="ew-catalog-source-note">
              {t(
                "Public-source directory · Checked 5 November 2026. Listings are not confirmed Monasebty partners; confirm current services directly.",
              )}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
