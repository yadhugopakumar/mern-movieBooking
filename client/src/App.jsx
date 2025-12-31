import { Routes, Route, Link, useNavigate } from "react-router-dom";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { isLoggedIn } from "../utlis/auth.js";
import { useState,useEffect } from "react";
import Search from "./pages/Search";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import ProtectedRoutes from "../components/ProtectedRoutes";


function App() {
  const [query, setQuery] = useState("");
  const [isAuth, setIsAuth] = useState(isLoggedIn());
  
  useEffect(() => {
    const syncAuth = () => setIsAuth(isLoggedIn());
    window.addEventListener("storage", syncAuth);
    syncAuth();
  
    return () => window.removeEventListener("storage", syncAuth);
  }, []);
  


  const navigate = useNavigate();


  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">🎬 MovieBook</h1>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/bookings" className="hover:text-yellow-400">My Bookings</Link>

          {/* Search Box */}
          <div className="flex items-center bg-white rounded-full overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search movies, theatres..."
              className="px-4 py-2 text-gray-800 outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-4 py-2 font-bold text-black hover:bg-yellow-500"
            >
              Search
            </button>
          </div>

          {!isAuth ? (
  <>
    <Link
      to="/login"
      className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
    >
      Register
    </Link>
  </>
) : (
  <div className="flex items-center gap-4">
    <Link
      to="/profile"
      className="hover:text-yellow-400"
    >
      Profile
    </Link>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        setIsAuth(false);
        navigate("/");
      }}
      className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
    >
      Logout
    </button>
  </div>
)}

        </div>
      </nav>

      <main className="min-h-screen bg-gray-100 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
        
          <Route path="/bookings" element={
            <ProtectedRoutes>
              <MyBookings />
            </ProtectedRoutes>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/show/:id/seats" element={
            <ProtectedRoutes>
              <SeatSelection />
            </ProtectedRoutes>
          } />

        </Routes>
      </main>
    </>
  );
}
export default App;