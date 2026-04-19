import dotenv from 'dotenv';
dotenv.config();
function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Environment variable ${key} is not set. Please check your .env file.`);
    }
    return value;
}
function getEnv(key, defaultValue) {
    return process.env[key] ?? defaultValue;
}
// Validate and export environment configuration
export const env = {
    // Server Configuration
    PORT: parseInt(getEnv('PORT', '4000')),
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    // Security
    JWT_SECRET: requireEnv('JWT_SECRET'),
    // Database Configuration
    DATABASE_URL: requireEnv('DATABASE_URL'),
    // CORS Configuration
    CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
    // OpenAI Configuration
    OPENAI_API_KEY: getEnv('OPENAI_API_KEY', ''),
    // Application Info
    APP_NAME: getEnv('APP_NAME', 'Luxora Environmental'),
    APP_VERSION: getEnv('APP_VERSION', '2.0.0'),
};
// Validate PORT is a valid number
if (isNaN(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
    throw new Error(`❌ Invalid PORT: ${env.PORT}. Must be a number between 1 and 65535.`);
}
// Validate JWT_SECRET length in production
if (env.NODE_ENV === 'production' && env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long in production!');
}
export default env;
