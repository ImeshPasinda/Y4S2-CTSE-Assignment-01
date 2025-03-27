const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  success: { type: Boolean, required: true },
  transactionId: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
