require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const deliveryRoutes = require("./routes/deliveryRoutes");



const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

  //routes
  app.use("/api/deliveries", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("Delivery Management Service is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
