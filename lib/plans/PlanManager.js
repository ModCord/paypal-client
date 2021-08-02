const Collection = require("@modcord/collection");

class PlanManager {
  constructor (client) {
    this.client = client;
    this.cache = new Collection();
  }

  async fetchBulk ({ plan_ids = [], product_id, page_count = 1 } = {}) {
    this.client.enforceLength(plan_ids, 10, "plan_ids");
    this.client.enforceLength(plan_ids.join(","), 270, "plan_ids");
    this.client.enforceLength(product_id, 50, "product_id");

    const queryParameters = {
      total_required: true,
      page_size: 20,
    };

    if  (plan_ids && Array.isArray(plan_ids)) queryParameters.plan_ids = plan_ids.join(",");
    if (product_id) queryParameters.product_id = product_id;

    const plans = new Collection();
    
    for (let page = 1; page <= page_count; page++) {
      const fetchResponse = await this.client.request("GET", "/v1/billing/plans", Object.assign(queryParameters, { page }), { "Prefer": "return=representation" });
      if (!fetchResponse) return;
      console.log(fetchResponse.json.plans[0]);
    }
  }
}

module.exports = PlanManager;
