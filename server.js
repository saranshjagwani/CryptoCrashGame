// server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// Routes
app.use("/api/game", require("./routes/gameRoutes"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

require("./services/socketHandler")(io); // handle game logic + sockets

app.use(express.static(path.join(__dirname, "public")));

server.listen(3000, () => console.log("Server running on port 3000"));
