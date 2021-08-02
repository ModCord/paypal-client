const Price = require("./Price");

class PaymentPreferences {
  constructor (data) {
    /**
     * The service type preference.
     * 
     * @type {string}
     */
    this.serviceType = data.service_type || null;

    /**
     * Whether to bill outstanding automatically preference.
     * 
     * @type {boolean}
     */
    this.autoBillOutstanding = data.auto_bill_outstanding || null;

    /**
     * The setup fee perference.
     * 
     * @type {Price}
     */
    this.setupFee = data.setup_fee ? new Price(data.setup_fee) : null;

    /**
     * The setup fee failure action preference.
     * 
     * @type {string}
     */
    this.setupFeeFailureAction = data.setup_fee_failure_action || null;

    /**
     * Payment failure threshold preference.
     * 
     * @type {number}
     */
    this.paymentFailureThreshold = data.payment_failure_threshold || null;
  }
}

module.exports = PaymentPreferences;
