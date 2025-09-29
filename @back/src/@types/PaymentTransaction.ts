enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

interface PaymentTransaction {
    payment_transaction_id?: number;
    order_id: number;
    stripe_payment_id?: string;
    amount: number;
    status: PaymentStatus;
    created_at?: Date;
    updated_at?: Date;
}

export type { PaymentTransaction };
