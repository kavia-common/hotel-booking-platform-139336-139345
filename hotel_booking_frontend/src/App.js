import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HotelList from './components/HotelList';
import HotelDetails from './components/HotelDetails';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';

import hotelsSeed from './data/hotels.json';
import { initHotels, getHotels, getHotelById, addBooking, getBookings } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimal view state management to avoid external router:
   * views: 'home' | 'details' | 'booking' | 'bookings'
   */
  const [view, setView] = useState('home');
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [bookings, setBookings] = useState([]);

  // seed hotels once
  useEffect(() => {
    initHotels(hotelsSeed);
    setBookings(getBookings());
  }, []);

  const hotels = useMemo(() => getHotels(), [view]); // re-read on view change to keep it simple
  const selectedHotel = useMemo(() => (selectedHotelId ? getHotelById(selectedHotelId) : null), [selectedHotelId]);

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
            <HotelList hotels={hotels} onSelect={goDetails} />
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
