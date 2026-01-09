

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-green-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Bookings" onClick={() => navigate("/admin/bookings")} />
        <Card title="Owners" onClick={() => navigate("/admin/owners")} />
        <Card title="Movies" onClick={() => navigate("/admin/movies")} />
        <Card title="Reviews" onClick={() => navigate("/admin/reviews")} />

      </div>
    </div>
  );
};

const Card = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
  >
    <h2 className="text-lg font-medium text-red-700">{title}</h2>
    <p className="text-gray-500 text-sm">Manage {title}</p>
  </div>
);

export default AdminDashboard;
