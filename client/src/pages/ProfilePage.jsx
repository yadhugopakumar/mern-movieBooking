import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiCheck, FiX, FiUser, FiMail } from "react-icons/fi"; // Optional: npm install react-icons

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setIsUpdating(true);
    // Add your axios.put logic here to save to the database
    setTimeout(() => {
      setIsUpdating(false);
      setEdit(false);
    }, 800); 
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <span className="loading loading-spinner loading-lg text-gray-300"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
    

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center text-3xl font-light text-gray-400 overflow-hidden">
                {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{user.name || "User"}</h3>
            <p className="text-sm text-gray-400 lowercase">@{user.name?.replace(/\s+/g, '')}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="group">
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 ml-1">Full Name</label>
              <div className={`mt-1 flex items-center transition-all duration-200 border-b ${edit ? 'border-black py-2' : 'border-gray-100 py-3'}`}>
                <FiUser className="text-gray-300 mr-3" size={18} />
                {!edit ? (
                  <p className="text-gray-700 font-medium">{user.name}</p>
                ) : (
                  <input
                    value={user.name}
                    autoFocus
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-300"
                    placeholder="Enter your name"
                  />
                )}
              </div>
            </div>

            <div className="group">
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email Address</label>
              <div className={`mt-1 flex items-center transition-all duration-200 border-b ${edit ? 'border-black py-2' : 'border-gray-100 py-3'}`}>
                <FiMail className="text-gray-300 mr-3" size={18} />
                {!edit ? (
                  <p className="text-gray-700 font-medium">{user.email}</p>
                ) : (
                  <input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-300"
                    placeholder="Enter your email"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-12">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <FiEdit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUpdating ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FiCheck size={18} />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          Your information is kept private and secure.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;