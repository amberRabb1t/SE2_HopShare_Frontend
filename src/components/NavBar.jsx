import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { email, logout } = useAuth();
  const loc = useLocation();
  return (
    <nav className="navbar">
      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>HopShare</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {email && (
          <>
            <Link to="/my-cars" className={loc.pathname.startsWith('/my-cars') ? 'active' : ''}>My Cars</Link>
            <Link to="/my-routes">My Routes</Link>
            <Link to="/my-requests">My Requests</Link>
            <Link to="/reviews">Reviews</Link>
          </>
        )}
      </div>
      <div>
        {email ? (
          <button onClick={logout} title="Logout">{email} • Logout</button>
        ) : (
          <Link to="/login"><button>Login</button></Link>
        )}
      </div>
    </nav>
  );
}