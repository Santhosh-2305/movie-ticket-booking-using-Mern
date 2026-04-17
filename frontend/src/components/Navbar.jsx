import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎬 CineBook</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Movies</Link>
        <Link to="/bookings" style={styles.link}>My Bookings</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#1a1a2e",
    borderBottom: "2px solid #e94560",
  },
  brand: { fontSize: "1.4rem", fontWeight: "bold", color: "#e94560" },
  links: { display: "flex", gap: "1.5rem" },
  link: { color: "#f0f0f0", fontWeight: "500", transition: "color 0.2s" },
};
