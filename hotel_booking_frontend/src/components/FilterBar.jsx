import React, { useEffect, useMemo, useState } from 'react';

/**
 * FilterBar renders search and filters for hotel list:
 * - Search (name/location)
 * - Price range
 * - Star ratings
 * - Amenities
 * 
 * Accessible, keyboard-friendly, and themed with Ocean Professional.
 */

// Helpers for amenities from dataset
const normalizeAmenity = (a) => String(a || '').trim();

function uniqueAmenities(hotels) {
  const set = new Set();
  hotels.forEach(h => (Array.isArray(h.amenities) ? h.amenities : []).forEach(a => set.add(normalizeAmenity(a))));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// PUBLIC_INTERFACE
export default function FilterBar({
  hotels = [],
  value,
  onChange,
  className = '',
}) {
  /**
   * PUBLIC INTERFACE:
   * Props:
   *  - hotels: full list to compute dynamic defaults (max price, amenity list)
   *  - value: current filter object { query, priceMax, ratings: Set<number|string>, amenities: Set<string> }
   *  - onChange: callback with updated filter object
   * 
   * Note: We keep internal controlled inputs that reflect `value` and notify parent via onChange.
   */

  const maxPriceInData = useMemo(
    () => Math.max(0, ...hotels.map(h => Number(h.pricePerNight || 0))),
    [hotels]
  );

  const allAmenities = useMemo(() => uniqueAmenities(hotels), [hotels]);

  const [query, setQuery] = useState(value?.query || '');
  const [priceMax, setPriceMax] = useState(
    Number.isFinite(value?.priceMax) ? value.priceMax : maxPriceInData
  );
  const [ratings, setRatings] = useState(() => {
    if (value?.ratings instanceof Set) return new Set(value.ratings);
    if (Array.isArray(value?.ratings)) return new Set(value.ratings);
    return new Set();
  });
  const [amenities, setAmenities] = useState(() => {
    if (value?.amenities instanceof Set) return new Set(value.amenities);
    if (Array.isArray(value?.amenities)) return new Set(value.amenities);
    return new Set();
  });

  // keep local state in sync with external updates
  useEffect(() => {
    setQuery(value?.query || '');
    setPriceMax(Number.isFinite(value?.priceMax) ? value.priceMax : maxPriceInData);
    setRatings(value?.ratings instanceof Set ? new Set(value.ratings) : (Array.isArray(value?.ratings) ? new Set(value.ratings) : new Set()));
    setAmenities(value?.amenities instanceof Set ? new Set(value.amenities) : (Array.isArray(value?.amenities) ? new Set(value.amenities) : new Set()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, maxPriceInData]);

  const emitChange = (next) => {
    onChange?.({
      query,
      priceMax,
      ratings,
      amenities,
      ...next,
    });
  };

  const toggleRating = (r) => {
    const next = new Set(ratings);
    if (next.has(r)) next.delete(r);
    else next.add(r);
    setRatings(next);
    emitChange({ ratings: next });
  };

  const toggleAmenity = (a) => {
    const normalized = normalizeAmenity(a);
    const next = new Set(amenities);
    if (next.has(normalized)) next.delete(normalized);
    else next.add(normalized);
    setAmenities(next);
    emitChange({ amenities: next });
  };

  const resetFilters = () => {
    const cleared = {
      query: '',
      priceMax: maxPriceInData,
      ratings: new Set(),
      amenities: new Set(),
    };
    setQuery(cleared.query);
    setPriceMax(cleared.priceMax);
    setRatings(cleared.ratings);
    setAmenities(cleared.amenities);
    onChange?.(cleared);
  };

  return (
    <aside id="filters" className={`filterbar card ${className}`} aria-label="Search and filter hotels">
      <div className="filterbar-header">
        <h2 className="filterbar-title">Search & Filters</h2>
        <button className="btn btn-ghost filterbar-reset" onClick={resetFilters} aria-label="Reset all filters">
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="filter-group">
        <label htmlFor="hotelSearch" className="label">Search by name or location</label>
        <div className="input-with-icon">
          <span className="input-icon" aria-hidden="true">🔎</span>
          <input
            id="hotelSearch"
            className="input"
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); emitChange({ query: e.target.value }); }}
            placeholder="e.g., Oceanview or Seattle"
            aria-describedby="searchHelp"
          />
        </div>
        <div id="searchHelp" className="helper">Type to filter results.</div>
      </div>

      {/* Price range */}
      <div className="filter-group">
        <div className="filter-group-row">
          <label htmlFor="priceMax" className="label">Max price per night</label>
          <div className="badge">${priceMax}</div>
        </div>
        <input
          id="priceMax"
          className="range"
          type="range"
          min="0"
          max={Math.max(50, maxPriceInData)}
          step="1"
          value={priceMax}
          onChange={(e) => { const v = Number(e.target.value); setPriceMax(v); emitChange({ priceMax: v }); }}
          aria-valuemin={0}
          aria-valuemax={maxPriceInData}
          aria-valuenow={priceMax}
        />
        <div className="helper">Showing hotels up to ${priceMax} per night.</div>
      </div>

      {/* Star rating */}
      <fieldset className="filter-group">
        <legend className="label" style={{ marginBottom: 8 }}>Star rating</legend>
        <div className="checkbox-grid">
          {[5, 4.5, 4, 3.5, 3].map((r) => (
            <label key={r} className="checkbox">
              <input
                type="checkbox"
                checked={ratings.has(r)}
                onChange={() => toggleRating(r)}
                aria-label={`${r} stars & up`}
              />
              <span className="checkbox-label">
                ⭐ {r}+ 
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Amenities */}
      <fieldset className="filter-group">
        <legend className="label" style={{ marginBottom: 8 }}>Amenities</legend>
        {allAmenities.length ? (
          <div className="checkbox-grid">
            {allAmenities.map((a) => (
              <label key={a} className="checkbox">
                <input
                  type="checkbox"
                  checked={amenities.has(a)}
                  onChange={() => toggleAmenity(a)}
                  aria-label={a}
                />
                <span className="checkbox-label">{a}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="helper">No amenities data available.</div>
        )}
      </fieldset>
    </aside>
  );
}
