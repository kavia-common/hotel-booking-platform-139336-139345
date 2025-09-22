import React from 'react';

// PUBLIC_INTERFACE
export default function BookingsList({ bookings = [] }) {
  /** Lists existing bookings from localStorage. */
  if (!bookings.length) {
    return <div className="card" style={{ padding: 16 }}>No bookings yet.</div>;
  }

  return (
    <div className="hotel-list">
      {bookings.map((b) => (
        <article key={b.id} className="card hotel-card">
          <div className="hotel-card-header">
            <div className="hotel-card-title">{b.hotelName}</div>
            <div className="helper">
              {new Date(b.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="hotel-card-body">
            <div className="helper" style={{ marginBottom: 8 }}>
              {b.name} • {b.email}
            </div>
            <div style={{ marginBottom: 8 }}>
              {b.checkIn} → {b.checkOut} • {b.guests} guest(s)
            </div>
            <div className="badge">
              ${b.pricePerNight} / night
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
