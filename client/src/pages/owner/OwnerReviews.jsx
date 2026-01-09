import { useEffect, useState } from "react";
import axios from "axios";

const OwnerReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/owner/reviews", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => setReviews(res.data.data));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-green-700">
                Reviews for Your Theaters
            </h2>

            {reviews.length === 0 && (
                <p className="text-gray-500">No reviews yet</p>
            )}

            {reviews.map(r => (
                <div key={r._id} className="bg-white p-4 rounded shadow mb-3">
                    <p className="font-semibold">{r.userName}</p>
                    <p className="text-sm text-gray-500">
                        🎬 {r.movie?.title} -- 🏢 {r.theaterName}
                    </p>

                    <p className="text-yellow-500">
                        {"★".repeat(r.rating)}
                    </p>
                    <p>{r.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default OwnerReviews;
