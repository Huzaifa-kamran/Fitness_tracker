import React, { useState, useEffect } from "react";
import { fetchData, getLoggedInUser, logUserData } from "../services/DataService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Workouts = () => {
  const [exercises, setExercises] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([{ exercise: "", sets: "", reps: "", weight: "" }]);
  const [previousLogs, setPreviousLogs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchData();
        setExercises(data?.workouts || []);

        const loggedInUser = await getLoggedInUser();
        if (loggedInUser) {
          const combinedLogs = categorizeLogsByDate(loggedInUser.logs);
          setPreviousLogs(combinedLogs);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("Failed to load data. Please try again.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const categorizeLogsByDate = (logs) => {
    const categorized = {};
    [...logs.workouts, ...logs.nutrition, ...logs.progress].forEach((log) => {
      const { date } = log;
      if (!categorized[date]) categorized[date] = { workouts: [], nutrition: [], progress: [] };
      if (log.exercise) categorized[date].workouts.push(log);
      if (log.item) categorized[date].nutrition.push(log);
      if (log.weight) categorized[date].progress.push(log);
    });
    return categorized;
  };

  const addNewExercise = () => {
    setWorkoutLog((prev) => [
      ...prev,
      { exercise: "", sets: "", reps: "", weight: "" },
    ]);
    toast.info("New exercise field added!");
  };

  const removeExercise = (index) => {
    if (workoutLog.length === 1) {
      toast.error("At least one exercise must be logged.");
      return;
    }
    const updatedLog = workoutLog.filter((_, i) => i !== index);
    setWorkoutLog(updatedLog);
    toast.info("Exercise field removed.");
  };

  const updateExercise = (index, key, value) => {
    const updatedLog = [...workoutLog];
    updatedLog[index][key] = value;
    setWorkoutLog(updatedLog);
  };

  const validateFields = () => {
    const isValid = workoutLog.every(
      (entry) => entry.exercise && entry.sets && entry.reps && entry.weight
    );

    if (!isValid) {
      toast.error("Please fill in all fields for each exercise!");
      return false;
    }

    return true;
  };

  const handleLogWorkout = async () => {
    if (!validateFields()) return;

    const email = localStorage.getItem("authToken");
    const workoutEntry = {
      exercises: workoutLog,
      date: new Date().toLocaleDateString(),
    };

    try {
      await logUserData(email, "workouts", workoutEntry);
      toast.success("Workout logged successfully!");

      // Update previous logs
      setPreviousLogs((prev) => {
        const date = new Date().toLocaleDateString();
        if (!prev[date]) prev[date] = { workouts: [], nutrition: [], progress: [] };
        prev[date].workouts = [...(prev[date].workouts || []), ...workoutLog];
        return { ...prev };
      });

      // Reset workout log
      setWorkoutLog([{ exercise: "", sets: "", reps: "", weight: "" }]);
    } catch (error) {
      toast.error("Failed to log workout.");
      console.error("Error logging workout:", error);
    }
  };

  const handleDropdownToggle = (date) => {
    setOpenDropdown((prev) => (prev === date ? null : date));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="loader"></div>
        <p className="text-white ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center animate-fadeIn">Log Your Workouts</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Current Workout Log */}
        <div className="space-y-6">
          {workoutLog.map((entry, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded bg-card transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <select
                  className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={entry.exercise}
                  onChange={(e) => updateExercise(index, "exercise", e.target.value)}
                >
                  <option value="">Select an Exercise</option>
                  {exercises.map((exercise, i) => (
                    <option key={i} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
                {index > 0 && (
                  <button
                    onClick={() => removeExercise(index)}
                    className="ml-3 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="number"
                placeholder="Sets"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.sets}
                onChange={(e) => updateExercise(index, "sets", e.target.value)}
              />
              <input
                type="number"
                placeholder="Reps"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.reps}
                onChange={(e) => updateExercise(index, "reps", e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="w-full p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                value={entry.weight}
                onChange={(e) => updateExercise(index, "weight", e.target.value)}
              />
            </div>
          ))}

          {/* Add New Exercise Button */}
          <button
            type="button"
            onClick={addNewExercise}
            className="w-full p-3 bg-primary text-white rounded hover:bg-primary-dark transition-transform transform hover:scale-105"
          >
            + Add Another Exercise
          </button>
        </div>

        {/* Log Workout Button */}
        <button
          onClick={handleLogWorkout}
          className="w-full p-3 bg-secondary text-white rounded hover:bg-secondary-dark transition-transform transform hover:scale-105"
        >
          Log Workout
        </button>

        {/* Previous Logs */}
        {Object.keys(previousLogs).length > 0 && (
          <div className="mt-8 space-y-4 bg-card p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Previous Logs by Date</h3>
            {Object.entries(previousLogs).map(([date, logs]) => (
              <details
                key={date}
                open={openDropdown === date}
                onClick={() => handleDropdownToggle(date)}
                className="p-4 bg-black text-white rounded shadow-md transition-all duration-300"
              >
                <summary className="font-bold cursor-pointer">{date}</summary>
                <div className="mt-2 space-y-4">
                  {logs.workouts.length > 0 && (
                    <>
                      <h4 className="font-bold text-secondary">Workouts</h4>
                      {logs.workouts.map((log, i) => (
                        <p key={i}>
                          • {log.exercise}: {log.sets} sets x {log.reps} reps, {log.weight} kg
                        </p>
                      ))}
                    </>
                  )}
                
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
