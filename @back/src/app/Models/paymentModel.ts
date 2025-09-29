import type { QueryResult } from 'pg';
import type { 
    PaymentTransaction, 
    PaymentWithOrderDetails, 
    PaymentSummary,
    PaymentHistoryItem
} from '../../@types/PaymentTransaction.js';
import DatabaseService from '../Services/database.js';

class PaymentModel {
    private db = DatabaseService;
    async create(paymentData: Omit<PaymentTransaction, 'payment_transaction_id' | 'created_at' | 'updated_at'>) {
        const query = `
            INSERT INTO payment_transaction (order_id, stripe_payment_id, amount, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [
            paymentData.order_id,
            paymentData.stripe_payment_id,
            paymentData.amount,
            paymentData.status
        ];

        try {
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating payment transaction: ${error}`);
        }
    }

    async findById(paymentId: number): Promise<PaymentTransaction | null> {
        try {
            const query = 'SELECT * FROM payment_transaction WHERE payment_transaction_id = $1';
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, [paymentId]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error getting payment by ID: ${error}`);
        }
    }

    async findByOrderId(orderId: number): Promise<PaymentTransaction | null> {
        try {
            const query = 'SELECT * FROM payment_transaction WHERE order_id = $1 ORDER BY created_at DESC';
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, [orderId]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error getting payment by order ID: ${error}`);
        }
    }

    async findByStripeId(stripePaymentId: string): Promise<PaymentTransaction | null> {
        try {
            const query = 'SELECT * FROM payment_transaction WHERE stripe_payment_id = $1';
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, [stripePaymentId]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error getting payment by Stripe ID: ${error}`);
        }
    }

    async updateByStripeId(stripePaymentId: string, updateData: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
        try {
            const fields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            for (const [key, value] of Object.entries(updateData)) {
                if (key !== 'payment_transaction_id' && key !== 'created_at' && value !== undefined) {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            }

            if (fields.length === 0) {
                throw new Error('No valid fields to update');
            }

            fields.push(`updated_at = NOW()`);
            values.push(stripePaymentId);

            const query = `
                UPDATE payment_transaction 
                SET ${fields.join(', ')}
                WHERE stripe_payment_id = $${paramCount}
                RETURNING *
            `;

            const result: QueryResult<PaymentTransaction> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating payment by Stripe ID: ${error}`);
        }
    }

    async updateById(paymentId: number, updateData: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
        try {
            const fields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            for (const [key, value] of Object.entries(updateData)) {
                if (key !== 'payment_transaction_id' && key !== 'created_at' && value !== undefined) {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            }

            if (fields.length === 0) {
                throw new Error('No valid fields to update');
            }

            fields.push(`updated_at = NOW()`);
            values.push(paymentId);

            const query = `
                UPDATE payment_transaction 
                SET ${fields.join(', ')}
                WHERE payment_transaction_id = $${paramCount}
                RETURNING *
            `;

            const result: QueryResult<PaymentTransaction> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating payment: ${error}`);
        }
    }

    async findAllByOrderId(orderId: number): Promise<PaymentTransaction[]> {
        try {
            const query = 'SELECT * FROM payment_transaction WHERE order_id = $1 ORDER BY created_at DESC';
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, [orderId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting all payments by order ID: ${error}`);
        }
    }

    // Get payment with order details
    async findByIdWithOrderDetails(paymentId: number): Promise<PaymentWithOrderDetails | null> {
        try {
            const query = `
                SELECT 
                    pt.payment_transaction_id,
                    pt.order_id,
                    pt.stripe_payment_id,
                    pt.amount,
                    pt.status,
                    pt.created_at,
                    pt.updated_at,
                    o.order_id as order_order_id,
                    o.user_id as order_user_id,
                    o.status as order_status,
                    o.created_at as order_created_at,
                    o.updated_at as order_updated_at
                FROM payment_transaction pt
                INNER JOIN "order" o ON pt.order_id = o.order_id
                WHERE pt.payment_transaction_id = $1
            `;
            
            const result = await this.db.query(query, [paymentId]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            const row = result.rows[0];
            return {
                payment_transaction_id: row.payment_transaction_id,
                order_id: row.order_id,
                stripe_payment_id: row.stripe_payment_id,
                amount: row.amount,
                status: row.status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                order: {
                    order_id: row.order_order_id,
                    user_id: row.order_user_id,
                    status: row.order_status,
                    created_at: row.order_created_at,
                    updated_at: row.order_updated_at
                }
            };
        } catch (error) {
            throw new Error(`Error getting payment with order details: ${error}`);
        }
    }

    // Get payment summary by order ID
    async getPaymentSummaryByOrderId(orderId: number): Promise<PaymentSummary | null> {
        try {
            const query = `
                SELECT 
                    pt.payment_transaction_id,
                    pt.order_id,
                    pt.amount,
                    pt.status,
                    pt.stripe_payment_id,
                    pt.created_at as payment_date,
                    o.status as order_status,
                    o.user_id
                FROM payment_transaction pt
                INNER JOIN "order" o ON pt.order_id = o.order_id
                WHERE pt.order_id = $1
                ORDER BY pt.created_at DESC
                LIMIT 1
            `;
            
            const result = await this.db.query(query, [orderId]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error getting payment summary: ${error}`);
        }
    }

    // Get payment history for a user
    async getPaymentHistoryByUserId(userId: number, limit: number = 10, offset: number = 0): Promise<{
        payments: PaymentHistoryItem[];
        total: number;
    }> {
        try {
            // Get total count
            const countQuery = `
                SELECT COUNT(*) as total 
                FROM payment_transaction pt
                INNER JOIN "order" o ON pt.order_id = o.order_id
                WHERE o.user_id = $1
            `;
            const countResult = await this.db.query(countQuery, [userId]);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT 
                    pt.payment_transaction_id,
                    pt.order_id,
                    pt.amount,
                    pt.status,
                    pt.created_at,
                    pt.stripe_payment_id
                FROM payment_transaction pt
                INNER JOIN "order" o ON pt.order_id = o.order_id
                WHERE o.user_id = $1
                ORDER BY pt.created_at DESC
                LIMIT $2 OFFSET $3
            `;
            
            const result: QueryResult<PaymentHistoryItem> = await this.db.query(query, [userId, limit, offset]);
            
            return {
                payments: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error getting payment history: ${error}`);
        }
    }

    // Get payments by status with pagination
    async findByStatusWithPagination(status: string, limit: number = 10, offset: number = 0): Promise<{
        payments: PaymentTransaction[];
        total: number;
    }> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM payment_transaction WHERE status = $1`;
            const countResult = await this.db.query(countQuery, [status]);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT * FROM payment_transaction 
                WHERE status = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
            `;
            
            const result: QueryResult<PaymentTransaction> = await this.db.query(query, [status, limit, offset]);
            
            return {
                payments: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error getting payments by status: ${error}`);
        }
    }
}

const paymentModel = new PaymentModel();

export { paymentModel };
