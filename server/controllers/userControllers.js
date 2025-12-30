import Show from "../models/showModel.js";
import Theater from "../models/theatreModel.js";
import Movie from "../models/movieModel.js";
import Seat from "../models/seatModel.js";
import Bookings from "../models/bookingModel.js";



// Get all movies (global list)
// Get all movies (global list)
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
      error: error.message,
    });
  }
};

// View single movie details
export const viewMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
      error: error.message,
    });
  }
};

  
// Get shows for a selected movie
export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({ movieId })
      .populate("theaterId", "name location")
      .populate("movieId", "title duration");

    res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
      error: error.message,
    });
  }
};

export const searchTheaters = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "query is required (movie or theater name)",
      });
    }

    const safeQuery = query.trim();

    // 🎬 partial + case-insensitive movie match
    const movies = await Movie.find({
      title: { $regex: safeQuery, $options: "i" }
    }).select("_id");

    // 🎭 partial + case-insensitive theater match
    const theaters = await Theater.find({
      name: { $regex: safeQuery, $options: "i" }
    }).select("_id");

    const movieIds = movies.map(m => m._id);
    const theaterIds = theaters.map(t => t._id);

    if (!movieIds.length && !theaterIds.length) {
      return res.json({ data: [] });
    }

    const shows = await Show.find({
      $or: [
        { movieId: { $in: movieIds } },
        { theaterId: { $in: theaterIds } }
      ]
    })
      .populate("movieId", "title duration")
      .populate("theaterId", "name location");

    res.status(200).json({
      message: "Search results fetched successfully",
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};


  export const getShowSeats = async (req, res) => {
    const seats = await Seat.find({ show: req.params.showId });
    res.json(seats);
  };
  export const lockSeats = async (req, res) => {
    const { showId, seats } = req.body;
  
    await Seat.updateMany(
      { show: showId, seatNumber: { $in: seats }, status: "available" },
      { status: "locked" }
    );
  
    res.json({ message: "Seats locked" });
  };



export const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;

    // 1️⃣ Get show to fetch theater
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // 2️⃣ Mark seats as booked
    await Seat.updateMany(
      {
        show: showId,
        seatNumber: { $in: seats },
        isBooked: false,
      },
      { isBooked: true }
    );

    // 3️⃣ Create booking
    const booking = await Bookings.create({
      user: req.user.id,
      theater: show.theaterId,
      show: showId,
      seats,
      totalAmount,
      paymentStatus: "paid",
    });

    res.status(201).json({
      message: "Booking successful",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  const bookings = await Bookings.find({ user: req.user.id })
    .populate("show", "date time price")
    .populate("theater", "name location");

  res.json(bookings);
};

        
