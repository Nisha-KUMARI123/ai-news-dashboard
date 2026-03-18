from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from fetcher import fetch_news
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (good for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "AI News Dashboard Running"}

@app.get("/fetch-news")
def fetch_and_store(db: Session = Depends(get_db)):
    news_data = fetch_news()

    for item in news_data:
        exists = db.query(models.News).filter(models.News.link == item["link"]).first()
        if not exists:
            new_news = models.News(
                title=item["title"],
                link=item["link"],
                published=item["published"]
            )
            db.add(new_news)

    db.commit()
    return {"message": "News fetched and stored"}

@app.get("/news")
def get_news(db: Session = Depends(get_db)):
    return db.query(models.News).all()

@app.post("/favorite/{news_id}")
def add_favorite(news_id: int, db: Session = Depends(get_db)):
    fav = models.Favorite(news_id=news_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}

@app.get("/favorites")
def get_favorites(db: Session = Depends(get_db)):
    return db.query(models.Favorite).all()

@app.post("/broadcast")
def broadcast():
    return {"message": "Broadcasted (mock)"}