export enum UserRole {
    ADMIN = 'admin',
    CLIENT = 'client',
}
interface User {
    user_id?: number;
    last_name: string;
    first_name: string;
    email: string;
    password: string;
    phone_number?: string;
    role: UserRole;
    created_at?: Date;
    updated_at?: Date;
}

export type { User };

