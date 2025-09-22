# Business Requirement Specification (BRS) — Hotel Booking Frontend

## Business Objectives

The hotel booking frontend aims to provide a simple, responsive, and accessible browser-based experience to browse hotels, view details, filter by preferences, and create bookings with data persisted locally in the user’s browser. The project intentionally operates without a backend service, focusing on rapid prototyping, offline-friendly usability, and a clear modular structure that can later be extended to integrate with real APIs.

Primary objectives:
- Enable users to discover hotels through searching and filtering, including price, ratings, and amenities.
- Allow users to view hotel details and create a booking for their chosen hotel.
- Persist hotel seed data and created bookings locally using localStorage, supporting basic offline usability.
- Provide a modern, consistent UI using the Ocean Professional theme for clarity and quick adoption.

Success will be measured by:
- Users can find relevant hotels via search and filters and complete a booking flow within a few clicks.
- Bookings created are reliably persisted and visible in a dedicated Bookings list.
- The UI remains usable and responsive across common screen sizes and keyboard accessible for core actions.

## Scope

This BRS covers the frontend-only implementation for hotel browsing, viewing details, and creating bookings, with data persistence handled exclusively in the browser via localStorage. The application uses a local JSON file as the data seed and does not perform any network I/O to external services.

In-scope:
- Displaying a list of hotels with core details (name, city, rating, amenities, price per night).
- Client-side filtering by query, price maximum, star rating thresholds, and amenities.
- Viewing individual hotel details and initiating a booking.
- Submitting a booking via a form and storing it locally.
- Viewing all created bookings in a dedicated list.
- Styling and theming using Ocean Professional theme variables.

Out-of-scope is listed in detail under “Out-of-Scope.”

## Key Features

- Hotel browsing
  - Shows hotels in a responsive card grid with image, location, rating, price, and badges for amenities.
  - Offers keyboard activation and accessible labels for card actions.

- Search and filtering
  - Search by name or location (free-text).
  - Adjust maximum price per night with a slider.
  - Select minimum star rating thresholds (e.g., 5, 4.5, 4, 3.5, 3).
  - Select amenities (multi-select, “require all selected” semantics).
  - Reset filters to defaults.

- Hotel details
  - Dedicated details view with name, city, rating, price, description, and amenities.
  - Actions include “Book now” and “Back to list.”

- Booking flow
  - Booking form collects full name, email, dates (check-in/check-out), and guests.
  - Successful submission creates a booking and navigates to “Your bookings.”

- Bookings list
  - Dedicated view showing a list of previously created bookings with summary information and created time.

- Data persistence
  - On first run, hotels are seeded from local JSON into localStorage.
  - Bookings are added to localStorage and retrieved on app load.

## User Roles and Personas

- Guest User (primary persona)
  - Goal: Discover hotels, filter results, view details, and make a booking quickly with minimal friction.
  - Behaviors: Uses simple search and filters, expects fast response and mobile-friendly design, may revisit Bookings to confirm details.
  - Accessibility: May rely on keyboard navigation, readable labels, and clear focus states.

No authentication or role-based access controls are implemented in this frontend-only scope.

## Primary User Stories & Acceptance Criteria

### 1. Browse hotels
As a guest user, I want to see a list of available hotels so I can explore options.

Acceptance Criteria:
- Hotels are displayed in a responsive grid of cards with image, name, city, rating (if available), and price per night.
- If no hotels are available, an empty state is shown with guidance to refresh or try later.
- Each hotel card provides actions to view details and start booking.
- Cards are keyboard-accessible, allowing activation via Enter/Space for details.

References: src/components/HotelList.jsx, src/styles/theme.css

### 2. Search by name or location
As a guest user, I want to search by hotel name or city so I can quickly find relevant stays.

Acceptance Criteria:
- A search input is present in the filter sidebar.
- Filtering applies case-insensitive substring match to hotel name and city.
- The results update as the search query changes.
- Clearing the query restores the full list (subject to other filters).

References: src/components/FilterBar.jsx, buildHotelPredicate in src/App.js

### 3. Filter by maximum price
As a guest user, I want to set a maximum price per night so that hotels exceeding my budget are hidden.

Acceptance Criteria:
- A price slider displays the current selected maximum price and updates live.
- Only hotels with pricePerNight less than or equal to the selected maximum are shown.
- Resetting filters restores the maximum to the dataset’s max or default.

References: src/components/FilterBar.jsx, buildHotelPredicate in src/App.js

### 4. Filter by minimum rating
As a guest user, I want to filter hotels by star rating thresholds so I can see higher-rated options first.

Acceptance Criteria:
- Rating options are represented as checkboxes (e.g., 5, 4.5, 4, 3.5, 3).
- If one or more thresholds are selected, a hotel matches if its rating is greater than or equal to any selected threshold (OR semantics across thresholds).
- Clearing all rating selections removes rating filtering.

References: src/components/FilterBar.jsx, buildHotelPredicate in src/App.js

### 5. Filter by amenities
As a guest user, I want to select amenities so I only see hotels that include all of my chosen amenities.

Acceptance Criteria:
- Amenities are presented as a dynamic, data-driven list of checkboxes.
- If one or more amenities are selected, a hotel matches only if it includes all selected amenities (AND semantics for amenities).
- Clearing amenities removes this filter.
- The amenities list is derived from the dataset.

References: src/components/FilterBar.jsx, src/data/hotels.json, buildHotelPredicate in src/App.js

### 6. View hotel details
As a guest user, I want to view full details for a hotel so I can decide whether to book it.

Acceptance Criteria:
- Details view shows hotel name, city, rating, amenities, description, and price per night.
- The page provides “Book now” and “Back to list” actions.
- The app manages navigation state without a router.

References: src/components/HotelDetails.jsx, src/App.js

### 7. Make a booking
As a guest user, I want to submit a booking with my contact info and dates so my reservation is recorded.

Acceptance Criteria:
- The booking form requires name, email, check-in, and check-out fields; guests defaults to 1.
- On submission, a booking is created with a unique id and timestamp, and saved to localStorage.
- After successful submission, the app navigates to the Bookings list.
- If required fields are missing, the form does not submit.

References: src/components/BookingForm.jsx, src/utils/storage.js (addBooking), src/App.js

### 8. View my bookings
As a guest user, I want to see a list of my bookings so I can confirm the details.

Acceptance Criteria:
- The Bookings view shows the hotel name, created time, user details, stay dates, guests, and price per night.
- If there are no bookings, an empty state message is displayed.
- Bookings persist across page reloads using localStorage.

References: src/components/BookingsList.jsx, src/utils/storage.js (getBookings)

### 9. Manage filters easily
As a guest user, I want to reset all filters so I can start a new search quickly.

Acceptance Criteria:
- A Reset action clears query, rating, amenities, and restores maximum price to default.
- The hotel list updates immediately after reset.

References: src/components/FilterBar.jsx

## Non-functional Requirements

### Usability and Accessibility
- Keyboard accessibility: Card actions and interactive controls support keyboard focus and activation (Enter/Space where appropriate).
- Labels and helper text: Inputs include labels and helper descriptions to aid screen reader users.
- Focus styles: Focus-visible states are visually discernible for interactive components.
- Color contrast: Theme aims for sufficient contrast; avoid relying solely on color for meaning.

References: src/components/HotelList.jsx, src/components/FilterBar.jsx, src/styles/theme.css

### Performance and Responsiveness
- Responsive layout: The grid adapts to various viewport sizes; the sidebar becomes a single-column layout on narrow screens.
- Efficient rendering: Filters are computed on the client; datasets are small and seed-based to keep interactions fluid.
- Lazy image loading where applicable (hotel images use loading="lazy").

References: src/components/HotelList.jsx, src/styles/theme.css

### Offline Usability and Resilience
- Data persistence: localStorage retains hotels and bookings across reloads and offline sessions.
- Graceful degradation: If localStorage is blocked, the app continues to function with empty results and console warnings; features reliant on storage will be limited.

References: src/utils/storage.js

### Maintainability and Extensibility
- Modular components: Clear separation of concerns (Header, Footer, HotelList, HotelDetails, BookingForm, BookingsList, FilterBar).
- Theming: Centralized variables in theme.css for easy re-skinning.
- Routerless view state to minimize dependencies and keep navigation logic explicit.

References: src/components/*, src/styles/theme.css, src/App.js

## Assumptions & Constraints

- Frontend-only: There is no backend API; no user accounts or server-side persistence.
- Local data seed: hotels.json provides initial data that is seeded into localStorage on first run.
- Persistence: All bookings are stored in localStorage under a dedicated key; data is device- and browser-specific.
- No external UI libraries: Styling is done via CSS with the Ocean Professional theme.
- Minimal navigation: No react-router; views are controlled via in-app state.
- Limited data integrity: No real-time availability checks, pricing updates, or conflict detection beyond basic form validation.

## Out-of-Scope

- User authentication, profiles, and role management.
- Payment processing, pricing rules, taxes, fees, or promotions.
- Real-time inventory management or calendar availability checks.
- Backend integration, server-side rendering, or API communication.
- Email confirmations, notifications, or external messaging.
- Multi-language support and localization.
- Advanced analytics or tracking.

## Glossary

- Ocean Professional theme: The design system/colors used across the app as defined in src/styles/theme.css.
- Booking: A locally stored record containing user info, hotel reference, stay dates, guests, and metadata.
- localStorage: Browser storage used to persist hotels and bookings data for the current device and browser.
- Amenities: Feature tags associated with a hotel (e.g., Wi‑Fi, Pool, Breakfast).
- Rating threshold: Minimum star rating value used for filtering hotels.

## Appendix: High-level Navigation

- Header actions: “Hotels” (home view) and “Bookings.”
- Home view: Title, filters sidebar, and hotel cards grid.
- Details view: Hotel details and actions (Book, Back).
- Booking view: Booking form for the selected hotel.
- Bookings view: List of saved bookings.

