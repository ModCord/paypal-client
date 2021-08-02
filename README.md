# paypal-client
A PayPal HTTP API client, for internal use in ModCord.

# Updating a plan
Updating a plan, you can update any of the properties shown below.

```js
plan.update({
  paymentPreferences: {
    description: "The shiny new description!",
    taxes: {
      percentage: 10.5
    },
    autoBillOutstanding: true,
    paymentFailureThreshold: 4,
    setupFee: {
      currencyCode: "USD",
      value: 4.69
    },
    setupFeeFailureAction: "CANCEL"
  }
});
```

# Creating a product
Creating a plan, all of the template methods are shown below.

```js
const newProduct = new ProductTemplate()
  .setName("My New Product")
  .setDescription("A description for my new product.")
  .setType("DIGITAL")
  .setCategory("SOFTWARE")
  .setId("MY-VERY-OWN-ID")
  .setImageUrl("https://image.shutterstock.com/image-vector/new-item-sign-stamp-on-600w-1773071672.jpg")
  .setHomeUrl("https://google.com");

const myNewProduct = await paypalClient.products.create(newProduct);
```