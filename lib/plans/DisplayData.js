class DisplayData {
  constructor (data) {
    /**
     * The business email.
     */
    this.businessEmail = data.business_email || null;
  }
}

module.exports = DisplayData;
