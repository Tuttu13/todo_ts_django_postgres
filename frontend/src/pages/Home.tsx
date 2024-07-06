import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TaskDetailModal from "../components/TaskDetailModal";
import TaskFormModal from "../components/TaskFormModal";
import TaskList from "../components/TaskList";
import TaskSummary from "../components/TaskSummary";
import { createTask, deleteTask, getTasks, updateTask } from "../services/api";
import { Task } from "../types/Task";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { tasks, totalPages } = await getTasks(currentPage);
        setTasks(tasks);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [currentPage]);

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
      const { tasks, totalPages } = await getTasks(currentPage);
      setTasks(tasks);
      setTotalPages(totalPages);
      setFormModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      const { tasks, totalPages } = await getTasks(currentPage);
      setTasks(tasks);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        TODOアプリ
      </Typography>
      <TaskSummary />
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
          onClick={() => handlePageChange("prev")}
          sx={{ marginRight: 1 }}
          disabled={currentPage === 1}
        >
          前
        </Button>
        <Button
          variant="outlined"
          onClick={() => handlePageChange("next")}
          sx={{ marginLeft: 1 }}
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
