# Hotel Booking Frontend (Ocean Professional)

A lightweight React frontend for browsing hotels, viewing details, and making bookings with data stored in the browser (localStorage). No external UI libraries, built for clarity and easy extension.

## Quick start

- `npm start` — run the app locally
- `npm test` — run tests
- `npm run build` — production build

## How it works

- Uses a local `src/data/hotels.json` seed loaded into `localStorage` on first run.
- Minimal navigation (no react-router): app state controls "views" (home, details, booking, bookings).
- Ocean Professional theme via CSS variables in `src/styles/theme.css`.

## Structure

- `src/components/` foundational UI (Header, Footer, HotelList, HotelDetails, BookingForm, BookingsList)
- `src/utils/storage.js` localStorage helpers for hotels and bookings
- `src/data/hotels.json` initial data seed

## Theming

Primary: `#2563EB` (blue)  
Secondary: `#F59E0B` (amber)  
Error: `#EF4444`  
Background: `#f9fafb`  
Surface: `#ffffff`  
Text: `#111827`

Update variables in `src/styles/theme.css` to customize.
