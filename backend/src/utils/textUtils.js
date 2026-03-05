/**
 * Text Utilities — HTML entity decoding and text cleanup.
 *
 * RSS feeds often contain HTML entities like &amp;, &#8220;, &#8217;
 * that display as garbled text if not decoded.
 *
 * This module handles all text sanitization before articles
 * reach the API consumer.
 */

// ── Named HTML Entity Map ───────────────────────────────────────
const HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&mdash;': '—',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&ldquo;': '"',
  '&rdquo;': '"',
  '&hellip;': '…',
  '&bull;': '•',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&times;': '×',
  '&divide;': '÷',
  '&laquo;': '«',
  '&raquo;': '»',
  '&cent;': '¢',
  '&pound;': '£',
  '&euro;': '€',
  '&yen;': '¥',
};

/**
 * Decode HTML entities in a string.
 *
 * Handles:
 *  - Named entities:  &amp; &quot; &rsquo; &ldquo; etc.
 *  - Decimal entities: &#8220; &#8217; &#8211; etc.
 *  - Hex entities:     &#x2019; &#x201C; etc.
 *
 * @param {string} text - Text with potential HTML entities
 * @returns {string} Clean text with entities decoded
 */
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text;

  let decoded = text;

  // 1. Decode named entities (&amp; &rsquo; etc.)
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    // Use a regex to handle case-insensitive matching
    decoded = decoded.replace(new RegExp(entity, 'gi'), char);
  }

  // 2. Decode decimal numeric entities (&#8220; &#8217; &#160; etc.)
  decoded = decoded.replace(/&#(\d+);/g, (_match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  // 3. Decode hex numeric entities (&#x2019; &#x201C; etc.)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

/**
 * Strip all HTML tags from a string.
 *
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
function stripHtmlTags(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Full text cleanup pipeline:
 *  1. Strip HTML tags
 *  2. Decode HTML entities
 *  3. Normalize whitespace (collapse multiple spaces/newlines)
 *  4. Trim
 *
 * @param {string} text - Raw text from RSS or API
 * @returns {string} Clean, readable text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';

  let clean = text;
  clean = stripHtmlTags(clean);
  clean = decodeHtmlEntities(clean);
  clean = clean.replace(/\s+/g, ' '); // Collapse whitespace
  clean = clean.trim();

  return clean;
}

module.exports = {
  decodeHtmlEntities,
  stripHtmlTags,
  cleanText,
};
