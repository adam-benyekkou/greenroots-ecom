// tests/middleware/validation.test.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import http from 'http';

// Your validation middleware function
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

describe('Validation Middleware', () => {
    let app;
    let server;
    let port;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        port = Math.floor(Math.random() * 10000) + 30000;
        server = app.listen(port);
    });

    afterEach(() => {
        if (server) {
            server.close();
        }
    });

    const makeRequest = async (options = {}) => {
        const defaultOptions = {
            hostname: 'localhost',
            port: port,
            path: '/test',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const requestOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            const req = http.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : null
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

    it('should pass validation with valid data', async () => {
        app.post('/test',
            body('email').isEmail(),
            body('name').isLength({ min: 2 }),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        const response = await makeRequest({
            body: {
                email: 'test@example.com',
                name: 'John Doe'
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('success');
    });

    it('should return 400 with validation errors', async () => {
        app.post('/test',
            body('email').isEmail(),
            body('name').isLength({ min: 2 }),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        const response = await makeRequest({
            body: {
                email: 'invalid-email',
                name: 'a' // too short
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors[0].path).toBe('email');
        expect(response.body.errors[1].path).toBe('name');
    });

    it('should handle empty request body', async () => {
        app.post('/test',
            body('email').isEmail(),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        const response = await makeRequest({
            body: {}
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toHaveLength(1);
    });

    it('should handle multiple validation rules on same field', async () => {
        app.post('/test',
            body('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters')
                .matches(/\d/)
                .withMessage('Password must contain a number'),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        const response = await makeRequest({
            body: {
                password: 'short' // fails both rules
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors.some(error => error.msg === 'Password must be at least 8 characters')).toBe(true);
        expect(response.body.errors.some(error => error.msg === 'Password must contain a number')).toBe(true);
    });

    it('should handle optional fields correctly', async () => {
        app.post('/test',
            body('email').isEmail(),
            body('phone').optional().matches(/^\+?[\d\s\-\(\)]+$/).withMessage('Invalid phone format'),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        // Should pass without phone
        const response1 = await makeRequest({
            body: {
                email: 'test@example.com'
            }
        });
        expect(response1.statusCode).toBe(200);

        // Should pass with valid phone formats
        const response2 = await makeRequest({
            body: {
                email: 'test@example.com',
                phone: '+1234567890'
            }
        });
        expect(response2.statusCode).toBe(200);

        const response2b = await makeRequest({
            body: {
                email: 'test@example.com',
                phone: '(555) 123-4567'
            }
        });
        expect(response2b.statusCode).toBe(200);

        // Should fail with invalid phone
        const response3 = await makeRequest({
            body: {
                email: 'test@example.com',
                phone: 'invalid-phone-abc'
            }
        });
        expect(response3.statusCode).toBe(400);
    });

    it('should sanitize input data', async () => {
        app.post('/test',
            body('name').trim().escape(),
            handleValidationErrors,
            (req, res) => {
                res.json({ name: req.body.name });
            }
        );

        const response = await makeRequest({
            body: {
                name: '  John <script>alert("xss")</script>  '
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('John &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should validate nested objects', async () => {
        app.post('/test',
            body('user.email').isEmail(),
            body('user.age').isInt({ min: 18 }),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        const response = await makeRequest({
            body: {
                user: {
                    email: 'invalid-email',
                    age: 15
                }
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors.some(error => error.path === 'user.email')).toBe(true);
        expect(response.body.errors.some(error => error.path === 'user.age')).toBe(true);
    });

    it('should handle array validation', async () => {
        app.post('/test',
            body('tags').isArray({ min: 1 }),
            body('tags.*').isString().isLength({ min: 2 }),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        // Valid array
        const response1 = await makeRequest({
            body: {
                tags: ['javascript', 'nodejs', 'express']
            }
        });
        expect(response1.statusCode).toBe(200);

        // Invalid array with short strings
        const response2 = await makeRequest({
            body: {
                tags: ['js', 'a']
            }
        });
        expect(response2.statusCode).toBe(400);
    });

    it('should handle custom validation', async () => {
        app.post('/test',
            body('confirmPassword').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
            handleValidationErrors,
            (req, res) => {
                res.json({ message: 'success' });
            }
        );

        // Matching passwords
        const response1 = await makeRequest({
            body: {
                password: 'secret123',
                confirmPassword: 'secret123'
            }
        });
        expect(response1.statusCode).toBe(200);

        // Non-matching passwords
        const response2 = await makeRequest({
            body: {
                password: 'secret123',
                confirmPassword: 'different'
            }
        });
        expect(response2.statusCode).toBe(400);
        expect(response2.body.errors[0].msg).toBe('Password confirmation does not match password');
    });
});