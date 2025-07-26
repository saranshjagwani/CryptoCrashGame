// services/priceService.js
const axios = require("axios");

let cache = { BTC: 60000, ETH: 4000 };
let lastFetched = 0;

const getPrices = async () => {
  if (Date.now() - lastFetched < 10000) return cache;
  try {
    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
    cache = {
      BTC: res.data.bitcoin.usd,
      ETH: res.data.ethereum.usd
    };
    lastFetched = Date.now();
    return cache;
  } catch {
    return cache;
  }
};

module.exports = { getPrices };
