import type { QueryResult } from 'pg';
import type { Order, OrderWithDetailsAndPayment, PaginatedOrders } from '../../@types/Order.js';
import DatabaseService from '../Services/database.js';

class OrderModel {
    private db = DatabaseService;

    // Get order by ID
    async findById(id: number): Promise<Order | null> {
        try {
            const query = `
                SELECT order_id, user_id, status, created_at, updated_at 
                FROM "order" 
                WHERE order_id = $1
            `;
            const result: QueryResult<Order> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching order with ID ${id}: ${error}`);
        }
    }

    // Get orders by user ID
    async findByUserId(userId: number): Promise<Order[]> {
        try {
            const query = `
                SELECT order_id, user_id, status, created_at, updated_at 
                FROM "order" 
                WHERE user_id = $1
                ORDER BY created_at DESC
            `;
            const result: QueryResult<Order> = await this.db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching orders for user ID ${userId}: ${error}`);
        }
    }

    // Create new order
    async create(orderData: Omit<Order, 'order_id' | 'created_at' | 'updated_at'>): Promise<Order> {
        try {
            const query = `
                INSERT INTO "order" (user_id, status, created_at, updated_at)
                VALUES ($1, $2, NOW(), NOW())
                RETURNING order_id, user_id, status, created_at, updated_at
            `;
            const values = [
                orderData.user_id,
                orderData.status
            ];
            const result: QueryResult<Order> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating order: ${error}`);
        }
    }

    // Update order by ID
    async updateById(id: number, orderData: Partial<Omit<Order, 'order_id' | 'created_at' | 'updated_at'>>): Promise<Order | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (orderData.user_id !== undefined) {
                updateFields.push(`user_id = $${paramCount++}`);
                values.push(orderData.user_id);
            }

            if (orderData.status !== undefined) {
                updateFields.push(`status = $${paramCount++}`);
                values.push(orderData.status);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push(`updated_at = NOW()`);
            values.push(id);

            const query = `
                UPDATE "order" 
                SET ${updateFields.join(', ')}
                WHERE order_id = $${paramCount}
                RETURNING order_id, user_id, status, created_at, updated_at
            `;

            const result: QueryResult<Order> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating order with ID ${id}: ${error}`);
        }
    }

    // Delete order by ID
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM "order" WHERE order_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting order with ID ${id}: ${error}`);
        }
    }

    // Get orders with pagination
    async findWithPagination(limit: number = 10, offset: number = 0): Promise<PaginatedOrders> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM "order"`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT order_id, user_id, status, created_at, updated_at 
                FROM "order" 
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            `;
            const result: QueryResult<Order> = await this.db.query(query, [limit, offset]);

            return {
                orders: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error fetching paginated orders: ${error}`);
        }
    }

    // Get orders by status
    async findByStatus(status: string): Promise<Order[]> {
        try {
            const query = `
                SELECT order_id, user_id, status, created_at, updated_at 
                FROM "order" 
                WHERE status = $1
                ORDER BY created_at DESC
            `;
            const result: QueryResult<Order> = await this.db.query(query, [status]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching orders by status ${status}: ${error}`);
        }
    }

    // Get order with order lines
    async findByIdWithOrderLinesAndPayment(id: number): Promise<OrderWithDetailsAndPayment | null> {
        try {
            const query = `
                SELECT 
                    o.order_id, o.user_id, o.status, o.created_at as order_created_at, o.updated_at as order_updated_at,
                    ol.order_line_id, ol.tree_id, ol.quantity, ol.price,
                    t.name as tree_name, t.description as tree_description, t.image as tree_image,
                    pt.payment_transaction_id, pt.stripe_payment_id, pt.amount, pt.status as payment_status, pt.created_at as payment_created_at
                FROM "order" o
                LEFT JOIN order_line ol ON o.order_id = ol.order_id
                LEFT JOIN tree t ON ol.tree_id = t.tree_id
                LEFT JOIN payment_transaction pt ON o.order_id = pt.order_id
                WHERE o.order_id = $1
                ORDER BY ol.order_line_id
            `;
            const result = await this.db.query(query, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            const firstRow = result.rows[0];
            const order = {
                order_id: firstRow.order_id,
                user_id: firstRow.user_id,
                status: firstRow.status,
                created_at: firstRow.order_created_at,
                updated_at: firstRow.order_updated_at,
                order_lines: result.rows
                    .filter(row => row.order_line_id !== null)
                    .map(row => ({
                        order_line_id: row.order_line_id,
                        tree_id: row.tree_id,
                        quantity: row.quantity,
                        price: row.price,
                        tree: {
                            tree_id: row.tree_id,
                            name: row.tree_name,
                            description: row.tree_description,
                            image: row.tree_image
                        }
                    })),
                payment_transaction: firstRow.payment_transaction_id ? {
                    payment_transaction_id: firstRow.payment_transaction_id,
                    stripe_payment_id: firstRow.stripe_payment_id,
                    amount: firstRow.amount,
                    status: firstRow.payment_status,
                    created_at: firstRow.payment_created_at
                } : null
            };

            return order;
        } catch (error) {
            throw new Error(`Error fetching order with ID ${id} and order lines: ${error}`);
        }
    }

    // Get user orders with order lines and tree details
    async findByUserIdWithDetails(userId: number): Promise<OrderWithDetailsAndPayment[]> {
        try {
            const query = `
            SELECT 
                o.order_id, o.user_id, o.status, o.created_at as order_created_at, o.updated_at as order_updated_at,
                ol.order_line_id, ol.tree_id, ol.quantity, ol.price,
                t.name as tree_name, t.description as tree_description, t.image as tree_image,
                p.name as project_name, l.country as project_country
            FROM "order" o
            LEFT JOIN order_line ol ON o.order_id = ol.order_id
            LEFT JOIN tree t ON ol.tree_id = t.tree_id
            LEFT JOIN project_tree pt ON t.tree_id = pt.tree_id
            LEFT JOIN project p ON pt.project_id = p.project_id
            LEFT JOIN localization l ON p.localization_id = l.localization_id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC, ol.order_line_id
        `;
            const result = await this.db.query(query, [userId]);

            // Group results by order
            const ordersMap = new Map();

            for (const row of result.rows) {
                if (!ordersMap.has(row.order_id)) {
                    ordersMap.set(row.order_id, {
                        order_id: row.order_id,
                        user_id: row.user_id,
                        status: row.status,
                        created_at: row.order_created_at,
                        updated_at: row.order_updated_at,
                        order_lines: []
                    });
                }

                if (row.order_line_id) {
                    ordersMap.get(row.order_id).order_lines.push({
                        order_line_id: row.order_line_id,
                        tree_id: row.tree_id,
                        quantity: row.quantity,
                        price: row.price,
                        tree: {
                            tree_id: row.tree_id,
                            name: row.tree_name,
                            description: row.tree_description,
                            image: row.tree_image,
                            projects: [{
                                name: row.project_name,
                                localization: {
                                    country: row.project_country
                                }
                            }]
                        }
                    });
                }
            }

            return Array.from(ordersMap.values());
        } catch (error) {
            throw new Error(`Error fetching user orders with details: ${error}`);
        }
    }
}

const orderModel = new OrderModel();

export { orderModel };
