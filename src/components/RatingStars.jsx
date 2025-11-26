import React from 'react';

export default function RatingStars({ value, onChange }) {
  return (
    <div className="rating-stars">
      {[0,1,2,3,4,5].map(n => (
        <button
          key={n}
            type="button"
            className={n <= value ? 'active' : ''}
            onClick={() => onChange(n)}
            aria-label={`Set rating to ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}