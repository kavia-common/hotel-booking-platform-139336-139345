import React from 'react';

// PUBLIC_INTERFACE
export default function HotelList({ hotels = [], onSelect }) {
  /** Renders a simple grid of hotel summary cards. */
  if (!hotels.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        No hotels available. Try refreshing the page to re-seed data.
      </div>
    );
  }

  return (
    <div className="hotel-list">
      {hotels.map((h) => (
        <article key={h.id} className="card hotel-card">
          <div className="hotel-card-header">
            <div className="hotel-card-title">{h.name}</div>
            <div className="helper">
              {h.city} • ⭐ {h.rating}
            </div>
          </div>
          <div className="hotel-card-body">
            <div style={{ marginBottom: 8 }}>{h.description}</div>
            <div className="badge" style={{ marginBottom: 8 }}>
              <span>From</span> <span className="price">${h.pricePerNight}</span>
              <span>/night</span>
            </div>
            <div className="helper" style={{ marginBottom: 10 }}>
              Amenities: {h.amenities?.slice(0, 4)?.join(', ')}
            </div>
            <button className="btn" onClick={() => onSelect?.(h.id)}>
              View details
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
