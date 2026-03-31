import React from 'react';

function Navbar({ activePage, setActivePage }) {
  return (
    <nav style={{
      background: '#1e293b',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      gap: '24px'
    }}>
      <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>
        🤖 AI News Dashboard
      </span>

      <button
        onClick={() => setActivePage('news')}
        style={{
          background: activePage === 'news' ? '#2563eb' : 'transparent',
          color: 'white', border: 'none', padding: '6px 16px',
          borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
        }}>
        📰 News Feed
      </button>

      <button
        onClick={() => setActivePage('favorites')}
        style={{
          background: activePage === 'favorites' ? '#2563eb' : 'transparent',
          color: 'white', border: 'none', padding: '6px 16px',
          borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
        }}>
        ⭐ Favorites
      </button>
    </nav>
  );
}

export default Navbar;