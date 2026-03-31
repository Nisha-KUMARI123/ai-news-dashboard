import feedparser
import requests
from datetime import datetime

# 20 AI News RSS Sources
RSS_SOURCES = [
    {"name": "OpenAI Blog",        "url": "https://openai.com/blog/rss.xml"},
    {"name": "Google AI Blog",     "url": "https://blog.research.google/feeds/posts/default"},
    {"name": "DeepMind Blog",      "url": "https://deepmind.google/blog/rss.xml"},
    {"name": "Anthropic Blog",     "url": "https://www.anthropic.com/rss.xml"},
    {"name": "Hugging Face Blog",  "url": "https://huggingface.co/blog/feed.xml"},
    {"name": "TechCrunch AI",      "url": "https://techcrunch.com/category/artificial-intelligence/feed/"},
    {"name": "VentureBeat AI",     "url": "https://venturebeat.com/category/ai/feed/"},
    {"name": "Wired AI",           "url": "https://www.wired.com/feed/tag/ai/latest/rss"},
    {"name": "MIT Tech Review AI", "url": "https://www.technologyreview.com/feed/"},
    {"name": "The Verge AI",       "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"},
    {"name": "Ars Technica AI",    "url": "https://feeds.arstechnica.com/arstechnica/technology-lab"},
    {"name": "Microsoft AI Blog",  "url": "https://blogs.microsoft.com/ai/feed/"},
    {"name": "Meta AI Blog",       "url": "https://ai.meta.com/blog/rss/"},
    {"name": "Stability AI",       "url": "https://stability.ai/blog/rss.xml"},
    {"name": "arXiv CS.AI",        "url": "https://rss.arxiv.org/rss/cs.AI"},
    {"name": "arXiv CS.LG",        "url": "https://rss.arxiv.org/rss/cs.LG"},
    {"name": "Towards Data Science","url": "https://towardsdatascience.com/feed"},
    {"name": "KDnuggets",          "url": "https://www.kdnuggets.com/feed"},
    {"name": "Import AI",          "url": "https://importai.substack.com/feed"},
    {"name": "The Batch (DeepLearning.AI)", "url": "https://www.deeplearning.ai/the-batch/feed/"},
]

def fetch_all_news():
    """Fetch news from all RSS sources and return as list of dicts"""
    all_news = []

    for source in RSS_SOURCES:
        print(f"Fetching: {source['name']}...")
        try:
            feed = feedparser.parse(source["url"])
            for entry in feed.entries[:5]:  # Max 5 articles per source
                news = {
                    "source_name": source["name"],
                    "title":       entry.get("title", "No Title"),
                    "summary":     entry.get("summary", "")[:500],  # Limit length
                    "url":         entry.get("link", ""),
                    "author":      entry.get("author", "Unknown"),
                    "published_at": _parse_date(entry),
                }
                all_news.append(news)
        except Exception as e:
            print(f"  ❌ Failed {source['name']}: {e}")

    print(f"\n✅ Total articles fetched: {len(all_news)}")
    return all_news


def _parse_date(entry):
    """Safely parse date from feed entry"""
    try:
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            return datetime(*entry.published_parsed[:6])
    except:
        pass
    return datetime.utcnow()