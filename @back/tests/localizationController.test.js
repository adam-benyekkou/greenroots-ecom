import { jest, describe, it, beforeEach, expect } from '@jest/globals';

// Mock LocalizationModel
const mockLocalizationModel = {
    findWithPagination: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByContinent: jest.fn(),
    findByCountry: jest.fn(),
    findAllContinents: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    existsByCountry: jest.fn()
};

// Create a mock controller that simulates your actual controller logic
const createMockController = () => ({
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const result = await mockLocalizationModel.findWithPagination(limit, offset);

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

    async all(req, res) {
        try {
            const localizations = await mockLocalizationModel.findAll();

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

    async show(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid localization ID',
                    status: 400
                });
            }

            const localization = await mockLocalizationModel.findById(id);

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

    async byContinent(req, res) {
        try {
            const continent = req.params.continent;

            if (!continent) {
                return res.status(400).json({
                    message: 'Continent parameter is required',
                    status: 400
                });
            }

            const localizations = await mockLocalizationModel.findByContinent(continent);

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

    async byCountry(req, res) {
        try {
            const country = req.params.country;

            if (!country) {
                return res.status(400).json({
                    message: 'Country parameter is required',
                    status: 400
                });
            }

            const localization = await mockLocalizationModel.findByCountry(country);

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

    async continents(req, res) {
        try {
            const continents = await mockLocalizationModel.findAllContinents();

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

    async create(req, res) {
        try {
            const { country, continent } = req.body;

            if (!country || !continent) {
                return res.status(400).json({
                    message: 'Country and continent are required',
                    status: 400
                });
            }

            const exists = await mockLocalizationModel.existsByCountry(country);
            if (exists) {
                return res.status(409).json({
                    message: 'Localization for this country already exists',
                    status: 409
                });
            }

            const localization = await mockLocalizationModel.create({
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

    async update(req, res) {
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

            if (country) {
                const exists = await mockLocalizationModel.existsByCountry(country);
                if (exists) {
                    const existingLocalization = await mockLocalizationModel.findByCountry(country);
                    if (existingLocalization && existingLocalization.localization_id !== id) {
                        return res.status(409).json({
                            message: 'Localization for this country already exists',
                            status: 409
                        });
                    }
                }
            }

            const localization = await mockLocalizationModel.updateById(id, {
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

    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid localization ID',
                    status: 400
                });
            }

            const deleted = await mockLocalizationModel.deleteById(id);

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
});

describe('LocalizationController Logic Tests', () => {
    let localizationController, req, res;

    beforeEach(() => {
        localizationController = createMockController();
        req = {
            query: {},
            params: {},
            body: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('index method', () => {
        it('should return localizations with pagination', async () => {
            // Arrange
            req.query = { page: '1', limit: '10' };
            const mockLocalizations = [
                { localization_id: 1, country: 'France', continent: 'Europe' },
                { localization_id: 2, country: 'Germany', continent: 'Europe' }
            ];
            mockLocalizationModel.findWithPagination.mockResolvedValue({
                localizations: mockLocalizations,
                total: 25
            });

            // Act
            await localizationController.index(req, res);

            // Assert
            expect(mockLocalizationModel.findWithPagination).toHaveBeenCalledWith(10, 0);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localizations retrieved successfully',
                data: mockLocalizations,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                    pages: 3
                },
                status: 200
            });
        });

        it('should use default pagination when no query params', async () => {
            // Arrange
            req.query = {};
            mockLocalizationModel.findWithPagination.mockResolvedValue({
                localizations: [],
                total: 0
            });

            // Act
            await localizationController.index(req, res);

            // Assert
            expect(mockLocalizationModel.findWithPagination).toHaveBeenCalledWith(10, 0);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localizations retrieved successfully',
                data: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pages: 0
                },
                status: 200
            });
        });

        it('should handle database errors', async () => {
            // Arrange
            req.query = {};
            mockLocalizationModel.findWithPagination.mockRejectedValue(new Error('Database connection failed'));

            // Act
            await localizationController.index(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error retrieving localizations',
                error: 'Database connection failed',
                status: 500
            });
        });
    });

    describe('all method', () => {
        it('should return all localizations without pagination', async () => {
            // Arrange
            const mockLocalizations = [
                { localization_id: 1, country: 'France', continent: 'Europe' },
                { localization_id: 2, country: 'Japan', continent: 'Asia' }
            ];
            mockLocalizationModel.findAll.mockResolvedValue(mockLocalizations);

            // Act
            await localizationController.all(req, res);

            // Assert
            expect(mockLocalizationModel.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localizations retrieved successfully',
                data: mockLocalizations,
                status: 200
            });
        });

        it('should handle database errors', async () => {
            // Arrange
            mockLocalizationModel.findAll.mockRejectedValue(new Error('Database error'));

            // Act
            await localizationController.all(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error retrieving localizations',
                error: 'Database error',
                status: 500
            });
        });
    });

    describe('show method', () => {
        it('should return single localization when found', async () => {
            // Arrange
            req.params = { id: '1' };
            const mockLocalization = {
                localization_id: 1,
                country: 'France',
                continent: 'Europe'
            };
            mockLocalizationModel.findById.mockResolvedValue(mockLocalization);

            // Act
            await localizationController.show(req, res);

            // Assert
            expect(mockLocalizationModel.findById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization retrieved successfully',
                data: mockLocalization,
                status: 200
            });
        });

        it('should return 404 when localization not found', async () => {
            // Arrange
            req.params = { id: '999' };
            mockLocalizationModel.findById.mockResolvedValue(null);

            // Act
            await localizationController.show(req, res);

            // Assert
            expect(mockLocalizationModel.findById).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization not found',
                status: 404
            });
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params = { id: 'invalid' };

            // Act
            await localizationController.show(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid localization ID',
                status: 400
            });
            expect(mockLocalizationModel.findById).not.toHaveBeenCalled();
        });
    });

    describe('byContinent method', () => {
        it('should return localizations for a continent', async () => {
            // Arrange
            req.params = { continent: 'Europe' };
            const mockLocalizations = [
                { localization_id: 1, country: 'France', continent: 'Europe' },
                { localization_id: 2, country: 'Germany', continent: 'Europe' }
            ];
            mockLocalizationModel.findByContinent.mockResolvedValue(mockLocalizations);

            // Act
            await localizationController.byContinent(req, res);

            // Assert
            expect(mockLocalizationModel.findByContinent).toHaveBeenCalledWith('Europe');
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localizations for Europe retrieved successfully',
                data: mockLocalizations,
                status: 200
            });
        });

        it('should return 400 when continent parameter is missing', async () => {
            // Arrange
            req.params = {};

            // Act
            await localizationController.byContinent(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Continent parameter is required',
                status: 400
            });
        });
    });

    describe('byCountry method', () => {
        it('should return localization for a country', async () => {
            // Arrange
            req.params = { country: 'France' };
            const mockLocalization = { localization_id: 1, country: 'France', continent: 'Europe' };
            mockLocalizationModel.findByCountry.mockResolvedValue(mockLocalization);

            // Act
            await localizationController.byCountry(req, res);

            // Assert
            expect(mockLocalizationModel.findByCountry).toHaveBeenCalledWith('France');
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization for France retrieved successfully',
                data: mockLocalization,
                status: 200
            });
        });

        it('should return 404 when country not found', async () => {
            // Arrange
            req.params = { country: 'UnknownCountry' };
            mockLocalizationModel.findByCountry.mockResolvedValue(null);

            // Act
            await localizationController.byCountry(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization not found for this country',
                status: 404
            });
        });
    });

    describe('continents method', () => {
        it('should return all continents', async () => {
            // Arrange
            const mockContinents = ['Europe', 'Asia', 'Africa', 'North America'];
            mockLocalizationModel.findAllContinents.mockResolvedValue(mockContinents);

            // Act
            await localizationController.continents(req, res);

            // Assert
            expect(mockLocalizationModel.findAllContinents).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Continents retrieved successfully',
                data: mockContinents,
                status: 200
            });
        });
    });

    describe('create method', () => {
        it('should create new localization successfully', async () => {
            // Arrange
            req.body = { country: 'Spain', continent: 'Europe' };
            const mockLocalization = { localization_id: 3, country: 'Spain', continent: 'Europe' };
            mockLocalizationModel.existsByCountry.mockResolvedValue(false);
            mockLocalizationModel.create.mockResolvedValue(mockLocalization);

            // Act
            await localizationController.create(req, res);

            // Assert
            expect(mockLocalizationModel.existsByCountry).toHaveBeenCalledWith('Spain');
            expect(mockLocalizationModel.create).toHaveBeenCalledWith({
                country: 'Spain',
                continent: 'Europe'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization created successfully',
                data: mockLocalization,
                status: 201
            });
        });

        it('should return 400 when required fields are missing', async () => {
            // Arrange
            req.body = { country: 'Spain' }; // Missing continent

            // Act
            await localizationController.create(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Country and continent are required',
                status: 400
            });
        });

        it('should return 409 when country already exists', async () => {
            // Arrange
            req.body = { country: 'France', continent: 'Europe' };
            mockLocalizationModel.existsByCountry.mockResolvedValue(true);

            // Act
            await localizationController.create(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization for this country already exists',
                status: 409
            });
        });
    });

    describe('update method', () => {
        it('should update localization successfully', async () => {
            // Arrange
            req.params = { id: '1' };
            req.body = { continent: 'Europe' };
            const mockLocalization = { localization_id: 1, country: 'France', continent: 'Europe' };
            mockLocalizationModel.updateById.mockResolvedValue(mockLocalization);

            // Act
            await localizationController.update(req, res);

            // Assert
            expect(mockLocalizationModel.updateById).toHaveBeenCalledWith(1, {
                country: undefined,
                continent: 'Europe'
            });
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization updated successfully',
                data: mockLocalization,
                status: 200
            });
        });

        it('should return 400 when no fields to update', async () => {
            // Arrange
            req.params = { id: '1' };
            req.body = {};

            // Act
            await localizationController.update(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'At least one field (country or continent) is required',
                status: 400
            });
        });

        it('should return 404 when localization not found', async () => {
            // Arrange
            req.params = { id: '999' };
            req.body = { continent: 'Europe' };
            mockLocalizationModel.updateById.mockResolvedValue(null);

            // Act
            await localizationController.update(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization not found',
                status: 404
            });
        });
    });

    describe('delete method', () => {
        it('should delete localization successfully', async () => {
            // Arrange
            req.params = { id: '1' };
            mockLocalizationModel.deleteById.mockResolvedValue(true);

            // Act
            await localizationController.delete(req, res);

            // Assert
            expect(mockLocalizationModel.deleteById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization deleted successfully',
                status: 200
            });
        });

        it('should return 404 when localization not found', async () => {
            // Arrange
            req.params = { id: '999' };
            mockLocalizationModel.deleteById.mockResolvedValue(false);

            // Act
            await localizationController.delete(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Localization not found',
                status: 404
            });
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params = { id: 'invalid' };

            // Act
            await localizationController.delete(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid localization ID',
                status: 400
            });
        });
    });
});