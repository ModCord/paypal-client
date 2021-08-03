const PricingScheme = require("./PricingScheme");
const Frequency = require("./Frequency");

class BillingCycle {
  constructor (plan, data) {
    /**
     * The plan that instantiated this billing cycle.
     * 
     * @type {Plan}
     */
    this.plan = plan;

    /**
     * The pricing scheme for this cycle.
     * 
     * @type {PricingScheme}
     */
    this.pricingScheme = data.pricing_scheme ? new PricingScheme(this, data.pricing_scheme) : null;

    /**
     * The frequency for this billing cycle.
     * 
     * @type {Frequency}
     */
    this.frequency = data.frequency ? new Frequency(this, data.frequency) : null;

    /**
     * The tenure type for this billing cycle.
     * 
     * @type {string}
     */
    this.tenureType = data.tenure_type;

    /**
     * The sequence number for this billing cycle.
     * 
     * @type {number}
     */
    this.sequence = data.sequence;

    /**
     * The amount of cycles for this billing cycle.
     * 
     * @type {number}
     */
    this.totalCycles = data.total_cycles;
  }
}

module.exports = BillingCycle;
