import { fireEvent, render, screen } from "@testing-library/react";
import TaskList from "../../src/components/TaskList";
import { Task } from "../../src/types/Task";

const tasks: Task[] = [
  {
    id: 1,
    title: "Test Task 1",
    description: "Description 1",
    status: 0,
    priority: 1,
    due_date: "2023-07-01T09:00:00+09:00",
    created_at: "2023-06-01T09:00:00+09:00",
    updated_at: "2023-06-01T09:00:00+09:00",
  },
  {
    id: 2,
    title: "Test Task 2",
    description: "Description 2",
    status: 1,
    priority: 2,
    due_date: "2023-07-02T09:00:00+09:00",
    created_at: "2023-06-02T09:00:00+09:00",
    updated_at: "2023-06-02T09:00:00+09:00",
  },
];

describe("TaskList コンポーネント テスト", () => {
  test("タスクリストが正しく表示されていることの確認", () => {
    render(
      <TaskList
        tasks={tasks}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onViewTask={jest.fn()}
      />
    );

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  test("編集ボタンがクリックされたときの動作確認", () => {
    const onEditTask = jest.fn();
    render(
      <TaskList
        tasks={tasks}
        onEditTask={onEditTask}
        onDeleteTask={jest.fn()}
        onViewTask={jest.fn()}
      />
    );

    const editButtons = screen.getAllByLabelText(/edit task/i);
    fireEvent.click(editButtons[0]);

    expect(onEditTask).toHaveBeenCalledWith(tasks[0]);
  });

  test("削除ボタンがクリックされたときの動作確認", () => {
    const onDeleteTask = jest.fn();
    render(
      <TaskList
        tasks={tasks}
        onEditTask={jest.fn()}
        onDeleteTask={onDeleteTask}
        onViewTask={jest.fn()}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/delete task/i);
    fireEvent.click(deleteButtons[0]);

    expect(onDeleteTask).toHaveBeenCalledWith(tasks[0].id);
  });

  test("タスクがクリックされたときに選択したタスクが表示されることの確認", () => {
    const onViewTask = jest.fn();
    render(
      <TaskList
        tasks={tasks}
        onEditTask={jest.fn()}
        onDeleteTask={jest.fn()}
        onViewTask={onViewTask}
      />
    );

    const taskItems = screen.getAllByRole("button");
    fireEvent.click(taskItems[0]);

    expect(onViewTask).toHaveBeenCalledWith(tasks[0]);
  });
});
