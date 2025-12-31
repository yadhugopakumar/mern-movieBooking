import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useLocation, useNavigate,Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = () => {
    localStorage.setItem("token", "dummy-token");
    window.dispatchEvent(new Event("storage")); // 🔥 important
    navigate(from, { replace: true });
  };
  

  return (
    <AuthLayout title="Welcome Back">
      <form className="space-y-5">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email Address</label>
          <input type="email" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="name@example.com" />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input type="password" className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="••••••••" />
        </div>

        {/* Role Selection */}
        <div className="flex justify-between gap-2 py-2">
          {["user", "admin", "owner"].map((r) => (
            <label key={r} className="flex-1 cursor-pointer">
              <input 
                type="radio" name="role" value={r} 
                checked={role === r} 
                onChange={(e) => setRole(e.target.value)}
                className="hidden peer" 
              />
              <div className="text-center py-2 rounded-lg border border-white/20 text-xs uppercase font-bold text-gray-400 peer-checked:bg-yellow-400 peer-checked:text-black peer-checked:border-yellow-400 transition-all">
                {r}
              </div>
            </label>
          ))}
        </div>

        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors mt-4" onClick={handleLogin}>
          Sign In
        </button>
        
        <p className="text-center text-gray-400 text-sm mt-4" style={{"color":"white"}}>
          Don't have an account? <span className="text-yellow-400 cursor-pointer hover:underline"><Link to='/register'>Register</Link></span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;