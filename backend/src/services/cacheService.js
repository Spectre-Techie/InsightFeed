/**
 * Cache Service
 *
 * In-memory cache using node-cache.
 * Separate instances for RSS and API data with different TTLs.
 *
 * Why node-cache?
 *  - Zero config, no external services (Redis would be overkill for MVP)
 *  - TTL-based auto-expiry
 *  - Simple get/set API
 */

const NodeCache = require('node-cache');
const config = require('../config');

// ── RSS Cache: 10 min TTL ───────────────────────────────────────
const rssCache = new NodeCache({
  stdTTL: config.rssCacheTtl,
  checkperiod: 120, // Check for expired keys every 2 minutes
});

// ── API Cache: 15 min TTL ───────────────────────────────────────
const apiCache = new NodeCache({
  stdTTL: config.apiCacheTtl,
  checkperiod: 120,
});

/**
 * Get a value from the RSS cache.
 * @param {string} key
 * @returns {*} Cached value or undefined
 */
function getRss(key) {
  return rssCache.get(key);
}

/**
 * Set a value in the RSS cache.
 * @param {string} key
 * @param {*} value
 */
function setRss(key, value) {
  rssCache.set(key, value);
}

/**
 * Get a value from the API cache.
 * @param {string} key
 * @returns {*} Cached value or undefined
 */
function getApi(key) {
  return apiCache.get(key);
}

/**
 * Set a value in the API cache.
 * @param {string} key
 * @param {*} value
 */
function setApi(key, value) {
  apiCache.set(key, value);
}

/**
 * Get cache statistics for monitoring.
 * @returns {object} Stats for both caches
 */
function getStats() {
  return {
    rss: rssCache.getStats(),
    api: apiCache.getStats(),
  };
}

/**
 * Flush all caches. Used for admin/debug purposes.
 */
function flushAll() {
  rssCache.flushAll();
  apiCache.flushAll();
  console.log('🗑️  [Cache] All caches flushed');
}

module.exports = {
  getRss,
  setRss,
  getApi,
  setApi,
  getStats,
  flushAll,
};
