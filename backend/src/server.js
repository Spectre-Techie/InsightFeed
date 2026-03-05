/**
 * Express Server — Entry Point
 *
 * Boots the Express app with middleware and routes.
 * Runs on PORT from config (default: 5000).
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const newsRoutes = require('./routes/news');

// ── Create Express app ──────────────────────────────────────────
const app = express();

// ── Global Middleware ───────────────────────────────────────────

// CORS — allow frontend origins (local + production)
app.use(
  cors({
    origin: config.corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET'],
  })
);

// Request logging — 'dev' format for colored, concise output
app.use(morgan('dev'));

// JSON body parsing (for future POST routes like admin)
app.use(express.json());

// ── Health Check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/news', newsRoutes);

// ── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

// ── Start Server ────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 Server running on http://localhost:${config.port}`);
  console.log(`📰 News API:   http://localhost:${config.port}/api/news`);
  console.log(`❤️  Health:     http://localhost:${config.port}/api/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}\n`);
});

module.exports = app;
