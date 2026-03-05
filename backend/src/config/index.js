/**
 * Environment Configuration
 *
 * Centralizes all environment variables with sensible defaults.
 * Import this instead of reading `process.env` directly.
 */

const dotenv = require('dotenv');

// Load .env file (only works locally — on Render, vars are set in dashboard)
dotenv.config();

const config = {
  // ── Server ────────────────────────────────────────────────────
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // ── CORS ──────────────────────────────────────────────────────
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // ── API Keys ──────────────────────────────────────────────────
  newsDataApiKey: process.env.NEWSDATA_API_KEY || '',
  newsApiKey: process.env.NEWSAPI_API_KEY || '',
  mediaStackApiKey: process.env.MEDIASTACK_API_KEY || '',

  // ── Cache TTL (seconds) ───────────────────────────────────────
  rssCacheTtl: parseInt(process.env.RSS_CACHE_TTL, 10) || 600, // 10 min
  apiCacheTtl: parseInt(process.env.API_CACHE_TTL, 10) || 900, // 15 min
};

module.exports = config;
