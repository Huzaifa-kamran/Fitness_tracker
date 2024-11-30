import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Workouts = lazy(() => import("./pages/Workouts"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Profile = lazy(() => import("./pages/Profile"));
const BMICalculator = lazy(() => import("./pages/BMICalculator"));


// Authentication and Layout Handling
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ProtectedLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Workouts />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Nutrition />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bmi-calculator"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <BMICalculator />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
      <ToastContainer />
      <Notification/>
    </Router>
  );
}

export default App;
