interface OrderLine {
    order_line_id?: number;
    tree_id: number;
    order_id: number;
    quantity: number;
    price: number;
}

export type { OrderLine };
