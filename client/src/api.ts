import { Task, TaskList } from "./components/dashboard/tasks/TaskSection";
import { Project } from "./pages/Projects";

export const authUser = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/verify-auth`,
    {
      method: "post",
      headers: { "Cotent-Type": "application/json" },
      credentials: "include",
    }
  );
  return response.ok;
};

export const getUser = async (userId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
      {
        method: "GET",
        credentials: "include", // Pour envoyer les cookies HttpOnly
      }
    );
    if (!response.ok) throw new Error("Failed to fetch user data");

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const createProject = async (id: string, project: Project) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}/projects`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    }
  );
  if (response.status !== 201) {
    throw new Error("Failed to create project");
  }
  const data = await response.json();
  return data;
};

export const getProjects = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}/projects`,
    {
      credentials: "include",
    }
  );
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

export const getTasks = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}/tasks`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data;
};

export const getTaskById = async (
  projectId: string,
  taskListId: string,
  id: string
) => {
  const [projectData, taskListData, taskData, taskListsData, labelsData] =
    await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`),
      fetch(`${import.meta.env.VITE_API_URL}/api/taskLists/${taskListId}`),
      fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/taskLists`
      ),
      fetch(`${import.meta.env.VITE_API_URL}/api/labels`),
    ]);
  if (
    !projectData.ok ||
    !taskListData.ok ||
    !taskData.ok ||
    !taskListsData.ok ||
    !labelsData.ok
  ) {
    throw new Error("Failed to fetch data");
  }
  const [project, taskList, task, taskLists, labels] = await Promise.all([
    projectData.json(),
    taskListData.json(),
    taskData.json(),
    taskListsData.json(),
    labelsData.json(),
  ]);
  return { project, taskList, task, taskLists, labels };
};

export const createTask = async (
  userId: string,
  taskListId: string,
  task: Task
) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/users/${userId}/taskLists/${taskListId}/tasks`,
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
    `${import.meta.env.VITE_API_URL}/api/tasks/${id}/priority`,
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

export const updateTaskTaskListFnc = async (id: string, taskListId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${id}/taskLists/${taskListId}`,
    {
      method: "put",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (response.status !== 204) {
    throw new Error("Failed to update task task list");
  }
  return null;
};
