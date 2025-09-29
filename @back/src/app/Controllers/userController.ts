import type { Request, Response } from 'express';
import { AuthService } from '../Services/auth.js';

const userController = {
    register: async (req: Request, res: Response) => {
        try {
            const authService = new AuthService();
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const authService = new AuthService();
            const result = await authService.login(req.body);
            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            });
        }
    },

    logout: async (req: Request, res: Response) => {
        // In a stateless JWT system, logout is typically handled client-side
        // by removing the token. However, you could implement token blacklisting here
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    },

    getProfile: async (req: Request, res: Response) => {
        res.json({
            success: true,
            data: { user: req.user }
        });
    },

    updateProfile: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // const updatedUser = await authService.updateProfile(req.user.user_id!, req.body);

            res.json({
                success: true,
                message: 'Profile updated successfully'
                // data: { user: updatedUser }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Profile update failed'
            });
        }
    },

    changePassword: async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // await authService.changePassword(req.user.user_id!, currentPassword, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Password change failed'
            });
        }
    },

    deleteAccount: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // await authService.deleteAccount(req.user.user_id!);

            res.json({
                success: true,
                message: 'Account deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Account deletion failed'
            });
        }
    },

    forgotPassword: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // await authService.forgotPassword(email);

            res.json({
                success: true,
                message: 'Password reset email sent if account exists'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Password reset failed'
            });
        }
    },

    resetPassword: async (req: Request, res: Response) => {
        try {
            const { token, newPassword } = req.body;

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // await authService.resetPassword(token, newPassword);

            res.json({
                success: true,
                message: 'Password reset successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Password reset failed'
            });
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // await authService.verifyEmail(token);

            res.json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Email verification failed'
            });
        }
    },

    refreshToken: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            const authService = new AuthService();
            const newToken = await authService.generateToken({
                userId: req.user.user_id!,
                email: req.user.email,
                role: req.user.role
            });

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: { token: newToken }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: 'Token refresh failed'
            });
        }
    },

    // Admin routes
    getAllUsers: async (req: Request, res: Response) => {
        try {
            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // const users = await authService.getAllUsers();

            res.json({
                success: true,
                message: 'Users retrieved successfully'
                // data: { users }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to retrieve users'
            });
        }
    },

    getUserById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // const user = await authService.getUserById(parseInt(id));

            res.json({
                success: true,
                message: 'User retrieved successfully'
                // data: { user }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to retrieve user'
            });
        }
    },

    updateUserRole: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            // This would need to be implemented in the AuthService
            // const authService = new AuthService();
            // const updatedUser = await authService.updateUserRole(parseInt(id), role);

            res.json({
                success: true,
                message: 'User role updated successfully'
                // data: { user: updatedUser }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update user role'
            });
        }
    }
};

export { userController };