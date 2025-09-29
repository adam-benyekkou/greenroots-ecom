import type { Request, Response } from 'express';
import { TreeModel } from '../Models/treeModel.js';

const treeModel = new TreeModel();

const treeController = {
    async index(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            // Get all trees with projects and localizations
            const allTrees = await treeModel.findAllWithProjectsAndLocalizations();

            // Apply pagination manually
            const total = allTrees.length;
            const trees = allTrees.slice(offset, offset + limit);

            res.json({
                message: 'Trees retrieved successfully',
                data: trees,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving trees',
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
                    message: 'Invalid tree ID',
                    status: 400
                });
            }

            const tree = await treeModel.findByIdWithProjectsAndLocalizations(id);

            if (!tree) {
                return res.status(404).json({
                    message: 'Tree not found',
                    status: 404
                });
            }

            res.json({
                message: 'Tree retrieved successfully',
                data: tree,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving tree',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    async findByContinent(req: Request, res: Response) {
        try {
            const continentParam = req.params.continent;

            if (!continentParam || typeof continentParam !== 'string') {
                return res.status(400).json({
                    message: 'Continent parameter is required',
                    status: 400
                });
            }

            // Mapping URL française -> nom base de données française
            const continentMapping: Record<string, string> = {
                'europe': 'Europe',
                'asie': 'Asie',
                'amerique-nord': 'Amérique du Nord',
                'amerique-sud': 'Amérique du Sud',
                'afrique': 'Afrique',
                'oceanie': 'Océanie'  // Changé de 'australie': 'Australie'
            };

            const continent = continentMapping[continentParam.toLowerCase()];

            if (!continent) {
                return res.status(400).json({
                    message: 'Continent invalide. Continents valides : ' + Object.keys(continentMapping).join(', '),
                    status: 400
                });
            }

            const trees = await treeModel.findByContinent(continent);

            // Optional pagination for continent results
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const total = trees.length;
            const paginatedTrees = trees.slice(offset, offset + limit);

            res.json({
                message: `Trees from ${continent} retrieved successfully`,
                data: paginatedTrees,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving trees by continent',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    async homepage(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 3;

            if (limit <= 0 || limit > 20) {
                return res.status(400).json({
                    message: 'Limit must be between 1 and 20',
                    status: 400
                });
            }

            // Get trees by ID range with projects and localizations for homepage showcase
            const trees = await treeModel.findByIdRangeWithProjectsAndLocalizations(limit);

            res.json({
                message: `Homepage trees retrieved successfully (IDs 1-${limit})`,
                data: trees,
                count: trees.length,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving homepage trees',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    }

}

export { treeController };