import { Router } from 'express';
import { ordersController } from "../app/Controllers/ordersController.js";


const orderRouter = Router();

orderRouter.get('/api/orders', ordersController.index)
orderRouter.post('/api/orders', ordersController.create);

orderRouter.get('/api/orders/:id', ordersController.show);

export { orderRouter };
