import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import MyBookings from "./pages/MyBookings";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </>
  );
}
