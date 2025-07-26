// services/socketHandler.js
let currentMultiplier = 1;
let crashPoint = 2 + Math.random() * 3;
let crashed = false;

module.exports = (io) => {
  setInterval(() => {
    if (!crashed) {
      currentMultiplier += 0.1;
      io.emit("multiplier_update", { multiplier: currentMultiplier.toFixed(2) });
      if (currentMultiplier >= crashPoint) {
        io.emit("round_crash", { crashPoint: currentMultiplier.toFixed(2) });
        crashed = true;
        setTimeout(() => {
          currentMultiplier = 1;
          crashPoint = 2 + Math.random() * 3;
          crashed = false;
          io.emit("round_start");
        }, 5000); // wait 5s then restart
      }
    }
  }, 100);

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("multiplier_update", { multiplier: currentMultiplier });
  });
};

