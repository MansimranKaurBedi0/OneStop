const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.warn("Redis is currently unavailable. Operating securely without cache.");
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

// Non-blocking connection so an absent local Redis server won't crash the Node application
redisClient.connect().catch(() => {
  console.warn("Could not establish initial Redis connection. Bypassing caching layer.");
});

module.exports = redisClient;
