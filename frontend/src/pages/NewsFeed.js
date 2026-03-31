import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

const SOURCE_ICONS = {
  'OpenAI Blog': '🧠', 'Google AI Blog': '🔍', 'DeepMind Blog': '🤖',
  'Anthropic Blog': '🌟', 'Hugging Face Blog': '🤗', 'TechCrunch AI': '📱',
  'VentureBeat AI': '💼', 'Wired AI': '⚡', 'MIT Tech Review AI': '🎓',
  'The Verge AI': '📡', 'arXiv CS.AI': '📄', 'arXiv CS.LG': '📊',
  'Microsoft AI Blog': '💻', 'Meta AI Blog': '👥', 'KDnuggets': '📈',
  'Towards Data Science': '🔬', 'Import AI': '📬', 'Stability AI': '🎨',
  'The Batch (DeepLearning.AI)': '🎯', 'Ars Technica AI': '🔧',
};

function NewsCard({ item, onFavorite }) {
  const icon = SOURCE_ICONS[item.source] || '📰';
  return (
    <div className="card">
      <div className="card-top">
        <div className="card-image">{icon}</div>
        <div className="card-body">
          <div className="card-meta">
            <span className="source-badge">{item.source}</span>
            <span className="date-text">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
            {item.author && item.author !== 'Unknown' &&
              <span className="date-text">✍️ {item.author}</span>}
          </div>
          <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
          <p>{item.summary?.slice(0, 180)}{item.summary?.length > 180 ? '...' : ''}</p>
          <div className="card-actions">
            <button className="btn btn-warning"
              onClick={() => onFavorite(item.id, item.title)}>
              ⭐ Favorite
            </button>
            <a href={item.url} target="_blank" rel="noreferrer"
              className="btn btn-primary">
              🔗 Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsFeed() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [source, setSource]   = useState('All');
  const [toast, setToast]     = useState('');

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/news/`);
      setNews(res.data);
    } catch (e) {
      showToast('❌ Could not load news');
    }
    setLoading(false);
  };

  const refreshNews = async () => {
    showToast('⏳ Fetching latest news...');
    try {
      const res = await axios.post(`${API}/news/fetch`);
      showToast('✅ ' + res.data.message);
      fetchNews();
    } catch (e) { showToast('❌ Fetch failed'); }
  };

  const addFavorite = async (newsId) => {
    try {
      await axios.post(`${API}/favorites/${newsId}`);
      showToast('⭐ Added to favorites!');
    } catch (e) { showToast('❌ Could not save favorite'); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // All unique sources for dropdown
  const sources = useMemo(() => {
    const s = [...new Set(news.map(n => n.source))].sort();
    return ['All', ...s];
  }, [news]);

  // Filtered news
  const filtered = useMemo(() => {
    return news.filter(item => {
      const matchSearch = item.title?.toLowerCase()
        .includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase());
      const matchSource = source === 'All' || item.source === source;
      return matchSearch && matchSource;
    });
  }, [news, search, source]);

  // Stats
  const uniqueSources = new Set(news.map(n => n.source)).size;
  const today = news.filter(n => {
    const d = new Date(n.published_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  if (loading) return <div className="empty-state">⏳ Loading news...</div>;

  return (
    <div>
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{news.length}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{uniqueSources}</div>
          <div className="stat-label">Sources</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{today}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filtered.length}</div>
          <div className="stat-label">Showing</div>
        </div>
      </div>

      {/* Header */}
      <div className="page-header">
        <h2>📰 AI News Feed</h2>
        <button className="btn btn-primary" onClick={refreshNews}>
          🔄 Refresh
        </button>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="🔍 Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select"
          value={source} onChange={e => setSource(e.target.value)}>
          {sources.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* News Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">No articles match your search.</div>
      ) : (
        filtered.map(item => (
          <NewsCard key={item.id} item={item} onFavorite={addFavorite} />
        ))
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default NewsFeed;