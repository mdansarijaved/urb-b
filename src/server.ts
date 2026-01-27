import "dotenv/config";
import { createServer } from "http";
import { app } from "./app";
import { PORT } from "./config/constants";
import { redis } from "./config/redis";

export const startServer = async () => {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  redis.on("connect", () => console.log("Redis Client Connecting..."));
  redis.on("ready", () => console.log("Redis Client Ready"));

  try {
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
