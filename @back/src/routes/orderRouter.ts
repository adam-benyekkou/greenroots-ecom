import { Router } from 'express';
import { ordersController } from "../app/Controllers/ordersController.js";
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../app/Middleware/validation.js';
import { requireAuth } from '../app/Middleware/auth.middleware.js';

const orderRouter = Router();

const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.tree_id')
    .isInt({ min: 1 })
    .withMessage('Valid tree ID is required for each item'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  handleValidationErrors
];

const statusValidation = [
  body('status')
    .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid order status')
    .customSanitizer((value) => value.toUpperCase()),
  handleValidationErrors
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid order ID is required'),
  handleValidationErrors
];

orderRouter.post('/api/orders', requireAuth, createOrderValidation, ordersController.create);
orderRouter.put('/api/orders/:id/status', requireAuth, idValidation, statusValidation, ordersController.updateStatus);
orderRouter.get('/api/orders/:id', requireAuth, idValidation, ordersController.show);
orderRouter.get('/api/orders', requireAuth, ordersController.getUserOrders);

export { orderRouter };
