/**
 * Component rendering interactive rating stars (0-5).
 * @param {Object} props
 * @param {number} props.value - Current rating value (0-5)
 * @param {Function} props.onChange - Callback when rating changes (star is clicked, receives the new rating as an argument)
 */
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

