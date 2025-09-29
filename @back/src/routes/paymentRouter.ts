import { Router } from 'express';
import { body, param } from 'express-validator';
import { paymentController } from '../app/Controllers/paymentController.js';
import { handleValidationErrors } from '../app/Middleware/validation.js';
import { requireAuth } from '../app/Middleware/auth.middleware.js';

const paymentRouter: Router = Router();

// Validation for creating payment intent
const createPaymentIntentValidation = [
  body('order_id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  body('currency')
    .optional()
    .isIn(['eur'])
    .withMessage('Currency must be eur'),
  body('payment_method_types')
    .optional()
    .isArray()
    .withMessage('Payment method types must be an array'),
  handleValidationErrors
];


// Validation for test payment
const testPaymentValidation = [
  body('payment_intent_id')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
  handleValidationErrors
];

// Validation for payment status
const paymentStatusValidation = [
  param('order_id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  handleValidationErrors
];

paymentRouter.post('/api/payments/create-intent', requireAuth, createPaymentIntentValidation, paymentController.createPaymentIntent);
paymentRouter.post('/api/payments/test', requireAuth, testPaymentValidation, paymentController.testPayment);
paymentRouter.post('/api/payments/webhook', paymentController.webhook); // No validation for webhook (Stripe handles it)
paymentRouter.get('/api/payments/status/:order_id', requireAuth, paymentStatusValidation, paymentController.getPaymentStatus);
paymentRouter.get('/api/payments/history', requireAuth, paymentController.getPaymentHistory);

export { paymentRouter };
