import type { QueryResult } from 'pg';
import type { OrderLine } from '../../@types/OrderLine.js';
import DatabaseService from '../Services/database.js';

class OrderLineModel {
    private db = DatabaseService;

    // Get all order lines
    async findAll(): Promise<OrderLine[]> {
        try {
            const query = `
                SELECT order_line_id, tree_id, order_id, quantity, price 
                FROM order_line 
                ORDER BY order_line_id DESC
            `;
            const result: QueryResult<OrderLine> = await this.db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching order lines: ${error}`);
        }
    }

    // Get order line by ID
    async findById(id: number): Promise<OrderLine | null> {
        try {
            const query = `
                SELECT order_line_id, tree_id, order_id, quantity, price 
                FROM order_line 
                WHERE order_line_id = $1
            `;
            const result: QueryResult<OrderLine> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching order line with ID ${id}: ${error}`);
        }
    }

    // Get order lines by order ID
    async findByOrderId(orderId: number): Promise<OrderLine[]> {
        try {
            const query = `
                SELECT order_line_id, tree_id, order_id, quantity, price 
                FROM order_line 
                WHERE order_id = $1
                ORDER BY order_line_id
            `;
            const result: QueryResult<OrderLine> = await this.db.query(query, [orderId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching order lines for order ID ${orderId}: ${error}`);
        }
    }

    // Create new order line
    async create(orderLineData: Omit<OrderLine, 'order_line_id'>): Promise<OrderLine> {
        try {
            const query = `
                INSERT INTO order_line (tree_id, order_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                RETURNING order_line_id, tree_id, order_id, quantity, price
            `;
            const values = [
                orderLineData.tree_id,
                orderLineData.order_id,
                orderLineData.quantity,
                orderLineData.price
            ];
            const result: QueryResult<OrderLine> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating order line: ${error}`);
        }
    }

    // Create multiple order lines
    async createMany(orderLines: Omit<OrderLine, 'order_line_id'>[]): Promise<OrderLine[]> {
        try {
            const values: any[] = [];
            const placeholders: string[] = [];
            let paramCount = 1;

            for (const orderLine of orderLines) {
              placeholders.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2}, $${paramCount + 3})`);
              values.push(orderLine.tree_id, orderLine.order_id, orderLine.quantity, orderLine.price);
              paramCount += 4;
            }

            const query = `
                INSERT INTO order_line (tree_id, order_id, quantity, price)
                VALUES ${placeholders.join(', ')}
                RETURNING order_line_id, tree_id, order_id, quantity, price
            `;

            const result: QueryResult<OrderLine> = await this.db.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Error creating multiple order lines: ${error}`);
        }
    }

    // Update order line by ID
    async updateById(id: number, orderLineData: Partial<Omit<OrderLine, 'order_line_id'>>): Promise<OrderLine | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (orderLineData.tree_id !== undefined) {
                updateFields.push(`tree_id = $${paramCount++}`);
                values.push(orderLineData.tree_id);
            }
            if (orderLineData.order_id !== undefined) {
                updateFields.push(`order_id = $${paramCount++}`);
                values.push(orderLineData.order_id);
            }
            if (orderLineData.quantity !== undefined) {
                updateFields.push(`quantity = $${paramCount++}`);
                values.push(orderLineData.quantity);
            }
            if (orderLineData.price !== undefined) {
                updateFields.push(`price = $${paramCount++}`);
                values.push(orderLineData.price);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            const query = `
                UPDATE order_line 
                SET ${updateFields.join(', ')}
                WHERE order_line_id = $${paramCount}
                RETURNING order_line_id, tree_id, order_id, quantity, price
            `;

            const result: QueryResult<OrderLine> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating order line with ID ${id}: ${error}`);
        }
    }

    // Delete order line by ID
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM order_line WHERE order_line_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting order line with ID ${id}: ${error}`);
        }
    }

    // Delete all order lines by order ID
    async deleteByOrderId(orderId: number): Promise<boolean> {
        try {
            const query = `DELETE FROM order_line WHERE order_id = $1`;
            const result = await this.db.query(query, [orderId]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting order lines for order ID ${orderId}: ${error}`);
        }
    }

    // Get order lines with tree details
    async findByOrderIdWithTreeDetails(orderId: number): Promise<any[]> {
        try {
            const query = `
                SELECT 
                    ol.order_line_id, ol.tree_id, ol.order_id, ol.quantity, ol.price,
                    t.name as tree_name, t.description as tree_description, t.image as tree_image, t.price as tree_unit_price
                FROM order_line ol
                JOIN tree t ON ol.tree_id = t.tree_id
                WHERE ol.order_id = $1
                ORDER BY ol.order_line_id
            `;
            const result = await this.db.query(query, [orderId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching order lines with tree details for order ID ${orderId}: ${error}`);
        }
    }

    // Calculate total amount for an order
    async calculateOrderTotal(orderId: number): Promise<number> {
        try {
            const query = `
                SELECT SUM(quantity * price) as total
                FROM order_line
                WHERE order_id = $1
            `;
            const result = await this.db.query(query, [orderId]);
            return parseFloat(result.rows[0]?.total || '0');
        } catch (error) {
            throw new Error(`Error calculating total for order ID ${orderId}: ${error}`);
        }
    }
}

const orderLineModel = new OrderLineModel();

export { orderLineModel };
