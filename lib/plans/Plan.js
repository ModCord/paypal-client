const BillingCycle = require("./BillingCycle");
const PaymentPreferences = require("./PaymentPreferences");
const Taxes = require("./Taxes");
const Payee = require("./Payee");
const patchableFields = [
  "/description",
  "/taxes/percentage",
  "/payment_preferences/auto_bill_outstanding",
  "/payment_preferences/payment_failure_threshold",
  "/payment_preferences/setup_fee",
  "/payment_preferences/setup_fee_failure_action"
];
const Price = require("./Price");
const CURRENCY_CODES = require("../utils/currencyCodes");

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
     * The description for this plan.
     * 
     * @type {string}
     */
    this.description = data.description || null;

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

  async deactivate () {
    if (!["CREATED", "ACTIVE"].includes(this.status)) throw new Error("Cannot deactivate a non-active plan.");
    const deactivationRequest = await this.client.request("POST", `/v1/billing/plans/${this.id}/deactivate`, {}, {});
    if (deactivationRequest.statusCode === 204) {
      this.status = "INACTIVE";
      return true;
    }
    return false;
  }

  async activate () {
    if (this.status !== "INACTIVE") throw new Error("Cannot activate an active plan.");
    const activationRequest = await this.client.request("POST", `/v1/billing/plans/${this.id}/activate`, {}, {});
    if (activationRequest.statusCode === 204) {
      this.status = "ACTIVE";
      return true;
    }
    return false;
  }

  async update ({ description, taxes = {}, paymentPreferences = {} }) {
    const patchPayload = [];

    if (description) {
      this.client.enforceLength(description, 127, "description");
      patchPayload.push({
        op: "replace",
        path: patchableFields[0],
        value: description
      });
    }
    
    const { percentage } = taxes;
    if (percentage) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[1],
        value: percentage
      });
    }

    const { 
      autoBillOutstanding,
      paymentFailureThreshold,
      setupFee,
      setupFeeFailureAction
    } = paymentPreferences;

    if ([true, false].includes(autoBillOutstanding)) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[2],
        value: autoBillOutstanding
      });
    }

    if (paymentFailureThreshold) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[3],
        value: paymentFailureThreshold
      });
    }

    if (setupFee) {
      const currencyCode = setupFee.currencyCode || setupFee.currency_code;
      if (!CURRENCY_CODES.codes.includes(currencyCode)) throw new Error(`Invalid currency code provided, the only valid currency codes are: ${CURRENCY_CODES.entries.map(entry => `${entry[0]} - ${entry[1]}`).join(", ")}.`);
      patchPayload.push({
        op: "replace",
        path: patchableFields[4],
        value: {
          currency_code: currencyCode,
          value: setupFee.value
        }
      });
    }

    if (setupFeeFailureAction) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[5],
        value: setupFeeFailureAction
      });
    }
  
    const patchResponse = await this.client.request("PATCH", `/v1/billing/plans/${this.id}`, {}, {}, patchPayload);
    if (patchResponse.statusCode === 204) {
      if (patchPayload.find(op => op.path === patchableFields[0])) this.description = description;
      if (patchPayload.find(op => op.path === patchableFields[1])) this.taxes.percentage = percentage;
      if (patchPayload.find(op => op.path === patchableFields[2])) this.paymentPreferences.autoBillOutstanding = autoBillOutstanding;
      if (patchPayload.find(op => op.path === patchableFields[3])) this.paymentPreferences.paymentFailureThreshold = paymentFailureThreshold;
      if (patchPayload.find(op => op.path === patchableFields[4])) this.paymentPreferences.setupFee = setupFee instanceof Price ? setupFee : new Price(setupFee);
      if (patchPayload.find(op => op.path === patchableFields[5])) this.paymentPreferences.setupFeeFailureAction = setupFeeFailureAction;
      return true;
    }
    return patchResponse.json || false;
  }

  get canCreateSubscriptions () {
    return !["INACTIVE", "CREATED"].includes(this.status);
  }
}

module.exports = Plan;
