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

// Function for First-Come, First-Served (FCFS) Scheduling
const calculateFCFS = (processes) => {
  let currentTime = 0;
  return processes.map((process) => {
    const startTime = currentTime;
    const endTime = startTime + process.burstTime;
    currentTime = endTime;
    return {
      ...process,
      startTime,
      endTime,
      turnaroundTime: endTime - process.arrivalTime,
      waitingTime: endTime - process.arrivalTime - process.burstTime,
    };
  });
};

// Function for Shortest Remaining Time First (SRTF) Scheduling
const calculateSRTF = (processes) => {
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
      process.remainingTime -= 1;
      currentTime += 1;

      if (process.remainingTime === 0) {
        process.completed = true;
        process.turnaroundTime = currentTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        completed += 1;
      }
    } else {
      currentTime += 1;
    }
  }

  return processesCopy;
};

// Function for Priority Scheduling (Non-preemptive) Scheduling
const calculatePriorityScheduling = (processes) => {
  let currentTime = 0;
  return processes
    .sort((a, b) => a.priority - b.priority)
    .map((process) => {
      const startTime = currentTime;
      const endTime = startTime + process.burstTime;
      currentTime = endTime;

      return {
        ...process,
        startTime,
        endTime,
        turnaroundTime: endTime - process.arrivalTime,
        waitingTime: endTime - process.arrivalTime - process.burstTime,
      };
    });
};

// Helper function to calculate Round Robin (RR) schedule
const calculateRR = (processes, timeQuantum) => {
  let currentTime = 0;
  const schedule = [];
  const queue = processes.map((p) => ({
    ...p,
    remainingBurstTime: p.burstTime,
    startTime: -1, // Placeholder for start time
  }));
  const completedProcesses = [];

  // Track the remaining burst time of each process
  while (queue.length > 0) {
    const process = queue.shift();
    const executionTime = Math.min(process.remainingBurstTime, timeQuantum);
    const startTime =
      process.startTime === -1 ? currentTime : process.startTime;
    const endTime = startTime + executionTime;

    // Update process in the schedule
    schedule.push({
      ...process,
      startTime,
      endTime,
    });

    currentTime = endTime;
    process.remainingBurstTime -= executionTime;

    // If the process is not completed, it will rejoin the queue
    if (process.remainingBurstTime > 0) {
      process.startTime = startTime; // Keep the start time updated
      queue.push(process);
    } else {
      // Calculate turnaround and waiting time once process is completed
      process.turnaroundTime = endTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completedProcesses.push(process);
    }
  }

  // Calculate averages for waiting and turnaround times
  const totalTurnaroundTime = completedProcesses.reduce(
    (sum, process) => sum + process.turnaroundTime,
    0
  );
  const totalWaitingTime = completedProcesses.reduce(
    (sum, process) => sum + process.waitingTime,
    0
  );

  return {
    processes: completedProcesses,
    totalTurnaroundTime,
    totalWaitingTime,
  };
};

// Other scheduling algorithms (FCFS, SRTF, Priority) remain unchanged

const App = () => {
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(4); // Default for RR
  const [schedule, setSchedule] = useState([]);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);

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
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;

    switch (selectedAlgorithm) {
      case "FCFS":
        calculatedSchedule = calculateFCFS(processes);
        break;
      case "SRTF":
        calculatedSchedule = calculateSRTF(processes);
        break;
      case "RR":
        const rrResults = calculateRR(processes, timeQuantum);
        calculatedSchedule = rrResults.processes;
        totalTurnaroundTime = rrResults.totalTurnaroundTime;
        totalWaitingTime = rrResults.totalWaitingTime;
        break;
      case "Priority":
        calculatedSchedule = calculatePriorityScheduling(processes);
        break;
      default:
        break;
    }

    // Calculate averages if needed
    if (calculatedSchedule.length > 0) {
      totalTurnaroundTime =
        totalTurnaroundTime ||
        calculatedSchedule.reduce(
          (sum, process) => sum + process.turnaroundTime,
          0
        );
      totalWaitingTime =
        totalWaitingTime ||
        calculatedSchedule.reduce(
          (sum, process) => sum + process.waitingTime,
          0
        );

      setAvgTurnaroundTime(totalTurnaroundTime / calculatedSchedule.length);
      setAvgWaitingTime(totalWaitingTime / calculatedSchedule.length);
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            {schedule.map((entry, idx) => (
              <Box
                key={idx}
                sx={{
                  backgroundColor: "lightblue",
                  width: `${(entry.endTime - entry.startTime) * 20}px`,
                  height: "60px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid black",
                  textAlign: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {entry.name}
                </Typography>
                <Typography variant="caption">
                  AT: {entry.arrivalTime}, BT: {entry.burstTime}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box mt={2}>
            <Typography variant="h6">
              Average Turnaround Time: {avgTurnaroundTime.toFixed(2)}
            </Typography>
            <Typography variant="h6">
              Average Waiting Time: {avgWaitingTime.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default App;
