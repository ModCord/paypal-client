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
}

module.exports = Product;
