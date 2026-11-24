import { Outlet } from 'react-router-dom';
import BookingHeader from './BookingHeader';

export default function BookingLayout({ children }) {
  return (
    <div className="booking-shell">
      <BookingHeader />
      <main className="booking-main">{children || <Outlet />}</main>
      <footer className="booking-site-footer">BUUQUEEN · Encuentra tu próxima estancia</footer>
    </div>
  );
}
