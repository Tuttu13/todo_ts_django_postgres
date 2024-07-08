import { fireEvent, render, screen } from "@testing-library/react";
import TaskItem from "../../src/components/TaskItem";
import { Task } from "../../src/types/Task";

const task: Task = {
  id: 1,
  title: "Test Task 1",
  description: "Description 1",
  status: 0,
  priority: 1,
  due_date: "2023-07-01T09:00:00+09:00",
  created_at: "2023-06-01T09:00:00+09:00",
  updated_at: "2023-06-01T09:00:00+09:00",
};

describe("TaskItem コンポーネント テスト", () => {
  test("対象タスクの表示を確認", () => {
    render(
      <TaskItem
        task={task}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onView={jest.fn()}
      />
    );

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText(/ステータス: 未実施/)).toBeInTheDocument();
    expect(screen.getByText(/優先度: 中/)).toBeInTheDocument();
    expect(screen.getByText(/期限: 2023年7月1日 09:00/)).toBeInTheDocument();
  });

  test("onEdit関数が呼び出されることの確認", () => {
    const onEdit = jest.fn();
    render(
      <TaskItem
        task={task}
        onEdit={onEdit}
        onDelete={jest.fn()}
        onView={jest.fn()}
      />
    );

    const editButton = screen.getByLabelText(`edit task ${task.id}`);
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  test("onDelete関数が呼び出されることの確認", () => {
    const onDelete = jest.fn();
    render(
      <TaskItem
        task={task}
        onEdit={jest.fn()}
        onDelete={onDelete}
        onView={jest.fn()}
      />
    );

    const deleteButton = screen.getByLabelText(`delete task ${task.id}`);
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(task.id);
  });

  test("onView関数が呼び出されることの確認", () => {
    const onView = jest.fn();
    render(
      <TaskItem
        task={task}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onView={onView}
      />
    );

    const taskItems = screen.getAllByRole("button");
    const taskItem = taskItems.find((item) => item.nodeName === "LI");
    if (taskItem) {
      fireEvent.click(taskItem);
    }

    expect(onView).toHaveBeenCalledWith(task);
  });
});
