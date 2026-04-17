import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/movies`)
      .then((res) => setMovies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "3rem" }}>Loading movies...</p>;
  if (!movies.length) return <p style={{ textAlign: "center", marginTop: "3rem" }}>No movies available.</p>;

  return (
    <>
      <h2 style={styles.heading}>Now Showing</h2>
      <div style={styles.grid}>
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </>
  );
}

const styles = {
  heading: { marginBottom: "1.5rem", fontSize: "1.6rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
};
