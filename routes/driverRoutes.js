const express = require("express");
const { registerDriver, loginDriver } = require("../controllers/driverController");

const router = express.Router();

// Route for registering a driver
router.post("/register", registerDriver);

// Route for logging in a driver
router.post("/login", loginDriver);

module.exports = router;
