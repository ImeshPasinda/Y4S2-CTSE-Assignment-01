const stripe = require('stripe')(process.env.STRIPE_SECRET);
const CryptoJS = require("crypto-js");
const Payment = require('../models/paymentModel');

const paymentCheckout = async (req, res) => {
  try {
    const { amount, name, imageUrl, email } = req.body;

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(req.body), process.env.ENCRYPTION_SECRET).toString();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: 'lkr',
          product_data: {
            name: name,
            images: [imageUrl],
          },
          unit_amount: parseInt(amount) * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.DOMAIN}/payment_success?session_id={CHECKOUT_SESSION_ID}&order=${encodeURIComponent(encryptedData)}`,
      cancel_url: `${process.env.DOMAIN}/checkout?payment_fail=true`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const savePaymentDetails = async (req, res) => {
  const { courseId, userId, amount, transactionId, title, success } = req.body;
  try {
    const payment = new Payment({
      title,
      amount,
      courseId,
      transactionId,
      userId,
      success,
    });
    await payment.save();
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPaymentByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const payment = await Payment.find({ userId });
    if (!payment) {
      return res.status(404).json({ message: 'Payments not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { paymentCheckout, savePaymentDetails, getPaymentByUserId };


