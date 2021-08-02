const currencyCodes = {
  "AUD": "Australian dollar",
  "BRL": "Brazilian real",
  "CAD": "Canadian dollar",
  "CNY": "Chinese Renmenbi",
  "CZK": "Czech koruna",
  "DKK": "Danish krone",
  "EUR": "Euro",
  "HKD": "Hong Kong dollar",
  "HUF": "Hungarian forint",
  "ILS": "Israeli new shekel",
  "JPY": "Japanese yen",
  "MYR": "Malaysian ringgit",
  "MXN": "Mexican peso",
  "TWD": "New Taiwan dollar",
  "NZD": "New Zealand dollar",
  "NOK": "Norwegian krone",
  "PHP": "Philippine peso",
  "PLN": "Polish złoty",
  "GBP": "Pound sterling",
  "RUB": "Russian ruble",
  "SGD": "Singapore dollar",
  "SEK": "Swedish krona",
  "CHF": "Swiss franc",
  "THB": "Thai baht",
  "USD": "United States dollar"
};

module.exports = {
  currencyCodes,
  codes: Object.keys(currencyCodes),
  values: Object.values(currencyCodes),
  entries: Object.entries(currencyCodes)
};
