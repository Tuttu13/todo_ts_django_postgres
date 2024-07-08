import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import TaskDetailModal from "../components/TaskDetailModal";
import TaskFormModal from "../components/TaskFormModal";
import TaskList from "../components/TaskList";
import TaskSummary from "../components/TaskSummary";
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskSummary,
  updateTask,
} from "../services/api";
import { Task } from "../types/Task";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (page: number) => {
    try {
      const { tasks, totalPages } = await getTasks(page);
      setTasks(tasks);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("タスクの取得に失敗しました");
    }
  }, []);

  const fetchTaskSummary = useCallback(async () => {
    try {
      const summary = await getTaskSummary();
      setTotalTasks(summary.total_tasks);
      setCompletedTasks(summary.completed_tasks);
    } catch (error) {
      console.error("Error fetching task summary:", error);
      setError("タスクサマリーの取得に失敗しました");
    }
  }, []);

  useEffect(() => {
    fetchTasks(currentPage);
    fetchTaskSummary();
  }, [currentPage, fetchTasks, fetchTaskSummary]);

  const handleAddTask = () => {
    setTaskToEdit(null);
    setFormModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setFormModalOpen(true);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      if (taskToEdit) {
        await updateTask(task, taskToEdit.id);
      } else {
        await createTask(task);
      }
      await fetchTasks(currentPage);
      await fetchTaskSummary();
      setFormModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
      setError("タスクの保存に失敗しました");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      await fetchTasks(currentPage);
      await fetchTaskSummary();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("タスクの削除に失敗しました");
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        TODOアプリ
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TaskSummary totalTasks={totalTasks} completedTasks={completedTasks} />
      <Box
        sx={{
          textAlign: "right",
          marginBottom: 2,
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          新規タスク登録
        </Button>
      </Box>
      <TaskList
        tasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onViewTask={handleViewTask}
      />
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage - 1)}
          sx={{ marginRight: 1 }}
          disabled={currentPage === 1}
        >
          前
        </Button>
        <Typography variant="body1" sx={{ display: "inline", marginX: 2 }}>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次
        </Button>
      </Box>
      <TaskFormModal
        open={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        taskToEdit={taskToEdit}
        onSave={handleSaveTask}
      />
      {selectedTask && (
        <TaskDetailModal
          open={isDetailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          task={selectedTask}
        />
      )}
    </Box>
  );
};

export default Home;
