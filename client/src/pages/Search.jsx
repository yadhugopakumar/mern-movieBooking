import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Armchair, Loader2, CreditCard } from "lucide-react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast"; // Added Toaster import

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seatMap, setSeatMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // FIXED: Removed nested useEffect and kept it clean
  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/user/shows/${showId}/seats`);
        
        const grouped = {};
        res.data.forEach((seat) => {
          const row = seat.seatNumber[0];
          if (!grouped[row]) grouped[row] = [];
          grouped[row].push(seat);
        });

        setSeatMap(grouped);
      } catch (err) {
        console.error("Failed to load seats:", err);
        toast.error("Could not load seat layout");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchSeats();
  }, [showId]);

  const toggleSeat = (seat) => {
    if (seat.isBooked || seat.isLocked) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  // Calculate price safely
  const totalPrice = Object.values(seatMap)
    .flat()
    .filter((seat) => selectedSeats.includes(seat.seatNumber))
    .reduce((sum, seat) => sum + seat.price, 0);

  const handleFinalBooking = async (paymentId) => {
    setIsProcessing(true);
    try {
      // 1. Lock seats
      await api.post("/api/seats/lock", { showId, seats: selectedSeats });

      // 2. Create booking
      await api.post("/api/bookings", { 
        showId, 
        seats: selectedSeats, 
        totalAmount: totalPrice,
        paymentId 
      });

      toast.success("Tickets Booked Successfully!");
      setTimeout(() => navigate("/booking-success"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Booking failed.";
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;

    const options = {
      key: "rzp_test_UZxFx9Yabljqin", 
      amount: totalPrice * 100,
      currency: "INR",
      name: "CinePass",
      description: "Movie Ticket Booking",
      handler: async function (response) {
        await handleFinalBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: localStorage.getItem("userName") || "Guest User",
        email: "user@example.com",
      },
      theme: { color: "#DC2626" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (loading || isProcessing) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950">
      <Toaster />
      <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
      <p className="text-zinc-400 animate-pulse">
        {isProcessing ? "Finalizing Booking..." : "Loading Seats..."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <Toaster position="top-center" />
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-lg">Choose Your Seats</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">₹{totalPrice} Payable</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="relative flex flex-col items-center mb-20">
          <div className="w-full max-w-[600px] h-[4px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full"></div>
          <p className="text-[10px] mt-4 tracking-[0.5em] font-black uppercase text-zinc-400">Screen This Way</p>
        </div>

        <div className="flex flex-col gap-10 items-center overflow-x-auto py-4">
          {Object.entries(seatMap).map(([row, seats]) => (
            <div key={row} className="flex items-center gap-6 min-w-max">
              <span className="text-xs font-black text-zinc-400 w-4">{row}</span>
              <div className="flex gap-3">
                {seats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    disabled={seat.isBooked || seat.isLocked}
                    onClick={() => toggleSeat(seat)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                        selectedSeats.includes(seat.seatNumber) 
                        ? "bg-red-600 border-red-600 text-white" 
                        : "border-zinc-300 dark:border-zinc-700 hover:border-red-500"
                    } ${seat.isBooked || seat.isLocked ? "bg-zinc-800 opacity-20 cursor-not-allowed" : ""}`}
                  >
                    <Armchair size={14} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedSeats.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 p-6 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-2xl font-black">₹{totalPrice}</p>
              <p className="text-xs text-zinc-400">{selectedSeats.length} Seats Selected</p>
            </div>
            <button onClick={handlePayment} className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-2xl font-black uppercase flex items-center gap-3">
              <CreditCard size={20} /> Pay & Book
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default SeatSelection;
