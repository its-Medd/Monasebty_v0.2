import test from "node:test";
import assert from "node:assert/strict";
import { normalizeServiceRequest } from "../middleware/serviceNormalizer.js";
import { normalizeVendorRequest } from "../middleware/vendorNormalizer.js";

test("serviceNormalizer ignores unknown/prototype pollution fields in details", () => {
  const req = {
    headers: { "content-type": "multipart/form-data" },
    body: {
      category: "Wedding Venues",
      name: "Grand Ballroom",
      "details[__proto__]": "polluted",
      "details[constructor]": "polluted",
      "details[prototype]": "polluted",
      "details[malicious_prop]": "evil",
      "details[venue_type]": "Hall",
      "details[amenities][]": ["Decor", "Sound"],
    },
  };
  const res = {};
  normalizeServiceRequest(req, res, () => {});

  assert.equal(req.normalizedBody.details.__proto__, Object.prototype);
  assert.equal(req.normalizedBody.details.constructor, Object);
  assert.equal(req.normalizedBody.details.malicious_prop, undefined);
  assert.equal(req.normalizedBody.details.venue_type, "Hall");
  assert.deepEqual(req.normalizedBody.details.amenities, ["Decor", "Sound"]);
});

test("vendorNormalizer ignores unknown/prototype pollution fields in vendorRequest", () => {
  const req = {
    headers: { "content-type": "multipart/form-data" },
    body: {
      phone: "+212600000000",
      "vendorRequest[__proto__]": "polluted",
      "vendorRequest[constructor]": "polluted",
      "vendorRequest[evil_field]": "attack",
      "vendorRequest[brand_name]": "Best Studio",
      "vendorRequest[category]": "photographers",
    },
  };
  const res = {};
  normalizeVendorRequest(req, res, () => {});

  assert.equal(req.normalizedBody.vendorRequest.evil_field, undefined);
  assert.equal(req.normalizedBody.vendorRequest.brand_name, "Best Studio");
  assert.equal(req.normalizedBody.vendorRequest.category, "Photographers");
});
