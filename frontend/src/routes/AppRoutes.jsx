import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Skeleton from '../components/shared/Skeleton';
import Layout from '../components/layout/Layout';

const AccommodationCreate = lazy(() => import('../pages/AccommodationCreate'));
const AccommodationEdit = lazy(() => import('../pages/AccommodationEdit'));
const AccommodationList = lazy(() => import('../pages/AccommodationList'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/accommodations" replace />} />
          <Route path="/accommodations" element={<AccommodationList />} />
          <Route path="/accommodations/new" element={<AccommodationCreate />} />
          <Route path="/accommodations/:id/edit" element={<AccommodationEdit />} />
          <Route path="*" element={<Navigate to="/accommodations" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
