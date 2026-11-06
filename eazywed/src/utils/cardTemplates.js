const cardTemplatePath = (id) => {
  // Card template IDs are MongoDB ObjectIds, never URL paths or query strings.
  if (typeof id !== "string" || id.length !== 24 || !/^[0-9a-f]{24}$/i.test(id)) {
    throw new Error("Invalid card ID")
  }

  return `/vendor/dashboard/cards/${id}`
}

export const getCardTemplate = (api, id) => api.get(cardTemplatePath(id))

export const updateCardTemplate = (api, id, formData, config) =>
  api.put(cardTemplatePath(id), formData, config)
