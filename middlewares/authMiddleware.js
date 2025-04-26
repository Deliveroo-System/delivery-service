const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("Jwt:SecretKey is missing in configuration.");
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = {
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    }; // Attach decoded claims to the request object
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
