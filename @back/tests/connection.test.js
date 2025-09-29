import { describe, test, expect, afterAll, beforeAll } from '@jest/globals';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

describe('Database Connection', () => {
    let client;

    beforeAll(() => {
        client = new Client({
            user: process.env.DB_USER || process.env.POSTGRES_USER,
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || process.env.POSTGRES_DB,
            password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
            port: process.env.DB_PORT || 5432,
        });
    });

    afterAll(async () => {
        if (client) {
            await client.end();
        }
    });

    test('should connect to PostgreSQL database', async () => {
        await expect(client.connect()).resolves.not.toThrow();
    });

    test('should verify database connection details', async () => {
        const result = await client.query('SELECT current_database(), current_user');

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].current_database).toBe(process.env.DB_NAME || process.env.POSTGRES_DB);
        expect(result.rows[0].current_user).toBe(process.env.DB_USER || process.env.POSTGRES_USER);
    });


    test('should verify database permissions', async () => {
        // Test if we can create and drop a test table
        await client.query(`
            CREATE TABLE IF NOT EXISTS connection_test (
                id SERIAL PRIMARY KEY,
                test_data VARCHAR(50)
            )
        `);

        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'connection_test'
        `);

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].table_name).toBe('connection_test');

        // Clean up
        await client.query('DROP TABLE connection_test');
    });

    test('should handle basic CRUD operations', async () => {
        // Create test table
        await client.query(`
            CREATE TEMP TABLE test_crud (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // INSERT
        const insertResult = await client.query(
            'INSERT INTO test_crud (name) VALUES ($1) RETURNING id, name',
            ['Test User']
        );
        expect(insertResult.rows[0].name).toBe('Test User');
        const testId = insertResult.rows[0].id;

        // SELECT
        const selectResult = await client.query(
            'SELECT * FROM test_crud WHERE id = $1',
            [testId]
        );
        expect(selectResult.rows).toHaveLength(1);
        expect(selectResult.rows[0].name).toBe('Test User');

        // UPDATE
        const updateResult = await client.query(
            'UPDATE test_crud SET name = $1 WHERE id = $2 RETURNING name',
            ['Updated User', testId]
        );
        expect(updateResult.rows[0].name).toBe('Updated User');

        // DELETE
        const deleteResult = await client.query(
            'DELETE FROM test_crud WHERE id = $1',
            [testId]
        );
        expect(deleteResult.rowCount).toBe(1);

        // Verify deletion
        const verifyResult = await client.query(
            'SELECT * FROM test_crud WHERE id = $1',
            [testId]
        );
        expect(verifyResult.rows).toHaveLength(0);
    });

    test('should display connection configuration', () => {
        console.log('🔧 Database Configuration:');
        console.log('Host:', process.env.DB_HOST || 'localhost');
        console.log('Port:', process.env.DB_PORT || 5433);
        console.log('Database:', process.env.DB_NAME || process.env.POSTGRES_DB);
        console.log('User:', process.env.DB_USER || process.env.POSTGRES_USER);
        console.log('DATABASE_URL:', process.env.DATABASE_URL);

        // These are just info logs, always pass
        expect(true).toBe(true);
    });

    test('should handle connection errors gracefully', async () => {
        const badClient = new Client({
            user: 'nonexistent_user',
            host: 'localhost',
            database: 'nonexistent_db',
            password: 'wrong_password',
            port: process.env.DB_PORT || 5432,
        });

        await expect(badClient.connect()).rejects.toThrow();

        // Make sure to close the bad client if it somehow connected
        try {
            await badClient.end();
        } catch (error) {
            // Expected if connection failed
        }
    });
});