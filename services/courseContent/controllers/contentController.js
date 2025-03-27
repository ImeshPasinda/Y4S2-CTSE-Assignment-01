const CourseContent = require('../models/contentModel');

const getAllCourseContents = async (req, res) => {
  try {
    const courseContents = await CourseContent.find();
    res.status(200).json(courseContents);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCourseContentById = async (req, res) => {
  const { id } = req.params;
  try {
    const content = await CourseContent.findById(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCourseContentsByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseContents = await CourseContent.find({ courseId });
    res.status(200).json(courseContents);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCourseContent = async (req, res) => {
  const { courseId, title, type, contentUrl } = req.body;
  try {
    const newContent = new CourseContent({ courseId, title, type, contentUrl });
    await newContent.save();
    res.status(201).json({ message: 'Course content created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

const updateCourseContent = async (req, res) => {
  const { id } = req.params;
  const { courseId, title, type, contentUrl } = req.body;
  try {
    await CourseContent.findByIdAndUpdate(id, { courseId, title, type, contentUrl });
    res.status(200).json({ message: 'Course content updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or course content not found' });
  }
};

const deleteCourseContent = async (req, res) => {
  const { id } = req.params;
  try {
    await CourseContent.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course content deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid course content ID or course content not found' });
  }
};

module.exports = { getAllCourseContents, getCourseContentById, getAllCourseContentsByCourseId, createCourseContent, updateCourseContent, deleteCourseContent };
