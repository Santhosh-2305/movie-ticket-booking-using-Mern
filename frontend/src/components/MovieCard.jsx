import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const soldOut = movie.availableSeats === 0;

  return (
    <Link to={`/movies/${movie._id}`} style={s.card}>
      <div style={s.posterWrap}>
        <img
          src={movie.poster || "https://via.placeholder.com/300x420?text=No+Poster"}
          alt={movie.title}
          style={s.poster}
        />
        {soldOut && <div style={s.soldOutBadge}>SOLD OUT</div>}
        <div style={s.overlay}>
          <span style={s.bookBtn}>Book Now →</span>
        </div>
      </div>
      <div style={s.info}>
        <h3 style={s.title}>{movie.title}</h3>
        <div style={s.meta}>
          <span style={s.genre}>{movie.genre}</span>
          <span style={s.duration}>{movie.duration} min</span>
        </div>
        <div style={s.bottom}>
          <span style={s.price}>${movie.price}<small>/seat</small></span>
          <span style={{ ...s.seats, color: soldOut ? "#e94560" : "#4caf50" }}>
            {soldOut ? "Sold Out" : `${movie.availableSeats} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}

const s = {
  card: {
    background: "#12121f",
    borderRadius: "12px",
    overflow: "hidden",
    display: "block",
    border: "1px solid #1e1e35",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  posterWrap: { position: "relative", overflow: "hidden" },
  poster: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s",
  },
  soldOutBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#e94560",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    letterSpacing: "1px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(233,69,96,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.25s",
  },
  bookBtn: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
  info: { padding: "0.9rem 1rem" },
  title: { fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.4rem", lineHeight: 1.3 },
  meta: { display: "flex", gap: "0.5rem", marginBottom: "0.6rem" },
  genre: {
    background: "#1e1e35",
    color: "#aaa",
    fontSize: "0.72rem",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
  },
  duration: { color: "#666", fontSize: "0.78rem", alignSelf: "center" },
  bottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#e94560", fontWeight: "700", fontSize: "1rem" },
  seats: { fontSize: "0.8rem", fontWeight: "600" },
};
