import { Task } from "./components/tasks/TaskSection";

export const getTaskLists = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taskLists`);
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
