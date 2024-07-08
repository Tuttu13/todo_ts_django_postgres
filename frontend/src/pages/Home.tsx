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
  const [tasks, setTasks] = useState<Task[]>([]); // タスクのリストを保持
  const [isFormModalOpen, setFormModalOpen] = useState<boolean>(false); // フォームモーダルの開閉状態を保持
  const [isDetailModalOpen, setDetailModalOpen] = useState<boolean>(false); // 詳細モーダルの開閉状態を保持
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null); // 編集対象のタスクを保持
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // 選択されたタスクを保持
  const [currentPage, setCurrentPage] = useState<number>(1); // 現在のページ番号を保持
  const [totalPages, setTotalPages] = useState<number>(1); // 全ページ数を保持
  const [totalTasks, setTotalTasks] = useState<number>(0); // 全タスク数を保持
  const [completedTasks, setCompletedTasks] = useState<number>(0); // 完了タスク数を保持
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持

  // タスクを取得する関数
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

  // タスクサマリーを取得する関数
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

  // 初回レンダリング時とcurrentPageが変更されるたびにタスクとサマリーを取得
  useEffect(() => {
    fetchTasks(currentPage);
    fetchTaskSummary();
  }, [currentPage, fetchTasks, fetchTaskSummary]);

  // 新規タスク追加ボタンがクリックされたときの処理
  const handleAddTask = () => {
    setTaskToEdit(null); // 編集対象のタスクをリセット
    setFormModalOpen(true); // フォームモーダルを開く
  };

  // タスク編集ボタンがクリックされたときの処理
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task); // 編集対象のタスクを設定
    setFormModalOpen(true); // フォームモーダルを開く
  };

  // タスク保存時の処理
  const handleSaveTask = async (task: Task) => {
    try {
      if (taskToEdit) {
        await updateTask(task, taskToEdit.id); // タスクを更新
      } else {
        await createTask(task); // 新規タスクを作成
      }
      await fetchTasks(currentPage); // タスクリストを再取得
      await fetchTaskSummary(); // タスクサマリーを再取得
      setFormModalOpen(false); // フォームモーダルを閉じる
    } catch (error) {
      console.error("Error saving task:", error);
      setError("タスクの保存に失敗しました");
    }
  };

  // タスク削除時の処理
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId); // タスクを削除
      await fetchTasks(currentPage); // タスクリストを再取得
      await fetchTaskSummary(); // タスクサマリーを再取得
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("タスクの削除に失敗しました");
    }
  };

  // タスク詳細表示時の処理
  const handleViewTask = (task: Task) => {
    setSelectedTask(task); // 選択されたタスクを設定
    setDetailModalOpen(true); // 詳細モーダルを開く
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 現在のページを設定
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
          {totalTasks === 0 ? 0 : currentPage} / {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalTasks === 0}
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
