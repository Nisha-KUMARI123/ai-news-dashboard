import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFav, setShowFav] = useState(false);

  // Fetch News
  const fetchNews = async () => {
    const res = await fetch("http://127.0.0.1:8000/news");
    const data = await res.json();
    setNews(data);
  };

  // Fetch Favorites
  const fetchFavorites = async () => {
    const res = await fetch("http://127.0.0.1:8000/favorites");
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    fetchNews();
    fetchFavorites();
  }, []);

  // Add to Favorites
  const addFavorite = async (id) => {
    await fetch(`http://127.0.0.1:8000/favorite/${id}`, {
      method: "POST",
    });
    alert("Added to favorites ❤️");
    fetchFavorites();
  };

  // Broadcast
  const broadcast = async () => {
    await fetch("http://127.0.0.1:8000/broadcast", {
      method: "POST",
    });
    alert("Broadcasted 🚀");
  };

  return (
    <div className="container">
      <h1>🧠 AI News Dashboard</h1>

      <div className="buttons">
        <button onClick={() => setShowFav(false)}>News</button>
        <button onClick={() => setShowFav(true)}>Favorites</button>
        <button onClick={broadcast}>Broadcast</button>
      </div>

      {!showFav ? (
        <div className="grid">
          {news.map((item) => (
            <div key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>{item.published}</p>

              <a href={item.link} target="_blank" rel="noreferrer">
                Read More
              </a>

              <button onClick={() => addFavorite(item.id)}>
                ⭐ Favorite
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid">
          {favorites.map((item) => (
            <div key={item.id} className="card">
              <h3>News ID: {item.news_id}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;