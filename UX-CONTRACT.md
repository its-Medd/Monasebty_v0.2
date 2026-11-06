# Laayoune beta: product and data contract

Scope: frontend-only directory for Laayoune. Current user decision supersedes the
previous all-Morocco and database-backed plans. No Atlas connection, seeding,
backend startup, booking writes, message delivery or OTP requests.

## Sources of truth

- User brief: Laayoune only, beta, real data, frontend only; add rotating hero offers.
- eazywed/src/data/laayoune.js: six public-source business entries, checked 2026-11-05.
- Source URLs: Charika, Kerix, Yelo Morocco and Annuaire Gratuit du Maroc.
- Listings are public records, not confirmed partnerships or verified current availability.

## Canonical UI Map

| Capability     | Canonical owner                         | Source of truth             | Allowed variants                   | Verification             |
| -------------- | --------------------------------------- | --------------------------- | ---------------------------------- | ------------------------ |
| Navigation     | common/Navbar.jsx                       | routes.jsx                  | desktop/mobile                     | browser                  |
| Select/Listbox | SelectField + Radix Select | frontend data and labels | authored category/sort popups | keyboard/phone/open state |
| Date           | native inputs in dormant legacy screens | legacy routes               | not used in beta                   | beta has no date booking |
| Help           | BetaHelp.jsx                           | beta mode                   | browse/save/contact guidance       | browser                  |
| Scrollbar      | styles/experience.css                   | DESIGN.md                   | global                             | computed CSS             |
| Catalog        | Listings.jsx / ServiceCard.jsx          | data/laayoune.js            | category/search/shortlist          | browser + unit           |
| Dialog         | common/ExperienceDialog.jsx             | native dialog               | planning explainer                 | Escape/focus             |
| Carousel       | common/HeroOffers.jsx                   | sourced business highlights | auto/manual/paused/reduced motion  | browser                  |
| Hero           | common/CinematicHero.jsx                | first selected photo design | full-width desktop / phone         | browser                  |
| Language       | i18n/LocaleProvider.jsx / LanguageSwitch | locales/fr.json, ar.json    | English / French / Arabic RTL      | browser                  |

## Behaviors

City is Laayoune; no other city records or location controls are shipped. Category, query, filters and
page persist in the URL. No fabricated prices, star ratings, discounts, testimonials
or business photos. Unknown information is visibly unknown. Price/rating sorting
is unavailable without those data. SelectField owns category and sort popups: trigger-width alignment, viewport collision handling, keyboard navigation, typeahead, selected states and Escape focus restoration. LanguageSwitch provides direct FR / Arabic / EN buttons with aria-pressed and native accessible names.
Shortlists remain on this device under monasebty-laayoune-shortlist-v1, with migration from the old eazywed key. Language stays on this device under monasebty-language. URL category values remain stable across language changes.

The hero rotates every 7 seconds. Arrows/dots pause automatic play; a play/pause
control is always available. Focus, hover, hidden documents and reduced-motion
preferences prevent unwanted rotation. Only the active banner is focusable.
Service banners are quote enquiries, not unverified discounts. Illustrative photos
are explicitly credited and do not represent the listed businesses.

Vendor details show source, checked date, phone where publicly listed, location
where supplied, and questions to confirm with the business. Calls require an
explicit click; the app never sends inquiries automatically.

Backend code remains the original fork and is not started by npm run dev/start.
Legacy admin/editor screens remain dormant and retain pre-existing audit findings.

MobileNavigation owns the phone bottom tabs and preserves current route indicators, shortlist badge counts and device safe areas. Header actions are reduced on phones to brand and direct language choices. BusinessCallout is the shared owner of homepage/About professional calls to action; text and background colors must be specified together.
