import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const IMAGE_BASE = "http://localhost:3000";

const ViewMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/movies/${id}`)
      .then(res => setMovie(res.data.data));
  }, [id]);

  if (!movie) return <p className="p-6">Loading movie...</p>;

  return (
    <div className="p-6 max-w-4xl">
     
      <div className="bg-white p-6 rounded shadow flex gap-6">
        {/* Poster */}
        <img
          src={
            movie.poster
              ? `${IMAGE_BASE}${movie.poster}`
              : "https://via.placeholder.com/200x280?text=No+Image"
          }
          alt={movie.title}
          className="w-48 h-72 object-cover rounded"
        />

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-green-800">
            {movie.title}
          </h1>

          <p className="text-gray-600 mt-3">
            {movie.description || "No description available"}
          </p>

          <div className="mt-4 text-sm text-gray-500 space-y-2">
            <p><b>Language:</b> {movie.language || "N/A"}</p>
            <p><b>Genre:</b> {movie.genre || "N/A"}</p>
            <p><b>Duration:</b> {movie.duration} mins</p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate(`/admin/movies/edit/${movie._id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => navigate("/admin/movies")}
              className="bg-gray-200 px-4 py-2 rounded text-black"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMovie;
