from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    type = Column(String)          # rss / api / scrape
    active = Column(Boolean, default=True)

class NewsItem(Base):
    __tablename__ = "news_items"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"))
    title = Column(String, nullable=False)
    summary = Column(Text)
    url = Column(String, unique=True)
    author = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow)
    tags = Column(String)
    is_duplicate = Column(Boolean, default=False)

    source = relationship("Source")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    news_item_id = Column(Integer, ForeignKey("news_items.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    news_item = relationship("NewsItem")

class BroadcastLog(Base):
    __tablename__ = "broadcast_logs"

    id = Column(Integer, primary_key=True, index=True)
    favorite_id = Column(Integer, ForeignKey("favorites.id"))
    platform = Column(String)      # email / linkedin / whatsapp
    status = Column(String)        # success / failed
    timestamp = Column(DateTime, default=datetime.utcnow)