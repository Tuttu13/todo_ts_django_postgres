import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import { formatDate, priorityMap, statusMap } from "../utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onView: (task: Task) => void;
}

const styles = {
  listItem: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    mb: 2,
    cursor: "pointer",
  },
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onView,
}) => {
  const handleView = () => onView(task);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onView(task);
    }
  };

  return (
    <ListItem
      sx={styles.listItem}
      onClick={handleView}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      <ListItemText
        primary={task.title}
        secondary={
          <>
            <Typography component="span" display="block">
              ステータス: {statusMap[task.status]}
            </Typography>
            <Typography component="span" display="block">
              優先度: {priorityMap[task.priority]}
            </Typography>
            <Typography component="span" display="block">
              期限: {task.due_date ? formatDate(task.due_date) : "なし"}
            </Typography>
          </>
        }
      />
      <Box>
        <IconButton aria-label={`edit task ${task.id}`} onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label={`delete task ${task.id}`}
          onClick={handleDelete}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default TaskItem;
