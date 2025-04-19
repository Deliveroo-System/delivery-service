const express = require("express");
const Delivery = require("../models/Delivery");
const User = require("../models/User");
const { auth, authRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new delivery (Protected & Auto-Assign Driver)
router.post("/", auth, async (req, res) => {
  try {
    // Find an available driver
    const driver = await User.findOne ({ role: "driver" });

    if (!driver) {
      return res.status(400).json({ message: "No available drivers" });
    }

    const newDelivery = new Delivery({
      ...req.body,
      driverId: driver._id, // Assign driver automatically
      status: "assigned",
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all deliveries (Admin Only)
router.get("/", auth, authRole("admin"), async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get delivery by Order ID (Customer & Admin)
router.get("/order/:orderId", auth, async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery status (Driver Only)
router.put("/:id", auth, authRole("driver"), async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Emit real-time update via WebSockets
    io.emit("deliveryUpdated", updatedDelivery);

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
