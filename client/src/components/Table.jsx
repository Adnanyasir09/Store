import React from 'react';

export default function Table({ columns, rows, sortBy, sortDir, onSort }) {
  const flip = (col) => {
    if (!onSort) return;
    const dir = sortBy === col && sortDir === 'ASC' ? 'DESC' : 'ASC';
    onSort(col, dir);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => flip(c.sortKey || c.key)}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none hover:text-blue-600 transition-colors"
              >
                {c.title}{' '}
                {sortBy === (c.sortKey || c.key) ? (
                  <span>{sortDir === 'ASC' ? '▲' : '▼'}</span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr
              key={r.id || i}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 text-sm text-gray-700">
                  {c.render ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
