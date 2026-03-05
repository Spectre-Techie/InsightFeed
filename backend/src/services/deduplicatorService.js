/**
 * Deduplicator Service
 *
 * Removes duplicate articles that appear across multiple news sources.
 * Uses Jaccard similarity on article titles to detect near-duplicates.
 *
 * Example: "Tinubu Signs New Bill Into Law" from Punch and Vanguard
 * → only the first (or newer) copy is kept.
 */

/**
 * Tokenize a string into a Set of lowercase words.
 * Strips punctuation and common stop words for better matching.
 *
 * @param {string} text - Input text
 * @returns {Set<string>} Set of cleaned tokens
 */
function tokenize(text) {
  if (!text) return new Set();

  // Common English stop words to ignore during comparison
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
    'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were',
    'has', 'have', 'had', 'be', 'been', 'being', 'that', 'this',
    'it', 'its', 'as', 'not', 'no', 'will', 'can', 'do', 'does',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w)); // skip short + stop words

  return new Set(words);
}

/**
 * Calculate Jaccard similarity between two sets.
 * Returns a value between 0 (no overlap) and 1 (identical).
 *
 * Formula: |A ∩ B| / |A ∪ B|
 *
 * @param {Set<string>} setA
 * @param {Set<string>} setB
 * @returns {number} Similarity score (0 to 1)
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

/**
 * Remove duplicate articles from a list.
 *
 * Strategy:
 *  1. For each article, compare its title against all previously seen titles
 *  2. If similarity > threshold (0.6), it's a duplicate — skip it
 *  3. Keep the first occurrence (which is the newest, since articles are pre-sorted)
 *
 * @param {object[]} articles  - Array of articles (should be sorted newest-first)
 * @param {number} [threshold] - Similarity threshold (0-1). Default: 0.6
 * @returns {object[]} Deduplicated articles
 */
function deduplicate(articles, threshold = 0.6) {
  if (!articles || articles.length === 0) return [];

  const seen = []; // Array of { tokens, article } for comparison
  const unique = [];

  for (const article of articles) {
    const tokens = tokenize(article.title);

    // Check against all previously seen articles
    let isDuplicate = false;
    for (const existing of seen) {
      const similarity = jaccardSimilarity(tokens, existing.tokens);
      if (similarity >= threshold) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.push({ tokens, article });
      unique.push(article);
    }
  }

  const removed = articles.length - unique.length;
  if (removed > 0) {
    console.log(`🔄 [Dedup] Removed ${removed} duplicate articles (${articles.length} → ${unique.length})`);
  }

  return unique;
}

module.exports = {
  deduplicate,
  jaccardSimilarity,
  tokenize,
};
