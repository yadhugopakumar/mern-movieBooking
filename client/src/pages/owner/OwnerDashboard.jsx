import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
    const [showTheaterModal, setShowTheaterModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [theaters, setTheaters] = useState([]);
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMovies = async () => {
            const res = await axios.get(
                "http://localhost:3000/api/movies"
            );
            setMovies(res.data.data);
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchTheaters = async () => {
            const res = await axios.get(
                "http://localhost:3000/api/owner/theater",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setTheaters(res.data);
        };

        fetchTheaters();
    }, []);

    const [stats, setStats] = useState({
        totalTheaters: 0,
        showsToday: 0,
        todaysStats: {
            bookings: 0,
            seatsBooked: 0,
            revenue: 0,
        },
        allTimeStats: {
            bookings: 0,
            seatsBooked: 0,
            revenue: 0,
        },
    });
    const [theaterForm, setTheaterForm] = useState({
        name: "",
        location: "",
        seatLayout: [
            { row: "A", seatCount: "", price: "" }
        ],
    });
    const addRow = () => {
        setTheaterForm({
            ...theaterForm,
            seatLayout: [
                ...theaterForm.seatLayout,
                { row: "", seatCount: "", price: "" },
            ],
        });
    };

    const updateRow = (index, field, value) => {
        const updatedRows = [...theaterForm.seatLayout];
        updatedRows[index][field] = value;
        setTheaterForm({ ...theaterForm, seatLayout: updatedRows });
    };


    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStats = async () => {
            const res = await axios.get(
                "http://localhost:3000/api/owner/dashboard-stats",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setStats(res.data);
        };

        fetchStats();
    }, []);

    return (
        <div className="p-6 space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-red-700">Owner Dashboard</h1>
                <p className="text-gray-500">
                    Manage theaters, shows and monitor bookings
                </p>
            </div>

            {/* GENERAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard label="Total Theaters" value={stats.totalTheaters} />
                <StatCard label="Active Shows Today" value={stats.showsToday} />
            </div>

            {/* TODAY STATS */}
            <div>
                <h2 className="text-lg font-semibold mb-3 text-red-700">Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Bookings Today"
                        value={stats.todaysStats.bookings}
                    />
                    <StatCard
                        label="Seats Booked Today"
                        value={stats.todaysStats.seatsBooked}
                    />
                    <StatCard
                        label="Today’s Revenue"
                        value={`₹${stats.todaysStats.revenue}`}
                    />
                </div>
            </div>

            {/* ALL-TIME STATS */}
            <div>
                <h2 className="text-lg font-semibold mb-3 text-red-700">All Time</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Bookings"
                        value={stats.allTimeStats.bookings}
                    />
                    <StatCard
                        label="Total Seats Booked"
                        value={stats.allTimeStats.seatsBooked}
                    />
                    <StatCard
                        label="Total Revenue"
                        value={`₹${stats.allTimeStats.revenue}`}
                    />
                </div>
            </div>

            {/* QUICK ACTIONS */}
            {/* QUICK ACTIONS */}
            <div>
                <h2 className="text-lg font-semibold mb-3 text-red-700">Quick Actions</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => setShowTheaterModal(true)}
                        className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                    >
                        <h3 className="font-medium text-green-600">
                            Add Theaters
                        </h3>
                        <p className="text-sm text-gray-500">
                            Register new theaters
                        </p>
                    </div>

                    <div
                        onClick={() => setShowShowModal(true)}
                        className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                    >
                        <h3 className="font-medium text-green-600">
                            Create Shows
                        </h3>
                        <p className="text-sm text-gray-500">
                            Schedule movies and manage show timings
                        </p>
                    </div>
                    <div
                        onClick={() => navigate("/owner/reviews")}
                        className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md"
                    >
                        <h3 className="font-medium text-green-600">
                            Reviews
                        </h3>
                        <p className="text-sm text-gray-500">
                            View all reviews and feedbacks
                        </p>
                    </div>
                </div>
            </div>
            {showShowModal && (
                <Modal title="Create Show" onClose={() => setShowShowModal(false)}>
                    <CreateShowForm
                        theaters={theaters}
                        token={token}
                        movies={movies}
                        onSuccess={() => setShowShowModal(false)}
                    />
                </Modal>
            )}

            {showTheaterModal && (
                <Modal title="Add New Theater" onClose={() => setShowTheaterModal(false)}>
                    <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                            e.preventDefault();

                            await axios.post(
                                "http://localhost:3000/api/owner/theater",
                                theaterForm,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );

                            setShowTheaterModal(false);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Theater Name"
                            value={theaterForm.name}
                            onChange={(e) =>
                                setTheaterForm({ ...theaterForm, name: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={theaterForm.location}
                            onChange={(e) =>
                                setTheaterForm({ ...theaterForm, location: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />

                        {/* Seat Layout */}
                        <div>
                            <h4 className="font-medium mb-2">Seat Layout</h4>

                            {theaterForm.seatLayout.map((row, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                                    <input
                                        placeholder="Row"
                                        value={row.row}
                                        onChange={(e) =>
                                            updateRow(index, "row", e.target.value)
                                        }
                                        className="border px-2 py-1 rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Seats"
                                        value={row.seatCount}
                                        onChange={(e) =>
                                            updateRow(index, "seatCount", e.target.value)
                                        }
                                        className="border px-2 py-1 rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={row.price}
                                        onChange={(e) =>
                                            updateRow(index, "price", e.target.value)
                                        }
                                        className="border px-2 py-1 rounded"
                                        required
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addRow}
                                className="text-sm text-green-600 mt-1"
                            >
                                + Add Row
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded"
                        >
                            Save Theater
                        </button>
                    </form>
                </Modal>
            )}


        </div>
    );



};
const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-stone-800 rounded-lg w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button onClick={onClose} className="text-gray-500 text-xl">×</button>
            </div>
            {children}
        </div>
    </div>
);

const StatCard = ({ label, value }) => (
    <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">{label}</p>
        <h2 className="text-2xl font-bold text-green-600">{value}</h2>
    </div>
);

const CreateShowForm = ({ theaters, movies, token, onSuccess }) => {
    const [form, setForm] = useState({
        theaterId: "",
        movieId: "",
        date: "",
        time: "",
        basePrice: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post(
            "http://localhost:3000/api/owner/show",
            {
                theaterId: form.theaterId,
                movieId: form.movieId,
                date: form.date,
                time: form.time,
                basePrice: Number(form.basePrice),
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Theater */}
            <select
                required
                value={form.theaterId}
                onChange={(e) =>
                    setForm({ ...form, theaterId: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
            >
                <option value="">Select Theater</option>
                {theaters.map((t) => (
                    <option key={t._id} value={t._id}>
                        {t.name} – {t.location}
                    </option>
                ))}
            </select>

            {/* Movie */}
            <select
                required
                value={form.movieId}
                onChange={(e) =>
                    setForm({ ...form, movieId: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
            >
                <option value="">Select Movie</option>
                {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                        {m.title}

                    </option>
                ))}
            </select>

            {/* Date */}
            <input
                type="date"
                required
                value={form.date}
                onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
            />

            {/* Time */}
            <input
                type="time"
                required
                value={form.time}
                onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
            />

            {/* Base Price */}
            <input
                type="number"
                required
                placeholder="Base Price"
                value={form.basePrice}
                onChange={(e) =>
                    setForm({ ...form, basePrice: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
            >
                Create Show
            </button>
        </form>
    );
};


export default OwnerDashboard;