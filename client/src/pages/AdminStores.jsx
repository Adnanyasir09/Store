import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import Table from '../components/Table';

export default function AdminStores() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const res = await api.adminListStores({ search, sortBy, sortDir });
    setData(res);
  }, [search, sortBy, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  const createStore = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.adminCreateStore({ ...form, ownerId: form.ownerId || null });
      setForm({ name: '', email: '', address: '', ownerId: '' });
      setMsg('Store created successfully!');
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Stores (Admin)</h2>

      {/* Search */}
      <div className="mb-6">
        <input
          placeholder="Search by name, email or address"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto mb-8">
        <Table
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'email', title: 'Email' },
            { key: 'address', title: 'Address' },
            { key: 'rating', title: 'Rating', sortKey: 'rating' },
            { key: 'rating_count', title: '#Ratings', sortKey: 'rating_count' }
          ]}
          rows={data.items}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(c, d) => { setSortBy(c); setSortDir(d); }}
        />
      </div>

      {/* Add New Store */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Store</h3>
        {msg && <p className="text-green-600 mb-4">{msg}</p>}

        <form onSubmit={createStore} className="grid grid-cols-1 gap-4 max-w-md">
          <input
            placeholder="Store Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            placeholder="Owner User ID (optional)"
            value={form.ownerId}
            onChange={e => setForm({ ...form, ownerId: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
}
