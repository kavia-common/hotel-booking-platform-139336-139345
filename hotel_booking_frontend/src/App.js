import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HotelList from './components/HotelList';
import HotelDetails from './components/HotelDetails';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';
import FilterBar from './components/FilterBar';

import hotelsSeed from './data/hotels.json';
import { initHotels, getHotels, getHotelById, addBooking, getBookings } from './utils/storage';

// Build filters into a reusable predicate for clarity
function buildHotelPredicate(filters) {
  const q = (filters?.query || '').trim().toLowerCase();
  const priceMax = Number.isFinite(filters?.priceMax) ? Number(filters.priceMax) : Number.MAX_SAFE_INTEGER;
  const ratings = filters?.ratings instanceof Set ? filters.ratings : new Set(filters?.ratings || []);
  const amenities = filters?.amenities instanceof Set ? filters.amenities : new Set(filters?.amenities || []);

  return (h) => {
    if (!h) return false;

    // price
    if (Number(h.pricePerNight || 0) > priceMax) return false;

    // query on name or city
    if (q) {
      const name = String(h.name || '').toLowerCase();
      const city = String(h.city || '').toLowerCase();
      if (!(name.includes(q) || city.includes(q))) return false;
    }

    // rating: any selected means "rating >= min selected" OR any matching bucket?
    // We'll interpret selected buckets as "rating >= chosen value" with OR semantics across buckets.
    if (ratings.size > 0) {
      let ok = false;
      for (const r of ratings) {
        if (Number(h.rating || 0) >= Number(r)) { ok = true; break; }
      }
      if (!ok) return false;
    }

    // amenities: require all selected amenities to be present
    if (amenities.size > 0) {
      const list = Array.isArray(h.amenities) ? h.amenities.map(a => String(a).trim()) : [];
      for (const a of amenities) {
        if (!list.includes(String(a).trim())) return false;
      }
    }

    return true;
  };
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimal view state management to avoid external router:
   * views: 'home' | 'details' | 'booking' | 'bookings'
   */
  const [view, setView] = useState('home');
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Filters state
  const [filters, setFilters] = useState({
    query: '',
    priceMax: undefined, // will be initialized via FilterBar
    ratings: new Set(),
    amenities: new Set(),
  });

  // seed hotels once
  useEffect(() => {
    initHotels(hotelsSeed);
    setBookings(getBookings());
  }, []);

  const hotels = useMemo(() => getHotels(), [view]); // re-read on view change to keep it simple
  const selectedHotel = useMemo(() => (selectedHotelId ? getHotelById(selectedHotelId) : null), [selectedHotelId]);

  const filteredHotels = useMemo(() => {
    const predicate = buildHotelPredicate(filters);
    return hotels.filter(predicate);
  }, [hotels, filters]);

  // navigation handlers
  const goHome = () => { setView('home'); setSelectedHotelId(null); };
  const goDetails = (id) => { setSelectedHotelId(id); setView('details'); };
  const goBooking = () => { setView('booking'); };
  const goBookings = () => { setView('bookings'); };

  // booking handler
  const handleBookingSubmit = (payload) => {
    const updated = addBooking(payload);
    setBookings(updated);
    // after confirming booking, go to bookings list
    goBookings();
  };

  return (
    <div className="App">
      <Header
        currentView={view === 'details' || view === 'booking' ? 'home' : view}
        onNavigate={(t) => (t === 'home' ? goHome() : goBookings())}
      />

      <main className="container page" role="main" aria-live="polite">
        {view === 'home' && (
          <>
            {/* Intro + Hero section */}
            <section
              className="card"
              style={{
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                marginBottom: 16,
                padding: 0
              }}
              aria-label="Welcome to Ocean Professional Hotel Booking"
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 0
                }}
              >
                {/* Intro copy block */}
                <div
                  style={{
                    padding: 16,
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(255,255,255,1))'
                  }}
                >
                  <div className="helper">Welcome</div>
                  <h1 className="page-title" style={{ marginTop: 2, marginBottom: 6 }}>
                    Your gateway to great stays
                  </h1>
                  <div className="page-subtitle" style={{ marginBottom: 12 }}>
                    Browse hand-picked hotels, compare amenities, and book instantly — all with data
                    stored locally for a fast, private experience.
                  </div>

                  {/* Feature highlights */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 10,
                      marginBottom: 12
                    }}
                    aria-label="Key features"
                  >
                    <div className="card" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Browse & filter</div>
                      <div className="helper">
                        Search by name or city, set price limits, pick ratings, and require amenities.
                      </div>
                    </div>
                    <div className="card" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>See details</div>
                      <div className="helper">
                        Each hotel has a dedicated details view with ratings, amenities, and pricing.
                      </div>
                    </div>
                    <div className="card" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Book instantly</div>
                      <div className="helper">
                        Fill a simple form — bookings are saved to your browser with no sign‑in.
                      </div>
                    </div>
                    <div className="card" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Local & private</div>
                      <div className="helper">
                        Data persists via localStorage; nothing leaves your device.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a href="#hotel-list" className="btn" onClick={(e) => { e.preventDefault(); document.getElementById('hotel-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                      Start Booking Now
                    </a>
                    <a href="#filters" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                      Adjust Filters
                    </a>
                  </div>
                </div>

                {/* Hero image adhering to theme aesthetics */}
                <div style={{ position: 'relative' }}>
                  <img
                    src="/assets/20250922_121848_istockphoto-840270072-1024x1024.jpg"
                    alt="Elegant hotel environment welcoming guests"
                    style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.45))'
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 16,
                      bottom: 14,
                      color: 'white',
                      textShadow: '0 2px 8px rgba(0,0,0,0.45)'
                    }}
                  >
                    <div className="helper" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      Ocean Professional
                    </div>
                    <div className="page-title" style={{ margin: 0, color: 'white', fontSize: 20 }}>
                      Find your next stay
                    </div>
                    <div className="helper" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
                      Explore hotels with our Ocean Professional design.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips & Testimonials section (Ocean Professional) */}
            <section
              className="card"
              style={{
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                marginBottom: 18,
                padding: 16,
                background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(255,255,255,1))'
              }}
              aria-label="Booking tips and testimonials"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 200 }}>
                  <div className="helper">Helpful insights</div>
                  <h2 className="page-title" style={{ marginTop: 2, marginBottom: 8 }}>Booking tips & testimonials</h2>
                  <div className="page-subtitle" style={{ marginBottom: 8 }}>
                    Make the most of your stay with quick tips from us and kind words from travelers.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href="#hotel-list" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); document.getElementById('hotel-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                    Browse Hotels
                  </a>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                  marginTop: 8
                }}
              >
                {/* Tips */}
                <article className="card" style={{ padding: 14, borderRadius: 12 }}>
                  <div className="badge" aria-hidden="true">💡 Tip</div>
                  <h3 style={{ margin: '8px 0 6px', fontSize: 16, fontWeight: 800 }}>Book in advance</h3>
                  <p className="helper" style={{ margin: 0 }}>
                    Book in advance for best rates! Prices tend to rise closer to popular dates.
                  </p>
                </article>

                <article className="card" style={{ padding: 14, borderRadius: 12 }}>
                  <div className="badge" aria-hidden="true">💡 Tip</div>
                  <h3 style={{ margin: '8px 0 6px', fontSize: 16, fontWeight: 800 }}>Use filters smartly</h3>
                  <p className="helper" style={{ margin: 0 }}>
                    Combine rating and amenities to quickly find the perfect match for your trip.
                  </p>
                </article>

                <article className="card" style={{ padding: 14, borderRadius: 12 }}>
                  <div className="badge" aria-hidden="true">💡 Tip</div>
                  <h3 style={{ margin: '8px 0 6px', fontSize: 16, fontWeight: 800 }}>Compare by location</h3>
                  <p className="helper" style={{ margin: 0 }}>
                    Search by city to explore neighborhoods and minimize travel time.
                  </p>
                </article>

                {/* Testimonials */}
                <article
                  className="card"
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: 'linear-gradient(180deg, rgba(37,99,235,0.04), rgba(255,255,255,1))',
                    borderColor: 'rgba(37,99,235,0.25)'
                  }}
                >
                  <figure style={{ margin: 0 }}>
                    <blockquote
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: '#111827',
                        lineHeight: 1.6
                      }}
                    >
                      “This platform made booking a breeze — from filters to checkout, everything was smooth.”
                    </blockquote>
                    <figcaption className="helper" style={{ marginTop: 8 }}>
                      — Anna N.
                    </figcaption>
                  </figure>
                </article>

                <article
                  className="card"
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: 'linear-gradient(180deg, rgba(245,158,11,0.08), rgba(255,255,255,1))',
                    borderColor: 'rgba(245,158,11,0.35)'
                  }}
                >
                  <figure style={{ margin: 0 }}>
                    <blockquote
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: '#111827',
                        lineHeight: 1.6
                      }}
                    >
                      “I loved how fast it is. My picks stayed saved locally even after a reload!”
                    </blockquote>
                    <figcaption className="helper" style={{ marginTop: 8 }}>
                      — Marco R.
                    </figcaption>
                  </figure>
                </article>
              </div>
            </section>

            <div className="layout-grid">
              <FilterBar
                hotels={hotels}
                value={filters}
                onChange={setFilters}
                className="layout-sidebar"
              />
              <div className="layout-content">
                {filteredHotels.length === 0 ? (
                  <div className="card empty-state" role="status" style={{ padding: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                      No matching hotels found
                    </div>
                    <div className="helper">
                      Try adjusting your search or filters.
                    </div>
                  </div>
                ) : (
                  <HotelList hotels={filteredHotels} onSelect={goDetails} />
                )}
              </div>
            </div>
          </>
        )}

        {view === 'details' && selectedHotel && (
          <>
            <HotelDetails hotel={selectedHotel} onBack={goHome} onBook={goBooking} />
          </>
        )}

        {view === 'booking' && selectedHotel && (
          <>
            <BookingForm hotel={selectedHotel} onSubmit={handleBookingSubmit} onCancel={goDetails.bind(null, selectedHotel.id)} />
          </>
        )}

        {view === 'bookings' && (
          <>
            <h1 className="page-title">Your bookings</h1>
            <div className="page-subtitle">All your bookings are stored locally in your browser.</div>
            <BookingsList bookings={bookings} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
