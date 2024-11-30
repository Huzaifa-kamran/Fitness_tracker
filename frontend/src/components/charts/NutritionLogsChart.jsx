import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionLogsChart = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No nutrition data available.</p>;

  const aggregatedData = logs.reduce(
    (acc, log) => {
      acc.kcals += log.kcals || 0;
      acc.protein += log.protein || 0;
      acc.carbs += log.carbs || 0;
      acc.fat += log.fat || 0;
      return acc;
    },
    { kcals: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const data = {
    labels: ["Calories", "Protein (g)", "Carbs (g)", "Fat (g)"],
    datasets: [
      {
        data: [aggregatedData.kcals, aggregatedData.protein, aggregatedData.carbs, aggregatedData.fat],
        backgroundColor: ["#FF073A", "#1DB954", "#FFCC00", "#3375FF"],
      },
    ],
  };

  return <Pie data={data} options={{ responsive: true }} />;
};

export default NutritionLogsChart;
