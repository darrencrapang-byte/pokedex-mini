import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-pokeball" />
      <h2>There's nothing here</h2>
      <p>The Pokémon you're looking for couldn't be found.</p>
      <Link to="/" className="back-link">
        ← Back to list
      </Link>
    </div>
  );
}

export default NotFoundPage;
