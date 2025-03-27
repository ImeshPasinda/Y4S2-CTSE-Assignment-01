const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../authMiddleware');

// // Middleware to ensure only admins can access these routes
// router.use(authMiddleware.authenticateToken);

// CRUD operations on courses
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles(['Admin']), courseController.updateCourse);
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles(['Admin']), courseController.deleteCourse);

module.exports = router;