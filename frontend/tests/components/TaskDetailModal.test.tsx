import { fireEvent, render, screen } from "@testing-library/react";
import TaskDetailModal from "../../src/components/TaskDetailModal";
import { Task } from "../../src/types/Task";

const task: Task = {
  id: 1,
  title: "Test Task",
  description: "This is a test task.",
  status: 0,
  priority: 1,
  due_date: "2023-07-01T00:00:00Z",
  created_at: "2023-06-01T00:00:00Z",
  updated_at: "2023-06-01T00:00:00Z",
};

describe("TaskDetailModal コンポーネント テスト", () => {
  test("todo詳細モーダルが表示されることの確認", () => {
    render(<TaskDetailModal open={true} onClose={jest.fn()} task={task} />);

    expect(screen.getByText("タスク詳細")).toBeInTheDocument();
    expect(screen.getByText("タイトル:")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("詳細:")).toBeInTheDocument();
    expect(screen.getByText("This is a test task.")).toBeInTheDocument();
    expect(screen.getByText("ステータス:")).toBeInTheDocument();
    expect(screen.getByText("未実施")).toBeInTheDocument();
    expect(screen.getByText("優先度:")).toBeInTheDocument();
    expect(screen.getByText("中")).toBeInTheDocument();
    expect(screen.getByText("期限:")).toBeInTheDocument();
    expect(screen.getByText("2023年7月1日 09:00")).toBeInTheDocument();
  });

  test("todo詳細モーダルが閉じることの確認", () => {
    const onClose = jest.fn();
    render(<TaskDetailModal open={true} onClose={onClose} task={task} />);

    fireEvent.click(document.querySelector(".MuiBackdrop-root")!);

    expect(onClose).toHaveBeenCalled();
  });
});
