import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API = import.meta.env.VITE_API_URL || "/api";

const GENRES = ["All", "Action", "Drama", "Sci-Fi", "Comedy", "Horror", "Thriller", "Romance"];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  useEffect(() => {
    axios
      .get(`${API}/movies`)
      .then((res) => setMovies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "All" || m.genre === genre;
    return matchSearch && matchGenre;
  });

  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>🎬 Now Showing</h1>
        <p style={s.heroSub}>Book your seats for the latest blockbusters</p>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <input
          type="text"
          placeholder="🔍 Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />
        <div style={s.genreTabs}>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              style={{ ...s.genreBtn, ...(genre === g ? s.genreBtnActive : {}) }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={s.center}>
          <div style={s.spinner} />
          <p style={{ color: "#666", marginTop: "1rem" }}>Loading movies...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.center}>
          <p style={{ fontSize: "3rem" }}>🎭</p>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>No movies found.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  hero: {
    textAlign: "center",
    padding: "2rem 0 1.5rem",
    marginBottom: "1.5rem",
  },
  heroTitle: {
    fontSize: "2.2rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fff 0%, #e94560 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.4rem",
  },
  heroSub: { color: "#666", fontSize: "1rem" },
  filters: { marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" },
  searchInput: {
    padding: "0.75rem 1.2rem",
    borderRadius: "10px",
    border: "1px solid #2a2a40",
    background: "#12121f",
    color: "#f0f0f0",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    maxWidth: "400px",
  },
  genreTabs: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  genreBtn: {
    padding: "0.4rem 0.9rem",
    borderRadius: "20px",
    border: "1px solid #2a2a40",
    background: "transparent",
    color: "#888",
    fontSize: "0.82rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  genreBtnActive: {
    background: "#e94560",
    borderColor: "#e94560",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  center: { textAlign: "center", padding: "4rem 0" },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #1e1e35",
    borderTop: "3px solid #e94560",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },
};
