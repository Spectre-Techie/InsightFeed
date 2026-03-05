/**
 * Sentiment Analysis Service
 *
 * Keyword-based lexicon sentiment analyzer.
 * Analyzes article title + description to determine sentiment.
 *
 * Scoring approach:
 *  - Each positive word adds +1, each negative word subtracts -1
 *  - Phrase matches are weighted heavier (+2 / -2)
 *  - Nigeria-specific terms are included for local context
 *  - Final score is normalized to a -1 to +1 range
 *
 * Output: { label, score, confidence, positiveWords, negativeWords }
 */

// ── Positive Word Lexicon ───────────────────────────────────────
const POSITIVE_WORDS = new Set([
  // General positive
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
  'brilliant', 'outstanding', 'superb', 'remarkable', 'impressive',
  'success', 'successful', 'win', 'winning', 'victory', 'triumph',
  'achieve', 'achievement', 'progress', 'improve', 'improvement',
  'growth', 'grow', 'gain', 'benefit', 'positive', 'optimistic',
  'hope', 'hopeful', 'celebrate', 'celebration', 'praise',
  'approve', 'approval', 'support', 'breakthrough', 'innovation',
  'boost', 'surge', 'rally', 'recover', 'recovery', 'strong',
  'strength', 'prosper', 'prosperity', 'thrive', 'flourish',
  'upgrade', 'record', 'milestone', 'historic', 'landmark',

  // Economic positive
  'profit', 'revenue', 'dividend', 'investment', 'boom',
  'upturn', 'bullish', 'soar', 'appreciate',

  // Nigeria-specific positive
  'development', 'infrastructure', 'empowerment', 'unity',
  'reform', 'independence', 'liberation', 'patriotic',
]);

// ── Negative Word Lexicon ───────────────────────────────────────
const NEGATIVE_WORDS = new Set([
  // General negative
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor',
  'fail', 'failure', 'defeat', 'loss', 'lose', 'losing',
  'decline', 'crash', 'crisis', 'disaster', 'catastrophe',
  'tragic', 'tragedy', 'death', 'dead', 'kill', 'killed',
  'murder', 'attack', 'violence', 'violent', 'war', 'conflict',
  'threat', 'threaten', 'danger', 'dangerous', 'risk', 'fear',
  'worry', 'concern', 'alarm', 'warning', 'collapse', 'corrupt',
  'corruption', 'scandal', 'fraud', 'arrest', 'crime', 'criminal',
  'protest', 'strike', 'riot', 'unrest', 'tension', 'chaos',
  'victim', 'suffer', 'suffering', 'pain', 'struggle', 'hardship',
  'recession', 'inflation', 'debt', 'shortage', 'scarcity',
  'ban', 'suspend', 'penalty', 'sanction', 'condemn',

  // Economic negative
  'bearish', 'plunge', 'drop', 'slump', 'deficit',
  'bankrupt', 'bankruptcy', 'layoff', 'unemployment',

  // Nigeria-specific negative
  'kidnap', 'kidnapping', 'bandit', 'bandits', 'boko',
  'herdsmen', 'insecurity', 'abduction', 'ransom',
]);

// ── Positive Phrases (weighted +2) ─────────────────────────────
const POSITIVE_PHRASES = [
  'breaking record', 'all-time high', 'strong growth',
  'economic recovery', 'peace deal', 'landmark decision',
  'historic achievement', 'major breakthrough', 'record profit',
  'Super Eagles win', 'infrastructure development',
  'foreign investment', 'GDP growth', 'job creation',
  'poverty reduction', 'education reform', 'tech hub',
  'startup funding', 'naira strengthens', 'oil price rise',
];

// ── Negative Phrases (weighted -2) ──────────────────────────────
const NEGATIVE_PHRASES = [
  'mass shooting', 'death toll', 'economic crisis',
  'market crash', 'fuel scarcity', 'power outage',
  'naira crash', 'naira falls', 'oil spill', 'bomb blast',
  'terrorist attack', 'human rights violation',
  'food crisis', 'flooding disaster', 'security breach',
  'kidnap victim', 'armed robbery', 'voter fraud',
  'fake news', 'climate disaster', 'debt crisis',
];

/**
 * Analyze the sentiment of a given text.
 *
 * @param {string} text - Text to analyze (usually title + description)
 * @returns {object} Sentiment result
 *  - label: 'positive' | 'negative' | 'neutral'
 *  - score: number between -1 and 1
 *  - confidence: number between 0 and 1
 *  - positiveWords: string[] — matched positive words
 *  - negativeWords: string[] — matched negative words
 */
function analyze(text) {
  if (!text || typeof text !== 'string') {
    return { label: 'neutral', score: 0, confidence: 0, positiveWords: [], negativeWords: [] };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveScore = 0;
  let negativeScore = 0;
  const positiveMatches = [];
  const negativeMatches = [];

  // ── 1. Check individual words ───────────────────────────────
  for (const word of words) {
    // Clean punctuation from word edges
    const clean = word.replace(/[^a-z'-]/g, '');
    if (!clean) continue;

    if (POSITIVE_WORDS.has(clean)) {
      positiveScore += 1;
      positiveMatches.push(clean);
    }

    if (NEGATIVE_WORDS.has(clean)) {
      negativeScore += 1;
      negativeMatches.push(clean);
    }
  }

  // ── 2. Check phrases (heavier weight) ───────────────────────
  for (const phrase of POSITIVE_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      positiveScore += 2;
      positiveMatches.push(phrase);
    }
  }

  for (const phrase of NEGATIVE_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      negativeScore += 2;
      negativeMatches.push(phrase);
    }
  }

  // ── 3. Calculate final score ────────────────────────────────
  const totalHits = positiveScore + negativeScore;
  const rawScore = positiveScore - negativeScore;

  // Normalize to -1 to +1 range
  // Using a sigmoid-like scaling to prevent extreme values
  const normalizedScore = totalHits === 0 ? 0 : rawScore / (Math.abs(rawScore) + 3);

  // Confidence is based on how many sentiment words we found
  // More matches = higher confidence (capped at 1.0)
  const confidence = Math.min(1, totalHits / 5);

  // ── 4. Determine label ──────────────────────────────────────
  let label;
  if (normalizedScore > 0.05) {
    label = 'positive';
  } else if (normalizedScore < -0.05) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return {
    label,
    score: Math.round(normalizedScore * 100) / 100, // 2 decimal places
    confidence: Math.round(confidence * 100) / 100,
    positiveWords: [...new Set(positiveMatches)], // deduplicate
    negativeWords: [...new Set(negativeMatches)],
  };
}

/**
 * Analyze an article's sentiment using its title and description.
 * Title is weighted more heavily (repeated once for emphasis).
 *
 * @param {object} article - Article with title and description fields
 * @returns {object} The same article with a `sentiment` property attached
 */
function analyzeArticle(article) {
  // Weight the title by including it twice in the analysis text
  const textToAnalyze = `${article.title} ${article.title} ${article.description || ''}`;
  const sentiment = analyze(textToAnalyze);

  return {
    ...article,
    sentiment,
  };
}

module.exports = {
  analyze,
  analyzeArticle,
};
