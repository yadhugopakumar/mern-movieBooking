import { useEffect, useState } from "react";
import axios from "axios";

const MyTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const token = localStorage.getItem("token");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null);

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        const res = await axios.get(
            "http://localhost:3000/api/owner/theater",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        setTheaters(res.data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this theater?")) return;

        await axios.delete(
            `http://localhost:3000/api/owner/theater/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        fetchTheaters();
    };

    const getTotalSeats = (seatLayout) =>
        seatLayout.reduce((sum, row) => sum + row.seatCount, 0);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-red-700">My Theaters</h1>

            {theaters.length === 0 ? (
                <p className="text-gray-500">No theaters added yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {theaters.map((theater) => (
                        <div
                            key={theater._id}
                            className="bg-white p-5 rounded shadow space-y-3"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold text-green-700">
                                        {theater.name}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        📍 {theater.location}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="text-blue-600 text-sm hover:underline"
                                        onClick={() => {
                                            setSelectedTheater(theater);
                                            setEditModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-red-600 text-sm hover:underline"
                                        onClick={() => handleDelete(theater._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Seat Summary */}
                            <div className="text-sm text-gray-700">
                                <strong>Total Seats:</strong>{" "}
                                {getTotalSeats(theater.seatLayout)}
                            </div>

                            {/* Seat Layout */}
                            <div className="border rounded p-3 bg-gray-50">
                                <p className="text-sm font-medium mb-2">Seat Layout</p>

                                <div className="space-y-1 text-sm">
                                    {theater.seatLayout.map((row) => (
                                        <div
                                            key={row._id}
                                            className="flex justify-between"
                                        >
                                            <span className="text-sky-600">
                                                Row {row.row} – {row.seatCount} seats
                                            </span>
                                            <span className="text-gray-600">
                                                ₹{row.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editModalOpen && selectedTheater && (
                <Modal
                    title="Edit Theater"
                    onClose={() => setEditModalOpen(false)}
                >
                    <EditTheaterForm
                        theater={selectedTheater}
                        token={token}
                        onSuccess={() => {
                            setEditModalOpen(false);
                            fetchTheaters();
                        }}
                    />
                </Modal>
            )}

        </div>
    );
};
const EditTheaterForm = ({ theater, token, onSuccess }) => {
    const [form, setForm] = useState({
        name: theater.name,
        location: theater.location,
        seatLayout: theater.seatLayout.map(row => ({
            row: row.row,
            seatCount: row.seatCount,
            price: row.price,
        })),
    });

    const updateRow = (index, field, value) => {
        const updated = [...form.seatLayout];
        updated[index][field] = value;
        setForm({ ...form, seatLayout: updated });
    };

    const addRow = () => {
        setForm({
            ...form,
            seatLayout: [...form.seatLayout, { row: "", seatCount: "", price: "" }],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.put(
            `http://localhost:3000/api/owner/theaters/${theater._id}`,
            form,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Theater Name"
                required
            />

            <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Location"
                required
            />

            <div>
                <h4 className="font-medium mb-2">Seat Layout</h4>

                {form.seatLayout.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                        <input
                            value={row.row}
                            onChange={(e) => updateRow(idx, "row", e.target.value)}
                            placeholder="Row"
                            className="border px-2 py-1 rounded"
                            required
                        />
                        <input
                            type="number"
                            value={row.seatCount}
                            onChange={(e) => updateRow(idx, "seatCount", e.target.value)}
                            placeholder="Seats"
                            className="border px-2 py-1 rounded"
                            required
                        />
                        <input
                            type="number"
                            value={row.price}
                            onChange={(e) => updateRow(idx, "price", e.target.value)}
                            placeholder="Price"
                            className="border px-2 py-1 rounded"
                            required
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addRow}
                    className="text-sm text-green-600"
                >
                    + Add Row
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
            >
                Save Changes
            </button>
        </form>
    );
};

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-stone-800 rounded-lg w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button onClick={onClose} className="text-xl">×</button>
            </div>
            {children}
        </div>
    </div>
);

export default MyTheaters;
