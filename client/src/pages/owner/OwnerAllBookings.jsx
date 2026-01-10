import { useEffect, useState } from "react";
import api from "../api/axios"; // Your centralized instance
import toast from "react-hot-toast";
import { Receipt } from "lucide-react";

export default function OwnerAllBookings() {
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        // 1. Simplified URL: 'api' already knows your Railway base URL
        // 2. No manual headers: interceptor adds the token automatically
        const res = await api.get("/api/owner/bookings");
        
        // 3. Handle both res.data.data or res.data depending on your backend
        setBookings(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching all bookings:", err);
        toast.error("Failed to load booking history");
      }
    };
  
    fetchAllBookings();
  }, []);

  // Group by Date -> Theatre
  const grouped = bookings.reduce((acc, b) => {
    const date = b.showDetails?.date || "Unknown Date";
    const theater = b.theaterDetails?.name || "Unknown Theatre";

    acc[date] = acc[date] || {};
    acc[date][theater] = acc[date][theater] || [];
    acc[date][theater].push(b);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Receipt className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Booking History</h1>
          </div>
          <p className="text-zinc-500">
            Date-wise and theatre-wise booking summary
          </p>
        </header>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed">
            <Receipt className="mx-auto mb-4 text-zinc-400" size={48} />
            <p className="text-zinc-500">No bookings found</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, theaters]) => (
            <div key={date} className="mb-10">

              {/* Date Heading */}
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                📅 {date}
              </h2>

              {Object.entries(theaters).map(([theaterName, shows]) => (
                <div key={theaterName} className="mb-6">

                  {/* Theatre Name */}
                  <h3 className="text-lg font-semibold mb-2">
                    🎭 {theaterName}
                  </h3>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr>
                          <th className="p-3 text-left">Movie</th>
                          <th className="p-3 text-left">Show Time</th>
                          <th className="p-3 text-left">Seats Count</th>
                          <th className="p-3 text-left">Seat Numbers</th>
                          <th className="p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shows.map((b) => (
                          <tr
                            key={b._id}
                            className="border-t dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          >
                            <td className="p-3 font-medium">
                              {b.showDetails?.movieName}
                            </td>
                            <td className="p-3">
                              {b.showDetails?.time}
                            </td>
                            <td className="p-3">
                              {b.seats?.length}
                            </td>
                            <td className="p-3">
                              {b.seats?.join(", ")}
                            </td>
                            <td className="p-3 text-right font-bold text-red-600">
                              ₹{b.totalAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
