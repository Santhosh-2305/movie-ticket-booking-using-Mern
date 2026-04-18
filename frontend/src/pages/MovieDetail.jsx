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
  const [tab, setTab] = useState("info"); // "info" | "book"

  useEffect(() => {
    axios.get(`${API}/movies/${id}`).then((res) => setMovie(res.data)).catch(console.error);
  }, [id]);

  if (!movie) return (
    <div style={s.center}>
      <div style={s.spinner} />
    </div>
  );

  if (booked) return (
    <div style={s.successPage}>
      <div style={s.successCard}>
        <div style={{ fontSize: "4rem" }}>🎉</div>
        <h2 style={s.successTitle}>Booking Confirmed!</h2>
        <p style={s.successSub}>Enjoy <strong>{movie.title}</strong></p>
        <div style={s.successBtns}>
          <button style={s.btnPrimary} onClick={() => navigate("/bookings")}>View My Bookings</button>
          <button style={s.btnSecondary} onClick={() => navigate("/")}>Back to Movies</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>

      <div style={s.container}>
        {/* Poster */}
        <div style={s.posterCol}>
          <img
            src={movie.poster || "https://via.placeholder.com/300x420?text=No+Poster"}
            alt={movie.title}
            style={s.poster}
          />
          <div style={s.priceTag}>${movie.price} <small>/ seat</small></div>
        </div>

        {/* Details */}
        <div style={s.detailCol}>
          <div style={s.badges}>
            <span style={s.badge}>{movie.genre}</span>
            <span style={s.badge}>{movie.duration} min</span>
            <span style={{
              ...s.badge,
              background: movie.availableSeats > 0 ? "#0d2a0d" : "#2a0a0f",
              color: movie.availableSeats > 0 ? "#4caf50" : "#e94560",
              borderColor: movie.availableSeats > 0 ? "#4caf50" : "#e94560",
            }}>
              {movie.availableSeats > 0 ? `${movie.availableSeats} seats` : "Sold Out"}
            </span>
          </div>

          <h1 style={s.title}>{movie.title}</h1>
          <p style={s.releaseDate}>
            📅 {new Date(movie.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p style={s.desc}>{movie.description}</p>

          {/* Tabs */}
          {movie.availableSeats > 0 && (
            <>
              <div style={s.tabs}>
                <button
                  style={{ ...s.tab, ...(tab === "info" ? s.tabActive : {}) }}
                  onClick={() => setTab("info")}
                >
                  Info
                </button>
                <button
                  style={{ ...s.tab, ...(tab === "book" ? s.tabActive : {}) }}
                  onClick={() => setTab("book")}
                >
                  🎟 Book Seats
                </button>
              </div>

              {tab === "book" && (
                <BookingForm movie={movie} onSuccess={() => setBooked(true)} />
              )}
            </>
          )}

          {movie.availableSeats === 0 && (
            <div style={s.soldOutBox}>
              <span style={{ fontSize: "1.5rem" }}>😔</span>
              <p>This show is sold out. Check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" },
  spinner: {
    width: "40px", height: "40px",
    border: "3px solid #1e1e35",
    borderTop: "3px solid #e94560",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  backBtn: {
    background: "none",
    border: "1px solid #2a2a40",
    color: "#aaa",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
    cursor: "pointer",
  },
  container: { display: "flex", gap: "2.5rem", flexWrap: "wrap" },
  posterCol: { flex: "0 0 260px" },
  poster: { width: "100%", borderRadius: "12px", display: "block" },
  priceTag: {
    background: "#e94560",
    color: "#fff",
    textAlign: "center",
    padding: "0.6rem",
    borderRadius: "0 0 12px 12px",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  detailCol: { flex: 1, minWidth: "280px" },
  badges: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" },
  badge: {
    padding: "0.25rem 0.7rem",
    borderRadius: "20px",
    border: "1px solid #2a2a40",
    background: "#1e1e35",
    color: "#aaa",
    fontSize: "0.78rem",
    fontWeight: "500",
  },
  title: { fontSize: "2rem", fontWeight: "800", marginBottom: "0.4rem", lineHeight: 1.2 },
  releaseDate: { color: "#666", fontSize: "0.85rem", marginBottom: "1rem" },
  desc: { color: "#bbb", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem" },
  tab: {
    padding: "0.5rem 1.2rem",
    borderRadius: "8px",
    border: "1px solid #2a2a40",
    background: "transparent",
    color: "#888",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: { background: "#e94560", borderColor: "#e94560", color: "#fff" },
  soldOutBox: {
    background: "#1a0a0f",
    border: "1px solid #e94560",
    borderRadius: "10px",
    padding: "1.5rem",
    textAlign: "center",
    color: "#e94560",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "center",
  },
  successPage: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },
  successCard: {
    background: "#12121f",
    border: "1px solid #1e1e35",
    borderRadius: "16px",
    padding: "3rem 2rem",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  successTitle: { fontSize: "1.8rem", fontWeight: "800", margin: "0.8rem 0 0.4rem" },
  successSub: { color: "#aaa", marginBottom: "2rem" },
  successBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: {
    padding: "0.75rem 1.5rem",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "0.75rem 1.5rem",
    background: "transparent",
    color: "#aaa",
    border: "1px solid #2a2a40",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};
