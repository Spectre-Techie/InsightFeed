/**
 * News Service — Main Aggregator
 *
 * Orchestrates all news sources, applies sentiment analysis,
 * deduplication, caching, filtering, and pagination.
 *
 * This is the single entry point the route layer calls.
 *
 * Flow:
 *  1. Check cache → return if fresh
 *  2. Fetch from RSS (Nigeria) + NewsData.io (World) in parallel
 *  3. Merge all articles
 *  4. Run sentiment analysis on each
 *  5. Deduplicate
 *  6. Cache the result
 *  7. Apply filters + pagination
 *  8. Return paginated response
 */

const rssService = require('./rssService');
const newsDataService = require('./newsDataService');
const newsApiService = require('./newsApiService');
const mediaStackService = require('./mediaStackService');
const sentimentService = require('./sentimentService');
const { deduplicate } = require('./deduplicatorService');
const cache = require('./cacheService');

// Cache key for the full article list
const CACHE_KEY = 'all_articles';

/**
 * Fetch fresh articles from all sources, analyze sentiment, and deduplicate.
 * This is the "heavy" operation — results are cached to avoid repeating it.
 *
 * @returns {Promise<object[]>} Fully processed article list
 */
async function fetchAndProcessArticles() {
  console.log('\n🔄 [News] Fetching fresh articles from all sources...');

  // ── Fetch from all sources in parallel ────────────────────────
  const [
    rssArticles,
    ndWorldArticles,
    ndNigerianArticles,
    naWorldArticles,
    naNigerianArticles,
    msWorldArticles,
    msNigerianArticles,
  ] = await Promise.allSettled([
    rssService.fetchAllFeeds(),
    newsDataService.fetchWorldNews(),
    newsDataService.fetchNigerianNews(),
    newsApiService.fetchWorldNews(),
    newsApiService.fetchNigerianNews(),
    mediaStackService.fetchWorldNews(),
    mediaStackService.fetchNigerianNews(),
  ]);

  // Extract results (default to empty array if a source failed)
  const settled = (r) => (r.status === 'fulfilled' ? r.value : []);
  const rss       = settled(rssArticles);
  const ndWorld   = settled(ndWorldArticles);
  const ndNg      = settled(ndNigerianArticles);
  const naWorld   = settled(naWorldArticles);
  const naNg      = settled(naNigerianArticles);
  const msWorld   = settled(msWorldArticles);
  const msNg      = settled(msNigerianArticles);

  // ── Merge all articles ────────────────────────────────────────
  const allArticles = [...rss, ...ndWorld, ...ndNg, ...naWorld, ...naNg, ...msWorld, ...msNg];

  console.log(`📊 [News] Sources: RSS=${rss.length}, NewsData=${ndWorld.length + ndNg.length}, NewsAPI=${naWorld.length + naNg.length}, MediaStack=${msWorld.length + msNg.length}`);
  console.log(`📊 [News] Total before processing: ${allArticles.length}`);

  // ── Analyze sentiment for each article ────────────────────────
  const withSentiment = allArticles.map((article) => sentimentService.analyzeArticle(article));

  // ── Sort by date (newest first) before dedup ──────────────────
  withSentiment.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // ── Remove duplicates ─────────────────────────────────────────
  const unique = deduplicate(withSentiment);

  console.log(`✅ [News] Final article count: ${unique.length}\n`);

  // ── Cache the processed list ──────────────────────────────────
  cache.setRss(CACHE_KEY, unique);

  return unique;
}

/**
 * Get all articles — from cache if available, otherwise fresh fetch.
 *
 * @returns {Promise<object[]>} Full article list
 */
async function getAllArticles() {
  // Try cache first
  const cached = cache.getRss(CACHE_KEY);
  if (cached) {
    console.log(`⚡ [News] Serving ${cached.length} articles from cache`);
    return cached;
  }

  // Cache miss — fetch fresh
  return fetchAndProcessArticles();
}

/**
 * Get paginated, filtered articles for the news feed.
 *
 * @param {object} options
 * @param {string} [options.category]  - Filter by category
 * @param {string} [options.sentiment] - Filter by sentiment label
 * @param {string} [options.region]    - 'nigeria', 'world', or 'all'
 * @param {string} [options.search]    - Keyword search
 * @param {number} [options.page]      - Page number (1-based)
 * @param {number} [options.limit]     - Articles per page
 * @returns {Promise<object>} { articles, pagination, filters }
 */
async function getArticles({ category, sentiment, region = 'all', search, page = 1, limit = 20 }) {
  let articles = await getAllArticles();

  // ── Apply Filters ─────────────────────────────────────────────

  // Region filter
  if (region && region !== 'all') {
    articles = articles.filter((a) => a.region === region);
  }

  // Category filter
  if (category) {
    articles = articles.filter((a) => a.category === category.toLowerCase());
  }

  // Sentiment filter
  if (sentiment) {
    articles = articles.filter((a) => a.sentiment?.label === sentiment.toLowerCase());
  }

  // Search filter (matches against title and description)
  if (search) {
    const searchLower = search.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        (a.description && a.description.toLowerCase().includes(searchLower))
    );
  }

  // ── Pagination ────────────────────────────────────────────────
  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / limit);
  const startIndex = (page - 1) * limit;
  const paginatedArticles = articles.slice(startIndex, startIndex + limit);

  return {
    articles: paginatedArticles,
    pagination: {
      currentPage: page,
      totalPages,
      totalArticles,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: {
      category: category || null,
      sentiment: sentiment || null,
      region,
      search: search || null,
    },
  };
}

/**
 * Get a single article by its ID.
 *
 * @param {string} id - Article ID
 * @returns {Promise<object|null>} The article or null if not found
 */
async function getArticleById(id) {
  const articles = await getAllArticles();
  return articles.find((a) => a.id === id) || null;
}

module.exports = {
  getArticles,
  getArticleById,
  getAllArticles,
  fetchAndProcessArticles,
};
