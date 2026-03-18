import feedparser

def fetch_news():
    sources = [
        "https://openai.com/blog/rss",
        "https://techcrunch.com/tag/artificial-intelligence/feed/"
    ]

    news_list = []

    for url in sources:
        feed = feedparser.parse(url)

        for entry in feed.entries:
            news_list.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": entry.get("published", "")
            })

    return news_list