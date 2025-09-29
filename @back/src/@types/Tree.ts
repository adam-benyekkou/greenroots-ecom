interface Tree {
    tree_id?: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}

export type { Tree };
