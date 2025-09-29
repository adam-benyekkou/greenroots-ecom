// controllers/cartController.js
import { CartModel } from '../Models/cartModel.ts';

const cartModel = new CartModel();

const cartController = {
    // GET /api/cart - Get cart information and available operations
    index(req, res) {
        try {
            res.json({
                message: 'GreenRoots Cart API',
                description: 'Cart management endpoints for localStorage integration',
                endpoints: {
                    'GET /api/cart': 'Get cart information',
                    'POST /api/cart': 'Validate item before adding to cart',
                    'PUT /api/cart/:tree_id': 'Validate item update',
                    'DELETE /api/cart/:tree_id': 'Validate item removal',
                    'POST /api/cart/validate': 'Validate entire cart before checkout',
                    'GET /api/cart/trees': 'Get multiple tree details for cart display'
                },
                note: 'Cart data is stored in localStorage. These endpoints provide validation and tree information.',
                version: '1.0.0',
                status: 200
            });
        } catch (error) {
            console.error('Cart index error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to process request',
                status: 500
            });
        }
    },

    // POST /api/cart - Validate and get tree information for adding to cart
    async create(req, res) {
        try {
            const { tree_id, quantity } = req.body;

            // Validate input
            if (!tree_id || typeof tree_id !== 'number') {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'tree_id is required and must be a number',
                    status: 400
                });
            }

            if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'quantity is required and must be a positive number',
                    status: 400
                });
            }

            // Validate tree exists and get current details
            const result = await cartModel.getTreeForCartOperation(tree_id, quantity);

            if (!result.tree) {
                return res.status(404).json({
                    error: 'Tree not found',
                    message: `Tree with ID ${tree_id} does not exist`,
                    status: 404
                });
            }

            if (!result.tree.available) {
                return res.status(400).json({
                    error: 'Tree not available',
                    message: `Tree with ID ${tree_id} is currently not available`,
                    status: 400
                });
            }

            if (!result.valid_quantity) {
                return res.status(400).json({
                    error: 'Invalid quantity',
                    message: 'Quantity must be a positive integer',
                    status: 400
                });
            }

            res.json({
                message: 'Tree validated successfully',
                tree: {
                    tree_id: result.tree.tree_id,
                    name: result.tree.name,
                    description: result.tree.description,
                    price: Number(result.tree.price),
                    image: result.tree.image,
                    available: result.tree.available
                },
                requested_quantity: quantity,
                total_price: result.total_price.toFixed(2),
                instructions: 'Add this item to localStorage cart on frontend',
                version: '1.0.0',
                status: 200
            });

        } catch (error) {
            console.error('Cart create error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to validate tree for cart',
                status: 500
            });
        }
    },

    // PUT /api/cart/:tree_id - Validate cart item update
    async update(req, res) {
        try {
            const tree_id = parseInt(req.params.tree_id);
            const { quantity } = req.body;

            // Validate tree_id parameter
            if (!tree_id || isNaN(tree_id)) {
                return res.status(400).json({
                    error: 'Invalid parameter',
                    message: 'tree_id must be a valid number',
                    status: 400
                });
            }

            // Validate quantity
            if (typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'quantity must be a non-negative number',
                    status: 400
                });
            }

            // Validate the cart item
            const validation = await cartModel.validateCartItem(tree_id, quantity);

            if (!validation.valid) {
                return res.status(400).json({
                    error: 'Validation failed',
                    message: validation.error,
                    tree_id: tree_id,
                    suggested_quantity: validation.suggested_quantity,
                    status: 400
                });
            }

            const tree = validation.tree;

            const response = {
                message: quantity === 0 ? 'Item removal validated' : 'Item update validated',
                tree: {
                    tree_id: tree.tree_id,
                    name: tree.name,
                    price: Number(tree.price),
                    available: tree.available
                },
                old_quantity: 'unknown', // Frontend should provide this
                new_quantity: quantity,
                action: quantity === 0 ? 'remove' : 'update',
                version: '1.0.0',
                status: 200
            };

            if (quantity > 0) {
                response.new_total_price = (Number(tree.price) * quantity).toFixed(2);
            }

            res.json(response);

        } catch (error) {
            console.error('Cart update error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to validate cart update',
                status: 500
            });
        }
    },

    // DELETE /api/cart/:tree_id - Validate cart item removal
    async delete(req, res) {
        try {
            const tree_id = parseInt(req.params.tree_id);

            // Validate tree_id parameter
            if (!tree_id || isNaN(tree_id)) {
                return res.status(400).json({
                    error: 'Invalid parameter',
                    message: 'tree_id must be a valid number',
                    status: 400
                });
            }

            // Optional: Verify tree exists (for logging/analytics purposes)
            const tree = await cartModel.validateTreeForCart(tree_id);

            if (!tree) {
                return res.status(404).json({
                    error: 'Tree not found',
                    message: `Tree with ID ${tree_id} does not exist`,
                    status: 404
                });
            }

            res.json({
                message: 'Item removal validated',
                tree_id: tree_id,
                action: 'remove',
                instructions: 'Remove item from localStorage cart on frontend',
                version: '1.0.0',
                status: 200
            });

        } catch (error) {
            console.error('Cart delete error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to validate item removal',
                status: 500
            });
        }
    },

    // POST /api/cart/validate - Validate entire cart before checkout
    async validateCart(req, res) {
        try {
            const { cart_items } = req.body;

            if (!cart_items || !Array.isArray(cart_items)) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'cart_items must be an array',
                    status: 400
                });
            }

            if (cart_items.length === 0) {
                return res.status(400).json({
                    error: 'Empty cart',
                    message: 'Cart cannot be empty',
                    status: 400
                });
            }

            // Validate cart items format
            for (const item of cart_items) {
                if (!item.tree_id || !item.quantity || typeof item.cart_price !== 'number') {
                    return res.status(400).json({
                        error: 'Invalid cart item format',
                        message: 'Each cart item must have tree_id, quantity, and cart_price',
                        status: 400
                    });
                }
            }

            // Validate entire cart using the model
            const summary = await cartModel.getCartSummary(cart_items);

            if (!summary.cart_valid) {
                return res.status(400).json({
                    message: 'Cart validation failed',
                    valid: false,
                    valid_items: summary.valid_items,
                    invalid_items: summary.invalid_items,
                    errors: summary.invalid_items.map(item => ({
                        tree_id: item.tree_id,
                        error: item.error
                    })),
                    version: '1.0.0',
                    status: 400
                });
            }

            const response = {
                message: 'Cart validation successful',
                valid: true,
                valid_items: summary.valid_items,
                invalid_items: summary.invalid_items,
                total_amount: summary.total_amount.toFixed(2),
                total_items: summary.total_items,
                ready_for_checkout: true,
                version: '1.0.0',
                status: 200
            };

            res.json(response);

        } catch (error) {
            console.error('Cart validation error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to validate cart',
                status: 500
            });
        }
    },

    // GET /api/cart/trees - Get multiple tree details for cart display
    async getTrees(req, res) {
        try {
            const { tree_ids } = req.query;

            if (!tree_ids) {
                return res.status(400).json({
                    error: 'Missing parameter',
                    message: 'tree_ids query parameter is required',
                    example: '/api/cart/trees?tree_ids=1,2,3',
                    status: 400
                });
            }

            const ids = tree_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (ids.length === 0) {
                return res.status(400).json({
                    error: 'Invalid tree IDs',
                    message: 'No valid tree IDs provided',
                    status: 400
                });
            }

            // Get trees using the model
            const trees = await cartModel.getTreesByIds(ids);

            res.json({
                message: 'Trees retrieved successfully',
                trees: trees.map(tree => ({
                    tree_id: tree.tree_id,
                    name: tree.name,
                    description: tree.description,
                    price: Number(tree.price),
                    image: tree.image,
                    available: tree.available
                })),
                count: trees.length,
                version: '1.0.0',
                status: 200
            });

        } catch (error) {
            console.error('Get trees error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Unable to retrieve tree information',
                status: 500
            });
        }
    }
};

export { cartController };