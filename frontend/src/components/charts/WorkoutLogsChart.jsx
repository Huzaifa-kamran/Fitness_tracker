import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WorkoutLogsChart = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No workout data available.</p>;

  const aggregatedData = logs.reduce((acc, log) => {
    const volume = log.sets * log.reps * log.weight;
    acc[log.exercise] = (acc[log.exercise] || 0) + volume;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Volume (kg)",
        data: Object.values(aggregatedData),
        backgroundColor: ["#FF5733", "#33FF57", "#3375FF", "#FFCC00"],
      },
    ],
  };

  return <Bar data={data} options={{ responsive: true }} />;
};

export default WorkoutLogsChart;
