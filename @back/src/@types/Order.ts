
enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

interface Order {
    order_id?: number;
    user_id: number;
    status: OrderStatus;
    created_at?: Date;
    updated_at?: Date;
}

// Types pour les requêtes complexes
interface OrderLineWithTree {
    order_line_id: number;
    tree_id: number;
    quantity: number;
    price: number;
    tree: {
        tree_id: number;
        name: string;
        description: string | null;
        image: string | null;
    };
}

interface OrderWithDetailsAndPayment extends Order {
    order_id: number;
    created_at: Date;
    updated_at: Date;
    order_lines: OrderLineWithTree[];
    payment_transaction: {
        payment_transaction_id: number;
        stripe_payment_id: string | null;
        amount: number;
        status: string;
        created_at: Date;
    } | null;
}

interface PaginatedOrders {
    orders: Order[];
    total: number;
}

export type { Order, OrderLineWithTree, OrderWithDetailsAndPayment, PaginatedOrders };
export { OrderStatus };
