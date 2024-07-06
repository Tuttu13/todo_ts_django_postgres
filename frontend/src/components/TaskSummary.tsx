import { Box, Typography } from "@mui/material";
import React from "react";

interface TaskSummaryProps {
  totalTasks: number;
  completedTasks: number;
}

const TaskSummary: React.FC<TaskSummaryProps> = ({
  totalTasks,
  completedTasks,
}) => {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography variant="h6">タスク件数: {totalTasks}</Typography>
      <Typography variant="h6">完了タスク: {completedTasks}</Typography>
    </Box>
  );
};

export default TaskSummary;
