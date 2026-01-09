import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IMAGE_BASE = "http://localhost:3000"; // backend base

const ManageMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const res = await axios.get("http://localhost:3000/api/movies");
    setMovies(res.data.data);
  };

  const deleteMovie = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    await axios.delete(`http://localhost:3000/api/admin/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setMovies(movies.filter(m => m._id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">
          Manage Movies
        </h2>

        <button
          onClick={() => navigate("/admin/movies/add")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Movie
        </button>
      </div>

      {/* Movie Cards */}
      {movies.length === 0 ? (
        <p className="text-gray-500">No movies found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movies.map(movie => (
            <div
              key={movie._id}
              className="bg-white rounded-lg shadow p-5 flex gap-4"
            >
              {/* Poster */}
              <img
                src={
                  movie.poster
                    ? `${IMAGE_BASE}${movie.poster}`
                    : "https://via.placeholder.com/120x160?text=No+Image"
                }
                alt={movie.title}
                className="w-28 h-40 object-cover rounded"
              />

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">
                  {movie.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {movie.description || "No description"}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {movie.genre} • {movie.language} • {movie.duration} mins
                </p>

                {/* Actions */}
                <div className="flex gap-4 mt-4 text-sm">
                  <button
                    onClick={() =>
                      navigate(`/admin/movies/view/${movie._id}`)
                    }
                    className="text-sky-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/movies/edit/${movie._id}`)
                    }
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMovie(movie._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
