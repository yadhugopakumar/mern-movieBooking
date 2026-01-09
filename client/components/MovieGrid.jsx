import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const IMAGE_BASE = "http://localhost:3000";

const MovieGrid = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => setMovies(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map(movie => (
        <div
          key={movie._id}
          onClick={() => navigate(`/movie/${movie._id}`)}
          className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
        >
          <img
            src={
              movie.poster
                ? `${IMAGE_BASE}${movie.poster}`
                : "https://via.placeholder.com/300x400?text=No+Image"
            }
            alt={movie.title}
            className="h-56 w-full object-cover"
          />

          <div className="p-4 space-y-2 text-black">
            <h3 className="font-bold text-lg truncate">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.genre}</p>

            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                navigate(`/movie/${movie._id}`);
              }}
              className="w-full mt-2 bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500"
            >
              Book Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
