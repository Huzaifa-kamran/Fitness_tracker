import React, { useState } from "react";
import { loginUser } from "../services/DataService";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle login logic
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    const response = await loginUser(email, password);
    setLoading(false);

    if (response.success) {
      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard
      }, 1000);
    } else {
      setError(response.message || "Invalid email or password.");
      toast.error(response.message || "Login failed.");
    }
  };

  // Handle "Enter" key for form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Reset error on input change
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(""); // Clear error when the user starts typing
  };

  return (
    <div className="p-6 bg-background text-textPrimary max-w-md mx-auto min-h-screen flex items-center">
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-card text-textPrimary rounded focus:outline-none focus:ring-2 focus:ring-secondary"
            value={email}
            onChange={handleInputChange(setEmail)}
            autoComplete="email"
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-card text-textPrimary rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              value={password}
              onChange={handleInputChange(setPassword)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-secondary focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full p-3 rounded text-white ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
