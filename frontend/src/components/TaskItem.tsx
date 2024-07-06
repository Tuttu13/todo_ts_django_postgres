import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import { formatDate, priorityMap, statusMap } from "../utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onView: (task: Task) => void; // 追加
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <ListItem
      sx={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        mb: 2,
        cursor: "pointer",
      }}
      onClick={() => onView(task)} // クリックイベントを追加
    >
      <ListItemText
        primary={task.title}
        secondary={
          <>
            <div>ステータス: {statusMap[task.status]}</div>
            <div>優先度: {priorityMap[task.priority]}</div>
            <div>
              期限: {task.due_date ? formatDate(task.due_date) : "なし"}
            </div>
          </>
        }
      />
      <Box>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default TaskItem;
