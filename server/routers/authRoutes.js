const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
