import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GanttChart = ({ processes }) => {
  /**
   * processes is an array of objects in this format:
   * [
   *   { name: 'P1', startTime: 0, endTime: 1 },
   *   { name: 'P2', startTime: 1, endTime: 5 },
   *   { name: 'P4', startTime: 5, endTime: 10 },
   * ]
   */

  // Create datasets dynamically for the Gantt chart
  const datasets = processes.map((process) => ({
    label: process.name, // e.g., P1, P2
    data: [process.endTime - process.startTime], // Duration
    backgroundColor: getRandomColor(),
    stack: "stack1",
    borderColor: "#000",
    borderWidth: 1,
  }));

  // Chart data
  const data = {
    labels: ["Gantt Chart"], // Single row for horizontal bar
    datasets: datasets,
  };

  // Chart options
  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Preemptive SJF Gantt Chart",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  // Generate random colors for each process
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + "AA"; // Add transparency
  }

  return <Bar data={data} options={options} />;
};

export default GanttChart;
