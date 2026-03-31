import React, { useState, useEffect } from 'react';
import NewsFeed from './pages/NewsFeed';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('news');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-brand">🤖 AI News</span>

        <button
          className={`nav-btn ${activePage === 'news' ? 'active' : ''}`}
          onClick={() => setActivePage('news')}>
          📰 News Feed
        </button>

        <button
          className={`nav-btn ${activePage === 'favorites' ? 'active' : ''}`}
          onClick={() => setActivePage('favorites')}>
          ⭐ Favorites
        </button>

        <div className="nav-spacer" />

        <button className="dark-toggle" onClick={() => setDark(!dark)}>
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Pages */}
      <div className="content">
        {activePage === 'news'      && <NewsFeed />}
        {activePage === 'favorites' && <Favorites />}
      </div>
    </div>
  );
}

export default App;