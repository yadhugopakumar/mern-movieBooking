import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  

  // TEMP MOCK DATA (matches your Mongo schema)
  const movie = {
    _id: id,
    title: "Inception",
    language: "English",
    genre: "Sci-Fi • Thriller",
    duration: 148,
    description:
      "A skilled thief is given a chance at redemption if he can successfully perform inception.",
  };

  const shows = [
    {
      _id: "1",
      theater: "PVR Lulu Mall",
      date: "2025-01-20",
      time: "10:30",
      price: 180,
      seats: 120,
    },
    {
      _id: "2",
      theater: "Cinepolis Centre Square",
      date: "2025-01-20",
      time: "14:00",
      price: 200,
      seats: 95,
    },
    {
      _id: "3",
      theater: "INOX Oberon Mall",
      date: "2025-01-20",
      time: "19:30",
      price: 220,
      seats: 60,
    },
  ];

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
        <h2 className="text-2xl font-semibold text-black">Available Shows</h2>

        {shows.map((show) => (
          <div
            key={show._id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="space-y-1">
              <p className="text-lg font-semibold">{show.theater}</p>
              <p className="text-gray-500">
                {show.date} • {show.time}
              </p>
              <p className="text-sm text-gray-500">
                ₹{show.price} • {show.seats} seats available
              </p>
            </div>

            <button className="mt-4 md:mt-0 bg-yellow-400 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500" onClick={()=>navigate(`/show/${show._id}/seats`)}>
              Select Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
