const Enrollment = require('../models/enrollmentModel');

const enrollCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    let user = await Enrollment.findOne({ userId });

    if (user) {
      if (user.courses.includes(courseId)) {
        return res.status(400).json({ message: 'User is already enrolled in this course' });
      } else {
        user.courses.push(courseId);
        await user.save();
      }
    } else {
      user = new Enrollment({ userId, courses: [courseId] });
      await user.save();
    }


    res.status(201).json({ message: 'User enrolled in the course successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

const getEnrollmentsByUserId = async (req, res) => {

  const userId = req.params.id;
  try {
    const enrollment = await Enrollment.findOne({ userId });

    if (enrollment) {
      return res.status(200).json({ enrollment });
    } else {
      return res.status(404).json({ message: 'Enrollment details not found for the user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { enrollCourse, getEnrollmentsByUserId };
