import dotenv from "dotenv";
dotenv.config();

// port

export const PORT = process.env.PORT || (5000 as unknown as number);

// Database

const MONGO_URI = process.env.MONGO_URI as string;
const MONGO_PASS = process.env.MONGO_PASS as string;

// jwt

const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiry = process.env.JWT_EXPIRY as string;

// redis

const redisUrl = process.env.REDIS_URL as string;

// mailer

const SMTP_EMAIL = process.env.SMTP_EMAIL as string;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

export { redisUrl, SMTP_EMAIL, SMTP_PASSWORD, MONGO_URI, jwtSecret, jwtExpiry };
