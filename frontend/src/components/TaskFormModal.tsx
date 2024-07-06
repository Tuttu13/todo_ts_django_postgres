import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Task } from "../types/Task";
import { priorityMap, statusMap } from "../utils";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
  onSave: (task: Task) => Promise<void>;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  taskToEdit,
  onSave,
}) => {
  const initialTaskState: Task = useMemo(
    () => ({
      id: 0,
      title: "",
      description: "",
      status: 0,
      priority: 0,
      due_date: "",
      created_at: "",
      updated_at: "",
    }),
    []
  );

  const [task, setTask] = useState<Task>(initialTaskState);

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setTask(taskToEdit);
      } else {
        setTask(initialTaskState);
      }
    }
  }, [open, taskToEdit, initialTaskState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSave = async () => {
    await onSave(task);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {taskToEdit ? "タスクを編集" : "新規タスク登録"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="題名"
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="詳細"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="ステータス"
          name="status"
          select
          SelectProps={{ native: true }}
          value={task.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(statusMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </TextField>
        <TextField
          label="優先度"
          name="priority"
          select
          SelectProps={{ native: true }}
          value={task.priority}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(priorityMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </TextField>
        <TextField
          label="期限"
          name="due_date"
          type="datetime-local"
          value={task.due_date || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="期限なし"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;
