import { lazy } from 'react';
import { useAuth } from '../auth/AuthContext';
import Layout from '../components/layout/Layout';
import BookingLayout from '../models/booking/components/BookingLayout';

const MyProfilePage = lazy(() => import('../models/users/pages/MyProfilePage'));

export default function ProfileRoute() {
  const { isAdmin } = useAuth();
  return isAdmin
    ? <Layout><MyProfilePage /></Layout>
    : <BookingLayout><MyProfilePage /></BookingLayout>;
}
