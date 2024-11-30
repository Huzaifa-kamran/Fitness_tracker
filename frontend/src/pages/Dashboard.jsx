import React, { useState, useEffect } from "react";
import { getLoggedInUser } from "../services/DataService";
import WorkoutLogsChart from "../components/charts/WorkoutLogsChart";
import NutritionLogsChart from "../components/charts/NutritionLogsChart";
import ProgressChart from "../components/charts/ProgressChart";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser();
      if (loggedInUser) {
        setUser(loggedInUser);
        setWorkoutLogs(loggedInUser.logs.workouts || []);
        setNutritionLogs(loggedInUser.logs.nutrition || []);
        setProgressLogs(loggedInUser.logs.progress || []);
      } else {
        console.error("No logged-in user found.");
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary rounded-full animate-bounce"></div>
          <p className="text-lg text-textPrimary">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-red-500 text-lg">
          No user is logged in. Please log in first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 from-red-50 via-gray-50 to-red-50 min-h-screen animate-fade-in">
      {/* Welcome Section */}
      <header className="max-w-4xl mx-auto p-6 mb-8 bg-gradient-to-r from-red-400 to-red-500 text-white rounded shadow-lg flex items-center justify-between animate-slide-in-down">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user.name || "User"}!</h1>
          <p className="text-lg mt-2">Here’s your personalized fitness dashboard.</p>
        </div>
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
          {user.name ? user.name[0].toUpperCase() : "U"}
        </div>
      </header>

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        {["Workout Placeholder", "Nutrition Placeholder", "Progress Placeholder"].map(
          (altText, idx) => (
            <div
              key={idx}
              className="rounded shadow-md overflow-hidden hover:scale-105 transform transition duration-300"
            >
              <img
                src="https://via.placeholder.com/300x200"
                alt={altText}
                className="w-full h-auto"
              />
            </div>
          )
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Workout Logs Chart */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
            <span className="mr-2">🏋️‍♂️</span> Workout Logs
          </h3>
          {workoutLogs.length > 0 ? (
            <WorkoutLogsChart logs={workoutLogs} />
          ) : (
            <p className="text-gray-500">No workout data available.</p>
          )}
          <button className="mt-4 text-blue-500 hover:text-blue-600 underline text-sm">
            View All Workouts
          </button>
        </div>

        {/* Nutrition Logs Chart */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 animate-slide-in-right">
          <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
            <span className="mr-2">🥗</span> Nutrition Logs
          </h3>
          {nutritionLogs.length > 0 ? (
            <NutritionLogsChart logs={nutritionLogs} />
          ) : (
            <p className="text-gray-500">No nutrition data available.</p>
          )}
          <button className="mt-4 text-green-500 hover:text-green-600 underline text-sm">
            View All Nutrition Logs
          </button>
        </div>

        {/* Progress Chart */}
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center">
            <span className="mr-2">📈</span> Progress Tracking
          </h3>
          {progressLogs.length > 0 ? (
            <ProgressChart logs={progressLogs} />
          ) : (
            <p className="text-gray-500">No progress data available.</p>
          )}
          <button className="mt-4 text-yellow-500 hover:text-yellow-600 underline text-sm">
            View All Progress Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
