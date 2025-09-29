// config/auth.config.ts

export const authConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: process.env.JWT_ISSUER || 'greenroots-app',
        algorithm: 'HS256' as const,
    },

    argon2: {
        type: 2 as const, // argon2id
        memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536'), // 64MB
        timeCost: parseInt(process.env.ARGON2_TIME_COST || '3'),
        parallelism: parseInt(process.env.ARGON2_PARALLELISM || '1'),
    },

    password: {
        minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
        maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH || '128'),
        requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
        requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
        requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
        requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL === 'true',
    },
};

// Validation function for environment variables
export const validateAuthConfig = (): void => {
    const required = ['JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('JWT_SECRET should be at least 32 characters long for better security');
    }
};