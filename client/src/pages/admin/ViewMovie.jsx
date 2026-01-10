import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 1. Import your custom api instance
import api from "../api/axios"; 
import { ArrowLeft, Edit3, Clock, Globe, Film, Info, Loader2 } from "lucide-react";

// 2. Dynamically set the IMAGE_BASE based on your environment
const IMAGE_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ViewMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Use the 'api' instance (it automatically adds the base URL)
    api.get(`/api/movies/${id}`)
      .then((res) => {
        // Adjust depending on if your backend wraps data in .data.data
        setMovie(res.data.data || res.data);
      })
      .catch((err) => {
        console.error("Error fetching movie:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Rest of your logic...

  if (!movie) {
    return (
      <div className="p-6 text-center text-zinc-500">
        <p>Movie details could not be found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-red-600 font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/admin/movies")}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Catalog</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <div className="flex flex-col md:flex-row">
            
            {/* Poster Section */}
            <div className="md:w-1/3 p-6 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
              <img
                src={
                  movie.poster
                    ? `${IMAGE_BASE}${movie.poster}`
                    : "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={movie.title}
                className="w-full max-w-[280px] aspect-[2/3] object-cover rounded-2xl shadow-2xl border border-white dark:border-zinc-700"
              />
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-8 md:p-12 space-y-8 flex flex-col">
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight dark:text-white leading-tight">
                  {movie.title}
                </h1>
                
                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-3">
                  <MetaPill icon={<Film size={14} />} text={movie.genre || "General"} />
                  <MetaPill icon={<Globe size={14} />} text={movie.language || "N/A"} />
                  <MetaPill icon={<Clock size={14} />} text={`${movie.duration} mins`} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <Info size={14} /> Synopsis
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg italic">
                  {movie.description || "No plot summary available for this title."}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-auto pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/admin/movies/edit/${movie._id}`)}
                  className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                >
                  <Edit3 size={18} />
                  Edit Movie
                </button>
                <button
                  onClick={() => navigate("/admin/movies")}
                  className="px-8 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-2xl font-bold transition-all"
                >
                  Return to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Metadata Pill
const MetaPill = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
    {icon}
    {text}
  </div>
);

export default ViewMovie;
