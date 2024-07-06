import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

// APIのベースURL
const API_BASE_URL = "http://localhost:8000/api/todo/";

interface TaskSummaryProps {}

const TaskSummary: React.FC<TaskSummaryProps> = () => {
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  useEffect(() => {
    const fetchTaskSummary = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}summary/`);
        setTotalTasks(response.data.total_tasks);
        setCompletedTasks(response.data.completed_tasks);
      } catch (error) {
        console.error("Error fetching task summary:", error);
      }
    };

    fetchTaskSummary();
  }, []);

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="h6">タスク件数: {totalTasks}</Typography>
      <Typography variant="h6">完了タスク: {completedTasks}</Typography>
    </Box>
  );
};

export default TaskSummary;
