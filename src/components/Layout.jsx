import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-lights">
          <span className="app-light" />
          <span className="app-light small" />
          <span className="app-light small" />
        </div>
        <Link to="/" className="app-title-link">
          <h1>PokéDex Mini</h1>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
