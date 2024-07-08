import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../../src/pages/Home";
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskSummary,
  updateTask, // updateTaskのインポートを追加
} from "../../src/services/api";
import { Task } from "../../src/types/Task";

jest.mock("../../src/services/api");

const mockTasks: Task[] = [
  {
    id: 1,
    title: "飲み会",
    description: "友達との飲み会",
    status: 1,
    priority: 1,
    due_date: "2024-07-10T00:00:00Z",
    created_at: "2024-07-07T07:18:31.735907+09:00",
    updated_at: "2024-07-07T07:18:31.735914+09:00",
  },
  {
    id: 2,
    title: "買い物",
    description: "スーパーで買い物",
    status: 0,
    priority: 2,
    due_date: "2024-07-08T00:00:00Z",
    created_at: "2024-07-07T07:18:31.735907+09:00",
    updated_at: "2024-07-07T07:18:31.735914+09:00",
  },
];

const mockSummary = {
  total_tasks: 2,
  completed_tasks: 1,
};

describe("Home component", () => {
  beforeEach(() => {
    (getTasks as jest.Mock).mockResolvedValue({
      tasks: mockTasks,
      totalPages: 1,
    });
    (getTaskSummary as jest.Mock).mockResolvedValue(mockSummary);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Home component with tasks", async () => {
    render(<Home />);

    expect(screen.getByText("TODOアプリ")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("飲み会")).toBeInTheDocument();
      expect(screen.getByText("買い物")).toBeInTheDocument();
    });
  });

  test("opens the task form modal when '新規タスク登録' button is clicked", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("新規タスク登録"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("handles task addition", async () => {
    render(<Home />);

    fireEvent.click(screen.getByText("新規タスク登録"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/題名/i), {
      target: { value: "新しいタスク" },
    });
    fireEvent.change(screen.getByLabelText(/詳細/i), {
      target: { value: "新しいタスクの説明" },
    });
    fireEvent.click(screen.getByText("保存"));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledTimes(1);
    });
  });

  test("handles task deletion", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("飲み会")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("delete task 1"));

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledTimes(1);
    });
  });

  test("displays error message when API call fails", async () => {
    (getTasks as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    (getTaskSummary as jest.Mock).mockResolvedValue(mockSummary);

    render(<Home />);

    // Mock console.error to capture error messages
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error fetching tasks:",
        expect.any(Error)
      );
    });

    // Restore console.error
    consoleErrorMock.mockRestore();
  });

  test("updates task status correctly", async () => {
    const updatedTask = { ...mockTasks[0], status: 2 };
    (updateTask as jest.Mock).mockResolvedValue(updatedTask);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("飲み会")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("edit task 1"));

    fireEvent.change(screen.getByLabelText(/ステータス/i), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByText("保存"));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledTimes(1);
      expect(screen.getByText("ステータス: 実施中")).toBeInTheDocument();
    });
  });
});

export default Home;
