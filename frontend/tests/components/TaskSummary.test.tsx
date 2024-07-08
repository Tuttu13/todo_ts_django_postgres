import { render, screen } from "@testing-library/react";
import TaskSummary from "../../src/components/TaskSummary";

// テストケースを定義
describe("TaskSummary コンポーネント テスト", () => {
  test("タスク件数と完了タスクの表示を確認", () => {
    // モックデータを使用してコンポーネントをレンダリング
    render(<TaskSummary totalTasks={10} completedTasks={5} />);

    // 総タスク数が正しく表示されていることを確認
    expect(screen.getByText("タスク件数: 10")).toBeInTheDocument();
    // 完了タスク数が正しく表示されていることを確認
    expect(screen.getByText("完了タスク: 5")).toBeInTheDocument();
  });
});
