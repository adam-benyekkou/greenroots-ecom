import type { QueryResult } from 'pg';
import type { Localization } from '../../@types/Localization.js';
import DatabaseService from '../Services/database.js'; // Adjust path as needed

class LocalizationModel {
    private db = DatabaseService;

    // Get all localizations
    async findAll(): Promise<Localization[]> {
        try {
            const query = `
                SELECT localization_id, country, continent 
                FROM localization 
                ORDER BY continent, country
            `;
            const result: QueryResult<Localization> = await this.db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching localizations: ${error}`);
        }
    }

    // Get localization by ID
    async findById(id: number): Promise<Localization | null> {
        try {
            const query = `
                SELECT localization_id, country, continent 
                FROM localization 
                WHERE localization_id = $1
            `;
            const result: QueryResult<Localization> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching localization with ID ${id}: ${error}`);
        }
    }

    // Get localizations by continent
    async findByContinent(continent: string): Promise<Localization[]> {
        try {
            const query = `
                SELECT localization_id, country, continent 
                FROM localization 
                WHERE continent = $1
                ORDER BY country
            `;
            const result: QueryResult<Localization> = await this.db.query(query, [continent]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching localizations for continent ${continent}: ${error}`);
        }
    }

    // Get localization by country
    async findByCountry(country: string): Promise<Localization | null> {
        try {
            const query = `
                SELECT localization_id, country, continent 
                FROM localization 
                WHERE country = $1
            `;
            const result: QueryResult<Localization> = await this.db.query(query, [country]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching localization for country ${country}: ${error}`);
        }
    }

    // Create new localization
    async create(localizationData: Omit<Localization, 'localization_id'>): Promise<Localization> {
        try {
            const query = `
                INSERT INTO localization (country, continent)
                VALUES ($1, $2)
                RETURNING localization_id, country, continent
            `;
            const values = [
                localizationData.country,
                localizationData.continent
            ];
            const result: QueryResult<Localization> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating localization: ${error}`);
        }
    }

    // Update localization by ID
    async updateById(id: number, localizationData: Partial<Omit<Localization, 'localization_id'>>): Promise<Localization | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (localizationData.country !== undefined) {
                updateFields.push(`country = $${paramCount++}`);
                values.push(localizationData.country);
            }
            if (localizationData.continent !== undefined) {
                updateFields.push(`continent = $${paramCount++}`);
                values.push(localizationData.continent);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            const query = `
                UPDATE localization 
                SET ${updateFields.join(', ')}
                WHERE localization_id = $${paramCount}
                RETURNING localization_id, country, continent
            `;

            const result: QueryResult<Localization> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating localization with ID ${id}: ${error}`);
        }
    }

    // Delete localization by ID
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM localization WHERE localization_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting localization with ID ${id}: ${error}`);
        }
    }

    // Get localizations with pagination
    async findWithPagination(limit: number = 10, offset: number = 0): Promise<{localizations: Localization[], total: number}> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM localization`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT localization_id, country, continent 
                FROM localization 
                ORDER BY continent, country
                LIMIT $1 OFFSET $2
            `;
            const result: QueryResult<Localization> = await this.db.query(query, [limit, offset]);

            return {
                localizations: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error fetching paginated localizations: ${error}`);
        }
    }

    // Get all continents (distinct)
    async findAllContinents(): Promise<string[]> {
        try {
            const query = `
                SELECT DISTINCT continent 
                FROM localization 
                ORDER BY continent
            `;
            const result = await this.db.query(query);
            return result.rows.map(row => row.continent);
        } catch (error) {
            throw new Error(`Error fetching continents: ${error}`);
        }
    }

    // Check if localization exists by country
    async existsByCountry(country: string): Promise<boolean> {
        try {
            const query = `
                SELECT 1 
                FROM localization 
                WHERE country = $1 
                LIMIT 1
            `;
            const result = await this.db.query(query, [country]);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error checking if localization exists for country ${country}: ${error}`);
        }
    }
}

export { LocalizationModel };