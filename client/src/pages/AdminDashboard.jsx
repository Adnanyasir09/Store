import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [err, setErr] = useState('');

  useEffect(() => {
    api.adminStats().then(setStats).catch(e => setErr(e.message));
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h2>
      {err && <p className="text-red-500 text-center mb-4">{err}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 text-lg font-medium mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
        </div>

        {/* Total Stores */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 text-lg font-medium mb-2">Total Stores</h3>
          <p className="text-4xl font-bold text-gray-800">{stats.totalStores}</p>
        </div>

        {/* Total Ratings */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 text-lg font-medium mb-2">Total Ratings</h3>
          <p className="text-4xl font-bold text-gray-800">{stats.totalRatings}</p>
        </div>
      </div>
    </div>
  );
}
