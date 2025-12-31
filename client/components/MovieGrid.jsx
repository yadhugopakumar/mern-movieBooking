import { useNavigate } from "react-router-dom";

const movies = [
  { id: 1, title: "Inception", genre: "Sci-Fi • Thriller", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800" },
  { id: 2, title: "Interstellar", genre: "Sci-Fi • Drama", poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800" },
  { id: 3, title: "Oppenheimer", genre: "Biography • Drama", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800" },
  { id: 4, title: "Dune", genre: "Sci-Fi • Adventure", poster: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800" },
];

const MovieGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
        >
          <img src={movie.poster} alt={movie.title} className="h-56 w-full object-cover" />

          <div className="p-4 space-y-2 text-black">
            <h3 className="font-bold text-lg truncate">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.genre}</p>

            <button className="w-full mt-2 bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500">
              Book Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
