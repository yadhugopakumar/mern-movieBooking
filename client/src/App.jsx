// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import MyBookings from "./pages/MyBookings";
// import Login from "./pages/Login";
// import HomePage from "./pages/HomePage";
// import { isLoggedIn } from "../utlis/auth.js";
// import { useState, useEffect } from "react";
// import Search from "./pages/Search";
// import Register from "./pages/Register";
// import MovieDetails from "./pages/MovieDetails";
// import SeatSelection from "./pages/SeatSelection";
// import ProtectedRoutes from "../components/ProtectedRoutes";
// import BookingSuccess from "./pages/BookingSuccessPage.jsx";
// import ProfilePage from "./pages/ProfilePage.jsx";


// function App() {
//   const [query, setQuery] = useState("");
//   const [isAuth, setIsAuth] = useState(isLoggedIn());

//   useEffect(() => {
//     const syncAuth = () => setIsAuth(isLoggedIn());
//     window.addEventListener("storage", syncAuth);
//     syncAuth();

//     return () => window.removeEventListener("storage", syncAuth);
//   }, []);



//   const navigate = useNavigate();


//   const handleSearch = () => {
//     if (!query.trim()) return;
//     navigate(`/search?q=${query}`);
//   };

//   return (
//     <>
//       <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
//         <h1 className="text-xl font-semibold">🎬 MovieBook</h1>

//         <div className="flex gap-6 items-center">
//           <Link to="/" className="hover:text-yellow-400">Home</Link>
//           <Link to="/bookings" className="hover:text-yellow-400">My Bookings</Link>

//           {/* Search Box */}
//           <div className="flex items-center bg-white rounded-full overflow-hidden">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               placeholder="Search movies, theatres..."
//               className="px-4 py-2 text-gray-800 outline-none"
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-yellow-400 px-4 py-2 font-bold text-black hover:bg-yellow-500"
//             >
//               Search
//             </button>
//           </div>

//           {!isAuth ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/register"
//                 className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
//               >
//                 Register
//               </Link>
//             </>
//           ) : (
//             <div className="flex items-center gap-4">
//               <Link
//                 to="/profile"
//                 className="hover:text-yellow-400"
//               >
//                 Profile
//               </Link>

//               <button
//                 onClick={() => {
//                   localStorage.removeItem("token");
//                   localStorage.removeItem("role");
//                   setIsAuth(false);
//                   navigate("/");
//                 }}

//                 className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
//               >
//                 Logout
//               </button>
//             </div>
//           )}

//         </div>
//       </nav>

//       <main className="min-h-screen bg-gray-100 ">
//         <Routes>
//           <Route path="/" element={<HomePage />} />

//           <Route path="/bookings" element={
//             <ProtectedRoutes>
//               <MyBookings />
//             </ProtectedRoutes>}
//           />
//           <Route path="/profile" element={
//             <ProtectedRoutes>
//               <ProfilePage />
//             </ProtectedRoutes>}
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/search" element={<Search />} />
//           <Route path="/movie/:id" element={<MovieDetails />} />
//           <Route path="/show/:showId/seats" element={
//             <ProtectedRoutes>
//               <SeatSelection />
//             </ProtectedRoutes>
//           } />
//           <Route path="/booking-success" element={<BookingSuccess />} />

//         </Routes>
//       </main>
//     </>
//   );
// }
// export default App;

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn, getRole } from "../utlis/auth.js";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import MyBookings from "./pages/MyBookings";
import ProfilePage from "./pages/ProfilePage";
import BookingSuccess from "./pages/BookingSuccessPage";

import ProtectedRoutes from "../routes/ProtectedRoutes.jsx";
import OwnerRoutes from "../routes/OwnerRoutes";
import AdminRoutes from "../routes/AdminRoutes";

// OWNER PAGES
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MyTheaters from "./pages/owner/MyTheaters";
import MyShows from "./pages/owner/MyShows";

// ADMIN PAGE
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomeGuard from "../routes/HomeGuard.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [isAuth, setIsAuth] = useState(isLoggedIn());
  const role = getRole();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => setIsAuth(isLoggedIn());
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuth(false);
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <h1
          onClick={() => {
            if (!isAuth || role === "user") {
              navigate("/");
            } else if (role === "owner") {
              navigate("/owner/dashboard");
            } else if (role === "admin") {
              navigate("/admin/dashboard");
            }
          }}
          className="text-xl font-bold tracking-tight cursor-pointer flex items-center gap-2"
        >
          🎬 MovieBook
        </h1>

        <div className="flex gap-6 items-center">
          {/* HOME + SEARCH → ONLY USER / GUEST */}
          {(!isAuth || role === "user") && (
            <>
              <Link to="/" className="hover:text-yellow-400">
                Home
              </Link>

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
            </>
          )}

          {/* USER NAV */}
          {isAuth && role === "user" && (
            <Link to="/bookings" className="hover:text-yellow-400">
              My Bookings
            </Link>
          )}

          {/* OWNER NAV */}
          {isAuth && role === "owner" && (
            <>
              <Link to="/owner/dashboard" className="hover:text-yellow-400">
                Dashboard
              </Link>
              <Link to="/owner/theaters" className="hover:text-yellow-400">
                My Theaters
              </Link>
              <Link to="/owner/shows" className="hover:text-yellow-400">
                Shows
              </Link>
            </>
          )}

          {/* ADMIN NAV */}
          {isAuth && role === "admin" && (
            <Link to="/admin/dashboard" className="hover:text-yellow-400">
              Admin Panel
            </Link>
          )}

          {/* AUTH */}
          {!isAuth ? (
            <>
              <Link to="/login" className="bg-yellow-400 text-black px-4 py-1 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-black px-4 py-1 rounded">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-yellow-400">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>


      {/* ROUTES */}
      <main className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <HomeGuard>
                <HomePage />
              </HomeGuard>
            }
          />

          {/* USER */}
          <Route path="/bookings" element={
            <ProtectedRoutes>
              <MyBookings />
            </ProtectedRoutes>
          } />

          <Route path="/profile" element={
            <ProtectedRoutes>
              <ProfilePage />
            </ProtectedRoutes>
          } />

          <Route path="/show/:showId/seats" element={
            <ProtectedRoutes>
              <SeatSelection />
            </ProtectedRoutes>
          } />

          {/* OWNER */}
          <Route path="/owner/dashboard" element={
            <OwnerRoutes>
              <OwnerDashboard />
            </OwnerRoutes>
          } />

          <Route path="/owner/theaters" element={
            <OwnerRoutes>
              <MyTheaters />
            </OwnerRoutes>
          } />

          <Route path="/owner/shows" element={
            <OwnerRoutes>
              <MyShows />
            </OwnerRoutes>
          } />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={
            <AdminRoutes>
              <AdminDashboard />
            </AdminRoutes>
          } />

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
