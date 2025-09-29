import type { QueryResult } from 'pg';
import type { Tree } from '../../@types/Tree.js';
import DatabaseService from '../Services/database.js'; // Adjust path as needed

class TreeModel {
    private db = DatabaseService;

    // Get all trees
    async findAll(): Promise<Tree[]> {
        try {
            const query = `
                SELECT tree_id, name, description, price, image, created_at, updated_at 
                FROM tree 
                ORDER BY created_at DESC
            `;
            const result: QueryResult<Tree> = await this.db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching trees: ${error}`);
        }
    }

    // Get tree by ID
    async findById(id: number): Promise<Tree | null> {
        try {
            const query = `
                SELECT tree_id, name, description, price, image, created_at, updated_at 
                FROM tree 
                WHERE tree_id = $1
            `;
            const result: QueryResult<Tree> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching tree with ID ${id}: ${error}`);
        }
    }

    // Create new tree
    async create(treeData: Omit<Tree, 'tree_id' | 'created_at' | 'updated_at'>): Promise<Tree> {
        try {
            const query = `
                INSERT INTO tree (name, description, price, image, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                RETURNING tree_id, name, description, price, image, created_at, updated_at
            `;
            const values = [
                treeData.name,
                treeData.description || null,
                treeData.price,
                treeData.image || null
            ];
            const result: QueryResult<Tree> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating tree: ${error}`);
        }
    }

    // Update tree by ID
    async updateById(id: number, treeData: Partial<Omit<Tree, 'tree_id' | 'created_at' | 'updated_at'>>): Promise<Tree | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (treeData.name !== undefined) {
                updateFields.push(`name = $${paramCount++}`);
                values.push(treeData.name);
            }
            if (treeData.description !== undefined) {
                updateFields.push(`description = $${paramCount++}`);
                values.push(treeData.description);
            }
            if (treeData.price !== undefined) {
                updateFields.push(`price = $${paramCount++}`);
                values.push(treeData.price);
            }
            if (treeData.image !== undefined) {
                updateFields.push(`image = $${paramCount++}`);
                values.push(treeData.image);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push(`updated_at = NOW()`);
            values.push(id);

            const query = `
                UPDATE tree 
                SET ${updateFields.join(', ')}
                WHERE tree_id = $${paramCount}
                RETURNING tree_id, name, description, price, image, created_at, updated_at
            `;

            const result: QueryResult<Tree> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating tree with ID ${id}: ${error}`);
        }
    }

    // Delete tree by ID
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM tree WHERE tree_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting tree with ID ${id}: ${error}`);
        }
    }

    // Get trees with pagination
    async findWithPagination(limit: number = 10, offset: number = 0): Promise<{trees: Tree[], total: number}> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM tree`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT tree_id, name, description, price, image, created_at, updated_at 
                FROM tree 
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            `;
            const result: QueryResult<Tree> = await this.db.query(query, [limit, offset]);

            return {
                trees: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error fetching paginated trees: ${error}`);
        }
    }


    // Get trees with their associated projects and localizations
    async findAllWithProjectsAndLocalizations(): Promise<any[]> {
        try {
            const query = `
                SELECT
                    t.tree_id,
                    t.name as tree_name,
                    t.description as tree_description,
                    t.price,
                    t.image as tree_image,
                    t.created_at as tree_created_at,
                    t.updated_at as tree_updated_at,
                    p.project_id,
                    p.name as project_name,
                    p.description as project_description,
                    p.image as project_image,
                    p.localization_id,
                    p.created_at as project_created_at,
                    p.updated_at as project_updated_at,
                    l.country,
                    l.continent
                FROM tree t
                         LEFT JOIN project_tree pt ON t.tree_id = pt.tree_id
                         LEFT JOIN project p ON pt.project_id = p.project_id
                         LEFT JOIN localization l ON p.localization_id = l.localization_id
                ORDER BY t.created_at DESC, p.created_at DESC
            `;
            const result = await this.db.query(query);

            // Group the results by tree to avoid duplication
            const treesMap = new Map();

            result.rows.forEach(row => {
                const treeId = row.tree_id;

                if (!treesMap.has(treeId)) {
                    treesMap.set(treeId, {
                        tree_id: row.tree_id,
                        name: row.tree_name,
                        description: row.tree_description,
                        price: row.price,
                        image: row.tree_image,
                        created_at: row.tree_created_at,
                        updated_at: row.tree_updated_at,
                        projects: []
                    });
                }

                // Add project if it exists
                if (row.project_id) {
                    treesMap.get(treeId).projects.push({
                        project_id: row.project_id,
                        name: row.project_name,
                        description: row.project_description,
                        image: row.project_image,
                        localization_id: row.localization_id,
                        created_at: row.project_created_at,
                        updated_at: row.project_updated_at,
                        localization: row.localization_id ? {
                            localization_id: row.localization_id,
                            country: row.country,
                            continent: row.continent
                        } : null
                    });
                }
            });

            return Array.from(treesMap.values());
        } catch (error) {
            throw new Error(`Error fetching trees with projects and localizations: ${error}`);
        }
    }

    // Get a specific tree with its projects and localizations
    async findByIdWithProjectsAndLocalizations(id: number): Promise<any | null> {
        try {
            const query = `
                SELECT
                    t.tree_id,
                    t.name as tree_name,
                    t.description as tree_description,
                    t.price,
                    t.image as tree_image,
                    t.created_at as tree_created_at,
                    t.updated_at as tree_updated_at,
                    p.project_id,
                    p.name as project_name,
                    p.description as project_description,
                    p.image as project_image,
                    p.localization_id,
                    p.created_at as project_created_at,
                    p.updated_at as project_updated_at,
                    l.country,
                    l.continent
                FROM tree t
                         LEFT JOIN project_tree pt ON t.tree_id = pt.tree_id
                         LEFT JOIN project p ON pt.project_id = p.project_id
                         LEFT JOIN localization l ON p.localization_id = l.localization_id
                WHERE t.tree_id = $1
                ORDER BY p.created_at DESC
            `;
            const result = await this.db.query(query, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            const firstRow = result.rows[0];
            const tree = {
                tree_id: firstRow.tree_id,
                name: firstRow.tree_name,
                description: firstRow.tree_description,
                price: firstRow.price,
                image: firstRow.tree_image,
                created_at: firstRow.tree_created_at,
                updated_at: firstRow.tree_updated_at,
                projects: result.rows
                    .filter(row => row.project_id !== null)
                    .map(row => ({
                        project_id: row.project_id,
                        name: row.project_name,
                        description: row.project_description,
                        image: row.project_image,
                        localization_id: row.localization_id,
                        created_at: row.project_created_at,
                        updated_at: row.project_updated_at,
                        localization: row.localization_id ? {
                            localization_id: row.localization_id,
                            country: row.country,
                            continent: row.continent
                        } : null
                    }))
            };

            return tree;
        } catch (error) {
            throw new Error(`Error fetching tree with ID ${id}, projects and localizations: ${error}`);
        }
    }

    // Get trees by continent
    async findByContinent(continent: string): Promise<any[]> {
        try {
            const query = `
                SELECT DISTINCT
                    t.tree_id,
                    t.name as tree_name,
                    t.description as tree_description,
                    t.price,
                    t.image as tree_image,
                    t.created_at as tree_created_at,
                    t.updated_at as tree_updated_at,
                    p.project_id,
                    p.name as project_name,
                    p.description as project_description,
                    p.image as project_image,
                    p.localization_id,
                    p.created_at as project_created_at,
                    p.updated_at as project_updated_at,
                    l.country,
                    l.continent
                FROM tree t
                         INNER JOIN project_tree pt ON t.tree_id = pt.tree_id
                         INNER JOIN project p ON pt.project_id = p.project_id
                         INNER JOIN localization l ON p.localization_id = l.localization_id
                WHERE LOWER(l.continent) = LOWER($1)
                ORDER BY t.created_at DESC, p.created_at DESC
            `;
            const result = await this.db.query(query, [continent]);

            console.log(`Raw query result: ${result.rows.length} rows`); // Debug log

            // Group the results by tree to avoid duplication
            const treesMap = new Map();

            result.rows.forEach(row => {
                const treeId = row.tree_id;

                if (!treesMap.has(treeId)) {
                    treesMap.set(treeId, {
                        tree_id: row.tree_id,
                        name: row.tree_name,
                        description: row.tree_description,
                        price: row.price,
                        image: row.tree_image,
                        created_at: row.tree_created_at,
                        updated_at: row.tree_updated_at,
                        projects: []
                    });
                }

                treesMap.get(treeId).projects.push({
                    project_id: row.project_id,
                    name: row.project_name,
                    description: row.project_description,
                    image: row.project_image,
                    localization_id: row.localization_id,
                    created_at: row.project_created_at,
                    updated_at: row.project_updated_at,
                    localization: {
                        localization_id: row.localization_id,
                        country: row.country,
                        continent: row.continent
                    }
                });
            });

            const finalResult = Array.from(treesMap.values());
            console.log(`Grouped result: ${finalResult.length} trees`); // Debug log
            return finalResult;
        } catch (error) {
            throw new Error(`Error fetching trees by continent ${continent}: ${error}`);
        }
    }
}


export { TreeModel };