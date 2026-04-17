import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";

export default function BookingForm({ movie, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", seats: 1, showDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, { ...form, movie: movie._id });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Book Tickets — {movie.title}</h3>
      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>Name</label>
      <input name="name" value={form.name} onChange={handleChange} required style={styles.input} />

      <label style={styles.label}>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} />

      <label style={styles.label}>Number of Seats (max 10)</label>
      <input
        name="seats"
        type="number"
        min="1"
        max={Math.min(10, movie.availableSeats)}
        value={form.seats}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <label style={styles.label}>Show Date</label>
      <input name="showDate" type="date" value={form.showDate} onChange={handleChange} required style={styles.input} />

      <p style={styles.total}>
        Total: <strong>${(form.seats * movie.price).toFixed(2)}</strong>
      </p>

      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1.5rem" },
  heading: { fontSize: "1.2rem", marginBottom: "0.5rem", color: "#e94560" },
  label: { fontSize: "0.85rem", color: "#aaa" },
  input: {
    padding: "0.6rem",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#1a1a2e",
    color: "#f0f0f0",
    fontSize: "1rem",
  },
  total: { color: "#f0f0f0", marginTop: "0.3rem" },
  btn: {
    padding: "0.75rem",
    background: "#e94560",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  error: { color: "#ff6b6b", fontSize: "0.9rem" },
};
