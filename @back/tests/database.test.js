import { describe, test, expect, afterAll } from '@jest/globals';
import database from '../src/app/Services/database.js';

describe('DatabaseService', () => {
    afterAll(async () => {
        await database.close();
    });

    test('should connect to database', async () => {
        const result = await database.query('SELECT 1 as test');
        expect(result.rows[0].test).toBe(1);
    });

    test('should handle parameterized queries', async () => {
        const result = await database.query('SELECT $1 as value', ['hello']);
        expect(result.rows[0].value).toBe('hello');
    });

    test('should handle multiple parameters', async () => {
        const result = await database.query(
            'SELECT $1 as name, $2::text as age',
            ['John', '25']
        );
        expect(result.rows[0].name).toBe('John');
        expect(result.rows[0].age).toBe('25');
    });

    test('should throw error for invalid SQL', async () => {
        await expect(
            database.query('INVALID SQL')
        ).rejects.toThrow();
    });

    test('should get database client', async () => {
        const client = await database.getClient();
        expect(client).toBeDefined();
        expect(typeof client.query).toBe('function');

        const result = await client.query('SELECT 1 as test');
        expect(result.rows[0].test).toBe(1);

        client.release();
    });
});