// tests/utils.test.ts

import {
  formatDate,
  formatDateToLocal,
  priorityMap,
  statusMap,
} from "../src/utils";

describe("ユーティリティ関数 テスト", () => {
  test("ステータスのマッピングオブジェクトの確認", () => {
    expect(statusMap[0]).toBe("未実施");
    expect(statusMap[1]).toBe("実施中");
    expect(statusMap[2]).toBe("完了");
  });

  test("優先度のマッピングオブジェクトの確認", () => {
    expect(priorityMap[0]).toBe("低");
    expect(priorityMap[1]).toBe("中");
    expect(priorityMap[2]).toBe("高");
  });

  test("日付を特定のフォーマットに変換する関数の確認", () => {
    const date = "2023-07-01T00:00:00Z";
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("2023年7月1日 09:00");
  });

  test("UTCの日付を日本時間に変換してフォーマットする関数の確認", () => {
    const date = "2023-07-01T00:00:00Z";
    const localDate = formatDateToLocal(date);
    expect(localDate).toBe("2023-07-01T09:00");
  });
});
