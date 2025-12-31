// import { useState } from "react";

// const theater = {
//   name: "INOX Lulu Mall",
//   seatLayout: [
//     { row: "A", seatCount: 10, price: 120 },
//     { row: "B", seatCount: 12, price: 150 },
//     { row: "C", seatCount: 14, price: 180 },
//   ],
// };

// // TEMP: booked seats (later from backend)
// const bookedSeats = ["A3", "B6", "C10"];

// const SeatSelection = () => {
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   const toggleSeat = (seatId) => {
//     if (bookedSeats.includes(seatId)) return;

//     setSelectedSeats((prev) =>
//       prev.includes(seatId)
//         ? prev.filter((s) => s !== seatId)
//         : [...prev, seatId]
//     );
//   };

//   const totalPrice = selectedSeats.reduce((sum, seatId) => {
//     const row = seatId[0];
//     const rowData = theater.seatLayout.find((r) => r.row === row);
//     return sum + rowData.price;
//   }, 0);

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       <h1 className="text-3xl font-bold">{theater.name}</h1>

//       {/* Seat Layout */}
//       <div className="space-y-6">
//         {theater.seatLayout.map((row) => (
//           <div key={row.row}>
//             <p className="mb-2 font-semibold">
//               Row {row.row} — ₹{row.price}
//             </p>

//             <div className="flex flex-wrap gap-2">
//               {Array.from({ length: row.seatCount }).map((_, i) => {
//                 const seatId = `${row.row}${i + 1}`;
//                 const isBooked = bookedSeats.includes(seatId);
//                 const isSelected = selectedSeats.includes(seatId);

//                 return (
//                   <button
//                     key={seatId}
//                     onClick={() => toggleSeat(seatId)}
//                     disabled={isBooked}
//                     className={`w-10 h-10 rounded text-sm font-semibold
//                       ${
//                         isBooked
//                           ? "bg-gray-400 text-white cursor-not-allowed"
//                           : isSelected
//                           ? "bg-yellow-400 text-black"
//                           : "bg-white border hover:bg-gray-100"
//                       }`}
//                   >
//                     {seatId}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Summary */}
//       <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
//         <div>
//           <p className="font-semibold">
//             Selected Seats:{" "}
//             {selectedSeats.length > 0
//               ? selectedSeats.join(", ")
//               : "None"}
//           </p>
//           <p className="text-gray-500">Total: ₹{totalPrice}</p>
//         </div>

//         <button
//           disabled={selectedSeats.length === 0}
//           className="bg-yellow-400 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
//         >
//           Proceed to Pay
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// This is your exact API response structure
const theater = {
  _id: { $oid: "6953fe563b35648c54d0b5cc" },
  name: "INOX Lulu Mall",
  location: "Kochi",
  seatLayout: [
    { row: "A", seatCount: 10, price: 120, _id: { $oid: "6953fe563b35648c54d0b5cd" } },
    { row: "B", seatCount: 12, price: 150, _id: { $oid: "6953fe563b35648c54d0b5ce" } },
    { row: "C", seatCount: 14, price: 180, _id: { $oid: "6953fe563b35648c54d0b5cf" } },
  ],
};

const bookedSeats = ["A3", "B6", "C10"]; // Logic for already sold seats

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const toggleSeat = (seatId, price) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seatId)
        ? prev.filter((s) => s.id !== seatId)
        : [...prev, { id: seatId, price }]
    );
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 1. Navbar */}
      <div className="bg-[#1F2533] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="hover:text-gray-300 p-2 bg-gray-700 px-3 rounded-md"   onClick={() => navigate(-1)}>←</button>
          <div>
            <h1 className="text-lg font-bold leading-none">{theater.name}</h1>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider" style={{"color":"white"}}>{theater.location} • Today, 07:00 PM</p>
          </div>
        </div>
      </div>

      <div className="max-w-fit mx-auto px-4 py-12">
        {/* 2. Screen Visualizer */}
        <div className="flex flex-col items-center mb-20">
          <div className="w-full max-w-[500px] h-1 bg-blue-400 rounded-full shadow-[0_10px_20px_rgba(96,165,250,0.4)]"></div>
          <p className="text-[10px] text-gray-400 mt-4 tracking-[0.5em] uppercase">All eyes this way</p>
        </div>

        {/* 3. Seat Layout Mapping */}
        <div className="flex flex-col gap-8">
          {theater.seatLayout.map((row) => (
            <div key={row._id.$oid} className="space-y-3">
              {/* Row Label & Price */}
              <div className="border-b border-gray-100 pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {row.row} — ₹{row.price}
                </span>
              </div>

              <div className="flex items-center gap-4 text-center justify-center">
                {/* Left Side Row Letter */}
                <span className="w-4 text-[11px] text-gray-400 font-bold">{row.row}</span>
                
                {/* Dynamic Seat Generation */}
                <div className="flex gap-2 ">
                  {Array.from({ length: row.seatCount }).map((_, i) => {
                    const seatNumber = i + 1;
                    const seatId = `${row.row}${seatNumber}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.find(s => s.id === seatId);

                    return (
                      <button
                        key={seatId}
                        onClick={() => toggleSeat(seatId, row.price)}
                        disabled={isBooked}
                        className={`
                          w-7 h-7 md:w-8 md:h-8 rounded-[4px] border text-[10px] font-medium transition-all duration-200
                          ${isBooked 
                            ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed" 
                            : isSelected 
                            ? "bg-[#4ABD5D] border-[#4ABD5D] text-white" 
                            : "bg-white border-green-500 text-green-600 hover:bg-[#4ABD5D] hover:text-white"
                          }
                          /* Creating an aisle gap */
                          ${seatNumber === 2 || seatNumber === row.seatCount - 2 ? "mr-6 md:mr-10" : ""}
                        `}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Legend */}
        <div className="mt-20 flex justify-center gap-8 text-[11px] text-gray-500 font-medium border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2"><div className="w-4 h-4 border border-green-500 rounded-sm"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#4ABD5D] rounded-sm"></div> Selected</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded-sm"></div> Sold</div>
        </div>
      </div>

      {/* 5. Sticky Footer (BookMyShow Style) */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">{selectedSeats.length} Ticket(s)</p>
              <p className="text-xl font-black text-gray-900">₹{totalPrice}</p>
            </div>
            <button className="bg-[#F84464] hover:bg-[#e63a5a] text-white px-12 py-3 rounded-lg font-black text-sm transition-colors shadow-lg shadow-pink-200">
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;