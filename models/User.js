// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  BTC: { type: Number, default: 1 },
  ETH: { type: Number, default: 1 },
});

module.exports = mongoose.model("User", userSchema);
