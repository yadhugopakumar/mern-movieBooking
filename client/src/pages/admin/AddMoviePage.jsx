import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddMovie = () => {
    const navigate = useNavigate();

    const [movie, setMovie] = useState({
        title: "",
        language: "",
        description: "",
        duration: "",
        genre: ""
    });

    const handleChange = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });
    };

    const submit = async () => {
        const formData = new FormData();
      
        Object.keys(movie).forEach(key => {
          formData.append(key, movie[key]);
        });
      
        await axios.post(
          "http://localhost:3000/api/admin/movie",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      
        alert("Movie added");
        navigate("/admin/movies");
      };
      

    return (
        <div className="p-6 ">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
                Add Movie
            </h2>

            <div className="bg-white p-6 rounded shadow space-y-4 text-black">
                <Input
                    label="Title"
                    name="title"
                    value={movie.title}
                    onChange={handleChange}
                />

                <Input
                    label="Language"
                    name="language"
                    value={movie.language}
                    onChange={handleChange}
                />

                <Input
                    label="Genre"
                    name="genre"
                    value={movie.genre}
                    onChange={handleChange}
                />

                <Input
                    label="Duration (minutes)"
                    type="number"
                    name="duration"
                    value={movie.duration}
                    onChange={handleChange}
                />

                <TextArea
                    label="Description"
                    name="description"
                    value={movie.description}
                    onChange={handleChange}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                        setMovie({ ...movie, poster: e.target.files[0] })
                    }
                />

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={submit}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                        Save
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 px-6 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm text-gray-600 mb-1">
            {label}
        </label>
        <input
            {...props}
            className="w-full border p-2 rounded"
        />
    </div>
);

const TextArea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm text-gray-600 mb-1">
            {label}
        </label>
        <textarea
            {...props}
            rows="4"
            className="w-full border p-2 rounded"
        />
    </div>
);

export default AddMovie;
