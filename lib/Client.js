const { Request } = require("hclientify");
const util = require("util");
const { EventEmitter } = require("events");
const PlanManager = require("./plans/PlanManager");

class Client extends EventEmitter {
  constructor ({ client_id, secret, environment, keep_cache }) {
    super();
    if (!client_id) throw new Error("You must provide a client_id.");
    if (!secret) throw new Error("You must provide a secret.");
    if (!["live", "sandbox"].includes(environment)) throw new Error("You must provide the environment to be either live or sandbox.");

    this.environment = environment;
    this.client_id = client_id;
    this.authorization = {
      expires: null,
      value: null
    };
    this.renewTimeout = null;
    this.wait = util.promisify(setTimeout);
    this.renewCooldown = 500;
    this.keep_cache = Boolean(keep_cache);
    this.requestBrigeTimeout = 60;

    Object.defineProperty(this, "secret", { value: secret });

    this.baseUrls = {
      "live": "https://api-m.paypal.com/",
      "sandbox": "https://api-m.sandbox.paypal.com/"
    };

    this.plans = new PlanManager(this);
  }

  async exchangeToken () {
    const exchangeRequest = new Request(this.baseUrls[this.environment])
      .method("post")
      .path("/v1/oauth2/token")
      .header({
        "Accept-Language": "en_US",
        "Authorization": `Basic ${Buffer.from(`${this.client_id}:${this.secret}`).toString("base64")}`
      })
      .body({
        "grant_type": "client_credentials",
      }, "form");

    this.authorization.value = null;

    while (!this.authorization.value) {
      await this.wait(this.renewCooldown);
      await exchangeRequest.send().then(response => {
        if (response.statusCode === 200) {
          this.authorization.expires = response.json.expires_in;
          this.authorization.value = response.json.access_token;
          if (this.renewTimeout) clearTimeout(this.renewTimeout);
          this.renewTimeout = setTimeout((client) => client.exchangeToken(), (this.authorization.expires - 3) * 1000, this);
        }
      }).catch(this.noop);
    }
    return true;
  }

  identify () {
    return this.exchangeToken();
  }

  get authorizationHeader () {
    return `Bearer ${this.authorization.value}`;
  }

  noop () {}

  enforceLength (value, maxLength, name) {
    if (value && value.length > maxLength) throw new Error(`Max length for ${name} is ${maxLength.toLocaleString()}.`);
  }

  request (method, path, query, headers, body = {}) {
    return new Promise(resolve => {
      const request = new Request(this.baseUrls[this.environment], method ? method.toLowerCase() : "get")
        .path(path)
        .query(query)
        .header(Object.assign(headers, {
          "Authorization": this.authorizationHeader,
          "Content-Type": "application/json"
        }))
        .body(body);
      request.send().then(response => resolve(response));
    });
  }
}

module.exports = Client;
