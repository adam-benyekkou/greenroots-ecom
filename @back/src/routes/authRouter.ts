import { Router } from 'express';
import { authController } from "../app/Controllers/authController.js";

const authRouter = Router();

authRouter.post('/api/auth/login', authController.login);
authRouter.post('/api/auth/logout', authController.logout);
authRouter.post('/api/auth/register', authController.register);

export { authRouter };
