import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/Hotel Booking/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders home page title', () => {
  render(<App />);
  const title = screen.getByText(/Find your next stay/i);
  expect(title).toBeInTheDocument();
});
