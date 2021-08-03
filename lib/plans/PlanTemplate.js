const { codes } = require("../utils/currencyCodes");

class PlanTemplate {
  constructor () {
    this.productId = null;
    this.name = null;
    this.status = "CREATED";
    this.description = null;
    this.billingCycles = [];
    this.paymentPreferences = {};
    this.taxes = {
      percentage: 0,
      inclusive: false
    };
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
      if (isNaN(Number(value))) throw new Error("The setup fee value must be a number.");
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

    return this;
  }

  /**
   * Adds another pricing cycle.
   * 
   * @param {object} pricingScheme - The pricing scheme object with version, fixedPrice object, pricingModel and tiers array. 
   * @param {object} frequency - The frequency object with intervalUnit and intervalCount. 
   * @param {string} tenureType - [REGULAR, TRIAL] The tenure type for this billing cycle. 
   * @param {number} sequence - [0, 999] The sequence number for this billing cycle.
   */
  addBillingCycle ({ fixedPrice, pricingModel, tiers  } = {}, { intervalUnit, intervalCount } = {}, tenureType = "REGULAR", sequence = 1, totalCycles = 0) {
    const billingCycleObject = {
      pricing_scheme: {},
      frequency: {},
    };

    const { currencyCode, value } = fixedPrice;
    if (!codes.includes(currencyCode)) throw new Error("Invalid fixed price currency code.");
    if (isNaN(Number(value))) throw new Error("The fixed price value must be a number.");
    billingCycleObject.pricing_scheme.fixed_price = {
      currency_code: currencyCode,
      value
    };

    if (pricingModel) {
      if (!["VOLUME", "TIERED"].includes(pricingModel))  throw new Error("The pricing model must be either VOLUME or TIERED.");
      if (pricingModel === "TIERED" && !Array.isArray(tiers)) throw new Error("With the tiered pricing model you must include the tiers array.");
      billingCycleObject.pricing_scheme.pricing_model = pricingModel;

      if (pricingModel === "TIERED") {
        billingCycleObject.pricing_scheme.tiers = [];
        for (const tier of tiers)  {
          const formatedTier = {};
          if (!tier.startingQuantity) throw new Error("The starting quantity for the tier must be specified.");
          formatedTier.starting_quantity = tier.startingQuantity;
          if (!tier.amount || !tier.amount.currencyCode  || !codes.includes(tier.amount.currencyCode) || isNaN(Number(tier.amount.value))) throw new Error("The price amount for the tier must be specified.");
          formatedTier.amount = {
            currency_code: tier.amount.currencyCode,
            value: tier.amount.value
          };
          if (tier.endingQuantity) formatedTier.ending_quantity = tier.endingQuantity;
          billingCycleObject.pricing_scheme.tiers.push(formatedTier);
        }
      }
    }

    if (!["DAY", "MONTH", "WEEK", "YEAR"].includes(intervalUnit)) throw new Error("You have to provide a frequency interval unit: DAY, WEEK, MONTH, YEAR");
    billingCycleObject.frequency.interval_unit = intervalUnit;

    if (isNaN(Number(intervalCount))) throw new Error("You must specify a number of interval units for this frequency for this billing cycle.");
    const maxCount = {
      "DAY": 365,
      "WEEK": 52,
      "MONTH": 12,
      "YEAR": 1
    };
    if (maxCount[intervalUnit] < intervalCount) throw new Error("You must specify an interval count maximum of: DAY - 365, WEEK - 52, MONTH - 12, YEAR - 1");
    billingCycleObject.frequency.interval_count = intervalCount;

    if (!["TRIAL", "REGULAR"].includes(tenureType)) throw new Error("Billing cycle tenure type must either be TRIAL or REGULAR");
    if (this.billingCycles.filter(cycle => cycle.tenure_type === "TRIAL").length > 1) throw new Error("You can only have up to 2 TRIAL billing cycles per plan.");
    billingCycleObject.tenure_type = tenureType;

    this.enforceNumberSize(sequence, 1, 99, "sequence");
    if (this.billingCycles.find(cycle => cycle.sequence === sequence)) throw new Error("You can have only one billing cycle with the same sequence number");
    
    if (totalCycles) this.enforceNumberSize(totalCycles, 0, 999, "totalCycles");
    billingCycleObject.total_cycles = totalCycles;

    this.billingCycles.push(billingCycleObject);
  }

  enforceNumberSize (value, minLength,  maxLength, name) {
    if (isNaN(Number(value)) || value < minLength || value > maxLength) throw new Error(`${name} must be a number between ${minLength} and ${maxLength}.`);
  }

  enforceLength (value, minLength, maxLength, name) {
    if (value && (value.length > maxLength || value.length < minLength )) throw new Error(`The length for ${name} must be between ${minLength} and ${maxLength.toLocaleString()}.`);
  }

  toJSON () {
    if (!this.productId || !this.name || !this.billingCycles.length || !Object.keys(this.paymentPreferences).length) throw new Error("Incomplete plan template.");
    const jsonObject = {
      product_id: this.productId,
      name: this.name,
      billing_cycles: this.billingCycles,
      payment_preferences: this.paymentPreferences
    };

    if (this.description) jsonObject.description = this.description;
    if (this.status) jsonObject.status = this.status;
    if ([true, false].includes(this.quantitySupported)) jsonObject.quantity_supported = this.quantitySupported;

    return jsonObject;
  }
}

module.exports = PlanTemplate;
