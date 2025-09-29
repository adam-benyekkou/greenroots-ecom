import 'dotenv/config';
import express from 'express';
import { router } from "./routes/index.js";
import { setupSecurity } from './app/Middleware/security.js';
import { errorHandler } from './app/Middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
setupSecurity(app);

// Body parsing - raw body for Stripe webhooks, JSON for everything else
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
