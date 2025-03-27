const Course = require('../models/courseModel');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


const createCourse = async (req, res) => {
  const { title, description, instructor, startDate, endDate, price, isActive } = req.body;
  try {
    const newCourse = new Course({
      title,
      description,
      instructor,
      startDate,
      endDate,
      price,
      isActive,
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, instructor, startDate, endDate, price, isActive } = req.body;
  try {
    await Course.findByIdAndUpdate(id, { title, description, instructor, startDate, endDate, price, isActive });
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or course not found' });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid course ID or course not found' });
  }
};
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllCourses, createCourse, updateCourse, deleteCourse,getCourseById };
