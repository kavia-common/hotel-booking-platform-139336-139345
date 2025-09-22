import React from 'react';

/**
 * Renders an accessible, responsive grid of hotel cards following the Ocean Professional theme.
 * Cards include image, name, city, rating, price, amenities badges, and actions.
 */

// PUBLIC_INTERFACE
export default function HotelList({ hotels = [], onSelect }) {
  /** Renders a visually polished grid of hotel cards with responsive layout and a11y. */
  if (!hotels.length) {
    return (
      <div
        className="card empty-state"
        role="status"
        aria-live="polite"
        style={{ padding: 20, textAlign: 'center' }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          No hotels available
        </div>
        <div className="helper">
          Try refreshing the page to re-seed data or come back later.
        </div>
      </div>
    );
  }

  const handleKeyActivate = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <section
      id="hotel-list"
      className="hotel-list"
      aria-label="Available hotels"
      role="list"
    >
      {hotels.map((h) => {
        const badgeAmenities = Array.isArray(h.amenities) ? h.amenities.slice(0, 4) : [];
        const star = '⭐';
        const imgAlt =
          h.imageAlt ||
          `Photo of ${h.name} in ${h.city}${h.rating ? ` rated ${h.rating} stars` : ''}`;

        return (
          <article
            key={h.id}
            className="card hotel-card"
            role="listitem"
          >
            <div
              className="hotel-card-media"
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(h.id)}
              onKeyDown={(e) => handleKeyActivate(e, h.id)}
              aria-label={`View ${h.name} details`}
            >
              <img
                src={h.image || `https://picsum.photos/seed/${encodeURIComponent(h.id)}/640/420`}
                alt={imgAlt}
                className="hotel-card-img"
                loading="lazy"
              />
              <div className="hotel-card-media-overlay">
                <div className="overlay-price">
                  <span className="helper">From</span>
                  <span className="price">${h.pricePerNight}</span>
                  <span className="helper">/night</span>
                </div>
              </div>
            </div>

            <div className="hotel-card-content">
              <div className="hotel-card-top">
                <div>
                  <h3 className="hotel-card-title">{h.name}</h3>
                  <div className="helper">
                    {h.city}
                    {h.rating ? ` • ${star} ${h.rating}` : ''}
                  </div>
                </div>
              </div>

              {h.description ? (
                <p className="hotel-card-desc">{h.description}</p>
              ) : null}

              {badgeAmenities.length > 0 ? (
                <div className="hotel-card-badges" aria-label="Amenities">
                  {badgeAmenities.map((a) => (
                    <span key={a} className="badge" aria-label={a}>
                      {a}
                    </span>
                  ))}
                  {Array.isArray(h.amenities) && h.amenities.length > badgeAmenities.length ? (
                    <span className="badge" aria-label="More amenities">+{h.amenities.length - badgeAmenities.length}</span>
                  ) : null}
                </div>
              ) : null}

              <div className="hotel-card-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => onSelect?.(h.id)}
                  aria-label={`View details of ${h.name}`}
                >
                  View Details
                </button>
                <button
                  className="btn"
                  onClick={() => onSelect?.(h.id)}
                  aria-label={`Book ${h.name}`}
                >
                  Book
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
