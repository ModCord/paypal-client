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