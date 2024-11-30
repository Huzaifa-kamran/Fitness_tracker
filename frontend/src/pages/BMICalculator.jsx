import React, { useState } from "react";

const BMICalculator = () => {
  const [height, setHeight] = useState(""); // Height in cm or feet
  const [weight, setWeight] = useState(""); // Weight in kg or lbs
  const [heightInches, setHeightInches] = useState(""); // Extra field for inches in imperial units
  const [bmi, setBmi] = useState(null);
  const [range, setRange] = useState("");
  const [error, setError] = useState("");
  const [isMetric, setIsMetric] = useState(true); // Toggle between metric and imperial units

  const toggleUnits = () => {
    if (isMetric) {
      // Convert to imperial
      if (height) {
        const totalInches = parseFloat(height) / 2.54; // cm to inches
        const feet = Math.floor(totalInches / 12); // Calculate feet
        const inches = Math.round(totalInches % 12); // Remaining inches
        setHeight(feet); // Set feet value
        setHeightInches(inches); // Set inches value
      }
      if (weight) {
        setWeight((parseFloat(weight) * 2.20462).toFixed(1)); // Convert kg to lbs
      }
    } else {
      // Convert to metric
      if (height) {
        const totalInches =
          parseFloat(height) * 12 + parseFloat(heightInches || 0); // ft and in to total inches
        setHeight((totalInches * 2.54).toFixed(0)); // Convert to cm
        setHeightInches(""); // Clear inches
      }
      if (weight) {
        setWeight((parseFloat(weight) / 2.20462).toFixed(1)); // Convert lbs to kg
      }
    }
    setIsMetric(!isMetric); // Toggle unit system
  };

  const calculateBMI = () => {
    setError("");
    setBmi(null);

    if (!height || !weight || (!isMetric && heightInches === "")) {
      setError("Please enter all required fields.");
      return;
    }

    let heightInMeters = 0;
    let convertedWeight = parseFloat(weight); // Use this for weight conversion

    if (isMetric) {
      if (height <= 0 || weight <= 0) {
        setError("Height and weight must be positive values.");
        return;
      }
      heightInMeters = height / 100; // Convert cm to meters
    } else {
      if (height <= 0 || heightInches < 0 || weight <= 0) {
        setError("Height and weight must be positive values.");
        return;
      }
      const heightInFeet =
        parseFloat(height) * 12 + parseFloat(heightInches); // Convert ft and inches to total inches
      heightInMeters = heightInFeet * 0.0254; // Convert inches to meters
      convertedWeight = convertedWeight * 0.453592; // Convert lbs to kg
    }

    const bmiValue = (
      convertedWeight /
      (heightInMeters * heightInMeters)
    ).toFixed(2);
    setBmi(bmiValue);

    if (bmiValue < 18.5) {
      setRange("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setRange("Normal weight");
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      setRange("Overweight");
    } else {
      setRange("Obesity");
    }
  };

  const handleReset = () => {
    setHeight("");
    setHeightInches("");
    setWeight("");
    setBmi(null);
    setRange("");
    setError("");
  };

  const calculateMarkerPosition = () => {
    const minBMI = 10;
    const maxBMI = 40;
    const totalRange = maxBMI - minBMI;
    const bmiValue = bmi ? parseFloat(bmi) : 0;
    const markerPosition = ((bmiValue - minBMI) / totalRange) * 100;
    return `${Math.min(100, Math.max(0, markerPosition))}%`;
  };

  return (
    <div className="p-6 bg-background text-textPrimary min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md bg-card p-6 rounded shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">BMI Calculator</h2>

        {/* Unit Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleUnits}
            className={`px-4 py-2 rounded-l ${
              isMetric ? "bg-secondary text-white" : "bg-black"
            }`}
          >
            Metric
          </button>
          <button
            onClick={toggleUnits}
            className={`px-4 py-2 rounded-r ${
              !isMetric ? "bg-secondary text-white" : "bg-black"
            }`}
          >
            Imperial
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Inputs */}
        <div>
          {isMetric ? (
            <>
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 mb-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 mb-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </>
          ) : (
            <>
              <div className="flex space-x-2 mb-3">
                <input
                  type="number"
                  placeholder="Height (ft)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-1/2 p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="number"
                  placeholder="Height (in)"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className="w-1/2 p-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <input
                type="number"
                placeholder="Weight (lbs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 mb-3 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </>
          )}
        </div>

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={calculateBMI}
            className="flex-1 bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition"
          >
            Calculate BMI
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>

        {bmi && (
          <div
            className="mt-6 bg-black p-4 rounded shadow-md animate-fade-in"
            style={{ animation: "fadeIn 0.5s ease-in-out" }}
          >
            <p className="text-lg">
              <strong>Your BMI:</strong> {bmi}
            </p>
            <p className="text-lg">
              <strong>BMI Range:</strong> {range}
            </p>
          </div>
        )}
      </div>

      {bmi && (
        <div className="w-full max-w-2xl mt-6">
          <div className="relative w-full h-6 bg-gray-300 rounded">
            <div
              className="absolute top-0 left-0 h-full bg-secondary rounded"
              style={{ width: calculateMarkerPosition() }}
            >
              <div
                className="absolute -top-4 left-full w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2"
                title={`Your BMI: ${bmi}`}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-white">
            <span>10</span>
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obesity</span>
            <span>40</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
