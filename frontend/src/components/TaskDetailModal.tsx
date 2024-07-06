import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import { formatDate, priorityMap, statusMap } from "../utils";

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onClose,
  task,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          width: 400,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          タスク詳細
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>タイトル:</strong> {task.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>詳細:</strong> {task.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>ステータス:</strong> {statusMap[task.status]}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>優先度:</strong> {priorityMap[task.priority]}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>期限:</strong>{" "}
          {task.due_date ? formatDate(task.due_date) : "なし"}
        </Typography>
      </Box>
    </Modal>
  );
};

export default TaskDetailModal;
