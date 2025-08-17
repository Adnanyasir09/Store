import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import StoresList from './pages/StoresList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import NotFound from './pages/NotFound';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StoresList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute roles={['ADMIN']}><AdminUsers /></PrivateRoute>
        } />
        <Route path="/admin/stores" element={
          <PrivateRoute roles={['ADMIN']}><AdminStores /></PrivateRoute>
        } />
        <Route path="/owner" element={
          <PrivateRoute roles={['OWNER']}><StoreOwnerDashboard /></PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
