from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI News Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import news, favorites, broadcast
app.include_router(news.router)
app.include_router(favorites.router)
app.include_router(broadcast.router)

@app.get("/")
def root():
    return {"message": "AI News Dashboard Running"}