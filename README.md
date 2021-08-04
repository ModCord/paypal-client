# paypal-client
A PayPal HTTP API client, for internal use in ModCord.

# Installing
To install the library, use the command below in your project directory.

```
npm install @modcord/paypal-client
```

# Library Usage

- Since PayPal works with basic authentication issuing short-lived tokens, the library requires the user to trigger the token exchange loop before making any requests to the REST API.

- The `paypal.identify()` will return a promise that will resolve with `true` when the client has obtained the authorization and also a `ready` event will be emitted.

- It is recommended to check if the `paypal.ready` property is strictly `true` before trying to fetch or make any requests.

- To get your app's client id and secret go to [https://developer.paypal.com/developer/applications/](https://developer.paypal.com/developer/applications/).

```js
const PayPalClient = require("@modcord/paypal-client");
const paypal = new PayPalClient({
  client_id: "AT5...3sR", // Your PayPal app client id.
  secret: "EDv...lcj", // Your PayPal app secret.
  environment: "sandbox", // The environment for the run, can be either "live" or "sandbox".
  keep_cache: false // Whether to populate manager's cache with information when you fetch one or more instances.
});

paypal.on("ready", () => {
  console.log("The authorization has been resolved, and the library is ready to make requests..");
});

paypal.identify();
```

**Important!!**

- All of the examples below assume you set up the library the way it is shwon above, if you did it in another way you will need to tweak the examples for your own use case.
- The examples below show the full list of parameters you can use to call a method or do a specific thing, when the comment next to it says is optional, you may ommit to include that in your code.

# 1. Catalog Products API
## 1.1 Products
### 1.1.1 Creating a product

```js
const { ProductTemplate } = require("@modcord/modcord-client");
...
paypal.on("ready", async () => {
  const newProduct = new ProductTemplate()
    .setName("My New Product")
    .setDescription("A description for my new product.")
    .setType("DIGITAL")
    .setCategory("SOFTWARE")
    .setId("MY-VERY-OWN-ID")
    .setImageUrl("https://image.shutterstock.com/image-vector/new-item-sign-stamp-on-600w-1773071672.jpg")
    .setHomeUrl("https://google.com");

  const myNewProduct = await paypalClient.products.create(newProduct);

  console.log(myNewPorduct);
  // Sample Output:
  //  Product {
  //    client: [Client],
  //    manager: [ProductManager],
  //    id: 'MY-VERY-OWN-ID',
  //    name: 'My New Product',
  //    description: 'A description for my new product.',
  //    type: 'DIGITAL',
  //    category: 'SOFTWARE',
  //    imageUrl: 'https://image.shutterstock.com/image-vector/new-item-sign-stamp-on-600w-1773071672.jpg',
  //    homeUrl: 'https://google.com/',
  //    createTime: 2021-08-02T22:25:24.000Z,
  //    updateTime: 2021-08-02T22:25:24.000Z
  //  }
});
```

### 1.1.2 Fetching products in bulk

```js
paypal.on("ready", async () => {
  const myProducts = await paypal.products.fetchBulk({
    page_count: 1, // Optional, maximum amount of pages to fetch, the amount of products returned = 20 * page_count. 
    all: false // Optional, whether to fetch all of the existing products.
  });

  console.log(myProducts);
  // Sample Output: Collection(2) [Map] {
  //   'PROD-6BF74421N29171330' => Product {
  //     client: [Client],
  //     manager: ProductManager { client: [Client], cache: [Collection [Map]] },
  //     id: 'PROD-6BF74421N29171330',
  //     name: 'ModCord Plus',
  //     description: 'Discord bot plus plan service.',
  //     type: 'SERVICE',
  //     category: 'SOFTWARE',
  //     imageUrl: 'https://cdn.discordapp.com/avatars/624617804611452929/4a76c4f5dbf105691f47f0cac3d5756a.png?size=256',
  //     homeUrl: 'https://modcord.xyz/',
  //     createTime: 2021-03-24T07:35:39.000Z,
  //     updateTime: 2021-03-24T07:35:39.000Z
  //   },
  //   'PROD-98551998BW8384520' => Product {
  //     client:[Client],
  //     manager: ProductManager { client: [Client], cache: [Collection [Map]] },
  //     id: 'PROD-98551998BW8384520',
  //     name: 'ModCord',
  //     description: 'Discord bot royalty services.',
  //     type: 'SERVICE',
  //     category: 'SOFTWARE',
  //     imageUrl: 'https://cdn.discordapp.com/avatars/624617804611452929/4a76c4f5dbf105691f47f0cac3d5756a.png?size=256',
  //     homeUrl: 'https://modcord.xyz/',
  //     createTime: 2021-03-24T07:56:01.000Z,
  //     updateTime: 2021-03-24T07:56:01.000Z
  //   }
  // }
});
```

### 1.1.3 Fetching product by id

```js
paypal.on("ready", async () => {
  const myProduct = await paypal.products.fetch(
    "PROD-6BF74421N29171330",
    false
  );

  console.log(myProduct);
  // Sample: Product {
  //   client: [Client],
  //   manager: [ProductManager]
  //   id: 'PROD-6BF74421N29171330',
  //   name: 'ModCord Plus',
  //   description: 'Discord bot plus plan service.',
  //   type: 'SERVICE',
  //   category: 'SOFTWARE',
  //   imageUrl: 'https://cdn.discordapp.com/avatars/624617804611452929/4a76c4f5dbf105691f47f0cac3d5756a.png?size=256',
  //   homeUrl: 'https://modcord.xyz/',
  //   createTime: 2021-03-24T07:35:39.000Z,
  //   updateTime: 2021-03-24T07:35:39.000Z
  // }
}
});
```

### 1.1.4 Updating a product
- This method can be applied to any product instance.

```js
paypal.on("ready", async () => {
    const myProduct = await paypal.products.fetch(
    "PROD-6BF74421N29171330",
    false
  );

  console.log(myProduct.name);
  // Output: ModCord Plus

  console.log(myProduct.description);
  // Output: Discord bot plus plan service.

  console.log(myProduct.imageUrl);
  // Output: https://cdn.discordapp.com/avatars/624617804611452929/4a76c4f5dbf105691f47f0cac3d5756a.png?size=256

  console.log(myProduct.homeUrl);
  // Output: https://modcord.xyz/

  const operationResult = await myProduct.update({
    name: "ModCord Pro",
    description: "The re-branded pro plan.",
    imageUrl: "https://image.shutterstock.com/image-vector/new-item-sign-stamp-on-600w-1773071672.jpg",
    homeUrl: "https://modcord.com"
  });

  console.log(operationResult);
  // Output: true if success
  // Output: the http json or false if failed 

  console.log(myProduct.name);
  // Output: ModCord Pro

  console.log(myProduct.description);
  // Output: The re-branded pro plan.

  console.log(myProduct.imageUrl);
  // Output: https://image.shutterstock.com/image-vector/new-item-sign-stamp-on-600w-1773071672.jpg

  console.log(myProduct.homeUrl);
  // Output: https://modcord.com
});
```

# 2. Subscriptions API
## 2.1 Plans
### 2.1.1 Fetching plans in bulk
```js
paypal.on("ready", async () => {
  const myPlans = await paypal.plans.fetchBulk({
    product_id: "PROD-2435DY8H5G84454455V", // Optional, used to fetch only the plans containing a certain product id.
    page_count: 1, // Optional, maximum amount of pages to fetch, the amount of plans returned = 20 * page_count. 
    all: false // Optional, whether to fetch all of the existing plans.
  });

  console.log(myPlans);
  // Sample Output: 
  //   Collection(2) [Map] {
  //     'P-12T40581WT129034PMBNO4EI' => Plan {
  //       client: [Client],
  //       id: 'P-12T40581WT129034PMBNO4EI',
  //       version: 1,
  //       name: 'ModCord Plus Plan',
  //       description: 'Modcord plus plan',
  //       status: 'ACTIVE',
  //       usage_type: 'LICENSED',
  //       billingCycles: [ [BillingCycle] ],
  //       paymentPreferences: PaymentPreferences {
  //         serviceType: 'PREPAID',
  //         autoBillOutstanding: true,
  //         setupFee: [Price],
  //         setupFeeFailureAction: 'CONTINUE',
  //         paymentFailureThreshold: 3
  //       },
  //       taxes: Taxes { percentage: 8, inclusive: null },
  //       payee: Payee { merchantId: '5CXXY2PXB3AES', displayData: [DisplayData] },
  //       createTime: 2021-03-24T07:45:21.000Z,
  //       updateTime: 2021-03-24T07:45:21.000Z
  //     },
  //     'P-5D525680HN2867820MBNPCQI' => Plan {
  //       client: [Client],
  //       id: 'P-5D525680HN2867820MBNPCQI',
  //       version: 1,
  //       name: 'ModCord Premium Plan',
  //       description: 'TEST!?!?',
  //       status: 'ACTIVE',
  //       usage_type: 'LICENSED',
  //       billingCycles: [ [BillingCycle] ],
  //       paymentPreferences: PaymentPreferences {
  //         serviceType: 'PREPAID',
  //         autoBillOutstanding: true,
  //         setupFee: [Price],
  //         setupFeeFailureAction: 'CANCEL',
  //         paymentFailureThreshold: 4
  //       },
  //       taxes: Taxes { percentage: 7, inclusive: null },
  //       payee: Payee { merchantId: '5CXXY2PXB3AES', displayData: [DisplayData] },
  //       createTime: 2021-03-24T07:58:57.000Z,
  //       updateTime: 2021-08-02T19:52:09.000Z
  //     }
  //   }
});
```

### 2.1.2 Fetching plans by id
```js
paypal.on("ready", async () => {
  const plan = await paypal.plans.fetch(
    "P-5D525680HN2867820MBNPCQI", // Required, the plan id you want to fetch. 
    false //  Optional, Whether to bypass the existing cache if paypal.keep_chache is enabled and make a request.
  );

  console.log(plan);

  // Sample Output:
  //   Plan {
  //     client: [Client],
  //     id: 'P-5D525680HN2867820MBNPCQI',
  //     version: 1,
  //     name: 'ModCord Premium Plan',
  //     description: 'TEST!?!?',
  //     status: 'ACTIVE',
  //     usage_type: 'LICENSED',
  //     billingCycles: [ [BillingCycle] ],
  //     paymentPreferences: PaymentPreferences {
  //       serviceType: 'PREPAID',
  //       autoBillOutstanding: true,
  //       setupFee: [Price],
  //       setupFeeFailureAction: 'CANCEL',
  //       paymentFailureThreshold: 4
  //     },
  //     taxes: Taxes { percentage: 7, inclusive: null },
  //     payee: Payee { merchantId: '5CXXY2PXB3AES', displayData: [DisplayData] },
  //     createTime: 2021-03-24T07:58:57.000Z,
  //     updateTime: 2021-08-02T19:52:09.000Z
  //   }
});
``` 

### 2.1.3 Deactivating a plan
- You can apply this method on every plan instance.

```js
paypal.on("ready", async () => {
  const plan = await paypal.plans.fetch(
    "P-5D525680HN2867820MBNPCQI", // Required, the plan id you want to fetch. 
    false //  Optional, Whether to bypass the existing cache if paypal.keep_chache is enabled and make a request.
  );

  console.log(plan.status);
  // Output: ACTIVE

  const operationResult = await plan.deactivate(); 
  console.log(operationResult); // true if success, false if failed

  console.log(plan.status);
  // Output: INACTIVE
```

### 2.1.3 Activating a plan
- You can activate plans with statuses `CREATED` and `INACTIVE`
- You can apply this method on every plan instance.

```js
paypal.on("ready", async () => {
  const plan = await paypal.plans.fetch(
    "P-5D525680HN2867820MBNPCQI", // Required, the plan id you want to fetch. 
    false //  Optional, Whether to bypass the existing cache if paypal.keep_chache is enabled and make a request.
  );

  console.log(plan.status);
  // Output: INACTIVE or CREATED

  const operationResult = await plan.activate(); 
  console.log(operationResult); // true if success, false if failed

  console.log(plan.status);
  // Output: ACTIVE
```

### 3.1.4 Updating a plan
Fetching multiple plans.

```js
paypal.on("ready", async () => {
  const plan = await paypal.plans.fetch(
    "P-5D525680HN2867820MBNPCQI", // Required, the plan id you want to fetch. 
    false //  Optional, Whether to bypass the existing cache if paypal.keep_chache is enabled and make a request.
  );

  console.log(plan.description);
  // Output: Old and boring description.

  console.log(plan.taxes.percentage);
  // Output: 0.7

  console.log(plan.paymentPreferences);
  // Output: PaymentPreferences {
  //    serviceType: 'PREPAID',
  //    autoBillOutstanding: true,
  //    setupFee: {
  //      currencyCode: "USD",
  //      value: 3.52
  //    },
  //    setupFeeFailureAction: 'CONTINUE',
  //    paymentFailureThreshold: 2
  //  }

  const operationResult = await plan.update({
    description: "The shiny new description!",
    taxes: {
      percentage: 10.5
    },
    paymentPreferences: {
      autoBillOutstanding: false,
      paymentFailureThreshold: 4,
      setupFee: {
        currencyCode: "USD",
        value: 4.69
      },
      setupFeeFailureAction: "CANCEL"
    }
  });

  console.log(operationResult);
  // Output: true if success
  // Output: the http json or false if failed 

  console.log(plan.description);
  // Output: The shiny new description!

  console.log(plan.taxes.percentage);
  // Output: 10.5

  console.log(plan.paymentPreferences);
  // Output: PaymentPreferences {
  //    serviceType: 'PREPAID',
  //    autoBillOutstanding: false,
  //    setupFee: {
  //      currencyCode: "USD",
  //      value: 4.69
  //    },
  //    setupFeeFailureAction: 'CANCEL',
  //    paymentFailureThreshold: 4
  //  }
});
```

### 3.1.5 Creating a plan

```js
paypal.on("ready", async () => {
  const myProduct = await paypal.products.fetch(
    "PROD-6BF74421N29171330", // The product id to fetch.
    true // Whether to bypass the cache.
  );

  const myNewPlan = new PlanTemplate()
    .setProductId(myProduct.id) // Required, the product id of this plan.
    .setName("My Nice Plan") // Required, the name for this plan.
    .setDescription("A very nice plan to create.") // Optional, the description for this plan.
    .setStatus("ACTIVE") // Optional, the status for this plan - by default the status is "CREATED" - can be "CREATED" or "ACTIVE".
    .setPaymentPreferences({ // Optional, the payment preferences.
      autoBillOutstanding: true, // Whether to bill outstanding balances automatically.
      setupFailureAction: "CANCEL", // What to do when the setup billing fails: "CONTINUE" or "CANCEL".
      paymentFailureThreshold: 3, // The threshold for billing failures until the setupFailureAction is triggered.
      setupFee: { // The setup fee.
        currencyCode: "USD", // The currency code.
        value: 2.44 // The value, amount of currency code.
      }
    })
    .setTaxes(20, true) // 20% taxes that have been included in the plan's price
    .addBillingCycle({ // All of the subscriptions must have 1 billing cycle.
      fixedPrice: { // The price for this cycle.
        currencyCode: "USD", // The currency for this price.
        value: 0 // The value for this price.
      },
      pricingModel: "VOLUME" // The pricing model, can be TIERED or VOLUME: TIERED also reauires you to provide a tiers array to the pricing scheme.
    }, {
      intervalUnit: "WEEK", // How often this billing cycle is billing.
      intervalCount: 2 // The amount of units: for instance this billing cycle will last 2 weeks.
    }, "TRIAL", 1, 1) // The type for this billing cycle is trial, with a sequence of 1: it'll be executed first when subscribed to; and totalCycles of 1: it'll repeat once - for 2 weeks.
    .addBillingCycle({
      fixedPrice: { // The price for this cycle.
        currencyCode: "USD", // The currency.
        value: 4.99 // The value.
      },
      pricingModel: "VOLUME" // Pricing mode - VOLUME or TIERED: TIERED also requires you to provide a tiers array.
    }, {
      intervalUnit: "MONTH", // The interval unit for this cycle.
      intervalCount: 1 // The intercal unit count for this cycle - this will bill every 1 month after subscribing.
    }, "REGULAR", 2, 0) // The type for this billing cycle is "REGULAR", the sequence is 2 so it comes after the trial defined before, and totalCycles: 0 - it'll repeat until the user unsubscribes.
    .setQuantitySupported(false); // Whether the user can input a quentity when checking out subscription, set to false.
  
  const myPlan = await paypal.plans.create(myNewPlan);
  console.log(myPlan);
  // Sample output:
  // Plan {
  //   client: [Client],
  //   id: 'P-6ML94041PT1662406MEFJZJQ',
  //   version: undefined,
  //   name: 'My Nice Plan',
  //   description: 'A very nice plan to create.',
  //   status: 'ACTIVE',
  //   usage_type: 'LICENSED',
  //   billingCycles: [
  //     BillingCycle {
  //       plan: [Circular *2],
  //       pricingScheme: [PricingScheme],
  //       frequency: [Frequency],
  //       tenureType: 'TRIAL',
  //       sequence: 1,
  //       totalCycles: 1
  //     },
  //     BillingCycle {
  //       plan: [Circular *2],
  //       pricingScheme: [PricingScheme],
  //       frequency: [Frequency],
  //       tenureType: 'REGULAR',
  //       sequence: 2,
  //       totalCycles: 0
  //     }
  //   ],
  //   paymentPreferences: PaymentPreferences {
  //     serviceType: 'PREPAID',
  //     autoBillOutstanding: true,
  //     setupFee: Price { currencyCode: 'USD', value: '2.44' },
  //     setupFeeFailureAction: 'CANCEL',
  //     paymentFailureThreshold: 3
  //   },
  //   taxes: null,
  //   payee: null,
  //   createTime: 2021-08-04T13:56:54.000Z,
  //   updateTime: 2021-08-04T13:56:54.000Z
  // }
});
```