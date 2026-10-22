import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Skeleton from '../components/shared/Skeleton';
import Layout from '../components/layout/Layout';

const ExperienceCreate = lazy(() => import('../pages/ExperienceCreate'));
const ExperienceEdit = lazy(() => import('../pages/ExperienceEdit'));
const ExperienceList = lazy(() => import('../pages/ExperienceList'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/experiences" replace />} />
          <Route path="/experiences" element={<ExperienceList />} />
          <Route path="/experiences/new" element={<ExperienceCreate />} />
          <Route path="/experiences/:id/edit" element={<ExperienceEdit />} />
          <Route path="*" element={<Navigate to="/experiences" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
