const Collection = require("@modcord/collection");
const Product = require("./Product");
const ProductTemplate = require("./ProductTemplate");

class ProductManager {
  constructor (client) {
    this.client = client;
    this.cache = new Collection();
  }

  async fetchBulk ({ page_count = 1, all = false } = {}) {
    const queryParameters = {
      total_required: true,
      page_size: 20
    };

    const fetchedProducts = new Collection();

    for (let page = 1; page <= page_count; page++) {
      const fetchResponse = await this.client.request("GET", "/v1/catalogs/products", Object.assign(queryParameters, { page }), { "Prefer": "return=representation" });

      if (!fetchResponse || !fetchResponse.json || !fetchResponse.json.products || !fetchResponse.json.products.length) break;

      if (page_count > fetchResponse.json.total_pages) page_count = fetchResponse.json.total_pages;
      else if (all && page_count === 1) page_count = fetchResponse.json.total_pages;

      for (const plan of fetchResponse.json.products) {
        const instance = new Product(this.client, this, plan);
        fetchedProducts.set(instance.id, instance);
        if (this.client.keep_cache) this.cache.set(instance.id, instance);
      }
    }

    return fetchedProducts;
  }

  async fetch (product_id, bypassCache) {
    if (!product_id) throw new Error("You must specify a product id when fetching a product.");
    this.client.enforceLength(product_id, 27, "product_id");

    if (!bypassCache && this.client.keep_cache && this.cache.has(product_id)) return this.cache.get(product_id);

    const fetchResponse = await this.client.request("GET", `/v1/catalogs/products/${product_id}`, {}, { "Prefer": "return=representation" });
    if (!fetchResponse || fetchResponse.statusCode === 404 || !fetchResponse.json) throw new Error("PayPalAPIError: PLAN_NOT_FOUND\n\nThe requested plan was not found.");

    const instance = new Product(this.client, this, fetchResponse.json);
    if (this.client.keep_cache) this.cache.set(instance.id, instance);

    return instance;
  }

  async create (template) {
    if (!(template instanceof ProductTemplate)) throw new Error("Can only create products from a product template.");

    const templatePayload = JSON.parse(template.toJSON());
    const createResponse = await this.client.request("POST", "/v1/catalogs/products", {}, { "Prefer": "return=representation" }, templatePayload);

    if (createResponse.statusCode === 201) {
      const instance = new Product(this.client, this, createResponse.json);
      if (this.client.keep_cache) this.cache.set(instance.id, instance);
      return instance;
    } else {
      return createResponse.json;
    }
  }
}

module.exports = ProductManager;
