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

interface PaymentWithOrderDetails extends PaymentTransaction {
    payment_transaction_id: number;
    created_at: Date;
    updated_at: Date;
    order: {
        order_id: number;
        user_id: number;
        status: string;
        created_at: Date;
        updated_at: Date;
    };
}

interface PaymentSummary {
    payment_transaction_id: number;
    order_id: number;
    amount: number;
    status: PaymentStatus;
    stripe_payment_id?: string;
    payment_date: Date;
    order_status: string;
    user_id: number;
}

interface PaymentHistoryItem {
    payment_transaction_id: number;
    order_id: number;
    amount: number;
    status: PaymentStatus;
    created_at: Date;
    stripe_payment_id?: string;
}

interface PaginatedPayments {
    payments: PaymentTransaction[];
    total: number;
}

interface PaginatedPaymentHistory {
    payments: PaymentHistoryItem[];
    total: number;
}

export type { 
    PaymentTransaction, 
    PaymentWithOrderDetails, 
    PaymentSummary,
    PaymentHistoryItem,
    PaginatedPayments,
    PaginatedPaymentHistory
};
export { PaymentStatus };
