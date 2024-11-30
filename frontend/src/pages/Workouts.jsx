import React, { useState, useEffect } from "react";
import { fetchData, logUserData } from "../services/DataService";

const Workouts = () => {
  const [exercises, setExercises] = useState([]); // List of available exercises
  const [workoutLog, setWorkoutLog] = useState([{ exercise: "", sets: "", reps: "", weight: "" }]); // Multiple exercises

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchData();
        setExercises(data?.workouts || []); // Load exercises from data
      } catch (error) {
        console.error("Failed to load exercises:", error);
      }
    };

    loadExercises();
  }, []);

  const addNewExercise = () => {
    setWorkoutLog([...workoutLog, { exercise: "", sets: "", reps: "", weight: "" }]); // Add a new blank exercise
  };

  const updateExercise = (index, key, value) => {
    const updatedLog = [...workoutLog];
    updatedLog[index][key] = value; // Update specific field
    setWorkoutLog(updatedLog);
  };

  const handleLogWorkout = () => {
    // Validate inputs
    const isValid = workoutLog.every(
      (entry) => entry.exercise && entry.sets && entry.reps && entry.weight
    );

    if (!isValid) {
      alert("Please fill in all fields for each exercise!");
      return;
    }

    const email = localStorage.getItem("authToken"); // Simulate user token
    const workoutEntry = { exercises: workoutLog, date: new Date().toLocaleDateString() };
     console.log(workoutLog);
    logUserData(email, "workouts", workoutEntry.exercises); // Log workout data
    alert("Workout logged successfully!");

    // Reset the workout log
    setWorkoutLog([{ exercise: "", sets: "", reps: "", weight: "" }]);
  };

  return (
    <div className="p-6 bg-background text-textPrimary">
      <h2 className="text-3xl font-bold mb-6">Log Your Workout</h2>
      <div className="space-y-4">
        {workoutLog.map((entry, index) => (
          <div
            key={index}
            className={`space-y-2 p-4 border rounded transition-all transform ${
              index === workoutLog.length - 1 ? "scale-100 opacity-100" : "scale-95 opacity-75"
            }`}
          >
            <select
              className="w-full p-3 bg-card text-textPrimary rounded"
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
            <input
              type="number"
              placeholder="Sets"
              className="w-full p-3 bg-card text-textPrimary rounded"
              value={entry.sets}
              onChange={(e) => updateExercise(index, "sets", e.target.value)}
            />
            <input
              type="number"
              placeholder="Reps"
              className="w-full p-3 bg-card text-textPrimary rounded"
              value={entry.reps}
              onChange={(e) => updateExercise(index, "reps", e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              className="w-full p-3 bg-card text-textPrimary rounded"
              value={entry.weight}
              onChange={(e) => updateExercise(index, "weight", e.target.value)}
            />
          </div>
        ))}

        {/* Add New Exercise Button */}
        <button
          type="button"
          onClick={addNewExercise}
          className="flex items-center justify-center w-full p-3 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add Another Exercise
        </button>

        {/* Log Workout Button */}
        <button
          onClick={handleLogWorkout}
          className="bg-secondary text-white p-3 rounded w-full mt-4 hover:bg-secondary-dark"
        >
          Log Workout
        </button>
      </div>
    </div>
  );
};

export default Workouts;
