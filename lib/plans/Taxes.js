class Taxes {
  constructor (data) {
    /**
     * The percentage for this tax.
     * 
     * @type {number}
     */
    this.percentage = data.percentage ? Number(data.percentage) : null;

    /**
     * Whether the tax is inclusive.
     * 
     * @type {boolean}
     */
    this.inclusive = data.inclusive;
  }
}

module.exports = Taxes;
