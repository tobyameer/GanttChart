// Scheduling Algorithms
export const fcfs = (processes) => {
  let currentTime = 0;
  const result = processes.map((p) => {
    const start = Math.max(currentTime, p.arrivalTime);
    const finish = start + p.burstTime;
    currentTime = finish;

    return {
      ...p,
      startTime: start,
      finishTime: finish,
      turnaroundTime: finish - p.arrivalTime,
      waitingTime: start - p.arrivalTime,
    };
  });
  return result;
};

export const sjf = (processes) => {
  let currentTime = 0;
  const result = [];
  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (queue.length) {
    const available = queue.filter((p) => p.arrivalTime <= currentTime);
    const shortest = available.sort((a, b) => a.burstTime - b.burstTime)[0];
    if (!shortest) {
      currentTime++;
      continue;
    }
    queue.splice(queue.indexOf(shortest), 1);
    const start = Math.max(currentTime, shortest.arrivalTime);
    const finish = start + shortest.burstTime;
    currentTime = finish;

    result.push({
      ...shortest,
      startTime: start,
      finishTime: finish,
      turnaroundTime: finish - shortest.arrivalTime,
      waitingTime: start - shortest.arrivalTime,
    });
  }
  return result;
};

// Implement SRTF, RR, and Priority similarly...
