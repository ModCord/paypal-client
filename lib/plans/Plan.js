const BillingCycle = require("./BillingCycle");
const PaymentPreferences = require("./PaymentPreferences");
const Taxes = require("./Taxes");
const Payee = require("./Payee");

class Plan {
  constructor (client, data) {
    /**
     * The client that instantiated this plan.
     * 
     * @type {Client}
     */
    this.client = client;

    /**
     * The id for this plan.
     * 
     * @type {string}
     */
    this.id = data.id || null;

    /**
     * The version for this plan.
     * 
     * @type {number}
     */
    this.version = data.version || null;

    /**
     * The name for this plan.
     * 
     * @type {string}
     */
    this.name = data.name || null;

    /**
     * The status of this plan.
     * 
     * @type {string}
     */
    this.status = data.status || null;

    /**
     * The description for this plan.
     * 
     * @type {string}
     */
    this.usage_type = data.usage_type || null;

    /**
     * The billing cycles for this plan.
     * 
     * @type {BillingCycle[]}
     */
    this.billingCycles = data.billing_cycles ? data.billing_cycles.map(cycle => new BillingCycle(this, cycle)) : null;
 
    /**
     * The payment preferences for this plan.
     * 
     * @type {PaymentPreferences}
     */
    this.paymentPreferences = data.payment_preferences ? new PaymentPreferences(data.payment_preferences) : null;

    /**
     * The taxes for this plan.
     * 
     * @type {Taxes}
     */
    this.taxes = data.taxes ? new Taxes(data.taxes) : null;

    /**
     * The payee for this plan.
     * 
     * @type {Payee}
     */
    this.payee = data.payee ? new Payee(data.payee) : null;

    /**
     * The time of creation for this plan.
     * 
     * @type {Date}
     */
    this.createTime = new Date(data.create_time) || null;

    /**
     * The time this plan was last updated.
     * 
     * @type {Date}
     */
    this.updateTime = new Date(data.update_time) || null;
  }
}

module.exports = Plan;
