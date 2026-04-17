const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

let errorLogged = false;

redisClient.on("error", (err) => {
  if (!errorLogged) {
    console.warn("Redis is currently unavailable. Operating securely without cache.");
    errorLogged = true;
  }
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
  errorLogged = false;
});

// Non-blocking connection so an absent local Redis server won't crash the Node application
redisClient.connect().catch(() => {
  if (!errorLogged) {
    console.warn("Could not establish initial Redis connection. Bypassing caching layer.");
    errorLogged = true;
  }
});

module.exports = redisClient;
