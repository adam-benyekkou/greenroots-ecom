// routes/userRouter.ts - Complete User Router with Authentication

import { Router } from 'express';
import { body, param } from 'express-validator';
import { userController } from '../app/Controllers/userController.js';
import { requireAuth, requireAdmin } from '../app/Middleware/auth.middleware.js';
import { handleValidationErrors } from '../app/Middleware/validation.js';

const userRouter = Router();

// =====================================
// VALIDATION RULES
// =====================================

const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
    body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
    body('phone_number').optional().isMobilePhone('any').withMessage('Valid phone number required'),
    body('role').optional().isIn(['admin', 'client']).withMessage('Role must be admin or client'),
    handleValidationErrors
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
    handleValidationErrors
];

const updateProfileValidation = [
    body('first_name').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    body('last_name').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    body('phone_number').optional().isMobilePhone('any').withMessage('Valid phone number required'),
    handleValidationErrors
];

const changePasswordValidation = [
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    handleValidationErrors
];

const forgotPasswordValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    handleValidationErrors
];

const resetPasswordValidation = [
    body('token').exists().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    handleValidationErrors
];

const verifyEmailValidation = [
    body('token').exists().withMessage('Verification token is required'),
    handleValidationErrors
];

const updateUserRoleValidation = [
    param('id').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    body('role').isIn(['admin', 'client']).withMessage('Role must be admin or client'),
    handleValidationErrors
];

const getUserByIdValidation = [
    param('id').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    handleValidationErrors
];

// =====================================
// PUBLIC ROUTES (No authentication required)
// =====================================

// User Registration
userRouter.post('/api/user/register', registerValidation, userController.register);

// User Login
userRouter.post('/api/user/login', loginValidation, userController.login);

// Password Reset Request
userRouter.post('/api/user/forgot-password', forgotPasswordValidation, userController.forgotPassword);

// Password Reset Confirmation
userRouter.post('/api/user/reset-password', resetPasswordValidation, userController.resetPassword);

// Email Verification
userRouter.post('/api/user/verify-email', verifyEmailValidation, userController.verifyEmail);

// =====================================
// PROTECTED ROUTES (Authentication required)
// =====================================

// User Logout
userRouter.post('/api/user/logout', requireAuth, userController.logout);

// Get User Profile
userRouter.get('/api/user/profile', requireAuth, userController.getProfile);

// Update User Profile
userRouter.put('/api/user/profile', requireAuth, updateProfileValidation, userController.updateProfile);

// Change Password
userRouter.put('/api/user/change-password', requireAuth, changePasswordValidation, userController.changePassword);

// Delete User Account
userRouter.delete('/api/user/account', requireAuth, userController.deleteAccount);

// Refresh JWT Token
userRouter.post('/api/user/refresh-token', requireAuth, userController.refreshToken);

// =====================================
// ADMIN ROUTES (Admin role required)
// =====================================

// Get All Users (Admin only)
userRouter.get('/api/user/admin/users', requireAdmin, userController.getAllUsers);

// Get User by ID (Admin only)
userRouter.get('/api/user/admin/users/:id', requireAdmin, getUserByIdValidation, userController.getUserById);

// Update User Role (Admin only)
userRouter.put('/api/user/admin/users/:id/role', requireAdmin, updateUserRoleValidation, userController.updateUserRole);

export { userRouter };