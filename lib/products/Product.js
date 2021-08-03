const patchableFields = [
  "/description",
  "/category",
  "/image_url",
  "/home_url"
];

class Product {
  constructor (client, manager, data) {
    /**
     * The client that instantiated this manager.
     * 
     * @type {Client}
     */
    this.client = client;

    /**
     * The manager that instantiated this product.
     * 
     * @type {ProductManager}
     */
    this.manager = manager;

    /**
     * The id of this product.
     * 
     * @type {string}
     */
    this.id = data.id || null;

    /**
     * The name of this product.
     * 
     * @type {string}
     */
    this.name = data.name || null;

    /**
     * The description for this product.
     * 
     * @type {string}
     */
    this.description = data.description || null;

    /**
     * The type of this product.
     * 
     * @type {string}
     */
    this.type = data.type || null;

    /**
     * The category of this product.
     * 
     * @type {string}
     */
    this.category = data.category || null;

    /**
     * The url of the image of this product.
     * 
     * @type {string}
     */
    this.imageUrl = data.image_url || null;

    /**
     * The home url of this product.
     * 
     * @type {string}
     */
    this.homeUrl = data.home_url || null;

    /**
     * The time of the creation of this product.
     * 
     * @type {Date}
     */
    this.createTime = data.create_time ? new Date(data.create_time) : null;

    /**
     * The time this product was last updated.
     * 
     * @type {Date}
     */
    this.updateTime = data.update_time ? new Date(data.update_time) : null;
  }

  async update ({ description, category, imageUrl, homeUrl }) {
    const patchPayload = [];

    if (description) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[0],
        value: description
      });
    }

    if (category) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[1],
        value: category
      });
    }

    if (imageUrl) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[2],
        value: imageUrl
      });
    }

    if (homeUrl) {
      patchPayload.push({
        op: "replace",
        path: patchableFields[3],
        value: homeUrl
      });
    }

    const patchResponse = await this.client.request("PATCH", `/v1/catalogs/products/${this.id}`, {}, {}, patchPayload);
    if (patchResponse.statusCode === 204) {
      if (patchPayload.find(op => op.path === patchableFields[0])) this.description = description;
      if (patchPayload.find(op => op.path === patchableFields[1])) this.category = category;
      if (patchPayload.find(op => op.path === patchableFields[2])) this.imageUrl = imageUrl;
      if (patchPayload.find(op => op.path === patchableFields[3])) this.homeUrl = homeUrl;
      return true;
    } else {
      return patchResponse.json || false;
    }
  }
}

module.exports = Product;
