class Price {
  constructor (data) {
    /**
     * The currency code for this price.
     * 
     * @type {string}
     */
    this.currencyCode = data.currency_code || null;

    /**
     * The value for this price.
     * 
     * @type {string}
     */
    this.value = data.value || null;
  }
}

module.exports = Price;
