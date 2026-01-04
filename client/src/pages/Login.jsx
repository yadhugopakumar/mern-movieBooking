import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
  
      // 🔑 Store token
      localStorage.setItem("token", res.data.token);
  
      // 🔑 Store role from BACKEND (not radio button)
      localStorage.setItem("role", res.data.user.role);
  
      // 🔄 Sync navbar / auth state
      window.dispatchEvent(new Event("storage"));
  
      // 🎯 Role-based redirect
      if (res.data.user.role === "owner") {
        navigate("/owner/dashboard", { replace: true });
      } else if (res.data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || err+"Login failed");
    }
  };
  

  return (
    <AuthLayout title="Welcome Back">
      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
        </div>

        {/* Role UI (optional – backend decides role) */}
        <div className="flex gap-2 py-2">
          {["user", "admin", "owner"].map((r) => (
            <label key={r} className="flex-1 cursor-pointer">
              <input
                type="radio"
                checked={role === r}
                onChange={() => setRole(r)}
                className="hidden peer"
              />
              <div className="text-center py-2 rounded-lg border text-xs uppercase font-bold peer-checked:bg-yellow-400">
                {r}
              </div>
            </label>
          ))}
        </div>

        <button className="w-full bg-yellow-400 py-3 rounded-lg font-bold">
          Sign In
        </button>

        <p className="text-center text-sm text-white " style={{"color":"white"}}>
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-400">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
