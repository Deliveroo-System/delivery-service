const express = require("express");
const Delivery = require("../models/Delivery");

const router = express.Router();

// Create a new delivery order
router.post("/", async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all deliveries
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery status
router.put("/:id", async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
