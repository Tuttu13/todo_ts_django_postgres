import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import { formatDate, priorityMap, statusMap } from "../utils";

// TaskItemコンポーネントのプロパティの型定義
interface TaskItemProps {
  task: Task; // タスクオブジェクト
  onEdit: (task: Task) => void; // タスク編集時に呼ばれる関数
  onDelete: (taskId: number) => void; // タスク削除時に呼ばれる関数
  onView: (task: Task) => void; // タスク表示時に呼ばれる関数
}

// TaskItemコンポーネント
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
      onClick={() => onView(task)} // タスク表示のクリックイベントを追加
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
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
