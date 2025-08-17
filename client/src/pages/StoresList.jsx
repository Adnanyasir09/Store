import React, { useEffect, useState, useContext, useCallback } from 'react';
import { api } from '../api';
import Table from '../components/Table';
import RatingStars from '../components/RatingStars';
import { AuthContext } from '../context/AuthContext';

export default function StoresList() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api.listStores({ search, sortBy, sortDir });
      setData(res);
    } catch (e) {
      setMsg(`Error loading stores: ${e.message}`);
    }
  }, [search, sortBy, sortDir]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const rate = async (storeId, value) => {
    setMsg('');
    try {
      await api.rateStore(storeId, value);
      setMsg('Rating saved successfully!');
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(`Failed to save rating: ${e.message}`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto my-12 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h2>
        <p className="text-gray-700 text-lg">
          Please login or sign up to view and rate stores.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        Stores
      </h2>

      {/* Feedback Message */}
      {msg && (
        <div className="mb-6 p-4 rounded-lg bg-green-600 text-white font-medium text-center shadow-md">
          {msg}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Stores Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-x-auto">
        <Table
          columns={[
            { key: 'name', title: 'Store Name' },
            { key: 'address', title: 'Address' },
            {
              key: 'overall_rating',
              title: 'Overall Rating',
              render: (v, r) => (
                <span className="font-medium text-gray-800">
                  {v?.toFixed?.(2)} ({r.rating_count})
                </span>
              ),
            },
            {
              key: 'user_rating',
              title: 'Your Rating',
              render: (v) => <RatingStars value={v || 0} />,
            },
            {
              key: 'id',
              title: 'Action',
              render: (_, r) => (
                <RatingStars
                  value={r.user_rating || 0}
                  editable
                  onChange={(val) => rate(r.id, val)}
                />
              ),
            },
          ]}
          rows={data.items}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(c, d) => {
            setSortBy(c);
            setSortDir(d);
          }}
        />
      </div>
    </div>
  );
}
