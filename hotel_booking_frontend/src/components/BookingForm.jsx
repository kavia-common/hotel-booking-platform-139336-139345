import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function BookingForm({ hotel, onSubmit, onCancel }) {
  /** Simple booking form; returns booking payload to parent when submitted. */
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  if (!hotel) return null;

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.checkIn || !form.checkOut) return;
    onSubmit?.({
      ...form,
      hotelId: hotel.id,
      hotelName: hotel.name,
      pricePerNight: hotel.pricePerNight,
    });
  };

  return (
    <div className="surface" style={{ padding: 20 }}>
      <h3 className="page-title" style={{ marginTop: 0 }}>Book your stay at {hotel.name}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="checkIn">Check-in</label>
            <input id="checkIn" type="date" className="input" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="checkOut">Check-out</label>
            <input id="checkOut" type="date" className="input" value={form.checkOut} onChange={(e) => update('checkOut', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="guests">Guests</label>
            <input id="guests" type="number" min="1" className="input" value={form.guests} onChange={(e) => update('guests', Number(e.target.value || 1))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-secondary">Confirm booking</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
