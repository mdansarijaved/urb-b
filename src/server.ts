import "dotenv/config";
import { createServer } from "http";
import { app } from "./app.js";
import { PORT } from "./config/constants.js";
import { redisClient } from "./config/redis.js";

export const startServer = async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("Redis Client Connecting..."));
  redisClient.on("ready", () => console.log("Redis Client Ready"));

  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }

  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
