import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

class DatabaseService {
    constructor() {
        this.dbConnection = new Pool({
            user: process.env.DB_USER || process.env.POSTGRES_USER,
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || process.env.POSTGRES_DB,
            password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
            port: process.env.DB_PORT || 5432,
            max: 20,
            min: 5,
            idleTimeoutMillis: 10000,
        });
    }

    async query(text, params = []) {
        try {
            const result = await this.dbConnection.query(text, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async getClient() {
        return await this.dbConnection.connect();
    }

    async close() {
        await this.dbConnection.end();
    }
}

export default new DatabaseService();