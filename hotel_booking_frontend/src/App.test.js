import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/Hotel Booking/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders home page hero CTA', () => {
  render(<App />);
  const cta = screen.getByText(/Start Booking Now/i);
  expect(cta).toBeInTheDocument();
});
