import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings?email=${email}`);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>My Bookings</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && bookings.length === 0 && (
        <p style={{ marginTop: "1.5rem", color: "#aaa" }}>No bookings found for this email.</p>
      )}

      <div style={styles.list}>
        {bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            <img
              src={b.movie?.poster || "https://via.placeholder.com/80x110?text=N/A"}
              alt={b.movie?.title}
              style={styles.poster}
            />
            <div>
              <h3>{b.movie?.title}</h3>
              <p style={styles.meta}>Seats: {b.seats} &bull; Total: ${b.totalPrice}</p>
              <p style={styles.meta}>Show: {new Date(b.showDate).toLocaleDateString()}</p>
              <p style={styles.meta}>Booked on: {new Date(b.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: { marginBottom: "1.5rem", fontSize: "1.6rem" },
  form: { display: "flex", gap: "0.8rem", flexWrap: "wrap" },
  input: {
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#1a1a2e",
    color: "#f0f0f0",
    fontSize: "1rem",
    flex: 1,
    minWidth: "220px",
  },
  btn: {
    padding: "0.6rem 1.5rem",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  list: { display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" },
  card: {
    display: "flex",
    gap: "1rem",
    background: "#1a1a2e",
    borderRadius: "10px",
    padding: "1rem",
    alignItems: "center",
  },
  poster: { width: "70px", height: "100px", objectFit: "cover", borderRadius: "6px" },
  meta: { color: "#aaa", fontSize: "0.9rem", marginTop: "0.3rem" },
};
