from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Favorite, NewsItem

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("/")
def get_favorites(db: Session = Depends(get_db)):
    favs = db.query(Favorite).all()
    result = []
    for fav in favs:
        item = fav.news_item
        if not item:
            continue
        result.append({
            "favorite_id": fav.id,
            "news_id":     item.id,
            "title":       item.title,
            "summary":     item.summary,
            "url":         item.url,
            "source":      item.source.name if item.source else "Unknown",
            "created_at":  fav.created_at,
        })
    return result


@router.post("/{news_id}")
def add_favorite(news_id: int, db: Session = Depends(get_db)):
    item = db.query(NewsItem).filter(NewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    existing = db.query(Favorite).filter(
        Favorite.news_item_id == news_id).first()
    if existing:
        return {"message": "Already in favorites!", "favorite_id": existing.id}
    fav = Favorite(news_item_id=news_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return {"message": "Added to favorites!", "favorite_id": fav.id}


@router.delete("/{favorite_id}")
def remove_favorite(favorite_id: int, db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites!"}