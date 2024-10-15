import { Task, TaskList } from "./components/tasks/TaskSection";
import { Project } from "./pages/Projects";

export const createProject = async (project: Project) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (response.status !== 201) {
    throw new Error("Failed to create project");
  }
  const data = await response.json();
  return data;
};

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

export const getProjectById = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/projects/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  const data = await response.json();
  return data;
};

export const getTaskListsByProjectId = async (id: string) => {
  const [projectsData, taskListsData] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
      credentials: "include",
    }),
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}/taskLists`, {
      credentials: "include",
    }),
  ]);
  if (!projectsData.ok || !taskListsData.ok) {
    throw new Error("Failed to fetch data");
  }
  const [project, taskLists] = await Promise.all([
    projectsData.json(),
    taskListsData.json(),
  ]);
  return { project, taskLists };
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

export const getTaskById = async (
  projectId: string,
  taskListId: string,
  id: string
) => {
  const [projectsData, taskListsData, tasksData, labelsData] =
    await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`),
      fetch(`${import.meta.env.VITE_API_URL}/api/taskLists/${taskListId}`),
      fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`),
      fetch(`${import.meta.env.VITE_API_URL}/api/labels`),
    ]);
  if (
    !projectsData.ok ||
    !taskListsData.ok ||
    !tasksData.ok ||
    !labelsData.ok
  ) {
    throw new Error("Failed to fetch data");
  }
  const [project, taskList, task, labels] = await Promise.all([
    projectsData.json(),
    taskListsData.json(),
    tasksData.json(),
    labelsData.json(),
  ]);
  return { project, taskList, task, labels };
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

export const createTaskList = async (id: string, taskList: TaskList) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/projects/${id}/taskLists`,
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

export const updateTaskPriority = async (id: string, priority: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
    {
      method: "put",
      headers: { "Content-TYpe": "application/json" },
      body: JSON.stringify({ priority }),
    }
  );
  if (response.status !== 204) {
    throw new Error("Failed to update task");
  }
  return null;
};

export const createLabel = async (label: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/labels`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create label");
  }
  return null;
};

export const updateLabel = async (id: string, label: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${id}/label`,
    {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    }
  );
  if (response.status !== 204) {
    throw new Error("Failed to update label");
  }
  return null;
};
