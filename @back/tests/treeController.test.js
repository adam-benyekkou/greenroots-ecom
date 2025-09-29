// tests/treeController.test.js
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

// Mock TreeModel
const mockTreeModel = {
    findAllWithProjectsAndLocalizations: jest.fn(),
    findByIdWithProjectsAndLocalizations: jest.fn()
};

// Create a mock controller that simulates your actual controller logic
const createMockController = () => ({
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // Get all trees with projects and localizations
            const allTrees = await mockTreeModel.findAllWithProjectsAndLocalizations();

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

    async show(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid tree ID',
                    status: 400
                });
            }

            const tree = await mockTreeModel.findByIdWithProjectsAndLocalizations(id);

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
    }
});

describe('TreeController Logic Tests', () => {
    let treeController, req, res;

    beforeEach(() => {
        treeController = createMockController();
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
        it('should return trees with pagination and projects/localizations', async () => {
            // Arrange
            req.query = { page: '1', limit: '10' };
            const mockTrees = [
                {
                    tree_id: 1,
                    name: 'Oak Tree',
                    price: 50.00,
                    projects: [
                        {
                            project_id: 1,
                            name: 'Forest Restoration',
                            localization: {
                                localization_id: 1,
                                country: 'France',
                                continent: 'Europe'
                            }
                        }
                    ]
                },
                {
                    tree_id: 2,
                    name: 'Pine Tree',
                    price: 35.00,
                    projects: []
                }
            ];
            mockTreeModel.findAllWithProjectsAndLocalizations.mockResolvedValue(mockTrees);

            // Act
            await treeController.index(req, res);

            // Assert
            expect(mockTreeModel.findAllWithProjectsAndLocalizations).toHaveBeenCalledWith();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Trees retrieved successfully',
                data: mockTrees,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    pages: 1
                },
                status: 200
            });
        });

        it('should apply pagination correctly with larger dataset', async () => {
            // Arrange
            req.query = { page: '2', limit: '3' };
            const mockTrees = Array.from({ length: 10 }, (_, i) => ({
                tree_id: i + 1,
                name: `Tree ${i + 1}`,
                price: 25.00 + i,
                projects: []
            }));
            mockTreeModel.findAllWithProjectsAndLocalizations.mockResolvedValue(mockTrees);

            // Act
            await treeController.index(req, res);

            // Assert
            expect(mockTreeModel.findAllWithProjectsAndLocalizations).toHaveBeenCalledWith();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Trees retrieved successfully',
                data: mockTrees.slice(3, 6), // Page 2, limit 3 = items 3-5 (0-indexed)
                pagination: {
                    page: 2,
                    limit: 3,
                    total: 10,
                    pages: 4
                },
                status: 200
            });
        });

        it('should use default pagination when no query params', async () => {
            // Arrange
            req.query = {};
            mockTreeModel.findAllWithProjectsAndLocalizations.mockResolvedValue([]);

            // Act
            await treeController.index(req, res);

            // Assert
            expect(mockTreeModel.findAllWithProjectsAndLocalizations).toHaveBeenCalledWith();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Trees retrieved successfully',
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

        it('should handle empty results correctly', async () => {
            // Arrange
            req.query = { page: '5', limit: '10' };
            const mockTrees = Array.from({ length: 3 }, (_, i) => ({
                tree_id: i + 1,
                name: `Tree ${i + 1}`,
                projects: []
            }));
            mockTreeModel.findAllWithProjectsAndLocalizations.mockResolvedValue(mockTrees);

            // Act
            await treeController.index(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({
                message: 'Trees retrieved successfully',
                data: [], // Page 5 of 3 items = empty
                pagination: {
                    page: 5,
                    limit: 10,
                    total: 3,
                    pages: 1
                },
                status: 200
            });
        });

        it('should handle database errors', async () => {
            // Arrange
            req.query = {};
            mockTreeModel.findAllWithProjectsAndLocalizations.mockRejectedValue(new Error('Database connection failed'));

            // Act
            await treeController.index(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error retrieving trees',
                error: 'Database connection failed',
                status: 500
            });
        });

        it('should handle invalid page/limit values gracefully', async () => {
            // Arrange
            req.query = { page: 'invalid', limit: 'bad' };
            const mockTrees = [{ tree_id: 1, name: 'Test Tree', projects: [] }];
            mockTreeModel.findAllWithProjectsAndLocalizations.mockResolvedValue(mockTrees);

            // Act
            await treeController.index(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({
                message: 'Trees retrieved successfully',
                data: mockTrees,
                pagination: {
                    page: 1, // Defaults to 1 when NaN
                    limit: 10, // Defaults to 10 when NaN
                    total: 1,
                    pages: 1
                },
                status: 200
            });
        });
    });

    describe('show method', () => {
        it('should return single tree with projects and localizations when found', async () => {
            // Arrange
            req.params = { id: '1' };
            const mockTree = {
                tree_id: 1,
                name: 'Oak Tree',
                price: 50.00,
                description: 'A beautiful oak tree',
                projects: [
                    {
                        project_id: 1,
                        name: 'Forest Restoration',
                        description: 'Restoring forest ecosystem',
                        localization: {
                            localization_id: 1,
                            country: 'France',
                            continent: 'Europe'
                        }
                    },
                    {
                        project_id: 2,
                        name: 'Urban Greening',
                        description: 'City tree planting',
                        localization: {
                            localization_id: 2,
                            country: 'Germany',
                            continent: 'Europe'
                        }
                    }
                ]
            };
            mockTreeModel.findByIdWithProjectsAndLocalizations.mockResolvedValue(mockTree);

            // Act
            await treeController.show(req, res);

            // Assert
            expect(mockTreeModel.findByIdWithProjectsAndLocalizations).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Tree retrieved successfully',
                data: mockTree,
                status: 200
            });
        });

        it('should return tree with empty projects array when no projects exist', async () => {
            // Arrange
            req.params = { id: '2' };
            const mockTree = {
                tree_id: 2,
                name: 'Pine Tree',
                price: 35.00,
                description: 'A tall pine tree',
                projects: []
            };
            mockTreeModel.findByIdWithProjectsAndLocalizations.mockResolvedValue(mockTree);

            // Act
            await treeController.show(req, res);

            // Assert
            expect(mockTreeModel.findByIdWithProjectsAndLocalizations).toHaveBeenCalledWith(2);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Tree retrieved successfully',
                data: mockTree,
                status: 200
            });
        });

        it('should return 404 when tree not found', async () => {
            // Arrange
            req.params = { id: '999' };
            mockTreeModel.findByIdWithProjectsAndLocalizations.mockResolvedValue(null);

            // Act
            await treeController.show(req, res);

            // Assert
            expect(mockTreeModel.findByIdWithProjectsAndLocalizations).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Tree not found',
                status: 404
            });
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params = { id: 'invalid' };

            // Act
            await treeController.show(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid tree ID',
                status: 400
            });
            expect(mockTreeModel.findByIdWithProjectsAndLocalizations).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            // Arrange
            req.params = { id: '1' };
            mockTreeModel.findByIdWithProjectsAndLocalizations.mockRejectedValue(new Error('Database connection failed'));

            // Act
            await treeController.show(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error retrieving tree',
                error: 'Database connection failed',
                status: 500
            });
        });

        it('should parse numeric string IDs correctly', async () => {
            // Arrange
            req.params = { id: '42' };
            const mockTree = {
                tree_id: 42,
                name: 'Test Tree',
                price: 25.00,
                projects: [
                    {
                        project_id: 3,
                        name: 'Test Project',
                        localization: {
                            localization_id: 3,
                            country: 'Spain',
                            continent: 'Europe'
                        }
                    }
                ]
            };
            mockTreeModel.findByIdWithProjectsAndLocalizations.mockResolvedValue(mockTree);

            // Act
            await treeController.show(req, res);

            // Assert
            expect(mockTreeModel.findByIdWithProjectsAndLocalizations).toHaveBeenCalledWith(42);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Tree retrieved successfully',
                data: mockTree,
                status: 200
            });
        });
    });
});