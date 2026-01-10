import { useState, useEffect } from "react";
import { useEffect, useState } from "react"; // Added missing useState import
import { useNavigate } from "react-router-dom";
// 1. Import your custom api instance
import api from "../api/axios"; 
import { Plus, Trash2, Edit3, Eye, Film, Loader2, Clock, Globe } from "lucide-react";
import toast from "react-hot-toast";

// 2. Dynamically set the IMAGE_BASE for production
const IMAGE_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ManageMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // 3. Use 'api' instance (automatically prepends your Railway URL)
      const res = await api.get("/api/movies");
      // Handle data mapping (checks for res.data.data or res.data)
      setMovies(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      toast.error("Could not load movies");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) return;

    try {
      // 4. No need for manual headers anymore! 
      await api.delete(`/api/admin/movie/${id}`);
      
      setMovies(prev => prev.filter(m => m._id !== id));
      toast.success("Movie deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete movie");
    }
  };

  // Rest of your JSX logic...s

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Movie Catalog</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage the global database of available films.</p>
          </div>

          <button
            onClick={() => navigate("/admin/movies/add")}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Add New Movie
          </button>
        </header>

        {/* Movie Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <Film className="mx-auto mb-4 text-zinc-300 dark:text-zinc-700" size={60} />
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No movies in the catalog yet</p>
            <button 
              onClick={() => navigate("/admin/movies/add")}
              className="mt-4 text-red-600 font-bold hover:underline"
            >
              Upload your first movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {movies.map(movie => (
              <div
                key={movie._id}
                className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-red-500/30"
              >
                {/* Poster with Shadow Overlay */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img
                    src={movie.poster ? `${IMAGE_BASE}${movie.poster}` : "https://via.placeholder.com/120x160?text=No+Poster"}
                    alt={movie.title}
                    className="w-32 h-48 object-cover rounded-2xl shadow-md group-hover:shadow-red-500/20 transition-all duration-300"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
                      {movie.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                        {movie.genre}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                        <Globe size={10} /> {movie.language}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                        <Clock size={10} /> {movie.duration}m
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed italic">
                    {movie.description || "No description provided for this film."}
                  </p>

                  {/* Actions - Pushed to bottom */}
                  <div className="mt-auto pt-6 flex items-center justify-between sm:justify-start gap-4">
                    <button
                      onClick={() => navigate(`/admin/movies/view/${movie._id}`)}
                      className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      <Eye size={14} /> View
                    </button>

                    <button
                      onClick={() => navigate(`/admin/movies/edit/${movie._id}`)}
                      className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => deleteMovie(movie._id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMovies;
