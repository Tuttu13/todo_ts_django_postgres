import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  createTask,
  deleteTask,
  getTasks,
  getTaskSummary,
  updateTask,
} from "../../src/services/api";
import { Task } from "../../src/types/Task";

const mock = new MockAdapter(axios);

describe("API calls", () => {
  const tasksPage1: Task[] = [
    {
      id: 1,
      title: "飲み会",
      description: "test",
      status: 2,
      priority: 1,
      due_date: "2024-07-07T10:13:00+09:00",
      created_at: "2024-07-07T07:14:02.902191+09:00",
      updated_at: "2024-07-08T10:03:35.559612+09:00",
    },
    {
      id: 2,
      title: "課題",
      description: "課題",
      status: 1,
      priority: 2,
      due_date: "2024-07-09T23:59:00+09:00",
      created_at: "2024-07-07T07:14:59.122454+09:00",
      updated_at: "2024-07-07T07:14:59.122462+09:00",
    },
    {
      id: 3,
      title: "買物",
      description: "コーヒー豆",
      status: 0,
      priority: 1,
      due_date: "2024-07-10T00:00:00+09:00",
      created_at: "2024-07-07T07:18:31.735907+09:00",
      updated_at: "2024-07-07T07:18:31.735914+09:00",
    },
  ];

  const tasksPage2: Task[] = [
    {
      id: 4,
      title: "ジム",
      description: "筋トレ",
      status: 0,
      priority: 2,
      due_date: "2024-07-11T07:00:00+09:00",
      created_at: "2024-07-08T07:14:02.902191+09:00",
      updated_at: "2024-07-08T07:14:02.902191+09:00",
    },
    {
      id: 5,
      title: "読書",
      description: "本を読む",
      status: 1,
      priority: 1,
      due_date: "2024-07-12T20:00:00+09:00",
      created_at: "2024-07-08T07:14:02.902191+09:00",
      updated_at: "2024-07-08T07:14:02.902191+09:00",
    },
    {
      id: 6,
      title: "プレゼン準備",
      description: "スライドを作成",
      status: 2,
      priority: 3,
      due_date: "2024-07-13T09:00:00+09:00",
      created_at: "2024-07-08T07:14:02.902191+09:00",
      updated_at: "2024-07-08T07:14:02.902191+09:00",
    },
  ];

  beforeEach(() => {
    mock.onGet("http://127.0.0.1:8000/api/todo/?page=1").reply(200, {
      links: {
        next: "http://127.0.0.1:8000/api/todo/?page=2",
        previous: null,
      },
      count: 6,
      page_size: 3,
      results: tasksPage1,
    });

    mock.onGet("http://127.0.0.1:8000/api/todo/?page=2").reply(200, {
      links: {
        next: null,
        previous: "http://127.0.0.1:8000/api/todo/?page=1",
      },
      count: 6,
      page_size: 3,
      results: tasksPage2,
    });

    mock.onGet("http://127.0.0.1:8000/api/todo/summary/").reply(200, {
      total_tasks: 6,
      completed_tasks: 2,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  test("タスクの取得", async () => {
    const result = await getTasks(1);

    expect(result.tasks).toEqual(tasksPage1);
    expect(result.totalPages).toBe(2);
  });

  test("タスクの作成", async () => {
    const newTask: Task = {
      id: 7,
      title: "新しいタスク",
      description: "新しいタスクの説明",
      status: 0,
      priority: 2,
      due_date: "2024-07-11T00:00:00+09:00",
      created_at: "2024-07-08T07:14:02.902191+09:00",
      updated_at: "2024-07-08T07:14:02.902191+09:00",
    };
    mock.onPost("http://127.0.0.1:8000/api/todo/").reply(201, newTask);

    const result = await createTask(newTask);

    expect(result).toEqual(newTask);
  });

  test("タスクの更新", async () => {
    const updatedTask: Task = {
      id: 1,
      title: "更新されたタスク",
      description: "更新されたタスクの説明",
      status: 1,
      priority: 1,
      due_date: "2024-07-12T00:00:00+09:00",
      created_at: "2024-07-07T07:14:02.902191+09:00",
      updated_at: "2024-07-08T07:14:02.902191+09:00",
    };
    mock.onPut("http://127.0.0.1:8000/api/todo/1/").reply(200, updatedTask);

    const result = await updateTask(updatedTask, 1);

    expect(result).toEqual(updatedTask);
  });

  test("タスクの削除", async () => {
    mock.onDelete("http://127.0.0.1:8000/api/todo/1/").reply(204);

    await deleteTask(1);

    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(
      "http://127.0.0.1:8000/api/todo/1/"
    );
  });

  test("タスクサマリーの取得", async () => {
    const result = await getTaskSummary();

    expect(result).toEqual({ total_tasks: 6, completed_tasks: 2 });
  });
});
