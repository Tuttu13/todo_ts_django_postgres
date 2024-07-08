import { Box, Typography } from "@mui/material";
import React from "react";

// TaskSummaryコンポーネントのプロパティの型定義
interface TaskSummaryProps {
  totalTasks: number; // 総タスク数
  completedTasks: number; // 完了したタスク数
}

// TaskSummaryコンポーネント
const TaskSummary: React.FC<TaskSummaryProps> = ({
  totalTasks,
  completedTasks,
}) => {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      {/* 総タスク数を表示 */}
      <Typography variant="h6">タスク件数: {totalTasks}</Typography>
      {/* 完了タスク数を表示 */}
      <Typography variant="h6">完了タスク: {completedTasks}</Typography>
    </Box>
  );
};

export default TaskSummary;
