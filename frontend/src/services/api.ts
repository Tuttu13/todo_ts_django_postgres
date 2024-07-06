// services/api.ts
import axios from "axios";
import { Task } from "../types/Task";

const API_BASE_URL = "http://127.0.0.1:8000/api/todo/";

export const getTasks = async (
  page: number = 1
): Promise<{ tasks: Task[]; totalPages: number }> => {
  const response = await axios.get(`${API_BASE_URL}?page=${page}`);
  const pageSize = response.data.page_size || response.data.results.length;
  const totalPages = Math.ceil(response.data.count / pageSize);

  return { tasks: response.data.results, totalPages };
};

export const createTask = async (task: Task): Promise<Task> => {
  const response = await axios.post(API_BASE_URL, task);
  return response.data;
};

export const updateTask = async (task: Task, taskId: number): Promise<Task> => {
  const response = await axios.put(`${API_BASE_URL}${taskId}/`, task);
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}${taskId}/`);
};

export const getTaskSummary = async (): Promise<{
  total_tasks: number;
  completed_tasks: number;
}> => {
  const response = await axios.get(`${API_BASE_URL}summary/`);
  return response.data;
};
