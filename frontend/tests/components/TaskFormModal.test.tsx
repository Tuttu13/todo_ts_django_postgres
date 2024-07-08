import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TaskFormModal from "../../src/components/TaskFormModal";
import { Task } from "../../src/types/Task";

// テスト用のモックタスクデータ
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

// 日付フォーマットの関数（実際のユーティリティ関数に一致するように調整）
const formatDateToLocal = (date: string): string => {
  const dt = new Date(date);
  dt.setHours(dt.getHours() + 9); // 日本時間に変換
  return dt.toISOString().slice(0, 16);
};

describe("TaskFormModal コンポーネント テスト", () => {
  test("新規登録モーダルの初期表示の確認", () => {
    render(
      <TaskFormModal
        open={true}
        onClose={jest.fn()}
        taskToEdit={task}
        onSave={jest.fn()}
      />
    );

    // タイトルの確認
    expect(screen.getByText("タスクを編集")).toBeInTheDocument();

    // 各フォームフィールドの値を確認
    expect(screen.getByRole("textbox", { name: "題名" })).toHaveValue(
      task.title
    );
    expect(screen.getByRole("textbox", { name: "詳細" })).toHaveValue(
      task.description
    );
    expect(screen.getByRole("combobox", { name: "ステータス" })).toHaveValue(
      task.status.toString()
    );
    expect(screen.getByRole("combobox", { name: "優先度" })).toHaveValue(
      task.priority.toString()
    );

    const formattedDate = task.due_date ? formatDateToLocal(task.due_date) : "";
    expect(screen.getByLabelText("期限")).toHaveValue(formattedDate);
  });

  test("新規登録モーダルのキャンセルボタンを押したときの確認", () => {
    const onClose = jest.fn();
    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        taskToEdit={task}
        onSave={jest.fn()}
      />
    );

    // キャンセルボタンをクリック
    fireEvent.click(screen.getByText("キャンセル"));

    // onCloseが呼び出されたことを確認
    expect(onClose).toHaveBeenCalled();
  });

  test("新規登録モーダルの保存ボタンを押したときの確認", async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(
      <TaskFormModal
        open={true}
        onClose={onClose}
        taskToEdit={task}
        onSave={onSave}
      />
    );

    // 題名を変更
    fireEvent.change(screen.getByRole("textbox", { name: "題名" }), {
      target: { value: "Updated Task" },
    });

    // 保存ボタンをクリック
    fireEvent.click(screen.getByText("保存"));

    // onSaveが呼び出されたことを確認
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        ...task,
        title: "Updated Task",
        due_date: task.due_date ? formatDateToLocal(task.due_date) : null,
      });
    });

    // onCloseが呼び出されたことを確認
    expect(onClose).toHaveBeenCalled();
  });

  test("新規登録モーダルの題名項目と詳細項目が未入力の場合の確認", async () => {
    render(
      <TaskFormModal
        open={true}
        onClose={jest.fn()}
        taskToEdit={null}
        onSave={jest.fn()}
      />
    );

    // 題名と詳細を空にする
    fireEvent.change(screen.getByRole("textbox", { name: "題名" }), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "詳細" }), {
      target: { value: "" },
    });

    // 保存ボタンをクリック
    fireEvent.click(screen.getByText("保存"));

    // バリデーションエラーメッセージが表示されることを確認
    expect(screen.getByText("題名は必須です。")).toBeInTheDocument();
    expect(screen.getByText("詳細は必須です。")).toBeInTheDocument();
  });
});
