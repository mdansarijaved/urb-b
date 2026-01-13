import { createClient } from "redis";
import type { RedisClientType } from "redis";

export const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient: RedisClientType = createClient({ url: redisUrl });
