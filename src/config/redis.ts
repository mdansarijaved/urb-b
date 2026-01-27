// lib/redis.ts
import Redis from "ioredis"

export const redis = new Redis({
  host: "localhost", // or your cloud redis
  port: 6379,
})


