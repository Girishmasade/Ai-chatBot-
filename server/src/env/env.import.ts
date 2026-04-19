import dotenv from "dotenv"
dotenv.config()

export const PORT = process.env.PORT || 5000 as unknown as number
const redisUrl = process.env.REDIS_URL as string

export {redisUrl}