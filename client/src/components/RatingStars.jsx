import React from 'react';

export default function RatingStars({ value = 0, editable = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => editable && onChange?.(s)}
          className={`
            text-2xl 
            ${s <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300'} 
            ${editable ? 'cursor-pointer hover:text-yellow-500 transition-colors duration-200' : ''}
          `}
        >
          ★
        </span>
      ))}
    </div>
  );
}
