import type { User, UserRole } from "./User.js";

export interface AuthTokenPayload {
    userId: number;
    email: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number?: string;
    role?: UserRole;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: Omit<User, 'password'>;
        }
    }
}