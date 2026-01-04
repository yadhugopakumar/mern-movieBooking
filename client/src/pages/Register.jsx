import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      await axios.post("http://localhost:3000/api/auth/signup", payload);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-gray-300 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Role */}
        <label className="text-gray-300 text-sm">Select Your Role</label>
        <div className="flex gap-2">
          {["user", "owner"].map((r) => (
            <label key={r} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r}
                checked={form.role === r}
                onChange={handleChange}
                className="hidden peer"
              />
              <div className="text-center py-2 rounded-lg border border-white/20 text-xs uppercase font-bold
                text-gray-400 peer-checked:bg-yellow-400 peer-checked:text-black">
                {r}
              </div>
            </label>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?
          <Link to="/login" className="text-yellow-400 ml-1 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
