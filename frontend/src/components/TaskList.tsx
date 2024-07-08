import { Box, List } from "@mui/material";
import React from "react";
import { Task } from "../types/Task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onViewTask: (task: Task) => void;
}

const styles = {
  container: {
    marginTop: 2,
  },
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onViewTask,
}) => {
  return (
    <Box sx={styles.container}>
      <List>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onView={onViewTask}
          />
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
