import { createClient } from "redis";
import type { RedisClientType } from "redis";

export const redisUrl = process.env.REDIS_URL as string;

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
  // socket: {
  //   tls: true,
  //   rejectUnauthorized: false,
  // },
});
