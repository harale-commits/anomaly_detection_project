import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function LineChart({ data }) {
  const MAX_POINTS = 30; // Limit to last 30 data points

  const [chartData, setChartData] = useState({
    series: [{ name: "Sensor Data", data: [] }],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { categories: [], tickAmount: 5 }, // Only 5 ticks on the x-axis
      stroke: { curve: "smooth" },
      markers: { size: 3 }, // Reduce marker size for performance
      colors: ["#1E40AF"], // Blue color
      title: { text: "Sensor Data Over Time", align: "center" },
      tooltip: { enabled: true }, // Show tooltips for better readability
    },
  });

  useEffect(() => {
    if (data.length > 0) {
      const limitedData = data.slice(-MAX_POINTS); // Keep only last MAX_POINTS values
      setChartData((prevData) => ({
        ...prevData,
        series: [
          { name: "Sensor Data", data: limitedData.map((item) => item.value) },
        ],
        options: {
          ...prevData.options,
          xaxis: {
            categories: limitedData.map((item) => item.timestamp),
            tickAmount: 5,
          },
        },
      }));
    }
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
}
