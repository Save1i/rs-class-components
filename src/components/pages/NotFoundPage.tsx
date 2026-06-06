import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found__page">
      <h1 className="title">404</h1>
      <p className="about-text">Page not found.</p>
      <Link className="search-button back-button" to="/?page=1">
        Back to main page
      </Link>
    </section>
  );
}

export default NotFoundPage;
