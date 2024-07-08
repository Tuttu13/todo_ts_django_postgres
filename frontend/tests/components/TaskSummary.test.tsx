import { render, screen } from "@testing-library/react";
import TaskSummary from "../../src/components/TaskSummary";

describe("TaskSummary コンポーネント テスト", () => {
  test("タスク件数と完了タスクの表示を確認", () => {
    render(<TaskSummary totalTasks={10} completedTasks={5} />);

    expect(screen.getByText("タスク件数: 10")).toBeInTheDocument();
    expect(screen.getByText("完了タスク: 5")).toBeInTheDocument();
  });
});
