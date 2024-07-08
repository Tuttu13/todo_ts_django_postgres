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
  const tasks: Task[] = [
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
      id: 4,
      title: "買物",
      description: "コーヒー豆",
      status: 0,
      priority: 1,
      due_date: "2024-07-10T00:00:00+09:00",
      created_at: "2024-07-07T07:18:31.735907+09:00",
      updated_at: "2024-07-07T07:18:31.735914+09:00",
    },
  ];

  beforeEach(() => {
    mock.onGet("http://127.0.0.1:8000/api/todo/?page=1").reply(200, {
      links: {
        next: "http://127.0.0.1:8000/api/todo/?page=2",
        previous: null,
      },
      count: 14,
      page_size: 3,
      results: tasks,
    });
    mock.onGet("http://127.0.0.1:8000/api/todo/summary/").reply(200, {
      total_tasks: 10,
      completed_tasks: 5,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mock.reset();
  });

  it("should fetch tasks", async () => {
    const result = await getTasks(1);

    expect(result.tasks).toEqual(tasks);
    expect(result.totalPages).toBe(5);
  });

  it("should create a task", async () => {
    const newTask: Task = {
      id: 3,
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

  it("should update a task", async () => {
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

  it("should delete a task", async () => {
    mock.onDelete("http://127.0.0.1:8000/api/todo/1/").reply(204);

    await deleteTask(1);

    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(
      "http://127.0.0.1:8000/api/todo/1/"
    );
  });

  it("should fetch task summary", async () => {
    const result = await getTaskSummary();

    expect(result).toEqual({ total_tasks: 10, completed_tasks: 5 });
  });
});
