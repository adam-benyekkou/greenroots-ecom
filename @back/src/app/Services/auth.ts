// services/auth.service.ts

import * as argon2 from "argon2";
import { UserModel } from "../Models/userModel.js";
import type {
	User,
	UserRole,
	AuthTokenPayload,
	LoginRequest,
	RegisterRequest,
	AuthResponse,
} from "../../@types/Auth.js";

export class AuthService {
	private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
	private userModel = new UserModel();

	// Argon2 configuration options
	private readonly ARGON2_OPTIONS: argon2.Options = {
		type: argon2.argon2id, // Use Argon2id (recommended)
		memoryCost: 2 ** 16, // 64MB memory usage
		timeCost: 3, // 3 iterations
		parallelism: 1, // 1 thread
	};

	// Dynamic import for JWT
	private async getJWT() {
		const jwt = await import("jsonwebtoken");
		return jwt.default || jwt;
	}

	// Hash password
	async hashPassword(password: string): Promise<string> {
		return argon2.hash(password, this.ARGON2_OPTIONS);
	}

	// Compare password
	async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		try {
			return await argon2.verify(hashedPassword, password);
		} catch (error) {
			// If verification fails due to format issues, return false
			return false;
		}
	}

	// Generate JWT token
	async generateToken(payload: AuthTokenPayload): Promise<string> {
		const jwt = await this.getJWT();
		return jwt.sign(payload, this.JWT_SECRET, {
			expiresIn: "7d",
			issuer: "greenroots-app",
		});
	}

	// Verify JWT token
	async verifyToken(token: string): Promise<AuthTokenPayload | null> {
		try {
			const jwt = await this.getJWT();
			return jwt.verify(token, this.JWT_SECRET) as AuthTokenPayload;
		} catch (error) {
			return null;
		}
	}

	// Register user
	async register(userData: RegisterRequest): Promise<AuthResponse> {
		// Validate input
		this.validateRegistration(userData);

		// Check if user already exists
		const existingUser = await this.userModel.findByEmail(userData.email);
		if (existingUser) {
			throw new Error("User with this email already exists");
		}

		// Hash password
		const hashedPassword = await this.hashPassword(userData.password);

		// Create user object for database
		const userToCreate = {
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			password: hashedPassword,
			phone_number: userData.phone_number || null,
			role: userData.role || UserRole.CLIENT,
		};

		// Save user to database
		const savedUser = await this.userModel.create(userToCreate);

		// Generate token
		const token = await this.generateToken({
			userId: savedUser.user_id!,
			email: savedUser.email,
			role: savedUser.role,
		});

		// Return user without password
		const { password, ...userWithoutPassword } = savedUser;

		return {
			user: userWithoutPassword,
			token,
		};
	}

	// Login user
	async login(credentials: LoginRequest): Promise<AuthResponse> {
		// Find user by email
		const user = await this.userModel.findByEmail(credentials.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		// Compare passwords
		const isValidPassword = await this.comparePassword(
			credentials.password,
			user.password!,
		);

		if (!isValidPassword) {
			throw new Error("Invalid credentials");
		}

		// Generate token
		const token = await this.generateToken({
			userId: user.user_id!,
			email: user.email,
			role: user.role,
		});

		// Return user without password
		const { password, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			token,
		};
	}

	// Update user profile
	async updateProfile(
		userId: number,
		updateData: Partial<{
			first_name: string;
			last_name: string;
			phone_number: string;
		}>,
	): Promise<User | null> {
		return await this.userModel.updateById(userId, updateData);
	}

	// Change password
	async changePassword(
		userId: number,
		currentPassword: string,
		newPassword: string,
	): Promise<void> {
		// Get user with password
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		// Get user with password for verification
		const userWithPassword = await this.userModel.findByEmail(user.email);
		if (!userWithPassword) {
			throw new Error("User not found");
		}

		// Verify current password
		const isValidPassword = await this.comparePassword(
			currentPassword,
			userWithPassword.password!,
		);
		if (!isValidPassword) {
			throw new Error("Current password is incorrect");
		}

		// Hash new password
		const hashedNewPassword = await this.hashPassword(newPassword);

		// Update password
		const success = await this.userModel.updatePassword(
			userId,
			hashedNewPassword,
		);
		if (!success) {
			throw new Error("Failed to update password");
		}
	}

	// Delete account
	async deleteAccount(userId: number): Promise<void> {
		const success = await this.userModel.deleteById(userId);
		if (!success) {
			throw new Error("Failed to delete account");
		}
	}

	// Get all users (admin only)
	async getAllUsers(): Promise<User[]> {
		return await this.userModel.findAll();
	}

	// Get user by ID
	async getUserById(userId: number): Promise<User | null> {
		return await this.userModel.findById(userId);
	}

	// Update user role (admin only)
	async updateUserRole(userId: number, role: UserRole): Promise<User | null> {
		return await this.userModel.updateRole(userId, role);
	}

	// Forgot password - store reset token
	async forgotPassword(email: string): Promise<void> {
		// Check if user exists
		const user = await this.userModel.findPublicByEmail(email);
		if (!user) {
			// Don't reveal if email exists or not for security
			return;
		}

		// Generate reset token
		const resetToken = jwt.sign(
			{ email, type: "password_reset" },
			this.JWT_SECRET,
			{ expiresIn: "1h" },
		);

		// Store token in database with expiration
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		await this.userModel.storePasswordResetToken(email, resetToken, expiresAt);

		// TODO: Send email with reset token
		// emailService.sendPasswordResetEmail(email, resetToken);
	}

	// Reset password with token
	async resetPassword(token: string, newPassword: string): Promise<void> {
		// Verify token
		const email = await this.userModel.verifyPasswordResetToken(token);
		if (!email) {
			throw new Error("Invalid or expired reset token");
		}

		// Get user
		const user = await this.userModel.findByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}

		// Hash new password
		const hashedPassword = await this.hashPassword(newPassword);

		// Update password
		const success = await this.userModel.updatePassword(
			user.user_id!,
			hashedPassword,
		);
		if (!success) {
			throw new Error("Failed to reset password");
		}

		// Delete the used token
		await this.userModel.deletePasswordResetToken(token);
	}

	// Verify email with token
	async verifyEmail(token: string): Promise<void> {
		// Verify token
		const email = await this.userModel.verifyEmailVerificationToken(token);
		if (!email) {
			throw new Error("Invalid verification token");
		}

		// TODO: Mark user as verified in database if you have an email_verified field
		// For now, just delete the token to mark as used
		await this.userModel.deleteEmailVerificationToken(token);
	}

	// Validate registration data
	private validateRegistration(userData: RegisterRequest): void {
		const { email, password, first_name, last_name } = userData;

		if (!email || !this.isValidEmail(email)) {
			throw new Error("Valid email is required");
		}

		if (!password || password.length < 8) {
			throw new Error("Password must be at least 8 characters long");
		}

		if (!first_name?.trim()) {
			throw new Error("First name is required");
		}

		if (!last_name?.trim()) {
			throw new Error("Last name is required");
		}
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}
