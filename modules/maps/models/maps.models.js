import redis from "../../../config/redisClient.js";

/**
 * Cache a route between origin and destination in Redis
 * @param {Object} origin - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @param {Object} routeData - JSON data from Google Directions API
 * @param {number} ttl - Time to live in seconds (default 1 hour)
 */
export const cacheRoute = async (
  origin,
  destination,
  routeData,
  ttl = 3600,
) => {
  const key = `route:${origin.lat},${origin.lng}:${destination.lat},${destination.lng}`;
  await redis.set(key, JSON.stringify(routeData), "EX", ttl);
};

/**
 * Get cached route between origin and destination
 * @param {Object} origin - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @returns {Object|null} - Parsed route JSON or null if not cached
 */
export const getCachedRoute = async (origin, destination) => {
  const key = `route:${origin.lat},${origin.lng}:${destination.lat},${destination.lng}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};
