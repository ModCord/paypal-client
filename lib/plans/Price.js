class Price {
  constructor (data) {
    /**
     * The currency code for this price.
     * 
     * @type {string}
     */
    this.currencyCode = data.currency_code;

    /**
     * The value for this price.
     * 
     * @type {string}
     */
    this.value = data.value;
  }
}

module.exports = Price;
