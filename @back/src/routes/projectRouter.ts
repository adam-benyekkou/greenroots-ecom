import { Router } from 'express';
import { projectController } from "../app/Controllers/projectController.js";

const projectRouter = Router();

projectRouter.get('/api/projects', projectController.index);
projectRouter.get('/api/projects/:id', projectController.show);



export { projectRouter };
