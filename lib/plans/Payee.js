const DisplayData = require("./DisplayData");

class Payee {
  constructor (data) {
    /**
     * The id of the merchant.
     * 
     * @type {string}
     */
    this.merchantId = data.merchant_id || null;

    /**
     * The display data for this payee.
     * 
     * @type {DisplayData}
     */
    this.displayData = data.display_data ? new DisplayData(data.display_data) : null;
  }
}

module.exports = Payee;
