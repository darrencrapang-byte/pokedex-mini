import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl, capitalize, getArtworkUrl } from "../utils.js";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState(null);

  // Ambil daftar SEMUA nama pokemon sekali saja saat komponen pertama muncul,
  // supaya pencarian sebagian huruf bisa dilakukan di sisi client.
  useEffect(() => {
    async function loadAllPokemon() {
      setIsLoadingList(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=2000`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setAllPokemon(data.results); // [{ name, url }, ...]
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingList(false);
      }
    }

    loadAllPokemon();
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  // Cocokkan nama yang MENGANDUNG huruf yang diketik, di mana saja dalam nama.
  const matches =
    trimmedQuery === ""
      ? []
      : allPokemon
          .filter((pokemon) => pokemon.name.includes(trimmedQuery))
          .slice(0, 10); // batasi jumlah hasil yang ditampilkan

  function handleSubmit(event) {
    event.preventDefault();
    // Enter langsung menuju hasil pertama, kalau ada.
    if (matches.length > 0) {
      window.location.hash = `#/pokemon/${matches[0].name}`;
    }
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama Pokémon (boleh sebagian huruf)…"
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isLoadingList && trimmedQuery !== "" && (
        <p className="status">Memuat daftar Pokémon…</p>
      )}
      {error && <p className="status status-error">{error}</p>}

      {trimmedQuery !== "" && !isLoadingList && (
        <>
          {matches.length === 0 ? (
            <p className="status">
              Tidak ada Pokémon yang cocok dengan "{query}".
            </p>
          ) : (
            <ul className="pokemon-list search-results">
              {matches.map((pokemon) => {
                const id = getIdFromUrl(pokemon.url);
                return (
                  <li key={pokemon.name} className="pokemon-list-item">
                    <Link
                      to={`/pokemon/${pokemon.name}`}
                      className="pokemon-link"
                    >
                      <img
                        className="pokemon-sprite"
                        src={getArtworkUrl(id)}
                        alt={pokemon.name}
                      />
                      <span className="pokemon-id">
                        #{id.padStart(3, "0")}
                      </span>
                      <span className="pokemon-name">
                        {capitalize(pokemon.name)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default SearchForm;
