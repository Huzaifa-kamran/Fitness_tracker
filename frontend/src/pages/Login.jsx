import React, { useState } from "react";
import { loginUser } from "../services/DataService";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle login logic
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const response = await loginUser(email, password);
    setLoading(false);

    if (response.success) {
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard
      }, 1000);
    } else {
      toast.error(response.message || "Invalid email or password.");
    }
  };

  // Handle "Enter" key for form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <div className="space-y-6">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            autoComplete="email"
            required
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-red-500 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full p-3 rounded text-white transition-transform transform ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
