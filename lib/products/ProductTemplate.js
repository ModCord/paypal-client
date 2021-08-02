const productTypes = require("../utils/productTypes");
const { URL } = require("url");

class ProductTemplate {
  constructor () {
    /**
     * The id of the future product.
     * 
     * @type {string}
     */
    this.id = null;

    /**
     * The name of the future product.
     * 
     * @type {string}
     */
    this.name = null;

    /**
     * The description of the future product.
     * 
     * @type {string}
     */
    this.description = null;

    /**
     * The type of the future product: PHYSICAL, DIGITAL or SERVICE.
     * 
     * @type {string}
     */
    this.type = null;

    /** 
     * The category of the future product.
     * 
     * @type {string}
     * @see {@link https://developer.paypal.com/docs/api/catalog-products/v1/#definition-product_request}
     */
    this.category = null;

    /**
     * The image url of the future product.
     * 
     * @type {string}
     */
    this.imageUrl = null;

    /**
     * The home url of the future product.
     * 
     * @type {string}
     */
    this.homeUrl = null;
  }

  setId (id) {
    if (id && (id.length > 50 || id.length < 6)) throw new RangeError("The length of the product ID must be between 6 and 50.");
    this.id = id;
    return this;
  }

  setName (name) {
    if (!name || (name && (name.length > 127 || name.length < 1))) throw new RangeError("The length of the product name must be between 1 and 127.");
    this.name = name;
    return this;
  }

  setDescription (description) {
    if (description && (description.length > 127 || description.length < 1)) throw new RangeError("The length of the product name must be between 1 and 127.");
    this.description = description;
    return this;
  }

  setType (type) {
    if (!type || !productTypes.includes(type.toUpperCase())) throw new TypeError(`The product type must match one of the following ${productTypes.join(", ")}.`);
    this.type = type.toUpperCase();
    return this;
  }

  setCategory (category) {
    if (!category || (category.toUpperCase() !== category)) throw new TypeError("The product type must match one of these categories, see: https://developer.paypal.com/docs/api/catalog-products/v1/#definition-product_request");
    this.category = category;
    return this;
  }

  setImageUrl (url) {
    try {
      url = new URL(url);
    } catch (err) {
      throw new TypeError("The image url must be a valid URL.");
    }
    if (url.href.length > 2000) throw new RangeError("The product urls must be of length 1 through 2000");
    this.imageUrl = url.href;
    return this;
  }

  setHomeUrl (url) {
    try {
      url = new URL(url);
    } catch (err) {
      throw new TypeError("The home url must be a valid URL.");
    }
    if (url.href.length > 2000) throw new RangeError("The product urls must be of length 1 through 2000");
    this.homeUrl = url.href;
    return this;
  }

  toJSON () {
    if (!this.name || !this.type) throw new Error("Name and type of the product are required.");
    const payload = {
      name: this.name,
      type: this.type,
    };
    if (this.id) payload.id = this.id;
    if (this.description) payload.description = this.description;
    if (this.category) payload.category = this.category;
    if (this.imageUrl) payload.image_url = this.imageUrl;
    if (this.homeUrl) payload.home_url = this.homeUrl;
    return JSON.stringify(payload);
  }
}

module.exports = ProductTemplate;
