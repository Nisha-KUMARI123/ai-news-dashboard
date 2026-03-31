from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import NewsItem, Source
from fetcher import fetch_all_news
from datetime import datetime

router = APIRouter(prefix="/news", tags=["News"])


@router.get("/")
def get_news(db: Session = Depends(get_db)):
    """Return all news items from DB"""
    items = db.query(NewsItem).filter(
        NewsItem.is_duplicate == False
    ).order_by(NewsItem.published_at.desc()).limit(50).all()

    return [
        {
            "id":           item.id,
            "title":        item.title,
            "summary":      item.summary,
            "url":          item.url,
            "author":       item.author,
            "published_at": item.published_at,
            "source":       item.source.name if item.source else "Unknown",
        }
        for item in items
    ]


@router.post("/fetch")
def fetch_and_store(db: Session = Depends(get_db)):
    """Fetch fresh news from all sources and save to DB"""
    articles = fetch_all_news()
    saved = 0
    skipped = 0

    for article in articles:
        # Check if URL already exists (basic dedup)
        exists = db.query(NewsItem).filter(
            NewsItem.url == article["url"]
        ).first()

        if exists:
            skipped += 1
            continue

        # Get or create source
        source = db.query(Source).filter(
            Source.name == article["source_name"]
        ).first()

        if not source:
            source = Source(
                name=article["source_name"],
                url="",
                type="rss",
                active=True
            )
            db.add(source)
            db.flush()

        # Save news item
        news_item = NewsItem(
            source_id=    source.id,
            title=        article["title"],
            summary=      article["summary"],
            url=          article["url"],
            author=       article["author"],
            published_at= article["published_at"],
            is_duplicate= False,
        )
        db.add(news_item)
        saved += 1

    db.commit()
    return {
        "message": f"Done! Saved: {saved}, Skipped (duplicates): {skipped}"
    }