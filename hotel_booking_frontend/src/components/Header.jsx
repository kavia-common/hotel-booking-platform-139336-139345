import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ currentView, onNavigate }) {
  /** Minimal header with brand and simple navigation buttons. */
  return (
    <header className="app-header">
      <div className="container app-header-inner">
        <div className="brand">
          <div className="brand-logo">🏨</div>
          Hotel Booking
        </div>
        <nav className="nav" aria-label="Main">
          <button
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Hotels
          </button>
          <button
            className={`nav-btn ${currentView === 'bookings' ? 'active' : ''}`}
            onClick={() => onNavigate('bookings')}
          >
            Bookings
          </button>
        </nav>
      </div>
    </header>
  );
}
