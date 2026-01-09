import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams(); // movieId
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);


  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // 1️⃣ Fetch movie details
    axios
      .get(`http://localhost:3000/api/movies/${id}`)
      .then(res => setMovie(res.data.data))
      .catch(err => console.error(err));
    axios
      .get(`http://localhost:3000/api/movies/${id}/reviews`)
      .then(res => setReviews(res.data.data));

    // 2️⃣ Fetch shows for this movie
    axios
      .get(`http://localhost:3000/api/shows/${id}`)
      .then(res => setShows(res.data.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p className="text-black">Loading movie…</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      {/* Movie Header */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-4xl font-bold text-green-950">{movie.title}</h1>
        <p className="text-gray-500 mt-1">
          {movie.genre} • {movie.language} • {movie.duration} mins
        </p>

        <p className="mt-4 text-gray-700 max-w-3xl">
          {movie.description}
        </p>
      </div>

      {/* Shows Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-black">
          Available Shows
        </h2>

        {shows.length === 0 && (
          <p className="text-gray-500">No shows available</p>
        )}

        {shows.map(show => (
          <div
            key={show._id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                {show.theaterId.name}
              </p>

              <p className="text-gray-500">
                {show.date} • {show.time}
              </p>

              <p className="text-sm text-gray-500">
                From ₹{show.basePrice}
              </p>
            </div>

            <button
              className="mt-4 md:mt-0 bg-yellow-400 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500"
              onClick={() => navigate(`/show/${show._id}/seats`)}
            >
              Select Seats
            </button>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-orange-500">Reviews</h2>

          {localStorage.getItem("token") ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Review
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer"
            >
              Login to Review
            </button>
          )}
        </div>


        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}

        {reviews.map(r => (
          <div
            key={r._id}
            className="border-b pb-3 flex justify-between gap-4"
          >
            {/* Review content */}
            <div>
              <p className="font-semibold">{r.userName}</p>

              <p className="text-yellow-500">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>

              <p className="text-gray-600">{r.comment}</p>
            </div>

            {/* Delete button – only for owner */}
            {r.userId === localStorage.getItem("userId") && (
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this review?")) return;

                  try {
                    await axios.delete(
                      `http://localhost:3000/api/reviews/${r._id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );

                    // Remove review from UI
                    setReviews(prev =>
                      prev.filter(rv => rv._id !== r._id)
                    );
                  } catch (err) {
                    console.error(err);
                    alert("Failed to delete review");
                  }
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}

      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 text-black">
            <h3 className="text-xl font-semibold">Add Review</h3>

            <select
              value={rating}
              onChange={e => setRating(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n} Stars</option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              className="w-full border p-2 rounded"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
  disabled={!comment.trim()}
  onClick={async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/movies/${id}/reviews`,
        {
          rating: Number(rating),   // ✅ ensure number
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Add new review to UI (top)
      setReviews(prev => [res.data, ...prev]);

      setShowModal(false);
      setComment("");
      setRating(5);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add review"
      );
    }
  }}
>
  Submit
</button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;
