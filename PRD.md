# Product Requirements Document (PRD)

## Smart News Reader with Sentiment Analysis

| Field              | Detail                                      |
|--------------------|---------------------------------------------|
| **Document Version** | 1.0                                        |
| **Date**             | February 19, 2026                          |
| **Status**           | Draft → Under Review                      |
| **Author**           | Product & Engineering Team                 |
| **Stakeholders**     | Client, Project Lead, Development Team     |
| **Package Manager**  | pnpm (mandatory — do NOT use npm or yarn)   |
| **News Coverage**    | Nigeria (primary) + Worldwide (secondary)   |
| **Confidentiality**  | Confidential — Do Not Distribute Externally |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [Target Users & Personas](#4-target-users--personas)
5. [User Stories & Epics](#5-user-stories--epics)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [API Contracts](#9-api-contracts)
10. [Data Models](#10-data-models)
11. [Sentiment Analysis Algorithm Design](#11-sentiment-analysis-algorithm-design)
12. [Wireframes & UI Descriptions](#12-wireframes--ui-descriptions)
13. [Third-Party Integrations](#13-third-party-integrations)
14. [Success Metrics & KPIs](#14-success-metrics--kpis)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Timeline & Milestones](#16-timeline--milestones)
17. [Assumptions & Constraints](#17-assumptions--constraints)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

**Smart News Reader** is a modern, AI-enhanced news aggregation platform that goes beyond traditional news listing. The platform fetches real-time articles from trusted sources, runs each article through a proprietary **sentiment analysis engine**, and presents users with an intuitive, filterable news feed where every article is tagged with both its **topic category** and **emotional tone** (Positive, Neutral, or Negative).

### Value Proposition

Unlike conventional news aggregators (Google News, Feedly, Flipboard), Smart News Reader enables users to:

- **Assess article sentiment in under 2 seconds** without reading full content
- **Combine filters** (e.g., "Show me only positive tech news") for targeted consumption
- **Visualize media sentiment trends** through an analytics dashboard
- **Manage content** through an admin panel with sentiment override capabilities

This product serves a growing market of news-fatigued consumers who want **informed, emotion-aware news consumption** — particularly relevant for financial analysts tracking market sentiment, content curators managing editorial tone, and everyday readers seeking a healthier relationship with news media.

### Business Impact

| Metric                    | Target           |
|---------------------------|------------------|
| Time to assess article mood | < 2 seconds    |
| Filter response time       | < 200ms         |
| Sentiment classification accuracy | > 75%    |
| Initial page load          | < 2 seconds     |
| Articles processed per session | 50+ per user |

---

## 2. Problem Statement

### The Problem

Modern news consumers face three critical pain points:

1. **Information Overload**: The average internet user is exposed to 10,000+ news articles per day across platforms. There is no quick, visual way to gauge the tone or emotional weight of an article without reading it in full.

2. **No Mood-Aware Filtering**: Existing platforms allow filtering by topic (technology, politics, sports) but not by emotional tone. A user who wants to start their morning with positive news or a financial analyst seeking negative market indicators has no tool to do so.

3. **No Sentiment Analytics**: Media consumers, journalists, and researchers have no accessible, real-time dashboard to see sentiment distribution across news categories — making it impossible to quickly answer questions like: *"Is today's tech coverage mostly positive or negative?"*

### The Opportunity

By combining real-time news aggregation with automated sentiment classification and a modern, filterable UI, Smart News Reader transforms passive news reading into **active, emotion-aware news intelligence**.

### Current Alternatives & Gaps

| Solution           | Category Filter | Sentiment Analysis | Combined Filters | Analytics Dashboard |
|--------------------|:---------------:|:------------------:|:----------------:|:-------------------:|
| Google News        | ✅              | ❌                 | ❌               | ❌                  |
| Feedly             | ✅              | ❌                 | ❌               | ❌                  |
| Apple News         | ✅              | ❌                 | ❌               | ❌                  |
| Twitter/X Trends   | ❌              | Partial            | ❌               | ❌                  |
| **Smart News Reader** | ✅          | ✅                 | ✅               | ✅                  |

---

## 3. Goals & Objectives

### Primary Goals

| ID    | Goal                                      | Success Criteria                                           | Priority |
|-------|-------------------------------------------|------------------------------------------------------------|----------|
| G-01  | Deliver real-time sentiment-tagged news   | Every article displays sentiment badge within 500ms of load | P0       |
| G-02  | Enable combined category + sentiment filtering | Users can apply both filter types simultaneously; results update < 200ms | P0       |
| G-03  | Provide actionable sentiment analytics    | Dashboard loads in < 2s, displays 4+ chart types           | P1       |
| G-04  | Empower admin content management          | Admins can override sentiment, pin articles, manage categories | P1       |
| G-05  | Achieve strong user engagement            | Average session > 3 min, > 5 articles viewed per session   | P2       |

### SMART Objectives

1. **Specific**: Build a web application that aggregates news from NewsAPI.org, classifies each article's sentiment using a custom keyword-based algorithm, and presents results in a filterable feed with analytics.
2. **Measurable**: Achieve > 75% sentiment classification accuracy against manually labeled test set of 200 articles.
3. **Achievable**: Use proven stack (Next.js 14, Express, Tailwind CSS) with a free-tier news API — no ML training or GPU infrastructure required.
4. **Relevant**: Addresses the documented user need for emotion-aware news consumption in an era of information overload.
5. **Time-bound**: MVP delivered within 5 development days; production-ready v1.0 within 2 weeks.

---

## 4. Target Users & Personas

### Persona 1: Alex — The Casual News Reader

| Attribute       | Detail                                                    |
|-----------------|-----------------------------------------------------------|
| **Age**         | 25–40                                                     |
| **Occupation**  | Marketing professional                                    |
| **Tech Level**  | Intermediate (uses apps daily, not a developer)           |
| **Goal**        | Quickly scan news without getting overwhelmed by negativity |
| **Frustration** | "I want to read news but it's always so negative. I wish I could filter for good news easily." |
| **Usage Pattern** | Morning (7–9 AM) and lunch break, mobile + desktop     |
| **Key Feature** | Sentiment filter → "Positive" to start the day with good news |

### Persona 2: Priya — The Financial Analyst

| Attribute       | Detail                                                    |
|-----------------|-----------------------------------------------------------|
| **Age**         | 28–45                                                     |
| **Occupation**  | Financial analyst at a mid-cap investment firm            |
| **Tech Level**  | Advanced (uses Bloomberg Terminal, Excel, APIs)           |
| **Goal**        | Monitor market sentiment across tech and finance news     |
| **Frustration** | "I need to know if today's market news is trending negative before the market opens. I shouldn't have to read 50 articles to figure that out." |
| **Usage Pattern** | Pre-market (6–9 AM), continuous during trading hours     |
| **Key Feature** | Analytics dashboard → sentiment breakdown for Finance category |

### Persona 3: Jordan — The Content Curator

| Attribute       | Detail                                                    |
|-----------------|-----------------------------------------------------------|
| **Age**         | 22–35                                                     |
| **Occupation**  | Social media manager / digital journalist                 |
| **Tech Level**  | Advanced (manages multiple platforms, understands trends) |
| **Goal**        | Find trending, positive stories to share on social media  |
| **Frustration** | "I spend 2 hours every morning reading articles just to find 5 shareable positive stories." |
| **Usage Pattern** | Morning content curation session (8–10 AM), desktop     |
| **Key Feature** | Combined filters → "Positive" + "Tech" to find shareable content fast |

### Persona 4: Sam — The Platform Administrator

| Attribute       | Detail                                                    |
|-----------------|-----------------------------------------------------------|
| **Age**         | 30–50                                                     |
| **Occupation**  | Platform admin / technical lead                           |
| **Tech Level**  | Expert (developer or technical manager)                   |
| **Goal**        | Ensure content quality, correct misclassifications, manage featured content |
| **Frustration** | "The sentiment algorithm isn't perfect. I need a way to manually fix incorrect labels and highlight important articles." |
| **Usage Pattern** | Throughout the day, desktop only                         |
| **Key Feature** | Admin panel → sentiment override + featured article pinning |

---

## 5. User Stories & Epics

### Epic 1: News Feed & Display

| ID     | User Story                                                                                         | Priority | Acceptance Criteria                                                                                   |
|--------|----------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------|
| US-101 | As a **reader**, I want to see a feed of latest news articles so I can stay informed.              | P0       | Homepage displays 20+ articles from NewsAPI.org; each card shows headline, summary, source, and timestamp. |
| US-102 | As a **reader**, I want each article to show a sentiment badge so I can instantly gauge its mood.  | P0       | Every article card displays a colored badge: 🟢 Positive, ⚪ Neutral, 🔴 Negative.                     |
| US-103 | As a **reader**, I want each article to show a category badge so I know the topic area.            | P0       | Each card displays one of: Tech, Politics, Sports, Finance, World, Health, Science, Entertainment.     |
| US-104 | As a **reader**, I want to see relative timestamps so I know how fresh the news is.                | P1       | Timestamps display as "2h ago", "1d ago", etc. using relative time formatting.                        |
| US-105 | As a **reader**, I want the feed to be visually clean and responsive so I can use it on any device. | P1      | UI renders correctly on mobile (375px), tablet (768px), and desktop (1280px+).                        |

### Epic 2: Filtering & Search

| ID     | User Story                                                                                         | Priority | Acceptance Criteria                                                                                   |
|--------|----------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------|
| US-201 | As a **reader**, I want to filter news by category so I can focus on topics I care about.          | P0       | Clicking a category chip (Tech, Politics, etc.) filters the feed; active chip is visually highlighted. |
| US-202 | As a **reader**, I want to filter news by sentiment so I can control the emotional tone.           | P0       | Clicking Positive/Neutral/Negative filters the feed; works independently and with category filter.    |
| US-203 | As a **reader**, I want to combine category + sentiment filters so I can see exactly what I want.  | P0       | Selecting "Tech" + "Positive" shows only positive tech articles; clearing one filter retains the other.|
| US-204 | As a **reader**, I want filters to update the feed instantly without page reload.                  | P0       | Feed updates within 200ms via client-side state management; no full page reload occurs.               |
| US-205 | As a **reader**, I want an "All" button to reset filters and see the complete feed.                | P1       | Clicking "All" clears all active filters and shows the complete unfiltered feed.                      |

### Epic 3: Article Detail

| ID     | User Story                                                                                         | Priority | Acceptance Criteria                                                                                   |
|--------|----------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------|
| US-301 | As a **reader**, I want to click a headline to read the full article content.                      | P0       | Clicking headline navigates to `/[slug]`; page displays full content, source link, and metadata.      |
| US-302 | As a **reader**, I want to see estimated reading time so I know the time commitment.               | P1       | Article detail shows "X min read" calculated at 200 words per minute.                                 |
| US-303 | As a **reader**, I want to copy the article link to share it easily.                               | P1       | "Copy Link" button copies the article URL to clipboard; shows "Copied!" confirmation toast.           |
| US-304 | As a **reader**, I want to see similar articles so I can explore related content.                   | P2       | Article detail shows 3–5 articles with matching category + sentiment below the main content.          |

### Epic 4: Analytics Dashboard

| ID     | User Story                                                                                         | Priority | Acceptance Criteria                                                                                   |
|--------|----------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------|
| US-401 | As an **analyst**, I want to see a sentiment breakdown chart so I can assess today's news mood.    | P1       | Dashboard shows a pie/donut chart: % Positive, % Neutral, % Negative for current articles.            |
| US-402 | As an **analyst**, I want to see top categories today so I can identify trending topics.            | P1       | Bar chart or horizontal bars showing article count per category, sorted descending.                   |
| US-403 | As a **curator**, I want to see most-read articles so I know what's popular.                       | P2       | Table/list showing top 10 articles by click count (tracked via API).                                  |
| US-404 | As an **analyst**, I want to see trending topics so I can identify emerging stories.               | P2       | Word cloud or list of frequently occurring keywords across today's articles.                          |
| US-405 | As an **analyst**, I want sentiment trends over time so I can see how the mood is changing.        | P2       | Line chart showing sentiment distribution across the last 7 days (if data cached).                    |

### Epic 5: Admin Panel

| ID     | User Story                                                                                         | Priority | Acceptance Criteria                                                                                   |
|--------|----------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------|
| US-501 | As an **admin**, I want to override article sentiment so I can correct misclassifications.         | P1       | Admin can select any article and change its sentiment label; change persists and reflects in the feed. |
| US-502 | As an **admin**, I want to pin featured articles to the top of the feed.                           | P1       | Admin can mark articles as "featured"; featured articles appear at the top of the homepage feed.       |
| US-503 | As an **admin**, I want to manage categories so I can add/rename/remove topic tags.                | P2       | Admin CRUD interface for categories; changes propagate to all articles and filter options.             |
| US-504 | As an **admin**, I want admin actions to be password-protected so only authorized users can manage content. | P1 | Admin route requires authentication (basic auth for MVP); unauthorized access shows 401.              |

---

## 6. Functional Requirements

### FR-01: News Aggregation

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-01.1  | System SHALL fetch top headlines from NewsAPI.org on a scheduled interval.   | P0       |
| FR-01.2  | System SHALL support fetching by category: technology, business, sports, entertainment, health, science, general. | P0 |
| FR-01.3  | System SHALL cache fetched articles server-side with a configurable TTL (default: 15 minutes). | P0 |
| FR-01.4  | System SHALL normalize article data into a consistent internal schema.       | P0       |
| FR-01.5  | System SHALL handle API errors gracefully with fallback to cached data.      | P1       |
| FR-01.6  | System SHALL support pagination (20 articles per page, configurable).        | P1       |

### FR-02: Sentiment Analysis

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-02.1  | System SHALL analyze sentiment of every fetched article automatically.       | P0       |
| FR-02.2  | System SHALL classify sentiment as one of: `positive`, `neutral`, `negative`. | P0      |
| FR-02.3  | System SHALL compute a numeric sentiment score for each article.             | P0       |
| FR-02.4  | System SHALL analyze both the headline and available description/content.    | P0       |
| FR-02.5  | System SHALL use a keyword-based analysis algorithm with configurable word lists. | P0   |
| FR-02.6  | System SHALL support phrase-level matching (e.g., "market crash") in addition to single words. | P1 |
| FR-02.7  | System SHALL expose a test endpoint (`/api/sentiment`) for ad-hoc text analysis. | P2    |

### FR-03: Smart Filtering

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-03.1  | System SHALL support client-side filtering by category (single select).      | P0       |
| FR-03.2  | System SHALL support client-side filtering by sentiment (single select).     | P0       |
| FR-03.3  | System SHALL support combining category + sentiment filters simultaneously.  | P0       |
| FR-03.4  | System SHALL update feed results without page reload (client-side state).    | P0       |
| FR-03.5  | System SHALL visually indicate active filter state (highlighted chip).       | P0       |
| FR-03.6  | System SHALL provide a "Reset All" mechanism to clear all active filters.    | P1       |
| FR-03.7  | System SHALL support server-side filtering via query parameters for API consumers. | P1  |

### FR-04: Article Detail View

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-04.1  | System SHALL display full article content on a dedicated page (`/[slug]`).   | P0       |
| FR-04.2  | System SHALL display article metadata: source, author, published date, category, sentiment. | P0 |
| FR-04.3  | System SHALL calculate and display estimated reading time (words ÷ 200 WPM). | P1      |
| FR-04.4  | System SHALL provide a "Copy Link" button for sharing.                       | P1       |
| FR-04.5  | System SHALL display 3–5 similar articles (matching category + sentiment).   | P2       |
| FR-04.6  | System SHALL include a "Back to Feed" navigation link.                       | P1       |

### FR-05: Analytics Dashboard

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-05.1  | System SHALL display sentiment distribution as a pie/donut chart.            | P1       |
| FR-05.2  | System SHALL display article count per category as a bar chart.              | P1       |
| FR-05.3  | System SHALL display a list of most-read articles (by click count).          | P2       |
| FR-05.4  | System SHALL display trending keywords extracted from current articles.      | P2       |
| FR-05.5  | System SHALL compute analytics server-side and expose via `/api/analytics`.  | P1       |
| FR-05.6  | System SHALL auto-refresh analytics data every 15 minutes.                   | P2       |

### FR-06: Admin Panel

| ID       | Requirement                                                                  | Priority |
|----------|------------------------------------------------------------------------------|----------|
| FR-06.1  | System SHALL protect admin routes with authentication.                       | P1       |
| FR-06.2  | System SHALL allow admins to override article sentiment.                     | P1       |
| FR-06.3  | System SHALL allow admins to pin/unpin featured articles.                    | P1       |
| FR-06.4  | System SHALL allow admins to manage (add/edit/delete) categories.            | P2       |
| FR-06.5  | System SHALL log admin actions with timestamps for auditability.             | P2       |

---

## 7. Non-Functional Requirements

### NFR-01: Performance

| ID        | Requirement                                                              | Target        |
|-----------|--------------------------------------------------------------------------|---------------|
| NFR-01.1  | Initial page load (LCP)                                                  | < 2 seconds   |
| NFR-01.2  | Client-side filter response time                                         | < 200ms       |
| NFR-01.3  | API response time (`/api/news`)                                          | < 500ms       |
| NFR-01.4  | Sentiment analysis per article                                           | < 10ms        |
| NFR-01.5  | Dashboard chart rendering                                                | < 1 second    |
| NFR-01.6  | Concurrent users supported (MVP)                                         | 50+           |

### NFR-02: Security

| ID        | Requirement                                                              |
|-----------|--------------------------------------------------------------------------|
| NFR-02.1  | NewsAPI key SHALL be stored server-side only (environment variable).     |
| NFR-02.2  | Admin endpoints SHALL require authentication.                            |
| NFR-02.3  | API SHALL implement rate limiting (100 requests/IP/hour).                |
| NFR-02.4  | All user inputs SHALL be sanitized to prevent XSS.                       |
| NFR-02.5  | CORS SHALL be configured to allow only the frontend origin.              |
| NFR-02.6  | HTTPS SHALL be enforced in production.                                   |

### NFR-03: Accessibility

| ID        | Requirement                                                              |
|-----------|--------------------------------------------------------------------------|
| NFR-03.1  | Application SHALL conform to WCAG 2.1 Level AA guidelines.              |
| NFR-03.2  | All interactive elements SHALL be keyboard navigable.                    |
| NFR-03.3  | Sentiment badges SHALL not rely on color alone (include text labels).    |
| NFR-03.4  | Images SHALL include descriptive alt text.                               |
| NFR-03.5  | Minimum contrast ratio SHALL be 4.5:1 for text.                         |

### NFR-04: Compatibility

| ID        | Requirement                                                              |
|-----------|--------------------------------------------------------------------------|
| NFR-04.1  | Supported browsers: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+.      |
| NFR-04.2  | Responsive breakpoints: Mobile (375px), Tablet (768px), Desktop (1280px).|
| NFR-04.3  | Progressive enhancement: core content readable without JavaScript.       |

### NFR-05: SEO

| ID        | Requirement                                                              |
|-----------|--------------------------------------------------------------------------|
| NFR-05.1  | Article pages SHALL be server-side rendered for search engine indexing.   |
| NFR-05.2  | Each page SHALL have unique meta title and description.                  |
| NFR-05.3  | Open Graph and Twitter Card meta tags SHALL be present on article pages.  |
| NFR-05.4  | Semantic HTML5 elements SHALL be used throughout (article, nav, main, section). |

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       CLIENT BROWSER                      │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              NEXT.JS 14 (APP ROUTER)                │ │
│  │                                                     │ │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐          │ │
│  │  │  Home   │  │ Article  │  │Analytics │          │ │
│  │  │  Feed   │  │  Detail  │  │Dashboard │          │ │
│  │  │  (SSR)  │  │  (SSR)   │  │  (CSR)   │          │ │
│  │  └─────────┘  └──────────┘  └──────────┘          │ │
│  │                                                     │ │
│  │  ┌──────────────────────────────────────────┐      │ │
│  │  │         SHARED COMPONENTS                │      │ │
│  │  │  NewsCard │ FilterChips │ SentimentBadge │      │ │
│  │  │  CategoryBadge │ Charts │ AdminControls  │      │ │
│  │  └──────────────────────────────────────────┘      │ │
│  │                                                     │ │
│  │  Tailwind CSS │ Recharts │ React State (useState)  │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTP / REST
                          ▼
┌──────────────────────────────────────────────────────────┐
│                  EXPRESS.JS API SERVER                     │
│                                                          │
│  ┌────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │  Routes    │  │  Middleware      │  │  Services    │  │
│  │            │  │                  │  │              │  │
│  │ /api/news  │  │  CORS           │  │ NewsService  │  │
│  │ /api/news/ │  │  Rate Limiter   │  │ Sentiment    │  │
│  │   :id      │  │  Auth (Admin)   │  │   Analyzer   │  │
│  │ /api/      │  │  Error Handler  │  │ Analytics    │  │
│  │  analytics │  │  Request Logger │  │   Engine     │  │
│  │ /api/      │  │                  │  │ Cache        │  │
│  │  sentiment │  │                  │  │   Manager    │  │
│  │ /api/admin │  │                  │  │              │  │
│  └────────────┘  └─────────────────┘  └──────────────┘  │
│                                                          │
│  node-cache (In-Memory) │ dotenv │ helmet │ morgan       │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTP (REST)
                          ▼
┌──────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                      │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              NewsAPI.org (Free Tier)                 │ │
│  │                                                     │ │
│  │  GET /v2/top-headlines                              │ │
│  │    ?country=us&category=technology&pageSize=20      │ │
│  │                                                     │ │
│  │  Rate Limit: 100 requests/day                       │ │
│  │  Data Delay: None (live headlines)                  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 8.2 Data Flow

```
NewsAPI.org ──GET──▶ Express Server ──analyze──▶ Sentiment Engine
                          │                            │
                     Cache Layer ◀───── scored articles ──┘
                          │
                    REST Response
                          │
                          ▼
                    Next.js Frontend ──render──▶ User's Browser
                          │
                    Recharts ──draw──▶ Analytics Charts
```

### 8.3 Rendering Strategy

| Page         | Rendering | Justification                                          |
|--------------|-----------|--------------------------------------------------------|
| `/` (Home)   | SSR       | SEO for news content; fast initial load with articles  |
| `/[slug]`    | SSR       | SEO for individual articles; OG meta tags              |
| `/analytics` | CSR       | Interactive charts; no SEO value needed                |
| `/admin`     | CSR       | Protected route; no SEO value; highly interactive      |

### 8.4 Component Architecture

```
app/
├── layout.tsx              ← Root layout (Navbar, Footer)
├── page.tsx                ← Home: News feed + filters (SSR)
├── [slug]/
│   └── page.tsx            ← Article detail (SSR)
├── analytics/
│   └── page.tsx            ← Dashboard (CSR)
├── admin/
│   └── page.tsx            ← Admin panel (CSR + Auth)
└── components/
    ├── NewsCard.tsx         ← Article card with badges
    ├── NewsFeed.tsx         ← Grid/list of NewsCards
    ├── FilterChips.tsx      ← Category + sentiment filter buttons
    ├── SentimentBadge.tsx   ← Colored circle + label
    ├── CategoryBadge.tsx    ← Topic tag with icon
    ├── ReadingTime.tsx      ← "X min read" display
    ├── ShareButton.tsx      ← Copy link + share options
    ├── SimilarArticles.tsx  ← Related articles section
    ├── SentimentChart.tsx   ← Pie/donut chart (Recharts)
    ├── CategoryChart.tsx    ← Bar chart (Recharts)
    ├── TrendingTopics.tsx   ← Keyword frequency display
    ├── MostRead.tsx         ← Top articles by clicks
    ├── AdminTable.tsx       ← Article management table
    ├── SentimentOverride.tsx ← Dropdown to change sentiment
    ├── FeaturedToggle.tsx   ← Pin/unpin article toggle
    ├── Navbar.tsx           ← Top navigation bar
    └── Footer.tsx           ← Footer with links
```

---

## 9. API Contracts

### 9.1 Base Configuration

| Property     | Value                                    |
|--------------|------------------------------------------|
| Base URL     | `https://api.smartnewsreader.com` (production) |
| Base URL     | `http://localhost:5000` (development)    |
| Content-Type | `application/json`                       |
| Auth (Admin) | `Authorization: Basic <base64(user:pass)>` |

### 9.2 Endpoints

#### `GET /api/news` — Fetch News Feed

**Description**: Returns a paginated list of news articles with sentiment and category tags.

**Query Parameters**:

| Parameter  | Type   | Required | Default | Description                                      |
|------------|--------|----------|---------|--------------------------------------------------|
| `category` | string | No       | `all`   | Filter by category: `tech`, `politics`, `sports`, `finance`, `world`, `health`, `science`, `entertainment` |
| `sentiment`| string | No       | `all`   | Filter by sentiment: `positive`, `neutral`, `negative` |
| `page`     | number | No       | `1`     | Page number for pagination                       |
| `pageSize` | number | No       | `20`    | Number of articles per page (max: 50)            |

**Response** (`200 OK`):

```json
{
  "status": "success",
  "data": {
    "articles": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "slug": "tech-giant-reports-record-growth-2026",
        "title": "Tech Giant Reports Record Growth in Q1 2026",
        "description": "Major technology company announces unprecedented revenue growth...",
        "content": "Full article content here...",
        "source": {
          "id": "the-verge",
          "name": "The Verge"
        },
        "author": "Jane Smith",
        "url": "https://theverge.com/article/...",
        "imageUrl": "https://images.example.com/article.jpg",
        "publishedAt": "2026-02-19T08:30:00Z",
        "category": "tech",
        "sentiment": {
          "label": "positive",
          "score": 6,
          "confidence": "high"
        },
        "readingTime": 4,
        "isFeatured": false,
        "clickCount": 142
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalArticles": 87,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "activeCategory": "all",
      "activeSentiment": "all"
    }
  },
  "meta": {
    "cached": true,
    "cacheAge": "5m 23s",
    "lastFetched": "2026-02-19T10:15:00Z"
  }
}
```

**Error Response** (`500 Internal Server Error`):

```json
{
  "status": "error",
  "message": "Failed to fetch news articles",
  "code": "NEWS_FETCH_ERROR"
}
```

---

#### `GET /api/news/:id` — Fetch Single Article

**Description**: Returns a single article by its ID, including full content and similar articles.

**Path Parameters**:

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `id`      | string | Yes      | Article UUID          |

**Response** (`200 OK`):

```json
{
  "status": "success",
  "data": {
    "article": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "slug": "tech-giant-reports-record-growth-2026",
      "title": "Tech Giant Reports Record Growth in Q1 2026",
      "description": "Major technology company announces unprecedented revenue...",
      "content": "Full article content with all paragraphs...",
      "source": { "id": "the-verge", "name": "The Verge" },
      "author": "Jane Smith",
      "url": "https://theverge.com/article/...",
      "imageUrl": "https://images.example.com/article.jpg",
      "publishedAt": "2026-02-19T08:30:00Z",
      "category": "tech",
      "sentiment": {
        "label": "positive",
        "score": 6,
        "confidence": "high",
        "details": {
          "positiveWords": ["growth", "record", "unprecedented"],
          "negativeWords": [],
          "positiveCount": 3,
          "negativeCount": 0
        }
      },
      "readingTime": 4,
      "isFeatured": false,
      "clickCount": 143
    },
    "similarArticles": [
      {
        "id": "...",
        "title": "Another Positive Tech Article",
        "category": "tech",
        "sentiment": { "label": "positive", "score": 4 },
        "publishedAt": "2026-02-19T07:00:00Z"
      }
    ]
  }
}
```

**Error Response** (`404 Not Found`):

```json
{
  "status": "error",
  "message": "Article not found",
  "code": "ARTICLE_NOT_FOUND"
}
```

---

#### `GET /api/analytics` — Fetch Analytics Data

**Description**: Returns aggregated analytics for the current set of cached articles.

**Response** (`200 OK`):

```json
{
  "status": "success",
  "data": {
    "sentimentBreakdown": {
      "positive": { "count": 15, "percentage": 18.75 },
      "neutral": { "count": 48, "percentage": 60.00 },
      "negative": { "count": 17, "percentage": 21.25 }
    },
    "categoryBreakdown": [
      { "category": "tech", "count": 22, "percentage": 27.5 },
      { "category": "politics", "count": 18, "percentage": 22.5 },
      { "category": "finance", "count": 15, "percentage": 18.75 },
      { "category": "sports", "count": 12, "percentage": 15.0 },
      { "category": "world", "count": 13, "percentage": 16.25 }
    ],
    "mostRead": [
      {
        "id": "...",
        "title": "Article Title",
        "clickCount": 342,
        "category": "tech",
        "sentiment": "positive"
      }
    ],
    "trendingKeywords": [
      { "keyword": "AI", "frequency": 23 },
      { "keyword": "market", "frequency": 18 },
      { "keyword": "climate", "frequency": 14 }
    ],
    "totalArticles": 80,
    "lastUpdated": "2026-02-19T10:15:00Z"
  }
}
```

---

#### `POST /api/sentiment` — Test Sentiment Analysis

**Description**: Analyze sentiment of arbitrary text input. Useful for testing and demonstration.

**Request Body**:

```json
{
  "text": "The company reported massive growth and record-breaking profits this quarter."
}
```

**Response** (`200 OK`):

```json
{
  "status": "success",
  "data": {
    "label": "positive",
    "score": 6,
    "confidence": "high",
    "details": {
      "positiveWords": ["growth", "record-breaking", "profits"],
      "negativeWords": [],
      "positiveCount": 3,
      "negativeCount": 0,
      "totalWords": 12
    }
  }
}
```

---

#### `PUT /api/admin/articles/:id/sentiment` — Override Article Sentiment

**Description**: Manually override the sentiment classification of an article.

**Headers**: `Authorization: Basic <credentials>`

**Request Body**:

```json
{
  "sentiment": "negative",
  "reason": "Article context is sarcastic; keyword analysis missed the negative tone"
}
```

**Response** (`200 OK`):

```json
{
  "status": "success",
  "message": "Sentiment updated successfully",
  "data": {
    "articleId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "previousSentiment": "positive",
    "newSentiment": "negative",
    "overriddenBy": "admin",
    "overriddenAt": "2026-02-19T10:30:00Z"
  }
}
```

---

#### `PUT /api/admin/articles/:id/featured` — Toggle Featured Status

**Headers**: `Authorization: Basic <credentials>`

**Request Body**:

```json
{
  "isFeatured": true
}
```

**Response** (`200 OK`):

```json
{
  "status": "success",
  "message": "Article featured status updated",
  "data": {
    "articleId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "isFeatured": true
  }
}
```

---

#### `GET /api/admin/categories` — List Categories

**Headers**: `Authorization: Basic <credentials>`

**Response** (`200 OK`):

```json
{
  "status": "success",
  "data": {
    "categories": [
      { "id": "tech", "label": "Technology", "icon": "💻", "articleCount": 22 },
      { "id": "politics", "label": "Politics", "icon": "🏛️", "articleCount": 18 },
      { "id": "sports", "label": "Sports", "icon": "⚽", "articleCount": 12 },
      { "id": "finance", "label": "Finance", "icon": "💰", "articleCount": 15 },
      { "id": "world", "label": "World", "icon": "🌍", "articleCount": 13 }
    ]
  }
}
```

---

## 10. Data Models

### 10.1 Article

```
Article {
  id:            UUID          — Unique identifier (generated server-side)
  slug:          String        — URL-friendly title slug
  title:         String        — Article headline
  description:   String        — Short summary (first 200 chars)
  content:       String        — Full article body text
  source:        Source        — Embedded source object
  author:        String|null   — Author name (nullable)
  url:           String        — Original article URL
  imageUrl:      String|null   — Article thumbnail/hero image URL
  publishedAt:   DateTime      — Original publication timestamp (ISO 8601)
  category:      CategoryEnum  — Classified topic category
  sentiment:     Sentiment     — Computed sentiment object
  readingTime:   Integer       — Estimated reading time in minutes
  isFeatured:    Boolean       — Admin-pinned featured flag (default: false)
  clickCount:    Integer       — Number of times article was viewed (default: 0)
  createdAt:     DateTime      — When article was fetched and stored
}
```

### 10.2 Source

```
Source {
  id:    String|null  — Source identifier from NewsAPI
  name:  String       — Human-readable source name
}
```

### 10.3 Sentiment

```
Sentiment {
  label:      SentimentEnum  — "positive" | "neutral" | "negative"
  score:      Integer        — Numeric score (negative = negative sentiment)
  confidence: ConfidenceEnum — "high" | "medium" | "low"
  details:    SentimentDetails|null — Detailed breakdown (optional)
  isOverridden: Boolean      — Whether admin manually changed this
  overriddenBy: String|null  — Admin identifier if overridden
  overriddenAt: DateTime|null — Timestamp of override
}
```

### 10.4 SentimentDetails

```
SentimentDetails {
  positiveWords:  String[]  — List of positive keywords found
  negativeWords:  String[]  — List of negative keywords found
  positiveCount:  Integer   — Count of positive keyword matches
  negativeCount:  Integer   — Count of negative keyword matches
  totalWords:     Integer   — Total word count of analyzed text
}
```

### 10.5 AnalyticsSnapshot

```
AnalyticsSnapshot {
  sentimentBreakdown: {
    positive:  { count: Integer, percentage: Float }
    neutral:   { count: Integer, percentage: Float }
    negative:  { count: Integer, percentage: Float }
  }
  categoryBreakdown:  CategoryStat[]   — Array of per-category stats
  mostRead:           ArticleSummary[] — Top articles by click count
  trendingKeywords:   KeywordStat[]    — Most frequent keywords
  totalArticles:      Integer          — Total articles in dataset
  lastUpdated:        DateTime         — When analytics were computed
}
```

### 10.6 AdminConfig

```
AdminConfig {
  categories: Category[]  — List of active categories
  sentimentOverrides: {
    articleId: UUID
    previousSentiment: SentimentEnum
    newSentiment: SentimentEnum
    reason: String
    overriddenAt: DateTime
  }[]
  featuredArticles: UUID[] — List of pinned article IDs
}
```

### 10.7 Enumerations

```
CategoryEnum:   "tech" | "politics" | "sports" | "finance" | "world" | "health" | "science" | "entertainment"
SentimentEnum:  "positive" | "neutral" | "negative"
ConfidenceEnum: "high" | "medium" | "low"
```

---

## 11. Sentiment Analysis Algorithm Design

### 11.1 Overview

The Smart News Reader uses a **lexicon-based (keyword-driven) sentiment analysis engine** — a deliberate design choice that balances accuracy, explainability, and implementation simplicity. This approach requires no external AI/ML services, no model training, and no GPU infrastructure.

### 11.2 Algorithm Specification

#### Input
- Article `title` (string)
- Article `description` (string, optional)
- Article `content` (string, optional — may be truncated by NewsAPI)

#### Processing Pipeline

```
Input Text ──▶ Preprocessing ──▶ Phrase Matching ──▶ Word Matching ──▶ Score Calculation ──▶ Classification
```

**Step 1: Preprocessing**
- Convert text to lowercase
- Remove special characters, URLs, and excessive whitespace
- Concatenate title + description + content into a single analysis string
- Weight title words 2x (headlines carry more sentiment signal)

**Step 2: Phrase Matching (Higher Priority)**
- Scan for multi-word phrases from the phrase dictionaries
- Phrases score ±4 points each (higher weight than single words)
- Phrases are checked before single words to avoid double-counting

**Step 3: Single Word Matching**
- Scan remaining text for single keywords from word dictionaries
- Each match scores ±2 points

**Step 4: Score Calculation**

```
Raw Score = Σ(positive matches × weight) - Σ(negative matches × weight)

Where:
  - Phrase match weight = 4
  - Single word match weight = 2
  - Title word multiplier = 2×
```

**Step 5: Classification**

| Score Range   | Label      | Confidence |
|---------------|------------|------------|
| score > 4     | positive   | high       |
| score > 1     | positive   | medium     |
| score = 0, 1  | neutral    | medium     |
| score = -1    | neutral    | low        |
| score < -1    | negative   | medium     |
| score < -4    | negative   | high       |

### 11.3 Keyword Dictionaries

#### Positive Words (60+ terms)

```
growth, success, breakthrough, record, win, profit, surge, 
rally, gain, rise, improve, boost, soar, advance, achieve, 
triumph, milestone, innovation, strong, robust, exceed, 
outperform, upgrade, recovery, positive, optimistic, 
opportunity, progress, lead, expand, thrive, prosper, 
celebrate, award, honor, applaud, praise, endorse, 
support, benefit, advantage, efficient, sustainable, 
transform, revolutionary, promising, remarkable, excellent, 
outstanding, impressive, flourish, momentum, upswing, 
bullish, upturn, rebound, strengthen, empower, elevate
```

#### Negative Words (60+ terms)

```
crisis, death, loss, crash, decline, failed, plunge, drop, 
fall, collapse, recession, downturn, bankruptcy, layoff, 
scandal, controversy, disaster, threat, risk, warning, 
conflict, war, attack, violence, fraud, corruption, 
investigation, probe, penalty, fine, lawsuit, allegation, 
protest, strike, shutdown, closure, deficit, debt, 
inflation, unemployment, stagnation, volatile, uncertainty, 
fear, concern, worry, panic, chaos, turmoil, devastation, 
catastrophe, emergency, victim, casualty, suffer, struggle, 
burden, setback, obstacle, hardship, inequality
```

#### Negative Phrases (20+ multi-word phrases)

```
market crash, stock plunge, job cuts, data breach, 
supply chain disruption, trade war, climate crisis, 
hostile takeover, mass shooting, death toll, 
economic downturn, financial crisis, product recall, 
security threat, civil unrest, human rights violation, 
environmental disaster, labor shortage, budget deficit, 
housing crisis, opioid epidemic
```

#### Positive Phrases (20+ multi-word phrases)

```
record high, market rally, job growth, breakthrough discovery, 
peace agreement, clean energy, economic recovery, 
strong earnings, all-time high, record-breaking revenue, 
scientific breakthrough, historic achievement, 
global cooperation, sustainable development, 
innovation hub, digital transformation, community support, 
successful launch, positive outlook, strong demand
```

### 11.4 Known Limitations & Upgrade Path

| Limitation                  | Impact                              | Future Mitigation                              |
|-----------------------------|-------------------------------------|------------------------------------------------|
| No context/sarcasm detection | Sarcastic positive text misclassified | Integrate NLP library (Compromise.js, VADER)  |
| Language: English only       | Non-English articles scored as neutral | Add multilingual word lists or use NLP API    |
| No negation handling         | "not good" scored as positive       | Add negation window (3 words before positive) |
| Domain-agnostic scoring      | Sports "loss" ≠ financial "loss"    | Category-specific dictionaries                |
| Static dictionaries          | New terminology not captured        | Admin-managed custom word additions           |

### 11.5 Accuracy Targets

| Metric                        | Target  | Measurement Method                           |
|-------------------------------|---------|----------------------------------------------|
| Overall accuracy              | > 75%   | Against 200 manually labeled articles        |
| Positive precision            | > 70%   | True positives / (true + false positives)    |
| Negative recall               | > 80%   | True negatives / (true negatives + false negatives) |
| Neutral classification        | > 70%   | Correctly identified neutral articles        |

---

## 12. Wireframes & UI Descriptions

### 12.1 Home Page (`/`)

```
┌──────────────────────────────────────────────────────────┐
│  🔵 Smart News Reader          [Analytics] [Admin]  🔍  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  CATEGORIES:                                             │
│  [ All ] [ Tech ] [ Politics ] [ Sports ] [ Finance ]   │
│  [ World ] [ Health ] [ Science ] [ Entertainment ]      │
│                                                          │
│  SENTIMENT:                                              │
│  [ 🟢 Positive ] [ ⚪ Neutral ] [ 🔴 Negative ]         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ⭐ FEATURED                                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📰 Tech Giant Reports Record Growth             │   │
│  │  Major technology company announces...           │   │
│  │  [Tech] [🟢 Positive]          2h ago │ The Verge│   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  LATEST NEWS                                             │
│  ┌────────────────────┐  ┌────────────────────┐        │
│  │  📰 Headline 1     │  │  📰 Headline 2     │        │
│  │  Summary text...   │  │  Summary text...   │        │
│  │  [Politics]        │  │  [Finance]         │        │
│  │  [🔴 Negative]     │  │  [⚪ Neutral]      │        │
│  │  1h ago │ BBC      │  │  3h ago │ Reuters  │        │
│  └────────────────────┘  └────────────────────┘        │
│                                                          │
│  ┌────────────────────┐  ┌────────────────────┐        │
│  │  📰 Headline 3     │  │  📰 Headline 4     │        │
│  │  Summary text...   │  │  Summary text...   │        │
│  │  [Sports]          │  │  [Tech]            │        │
│  │  [🟢 Positive]     │  │  [⚪ Neutral]      │        │
│  │  5h ago │ ESPN     │  │  6h ago │ Wired    │        │
│  └────────────────────┘  └────────────────────┘        │
│                                                          │
│  [ Load More Articles ]                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Design Decisions**:
- **Card grid layout**: 2 columns on desktop, 1 column on mobile
- **Filter chips**: Horizontal scrollable row with active state highlighting (filled background)
- **Sentiment colors**: Green (#22C55E), Gray (#9CA3AF), Red (#EF4444) — accessible contrast
- **Featured articles**: Full-width card at top with subtle star icon
- **Infinite scroll or "Load More"**: Paginated loading to manage performance

### 12.2 Article Detail Page (`/[slug]`)

```
┌──────────────────────────────────────────────────────────┐
│  🔵 Smart News Reader          [Analytics] [Admin]  🔍  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ← Back to Feed                                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  [Tech] [🟢 Positive] [Score: +6]                │   │
│  │                                                  │   │
│  │  Tech Giant Reports Record Growth in Q1 2026     │   │
│  │                                                  │   │
│  │  By Jane Smith │ The Verge │ 2h ago │ 4 min read │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │         [Article Hero Image]             │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                  │   │
│  │  Full article content here with all paragraphs  │   │
│  │  spanning multiple lines and providing the      │   │
│  │  complete story...                              │   │
│  │                                                  │   │
│  │  ─────────────────────────────────────────       │   │
│  │                                                  │   │
│  │  Sentiment Analysis Details:                     │   │
│  │  ✅ Positive words found: growth, record,       │   │
│  │     unprecedented                               │   │
│  │  ❌ Negative words found: none                  │   │
│  │  📊 Score: +6 (High Confidence)                 │   │
│  │                                                  │   │
│  │  [📋 Copy Link]  [🔗 Read Original]             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  SIMILAR ARTICLES                                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Related 1  │ │ Related 2  │ │ Related 3  │          │
│  │ [Tech]     │ │ [Tech]     │ │ [Tech]     │          │
│  │ [🟢 Pos]   │ │ [🟢 Pos]   │ │ [⚪ Neu]   │          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 12.3 Analytics Dashboard (`/analytics`)

```
┌──────────────────────────────────────────────────────────┐
│  🔵 Smart News Reader          [Analytics] [Admin]  🔍  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📊 ANALYTICS DASHBOARD         Last updated: 10:15 AM  │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  Sentiment Overview  │  │  Top Categories      │    │
│  │                      │  │                      │    │
│  │    ┌──────────┐      │  │  Tech      ████████ 22│   │
│  │    │  PIE     │      │  │  Politics  ██████   18│   │
│  │    │  CHART   │      │  │  Finance   █████    15│   │
│  │    │          │      │  │  World     ████     13│   │
│  │    └──────────┘      │  │  Sports    ████     12│   │
│  │                      │  │                      │    │
│  │  🟢 Positive: 18.7% │  │                      │    │
│  │  ⚪ Neutral:  60.0% │  │                      │    │
│  │  🔴 Negative: 21.3% │  │                      │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  Most Read Articles  │  │  Trending Keywords   │    │
│  │                      │  │                      │    │
│  │  1. Article Title    │  │  ● AI (23 mentions)  │    │
│  │     342 clicks       │  │  ● Market (18)       │    │
│  │  2. Article Title    │  │  ● Climate (14)      │    │
│  │     287 clicks       │  │  ● Security (12)     │    │
│  │  3. Article Title    │  │  ● Innovation (11)   │    │
│  │     256 clicks       │  │                      │    │
│  │  4. Article Title    │  │                      │    │
│  │     198 clicks       │  │                      │    │
│  │  5. Article Title    │  │                      │    │
│  │     154 clicks       │  │                      │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Sentiment Trend (Last 7 Days)                   │   │
│  │                                                  │   │
│  │      LINE CHART                                  │   │
│  │  100%├──────────────────────────                 │   │
│  │      │ ====neutral==========                     │   │
│  │   50%├──────────────────────────                 │   │
│  │      │ ----negative---------                     │   │
│  │      │ ....positive..........                    │   │
│  │    0%├──┬──┬──┬──┬──┬──┬──                      │   │
│  │      Mon Tue Wed Thu Fri Sat Sun                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 12.4 Admin Panel (`/admin`)

```
┌──────────────────────────────────────────────────────────┐
│  🔵 Smart News Reader          [Analytics] [Admin]  🔍  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🔒 ADMIN PANEL                         Welcome, Admin  │
│                                                          │
│  [Articles] [Categories] [Activity Log]                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ARTICLE MANAGEMENT                    Search 🔍 │   │
│  │                                                  │   │
│  │  ┌────┬──────────────┬────────┬────────┬──────┐ │   │
│  │  │ ⭐ │ Title        │Category│Sentim. │Action│ │   │
│  │  ├────┼──────────────┼────────┼────────┼──────┤ │   │
│  │  │ ☆  │ Tech Giant...│ Tech   │🟢 Pos  │[Edit]│ │   │
│  │  │ ★  │ Market Dips..│Finance │🔴 Neg  │[Edit]│ │   │
│  │  │ ☆  │ Sports Win...│ Sports │🟢 Pos  │[Edit]│ │   │
│  │  │ ☆  │ Climate Rep..│ World  │⚪ Neu  │[Edit]│ │   │
│  │  └────┴──────────────┴────────┴────────┴──────┘ │   │
│  │                                                  │   │
│  │  EDIT ARTICLE SENTIMENT                          │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │  Article: "Market Dips Amid Uncertainty" │   │   │
│  │  │  Current: 🔴 Negative (Score: -5)        │   │   │
│  │  │                                          │   │   │
│  │  │  Override to: [ Positive ▼ ]             │   │   │
│  │  │  Reason: [_________________________]     │   │   │
│  │  │                                          │   │   │
│  │  │  [Save Override] [Cancel]                │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 13. Third-Party Integrations

### 13.1 NewsAPI.org

| Property          | Detail                                            |
|-------------------|---------------------------------------------------|
| **Service**       | NewsAPI.org — Free Tier                           |
| **Purpose**       | Real-time news article aggregation                |
| **API Version**   | v2                                                |
| **Authentication**| API Key (header: `X-Api-Key`)                     |
| **Rate Limit**    | 100 requests/day (free tier)                      |
| **Data Freshness**| Live headlines (no delay on free tier for top-headlines) |
| **Coverage**      | 80,000+ sources, 54 countries                     |

#### Endpoints Used

| Endpoint                  | Purpose               | Parameters                              |
|---------------------------|----------------------|-----------------------------------------|
| `GET /v2/top-headlines`   | Fetch latest headlines | `country`, `category`, `pageSize`, `page` |
| `GET /v2/everything`      | Search all articles   | `q`, `from`, `to`, `sortBy`, `pageSize` |

#### Caching Strategy

```
Request Flow:
1. Client requests /api/news?category=tech
2. Server checks node-cache for key "news:tech"
3. If CACHE HIT (< 15 min old) → return cached data
4. If CACHE MISS → fetch from NewsAPI → analyze sentiment → cache → return
5. If API ERROR + cache exists → return stale cache with warning header
6. If API ERROR + no cache → return 503 with retry-after header

Cache Configuration:
- TTL: 900 seconds (15 minutes)
- Check period: 120 seconds
- Max keys: 50 (one per category + combined queries)
```

#### Rate Limit Budget (100 requests/day)

| Scenario                    | Requests | Calculation                        |
|-----------------------------|----------|------------------------------------|
| Initial load (all categories) | 8       | 8 categories × 1 request each    |
| Refresh every 15 min (16h)  | 64       | 64 intervals × 1 hot category    |
| User-initiated refreshes    | 20       | Buffer for manual refreshes       |
| Admin/test                  | 8        | Buffer for admin operations       |
| **Total**                   | **100**  | Exactly within free-tier limit    |

### 13.2 Recharts

| Property     | Detail                                     |
|--------------|--------------------------------------------|
| **Library**  | Recharts (v2.x)                            |
| **Purpose**  | Interactive data visualization in React    |
| **License**  | MIT                                        |
| **Charts Used** | PieChart, BarChart, LineChart, Tooltip  |
| **Bundle Size** | ~120KB gzipped (tree-shakeable)         |

### 13.3 Additional Dependencies

| Package        | Purpose                    | License |
|----------------|----------------------------|---------|
| `node-cache`   | In-memory server-side cache | MIT    |
| `uuid`         | Generate article UUIDs     | MIT     |
| `slugify`      | Generate URL-friendly slugs | MIT    |
| `helmet`       | Express security headers   | MIT     |
| `morgan`       | HTTP request logging       | MIT     |
| `cors`         | Cross-origin configuration | MIT     |
| `dotenv`       | Environment variable management | BSD-2 |
| `date-fns`     | Relative time formatting   | MIT     |
| `express-rate-limit` | API rate limiting    | MIT     |
| `rss-parser`   | Parse Nigerian RSS news feeds | MIT   |
| `axios`        | HTTP client for API calls  | MIT     |
| `lucide-react` | Modern icon library for UI | ISC     |

---

## 14. Success Metrics & KPIs

### 14.1 Product Metrics

| KPI                              | Target          | Measurement Method                               |
|----------------------------------|-----------------|--------------------------------------------------|
| Sentiment classification accuracy | > 75%          | Manual labeling of 200 test articles vs algorithm |
| User engagement (articles/session) | > 5 articles | Click count tracking per session                 |
| Average session duration          | > 3 minutes    | Time between first and last API call per session |
| Filter usage rate                 | > 40% of sessions | API query parameter analysis                  |
| Dashboard page visits             | > 15% of users | Page view tracking                               |
| Return user rate (7-day)          | > 20%          | Browser fingerprint or localStorage tracking     |

### 14.2 Technical Metrics

| KPI                          | Target      | Measurement Method               |
|------------------------------|-------------|----------------------------------|
| Initial page load (LCP)     | < 2 seconds | Lighthouse audit                 |
| API response time (p95)     | < 500ms     | Express response time logging    |
| Cache hit rate               | > 80%       | Cache manager hit/miss logging   |
| Error rate                   | < 1%        | Error tracking in Express logger |
| Uptime                       | > 99%       | Vercel/Render monitoring         |
| Sentiment processing time    | < 10ms/article | Performance.now() benchmarks  |

### 14.3 Business Metrics

| KPI                          | Target            | Measurement Method              |
|------------------------------|-------------------|---------------------------------|
| MVP delivery                 | 5 days            | Sprint tracking                 |
| Client satisfaction          | Positive sign-off | Client review meeting           |
| Demo success                 | All features working | QA checklist completion       |
| Documentation completeness   | 100% API documented | API docs review                |

---

## 15. Risks & Mitigations

### 15.1 Risk Register

| ID   | Risk                                  | Probability | Impact | Severity | Mitigation Strategy                                  |
|------|---------------------------------------|:-----------:|:------:|:--------:|------------------------------------------------------|
| R-01 | NewsAPI free-tier rate limit exceeded | High        | High   | **Critical** | Aggressive caching (15-min TTL); budget 100 req/day carefully; show cached data when limit hit |
| R-02 | Sentiment analysis inaccuracy (sarcasm, context) | Medium | Medium | **High** | Document known limitations; provide admin override; plan NLP upgrade path |
| R-03 | API key exposure in client-side code  | Low         | High   | **High** | Server-side only API calls; environment variables; never commit keys |
| R-04 | NewsAPI service downtime              | Low         | High   | **Medium** | Graceful degradation to cached data; error states in UI; retry logic |
| R-05 | Scope creep beyond MVP                | Medium      | Medium | **Medium** | Strict MoSCoW prioritization; defer "Could Have" features; daily scope review |
| R-06 | Performance degradation with large datasets | Low   | Medium | **Low** | Pagination; lazy loading; virtual scrolling for large lists |
| R-07 | Browser compatibility issues          | Low         | Low    | **Low** | Test on Chrome/Firefox/Safari/Edge; progressive enhancement |
| R-08 | Free hosting limitations (Vercel/Render) | Medium   | Medium | **Medium** | Optimize bundle size; serverless function cold starts; CDN caching |

### 15.2 Contingency Plans

| Trigger                         | Action                                                     |
|----------------------------------|------------------------------------------------------------|
| NewsAPI daily limit reached     | Serve cached data with "Last updated X hours ago" banner   |
| NewsAPI deprecated/removed      | Swap to GNews API or MediaStack (similar free tiers)       |
| Sentiment accuracy < 60%        | Integrate `sentiment` npm package (AFINN-based) as fallback |
| Vercel deployment fails         | Fallback to Netlify or self-hosted VPS                     |
| Express/Render downtime         | Deploy backup to Railway.app or Fly.io                     |

---

## 16. Timeline & Milestones

### 16.1 Development Sprint (5 Days)

```
Day 1 ─── Foundation ───────────────────────────────────────
│
├── ✅ Project scaffolding (Next.js 14 + Express)
├── ✅ NewsAPI integration + data fetching
├── ✅ Server-side caching with node-cache
├── ✅ Basic news list endpoint (/api/news)
├── ✅ Homepage with styled news cards (Tailwind)
│
│   Deliverable: News articles load and display in grid
│
Day 2 ─── Sentiment Engine ─────────────────────────────────
│
├── ✅ Sentiment analysis module (keyword dictionaries)
├── ✅ Scoring algorithm + classification logic
├── ✅ Auto-analyze all fetched articles
├── ✅ Sentiment badges on news cards (colored circles)
├── ✅ Test endpoint (/api/sentiment)
│
│   Deliverable: Every article shows sentiment badge
│
Day 3 ─── Filtering & Detail ──────────────────────────────
│
├── ✅ Category filter chips (client-side)
├── ✅ Sentiment filter chips (client-side)
├── ✅ Combined filter logic (category + sentiment)
├── ✅ Article detail page (/[slug])
├── ✅ Reading time + share button + similar articles
│
│   Deliverable: Full filter + detail functionality
│
Day 4 ─── Analytics Dashboard ─────────────────────────────
│
├── ✅ Analytics API endpoint (/api/analytics)
├── ✅ Sentiment pie/donut chart (Recharts)
├── ✅ Category bar chart
├── ✅ Most-read articles list
├── ✅ Trending keywords display
│
│   Deliverable: Complete analytics dashboard
│
Day 5 ─── Admin & Deploy ──────────────────────────────────
│
├── ✅ Admin authentication (basic auth)
├── ✅ Sentiment override UI
├── ✅ Featured articles toggle
├── ✅ Deploy frontend to Vercel
├── ✅ Deploy backend to Render
├── ✅ Environment variables + final testing
│
│   Deliverable: Production deployment + demo ready
```

### 16.2 Post-MVP Roadmap (Weeks 2–6)

| Week | Focus              | Features                                            |
|------|--------------------|-----------------------------------------------------|
| 2    | Polish & QA        | Bug fixes, edge cases, performance optimization     |
| 3    | NLP Upgrade        | Integrate `sentiment` npm package; compare accuracy |
| 4    | User Features      | Bookmarks, reading history, dark mode               |
| 5    | Multi-Source        | Add GNews API, MediaStack; source comparison        |
| 6    | Real-Time           | WebSocket updates, push notifications, PWA support |

---

## 17. Assumptions & Constraints

### 17.1 Assumptions

| ID   | Assumption                                                     |
|------|----------------------------------------------------------------|
| A-01 | NewsAPI.org free tier will remain available and provide adequate data for the MVP. |
| A-02 | Keyword-based sentiment analysis will achieve > 75% accuracy for English news articles. |
| A-03 | Users primarily consume English-language news content.          |
| A-04 | The application will be accessed primarily via modern web browsers (Chrome, Firefox, Safari, Edge). |
| A-05 | A single developer will implement the MVP within the 5-day timeline. |
| A-06 | Free hosting tiers (Vercel for frontend, Render for backend) will provide sufficient resources for the MVP. |
| A-07 | Client has no existing infrastructure or design system that needs to be integrated. |
| A-08 | No user authentication is required for general readers (only admin panel). |

### 17.2 Constraints

| ID   | Constraint                                                     | Impact                                       |
|------|----------------------------------------------------------------|----------------------------------------------|
| C-01 | NewsAPI free tier: 100 requests/day                            | Requires aggressive caching strategy          |
| C-02 | No ML/AI infrastructure (no GPU, no model hosting)             | Sentiment limited to keyword-based approach   |
| C-03 | No database (MVP uses in-memory cache)                         | Data lost on server restart; no persistence   |
| C-04 | Single-developer team                                          | Sequential development; no parallel workstreams |
| C-05 | 5-day delivery timeline                                        | Strict scope management; defer non-essential features |
| C-06 | Zero external budget (free tier services only)                 | Hosting, API, and tooling limited to free options |
| C-07 | English-language articles only                                 | Non-English content may receive incorrect sentiment |

---

## 18. Appendices

### Appendix A: Glossary

| Term                    | Definition                                                        |
|-------------------------|-------------------------------------------------------------------|
| **Sentiment Analysis**  | The process of determining the emotional tone (positive, neutral, negative) of text content. |
| **Lexicon-Based**       | An approach to sentiment analysis that uses predefined word lists (dictionaries) to score text. |
| **NLP**                 | Natural Language Processing — a field of AI focused on understanding human language. |
| **SSR**                 | Server-Side Rendering — HTML generated on the server for each request. |
| **CSR**                 | Client-Side Rendering — HTML generated in the browser using JavaScript. |
| **TTL**                 | Time To Live — duration that cached data remains valid before refresh. |
| **LCP**                 | Largest Contentful Paint — a Core Web Vitals metric for page load performance. |
| **MoSCoW**              | Prioritization framework: Must Have, Should Have, Could Have, Won't Have. |
| **AFINN**               | A sentiment lexicon of English words rated for valence (-5 to +5). |
| **VADER**               | Valence Aware Dictionary and sEntiment Reasoner — a lexicon and rule-based sentiment analysis tool. |

### Appendix B: Sample NewsAPI Response

```json
{
  "status": "ok",
  "totalResults": 38,
  "articles": [
    {
      "source": { "id": "the-verge", "name": "The Verge" },
      "author": "Jane Smith",
      "title": "Tech Giant Reports Record Growth in Q1 2026",
      "description": "Major technology company announces unprecedented revenue growth, exceeding analyst expectations by 15%.",
      "url": "https://www.theverge.com/2026/2/19/tech-giant-growth",
      "urlToImage": "https://cdn.theverge.com/image.jpg",
      "publishedAt": "2026-02-19T08:30:00Z",
      "content": "In a surprising turn of events, the major technology company has reported record-breaking revenue for the first quarter of 2026..."
    }
  ]
}
```

### Appendix C: Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# NewsAPI Configuration
NEWS_API_KEY=your_newsapi_key_here
NEWS_API_BASE_URL=https://newsapi.org/v2

# Cache Configuration
CACHE_TTL=900
CACHE_CHECK_PERIOD=120

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_here

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Smart News Reader

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Appendix D: Deployment Checklist

- [ ] All environment variables configured on Vercel (frontend)
- [ ] All environment variables configured on Render (backend)
- [ ] NewsAPI key validated and working
- [ ] CORS configured for production domain
- [ ] HTTPS enforced
- [ ] `robots.txt` and `sitemap.xml` configured
- [ ] Error monitoring configured (console logging at minimum)
- [ ] Cache TTL verified (15 min)
- [ ] Rate limiting active on API
- [ ] Admin credentials changed from defaults
- [ ] All filter combinations tested
- [ ] Mobile responsiveness verified (375px, 768px, 1280px)
- [ ] Lighthouse score > 90 (Performance)
- [ ] All API endpoints returning expected responses
- [ ] README.md with setup instructions committed

### Appendix E: Reference Links

| Resource                      | URL                                        |
|-------------------------------|---------------------------------------------|
| NewsData.io Documentation    | https://newsdata.io/documentation           |
| NewsAPI Documentation         | https://newsapi.org/docs                    |
| Next.js 14 Documentation     | https://nextjs.org/docs                     |
| Tailwind CSS Documentation   | https://tailwindcss.com/docs                |
| Recharts Documentation       | https://recharts.org/en-US/                 |
| Express.js Documentation     | https://expressjs.com/                      |
| pnpm Documentation           | https://pnpm.io/                            |
| Vercel Deployment Guide      | https://vercel.com/docs                     |
| Render Deployment Guide      | https://render.com/docs                     |
| WCAG 2.1 Guidelines          | https://www.w3.org/TR/WCAG21/               |

---

*End of Product Requirements Document*

*Document Version: 1.0 | Date: February 19, 2026 | Status: Under Review*

*© 2026 Smart News Reader — Confidential*
