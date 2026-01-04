import Theater from "../models/theatreModel.js";
import Show from "../models/showModel.js";
import Seat from "../models/seatModel.js";
import Booking from "../models/bookingModel.js";

export const getMyTheaters = async (req, res) => {
  const theaters = await Theater.find({ ownerId: req.user.id });
  res.json(theaters);
};
// controllers/ownerDashboardController.js
// controllers/ownerDashboardController.js

// export const getOwnerDashboardStats = async (req, res) => {
//   try {
//     const ownerId = req.user.id;

//     // 1️⃣ Owner theaters
//     const theaters = await Theater.find({ ownerId }).select("_id");
//     const theaterIds = theaters.map(t => t._id);

//     // 2️⃣ Total theaters
//     const totalTheaters = theaterIds.length;

//     // 3️⃣ Date range (today)
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     // 4️⃣ Active shows today
//     const showsToday = await Show.countDocuments({
//       theaterId: { $in: theaterIds },
//       date: { $gte: start, $lte: end },
//     });

//     // ================= TODAY =================
//     const todaysBookings = await Booking.find({
//       theater: { $in: theaterIds },
//       paymentStatus: "paid",
//       createdAt: { $gte: start, $lte: end },
//     });

//     const todaysSeatsBooked = todaysBookings.reduce(
//       (sum, b) => sum + b.seats.length,
//       0
//     );

//     const todaysRevenue = todaysBookings.reduce(
//       (sum, b) => sum + b.totalAmount,
//       0
//     );

//     // ================= ALL TIME =================
//     const allBookings = await Booking.find({
//       theater: { $in: theaterIds },
//       paymentStatus: "paid",
//     });

//     const totalSeatsBooked = allBookings.reduce(
//       (sum, b) => sum + b.seats.length,
//       0
//     );

//     const totalRevenue = allBookings.reduce(
//       (sum, b) => sum + b.totalAmount,
//       0
//     );

//     res.status(200).json({
//       totalTheaters,
//       showsToday,

//       todaysStats: {
//         bookings: todaysBookings.length,
//         seatsBooked: todaysSeatsBooked,
//         revenue: todaysRevenue,
//       },

//       allTimeStats: {
//         bookings: allBookings.length,
//         seatsBooked: totalSeatsBooked,
//         revenue: totalRevenue,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to load owner dashboard stats",
//       error: error.message,
//     });
//   }
// };


export const getOwnerDashboardStats = async (req, res) => {
  const ownerId = req.user.id;

  // 1️⃣ Get owner theaters
  const theaters = await Theater.find({ ownerId }).select("_id");
  const theaterIds = theaters.map(t => t._id);

  // 2️⃣ Total theaters
  const totalTheaters = theaterIds.length;

  // 3️⃣ Today range
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // 4️⃣ Shows today
  const showsToday = await Show.find({
    theaterId: { $in: theaterIds },
    date: { $gte: startOfToday, $lte: endOfToday },
  }).select("_id");

  const showIdsToday = showsToday.map(s => s._id);

  // 5️⃣ All shows of owner
  const allShows = await Show.find({
    theaterId: { $in: theaterIds },
  }).select("_id");

  const allShowIds = allShows.map(s => s._id);

  // 6️⃣ Today's bookings
  const todaysBookings = await Booking.find({
    show: { $in: showIdsToday },
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });

  // 7️⃣ All-time bookings
  const allBookings = await Booking.find({
    show: { $in: allShowIds },
  });

  // 8️⃣ Calculations
  const todaysStats = {
    bookings: todaysBookings.length,
    seatsBooked: todaysBookings.reduce(
      (sum, b) => sum + b.seats.length,
      0
    ),
    revenue: todaysBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    ),
  };

  const allTimeStats = {
    bookings: allBookings.length,
    seatsBooked: allBookings.reduce(
      (sum, b) => sum + b.seats.length,
      0
    ),
    revenue: allBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    ),
  };

  res.json({
    totalTheaters,
    showsToday: showsToday.length,
    todaysStats,
    allTimeStats,
  });
};

export const addTheater = async (req, res) => {
  try {
    const { name, location, seatLayout } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Theater name and location are required",
      });
    }

    if (!seatLayout || seatLayout.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Seat layout is required",
      });
    }

    // sanitize seat layout
    const formattedSeatLayout = seatLayout.map((row) => ({
      row: row.row.toUpperCase(),
      seatCount: Number(row.seatCount),
      price: Number(row.price),
    }));

    const theater = await Theater.create({
      name,
      location,
      seatLayout: formattedSeatLayout,
      ownerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Theater added successfully",
      data: theater,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add theater",
      error: error.message,
    });
  }
};


export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.json({ message: "Theater deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getTheaterById = async (req, res) => {
  const theater = await Theater.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });

  if (!theater) {
    return res.status(404).json({ message: "Theater not found" });
  }

  res.json(theater);
};

export const addShow = async (req, res) => {
  try {
    const { movieId, theaterId, date, time, basePrice } = req.body;

    // 1️⃣ Verify theater belongs to owner
    const theater = await Theater.findOne({
      _id: theaterId,
      ownerId: req.user.id,
    });

    if (!theater) {
      return res.status(403).json({
        message: "You do not own this theater",
      });
    }

    // 2️⃣ Create show (NO seats field)
    const show = await Show.create({
      movieId,
      theaterId,
      date,
      time,
      basePrice,
    });

    // 3️⃣ Create seats for this show
    const seatDocs = [];

    theater.seatLayout.forEach((row) => {
      for (let i = 1; i <= row.seatCount; i++) {
        seatDocs.push({
          theater: theater._id,
          show: show._id,
          seatNumber: `${row.row}${i}`,
          price: row.price ?? basePrice, // 👈 fallback
          isBooked: false,
          isLocked: false,
        });
      }
    });

    await Seat.insertMany(seatDocs);

    res.status(201).json({
      message: "Show created and seats generated successfully",
      data: show,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create show",
      error: error.message,
    });
  }
};
export const getShowBookings = async (req, res) => {
  const { showId } = req.params;

  const bookings = await Booking.find({ show: showId })
    .populate("user", "name email")
    .select("seats totalAmount createdAt");

  res.json(bookings);
};
export const updateShow = async (req, res) => {
  try {
    const { basePrice, date, time } = req.body;

    const show = await Show.findOneAndUpdate(
      { _id: req.params.id },
      { basePrice, date, time },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    await Seat.deleteMany({ show: show._id });

    res.json({ message: "Show and seats deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getShows = async (req, res) => {
  const shows = await Show.find()
    .populate("theaterId", "name location")
    .populate("movieId", "title")
    .select("movieId theaterId date time basePrice");

  res.json(shows);
};

