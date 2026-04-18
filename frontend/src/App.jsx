import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useAdmin } from "./context/AdminContext";

export default function App() {
  const { admin } = useAdmin();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Hide navbar on admin pages */}
      {!admin && <Navbar />}
      <main style={admin ? {} : { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
