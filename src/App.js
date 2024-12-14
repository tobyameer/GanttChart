import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { fcfs, sjf } from "./schedulingAlgorithms"; // Add all algorithms
import GanttChart from "./GanttChart";
const App = () => {
  const [numProcesses, setNumProcesses] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [results, setResults] = useState([]);

  const handleSetProcesses = (value) => {
    setNumProcesses(value);
    setProcesses(
      Array.from({ length: value }, (_, i) => ({
        name: `P${i + 1}`,
        arrivalTime: 0,
        burstTime: 0,
        priority: 0,
      }))
    );
  };

  const handleCalculate = () => {
    let scheduledProcesses;
    switch (algorithm) {
      case "fcfs":
        scheduledProcesses = fcfs(processes);
        break;
      case "sjf":
        scheduledProcesses = sjf(processes);
        break;
      default:
        scheduledProcesses = [];
    }
    setResults(scheduledProcesses);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Job Scheduler
      </Typography>
      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="Number of Processes"
          type="number"
          value={numProcesses}
          onChange={(e) => handleSetProcesses(Number(e.target.value))}
          fullWidth
          margin="normal"
        />
      </Box>
      <Grid container spacing={2}>
        {processes.map((p, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <TextField
                label={`Process ${index + 1} Name`}
                value={p.name}
                onChange={(e) => {
                  const updatedProcesses = [...processes];
                  updatedProcesses[index].name = e.target.value;
                  setProcesses(updatedProcesses);
                }}
                fullWidth
              />
              <TextField
                label="Arrival Time"
                type="number"
                onChange={(e) => {
                  const updatedProcesses = [...processes];
                  updatedProcesses[index].arrivalTime = Number(e.target.value);
                  setProcesses(updatedProcesses);
                }}
                fullWidth
              />
              <TextField
                label="Burst Time"
                type="number"
                onChange={(e) => {
                  const updatedProcesses = [...processes];
                  updatedProcesses[index].burstTime = Number(e.target.value);
                  setProcesses(updatedProcesses);
                }}
                fullWidth
              />
              <TextField
                label="Priority"
                type="number"
                onChange={(e) => {
                  const updatedProcesses = [...processes];
                  updatedProcesses[index].priority = Number(e.target.value);
                  setProcesses(updatedProcesses);
                }}
                fullWidth
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <FormControl fullWidth>
          <InputLabel>Scheduling Algorithm</InputLabel>
          <Select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <MenuItem value="fcfs">First Come First Serve (FCFS)</MenuItem>
            <MenuItem value="sjf">Shortest Job First (SJF)</MenuItem>
            <MenuItem value="srtf">
              Shortest Remaining Time First (SRTF)
            </MenuItem>
            <MenuItem value="rr">Round Robin (RR)</MenuItem>
            <MenuItem value="priority">Priority Scheduling</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCalculate}
      >
        Calculate
      </Button>
      {results.length > 0 && (
        <Box sx={{ marginTop: "30px" }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <GanttChart processes={results} />
          <Typography variant="body1" gutterBottom>
            Average Turnaround Time:{" "}
            {results.reduce((sum, p) => sum + p.turnaroundTime, 0) /
              results.length}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Average Waiting Time:{" "}
            {results.reduce((sum, p) => sum + p.waitingTime, 0) /
              results.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default App;
