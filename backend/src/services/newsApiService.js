/**
 * NewsAPI.org Service — Top Headlines & Everything Endpoint
 *
 * Fetches structured JSON news from NewsAPI.org.
 * Free tier: 100 requests/day, recent headlines only.
 *
 * Used for:
 *  - Top headlines from multiple countries
 *  - Category-specific headline queries
 *  - Supplemental world + Nigeria coverage
 */

const axios = require('axios');
const config = require('../config');
const { cleanText } = require('../utils/textUtils');

// ── Constants ───────────────────────────────────────────────────
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// NewsAPI valid categories
const VALID_CATEGORIES = [
  'business', 'entertainment', 'general', 'health',
  'science', 'sports', 'technology',
];

/**
 * Map NewsAPI category to our app's category enum.
 */
function mapCategory(category) {
  if (!category) return 'general';

  const mapping = {
    business: 'business',
    entertainment: 'entertainment',
    general: 'general',
    health: 'health',
    science: 'technology',
    sports: 'sports',
    technology: 'technology',
  };

  return mapping[category.toLowerCase()] || 'general';
}

/**
 * Determine region from country code.
 */
function determineRegion(country) {
  if (!country) return 'world';
  return country.toLowerCase() === 'ng' ? 'nigeria' : 'world';
}

/**
 * Generate a unique ID for a NewsAPI article.
 */
function generateId(article) {
  const base = (article.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `na-${base.slice(0, 60)}`;
}

/**
 * Normalize a single NewsAPI article into our unified schema.
 */
function normalizeArticle(raw, country, category) {
  // NewsAPI sometimes returns "[Removed]" for taken-down articles
  if (raw.title === '[Removed]' || raw.description === '[Removed]') {
    return null;
  }

  return {
    id: generateId(raw),
    title: cleanText(raw.title || 'Untitled'),
    description: cleanText((raw.description || '').slice(0, 300)),
    content: cleanText(raw.content || raw.description || ''),
    url: raw.url || '',
    imageUrl: raw.urlToImage || null,
    source: raw.source?.name || 'Unknown',
    sourceType: 'api',
    region: determineRegion(country),
    category: mapCategory(category),
    publishedAt: raw.publishedAt || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch top headlines from NewsAPI.org.
 *
 * @param {object} options
 * @param {string} [options.country='us']  - 2-letter ISO country code
 * @param {string} [options.category]      - Category filter
 * @param {number} [options.pageSize=30]   - Results per request (max 100)
 * @returns {Promise<object[]>} Normalized articles
 */
async function fetchHeadlines({ country = 'us', category, pageSize = 30 } = {}) {
  if (!config.newsApiKey) {
    console.warn('⚠️  [NewsAPI] No API key configured — skipping');
    return [];
  }

  try {
    const params = {
      apiKey: config.newsApiKey,
      country,
      pageSize,
    };

    if (category && VALID_CATEGORIES.includes(category.toLowerCase())) {
      params.category = category.toLowerCase();
    }

    console.log(`📰 [NewsAPI] Fetching: country=${country}, category=${category || 'all'}`);

    const response = await axios.get(BASE_URL, {
      params,
      timeout: 15000,
    });

    const results = response.data?.articles || [];
    const articles = results
      .map((raw) => normalizeArticle(raw, country, category))
      .filter(Boolean); // Remove null entries ([Removed] articles)

    console.log(`✅ [NewsAPI] Received ${articles.length} articles from ${country.toUpperCase()}`);
    return articles;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('⚠️  [NewsAPI] Rate limit reached — will use cached data');
      return [];
    }
    if (error.response?.status === 401) {
      console.warn('⚠️  [NewsAPI] Invalid API key');
      return [];
    }

    console.error(`❌ [NewsAPI] Error: ${error.message}`);
    return [];
  }
}

/**
 * Fetch Nigerian headlines from NewsAPI.
 */
async function fetchNigerianNews() {
  return fetchHeadlines({ country: 'ng', pageSize: 30 });
}

/**
 * Fetch world headlines from multiple countries.
 * Pulls from US and GB for broad English-language coverage.
 */
async function fetchWorldNews() {
  const [us, gb] = await Promise.allSettled([
    fetchHeadlines({ country: 'us', pageSize: 20 }),
    fetchHeadlines({ country: 'gb', pageSize: 20 }),
  ]);

  const usArticles = us.status === 'fulfilled' ? us.value : [];
  const gbArticles = gb.status === 'fulfilled' ? gb.value : [];

  return [...usArticles, ...gbArticles];
}

module.exports = {
  fetchHeadlines,
  fetchNigerianNews,
  fetchWorldNews,
};
