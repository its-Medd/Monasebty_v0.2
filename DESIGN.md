---
version: alpha
name: Monasebty
description: Botanical editorial wedding discovery with calm, practical planning tools.
colors:
  primary: "#183E35"
  background: "#FFFFFF"
  surface: "#F3F7F4"
  accent: "#B89B60"
  text: "#183E35"
  muted: "#5F746A"
  border: "#DCE5DF"
  danger: "#A02D3A"
typography:
  sans:
    fontFamily: "Manrope, Arial, sans-serif"
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.5rem"
  lg: "1.25rem"
spacing:
  section-gap: "5rem"
  page-max: "80rem"
components:
  button:
    minHeight: "44px"
  card:
    imageRatio: "4 / 3"
  input:
    minHeight: "48px"
---

# Monasebty design system

## Current beta scope

Laayoune only, frontend only. This decision supersedes earlier all-Morocco and database-backed plans. Public business records live in `eazywed/src/data/laayoune.js`. No backend process or Atlas connection is used. Unknown prices, reviews and discounts remain unknown. CinematicHero restores the first full-width wedding-photo concept; HeroOffers owns the rotating service-highlight ribbon below it. BetaVendorDetails owns source-backed details. See UX-CONTRACT.md.

## Overview

The reference world is a garden wedding invitation: botanical green, delicate serif lettering and evocative photographs. The signature is an editorial photo composition with a useful search panel beneath it. Product screens remain quieter and task-focused.

Audience: couples and families planning weddings in Laayoune. Brand: Monasebty. English, French and Arabic interfaces; Arabic uses RTL. Hybrid register: expressive homepage, practical catalog and details. No location selector for this single-city beta.

## Token ownership/runtime mapping

This document describes the runtime source of truth, `eazywed/src/styles/experience.css` :root --ew-* tokens. --ew-forest and --ew-ink map primary/text; --ew-sage and --ew-surface map surface; --ew-gold and --ew-accent map accent. Agents must update this document and runtime together.

## Typography and layout

Cormorant Garamond for Latin editorial headings, Manrope for Latin controls/body. Arabic uses locally bundled Alexandria Variable for headings and the wordmark, and IBM Plex Sans Arabic for body and controls. The --ew-arabic-display and --ew-arabic-body tokens in experience.css own these families; arabic.css maps them to the active locale. Arabic display weights are 500–650, body weights 400–700. Use upright letters, natural spacing and generous line height. Official business names and phone numbers keep their original format using bidi isolation. Both discovery grids use 3 columns on wide desktops, 2 at middle widths and 1 on phones. No fixed-height content that clips text.

## Brand signature

The custom mark pairs a Moroccan arch with linked wedding rings, in forest and gold. Its canonical asset is public/brand/monasebty-mark.svg, shared by Brand.jsx in the header and footer. The favicon uses the same drawing on forest. The wordmark is bilingual: Arabic leads in the Arabic locale, Latin in English/French. Brand.css owns logo geometry; avoid substituting library icons or applying page-level brand overrides.

## Shapes and depth

8px controls, 12–20px panels, circular icon buttons only. Use borders for utility, soft tinted shadow for floating search. Photography provides depth; avoid excessive gradients and decorative cards.

## Components and states

Shared Navbar/Footer/SearchBar/ServiceCard are canonical. Buttons have 44px targets, hover/focus/pressed/disabled states. Photos reserve aspect ratio and load lazily except hero. Each of the six listings owns a distinct inspiration asset, keyed by business id in weddingInspiration.js; do not repeat one category image across multiple cards. Cards are links, save action is a separate button. Empty/error states explain recovery. Category/sort menus use the shared authored SelectField primitive. LanguageSwitch uses three compact, native buttons (FR / ع / EN), with a clear selected state and full native accessible names. It has no dropdown. SelectField is the shared Radix owner for category and sort menus, with a popup matching trigger width and viewport collision handling. Dialog uses native dialog semantics with focus restoration and Escape. Toasts use the existing provider; critical errors remain inline.

## Motion and accessibility

160–220ms feedback, no parallax. Respect prefers-reduced-motion. Focus uses a visible gold/green ring, text labels accompany important icons. Global scrollbar track/thumb styles cover all owned scrollers. White-on-forest primary actions; gold is an accent rather than small text on white.

## Content

Use plain sentence case and honest vendor data. No invented prices, trust badges, transaction counts or testimonials. Real Moroccan wedding photos on cards are explicitly labelled inspiration, separate from business photo data. Photo sources remain one click away. No fake WhatsApp or booking action. Backend and dormant admin operations remain untouched.

## Localization ownership

`src/i18n/locales/fr.json` and `ar.json` contain translated messages and vendor descriptions. English source strings are the fallback. `LocaleProvider` owns language selection, interpolation, number formatting and document lang/dir. `LanguageSwitch` is the canonical direct language-button group. The language preference stays on this device under `monasebty-language`. Keep category values and URL filters language independent. Arabic/French search aliases live in the local data module.

## Do / don't

Keep search, categories and quote enquiries prominent. Keep filter state shareable. Do not make users sign in to browse. Do not add unsupported business policies or obscure unavailable features.

## Mobile app shell and business callouts

At phone widths (600px and below), MobileNavigation owns a fixed safe-area-aware bottom bar with Home, Explore, Saved and Help. The header becomes a compact sticky brand/language bar; duplicate saved and hamburger actions are hidden. Main content reserves bottom-bar space. The shorter photo hero keeps the first selected desktop design. A web manifest and original 192px/512px icons support browser home-screen use; the beta requires an internet connection.

BusinessCallout owns the homepage and About-page professional callout. Its scoped CTA uses a forest background with white text and logical grid spacing in both directions. Page CSS must not override this shared button.
