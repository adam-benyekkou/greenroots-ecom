import { Router } from 'express';
import { adminController} from "../app/Controllers/adminController.js";

const adminRouter = Router();

adminRouter.post('/api/admin/trees', adminController.create);

adminRouter.put('/api/admin/trees/:id', adminController.update);
adminRouter.delete('/api/admin/trees/:id', adminController.delete);


export { adminRouter };
