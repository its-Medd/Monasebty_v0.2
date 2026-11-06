import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BETA_MODE,
  BETA_CITY,
  vendors,
  queryVendors,
  findVendor,
} from "../src/data/laayoune.js";
test("beta is a frontend-only Laayoune directory with sourced real entries", () => {
  assert.equal(BETA_MODE, true);
  assert.equal(BETA_CITY, "Laayoune");
  assert.equal(vendors.length, 6);
  assert.equal(new Set(vendors.map((v) => v.id)).size, 6);
  for (const v of vendors) {
    assert.equal(v.city, "Laayoune");
    assert.ok(v.sourceUrl.startsWith("https://"));
    assert.equal(v.checkedAt, "2026-11-05");
    assert.equal(v.price, null);
    assert.equal(v.rating, null);
    assert.equal(v.discount, null);
    assert.equal(v.image, null);
  }
});
test("search and category combine without inventing results", () => {
  assert.equal(
    queryVendors("Catering", { query: "Machawi" }).data[0].title,
    "Machawi Dajaj",
  );
  assert.equal(
    queryVendors("Photographers", { query: "Machawi" }).pagination.total,
    0,
  );
  assert.equal(queryVendors("all", { city: "Marrakech" }).pagination.total, 0);
  assert.equal(queryVendors("all", { city: "Laayoune" }).pagination.total, 6);
});
test("directory search handles accents and case", () => {
  assert.equal(
    queryVendors("all", { query: "video asila" }).data[0].title,
    "Club Vidéo Asila",
  );
  assert.equal(
    queryVendors("all", { query: "DIAFA" }).data[0].title,
    "Espace Laâyoune Diafa",
  );
});
test("Arabic and French searches find the same local service categories", () => {
  assert.equal(
    queryVendors("all", { query: "قاعات الأفراح" }).pagination.total,
    1,
  );
  assert.equal(queryVendors("all", { query: "تموين" }).pagination.total, 3);
  assert.equal(queryVendors("all", { query: "تصوير" }).pagination.total, 2);
  assert.equal(queryVendors("all", { query: "traiteurs" }).pagination.total, 3);
  assert.equal(
    queryVendors("all", { query: "photographes" }).pagination.total,
    2,
  );
});
test("Arabic business aliases tolerate accents and diacritics", () => {
  assert.equal(
    queryVendors("all", { query: "ضيافة" }).data[0].id,
    "laayoune-diafa",
  );
  assert.equal(
    queryVendors("all", { query: "تاج العَرُوس" }).data[0].id,
    "laayoune-taj-el-aarouss",
  );
  assert.equal(
    queryVendors("all", { query: "اصيلة" }).data[0].id,
    "laayoune-video-asila",
  );
  assert.equal(
    queryVendors("Catering", { query: "الشباب" }).pagination.total,
    0,
  );
});
test("alphabetical sorting happens before pagination", () => {
  const all = queryVendors("all", { sort: "name" }).data;
  const second = queryVendors("all", { sort: "name", limit: 2, page: 2 });
  assert.deepEqual(
    second.data.map((v) => v.id),
    all.slice(2, 4).map((v) => v.id),
  );
  assert.equal(second.pagination.total, 6);
});
test("unverified discounts and prices never become bookable offers", () => {
  assert.equal(queryVendors("all", { discounted: "true" }).pagination.total, 0);
  assert.equal(queryVendors("all", { budgetMax: "10000" }).pagination.total, 0);
  assert.equal(findVendor("demo-venue"), undefined);
});
