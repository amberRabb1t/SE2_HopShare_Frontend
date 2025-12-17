import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { email } = useAuth();
  return (
    <div className="container">
      <div className="panel">
        <h2>Welcome to HopShare</h2>
        <p className="tagline">
          Carpooling simplified. Organize routes, manage requests, cars, and reviews.
        </p>
        {!email && (
          <>
            <p>Please <Link to="/login">login</Link> to access your dashboard.</p>
          </>
        )}
        {email && (
          <div className="grid cols-2">
            <Link to="/my-cars" className="card">
              <h4>My Cars</h4>
              <small>Register & edit vehicles</small>
            </Link>
            <Link to="/routes" className="card">
              <h4>Routes</h4>
              <small>Create, update & list routes</small>
            </Link>
            <Link to="/requests" className="card">
              <h4>Requests</h4>
              <small>Publish travel demands</small>
            </Link>
            <Link to="/reviews" className="card">
              <h4>Reviews</h4>
              <small>Your written & received reviews</small>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

