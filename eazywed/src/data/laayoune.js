// Frontend-only beta directory. No Atlas connection, seed, account, or booking writes.
// Public listing checks: 2026-11-05. Directory entries are not partner endorsements.
export const BETA_MODE = import.meta.env?.VITE_BETA_MODE !== "false";
export const BETA_CITY = "Laayoune";
export const BETA_CATEGORIES = ["Wedding Venues", "Catering", "Photographers"];
const directory = "https://www.annuaire-gratuit.ma/traiteur/_laayoune";
const photoDirectory =
  "https://www.yelo.ma/category/services_de_photographie/city:Laayoune";
export const vendors = [
  {
    id: "laayoune-taj-el-aarouss",
    title: "Salle Taj El Aarouss",
    category: "Wedding Venues",
    address: "N°119, Bloc G, Madinat El Wahda, Laayoune",
    phone: null,
    sourceUrl: "https://www.charika.ma/societe-salle-taj-el-aarouss-1238004",
    sourceName: "Charika business directory",
    description:
      "The public business record lists wedding and celebration organisation, with and without catering.",
    confirmationNote:
      "Contact details, reception capacity, current packages and availability have not been confirmed with the business.",
  },
  {
    id: "laayoune-machawi-dajaj",
    title: "Machawi Dajaj",
    category: "Catering",
    address: "593, lotissement El Amal 1, Laayoune 70000",
    phone: "+212699794527",
    sourceUrl: "https://www.kerix.net/fr/annuaire-entreprise/machawi-dajaj",
    sourceName: "Kerix business directory",
    description:
      "Publicly listed for occasion catering, event equipment rental and party-room rental.",
    confirmationNote:
      "Confirm whether the business can cater for your wedding date, guest count and menu.",
  },
  {
    id: "laayoune-afrah",
    title: "Traiteur Laayoune Afrah",
    category: "Catering",
    address: null,
    phone: "+212528893207",
    sourceUrl: directory,
    sourceName: "Annuaire Gratuit du Maroc",
    description:
      "A catering business listed in the Laayoune professional directory.",
    confirmationNote:
      "The directory does not publish a street address, menus or prices. Confirm the location and wedding services directly.",
  },
  {
    id: "laayoune-diafa",
    title: "Espace Laâyoune Diafa",
    category: "Catering",
    address: null,
    phone: "+212528890468",
    sourceUrl: directory,
    sourceName: "Annuaire Gratuit du Maroc",
    description: "A Laayoune business listed under catering services.",
    confirmationNote:
      "Ask about wedding catering, service area, menu options and current contact details before planning a visit.",
  },
  {
    id: "laayoune-photo-chabab",
    title: "Labo Photo Chabab",
    category: "Photographers",
    address: "46, avenue Jamal Eddine Al Afghani, Laayoune",
    phone: "+212667721112",
    sourceUrl: photoDirectory,
    sourceName: "Yelo Morocco photography directory",
    description: "A photography-services business listed in Laayoune.",
    confirmationNote:
      "Wedding coverage, recent portfolio, video services and delivery timelines need to be confirmed directly.",
  },
  {
    id: "laayoune-video-asila",
    title: "Club Vidéo Asila",
    category: "Photographers",
    address: "99, rue Berrechid, Laayoune",
    phone: "+212528892728",
    sourceUrl: photoDirectory,
    sourceName: "Yelo Morocco photography directory",
    description:
      "A local business listed in the Laayoune photography-services directory.",
    confirmationNote:
      "Ask whether wedding photography and video coverage are available. No packages or rates have been published in our sources.",
  },
].map((v) => ({
  ...v,
  city: BETA_CITY,
  type: "service",
  image: null,
  price: null,
  rating: null,
  reviewCount: null,
  discount: null,
  refundPolicy: "Not published",
  checkedAt: "2026-11-05",
}));
const categoryAliases = {
  "Wedding Venues":
    "قاعة قاعات الأفراح افراح اعراس أعراس حفلات salle salles mariage",
  Catering: "تموين ممون مموني حفلات traiteur traiteurs restauration",
  Photographers:
    "تصوير مصور مصورين فوتوغرافي فيديو photographes photographie photographe",
};
const nameAliases = {
  "laayoune-taj-el-aarouss": "تاج العروس قاعة تاج العروس",
  "laayoune-machawi-dajaj": "مشاوي الدجاج",
  "laayoune-afrah": "أفراح افراح العيون",
  "laayoune-diafa": "فضاء ضيافة العيون",
  "laayoune-photo-chabab": "مختبر صور الشباب شباب",
  "laayoune-video-asila": "نادي فيديو أصيلة أصيلا اصيلة اسيلة",
};
const normalized = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ـ/g, "")
    .replace(/[أإآ]/g, "ا")
    .toLowerCase();
export function queryVendors(category = "all", params = {}, entries = vendors) {
  const matched = entries.filter(
    (v) =>
      (!category || category === "all" || v.category === category) &&
      (!params.category ||
        params.category === "all" ||
        v.category === params.category) &&
      (!params.query ||
        normalized(
          `${v.title} ${v.category} ${v.description} ${categoryAliases[v.category] || ""} ${nameAliases[v.id] || ""}`,
        ).includes(normalized(params.query))) &&
      (!params.city ||
        String(params.city)
          .split(",")
          .some((c) => normalized(c) === normalized(BETA_CITY))) &&
      (!params.discounted || params.discounted !== "true" || v.discount) &&
      (!params.refundPolicy || params.refundPolicy === v.refundPolicy) &&
      !params.budgetMin &&
      !params.budgetMax,
  );
  if (params.sort === "name")
    matched.sort((a, b) => a.title.localeCompare(b.title, "fr-MA"));
  const page = Math.max(1, parseInt(params.page) || 1),
    limit = Math.max(1, Math.min(50, parseInt(params.limit) || 12));
  return {
    data: matched.slice((page - 1) * limit, page * limit),
    pagination: {
      total: matched.length,
      page,
      pages: Math.max(1, Math.ceil(matched.length / limit)),
    },
  };
}
export const findVendor = (id) => vendors.find((v) => v.id === id);
