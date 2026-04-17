import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";

const API = import.meta.env.VITE_API_URL || "/api";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    axios.get(`${API}/movies/${id}`).then((res) => setMovie(res.data)).catch(console.error);
  }, [id]);

  if (!movie) return <p style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</p>;

  if (booked)
    return (
      <div style={styles.success}>
        <h2>🎉 Booking Confirmed!</h2>
        <p>Enjoy your movie: <strong>{movie.title}</strong></p>
        <button style={styles.btn} onClick={() => navigate("/bookings")}>View My Bookings</button>
        <button style={{ ...styles.btn, background: "#333", marginLeft: "1rem" }} onClick={() => navigate("/")}>
          Back to Movies
        </button>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <img
          src={movie.poster || "https://via.placeholder.com/300x420?text=No+Poster"}
          alt={movie.title}
          style={styles.poster}
        />
      </div>
      <div style={styles.right}>
        <h2 style={styles.title}>{movie.title}</h2>
        <p style={styles.meta}>{movie.genre} &bull; {movie.duration} min</p>
        <p style={styles.desc}>{movie.description}</p>
        <p style={styles.seats}>
          Available Seats: <strong>{movie.availableSeats}</strong>
        </p>
        {movie.availableSeats > 0 ? (
          <BookingForm movie={movie} onSuccess={() => setBooked(true)} />
        ) : (
          <p style={{ color: "#e94560", marginTop: "1rem", fontWeight: "bold" }}>Sold Out</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", gap: "2rem", flexWrap: "wrap" },
  left: { flex: "0 0 280px" },
  poster: { width: "100%", borderRadius: "10px" },
  right: { flex: 1, minWidth: "280px" },
  title: { fontSize: "1.8rem", marginBottom: "0.5rem" },
  meta: { color: "#aaa", marginBottom: "1rem" },
  desc: { lineHeight: 1.6, marginBottom: "1rem" },
  seats: { color: "#ccc" },
  success: { textAlign: "center", marginTop: "4rem" },
  btn: {
    marginTop: "1.5rem",
    padding: "0.7rem 1.5rem",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};
