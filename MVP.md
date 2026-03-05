# Minimum Viable Product (MVP) Specification

## Smart News Reader with Sentiment Analysis

| Field              | Detail                                      |
|--------------------|---------------------------------------------|
| **Document Version** | 1.0                                        |
| **Date**             | February 19, 2026                          |
| **Status**           | Final Draft                                |
| **Author**           | Product & Engineering Team                 |
| **Related Document** | [PRD.md](PRD.md) — Full Product Requirements |
| **Package Manager**  | pnpm (mandatory — do NOT use npm or yarn)      |
| **News Coverage**    | Nigeria (primary) + Worldwide (secondary)      |
| **Confidentiality**  | Confidential — Do Not Distribute Externally |

---

## Table of Contents

1. [MVP Vision & Scope](#1-mvp-vision--scope)
2. [Feature Prioritization (MoSCoW)](#2-feature-prioritization-moscow)
3. [MVP vs Full Product Boundary](#3-mvp-vs-full-product-boundary)
4. [Core User Flows](#4-core-user-flows)
5. [Technical MVP Architecture](#5-technical-mvp-architecture)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Launch Criteria Checklist](#7-launch-criteria-checklist)
8. [MVP Risks & Constraints](#8-mvp-risks--constraints)
9. [Definition of Done](#9-definition-of-done)
10. [Post-MVP Roadmap](#10-post-mvp-roadmap)

---

## 1. MVP Vision & Scope

### 1.1 Vision Statement

> **Smart News Reader MVP** proves one core hypothesis: *Users will engage more with news content when every article is instantly tagged with emotional sentiment — and when they can filter the feed by both topic and mood.*

The MVP delivers the smallest complete product that demonstrates the **full value loop**:

```
Fetch real-time news → Analyze sentiment automatically → Display with visual badges →
Enable smart filtering → Show analytics insights → Allow admin corrections
```

### 1.2 Scope Definition

The MVP is a **fully functional web application** consisting of:

| Component           | Scope                                                          |
|---------------------|----------------------------------------------------------------|
| **News Feed**       | Real-time articles from Nigerian RSS feeds + NewsData.io API with sentiment + category badges |
| **Sentiment Engine**| Custom keyword-based analysis scoring every article automatically |
| **Smart Filters**   | Client-side category + sentiment filter chips with combined logic |
| **Article Detail**  | Full article view with metadata, reading time, and similar articles |
| **Analytics**       | Dashboard with sentiment pie chart, category bars, and most-read list |
| **Admin Panel**     | Password-protected panel for sentiment override and article featuring |

### 1.3 What the MVP Is NOT

The MVP explicitly **does not include**:

- ❌ User registration or authentication (except admin)
- ❌ Machine learning or neural network-based sentiment analysis
- ❌ Multi-language support
- ❌ Real-time WebSocket updates
- ❌ Mobile native app
- ❌ Comments or social features
- ❌ Personalization or recommendation algorithms
- ❌ Persistent database (uses in-memory cache)
- ❌ Email notifications or push notifications
- ❌ Multi-source news aggregation (single API source)

### 1.4 Success Hypothesis

| Hypothesis | Validation Method | Success Threshold |
|------------|-------------------|-------------------|
| Users find sentiment badges useful for quick news assessment | Filter usage rate | > 40% of sessions use sentiment filter |
| Combined filters (category + sentiment) provide unique value | Combined filter usage | > 20% of sessions use both filters |
| Analytics dashboard provides actionable insights | Dashboard visits | > 15% of unique users visit analytics |
| Keyword-based sentiment is accurate enough for user trust | Manual accuracy test | > 75% accuracy against 200 labeled articles |

---

## 2. Feature Prioritization (MoSCoW)

### 2.1 MUST HAVE (P0) — Ship-blocking, non-negotiable

These features define the core product. **Without any one of them, the MVP does not demonstrate the value proposition.**

| ID   | Feature                              | Description                                         | Est. Effort |
|------|--------------------------------------|-----------------------------------------------------|-------------|
| M-01 | News Feed Display                   | Homepage grid of article cards from NewsAPI.org     | 4 hours     |
| M-02 | Sentiment Analysis Engine           | Keyword-based scoring algorithm with 60+ positive and 60+ negative terms | 3 hours |
| M-03 | Sentiment Badges on Cards           | Colored circles (🟢🔴⚪) with text labels on every card | 1 hour   |
| M-04 | Category Badges on Cards            | Topic tags (Tech, Politics, Sports, etc.) on every card | 1 hour   |
| M-05 | Category Filter Chips               | Clickable filter buttons for each category          | 2 hours     |
| M-06 | Sentiment Filter Chips              | Clickable filter buttons for Positive/Neutral/Negative | 2 hours  |
| M-07 | Combined Filter Logic               | Category + sentiment filters work simultaneously    | 2 hours     |
| M-08 | Instant Filter Updates              | Feed updates without page reload (React state)      | 1 hour      |
| M-09 | Article Detail Page                 | Click headline → full article with all metadata     | 3 hours     |
| M-10 | Server-Side Caching                 | node-cache with 15-min TTL to respect API limits    | 2 hours     |
| M-11 | REST API (`/api/news`)              | Express endpoint with query parameter support       | 2 hours     |
| M-12 | Responsive Design                   | Mobile (375px) + Desktop (1280px) via Tailwind      | 2 hours     |

**Total MUST HAVE Effort: ~25 hours (Days 1–3)**

### 2.2 SHOULD HAVE (P1) — Important, expected for a polished demo

These features significantly enhance the product and are expected by reviewers. **Defer only if time-critical.**

| ID   | Feature                              | Description                                         | Est. Effort |
|------|--------------------------------------|-----------------------------------------------------|-------------|
| S-01 | Analytics Dashboard                 | Sentiment breakdown + category distribution charts  | 4 hours     |
| S-02 | Sentiment Pie/Donut Chart           | Visual sentiment distribution using Recharts        | 2 hours     |
| S-03 | Category Bar Chart                  | Article count per category visualization            | 2 hours     |
| S-04 | Admin Authentication                | Basic auth for admin routes                         | 2 hours     |
| S-05 | Admin Sentiment Override            | Change article sentiment label manually             | 2 hours     |
| S-06 | Admin Featured Articles             | Pin/unpin articles to top of feed                   | 1 hour      |
| S-07 | Reading Time Estimate               | "X min read" calculation on article detail          | 0.5 hours   |
| S-08 | Copy Link / Share                   | Copy article URL to clipboard                       | 1 hour      |
| S-09 | Relative Timestamps                 | "2h ago", "1d ago" display using date-fns           | 0.5 hours   |
| S-10 | Similar Articles                    | 3–5 related articles on detail page                 | 2 hours     |
| S-11 | Sentiment Test Endpoint             | `/api/sentiment` for ad-hoc text analysis           | 1 hour      |
| S-12 | Error Handling & Loading States     | Skeleton loaders, error messages, empty states      | 2 hours     |

**Total SHOULD HAVE Effort: ~20 hours (Days 4–5)**

### 2.3 COULD HAVE (P2) — Nice-to-have, include if time permits

These features add polish but are not required for a successful demo.

| ID   | Feature                              | Description                                         | Est. Effort |
|------|--------------------------------------|-----------------------------------------------------|-------------|
| C-01 | Most-Read Articles List             | Track click counts, display top 10 on dashboard     | 2 hours     |
| C-02 | Trending Keywords                   | Extract and display frequent words across articles  | 3 hours     |
| C-03 | Sentiment Trend Chart (7 days)      | Line chart showing sentiment over time              | 3 hours     |
| C-04 | Category Management (Admin CRUD)    | Add/edit/delete categories through admin panel       | 3 hours     |
| C-05 | Dark Mode                           | Tailwind dark mode toggle                           | 2 hours     |
| C-06 | Admin Activity Log                  | Log of all admin actions with timestamps            | 2 hours     |
| C-07 | Search Functionality                | Text search across article titles and descriptions  | 2 hours     |
| C-08 | Tablet Breakpoint (768px)           | Optimized tablet layout                             | 1 hour      |
| C-09 | SEO Meta Tags                       | Open Graph + Twitter Card tags on article pages     | 1 hour      |
| C-10 | 404 / Error Pages                   | Custom styled error pages                           | 1 hour      |

**Total COULD HAVE Effort: ~20 hours (Post-MVP or if ahead of schedule)**

### 2.4 WON'T HAVE (This Release) — Explicitly out of scope

These features are valuable but deferred to future releases.

| ID   | Feature                              | Reason for Deferral                                  |
|------|--------------------------------------|------------------------------------------------------|
| W-01 | ML-Based Sentiment Analysis         | Requires model training, GPU infrastructure, data pipeline |
| W-02 | User Accounts & Authentication      | Adds complexity; no user-specific features in MVP    |
| W-03 | Bookmarks / Reading History         | Requires persistent storage and user identity        |
| W-04 | Comments / Social Features          | Significant backend complexity; moderation needed    |
| W-05 | Multi-Language Support              | Requires multilingual sentiment dictionaries         |
| W-06 | Real-Time WebSocket Updates         | Architecture complexity; polling is sufficient for MVP |
| W-07 | Push Notifications                  | Requires service worker, notification permissions    |
| W-08 | Multi-Source Aggregation            | Multiple API integrations; normalization complexity  |
| W-09 | Personalization / Recommendations   | Requires user profiles and behavioral tracking       |
| W-10 | Mobile Native App (iOS/Android)     | Web-first approach; PWA possible in future           |
| W-11 | A/B Testing Infrastructure          | Premature optimization for MVP                       |
| W-12 | Persistent Database (PostgreSQL)    | In-memory cache sufficient for MVP dataset size      |

### 2.5 MoSCoW Summary Matrix

```
                    ┌─────────────────────────────────────┐
                    │        FEATURE PRIORITIZATION        │
                    │                                     │
    MUST HAVE (P0)  │ ████████████████████████░░░░░░░░░░░ │  12 features │ 25 hrs
    SHOULD HAVE(P1) │ ████████████████████░░░░░░░░░░░░░░░ │  12 features │ 20 hrs
    COULD HAVE (P2) │ ████████████████████░░░░░░░░░░░░░░░ │  10 features │ 20 hrs
    WON'T HAVE      │ ████████████████████████░░░░░░░░░░░ │  12 features │ Deferred
                    │                                     │
                    │  MVP Scope ═══════════╗             │
                    │  P0 + P1 = 45 hours   ║             │
                    └───────────────────────╝─────────────┘
```

---

## 3. MVP vs Full Product Boundary

### 3.1 Feature Comparison

| Capability                    | MVP (v1.0)                          | Full Product (v2.0+)                      |
|-------------------------------|-------------------------------------|-------------------------------------------|
| **News Source**               | Nigerian RSS + NewsData.io + NewsAPI.org | Multiple APIs + RSS + scraping            |
| **Sentiment Analysis**       | Keyword-based (120+ word lexicon)  | NLP/ML-based (VADER, transformer models)  |
| **Sentiment Accuracy**       | > 75% (keyword matching)           | > 90% (contextual understanding)          |
| **Language Support**         | English only                        | 10+ languages                             |
| **Filtering**                | Category + sentiment chips          | Full-text search + advanced filters + date range |
| **Analytics**                | Pie chart + bar chart (2 charts)    | 6+ chart types + custom date ranges + export |
| **User System**              | No user accounts (anonymous)        | Full auth (OAuth, email), profiles, preferences |
| **Data Storage**             | In-memory cache (node-cache)        | PostgreSQL / MongoDB + Redis              |
| **Data Persistence**         | Lost on server restart               | Persistent with backup and migration      |
| **Admin Panel**              | Basic auth + sentiment override     | RBAC, audit logs, bulk operations, user management |
| **Notifications**           | None                                 | Email, push, in-app                       |
| **Real-Time Updates**       | Manual refresh / cache TTL           | WebSocket live updates                    |
| **Mobile**                   | Responsive web                       | PWA + native apps (React Native)          |
| **Personalization**         | None                                 | ML recommendations, reading history       |
| **API Rate Management**     | Simple caching (100 req/day)         | API key rotation, multiple tiers, queue   |
| **Deployment**              | Vercel + Render (free tier)          | AWS/GCP with auto-scaling, CDN, monitoring |
| **Testing**                 | Manual QA                            | Unit, integration, E2E (Jest, Cypress)    |
| **Monitoring**              | Console logging                      | Datadog/Sentry, uptime monitoring, alerting |

### 3.2 Architecture Evolution

```
MVP Architecture (v1.0):
━━━━━━━━━━━━━━━━━━━━━━━
Browser → Next.js (Vercel) → Express API (Render) → Nigerian RSS + NewsData.io + NewsAPI.org
                                    ↕
                              node-cache (memory)


Full Product Architecture (v2.0+):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Browser/PWA/App → CDN → Next.js (AWS) → API Gateway → Microservices
                                                          ↕
                                              ┌──────────────────┐
                                              │  PostgreSQL      │
                                              │  Redis Cache     │
                                              │  S3 (images)     │
                                              │  ElasticSearch   │
                                              │  ML Service      │
                                              └──────────────────┘
                                                    ↕
                                         ┌─────────────────────┐
                                         │  NewsAPI.org         │
                                         │  GNews API           │
                                         │  MediaStack          │
                                         │  RSS Feeds           │
                                         └─────────────────────┘
```

### 3.3 Transition Strategy

The MVP is designed with clear extension points for v2.0:

| Extension Point         | MVP Implementation              | v2.0 Upgrade Path                       |
|-------------------------|--------------------------------|------------------------------------------|
| Sentiment module        | `analyzeSentiment()` function  | Replace with VADER/transformer model call |
| Data layer              | `node-cache` get/set           | Swap to database adapter pattern          |
| News fetching           | Direct NewsAPI.org calls       | Abstract behind `NewsProvider` interface   |
| Authentication          | Basic auth middleware          | Passport.js / NextAuth.js integration     |
| Charts                  | Recharts components            | Add more chart types, same library        |
| API routes              | Express router                 | Add versioning (`/v1/`, `/v2/`)           |

---

## 4. Core User Flows

### Flow 1: Browse News Feed with Sentiment Awareness

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │  Home    │    │  News    │    │  Badge   │
│  Opens   │───▶│  Page    │───▶│  Cards   │───▶│  Scan    │
│  App     │    │  Loads   │    │  Render  │    │  (2 sec) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ▼
              Server fetches news
              from cache or API
              → Analyzes sentiment
              → Returns enriched data
```

**Steps**:
1. User navigates to `https://smartnewsreader.com`
2. Next.js server-renders the homepage with news articles (SSR)
3. Express API returns cached articles with pre-computed sentiment
4. Each article card displays: headline, summary, category badge, sentiment badge (colored), relative timestamp
5. User scans badges to quickly assess which articles are positive/negative/neutral
6. **Total time from page load to sentiment awareness: < 3 seconds**

**Expected Outcome**: User can assess the emotional tone of 20+ articles by glancing at colored sentiment badges — no need to read full articles.

---

### Flow 2: Filter by Category + Sentiment

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Click   │    │  Feed    │    │  Click   │    │  Feed    │
│  "Tech"  │───▶│  Shows   │───▶│"Positive"│───▶│  Shows   │
│  Filter  │    │Tech Only │    │  Filter  │    │Pos Tech  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                                       ▼
                                                  Only articles
                                                  matching BOTH
                                                  filters shown
```

**Steps**:
1. User views the full news feed on the homepage
2. User clicks the **"Tech"** category filter chip
3. Feed instantly updates (< 200ms) to show only technology articles
4. Active "Tech" chip is visually highlighted (filled background color)
5. User clicks the **"Positive"** sentiment filter chip
6. Feed instantly updates to show only **positive technology articles**
7. Both "Tech" and "Positive" chips are highlighted
8. User clicks **"All"** to reset all filters and return to full feed

**Expected Outcome**: User combines two filter dimensions to find exactly the type and tone of news they want — a capability no standard news app provides.

---

### Flow 3: Read Full Article with Sentiment Details

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Click   │    │ Article  │    │  Read +  │    │  View    │
│ Headline │───▶│  Detail  │───▶│  Share   │───▶│ Similar  │
│          │    │  Loads   │    │          │    │ Articles │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Steps**:
1. User clicks on an article headline from the feed
2. Browser navigates to `/tech-giant-reports-record-growth-2026`
3. Full article page loads with:
   - Complete article content
   - Category badge + sentiment badge with confidence level
   - Sentiment analysis breakdown (positive words found, negative words found, score)
   - Reading time estimate ("4 min read")
   - Author, source, and publication date
4. User clicks **"Copy Link"** and sees a "Copied!" toast notification
5. User scrolls down to see 3–5 **similar articles** (same category + sentiment)
6. User clicks **"← Back to Feed"** to return to the homepage

**Expected Outcome**: User gets full context including transparent sentiment scoring — they can see exactly why the algorithm classified the article the way it did.

---

### Flow 4: View Analytics Dashboard

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Click   │    │Dashboard │    │  View    │    │  Derive  │
│"Analytics│───▶│  Loads   │───▶│  Charts  │───▶│ Insights │
│  " Nav   │    │  (CSR)   │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Steps**:
1. User clicks **"Analytics"** in the top navigation bar
2. Dashboard page loads with 4 data visualizations:
   - **Sentiment Pie Chart**: "60% Neutral, 25% Negative, 15% Positive"
   - **Category Bar Chart**: Article count per topic (Tech: 22, Politics: 18, ...)
   - **Most-Read Articles**: Top 5–10 articles by click count
   - **Trending Keywords**: Most frequently occurring terms across all articles
3. User hovers over chart elements for detailed tooltips
4. User identifies that *"Today's news is mostly neutral with a 25% negative lean"*
5. User navigates back to the feed to explore negative articles specifically

**Expected Outcome**: User gains a data-driven overview of the current news landscape — sentiment distribution, topic distribution, and trending themes — in under 30 seconds.

---

### Flow 5: Admin Corrects Misclassified Sentiment

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Admin   │    │  Admin   │    │  Find    │    │ Override │
│  Logs In │───▶│  Panel   │───▶│ Article  │───▶│Sentiment │
│          │    │  Loads   │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                                       ▼
                                                  Feed + Analytics
                                                  reflect new label
```

**Steps**:
1. Admin navigates to `/admin` and enters credentials (basic auth)
2. Admin panel loads with a table of all articles: title, category, current sentiment, actions
3. Admin spots an article *"Tech Company Faces Challenges but Emerges Stronger"* classified as **Negative** (algorithm matched "challenges" and "faces")
4. Admin clicks **"Edit"** on the article row
5. Override modal appears showing:
   - Current sentiment: 🔴 Negative (Score: -3)
   - Positive words found: "stronger", "emerges"
   - Negative words found: "challenges", "faces"
6. Admin selects **"Positive"** from the override dropdown
7. Admin enters reason: *"Article overall tone is about overcoming challenges — net positive"*
8. Admin clicks **"Save Override"**
9. Article sentiment immediately updates across the entire platform (feed, analytics, detail page)

**Expected Outcome**: Admin corrects a keyword-based misclassification with a documented reason, maintaining content quality despite the algorithm's limitations.

---

## 5. Technical MVP Architecture

### 5.1 Technology Stack

| Layer              | Technology                | Version  | Purpose                                    |
|--------------------|---------------------------|----------|--------------------------------------------|
| **Frontend**       | Next.js                   | 14.x     | React framework with SSR/CSR routing       |
| **Styling**        | Tailwind CSS              | 3.x      | Utility-first CSS framework                |
| **Charts**         | Recharts                  | 2.x      | React-native charting library              |
| **Backend**        | Express.js                | 4.x      | REST API server                            |
| **Runtime**        | Node.js                   | 20.x LTS | JavaScript runtime                         |
| **Cache**          | node-cache                | 5.x      | In-memory server-side caching              |
| **News (Nigeria)** | Nigerian RSS Feeds        | RSS 2.0  | Punch, Vanguard, Premium Times, Channels TV |
| **News (World)**   | NewsData.io               | v1       | Structured API (200 credits/day free)      |
| **News (Backup)**  | NewsAPI.org               | v2       | Global headlines fallback (100 req/day)    |
| **RSS Parser**     | rss-parser                | 3.x      | Parse Nigerian RSS/XML feeds               |
| **HTTP Client**    | axios                     | 1.x      | API requests with error handling           |
| **Date Formatting**| date-fns                  | 3.x      | Relative time display                      |
| **Security**       | helmet                    | 7.x      | Express security headers                   |
| **Logging**        | morgan                    | 1.x      | HTTP request logging                       |
| **Deployment (FE)**| Vercel                    | -        | Frontend hosting with edge network         |
| **Deployment (BE)**| Render                    | -        | Backend hosting with auto-deploy           |

### 5.2 Project Structure

```
smart-news-reader/
├── frontend/                          # Next.js 14 Application
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (Navbar, Footer, fonts)
│   │   ├── page.tsx                   # Home: News feed + filters (SSR)
│   │   ├── [slug]/
│   │   │   └── page.tsx               # Article detail (SSR)
│   │   ├── analytics/
│   │   │   └── page.tsx               # Dashboard (CSR, 'use client')
│   │   └── admin/
│   │       └── page.tsx               # Admin panel (CSR + Auth)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── NewsCard.tsx           # Article card component
│   │   │   ├── SentimentBadge.tsx     # Colored sentiment indicator
│   │   │   ├── CategoryBadge.tsx      # Topic category tag
│   │   │   ├── FilterChips.tsx        # Filter button group
│   │   │   ├── ReadingTime.tsx        # "X min read" display
│   │   │   ├── ShareButton.tsx        # Copy link button
│   │   │   ├── Skeleton.tsx           # Loading skeleton component
│   │   │   └── Toast.tsx              # Notification toast
│   │   ├── feed/
│   │   │   ├── NewsFeed.tsx           # Article grid with filters
│   │   │   └── FeaturedArticle.tsx    # Pinned article display
│   │   ├── analytics/
│   │   │   ├── SentimentChart.tsx     # Pie/donut chart
│   │   │   ├── CategoryChart.tsx      # Bar chart
│   │   │   ├── MostRead.tsx           # Top articles list
│   │   │   └── TrendingTopics.tsx     # Keyword frequency
│   │   ├── admin/
│   │   │   ├── AdminTable.tsx         # Article management table
│   │   │   ├── SentimentOverride.tsx  # Override form/modal
│   │   │   └── FeaturedToggle.tsx     # Pin/unpin toggle
│   │   └── layout/
│   │       ├── Navbar.tsx             # Top navigation
│   │       └── Footer.tsx             # Footer
│   ├── lib/
│   │   ├── api.ts                     # API client functions
│   │   └── utils.ts                   # Helper utilities
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── package.json
│   └── .env.local
│
├── backend/                           # Express.js API Server
│   ├── src/
│   │   ├── server.js                  # Express app entry point
│   │   ├── routes/
│   │   │   ├── news.js                # /api/news routes
│   │   │   ├── analytics.js           # /api/analytics routes
│   │   │   ├── sentiment.js           # /api/sentiment routes
│   │   │   └── admin.js               # /api/admin routes
│   │   ├── services/
│   │   │   ├── newsService.js         # NewsAPI.org integration
│   │   │   ├── sentimentService.js    # Sentiment analysis engine
│   │   │   ├── analyticsService.js    # Analytics computation
│   │   │   └── cacheService.js        # node-cache management
│   │   ├── middleware/
│   │   │   ├── auth.js                # Basic auth for admin
│   │   │   ├── rateLimiter.js         # Request rate limiting
│   │   │   └── errorHandler.js        # Global error handling
│   │   ├── data/
│   │   │   ├── positiveWords.js       # Positive keyword dictionary
│   │   │   ├── negativeWords.js       # Negative keyword dictionary
│   │   │   ├── positivePhrases.js     # Positive phrase dictionary
│   │   │   └── negativePhrases.js     # Negative phrase dictionary
│   │   └── utils/
│   │       ├── slugify.js             # URL slug generator
│   │       └── helpers.js             # Shared utilities
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── docs/
│   ├── PRD.md                         # Product Requirements Document
│   └── MVP.md                         # This document
│
├── .gitignore
└── README.md                          # Setup & deployment instructions
```

### 5.3 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEPLOYMENT                     │
│                                                             │
│  ┌───────────────────────┐      ┌───────────────────────┐  │
│  │      VERCEL            │      │       RENDER           │  │
│  │                       │      │                       │  │
│  │  ┌─────────────────┐ │      │  ┌─────────────────┐ │  │
│  │  │   Next.js 14    │ │ REST │  │   Express.js    │ │  │
│  │  │   Frontend      │─┼──────┼─▶│   Backend       │ │  │
│  │  │                 │ │      │  │                 │ │  │
│  │  │  • SSR Pages    │ │      │  │  • REST API     │ │  │
│  │  │  • Static Assets│ │      │  │  • Sentiment    │ │  │
│  │  │  • Edge Network │ │      │  │  • Cache        │ │  │
│  │  └─────────────────┘ │      │  │  • Admin Auth   │ │  │
│  │                       │      │  └────────┬────────┘ │  │
│  │  Free Tier:           │      │           │          │  │
│  │  • 100GB bandwidth   │      │  Free Tier:│          │  │
│  │  • Automatic HTTPS   │      │  • 750 hrs/month     │  │
│  │  • Git auto-deploy   │      │  • Auto-sleep (15m)  │  │
│  │  • Preview deploys   │      │  • Git auto-deploy   │  │
│  └───────────────────────┘      └───────────┼──────────┘  │
│                                              │             │
│                                     ┌────────▼────────┐   │
│                                     │  NewsAPI.org     │   │
│                                     │  (External)      │   │
│                                     │                  │   │
│                                     │  100 req/day     │   │
│                                     │  Free tier       │   │
│                                     └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 Key Technical Decisions

| Decision                          | Choice                  | Rationale                                           |
|-----------------------------------|-------------------------|-----------------------------------------------------|
| Separate backend vs Next.js API routes | Separate Express server | Clearer architecture, independent scaling, better for PRD narrative |
| In-memory cache vs Redis          | node-cache (in-memory)  | Zero external dependencies; sufficient for MVP data volume |
| Recharts vs Chart.js              | Recharts                | Native React integration; declarative API; tree-shakeable |
| TypeScript vs JavaScript          | TypeScript (frontend), JS (backend) | Type safety for complex UI; simplicity for backend |
| SSR vs CSR for homepage           | SSR                     | SEO for news content; faster initial render         |
| Basic auth vs JWT for admin       | Basic auth              | Simplest secure approach for single admin user      |
| Tailwind vs CSS Modules           | Tailwind CSS            | Rapid prototyping; utility-first; consistent design |
| node-cache TTL                    | 15 minutes              | Balances freshness with API rate limit conservation  |

---

## 6. Acceptance Criteria

### 6.1 News Feed (MUST HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-01 | Homepage loads articles           | User navigates to homepage         | Page finishes loading          | At least 20 article cards are visible with headlines     |
| AC-02 | Sentiment badge displayed         | Homepage has loaded                | User looks at any article card | Card shows a colored badge: 🟢 (positive), ⚪ (neutral), or 🔴 (negative) with text label |
| AC-03 | Category badge displayed          | Homepage has loaded                | User looks at any article card | Card shows a category tag (e.g., "Tech", "Politics")    |
| AC-04 | Article summary shown             | Homepage has loaded                | User looks at any article card | Card shows first 100–200 characters of article description |
| AC-05 | Relative timestamp shown          | Homepage has loaded                | User looks at any article card | Card shows relative time (e.g., "2h ago", "1d ago") not raw ISO date |
| AC-06 | Source name shown                 | Homepage has loaded                | User looks at any article card | Card shows the news source name (e.g., "The Verge")     |
| AC-07 | Responsive layout                 | User is on a mobile device (375px) | Homepage loads                 | Cards stack in single column; no horizontal overflow     |
| AC-08 | Desktop grid layout               | User is on desktop (1280px+)       | Homepage loads                 | Cards display in 2-column grid with proper spacing       |

### 6.2 Filtering (MUST HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-09 | Category filter works             | User is viewing the feed           | User clicks "Tech" filter chip | Only articles with category "tech" are displayed         |
| AC-10 | Sentiment filter works            | User is viewing the feed           | User clicks "Positive" chip    | Only articles with sentiment "positive" are displayed    |
| AC-11 | Combined filters work             | "Tech" filter is active            | User also clicks "Positive"    | Only articles that are BOTH tech AND positive are shown  |
| AC-12 | Filter updates instantly           | User clicks any filter chip        | Filter is applied              | Feed updates in < 200ms without full page reload         |
| AC-13 | Active filter is highlighted      | User clicks a filter chip          | Chip becomes active            | Active chip has filled background color (distinct from inactive) |
| AC-14 | Reset filters                     | One or more filters are active     | User clicks "All"              | All filters are cleared; full unfiltered feed is shown   |
| AC-15 | Empty state                       | User applies restrictive filters   | No articles match              | A friendly "No articles match your filters" message appears |

### 6.3 Article Detail (MUST HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-16 | Navigate to article               | User is on the homepage            | User clicks an article headline | Browser navigates to `/[slug]` with full article content |
| AC-17 | Article metadata shown            | User is on article detail page     | Page loads                     | Page shows: title, full content, source, author, date, category, sentiment |
| AC-18 | Reading time shown                | User is on article detail page     | Page loads                     | Page shows "X min read" based on word count ÷ 200       |
| AC-19 | Back navigation                   | User is on article detail page     | User clicks "Back to Feed"     | User returns to homepage with previously active filters  |
| AC-20 | Copy link works                   | User is on article detail page     | User clicks "Copy Link"        | Article URL is copied to clipboard; toast shows "Copied!" |

### 6.4 Analytics Dashboard (SHOULD HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-21 | Dashboard loads                   | User navigates to /analytics       | Page loads                     | Dashboard displays with at least 2 chart visualizations  |
| AC-22 | Sentiment pie chart               | Dashboard has loaded               | User views sentiment section   | Pie/donut chart shows % positive, neutral, negative      |
| AC-23 | Category bar chart                | Dashboard has loaded               | User views category section    | Bar chart shows article count per category               |
| AC-24 | Chart interactivity               | Dashboard has loaded               | User hovers over chart element | Tooltip shows detailed value (e.g., "Positive: 15 articles, 18.7%") |
| AC-25 | Most-read list                    | Dashboard has loaded               | User views most-read section   | Shows top 5–10 articles sorted by click count            |

### 6.5 Admin Panel (SHOULD HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-26 | Admin requires auth               | Unauthenticated user visits /admin | Page loads                     | Login prompt appears; content is not accessible          |
| AC-27 | Admin login works                 | User enters valid credentials       | User submits login             | Admin panel loads with article management table          |
| AC-28 | Sentiment override                | Admin is in the admin panel        | Admin changes article sentiment from Positive to Negative | Article's sentiment updates immediately across all views |
| AC-29 | Feature article pinning           | Admin is in the admin panel        | Admin toggles featured status  | Article appears/disappears from featured section on homepage |
| AC-30 | Invalid credentials               | User enters wrong credentials       | User submits login             | Error message shown; admin panel remains inaccessible    |

### 6.6 API Endpoints (MUST HAVE)

| ID    | Scenario                          | Given                              | When                           | Then                                                    |
|-------|-----------------------------------|-------------------------------------|--------------------------------|---------------------------------------------------------|
| AC-31 | GET /api/news returns data        | Server is running                   | GET request to /api/news       | Response 200 with JSON containing articles array         |
| AC-32 | Query parameter filtering works   | Server is running                   | GET /api/news?category=tech    | Response contains only tech-category articles            |
| AC-33 | GET /api/news/:id works           | Valid article ID exists             | GET request with ID            | Response 200 with single article + similar articles      |
| AC-34 | GET /api/analytics works          | Server has cached articles          | GET request to /api/analytics  | Response 200 with sentiment and category breakdowns      |
| AC-35 | POST /api/sentiment works         | Server is running                   | POST with text body            | Response 200 with sentiment label, score, and details    |
| AC-36 | Caching works                     | Articles have been fetched          | Same request within 15 min     | Response served from cache (faster, no NewsAPI call)     |
| AC-37 | Error handling works              | NewsAPI is unreachable              | GET request to /api/news       | Response 503 with error message; no server crash         |

---

## 7. Launch Criteria Checklist

### 7.1 Functional Readiness

- [ ] **All MUST HAVE features working** — 12/12 features pass acceptance criteria
- [ ] **All SHOULD HAVE features working** — 12/12 features pass acceptance criteria (or documented deferrals)
- [ ] **News feed displays 20+ articles** on homepage load
- [ ] **Every article has sentiment badge** — no articles without classification
- [ ] **Every article has category badge** — no articles without topic tag
- [ ] **Category filter works** — single category selection filters feed correctly
- [ ] **Sentiment filter works** — single sentiment selection filters feed correctly
- [ ] **Combined filters work** — category + sentiment applied simultaneously
- [ ] **Filters update instantly** — no page reload on filter change
- [ ] **Article detail page** loads with full content and metadata
- [ ] **Analytics dashboard** shows at least 2 functioning charts
- [ ] **Admin panel** requires authentication and allows sentiment override

### 7.2 Technical Readiness

- [ ] **API response time < 500ms** (measured on 10 consecutive requests)
- [ ] **Initial page load < 3 seconds** (measured on 3G network throttle)
- [ ] **No critical JavaScript errors** in browser console on any page
- [ ] **API returns proper error responses** (4xx, 5xx with JSON body)
- [ ] **Caching active** — node-cache TTL of 15 minutes verified
- [ ] **Rate limiting active** on API endpoints
- [ ] **CORS configured** for production domain only
- [ ] **Environment variables** — no hardcoded API keys or credentials
- [ ] **HTTPS enforced** on both frontend and backend

### 7.3 Quality Readiness

- [ ] **Tested on Chrome** (latest) — all features working
- [ ] **Tested on Firefox** (latest) — all features working
- [ ] **Tested on Safari** (latest) — all features working or documented limitations
- [ ] **Tested on Edge** (latest) — all features working
- [ ] **Mobile responsive** (375px) — layout correct, no overflow
- [ ] **Desktop layout** (1280px+) — grid layout correct
- [ ] **Empty states handled** — "No articles match" message on empty filter results
- [ ] **Loading states** — skeleton or spinner while data loads
- [ ] **Error states** — friendly error messages when API fails
- [ ] **No broken images** — fallback placeholder for missing article images

### 7.4 Deployment Readiness

- [ ] **Frontend deployed to Vercel** — accessible via production URL
- [ ] **Backend deployed to Render** — API accessible and responding
- [ ] **Environment variables set** in both Vercel and Render dashboards
- [ ] **NewsAPI key active** and validated (fetch test successful)
- [ ] **Admin credentials set** — non-default username and password
- [ ] **Git repository clean** — no uncommitted changes, `.env` in `.gitignore`
- [ ] **README.md complete** — setup instructions, environment variables, architecture overview

### 7.5 Demo Readiness

- [ ] **3-minute demo script prepared** covering all 5 user flows
- [ ] **Demo talking points** documented for each feature
- [ ] **Fallback plan** — screenshots or recorded video if live demo fails
- [ ] **Edge cases tested** — demo flow works with current live data

---

## 8. MVP Risks & Constraints

### 8.1 MVP-Specific Risks

| ID    | Risk                                     | Impact on MVP                         | Mitigation                                    |
|-------|------------------------------------------|---------------------------------------|-----------------------------------------------|
| MR-01 | **NewsAPI 100 req/day limit hit**       | No new articles; feed becomes stale   | 15-min cache TTL; batch fetches by category; show "last updated" banner when stale |
| MR-02 | **Keyword sentiment accuracy < 60%**    | Users lose trust in sentiment badges  | Extensive word lists (120+ words); admin override; transparent scoring display |
| MR-03 | **Render free tier cold starts (30s)**  | First API request extremely slow      | Keep-alive ping every 14 min; loading skeleton on frontend; user-facing "warming up" message |
| MR-04 | **In-memory cache lost on restart**     | All articles and analytics disappear  | Render auto-deploys rarely; cache rebuilds on first request; acceptable for MVP |
| MR-05 | **API key exposed accidentally**        | Security breach; API key revoked      | Server-side only; environment variables; `.env` in `.gitignore`; key rotation plan |
| MR-06 | **Demo fails due to live data issues**  | No articles available during demo     | Pre-cache articles before demo; fallback to mock data endpoint; prepared screenshots |
| MR-07 | **Scope creep adds 2+ days**            | MVP delivery delayed past 5 days      | Strict MoSCoW adherence; daily scope review; defer all P2 features immediately if behind |

### 8.2 Constraints Table

| Constraint                    | Limit                    | Impact                                        | Workaround                           |
|-------------------------------|--------------------------|-----------------------------------------------|--------------------------------------|
| NewsAPI free tier             | 100 requests/day         | Limited data freshness                         | 15-min cache TTL; smart batch fetching |
| Vercel free tier              | 100GB bandwidth/month    | Sufficient for MVP traffic                     | Optimize images and bundle size      |
| Render free tier              | 750 hours/month          | Server sleeps after 15 min inactivity          | Keep-alive cron or accept cold starts |
| No persistent database        | In-memory only           | Data lost on server restart                    | Acceptable for MVP; upgrade to DB in v2 |
| Single developer              | 1 person × 5 days        | 40 hours effective development time            | Strict prioritization; no yak-shaving |
| No ML infrastructure          | Keyword-only sentiment   | Limited accuracy; no contextual understanding  | Extensive dictionaries; admin override |
| English only                  | Single language           | Non-English articles misclassified             | Document as known limitation         |

### 8.3 Risk Response Matrix

```
High Impact ┌────────────────────────────────┐
            │ MR-01: API Limit   │ MR-06: Demo  │
            │ Mitigation: Cache  │ Mitigation:   │
            │                    │ Mock data      │
            ├────────────────────┤               │
            │ MR-03: Cold Start  │ MR-05: Key    │
            │ Accept + Message   │ .env + .git   │
            │                    │ ignore         │
Low Impact  ├────────────────────┤               │
            │ MR-04: Cache Loss  │ MR-07: Scope  │
            │ Accept for MVP     │ MoSCoW strict  │
            │                    │               │
            └────────────────────────────────────┘
            Low Probability        High Probability
```

---

## 9. Definition of Done

### 9.1 Feature-Level DoD

A feature is considered **DONE** when all of the following criteria are met:

| # | Criterion                             | Verification Method                       |
|---|---------------------------------------|-------------------------------------------|
| 1 | Feature matches acceptance criteria   | Manual walkthrough of AC scenarios        |
| 2 | No JavaScript errors in console       | Browser DevTools check (Chrome)           |
| 3 | Responsive on mobile (375px)          | Chrome DevTools device emulation          |
| 4 | Responsive on desktop (1280px+)       | Desktop browser full-width test           |
| 5 | API errors handled gracefully         | Disconnect network; verify error state    |
| 6 | Loading states present                | Throttle network to 3G; verify skeleton   |
| 7 | Code is clean and readable            | No commented-out code; meaningful names   |
| 8 | No hardcoded secrets                  | Grep for API keys, passwords in codebase  |

### 9.2 Sprint-Level DoD

The MVP sprint is considered **DONE** when:

| # | Criterion                             | Owner           |
|---|---------------------------------------|-----------------|
| 1 | All MUST HAVE features pass DoD       | Developer       |
| 2 | All SHOULD HAVE features pass DoD (or documented deferrals) | Developer |
| 3 | Launch criteria checklist is complete  | Developer + QA  |
| 4 | Frontend deployed to Vercel (live)    | Developer       |
| 5 | Backend deployed to Render (live)     | Developer       |
| 6 | README.md with setup instructions     | Developer       |
| 7 | Demo script tested end-to-end         | Developer       |
| 8 | Client sign-off received              | Client          |

### 9.3 Quality Gates

```
Gate 1: Code Complete ───────────────────────
├── All features implemented
├── No TODO comments for MVP features
└── All API endpoints responding

Gate 2: Test Complete ───────────────────────
├── All 37 acceptance criteria verified
├── Tested on Chrome, Firefox, Edge
├── Mobile responsiveness verified
└── Error/loading/empty states tested

Gate 3: Deploy Complete ─────────────────────
├── Frontend live on Vercel
├── Backend live on Render
├── Environment variables configured
├── HTTPS verified
└── End-to-end flow working on production

Gate 4: Demo Ready ──────────────────────────
├── 3-minute demo script rehearsed
├── All 5 user flows working with live data
├── Fallback materials prepared
└── Talking points documented
```

---

## 10. Post-MVP Roadmap

### 10.1 Release Plan

```
v1.0 (MVP) ─── February 2026 ──────────────────── YOU ARE HERE
│
│  Keyword-based sentiment │ Single API source │ In-memory cache
│  Basic auth admin │ 2 chart types │ Free hosting
│
▼
v1.1 (Polish) ─── March 2026 ─────────────────────
│
│  Bug fixes │ Performance optimization │ SEO meta tags
│  Dark mode │ Search functionality │ Tablet breakpoint
│  Custom 404/error pages │ Lighthouse optimization
│
▼
v1.5 (Smart Upgrade) ─── April 2026 ──────────────
│
│  NLP sentiment (VADER or Compromise.js) │ Accuracy > 85%
│  Negation handling ("not good" = negative)
│  Category-specific sentiment dictionaries
│  Sentiment confidence scores in UI
│
▼
v2.0 (Full Platform) ─── May–June 2026 ───────────
│
│  User accounts (NextAuth.js) │ Bookmarks │ Reading history
│  PostgreSQL database │ Redis cache │ Data persistence
│  Multi-source aggregation (GNews, MediaStack, RSS)
│  RBAC admin (roles: editor, moderator, admin)
│  Email/push notifications │ PWA support
│
▼
v3.0 (Intelligence) ─── Q3–Q4 2026 ───────────────
│
│  ML-based sentiment (transformer models) │ Accuracy > 95%
│  Personalization engine │ Content recommendations
│  Real-time WebSocket updates │ Live sentiment tracking
│  Multi-language support (10+ languages)
│  A/B testing infrastructure │ Analytics API for third parties
│  React Native mobile apps (iOS + Android)
│
▼
Future ────────────────────────────────────────────
│
│  Source credibility scoring │ Bias detection
│  Collaborative filtering │ Community features
│  Enterprise API │ White-label solution
│  AI-powered article summaries
```

### 10.2 Iteration Details

#### v1.1 — Polish & Performance (2 weeks)

| Feature                 | Description                                        | Effort   |
|-------------------------|----------------------------------------------------|----------|
| Dark Mode               | Tailwind dark mode with system preference detection | 4 hours  |
| Search                  | Full-text search across headlines and descriptions  | 6 hours  |
| SEO Meta Tags           | Open Graph + Twitter Card tags on all pages         | 3 hours  |
| Custom Error Pages      | Styled 404 and 500 pages                           | 2 hours  |
| Tablet Breakpoint       | Optimized layout for 768px screens                  | 3 hours  |
| Performance Audit       | Lighthouse optimization, image lazy loading         | 4 hours  |
| Trending Keywords       | Most frequent words display on dashboard            | 4 hours  |
| Admin Activity Log      | Timestamped log of admin actions                    | 4 hours  |

#### v1.5 — Smart Sentiment Upgrade (2 weeks)

| Feature                     | Description                                    | Effort   |
|-----------------------------|------------------------------------------------|----------|
| VADER Integration           | Replace keyword-only with VADER NLP library    | 8 hours  |
| Negation Handling           | Detect "not", "no", "never" before sentiment words | 4 hours |
| Category-Specific Dicts     | Separate word lists for finance vs sports     | 6 hours  |
| Confidence Scoring          | Show high/medium/low confidence in UI         | 3 hours  |
| Accuracy Benchmarking       | Test against 500 labeled articles              | 4 hours  |
| Sentiment Comparison Mode   | Show keyword vs NLP results side by side       | 6 hours  |

#### v2.0 — Full Platform (4 weeks)

| Feature                     | Description                                    | Effort    |
|-----------------------------|------------------------------------------------|-----------|
| User Authentication         | NextAuth.js with Google/GitHub OAuth           | 12 hours  |
| PostgreSQL Migration        | Persistent data storage with Prisma ORM        | 16 hours  |
| Redis Caching               | Replace node-cache with Redis for persistence | 6 hours   |
| Bookmarks & History         | User reading list and history tracking         | 8 hours   |
| Multi-Source Aggregation     | Add GNews API, MediaStack, RSS feeds          | 12 hours  |
| RBAC Admin                  | Role-based access control for admin panel      | 8 hours   |
| Email Notifications         | SendGrid integration for daily digest          | 6 hours   |
| PWA Support                 | Service worker, offline mode, install prompt   | 8 hours   |

### 10.3 Success Metrics Per Release

| Release | Key Metric                    | Target          |
|---------|-------------------------------|-----------------|
| v1.0    | MVP delivery on time          | 5 days          |
| v1.0    | Sentiment accuracy            | > 75%           |
| v1.1    | Lighthouse Performance score  | > 90            |
| v1.1    | Search result relevance       | > 80% precision |
| v1.5    | Sentiment accuracy (NLP)      | > 85%           |
| v1.5    | Negation detection accuracy   | > 70%           |
| v2.0    | Registered users (30 days)    | 100+            |
| v2.0    | Daily active users            | 25+             |
| v2.0    | Return user rate (7-day)      | > 30%           |
| v3.0    | Sentiment accuracy (ML)       | > 95%           |
| v3.0    | Mobile app installs           | 500+            |

---

## Appendix: 3-Minute Demo Script

### Preparation
- Open the production URL in Chrome with a clean browser window
- Ensure backend has fresh cached data (make a test API call 5 min before)
- Have admin credentials ready

### Demo Script

**[0:00 – 0:30] Introduction & Home Feed**

> *"This is Smart News Reader — a modern news platform that doesn't just show you news, it tells you the mood of every article with a sentiment badge."*

- Show the homepage with the news feed loaded
- Point out the colored sentiment badges on each card (green, gray, red)
- Point out the category badges (Tech, Politics, Finance)
- Highlight the relative timestamps ("2h ago")
- *"Users can scan 20 articles and know the emotional tone of each one in under 3 seconds."*

**[0:30 – 1:15] Smart Filtering**

> *"What makes this unique is the combined filtering. No other news app lets you filter by both topic AND mood."*

- Click **"Tech"** filter → feed instantly updates to show only tech articles
- *"Now I only see tech news."*
- Click **"Positive"** filter → feed updates again
- *"Now I only see positive tech news. If I'm a tech investor, I want to see bullish tech coverage, and I can do that in two clicks."*
- Click **"All"** to reset
- Click **"Negative"** → show negative articles
- *"Or if I'm monitoring risks, I can instantly see all the negative coverage."*

**[1:15 – 1:45] Article Detail**

> *"Let me click into an article to show the full experience."*

- Click any article headline → article detail page loads
- Point out: full content, reading time ("4 min read")
- Scroll to sentiment analysis details
- *"The app transparently shows WHY it classified this article as positive — here are the keywords it detected. This is my own NLP engine, not a third-party AI."*
- Click **"Copy Link"** button → show toast
- Scroll to similar articles section
- Click "Back to Feed"

**[1:45 – 2:30] Analytics Dashboard**

> *"Now let me show the analytics dashboard — this is where the data tells a story."*

- Navigate to **/analytics**
- Point out the sentiment pie chart
- *"Today's news is 60% neutral, 25% negative, and 15% positive. This gives you an instant pulse on the media landscape."*
- Point out the category bar chart
- *"Tech is dominating today's coverage with 22 articles."*
- Show the most-read articles list
- *"And these are the most-clicked articles today."*

**[2:30 – 3:00] Admin Panel**

> *"Finally, the admin panel — because AI isn't perfect."*

- Navigate to **/admin** → authenticate
- Show article management table
- Click "Edit" on an article → show sentiment override modal
- *"If the algorithm gets it wrong — say, it can't detect sarcasm — the admin can manually correct the sentiment with a reason. This makes the system self-correcting."*
- Toggle a featured article pin
- *"And admins can pin important articles to the top of the feed."*

**[3:00] Closing**

> *"This project demonstrates real-time API integration, custom NLP sentiment analysis, live data visualization, responsive design, and admin content management — all built with Next.js, Express, and Tailwind CSS."*

---

*End of MVP Specification Document*

*Document Version: 1.0 | Date: February 19, 2026 | Status: Final Draft*

*© 2026 Smart News Reader — Confidential*
