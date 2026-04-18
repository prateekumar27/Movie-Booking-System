import Redis from "ioredis";
import env from "dotenv";

env.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: () => 5000,
});

redis.on("error", (err) => {
  console.error(err);
});

redis.on("connect", () => console.log("Connected to Redis"));

export default redis;
