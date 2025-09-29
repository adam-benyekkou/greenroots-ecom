import type { QueryResult } from 'pg';
import type { User } from '../../@types/User.js';
import { UserRole } from '../../@types/User.js';
import DatabaseService from '../Services/database.js';

class UserModel {
    private db = DatabaseService;

    // Get all users (admin only)
    async findAll(): Promise<User[]> {
        try {
            const query = `
                SELECT user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
                FROM "user"
                ORDER BY created_at DESC
            `;
            const result: QueryResult<User> = await this.db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    }

    // Get user by ID
    async findById(id: number): Promise<User | null> {
        try {
            const query = `
                SELECT user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
                FROM "user"
                WHERE user_id = $1
            `;
            const result: QueryResult<User> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching user with ID ${id}: ${error}`);
        }
    }

    // Get user by email (for login)
    async findByEmail(email: string): Promise<User | null> {
        try {
            const query = `
                SELECT user_id, first_name, last_name, email, password, phone_number, role, created_at, updated_at
                FROM "user"
                WHERE email = $1
            `;
            const result: QueryResult<User> = await this.db.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching user with email ${email}: ${error}`);
        }
    }

    // Get user by email (public profile - no password)
    async findPublicByEmail(email: string): Promise<User | null> {
        try {
            const query = `
                SELECT user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
                FROM "user"
                WHERE email = $1
            `;
            const result: QueryResult<User> = await this.db.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching user with email ${email}: ${error}`);
        }
    }

    // Create new user (register)
    async create(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
        try {
            const query = `
                INSERT INTO "user" (first_name, last_name, email, password, phone_number, role, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                    RETURNING user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
            `;
            const values = [
                userData.first_name,
                userData.last_name,
                userData.email,
                userData.password,
                userData.phone_number || null,
                userData.role || UserRole.CLIENT
            ];
            const result: QueryResult<User> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }

    // Update user profile
    async updateById(id: number, userData: Partial<Omit<User, 'user_id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (userData.first_name !== undefined) {
                updateFields.push(`first_name = $${paramCount++}`);
                values.push(userData.first_name);
            }
            if (userData.last_name !== undefined) {
                updateFields.push(`last_name = $${paramCount++}`);
                values.push(userData.last_name);
            }
            if (userData.email !== undefined) {
                updateFields.push(`email = $${paramCount++}`);
                values.push(userData.email);
            }
            if (userData.password !== undefined) {
                updateFields.push(`password = $${paramCount++}`);
                values.push(userData.password);
            }
            if (userData.phone_number !== undefined) {
                updateFields.push(`phone_number = $${paramCount++}`);
                values.push(userData.phone_number);
            }
            if (userData.role !== undefined) {
                updateFields.push(`role = $${paramCount++}`);
                values.push(userData.role);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push(`updated_at = NOW()`);
            values.push(id);

            const query = `
                UPDATE "user"
                SET ${updateFields.join(', ')}
                WHERE user_id = $${paramCount}
                    RETURNING user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
            `;

            const result: QueryResult<User> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating user with ID ${id}: ${error}`);
        }
    }

    // Delete user account
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM "user" WHERE user_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting user with ID ${id}: ${error}`);
        }
    }

    // Update password
    async updatePassword(id: number, passwordHash: string): Promise<boolean> {
        try {
            const query = `
                UPDATE "user"
                SET password = $1, updated_at = NOW()
                WHERE user_id = $2
            `;
            const result = await this.db.query(query, [passwordHash, id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error updating password for user ID ${id}: ${error}`);
        }
    }

    // Verify user exists (for email verification)
    async verifyUserExists(id: number): Promise<boolean> {
        try {
            const query = `
                SELECT user_id FROM "user"
                WHERE user_id = $1
            `;
            const result = await this.db.query(query, [id]);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error verifying user exists for ID ${id}: ${error}`);
        }
    }

    // Update user role (admin function) - only admins can call this
    async updateRole(id: number, role: UserRole): Promise<User | null> {
        try {
            const query = `
                UPDATE "user"
                SET role = $1, updated_at = NOW()
                WHERE user_id = $2
                    RETURNING user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
            `;
            const result: QueryResult<User> = await this.db.query(query, [role, id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating role for user ID ${id}: ${error}`);
        }
    }

    // Check if user is admin
    async isAdmin(id: number): Promise<boolean> {
        try {
            const query = `
                SELECT role FROM "user"
                WHERE user_id = $1
            `;
            const result = await this.db.query(query, [id]);
            return result.rows[0]?.role === UserRole.ADMIN;
        } catch (error) {
            throw new Error(`Error checking admin status for user ID ${id}: ${error}`);
        }
    }

    // Get users with pagination (admin function)
    async findWithPagination(limit: number = 10, offset: number = 0): Promise<{users: User[], total: number}> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM "user"`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT user_id, first_name, last_name, email, phone_number, role, created_at, updated_at
                FROM "user"
                ORDER BY created_at DESC
                    LIMIT $1 OFFSET $2
            `;
            const result: QueryResult<User> = await this.db.query(query, [limit, offset]);

            return {
                users: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error fetching paginated users: ${error}`);
        }
    }

    // Store password reset token
    async storePasswordResetToken(email: string, token: string, expiresAt: Date): Promise<boolean> {
        try {
            const query = `
                INSERT INTO password_reset_tokens (email, token, expires_at, created_at)
                VALUES ($1, $2, $3, NOW())
                    ON CONFLICT (email) DO UPDATE SET
                    token = EXCLUDED.token,
                                               expires_at = EXCLUDED.expires_at,
                                               created_at = EXCLUDED.created_at
            `;
            const result = await this.db.query(query, [email, token, expiresAt]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error storing password reset token: ${error}`);
        }
    }

    // Verify password reset token
    async verifyPasswordResetToken(token: string): Promise<string | null> {
        try {
            const query = `
                SELECT email FROM password_reset_tokens
                WHERE token = $1 AND expires_at > NOW()
            `;
            const result = await this.db.query(query, [token]);
            return result.rows[0]?.email || null;
        } catch (error) {
            throw new Error(`Error verifying password reset token: ${error}`);
        }
    }

    // Delete password reset token
    async deletePasswordResetToken(token: string): Promise<boolean> {
        try {
            const query = `DELETE FROM password_reset_tokens WHERE token = $1`;
            const result = await this.db.query(query, [token]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting password reset token: ${error}`);
        }
    }

    // Store email verification token
    async storeEmailVerificationToken(email: string, token: string): Promise<boolean> {
        try {
            const query = `
                INSERT INTO email_verification_tokens (email, token, created_at)
                VALUES ($1, $2, NOW())
                    ON CONFLICT (email) DO UPDATE SET
                    token = EXCLUDED.token,
                                               created_at = EXCLUDED.created_at
            `;
            const result = await this.db.query(query, [email, token]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error storing email verification token: ${error}`);
        }
    }

    // Verify email verification token
    async verifyEmailVerificationToken(token: string): Promise<string | null> {
        try {
            const query = `
                SELECT email FROM email_verification_tokens
                WHERE token = $1
            `;
            const result = await this.db.query(query, [token]);
            return result.rows[0]?.email || null;
        } catch (error) {
            throw new Error(`Error verifying email verification token: ${error}`);
        }
    }

    // Delete email verification token
    async deleteEmailVerificationToken(token: string): Promise<boolean> {
        try {
            const query = `DELETE FROM email_verification_tokens WHERE token = $1`;
            const result = await this.db.query(query, [token]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting email verification token: ${error}`);
        }
    }
}

export { UserModel };