import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Grid,
  Container,
} from "@mui/material";

// Helper function to calculate FCFS schedule
const calculateFCFS = (processes) => {
  let currentTime = 0;
  const schedule = [];

  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Refactored loop to avoid function declaration inside it
  processes.forEach((process) => {
    const startTime = currentTime;
    const endTime = startTime + process.burstTime;
    schedule.push({ name: process.name, startTime, endTime });
    currentTime = endTime;
  });

  return schedule;
};

// Helper function to calculate SRTF schedule
const calculateSRTF = (processes) => {
  const schedule = [];
  let currentTime = 0;
  let completed = 0;
  const processesCopy = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    completed: false,
  }));

  while (completed < processes.length) {
    const availableProcesses = processesCopy.filter(
      (p) => p.arrivalTime <= currentTime && !p.completed
    );

    if (availableProcesses.length > 0) {
      availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
      const process = availableProcesses[0];

      const startTime = currentTime;
      const endTime = startTime + 1;
      schedule.push({ name: process.name, startTime, endTime });

      process.remainingTime -= 1;
      currentTime += 1;

      if (process.remainingTime === 0) {
        process.completed = true;
        completed += 1;
      }
    } else {
      currentTime += 1;
    }
  }

  return schedule;
};

// Helper function to calculate RR schedule
const calculateRR = (processes, timeQuantum) => {
  const schedule = [];
  const queue = processes.map((p) => ({ ...p }));
  let currentTime = 0;

  while (queue.length > 0) {
    const process = queue.shift();
    const executionTime = Math.min(process.burstTime, timeQuantum);
    const startTime = currentTime;
    const endTime = startTime + executionTime;

    schedule.push({ name: process.name, startTime, endTime });
    currentTime += executionTime;
    process.burstTime -= executionTime;

    if (process.burstTime > 0) {
      queue.push(process);
    }
  }

  return schedule;
};

// Helper function to calculate Priority Scheduling (Non-preemptive)
const calculatePriorityScheduling = (processes) => {
  let currentTime = 0;
  const schedule = [];

  processes.sort((a, b) => a.priority - b.priority);

  // Refactored loop to avoid function declaration inside it
  processes.forEach((process) => {
    const startTime = currentTime;
    const endTime = startTime + process.burstTime;
    schedule.push({ name: process.name, startTime, endTime });
    currentTime = endTime;
  });

  return schedule;
};

const App = () => {
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(4); // Default for RR
  const [schedule, setSchedule] = useState([]);

  const handleProcessInput = (e, index) => {
    const { name, value } = e.target;
    setProcesses((prev) => {
      const updatedProcesses = [...prev];
      updatedProcesses[index] = { ...updatedProcesses[index], [name]: value };
      return updatedProcesses;
    });
  };

  const handleSubmit = () => {
    let calculatedSchedule = [];
    switch (selectedAlgorithm) {
      case "FCFS":
        calculatedSchedule = calculateFCFS(processes);
        break;
      case "SRTF":
        calculatedSchedule = calculateSRTF(processes);
        break;
      case "RR":
        calculatedSchedule = calculateRR(processes, timeQuantum);
        break;
      case "Priority":
        calculatedSchedule = calculatePriorityScheduling(processes);
        break;
      default:
        break;
    }
    setSchedule(calculatedSchedule);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        CPU Scheduling Algorithms
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Number of Processes"
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(Number(e.target.value))}
            fullWidth
          />
        </Grid>

        {Array.from({ length: numProcesses }).map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="h6" gutterBottom>
              Process {index + 1}
            </Typography>
            <TextField
              label="Process Name"
              name="name"
              value={processes[index]?.name || ""}
              onChange={(e) => handleProcessInput(e, index)}
              fullWidth
            />
            <TextField
              label="Arrival Time"
              type="number"
              name="arrivalTime"
              value={processes[index]?.arrivalTime || ""}
              onChange={(e) => handleProcessInput(e, index)}
              fullWidth
            />
            <TextField
              label="Burst Time"
              type="number"
              name="burstTime"
              value={processes[index]?.burstTime || ""}
              onChange={(e) => handleProcessInput(e, index)}
              fullWidth
            />
            <TextField
              label="Priority"
              type="number"
              name="priority"
              value={processes[index]?.priority || ""}
              onChange={(e) => handleProcessInput(e, index)}
              fullWidth
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Algorithm</InputLabel>
            <Select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              fullWidth
            >
              <MenuItem value="FCFS">FCFS</MenuItem>
              <MenuItem value="SRTF">SRTF</MenuItem>
              <MenuItem value="RR">Round Robin</MenuItem>
              <MenuItem value="Priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {selectedAlgorithm === "RR" && (
          <Grid item xs={12}>
            <TextField
              label="Time Quantum"
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Calculate Schedule
          </Button>
        </Grid>
      </Grid>

      {schedule.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Gantt Chart
          </Typography>
          {schedule.map((entry, idx) => (
            <Box key={idx} display="inline-block" mr={2}>
              <Box
                sx={{
                  width: `${entry.endTime - entry.startTime}px`,
                  height: "40px",
                  backgroundColor: "lightblue",
                  display: "inline-block",
                  textAlign: "center",
                  lineHeight: "40px",
                }}
              >
                {entry.name}
              </Box>
              <Typography variant="caption">
                {entry.startTime} - {entry.endTime}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default App;
