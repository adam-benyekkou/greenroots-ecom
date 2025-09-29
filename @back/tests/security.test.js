// tests/middleware/security.test.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import http from 'http';

describe('Security Middleware', () => {
    let app;
    let server;
    let port;

    beforeEach(() => {
        app = express();

        // Setup security middleware (same as your setupSecurity function)
        app.use(helmet());

        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 5, // Lower limit for testing
            message: { error: 'Too many requests from this IP' }, // JSON response
            standardHeaders: 'draft-7', // Use draft-7 standard headers
            legacyHeaders: true // Keep legacy headers for backward compatibility
        });
        app.use(limiter);

        // Fix CORS to properly reject unauthorized origins
        app.use(cors({
            origin: (origin, callback) => {
                const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(null, false); // Reject but don't error
                }
            },
            credentials: true
        }));

        // Add a test route
        app.get('/test', (req, res) => {
            res.json({ message: 'test' });
        });

        // Start server on random port
        port = Math.floor(Math.random() * 10000) + 30000;
        server = app.listen(port);
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }
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
                            // If JSON parsing fails, return the raw text
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

    describe('Helmet Security Headers', () => {
        it('should set security headers', async () => {
            const response = await makeRequest();

            expect(response.headers['x-dns-prefetch-control']).toBe('off');
            expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
            expect(response.headers['x-download-options']).toBe('noopen');
            expect(response.headers['x-content-type-options']).toBe('nosniff');
            expect(response.headers['x-xss-protection']).toBe('0');
        });

        it('should remove X-Powered-By header', async () => {
            const response = await makeRequest();
            expect(response.headers['x-powered-by']).toBeUndefined();
        });
    });

    describe('CORS Configuration', () => {
        it('should allow requests from configured origin', async () => {
            const response = await makeRequest({
                headers: {
                    'Origin': 'http://localhost:3000'
                }
            });

            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
            expect(response.headers['access-control-allow-credentials']).toBe('true');
        });

        it('should reject requests from unauthorized origins', async () => {
            const response = await makeRequest({
                headers: {
                    'Origin': 'http://malicious-site.com'
                }
            });

            // CORS will not set the header for unauthorized origins
            expect(response.headers['access-control-allow-origin']).toBeUndefined();
        });

        it('should handle preflight OPTIONS requests', async () => {
            const response = await makeRequest({
                method: 'OPTIONS',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });

            expect(response.statusCode).toBe(204);
            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        });
    });

    describe('Rate Limiting', () => {
        it('should allow requests within rate limit', async () => {
            const response = await makeRequest();
            expect(response.statusCode).toBe(200);
            // Check for either legacy or standard rate limit headers
            const hasRateLimitHeaders =
                response.headers['x-ratelimit-remaining'] !== undefined ||
                response.headers['ratelimit-remaining'] !== undefined ||
                response.headers['x-ratelimit-limit'] !== undefined ||
                response.headers['ratelimit-limit'] !== undefined;

            expect(hasRateLimitHeaders).toBe(true);
        });

        it('should block requests exceeding rate limit', async () => {
            const promises = [];

            // Make 6 requests to exceed the limit of 5
            for (let i = 0; i < 6; i++) {
                promises.push(makeRequest());
            }

            const responses = await Promise.all(promises);
            const blockedResponses = responses.filter(r => r.statusCode === 429);

            expect(blockedResponses.length).toBeGreaterThan(0);
            // Check that blocked response has the error message
            const blockedResponse = blockedResponses[0];
            expect(blockedResponse.body.error).toBe('Too many requests from this IP');
        }, 10000);

        it('should reset rate limit after time window', async () => {
            // Create app with shorter rate limit for testing
            const testApp = express();

            const shortLimiter = rateLimit({
                windowMs: 2000, // 2 seconds for testing
                max: 2,
                message: { error: 'Too many requests' },
                standardHeaders: 'draft-7',
                legacyHeaders: true
            });

            testApp.use(shortLimiter);
            testApp.get('/test', (req, res) => res.json({ message: 'test' }));

            const testPort = port + 1;
            const testServer = testApp.listen(testPort);

            try {
                // First two requests should pass
                const response1 = await makeRequest({ port: testPort });
                const response2 = await makeRequest({ port: testPort });
                expect(response1.statusCode).toBe(200);
                expect(response2.statusCode).toBe(200);

                // Third should be blocked
                const blockedResponse = await makeRequest({ port: testPort });
                expect(blockedResponse.statusCode).toBe(429);

                // Wait for window to reset
                await new Promise(resolve => setTimeout(resolve, 2100));

                // Should work again
                const resetResponse = await makeRequest({ port: testPort });
                expect(resetResponse.statusCode).toBe(200);
            } finally {
                testServer.close();
            }
        }, 8000);
    });
});
