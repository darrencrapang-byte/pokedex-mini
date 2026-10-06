import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize, getTypeColor } from "../utils.js";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }

        const data = await response.json();

        if (isCurrent) {
          setPokemon(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  if (isLoading) return <p className="status">Loading {name}…</p>;
  if (error) return <p className="status status-error">{error}</p>;

  const maxStat = 180; // skala visual untuk panjang bar stat

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to list
      </Link>
      <div className="detail-page">
        <div className="detail-artwork-wrap">
          <img
            className="detail-artwork"
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
          />
        </div>
        <p className="detail-id">#{String(pokemon.id).padStart(3, "0")}</p>
        <h2 className="detail-name">{capitalize(pokemon.name)}</h2>
        <div className="pokemon-types">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="type-pill"
              style={{ backgroundColor: getTypeColor(t.type.name) }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
        <ul className="stat-list">
          {pokemon.stats.map((s) => {
            const percent = Math.min(100, (s.base_stat / maxStat) * 100);
            return (
              <li key={s.stat.name} className="stat-row">
                <span className="stat-name">{s.stat.name}</span>
                <span className="stat-track">
                  <span
                    className="stat-fill"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="stat-value">{s.base_stat}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DetailPage;
