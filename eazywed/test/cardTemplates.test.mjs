import assert from "node:assert/strict"
import { test } from "node:test"
import { getCardTemplate, updateCardTemplate } from "../src/utils/cardTemplates.js"

for (const id of ["507f1f77bcf86cd799439011", "507F1F77BCF86CD799439011"]) {
  test(`loads and updates the intended card endpoint for ${id}`, async () => {
    const calls = []
    const response = { data: { _id: id } }
    const api = {
      get: (...args) => { calls.push(["get", ...args]); return Promise.resolve(response) },
      put: (...args) => { calls.push(["put", ...args]); return Promise.resolve(response) },
    }
    const formData = new FormData()
    formData.append("name", "Wedding card")
    const config = { timeout: 120000 }

    assert.equal(await getCardTemplate(api, id), response)
    assert.equal(await updateCardTemplate(api, id, formData, config), response)
    assert.deepEqual(calls, [
      ["get", `/vendor/dashboard/cards/${id}`],
      ["put", `/vendor/dashboard/cards/${id}`, formData, config],
    ])
  })
}

test("rejects malformed and attacker-controlled IDs before sending any request", () => {
  let requests = 0
  const api = { get: () => requests++, put: () => requests++ }
  const validId = "507f1f77bcf86cd799439011"
  const invalidIds = [
    undefined, null, "", 123, {}, [validId], { toString: () => validId },
    validId.slice(1), `${validId}0`, "g".repeat(24),
    "../stats", "../../logout", "%2e%2e%2fstats", "%252e%252e%252fstats",
    "https://example.com/card", "//example.com/card", "..\\stats",
    `${validId}/../stats`, `${validId}?action=delete`, `${validId}#fragment`,
    `${validId}\n`, `${validId}\r\n`, ` ${validId}`, `${validId} `,
    `${validId}\0`, "ａ".repeat(24),
  ]

  for (const id of invalidIds) {
    assert.throws(() => getCardTemplate(api, id), /Invalid card ID/)
    assert.throws(() => updateCardTemplate(api, id, new FormData(), {}), /Invalid card ID/)
  }
  assert.equal(requests, 0)
})

test("preserves request failures for the editor's existing error handling", async () => {
  const error = new Error("Request failed")
  const api = { get: () => Promise.reject(error), put: () => Promise.reject(error) }
  const id = "507f1f77bcf86cd799439011"

  await assert.rejects(getCardTemplate(api, id), candidate => candidate === error)
  await assert.rejects(updateCardTemplate(api, id, new FormData(), {}), candidate => candidate === error)
})
