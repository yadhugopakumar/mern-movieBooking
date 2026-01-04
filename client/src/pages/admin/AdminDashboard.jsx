const AdminDashboard = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">Users</h2>
            <p className="text-gray-500 text-sm">
              View and manage registered users
            </p>
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">Theaters</h2>
            <p className="text-gray-500 text-sm">
              View all registered theaters
            </p>
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">Shows</h2>
            <p className="text-gray-500 text-sm">
              Monitor movie shows and activity
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
  