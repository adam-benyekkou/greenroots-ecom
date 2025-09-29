// tests/middleware/errorHandler.test.js
import express from 'express';
import http from 'http';

// Your error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Something went wrong!' });
    } else {
        res.status(500).json({ message: err.message, stack: err.stack });
    }
};

describe('Error Handler Middleware', () => {
    let app;
    let server;
    let port;
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        if (server) {
            server.close();
        }
    });

    beforeEach(() => {
        app = express();
        port = Math.floor(Math.random() * 10000) + 30000;
    });

    const makeRequest = async (options = {}) => {
        const defaultOptions = {
            hostname: 'localhost',
            port: port,
            path: '/test',
            method: 'GET',
            headers: {}
        };

        const requestOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            const req = http.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    let body = null;
                    if (data) {
                        try {
                            body = JSON.parse(data);
                        } catch (e) {
                            body = data;
                        }
                    }

                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                });
            });

            req.on('error', reject);

            if (options.body) {
                req.write(JSON.stringify(options.body));
            }

            req.end();
        });
    };

    it('should handle errors in development mode', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            const error = new Error('Test error');
            next(error);
        });

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Test error');
        expect(response.body.stack).toBeDefined();
    });

    it('should hide error details in production mode', async () => {
        process.env.NODE_ENV = 'production';

        app.get('/test', (req, res, next) => {
            const error = new Error('Test error');
            next(error);
        });

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Something went wrong!');
        expect(response.body.stack).toBeUndefined();
    });

    it('should handle different error types', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            const error = new Error('Database connection failed');
            error.name = 'DatabaseError';
            next(error);
        });

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Database connection failed');
    });

    it('should handle errors without stack trace', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            const error = new Error('Test error');
            delete error.stack;
            next(error);
        });

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Test error');
        expect(response.body.stack).toBeUndefined();
    });

    it('should handle async errors', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', async (req, res, next) => {
            try {
                await Promise.reject(new Error('Async error'));
            } catch (error) {
                next(error);
            }
        });

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Async error');
    });

    it('should handle custom error status codes', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            const error = new Error('Not found');
            error.status = 404;
            next(error);
        });

        // Modified error handler to handle custom status
        const customErrorHandler = (err, req, res, next) => {
            console.error(err.stack);

            const status = err.status || 500;

            if (process.env.NODE_ENV === 'production') {
                res.status(status).json({ message: status === 500 ? 'Something went wrong!' : err.message });
            } else {
                res.status(status).json({ message: err.message, stack: err.stack });
            }
        };

        app.use(customErrorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Not found');
    });

    it('should handle validation errors specifically', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            const error = new Error('Validation failed');
            error.name = 'ValidationError';
            error.errors = [
                { field: 'email', message: 'Invalid email' },
                { field: 'password', message: 'Password too short' }
            ];
            next(error);
        });

        // Enhanced error handler for validation errors
        const enhancedErrorHandler = (err, req, res, next) => {
            console.error(err.stack);

            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: err.errors
                });
            }

            if (process.env.NODE_ENV === 'production') {
                res.status(500).json({ message: 'Something went wrong!' });
            } else {
                res.status(500).json({ message: err.message, stack: err.stack });
            }
        };

        app.use(enhancedErrorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toHaveLength(2);
    });

    it('should handle middleware chain errors', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test',
            (req, res, next) => {
                // First middleware passes
                next();
            },
            (req, res, next) => {
                // Second middleware throws error
                throw new Error('Middleware chain error');
            },
            (req, res) => {
                // This should not be reached
                res.json({ message: 'success' });
            }
        );

        app.use(errorHandler);
        server = app.listen(port);

        const response = await makeRequest();

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Middleware chain error');
    });

    it('should handle errors thrown in error handler', async () => {
        process.env.NODE_ENV = 'development';

        app.get('/test', (req, res, next) => {
            next(new Error('Original error'));
        });

        // Error handler that throws
        app.use((err, req, res, next) => {
            throw new Error('Error in error handler');
        });

        server = app.listen(port);

        // This should not crash the server
        const response = await makeRequest();

        // Express will handle this with default error handler
        expect(response.statusCode).toBe(500);
    });
});