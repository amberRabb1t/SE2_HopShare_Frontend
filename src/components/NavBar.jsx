import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/*
  Navigation bar component with links to different screens.
  Displays different navigation options depending on whether the user is logged in.
  Logged in users can access "My Cars", "Routes", "Requests", and "Reviews".
  Also displays the user's email and a logout button.
  Guests can only see "Home" and "Login".
*/

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
            <Link to="/routes">Routes</Link>
            <Link to="/requests">Requests</Link>
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

