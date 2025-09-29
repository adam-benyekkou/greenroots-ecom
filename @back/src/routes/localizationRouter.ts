import { Router } from 'express';
import { localizationController } from "../app/Controllers/localizationController.js";

const localizationRouter = Router();

localizationRouter.get('/api/locations', localizationController.index);
localizationRouter.get('/api/locations/:id', localizationController.show);

export { localizationRouter };
