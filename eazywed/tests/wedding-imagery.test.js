import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { vendors } from "../src/data/laayoune.js";
import { weddingInspiration } from "../src/data/weddingInspiration.js";

test("each listing has a different, attributed wedding inspiration photograph", () => {
  const paths = new Set();
  const photographs = new Set();
  for (const vendor of vendors) {
    const image = weddingInspiration[vendor.id];
    assert.ok(image, `Missing photograph for ${vendor.title}`);
    assert.ok(image.source.startsWith("https://"));
    assert.ok(image.credit.length > 10);
    const file = readFileSync(
      new URL(`../public${image.src}`, import.meta.url),
    );
    assert.ok(file.length > 10000, `Empty or low quality asset: ${image.src}`);
    paths.add(image.src);
    photographs.add(createHash("sha256").update(file).digest("hex"));
  }
  assert.equal(paths.size, vendors.length, "A photo path is repeated");
  assert.equal(photographs.size, vendors.length, "A photo file is repeated");
});
