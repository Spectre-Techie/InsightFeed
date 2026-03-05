/**
 * MediaStack Service — Live & Historical News
 *
 * Fetches structured JSON news from mediastack.com.
 * Free tier: 100 calls/month, live headlines only (no HTTPS on free plan).
 *
 * Used for:
 *  - Additional worldwide coverage
 *  - Category-specific news
 *  - Supplemental Nigerian coverage
 */

const axios = require('axios');
const config = require('../config');
const { cleanText } = require('../utils/textUtils');

// ── Constants ───────────────────────────────────────────────────
// Free tier only supports HTTP, not HTTPS
const BASE_URL = 'http://api.mediastack.com/v1/news';

// MediaStack valid categories
const VALID_CATEGORIES = [
  'general', 'business', 'entertainment', 'health',
  'science', 'sports', 'technology',
];

/**
 * Map MediaStack category to our app's category enum.
 */
function mapCategory(category) {
  if (!category) return 'general';

  const mapping = {
    general: 'general',
    business: 'business',
    entertainment: 'entertainment',
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
 * Generate a unique ID for a MediaStack article.
 */
function generateId(article) {
  const base = (article.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `ms-${base.slice(0, 60)}`;
}

/**
 * Normalize a single MediaStack article into our unified schema.
 */
function normalizeArticle(raw) {
  return {
    id: generateId(raw),
    title: cleanText(raw.title || 'Untitled'),
    description: cleanText((raw.description || '').slice(0, 300)),
    content: cleanText(raw.description || ''),
    url: raw.url || '',
    imageUrl: raw.image || null,
    source: raw.source || 'Unknown',
    sourceType: 'api',
    region: determineRegion(raw.country),
    category: mapCategory(raw.category),
    publishedAt: raw.published_at || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch news from MediaStack API.
 *
 * @param {object} options
 * @param {string} [options.countries='us,gb']  - Comma-separated country codes
 * @param {string} [options.categories]         - Comma-separated categories
 * @param {string} [options.languages='en']     - Language code
 * @param {number} [options.limit=25]           - Results per request (max 100)
 * @returns {Promise<object[]>} Normalized articles
 */
async function fetchNews({ countries = 'us,gb', categories, languages = 'en', limit = 25 } = {}) {
  if (!config.mediaStackApiKey) {
    console.warn('⚠️  [MediaStack] No API key configured — skipping');
    return [];
  }

  try {
    const params = {
      access_key: config.mediaStackApiKey,
      countries,
      languages,
      limit,
      sort: 'published_desc',
    };

    if (categories) {
      const validCats = categories.split(',').filter((c) => VALID_CATEGORIES.includes(c.trim().toLowerCase()));
      if (validCats.length > 0) {
        params.categories = validCats.join(',');
      }
    }

    console.log(`📡 [MediaStack] Fetching: countries=${countries}, categories=${categories || 'all'}`);

    const response = await axios.get(BASE_URL, {
      params,
      timeout: 15000,
    });

    // Handle API error responses (MediaStack returns 200 with error object)
    if (response.data?.error) {
      const err = response.data.error;
      console.warn(`⚠️  [MediaStack] API error ${err.code}: ${err.message || err.type}`);
      return [];
    }

    const results = response.data?.data || [];
    const articles = results.map(normalizeArticle);

    console.log(`✅ [MediaStack] Received ${articles.length} articles`);
    return articles;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('⚠️  [MediaStack] Rate limit reached — will use cached data');
      return [];
    }

    console.error(`❌ [MediaStack] Error: ${error.message}`);
    return [];
  }
}

/**
 * Fetch Nigerian news from MediaStack.
 */
async function fetchNigerianNews() {
  return fetchNews({ countries: 'ng', limit: 25 });
}

/**
 * Fetch world news from MediaStack.
 */
async function fetchWorldNews() {
  return fetchNews({ countries: 'us,gb', limit: 25 });
}

module.exports = {
  fetchNews,
  fetchNigerianNews,
  fetchWorldNews,
};
