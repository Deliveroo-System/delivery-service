require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const deliveryRoutes = require("./routes/deliveryRoutes");
const driverRoutes = require("./routes/driverRoutes"); // ✅ Import driver routes
const authRoutes = require("./routes/authRoutes");      // ✅ Import auth routes

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// WebSocket Setup
io.on("connection", (socket) => {
  console.log("🔗 New WebSocket Connection");

  socket.on("disconnect", () => {
    console.log("❌ WebSocket Disconnected");
  });
});

// Make `io` available globally in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/drivers", driverRoutes); // ✅ Use driver routes

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚚 Delivery Management Service is running...");
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Trying a different port...`);
    server.listen(0, () => {
      const newPort = server.address().port;
      console.log(`🚀 Server running on port ${newPort}`);
    });
  } else {
    console.error("❌ Server error:", err);
  }
});
