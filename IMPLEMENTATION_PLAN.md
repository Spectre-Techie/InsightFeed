# Implementation Plan

## Smart News Reader with Sentiment Analysis

| Field              | Detail                                          |
|--------------------|------------------------------------------------|
| **Document Version** | 1.0                                            |
| **Date**             | February 21, 2026                              |
| **Status**           | Approved for Development                       |
| **Package Manager**  | pnpm (mandatory — do NOT use npm or yarn)      |
| **News Coverage**    | Nigeria (primary) + Worldwide (secondary)      |
| **Related Docs**     | [PRD.md](PRD.md) · [MVP.md](MVP.md)           |
| **Confidentiality**  | Confidential — Do Not Distribute Externally    |

---

## Table of Contents

1. [News Sources Strategy](#1-news-sources-strategy)
2. [Technology Stack & Tooling](#2-technology-stack--tooling)
3. [Project Scaffolding](#3-project-scaffolding)
4. [Day-by-Day Implementation](#4-day-by-day-implementation)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [Sentiment Engine Implementation](#7-sentiment-engine-implementation)
8. [Analytics & Admin Implementation](#8-analytics--admin-implementation)
9. [Deployment Pipeline](#9-deployment-pipeline)
10. [Testing Strategy](#10-testing-strategy)
11. [Environment Configuration](#11-environment-configuration)
12. [Troubleshooting & Fallbacks](#12-troubleshooting--fallbacks)

---

## 1. News Sources Strategy

### 1.1 The Challenge

The platform must serve **two distinct audiences**:
- **Nigerian readers** who want local news (politics, economy, entertainment, sports)
- **Global readers** who want worldwide headlines alongside Nigerian coverage

No single free API covers both adequately. The solution is a **multi-source aggregation strategy**.

### 1.2 Chosen Sources (All Free Tier — $0 Total Cost)

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEWS SOURCE ARCHITECTURE                      │
│                                                                 │
│  ┌──────────────────────────────────┐                           │
│  │     LAYER 1: NIGERIAN NEWS       │   ← Primary content      │
│  │                                  │                           │
│  │  📰 Punch Nigeria RSS            │   No limit, full text    │
│  │  📰 Vanguard News RSS            │   No limit, full text    │
│  │  📰 Premium Times RSS            │   No limit, full text    │
│  │  📰 Channels TV RSS              │   No limit, full text    │
│  └──────────────────────────────────┘                           │
│                                                                 │
│  ┌──────────────────────────────────┐                           │
│  │     LAYER 2: WORLDWIDE NEWS      │   ← Global coverage      │
│  │                                  │                           │
│  │  🌍 NewsData.io (Free)           │   200 credits/day        │
│  │     - country=ng for Nigeria     │   ~2,000 articles/day    │
│  │     - country=us,gb for world    │   Structured JSON API    │
│  └──────────────────────────────────┘                           │
│                                                                 │
│  ┌──────────────────────────────────┐                           │
│  │     LAYER 3: BACKUP / SEARCH     │   ← Fallback             │
│  │                                  │                           │
│  │  🔍 NewsAPI.org (Free Dev)       │   100 req/day            │
│  │     - /v2/top-headlines          │   Global headlines       │
│  │     - /v2/everything (search)    │   Keyword search         │
│  └──────────────────────────────────┘                           │
│                                                                 │
│  ┌──────────────────────────────────┐                           │
│  │     LAYER 4: EMERGENCY FALLBACK  │   ← If all else fails    │
│  │                                  │                           │
│  │  🛡️ MediaStack (Free)            │   100 calls/month        │
│  │     - countries=ng confirmed     │   Use ONLY as last resort│
│  └──────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Source Details

#### Layer 1: Nigerian RSS Feeds (Primary — Unlimited, Free, Full Text)

| Source          | RSS URL                                           | Update Freq | Content  | Categories |
|-----------------|---------------------------------------------------|-------------|----------|------------|
| **Punch NG**    | `https://rss.punchng.com/v1/category/latest_news` | ~5 min      | Full     | News, Politics, Sports, Business, Entertainment |
| **Vanguard**    | `https://www.vanguardngr.com/feed/`               | ~1 hour     | Full     | News, Politics, Business, Sports, Technology |
| **Premium Times** | `https://www.premiumtimesng.com/feed`          | ~1 hour     | Full     | News, Investigations, Politics, Business |
| **Channels TV** | `https://www.channelstv.com/feed/`                | ~1 hour     | Full     | Breaking, National, Business, Sports, Entertainment |

**Why RSS is the best choice for Nigerian news:**
- **No API key required** — zero registration, zero cost
- **No rate limits** — fetch as often as needed
- **Full article text** — not truncated like API responses
- **Category tags included** — map directly to our filter categories
- **Reliable uptime** — RSS is a mature, stable protocol

#### Layer 2: NewsData.io (Worldwide + Nigeria Structured API)

| Property            | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Base URL**        | `https://newsdata.io/api/1`                         |
| **Free Tier**       | 200 credits/day (~2,000 articles/day)               |
| **Nigeria Support** | ✅ Confirmed — `country=ng` parameter               |
| **World Support**   | ✅ Full — `country=us,gb,ng` multi-country           |
| **Key Endpoints**   | `/news` (latest), `/archive` (historical)           |
| **Languages**       | `en` (English) — filter for English-language Nigerian news |
| **Categories**       | business, entertainment, environment, food, health, politics, science, sports, technology, top, world |
| **Response Format** | JSON with `title`, `description`, `content`, `pubDate`, `source_id`, `category`, `image_url` |

**Example Requests:**
```
Nigerian news:     GET /news?country=ng&language=en&apikey=KEY
World news:        GET /news?country=us,gb&language=en&apikey=KEY
Tech news (NG):    GET /news?country=ng&category=technology&apikey=KEY
Combined:          GET /news?country=ng,us,gb&language=en&apikey=KEY
```

#### Layer 3: NewsAPI.org (Backup Global Search)

| Property            | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Base URL**        | `https://newsapi.org/v2`                            |
| **Free Tier**       | 100 requests/day (dev only — no production use)     |
| **Nigeria Support** | ⚠️ Limited — `country=ng` may have few sources      |
| **Key Endpoints**   | `/top-headlines`, `/everything`                     |
| **Use Case**        | Global keyword search; fallback when NewsData.io rate-limited |
| **Limitation**      | Content truncated to 200 chars; CORS localhost only  |

#### Layer 4: MediaStack (Emergency Only)

| Property            | Detail                                              |
|---------------------|-----------------------------------------------------|
| **Base URL**        | `http://api.mediastack.com/v1`                      |
| **Free Tier**       | 100 calls/month (extremely limited)                 |
| **Nigeria Support** | ✅ Confirmed — `countries=ng`                        |
| **Use Case**        | Emergency fallback ONLY when all other sources fail  |
| **Limitation**      | No HTTPS on free tier; 100 calls/month              |

### 1.4 Data Flow: Multi-Source Aggregation

```
┌──────────────┐   RSS/XML   ┌──────────────────────────────────┐
│  Punch NG    │────────────▶│                                  │
│  Vanguard    │────────────▶│      RSS PARSER MODULE           │
│  Premium T.  │────────────▶│      (rss-parser npm)            │
│  Channels TV │────────────▶│                                  │
└──────────────┘             │  Parse XML → Normalize → Merge   │
                             └──────────────┬───────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────────┐
┌──────────────┐   JSON      │                                  │
│ NewsData.io  │────────────▶│     ARTICLE NORMALIZER           │
└──────────────┘             │                                  │
                             │  Unified schema:                 │
┌──────────────┐   JSON      │  { id, title, description,       │
│ NewsAPI.org  │────────────▶│    content, source, category,    │
└──────────────┘             │    publishedAt, imageUrl,        │
                             │    sourceType: 'rss'|'api' }     │
                             └──────────────┬───────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────────┐
                             │     SENTIMENT ANALYZER            │
                             │                                  │
                             │  Analyze each article →          │
                             │  Attach { label, score,          │
                             │  confidence, details }           │
                             └──────────────┬───────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────────┐
                             │     DEDUPLICATOR                  │
                             │                                  │
                             │  Remove duplicate articles       │
                             │  (same headline from multiple    │
                             │   sources) using title similarity│
                             └──────────────┬───────────────────┘
                                            │
                                            ▼
                             ┌──────────────────────────────────┐
                             │     CACHE (node-cache)            │
                             │                                  │
                             │  TTL: 15 min (APIs)              │
                             │  TTL: 10 min (RSS)               │
                             │  Separate keys per source/filter │
                             └──────────────────────────────────┘
```

### 1.5 Rate Limit Budget

#### NewsData.io — 200 credits/day

| Use Case                        | Credits | Calculation                       |
|----------------------------------|---------|-----------------------------------|
| Nigerian headlines (every 15 min) | 64      | 16 hours × 4 per hour            |
| World headlines (every 30 min)   | 32      | 16 hours × 2 per hour            |
| Category-specific fetches        | 40      | 8 categories × 5 fetches/day     |
| User-initiated refreshes         | 40      | Buffer for search/filters         |
| Admin/test                       | 24      | Testing and development           |
| **Total**                        | **200** | Exactly within free limit         |

#### RSS Feeds — Unlimited

| Use Case                        | Requests | Calculation                      |
|----------------------------------|----------|----------------------------------|
| All 4 feeds (every 10 min)       | 576      | 4 feeds × 144 intervals/day     |
| On-demand refresh                | ~50      | User-triggered refreshes         |
| **Total**                        | **~626** | No limit — fetch freely          |

#### NewsAPI.org — 100 requests/day (backup only)

| Use Case                        | Requests | Calculation                      |
|----------------------------------|----------|----------------------------------|
| Global headlines (every 30 min)  | 32       | Backup world news               |
| Keyword search                   | 20       | User search queries              |
| Category browsing                | 30       | Browsing different topics        |
| Buffer                           | 18       | Testing and edge cases           |
| **Total**                        | **100**  | Exactly within free limit        |

### 1.6 Category Mapping

Different sources use different category names. We normalize to a unified set:

| Unified Category | Punch NG        | Vanguard          | NewsData.io     | NewsAPI.org     |
|------------------|-----------------|-------------------|-----------------|-----------------|
| `politics`       | Politics        | Politics           | politics        | general         |
| `technology`     | Technology      | Technology         | technology      | technology      |
| `sports`         | Sports          | Sports             | sports          | sports          |
| `business`       | Business        | Business           | business        | business        |
| `entertainment`  | Entertainment   | Entertainment      | entertainment   | entertainment   |
| `health`         | Health          | Health             | health          | health          |
| `world`          | World           | World              | world           | general         |
| `science`        | —               | —                  | science         | science         |
| `nigeria`        | (all)           | (all)              | (country=ng)    | —               |

Special handling:
- All RSS articles from Nigerian outlets automatically get a secondary tag: `nigeria`
- Users can filter by `nigeria` to see only local coverage regardless of topic

---

## 2. Technology Stack & Tooling

### 2.1 Package Manager: pnpm

**pnpm is mandatory for this project.** Do not use npm or yarn.

| Property          | Detail                                       |
|-------------------|----------------------------------------------|
| **Manager**       | pnpm v9.x                                   |
| **Why pnpm**      | 3× faster installs, strict dependency isolation, disk-efficient via symlinks |
| **Workspace**     | pnpm workspaces for monorepo (frontend + backend) |
| **Lock file**     | `pnpm-lock.yaml` (committed to git)         |
| **Node version**  | 20.x LTS (enforced via `.nvmrc`)            |

### 2.2 Full Stack

```
┌──────────────────────────────────────────────────────────┐
│                     TECHNOLOGY STACK                      │
│                                                          │
│  FRONTEND                          BACKEND               │
│  ─────────                          ───────              │
│  Next.js 14 (App Router)           Express.js 4.x       │
│  React 18                          Node.js 20 LTS       │
│  TypeScript 5.x                    JavaScript (ES2022)   │
│  Tailwind CSS 3.x                  node-cache 5.x       │
│  Recharts 2.x                      rss-parser 3.x       │
│  date-fns 3.x                      uuid 9.x            │
│  lucide-react (icons)              slugify 1.x          │
│                                    helmet 7.x           │
│                                    morgan 1.x           │
│                                    cors 2.x             │
│                                    dotenv 16.x          │
│                                    express-rate-limit 7.x│
│                                    axios 1.x            │
│                                                          │
│  DEPLOYMENT                        PACKAGE MANAGER       │
│  ──────────                        ───────────────       │
│  Vercel (frontend)                 pnpm 9.x (MANDATORY) │
│  Render (backend)                  pnpm workspaces       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 2.3 New Dependencies (vs original PRD)

| Package       | Purpose                                     | Why Added                       |
|---------------|---------------------------------------------|---------------------------------|
| `rss-parser`  | Parse RSS/XML feeds from Nigerian outlets   | Nigerian RSS feed support       |
| `axios`       | HTTP client for API calls + RSS fetching    | Better error handling than fetch |
| `lucide-react`| Modern icon library for UI                  | Lighter than heroicons, tree-shakeable |

---

## 3. Project Scaffolding

### 3.1 Prerequisites

```powershell
# Verify Node.js 20.x is installed
node --version
# Expected: v20.x.x

# Install pnpm globally (if not installed)
npm install -g pnpm

# Verify pnpm
pnpm --version
# Expected: 9.x.x
```

### 3.2 Monorepo Initialization

```powershell
# Navigate to project root
cd "C:\Users\LENOVO\NEWS SENTIMENT"

# Initialize pnpm workspace
pnpm init

# Create workspace configuration
# (creates pnpm-workspace.yaml)
```

#### `pnpm-workspace.yaml`

```yaml
packages:
  - 'frontend'
  - 'backend'
```

#### Root `package.json`

```json
{
  "name": "smart-news-reader",
  "version": "1.0.0",
  "private": true,
  "description": "Smart News Reader with Sentiment Analysis — Nigeria & World News",
  "scripts": {
    "dev": "pnpm --parallel -r run dev",
    "dev:frontend": "pnpm --filter frontend run dev",
    "dev:backend": "pnpm --filter backend run dev",
    "build": "pnpm --parallel -r run build",
    "build:frontend": "pnpm --filter frontend run build",
    "start": "pnpm --parallel -r run start",
    "lint": "pnpm --parallel -r run lint",
    "clean": "pnpm -r exec rm -rf node_modules; rm -rf node_modules"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.15.4"
}
```

### 3.3 Frontend Scaffolding

```powershell
# Create Next.js 14 app with TypeScript + Tailwind
cd "C:\Users\LENOVO\NEWS SENTIMENT"
pnpx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to frontend
cd frontend

# Install frontend dependencies
pnpm add recharts date-fns lucide-react

# Install dev dependencies
pnpm add -D @types/node @types/react
```

### 3.4 Backend Scaffolding

```powershell
# Create backend directory
cd "C:\Users\LENOVO\NEWS SENTIMENT"
mkdir backend
cd backend

# Initialize package.json
pnpm init

# Install backend dependencies
pnpm add express cors helmet morgan dotenv node-cache uuid slugify axios rss-parser express-rate-limit

# Install dev dependencies
pnpm add -D nodemon
```

#### Backend `package.json`

```json
{
  "name": "smart-news-reader-backend",
  "version": "1.0.0",
  "description": "Express API server for Smart News Reader",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 3.5 Complete Directory Structure

```
smart-news-reader/                       # C:\Users\LENOVO\NEWS SENTIMENT\
│
├── pnpm-workspace.yaml                  # pnpm workspace config
├── package.json                         # Root scripts (dev, build, start)
├── .nvmrc                               # Node version: 20
├── .gitignore                           # Git ignore rules
├── README.md                            # Setup & deployment guide
│
├── docs/
│   ├── PRD.md                           # Product Requirements Document
│   ├── MVP.md                           # MVP Specification
│   └── IMPLEMENTATION_PLAN.md           # This document
│
├── frontend/                            # Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout (Navbar, Footer, fonts)
│   │   │   ├── page.tsx                 # Home: News feed + filters (SSR)
│   │   │   ├── loading.tsx              # Root loading skeleton
│   │   │   ├── error.tsx                # Root error boundary
│   │   │   ├── not-found.tsx            # 404 page
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx             # Article detail (SSR)
│   │   │   │   └── loading.tsx          # Article loading skeleton
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx             # Dashboard (CSR, 'use client')
│   │   │   └── admin/
│   │   │       └── page.tsx             # Admin panel (CSR + Auth)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── NewsCard.tsx         # Article card with badges
│   │   │   │   ├── SentimentBadge.tsx   # Colored sentiment indicator
│   │   │   │   ├── CategoryBadge.tsx    # Topic category tag
│   │   │   │   ├── SourceBadge.tsx      # 🇳🇬 Nigeria / 🌍 World tag
│   │   │   │   ├── FilterChips.tsx      # Filter button group
│   │   │   │   ├── ReadingTime.tsx      # "X min read" component
│   │   │   │   ├── ShareButton.tsx      # Copy link button
│   │   │   │   ├── Skeleton.tsx         # Loading skeleton
│   │   │   │   └── Toast.tsx            # Notification toast
│   │   │   ├── feed/
│   │   │   │   ├── NewsFeed.tsx         # Article grid with filters
│   │   │   │   ├── FeaturedArticle.tsx  # Pinned article display
│   │   │   │   └── RegionToggle.tsx     # 🇳🇬 Nigeria / 🌍 World toggle
│   │   │   ├── analytics/
│   │   │   │   ├── SentimentChart.tsx   # Pie/donut chart
│   │   │   │   ├── CategoryChart.tsx    # Bar chart
│   │   │   │   ├── SourceChart.tsx      # Nigeria vs World breakdown
│   │   │   │   ├── MostRead.tsx         # Top articles list
│   │   │   │   └── TrendingTopics.tsx   # Keyword frequency
│   │   │   ├── admin/
│   │   │   │   ├── AdminTable.tsx       # Article management table
│   │   │   │   ├── SentimentOverride.tsx # Override form/modal
│   │   │   │   └── FeaturedToggle.tsx   # Pin/unpin toggle
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx           # Top navigation (with 🇳🇬 flag)
│   │   │       └── Footer.tsx           # Footer
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                   # API client functions
│   │   │   └── utils.ts                 # Helper utilities
│   │   │
│   │   └── types/
│   │       └── index.ts                 # TypeScript type definitions
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   │       └── placeholder-news.png     # Fallback article image
│   │
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local
│
└── backend/                             # Express.js API Server
    ├── src/
    │   ├── server.js                    # Express app entry point
    │   ├── routes/
    │   │   ├── news.js                  # /api/news routes
    │   │   ├── analytics.js             # /api/analytics routes
    │   │   ├── sentiment.js             # /api/sentiment routes
    │   │   └── admin.js                 # /api/admin routes
    │   ├── services/
    │   │   ├── newsService.js           # Multi-source news aggregator
    │   │   ├── rssService.js            # Nigerian RSS feed parser  ← NEW
    │   │   ├── newsDataService.js       # NewsData.io API client    ← NEW
    │   │   ├── newsApiService.js        # NewsAPI.org backup client ← NEW
    │   │   ├── sentimentService.js      # Sentiment analysis engine
    │   │   ├── analyticsService.js      # Analytics computation
    │   │   ├── deduplicatorService.js   # Duplicate article removal ← NEW
    │   │   └── cacheService.js          # node-cache management
    │   ├── middleware/
    │   │   ├── auth.js                  # Basic auth for admin
    │   │   ├── rateLimiter.js           # Request rate limiting
    │   │   └── errorHandler.js          # Global error handling
    │   ├── data/
    │   │   ├── positiveWords.js         # Positive keyword dictionary
    │   │   ├── negativeWords.js         # Negative keyword dictionary
    │   │   ├── positivePhrases.js       # Positive phrase dictionary
    │   │   ├── negativePhrases.js       # Negative phrase dictionary
    │   │   └── nigerianKeywords.js      # Nigeria-specific terms    ← NEW
    │   └── utils/
    │       ├── slugify.js               # URL slug generator
    │       ├── categoryMapper.js        # Cross-source category normalization ← NEW
    │       └── helpers.js               # Shared utilities
    ├── package.json
    ├── .env
    └── .gitignore
```

---

## 4. Day-by-Day Implementation

### Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    5-DAY SPRINT OVERVIEW                        │
│                                                                │
│  Day 1 ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░ Foundation    │
│  Day 2 ░░░░░░░░░░░░░░████████████████░░░░░░░░░░ Sentiment     │
│  Day 3 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████████░░ Filters+Detail│
│  Day 4 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███ Analytics     │
│  Day 5 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ Admin+Deploy │
│                                                                │
│  ● = Must Have    ○ = Should Have    ◇ = Could Have            │
└────────────────────────────────────────────────────────────────┘
```

---

### DAY 1: Foundation — Project Setup + Multi-Source News Fetching

**Goal**: Scaffold the project, connect all news sources, and display a styled news feed.

**Duration**: 8–10 hours

#### Morning Session (4 hours)

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 09:00  | Project scaffolding (pnpm workspace)    | Monorepo with frontend + backend     |
| 09:30  | Backend: Express server setup           | Running server on port 5000          |
| 10:00  | Backend: RSS feed parser (Nigerian news)| 4 Nigerian sources fetching articles |
| 11:00  | Backend: NewsData.io integration        | World + Nigeria API news fetching    |
| 12:00  | Backend: Article normalizer             | Unified article schema from all sources |

##### Step 1.1 — Initialize pnpm Workspace

```powershell
cd "C:\Users\LENOVO\NEWS SENTIMENT"

# Create root package.json
pnpm init

# Create pnpm-workspace.yaml
# Content: packages: ['frontend', 'backend']

# Scaffold Next.js frontend
pnpx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Scaffold backend
mkdir backend
cd backend
pnpm init
pnpm add express cors helmet morgan dotenv node-cache uuid slugify axios rss-parser express-rate-limit
pnpm add -D nodemon
cd ..

# Install frontend extras
cd frontend
pnpm add recharts date-fns lucide-react
cd ..

# Verify workspace
pnpm -r list --depth=0
```

##### Step 1.2 — Backend: Express Server (`backend/src/server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const newsRoutes = require('./routes/news');
const analyticsRoutes = require('./routes/analytics');
const sentimentRoutes = require('./routes/sentiment');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), sources: ['rss', 'newsdata', 'newsapi'] });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Smart News Reader API running on port ${PORT}`);
  console.log(`📰 Sources: Nigerian RSS + NewsData.io + NewsAPI.org`);
});
```

##### Step 1.3 — Backend: RSS Service (`backend/src/services/rssService.js`)

```javascript
const Parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'SmartNewsReader/1.0' }
});

const NIGERIAN_FEEDS = [
  { name: 'Punch Nigeria', url: 'https://rss.punchng.com/v1/category/latest_news', id: 'punch-ng' },
  { name: 'Vanguard News', url: 'https://www.vanguardngr.com/feed/', id: 'vanguard-ng' },
  { name: 'Premium Times', url: 'https://www.premiumtimesng.com/feed', id: 'premium-times' },
  { name: 'Channels TV', url: 'https://www.channelstv.com/feed/', id: 'channels-tv' }
];

async function fetchNigerianNews() {
  const results = [];

  for (const feed of NIGERIAN_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const articles = parsed.items.map(item => normalizeRSSArticle(item, feed));
      results.push(...articles);
    } catch (error) {
      console.error(`❌ Failed to fetch ${feed.name}: ${error.message}`);
    }
  }

  return results;
}

function normalizeRSSArticle(item, feed) {
  return {
    id: uuidv4(),
    slug: slugify(item.title || '', { lower: true, strict: true }).slice(0, 80),
    title: item.title || 'Untitled',
    description: (item.contentSnippet || item.content || '').slice(0, 200),
    content: item.content || item.contentSnippet || '',
    source: { id: feed.id, name: feed.name },
    author: item.creator || item.author || null,
    url: item.link || '',
    imageUrl: extractImage(item) || null,
    publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    category: mapRSSCategory(item.categories),
    region: 'nigeria',          // All RSS articles are Nigerian
    sourceType: 'rss',
    sentiment: null,            // Will be computed later
    readingTime: null,
    isFeatured: false,
    clickCount: 0,
    createdAt: new Date().toISOString()
  };
}

function extractImage(item) {
  // Try enclosure (common in RSS)
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  // Try media:content
  if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
  // Try to extract from content HTML
  const imgMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

function mapRSSCategory(categories) {
  if (!categories || categories.length === 0) return 'nigeria';

  const cat = (categories[0] || '').toLowerCase();
  const mapping = {
    politics: 'politics', political: 'politics', government: 'politics',
    sport: 'sports', sports: 'sports', football: 'sports',
    business: 'business', economy: 'business', finance: 'business',
    tech: 'technology', technology: 'technology', science: 'science',
    entertainment: 'entertainment', celebrity: 'entertainment', lifestyle: 'entertainment',
    health: 'health', medical: 'health',
    world: 'world', international: 'world', global: 'world',
    education: 'nigeria', news: 'nigeria', national: 'nigeria'
  };

  return mapping[cat] || 'nigeria';
}

module.exports = { fetchNigerianNews, NIGERIAN_FEEDS };
```

##### Step 1.4 — Backend: NewsData.io Service (`backend/src/services/newsDataService.js`)

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const BASE_URL = 'https://newsdata.io/api/1';

async function fetchFromNewsData(options = {}) {
  const {
    country = 'ng,us,gb',
    category = null,
    language = 'en',
    query = null
  } = options;

  try {
    const params = {
      apikey: process.env.NEWSDATA_API_KEY,
      country,
      language
    };

    if (category) params.category = category;
    if (query) params.q = query;

    const response = await axios.get(`${BASE_URL}/news`, { params, timeout: 10000 });

    if (response.data.status === 'success') {
      return (response.data.results || []).map(normalizeNewsDataArticle);
    }

    return [];
  } catch (error) {
    console.error(`❌ NewsData.io fetch failed: ${error.message}`);
    return [];
  }
}

function normalizeNewsDataArticle(article) {
  const country = (article.country || []);
  const isNigerian = country.includes('nigeria') || country.includes('ng');

  return {
    id: uuidv4(),
    slug: slugify(article.title || '', { lower: true, strict: true }).slice(0, 80),
    title: article.title || 'Untitled',
    description: (article.description || '').slice(0, 200),
    content: article.content || article.description || '',
    source: {
      id: (article.source_id || 'newsdata').toLowerCase(),
      name: article.source_name || article.source_id || 'NewsData'
    },
    author: article.creator ? article.creator[0] : null,
    url: article.link || '',
    imageUrl: article.image_url || null,
    publishedAt: article.pubDate || new Date().toISOString(),
    category: mapNewsDataCategory(article.category),
    region: isNigerian ? 'nigeria' : 'world',
    sourceType: 'newsdata',
    sentiment: null,
    readingTime: null,
    isFeatured: false,
    clickCount: 0,
    createdAt: new Date().toISOString()
  };
}

function mapNewsDataCategory(categories) {
  if (!categories || categories.length === 0) return 'world';

  const cat = categories[0].toLowerCase();
  const mapping = {
    business: 'business',
    entertainment: 'entertainment',
    environment: 'science',
    food: 'health',
    health: 'health',
    politics: 'politics',
    science: 'science',
    sports: 'sports',
    technology: 'technology',
    top: 'world',
    world: 'world'
  };

  return mapping[cat] || 'world';
}

module.exports = { fetchFromNewsData };
```

#### Afternoon Session (4–6 hours)

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 13:00  | Backend: News aggregator service        | Unified multi-source fetcher         |
| 14:00  | Backend: Cache service + news route     | `/api/news` endpoint working         |
| 15:00  | Frontend: Homepage scaffolding          | Next.js page with API fetch          |
| 16:00  | Frontend: NewsCard component            | Styled article cards (Tailwind)      |
| 17:00  | Frontend: News feed grid + source badges| Complete feed with 🇳🇬/🌍 indicators  |
| 18:00  | Day 1 review + commit                   | Working news feed from all sources   |

##### Step 1.5 — Backend: News Aggregator (`backend/src/services/newsService.js`)

```javascript
const { fetchNigerianNews } = require('./rssService');
const { fetchFromNewsData } = require('./newsDataService');
const { deduplicateArticles } = require('./deduplicatorService');
const { analyzeSentiment } = require('./sentimentService');
const cache = require('./cacheService');

async function getNews(options = {}) {
  const { category, sentiment, region, page = 1, pageSize = 20 } = options;
  const cacheKey = `news:${category || 'all'}:${sentiment || 'all'}:${region || 'all'}:${page}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, meta: { cached: true, cacheAge: cache.getTtl(cacheKey) } };

  // Fetch from all sources
  const [nigerianArticles, worldArticles] = await Promise.all([
    fetchNigerianNews(),
    fetchFromNewsData({ country: 'ng,us,gb' })
  ]);

  // Merge and deduplicate
  let allArticles = deduplicateArticles([...nigerianArticles, ...worldArticles]);

  // Analyze sentiment for each article
  allArticles = allArticles.map(article => ({
    ...article,
    sentiment: analyzeSentiment(article.title + ' ' + article.description),
    readingTime: Math.max(1, Math.ceil((article.content || '').split(/\s+/).length / 200))
  }));

  // Sort by date (newest first), featured articles on top
  allArticles.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  // Apply filters
  let filtered = allArticles;
  if (category && category !== 'all') {
    filtered = filtered.filter(a => a.category === category);
  }
  if (sentiment && sentiment !== 'all') {
    filtered = filtered.filter(a => a.sentiment?.label === sentiment);
  }
  if (region && region !== 'all') {
    filtered = filtered.filter(a => a.region === region);
  }

  // Paginate
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const result = {
    articles: paged,
    pagination: {
      currentPage: page,
      pageSize,
      totalArticles: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      hasNext: start + pageSize < filtered.length,
      hasPrev: page > 1
    },
    filters: { activeCategory: category || 'all', activeSentiment: sentiment || 'all', activeRegion: region || 'all' },
    sources: {
      nigerian: nigerianArticles.length,
      world: worldArticles.filter(a => a.region === 'world').length,
      total: allArticles.length
    }
  };

  // Cache for 10 minutes
  cache.set(cacheKey, result, 600);

  return { ...result, meta: { cached: false, lastFetched: new Date().toISOString() } };
}

module.exports = { getNews };
```

##### Step 1.6 — Backend: Deduplicator (`backend/src/services/deduplicatorService.js`)

```javascript
function deduplicateArticles(articles) {
  const seen = new Map();

  return articles.filter(article => {
    // Normalize title for comparison
    const normalizedTitle = (article.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Skip very short titles
    if (normalizedTitle.length < 10) return true;

    // Check similarity with existing titles
    for (const [existingTitle, existingArticle] of seen) {
      if (similarity(normalizedTitle, existingTitle) > 0.8) {
        // Keep the one with more content
        if ((article.content || '').length > (existingArticle.content || '').length) {
          seen.delete(existingTitle);
          seen.set(normalizedTitle, article);
        }
        return false;
      }
    }

    seen.set(normalizedTitle, article);
    return true;
  });
}

// Simple Jaccard similarity on word sets
function similarity(a, b) {
  const setA = new Set(a.split(' '));
  const setB = new Set(b.split(' '));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

module.exports = { deduplicateArticles };
```

#### Day 1 Deliverables Checklist

```
✅ pnpm workspace initialized (frontend + backend)
✅ Express server running on port 5000
✅ RSS parser fetching from 4 Nigerian outlets
✅ NewsData.io integration fetching world + Nigeria news
✅ Article normalizer producing unified schema
✅ Deduplication service removing duplicates
✅ Cache layer with 10-min TTL
✅ /api/news endpoint returning enriched articles
✅ Next.js homepage rendering styled article cards
✅ Source badges: 🇳🇬 (Nigeria) and 🌍 (World) on each card
✅ Mobile + desktop responsive grid layout
✅ Git commit: "Day 1: Multi-source news feed (Nigeria + World)"
```

---

### DAY 2: Sentiment Engine — Analysis + Visual Badges

**Goal**: Build the sentiment analysis module and display colored badges on every card.

**Duration**: 8 hours

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 09:00  | Sentiment word dictionaries (120+ words)| `positiveWords.js`, `negativeWords.js` |
| 09:45  | Sentiment phrase dictionaries (40+ phrases) | `positivePhrases.js`, `negativePhrases.js` |
| 10:15  | Nigeria-specific keywords               | `nigerianKeywords.js` (naira, NNPC, etc.) |
| 10:45  | Sentiment scoring algorithm             | `sentimentService.js` with scoring logic |
| 12:00  | Test endpoint (`/api/sentiment`)        | POST text → get sentiment response   |
| 13:00  | Frontend: SentimentBadge component      | Colored circles with labels          |
| 14:00  | Frontend: CategoryBadge component       | Topic tags with icons                |
| 15:00  | Frontend: SourceBadge component         | 🇳🇬 Nigeria / 🌍 World indicators    |
| 16:00  | Integrate badges onto NewsCard          | Every card shows all 3 badge types   |
| 17:00  | Visual polish + edge cases              | Empty content, missing data handling |
| 18:00  | Day 2 review + commit                   | Sentiment badges on all articles     |

##### Step 2.1 — Nigeria-Specific Keywords (`backend/src/data/nigerianKeywords.js`)

```javascript
// Nigeria-specific positive keywords
const NIGERIAN_POSITIVE = [
  'naira appreciation', 'naira rally', 'nse gains', 'nse rally',
  'gdp growth', 'afcon victory', 'super eagles win', 'green white green',
  'nnpc profit', 'dangote', 'aliko dangote', 'tinubu reform',
  'lagos development', 'abuja growth', 'fdi inflow',
  'oil production increase', 'agric boom', 'tech hub',
  'silicone lagoon', 'afrobeats', 'nollywood', 'made in nigeria'
];

// Nigeria-specific negative keywords
const NIGERIAN_NEGATIVE = [
  'naira crash', 'naira devaluation', 'naira losses',
  'fuel scarcity', 'fuel subsidy removal', 'petrol price hike',
  'boko haram', 'bandits', 'kidnapping', 'insecurity',
  'efcc arrest', 'corruption scandal', 'power outage', 'nepa',
  'asuu strike', 'nasu strike', 'unemployment', 'japa',
  'brain drain', 'inflation rate', 'food prices', 'hardship',
  'oil theft', 'pipeline vandalism', 'herders clash'
];

module.exports = { NIGERIAN_POSITIVE, NIGERIAN_NEGATIVE };
```

#### Day 2 Deliverables Checklist

```
✅ Positive word dictionary (60+ general + 20+ Nigerian terms)
✅ Negative word dictionary (60+ general + 20+ Nigerian terms)
✅ Positive phrase dictionary (20+ phrases)
✅ Negative phrase dictionary (20+ phrases)
✅ Nigeria-specific keyword dictionaries
✅ Scoring algorithm with weighted analysis
✅ Confidence level classification (high/medium/low)
✅ /api/sentiment test endpoint working
✅ SentimentBadge component (🟢🔴⚪ with text)
✅ CategoryBadge component with topic icons
✅ SourceBadge component (🇳🇬 / 🌍)
✅ All badges integrated on NewsCard
✅ Git commit: "Day 2: Sentiment engine + visual badges"
```

---

### DAY 3: Filtering & Article Detail

**Goal**: Add smart filter chips with combined logic and build the article detail page.

**Duration**: 8 hours

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 09:00  | Frontend: FilterChips component         | Category + sentiment + region chips  |
| 10:00  | Frontend: Combined filter logic         | React state managing all 3 filters   |
| 11:00  | Frontend: Region toggle (🇳🇬 / 🌍 / All) | Nigeria/World/All filter             |
| 12:00  | Frontend: Instant filter updates        | No page reload on filter change      |
| 13:00  | Frontend: Article detail page layout    | `/[slug]` page with full content     |
| 14:30  | Frontend: Reading time + share button   | Metadata section on article page     |
| 15:30  | Frontend: Sentiment details display     | Transparent scoring breakdown        |
| 16:30  | Frontend: Similar articles section      | 3–5 related articles below content   |
| 17:30  | Frontend: Empty states + loading        | "No articles" message, skeletons     |
| 18:00  | Day 3 review + commit                   | Full filter + detail functionality   |

##### Unique Feature: Region Filter

The region toggle is unique to this project — users can switch between:

```
┌──────────────────────────────────────────────────────────┐
│  REGION:                                                 │
│  [ 🌐 All ] [ 🇳🇬 Nigeria ] [ 🌍 World ]                │
│                                                          │
│  CATEGORIES:                                             │
│  [ All ] [ Politics ] [ Tech ] [ Sports ] [ Business ]  │
│  [ Entertainment ] [ Health ] [ World ] [ Science ]      │
│                                                          │
│  SENTIMENT:                                              │
│  [ 🟢 Positive ] [ ⚪ Neutral ] [ 🔴 Negative ]          │
└──────────────────────────────────────────────────────────┘
```

This gives users **3-dimensional filtering**: Region × Category × Sentiment.

Example combinations:
- 🇳🇬 Nigeria + Politics + Negative = "Bad political news from Nigeria"
- 🌍 World + Technology + Positive = "Good tech news globally"
- 🌐 All + Sports + Positive = "Good sports news from everywhere"

#### Day 3 Deliverables Checklist

```
✅ FilterChips component with 3 filter rows
✅ Region toggle: 🇳🇬 Nigeria / 🌍 World / 🌐 All
✅ Category filter chips working
✅ Sentiment filter chips working
✅ Combined 3-way filter logic (region × category × sentiment)
✅ Instant feed updates (< 200ms, no reload)
✅ Active filter state visually highlighted
✅ "Reset All" clears all filters
✅ Article detail page (/[slug]) with full content
✅ Reading time, share button, sentiment breakdown
✅ Similar articles section (same category + sentiment)
✅ Empty states and loading skeletons
✅ Git commit: "Day 3: Smart filters + article detail"
```

---

### DAY 4: Analytics Dashboard

**Goal**: Build the analytics dashboard with charts showing Nigeria vs World sentiment distribution.

**Duration**: 8 hours

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 09:00  | Backend: Analytics service              | Compute aggregated stats             |
| 10:00  | Backend: /api/analytics endpoint        | Return sentiment + category + source data |
| 11:00  | Frontend: Dashboard page layout          | 2×2 grid of chart cards             |
| 12:00  | Frontend: Sentiment pie chart (Recharts) | Donut chart with % breakdown        |
| 13:00  | Frontend: Category bar chart            | Horizontal bars sorted by count      |
| 14:00  | Frontend: Source breakdown chart         | Nigeria vs World article distribution |
| 15:00  | Frontend: Most-read articles list       | Top 10 by click count               |
| 16:00  | Frontend: Trending keywords             | Frequent words across all articles   |
| 17:00  | Frontend: Dashboard responsive design   | Mobile stack, desktop grid           |
| 18:00  | Day 4 review + commit                   | Complete analytics dashboard         |

##### Unique Chart: Nigeria vs World Sentiment Comparison

```
┌──────────────────────────────────────────────────────────┐
│  SENTIMENT BY REGION                                     │
│                                                          │
│           Nigeria 🇳🇬         World 🌍                    │
│                                                          │
│  Positive  ████████ 22%     ████████████ 35%             │
│  Neutral   ████████████ 45% ████████████████ 50%         │
│  Negative  ████████████ 33% ██████ 15%                   │
│                                                          │
│  "Nigerian news skews 2× more negative than world news"  │
└──────────────────────────────────────────────────────────┘
```

#### Day 4 Deliverables Checklist

```
✅ Analytics service computing all aggregations
✅ /api/analytics endpoint returning full stats
✅ Sentiment pie/donut chart (Recharts)
✅ Category bar chart with article counts
✅ Nigeria vs World sentiment comparison chart
✅ Most-read articles list (top 10)
✅ Trending keywords display
✅ Dashboard responsive layout
✅ Chart tooltips and interactivity
✅ Git commit: "Day 4: Analytics dashboard with regional insights"
```

---

### DAY 5: Admin Panel + Deployment

**Goal**: Build admin panel, deploy to production, and prepare demo.

**Duration**: 8–10 hours

| Time   | Task                                    | Deliverable                          |
|--------|-----------------------------------------|--------------------------------------|
| 09:00  | Backend: Admin auth middleware          | Basic auth for admin routes          |
| 09:30  | Backend: Sentiment override endpoint    | PUT /api/admin/articles/:id/sentiment |
| 10:00  | Backend: Featured article endpoint      | PUT /api/admin/articles/:id/featured |
| 10:30  | Frontend: Admin login flow              | Basic auth prompt                    |
| 11:00  | Frontend: Admin article table           | Sortable, searchable article list    |
| 12:00  | Frontend: Sentiment override modal      | Dropdown + reason input              |
| 13:00  | Frontend: Featured toggle               | Pin/unpin button on each row         |
| 14:00  | Deploy: Backend to Render               | API live on Render URL               |
| 15:00  | Deploy: Frontend to Vercel              | App live on Vercel URL               |
| 16:00  | Environment variables on Vercel/Render  | All env vars configured              |
| 17:00  | End-to-end testing on production        | All flows working on live URLs       |
| 18:00  | Demo rehearsal + final commit           | Production-ready, demo-ready         |

#### Day 5 Deliverables Checklist

```
✅ Admin authentication (basic auth)
✅ Sentiment override working (saves + reflects in feed)
✅ Featured article toggle working
✅ Admin table with search/sort
✅ Backend deployed to Render (live URL)
✅ Frontend deployed to Vercel (live URL)
✅ All environment variables configured in production
✅ CORS configured for production domain
✅ End-to-end test on production
✅ Demo script rehearsed
✅ Git commit: "Day 5: Admin panel + production deployment"
✅ Git tag: v1.0.0
```

---

## 5. Backend Implementation

### 5.1 Route Definitions

```javascript
// backend/src/routes/news.js

const express = require('express');
const router = express.Router();
const { getNews } = require('../services/newsService');

// GET /api/news — Fetch news feed
// Query: ?category=tech&sentiment=positive&region=nigeria&page=1&pageSize=20
router.get('/', async (req, res, next) => {
  try {
    const { category, sentiment, region, page, pageSize } = req.query;
    const result = await getNews({
      category,
      sentiment,
      region,
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20
    });
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/news/:id — Fetch single article
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getArticleById(id);
    if (!result) return res.status(404).json({ status: 'error', message: 'Article not found' });
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### 5.2 Updated API Endpoints (Nigeria-aware)

| Method | Endpoint                          | Query Params                                | Description               |
|--------|-----------------------------------|---------------------------------------------|---------------------------|
| GET    | `/api/news`                       | `category`, `sentiment`, `region`, `page`, `pageSize` | Fetch news feed     |
| GET    | `/api/news/:id`                   | —                                           | Single article + similar  |
| GET    | `/api/analytics`                  | `region` (optional: `nigeria`, `world`, `all`) | Analytics stats        |
| POST   | `/api/sentiment`                  | Body: `{ "text": "..." }`                   | Test sentiment analysis   |
| PUT    | `/api/admin/articles/:id/sentiment` | Auth required; Body: `{ "sentiment": "positive", "reason": "..." }` | Override sentiment |
| PUT    | `/api/admin/articles/:id/featured` | Auth required; Body: `{ "isFeatured": true }` | Toggle featured       |
| GET    | `/api/admin/categories`           | Auth required                               | List categories           |
| GET    | `/api/health`                     | —                                           | Health check + source status |

### 5.3 Cache Strategy (Updated for Multi-Source)

```javascript
// backend/src/services/cacheService.js

const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 600,          // Default: 10 minutes
  checkperiod: 120,     // Check for expired keys every 2 min
  useClones: false      // Better performance
});

// Cache key strategy
const CACHE_KEYS = {
  // RSS feeds refresh more often (Nigerian news is primary)
  rss: (source) => `rss:${source}`,          // TTL: 600s (10 min)

  // API feeds refresh less often (conserve rate limits)
  newsdata: (query) => `newsdata:${query}`,   // TTL: 900s (15 min)
  newsapi: (query) => `newsapi:${query}`,     // TTL: 1800s (30 min)

  // Combined feed (after aggregation)
  feed: (filters) => `feed:${JSON.stringify(filters)}`, // TTL: 600s

  // Analytics
  analytics: (region) => `analytics:${region}`, // TTL: 600s

  // Admin overrides (persist until restart)
  overrides: 'admin:overrides',               // TTL: 0 (no expiry)
  featured: 'admin:featured'                  // TTL: 0 (no expiry)
};

module.exports = cache;
module.exports.CACHE_KEYS = CACHE_KEYS;
```

---

## 6. Frontend Implementation

### 6.1 TypeScript Types (`frontend/src/types/index.ts`)

```typescript
export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  source: {
    id: string;
    name: string;
  };
  author: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  category: Category;
  region: Region;
  sourceType: 'rss' | 'newsdata' | 'newsapi';
  sentiment: Sentiment | null;
  readingTime: number;
  isFeatured: boolean;
  clickCount: number;
}

export interface Sentiment {
  label: SentimentLabel;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  details?: {
    positiveWords: string[];
    negativeWords: string[];
    positiveCount: number;
    negativeCount: number;
    totalWords: number;
  };
  isOverridden?: boolean;
}

export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type Region = 'nigeria' | 'world';
export type Category =
  | 'politics'
  | 'technology'
  | 'sports'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'world'
  | 'nigeria';

export interface FilterState {
  category: Category | 'all';
  sentiment: SentimentLabel | 'all';
  region: Region | 'all';
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AnalyticsData {
  sentimentBreakdown: Record<SentimentLabel, { count: number; percentage: number }>;
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  regionBreakdown: {
    nigeria: Record<SentimentLabel, { count: number; percentage: number }>;
    world: Record<SentimentLabel, { count: number; percentage: number }>;
  };
  mostRead: Article[];
  trendingKeywords: { keyword: string; frequency: number }[];
  totalArticles: number;
  lastUpdated: string;
}
```

### 6.2 Key Component: NewsCard with Region Badge

```tsx
// frontend/src/components/ui/NewsCard.tsx

'use client';

import { Article } from '@/types';
import { SentimentBadge } from './SentimentBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const regionFlag = article.region === 'nigeria' ? '🇳🇬' : '🌍';
  const regionLabel = article.region === 'nigeria' ? 'Nigeria' : 'World';

  return (
    <Link href={`/${article.slug}`}>
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Image */}
        {article.imageUrl && (
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 bg-gray-50 rounded-full">
              {regionFlag} {regionLabel}
            </span>
            <CategoryBadge category={article.category} />
            {article.sentiment && <SentimentBadge sentiment={article.sentiment} />}
          </div>

          {/* Headline */}
          <h2 className="font-semibold text-gray-900 leading-tight line-clamp-2">
            {article.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {article.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <span>{article.source.name}</span>
            <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

### 6.3 Key Component: Filter Chips with Region Toggle

```tsx
// frontend/src/components/ui/FilterChips.tsx

'use client';

import { FilterState, Category, SentimentLabel, Region } from '@/types';

interface FilterChipsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const REGIONS: { value: Region | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🌐' },
  { value: 'nigeria', label: 'Nigeria', icon: '🇳🇬' },
  { value: 'world', label: 'World', icon: '🌍' },
];

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Topics' },
  { value: 'politics', label: 'Politics' },
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'world', label: 'World' },
  { value: 'science', label: 'Science' },
  { value: 'nigeria', label: 'Nigeria' },
];

const SENTIMENTS: { value: SentimentLabel | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All Moods', color: 'bg-gray-100 text-gray-700' },
  { value: 'positive', label: '🟢 Positive', color: 'bg-green-100 text-green-700' },
  { value: 'neutral', label: '⚪ Neutral', color: 'bg-gray-100 text-gray-700' },
  { value: 'negative', label: '🔴 Negative', color: 'bg-red-100 text-red-700' },
];

export function FilterChips({ filters, onFilterChange }: FilterChipsProps) {
  return (
    <div className="space-y-3">
      {/* Region Toggle */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide shrink-0">Region:</span>
        {REGIONS.map(r => (
          <button
            key={r.value}
            onClick={() => onFilterChange({ ...filters, region: r.value })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.region === r.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r.icon} {r.label}
          </button>
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide shrink-0">Topic:</span>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => onFilterChange({ ...filters, category: c.value })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.category === c.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sentiment Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide shrink-0">Mood:</span>
        {SENTIMENTS.map(s => (
          <button
            key={s.value}
            onClick={() => onFilterChange({ ...filters, sentiment: s.value })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.sentiment === s.value
                ? 'bg-purple-600 text-white shadow-sm'
                : s.color + ' hover:opacity-80'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. Sentiment Engine Implementation

### 7.1 Complete Algorithm (Nigeria-Aware)

```javascript
// backend/src/services/sentimentService.js

const { POSITIVE_WORDS } = require('../data/positiveWords');
const { NEGATIVE_WORDS } = require('../data/negativeWords');
const { POSITIVE_PHRASES } = require('../data/positivePhrases');
const { NEGATIVE_PHRASES } = require('../data/negativePhrases');
const { NIGERIAN_POSITIVE, NIGERIAN_NEGATIVE } = require('../data/nigerianKeywords');

function analyzeSentiment(text) {
  if (!text || text.trim().length === 0) {
    return { label: 'neutral', score: 0, confidence: 'low', details: null };
  }

  const normalizedText = text.toLowerCase().replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalizedText.split(' ');

  let score = 0;
  const positiveFound = [];
  const negativeFound = [];

  // STEP 1: Nigerian phrase matching (weight: 5)
  [...NIGERIAN_POSITIVE].forEach(phrase => {
    if (normalizedText.includes(phrase.toLowerCase())) {
      score += 5;
      positiveFound.push(phrase);
    }
  });

  [...NIGERIAN_NEGATIVE].forEach(phrase => {
    if (normalizedText.includes(phrase.toLowerCase())) {
      score -= 5;
      negativeFound.push(phrase);
    }
  });

  // STEP 2: General phrase matching (weight: 4)
  POSITIVE_PHRASES.forEach(phrase => {
    if (normalizedText.includes(phrase.toLowerCase())) {
      score += 4;
      positiveFound.push(phrase);
    }
  });

  NEGATIVE_PHRASES.forEach(phrase => {
    if (normalizedText.includes(phrase.toLowerCase())) {
      score -= 4;
      negativeFound.push(phrase);
    }
  });

  // STEP 3: Single word matching (weight: 2)
  POSITIVE_WORDS.forEach(word => {
    if (words.includes(word.toLowerCase())) {
      score += 2;
      positiveFound.push(word);
    }
  });

  NEGATIVE_WORDS.forEach(word => {
    if (words.includes(word.toLowerCase())) {
      score -= 2;
      negativeFound.push(word);
    }
  });

  // STEP 4: Classification
  let label, confidence;

  if (score > 4) { label = 'positive'; confidence = 'high'; }
  else if (score > 1) { label = 'positive'; confidence = 'medium'; }
  else if (score >= -1) { label = 'neutral'; confidence = score === 0 ? 'medium' : 'low'; }
  else if (score > -4) { label = 'negative'; confidence = 'medium'; }
  else { label = 'negative'; confidence = 'high'; }

  return {
    label,
    score,
    confidence,
    details: {
      positiveWords: [...new Set(positiveFound)],
      negativeWords: [...new Set(negativeFound)],
      positiveCount: positiveFound.length,
      negativeCount: negativeFound.length,
      totalWords: words.length
    }
  };
}

module.exports = { analyzeSentiment };
```

---

## 8. Analytics & Admin Implementation

### 8.1 Analytics Service (Nigeria vs World Breakdown)

```javascript
// backend/src/services/analyticsService.js

function computeAnalytics(articles) {
  const total = articles.length;

  // Overall sentiment breakdown
  const sentimentBreakdown = {
    positive: { count: 0, percentage: 0 },
    neutral: { count: 0, percentage: 0 },
    negative: { count: 0, percentage: 0 }
  };

  // Regional sentiment breakdown
  const regionBreakdown = {
    nigeria: { positive: { count: 0, percentage: 0 }, neutral: { count: 0, percentage: 0 }, negative: { count: 0, percentage: 0 } },
    world: { positive: { count: 0, percentage: 0 }, neutral: { count: 0, percentage: 0 }, negative: { count: 0, percentage: 0 } }
  };

  // Category breakdown
  const categoryCounts = {};

  // Keyword frequency
  const wordFreq = {};
  const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'with', 'by', 'from', 'that', 'this', 'it', 'as', 'be', 'has', 'had', 'have', 'not', 'will', 'would', 'can', 'could', 'should']);

  articles.forEach(article => {
    const label = article.sentiment?.label || 'neutral';
    const region = article.region || 'world';

    // Sentiment counts
    sentimentBreakdown[label].count++;
    regionBreakdown[region][label].count++;

    // Category counts
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;

    // Word frequency (from title)
    (article.title || '').toLowerCase().split(/\s+/).forEach(word => {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean.length > 3 && !STOP_WORDS.has(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });
  });

  // Calculate percentages
  Object.keys(sentimentBreakdown).forEach(key => {
    sentimentBreakdown[key].percentage = total > 0 ? parseFloat(((sentimentBreakdown[key].count / total) * 100).toFixed(1)) : 0;
  });

  ['nigeria', 'world'].forEach(region => {
    const regionTotal = Object.values(regionBreakdown[region]).reduce((sum, v) => sum + v.count, 0);
    Object.keys(regionBreakdown[region]).forEach(key => {
      regionBreakdown[region][key].percentage = regionTotal > 0
        ? parseFloat(((regionBreakdown[region][key].count / regionTotal) * 100).toFixed(1))
        : 0;
    });
  });

  // Format category breakdown
  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: parseFloat(((count / total) * 100).toFixed(1))
    }))
    .sort((a, b) => b.count - a.count);

  // Top 10 most-read articles
  const mostRead = [...articles]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 10);

  // Top 20 trending keywords
  const trendingKeywords = Object.entries(wordFreq)
    .map(([keyword, frequency]) => ({ keyword, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20);

  return {
    sentimentBreakdown,
    categoryBreakdown,
    regionBreakdown,
    mostRead,
    trendingKeywords,
    totalArticles: total,
    sources: {
      nigerian: articles.filter(a => a.region === 'nigeria').length,
      world: articles.filter(a => a.region === 'world').length
    },
    lastUpdated: new Date().toISOString()
  };
}

module.exports = { computeAnalytics };
```

---

## 9. Deployment Pipeline

### 9.1 Backend → Render

```
┌──────────────────────────────────────────────────────┐
│  RENDER DEPLOYMENT                                    │
│                                                      │
│  Service type:     Web Service                       │
│  Environment:      Node                              │
│  Region:           Oregon (US West) or Frankfurt (EU)│
│  Branch:           main                              │
│  Root Directory:   backend                           │
│  Build Command:    pnpm install                      │
│  Start Command:    node src/server.js                │
│  Plan:             Free (750 hrs/month)              │
│                                                      │
│  Environment Variables:                              │
│  ├── PORT=5000                                       │
│  ├── NODE_ENV=production                             │
│  ├── NEWSDATA_API_KEY=xxx                            │
│  ├── NEWS_API_KEY=xxx                                │
│  ├── MEDIASTACK_API_KEY=xxx                          │
│  ├── ADMIN_USERNAME=admin                            │
│  ├── ADMIN_PASSWORD=xxx                              │
│  ├── ALLOWED_ORIGINS=https://your-app.vercel.app     │
│  └── CACHE_TTL=600                                   │
└──────────────────────────────────────────────────────┘
```

**Render-specific setup**:

```powershell
# backend/render.yaml (Blueprint)
# Not required but useful for infrastructure-as-code

# Alternatively, set up via Render Dashboard:
# 1. Connect GitHub repo
# 2. Set root directory to "backend"
# 3. Build: pnpm install
# 4. Start: node src/server.js
# 5. Add all env vars
```

**Cold start mitigation**: Render free tier sleeps after 15 min of inactivity. Options:
- Use a free cron service (cron-job.org) to ping `/api/health` every 14 min
- Accept cold starts (30s) with a loading skeleton on frontend
- Upgrade to Render Starter ($7/mo) for always-on

### 9.2 Frontend → Vercel

```
┌──────────────────────────────────────────────────────┐
│  VERCEL DEPLOYMENT                                    │
│                                                      │
│  Framework:        Next.js                           │
│  Root Directory:   frontend                          │
│  Build Command:    pnpm run build (auto-detected)    │
│  Output Directory: .next (auto-detected)             │
│  Install Command:  pnpm install                      │
│  Node.js Version:  20.x                              │
│  Plan:             Hobby (free)                      │
│                                                      │
│  Environment Variables:                              │
│  ├── NEXT_PUBLIC_API_URL=https://your-api.onrender.com│
│  └── NEXT_PUBLIC_APP_NAME=Smart News Reader 🇳🇬       │
└──────────────────────────────────────────────────────┘
```

**Vercel-specific setup**:

```powershell
# Install Vercel CLI
pnpm add -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to project
# - Set root directory: frontend
# - Framework: Next.js (auto-detected)
# - Override build: No
```

### 9.3 Deployment Commands (pnpm)

```powershell
# Full project build
cd "C:\Users\LENOVO\NEWS SENTIMENT"

# Build both packages
pnpm run build

# Or individually
pnpm run build:frontend

# Deploy backend
cd backend
# Push to GitHub → Render auto-deploys from main branch

# Deploy frontend
cd ../frontend
vercel --prod
```

### 9.4 CI/CD Flow

```
Developer pushes to GitHub
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│  Vercel detects  │     │  Render detects   │
│  frontend changes│     │  backend changes  │
│                  │     │                   │
│  pnpm install    │     │  pnpm install     │
│  pnpm run build  │     │  node src/server  │
│                  │     │                   │
│  Deploy to Edge  │     │  Deploy to OR/EU  │
└──────────────────┘     └──────────────────┘
         │                        │
         ▼                        ▼
   app.vercel.app          api.onrender.com
```

---

## 10. Testing Strategy

### 10.1 Manual Testing Checklist (MVP)

#### News Sources

| # | Test Case                              | Expected Result                         | Pass? |
|---|----------------------------------------|-----------------------------------------|-------|
| 1 | Punch NG RSS feed loads                | Articles from punch.ng in feed          | ☐     |
| 2 | Vanguard RSS feed loads                | Articles from vanguardngr.com in feed   | ☐     |
| 3 | Premium Times RSS loads                | Articles from premiumtimesng.com        | ☐     |
| 4 | Channels TV RSS loads                  | Articles from channelstv.com            | ☐     |
| 5 | NewsData.io API responds               | World + Nigeria API articles in feed    | ☐     |
| 6 | RSS failure doesn't crash server       | Other sources continue working          | ☐     |
| 7 | API rate limit doesn't break feed      | Cached data served when limit hit       | ☐     |
| 8 | Duplicate articles removed             | No identical headlines in feed          | ☐     |

#### Sentiment Analysis

| # | Test Case                              | Expected Result                         | Pass? |
|---|----------------------------------------|-----------------------------------------|-------|
| 9 | Positive article detected              | 🟢 badge on clearly positive article    | ☐     |
| 10| Negative article detected              | 🔴 badge on clearly negative article    | ☐     |
| 11| Neutral article detected               | ⚪ badge on factual/neutral article     | ☐     |
| 12| Nigeria-specific positive              | "Naira appreciation" → positive         | ☐     |
| 13| Nigeria-specific negative              | "Fuel scarcity" → negative              | ☐     |
| 14| /api/sentiment test endpoint           | POST text → sentiment response          | ☐     |

#### Filtering

| # | Test Case                              | Expected Result                         | Pass? |
|---|----------------------------------------|-----------------------------------------|-------|
| 15| 🇳🇬 Nigeria filter                      | Only Nigerian source articles shown     | ☐     |
| 16| 🌍 World filter                         | Only world/international articles shown | ☐     |
| 17| Category filter (Tech)                 | Only tech articles shown                | ☐     |
| 18| Sentiment filter (Positive)            | Only positive articles shown            | ☐     |
| 19| Combined: 🇳🇬 + Politics + Negative     | Only negative Nigerian politics articles| ☐     |
| 20| Reset all filters                      | Full unfiltered feed returns            | ☐     |
| 21| Empty filter result                    | "No articles match" message shown       | ☐     |

#### Pages

| # | Test Case                              | Expected Result                         | Pass? |
|---|----------------------------------------|-----------------------------------------|-------|
| 22| Homepage loads                         | Articles visible within 3 seconds       | ☐     |
| 23| Article detail page                    | Full content, metadata, badges          | ☐     |
| 24| Analytics dashboard                    | Charts render with data                 | ☐     |
| 25| Admin panel (auth required)            | Login prompt, then table                | ☐     |
| 26| Mobile responsive (375px)              | Single column, no overflow              | ☐     |
| 27| Desktop layout (1280px)                | Grid layout, proper spacing             | ☐     |

### 10.2 API Testing with curl

```powershell
# Health check
curl http://localhost:5000/api/health

# Fetch all news
curl http://localhost:5000/api/news

# Nigerian news only
curl "http://localhost:5000/api/news?region=nigeria"

# World news only
curl "http://localhost:5000/api/news?region=world"

# Nigerian politics
curl "http://localhost:5000/api/news?region=nigeria&category=politics"

# Positive tech news
curl "http://localhost:5000/api/news?category=technology&sentiment=positive"

# Test sentiment
curl -X POST http://localhost:5000/api/sentiment -H "Content-Type: application/json" -d "{\"text\": \"Nigeria records massive GDP growth amid economic reforms\"}"

# Analytics
curl http://localhost:5000/api/analytics

# Admin: override sentiment
curl -X PUT http://localhost:5000/api/admin/articles/ARTICLE_ID/sentiment -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" -H "Content-Type: application/json" -d "{\"sentiment\": \"positive\", \"reason\": \"Corrected\"}"
```

---

## 11. Environment Configuration

### 11.1 Backend `.env`

```env
# ============================================
# Smart News Reader — Backend Environment
# ============================================

# Server
PORT=5000
NODE_ENV=development

# ============================================
# NEWS API KEYS
# ============================================

# NewsData.io (Primary API — 200 credits/day free)
# Register: https://newsdata.io/register
NEWSDATA_API_KEY=your_newsdata_api_key_here

# NewsAPI.org (Backup — 100 req/day free, dev only)
# Register: https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# MediaStack (Emergency — 100 calls/month free)
# Register: https://mediastack.com/signup/free
MEDIASTACK_API_KEY=your_mediastack_key_here

# ============================================
# RSS FEEDS (Nigerian — No API key needed)
# ============================================
# Configured in rssService.js — no env vars needed

# ============================================
# CACHE
# ============================================
CACHE_TTL_RSS=600           # 10 minutes for RSS
CACHE_TTL_API=900           # 15 minutes for APIs
CACHE_CHECK_PERIOD=120      # Check expired keys every 2 min

# ============================================
# ADMIN
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# ============================================
# CORS
# ============================================
ALLOWED_ORIGINS=http://localhost:3000

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX=100              # 100 requests per window
```

### 11.2 Frontend `.env.local`

```env
# ============================================
# Smart News Reader — Frontend Environment
# ============================================

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Smart News Reader 🇳🇬
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered News with Sentiment Analysis — Nigeria & World
```

### 11.3 Root `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
.next/
out/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Lock files (keep pnpm-lock.yaml, ignore others)
package-lock.json
yarn.lock

# Vercel
.vercel

# Cache
.cache/
```

### 11.4 `.nvmrc`

```
20
```

---

## 12. Troubleshooting & Fallbacks

### 12.1 Common Issues

| Issue                              | Cause                           | Solution                                        |
|------------------------------------|---------------------------------|-------------------------------------------------|
| RSS feed returns empty             | Nigerian outlet is down         | Skip failed feed; log warning; serve others     |
| NewsData.io 429 (rate limited)     | Exceeded 200 credits/day        | Serve cached data; increase cache TTL           |
| Render cold start (30s delay)      | Free tier sleep after 15 min    | Add cron ping every 14 min; show loading skeleton |
| CORS error on frontend             | `ALLOWED_ORIGINS` not set       | Set to frontend URL in backend `.env`           |
| Duplicate articles in feed         | Same story from Punch + Vanguard | Deduplicator catches by title similarity        |
| Sentiment all "neutral"            | Short articles with no keywords | Increase dictionary size; lower threshold       |
| Images not loading                 | RSS image extraction failed     | Show placeholder image; handle null `imageUrl` |
| `pnpm: command not found`         | pnpm not installed globally     | Run `npm install -g pnpm`                       |
| Vercel deploy fails                | Wrong root directory            | Set to `frontend` in Vercel dashboard           |
| Render deploy fails                | Missing `pnpm-lock.yaml`        | Run `pnpm install` locally and commit lock file |

### 12.2 Fallback Chain

```
Primary Source (RSS)
    │
    ├── ✅ Working → Use RSS articles (Nigerian news)
    │
    └── ❌ Failed → Log error, continue without that feed
              │
              ▼
Secondary Source (NewsData.io)
    │
    ├── ✅ Working → Use API articles (Nigeria + World)
    │
    └── ❌ Failed (rate limit or error)
              │
              ├── Cache exists? → Serve cached data with "stale" warning
              │
              └── No cache? → Fall to backup
                        │
                        ▼
Backup Source (NewsAPI.org)
    │
    ├── ✅ Working → Use API articles (World only)
    │
    └── ❌ Failed
              │
              ▼
Emergency (MediaStack — 100 calls/month)
    │
    ├── ✅ Working → Use sparingly (country=ng)
    │
    └── ❌ All sources failed → Show error page:
            "Unable to fetch news. Please try again later."
            + Show cached articles if any exist
```

### 12.3 pnpm-Specific Notes

| Scenario                           | Command                                        |
|------------------------------------|------------------------------------------------|
| Install all workspace deps         | `pnpm install` (from root)                     |
| Add dep to frontend                | `pnpm --filter frontend add recharts`          |
| Add dep to backend                 | `pnpm --filter backend add rss-parser`         |
| Add dev dep                        | `pnpm --filter backend add -D nodemon`         |
| Run dev (both)                     | `pnpm run dev` (from root)                     |
| Run dev (frontend only)            | `pnpm run dev:frontend` (from root)            |
| Run dev (backend only)             | `pnpm run dev:backend` (from root)             |
| Build all                          | `pnpm run build` (from root)                   |
| Clean all node_modules             | `pnpm run clean`                               |
| List workspace packages            | `pnpm -r list --depth=0`                       |
| Check outdated deps                | `pnpm -r outdated`                              |
| Update all deps                    | `pnpm -r update`                                |

### 12.4 API Key Registration Links

| Service       | Registration URL                        | Free Tier              |
|---------------|----------------------------------------|------------------------|
| NewsData.io   | https://newsdata.io/register           | 200 credits/day        |
| NewsAPI.org   | https://newsapi.org/register           | 100 req/day (dev only) |
| MediaStack    | https://mediastack.com/signup/free     | 100 calls/month        |

**Register for all three before starting Day 1.** Store keys in `.env` immediately.

---

## Quick Reference: Key Commands

```powershell
# ═══════════════════════════════════════════
# DEVELOPMENT (run these daily)
# ═══════════════════════════════════════════

# Start everything
cd "C:\Users\LENOVO\NEWS SENTIMENT"
pnpm run dev

# Frontend only: http://localhost:3000
pnpm run dev:frontend

# Backend only: http://localhost:5000
pnpm run dev:backend

# Test API
curl http://localhost:5000/api/health
curl http://localhost:5000/api/news?region=nigeria


# ═══════════════════════════════════════════
# DEPLOYMENT (Day 5)
# ═══════════════════════════════════════════

# Build
pnpm run build

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
# Push to GitHub → Render auto-deploys


# ═══════════════════════════════════════════
# TROUBLESHOOTING
# ═══════════════════════════════════════════

# Reset everything
pnpm run clean
pnpm install

# Check workspace
pnpm -r list --depth=0
```

---

*End of Implementation Plan*

*Document Version: 1.0 | Date: February 21, 2026 | Status: Approved for Development*

*© 2026 Smart News Reader — Confidential*
