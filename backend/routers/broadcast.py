from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Favorite, BroadcastLog

router = APIRouter(prefix="/broadcast", tags=["Broadcast"])


def _get_fav(favorite_id, db):
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return fav


def _log(db, favorite_id, platform):
    db.add(BroadcastLog(favorite_id=favorite_id,
           platform=platform, status="success"))
    db.commit()


@router.post("/email/{favorite_id}")
def broadcast_email(favorite_id: int, db: Session = Depends(get_db)):
    fav = _get_fav(favorite_id, db)
    item = fav.news_item
    _log(db, favorite_id, "email")
    return {
        "message":  "Email sent! (simulated)",
        "platform": "email",
        "subject":  f"AI News: {item.title[:60]}",
        "preview":  item.summary[:150] if item.summary else "",
    }


@router.post("/linkedin/{favorite_id}")
def broadcast_linkedin(favorite_id: int, db: Session = Depends(get_db)):
    fav = _get_fav(favorite_id, db)
    item = fav.news_item
    _log(db, favorite_id, "linkedin")
    return {
        "message":  "Posted to LinkedIn! (simulated)",
        "platform": "linkedin",
        "caption":  f"🤖 {item.title}\n\n{item.summary[:200] if item.summary else ''}\n\n#AI #ML",
    }


@router.post("/whatsapp/{favorite_id}")
def broadcast_whatsapp(favorite_id: int, db: Session = Depends(get_db)):
    fav = _get_fav(favorite_id, db)
    item = fav.news_item
    _log(db, favorite_id, "whatsapp")
    return {
        "message":  "Sent to WhatsApp! (simulated)",
        "platform": "whatsapp",
        "text":     f"📰 *{item.title}*\n\n{item.summary[:200] if item.summary else ''}\n\n🔗 {item.url}",
    }


@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(BroadcastLog).order_by(
        BroadcastLog.timestamp.desc()).all()
    return [{"id": l.id, "platform": l.platform,
             "status": l.status, "timestamp": l.timestamp,
             "favorite_id": l.favorite_id} for l in logs]