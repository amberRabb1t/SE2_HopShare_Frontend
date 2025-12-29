import { Link } from 'react-router-dom';

/*
  Just a simple 404 Not Found page.
*/

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="panel">
        <h2>404 - Not Found</h2>
        <p>The page you requested does not exist.</p>
        <Link to="/"><button>Go Home</button></Link>
      </div>
    </div>
  );
}

