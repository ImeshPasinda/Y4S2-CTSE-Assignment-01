const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/contentController');
const authMiddleware = require('../authMiddleware');

// Middleware to ensure only admins can access these routes
router.use(authMiddleware.authenticateToken);

// CRUD operations on course contents
router.get('/', courseContentController.getAllCourseContents);
router.post('/', authMiddleware.authorizeRoles(['Instructor', 'Admin']), courseContentController.createCourseContent);
router.get('/v2/:id', authMiddleware.authorizeRoles(['Instructor', 'Admin']), courseContentController.getCourseContentById);
router.get('/v1/:courseId', authMiddleware.authorizeRoles(['Instructor', 'Student']), courseContentController.getAllCourseContentsByCourseId);
router.put('/:id', authMiddleware.authorizeRoles(['Instructor']), courseContentController.updateCourseContent);
router.delete('/:id', authMiddleware.authorizeRoles(['Instructor', 'Admin']), courseContentController.deleteCourseContent);

module.exports = router;
