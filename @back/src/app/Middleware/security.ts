import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import type { Express } from 'express';

export const setupSecurity = (app: Express) => {
    // Helmet
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP'
    });
    app.use(limiter);

    // CORS
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }));
};
