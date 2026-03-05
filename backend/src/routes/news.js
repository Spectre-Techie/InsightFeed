/**
 * News Routes
 *
 * GET /api/news          → Aggregated news feed with filters
 * GET /api/news/:id      → Single article by ID
 * GET /api/news/analytics → Sentiment analytics snapshot
 *
 * All heavy lifting is done in the newsService.
 */

const express = require('express');
const newsService = require('../services/newsService');

const router = express.Router();

/**
 * GET /api/news
 *
 * Query params:
 *  - category  (string)  Filter by category: politics, sports, business, etc.
 *  - sentiment (string)  Filter by sentiment: positive, negative, neutral
 *  - region    (string)  Filter by region: nigeria, world, all (default: all)
 *  - search    (string)  Keyword search in title/description
 *  - page      (number)  Page number (default: 1)
 *  - limit     (number)  Articles per page (default: 20, max: 50)
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      sentiment,
      region = 'all',
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await newsService.getArticles({
      category,
      sentiment,
      region,
      search,
      page: Math.max(1, parseInt(page, 10) || 1),
      limit: Math.min(50, Math.max(1, parseInt(limit, 10) || 20)),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/news/:id
 *
 * Returns a single article with full content and sentiment details.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const article = await newsService.getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
