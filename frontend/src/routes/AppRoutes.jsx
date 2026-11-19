import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Skeleton from '../components/shared/Skeleton';
import Layout from '../components/layout/Layout';
import LoginPage from '../auth/LoginPage';
import { useAuth } from '../auth/AuthContext';
import AdminGuard from './AdminGuard';
import AuthGuard from './AuthGuard';

const MyProfilePage = lazy(() => import('../models/users/pages/MyProfilePage'));
const AccommodationCreate = lazy(() => import('../models/accommodations/pages/AccommodationCreate'));
const AccommodationEdit = lazy(() => import('../models/accommodations/pages/AccommodationEdit'));
const AccommodationList = lazy(() => import('../models/accommodations/pages/AccommodationList'));
const CategoryCreate = lazy(() => import('../models/categories/pages/CategoryCreate'));
const CategoryEdit = lazy(() => import('../models/categories/pages/CategoryEdit'));
const CategoryList = lazy(() => import('../models/categories/pages/CategoryList'));
const HostCreate = lazy(() => import('../models/hosts/pages/HostCreate'));
const HostEdit = lazy(() => import('../models/hosts/pages/HostEdit'));
const HostList = lazy(() => import('../models/hosts/pages/HostListPage'));
const LocationCreate = lazy(() => import('../models/locations/pages/LocationCreate'));
const LocationEdit = lazy(() => import('../models/locations/pages/LocationEdit'));
const LocationList = lazy(() => import('../models/locations/pages/LocationListPage'));
const RoleCreate = lazy(() => import('../models/roles/pages/RoleCreate'));
const RoleEdit = lazy(() => import('../models/roles/pages/RoleEdit'));
const RoleList = lazy(() => import('../models/roles/pages/RoleListPage'));
const UserCreate = lazy(() => import('../models/users/pages/UserCreate'));
const UserEdit = lazy(() => import('../models/users/pages/UserEdit'));
const UserList = lazy(() => import('../models/users/pages/UserListPage'));
const VariantCreate = lazy(() => import('../models/variants/pages/VariantCreate'));
const VariantEdit = lazy(() => import('../models/variants/pages/VariantEdit'));
const VariantList = lazy(() => import('../models/variants/pages/VariantListPage'));
const ProfileCreate = lazy(() => import('../models/profiles/pages/ProfileCreate'));
const ProfileEdit = lazy(() => import('../models/profiles/pages/ProfileEdit'));
const ProfileList = lazy(() => import('../models/profiles/pages/ProfileListPage'));

function HomeRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/accommodations' : '/profile'} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route index element={<HomeRedirect />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route element={<AdminGuard />}>
              <Route path="/accommodations" element={<AccommodationList />} />
              <Route path="/accommodations/new" element={<AccommodationCreate />} />
              <Route path="/accommodations/:id/edit" element={<AccommodationEdit />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/new" element={<CategoryCreate />} />
              <Route path="/categories/:id/edit" element={<CategoryEdit />} />
              <Route path="/hosts" element={<HostList />} />
              <Route path="/hosts/new" element={<HostCreate />} />
              <Route path="/hosts/:id/edit" element={<HostEdit />} />
              <Route path="/locations" element={<LocationList />} />
              <Route path="/locations/new" element={<LocationCreate />} />
              <Route path="/locations/:id/edit" element={<LocationEdit />} />
              <Route path="/roles" element={<RoleList />} />
              <Route path="/roles/new" element={<RoleCreate />} />
              <Route path="/roles/:id/edit" element={<RoleEdit />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserCreate />} />
              <Route path="/users/:id/edit" element={<UserEdit />} />
              <Route path="/profiles" element={<ProfileList />} />
              <Route path="/profiles/new" element={<ProfileCreate />} />
              <Route path="/profiles/:id/edit" element={<ProfileEdit />} />
              <Route path="/variants" element={<VariantList />} />
              <Route path="/variants/new" element={<VariantCreate />} />
              <Route path="/variants/:id/edit" element={<VariantEdit />} />
            </Route>
            <Route path="*" element={<HomeRedirect />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
