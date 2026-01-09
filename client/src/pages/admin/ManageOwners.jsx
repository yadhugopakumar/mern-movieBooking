import { useEffect, useState } from "react";
import axios from "axios";

const ManageOwners = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        const res = await axios.get("http://localhost:3000/api/admin/owners", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        setOwners(res.data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this owner?")) return;

        await axios.delete(`http://localhost:3000/api/admin/owner/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        setOwners(owners.filter(o => o._id !== id));
    };

    if (loading) return <p className="p-6">Loading owners...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-green-800 mb-4">
                Manage Owners
            </h1>

            {owners.length === 0 ? (
                <p className="text-gray-500">No owners found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {owners.map(owner => (
                        <div
                            key={owner._id}
                            className="bg-white p-4 rounded shadow"
                        >
                            <h2 className="text-lg font-medium text-red-700">
                                {owner.name}
                            </h2>
                            <p className="text-sm text-gray-600">{owner.email}</p>

                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => handleDelete(owner._id)}
                                    className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOwners;
