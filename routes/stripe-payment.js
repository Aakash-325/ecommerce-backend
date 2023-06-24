import express from 'express';
import { stripePayment } from '../controller/stripePayment';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', stripePayment);

export default paymentRouter; 