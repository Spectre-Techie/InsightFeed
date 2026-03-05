/**
 * NewsData.io Service — Worldwide + Nigeria News API
 *
 * Fetches structured JSON news from NewsData.io.
 * Free tier: 200 credits/day (~2,000 articles).
 *
 * Used for:
 *  - Worldwide news (US, GB, etc.)
 *  - Supplemental Nigerian news (structured API vs RSS)
 *  - Category-specific queries
 */

const axios = require('axios');
const config = require('../config');
const { cleanText } = require('../utils/textUtils');

// ── Constants ───────────────────────────────────────────────────
const BASE_URL = 'https://newsdata.io/api/1/news';

// Valid categories in NewsData.io
const VALID_CATEGORIES = [
  'business', 'entertainment', 'environment', 'food',
  'health', 'politics', 'science', 'sports',
  'technology', 'top', 'world',
];

/**
 * Map NewsData.io category to our app's category enum.
 *
 * @param {string[]} categories - Categories from the API response
 * @returns {string} Our normalized category
 */
function mapCategory(categories = []) {
  if (!categories || categories.length === 0) return 'general';

  const primary = categories[0].toLowerCase();

  const mapping = {
    business: 'business',
    entertainment: 'entertainment',
    politics: 'politics',
    sports: 'sports',
    technology: 'technology',
    science: 'technology',
    health: 'health',
    environment: 'general',
    food: 'general',
    top: 'general',
    world: 'general',
  };

  return mapping[primary] || 'general';
}

/**
 * Determine the region based on the article's country codes.
 *
 * @param {string[]} countries - Country codes from the API (e.g., ['ng', 'us'])
 * @returns {string} 'nigeria' or 'world'
 */
function determineRegion(countries = []) {
  if (!countries) return 'world';
  const lower = countries.map((c) => c.toLowerCase());
  return lower.includes('ng') ? 'nigeria' : 'world';
}

/**
 * Generate a unique ID for a NewsData.io article.
 *
 * @param {object} article - Raw API article
 * @returns {string} Unique article ID
 */
function generateId(article) {
  // Use the API's article_id if available, otherwise hash the title
  if (article.article_id) {
    return `nd-${article.article_id}`;
  }
  const base = (article.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `nd-${base.slice(0, 60)}`;
}

/**
 * Normalize a single NewsData.io article into our unified schema.
 *
 * @param {object} raw - Raw article from NewsData.io
 * @returns {object} Normalized article
 */
function normalizeArticle(raw) {
  return {
    id: generateId(raw),
    title: cleanText(raw.title || 'Untitled'),
    description: cleanText((raw.description || '').slice(0, 300)),
    content: cleanText(raw.content || raw.description || ''),
    url: raw.link || '',
    imageUrl: raw.image_url || null,
    source: raw.source_name || raw.source_id || 'Unknown',
    sourceType: 'api',
    region: determineRegion(raw.country),
    category: mapCategory(raw.category),
    publishedAt: raw.pubDate || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch news from NewsData.io API.
 *
 * @param {object} options
 * @param {string} [options.country='us,gb']  - Comma-separated country codes
 * @param {string} [options.category]         - Category filter
 * @param {string} [options.query]            - Keyword search
 * @param {string} [options.language='en']    - Language code
 * @returns {Promise<object[]>} Normalized articles
 */
async function fetchNews({ country = 'us,gb', category, query, language = 'en' } = {}) {
  // Skip if no API key configured
  if (!config.newsDataApiKey) {
    console.warn('⚠️  [NewsData] No API key configured — skipping');
    return [];
  }

  try {
    // Build query parameters
    const params = {
      apikey: config.newsDataApiKey,
      language,
      country,
    };

    // Add optional filters
    if (category && VALID_CATEGORIES.includes(category.toLowerCase())) {
      params.category = category.toLowerCase();
    }
    if (query) {
      params.q = query;
    }

    console.log(`🌍 [NewsData] Fetching: country=${country}, category=${category || 'all'}`);

    const response = await axios.get(BASE_URL, {
      params,
      timeout: 15000, // 15 second timeout
    });

    const results = response.data?.results || [];
    const articles = results.map(normalizeArticle);

    console.log(`✅ [NewsData] Received ${articles.length} articles`);
    return articles;
  } catch (error) {
    // Handle rate limiting gracefully
    if (error.response?.status === 429) {
      console.warn('⚠️  [NewsData] Rate limit reached — will use cached data');
      return [];
    }

    console.error(`❌ [NewsData] Error: ${error.message}`);
    return [];
  }
}

/**
 * Fetch Nigerian news specifically from NewsData.io.
 * Supplements the RSS feeds with structured API data.
 *
 * @returns {Promise<object[]>} Nigerian articles from API
 */
async function fetchNigerianNews() {
  return fetchNews({ country: 'ng' });
}

/**
 * Fetch worldwide news from NewsData.io.
 *
 * @returns {Promise<object[]>} World articles
 */
async function fetchWorldNews() {
  return fetchNews({ country: 'us,gb' });
}

module.exports = {
  fetchNews,
  fetchNigerianNews,
  fetchWorldNews,
};
