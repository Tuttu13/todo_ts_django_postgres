import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import { formatDate, priorityMap, statusMap } from "../utils"; // インポートを追加

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onViewTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onViewTask,
}) => {
  return (
    <Box>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            button
            onClick={() => onViewTask(task)}
            sx={{
              border: "1px solid #ddd",
              mb: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemText
              primary={task.title}
              secondary={
                <Box>
                  <div>ステータス: {statusMap[task.status]}</div>
                  <div>優先度: {priorityMap[task.priority]}</div>
                  <div>
                    期限: {task.due_date ? formatDate(task.due_date) : "なし"}
                  </div>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                sx={{ marginRight: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
