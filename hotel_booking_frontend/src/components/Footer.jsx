import React from 'react';

// PUBLIC_INTERFACE
export default function Footer() {
  /** Simple footer with brand colors. */
  return (
    <footer className="app-footer">
      <div className="container app-footer-inner">
        <div>
          © {new Date().getFullYear()} Ocean Professional — Hotel Booking.
          <span className="helper"> Built with React and localStorage.</span>
        </div>
      </div>
    </footer>
  );
}
