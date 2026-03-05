# 🔑 API Keys Acquisition Guide

This guide walks you through obtaining free API keys for **NewsLens** — your Smart News Reader with Sentiment Analysis.

> **You do NOT need any API keys to run the app.** The app works out of the box using Nigerian RSS feeds (Premium Times, Channels TV, Vanguard, TheCable). API keys unlock additional news sources and broader coverage.

---

## Table of Contents

1. [NewsData.io](#1-newsdataio-recommended) — Primary API (recommended)
2. [NewsAPI.org](#2-newsapiorg-backup)     — Backup API
3. [MediaStack](#3-mediastack-emergency)    — Emergency fallback
4. [Setting Up Your `.env` File](#4-setting-up-your-env-file)

---

## 1. NewsData.io (Recommended)

**Free tier:** 200 credits/day · Nigerian news support · No credit card required

### Steps

1. **Visit** [https://newsdata.io/register](https://newsdata.io/register)

2. **Sign up** with your email, Google account, or GitHub account

3. **Verify your email** — check your inbox and click the confirmation link

4. **Log in** to your dashboard at [https://newsdata.io/dashboard](https://newsdata.io/dashboard)

5. **Copy your API key** — it will be displayed on the dashboard home page under "Your API Key"

   ```
   Example: pub_123456789abcdef0123456789abcdef
   ```

6. **Test the key** (optional) — paste this in your browser, replacing `YOUR_KEY`:
   ```
   https://newsdata.io/api/1/latest?apikey=YOUR_KEY&country=ng&language=en
   ```
   You should see a JSON response with Nigerian news articles.

### Free Tier Limits

| Feature           | Limit            |
|-------------------|------------------|
| API Credits/day   | 200              |
| Results per call  | 10               |
| Historical data   | Last 48 hours    |
| Countries         | All (including Nigeria `ng`) |
| Languages         | All              |
| Categories        | business, entertainment, environment, food, health, politics, science, sports, technology, top, tourism, world |

### Tips
- Each API call costs 1 credit, regardless of results returned
- The app caches responses for 15 minutes, so credits are used efficiently
- 200 credits/day is more than enough for personal use

---

## 2. NewsAPI.org (Backup)

**Free tier:** 100 requests/day · Global coverage · Developer use only

### Steps

1. **Visit** [https://newsapi.org/register](https://newsapi.org/register)

2. **Fill out the form:**
   - Name
   - Email address
   - Password
   - Select **"I am an individual"** for account type

3. **Submit** and check your email for verification

4. **Log in** at [https://newsapi.org/account](https://newsapi.org/account)

5. **Copy your API key** — it appears on your account page

   ```
   Example: abc123def456ghi789jkl012mno345pq
   ```

6. **Test the key** (optional):
   ```
   https://newsapi.org/v2/top-headlines?country=ng&apiKey=YOUR_KEY
   ```

### Free Tier Limits

| Feature            | Limit                        |
|--------------------|------------------------------|
| Requests/day       | 100                          |
| Sources            | 80,000+ worldwide            |
| Historical data    | Last 30 days                 |
| Rate limit         | No published limit           |
| CORS               | ❌ Server-side only (perfect for our backend) |
| Commercial use     | ❌ Not allowed on free tier   |

### Important Notes
- Free tier is for **development only** — not for production apps
- CORS is blocked on the free tier, so requests must come from a server (which our backend does)
- Nigerian coverage is available via `country=ng` parameter

---

## 3. MediaStack (Emergency Fallback)

**Free tier:** 100 calls/month · Basic news data · No credit card required

### Steps

1. **Visit** [https://mediastack.com/signup/free](https://mediastack.com/signup/free)

2. **Create an account** with email and password

3. **Verify your email**

4. **Log in** to the dashboard at [https://mediastack.com/dashboard](https://mediastack.com/dashboard)

5. **Find your API key** — it's on the dashboard under "Your API Access Key"

   ```
   Example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

6. **Test the key**:
   ```
   http://api.mediastack.com/v1/news?access_key=YOUR_KEY&countries=ng&languages=en
   ```

### Free Tier Limits

| Feature          | Limit            |
|------------------|------------------|
| Calls/month      | 100              |
| Results per call | 25               |
| HTTPS            | ❌ HTTP only      |
| Historical data  | None             |
| Sources          | 7,500+           |
| Countries        | 50+              |

### Important Notes
- Only **100 calls per month** — best as an emergency fallback  
- Free tier does **NOT support HTTPS** — requests must use `http://`
- Limited compared to NewsData.io and NewsAPI.org

---

## 4. Setting Up Your `.env` File

Once you have your keys, configure the backend:

### Step-by-step

1. **Navigate** to the `backend/` folder:
   ```bash
   cd backend
   ```

2. **Copy** the example env file:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

3. **Open** the `.env` file and paste your keys:

   ```env
   # ─── API Keys ───────────────────────────
   NEWSDATA_API_KEY=pub_your_newsdata_key_here
   NEWSAPI_API_KEY=your_newsapi_key_here
   MEDIASTACK_API_KEY=your_mediastack_key_here

   # ─── Server Config ──────────────────────
   PORT=5000
   CORS_ORIGIN=http://localhost:3000

   # ─── Cache Settings (seconds) ───────────
   RSS_CACHE_TTL=600
   API_CACHE_TTL=900
   ```

4. **Restart** the backend server:
   ```bash
   # If using pnpm from root:
   pnpm dev:backend

   # Or directly:
   cd backend && node src/server.js
   ```

5. **Verify** — you should see in the console:
   ```
   📰 [NewsData] Fetched 10 Nigerian articles
   ```
   Instead of:
   ```
   ⚠️  [NewsData] No API key configured — skipping
   ```

---

## Priority Order

The app fetches news in this priority order:

| Priority | Source        | Type   | Key Required? |
|----------|---------------|--------|---------------|
| 1        | RSS Feeds     | Free   | ❌ No          |
| 2        | NewsData.io   | API    | ✅ Yes         |
| 3        | NewsAPI.org   | API    | ✅ Yes         |
| 4        | MediaStack    | API    | ✅ Yes         |

**RSS feeds always work** and provide 40–50 articles from major Nigerian outlets. API keys add more sources, broader categories, and international coverage.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `⚠️ No API key configured` | Key not in `.env` or server not restarted |
| `❌ NewsData API error: 401` | Invalid key — re-copy from dashboard |
| `❌ NewsData API error: 429` | Daily quota exceeded — wait 24 hours |
| `0 articles from API` | Check country code (`ng`) and that the key is active |
| `.env` changes not taking effect | Restart the backend server |

---

## Quick Summary

| Service       | Sign Up URL                                           | Free Limit       | Best For              |
|---------------|-------------------------------------------------------|------------------|-----------------------|
| NewsData.io   | [newsdata.io/register](https://newsdata.io/register)  | 200 credits/day  | Primary news source   |
| NewsAPI.org   | [newsapi.org/register](https://newsapi.org/register)  | 100 req/day      | Backup + global news  |
| MediaStack    | [mediastack.com/signup](https://mediastack.com/signup/free) | 100 calls/month | Emergency fallback |

All three services are **free to sign up** and require **no credit card**. For most users, just **NewsData.io** is sufficient.
