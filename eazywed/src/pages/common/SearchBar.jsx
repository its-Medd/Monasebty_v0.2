import { useLocale } from "../../i18n/useLocale";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiGrid, FiArrowRight, FiX } from "react-icons/fi";
import { BETA_CATEGORIES } from "../../data/laayoune";
import SelectField from "../../components/ui/SelectField";
import "./SearchBar.css";
export default function SearchBar({ onSearch }) {
  const { t } = useLocale();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const input = useRef(null);
  const id = useId();
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    const params = {};
    if (category) params.category = category;
    if (query.trim()) params.query = query.trim();
    if (onSearch) onSearch(params);
    else navigate(`/services?${new URLSearchParams(params)}`);
  };
  return (
    <form
      className="ew-search ew-search-form"
      role="search"
      aria-label={t("Find local vendors")}
      onSubmit={submit}
      noValidate
    >
      <div className="ew-search-field">
        <FiGrid aria-hidden="true" />
        <div>
          <label id={`${id}-category-label`} htmlFor={`${id}-category`}>
            {t("What are you planning?")}
          </label>
          <SelectField
            id={`${id}-category`}
            labelledBy={`${id}-category-label`}
            value={category || "all"}
            onValueChange={(value) => setCategory(value === "all" ? "" : value)}
            options={[
              { value: "all", label: t("All wedding services") },
              ...BETA_CATEGORIES.map((cat) => ({ value: cat, label: t(cat) })),
            ]}
          />
        </div>
      </div>
      <div className="ew-search-field ew-search-keyword">
        <FiSearch aria-hidden="true" />
        <div>
          <label htmlFor={`${id}-query`}>{t("Have someone in mind?")}</label>
          <div className="ew-search-input">
            <input
              id={`${id}-query`}
              ref={input}
              type="search"
              value={query}
              placeholder={t("Business name or keyword")}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                aria-label={t("Clear business search")}
                type="button"
                onClick={() => {
                  setQuery("");
                  input.current?.focus();
                }}
              >
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
      <button className="ew-button ew-search-submit" type="submit">
        {t("Find vendors") + " "}
        <FiArrowRight aria-hidden="true" />
      </button>
    </form>
  );
}
