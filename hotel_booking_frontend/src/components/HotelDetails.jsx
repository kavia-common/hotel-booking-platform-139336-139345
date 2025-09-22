import React from 'react';

// PUBLIC_INTERFACE
export default function HotelDetails({ hotel, onBack, onBook }) {
  /** Renders details for a selected hotel. */
  if (!hotel) return null;

  return (
    <div className="surface" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>{hotel.name}</h2>
          <div className="helper">{hotel.city} • ⭐ {hotel.rating}</div>
        </div>
        <div className="badge">
          From <span className="price">${hotel.pricePerNight}</span> /night
        </div>
      </div>

      <p style={{ marginTop: 16 }}>{hotel.description}</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {hotel.amenities?.map((a) => (
          <span key={a} className="badge">{a}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn" onClick={() => onBook?.(hotel)}>Book now</button>
        <button className="btn btn-ghost" onClick={onBack}>Back to list</button>
      </div>
    </div>
  );
}
