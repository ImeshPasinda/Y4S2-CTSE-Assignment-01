const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../authMiddleware');

// Middleware to ensure only admins can access these routes
router.use(authMiddleware.authenticateToken);

router.post('/', enrollmentController.enrollCourse);
router.get('/:id', enrollmentController.getEnrollmentsByUserId);


module.exports = router;