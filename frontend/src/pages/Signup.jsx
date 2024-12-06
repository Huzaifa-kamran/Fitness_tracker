import React, { useState } from "react";
import { registerUser, writeUserData } from "../services/DataService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  // Step Management
  const [step, setStep] = useState(1);
  const [userImage, setUserImage] = useState(null);

  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    image: userImage
  });

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    
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
 
  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", signupData.name);
    formData.append("userEmail", signupData.email);
    formData.append("userPassword", signupData.password);
    formData.append("userImage", userImage);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        handleToast(responseData.message, "success");

        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        handleToast(responseData.error, "danger");
      }
    } catch (error) {
      handleToast("Registration failed", "danger");
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
    toast.success("Signup complete! Welcome to your fitness journey.");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded shadow-lg w-full max-w-md animate-fadeIn">
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
            <input
            type="text"
            name="name"
            placeholder="Username"
            value={signupData.name}
            onChange={handleSignupChange}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setUserImage(e.target.files[0])}
            className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
            <button
              type="submit"
              className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700 transition"
            >
              Next
            </button>
            <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-red-500 underline hover:text-red-600"
              >
                Login
              </button>
            </p>
          </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Personal Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={personalInfo.age}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              name="gender"
              value={personalInfo.gender}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={personalInfo.weight}
              onChange={handlePersonalInfoChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700 transition"
            >
              Next
            </button>
            
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleGoalSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Set Your Goals</h2>
            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight (kg)"
              value={goalData.targetWeight}
              onChange={handleGoalChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              name="activityLevel"
              value={goalData.activityLevel}
              onChange={handleGoalChange}
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700 transition"
            >
              Complete Signup
            </button>
            
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
