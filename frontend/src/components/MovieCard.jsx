import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} style={styles.card}>
      <img
        src={movie.poster || "https://via.placeholder.com/300x420?text=No+Poster"}
        alt={movie.title}
        style={styles.poster}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>
        <p style={styles.genre}>{movie.genre}</p>
        <p style={styles.price}>${movie.price} / seat</p>
        <p style={styles.seats}>
          {movie.availableSeats > 0
            ? `${movie.availableSeats} seats left`
            : "Sold Out"}
        </p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    background: "#1a1a2e",
    borderRadius: "10px",
    overflow: "hidden",
    transition: "transform 0.2s",
    display: "block",
    cursor: "pointer",
  },
  poster: { width: "100%", height: "300px", objectFit: "cover" },
  info: { padding: "0.8rem" },
  title: { fontSize: "1rem", fontWeight: "bold", marginBottom: "0.3rem" },
  genre: { color: "#aaa", fontSize: "0.85rem", marginBottom: "0.3rem" },
  price: { color: "#e94560", fontWeight: "600" },
  seats: { fontSize: "0.8rem", color: "#ccc", marginTop: "0.2rem" },
};
