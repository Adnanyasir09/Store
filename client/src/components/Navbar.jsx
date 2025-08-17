import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md border-b border-gray-200">
      {/* Left: Logo / Home Link */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          Stores
        </Link>

        {/* Admin Links */}
        {user?.role === 'ADMIN' && (
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">Admin Dashboard</Link>
            <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 transition">Users</Link>
            <Link to="/admin/stores" className="text-gray-700 hover:text-blue-600 transition">Stores Admin</Link>
          </div>
        )}

        {/* Owner Links */}
        {user?.role === 'OWNER' && (
          <Link to="/owner" className="text-gray-700 hover:text-blue-600 transition">Owner Dashboard</Link>
        )}
      </div>

      {/* Right: Auth Links / User Info */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/change-password" className="text-gray-700 hover:text-blue-600 transition">
              Change Password
            </Link>
            <span className="text-gray-800 font-medium">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
