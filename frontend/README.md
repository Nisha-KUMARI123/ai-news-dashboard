# 🤖 AI News Dashboard

A dashboard that automatically collects the latest AI news from 20+ sources,
lets you save favorites, and broadcast them via Email, LinkedIn, and WhatsApp.

## 🚀 Quick Start

### Option 1 — Run Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Open: http://localhost:3000

### Option 2 — Run with Docker
```bash
docker-compose up --build
```

Open: http://localhost:3000

## 📰 Features

- ✅ Fetches AI news from 20+ sources (OpenAI, Google AI, arXiv, TechCrunch...)
- ✅ Deduplication — no repeated articles
- ✅ Save favorites with one click
- ✅ Broadcast to Email, LinkedIn, WhatsApp (simulated)
- ✅ Clean responsive dashboard
- ✅ REST API with full documentation at /docs

## 🏗️ Architecture
```
[20 RSS Sources]
      ↓
[FastAPI Backend] → [SQLite Database]
      ↓
[React Frontend Dashboard]
      ↓
[Broadcast: Email / LinkedIn / WhatsApp]
```

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| sources | Registered news sources |
| news_items | Stored articles |
| favorites | Saved favorites |
| broadcast_logs | Broadcast history |

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Axios |
| Backend | FastAPI (Python) |
| Database | SQLite (local) / PostgreSQL (production) |
| Deployment | Docker + Docker Compose |
| News Fetching | feedparser + requests |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /news/ | Get all news |
| POST | /news/fetch | Fetch fresh news |
| GET | /favorites/ | Get favorites |
| POST | /favorites/{id} | Add favorite |
| DELETE | /favorites/{id} | Remove favorite |
| POST | /broadcast/email/{id} | Send via email |
| POST | /broadcast/linkedin/{id} | Post to LinkedIn |
| POST | /broadcast/whatsapp/{id} | Send to WhatsApp |
```

---

## 🎊 YOUR PROJECT IS COMPLETE!

Here's everything you built from scratch:
```
ai-news-dashboard/
├── backend/
│   ├── main.py          ✅ FastAPI app
│   ├── database.py      ✅ SQLite connection
│   ├── models.py        ✅ DB tables
│   ├── fetcher.py       ✅ 20 news sources
│   ├── routers/
│   │   ├── news.py      ✅ News API
│   │   ├── favorites.py ✅ Favorites API
│   │   └── broadcast.py ✅ Broadcast API
│   └── Dockerfile       ✅ Container
├── frontend/
│   ├── src/
│   │   ├── App.js       ✅ Main app
│   │   ├── components/
│   │   │   └── Navbar.js ✅ Navigation
│   │   └── pages/
│   │       ├── NewsFeed.js  ✅ News page
│   │       └── Favorites.js ✅ Favorites page
│   └── Dockerfile       ✅ Container
├── docker-compose.yml   ✅ One-command deploy
└── README.md            ✅ Documentation