const Collection = require("@modcord/collection");
const Plan = require("./Plan");

class PlanManager {
  constructor (client) {
    this.client = client;
    this.cache = new Collection();
  }

  async fetchBulk ({ plan_ids = [], product_id, page_count = 1, all = false } = {}) {
    this.client.enforceLength(plan_ids, 10, "plan_ids");
    this.client.enforceLength(plan_ids.join(","), 270, "plan_ids");
    this.client.enforceLength(product_id, 50, "product_id");

    const queryParameters = {
      total_required: true,
      page_size: 20,
    };

    if  (plan_ids && Array.isArray(plan_ids)) queryParameters.plan_ids = plan_ids.join(" ");
    if (product_id) queryParameters.product_id = product_id;

    const fetchedPlans = new Collection();

    for (let page = 1; page <= page_count; page++) {
      const fetchResponse = await this.client.request("GET", "/v1/billing/plans", Object.assign(queryParameters, { page }), { "Prefer": "return=representation" });
      if (!fetchResponse || !fetchResponse.json || !fetchResponse.json.plans || !fetchResponse.json.plans.length) break;

      if (page_count > fetchResponse.json.total_pages) page_count = fetchResponse.json.total_pages;
      else if (all && page === 1) page_count = fetchResponse.json.total_pages;

      for (const plan of fetchResponse.json.plans) {
        const instance = new Plan(this.client, plan);
        fetchedPlans.set(instance.id, instance);
        if (this.client.keep_cache) this.cache.set(instance.id, instance);
      }
    }

    return fetchedPlans;
  }

  async fetch (plan_id, bypassCache) {
    if (!plan_id) throw new Error("You must specify a plan id when fetching a plan.");
    this.client.enforceLength(plan_id, 27, "plan_id");

    if (!bypassCache && this.client.keep_cache && this.cache.has(plan_id)) return this.cache.get(plan_id);

    const fetchResponse = await this.client.request("GET", `/v1/billing/plans/${plan_id}`, {}, { "Prefer": "return=representation" });
    if (!fetchResponse || fetchResponse.statusCode === 404 || !fetchResponse.json) throw new Error("PayPalAPIError: PLAN_NOT_FOUND\n\nThe requested plan was not found.");

    const planInstance = new Plan(this.client, fetchResponse.json);
    if (this.client.keep_cache) this.cache.set(planInstance.id, planInstance);

    return planInstance;
  }
}

module.exports = PlanManager;
