import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function Favorites() {
  const [favs, setFavs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState('');

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/favorites/`);
      setFavs(res.data);
    } catch (e) { showToast('❌ Could not load favorites'); }
    setLoading(false);
  };

  const removeFavorite = async (favId) => {
    try {
      await axios.delete(`${API}/favorites/${favId}`);
      showToast('🗑️ Removed!');
      fetchFavorites();
    } catch (e) { showToast('❌ Could not remove'); }
  };

  const broadcast = async (favId, platform) => {
    try {
      const res = await axios.post(`${API}/broadcast/${platform}/${favId}`);
      showToast(`✅ ${res.data.message}`);
    } catch (e) { showToast(`❌ Failed`); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  if (loading) return <div className="empty-state">⏳ Loading...</div>;

  return (
    <div>
      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{favs.length}</div>
          <div className="stat-label">Saved Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {new Set(favs.map(f => f.source)).size}
          </div>
          <div className="stat-label">Sources</div>
        </div>
      </div>

      <div className="page-header">
        <h2>⭐ My Favorites</h2>
        <button className="btn btn-primary" onClick={fetchFavorites}>
          🔄 Refresh
        </button>
      </div>

      {favs.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 40 }}>⭐</p>
          <p style={{ marginTop: 12 }}>No favorites yet!</p>
          <p style={{ marginTop: 8, fontSize: 14 }}>
            Go to News Feed and click ⭐ on any article.
          </p>
        </div>
      ) : (
        favs.map(fav => (
          <div key={fav.favorite_id} className="card"
            style={{ borderLeftColor: '#f59e0b' }}>
            <div className="card-meta">
              <span className="source-badge">{fav.source}</span>
              <span className="date-text">
                Saved {new Date(fav.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 dangerouslySetInnerHTML={{ __html: fav.title }} />
            <p>{fav.summary?.slice(0, 180)}
              {fav.summary?.length > 180 ? '...' : ''}
            </p>
            <div className="card-actions">
              <button className="btn btn-primary"
                onClick={() => broadcast(fav.favorite_id, 'email')}>
                📧 Email
              </button>
              <button className="btn btn-linkedin"
                onClick={() => broadcast(fav.favorite_id, 'linkedin')}>
                💼 LinkedIn
              </button>
              <button className="btn btn-whatsapp"
                onClick={() => broadcast(fav.favorite_id, 'whatsapp')}>
                💬 WhatsApp
              </button>
              <button className="btn btn-danger"
                onClick={() => removeFavorite(fav.favorite_id)}>
                🗑️ Remove
              </button>
            </div>
          </div>
        ))
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Favorites;