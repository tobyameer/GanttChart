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

// Register required Chart.js components
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GanttChart = () => {
  // Data for the Gantt chart (processes and their time ranges)
  const data = {
    labels: ["Preemptive SJF Gantt Chart"], // Only one category for horizontal alignment
    datasets: [
      {
        label: "P1",
        data: [1], // Length of P1
        backgroundColor: "#cce5ff",
        barPercentage: 0.8,
        stack: "stack1",
        borderColor: "#000",
        borderWidth: 1,
      },
      {
        label: "P2",
        data: [4], // Length of P2
        backgroundColor: "#d4edda",
        stack: "stack1",
        borderColor: "#000",
        borderWidth: 1,
      },
      {
        label: "P4",
        data: [5], // Length of P4
        backgroundColor: "#f8d7da",
        stack: "stack1",
        borderColor: "#000",
        borderWidth: 1,
      },
      {
        label: "P1 (Continued)",
        data: [7], // Remaining P1 execution time
        backgroundColor: "#cce5ff",
        stack: "stack1",
        borderColor: "#000",
        borderWidth: 1,
      },
      {
        label: "P3",
        data: [9], // P3 execution time
        backgroundColor: "#fff3cd",
        stack: "stack1",
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
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
        max: 26, // Total time range
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        stacked: true,
        title: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default GanttChart;
