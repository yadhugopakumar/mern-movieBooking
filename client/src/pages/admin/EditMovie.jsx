import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const IMAGE_BASE = "http://localhost:3000";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: "",
    language: "",
    description: "",
    duration: "",
    genre: "",
    poster: "" // existing poster path
  });

  const [newPoster, setNewPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/movies/${id}`)
      .then(res => {
        setMovie(res.data.data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", movie.title);
    formData.append("language", movie.language);
    formData.append("genre", movie.genre);
    formData.append("duration", movie.duration);
    formData.append("description", movie.description);

    if (newPoster) {
      formData.append("poster", newPoster);
    }

    await axios.put(
      `http://localhost:3000/api/admin/movie/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("Movie updated successfully");
    navigate("/admin/movies");
  };

  if (loading) return <p className="p-6">Loading movie...</p>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold text-green-800 mb-6">
        Edit Movie
      </h1>

      <form
        className="bg-white p-6 rounded shadow space-y-4 text-black"
        onSubmit={handleSubmit}
      >
        {/* Poster Preview */}
        <div className="flex gap-6 items-start">
          <img
            src={
              newPoster
                ? URL.createObjectURL(newPoster)
                : movie.poster
                ? `${IMAGE_BASE}${movie.poster}`
                : "https://via.placeholder.com/150x220?text=No+Image"
            }
            alt="poster"
            className="w-36 h-52 object-cover rounded"
          />

          <div className="flex-1 space-y-4">
            <Input label="Title" name="title" value={movie.title} onChange={handleChange} />
            <Input label="Language" name="language" value={movie.language} onChange={handleChange} />
            <Input label="Genre" name="genre" value={movie.genre} onChange={handleChange} />
            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={movie.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Change Poster (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewPoster(e.target.files[0])}
          />
        </div>

        <TextArea
          label="Description"
          name="description"
          value={movie.description}
          onChange={handleChange}
        />

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Update
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input {...props} className="w-full border p-2 rounded" />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <textarea {...props} rows="4" className="w-full border p-2 rounded" />
  </div>
);

export default EditMovie;
