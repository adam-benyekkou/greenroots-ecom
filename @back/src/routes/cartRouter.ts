import { Router } from 'express';
import { cartController } from "../app/Controllers/cartController.js";

const cartRouter = Router();

cartRouter.get('/api/cart', cartController.index);
cartRouter.post('/api/cart', cartController.create);

cartRouter.put('/api/cart/:itemID', cartController.update);
cartRouter.delete('/api/cart/:itemID', cartController.delete);


export { cartRouter };
