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

export type { Order };
