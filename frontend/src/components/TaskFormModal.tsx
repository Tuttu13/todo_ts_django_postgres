import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Task } from "../types/Task";
import { formatDateToLocal, priorityMap, statusMap } from "../utils";

// TaskFormModalコンポーネントのプロパティの型定義
interface TaskFormModalProps {
  open: boolean; // モーダルの開閉状態
  onClose: () => void; // モーダルを閉じる関数
  taskToEdit: Task | null; // 編集対象のタスク
  onSave: (task: Task) => Promise<void>; // タスク保存時に呼ばれる関数
}

// タスクの初期状態
const initialTaskState: Task = {
  id: 0,
  title: "",
  description: "",
  status: 0,
  priority: 0,
  due_date: "",
  created_at: "",
  updated_at: "",
};

// TaskFormModalコンポーネント
const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  taskToEdit,
  onSave,
}) => {
  const [task, setTask] = useState<Task>(initialTaskState); // タスクの状態
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // バリデーションエラーの状態

  // モーダルが開かれるときに編集対象のタスクをセット
  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setTask({
          ...taskToEdit,
          due_date: taskToEdit.due_date
            ? formatDateToLocal(taskToEdit.due_date)
            : "",
        });
      } else {
        setTask(initialTaskState);
      }
    }
  }, [open, taskToEdit]);

  // フォームの入力が変更されたときに状態を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });

    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // フォームのバリデーションを行う関数
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!task.title.trim()) newErrors.title = "題名は必須です。";
    if (!task.description.trim()) newErrors.description = "詳細は必須です。";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存ボタンがクリックされたときの処理
  const handleSave = async () => {
    if (validate()) {
      if (!task.due_date) {
        task.due_date = null; // due_dateをオプションにする
      }
      await onSave(task);
      onClose();
    }
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
          required
          error={!!errors.title}
          helperText={errors.title}
          placeholder="題名を入力"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="詳細"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.description}
          helperText={errors.description}
          placeholder="詳細を入力"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
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
          required
          error={!!errors.status}
          helperText={errors.status}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
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
          required
          error={!!errors.priority}
          helperText={errors.priority}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
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
          error={!!errors.due_date}
          helperText={errors.due_date}
          placeholder="期限なし"
          variant="outlined"
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
