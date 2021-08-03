const Price = require("./Price");

class PricingScheme {
  constructor (billingCycle, data) {
    /**
     * The billing cycle that instantiated this pricing scheme.
     * 
     * @type {BillingCycle}
     */
    this.billingCycle = billingCycle;

    /**
     * The version of this pricing scheme.
     */
    this.version = data.version;

    /**
     * The fixed price for this scheme.
     * 
     * @type {Price}
     */
    this.fixedPrice = data.fixed_price ? new Price(data.fixed_price) : null;

    /**
     * The create time for this pricing scheme.
     * 
     * @type {Date}
     */
    this.createTime = data.create_time ? new Date(data.create_time) : null;

    /**
     * The time this scheme was last updated at.
     * 
     * @type {Date}
     */
    this.updateTime = data.update_time ? new Date(data.update_time) : null;
  }
}

module.exports = PricingScheme;
