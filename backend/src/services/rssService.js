/**
 * RSS Service — Nigerian News Feeds
 *
 * Fetches and parses RSS feeds from major Nigerian news outlets.
 * Each article is normalized into our unified Article schema.
 *
 * Sources:
 *  - Punch Nigeria
 *  - Vanguard News
 *  - Premium Times
 *  - Channels TV
 *
 * No API keys required. No rate limits. Free forever.
 */

const RssParser = require('rss-parser');
const { cleanText, decodeHtmlEntities } = require('../utils/textUtils');

// ── RSS Parser Instance ─────────────────────────────────────────
const parser = new RssParser({
  timeout: 30000, // 30 second timeout — Nigerian sites can be slow
  headers: {
    'User-Agent': 'SmartNewsReader/1.0 (news aggregator)',
  },
});

// ── Nigerian RSS Feed Sources ───────────────────────────────────
const RSS_SOURCES = [
  {
    name: 'Premium Times',
    url: 'https://www.premiumtimesng.com/feed',
    defaultCategory: 'general',
  },
  {
    name: 'Channels TV',
    url: 'https://www.channelstv.com/feed/',
    defaultCategory: 'general',
  },
  {
    name: 'TheCable',
    url: 'https://www.thecable.ng/feed/',
    defaultCategory: 'general',
  },
  {
    name: 'Vanguard News',
    url: 'https://www.vanguardngr.com/feed/',
    defaultCategory: 'general',
  },
];

/**
 * Map common RSS category strings to our app's category enum.
 * RSS feeds use inconsistent category names — this normalizes them.
 * Falls back to keyword scanning of the article title/description.
 *
 * @param {string[]} categories - Raw category strings from the RSS item
 * @param {string}   [title]    - Article title for keyword fallback
 * @param {string}   [description] - Article description for keyword fallback
 * @returns {string} Normalized category name
 */
function mapCategory(categories = [], title = '', description = '') {
  // Lowercase all categories for consistent matching
  const lower = categories.map((c) => c.toLowerCase());

  // Check against known category keywords
  const categoryMap = {
    politics: ['politics', 'political', 'government', 'election', 'senate', 'house of reps', 'governor', 'president', 'minister', 'lawmaker', 'parliament', 'tribunal', 'tinubu', 'pdp', 'apc', 'inec'],
    sports: ['sports', 'sport', 'football', 'super eagles', 'npfl', 'premier league', 'champions league', 'la liga', 'serie a', 'nba', 'fifa', 'afcon', 'olympic', 'athlete', 'coach', 'midfielder', 'striker', 'goal scorer'],
    business: ['business', 'economy', 'finance', 'market', 'stock', 'naira', 'banking', 'inflation', 'gdp', 'investment', 'trade', 'cbn', 'sec', 'revenue', 'budget', 'tax', 'forex', 'cryptocurrency', 'bitcoin'],
    technology: ['technology', 'tech', 'digital', 'innovation', 'startup', 'fintech', 'software', 'hardware', 'ai ', 'artificial intelligence', 'machine learning', 'blockchain', 'cyber', 'app ', 'internet', 'computing', 'data', 'cloud', 'robot', '5g', 'gadget', 'elon musk', 'openai', 'google', 'apple', 'microsoft', 'meta', 'samsung', 'spacex', 'tesla'],
    entertainment: ['entertainment', 'celebrity', 'nollywood', 'music', 'lifestyle', 'movie', 'film', 'album', 'concert', 'grammy', 'oscar', 'award show', 'reality tv', 'streaming', 'netflix', 'hollywood'],
    health: ['health', 'medical', 'covid', 'disease', 'hospital', 'vaccine', 'who ', 'virus', 'pandemic', 'epidemic', 'doctor', 'patient', 'surgery', 'mental health', 'cancer', 'malaria', 'ebola'],
  };

  // First pass: check RSS category tags
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (lower.some((cat) => keywords.some((kw) => cat.includes(kw)))) {
      return category;
    }
  }

  // Second pass: scan title + description for category keywords
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  return 'general';
}

/**
 * Extract the best available image URL from an RSS item.
 * RSS feeds embed images in different fields — we check all of them.
 *
 * @param {object} item - The parsed RSS item
 * @returns {string|null} Image URL or null
 */
function extractImage(item) {
  // 1. Media content (standard RSS media extension)
  if (item['media:content']?.$.url) {
    return item['media:content'].$.url;
  }

  // 2. Enclosure (common in podcast/news RSS)
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }

  // 3. Try to find an <img> tag in the content
  const content = item['content:encoded'] || item.content || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    return imgMatch[1];
  }

  return null;
}

/**
 * Generate a unique, deterministic ID for an article.
 * Based on source name + title hash to avoid duplicates.
 *
 * @param {string} source - Source name (e.g., "Punch Nigeria")
 * @param {string} title  - Article title
 * @returns {string} Unique article ID
 */
function generateId(source, title) {
  const base = `${source}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // Take first 60 chars to keep IDs manageable
  return `rss-${base.slice(0, 60)}`;
}

/**
 * Normalize a single RSS item into our unified Article schema.
 *
 * @param {object} item       - Raw RSS parser item
 * @param {object} sourceInfo - { name, defaultCategory } from RSS_SOURCES
 * @returns {object} Normalized article object
 */
function normalizeArticle(item, sourceInfo) {
  const categories = item.categories || [];
  const title = cleanText(item.title || 'Untitled');
  const description = cleanText((item.contentSnippet || item.content || '').slice(0, 300));

  return {
    id: generateId(sourceInfo.name, title),
    title,
    description,
    content: decodeHtmlEntities(item['content:encoded'] || item.content || item.contentSnippet || ''),
    url: item.link || '',
    imageUrl: extractImage(item),
    source: sourceInfo.name,
    sourceType: 'rss',
    region: 'nigeria',
    category: mapCategory(categories, title, description),
    publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch articles from a single RSS feed.
 * Handles errors gracefully — a failing feed doesn't crash the whole service.
 *
 * @param {object} source - Source config from RSS_SOURCES
 * @returns {Promise<object[]>} Array of normalized articles
 */
async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = (feed.items || []).map((item) => normalizeArticle(item, source));

    console.log(`✅ [RSS] ${source.name}: ${articles.length} articles`);
    return articles;
  } catch (error) {
    // Log the error but don't throw — other feeds can still work
    console.error(`❌ [RSS] ${source.name} failed: ${error.message}`);
    return [];
  }
}

/**
 * Fetch articles from ALL Nigerian RSS feeds in parallel.
 * Returns a flat array of normalized articles, sorted by date (newest first).
 *
 * @returns {Promise<object[]>} All Nigerian RSS articles
 */
async function fetchAllFeeds() {
  console.log('\n📰 [RSS] Fetching Nigerian news feeds...');

  // Fetch all feeds concurrently — much faster than sequential
  const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));

  // Collect all articles from successful fetches
  const articles = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  // Sort by date, newest first
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  console.log(`📰 [RSS] Total Nigerian articles: ${articles.length}\n`);
  return articles;
}

module.exports = {
  fetchAllFeeds,
  RSS_SOURCES,
};
