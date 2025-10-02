import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for does not exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;
