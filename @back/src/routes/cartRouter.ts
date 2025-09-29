import { Router } from 'express';
import { cartController } from "../app/Controllers/cartController.ts";

const cartRouter = Router();

// GET /api/cart - Get cart information and available operations
cartRouter.get('/api/cart', cartController.index);

// POST /api/cart - Validate and get tree information for adding to cart
cartRouter.post('/api/cart', cartController.create);

// PUT /api/cart/:tree_id - Validate cart item update
cartRouter.put('/api/cart/:tree_id', cartController.update);

// DELETE /api/cart/:tree_id - Validate cart item removal
cartRouter.delete('/api/cart/:tree_id', cartController.delete);

// POST /api/cart/validate - Validate entire cart before checkout
cartRouter.post('/api/cart/validate', cartController.validateCart);

// GET /api/cart/trees - Get multiple tree details for cart display
// Usage: /api/cart/trees?tree_ids=1,2,3
cartRouter.get('/api/cart/trees', cartController.getTrees);

export { cartRouter };