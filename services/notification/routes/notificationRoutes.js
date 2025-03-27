const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../authMiddleware');

// router.use(authMiddleware.authenticateToken);

router.post('/', notificationController.sendEmail);

module.exports = router;
