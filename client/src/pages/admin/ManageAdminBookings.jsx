import { useEffect, useState } from "react";
import axios from "axios";

const ManageAdminBookings = () => {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/bookings-info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      groupBookings(res.data.data);
    });
  }, []);

  const groupBookings = (bookings) => {
    const result = {};

    bookings.forEach(b => {
      const date = b.show?.date || "Unknown Date";
      const theater = b.theater?.name || "Unknown Theater";
      const showKey = `${b.show?.movieId?.title} | ${b.show?.time}`;

      if (!result[date]) result[date] = {};
      if (!result[date][theater]) result[date][theater] = {};
      if (!result[date][theater][showKey]) result[date][theater][showKey] = [];

      result[date][theater][showKey].push(b);
    });

    setGrouped(result);
  };
  const getBookedSeats = (theaterData) => {
    let booked = 0;

    Object.keys(theaterData).forEach(show => {
      theaterData[show].forEach(b => {
        booked += b.seats.length;
      });
    });

    return booked;
  };

  const getTotalSeatsFromLayout = (theaterData) => {
    // get one booking to access theater object
    const sampleBooking =
      theaterData[Object.keys(theaterData)[0]]?.[0];

    if (!sampleBooking?.theater?.seatLayout) return 0;

    return sampleBooking.theater.seatLayout.reduce(
      (sum, row) => sum + row.seatCount,
      0
    );
  };


  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-semibold text-green-800 mb-6">
        Show-wise Booking Details
      </h2>

      {Object.keys(grouped).map(date => (
        <div key={date} className="mb-8">
          {/* Date Header */}
          <div className="bg-gray-200 px-4 py-2 font-semibold rounded">
            📅 Show Date: {date}
          </div>

          {Object.keys(grouped[date]).map(theater => (
            <div key={theater} className="mt-4">
              {/* Theater */}
              <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2">
                🏢 {theater}
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {getBookedSeats(grouped[date][theater])}
                  /
                  {getTotalSeatsFromLayout(grouped[date][theater])} seats
                </span>

              </h3>



              {Object.keys(grouped[date][theater]).map(show => (
                <div key={show} className="mt-3 ml-4">
                  {/* Show */}
                  <h4 className="font-medium text-gray-700">
                    🎬 {show}
                  </h4>

                  {/* Booking Table */}
                  <table className="w-full mt-2 border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">User</th>
                        <th className="border px-2 py-1">Seats</th>
                        <th className="border px-2 py-1">Amount</th>
                        <th className="border px-2 py-1">Status</th>
                        <th className="border px-2 py-1">Booked At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[date][theater][show].map(b => (
                        <tr key={b._id}>
                          <td className="border px-2 py-1">
                            {b.user?.name}
                          </td>
                          <td className="border px-2 py-1">
                            {b.seats.join(", ")}
                          </td>
                          <td className="border px-2 py-1">
                            ₹{b.totalAmount}
                          </td>
                          <td className="border px-2 py-1">
                            {b.paymentStatus}
                          </td>
                          <td className="border px-2 py-1">
                            {new Date(b.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ManageAdminBookings;
