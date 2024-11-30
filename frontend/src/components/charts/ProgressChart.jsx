import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressChart = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No progress data available.</p>;

  const labels = logs.map((log) => log.date);
  const data = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: logs.map((log) => log.weight),
        borderColor: "#FF5733",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} options={{ responsive: true }} />;
};

export default ProgressChart;
