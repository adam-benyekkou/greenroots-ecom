import { Router } from 'express';
import { treeRouter } from "./treeRouter.js";
import {cartRouter} from "./cartRouter.js";
import {userRouter} from "./userRouter.js";
import {orderRouter} from "./orderRouter.js";
import {projectRouter} from "./projectRouter.js";
import {localizationRouter} from "./localizationRouter.js";

const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: 'GreenRoots API Server',
        version: '1.0.0',
        status: 'running'
    });
});

router.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

router.use(userRouter);
router.use(treeRouter);
router.use(cartRouter);
router.use(orderRouter);
router.use(projectRouter);
router.use(localizationRouter);

export { router };
