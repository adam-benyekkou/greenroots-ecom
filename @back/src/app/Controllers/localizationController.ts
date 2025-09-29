import type { Request, Response } from 'express';
import { LocalizationModel } from '../Models/localizationModel.js';

const localizationModel = new LocalizationModel();

const localizationController = {
    // Get all localizations with pagination
    async index(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const result = await localizationModel.findWithPagination(limit, offset);

            res.json({
                message: 'Localizations retrieved successfully',
                data: result.localizations,
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
                message: 'Error retrieving localizations',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Get all localizations without pagination
    async all(req: Request, res: Response) {
        try {
            const localizations = await localizationModel.findAll();

            res.json({
                message: 'Localizations retrieved successfully',
                data: localizations,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving localizations',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Get single localization by ID
    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid localization ID',
                    status: 400
                });
            }

            const localization = await localizationModel.findById(id);

            if (!localization) {
                return res.status(404).json({
                    message: 'Localization not found',
                    status: 404
                });
            }

            res.json({
                message: 'Localization retrieved successfully',
                data: localization,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving localization',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Get localizations by continent
    async byContinent(req: Request, res: Response) {
        try {
            const continent = req.params.continent;

            if (!continent) {
                return res.status(400).json({
                    message: 'Continent parameter is required',
                    status: 400
                });
            }

            const localizations = await localizationModel.findByContinent(continent);

            res.json({
                message: `Localizations for ${continent} retrieved successfully`,
                data: localizations,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving localizations by continent',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Get localization by country
    async byCountry(req: Request, res: Response) {
        try {
            const country = req.params.country;

            if (!country) {
                return res.status(400).json({
                    message: 'Country parameter is required',
                    status: 400
                });
            }

            const localization = await localizationModel.findByCountry(country);

            if (!localization) {
                return res.status(404).json({
                    message: 'Localization not found for this country',
                    status: 404
                });
            }

            res.json({
                message: `Localization for ${country} retrieved successfully`,
                data: localization,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving localization by country',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Get all continents
    async continents(req: Request, res: Response) {
        try {
            const continents = await localizationModel.findAllContinents();

            res.json({
                message: 'Continents retrieved successfully',
                data: continents,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving continents',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Create new localization
    async create(req: Request, res: Response) {
        try {
            const { country, continent } = req.body;

            if (!country || !continent) {
                return res.status(400).json({
                    message: 'Country and continent are required',
                    status: 400
                });
            }

            // Check if country already exists
            const exists = await localizationModel.existsByCountry(country);
            if (exists) {
                return res.status(409).json({
                    message: 'Localization for this country already exists',
                    status: 409
                });
            }

            const localization = await localizationModel.create({
                country,
                continent
            });

            res.status(201).json({
                message: 'Localization created successfully',
                data: localization,
                status: 201
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error creating localization',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Update localization by ID
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid localization ID',
                    status: 400
                });
            }

            const { country, continent } = req.body;

            if (!country && !continent) {
                return res.status(400).json({
                    message: 'At least one field (country or continent) is required',
                    status: 400
                });
            }

            // If updating country, check if new country already exists
            if (country) {
                const exists = await localizationModel.existsByCountry(country);
                if (exists) {
                    const existingLocalization = await localizationModel.findByCountry(country);
                    if (existingLocalization && existingLocalization.localization_id !== id) {
                        return res.status(409).json({
                            message: 'Localization for this country already exists',
                            status: 409
                        });
                    }
                }
            }

            const localization = await localizationModel.updateById(id, {
                country,
                continent
            });

            if (!localization) {
                return res.status(404).json({
                    message: 'Localization not found',
                    status: 404
                });
            }

            res.json({
                message: 'Localization updated successfully',
                data: localization,
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating localization',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    },

    // Delete localization by ID
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid localization ID',
                    status: 400
                });
            }

            const deleted = await localizationModel.deleteById(id);

            if (!deleted) {
                return res.status(404).json({
                    message: 'Localization not found',
                    status: 404
                });
            }

            res.json({
                message: 'Localization deleted successfully',
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting localization',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 500
            });
        }
    }
};

export { localizationController };