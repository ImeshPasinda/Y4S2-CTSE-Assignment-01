const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../authMiddleware");

router.post("/paymentrequest", authMiddleware.authenticateToken, paymentController.paymentCheckout);
router.post("/checkout", authMiddleware.authenticateToken, paymentController.savePaymentDetails);
router.get('/:userId', authMiddleware.authenticateToken, paymentController.getPaymentByUserId);

module.exports = router;
