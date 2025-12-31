const bookings = [
    {
      id: 1,
      movie: "Inception",
      theatre: "PVR Lulu Mall",
      date: "20 Jan 2025",
      time: "7:30 PM",
      seats: ["A4", "A5"],
      status: "Confirmed",
    },
    {
      id: 2,
      movie: "Interstellar",
      theatre: "Cinepolis Centre Square",
      date: "18 Jan 2025",
      time: "9:00 PM",
      seats: ["C1", "C2", "C3"],
      status: "Completed",
    },
  ];
  
  const MyBookings = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
  
        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No bookings found 🎬
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-black">{b.movie}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      b.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
  
                <div className="text-gray-600 space-y-1">
                  <p>🎥 {b.theatre}</p>
                  <p>📅 {b.date}</p>
                  <p>⏰ {b.time}</p>
                  <p>💺 Seats: {b.seats.join(", ")}</p>
                </div>
  
                <div className="flex gap-3 pt-3">
                  <button className="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500">
                    View Ticket
                  </button>
                  <button className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 text-red-500">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default MyBookings;
  