import React, { useState, useEffect } from "react";
import { getLoggedInUser } from "../services/DataService";
import WorkoutLogsChart from "../components/charts/WorkoutLogsChart";
import NutritionLogsChart from "../components/charts/NutritionLogsChart";
import ProgressChart from "../components/charts/ProgressChart";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkoutLogs = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/userWorkout/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch workout logs");
      const data = await response.json();
      setWorkoutLogs(data);
    } catch (error) {
      console.error("Error fetching workout logs:", error);
    }
  };

  const fetchNutritionLogs = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/nutritionTracking/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch nutrition logs");
      const data = await response.json();
      setNutritionLogs(data);
    } catch (error) {
      console.error("Error fetching nutrition logs:", error);
    }
  };

  const fetchReminders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/getReminders/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch reminders");
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        if (loggedInUser) {
          setUser(loggedInUser);
          console.log("loggedInUser.id = " + loggedInUser._id)
          // Fetch associated logs and reminders
          await fetchWorkoutLogs(loggedInUser._id);
          await fetchNutritionLogs(loggedInUser._id);
          await fetchReminders(loggedInUser._id);
        } else {
          console.error("No logged-in user found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full animate-bounce"></div>
          <p className="text-lg text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-center text-red-500 text-lg">
          No user is logged in. Please log in first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white animate-fade-in">
      {/* Welcome Section */}
      <header className="max-w-5xl mx-auto p-6 mb-8 bg-gradient-to-r from-red-500 to-black rounded shadow-lg flex items-center justify-between animate-slide-in-down">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user.userName || "User"}!</h1>
          <p className="text-lg mt-2">Here’s your personalized fitness dashboard.</p>
        </div>
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
          {/* {user.userName ? user.userName[0].toUpperCase() : "U"} */}
          <img src={`${user.userImage} `} className="overflow-hidden" alt="" />
        </div>
      </header>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Workout Logs Chart */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">🏋️‍♂️</span> Workout Logs
          </h3>
          {workoutLogs.length > 0 ? (
            <WorkoutLogsChart logs={workoutLogs} />
          ) : (
            <p className="text-gray-500">No workout data available.</p>
          )}
        </div>

        {/* Nutrition Logs Chart */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-right">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">🥗</span> Nutrition Logs
          </h3>
          {nutritionLogs.length > 0 ? (
            <NutritionLogsChart logs={nutritionLogs} />
          ) : (
            <p className="text-gray-500">No nutrition data available.</p>
          )}
        </div>

        {/* Reminders Section */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 animate-slide-in-left">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">⏰</span> Reminders
          </h3>
          {reminders.length > 0 ? (
            <ul className="text-gray-300 list-disc pl-5">
              {reminders.map((reminder, index) => (
                <li key={index}>{reminder.text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reminders set.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
