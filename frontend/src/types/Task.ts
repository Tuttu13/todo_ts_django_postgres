export interface Task {
  id: number;
  title: string;
  description: string;
  status: number;
  priority: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
