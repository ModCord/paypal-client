class Frequency {
  constructor (billingCycle, data) {
    /**
     * The billing cycle that instantiated this frequency.
     * 
     * @type {BillingCycle}
     */
    this.billingCycle = billingCycle;

    /**
     * The interval unit for this frequency.
     * 
     * @type {string}
     */
    this.intervalUnit = data.interval_unit;

    /**
     * The interval count for this frequency.
     * 
     * @type {number}
     */
    this.intervalCount = data.intervalCount;
  }
}

module.exports = Frequency;
