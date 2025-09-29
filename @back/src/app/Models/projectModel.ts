import type { QueryResult } from 'pg';
import type { Project } from '../../@types/Project.js';
import DatabaseService from '../Services/database.js'; // Adjust path as needed

class ProjectModel {
    private db = DatabaseService;

    // Get all projects
    async findAll(): Promise<Project[]> {
        try {
            const query = `
                SELECT project_id, localization_id, name, description, image, created_at, updated_at
                FROM project
                ORDER BY created_at DESC
            `;
            const result: QueryResult<Project> = await this.db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }

    // Get project by ID
    async findById(id: number): Promise<Project | null> {
        try {
            const query = `
                SELECT project_id, localization_id, name, description, image, created_at, updated_at
                FROM project
                WHERE project_id = $1
            `;
            const result: QueryResult<Project> = await this.db.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error fetching project with ID ${id}: ${error}`);
        }
    }

    // Create new project
    async create(projectData: Omit<Project, 'project_id' | 'created_at' | 'updated_at'>): Promise<Project> {
        try {
            const query = `
                INSERT INTO project (localization_id, name, description, image, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                    RETURNING project_id, localization_id, name, description, image, created_at, updated_at
            `;
            const values = [
                projectData.localization_id,
                projectData.name,
                projectData.description || null,
                projectData.image || null
            ];
            const result: QueryResult<Project> = await this.db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating project: ${error}`);
        }
    }

    // Update project by ID
    async updateById(id: number, projectData: Partial<Omit<Project, 'project_id' | 'created_at' | 'updated_at'>>): Promise<Project | null> {
        try {
            const updateFields: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (projectData.localization_id !== undefined) {
                updateFields.push(`localization_id = $${paramCount++}`);
                values.push(projectData.localization_id);
            }
            if (projectData.name !== undefined) {
                updateFields.push(`name = $${paramCount++}`);
                values.push(projectData.name);
            }
            if (projectData.description !== undefined) {
                updateFields.push(`description = $${paramCount++}`);
                values.push(projectData.description);
            }
            if (projectData.image !== undefined) {
                updateFields.push(`image = $${paramCount++}`);
                values.push(projectData.image);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push(`updated_at = NOW()`);
            values.push(id);

            const query = `
                UPDATE project
                SET ${updateFields.join(', ')}
                WHERE project_id = $${paramCount}
                    RETURNING project_id, localization_id, name, description, image, created_at, updated_at
            `;

            const result: QueryResult<Project> = await this.db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error updating project with ID ${id}: ${error}`);
        }
    }

    // Delete project by ID
    async deleteById(id: number): Promise<boolean> {
        try {
            const query = `DELETE FROM project WHERE project_id = $1`;
            const result = await this.db.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new Error(`Error deleting project with ID ${id}: ${error}`);
        }
    }

    // Get projects with pagination
    async findWithPagination(limit: number = 10, offset: number = 0): Promise<{projects: Project[], total: number}> {
        try {
            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM project`;
            const countResult = await this.db.query(countQuery);
            const total = parseInt(countResult.rows[0].total);

            // Get paginated results
            const query = `
                SELECT project_id, localization_id, name, description, image, created_at, updated_at
                FROM project
                ORDER BY created_at DESC
                    LIMIT $1 OFFSET $2
            `;
            const result: QueryResult<Project> = await this.db.query(query, [limit, offset]);

            return {
                projects: result.rows,
                total
            };
        } catch (error) {
            throw new Error(`Error fetching paginated projects: ${error}`);
        }
    }

    // Get projects by localization_id
    async findByLocalizationId(localizationId: number): Promise<Project[]> {
        try {
            const query = `
                SELECT project_id, localization_id, name, description, image, created_at, updated_at 
                FROM project 
                WHERE localization_id = $1
                ORDER BY created_at DESC
            `;
            const result: QueryResult<Project> = await this.db.query(query, [localizationId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching projects for localization ID ${localizationId}: ${error}`);
        }
    }
}

export { ProjectModel };