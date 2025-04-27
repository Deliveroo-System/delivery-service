const express = require("express");
const {
  createDelivery,
  assignDriver,
  markAsDelivered,
  getAllDeliveries,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new delivery
router.post("/", authMiddleware, createDelivery);

// Assign a driver to a delivery
router.put("/assign", authMiddleware, assignDriver);

// Mark a delivery as delivered
router.put("/deliver", authMiddleware, markAsDelivered);

// Get all deliveries
router.get("/", authMiddleware, getAllDeliveries);

// Update delivery status by driver
router.put("/status", authMiddleware, updateDeliveryStatus);

module.exports = router;
