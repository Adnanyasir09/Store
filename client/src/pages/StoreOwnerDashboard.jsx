import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Table from '../components/Table';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState({ stores: [], raters: [] });
  const [err, setErr] = useState('');

  useEffect(() => {
    api.ownerDashboard().then(setData).catch(e => setErr(e.message));
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        Store Owner Dashboard
      </h2>

      {/* Error Message */}
      {err && (
        <div className="mb-6 p-4 rounded-lg text-white bg-red-600 shadow-md text-center font-medium">
          {err}
        </div>
      )}

      {/* My Stores Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Stores</h3>
        <div className="bg-white shadow-xl rounded-2xl overflow-x-auto">
          <Table
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'address', title: 'Address' },
              { key: 'avg_rating', title: 'Average Rating' },
              { key: 'rating_count', title: 'Ratings' }
            ]}
            rows={data.stores}
          />
        </div>
      </section>

      {/* Recent Ratings Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Ratings</h3>
        <div className="bg-white shadow-xl rounded-2xl overflow-x-auto">
          <Table
            columns={[
              { key: 'store_id', title: 'Store ID' },
              { key: 'name', title: 'User Name' },
              { key: 'email', title: 'User Email' },
              { key: 'value', title: 'Rating' },
              { key: 'updated_at', title: 'Updated At' }
            ]}
            rows={data.raters}
          />
        </div>
      </section>
    </div>
  );
}
