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
            <h1 className="page-title">Find your next stay</h1>
            <div className="page-subtitle">Explore hotels with our Ocean Professional design.</div>

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
