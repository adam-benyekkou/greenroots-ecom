import type { Request, Response } from 'express';
import { ProjectModel } from '../Models/projectModel.js';

const projectModel = new ProjectModel();

const projectController = {
    async index(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const result = await projectModel.findWithPagination(limit, offset);

            res.json({
                message: 'Projects retrieved successfully',
                data: result.projects,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: Math.ceil(result.total / limit)
                },
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving projects',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid project ID',
                    status: 400
                });
            }

            const project = await projectModel.findById(id);

            if (!project) {
                return res.status(404).json({
                    message: 'Project not found',
                    status: 404
                });
            }

            res.json({
                message: 'Project retrieved successfully',
                data: project,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving project',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },
}

export {projectController};

