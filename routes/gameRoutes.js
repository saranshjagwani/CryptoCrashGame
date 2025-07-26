// routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const { getPrices } = require("../services/priceService");
const User = require("../models/User");

router.post("/bet", async (req, res) => {
  const { userId, usdAmount, crypto } = req.body;
  const prices = await getPrices();
  const cryptoAmount = usdAmount / prices[crypto];

  const user = await User.findOne({ userId });
  if (!user || user[crypto] < cryptoAmount)
    return res.status(400).json({ error: "Insufficient balance" });

  user[crypto] -= cryptoAmount;
  await user.save();

  res.json({ message: "Bet placed", cryptoAmount });
});

router.post("/create-dummy-user", async (req, res) => {
  const user = new User({
    userId: "testuser1",
    BTC: 1,
    ETH: 1,
  });

  await user.save();
  res.json({ message: "Dummy user created", user });
});


router.post("/cashout", async (req, res) => {
  const { userId, crypto, betAmount, multiplier } = req.body;
  const user = await User.findOne({ userId });

  const winAmount = betAmount * multiplier;
  user[crypto] += winAmount;
  await user.save();

  res.json({ message: "Cashout successful", winAmount });
});

router.post("/create-user", async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const existing = await User.findOne({ userId });
  if (existing) {
    return res.status(200).json({ error: "User already exists" });
  }

  const user = new User({
    userId,
    BTC: 0.01, // give new user some BTC
    ETH: 0.5   // and some ETH
  });

  await user.save();
  res.json({ message: "✅ User created", user });
});


router.get("/wallet/:userId", async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const prices = await getPrices();
  res.json({
    BTC: {
      crypto: user.BTC,
      usd: (user.BTC * prices.BTC).toFixed(2)
    },
    ETH: {
      crypto: user.ETH,
      usd: (user.ETH * prices.ETH).toFixed(2)
    }
  });
});


module.exports = router;
