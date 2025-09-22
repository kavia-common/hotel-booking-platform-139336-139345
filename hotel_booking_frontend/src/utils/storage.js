/**
 * Utilities for initializing and interacting with localStorage-backed data.
 * Stores: 'hb_hotels' and 'hb_bookings'
 */

const HOTELS_KEY = 'hb_hotels';
const BOOKINGS_KEY = 'hb_bookings';

// PUBLIC_INTERFACE
export function initHotels(seed) {
  /** Initialize hotels dataset in localStorage if not present. */
  try {
    const existing = localStorage.getItem(HOTELS_KEY);
    if (!existing) {
      localStorage.setItem(HOTELS_KEY, JSON.stringify(seed || []));
    }
  } catch (e) {
    // In very restricted environments, localStorage may be blocked
    // We intentionally swallow the error to keep app functional.
    // Consumers should handle empty results.
    // eslint-disable-next-line no-console
    console.warn('localStorage not available or blocked:', e?.message);
  }
}

// PUBLIC_INTERFACE
export function getHotels() {
  /** Get hotels array from localStorage (or [] if unavailable). */
  try {
    const raw = localStorage.getItem(HOTELS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function getHotelById(id) {
  /** Get a single hotel by id. */
  return getHotels().find(h => h.id === id) || null;
}

// PUBLIC_INTERFACE
export function getBookings() {
  /** Get all bookings from localStorage. */
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function addBooking(booking) {
  /** Add a booking and return the updated bookings list. */
  const list = getBookings();
  const withId = {
    id: `b_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...booking
  };
  const next = [withId, ...list];
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
