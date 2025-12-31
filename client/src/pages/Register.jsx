import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";


const Register = () => {
  const [role, setRole] = useState("user");

  return (
    <AuthLayout title="Create Account">
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">First Name</label>
            <input type="text" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Last Name</label>
            <input type="text" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <input type="email" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input type="password" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>

        <label className="text-gray-300 text-sm block mb-1">Select Your Role</label>
        <div className="flex justify-between gap-2">
          {["user", "admin", "owner"].map((r) => (
            <label key={r} className="flex-1 cursor-pointer">
              <input 
                type="radio" name="role" value={r} 
                checked={role === r} 
                onChange={(e) => setRole(e.target.value)}
                className="hidden peer" 
              />
              <div className="text-center py-2 rounded-lg border border-white/20 text-xs uppercase font-bold text-gray-400 peer-checked:bg-yellow-400 peer-checked:text-black transition-all">
                {r}
              </div>
            </label>
          ))}
        </div>

        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors mt-6">
          Create Account
        </button>
        <p className="text-center text-gray-400 text-sm mt-4" style={{"color":"white"}}>
          Already have an account? <span className="text-yellow-400 cursor-pointer hover:underline"><Link to='/login'>Login</Link></span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;