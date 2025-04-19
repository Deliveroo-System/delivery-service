const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverId: { type: String, required: true },
  status: { type: String, enum: ["pending", "assigned", "on the way", "delivered"], default: "pending" },
  deliveryTime: { type: Date },
});

module.exports = mongoose.model("Delivery", DeliverySchema); 
