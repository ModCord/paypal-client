class PlanTemplate {
  constructor () {
    this.productId = null;
    this.name = null;
    this.status = "CREATED";
    this.description = null;
    this.billing_cycles = [];
    this.payment_preferences = {};
    this.taxes = {};
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
  
  enforceLength (value, minLength, maxLength, name) {
    if (value && (value.length > maxLength || value.length < minLength )) throw new Error(`The length for ${name} must be between ${minLength} and ${maxLength.toLocaleString()}.`);
  }
}

module.exports = PlanTemplate;
