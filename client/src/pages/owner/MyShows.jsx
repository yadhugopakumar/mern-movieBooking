import { useEffect, useState } from "react";
import axios from "axios";

const MyShows = () => {
    const [shows, setShows] = useState([]);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem("token");
    const [editShow, setEditShow] = useState(null);

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        const res = await axios.get(
            "http://localhost:3000/api/owner/shows",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setShows(res.data);
    };

    const openBookings = async (showId) => {
        const res = await axios.get(
            `http://localhost:3000/api/owner/shows/${showId}/bookings`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data);
        setShowBookingsModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this show?")) return;

        await axios.delete(
            `http://localhost:3000/api/owner/shows/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchShows();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">My Shows</h1>

            {shows.length === 0 ? (
                <p className="text-gray-500">No shows scheduled.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shows.map((show) => (
                        <div
                            key={show._id}
                            className="bg-white p-5 rounded shadow space-y-3"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold text-green-700">
                                        {show.movieId?.title}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        🎭 {show.theaterId?.name} – {show.theaterId?.location}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="text-blue-600 text-sm hover:underline"
                                        onClick={() => setEditShow(show)}

                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-600 text-sm hover:underline"
                                        onClick={() => handleDelete(show._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="text-indigo-600 text-sm hover:underline"
                                        onClick={() => openBookings(show._id)}
                                    >
                                        View Bookings
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>
                                    📅 <strong>Date:</strong>{" "}
                                    {new Date(show.date).toLocaleDateString()}
                                </p>
                                <p>
                                    ⏰ <strong>Time:</strong> {show.time}
                                </p>
                                <p>
                                    💰 <strong>Base Price:</strong> ₹{show.basePrice}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* BOOKINGS MODAL */}
            {showBookingsModal && (
                <Modal
                    title="Show Bookings"
                    onClose={() => setShowBookingsModal(false)}
                >
                    {bookings.length === 0 ? (
                        <p className="text-gray-500 text-sm ">No bookings yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border text-black">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">User</th>
                                        <th className="p-2 border">Email</th>
                                        <th className="p-2 border">Seats</th>
                                        <th className="p-2 border">Amount</th>
                                        <th className="p-2 border">Booked At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="text-center">
                                            <td className="p-2 border">{b.user?.name}</td>
                                            <td className="p-2 border">{b.user?.email}</td>
                                            <td className="p-2 border">{b.seats.join(", ")}</td>
                                            <td className="p-2 border">₹{b.totalAmount}</td>
                                            <td className="p-2 border">
                                                {new Date(b.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>
            )}

            {editShow && (
                <Modal
                    title="Edit Show"
                    onClose={() => setEditShow(null)}
                >
                    <EditShowForm
                        show={editShow}
                        token={token}
                        onSuccess={() => {
                            setEditShow(null);
                            fetchShows();
                        }}
                    />
                </Modal>
            )}

        </div>
    );
};
const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2 text-black">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-xl hover:text-black"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
const EditShowForm = ({ show, token, onSuccess }) => {
    const [form, setForm] = useState({
        date: show.date?.split("T")[0],
        time: show.time,
        basePrice: show.basePrice,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.put(
            `http://localhost:3000/api/owner/shows/${show._id}`,
            {
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
        <form onSubmit={handleSubmit} className="space-y-4 text-black ">
            {/* Movie (read-only) */}
            <input
                value={show.movieId?.title}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
            />

            {/* Theater (read-only) */}
            <input
                value={`${show.theaterId?.name} – ${show.theaterId?.location}`}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
            />

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
                Update Show
            </button>
        </form>
    );
};

export default MyShows;
