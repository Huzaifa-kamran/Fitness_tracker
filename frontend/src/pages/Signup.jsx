import React, { useState } from "react";
import { registerUser, writeUserData } from "../services/DataService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // Step Management
  const [step, setStep] = useState(1);

  // Signup Form State
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
  });

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  // Goal Page State
  const [goalData, setGoalData] = useState({
    targetWeight: "",
    activityLevel: "",
    weeklyGoal: "",
  });

  // Handle Signup Input Change
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle Personal Info Input Change
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  // Handle Goal Page Input Change
  const handleGoalChange = (e) => {
    setGoalData({ ...goalData, [e.target.name]: e.target.value });
  };

  // Handle Signup Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(signupData);
    if (result.success) {
      setStep(2); // Proceed to personal info step
    } else {
      alert(result.message || "Signup failed. Please try again.");
    }
  };

  // Handle Personal Info Submission
  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Proceed to goal setting step
  };

  // Handle Goal Submission
  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    // Combine all data
    const userData = {
      ...signupData,
      logs: { workouts: [], nutrition: [], progress: [] },
      personalInfo,
      goals: goalData,
    };

    // Save data to the database
    await writeUserData(userData);
    alert("Signup, personal info, and goals saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen flex items-center justify-center">
      <div className="bg-card p-6 rounded shadow-md w-full max-w-md">
        {step === 1 && (
          <form onSubmit={handleSignupSubmit}>
            <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary-dark"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePersonalInfoSubmit}>
            <h2 className="text-3xl font-bold mb-6">Personal Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={personalInfo.age}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <select
              name="gender"
              value={personalInfo.gender}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={personalInfo.height}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={personalInfo.weight}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary-dark"
            >
              Next
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleGoalSubmit}>
            <h2 className="text-3xl font-bold mb-6">Set Your Goals</h2>
            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight (kg)"
              value={goalData.targetWeight}
              onChange={handleGoalChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            />
            <select
              name="activityLevel"
              value={goalData.activityLevel}
              onChange={handleGoalChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            >
              <option value="">Select Activity Level</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
            </select>
            <select
              name="weeklyGoal"
              value={goalData.weeklyGoal}
              onChange={handleGoalChange}
              className="w-full p-3 mb-3 bg-black rounded"
              required
            >
              <option value="">Select Weekly Goal</option>
              <option value="Lose 0.5kg/week">Lose 0.5kg/week</option>
              <option value="Lose 1kg/week">Lose 1kg/week</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Gain 0.5kg/week">Gain 0.5kg/week</option>
            </select>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary-dark"
            >
              Complete Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
