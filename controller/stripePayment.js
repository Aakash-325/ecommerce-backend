import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripeInstance = stripe(stripeSecretKey);

export const stripePayment = async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount,
    currency: 'inr',
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
