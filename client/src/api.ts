import { Task, TaskList } from "./components/tasks/TaskSection";

export const getProjects = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data;
};

export const getTaskLists = async (projectId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/taskLists`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasklists");
  }
  const data = await response.json();
  return data;
};

export const getTaskById = async (taskListId: string, id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/taskLists/${taskListId}/tasks/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }
  const data = await response.json();
  return data as Task;
};

export const createTask = async (taskListId: string, task: Task) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/taskLists/${taskListId}/tasks`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(task),
    }
  );
  if (response.status !== 201) {
    throw new Error("Failed to add task");
  }
  const data = await response.json();
  return data;
};

export const createTaskList = async (taskList: TaskList) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/taskLists`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(taskList),
    }
  );
  if (response.status !== 201) {
    throw new Error("Failed to create list");
  }
  const data = await response.json();
  return data;
};
