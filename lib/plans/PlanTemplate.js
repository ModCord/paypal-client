const { codes } = require("../utils/currencyCodes");

class PlanTemplate {
  constructor () {
    this.productId = null;
    this.name = null;
    this.status = "CREATED";
    this.description = null;
    this.billingCycles = [];
    this.paymentPreferences = {};
    this.taxes = null;
    this.quantitySupported = false;
  }

  /**
   * Sets the product id for the new plan.
   * 
   * @param {string} id [6, 50] The product id for the plan.
   * @returns {PlanTemplate} The same object. 
   */
  setProductId (id) {
    this.enforceLength(id, 6, 50, "product_id");
    this.productId = id;
    return this;
  }

  /**
   * Sets the name for this plan.
   * 
   * @param {string} name - [1, 127] The name for this plan.
   * @returns {PlanTemplate} The same object.
   */
  setName (name) {
    this.enforceLength(name, 1, 127, "name");
    this.name = name;
    return this;
  }

  /**
   * Optionally, the status for this plan.
   * 
   * @param {string} status - [CREATED, ACTIVE] The status.
   * @returns {PlanTemplate} The same object.
   */
  setStatus (status = "") {
    if (!["CREATED", "ACTIVE"].includes(status.toUpperCase())) throw new Error("You must specify a plan status of CREATED or ACTIVE when creating it.");
    this.status = status;
    return this;
  }
  
  /**
   * Sets the description for this plan.
   * 
   * @param {string} description - [1, 127] The description for this plan.
   * @returns {PlanTemplate} The same object.
   */
  setDescription (description) {
    this.enforceLength(description, 1, 127, "description");
    this.description = description;
    return this;
  }

  /**
   * Sets the taxes for this plan.
   * 
   * @param {number} percentage - [0, 100] The tax percentage on the billing amount.
   * @param {boolean} inclusive - Indicates whether the tax was already included in the billing amount.
   * @returns {PlanTemplate} The same object.
   */
  setTaxes (percentage, inclusive) {
    if (isNaN(Number(percentage)) || percentage < 0 || percentage > 100) throw new Error("The tax percentage must be 0-100%");
    if (![true, false].includes(inclusive)) throw new Error("The tax inclusivity must be specified true or false.");
    this.taxes = {
      percentage: String(percentage),
      inclusive 
    };
    return this;
  }

  /**
   * Sets whether the quantity can be entered or not when checking out.
   * 
   * @param {boolean} isQuantitySupported The value to which to set.
   * @returns {PlanTemplate} The same object.
   */
  setQuantitySupported (isQuantitySupported) {
    if (![true, false].includes(isQuantitySupported)) throw new Error("The quantity inclusion must be specified true or false.");
    this.quantitySupported = isQuantitySupported;
    return this;
  }

  /**
   * Sets up the payment preferences.
   * 
   * @param {object} perferences - An object with the preferences: autoBillOutstanding, setupFee, setupFeeFailureAction and paymentFailureThreshold. 
   * @return {PlanTemplate} The same object.
   */
  setPaymentPreferences ({ autoBillOutstanding = true, setupFee = {}, setupFeeFailureAction = "CANCEL", paymentFailureThreshold = 0 }) {
    if (![true, false].includes(autoBillOutstanding)) throw new Error("The quantity inclusion must be specified true or false.");
    this.paymentPreferences.auto_bill_outstanding = autoBillOutstanding;

    if (setupFee) {
      const { currencyCode, value } = setupFee;
      if (!codes.includes(currencyCode)) throw new Error("Invalid currency code.");
      if (!isNaN(Number(value))) throw new Error("The setup fee value must be a number.");
      this.paymentPreferences.setup_fee = {
        currency_code: currencyCode,
        value
      };
    } else {
      this.paymentPreferences.setup_fee = {};
    }

    if (!["CANCEL", "CONTINUE"].includes(setupFeeFailureAction)) throw new Error("The setup failure fee action must either be CANCEL or CONTINUE.");
    this.paymentPreferences.setup_fee_failure_action = setupFeeFailureAction;

    if (isNaN(Number(paymentFailureThreshold)) || paymentFailureThreshold < 0 || paymentFailureThreshold > 999) throw new Error("paymentFailureThreshold must be between 0 and 999.");
    this.paymentPreferences.payment_failure_threshold = paymentFailureThreshold;
  }

  enforceLength (value, minLength, maxLength, name) {
    if (value && (value.length > maxLength || value.length < minLength )) throw new Error(`The length for ${name} must be between ${minLength} and ${maxLength.toLocaleString()}.`);
  }
}

module.exports = PlanTemplate;
