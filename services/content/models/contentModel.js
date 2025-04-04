const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseContentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Lecture', 'Video', 'Quiz'], required: true },
  contentUrl: { type: String, required: true },
});

module.exports = mongoose.model('CourseContent', courseContentSchema);
