// middleware/auth.middleware.ts

import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../Services/auth.js';
import { UserRole } from '../../@types/User.js';

// Middleware for authentication
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authService = new AuthService();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const payload = await authService.verifyToken(token);

    if (!payload) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Add user info to request object
    req.user = {
        user_id: payload.userId,
        email: payload.email,
        role: payload.role,
        first_name: '',
        last_name: '',
        phone_number: undefined,
        created_at: undefined,
        updated_at: undefined
    };

    next();
};

// Middleware for role-based authorization
export const requireRole = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Middleware for admin only access
export const requireAdmin = requireRole(UserRole.ADMIN);

// Middleware for authenticated users (any role)
export const requireAuth = authenticateToken;